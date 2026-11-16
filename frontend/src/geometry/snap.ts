import type { Id, Level, Pt } from '../model/types';
import type { Endpoint } from '../model/ops';
import { wallFrame, type WallCorner } from './walls';
import { add, dist, dot, lineIntersect, norm, perpLeft, scale, sub } from './vec';

/**
 * excludeNodeIds: nodes being dragged. They are not snap targets, and neither are the walls
 * attached to them (those walls move with the drag). zones: zone outlines whose vertices, then edges, are snap
 * targets after the walls and before the grid (zone vertices are placed with them).
 */
export interface SnapOpts { tolMm: number; grid: number | null; from?: Pt; ortho: boolean; excludeNodeIds?: Id[]; zones?: Pt[][]; corners?: WallCorner[] }
export interface SnapResult { pt: Pt; kind: 'node' | 'corner' | 'mid' | 'wall' | 'zoneVertex' | 'zoneEdge' | 'grid' | 'none'; endpoint: Endpoint; corner?: WallCorner }

/** Lock p onto the nearest global axis (0/90/180/270 deg) through from. */
export function orthoConstrain(from: Pt, p: Pt): Pt {
  return Math.abs(p.x - from.x) >= Math.abs(p.y - from.y)
    ? { x: p.x, y: from.y }
    : { x: from.x, y: p.y };
}

export function pointAlong(from: Pt, towards: Pt, length: number): Pt {
  return add(from, scale(norm(sub(towards, from)), length));
}

function free(pt: Pt, kind: 'zoneVertex' | 'zoneEdge' | 'grid' | 'none'): SnapResult {
  return { pt, kind, endpoint: { kind: 'free', pt } };
}

export function snap(level: Level, p: Pt, opts: SnapOpts): SnapResult {
  const { tolMm, grid, ortho } = opts;
  const from = ortho ? opts.from : undefined;
  const excluded = new Set(opts.excludeNodeIds ?? []);
  // With a lock, every candidate is judged against the constrained point q.
  const q = from ? orthoConstrain(from, p) : p;
  const horizontal = from !== undefined && q.y === from.y;
  // Node/mid candidates under a lock must lie on the constraining line (<= 1 mm), so pt == true position.
  const onLine = (c: Pt): boolean =>
    !from || Math.abs(horizontal ? c.y - from.y : c.x - from.x) <= 1;

  // 1. nodes (within tolMm of q, hence of the constraining line)
  let bestNode: { id: Id; pt: Pt; d: number } | null = null;
  for (const n of level.nodes) {
    if (excluded.has(n.id)) continue;
    const pt = { x: n.x, y: n.y };
    const d = dist(pt, q);
    if (d <= tolMm && onLine(pt) && (!bestNode || d < bestNode.d)) bestNode = { id: n.id, pt, d };
  }
  let bestCorner: { c: WallCorner; d: number } | null = null;
  for (const c of opts.corners ?? []) {
    const d = dist(c.pt, q);
    if (d <= tolMm && onLine(c.pt) && (!bestCorner || d < bestCorner.d)) bestCorner = { c, d };
  }
  if (bestCorner && (!bestNode || bestCorner.d < bestNode.d)) {
    const pt = bestCorner.c.pt;
    return { pt, kind: 'corner', endpoint: { kind: 'free', pt }, corner: bestCorner.c };
  }
  if (bestNode) return { pt: bestNode.pt, kind: 'node', endpoint: { kind: 'node', nodeId: bestNode.id } };

  // Walls attached to an excluded (dragged) node are moving, so they are not snap targets.
  const walls = level.walls
    .filter(w => !excluded.has(w.a) && !excluded.has(w.b))
    .map(w => ({ w, f: wallFrame(level, w) }))
    .filter(x => x.f.len > 1e-9);

  // 2. wall midpoints
  let bestMid: { wallId: Id; pt: Pt; offset: number; d: number } | null = null;
  for (const { w, f } of walls) {
    const pt = { x: (f.a.x + f.b.x) / 2, y: (f.a.y + f.b.y) / 2 };
    const d = dist(pt, q);
    if (d <= tolMm && onLine(pt) && (!bestMid || d < bestMid.d)) bestMid = { wallId: w.id, pt, offset: f.len / 2, d };
  }
  if (bestMid) {
    return { pt: bestMid.pt, kind: 'mid', endpoint: { kind: 'wall', wallId: bestMid.wallId, offset: bestMid.offset } };
  }

  // 3. wall axis, 4. wall faces: nearest hit per class; offset is always measured along the axis.
  const hitLines = (faces: boolean): SnapResult | null => {
    let best: { res: SnapResult; d: number } | null = null;
    for (const { w, f } of walls) {
      const L = perpLeft(f.dir);
      const shifts = faces ? [f.leftOff, -f.rightOff].filter(s => s !== 0) : [0];
      for (const s of shifts) {
        const o = add(f.a, scale(L, s));
        // Under a lock the point is where the constraining line crosses the wall line.
        const hit = from ? lineIntersect(from, sub(q, from), o, f.dir) : add(o, scale(f.dir, dot(sub(q, o), f.dir)));
        if (!hit) continue;
        const t = dot(sub(hit, o), f.dir);
        if (t < 0 || t > f.len) continue;
        const d = dist(hit, q);
        if (d <= tolMm && (!best || d < best.d)) {
          best = { d, res: { pt: hit, kind: 'wall', endpoint: { kind: 'wall', wallId: w.id, offset: t } } };
        }
      }
    }
    return best ? best.res : null;
  };
  const axis = hitLines(false);
  if (axis) return axis;
  const face = hitLines(true);
  if (face) return face;

  // 5. zone vertices, 6. zone edges (under a lock: where the constraining line crosses the edge)
  const rings = opts.zones ?? [];
  let bestV: { pt: Pt; d: number } | null = null;
  for (const ring of rings) {
    for (const pt of ring) {
      const d = dist(pt, q);
      if (d <= tolMm && onLine(pt) && (!bestV || d < bestV.d)) bestV = { pt, d };
    }
  }
  if (bestV) return free(bestV.pt, 'zoneVertex');
  let bestE: { pt: Pt; d: number } | null = null;
  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      const l = dist(a, b);
      if (l < 1e-9) continue;
      const dir = scale(sub(b, a), 1 / l);
      const hit = from ? lineIntersect(from, sub(q, from), a, dir) : add(a, scale(dir, dot(sub(q, a), dir)));
      if (!hit) continue;
      const t = dot(sub(hit, a), dir);
      if (t < 0 || t > l) continue;
      const d = dist(hit, q);
      if (d <= tolMm && (!bestE || d < bestE.d)) bestE = { pt: hit, d };
    }
  }
  if (bestE) return free(bestE.pt, 'zoneEdge');

  // 7. grid, 8. none
  if (grid && grid > 0) {
    const r = (v: number) => Math.round(v / grid) * grid;
    const pt = !from ? { x: r(q.x), y: r(q.y) } : horizontal ? { x: r(q.x), y: from.y } : { x: from.x, y: r(q.y) };
    return free(pt, 'grid');
  }
  return free(q, 'none');
}
