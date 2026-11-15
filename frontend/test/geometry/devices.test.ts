import { afterEach, describe, it, expect, vi } from 'vitest';
import polygonClipping from 'polygon-clipping';
import {
  DEVICE_PLACEMENTS, deviceDefaults, type Device, type DeviceKind, type DevicePlacement, type DeviceProps, type Level, type Pt,
} from '../../src/model/types';
import { addZone } from '../../src/model/zones';
import {
  CONE_MEDIUM, coneMedium, deviceRoomId, angleFromHandle, clippedCone, coneShape, deviceAt, devicePose, directionHandle,
  wrap180, wrap360,
} from '../../src/geometry/devices';
import { lineOfSightObstacles, type Medium, type Segment } from '../../src/geometry/visibility';
import { pointInPolygon, polygonArea } from '../../src/geometry/vec';
import { fromRing, toPoly } from '../../src/geometry/walls';
import { midGap, rectRoomLevel, twoRoomsLevel } from '../fixtures';

const dev = (id: string, props: DeviceProps, placement: DevicePlacement): Device =>
  ({ id, name: id, props, placement, invalid: false });
const withDevs = (level: Level, ...devices: Device[]): Level => ({ ...level, devices });
const area = (rings: { x: number; y: number }[][]): number =>
  rings.reduce((s, r) => s + Math.abs(polygonArea(r)), 0);

describe('devicePose', () => {
  const box = rectRoomLevel(3000, 4000, 400);

  it('wall device on side right of the top wall sits on the inner face, facing in', () => {
    const d = dev('s', deviceDefaults('wall_switch', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    const p = devicePose(box, d)!;
    expect(p.pt.x).toBeCloseTo(1500);
    expect(p.pt.y).toBeCloseTo(200);
    expect(p.dir.x).toBeCloseTo(0);
    expect(p.dir.y).toBeCloseTo(1);
  });

  it('wall device on side left of the top wall sits on the outer face, facing out', () => {
    const d = dev('s', deviceDefaults('wall_switch', 'wall'), { mode: 'wall', wallId: 'w0', side: 'left', offset: 1500 });
    const p = devicePose(box, d)!;
    expect(p.pt.y).toBeCloseTo(-200);
    expect(p.dir.x).toBeCloseTo(0);
    expect(p.dir.y).toBeCloseTo(-1);
  });

  it('wall aim +45 rotates dir counter-clockwise on screen', () => {
    const d = dev('m', deviceDefaults('motion_sensor', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500, aim: 45 });
    const p = devicePose(box, d)!;
    expect(p.pt.x).toBeCloseTo(1500);
    expect(p.pt.y).toBeCloseTo(200);
    expect(p.dir.x).toBeCloseTo(Math.SQRT1_2);
    expect(p.dir.y).toBeCloseTo(Math.SQRT1_2);
  });

  it('wall aim -30 mirrors and missing aim is 0', () => {
    const pl = { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 } as const;
    const m = devicePose(box, dev('m', deviceDefaults('motion_sensor', 'wall'), { ...pl, aim: -30 }))!;
    expect(m.dir.x).toBeCloseTo(-0.5);
    const z = devicePose(box, dev('m', deviceDefaults('motion_sensor', 'wall'), pl))!;
    expect(z.dir.x).toBeCloseTo(0);
    expect(z.dir.y).toBeCloseTo(1);
  });

  it('aimed cone is centred on the rotated dir and the clip room does not change', () => {
    const pl = { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 } as const;
    const props = { kind: 'motion_sensor', zoneAngle: 60, zoneRange: 1000 } as const;
    const shape = coneShape(box, dev('m', props, { ...pl, aim: 45 }))!;
    const apex = shape[0];
    const mid = shape[Math.floor(shape.length / 2)];
    const ang = Math.atan2(mid.y - apex.y, mid.x - apex.x);
    expect(ang).toBeCloseTo(Math.PI / 4, 1);
    const a = clippedCone(box, dev('m', props, { ...pl, aim: 0 }));
    const b = clippedCone(box, dev('m', props, { ...pl, aim: 80 }));
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0); // probe stays inside the room even at 80 degrees
  });

  it('missing host wall gives null', () => {
    const d = dev('s', deviceDefaults('wall_switch', 'wall'), { mode: 'wall', wallId: 'nope', side: 'left', offset: 0 });
    expect(devicePose(box, d)).toBeNull();
  });

  it('free rotation 90 faces up on screen', () => {
    const d = dev('m', deviceDefaults('motion_sensor', 'free'), { mode: 'free', x: 10, y: 20, rotation: 90 });
    const p = devicePose(box, d)!;
    expect(p.pt).toEqual({ x: 10, y: 20 });
    expect(p.dir.x).toBeCloseTo(0);
    expect(p.dir.y).toBeCloseTo(-1);
  });
});

describe('coneShape / clippedCone', () => {
  it('wall_light 90/2000 sector outside any room has quarter-disc area', () => {
    const level: Level = { ...rectRoomLevel(3000, 4000, 400), walls: [], nodes: [] };
    const d = dev('l', { kind: 'wall_light', coneAngle: 90, coneRange: 2000 }, { mode: 'free', x: 0, y: 0, rotation: 0 });
    const shape = coneShape(level, d)!;
    expect(shape.length).toBe(34); // apex + 33 arc points
    const expected = Math.PI * 2000 ** 2 / 4;
    expect(Math.abs(Math.abs(polygonArea(shape)) - expected) / expected).toBeLessThan(0.01);
    expect(Math.abs(area(clippedCone(level, d)) - expected) / expected).toBeLessThan(0.01);
  });

  it('sector is centred on dir', () => {
    const level: Level = { ...rectRoomLevel(3000, 4000, 400), walls: [], nodes: [] };
    const d = dev('l', { kind: 'wall_light', coneAngle: 90, coneRange: 2000 }, { mode: 'free', x: 0, y: 0, rotation: 90 });
    const shape = coneShape(level, d)!;
    const cx = shape.reduce((s, p) => s + p.x, 0) / shape.length;
    const cy = shape.reduce((s, p) => s + p.y, 0) / shape.length;
    expect(Math.abs(cx)).toBeLessThan(1);
    expect(cy).toBeLessThan(-1000);
  });

  it('360 motion zone in the centre of a box is clipped to the inner room', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const d = dev('m', { kind: 'motion_sensor', zoneAngle: 360, zoneRange: 5000 }, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    expect(coneShape(box, d)!.length).toBe(128);
    const a = area(clippedCone(box, d));
    expect(a).toBeGreaterThan(0);
    expect(a).toBeLessThanOrEqual(2600 * 3600 + 1);
  });

  it('wall motion sensor facing in is clipped to the room on its side', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const d = dev('m', { kind: 'motion_sensor', zoneAngle: 110, zoneRange: 5000 },
      { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    const rings = clippedCone(box, d);
    expect(rings.length).toBeGreaterThan(0);
    for (const r of rings) for (const p of r) expect(p.y).toBeGreaterThanOrEqual(200 - 1e-6);
  });

  it('a device with no wall within reach is not clipped', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const d = dev('m', { kind: 'motion_sensor', zoneAngle: 360, zoneRange: 5000 }, { mode: 'free', x: -9000, y: -9000, rotation: 0 });
    expect(clippedCone(box, d)).toEqual([coneShape(box, d)]);
  });

  it('ceiling_light pool: null without poolRadius, circle with it; wall switch has none', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const cl = deviceDefaults('ceiling_light', 'free');
    const off = dev('c', cl, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    expect(coneShape(box, off)).toBeNull();
    expect(clippedCone(box, off)).toEqual([]);
    const on = dev('c', { ...cl, poolRadius: 1000 } as DeviceProps, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    const c = coneShape(box, on)!;
    expect(c.length).toBe(128);
    expect(Math.abs(polygonArea(c)) / (Math.PI * 1e6)).toBeGreaterThan(0.99);
    const sw = dev('s', deviceDefaults('wall_switch', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 100 });
    expect(coneShape(box, sw)).toBeNull();
    expect(clippedCone(box, sw)).toEqual([]);
  });

  it('obstacles are asked for only when the device has a cone, through the given getter, with its medium', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const calls: [Level, Medium][] = [];
    const obstaclesOf = (l: Level, m: Medium): Segment[] => { calls.push([l, m]); return []; };
    const sw = dev('s', deviceDefaults('wall_switch', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 100 });
    expect(clippedCone(box, sw, obstaclesOf)).toEqual([]);
    expect(calls).toEqual([]);
    const m = dev('m', { kind: 'motion_sensor', zoneAngle: 360, zoneRange: 5000 }, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    expect(clippedCone(box, m, obstaclesOf)).toEqual([coneShape(box, m)]);
    const wl = dev('w', { kind: 'wall_light', coneAngle: 90, coneRange: 2000 }, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    clippedCone(box, wl, obstaclesOf);
    const cl = dev('c', { ...deviceDefaults('ceiling_light', 'free'), poolRadius: 1000 } as DeviceProps, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    clippedCone(box, cl, obstaclesOf);
    expect(calls).toEqual([[box, 'motion'], [box, 'light'], [box, 'light']]);
  });

  it('CONE_MEDIUM is the one list of cone kinds: each has a shape and is clipped with its medium; no other kind has a cone', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    expect(CONE_MEDIUM).toEqual({ wall_light: 'light', ceiling_light: 'light', motion_sensor: 'motion' });
    for (const kind of Object.keys(DEVICE_PLACEMENTS) as DeviceKind[]) {
      const mode = DEVICE_PLACEMENTS[kind][0];
      const props = { ...deviceDefaults(kind, mode), ...(kind === 'ceiling_light' ? { poolRadius: 1000 } : {}) } as DeviceProps;
      const pl: DevicePlacement = mode === 'free' ? { mode, x: 1500, y: 2000, rotation: 0 } : { mode, wallId: 'w0', side: 'right', offset: 1500 };
      const d = dev(kind, props, pl);
      const media: Medium[] = [];
      const rings = clippedCone(box, d, (l, m) => { media.push(m); return lineOfSightObstacles(l, m); });
      const medium = coneMedium(kind);
      expect(medium, kind).toBe(CONE_MEDIUM[kind as keyof typeof CONE_MEDIUM] ?? null);
      if (medium) {
        expect(coneShape(box, d), kind).not.toBeNull();
        expect(rings.length, kind).toBeGreaterThan(0);
        expect(media, kind).toEqual([medium]);
      } else {
        expect(coneShape(box, d), kind).toBeNull();
        expect(rings, kind).toEqual([]);
        expect(media, kind).toEqual([]);
      }
    }
  });
});

/** Even-odd membership in the rings clippedCone returns. */
const covers = (rings: Pt[][], p: Pt): boolean => rings.filter(r => pointInPolygon(p, r)).length % 2 === 1;
const freeAt = (x: number, y: number, rotation = 0): DevicePlacement => ({ mode: 'free', x, y, rotation });
const motion = (pl: DevicePlacement, zoneAngle = 90, zoneRange = 5000) => dev('m', { kind: 'motion_sensor', zoneAngle, zoneRange }, pl);
const wallLight = (pl: DevicePlacement, coneAngle = 90, coneRange = 5000) => dev('w', { kind: 'wall_light', coneAngle, coneRange }, pl);
const pool = (pl: DevicePlacement, poolRadius = 5000) =>
  dev('c', { ...deviceDefaults('ceiling_light', 'free'), poolRadius } as DeviceProps, pl);

/** L-shaped room on axis nodes (0,0)-(4000,0)-(4000,2000)-(2000,2000)-(2000,5000)-(0,5000), 200 mm walls. */
function lRoom(): Level {
  const pts = [[0, 0], [4000, 0], [4000, 2000], [2000, 2000], [2000, 5000], [0, 5000]];
  return {
    ...rectRoomLevel(1, 1, 200),
    nodes: pts.map(([x, y], i) => ({ id: `n${i}`, x, y })),
    walls: pts.map((_, i) => ({
      id: `w${i}`, a: `n${i}`, b: `n${(i + 1) % pts.length}`, thickness: 200, type: 'partition' as const, baseline: 'center' as const,
    })),
  };
}

describe('clippedCone: line of sight', () => {
  it('wall light on a face still lights its room', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const rings = clippedCone(box, wallLight({ mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 }, 160, 6000));
    expect(rings.length).toBeGreaterThan(0);
    expect(area(rings)).toBeGreaterThan(0.5 * 2600 * 3600);
    for (const r of rings) {
      for (const p of r) {
        expect(p.x).toBeGreaterThanOrEqual(200 - 1e-6);
        expect(p.x).toBeLessThanOrEqual(2800 + 1e-6);
        expect(p.y).toBeGreaterThanOrEqual(200 - 1e-6);
        expect(p.y).toBeLessThanOrEqual(3800 + 1e-6);
      }
    }
    expect(covers(rings, { x: 1500, y: 3000 })).toBe(true);
  });

  it('a wall light on the outer face lights the outside, not its room', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const rings = clippedCone(box, wallLight({ mode: 'wall', wallId: 'w0', side: 'left', offset: 1500 }, 160, 3000));
    expect(rings.length).toBeGreaterThan(0);
    for (const r of rings) for (const p of r) expect(p.y).toBeLessThanOrEqual(-200 + 1e-6);
  });

  it('a motion sensor in an L-room does not see around the corner', () => {
    const rings = clippedCone(lRoom(), motion(freeAt(3600, 1000), 360, 8000));
    expect(covers(rings, { x: 1500, y: 4500 })).toBe(false); // far leg, behind the inner corner
    expect(covers(rings, { x: 1000, y: 1000 })).toBe(true);
    expect(covers(rings, { x: 500, y: 2500 })).toBe(true); // far leg, seen past the corner
  });

  it("an opening lets the cone through only within the gap's sight lines", () => {
    const rings = clippedCone(twoRoomsLevel([midGap('opening')]), motion(freeAt(1000, 1500)));
    expect(covers(rings, { x: 4500, y: 1500 })).toBe(true); // straight through the gap
    expect(covers(rings, { x: 4500, y: 300 })).toBe(false); // beside the gap, behind the wall
    expect(covers(rings, { x: 2000, y: 1500 })).toBe(true);
  });

  it('a door blocks like a wall', () => {
    const lv = twoRoomsLevel([midGap('door')]);
    for (const d of [motion(freeAt(1000, 1500)), wallLight(freeAt(1000, 1500)), pool(freeAt(1000, 1500))]) {
      const rings = clippedCone(lv, d);
      expect(covers(rings, { x: 4500, y: 1500 })).toBe(false);
      expect(covers(rings, { x: 2000, y: 1500 })).toBe(true);
    }
  });

  it("a window with Passes light lets a wall light's cone through but a motion sensor's zone stays blocked", () => {
    const lv = twoRoomsLevel([midGap('window', { passesLight: true })]);
    expect(covers(clippedCone(lv, wallLight(freeAt(1000, 1500))), { x: 4500, y: 1500 })).toBe(true);
    expect(covers(clippedCone(lv, pool(freeAt(1000, 1500))), { x: 4500, y: 1500 })).toBe(true);
    expect(covers(clippedCone(lv, motion(freeAt(1000, 1500))), { x: 4500, y: 1500 })).toBe(false);
    const plain = twoRoomsLevel([midGap('window')]);
    expect(covers(clippedCone(plain, wallLight(freeAt(1000, 1500))), { x: 4500, y: 1500 })).toBe(false);
  });

  it('an outdoor floodlight is clipped by the house walls', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const rings = clippedCone(box, wallLight(freeAt(-2000, 2000), 90, 6000));
    expect(covers(rings, { x: 1500, y: 2000 })).toBe(false); // inside the house
    expect(covers(rings, { x: -1000, y: 2000 })).toBe(true);
    expect(covers(rings, { x: -500, y: 2600 })).toBe(true);
  });
});

describe('wrap360 / wrap180', () => {
  it('wrap360 maps any angle to [0, 360)', () => {
    for (const [a, w] of [[0, 0], [359, 359], [360, 0], [-1, 359], [-360, 0], [725, 5], [-725, 355]]) expect(wrap360(a)).toBe(w);
  });
  it('wrap180 maps any angle to [-180, 180)', () => {
    for (const [a, w] of [[0, 0], [179, 179], [180, -180], [-180, -180], [190, -170], [-190, 170], [540, -180], [-45, -45]]) {
      expect(wrap180(a)).toBe(w);
    }
  });
});

describe('deviceAt', () => {
  const eq = (rotation: number): Device =>
    dev('e', { kind: 'equipment', shape: 'rect', width: 600, depth: 600, diameter: 600, icon: 'mdi:desktop-tower', label: '' },
      { mode: 'free', x: 1000, y: 1000, rotation });

  it('rotated equipment rect is hit inside, missed outside', () => {
    const level = withDevs(rectRoomLevel(3000, 4000, 400), eq(45));
    expect(deviceAt(level, { x: 1000, y: 1400 }, 0)).toBe('e');
    expect(deviceAt(level, { x: 1400, y: 1400 }, 0)).toBeNull();
  });

  it('equipment circle is hit within diameter/2 + tol', () => {
    const c = dev('c', { kind: 'equipment', shape: 'circle', width: 0, depth: 0, diameter: 600, icon: 'mdi:desktop-tower', label: '' },
      { mode: 'free', x: 0, y: 0, rotation: 0 });
    const level = withDevs(rectRoomLevel(3000, 4000, 400), c);
    expect(deviceAt(level, { x: 340, y: 0 }, 50)).toBe('c');
    expect(deviceAt(level, { x: 360, y: 0 }, 50)).toBeNull();
  });

  it('icon device is hit within tol of its pose point; topmost wins', () => {
    const a = dev('a', deviceDefaults('wall_switch', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    const b = dev('b', { kind: 'socket' }, { mode: 'wall', wallId: 'w0', side: 'right', offset: 1520 });
    const level = withDevs(rectRoomLevel(3000, 4000, 400), a, b);
    expect(deviceAt(level, { x: 1510, y: 200 }, 100)).toBe('b');
    expect(deviceAt(level, { x: 1400, y: 200 }, 50)).toBeNull();
    expect(deviceAt(level, { x: 1460, y: 200 }, 50)).toBe('a');
  });

  it('an icon device under an equipment block stays selectable (icons first, then bodies)', () => {
    const body = dev('body', { kind: 'equipment', shape: 'rect', width: 1000, depth: 1000, diameter: 600, icon: 'mdi:desktop-tower', label: '' },
      { mode: 'free', x: 1000, y: 1000, rotation: 0 });
    const sensor = dev('s', { kind: 'illuminance_sensor' }, { mode: 'free', x: 1000, y: 1000, rotation: 0 });
    const level = withDevs(rectRoomLevel(3000, 4000, 400), sensor, body); // body drawn last (topmost)
    expect(deviceAt(level, { x: 1010, y: 1000 }, 50)).toBe('s');
    expect(deviceAt(level, { x: 1400, y: 1000 }, 50)).toBe('body');
  });

  it('a linear ceiling light is hit along its whole length, rotated, within tol', () => {
    const lin = (rotation: number) => dev('l', { ...deviceDefaults('ceiling_light', 'free'), shape: 'linear', length: 1200, width: 40 } as DeviceProps,
      { mode: 'free', x: 1000, y: 1000, rotation });
    const flat = withDevs(rectRoomLevel(3000, 4000, 400), lin(0));
    expect(deviceAt(flat, { x: 1500, y: 1010 }, 50)).toBe('l');
    expect(deviceAt(flat, { x: 1700, y: 1000 }, 50)).toBeNull();
    expect(deviceAt(flat, { x: 1500, y: 1100 }, 50)).toBeNull();
    const up = withDevs(rectRoomLevel(3000, 4000, 400), lin(90)); // 90 deg: along screen -Y
    expect(deviceAt(up, { x: 1000, y: 500 }, 50)).toBe('l');
    expect(deviceAt(up, { x: 1500, y: 1000 }, 50)).toBeNull();
  });
});

describe('direction handle', () => {
  const box = rectRoomLevel(3000, 4000, 400);
  it('wall device aim 0 on the top wall points (0,1), length 60/scale', () => {
    const d = dev('m', deviceDefaults('motion_sensor', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    const h = directionHandle(box, d, 0.5)!;
    expect(h.from.x).toBeCloseTo(1500);
    expect(h.from.y).toBeCloseTo(200);
    expect(h.to.x - h.from.x).toBeCloseTo(0);
    expect(h.to.y - h.from.y).toBeCloseTo(120);
  });
  it('free rotation 90 points (0,-1)', () => {
    const d = dev('w', deviceDefaults('wall_light', 'free'), { mode: 'free', x: 1000, y: 1000, rotation: 90 });
    const h = directionHandle(box, d, 1)!;
    expect(h.to.x - h.from.x).toBeCloseTo(0);
    expect(h.to.y - h.from.y).toBeCloseTo(-60);
  });
  it('null for a wall switch', () => {
    const d = dev('s', deviceDefaults('wall_switch', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    expect(directionHandle(box, d, 1)).toBeNull();
  });
  it('angleFromHandle clamps wall aim and normalises free rotation', () => {
    const d = dev('m', deviceDefaults('motion_sensor', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    const pl = angleFromHandle(box, d, { x: 1500 + 1000, y: 200 - 100 }, false);
    expect(pl).toMatchObject({ mode: 'wall', aim: 90 });
    const f = dev('w', deviceDefaults('wall_light', 'free'), { mode: 'free', x: 0, y: 0, rotation: 0 });
    expect(angleFromHandle(box, f, { x: 0, y: 100 }, false)).toMatchObject({ mode: 'free', rotation: 270 });
  });
});

describe('deviceRoomId and no-cone kinds', () => {
  const box = rectRoomLevel(3000, 4000, 400);
  it('sensor inside a zone gives its id, outside null', () => {
    const z = addZone(box, { x: 1500, y: 2000 }, 'R');
    const inside = dev('c', deviceDefaults('climate_sensor', 'free'), { mode: 'free', x: 1000, y: 1000, rotation: 0 });
    const outside = dev('c2', deviceDefaults('climate_sensor', 'free'), { mode: 'free', x: 9000, y: 9000, rotation: 0 });
    const lv = withDevs(z.level, inside, outside);
    expect(deviceRoomId(lv, inside)).toBe(z.zoneId);
    expect(deviceRoomId(lv, outside)).toBeNull();
  });
  it('coneShape null for climate sensor and fan', () => {
    const c = dev('c', deviceDefaults('climate_sensor', 'free'), { mode: 'free', x: 1000, y: 1000, rotation: 0 });
    const f = dev('f', deviceDefaults('exhaust_fan', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    expect(coneShape(box, c)).toBeNull();
    expect(coneShape(box, f)).toBeNull();
    expect(deviceAt(withDevs(box, f), { x: 1500, y: 200 }, 50)).toBe('f');
  });
});

describe('clippedCone: robust clipping and corner devices', () => {
  afterEach(() => { vi.restoreAllMocks(); });

  /** The room rectangle inside the inner faces of rectRoomLevel(w, d, t), corners clockwise from the top left. */
  const innerRect = (w: number, d: number, t: number): Pt[] =>
    [{ x: t / 2, y: t / 2 }, { x: w - t / 2, y: t / 2 }, { x: w - t / 2, y: d - t / 2 }, { x: t / 2, y: d - t / 2 }];
  /** Every ring point lies inside the room rectangle (within eps mm). */
  const inside = (rings: Pt[][], room: Pt[], eps = 0.01): boolean => rings.every(r => r.every(p =>
    p.x >= room[0].x - eps && p.x <= room[2].x + eps && p.y >= room[0].y - eps && p.y <= room[2].y + eps));
  /** A default wall device on the inner (right) face of a rectRoomLevel wall. */
  const wallDev = (kind: 'motion_sensor' | 'wall_light', wallId: string, offset: number): Device =>
    dev('d', deviceDefaults(kind, 'wall'), { mode: 'wall', wallId, side: 'right', offset });
  /** lineOfSightObstacles cached per medium: the sweep clips hundreds of cones on one level. */
  const cached = () => {
    const m = new Map<Medium, Segment[]>();
    return (l: Level, md: Medium): Segment[] => {
      if (!m.has(md)) m.set(md, lineOfSightObstacles(l, md));
      return m.get(md)!;
    };
  };

  it('wall motion sensors and wall lights swept along every wall clip without a clipping failure and stay in the room', () => {
    const spy = vi.spyOn(polygonClipping, 'intersection');
    const outside: string[] = [];
    for (const [w, d, t] of [[4000, 3000, 200], [5000, 3600, 250]]) {
      const box = rectRoomLevel(w, d, t);
      const room = innerRect(w, d, t);
      const obstaclesOf = cached();
      for (const wall of box.walls) {
        const len = wall.id === 'w0' || wall.id === 'w2' ? w : d;
        for (let off = t; off <= len - t; off += 10) {
          for (const kind of ['motion_sensor', 'wall_light'] as const) {
            const rings = clippedCone(box, wallDev(kind, wall.id, off), obstaclesOf);
            if (rings.length === 0 || !inside(rings, room)) outside.push(`${w}x${d} ${kind} ${wall.id} ${off}`);
          }
        }
      }
    }
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.results.filter(r => r.type === 'throw').length).toBe(0);
    expect(outside).toEqual([]);
  });

  it('when clipping fails the cone falls back to what the device sees, never through the walls', () => {
    vi.spyOn(polygonClipping, 'intersection').mockImplementation(() => { throw new Error('Unable to complete output ring'); });
    const box = rectRoomLevel(4000, 3000, 200);
    const rings = clippedCone(box, wallDev('motion_sensor', 'w0', 2000));
    expect(rings.length).toBeGreaterThan(0);
    expect(inside(rings, innerRect(4000, 3000, 200))).toBe(true);
    expect(covers(rings, { x: 2000, y: 1500 })).toBe(true);
  });

  it('a sensor or light snapped to a room corner keeps its zone, inside the walls', () => {
    const box = rectRoomLevel(4000, 3000, 200);
    const room = innerRect(4000, 3000, 200);
    // 0 and 4000: the ends the device tool snaps to (inside the perpendicular wall); 100 and 3900: the inner corners.
    const bad: string[] = [];
    for (const off of [0, 50, 100, 3900, 3950, 4000]) {
      for (const kind of ['motion_sensor', 'wall_light'] as const) {
        const d = wallDev(kind, 'w0', off);
        const exact = area(polygonClipping.intersection(toPoly(coneShape(box, d)!), toPoly(room)).flatMap(p => p.map(fromRing)));
        const rings = clippedCone(box, d);
        const a = area(rings);
        if (!inside(rings, room) || Math.abs(a - exact) / exact > 0.02) {
          bad.push(`${kind} ${off}: ${(a / 1e6).toFixed(2)} m2 (expected ${(exact / 1e6).toFixed(2)}), inside ${inside(rings, room)}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
