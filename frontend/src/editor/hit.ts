import type { Id, Level, Pt } from '../model/types';
import { wallFrame, wallLocal, wallOutlines } from '../geometry/walls';
import { dist, dot, pointInPolygon, sub } from '../geometry/vec';
import type { Selection } from './tools/types';

function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const ab = sub(b, a);
  const l2 = dot(ab, ab);
  const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, dot(sub(p, a), ab) / l2));
  return dist(p, { x: a.x + ab.x * t, y: a.y + ab.y * t });
}

function nearRing(p: Pt, ring: Pt[], tol: number): boolean {
  return ring.some((a, i) => distToSegment(p, a, ring[(i + 1) % ring.length]) <= tol);
}

/**
 * Wall under p, or null: the wall whose outline contains p, else the first within tol of it (so a click inside a
 * wall next to a junction picks that wall, not a neighbour whose edge is within tol).
 */
export function wallAt(level: Level, p: Pt, tol: number): Id | null {
  const outlines = wallOutlines(level);
  for (const [id, ring] of outlines) if (pointInPolygon(p, ring)) return id;
  for (const [id, ring] of outlines) if (nearRing(p, ring, tol)) return id;
  return null;
}

/** Opening under p (its span along the wall, within the wall thickness), or null. */
function openingAt(level: Level, p: Pt): Id | null {
  for (const o of level.openings) {
    const w = level.walls.find(x => x.id === o.wallId);
    if (!w) continue;
    const f = wallFrame(level, w);
    if (f.len < 1e-9) continue;
    const { t, side } = wallLocal(f, p); // side > 0: left face
    if (t >= o.offset && t <= o.offset + o.width && side >= -f.rightOff && side <= f.leftOff) return o.id;
  }
  return null;
}

/** Order: opening > node (ends of the selected wall) > wall > zone. */
export function hitTest(level: Level, p: Pt, tolMm: number, selection: Selection | null): Selection | null {
  const op = openingAt(level, p);
  if (op) return { kind: 'opening', id: op };
  if (selection?.kind === 'wall') {
    const w = level.walls.find(x => x.id === selection.id);
    if (w) {
      for (const id of [w.a, w.b]) {
        const n = level.nodes.find(x => x.id === id);
        if (n && dist(p, n) <= tolMm) return { kind: 'node', id };
      }
    }
  }
  const wall = wallAt(level, p, tolMm);
  if (wall) return { kind: 'wall', id: wall };
  for (const z of level.zones) {
    if (z.outline.length >= 3 && pointInPolygon(p, z.outline)) return { kind: 'zone', id: z.id };
  }
  return null;
}
