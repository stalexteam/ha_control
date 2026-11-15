import { newId } from './ids';
import type { Baseline, Id, Level, PlanNode, Pt, Wall, WallType } from './types';
import { add, dist, lerp, norm, projectT, scale, sub } from '../geometry/vec';
import { findNode, nodePos } from '../geometry/walls';
import { refreshOpenings } from './openings';
import { refreshDevices } from './devices';
import { refreshZones } from './zones';

/** Result of snapping a cursor point. */
export type Endpoint =
  | { kind: 'node'; nodeId: Id }
  | { kind: 'wall'; wallId: Id; offset: number } // point on a wall axis -> T-node
  | { kind: 'free'; pt: Pt };

export interface WallProps { type: WallType; thickness: number; baseline: Baseline }

const EPS = 1; // mm

function clone(level: Level): Level {
  return structuredClone(level);
}

function findWall(level: Level, id: Id): Wall {
  const w = level.walls.find(x => x.id === id);
  if (!w) throw new Error(`wall not found: ${id}`);
  return w;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * Point on the host wall's axis at `at`: an offset from its node A, or a point projected onto the axis.
 * The offset is clamped to [0, len].
 */
function hostPoint(level: Level, w: Wall, at: number | Pt): { pt: Pt; offset: number } {
  const a = nodePos(level, w.a);
  const b = nodePos(level, w.b);
  const l = dist(a, b);
  const offset = clamp(typeof at === 'number' ? at : projectT(at, a, b) * l, 0, l);
  return { pt: l === 0 ? a : lerp(a, b, offset / l), offset };
}

/**
 * Mutating: keep every T-node at its current world position projected onto its host's (possibly new) axis,
 * clamped to the host, and recompute its offset. Moving or stretching a host therefore only stretches the
 * hosted walls; their hosted ends never slide along the host. Explicit sliding goes through placeNode,
 * which writes the new position before this step runs.
 */
function settleNodes(out: Level): void {
  // Hosts can themselves end in T-nodes; iterate so chains settle regardless of node order.
  for (let pass = 0; pass <= out.nodes.length; pass++) {
    let changed = false;
    for (const n of out.nodes) {
      if (!n.host) continue;
      const w = out.walls.find(x => x.id === n.host!.wallId);
      if (!w) continue;
      const { pt, offset } = hostPoint(out, w, n);
      if (Math.abs(n.x - pt.x) > 1e-9 || Math.abs(n.y - pt.y) > 1e-9) changed = true;
      n.x = pt.x;
      n.y = pt.y;
      n.host.offset = offset;
    }
    if (!changed) break;
  }
}

/**
 * Shared post-edit step on a private clone: settle T-nodes, re-anchor openings of walls whose node A
 * moved (needs `before`), refresh opening validity, refresh zones.
 */
function postEdit(out: Level, before?: Level): Level {
  settleNodes(out);
  if (before) reanchorHosted(before, out);
  return refreshZones(refreshDevices(refreshOpenings(out)));
}

/** Post-edit step for a level already edited by the caller; `before` enables opening re-anchoring. */
export function finalize(level: Level, before?: Level): Level {
  return postEdit(clone(level), before);
}

/** Mutating helper on a private clone: place node (T-nodes slide along their host axis). */
function placeNode(level: Level, nodeId: Id, to: Pt): void {
  const n = findNode(level, nodeId);
  const w = n.host && level.walls.find(x => x.id === n.host!.wallId);
  if (n.host && w) {
    const { pt, offset } = hostPoint(level, w, to);
    n.host.offset = offset;
    n.x = pt.x;
    n.y = pt.y;
  } else {
    n.x = to.x;
    n.y = to.y;
  }
}

function resolve(level: Level, e: Endpoint): { pt: Pt; nodeId?: Id; host?: { wallId: Id; offset: number } } {
  if (e.kind === 'free') return { pt: e.pt };
  if (e.kind === 'node') return { pt: nodePos(level, e.nodeId), nodeId: e.nodeId };
  const w = findWall(level, e.wallId);
  const { pt, offset } = hostPoint(level, w, e.offset);
  const l = dist(nodePos(level, w.a), nodePos(level, w.b));
  if (offset <= EPS) return { pt: nodePos(level, w.a), nodeId: w.a };
  if (l - offset <= EPS) return { pt: nodePos(level, w.b), nodeId: w.b };
  return { pt, host: { wallId: e.wallId, offset } };
}

function materialize(level: Level, r: ReturnType<typeof resolve>): Id {
  if (r.nodeId) return r.nodeId;
  const node: PlanNode = { id: newId(), x: r.pt.x, y: r.pt.y };
  if (r.host) node.host = { ...r.host };
  level.nodes.push(node);
  return node.id;
}

export function addWallSegment(
  level: Level, from: Endpoint, to: Endpoint, props: WallProps,
): { level: Level; wallId: Id | null; endNodeId: Id | null } {
  const rf = resolve(level, from);
  const rt = resolve(level, to);
  if (dist(rf.pt, rt.pt) < EPS) return { level, wallId: null, endNodeId: null };
  const out = clone(level);
  const a = materialize(out, rf);
  const b = materialize(out, rt);
  if (a === b) return { level, wallId: null, endNodeId: null };
  const wall: Wall = { id: newId(), a, b, thickness: props.thickness, type: props.type, baseline: props.baseline };
  out.walls.push(wall);
  return { level: finalize(out, level), wallId: wall.id, endNodeId: b };
}

/**
 * Axis corners of a box drawn from c1 to c2 measured at `measure` (inner faces, axes or outer faces), starting
 * at the min-x/min-y corner. Null when the box collapses (outer measure on a box thinner than the wall).
 */
export function boxCorners(c1: Pt, c2: Pt, thickness: number, measure: 'inner' | 'axis' | 'outer'): Pt[] | null {
  const h = measure === 'inner' ? thickness / 2 : measure === 'outer' ? -thickness / 2 : 0;
  const x0 = Math.min(c1.x, c2.x) - h, x1 = Math.max(c1.x, c2.x) + h;
  const y0 = Math.min(c1.y, c2.y) - h, y1 = Math.max(c1.y, c2.y) + h;
  if (x1 - x0 < EPS || y1 - y0 < EPS) return null;
  return [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
}

export function addBox(level: Level, c1: Pt, c2: Pt, props: WallProps, measure: 'inner' | 'axis' | 'outer'): Level {
  const corners = boxCorners(c1, c2, props.thickness, measure);
  // Outer measure on a box thinner than the wall collapses: nothing sensible to build.
  if (!corners) return level;
  const out = clone(level);
  const ids = corners.map(c => {
    const n: PlanNode = { id: newId(), x: c.x, y: c.y };
    out.nodes.push(n);
    return n.id;
  });
  for (let i = 0; i < 4; i++) {
    out.walls.push({
      id: newId(), a: ids[i], b: ids[(i + 1) % 4],
      thickness: props.thickness, type: props.type, baseline: 'center',
    });
  }
  return finalize(out, level);
}

export function moveNode(level: Level, nodeId: Id, to: Pt): Level {
  const out = clone(level);
  placeNode(out, nodeId, to);
  return postEdit(out, level);
}

/** Mutating on `out`: walls whose node A moved keep their openings and wall devices at the same world position. */
function reanchorHosted(before: Level, out: Level): void {
  const hosted: { wallId: Id; offset: number }[] = [
    ...out.openings,
    ...out.devices.flatMap(d => (d.placement.mode === 'wall' ? [d.placement] : [])),
  ];
  for (const w of out.walls) {
    const oldW = before.walls.find(x => x.id === w.id);
    if (!oldW || oldW.a !== w.a) continue;
    const oa = before.nodes.find(n => n.id === oldW.a), ob = before.nodes.find(n => n.id === oldW.b);
    const na = out.nodes.find(n => n.id === w.a), nb = out.nodes.find(n => n.id === w.b);
    if (!oa || !ob || !na || !nb) continue;
    if (oa.x === na.x && oa.y === na.y) continue;
    const nl = dist(na, nb);
    if (nl === 0) continue;
    const odir = norm(sub(ob, oa));
    for (const h of hosted) {
      if (h.wallId === w.id) h.offset = projectT(add(oa, scale(odir, h.offset)), na, nb) * nl;
    }
  }
}

export function moveWall(level: Level, wallId: Id, delta: Pt): Level {
  const out = clone(level);
  const w = findWall(out, wallId);
  const ids = w.a === w.b ? [w.a] : [w.a, w.b];
  const targets = ids.map(id => ({ id, to: add(nodePos(out, id), delta) }));
  for (const t of targets) placeNode(out, t.id, t.to);
  return finalize(out, level);
}

function dropOrphans(level: Level): void {
  level.nodes = level.nodes.filter(n => level.walls.some(w => w.a === n.id || w.b === n.id));
}

export function detachWallEnd(level: Level, wallId: Id, end: 'a' | 'b'): { level: Level; nodeId: Id } {
  const out = clone(level);
  const w = findWall(out, wallId);
  const p = nodePos(out, w[end]);
  const node: PlanNode = { id: newId(), x: p.x, y: p.y };
  out.nodes.push(node);
  w[end] = node.id;
  dropOrphans(out);
  return { level: finalize(out, level), nodeId: node.id };
}

/** Re-points every wall end at `fromId` to `intoId`; walls that collapse (a === b) go with their openings. */
export function mergeNodes(level: Level, fromId: Id, intoId: Id): Level {
  if (fromId === intoId) return level;
  const out = clone(level);
  for (const w of out.walls) {
    if (w.a === fromId) w.a = intoId;
    if (w.b === fromId) w.b = intoId;
  }
  const dead = new Set(out.walls.filter(w => w.a === w.b).map(w => w.id));
  out.walls = out.walls.filter(w => !dead.has(w.id));
  out.openings = out.openings.filter(o => !dead.has(o.wallId));
  out.devices = out.devices.filter(d => d.placement.mode !== 'wall' || !dead.has(d.placement.wallId));
  for (const n of out.nodes) if (n.host && dead.has(n.host.wallId)) delete n.host;
  out.nodes = out.nodes.filter(n => n.id !== fromId);
  dropOrphans(out);
  return finalize(out, level);
}

export function deleteWall(level: Level, wallId: Id): Level {
  const out = clone(level);
  out.walls = out.walls.filter(w => w.id !== wallId);
  out.openings = out.openings.filter(o => o.wallId !== wallId);
  out.devices = out.devices.filter(d => d.placement.mode !== 'wall' || d.placement.wallId !== wallId);
  for (const n of out.nodes) if (n.host?.wallId === wallId) delete n.host;
  dropOrphans(out);
  return finalize(out, level);
}

export function setWallProps(level: Level, wallId: Id, patch: Partial<WallProps>): Level {
  const out = clone(level);
  Object.assign(findWall(out, wallId), patch);
  return finalize(out, level);
}
