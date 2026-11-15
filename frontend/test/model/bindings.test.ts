import { describe, it, expect } from 'vitest';
import { rectRoomLevel } from '../fixtures';
import { addDevice, setDeviceProps } from '../../src/model/devices';
import {
  activeRoleSpecs, alsoBoundTo, bindingKey, bindingStatus, countNotBound, duplicateTriggers, roleCount, sanitizeBindings, setBinding,
  type Presence,
} from '../../src/model/bindings';
import { deviceDefaults, normalizeLevel, type Device, type DeviceKind, type DeviceProps, type Level } from '../../src/model/types';

const free = { mode: 'wall', wallId: 'w0', side: 'right', offset: 500 } as const;
function withDevice(kind: DeviceKind, name = 'D'): { level: Level; id: string } {
  const r = addDevice(rectRoomLevel(3000, 4000, 400), deviceDefaults(kind, 'wall'), free, name);
  return { level: r.level, id: r.deviceId! };
}
const present = (): Presence => 'present';
type ButtonProps = Extract<DeviceProps, { kind: 'smart_button' }>;
/** A wall-placed smart button with props overrides and optional bindings. */
function button(props: Partial<ButtonProps> = {}, bindings?: Device['bindings']): Device {
  const d = withDevice('smart_button').level.devices[0];
  return { ...d, props: { ...deviceDefaults('smart_button', 'wall') as ButtonProps, ...props }, ...(bindings ? { bindings } : {}) };
}
const roles = (d: Device) => activeRoleSpecs(d).map(s => s.role);

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
  it('a role inactive for the smart button flags -> same level', () => {
    const { level, id } = withDevice('smart_button');
    expect(setBinding(level, id, 'off', 'sensor.a')).toBe(level);
    expect(setBinding(level, id, 'final', 'light.x')).toBe(level);
  });
});

describe('activeRoleSpecs', () => {
  it('per smart button flag combination', () => {
    expect(roles(button())).toEqual(['on']);
    expect(roles(button({ separateOff: true }))).toEqual(['on', 'off']);
    expect(roles(button({ autoEnabled: true }))).toEqual(['on', 'auto', 'final']);
    expect(roles(button({ separateOff: true, autoEnabled: true }))).toEqual(['on', 'off', 'auto']);
  });
  it('a wall switch has the state role; other kinds have all their roles', () => {
    expect(roles(withDevice('wall_switch').level.devices[0])).toEqual(['state']);
    expect(roles(withDevice('socket').level.devices[0])).toEqual(['control', 'power']);
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
  it('smart button: on bound in toggle mode -> bound; separateOff without off -> partial', () => {
    expect(bindingStatus(button({}, { on: 'sensor.a' }), present)).toBe('bound');
    expect(bindingStatus(button({ separateOff: true }, { on: 'sensor.a' }), present)).toBe('partial');
    expect(bindingStatus(button({ separateOff: true }, { on: 'sensor.a', off: 'sensor.a' }), present)).toBe('bound');
  });
  it('wall switch: state is primary', () => {
    const { level, id } = withDevice('wall_switch');
    expect(bindingStatus(setBinding(level, id, 'state', 'switch.x').devices[0], present)).toBe('bound');
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

describe('roleCount: smart button', () => {
  it('counts the active roles only', () => {
    expect(roleCount(button({}, { on: 'sensor.a' }))).toEqual({ filled: 1, total: 1 });
    expect(roleCount(button({ autoEnabled: true }, { on: 'sensor.a' }))).toEqual({ filled: 1, total: 3 });
  });
});

describe('setDeviceProps on a container', () => {
  it('turning autoEnabled off drops the auto and final bindings and resets defaultOutput auto to off', () => {
    const { level, id } = withDevice('smart_button');
    let l = setDeviceProps(level, id, { autoEnabled: true, defaultOutput: 'auto' });
    l = setBinding(l, id, 'on', 'sensor.a');
    l = setBinding(l, id, 'auto', 'sensor.a');
    l = setBinding(l, id, 'final', 'light.x');
    expect(l.devices[0].bindings).toEqual({ on: 'sensor.a', auto: 'sensor.a', final: 'light.x' });
    expect(l.devices[0].props).toMatchObject({ defaultOutput: 'auto' });
    const off = setDeviceProps(l, id, { autoEnabled: false });
    expect(off.devices[0].bindings).toEqual({ on: 'sensor.a' });
    // The trigger settings stay in props, so turning auto on again restores them.
    expect(off.devices[0].props).toMatchObject({ autoEnabled: false, defaultOutput: 'off', auto: { slot: 0, event: 'double' } });
  });
  it('turning separateOff off drops the off binding and keeps the off trigger in props', () => {
    const { level, id } = withDevice('smart_button');
    let l = setDeviceProps(level, id, { separateOff: true, off: { slot: 2, event: 'hold' } });
    l = setBinding(setBinding(l, id, 'on', 'sensor.a'), id, 'off', 'sensor.a');
    expect(l.devices[0].bindings).toEqual({ on: 'sensor.a', off: 'sensor.a' });
    const off = setDeviceProps(l, id, { separateOff: false });
    expect(off.devices[0].bindings).toEqual({ on: 'sensor.a' });
    expect(off.devices[0].props).toMatchObject({ separateOff: false, off: { slot: 2, event: 'hold' } });
  });
  it('turning separateOff on drops final (it matters only in toggle mode)', () => {
    const { level, id } = withDevice('smart_button');
    let l = setDeviceProps(level, id, { autoEnabled: true });
    l = setBinding(setBinding(l, id, 'on', 'sensor.a'), id, 'final', 'light.x');
    expect(setDeviceProps(l, id, { separateOff: true }).devices[0].bindings).toEqual({ on: 'sensor.a' });
  });
  it('a wall switch keeps auto as the default only with autoByDoubleToggle', () => {
    const { level, id } = withDevice('wall_switch');
    const l = setDeviceProps(level, id, { autoByDoubleToggle: true, defaultOutput: 'auto' });
    expect(l.devices[0].props).toMatchObject({ defaultOutput: 'auto' });
    expect(setDeviceProps(l, id, { autoByDoubleToggle: false }).devices[0].props).toMatchObject({ defaultOutput: 'off' });
  });
});

describe('bindingKey', () => {
  it('a smart button trigger is the entity and the expected action value; other roles are the entity', () => {
    const d = button({ autoEnabled: true, on: { slot: 2, event: 'hold' } }, { on: 'sensor.a', final: 'light.x' });
    expect(bindingKey(d, 'on')).toBe('sensor.a|2_hold');
    expect(bindingKey(d, 'final')).toBe('light.x');
    expect(bindingKey(d, 'auto')).toBeNull();
    expect(bindingKey(withDevice('socket').level.devices[0], 'control')).toBeNull();
  });
});

describe('alsoBoundTo', () => {
  it('finds the other device on the same entity', () => {
    const a = withDevice('socket', 'A');
    const b = addDevice(a.level, deviceDefaults('socket', 'wall'), free, 'B');
    let l = setBinding(b.level, a.id, 'control', 'switch.x');
    l = setBinding(l, b.deviceId!, 'control', 'switch.x');
    const da = l.devices.find(d => d.id === a.id)!;
    expect(alsoBoundTo(l, da, 'control').map(d => d.id)).toEqual([b.deviceId]);
    expect(alsoBoundTo(setBinding(l, b.deviceId!, 'control', 'switch.y'), da, 'control')).toEqual([]);
    expect(alsoBoundTo(l, da, 'power')).toEqual([]);
  });
  it('is trigger-aware: same entity on another slot is not shared; the same trigger is', () => {
    const a = withDevice('smart_button', 'A');
    const b = addDevice(a.level, deviceDefaults('smart_button', 'wall'), free, 'B');
    const bid = b.deviceId!;
    let l = setBinding(setBinding(b.level, a.id, 'on', 'sensor.sw'), bid, 'on', 'sensor.sw');
    l = setDeviceProps(l, bid, { on: { slot: 1, event: 'single' } });
    const da = l.devices.find(d => d.id === a.id)!;
    expect(alsoBoundTo(l, da, 'on')).toEqual([]);
    const same = setDeviceProps(l, bid, { on: { slot: 0, event: 'single' } });
    expect(alsoBoundTo(same, da, 'on').map(d => d.id)).toEqual([bid]);
  });
  it('compares the expected action value: slot 0 with event 1_single is slot 1 with single', () => {
    const a = withDevice('smart_button', 'A');
    const b = addDevice(a.level, deviceDefaults('smart_button', 'wall'), free, 'B');
    const bid = b.deviceId!;
    let l = setBinding(setBinding(b.level, a.id, 'on', 'sensor.sw'), bid, 'on', 'sensor.sw');
    l = setDeviceProps(setDeviceProps(l, a.id, { on: { slot: 0, event: '1_single' } }), bid, { on: { slot: 1, event: 'single' } });
    const da = l.devices.find(d => d.id === a.id)!;
    expect(bindingKey(da, 'on')).toBe(bindingKey(l.devices.find(d => d.id === bid)!, 'on'));
    expect(alsoBoundTo(l, da, 'on').map(d => d.id)).toEqual([bid]);
  });
});

describe('duplicateTriggers', () => {
  it('on equal to off with separateOff -> [off]', () => {
    const on = { slot: 0, event: 'single' };
    expect(duplicateTriggers(button({ separateOff: true, off: on }, { on: 'sensor.a', off: 'sensor.a' }))).toEqual(['off']);
  });
  it('slot 0 with event 2_hold duplicates slot 2 with hold', () => {
    const d = button({ separateOff: true, on: { slot: 0, event: '2_hold' }, off: { slot: 2, event: 'hold' } },
      { on: 'sensor.a', off: 'sensor.a' });
    expect(duplicateTriggers(d)).toEqual(['off']);
  });
  it('none for distinct triggers, inactive roles or other kinds', () => {
    expect(duplicateTriggers(button({ separateOff: true }, { on: 'sensor.a', off: 'sensor.a' }))).toEqual([]);
    expect(duplicateTriggers(button({ off: { slot: 0, event: 'single' } }, { on: 'sensor.a', off: 'sensor.a' }))).toEqual([]);
    expect(duplicateTriggers(withDevice('socket').level.devices[0])).toEqual([]);
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

describe("sanitizeBindings empty", () => {
  it("drops an empty bindings object", () => {
    const { level } = withDevice("socket");
    const d = { ...level.devices[0], bindings: {} };
    expect("bindings" in sanitizeBindings(d)).toBe(false);
  });
});

describe('countNotBound', () => {
  it('counts every status except bound', () => {
    expect(countNotBound(['bound', 'partial', 'unbound', 'missing', 'bound'])).toBe(3);
    expect(countNotBound([])).toBe(0);
  });
});
