import { describe, it, expect } from 'vitest';
import type { Level } from '../../src/model/types';
import {
  addBox, addWallSegment, deleteWall, detachWallEnd, finalize, mergeNodes, moveNode, moveWall, setWallProps,
  type WallProps,
} from '../../src/model/ops';
import { nodePos } from '../../src/geometry/walls';
import { addOpening } from '../../src/model/openings';
import { addDevice } from '../../src/model/devices';
import { deviceDefaults } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';

const bearing400: WallProps = { type: 'bearing', thickness: 400, baseline: 'center' };
const part100: WallProps = { type: 'partition', thickness: 100, baseline: 'center' };
const empty = (): Level => ({ id: 'l', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });
const pts = (l: Level) => l.nodes.map(n => ({ x: n.x, y: n.y }));

describe('addBox', () => {
  it('inner expands by thickness/2', () => {
    const l = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, bearing400, 'inner');
    expect(l.walls).toHaveLength(4);
    expect(pts(l)).toEqual([{ x: -200, y: -200 }, { x: 3200, y: -200 }, { x: 3200, y: 4200 }, { x: -200, y: 4200 }]);
    for (const n of l.nodes) expect(l.walls.filter(w => w.a === n.id || w.b === n.id)).toHaveLength(2);
    expect(l.walls.every(w => w.baseline === 'center')).toBe(true);
  });
  it('outer shrinks', () => {
    const l = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, bearing400, 'outer');
    expect(pts(l)).toEqual([{ x: 200, y: 200 }, { x: 2800, y: 200 }, { x: 2800, y: 3800 }, { x: 200, y: 3800 }]);
  });
  it('axis exact', () => {
    const l = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, bearing400, 'axis');
    expect(pts(l)).toEqual([{ x: 0, y: 0 }, { x: 3000, y: 0 }, { x: 3000, y: 4000 }, { x: 0, y: 4000 }]);
  });
});

describe('addWallSegment', () => {
  it('chain closes onto start node: 3 walls, 3 nodes', () => {
    const r1 = addWallSegment(empty(), { kind: 'free', pt: { x: 0, y: 0 } }, { kind: 'free', pt: { x: 1000, y: 0 } }, part100);
    const start = r1.level.walls[0].a;
    const r2 = addWallSegment(r1.level, { kind: 'node', nodeId: r1.endNodeId! }, { kind: 'free', pt: { x: 500, y: 800 } }, part100);
    const r3 = addWallSegment(r2.level, { kind: 'node', nodeId: r2.endNodeId! }, { kind: 'node', nodeId: start }, part100);
    expect(r3.level.walls).toHaveLength(3);
    expect(r3.level.nodes).toHaveLength(3);
    expect(r3.endNodeId).toBe(start);
  });
  it('no-op when points closer than 1mm', () => {
    const l = empty();
    const same = addWallSegment(l, { kind: 'free', pt: { x: 5, y: 5 } }, { kind: 'free', pt: { x: 5, y: 5 } }, part100);
    expect(same.wallId).toBeNull();
    expect(same.endNodeId).toBeNull();
    expect(same.level).toEqual(l);
    const near = addWallSegment(l, { kind: 'free', pt: { x: 5, y: 5 } }, { kind: 'free', pt: { x: 5.5, y: 5 } }, part100);
    expect(near.wallId).toBeNull();
    expect(near.level).toEqual(l);
  });
  it('T-node follows host', () => {
    const room = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, bearing400, 'axis');
    const top = room.walls[0].id;
    const r = addWallSegment(room, { kind: 'wall', wallId: top, offset: 1500 }, { kind: 'free', pt: { x: 1500, y: 2000 } }, part100);
    const t = r.level.nodes.find(n => n.host)!;
    expect(t.host).toEqual({ wallId: top, offset: 1500 });
    expect({ x: t.x, y: t.y }).toEqual({ x: 1500, y: 0 });
    const moved = moveWall(r.level, top, { x: 0, y: 500 });
    const t2 = moved.nodes.find(n => n.id === t.id)!;
    expect(t2.y).toBe(500);
    expect(t2.x).toBe(1500);
    expect(t2.host!.offset).toBe(1500);
  });
  it('offset near wall end reuses end node', () => {
    const room = rectRoomLevel(3000, 4000, 400);
    const r = addWallSegment(room, { kind: 'wall', wallId: 'w0', offset: 0.5 }, { kind: 'free', pt: { x: 0, y: 2000 } }, part100);
    expect(r.level.nodes).toHaveLength(5);
    expect(r.level.nodes.some(n => n.host)).toBe(false);
    expect(r.level.walls.find(x => x.id === r.wallId)!.a).toBe('n0');
    const r2 = addWallSegment(room, { kind: 'wall', wallId: 'w0', offset: 2999.5 }, { kind: 'free', pt: { x: 3000, y: 2000 } }, part100);
    expect(r2.level.walls.find(x => x.id === r2.wallId)!.a).toBe('n1');
  });
});

describe('moveNode / moveWall / detach / delete', () => {
  it('T-node moved off axis snaps onto host axis, clamped', () => {
    const room = rectRoomLevel(3000, 4000, 400);
    const r = addWallSegment(room, { kind: 'wall', wallId: 'w0', offset: 1500 }, { kind: 'free', pt: { x: 1500, y: 2000 } }, part100);
    const tid = r.level.nodes.find(n => n.host)!.id;
    const m = moveNode(r.level, tid, { x: 2000, y: 900 });
    const t = m.nodes.find(n => n.id === tid)!;
    expect(t).toMatchObject({ x: 2000, y: 0 });
    expect(t.host!.offset).toBe(2000);
    const t2 = moveNode(r.level, tid, { x: 9000, y: 900 }).nodes.find(n => n.id === tid)!;
    expect(t2).toMatchObject({ x: 3000, y: 0 });
    expect(t2.host!.offset).toBe(3000);
    const t3 = moveNode(r.level, tid, { x: -50, y: 0 }).nodes.find(n => n.id === tid)!;
    expect(t3.host!.offset).toBe(0);
  });
  it('moving shared corner changes both walls', () => {
    const room = rectRoomLevel(3000, 4000, 400);
    const m = moveNode(room, 'n1', { x: 3500, y: -100 });
    expect(nodePos(m, 'n1')).toEqual({ x: 3500, y: -100 });
    expect(m.walls.filter(w => w.a === 'n1' || w.b === 'n1')).toHaveLength(2);
    expect(nodePos(m, 'n0')).toEqual({ x: 0, y: 0 });
  });
  it('moveWall drags both nodes', () => {
    const m = moveWall(rectRoomLevel(3000, 4000, 400), 'w0', { x: 10, y: 20 });
    expect(nodePos(m, 'n0')).toEqual({ x: 10, y: 20 });
    expect(nodePos(m, 'n1')).toEqual({ x: 3010, y: 20 });
    expect(nodePos(m, 'n2')).toEqual({ x: 3000, y: 4000 });
  });
  it('detachWallEnd splits node', () => {
    const { level, nodeId } = detachWallEnd(rectRoomLevel(3000, 4000, 400), 'w0', 'b');
    expect(nodeId).not.toBe('n1');
    expect(level.walls.find(w => w.id === 'w0')!.b).toBe(nodeId);
    expect(level.walls.find(w => w.id === 'w1')!.a).toBe('n1');
    expect(nodePos(level, nodeId)).toEqual({ x: 3000, y: 0 });
    const m = moveNode(level, nodeId, { x: 3000, y: -500 });
    expect(nodePos(m, 'n1')).toEqual({ x: 3000, y: 0 });
  });
  it('deleteWall: host loses host, orphans and openings removed', () => {
    const room = rectRoomLevel(3000, 4000, 400);
    const r = addWallSegment(room, { kind: 'wall', wallId: 'w0', offset: 1500 }, { kind: 'free', pt: { x: 1500, y: 2000 } }, part100);
    const l0 = structuredClone(r.level);
    l0.openings.push({ id: 'o1', wallId: 'w0', kind: 'door', offset: 500, width: 900, invalid: false });
    l0.openings.push({ id: 'o2', wallId: r.wallId!, kind: 'door', offset: 500, width: 900, invalid: false });
    const tid = l0.nodes.find(n => n.host)!.id;
    const d = deleteWall(l0, 'w0');
    expect(d.walls.find(w => w.id === 'w0')).toBeUndefined();
    expect(d.openings.map(o => o.id)).toEqual(['o2']);
    const t = d.nodes.find(n => n.id === tid)!;
    expect(t).toBeDefined();
    expect(t.host).toBeUndefined();
    expect(d.nodes.every(n => d.walls.some(w => w.a === n.id || w.b === n.id))).toBe(true);
    const d2 = deleteWall(d, r.wallId!);
    expect(d2.nodes.find(n => n.id === tid)).toBeUndefined();
  });
  it('setWallProps patches', () => {
    const l = setWallProps(rectRoomLevel(3000, 4000, 400), 'w0', { thickness: 200, baseline: 'left' });
    expect(l.walls[0]).toMatchObject({ thickness: 200, baseline: 'left', type: 'bearing' });
  });
  it('finalize recomputes T-node positions', () => {
    const r = addWallSegment(rectRoomLevel(3000, 4000, 400), { kind: 'wall', wallId: 'w0', offset: 1500 }, { kind: 'free', pt: { x: 1500, y: 2000 } }, part100);
    const bad = structuredClone(r.level);
    bad.nodes.find(n => n.host)!.y = 77;
    expect(finalize(bad).nodes.find(n => n.host)!.y).toBe(0);
  });
});

describe('purity', () => {
  it('never mutates input', () => {
    const r0 = addWallSegment(rectRoomLevel(3000, 4000, 400), { kind: 'wall', wallId: 'w0', offset: 1500 }, { kind: 'free', pt: { x: 1500, y: 2000 } }, part100);
    const base = r0.level;
    const tid = base.nodes.find(n => n.host)!.id;
    const before = structuredClone(base);
    addBox(base, { x: 0, y: 0 }, { x: 10, y: 10 }, part100, 'inner');
    addWallSegment(base, { kind: 'node', nodeId: 'n0' }, { kind: 'free', pt: { x: 1, y: 1 } }, part100);
    moveNode(base, 'n1', { x: 1, y: 1 });
    moveNode(base, tid, { x: 1, y: 1 });
    moveWall(base, 'w0', { x: 5, y: 5 });
    detachWallEnd(base, 'w0', 'a');
    deleteWall(base, 'w0');
    setWallProps(base, 'w0', { thickness: 1 });
    finalize(base);
    expect(base).toEqual(before);
  });
});

describe('opening re-anchor via shared post-edit step', () => {
  it('moveWall of a host slides the T-node at A; opening keeps its world position', () => {
    const room = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, bearing400, 'axis');
    const top = room.walls[0].id;
    const r = addWallSegment(room, { kind: 'wall', wallId: top, offset: 1500 }, { kind: 'free', pt: { x: 1500, y: 2000 } }, part100);
    const o = addOpening(r.level, r.wallId!, 'door', 1450, 900);
    expect(o.level.openings[0].offset).toBe(1000);
    // Top wall moves down 500: T-node A (1500,0) -> (1500,500); opening stays at world y=1000.
    const moved = moveWall(o.level, top, { x: 0, y: 500 });
    expect(moved.openings[0].offset).toBeCloseTo(500, 6);
    expect(moved.openings[0].invalid).toBe(false);
  });
});

describe('re-anchoring of hosted openings and wall devices', () => {
  it('node A moved: opening and wall device on that wall keep their world positions in one step; free device untouched', () => {
    const base = rectRoomLevel(3000, 4000, 400);
    let l = addOpening(base, 'w0', 'door', 1500, 900).level;
    l = addDevice(l, deviceDefaults('switch', 'wall'), { mode: 'wall', wallId: 'w0', side: 'left', offset: 2500 }, 'S').level;
    l = addDevice(l, deviceDefaults('switch', 'wall'), { mode: 'wall', wallId: 'w1', side: 'left', offset: 1000 }, 'T').level;
    l = addDevice(l, deviceDefaults('equipment', 'free'), { mode: 'free', x: 500, y: 500, rotation: 0 }, 'E').level;
    // w0 runs (0,0) -> (3000,0); A moves 500 left, so every offset on w0 grows by 500.
    const m = moveNode(l, 'n0', { x: -500, y: 0 });
    expect(m.openings[0].offset).toBeCloseTo(1550, 6);
    const [s, t, e] = m.devices.map(d => d.placement);
    expect(s.mode === 'wall' && s.offset).toBeCloseTo(3000, 6);
    // w1 starts at n1, which did not move; the free device has no offset.
    expect(t).toEqual(l.devices[1].placement);
    expect(e).toEqual(l.devices[2].placement);
  });
});

describe('mergeNodes', () => {
  it('merges an L-corner so both walls share one node', () => {
    let l = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, part100, 'axis');
    const a = addWallSegment(l, { kind: 'free', pt: { x: 5000, y: 0 } }, { kind: 'free', pt: { x: 6000, y: 0 } }, part100);
    l = a.level;
    const w = l.walls.find(x => x.id === a.wallId)!;
    const corner = l.walls[0].b; // (3000, 0)
    const out = mergeNodes(l, w.a, corner);
    expect(out.nodes.some(n => n.id === w.a)).toBe(false);
    expect(out.walls.find(x => x.id === w.id)!.a).toBe(corner);
    expect(out.walls).toHaveLength(5);
  });

  it('merging both ends of one wall deletes it with its openings', () => {
    const l = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, part100, 'axis');
    const top = l.walls[0];
    const o = addOpening(l, top.id, 'door', 1500);
    const out = mergeNodes(o.level, top.a, top.b);
    expect(out.walls.find(w => w.id === top.id)).toBeUndefined();
    expect(out.openings).toHaveLength(0);
    expect(out.nodes.some(n => n.id === top.a)).toBe(false);
  });
});

describe('T-node keeps its world position when the host moves (variant A)', () => {
  const setup = () => {
    const room = rectRoomLevel(3000, 4000, 400); // w0: n0 (0,0) -> n1 (3000,0)
    const r = addWallSegment(room, { kind: 'wall', wallId: 'w0', offset: 1500 }, { kind: 'free', pt: { x: 1500, y: 2000 } }, part100);
    const tid = r.level.nodes.find(n => n.host)!.id;
    return { level: r.level, tid };
  };
  it('host moved along its own axis by +500: T-node stays put, offset shrinks by 500', () => {
    const { level, tid } = setup();
    const m = moveWall(level, 'w0', { x: 500, y: 0 });
    const t = m.nodes.find(n => n.id === tid)!;
    expect(t.x).toBeCloseTo(1500, 6);
    expect(t.y).toBeCloseTo(0, 6);
    expect(t.host!.offset).toBeCloseTo(1000, 6);
  });
  it("host's node A dragged outward by 1000: T-node stays put in world space", () => {
    const { level, tid } = setup();
    const m = moveNode(level, 'n0', { x: -1000, y: 0 });
    const t = m.nodes.find(n => n.id === tid)!;
    expect(t.x).toBeCloseTo(1500, 6);
    expect(t.y).toBeCloseTo(0, 6);
    expect(t.host!.offset).toBeCloseTo(2500, 6);
  });
  it('host moved perpendicular by 300: T-node moves perpendicular by 300 only', () => {
    const { level, tid } = setup();
    const m = moveWall(level, 'w0', { x: 0, y: 300 });
    const t = m.nodes.find(n => n.id === tid)!;
    expect(t.x).toBeCloseTo(1500, 6);
    expect(t.y).toBeCloseTo(300, 6);
    expect(t.host!.offset).toBeCloseTo(1500, 6);
  });
  it('host shortened past the T-node: T-node clamps to the host end', () => {
    const { level, tid } = setup();
    const m = moveNode(level, 'n1', { x: 1000, y: 0 });
    const t = m.nodes.find(n => n.id === tid)!;
    expect(t.x).toBeCloseTo(1000, 6);
    expect(t.host!.offset).toBeCloseTo(1000, 6);
  });
  it('chained T-nodes converge and keep their along-host positions', () => {
    const { level, tid } = setup();
    const part = level.walls.find(w => w.a === tid || w.b === tid)!; // (1500,0) -> (1500,2000)
    const r2 = addWallSegment(level, { kind: 'wall', wallId: part.id, offset: 1000 }, { kind: 'free', pt: { x: 2500, y: 1000 } }, part100);
    const t2 = r2.level.nodes.find(n => n.host?.wallId === part.id)!.id;
    const m = moveWall(r2.level, 'w0', { x: 0, y: 300 });
    const p2 = m.nodes.find(n => n.id === t2)!;
    expect(p2.x).toBeCloseTo(1500, 6);
    expect(p2.y).toBeCloseTo(1000, 6);
    expect(nodePos(m, tid).y).toBeCloseTo(300, 6);
  });
});
