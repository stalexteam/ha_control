import { describe, it, expect } from 'vitest';
import type { Pt } from '../../src/model/types';
import { lineOfSightObstacles, visibilityPolygon, type Segment } from '../../src/geometry/visibility';
import { pointInPolygon, polygonArea } from '../../src/geometry/vec';
import { midGap as gap, twoRoomsLevel as twoRooms } from '../fixtures';

/** Closed ring as obstacle segments. */
const ringSegs = (pts: Pt[]): Segment[] => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);

/** True when the straight path a-b crosses no obstacle segment. */
function clearPath(a: Pt, b: Pt, segs: Segment[]): boolean {
  const cr = (u: Pt, v: Pt) => u.x * v.y - u.y * v.x;
  const d = { x: b.x - a.x, y: b.y - a.y };
  return !segs.some(([p, q]) => {
    const e = { x: q.x - p.x, y: q.y - p.y };
    const den = cr(d, e);
    if (Math.abs(den) < 1e-12) return false;
    const w = { x: p.x - a.x, y: p.y - a.y };
    const t = cr(w, e) / den, u = cr(w, d) / den;
    return t > 0 && t < 1 && u >= 0 && u <= 1;
  });
}

describe('visibilityPolygon', () => {
  it('visibilityPolygon in an empty room is the room', () => {
    const square = ringSegs([{ x: 0, y: 0 }, { x: 1000, y: 0 }, { x: 1000, y: 1000 }, { x: 0, y: 1000 }]);
    const poly = visibilityPolygon({ x: 500, y: 500 }, square, 100000);
    expect(Math.abs(Math.abs(polygonArea(poly)) - 1e6) / 1e6).toBeLessThan(0.01);
    expect(polygonArea(poly)).toBeGreaterThan(0); // counter-clockwise (positive shoelace area)
    expect(poly.length).toBeLessThanOrEqual(16); // fan hits along one wall are merged, not one vertex per ray
  });

  it('an L-shaped room hides the far leg', () => {
    const l = ringSegs([
      { x: 0, y: 0 }, { x: 2000, y: 0 }, { x: 2000, y: 1000 }, { x: 1000, y: 1000 }, { x: 1000, y: 3000 }, { x: 0, y: 3000 },
    ]);
    const poly = visibilityPolygon({ x: 1800, y: 500 }, l, 100000);
    expect(pointInPolygon({ x: 900, y: 2800 }, poly)).toBe(false); // far leg, behind the inner corner
    expect(pointInPolygon({ x: 500, y: 500 }, poly)).toBe(true);
    expect(pointInPolygon({ x: 100, y: 1200 }, poly)).toBe(true); // far leg, seen past the corner
  });

  it('radius limits the polygon', () => {
    const poly = visibilityPolygon({ x: 0, y: 0 }, [], 1000);
    expect(Math.abs(Math.abs(polygonArea(poly)) - Math.PI * 1e6) / (Math.PI * 1e6)).toBeLessThan(0.02);
    for (const p of poly) expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(1000 + 1e-6);
  });

  it('a wall within the radius cuts the disc, one beyond it does not', () => {
    const near = visibilityPolygon({ x: 0, y: 0 }, [[{ x: 500, y: -5000 }, { x: 500, y: 5000 }]], 1000);
    for (const p of near) expect(p.x).toBeLessThanOrEqual(500 + 1e-6);
    const far = visibilityPolygon({ x: 0, y: 0 }, [[{ x: 1500, y: -5000 }, { x: 1500, y: 5000 }]], 1000);
    expect(Math.abs(polygonArea(far))).toBeCloseTo(Math.abs(polygonArea(visibilityPolygon({ x: 0, y: 0 }, [], 1000))), 3);
  });
});

describe('lineOfSightObstacles', () => {
  const through = { x: 1000, y: 1500 }, beyond = { x: 4500, y: 1500 };

  it('walls without openings block both media', () => {
    for (const m of ['light', 'motion'] as const) expect(clearPath(through, beyond, lineOfSightObstacles(twoRooms(), m))).toBe(false);
  });

  it('an opening (kind opening) is a gap for light and motion', () => {
    const lv = twoRooms([gap('opening')]);
    for (const m of ['light', 'motion'] as const) expect(clearPath(through, beyond, lineOfSightObstacles(lv, m))).toBe(true);
  });

  it('a door, gate, wicket or plain window is not a gap', () => {
    for (const kind of ['door', 'gate', 'wicket', 'window'] as const) {
      const lv = twoRooms([gap(kind)]);
      for (const m of ['light', 'motion'] as const) expect(clearPath(through, beyond, lineOfSightObstacles(lv, m))).toBe(false);
    }
  });

  it('passesLight opens the gap for light only; an opening with passesLight false still lets motion through', () => {
    const win = twoRooms([gap('window', { passesLight: true })]);
    expect(clearPath(through, beyond, lineOfSightObstacles(win, 'light'))).toBe(true);
    expect(clearPath(through, beyond, lineOfSightObstacles(win, 'motion'))).toBe(false);
    const dark = twoRooms([gap('opening', { passesLight: false })]);
    expect(clearPath(through, beyond, lineOfSightObstacles(dark, 'light'))).toBe(false);
    expect(clearPath(through, beyond, lineOfSightObstacles(dark, 'motion'))).toBe(true);
  });

  it('an invalid opening never cuts', () => {
    const lv = twoRooms([gap('opening', { invalid: true })]);
    for (const m of ['light', 'motion'] as const) expect(clearPath(through, beyond, lineOfSightObstacles(lv, m))).toBe(false);
  });

  it('no walls -> no obstacles', () => {
    expect(lineOfSightObstacles({ ...twoRooms(), walls: [], nodes: [] }, 'light')).toEqual([]);
  });
});
