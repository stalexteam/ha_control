import type { Id, Level, Pt } from '../model/types';
import { wallFrame, wallLocal, wallOutlines } from '../geometry/walls';
import { dist, distToSegment, pointInPolygon, polygonArea } from '../geometry/vec';
import { zoneOutline } from '../geometry/zones';
import type { Selection } from './tools/types';

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

/** The smallest zone whose outline contains p (ties: level order), or null. */
function zoneAt(level: Level, p: Pt): Id | null {
  let best: { id: Id; area: number } | null = null;
  for (const z of level.zones) {
    const o = zoneOutline(level, z);
    if (o.length < 3 || !pointInPolygon(p, o)) continue;
    const area = Math.abs(polygonArea(o));
    if (!best || area < best.area) best = { id: z.id, area };
  }
  return best?.id ?? null;
}

/** Order: opening > node (ends of the selected wall) > wall > zone (the smallest one where zones overlap). */
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
  const zone = zoneAt(level, p);
  return zone ? { kind: 'zone', id: zone } : null;
}
