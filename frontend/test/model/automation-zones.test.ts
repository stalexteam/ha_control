import { describe, it, expect } from 'vitest';
import {
  addPolygonZone, addRoomZone, deleteAutomationZone, moveZoneVertex, refreshAutomationZones, renameAutomationZone,
  setZoneParticipation,
} from '../../src/model/automation-zones';
import { addWallSegment, deleteWall, detachWallEnd, mergeNodes, moveNode, setWallProps } from '../../src/model/ops';
import { addZone, deleteZone } from '../../src/model/zones';
import { addDevice, moveDevice } from '../../src/model/devices';
import { deviceZones, vertexPoint, zoneInvalidReason } from '../../src/geometry/zones';
import {
  deviceDefaults, levelZones, normalizeLevel, type AutomationZone, type Device, type DeviceProps, type Id, type Level,
  type ZoneVertex,
} from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';

/** 3000 x 4000 room: n0 (0,0), n1 (3000,0), n2 (3000,4000), n3 (0,4000); w0 = n0 -> n1, 400 bearing on centre. */
const room = (): Level => rectRoomLevel(3000, 4000, 400);
const free = (x: number, y: number): ZoneVertex => ({ kind: 'free', x, y });
const onW0 = (offset: number): ZoneVertex => ({ kind: 'wall', wallId: 'w0', offset, side: 'right', x: 0, y: 0 });
/** A quad: a wall vertex on w0's inner face at 1000 (1000, 200), node n1, then two free corners. */
const quad = (): ZoneVertex[] => [onW0(1000), { kind: 'node', nodeId: 'n1', x: 0, y: 0 }, free(2500, 3000), free(1000, 3000)];

function withQuad(level: Level = room()): { level: Level; id: Id } {
  const r = addPolygonZone(level, quad(), 'Zone');
  return { level: r.level, id: r.zoneId! };
}
const zoneOf = (l: Level, id: Id): AutomationZone => levelZones(l).find(z => z.id === id)!;
const verts = (l: Level, id: Id): ZoneVertex[] => {
  const s = zoneOf(l, id).shape;
  if (s.kind !== 'polygon') throw new Error('not a polygon');
  return s.vertices;
};
const near = (p: { x: number; y: number }, x: number, y: number, digits = 6) => {
  expect(p.x).toBeCloseTo(x, digits);
  expect(p.y).toBeCloseTo(y, digits);
};

/** A room level with a room 'Kitchen' detected from the centre. */
function withRoom(): { level: Level; roomId: Id } {
  const r = addZone(room(), { x: 1500, y: 2000 }, 'Kitchen');
  return { level: r.level, roomId: r.zoneId! };
}

describe('addRoomZone', () => {
  it('addRoomZone adds a room zone named after the room; a second call returns the existing id and the same level', () => {
    const { level, roomId } = withRoom();
    const a = addRoomZone(level, roomId, 'Kitchen');
    expect(a.zoneId).not.toBeNull();
    expect(levelZones(a.level)).toEqual([{ id: a.zoneId, name: 'Kitchen', shape: { kind: 'room', roomId }, invalid: false }]);
    expect(a.level.walls).toBe(level.walls);
    expect(a.level.nodes).toBe(level.nodes);
    expect(a.level.openings).toBe(level.openings);
    const b = addRoomZone(a.level, roomId, 'Other');
    expect(b.level).toBe(a.level);
    expect(b.zoneId).toBe(a.zoneId);
    const c = addRoomZone(level, 'nope', 'X');
    expect(c).toEqual({ level, zoneId: null });
    expect(c.level).toBe(level);
  });
});

describe('addPolygonZone', () => {
  it('addPolygonZone rejects fewer than 3 vertices and a bow-tie', () => {
    const l = room();
    const two = addPolygonZone(l, [free(0, 0), free(1000, 0)], 'Zone');
    expect(two.zoneId).toBeNull();
    expect(two.level).toBe(l);
    const bow = addPolygonZone(l, [free(0, 0), free(1000, 1000), free(1000, 0), free(0, 1000)], 'Zone');
    expect(bow.zoneId).toBeNull();
    expect(bow.level).toBe(l);
  });

  it('a free vertex passed with lost is stored without it', () => {
    const r = addPolygonZone(room(), [{ kind: 'free', x: 500, y: 500, lost: true }, free(1500, 500), free(1500, 1500)], 'Zone');
    expect(verts(r.level, r.zoneId!)[0]).toEqual({ kind: 'free', x: 500, y: 500 });
    expect(zoneOf(r.level, r.zoneId!).invalid).toBe(false);
  });

  it('a valid polygon is added with resolved vertex caches; the walls, nodes and openings stay by reference', () => {
    const l = room();
    const { level, id } = withQuad(l);
    const z = zoneOf(level, id);
    expect(z).toMatchObject({ name: 'Zone', invalid: false });
    const v = verts(level, id);
    near(v[0], 1000, 200);
    expect(v[1]).toEqual({ kind: 'node', nodeId: 'n1', x: 3000, y: 0 });
    expect(level.walls).toBe(l.walls);
    expect(level.nodes).toBe(l.nodes);
    expect(level.openings).toBe(l.openings);
    expect(l.automationZones).toBeUndefined();
  });
});

describe('renameAutomationZone', () => {
  it('renames; the same level for an unknown id or the same name', () => {
    const { level, id } = withQuad();
    expect(zoneOf(renameAutomationZone(level, id, 'Hall'), id).name).toBe('Hall');
    expect(renameAutomationZone(level, id, 'Zone')).toBe(level);
    expect(renameAutomationZone(level, 'nope', 'Hall')).toBe(level);
  });
});

describe('zones follow wall edits', () => {
  it('wall vertex is re-anchored when node A moves', () => {
    const { level, id } = withQuad();
    const before = verts(level, id)[0] as Extract<ZoneVertex, { kind: 'wall' }>;
    const moved = moveNode(level, 'n0', { x: 500, y: 0 });
    const after = verts(moved, id)[0] as Extract<ZoneVertex, { kind: 'wall' }>;
    expect(after.kind).toBe('wall');
    expect(after.offset).toBeCloseTo(before.offset - 500, 6);
    expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(1);
    near(vertexPoint(moved, after)!, before.x, before.y, 3);
  });

  it('stretching a wall moves a node vertex with its node', () => {
    const { level, id } = withQuad();
    const moved = moveNode(level, 'n1', { x: 3500, y: 0 });
    expect(verts(moved, id)[1]).toEqual({ kind: 'node', nodeId: 'n1', x: 3500, y: 0 });
    // Node A of w0 did not move: the wall vertex keeps its offset and position.
    expect(verts(moved, id)[0]).toEqual(verts(level, id)[0]);
  });

  it('deleting the anchoring wall leaves a lost vertex', () => {
    const { level, id } = withQuad();
    const copy = structuredClone(level);
    const old = verts(level, id)[0];
    const r = deleteWall(level, 'w0');
    expect(verts(r, id)[0]).toEqual({ kind: 'free', x: old.x, y: old.y, lost: true });
    expect(zoneOf(r, id).invalid).toBe(true);
    expect(zoneInvalidReason(r, zoneOf(r, id))).toBe('lost');
    // The node vertex n1 is still anchored (w1 uses n1).
    expect(verts(r, id)[1]).toEqual({ kind: 'node', nodeId: 'n1', x: 3000, y: 0 });
    expect(level).toEqual(copy);
  });

  it('moveZoneVertex clears lost and the zone becomes valid', () => {
    const { level, id } = withQuad();
    const r = deleteWall(level, 'w0');
    const fixed = moveZoneVertex(r, id, 0, { kind: 'free', x: 1000, y: 500, lost: true });
    expect(verts(fixed, id)[0]).toEqual({ kind: 'free', x: 1000, y: 500 });
    expect(zoneOf(fixed, id).invalid).toBe(false);
    expect(fixed.walls).toBe(r.walls);
    expect(fixed.nodes).toBe(r.nodes);
    expect(fixed.openings).toBe(r.openings);
  });

  it('moveZoneVertex resolves an anchored vertex and keeps a self-intersecting result as invalid', () => {
    const { level, id } = withQuad();
    const toWall = moveZoneVertex(level, id, 2, { kind: 'wall', wallId: 'w1', offset: 2000, side: 'right', x: 0, y: 0 });
    const v = verts(toWall, id)[2];
    near(v, 2800, 2000);
    expect(zoneOf(toWall, id).invalid).toBe(false);
    // Vertex 3 dragged across the far side: the outline crosses itself.
    const crossed = moveZoneVertex(level, id, 3, free(3000, 1500));
    expect(zoneOf(crossed, id).invalid).toBe(true);
    expect(zoneInvalidReason(crossed, zoneOf(crossed, id))).toBe('self');
    expect(moveZoneVertex(level, id, 9, free(0, 0))).toBe(level);
    expect(moveZoneVertex(level, 'nope', 0, free(0, 0))).toBe(level);
  });

  it('mergeNodes re-points node vertices to the surviving node', () => {
    const { level, id } = withQuad();
    const r = mergeNodes(level, 'n1', 'n2');
    expect(r.nodes.some(n => n.id === 'n1')).toBe(false);
    expect(verts(r, id)[1]).toEqual({ kind: 'node', nodeId: 'n2', x: 3000, y: 4000 });
  });

  it('Alt-detaching a lone wall end keeps its node vertices anchored on the new node', () => {
    // A free-standing wall s from p0 (5000,0) to p1 (5000,2000): p1 is used by s alone.
    const seg = addWallSegment(room(), { kind: 'free', pt: { x: 5000, y: 0 } }, { kind: 'free', pt: { x: 5000, y: 2000 } },
      { type: 'partition', thickness: 100, baseline: 'center' });
    const p1 = seg.endNodeId!;
    const z = addPolygonZone(seg.level, [{ kind: 'node', nodeId: p1, x: 0, y: 0 }, free(6000, 2000), free(6000, 3000)], 'Zone');
    const r = detachWallEnd(z.level, seg.wallId!, 'b');
    expect(r.level.nodes.some(n => n.id === p1)).toBe(false);
    expect(verts(r.level, z.zoneId!)[0]).toEqual({ kind: 'node', nodeId: r.nodeId, x: 5000, y: 2000 });
    expect(zoneOf(r.level, z.zoneId!).invalid).toBe(false);
    // The detached end follows when dragged.
    expect(verts(moveNode(r.level, r.nodeId, { x: 5000, y: 2500 }), z.zoneId!)[0]).toMatchObject({ x: 5000, y: 2500 });
  });

  it('detaching a shared wall end leaves vertices on the shared node unchanged', () => {
    const { level, id } = withQuad();
    // n1 is shared by w0 (as B) and w1 (as A).
    const r = detachWallEnd(level, 'w0', 'b');
    expect(r.nodeId).not.toBe('n1');
    expect(verts(r.level, id)[1]).toEqual({ kind: 'node', nodeId: 'n1', x: 3000, y: 0 });
  });

  it("shortening a wall below a wall vertex offset marks the zone invalid ('wall'); lengthening it heals it", () => {
    const base = addPolygonZone(room(), [onW0(2500), free(2500, 3000), free(1000, 3000)], 'Zone');
    const id = base.zoneId!;
    expect(zoneOf(base.level, id).invalid).toBe(false);
    const short = moveNode(base.level, 'n1', { x: 2000, y: 0 });
    expect(zoneOf(short, id).invalid).toBe(true);
    expect(zoneInvalidReason(short, zoneOf(short, id))).toBe('wall');
    const sv = verts(short, id)[0];
    expect(sv).toMatchObject({ kind: 'wall', wallId: 'w0', offset: 2500 });
    near(sv, 2000, 200); // drawn at the clamped wall end
    const healed = moveNode(short, 'n1', { x: 3000, y: 0 });
    expect(zoneOf(healed, id).invalid).toBe(false);
    near(verts(healed, id)[0], 2500, 200);
  });

  it('deleting a room converts its room zones into lost custom zones along the room outline', () => {
    const { level, roomId } = withRoom();
    const a = addRoomZone(level, roomId, 'Kitchen');
    const outline = level.zones[0].outline;
    const r = deleteZone(a.level, roomId);
    expect(r.zones).toEqual([]);
    const z = zoneOf(r, a.zoneId!);
    expect(z.name).toBe('Kitchen');
    expect(z.shape).toEqual({ kind: 'polygon', vertices: outline.map(p => ({ kind: 'free', x: p.x, y: p.y, lost: true })) });
    expect(z.invalid).toBe(true);
    expect(zoneInvalidReason(r, z)).toBe('lost');
    expect(r.walls).toBe(a.level.walls);
    expect(r.nodes).toBe(a.level.nodes);
    expect(r.openings).toBe(a.level.openings);
    // Without automation zones the field is not added.
    expect(deleteZone(level, roomId).automationZones).toBeUndefined();
  });

  it('a broken room makes its room zone invalid', () => {
    const { level, roomId } = withRoom();
    const a = addRoomZone(level, roomId, 'Kitchen');
    const r = deleteWall(a.level, 'w0');
    expect(r.zones[0].broken).toBe(true);
    expect(zoneOf(r, a.zoneId!).invalid).toBe(true);
    expect(zoneInvalidReason(r, zoneOf(r, a.zoneId!))).toBe('room');
  });
});

describe('participation', () => {
  function withLamp(): { level: Level; id: Id; dev: Id } {
    const { level, id } = withQuad();
    const d = addDevice(level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 1500, y: 2000, rotation: 0 }, 'L');
    return { level: d.level, id, dev: d.deviceId! };
  }
  const device = (l: Level, id: Id): Device => l.devices.find(d => d.id === id)!;

  it('blacklist survives leaving and re-entering the zone', () => {
    const { level, id, dev } = withLamp();
    const out = setZoneParticipation(level, dev, id, false);
    expect(device(out, dev).zoneBlacklist).toEqual([id]);
    expect(deviceZones(out, device(out, dev)).map(x => x.participates)).toEqual([false]);
    expect(out.walls).toBe(level.walls);
    expect(out.nodes).toBe(level.nodes);
    expect(out.openings).toBe(level.openings);
    const away = moveDevice(out, dev, { mode: 'free', x: 500, y: 3500, rotation: 0 });
    expect(deviceZones(away, device(away, dev))).toEqual([]);
    expect(device(away, dev).zoneBlacklist).toEqual([id]);
    const back = moveDevice(away, dev, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    expect(device(back, dev).zoneBlacklist).toEqual([id]);
    expect(deviceZones(back, device(back, dev)).map(x => x.participates)).toEqual([false]);
  });

  it('setZoneParticipation true removes the id; no-op returns the same level', () => {
    const { level, id, dev } = withLamp();
    expect(setZoneParticipation(level, dev, id, true)).toBe(level);
    const out = setZoneParticipation(level, dev, id, false);
    expect(setZoneParticipation(out, dev, id, false)).toBe(out);
    const back = setZoneParticipation(out, dev, id, true);
    expect('zoneBlacklist' in device(back, dev)).toBe(false);
    expect(setZoneParticipation(level, 'nope', id, false)).toBe(level);
    expect(setZoneParticipation(level, dev, 'nope', false)).toBe(level);
  });

  it('deleteAutomationZone removes its id from every blacklist and drops empty blacklists', () => {
    const { level, id: a, dev: d1 } = withLamp();
    const b = addPolygonZone(level, [free(0, 0), free(1000, 0), free(1000, 1000)], 'Zone 2');
    const idB = b.zoneId!;
    const d2 = addDevice(b.level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 2000, y: 2000, rotation: 0 }, 'L2');
    const d3 = addDevice(d2.level, deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 2000, y: 2500, rotation: 0 }, 'L3');
    let l = setZoneParticipation(d3.level, d1, a, false);
    l = setZoneParticipation(l, d1, idB, false);
    l = setZoneParticipation(l, d2.deviceId!, a, false);
    const r = deleteAutomationZone(l, a);
    expect(levelZones(r).map(z => z.id)).toEqual([idB]);
    expect(device(r, d1).zoneBlacklist).toEqual([idB]);
    expect('zoneBlacklist' in device(r, d2.deviceId!)).toBe(false);
    expect(device(r, d3.deviceId!)).toBe(device(l, d3.deviceId!));
    expect(r.walls).toBe(l.walls);
    expect(r.nodes).toBe(l.nodes);
    expect(r.openings).toBe(l.openings);
    expect(deleteAutomationZone(r, 'nope')).toBe(r);
  });
});

describe('refreshAutomationZones', () => {
  it('refreshAutomationZones returns the same level when nothing changed', () => {
    const { level, id } = withQuad();
    expect(refreshAutomationZones(level)).toBe(level);
    const bare = room();
    expect(refreshAutomationZones(bare)).toBe(bare);
    expect(refreshAutomationZones(bare).automationZones).toBeUndefined();
    // An unrelated wall edit: the zone objects are identical.
    const edited = setWallProps(level, 'w2', { thickness: 200 });
    expect(zoneOf(edited, id)).toBe(zoneOf(level, id));
    expect(refreshAutomationZones(edited)).toBe(edited);
  });

  it('a missing anchor becomes a lost free vertex at its cached position', () => {
    const { level, id } = withQuad();
    const stale = verts(level, id)[1];
    const gone: Level = { ...level, walls: level.walls.filter(w => w.a !== 'n1' && w.b !== 'n1'), nodes: level.nodes.filter(n => n.id !== 'n1') };
    const r = refreshAutomationZones(gone);
    expect(verts(r, id)[1]).toEqual({ kind: 'free', x: stale.x, y: stale.y, lost: true });
    expect(zoneOf(r, id).invalid).toBe(true);
  });
});

describe('old plans', () => {
  it('normalizeLevel drops climate zoneIds; plans without automationZones work', () => {
    const stored: Level = {
      ...room(),
      devices: [{
        id: 'c', name: 'C', invalid: false, placement: { mode: 'free', x: 1500, y: 2000, rotation: 0 },
        props: { kind: 'climate_sensor', zoneIds: ['z0'] } as unknown as DeviceProps,
      }],
    };
    const n = normalizeLevel(stored);
    expect(n.devices[0].props).toEqual({ kind: 'climate_sensor' });
    expect(n.automationZones).toBeUndefined();
    expect(normalizeLevel(n)).toBe(n);
    const del = deleteWall(n, 'w0');
    expect(del.automationZones).toBeUndefined();
    const { level, id } = withQuad(n);
    expect(id).not.toBeNull();
    expect(deviceZones(level, level.devices[0]).map(x => x.zone.id)).toEqual([id]);
    const r = deleteWall(level, 'w0');
    expect(zoneInvalidReason(r, zoneOf(r, id))).toBe('lost');
  });
});
