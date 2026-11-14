import { describe, it, expect } from 'vitest';
import type { Level, Pt, Wall } from '../../src/model/types';
import { wallFrame, wallOutlines, wallPieces, wallsUnion } from '../../src/geometry/walls';
import { polygonArea } from '../../src/geometry/vec';
import { rectRoomLevel } from '../fixtures';

const lvl = (nodes: Level['nodes'], walls: Wall[], openings: Level['openings'] = []): Level =>
  ({ id: 'l', name: 'L', kind: 'floor', order: 0, nodes, walls, openings, zones: [] });
const wall = (id: string, a: string, b: string, thickness: number, baseline: Wall['baseline'] = 'center'): Wall =>
  ({ id, a, b, thickness, type: thickness >= 400 ? 'bearing' : 'partition', baseline });
const has = (ring: Pt[], p: Pt) => ring.some(q => Math.abs(q.x - p.x) < 1e-6 && Math.abs(q.y - p.y) < 1e-6);

describe('wallFrame', () => {
  it('baseline left: leftOff 0, rightOff = thickness', () => {
    const l = lvl([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 1000, y: 0 }], [wall('w', 'a', 'b', 200, 'left')]);
    const f = wallFrame(l, l.walls[0]);
    expect(f.leftOff).toBe(0);
    expect(f.rightOff).toBe(200);
    expect(f.len).toBe(1000);
    expect(f.dir).toEqual({ x: 1, y: 0 });
  });
  it('center and right', () => {
    const l = lvl([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 0, y: 500 }],
      [wall('w', 'a', 'b', 200), wall('v', 'a', 'b', 200, 'right')]);
    expect(wallFrame(l, l.walls[0])).toMatchObject({ leftOff: 100, rightOff: 100 });
    expect(wallFrame(l, l.walls[1])).toMatchObject({ leftOff: 200, rightOff: 0 });
  });
});

describe('wallOutlines', () => {
  it('L-corner of a 400 mm box: outer (-200,-200), inner (200,200)', () => {
    const o = wallOutlines(rectRoomLevel(3000, 4000, 400));
    for (const id of ['w0', 'w3']) {
      const ring = o.get(id)!;
      expect(ring).toBeDefined();
      expect(has(ring, { x: -200, y: -200 })).toBe(true);
      expect(has(ring, { x: 200, y: 200 })).toBe(true);
    }
  });
  it('T-node: partition ends on the host face (y=2800), not the axis', () => {
    const l = lvl([
      { id: 'h0', x: 0, y: 3000 }, { id: 'h1', x: 4000, y: 3000 },
      { id: 'p0', x: 2000, y: 0 }, { id: 't', x: 2000, y: 3000, host: { wallId: 'host', offset: 2000 } },
    ], [wall('host', 'h0', 'h1', 400), wall('p', 'p0', 't', 100)]);
    const ring = wallOutlines(l).get('p')!;
    const bottom = ring.filter(q => q.y > 1000);
    expect(bottom).toHaveLength(2);
    for (const q of bottom) expect(q.y).toBeCloseTo(2800, 6);
    expect(bottom.map(q => q.x).sort((a, b) => a - b)).toEqual([1950, 2050]);
  });
  it('collinear walls through a shared node keep square ends', () => {
    const l = lvl([{ id: 'a', x: 0, y: 0 }, { id: 'm', x: 1000, y: 0 }, { id: 'b', x: 3000, y: 0 }],
      [wall('w1', 'a', 'm', 200), wall('w2', 'm', 'b', 200)]);
    const o = wallOutlines(l);
    expect(has(o.get('w1')!, { x: 1000, y: -100 })).toBe(true);
    expect(has(o.get('w1')!, { x: 1000, y: 100 })).toBe(true);
    const u = wallsUnion(l, false);
    expect(u).toHaveLength(1);
    expect(u[0]).toHaveLength(1);
    expect(Math.abs(polygonArea(u[0][0]))).toBeCloseTo(3000 * 200, 3);
  });
  it('Y-junction of three walls leaves no gap at the node', () => {
    const r = 2000;
    const l = lvl([
      { id: 'n', x: 0, y: 0 },
      { id: 'e', x: r, y: 0 },
      { id: 's', x: -r / 2, y: r * Math.sqrt(3) / 2 },
      { id: 'w', x: -r / 2, y: -r * Math.sqrt(3) / 2 },
    ], [wall('w1', 'n', 'e', 200), wall('w2', 'n', 's', 200), wall('w3', 'w', 'n', 200)]);
    const u = wallsUnion(l, false);
    expect(u).toHaveLength(1);
    expect(u[0]).toHaveLength(1);
  });
});

describe('wallPieces', () => {
  it('opening 900 at offset 1000 in a 3000 wall -> pieces of axis length 1000 and 1100', () => {
    const l = lvl([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 3000, y: 0 }], [wall('w', 'a', 'b', 200)],
      [{ id: 'o', wallId: 'w', kind: 'door', offset: 1000, width: 900, invalid: false }]);
    const pieces = wallPieces(l).get('w')!;
    expect(pieces).toHaveLength(2);
    const lens = pieces.map(p => Math.max(...p.map(q => q.x)) - Math.min(...p.map(q => q.x))).sort((a, b) => a - b);
    expect(lens[0]).toBeCloseTo(1000, 6);
    expect(lens[1]).toBeCloseTo(1100, 6);
  });
  it('wall without openings is a single piece', () => {
    const l = lvl([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 3000, y: 0 }], [wall('w', 'a', 'b', 200)]);
    expect(wallPieces(l).get('w')).toHaveLength(1);
  });
});

describe('wallsUnion', () => {
  it('rectangular room -> 1 polygon with 1 hole', () => {
    const u = wallsUnion(rectRoomLevel(3000, 4000, 400), false);
    expect(u).toHaveLength(1);
    expect(u[0]).toHaveLength(2);
    const outer = Math.abs(polygonArea(u[0][0]));
    const hole = Math.abs(polygonArea(u[0][1]));
    expect(outer).toBeCloseTo(3400 * 4400, 3);
    expect(hole).toBeCloseTo(2600 * 3600, 3);
  });
  it('crossing walls without a node -> 1 polygon, no throw', () => {
    const l = lvl([
      { id: 'a', x: 0, y: 1000 }, { id: 'b', x: 2000, y: 1000 },
      { id: 'c', x: 1000, y: 0 }, { id: 'd', x: 1000, y: 2000 },
    ], [wall('w1', 'a', 'b', 200), wall('w2', 'c', 'd', 200)]);
    let u: Pt[][][] = [];
    expect(() => { u = wallsUnion(l, true); }).not.toThrow();
    expect(u).toHaveLength(1);
  });
  it('cutOpenings splits a lone wall into two polygons', () => {
    const l = lvl([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 3000, y: 0 }], [wall('w', 'a', 'b', 200)],
      [{ id: 'o', wallId: 'w', kind: 'door', offset: 1000, width: 900, invalid: false }]);
    expect(wallsUnion(l, true)).toHaveLength(2);
    expect(wallsUnion(l, false)).toHaveLength(1);
  });
  it('empty level -> []', () => {
    expect(wallsUnion(lvl([], []), true)).toEqual([]);
  });
});
