import { describe, it, expect } from 'vitest';
import {
  deviceDefaults, levelZones, type AutomationZone, type Device, type DevicePlacement, type Id, type Level, type Pt,
  type Zone, type ZoneVertex,
} from '../../src/model/types';
import { devicePose } from '../../src/geometry/devices';
import {
  deviceZones, selfIntersects, vertexPoint, zoneContains, zoneInvalidReason, zoneLabelPoint, zoneMembers, zoneOutline,
} from '../../src/geometry/zones';
import { rectRoomLevel } from '../fixtures';

const free = (x: number, y: number, lost?: true): ZoneVertex => (lost ? { kind: 'free', x, y, lost } : { kind: 'free', x, y });
const poly = (id: Id, vertices: ZoneVertex[]): AutomationZone =>
  ({ id, name: id, shape: { kind: 'polygon', vertices }, invalid: false });
const square = (id: Id, x0: number, y0: number, size: number): AutomationZone =>
  poly(id, [free(x0, y0), free(x0 + size, y0), free(x0 + size, y0 + size), free(x0, y0 + size)]);
const pts = (...xy: [number, number][]): Pt[] => xy.map(([x, y]) => ({ x, y }));
const dev = (id: Id, placement: DevicePlacement, zoneBlacklist?: Id[]): Device => ({
  id, name: id, placement, invalid: false, ...(zoneBlacklist ? { zoneBlacklist } : {}),
  props: deviceDefaults('socket', placement.mode),
});
const at = (x: number, y: number): DevicePlacement => ({ mode: 'free', x, y, rotation: 0 });
const withZones = (level: Level, automationZones: AutomationZone[], devices: Device[] = []): Level =>
  ({ ...level, automationZones, devices });
const room = (id: Id, broken: boolean): Zone => ({
  id, name: 'Kitchen', seed: { x: 1500, y: 2000 }, broken,
  outline: pts([200, 200], [2800, 200], [2800, 3800], [200, 3800]),
});

describe('levelZones', () => {
  it('returns [] when the field is missing', () => {
    expect(levelZones(rectRoomLevel(3000, 4000, 400))).toEqual([]);
  });

  it('returns the stored zones', () => {
    const z = square('a', 0, 0, 1000);
    expect(levelZones(withZones(rectRoomLevel(3000, 4000, 400), [z]))).toEqual([z]);
  });
});

describe('vertexPoint and zoneOutline', () => {
  const box = rectRoomLevel(3000, 4000, 400);

  it('node vertex follows its node; wall vertex lies on the chosen face', () => {
    expect(vertexPoint(box, { kind: 'node', nodeId: 'n2', x: 0, y: 0 })).toEqual({ x: 3000, y: 4000 });
    const left = vertexPoint(box, { kind: 'wall', wallId: 'w0', offset: 1000, side: 'left', x: 0, y: 0 })!;
    const leftPose = devicePose(box, dev('l', { mode: 'wall', wallId: 'w0', side: 'left', offset: 1000 }))!;
    expect(left).toEqual(leftPose.pt);
    expect(left.x).toBeCloseTo(1000);
    expect(left.y).toBeCloseTo(-200);
    const right = vertexPoint(box, { kind: 'wall', wallId: 'w0', offset: 1000, side: 'right', x: 0, y: 0 })!;
    const rightPose = devicePose(box, dev('r', { mode: 'wall', wallId: 'w0', side: 'right', offset: 1000 }))!;
    expect(right).toEqual(rightPose.pt);
    expect(right.x).toBeCloseTo(1000);
    expect(right.y).toBeCloseTo(200);
  });

  it('a free vertex is its own position', () => {
    expect(vertexPoint(box, free(10, 20))).toEqual({ x: 10, y: 20 });
  });

  it('a missing anchor resolves to null and the outline uses the cached x,y', () => {
    const gone: ZoneVertex = { kind: 'node', nodeId: 'gone', x: 10, y: 20 };
    const goneWall: ZoneVertex = { kind: 'wall', wallId: 'gone', offset: 100, side: 'left', x: 30, y: 40 };
    expect(vertexPoint(box, gone)).toBeNull();
    expect(vertexPoint(box, goneWall)).toBeNull();
    const z = poly('z', [gone, goneWall, { kind: 'node', nodeId: 'n2', x: 0, y: 0 }]);
    expect(zoneOutline(box, z)).toEqual(pts([10, 20], [30, 40], [3000, 4000]));
  });

  it('wall vertex beyond the wall end is clamped in the outline and gives reason \'wall\'', () => {
    const z = poly('z', [
      { kind: 'wall', wallId: 'w0', offset: 3500, side: 'right', x: 0, y: 0 }, free(2500, 2000), free(500, 2000),
    ]);
    const outline = zoneOutline(box, z);
    expect(outline[0].x).toBeCloseTo(3000);
    expect(outline[0].y).toBeCloseTo(200);
    expect(zoneInvalidReason(box, z)).toBe('wall');
    const near = poly('n', [
      { kind: 'wall', wallId: 'w0', offset: 3000.5, side: 'right', x: 0, y: 0 }, free(2500, 2000), free(500, 2000),
    ]);
    expect(zoneInvalidReason(box, near)).toBeNull();
    const before = poly('b', [
      { kind: 'wall', wallId: 'w0', offset: -2, side: 'right', x: 0, y: 0 }, free(2500, 2000), free(500, 2000),
    ]);
    expect(zoneOutline(box, before)[0].x).toBeCloseTo(0);
    expect(zoneInvalidReason(box, before)).toBe('wall');
  });

  it('room zone outline is the room outline; a gone room gives []', () => {
    const level: Level = { ...box, zones: [room('r0', false)] };
    const rz: AutomationZone = { id: 'z', name: 'Kitchen', shape: { kind: 'room', roomId: 'r0' }, invalid: false };
    expect(zoneOutline(level, rz)).toEqual(room('r0', false).outline);
    expect(zoneOutline(box, rz)).toEqual([]);
  });
});

describe('selfIntersects', () => {
  it('a bow-tie crosses itself', () => {
    expect(selfIntersects(pts([0, 0], [1000, 1000], [1000, 0], [0, 1000]))).toBe(true);
  });

  it('a square does not', () => {
    expect(selfIntersects(pts([0, 0], [1000, 0], [1000, 1000], [0, 1000]))).toBe(false);
  });

  it('a triangle does not', () => {
    expect(selfIntersects(pts([0, 0], [1000, 0], [500, 800]))).toBe(false);
  });

  it('a ring with a repeated consecutive point does not', () => {
    expect(selfIntersects(pts([0, 0], [1000, 0], [1000, 0], [1000, 1000], [0, 1000], [0, 0]))).toBe(false);
  });

  it('a collinear overlap counts', () => {
    expect(selfIntersects(pts([0, 0], [1000, 0], [500, 0]))).toBe(true);
    // The edge (1500, 0)-(500, 0) runs back over the first edge.
    expect(selfIntersects(pts([0, 0], [2000, 0], [2000, 1000], [1500, 1000], [1500, 0], [500, 0], [500, -1000],
      [0, -1000]))).toBe(true);
  });

  it('a ring touching itself at a vertex counts', () => {
    expect(selfIntersects(pts([0, 0], [2000, 0], [1000, 1000], [2000, 2000], [0, 2000], [1000, 1000]))).toBe(true);
  });
});

describe('zoneInvalidReason priority', () => {
  const box = rectRoomLevel(3000, 4000, 400);
  const bowTie = [free(0, 0), free(1000, 1000), free(1000, 0), free(0, 1000)];

  it('a broken room gives \'room\'', () => {
    const rz: AutomationZone = { id: 'z', name: 'Kitchen', shape: { kind: 'room', roomId: 'r0' }, invalid: false };
    expect(zoneInvalidReason({ ...box, zones: [room('r0', true)] }, rz)).toBe('room');
    expect(zoneInvalidReason({ ...box, zones: [room('r0', false)] }, rz)).toBeNull();
  });

  it('a lost vertex gives \'lost\', before \'wall\' and \'self\'', () => {
    const lost = poly('z', [free(0, 0, true), ...bowTie.slice(1),
      { kind: 'wall', wallId: 'w0', offset: 9000, side: 'right', x: 0, y: 0 }]);
    expect(zoneInvalidReason(box, lost)).toBe('lost');
  });

  it('a missing anchor gives \'lost\'', () => {
    const z = poly('z', [{ kind: 'node', nodeId: 'gone', x: 0, y: 0 }, free(1000, 0), free(1000, 1000)]);
    expect(zoneInvalidReason(box, z)).toBe('lost');
  });

  it('a wall vertex beyond the end gives \'wall\' before \'self\'', () => {
    const z = poly('z', [...bowTie, { kind: 'wall', wallId: 'w0', offset: 9000, side: 'right', x: 0, y: 0 }]);
    expect(zoneInvalidReason(box, z)).toBe('wall');
  });

  it('a valid square gives null', () => {
    expect(zoneInvalidReason(box, square('z', 0, 0, 1000))).toBeNull();
  });

  it('a bow-tie gives \'self\'', () => {
    expect(zoneInvalidReason(box, poly('z', bowTie))).toBe('self');
  });

  it('an outline collapsed to fewer than three distinct points or to no area gives \'self\'', () => {
    // Two vertices on one corner (e.g. after merging nodes): two distinct points.
    const merged = poly('z', [{ kind: 'node', nodeId: 'n0', x: 0, y: 0 }, { kind: 'node', nodeId: 'n0', x: 0, y: 0 }, free(1000, 1000)]);
    expect(selfIntersects(zoneOutline(box, merged))).toBe(false);
    expect(zoneInvalidReason(box, merged)).toBe('self');
    // Three distinct points, area 0.5 mm2.
    expect(zoneInvalidReason(box, poly('z', [free(0, 0), free(1000, 0), free(500, 0.001)]))).toBe('self');
    // A thin but real sliver (1000 x 1 mm, area 500 mm2) is valid.
    expect(zoneInvalidReason(box, poly('z', [free(0, 0), free(1000, 0), free(1000, 1)]))).toBeNull();
  });
});

describe('zoneContains counts the boundary', () => {
  const sq = pts([0, 0], [1000, 0], [1000, 1000], [0, 1000]);

  it('inside and on an edge', () => {
    expect(zoneContains(sq, { x: 500, y: 500 })).toBe(true);
    expect(zoneContains(sq, { x: 1000, y: 500 })).toBe(true);
    expect(zoneContains(sq, { x: 0, y: 0 })).toBe(true);
  });

  it('0.5 mm outside is in, 5 mm outside is out', () => {
    expect(zoneContains(sq, { x: 1000.5, y: 500 })).toBe(true);
    expect(zoneContains(sq, { x: 500, y: -0.5 })).toBe(true);
    expect(zoneContains(sq, { x: 1005, y: 500 })).toBe(false);
  });

  it('an empty outline contains nothing', () => {
    expect(zoneContains([], { x: 0, y: 0 })).toBe(false);
  });
});

describe('membership', () => {
  const box = rectRoomLevel(3000, 4000, 400);
  const a = square('A', 0, 0, 2000);
  const b = square('B', 1000, 1000, 2000);

  it('deviceZones: overlapping zones both contain a device; a blacklisted zone reads participates false', () => {
    const d = dev('d', at(1500, 1500), ['B']);
    const level = withZones(box, [a, b], [d]);
    expect(deviceZones(level, d)).toEqual([{ zone: a, participates: true }, { zone: b, participates: false }]);
    const outside = dev('o', at(5000, 5000));
    expect(deviceZones(level, outside)).toEqual([]);
  });

  it('deviceZones uses the wall device pose point', () => {
    const inner = square('I', 0, 0, 1500); // the right face of w0 lies at y = 200
    const d = dev('w', { mode: 'wall', wallId: 'w0', side: 'right', offset: 1000 });
    const level = withZones(box, [inner], [d]);
    expect(deviceZones(level, d)).toEqual([{ zone: inner, participates: true }]);
    const outer = dev('w', { mode: 'wall', wallId: 'w0', side: 'left', offset: 1000 }); // y = -200
    expect(deviceZones(withZones(box, [inner], [outer]), outer)).toEqual([]);
  });

  it('zoneMembers lists inside devices only', () => {
    const d1 = dev('d1', at(500, 500));
    const d2 = dev('d2', at(2500, 2500));
    const d3 = dev('d3', at(1500, 1500), ['A']);
    const d4 = dev('d4', at(2000, 1000)); // on the edge of A
    const level = withZones(box, [a, b], [d1, d2, d3, d4]);
    expect(zoneMembers(level, 'A')).toEqual([
      { device: d1, participates: true }, { device: d3, participates: false }, { device: d4, participates: true },
    ]);
    expect(zoneMembers(level, 'missing')).toEqual([]);
  });
});

describe('zoneLabelPoint', () => {
  it('a square gives its centre', () => {
    const p = zoneLabelPoint(pts([0, 0], [2000, 0], [2000, 2000], [0, 2000]));
    expect(p.x).toBeCloseTo(1000);
    expect(p.y).toBeCloseTo(1000);
  });

  it('a U-shape whose centroid lies outside gives the vertex mean', () => {
    // Centroid (1500, 1642.9) lies in the notch x 1000..2000, y 0..2000.
    const u = pts([0, 0], [1000, 0], [1000, 2000], [2000, 2000], [2000, 0], [3000, 0], [3000, 3000], [0, 3000]);
    expect(zoneLabelPoint(u)).toEqual({ x: 1500, y: 1250 });
  });

  it('a degenerate ring gives the vertex mean', () => {
    expect(zoneLabelPoint(pts([0, 0], [1000, 0], [2000, 0]))).toEqual({ x: 1000, y: 0 });
  });
});
