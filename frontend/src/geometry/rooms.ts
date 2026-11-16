/** Outline detection for walls zones: the closed loops (holes) of the wall union. */
import type { Level, Pt } from '../model/types';
import { pointInPolygon, polygonArea } from './vec';
import { wallsUnion } from './walls';

/** All holes of the wall union (no opening cut-outs), i.e. enclosed empty regions. */
export function roomHoles(level: Level): Pt[][] {
  const holes: Pt[][] = [];
  for (const poly of wallsUnion(level, false)) for (const r of poly.slice(1)) holes.push(r);
  return holes;
}

/** The smallest hole containing the seed, or null. */
export function outlineFromHoles(holes: Pt[][], seed: Pt): Pt[] | null {
  let best: Pt[] | null = null;
  let bestArea = Infinity;
  for (const h of holes) {
    if (!pointInPolygon(seed, h)) continue;
    const a = Math.abs(polygonArea(h));
    if (a < bestArea) { best = h; bestArea = a; }
  }
  return best;
}

const TOL = 1e-3;

/** Same ring regardless of start vertex / direction. */
export function sameOutline(a: Pt[], b: Pt[]): boolean {
  if (a.length !== b.length) return false;
  if (Math.abs(Math.abs(polygonArea(a)) - Math.abs(polygonArea(b))) > TOL) return false;
  return a.every(p => b.some(q => Math.abs(p.x - q.x) <= TOL && Math.abs(p.y - q.y) <= TOL));
}
