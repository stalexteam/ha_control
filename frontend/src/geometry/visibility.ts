import type { Level, Opening, Pt } from '../model/types';
import { passesLight, passesPir } from '../model/openings';
import { dist, distToSegment } from './vec';
import { unionOf, wallPieces } from './walls';

/** What a device's cone carries: light (wall and ceiling lights) or motion (motion sensors). */
export type Medium = 'light' | 'motion';
/** An obstacle edge from one point to another. */
export type Segment = [Pt, Pt];

/** Angle step of the uniform ray fan that keeps the arcs (degrees). */
export const FAN_STEP_DEG = 2;
const FAN_RAYS = Math.ceil(360 / FAN_STEP_DEG);
/** Rays either side of an obstacle endpoint (radians), so the polygon sees past a corner. */
const SIDE = 1e-4;
/** A hit must lie ahead of the origin (mm). */
const T_EPS = 1e-9;
/** Tolerance at a segment's ends (fraction of its length), so a ray aimed at a corner hits it. */
const U_EPS = 1e-9;

/** Openings each medium passes: light through an effective passesLight, motion through an effective passesPir. */
const PASSES: Record<Medium, (o: Opening) => boolean> = {
  light: passesLight,
  motion: passesPir,
};

/**
 * Line-of-sight obstacles: the edges of the union of every wall of every type, cut by the valid openings the medium
 * passes (an invalid opening never cuts).
 */
export function lineOfSightObstacles(level: Level, medium: Medium): Segment[] {
  const segs: Segment[] = [];
  for (const poly of unionOf([...wallPieces(level, PASSES[medium]).values()].flat())) {
    for (const ring of poly) {
      for (let i = 0; i < ring.length; i++) segs.push([ring[i], ring[(i + 1) % ring.length]]);
    }
  }
  return segs;
}

/** The obstacles that come within `radius` of `origin`. */
export function obstaclesWithin(origin: Pt, obstacles: Segment[], radius: number): Segment[] {
  return obstacles.filter(([a, b]) => distToSegment(origin, a, b) <= radius);
}

/** Angle wrapped to [-pi, pi). */
function wrapPi(a: number): number {
  return a < -Math.PI ? a + 2 * Math.PI : a >= Math.PI ? a - 2 * Math.PI : a;
}

/**
 * The region seen from `origin` past the obstacle segments, clipped to the circle of `radius`: a star-shaped ring,
 * counter-clockwise (positive polygonArea), unclosed. Rays are cast at every obstacle endpoint within 1.05 radius
 * (and 1e-4 rad either side of it) plus a uniform fan every FAN_STEP_DEG degrees; each ends at the nearest hit or at
 * `radius`. The fan's chords lie inside the circle by at most radius * (1 - cos(FAN_STEP_DEG / 2)).
 */
export function visibilityPolygon(origin: Pt, obstacles: Segment[], radius: number): Pt[] {
  const segs = obstaclesWithin(origin, obstacles, radius);
  const angles: number[] = [];
  for (let i = 0; i < FAN_RAYS; i++) angles.push(-Math.PI + (2 * Math.PI * i) / FAN_RAYS);
  const far = radius * 1.05;
  for (const s of segs) {
    for (const p of s) {
      if (dist(origin, p) > far) continue;
      const a = Math.atan2(p.y - origin.y, p.x - origin.x);
      angles.push(wrapPi(a - SIDE), wrapPi(a), wrapPi(a + SIDE));
    }
  }
  angles.sort((a, b) => a - b);
  // Segments relative to the origin, as flat numbers: w = start - origin, e = end - start.
  const n = segs.length;
  const wx = new Float64Array(n), wy = new Float64Array(n), ex = new Float64Array(n), ey = new Float64Array(n);
  segs.forEach(([p, q], i) => { wx[i] = p.x - origin.x; wy[i] = p.y - origin.y; ex[i] = q.x - p.x; ey[i] = q.y - p.y; });
  const ring: Pt[] = [];
  const hitOf: number[] = []; // per ring point: the segment it lies on, -1 on the circle
  let prev = NaN;
  for (const a of angles) {
    if (a === prev) continue;
    prev = a;
    const dx = Math.cos(a), dy = Math.sin(a);
    let t = radius, hit = -1;
    for (let i = 0; i < n; i++) {
      // origin + t*d = start + u*e: t = cross(w, e) / cross(d, e), u = cross(w, d) / cross(d, e).
      const den = dx * ey[i] - dy * ex[i];
      if (Math.abs(den) < 1e-12) continue; // parallel
      const tt = (wx[i] * ey[i] - wy[i] * ex[i]) / den;
      if (!(tt > T_EPS && tt < t)) continue;
      const u = (wx[i] * dy - wy[i] * dx) / den;
      if (u < -U_EPS || u > 1 + U_EPS) continue;
      t = tt;
      hit = i;
    }
    const pt = { x: origin.x + dx * t, y: origin.y + dy * t };
    const k = ring.length;
    if (k > 0 && ring[k - 1].x === pt.x && ring[k - 1].y === pt.y) continue;
    // Three points in a row on one segment are collinear: the middle one adds nothing (fewer vertices to clip).
    if (hit >= 0 && k >= 2 && hitOf[k - 1] === hit && hitOf[k - 2] === hit) { ring[k - 1] = pt; continue; }
    ring.push(pt);
    hitOf.push(hit);
  }
  const first = ring[0], last = ring[ring.length - 1];
  if (ring.length > 1 && first.x === last.x && first.y === last.y) ring.pop();
  return ring;
}
