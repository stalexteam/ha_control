import type { Pt } from '../model/types';

export function add(a: Pt, b: Pt): Pt { return { x: a.x + b.x, y: a.y + b.y }; }
export function sub(a: Pt, b: Pt): Pt { return { x: a.x - b.x, y: a.y - b.y }; }
export function scale(a: Pt, k: number): Pt { return { x: a.x * k, y: a.y * k }; }
export function dot(a: Pt, b: Pt): number { return a.x * b.x + a.y * b.y; }
export function cross(a: Pt, b: Pt): number { return a.x * b.y - a.y * b.x; }
export function len(a: Pt): number { return Math.hypot(a.x, a.y); }
export function dist(a: Pt, b: Pt): number { return len(sub(b, a)); }

export function norm(a: Pt): Pt {
  const l = len(a);
  return l === 0 ? { x: 0, y: 0 } : scale(a, 1 / l);
}

/** Left normal in SVG (Y down) coordinates: (d.y, -d.x). */
export function perpLeft(d: Pt): Pt { return { x: d.y, y: -d.x }; }

export function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Intersection of line p1 + t*d1 and p2 + s*d2; null when (near) parallel. */
export function lineIntersect(p1: Pt, d1: Pt, p2: Pt, d2: Pt): Pt | null {
  const den = cross(d1, d2);
  if (Math.abs(den) < 1e-9) return null;
  const t = cross(sub(p2, p1), d2) / den;
  return add(p1, scale(d1, t));
}

/** Parameter t of the projection of p onto segment a->b (t=0 at a, 1 at b), not clamped. */
export function projectT(p: Pt, a: Pt, b: Pt): number {
  const ab = sub(b, a);
  const l2 = dot(ab, ab);
  if (l2 === 0) return 0;
  return dot(sub(p, a), ab) / l2;
}

/** Ray-casting point-in-polygon test. */
export function pointInPolygon(p: Pt, ring: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/** Signed area (shoelace). Positive for counter-clockwise in math coords. */
export function polygonArea(ring: Pt[]): number {
  let s = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    s += a.x * b.y - b.x * a.y;
  }
  return s / 2;
}
