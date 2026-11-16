import { describe, it, expect } from 'vitest';
import type { Level, Pt, Wall } from '../../src/model/types';
import {
  findNode, fromRing, nodePos, segmentFrame, toPoly, wallCorners, wallFrame, wallLen, wallLocal, wallOutlines, wallPieces, wallsUnion,
} from '../../src/geometry/walls';
import { polygonArea } from '../../src/geometry/vec';
import { rectRoomLevel } from '../fixtures';

const lvl = (nodes: Level['nodes'], walls: Wall[], openings: Level['openings'] = []): Level =>
  ({ id: 'l', name: 'L', kind: 'floor', order: 0, nodes, walls, openings, zones: [], devices: [] });
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

describe('segmentFrame', () => {
  it('face offsets from the baseline; wallFrame is segmentFrame of the wall nodes', () => {
    const a = { x: 0, y: 0 }, b = { x: 0, y: 500 };
    expect(segmentFrame(a, b, 200, 'left')).toEqual({ a, b, dir: { x: 0, y: 1 }, len: 500, leftOff: 0, rightOff: 200 });
    expect(segmentFrame(a, b, 200, 'right')).toMatchObject({ leftOff: 200, rightOff: 0 });
    expect(segmentFrame(a, b, 200, 'center')).toMatchObject({ leftOff: 100, rightOff: 100 });
    const l = lvl([{ id: 'a', ...a }, { id: 'b', ...b }], [wall('w', 'a', 'b', 200, 'right')]);
    expect(wallFrame(l, l.walls[0])).toEqual(segmentFrame(a, b, 200, 'right'));
  });
});

describe('polygon-clipping ring conversion', () => {
  it('toPoly wraps the ring as pairs; fromRing drops the closing duplicate only', () => {
    expect(toPoly([{ x: 1, y: 2 }, { x: 3, y: 4 }])).toEqual([[[1, 2], [3, 4]]]);
    expect(fromRing([[0, 0], [5, 0], [5, 5], [0, 0]])).toEqual([{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 5 }]);
    expect(fromRing([[0, 0], [5, 0], [5, 5]])).toEqual([{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 5 }]);
    expect(fromRing([[1, 1]])).toEqual([{ x: 1, y: 1 }]);
  });
});

describe('node and wall lookups', () => {
  it('nodePos returns a copy of the node position; findNode the node itself; both throw when missing', () => {
    const l = rectRoomLevel(3000, 4000, 400);
    expect(findNode(l, 'n2')).toBe(l.nodes[2]);
    const p = nodePos(l, 'n2');
    expect(p).toEqual({ x: 3000, y: 4000 });
    expect(p).not.toBe(l.nodes[2]);
    expect(() => nodePos(l, 'x')).toThrow('node not found: x');
    expect(() => findNode(l, 'x')).toThrow('node not found: x');
  });
  it('wallLen: axis length, null when the wall or one of its nodes is missing', () => {
    const l = rectRoomLevel(3000, 4000, 400);
    expect(wallLen(l, 'w1')).toBe(4000);
    expect(wallLen(l, 'nope')).toBeNull();
    expect(wallLen({ ...l, nodes: l.nodes.filter(n => n.id !== 'n1') }, 'w0')).toBeNull();
  });
  it('wallLocal: t along the axis from A, side > 0 on the left face (perpLeft), < 0 on the right', () => {
    // A (0,0) -> B (0,1000): dir (0,1), perpLeft (1,0).
    const l = lvl([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 0, y: 1000 }], [wall('w', 'a', 'b', 200)]);
    const f = wallFrame(l, l.walls[0]);
    expect(wallLocal(f, { x: 30, y: 400 })).toEqual({ t: 400, side: 30 });
    expect(wallLocal(f, { x: -50, y: -20 })).toEqual({ t: -20, side: -50 });
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

describe('nodes with collinear-opposite walls and a side wall', () => {
  const area = (l: Level) => {
    const u = wallsUnion(l, false);
    expect(u).toHaveLength(1);
    expect(u[0]).toHaveLength(1);
    return Math.abs(polygonArea(u[0][0]));
  };
  const inUnion = (l: Level, p: Pt) => {
    const ring = wallsUnion(l, false)[0][0];
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i], b = ring[j];
      if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };

  // Every outline stays a simple polygon (hit-testing relies on it).
  const simple = (l: Level) => {
    for (const ring of wallOutlines(l).values()) {
      const m = ring.length;
      const seg = (i: number): [Pt, Pt] => [ring[i], ring[(i + 1) % m]];
      const o = (a: Pt, b: Pt, c: Pt) => Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
      for (let i = 0; i < m; i++) for (let j = i + 2; j < m; j++) {
        if (i === 0 && j === m - 1) continue;
        const [p1, p2] = seg(i), [p3, p4] = seg(j);
        const crosses = o(p1, p2, p3) * o(p1, p2, p4) < 0 && o(p3, p4, p1) * o(p3, p4, p2) < 0;
        expect(crosses).toBe(false);
      }
    }
  };

  // Live-plan node (9890, 890): bearing 220 going +X and +Y, railing 40 going -Y.
  const liveNode = () => {
    const l = lvl([
      { id: 'n', x: 9890, y: 890 }, { id: 'e', x: 12890, y: 890 },
      { id: 's', x: 9890, y: 2890 }, { id: 'u', x: 9890, y: -610 },
    ], [
      { ...wall('w1', 'n', 'e', 220), type: 'bearing' },
      { ...wall('w2', 'n', 's', 220), type: 'bearing' },
      { ...wall('w3', 'n', 'u', 40), type: 'railing' },
    ]);
    return l;
  };

  it('thick L with a railing on top: clean outer corner, no notch or sliver', () => {
    const l = liveNode();
    expect(inUnion(l, { x: 9800, y: 800 })).toBe(true);
    expect(inUnion(l, { x: 9890, y: 850 })).toBe(true);
    // L: (3000 + 110) x 220 + (2000 + 110) x 220 - 220 x 220; railing above y = 780: 40 x (1500 - 110).
    const expected = 3110 * 220 + 2110 * 220 - 220 * 220 + 40 * 1390;
    expect(Math.abs(area(l) - expected)).toBeLessThan(1);
    simple(l);
  });
  it('the railing end stays outside the thick body (ends on its face y = 780)', () => {
    const ring = wallOutlines(liveNode()).get('w3')!;
    for (const q of ring) expect(q.y).toBeLessThanOrEqual(780 + 1e-6);
  });
  it('straight wall split into 300 and 100 with a perpendicular 200 at the split: no notch', () => {
    const l = lvl([
      { id: 'a', x: 0, y: 0 }, { id: 'm', x: 2000, y: 0 }, { id: 'b', x: 4000, y: 0 }, { id: 's', x: 2000, y: 2000 },
    ], [wall('w1', 'a', 'm', 300), wall('w2', 'm', 'b', 100), wall('w3', 'm', 's', 200)]);
    // Thick part reaches the far face of the perpendicular wall (x = 2100).
    const expected = 2100 * 300 + 1900 * 100 + 200 * 1850;
    expect(Math.abs(area(l) - expected)).toBeLessThan(1);
    simple(l);
  });
  it('same split mirrored (thin first, thick second): no notch', () => {
    const l = lvl([
      { id: 'a', x: 0, y: 0 }, { id: 'm', x: 2000, y: 0 }, { id: 'b', x: 4000, y: 0 }, { id: 's', x: 2000, y: 2000 },
    ], [wall('w1', 'a', 'm', 100), wall('w2', 'm', 'b', 300), wall('w3', 'm', 's', 200)]);
    const expected = 2100 * 300 + 1900 * 100 + 200 * 1850;
    expect(Math.abs(area(l) - expected)).toBeLessThan(1);
    simple(l);
  });
  it('T made of three equal walls at one node is exactly the T', () => {
    const l = lvl([
      { id: 'a', x: 0, y: 0 }, { id: 'm', x: 2000, y: 0 }, { id: 'b', x: 4000, y: 0 }, { id: 's', x: 2000, y: 2000 },
    ], [wall('w1', 'a', 'm', 200), wall('w2', 'm', 'b', 200), wall('w3', 'm', 's', 200)]);
    expect(Math.abs(area(l) - (4000 * 200 + 200 * 1900))).toBeLessThan(1);
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
  const fiveKinds = () => lvl([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 12000, y: 0 }], [wall('w', 'a', 'b', 200)],
    (['opening', 'door', 'window', 'gate', 'wicket'] as const).map((kind, i) =>
      ({ id: `o${i}`, wallId: 'w', kind, offset: 1000 + i * 2000, width: 900, invalid: false })));
  it('wallPieces default still cuts every valid opening', () => {
    const l = fiveKinds();
    expect(wallPieces(l).get('w')).toHaveLength(6);
    const bad = { ...l, openings: l.openings.map(o => (o.kind === 'door' ? { ...o, invalid: true } : o)) };
    expect(wallPieces(bad).get('w')).toHaveLength(5); // an invalid opening never cuts
  });
  it('the cut predicate keeps the openings it rejects as solid wall', () => {
    const l = fiveKinds();
    expect(wallPieces(l, o => o.kind === 'opening').get('w')).toHaveLength(2);
    expect(wallPieces(l, () => false).get('w')).toHaveLength(1);
    const bad = { ...l, openings: l.openings.map(o => ({ ...o, invalid: true })) };
    expect(wallPieces(bad, () => true).get('w')).toHaveLength(1); // the predicate never cuts an invalid opening
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

describe('wallCorners', () => {
  const L = lvl([{ id: 'n0', x: 0, y: 0 }, { id: 'n1', x: 4000, y: 0 }, { id: 'n2', x: 4000, y: 3000 }],
    [wall('A', 'n0', 'n1', 100), wall('B', 'n1', 'n2', 100)]);
  const cs = wallCorners(L);
  it('four corners per wall', () => {
    expect(cs.filter(c => c.wallId === 'A')).toHaveLength(4);
    expect(cs).toHaveLength(8);
  });
  it('inner corner of an L: wall A, right face, end b, offset 3950', () => {
    const c = cs.find(x => x.wallId === 'A' && x.end === 'b' && x.side === 'right')!;
    expect(c.pt.x).toBeCloseTo(3950); expect(c.pt.y).toBeCloseTo(50);
    expect(c.offset).toBeCloseTo(3950);
  });
  it('outer corner lies beyond the axis length', () => {
    const c = cs.find(x => x.wallId === 'A' && x.end === 'b' && x.side === 'left')!;
    expect(c.pt.x).toBeCloseTo(4050); expect(c.pt.y).toBeCloseTo(-50);
    expect(c.offset).toBeCloseTo(4050);
  });
  it('a free end gives corners at offset 0', () => {
    const a = cs.filter(x => x.wallId === 'A' && x.end === 'a');
    expect(a.map(x => x.side).sort()).toEqual(['left', 'right']);
    for (const c of a) { expect(c.offset).toBeCloseTo(0); expect(Math.abs(c.pt.y)).toBeCloseTo(50); }
  });
});
