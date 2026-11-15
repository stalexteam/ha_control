import { describe, it, expect } from 'vitest';
import { rectRoomLevel } from '../fixtures';
import { addDevice, deleteDevice, moveDevice, refreshDevices, setDeviceProps } from '../../src/model/devices';
import { deleteWall, mergeNodes, moveNode } from '../../src/model/ops';
import { deviceDefaults, normalizeLevel, type DevicePlacement, type Level } from '../../src/model/types';

const room = (): Level => rectRoomLevel(3000, 4000, 400);
const onWall = (wallId: string, offset: number): DevicePlacement => ({ mode: 'wall', wallId, side: 'right', offset });
const free: DevicePlacement = { mode: 'free', x: 100, y: 200, rotation: 0 };

describe('addDevice', () => {
  it('switch on top wall', () => {
    const { level, deviceId } = addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 1500), 'S');
    expect(deviceId).not.toBeNull();
    expect(level.devices).toHaveLength(1);
    expect(level.devices[0].invalid).toBe(false);
  });
  it('switch free -> null, same level', () => {
    const l = room();
    const r = addDevice(l, deviceDefaults('switch', 'wall'), free, 'S');
    expect(r.deviceId).toBeNull();
    expect(r.level).toBe(l);
  });
  it('equipment on wall -> null', () => {
    expect(addDevice(room(), deviceDefaults('equipment', 'free'), onWall('w0', 1000), 'E').deviceId).toBeNull();
  });
  it('offset 3500 on 3000 wall -> null', () => {
    expect(addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 3500), 'S').deviceId).toBeNull();
  });
  it('unknown wall -> null', () => {
    expect(addDevice(room(), deviceDefaults('switch', 'wall'), onWall('nope', 10), 'S').deviceId).toBeNull();
  });
});

describe('moveDevice', () => {
  it('wall light wall -> free', () => {
    const a = addDevice(room(), deviceDefaults('wall_light', 'wall'), onWall('w0', 1000), 'L');
    const l = moveDevice(a.level, a.deviceId!, free);
    expect(l.devices[0].placement.mode).toBe('free');
  });
  it('switch to free -> unchanged', () => {
    const a = addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 1000), 'S');
    expect(moveDevice(a.level, a.deviceId!, free)).toBe(a.level);
  });
  it('wall offset outside wall -> unchanged', () => {
    const a = addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 1000), 'S');
    expect(moveDevice(a.level, a.deviceId!, onWall('w0', 3500))).toBe(a.level);
  });
  it('motion sensor free -> wall resets 360 to 110', () => {
    const a = addDevice(room(), deviceDefaults('motion_sensor', 'free'), free, 'M');
    const l = moveDevice(a.level, a.deviceId!, onWall('w0', 1000));
    expect(l.devices[0].props).toMatchObject({ zoneAngle: 110 });
  });
  it('motion sensor wall -> free resets 110 to 360', () => {
    const a = addDevice(room(), deviceDefaults('motion_sensor', 'wall'), onWall('w0', 1000), 'M');
    expect(moveDevice(a.level, a.deviceId!, free).devices[0].props).toMatchObject({ zoneAngle: 360 });
  });
  it('custom zoneAngle 200 kept', () => {
    const a = addDevice(room(), { kind: 'motion_sensor', zoneAngle: 200, zoneRange: 5000 }, free, 'M');
    const l = moveDevice(a.level, a.deviceId!, onWall('w0', 1000));
    expect(l.devices[0].props).toMatchObject({ zoneAngle: 200 });
  });
});

describe('setDeviceProps / deleteDevice', () => {
  it('patches props and name, never kind', () => {
    const a = addDevice(room(), deviceDefaults('wall_light', 'wall'), onWall('w0', 1000), 'L');
    const l = setDeviceProps(a.level, a.deviceId!, { coneAngle: 60, kind: 'switch' } as never, 'New');
    expect(l.devices[0].props).toMatchObject({ kind: 'wall_light', coneAngle: 60 });
    expect(l.devices[0].name).toBe('New');
  });
  it('deleteDevice removes', () => {
    const a = addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 1000), 'S');
    expect(deleteDevice(a.level, a.deviceId!).devices).toHaveLength(0);
  });
});

describe('ops integration', () => {
  it('deleteWall removes hosted devices only', () => {
    let l = addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 1000), 'S').level;
    l = addDevice(l, deviceDefaults('socket', 'wall'), onWall('w1', 1000), 'K').level;
    l = addDevice(l, deviceDefaults('equipment', 'free'), free, 'E').level;
    const r = deleteWall(l, 'w0');
    expect(r.devices.map(d => d.name).sort()).toEqual(['E', 'K']);
  });
  it('node A moved outward keeps world position', () => {
    const l = addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 1000), 'S').level;
    const r = moveNode(l, 'n0', { x: -500, y: 0 });
    const p = r.devices[0].placement;
    expect(p.mode === 'wall' && p.offset).toBeCloseTo(1500);
    expect(r.devices[0].invalid).toBe(false);
  });
  it('shortening wall below offset -> invalid, kept', () => {
    const l = addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 2500), 'S').level;
    const r = moveNode(l, 'n1', { x: 1000, y: 0 });
    expect(r.devices).toHaveLength(1);
    expect(r.devices[0].invalid).toBe(true);
  });
  it('tolerates level without devices', () => {
    const l = { ...room() } as Partial<Level>;
    delete l.devices;
    expect(() => moveNode(l as Level, 'n0', { x: 10, y: 0 })).not.toThrow();
    expect(refreshDevices(l as Level).devices).toEqual([]);
  });
});

describe('moveDevice refresh and mergeNodes', () => {
  const invalidated = () => {
    const l = addDevice(room(), deviceDefaults('wall_light', 'wall'), onWall('w0', 2500), 'L').level;
    const r = moveNode(l, 'n1', { x: 1000, y: 0 });
    expect(r.devices[0].invalid).toBe(true);
    return r;
  };
  it('invalid device moved to valid offset -> invalid false', () => {
    const r = invalidated();
    expect(moveDevice(r, r.devices[0].id, onWall('w0', 500)).devices[0].invalid).toBe(false);
  });
  it('invalid wall light moved to free -> invalid false', () => {
    const r = invalidated();
    expect(moveDevice(r, r.devices[0].id, free).devices[0].invalid).toBe(false);
  });
  it('mergeNodes collapsing a wall removes its hosted devices', () => {
    let l = addDevice(room(), deviceDefaults('switch', 'wall'), onWall('w0', 1000), 'S').level;
    l = addDevice(l, deviceDefaults('socket', 'wall'), onWall('w1', 1000), 'K').level;
    const r = mergeNodes(l, 'n0', 'n1');
    expect(r.walls.some(w => w.id === 'w0')).toBe(false);
    expect(r.devices.map(d => d.name)).toEqual(['K']);
  });
});

describe('normalizeLevel', () => {
  it('adds devices', () => {
    const l = { ...room() } as Partial<Level>;
    delete l.devices;
    expect(normalizeLevel(l as Level).devices).toEqual([]);
  });
  it('same object when present', () => {
    const l = room();
    expect(normalizeLevel(l)).toBe(l);
  });
});

describe('purity', () => {
  it('inputs not mutated', () => {
    const base = addDevice(room(), deviceDefaults('motion_sensor', 'free'), free, 'M').level;
    const snap = structuredClone(base);
    const id = base.devices[0].id;
    moveDevice(base, id, onWall('w0', 1000));
    setDeviceProps(base, id, { zoneRange: 1 }, 'x');
    deleteDevice(base, id);
    moveNode(base, 'n0', { x: -500, y: 0 });
    deleteWall(base, 'w0');
    expect(base).toEqual(snap);
  });
});
