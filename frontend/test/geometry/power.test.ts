import { describe, expect, it } from 'vitest';
import { deviceDefaults, type Device, type Pt } from '../../src/model/types';
import type { PortSide, PowerBlock, PowerSchema, PowerWire } from '../../src/model/power';
import {
  GRID, HEAD_H, LINE_H, MIN_W, PORT_R, STUB, blockLines, blockName, blockRect, busAttach, hitPower, pinAt, portPlaces,
  routeWire, schemaBounds, transferChips, wireEnds, type GeoCtx, type Rect,
} from '../../src/geometry/power';

type End = { pt: Pt; side: PortSide; rect?: Rect };
const SIDES: PortSide[] = ['top', 'right', 'bottom', 'left'];
const NORMAL: Record<PortSide, Pt> = { top: { x: 0, y: -1 }, right: { x: 1, y: 0 }, bottom: { x: 0, y: 1 }, left: { x: -1, y: 0 } };

const dev = (id: string, name: string, bindings?: Device['bindings']): Device =>
  ({ id, name, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 }, props: deviceDefaults('equipment', 'free'), bindings });
const geo = (...devices: Device[]): GeoCtx => ({ device: (id) => devices.find((d) => d.id === id) });
const G = geo();
const schema = (blocks: PowerBlock[], wires: PowerWire[] = []): PowerSchema => ({ blocks, wires });
const wire = (id: string, from: PowerWire['from'], to: PowerWire['to']): PowerWire => ({ id, from, to });
const centre = (r: Rect): Pt => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

/** Every rule routeWire promises, as a list of broken ones (empty = fine). */
function routeProblems(pts: Pt[], a: End, b: End): string[] {
  const bad: string[] = [];
  if (pts.length < 2 || pts.length > 6) bad.push(`${pts.length} points`);
  if (pts[0].x !== a.pt.x || pts[0].y !== a.pt.y) bad.push('does not start at a');
  const last = pts[pts.length - 1];
  if (last.x !== b.pt.x || last.y !== b.pt.y) bad.push('does not end at b');
  const dirs: Pt[] = [];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    if (dx !== 0 && dy !== 0) bad.push(`segment ${i} not axis-aligned`);
    if (dx === 0 && dy === 0) bad.push(`segment ${i} zero length`);
    dirs.push({ x: Math.sign(dx), y: Math.sign(dy) });
  }
  for (let i = 1; i < dirs.length; i++) {
    if (dirs[i].x === -dirs[i - 1].x && dirs[i].y === -dirs[i - 1].y) bad.push(`segment ${i + 1} doubles back`);
  }
  const na = NORMAL[a.side];
  const nb = NORMAL[b.side];
  const first = Math.abs(pts[1].x - pts[0].x) + Math.abs(pts[1].y - pts[0].y);
  const lastLen = Math.abs(last.x - pts[pts.length - 2].x) + Math.abs(last.y - pts[pts.length - 2].y);
  if (dirs[0].x !== na.x || dirs[0].y !== na.y) bad.push('first segment not along a normal');
  if (first < STUB - 1e-9) bad.push(`first segment ${first} < STUB`);
  const d = dirs[dirs.length - 1];
  if (d.x !== -nb.x || d.y !== -nb.y) bad.push('last segment not against b normal');
  if (lastLen < STUB - 1e-9) bad.push(`last segment ${lastLen} < STUB`);
  return bad;
}

/** True when a segment of the route runs through the interior of r. */
function crosses(pts: Pt[], r: Rect): boolean {
  for (let i = 1; i < pts.length; i++) {
    const x0 = Math.min(pts[i - 1].x, pts[i].x);
    const x1 = Math.max(pts[i - 1].x, pts[i].x);
    const y0 = Math.min(pts[i - 1].y, pts[i].y);
    const y1 = Math.max(pts[i - 1].y, pts[i].y);
    if (x0 < r.x + r.w - 0.5 && x1 > r.x + 0.5 && y0 < r.y + r.h - 0.5 && y1 > r.y + 0.5) return true;
  }
  return false;
}

/** A block rect of size w x h whose `side` holds pt at fraction u along it. */
function rectAround(pt: Pt, side: PortSide, w: number, h: number, u = 0.5): Rect {
  switch (side) {
    case 'top': return { x: pt.x - u * w, y: pt.y, w, h };
    case 'bottom': return { x: pt.x - u * w, y: pt.y - h, w, h };
    case 'left': return { x: pt.x, y: pt.y - u * h, w, h };
    case 'right': return { x: pt.x - w, y: pt.y - u * h, w, h };
  }
}

describe('constants', () => {
  it('match the spec', () => {
    expect([PORT_R, LINE_H, HEAD_H, MIN_W, STUB, GRID]).toEqual([11, 18, 24, 120, 14, 10]);
  });
});

describe('routeWire', () => {
  const QUADRANTS: Pt[] = [{ x: 200, y: 150 }, { x: -200, y: 150 }, { x: 200, y: -150 }, { x: -200, y: -150 }];

  for (const sa of SIDES) {
    for (const sb of SIDES) {
      it(`${sa} -> ${sb}: valid in all four quadrants`, () => {
        for (const q of QUADRANTS) {
          const a = { pt: { x: 0, y: 0 }, side: sa };
          const b = { pt: q, side: sb };
          expect(routeProblems(routeWire(a, b), a, b), `b at (${q.x}, ${q.y})`).toEqual([]);
        }
      });
    }
  }

  it('is valid for close, aligned and coincident ends', () => {
    const near: Pt[] = [
      { x: 0, y: 0 }, { x: 0, y: 5 }, { x: 5, y: 0 }, { x: 3, y: -4 }, { x: 0, y: 40 }, { x: 40, y: 0 },
      { x: 0, y: -40 }, { x: -40, y: 0 }, { x: 10, y: 20 }, { x: -20, y: 10 },
    ];
    for (const sa of SIDES) for (const sb of SIDES) for (const q of near) {
      const a = { pt: { x: 0, y: 0 }, side: sa };
      const b = { pt: q, side: sb };
      expect(routeProblems(routeWire(a, b), a, b), `${sa} -> ${sb}, b at (${q.x}, ${q.y})`).toEqual([]);
    }
  });

  it('is valid for random ends, with and without block rects', () => {
    let seed = 12345;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 3000; i++) {
      const sa = SIDES[Math.floor(rnd() * 4)];
      const sb = SIDES[Math.floor(rnd() * 4)];
      const a: End = { pt: { x: 0, y: 0 }, side: sa };
      const b: End = { pt: { x: Math.round((rnd() - 0.5) * 600), y: Math.round((rnd() - 0.5) * 600) }, side: sb };
      if (i % 2) {
        a.rect = rectAround(a.pt, sa, 120 + Math.round(rnd() * 100), 32 + Math.round(rnd() * 60), rnd());
        b.rect = rectAround(b.pt, sb, 120 + Math.round(rnd() * 100), 32 + Math.round(rnd() * 60), rnd());
      }
      expect(routeProblems(routeWire(a, b), a, b), JSON.stringify({ a, b })).toEqual([]);
    }
  });

  it('runs straight between aligned facing ports', () => {
    expect(routeWire({ pt: { x: 0, y: 0 }, side: 'bottom' }, { pt: { x: 0, y: 100 }, side: 'top' }))
      .toEqual([{ x: 0, y: 0 }, { x: 0, y: 100 }]);
    expect(routeWire({ pt: { x: 0, y: 0 }, side: 'right' }, { pt: { x: 100, y: 0 }, side: 'left' }))
      .toEqual([{ x: 0, y: 0 }, { x: 100, y: 0 }]);
  });

  it('takes one elbow pair half-way between offset facing ports', () => {
    expect(routeWire({ pt: { x: 0, y: 0 }, side: 'bottom' }, { pt: { x: 100, y: 120 }, side: 'top' }))
      .toEqual([{ x: 0, y: 0 }, { x: 0, y: 60 }, { x: 100, y: 60 }, { x: 100, y: 120 }]);
    expect(routeWire({ pt: { x: 0, y: 0 }, side: 'right' }, { pt: { x: 200, y: -50 }, side: 'left' }))
      .toEqual([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: -50 }, { x: 200, y: -50 }]);
  });

  it('takes a single elbow between perpendicular sides when it can', () => {
    expect(routeWire({ pt: { x: 0, y: 0 }, side: 'bottom' }, { pt: { x: 150, y: 100 }, side: 'left' }))
      .toEqual([{ x: 0, y: 0 }, { x: 0, y: 100 }, { x: 150, y: 100 }]);
    expect(routeWire({ pt: { x: 0, y: 0 }, side: 'right' }, { pt: { x: 150, y: 100 }, side: 'top' }))
      .toEqual([{ x: 0, y: 0 }, { x: 150, y: 0 }, { x: 150, y: 100 }]);
  });

  it('wraps a U under two ports facing the same way', () => {
    expect(routeWire({ pt: { x: 0, y: 0 }, side: 'bottom' }, { pt: { x: 100, y: -20 }, side: 'bottom' }))
      .toEqual([{ x: 0, y: 0 }, { x: 0, y: 14 }, { x: 100, y: 14 }, { x: 100, y: -20 }]);
  });

  it('goes around both blocks when the ports face away from each other', () => {
    const a: End = { pt: { x: 0, y: 0 }, side: 'top', rect: { x: -60, y: 0, w: 120, h: 50 } };
    const b: End = { pt: { x: 0, y: 200 }, side: 'bottom', rect: { x: -60, y: 150, w: 120, h: 50 } };
    const pts = routeWire(a, b);
    expect(routeProblems(pts, a, b)).toEqual([]);
    expect(crosses(pts, a.rect!)).toBe(false);
    expect(crosses(pts, b.rect!)).toBe(false);
  });

  it('goes around the source when the target sits behind it', () => {
    const a: End = { pt: { x: 0, y: 0 }, side: 'bottom', rect: { x: -60, y: -50, w: 120, h: 50 } };
    const b: End = { pt: { x: 100, y: -200 }, side: 'top', rect: { x: 40, y: -200, w: 120, h: 50 } };
    const pts = routeWire(a, b);
    expect(routeProblems(pts, a, b)).toEqual([]);
    expect(crosses(pts, a.rect!)).toBe(false);
    expect(crosses(pts, b.rect!)).toBe(false);
  });

  it('keeps out of both blocks for perpendicular sides that face away', () => {
    const a: End = { pt: { x: 0, y: 0 }, side: 'right', rect: { x: -120, y: -25, w: 120, h: 50 } };
    const b: End = { pt: { x: -50, y: -100 }, side: 'top', rect: { x: -110, y: -100, w: 120, h: 50 } };
    const pts = routeWire(a, b);
    expect(routeProblems(pts, a, b)).toEqual([]);
    expect(crosses(pts, a.rect!)).toBe(false);
    expect(crosses(pts, b.rect!)).toBe(false);
  });

  it('keeps out of blocks on random non-overlapping layouts where a clear route exists', () => {
    // Two blocks well apart (a clear gap of at least 3 * STUB), ports anywhere on their outlines.
    let seed = 777;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    let checked = 0;
    for (let i = 0; i < 2000; i++) {
      const ra: Rect = { x: 0, y: 0, w: 120 + Math.round(rnd() * 80), h: 32 + Math.round(rnd() * 50) };
      const rb: Rect = { x: Math.round((rnd() - 0.5) * 800), y: Math.round((rnd() - 0.5) * 800), w: 120, h: 50 };
      const gap = Math.max(rb.x - (ra.x + ra.w), ra.x - (rb.x + rb.w), rb.y - (ra.y + ra.h), ra.y - (rb.y + rb.h));
      if (gap < 3 * STUB) continue;
      const sa = SIDES[Math.floor(rnd() * 4)];
      const sb = SIDES[Math.floor(rnd() * 4)];
      const on = (r: Rect, s: PortSide, u: number): Pt => s === 'top' ? { x: r.x + u * r.w, y: r.y }
        : s === 'bottom' ? { x: r.x + u * r.w, y: r.y + r.h } : s === 'left' ? { x: r.x, y: r.y + u * r.h } : { x: r.x + r.w, y: r.y + u * r.h };
      const a: End = { pt: on(ra, sa, 0.2 + 0.6 * rnd()), side: sa, rect: ra };
      const b: End = { pt: on(rb, sb, 0.2 + 0.6 * rnd()), side: sb, rect: rb };
      const pts = routeWire(a, b);
      expect(routeProblems(pts, a, b), JSON.stringify({ a, b })).toEqual([]);
      expect(crosses(pts, ra) || crosses(pts, rb), JSON.stringify({ a, b, pts })).toBe(false);
      checked++;
    }
    expect(checked).toBeGreaterThan(500);
  });
});

describe('blockLines and blockRect', () => {
  it('a device block whose device is gone shows one line', () => {
    expect(blockLines({ id: 'd', kind: 'device', deviceId: 'gone', x: 0, y: 0 }, G)).toBe(1);
  });

  it('counts the configured value lines per kind, never live values', () => {
    const pc = dev('pc', 'PC', { power: 'sensor.pc_power', control: 'switch.pc' });
    const inv = dev('inv', 'Inverter', { power: 'sensor.inv_power' });
    const bare = dev('bare', 'Bare');
    const g = geo(pc, inv, bare);
    const at = { x: 0, y: 0 };
    expect(blockLines({ id: 'g', kind: 'grid', ...at }, g)).toBe(1);
    expect(blockLines({ id: 'g', kind: 'grid', voltage: 'sensor.v', ...at }, g)).toBe(2);
    expect(blockLines({ id: 'd', kind: 'device', deviceId: 'pc', ...at }, g)).toBe(2);
    expect(blockLines({ id: 'd', kind: 'device', deviceId: 'bare', ...at }, g)).toBe(0);
    expect(blockLines({ id: 'd', kind: 'device', deviceId: 'inv', inverter: true, ...at }, g)).toBe(2);
    expect(blockLines({ id: 'm', kind: 'meter', ...at }, g)).toBe(1);
    expect(blockLines({ id: 'm', kind: 'meter', voltage: 'sensor.v', switch: { entity: 'switch.m', controllable: false }, ...at }, g)).toBe(3);
    expect(blockLines({ id: 'b', kind: 'battery', ...at }, g)).toBe(2);
    expect(blockLines({ id: 'p', kind: 'pv', ...at }, g)).toBe(1);
    expect(blockLines({ id: 't', kind: 'transfer', form: '2in1out', ...at }, g)).toBe(1);
    expect(blockLines({ id: 'r', kind: 'remainder', ...at }, g)).toBe(1);
  });

  it('grows with a longer name', () => {
    const short = blockRect({ id: 'm', kind: 'meter', name: 'M', x: 10, y: 20 }, G);
    const long = blockRect({ id: 'm', kind: 'meter', name: 'Main distribution board meter', x: 10, y: 20 }, G);
    expect(short).toEqual({ x: 10, y: 20, w: MIN_W, h: HEAD_H + LINE_H + 8 });
    expect(long.w).toBe(7 * 'Main distribution board meter'.length + 32);
    expect(long.w).toBeGreaterThan(short.w);
  });

  it('a device block takes its plan device name; a bus uses its own size', () => {
    const g = geo(dev('pc', 'A rather long device name here'));
    const b: PowerBlock = { id: 'd', kind: 'device', deviceId: 'pc', name: 'ignored', x: 0, y: 0 };
    expect(blockName(b, g)).toBe('A rather long device name here');
    expect(blockRect(b, g).w).toBe(7 * 30 + 32);
    expect(blockRect({ id: 'b', kind: 'bus', w: 240, h: 12, x: 5, y: 6 }, g)).toEqual({ x: 5, y: 6, w: 240, h: 12 });
  });
});

describe('portPlaces', () => {
  const grid: PowerBlock = { id: 'g', kind: 'grid', name: 'Grid', x: 0, y: 0 };
  const meterRight: PowerBlock = { id: 'm', kind: 'meter', name: 'Meter', x: 300, y: 0 };

  it('puts a wired OUT on the side facing a block to its right', () => {
    const s = schema([grid, meterRight], [wire('w', { block: 'g', port: 'OUT' }, { block: 'm', port: 'IN' })]);
    const r = blockRect(grid, G, s);
    const [out] = portPlaces(s, grid, G);
    expect(out).toEqual({ name: 'OUT', dir: 'out', side: 'right', pt: { x: r.x + r.w, y: r.y + r.h / 2 }, pinned: false });
    const into = portPlaces(s, meterRight, G).find((p) => p.name === 'IN')!;
    expect(into.side).toBe('left');
  });

  it('puts free ports on their default sides', () => {
    const g = geo(dev('inv', 'Inverter'));
    const inv: PowerBlock = { id: 'i', kind: 'device', deviceId: 'inv', inverter: true, x: 0, y: 0 };
    const s = schema([inv]);
    const places = portPlaces(s, inv, g);
    const side = Object.fromEntries(places.map((p) => [p.name, p.side]));
    expect(side).toEqual({ IN: 'top', OUT: 'bottom', PV: 'top', BAT: 'right' });
    const r = blockRect(inv, g, s);
    expect(places.find((p) => p.name === 'IN')!.pt).toEqual({ x: r.x + r.w / 3, y: r.y });
    expect(places.find((p) => p.name === 'PV')!.pt).toEqual({ x: r.x + (2 * r.w) / 3, y: r.y });
    expect(places.find((p) => p.name === 'BAT')!.pt).toEqual({ x: r.x + r.w, y: r.y + r.h / 2 });
  });

  it('orders two wired outputs on one side by their targets x', () => {
    const ts: PowerBlock = { id: 't', kind: 'transfer', form: '1in2out', name: 'TS', x: 0, y: 0 };
    const right: PowerBlock = { id: 'r', kind: 'meter', name: 'R', x: 200, y: 300 };
    const left: PowerBlock = { id: 'l', kind: 'meter', name: 'L', x: -200, y: 300 };
    const s = schema([ts, right, left], [
      wire('wa', { block: 't', port: 'A' }, { block: 'r', port: 'IN' }),
      wire('wb', { block: 't', port: 'B' }, { block: 'l', port: 'IN' }),
    ]);
    const r = blockRect(ts, G, s);
    const places = portPlaces(s, ts, G);
    const a = places.find((p) => p.name === 'A')!;
    const b = places.find((p) => p.name === 'B')!;
    expect(a.side).toBe('bottom');
    expect(b.side).toBe('bottom');
    expect(b.pt).toEqual({ x: r.x + r.w / 3, y: r.y + r.h });
    expect(a.pt).toEqual({ x: r.x + (2 * r.w) / 3, y: r.y + r.h });
  });

  it('a pin wins over the automatic side', () => {
    const pinned: PowerBlock = { ...grid, portPins: { OUT: { side: 'left', at: 0.25 } } };
    const s = schema([pinned, meterRight], [wire('w', { block: 'g', port: 'OUT' }, { block: 'm', port: 'IN' })]);
    const r = blockRect(pinned, G, s);
    expect(portPlaces(s, pinned, G)).toEqual([
      { name: 'OUT', dir: 'out', side: 'left', pt: { x: r.x, y: r.y + 0.25 * r.h }, pinned: true },
    ]);
  });

  it('a port wired to a bus faces the attach point', () => {
    const bus: PowerBlock = { id: 'b', kind: 'bus', name: 'Main', x: -100, y: 200, w: 400, h: 12 };
    const s = schema([grid, bus], [wire('w', { block: 'g', port: 'OUT' }, { bus: 'b', at: 0.5 })]);
    expect(portPlaces(s, grid, G)[0].side).toBe('bottom');
  });

  it('uses the tie rule |dx|/(w/2) against |dy|/(h/2)', () => {
    // grid 120 x 50 at the origin, centre (60, 25); target centre 100 right, 30 down: 100/60 > 30/25 -> right
    const m: PowerBlock = { id: 'm', kind: 'meter', name: 'M', x: 100, y: 30 };
    const s = schema([grid, m], [wire('w', { block: 'g', port: 'OUT' }, { block: 'm', port: 'IN' })]);
    expect(portPlaces(s, grid, G)[0].side).toBe('right');
    // 50 right, 60 down: 50/60 < 60/25 -> bottom
    const m2: PowerBlock = { ...m, x: 50, y: 60 };
    const s2 = schema([grid, m2], [wire('w', { block: 'g', port: 'OUT' }, { block: 'm', port: 'IN' })]);
    expect(portPlaces(s2, grid, G)[0].side).toBe('bottom');
  });
});

describe('blocks grow to fit their ports', () => {
  const g = geo(dev('bare', 'Bare'), dev('inv', 'Inverter'));
  const short: PowerBlock = { id: 'd', kind: 'device', deviceId: 'bare', x: 0, y: 0 };
  const src: PowerBlock = { id: 'g', kind: 'grid', name: 'Grid', x: -600, y: -100 };
  const sink: PowerBlock = { id: 'm', kind: 'meter', name: 'Meter', x: -600, y: 100 };
  const s = schema([short, src, sink], [
    wire('w1', { block: 'g', port: 'OUT' }, { block: 'd', port: 'IN' }),
    wire('w2', { block: 'd', port: 'OUT' }, { block: 'm', port: 'IN' }),
  ]);

  it('spaces two wired ports on the left of a short block at least 2 * PORT_R + 6 apart, on the grown edge', () => {
    const base = blockRect(short, g);
    expect(base.h).toBe(HEAD_H + 8);
    const r = blockRect(short, g, s);
    expect(r).toEqual({ x: 0, y: 0, w: base.w, h: 3 * (2 * PORT_R + 6) });
    const [into, out] = portPlaces(s, short, g);
    expect([into.side, out.side]).toEqual(['left', 'left']);
    expect(out.pt.y - into.pt.y).toBeGreaterThanOrEqual(2 * PORT_R + 6);
    for (const p of [into, out]) {
      expect(p.pt.x).toBe(r.x);
      expect(p.pt.y).toBeGreaterThanOrEqual(r.y + PORT_R);
      expect(p.pt.y).toBeLessThanOrEqual(r.y + r.h - PORT_R);
    }
  });

  it('blockRect without a schema stays the base rect', () => {
    expect(blockRect(short, g)).toEqual({ x: 0, y: 0, w: MIN_W, h: HEAD_H + 8 });
  });

  it('wire ends, hits and bounds use the grown rect', () => {
    const r = blockRect(short, g, s);
    expect(wireEnds(s, s.wires[0], g)!.b.rect).toEqual(r);
    expect(hitPower(s, { x: 60, y: r.h - 6 }, 4, g)).toEqual({ kind: 'block', id: 'd' });
    expect(schemaBounds(schema([short], s.wires), g)!.h).toBe(HEAD_H + 8);
    expect(schemaBounds(s, g)).toEqual({ x: -600, y: -100, w: 720, h: 256 }); // the meter's single right port grows it to 56
  });

  it('grows the width for many ports on one side, pins included', () => {
    const inv: PowerBlock = {
      id: 'i', kind: 'device', deviceId: 'inv', inverter: true, x: 0, y: 0,
      portPins: { IN: { side: 'top', at: 0.2 }, OUT: { side: 'top', at: 0.4 }, PV: { side: 'top', at: 0.6 }, BAT: { side: 'top', at: 0.8 } },
    };
    const si = schema([inv]);
    expect(blockRect(inv, g).w).toBe(MIN_W);
    const r = blockRect(inv, g, si);
    expect(r.w).toBe(5 * (2 * PORT_R + 6));
    expect(portPlaces(si, inv, g).map((p) => p.pt.x)).toEqual([0.2, 0.4, 0.6, 0.8].map((at) => at * r.w));
  });
});

describe('pinAt', () => {
  const r: Rect = { x: 0, y: 0, w: 120, h: 50 };
  it('returns the nearest outline point', () => {
    expect(pinAt(r, { x: 60, y: 0 })).toEqual({ side: 'top', at: 0.5 });
    expect(pinAt(r, { x: 130, y: 10 })).toEqual({ side: 'right', at: 0.2 });
    expect(pinAt(r, { x: 3, y: 25 })).toEqual({ side: 'left', at: 0.5 });
    expect(pinAt(r, { x: 30, y: 47 })).toEqual({ side: 'bottom', at: 0.25 });
    expect(pinAt(r, { x: -40, y: 80 }).at).toBeGreaterThanOrEqual(0);
  });
});

describe('busAttach', () => {
  const hbus = { id: 'b', kind: 'bus' as const, x: 0, y: 100, w: 240, h: 12 };
  const vbus = { id: 'v', kind: 'bus' as const, x: 0, y: 0, w: 12, h: 200 };

  it('picks the bottom edge for a target below a horizontal bus', () => {
    expect(busAttach(hbus, 0.25, { x: 60, y: 300 })).toEqual({ pt: { x: 60, y: 112 }, side: 'bottom' });
    expect(busAttach(hbus, 0.5, { x: 400, y: -50 })).toEqual({ pt: { x: 120, y: 100 }, side: 'top' });
  });

  it('picks the left or right edge of a vertical bus', () => {
    expect(busAttach(vbus, 0.5, { x: 300, y: 0 })).toEqual({ pt: { x: 12, y: 100 }, side: 'right' });
    expect(busAttach(vbus, 0.1, { x: -300, y: 0 })).toEqual({ pt: { x: 0, y: 20 }, side: 'left' });
  });
});

describe('wireEnds', () => {
  const grid: PowerBlock = { id: 'g', kind: 'grid', name: 'Grid', x: 0, y: 0 };
  const bus: PowerBlock = { id: 'b', kind: 'bus', name: 'Main', x: -100, y: 200, w: 400, h: 12 };
  const bus2: PowerBlock = { id: 'b2', kind: 'bus', name: 'Second', x: -100, y: 500, w: 400, h: 12 };

  it('joins a port to a bus attach point facing it', () => {
    const w = wire('w', { block: 'g', port: 'OUT' }, { bus: 'b', at: 0.25 });
    const s = schema([grid, bus], [w]);
    const e = wireEnds(s, w, G)!;
    const out = portPlaces(s, grid, G)[0];
    expect(e.a.pt).toEqual(out.pt);
    expect(e.a.side).toBe('bottom');
    expect(e.b.pt).toEqual({ x: 0, y: 200 });
    expect(e.b.side).toBe('top');
  });

  it('joins two buses', () => {
    const w = wire('w', { bus: 'b', at: 0.5 }, { bus: 'b2', at: 0.5 });
    const e = wireEnds(schema([bus, bus2], [w]), w, G)!;
    expect(e.a).toMatchObject({ pt: { x: 100, y: 212 }, side: 'bottom' });
    expect(e.b).toMatchObject({ pt: { x: 100, y: 500 }, side: 'top' });
  });

  it('is null when an end is missing', () => {
    const w = wire('w', { block: 'g', port: 'OUT' }, { block: 'nope', port: 'IN' });
    expect(wireEnds(schema([grid], [w]), w, G)).toBeNull();
    const w2 = wire('w', { block: 'g', port: 'BAT' }, { bus: 'b', at: 0.5 });
    expect(wireEnds(schema([grid, bus], [w2]), w2, G)).toBeNull();
  });

  it('routes a wire clear of its own blocks', () => {
    const m: PowerBlock = { id: 'm', kind: 'meter', name: 'Meter', x: 0, y: 200 };
    const w = wire('w', { block: 'g', port: 'OUT' }, { block: 'm', port: 'IN' });
    const s = schema([grid, m], [w]);
    const e = wireEnds(s, w, G)!;
    const pts = routeWire(e.a, e.b);
    expect(routeProblems(pts, e.a, e.b)).toEqual([]);
    expect(crosses(pts, blockRect(grid, G, s))).toBe(false);
    expect(crosses(pts, blockRect(m, G, s))).toBe(false);
  });
});

describe('hitPower', () => {
  const grid: PowerBlock = { id: 'g', kind: 'grid', name: 'Grid', x: 0, y: 0 };
  const ts: PowerBlock = { id: 't', kind: 'transfer', form: '2in1out', name: 'TS', x: 400, y: 0 };
  const bus: PowerBlock = { id: 'b', kind: 'bus', name: 'Main', x: 0, y: 300, w: 400, h: 12 };
  const w = wire('w', { block: 'g', port: 'OUT' }, { bus: 'b', at: 0.15 });
  const s = schema([grid, ts, bus], [w]);

  it('prefers a port over its block', () => {
    const out = portPlaces(s, grid, G)[0];
    const r = blockRect(grid, G, s);
    const inside = { x: out.pt.x, y: out.pt.y - 3 };
    expect(inside.y).toBeGreaterThan(r.y);
    expect(hitPower(s, inside, 4, G)).toEqual({ kind: 'port', block: 'g', port: 'OUT' });
    expect(hitPower(s, { x: r.x + 10, y: r.y + 10 }, 4, G)).toEqual({ kind: 'block', id: 'g' });
  });

  it('hits transfer chips before anything else', () => {
    const chips = transferChips(ts as PowerBlock & { kind: 'transfer' }, G, s);
    expect(chips.map((c) => c.position)).toEqual(['A', '0', 'B']);
    const b = chips[2].rect;
    expect(hitPower(s, centre(b), 4, G)).toEqual({ kind: 'chip', block: 't', position: 'B' });
    const r = blockRect(ts, G, s);
    for (const c of chips) {
      expect(c.rect.x).toBeGreaterThanOrEqual(r.x + PORT_R);
      expect(c.rect.x + c.rect.w).toBeLessThanOrEqual(r.x + r.w - PORT_R);
      expect(c.rect.y).toBeGreaterThanOrEqual(r.y + HEAD_H);
      expect(c.rect.y + c.rect.h).toBeLessThanOrEqual(r.y + HEAD_H + LINE_H);
    }
  });

  it('hits bus ends, then the bus body with its position along the bus', () => {
    expect(hitPower(s, { x: 401, y: 306 }, 4, G)).toEqual({ kind: 'bus-end', id: 'b', end: 'end' });
    expect(hitPower(s, { x: 1, y: 306 }, 4, G)).toEqual({ kind: 'bus-end', id: 'b', end: 'start' });
    expect(hitPower(s, { x: 300, y: 306 }, 4, G)).toEqual({ kind: 'bus', id: 'b', at: 0.75 });
  });

  it('a later block lies on top', () => {
    const m1: PowerBlock = { id: 'm1', kind: 'meter', name: 'M1', x: 0, y: 0 };
    const m2: PowerBlock = { id: 'm2', kind: 'meter', name: 'M2', x: 30, y: 10 };
    expect(hitPower(schema([m1, m2]), { x: 45, y: 30 }, 4, G)).toEqual({ kind: 'block', id: 'm2' });
  });

  it('hits a wire near its route, and nothing on empty canvas', () => {
    const e = wireEnds(s, w, G)!;
    const pts = routeWire(e.a, e.b);
    // a point on the longest segment, well away from both ends
    let i = 1;
    for (let k = 2; k < pts.length; k++) {
      const l = (p: number) => Math.abs(pts[p].x - pts[p - 1].x) + Math.abs(pts[p].y - pts[p - 1].y);
      if (l(k) > l(i)) i = k;
    }
    const mid = { x: (pts[i].x + pts[i - 1].x) / 2 + 2, y: (pts[i].y + pts[i - 1].y) / 2 + 2 };
    expect(hitPower(s, mid, 4, G)).toEqual({ kind: 'wire', id: 'w' });
    expect(hitPower(s, { x: -500, y: -500 }, 4, G)).toBeNull();
  });
});

describe('schemaBounds', () => {
  it('is null for no blocks and the union of block rects otherwise', () => {
    expect(schemaBounds(schema([]), G)).toBeNull();
    const a: PowerBlock = { id: 'g', kind: 'grid', name: 'Grid', x: -50, y: 10 };
    const b: PowerBlock = { id: 'b', kind: 'bus', x: 100, y: 300, w: 400, h: 12 };
    expect(schemaBounds(schema([a, b]), G)).toEqual({ x: -50, y: 10, w: 550, h: 302 });
  });
});
