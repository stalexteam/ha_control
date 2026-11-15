import { describe, it, expect } from 'vitest';
import { rectRoomLevel } from '../fixtures';
import { addDevice } from '../../src/model/devices';
import { alsoBoundTo, bindingStatus, roleCount, sanitizeBindings, setBinding, type Presence } from '../../src/model/bindings';
import { deviceDefaults, normalizeLevel, type DeviceKind, type Level } from '../../src/model/types';

const free = { mode: 'wall', wallId: 'w0', side: 'right', offset: 500 } as const;
function withDevice(kind: DeviceKind, name = 'D'): { level: Level; id: string } {
  const r = addDevice(rectRoomLevel(3000, 4000, 400), deviceDefaults(kind, 'wall'), free, name);
  return { level: r.level, id: r.deviceId! };
}
const present = (): Presence => 'present';

describe('setBinding', () => {
  it('stores, is idempotent, and null removes', () => {
    const { level, id } = withDevice('socket');
    const a = setBinding(level, id, 'control', 'switch.x');
    expect(a.devices[0].bindings).toEqual({ control: 'switch.x' });
    expect(setBinding(a, id, 'control', 'switch.x')).toBe(a);
    const b = setBinding(a, id, 'control', null);
    expect(b.devices[0].bindings).toBeUndefined();
    expect(setBinding(b, id, 'control', null)).toBe(b);
  });
  it('role invalid for kind -> same level', () => {
    const { level, id } = withDevice('socket');
    expect(setBinding(level, id, 'motion', 'binary_sensor.m')).toBe(level);
  });
  it('unknown device -> same level', () => {
    const { level } = withDevice('socket');
    expect(setBinding(level, 'nope', 'control', 'switch.x')).toBe(level);
  });
});

describe('bindingStatus', () => {
  it('socket control only -> bound', () => {
    const { level, id } = withDevice('socket');
    expect(bindingStatus(setBinding(level, id, 'control', 'switch.x').devices[0], present)).toBe('bound');
  });
  it('socket power only -> partial', () => {
    const { level, id } = withDevice('socket');
    expect(bindingStatus(setBinding(level, id, 'power', 'sensor.p').devices[0], present)).toBe('partial');
  });
  it('nothing -> unbound', () => {
    expect(bindingStatus(withDevice('socket').level.devices[0], present)).toBe('unbound');
  });
  it('climate humidity only -> bound', () => {
    const { level, id } = withDevice('climate_sensor');
    expect(bindingStatus(setBinding(level, id, 'humidity', 'sensor.h').devices[0], present)).toBe('bound');
  });
  it('missing entity -> missing, even when primary is set', () => {
    const { level, id } = withDevice('motion_sensor');
    const d = setBinding(level, id, 'motion', 'binary_sensor.m').devices[0];
    expect(bindingStatus(d, () => 'missing')).toBe('missing');
  });
  it('unavailable and unknown count as set', () => {
    const { level, id } = withDevice('motion_sensor');
    const d = setBinding(level, id, 'motion', 'binary_sensor.m').devices[0];
    expect(bindingStatus(d, () => 'unavailable')).toBe('bound');
    expect(bindingStatus(d, () => 'unknown')).toBe('bound');
  });
});

describe('roleCount', () => {
  it('socket with control -> 1 of 2', () => {
    const { level, id } = withDevice('socket');
    expect(roleCount(setBinding(level, id, 'control', 'switch.x').devices[0])).toEqual({ filled: 1, total: 2 });
  });
});

describe('alsoBoundTo', () => {
  it('finds the other device on the same entity', () => {
    const a = withDevice('socket', 'A');
    const b = addDevice(a.level, deviceDefaults('socket', 'wall'), free, 'B');
    let l = setBinding(b.level, a.id, 'control', 'switch.x');
    l = setBinding(l, b.deviceId!, 'control', 'switch.x');
    expect(alsoBoundTo(l, 'switch.x', a.id).map(d => d.id)).toEqual([b.deviceId]);
    expect(alsoBoundTo(l, 'switch.y', a.id)).toEqual([]);
  });
});

describe('sanitizeBindings / normalizeLevel', () => {
  it('drops invalid roles and empty strings; removes empty field', () => {
    const { level } = withDevice('socket');
    const d = { ...level.devices[0], bindings: { motion: 'x', power: '', control: 'switch.x' } };
    expect(sanitizeBindings(d).bindings).toEqual({ control: 'switch.x' });
    expect(sanitizeBindings({ ...d, bindings: { motion: 'x' } }).bindings).toBeUndefined();
  });
  it('same device when nothing to drop', () => {
    const { level, id } = withDevice('socket');
    const d = setBinding(level, id, 'control', 'switch.x').devices[0];
    expect(sanitizeBindings(d)).toBe(d);
  });
  it('normalizeLevel drops invalid bindings, keeps identity when clean', () => {
    const { level } = withDevice('socket');
    const bad = { ...level, devices: [{ ...level.devices[0], bindings: { motion: 'x' } }] };
    expect(normalizeLevel(bad).devices[0].bindings).toBeUndefined();
    expect(normalizeLevel(level)).toBe(level);
  });
});
