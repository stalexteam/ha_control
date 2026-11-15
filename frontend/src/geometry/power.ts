import type { Device, Id, Pt } from '../model/types';
import {
  blockPorts, type PortDir, type PortName, type PortPin, type PortSide, type Position, type PowerBlock,
  type PowerSchema, type PowerWire, type WireEnd,
} from '../model/power';
import { dist, distToSegment } from './vec';

/** Schematic units: 1 unit = 1 screen px at 100 % zoom. */
export const PORT_R = 11;
export const LINE_H = 18;
export const HEAD_H = 24;
export const MIN_W = 120;
export const STUB = 14;
export const GRID = 10;

const CHIP_W = 24;
const CHIP_GAP = 6;
/** Route cost of one bend, in units of length: a bend is worth a short detour. */
const BEND = STUB;
/** Route cost of running through a block: any clear route beats it. */
const THROUGH = 1e6;

export interface Rect { x: number; y: number; w: number; h: number }
export interface GeoCtx { device(id: Id): Device | undefined }
export interface PortPlace { name: PortName; dir: PortDir; side: PortSide; pt: Pt; pinned: boolean }
/** A wire end: its point, the side it leaves by and, when known, the block or bus it sits on (routes keep out of it). */
export interface EndPlace { pt: Pt; side: PortSide; rect?: Rect }
export type PowerHit =
  | { kind: 'chip'; block: Id; position: Position }
  | { kind: 'port'; block: Id; port: PortName }
  | { kind: 'bus-end'; id: Id; end: 'start' | 'end' }
  | { kind: 'bus'; id: Id; at: number }
  | { kind: 'wire'; id: Id }
  | { kind: 'block'; id: Id };

type Bus = PowerBlock & { kind: 'bus' };
type Transfer = PowerBlock & { kind: 'transfer' };

const NORMAL: Record<PortSide, Pt> = {
  top: { x: 0, y: -1 }, right: { x: 1, y: 0 }, bottom: { x: 0, y: 1 }, left: { x: -1, y: 0 },
};

const centre = (r: Rect): Pt => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const inRect = (p: Pt, r: Rect, pad: number): boolean =>
  p.x >= r.x - pad && p.x <= r.x + r.w + pad && p.y >= r.y - pad && p.y <= r.y + r.h + pad;
const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** The name a block shows: a device block's is its plan device's name ('' when the device is gone). */
export function blockName(b: PowerBlock, g: GeoCtx): string {
  return b.kind === 'device' ? (g.device(b.deviceId)?.name ?? '') : (b.name ?? '');
}

/**
 * Value lines under the name, from the configuration only (never live values, so blocks do not jump):
 * grid: power, voltage when set; device: power when bound, switch when the control is bound, loss for an inverter,
 * a single "missing" line when its device is gone; meter: power, voltage when set, switch when set;
 * battery: SOC and power; pv: power; transfer: the A/0/B chips; remainder: power; bus: none.
 */
export function blockLines(b: PowerBlock, g: GeoCtx): number {
  const count = (...on: unknown[]) => on.filter(Boolean).length;
  switch (b.kind) {
    case 'grid': return 1 + count(b.voltage);
    case 'device': {
      const d = g.device(b.deviceId);
      return d ? count(d.bindings?.power, d.bindings?.control, b.inverter) : 1;
    }
    case 'meter': return 1 + count(b.voltage, b.switch?.entity);
    case 'battery': return 2;
    case 'bus': return 0;
    default: return 1;
  }
}

/** Top-left at (x, y); a bus has its own size, other blocks fit their name and value lines. */
export function blockRect(b: PowerBlock, g: GeoCtx): Rect {
  if (b.kind === 'bus') return { x: b.x, y: b.y, w: b.w, h: b.h };
  return {
    x: b.x, y: b.y,
    w: Math.max(MIN_W, 7 * blockName(b, g).length + 32),
    h: HEAD_H + LINE_H * blockLines(b, g) + 8,
  };
}

/** The point at fraction `at` along a side: top and bottom run left to right, left and right top to bottom. */
function sidePoint(r: Rect, side: PortSide, at: number): Pt {
  switch (side) {
    case 'top': return { x: r.x + at * r.w, y: r.y };
    case 'bottom': return { x: r.x + at * r.w, y: r.y + r.h };
    case 'left': return { x: r.x, y: r.y + at * r.h };
    case 'right': return { x: r.x + r.w, y: r.y + at * r.h };
  }
}

/** The side of r facing p, by |dx|/(w/2) against |dy|/(h/2) (a tie goes to top or bottom); null at the centre. */
function facingSide(r: Rect, p: Pt): PortSide | null {
  const c = centre(r);
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  if (dx === 0 && dy === 0) return null;
  if (Math.abs(dx) / (r.w / 2) > Math.abs(dy) / (r.h / 2)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'bottom' : 'top';
}

/** The nearest point of r's outline, as a pin. */
export function pinAt(r: Rect, p: Pt): PortPin {
  const sides: { side: PortSide; a: Pt; b: Pt }[] = [
    { side: 'top', a: { x: r.x, y: r.y }, b: { x: r.x + r.w, y: r.y } },
    { side: 'right', a: { x: r.x + r.w, y: r.y }, b: { x: r.x + r.w, y: r.y + r.h } },
    { side: 'bottom', a: { x: r.x, y: r.y + r.h }, b: { x: r.x + r.w, y: r.y + r.h } },
    { side: 'left', a: { x: r.x, y: r.y }, b: { x: r.x, y: r.y + r.h } },
  ];
  let best = sides[0];
  let bestD = Infinity;
  for (const s of sides) {
    const d = distToSegment(p, s.a, s.b);
    if (d < bestD) { best = s; bestD = d; }
  }
  const horizontal = best.side === 'top' || best.side === 'bottom';
  const at = horizontal ? (r.w ? (p.x - r.x) / r.w : 0.5) : (r.h ? (p.y - r.y) / r.h : 0.5);
  return { side: best.side, at: clamp01(at) };
}

const isHorizontal = (bus: Bus): boolean => bus.w >= bus.h;

/** The point at `at` on the bus's long axis (its centre line). */
function busAxis(bus: Bus, at: number): Pt {
  return isHorizontal(bus)
    ? { x: bus.x + at * bus.w, y: bus.y + bus.h / 2 }
    : { x: bus.x + bus.w / 2, y: bus.y + at * bus.h };
}

/** Where a wire meets a bus: at `at` along the long axis, on the edge facing `toward` (a tie goes bottom or right). */
export function busAttach(bus: Bus, at: number, toward: Pt): { pt: Pt; side: PortSide } {
  const r = { x: bus.x, y: bus.y, w: bus.w, h: bus.h };
  const c = centre(r);
  const side: PortSide = isHorizontal(bus)
    ? (toward.y < c.y ? 'top' : 'bottom')
    : (toward.x < c.x ? 'left' : 'right');
  return { pt: sidePoint(r, side, at), side };
}

function defaultSide(b: PowerBlock, port: { name: PortName; dir: PortDir }): PortSide {
  if (b.kind === 'device' && b.inverter) {
    if (port.name === 'BAT') return 'right';
    if (port.name === 'PV') return 'top';
  }
  return port.dir === 'in' ? 'top' : 'bottom';
}

const blockById = (s: PowerSchema, id: Id): PowerBlock | undefined => s.blocks.find((x) => x.id === id);
const busById = (s: PowerSchema, id: Id): Bus | undefined => {
  const b = blockById(s, id);
  return b?.kind === 'bus' ? b : undefined;
};
const isPort = (e: WireEnd, block: Id, port: PortName): boolean => 'block' in e && e.block === block && e.port === port;

/** What a wired port looks at: the far block's centre or the bus axis point; null when the port is free. */
function farPoint(s: PowerSchema, block: Id, port: PortName, g: GeoCtx): Pt | null {
  const w = s.wires.find((x) => isPort(x.from, block, port) || isPort(x.to, block, port));
  if (!w) return null;
  const far = isPort(w.from, block, port) ? w.to : w.from;
  if ('bus' in far) {
    const bus = busById(s, far.bus);
    return bus ? busAxis(bus, far.at) : null;
  }
  const b = blockById(s, far.block);
  return b ? centre(blockRect(b, g)) : null;
}

/**
 * Ruling 7: a pinned port sits on its pin; a wired one on the side facing the far end; a free one on its default
 * side. Unpinned ports sharing a side are spaced at (i+1)/(n+1), ordered by their far end along that side (a free
 * port counts as the block centre), so wires do not cross. The result follows blockPorts order.
 */
export function portPlaces(s: PowerSchema, b: PowerBlock, g: GeoCtx): PortPlace[] {
  const r = blockRect(b, g);
  const c = centre(r);
  const ports = blockPorts(b);
  const placed: PortPlace[] = new Array(ports.length);
  const auto: { i: number; side: PortSide; key: number }[] = [];
  ports.forEach((p, i) => {
    const pin = b.portPins?.[p.name];
    if (pin) {
      placed[i] = { name: p.name, dir: p.dir, side: pin.side, pt: sidePoint(r, pin.side, pin.at), pinned: true };
      return;
    }
    const far = farPoint(s, b.id, p.name, g);
    const side = (far && facingSide(r, far)) ?? defaultSide(b, p);
    const look = far ?? c;
    auto.push({ i, side, key: side === 'top' || side === 'bottom' ? look.x : look.y });
  });
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    const group = auto.filter((u) => u.side === side).sort((u, v) => u.key - v.key || u.i - v.i);
    group.forEach((u, j) => {
      const p = ports[u.i];
      placed[u.i] = { name: p.name, dir: p.dir, side, pt: sidePoint(r, side, (j + 1) / (group.length + 1)), pinned: false };
    });
  }
  return placed;
}

/** Both ends of a wire (a = from, b = to), each with the rect it sits on; null when an end is missing. */
export function wireEnds(s: PowerSchema, w: PowerWire, g: GeoCtx): { a: EndPlace; b: EndPlace } | null {
  const portEnd = (e: WireEnd): EndPlace | null => {
    if (!('block' in e)) return null;
    const b = blockById(s, e.block);
    const p = b && portPlaces(s, b, g).find((x) => x.name === e.port);
    return b && p ? { pt: p.pt, side: p.side, rect: blockRect(b, g) } : null;
  };
  const busEnd = (e: WireEnd, other: WireEnd, otherPlace: EndPlace | null): EndPlace | null => {
    if (!('bus' in e)) return null;
    const bus = busById(s, e.bus);
    if (!bus) return null;
    let toward = otherPlace?.pt;
    if (!toward && 'bus' in other) {
      const ob = busById(s, other.bus);
      toward = ob && busAxis(ob, other.at);
    }
    return toward ? { ...busAttach(bus, e.at, toward), rect: blockRect(bus, g) } : null;
  };
  const from = portEnd(w.from);
  const to = portEnd(w.to);
  const a = from ?? busEnd(w.from, w.to, to);
  const b = to ?? busEnd(w.to, w.from, from);
  return a && b ? { a, b } : null;
}

/** Axis direction of p -> q as unit signs; both zero for a point. */
const heading = (p: Pt, q: Pt): Pt => ({ x: Math.sign(q.x - p.x), y: Math.sign(q.y - p.y) });
const span = (p: Pt, q: Pt): number => Math.abs(q.x - p.x) + Math.abs(q.y - p.y);

/**
 * Drops zero-length segments and merges straight runs; null when the path is not orthogonal, doubles back, has more
 * than 6 points, or does not leave along na and enter against nb for at least STUB each.
 */
function tidy(raw: Pt[], na: Pt, nb: Pt): Pt[] | null {
  const pts: Pt[] = [];
  for (const p of raw) {
    const last = pts[pts.length - 1];
    if (last && last.x === p.x && last.y === p.y) continue;
    if (last && last.x !== p.x && last.y !== p.y) return null;
    if (pts.length >= 2) {
      const d1 = heading(pts[pts.length - 2], last);
      const d2 = heading(last, p);
      if (d1.x === d2.x && d1.y === d2.y) { pts[pts.length - 1] = p; continue; }
      if (d1.x === -d2.x && d1.y === -d2.y) return null;
    }
    pts.push(p);
  }
  const n = pts.length;
  if (n < 2 || n > 6) return null;
  const first = heading(pts[0], pts[1]);
  const lastH = heading(pts[n - 2], pts[n - 1]);
  if (first.x !== na.x || first.y !== na.y || span(pts[0], pts[1]) < STUB - 1e-9) return null;
  if (lastH.x !== -nb.x || lastH.y !== -nb.y || span(pts[n - 2], pts[n - 1]) < STUB - 1e-9) return null;
  return pts;
}

/** True when the axis-aligned segment p-q runs through the interior of r (touching the outline does not count). */
function through(p: Pt, q: Pt, r: Rect): boolean {
  const e = 0.5;
  return Math.min(p.x, q.x) < r.x + r.w - e && Math.max(p.x, q.x) > r.x + e
    && Math.min(p.y, q.y) < r.y + r.h - e && Math.max(p.y, q.y) > r.y + e;
}

function cost(pts: Pt[], rects: Rect[]): number {
  let c = (pts.length - 2) * BEND;
  for (let i = 1; i < pts.length; i++) {
    c += span(pts[i - 1], pts[i]);
    for (const r of rects) if (through(pts[i - 1], pts[i], r)) c += THROUGH;
  }
  return c;
}

/**
 * Orthogonal route from a.pt to b.pt: leaves a along its side's outward normal and enters b against its side's
 * normal, each for at least STUB; at most 6 points, no zero-length segments. Candidate routes alternate axes
 * (up to five segments) through a few coordinates (half-way, the stub tips, STUB clear of either block); the
 * cheapest wins: running through either end's block costs more than any detour, then length plus a cost per bend.
 * Ties keep the earliest candidate, so an elbow pair sits half-way between the ports.
 */
export function routeWire(a: EndPlace, b: EndPlace): Pt[] {
  const A = a.pt;
  const B = b.pt;
  const na = NORMAL[a.side];
  const nb = NORMAL[b.side];
  const P = { x: A.x + na.x * STUB, y: A.y + na.y * STUB };
  const Q = { x: B.x + nb.x * STUB, y: B.y + nb.y * STUB };
  const rects = [a.rect, b.rect].filter((r): r is Rect => !!r);
  const coords = (k: 'x' | 'y', size: 'w' | 'h'): number[] => [...new Set([
    (P[k] + Q[k]) / 2, P[k], Q[k], A[k], B[k],
    ...rects.flatMap((r) => [r[k] - STUB, r[k] + r[size] + STUB]),
    Math.min(P[k], Q[k]) - STUB, Math.max(P[k], Q[k]) + STUB,
  ])];
  const xs = coords('x', 'w');
  const ys = coords('y', 'h');
  const vertA = na.x === 0;
  const vertB = nb.x === 0;
  // first (last) coordinate along a's (b's) normal: at least STUB out of the port
  const firstA = (vertA ? ys : xs).filter((v) => (v - (vertA ? A.y : A.x)) * (vertA ? na.y : na.x) >= STUB - 1e-9);
  const lastB = (vertB ? ys : xs).filter((v) => (v - (vertB ? B.y : B.x)) * (vertB ? nb.y : nb.x) >= STUB - 1e-9);

  let best: Pt[] | null = null;
  let bestCost = Infinity;
  const consider = (raw: Pt[]) => {
    const pts = tidy(raw, na, nb);
    if (!pts) return;
    const c = cost(pts, rects);
    if (c < bestCost - 1e-6) { best = pts; bestCost = c; }
  };
  if (vertA && vertB) {
    for (const y1 of firstA) for (const x1 of xs) for (const y2 of lastB) {
      consider([A, { x: A.x, y: y1 }, { x: x1, y: y1 }, { x: x1, y: y2 }, { x: B.x, y: y2 }, B]);
    }
  } else if (!vertA && !vertB) {
    for (const x1 of firstA) for (const y1 of ys) for (const x2 of lastB) {
      consider([A, { x: x1, y: A.y }, { x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: B.y }, B]);
    }
  } else if (vertA) {
    for (const y1 of firstA) for (const x1 of lastB) {
      consider([A, { x: A.x, y: y1 }, { x: x1, y: y1 }, { x: x1, y: B.y }, B]);
    }
  } else {
    for (const x1 of firstA) for (const y1 of lastB) {
      consider([A, { x: x1, y: A.y }, { x: x1, y: y1 }, { x: B.x, y: y1 }, B]);
    }
  }
  return best ?? [A, P, vertA ? { x: P.x, y: Q.y } : { x: Q.x, y: P.y }, Q, B];
}

/** The A/0/B chips of a transfer block, centred on its value line. */
export function transferChips(b: Transfer, g: GeoCtx): { position: Position; rect: Rect }[] {
  const r = blockRect(b, g);
  const x0 = r.x + (r.w - (3 * CHIP_W + 2 * CHIP_GAP)) / 2;
  const y = r.y + HEAD_H + 1;
  return (['A', '0', 'B'] as const).map((position, i) => ({
    position, rect: { x: x0 + i * (CHIP_W + CHIP_GAP), y, w: CHIP_W, h: LINE_H - 2 },
  }));
}

/** The short edges of a bus: start and end of its long axis. */
function busEnds(bus: Bus): { end: 'start' | 'end'; a: Pt; b: Pt }[] {
  const { x, y, w, h } = bus;
  return isHorizontal(bus)
    ? [{ end: 'start', a: { x, y }, b: { x, y: y + h } }, { end: 'end', a: { x: x + w, y }, b: { x: x + w, y: y + h } }]
    : [{ end: 'start', a: { x, y }, b: { x: x + w, y } }, { end: 'end', a: { x, y: y + h }, b: { x: x + w, y: y + h } }];
}

/** What is under p, by priority: chip, port, bus end, bus, wire, block (later blocks lie on top). */
export function hitPower(s: PowerSchema, p: Pt, tol: number, g: GeoCtx): PowerHit | null {
  const top = [...s.blocks].reverse();
  for (const b of top) {
    if (b.kind !== 'transfer') continue;
    const chip = transferChips(b, g).find((c) => inRect(p, c.rect, 0));
    if (chip) return { kind: 'chip', block: b.id, position: chip.position };
  }
  // nearest within reach; a tie keeps the topmost block
  let port: PowerHit | null = null;
  let portD = Infinity;
  for (const b of top) {
    for (const pl of portPlaces(s, b, g)) {
      const d = dist(p, pl.pt);
      if (d <= PORT_R + tol && d < portD) { port = { kind: 'port', block: b.id, port: pl.name }; portD = d; }
    }
  }
  if (port) return port;
  for (const b of top) {
    if (b.kind !== 'bus') continue;
    let end: PowerHit | null = null;
    let endD = Infinity;
    for (const e of busEnds(b)) {
      const d = distToSegment(p, e.a, e.b);
      if (d <= tol && d < endD) { end = { kind: 'bus-end', id: b.id, end: e.end }; endD = d; }
    }
    if (end) return end;
  }
  for (const b of top) {
    if (b.kind !== 'bus' || !inRect(p, blockRect(b, g), tol)) continue;
    const at = isHorizontal(b) ? (p.x - b.x) / b.w : (p.y - b.y) / b.h;
    return { kind: 'bus', id: b.id, at: clamp01(at) };
  }
  let wire: PowerHit | null = null;
  let wireD = Infinity;
  for (const w of s.wires) {
    const e = wireEnds(s, w, g);
    if (!e) continue;
    const pts = routeWire(e.a, e.b);
    for (let i = 1; i < pts.length; i++) {
      const d = distToSegment(p, pts[i - 1], pts[i]);
      if (d <= tol && d < wireD) { wire = { kind: 'wire', id: w.id }; wireD = d; }
    }
  }
  if (wire) return wire;
  const block = top.find((b) => b.kind !== 'bus' && inRect(p, blockRect(b, g), 0));
  return block ? { kind: 'block', id: block.id } : null;
}

/** The union of all block rects; null for an empty schematic. */
export function schemaBounds(s: PowerSchema, g: GeoCtx): Rect | null {
  if (!s.blocks.length) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const b of s.blocks) {
    const r = blockRect(b, g);
    x0 = Math.min(x0, r.x);
    y0 = Math.min(y0, r.y);
    x1 = Math.max(x1, r.x + r.w);
    y1 = Math.max(y1, r.y + r.h);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
