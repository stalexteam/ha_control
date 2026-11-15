import { describe, expect, it } from 'vitest';
import { trimWall } from '../../src/model/trim';
import { nodePos } from '../../src/geometry/walls';
import { dist, lerp } from '../../src/geometry/vec';
import {
  deviceDefaults, type Device, type Id, type Level, type Opening, type PlanNode, type Pt, type Wall,
} from '../../src/model/types';

const W = (id: Id, a: Id, b: Id, extra: Partial<Wall> = {}): Wall =>
  ({ id, a, b, thickness: 100, type: 'partition', baseline: 'center', ...extra });
const N = (id: Id, x: number, y: number, host?: { wallId: Id; offset: number }): PlanNode =>
  (host ? { id, x, y, host } : { id, x, y });
const lvl = (nodes: PlanNode[], walls: Wall[], openings: Opening[] = [], devices: Device[] = []): Level =>
  ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes, walls, openings, zones: [], devices });
const op = (id: Id, offset: number, width: number, wallId: Id = 'w'): Opening =>
  ({ id, wallId, kind: 'window', offset, width, outside: 'left', invalid: false });
const dev = (id: Id, offset: number, wallId: Id = 'w'): Device =>
  ({ id, name: id, placement: { mode: 'wall', wallId, side: 'left', offset }, props: deviceDefaults('socket', 'wall'), invalid: false });

/** World point at `offset` along a wall's axis from its node A. */
function along(l: Level, wallId: Id, offset: number): Pt {
  const w = l.walls.find(x => x.id === wallId)!;
  const a = nodePos(l, w.a), b = nodePos(l, w.b);
  return lerp(a, b, offset / dist(a, b));
}
const near = (p: Pt, q: Pt) => {
  expect(p.x).toBeCloseTo(q.x, 6);
  expect(p.y).toBeCloseTo(q.y, 6);
};

/**
 * Wall 'w' from n0 (0,0) to n1 (9000,0), bearing 200 on its left baseline, with T-junctions: 's1' from the
 * T-node t1 (3000,0) and 's2' from t2 (6000,0), both down to y = 2000.
 */
function twoTees(openings: Opening[] = [], devices: Device[] = []): Level {
  return lvl(
    [N('n0', 0, 0), N('n1', 9000, 0), N('t1', 3000, 0, { wallId: 'w', offset: 3000 }),
      N('t2', 6000, 0, { wallId: 'w', offset: 6000 }), N('p1', 3000, 2000), N('p2', 6000, 2000)],
    [W('w', 'n0', 'n1', { thickness: 200, type: 'bearing', baseline: 'left' }), W('s1', 't1', 'p1'), W('s2', 't2', 'p2')],
    openings, devices,
  );
}

describe('trimWall', () => {
  it('T-junctions on both sides split the wall in two', () => {
    const l = trimWall(twoTees(), 'w', { x: 4500, y: 30 });
    expect(l.walls).toHaveLength(4);
    const w = l.walls.find(x => x.id === 'w')!;
    expect([w.a, w.b]).toEqual(['n0', 't1']);
    const w2 = l.walls.find(x => !['w', 's1', 's2'].includes(x.id))!;
    expect(w2).toMatchObject({ a: 't2', b: 'n1', thickness: 200, type: 'bearing', baseline: 'left' });
    expect(l.nodes.map(n => n.id).sort()).toEqual(['n0', 'n1', 'p1', 'p2', 't1', 't2']);
    expect(l.nodes.find(n => n.id === 't1')!.host).toBeUndefined();
    expect(l.nodes.find(n => n.id === 't2')!.host).toBeUndefined();
    expect(nodePos(l, 't1')).toEqual({ x: 3000, y: 0 });
    expect(nodePos(l, 't2')).toEqual({ x: 6000, y: 0 });
  });

  it('crossings split at the crossing points with T-nodes hosted on the crossing walls', () => {
    const base = lvl(
      [N('n0', 0, 0), N('n1', 6000, 0), N('c1a', 2000, -1000), N('c1b', 2000, 1000), N('c2a', 4000, -500), N('c2b', 4000, 1500)],
      [W('w', 'n0', 'n1'), W('c1', 'c1a', 'c1b'), W('c2', 'c2a', 'c2b')],
    );
    const l = trimWall(base, 'w', { x: 3000, y: 0 });
    expect(l.walls).toHaveLength(4);
    const w = l.walls.find(x => x.id === 'w')!;
    expect(w.a).toBe('n0');
    const x1 = l.nodes.find(n => n.id === w.b)!;
    expect(x1).toMatchObject({ x: 2000, y: 0, host: { wallId: 'c1', offset: 1000 } });
    const w2 = l.walls.find(x => !['w', 'c1', 'c2'].includes(x.id))!;
    expect(w2.b).toBe('n1');
    const x2 = l.nodes.find(n => n.id === w2.a)!;
    expect(x2).toMatchObject({ x: 4000, y: 0, host: { wallId: 'c2', offset: 500 } });
    // The crossing walls are untouched.
    expect(l.walls.find(x => x.id === 'c1')).toEqual(base.walls[1]);
    expect(l.walls.find(x => x.id === 'c2')).toEqual(base.walls[2]);
  });

  it('a crossing at the end of another wall reuses its end node', () => {
    // c2 starts 0.5 mm below the axis of w: the crossing is within 1 mm of its end node c2a.
    const base = lvl(
      [N('n0', 0, 0), N('n1', 6000, 0), N('c1a', 2000, -1000), N('c1b', 2000, 1000), N('c2a', 4000, 0.5), N('c2b', 4000, 1500)],
      [W('w', 'n0', 'n1'), W('c1', 'c1a', 'c1b'), W('c2', 'c2a', 'c2b')],
    );
    const l = trimWall(base, 'w', { x: 4500, y: 0 });
    const w = l.walls.find(x => x.id === 'w')!;
    expect(w.b).toBe('c2a');
    expect(l.walls).toHaveLength(3);
    expect(l.nodes.find(n => n.id === 'c2a')!.host).toBeUndefined();
    expect(l.nodes.some(n => n.id === 'n1')).toBe(false);
  });

  it('one-sided trim shortens and drops the orphan node', () => {
    const base = lvl(
      [N('n0', 0, 0), N('n1', 6000, 0), N('t1', 2000, 0, { wallId: 'w', offset: 2000 }), N('p1', 2000, 3000)],
      [W('w', 'n0', 'n1'), W('s1', 't1', 'p1')],
    );
    // Cut piece holds node B.
    const b = trimWall(base, 'w', { x: 4000, y: 0 });
    expect(b.walls.find(x => x.id === 'w')).toMatchObject({ a: 'n0', b: 't1' });
    expect(b.walls).toHaveLength(2);
    expect(b.nodes.map(n => n.id).sort()).toEqual(['n0', 'p1', 't1']);
    expect(b.nodes.find(n => n.id === 't1')!.host).toBeUndefined();
    // Cut piece holds node A.
    const a = trimWall(base, 'w', { x: 1000, y: 0 });
    expect(a.walls.find(x => x.id === 'w')).toMatchObject({ a: 't1', b: 'n1' });
    expect(a.walls).toHaveLength(2);
    expect(a.nodes.map(n => n.id).sort()).toEqual(['n1', 'p1', 't1']);
  });

  it('no intersections deletes the wall', () => {
    const base = lvl(
      [N('n0', 0, 0), N('n1', 6000, 0), N('m0', 0, 3000), N('m1', 6000, 3000)],
      [W('w', 'n0', 'n1'), W('v', 'm0', 'm1')],
      [op('o1', 1000, 900)], [dev('d1', 3000)],
    );
    const l = trimWall(base, 'w', { x: 3000, y: 0 });
    expect(l.walls.map(w => w.id)).toEqual(['v']);
    expect(l.nodes.map(n => n.id)).toEqual(['m0', 'm1']);
    expect(l.openings).toEqual([]);
    expect(l.devices).toEqual([]);
  });

  it('items on the cut piece are deleted; items on kept parts keep their world position', () => {
    const base = twoTees(
      // o4 is centred on the first part but runs past its end: kept and flagged invalid.
      [op('o1', 1000, 900), op('o2', 4000, 900), op('o3', 7000, 900), op('o4', 2700, 400)],
      [dev('d1', 500), dev('d2', 5000), dev('d3', 8000)],
    );
    const l = trimWall(base, 'w', { x: 4500, y: 0 });
    const w2 = l.walls.find(x => !['w', 's1', 's2'].includes(x.id))!.id;
    expect(l.openings.map(o => o.id)).toEqual(['o1', 'o3', 'o4']);
    expect(l.devices.map(d => d.id)).toEqual(['d1', 'd3']);
    const o = (id: Id) => l.openings.find(x => x.id === id)!;
    expect(o('o1')).toMatchObject({ wallId: 'w', offset: 1000, invalid: false });
    expect(o('o3')).toMatchObject({ wallId: w2, offset: 1000, invalid: false });
    expect(o('o4')).toMatchObject({ wallId: 'w', offset: 2700, invalid: true });
    near(along(l, w2, o('o3').offset), along(base, 'w', 7000));
    const d = (id: Id) => l.devices.find(x => x.id === id)!.placement;
    expect(d('d1')).toMatchObject({ wallId: 'w', offset: 500 });
    expect(d('d3')).toMatchObject({ wallId: w2, offset: 2000, side: 'left' });
    near(along(l, w2, 2000), along(base, 'w', 8000));
  });

  it('one-sided trim at node A moves the kept items to the new start', () => {
    const base = lvl(
      [N('n0', 0, 0), N('n1', 6000, 0), N('t1', 2000, 0, { wallId: 'w', offset: 2000 }), N('p1', 2000, 3000),
        N('t3', 5000, 0, { wallId: 'w', offset: 5000 }), N('p3', 5000, -2000)],
      [W('w', 'n0', 'n1'), W('s1', 't1', 'p1'), W('s3', 't3', 'p3')],
      [op('o1', 500, 900), op('o2', 3000, 900)], [dev('d1', 1000), dev('d2', 4000)],
    );
    const l = trimWall(base, 'w', { x: 1000, y: 0 });
    expect(l.walls.find(x => x.id === 'w')).toMatchObject({ a: 't1', b: 'n1' });
    expect(l.openings.map(o => [o.id, o.wallId, o.offset])).toEqual([['o2', 'w', 1000]]);
    expect(l.devices.map(d => d.placement)).toMatchObject([{ wallId: 'w', offset: 2000 }]);
    expect(l.nodes.find(n => n.id === 't3')).toMatchObject({ x: 5000, y: 0, host: { wallId: 'w', offset: 3000 } });
  });

  it('a T-node of another wall hosted on the second part moves to the new wall', () => {
    const base = twoTees();
    base.nodes.push(N('t0', 1000, 0, { wallId: 'w', offset: 1000 }), N('p0', 1000, -2000),
      N('t3', 7500, 0, { wallId: 'w', offset: 7500 }), N('p3', 7500, -2000));
    base.walls.push(W('s0', 't0', 'p0'), W('s3', 't3', 'p3'));
    const l = trimWall(base, 'w', { x: 4500, y: 0 });
    const w2 = l.walls.find(x => !['w', 's0', 's1', 's2', 's3'].includes(x.id))!.id;
    expect(l.nodes.find(n => n.id === 't3')).toMatchObject({ x: 7500, y: 0, host: { wallId: w2, offset: 1500 } });
    expect(l.nodes.find(n => n.id === 't0')).toMatchObject({ x: 1000, y: 0, host: { wallId: 'w', offset: 1000 } });
  });

  it('the input level is unchanged', () => {
    const base = twoTees([op('o1', 1000, 900), op('o3', 7000, 900)], [dev('d3', 8000)]);
    const copy = structuredClone(base);
    trimWall(base, 'w', { x: 4500, y: 0 });
    trimWall(base, 'w', { x: 7500, y: 0 });
    expect(base).toEqual(copy);
    expect(trimWall(base, 'nope', { x: 0, y: 0 })).toBe(base);
  });
});
