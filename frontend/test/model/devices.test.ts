import { describe, it, expect } from 'vitest';
import { rectRoomLevel } from '../fixtures';
import {
  addDevice, changeDeviceKind, deleteDevice, moveDevice, retargetZoneAngle, setDeviceProps,
} from '../../src/model/devices';
import { setBinding } from '../../src/model/bindings';
import { deleteWall, mergeNodes, moveNode } from '../../src/model/ops';
import { deviceDefaults, normalizeLevel, type DevicePlacement, type Level } from '../../src/model/types';

const room = (): Level => rectRoomLevel(3000, 4000, 400);
const onWall = (wallId: string, offset: number): DevicePlacement => ({ mode: 'wall', wallId, side: 'right', offset });
const free: DevicePlacement = { mode: 'free', x: 100, y: 200, rotation: 0 };

describe('addDevice', () => {
  it('wall switch on top wall', () => {
    const { level, deviceId } = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1500), 'S');
    expect(deviceId).not.toBeNull();
    expect(level.devices).toHaveLength(1);
    expect(level.devices[0].invalid).toBe(false);
  });
  it('wall switch free -> null, same level', () => {
    const l = room();
    const r = addDevice(l, deviceDefaults('wall_switch', 'wall'), free, 'S');
    expect(r.deviceId).toBeNull();
    expect(r.level).toBe(l);
  });
  it('equipment on a wall is a wall mount; a ceiling light on a wall -> null', () => {
    expect(addDevice(room(), deviceDefaults('equipment', 'wall'), onWall('w0', 1000), 'E').deviceId).not.toBeNull();
    expect(addDevice(room(), deviceDefaults('ceiling_light', 'free'), onWall('w0', 1000), 'L').deviceId).toBeNull();
  });
  it('offset 3500 on 3000 wall -> null', () => {
    expect(addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 3500), 'S').deviceId).toBeNull();
  });
  it('unknown wall -> null', () => {
    expect(addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('nope', 10), 'S').deviceId).toBeNull();
  });
});

describe('aim', () => {
  const aimed = (aim: number): DevicePlacement => ({ mode: 'wall', wallId: 'w0', side: 'right', offset: 1500, aim });
  it('addDevice accepts -80..80, rejects 90 and fractions', () => {
    const p = deviceDefaults('motion_sensor', 'wall');
    expect(addDevice(room(), p, aimed(80), 'M').deviceId).not.toBeNull();
    expect(addDevice(room(), p, aimed(-80), 'M').deviceId).not.toBeNull();
    expect(addDevice(room(), p, aimed(90), 'M').deviceId).not.toBeNull();
    expect(addDevice(room(), p, aimed(-90), 'M').deviceId).not.toBeNull();
    expect(addDevice(room(), p, aimed(91), 'M').deviceId).toBeNull();
    expect(addDevice(room(), p, aimed(-91), 'M').deviceId).toBeNull();
    expect(addDevice(room(), p, aimed(10.5), 'M').deviceId).toBeNull();
  });
  it('moveDevice rejects aim 91', () => {
    const a = addDevice(room(), deviceDefaults('motion_sensor', 'wall'), onWall('w0', 1000), 'M');
    expect(moveDevice(a.level, a.deviceId!, aimed(91))).toBe(a.level);
    expect(moveDevice(a.level, a.deviceId!, aimed(-30)).devices[0].placement).toMatchObject({ aim: -30 });
  });
});

describe('moveDevice', () => {
  it('wall light wall -> free', () => {
    const a = addDevice(room(), deviceDefaults('wall_light', 'wall'), onWall('w0', 1000), 'L');
    const l = moveDevice(a.level, a.deviceId!, free);
    expect(l.devices[0].placement.mode).toBe('free');
  });
  it('wall switch to free -> unchanged', () => {
    const a = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1000), 'S');
    expect(moveDevice(a.level, a.deviceId!, free)).toBe(a.level);
  });
  it('wall offset outside wall -> unchanged', () => {
    const a = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1000), 'S');
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

describe('retargetZoneAngle', () => {
  const motion = (zoneAngle: number) => ({ kind: 'motion_sensor', zoneAngle, zoneRange: 5000 } as const);
  it('a default zone angle follows the new mode; a user-set one stays', () => {
    expect(retargetZoneAngle(motion(360), 'free', 'wall')).toEqual(motion(110));
    expect(retargetZoneAngle(motion(110), 'wall', 'free')).toEqual(motion(360));
    const own = motion(180);
    expect(retargetZoneAngle(own, 'free', 'wall')).toBe(own);
  });
  it('same mode or another kind: the same object', () => {
    const m = motion(360);
    expect(retargetZoneAngle(m, 'free', 'free')).toBe(m);
    const light = deviceDefaults('wall_light', 'free');
    expect(retargetZoneAngle(light, 'free', 'wall')).toBe(light);
  });
});

describe('setDeviceProps / deleteDevice', () => {
  it('patches props and name, never kind', () => {
    const a = addDevice(room(), deviceDefaults('wall_light', 'wall'), onWall('w0', 1000), 'L');
    const l = setDeviceProps(a.level, a.deviceId!, { coneAngle: 60, kind: 'wall_switch' } as never, 'New');
    expect(l.devices[0].props).toMatchObject({ kind: 'wall_light', coneAngle: 60 });
    expect(l.devices[0].name).toBe('New');
  });
  it('deleteDevice removes', () => {
    const a = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1000), 'S');
    expect(deleteDevice(a.level, a.deviceId!).devices).toHaveLength(0);
  });
});

describe('changeDeviceKind', () => {
  it('keeps id, name and placement, resets props, and drops bindings', () => {
    let l = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1000), 'S').level;
    const id = l.devices[0].id;
    l = setBinding(setDeviceProps(l, id, { autoByDoubleToggle: true, windowSec: 5 }), id, 'state', 'switch.x');
    const r = changeDeviceKind(l, id, 'smart_button');
    const d = r.devices[0];
    expect(d.id).toBe(id);
    expect(d.name).toBe('S');
    expect(d.placement).toBe(l.devices[0].placement);
    expect(d.props).toEqual(deviceDefaults('smart_button', 'wall'));
    expect('bindings' in d).toBe(false);
    const back = changeDeviceKind(setBinding(r, id, 'on', 'sensor.a'), id, 'wall_switch');
    expect(back.devices[0].props).toEqual(deviceDefaults('wall_switch', 'wall'));
    expect('bindings' in back.devices[0]).toBe(false);
  });
  it('a valve is not converted', () => {
    const l = addDevice(room(), deviceDefaults('valve', 'wall'), onWall('w0', 1000), 'V').level;
    expect(changeDeviceKind(l, l.devices[0].id, 'smart_button')).toBe(l);
    expect(changeDeviceKind(l, l.devices[0].id, 'wall_switch')).toBe(l);
  });
  it('a free smart button -> wall_switch returns the same level', () => {
    const l = addDevice(room(), deviceDefaults('smart_button', 'free'), free, 'B').level;
    expect(changeDeviceKind(l, l.devices[0].id, 'wall_switch')).toBe(l);
  });
  it('the same kind, an unknown id or a device that is not a container -> the same level', () => {
    let l = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1000), 'S').level;
    l = addDevice(l, deviceDefaults('socket', 'wall'), onWall('w1', 1000), 'K').level;
    expect(changeDeviceKind(l, l.devices[0].id, 'wall_switch')).toBe(l);
    expect(changeDeviceKind(l, 'nope', 'smart_button')).toBe(l);
    expect(changeDeviceKind(l, l.devices[1].id, 'smart_button')).toBe(l);
  });
});

describe('ops integration', () => {
  it('deleteWall removes hosted devices only', () => {
    let l = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1000), 'S').level;
    l = addDevice(l, deviceDefaults('socket', 'wall'), onWall('w1', 1000), 'K').level;
    l = addDevice(l, deviceDefaults('equipment', 'free'), free, 'E').level;
    const r = deleteWall(l, 'w0');
    expect(r.devices.map(d => d.name).sort()).toEqual(['E', 'K']);
  });
  it('node A moved outward keeps world position', () => {
    const l = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1000), 'S').level;
    const r = moveNode(l, 'n0', { x: -500, y: 0 });
    const p = r.devices[0].placement;
    expect(p.mode === 'wall' && p.offset).toBeCloseTo(1500);
    expect(r.devices[0].invalid).toBe(false);
  });
  it('shortening wall below offset -> invalid, kept', () => {
    const l = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 2500), 'S').level;
    const r = moveNode(l, 'n1', { x: 1000, y: 0 });
    expect(r.devices).toHaveLength(1);
    expect(r.devices[0].invalid).toBe(true);
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
    let l = addDevice(room(), deviceDefaults('wall_switch', 'wall'), onWall('w0', 1000), 'S').level;
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

describe('climate sensor and exhaust fan', () => {
  it('fan on wall accepted, on free rejected; climate on both', () => {
    expect(addDevice(room(), deviceDefaults('exhaust_fan', 'wall'), onWall('w0', 1000), 'F').deviceId).not.toBeNull();
    expect(addDevice(room(), deviceDefaults('exhaust_fan', 'wall'), free, 'F').deviceId).toBeNull();
    expect(addDevice(room(), deviceDefaults('climate_sensor', 'wall'), onWall('w0', 1000), 'C').deviceId).not.toBeNull();
    expect(addDevice(room(), deviceDefaults('climate_sensor', 'free'), free, 'C').deviceId).not.toBeNull();
  });
  it('defaults', () => {
    expect(deviceDefaults('climate_sensor', 'free')).toEqual({ kind: 'climate_sensor' });
    expect(deviceDefaults('exhaust_fan', 'wall')).toEqual({ kind: 'exhaust_fan', diameter: 100 });
  });
  it('deleting the hosting wall removes the fan', () => {
    const a = addDevice(room(), deviceDefaults('exhaust_fan', 'wall'), onWall('w0', 1000), 'F');
    expect(deleteWall(a.level, 'w0').devices).toHaveLength(0);
  });
});
