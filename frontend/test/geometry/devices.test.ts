import { describe, it, expect } from 'vitest';
import { deviceDefaults, type Device, type DevicePlacement, type DeviceProps, type Level } from '../../src/model/types';
import { addZone } from '../../src/model/zones';
import {
  deviceRoomId, angleFromHandle, clippedCone, coneShape, deviceAt, devicePose, directionHandle, wrap180, wrap360,
} from '../../src/geometry/devices';
import { polygonArea } from '../../src/geometry/vec';
import { rectRoomLevel } from '../fixtures';

const dev = (id: string, props: DeviceProps, placement: DevicePlacement): Device =>
  ({ id, name: id, props, placement, invalid: false });
const withDevs = (level: Level, ...devices: Device[]): Level => ({ ...level, devices });
const area = (rings: { x: number; y: number }[][]): number =>
  rings.reduce((s, r) => s + Math.abs(polygonArea(r)), 0);

describe('devicePose', () => {
  const box = rectRoomLevel(3000, 4000, 400);

  it('wall device on side right of the top wall sits on the inner face, facing in', () => {
    const d = dev('s', { kind: 'switch' }, { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    const p = devicePose(box, d)!;
    expect(p.pt.x).toBeCloseTo(1500);
    expect(p.pt.y).toBeCloseTo(200);
    expect(p.dir.x).toBeCloseTo(0);
    expect(p.dir.y).toBeCloseTo(1);
  });

  it('wall device on side left of the top wall sits on the outer face, facing out', () => {
    const d = dev('s', { kind: 'switch' }, { mode: 'wall', wallId: 'w0', side: 'left', offset: 1500 });
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
    const d = dev('s', { kind: 'switch' }, { mode: 'wall', wallId: 'nope', side: 'left', offset: 0 });
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

  it('device outside the box is not clipped', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const d = dev('m', { kind: 'motion_sensor', zoneAngle: 360, zoneRange: 5000 }, { mode: 'free', x: -3000, y: -3000, rotation: 0 });
    expect(clippedCone(box, d)).toEqual([coneShape(box, d)]);
  });

  it('ceiling_light pool: null without poolRadius, circle with it; switch has none', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const cl = deviceDefaults('ceiling_light', 'free');
    const off = dev('c', cl, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    expect(coneShape(box, off)).toBeNull();
    expect(clippedCone(box, off)).toEqual([]);
    const on = dev('c', { ...cl, poolRadius: 1000 } as DeviceProps, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    const c = coneShape(box, on)!;
    expect(c.length).toBe(128);
    expect(Math.abs(polygonArea(c)) / (Math.PI * 1e6)).toBeGreaterThan(0.99);
    const sw = dev('s', { kind: 'switch' }, { mode: 'wall', wallId: 'w0', side: 'right', offset: 100 });
    expect(coneShape(box, sw)).toBeNull();
    expect(clippedCone(box, sw)).toEqual([]);
  });

  it('room holes are asked for only when the device has a cone, through the given getter', () => {
    const box = rectRoomLevel(3000, 4000, 400);
    const calls: Level[] = [];
    const holesOf = (l: Level) => { calls.push(l); return []; };
    const sw = dev('s', { kind: 'switch' }, { mode: 'wall', wallId: 'w0', side: 'right', offset: 100 });
    expect(clippedCone(box, sw, holesOf)).toEqual([]);
    expect(calls).toEqual([]);
    const m = dev('m', { kind: 'motion_sensor', zoneAngle: 360, zoneRange: 5000 }, { mode: 'free', x: 1500, y: 2000, rotation: 0 });
    expect(clippedCone(box, m, holesOf)).toEqual([coneShape(box, m)]);
    expect(calls).toEqual([box]);
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
    dev('e', { kind: 'equipment', shape: 'rect', width: 600, depth: 600, diameter: 600, symbol: 'pc', label: '' },
      { mode: 'free', x: 1000, y: 1000, rotation });

  it('rotated equipment rect is hit inside, missed outside', () => {
    const level = withDevs(rectRoomLevel(3000, 4000, 400), eq(45));
    expect(deviceAt(level, { x: 1000, y: 1400 }, 0)).toBe('e');
    expect(deviceAt(level, { x: 1400, y: 1400 }, 0)).toBeNull();
  });

  it('equipment circle is hit within diameter/2 + tol', () => {
    const c = dev('c', { kind: 'equipment', shape: 'circle', width: 0, depth: 0, diameter: 600, symbol: 'pc', label: '' },
      { mode: 'free', x: 0, y: 0, rotation: 0 });
    const level = withDevs(rectRoomLevel(3000, 4000, 400), c);
    expect(deviceAt(level, { x: 340, y: 0 }, 50)).toBe('c');
    expect(deviceAt(level, { x: 360, y: 0 }, 50)).toBeNull();
  });

  it('icon device is hit within tol of its pose point; topmost wins', () => {
    const a = dev('a', { kind: 'switch' }, { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
    const b = dev('b', { kind: 'socket' }, { mode: 'wall', wallId: 'w0', side: 'right', offset: 1520 });
    const level = withDevs(rectRoomLevel(3000, 4000, 400), a, b);
    expect(deviceAt(level, { x: 1510, y: 200 }, 100)).toBe('b');
    expect(deviceAt(level, { x: 1400, y: 200 }, 50)).toBeNull();
    expect(deviceAt(level, { x: 1460, y: 200 }, 50)).toBe('a');
  });

  it('an icon device under an equipment block stays selectable (icons first, then bodies)', () => {
    const body = dev('body', { kind: 'equipment', shape: 'rect', width: 1000, depth: 1000, diameter: 600, symbol: 'pc', label: '' },
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
  it('null for a switch', () => {
    const d = dev('s', { kind: 'switch' }, { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
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
