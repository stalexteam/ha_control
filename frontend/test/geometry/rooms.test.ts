import { describe, it, expect, vi } from 'vitest';
import polygonClipping from 'polygon-clipping';
import type { Level, Wall } from '../../src/model/types';
import { outlineFromHoles, roomAreaM2, roomHoles } from '../../src/geometry/rooms';
import { wallsUnion } from '../../src/geometry/walls';
import { addZone, deleteZone, refreshZones, renameZone } from '../../src/model/zones';
import { addBox, addWallSegment, deleteWall, moveNode, moveWall, type WallProps } from '../../src/model/ops';
import { addOpening } from '../../src/model/openings';
import { polygonArea } from '../../src/geometry/vec';
import { rectRoomLevel } from '../fixtures';

const findRoomOutline = (level: Level, seed: { x: number; y: number }) => outlineFromHoles(roomHoles(level), seed);

const part: WallProps = { type: 'partition', thickness: 100, baseline: 'center' };
const bearing: WallProps = { type: 'bearing', thickness: 400, baseline: 'center' };
const empty = (): Level => ({ id: 'l', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });
const free = (x: number, y: number) => ({ kind: 'free' as const, pt: { x, y } });
const wall = (id: string, a: string, b: string, thickness: number): Wall =>
  ({ id, a, b, thickness, type: 'partition', baseline: 'center' });

/** Box 3000x4000 (axis, 400 thick) split by a 100 partition at x=1500. */
function splitRoom() {
  const room = rectRoomLevel(3000, 4000, 400);
  const r = addWallSegment(room, { kind: 'wall', wallId: 'w0', offset: 1500 }, { kind: 'wall', wallId: 'w2', offset: 1500 }, part);
  return { level: r.level, partId: r.wallId! };
}

describe('findRoomOutline', () => {
  it('rectangle: inner face, 9.36 m2', () => {
    const o = findRoomOutline(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 })!;
    expect(o).not.toBeNull();
    expect(roomAreaM2(o)).toBe(9.36);
    for (const p of o) {
      expect([200, 2800]).toContain(p.x);
      expect([200, 3800]).toContain(p.y);
    }
  });
  it('seed outside -> null', () => {
    expect(findRoomOutline(rectRoomLevel(3000, 4000, 400), { x: 5000, y: 2000 })).toBeNull();
  });
  it('seed inside a wall body -> null', () => {
    expect(findRoomOutline(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 0 })).toBeNull();
  });
  it('partition splits into 2 distinct outlines', () => {
    const { level } = splitRoom();
    const a = findRoomOutline(level, { x: 700, y: 2000 })!;
    const b = findRoomOutline(level, { x: 2300, y: 2000 })!;
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(Math.min(...a.map(p => p.x))).toBe(200);
    expect(Math.max(...a.map(p => p.x))).toBe(1450);
    expect(Math.min(...b.map(p => p.x))).toBe(1550);
  });
  it('closed 3-wall chain is a room', () => {
    let l = addWallSegment(empty(), free(0, 0), free(3000, 0), part);
    const start = l.level.walls[0].a;
    l = addWallSegment(l.level, { kind: 'node', nodeId: l.endNodeId! }, free(1500, 2500), part);
    l = addWallSegment(l.level, { kind: 'node', nodeId: l.endNodeId! }, { kind: 'node', nodeId: start }, part);
    const o = findRoomOutline(l.level, { x: 1500, y: 800 });
    expect(o).not.toBeNull();
    expect(roomAreaM2(o!)).toBeGreaterThan(2);
  });
  it('node-less cross inside a box -> 4 distinct outlines', () => {
    const base = rectRoomLevel(3000, 4000, 400);
    base.nodes.push(
      { id: 'v0', x: 1500, y: 0 }, { id: 'v1', x: 1500, y: 4000 },
      { id: 'h0', x: 0, y: 2000 }, { id: 'h1', x: 3000, y: 2000 },
    );
    base.walls.push(wall('wv', 'v0', 'v1', 100), wall('wh', 'h0', 'h1', 100));
    const seeds = [{ x: 700, y: 1000 }, { x: 2300, y: 1000 }, { x: 700, y: 3000 }, { x: 2300, y: 3000 }];
    const outs = seeds.map(s => findRoomOutline(base, s)!);
    expect(outs.every(o => o !== null)).toBe(true);
    const keys = new Set(outs.map(o =>
      `${Math.abs(polygonArea(o)).toFixed(2)}|${Math.min(...o.map(p => p.x))}|${Math.min(...o.map(p => p.y))}`));
    expect(keys.size).toBe(4);
  });
});

describe('zones', () => {
  it('addZone on room, second zone in same room rejected', () => {
    const room = rectRoomLevel(3000, 4000, 400);
    const r = addZone(room, { x: 1500, y: 2000 }, 'Hall');
    expect(r.zoneId).not.toBeNull();
    expect(r.level.zones[0]).toMatchObject({ name: 'Hall', broken: false });
    const r2 = addZone(r.level, { x: 500, y: 500 }, 'Again');
    expect(r2.zoneId).toBeNull();
    expect(r2.level.zones).toHaveLength(1);
  });
  it('addZone outside -> null', () => {
    expect(addZone(rectRoomLevel(3000, 4000, 400), { x: 9000, y: 9000 }, 'x').zoneId).toBeNull();
  });
  it('rename / delete', () => {
    const r = addZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'A');
    const renamed = renameZone(r.level, r.zoneId!, 'B');
    expect(renamed.zones[0].name).toBe('B');
    expect(deleteZone(renamed, r.zoneId!).zones).toHaveLength(0);
  });
  it('door in partition does not merge rooms', () => {
    const { level, partId } = splitRoom();
    const d = addOpening(level, partId, 'door', 2000).level;
    expect(d.openings).toHaveLength(1);
    const z1 = addZone(d, { x: 700, y: 2000 }, 'L');
    const z2 = addZone(z1.level, { x: 2300, y: 2000 }, 'R');
    expect(z1.zoneId).not.toBeNull();
    expect(z2.zoneId).not.toBeNull();
    expect(refreshZones(z2.level).zones.every(z => !z.broken)).toBe(true);
  });
  it('deleting the partition breaks the second zone only', () => {
    const { level, partId } = splitRoom();
    const z1 = addZone(level, { x: 700, y: 2000 }, 'L');
    const z2 = addZone(z1.level, { x: 2300, y: 2000 }, 'R');
    const after = deleteWall(z2.level, partId);
    expect(after.zones[0].broken).toBe(false);
    expect(after.zones[1].broken).toBe(true);
    expect(after.zones[1].outline).toEqual(z2.level.zones[1].outline);
  });
  it('deleting a box wall breaks the zone, outline kept', () => {
    const z = addZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'A');
    const after = deleteWall(z.level, 'w1');
    expect(after.zones[0].broken).toBe(true);
    expect(after.zones[0].outline).toEqual(z.level.zones[0].outline);
  });
});

describe('zones follow edits', () => {
  it('moving a box corner updates the zone outline', () => {
    const z = addZone(rectRoomLevel(3000, 4000, 400), { x: 1000, y: 1000 }, 'A');
    const moved = moveNode(z.level, 'n2', { x: 4000, y: 4000 });
    expect(moved.zones[0].broken).toBe(false);
    expect(moved.zones[0].outline).not.toEqual(z.level.zones[0].outline);
    expect(roomAreaM2(moved.zones[0].outline)).toBeGreaterThan(9.36);
  });
  it('addBox then moveWall keeps zones fresh', () => {
    const box = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, bearing, 'axis');
    const z = addZone(box, { x: 1500, y: 2000 }, 'A');
    const moved = moveWall(z.level, z.level.walls[1].id, { x: 500, y: 0 });
    expect(Math.max(...moved.zones[0].outline.map(p => p.x))).toBeGreaterThan(2800);
  });
});

describe('wallsUnion fallback', () => {
  it('returns un-unioned polygons without holes when polygonClipping throws; zones become broken', () => {
    const z = addZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'A');
    const spy = vi.spyOn(polygonClipping, 'union').mockImplementation(() => { throw new Error('boom'); });
    try {
      const u = wallsUnion(z.level, false);
      expect(u).toHaveLength(4);
      expect(u.every(p => p.length === 1)).toBe(true);
      const r = refreshZones(z.level);
      expect(r.zones[0].broken).toBe(true);
      expect(r.zones[0].outline).toEqual(z.level.zones[0].outline);
    } finally {
      spy.mockRestore();
    }
  });
});
