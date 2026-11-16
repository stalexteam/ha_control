import { describe, expect, it } from 'vitest';
import { deviceLive, formatDuration, liveBubbles } from '../../src/live/device-live';
import type { Device, DeviceProps } from '../../src/model/types';

const dev = (props: DeviceProps, bindings?: Device['bindings']): Device => ({
  id: 'd1', name: 'D', placement: { mode: 'free', x: 0, y: 0 } as Device['placement'], props, invalid: false, bindings,
});
const T = '2026-11-16T10:00:00Z';
const st = (state: string, extra: Record<string, unknown> = {}) => ({ state, last_changed: T, ...extra });
const ceiling = (b?: Device['bindings']) =>
  dev({ kind: 'ceiling_light', shape: 'round', diameter: 300, length: 1200, width: 100, poolRadius: null }, b);

describe('formatDuration', () => {
  it('formats', () => {
    expect(formatDuration(0)).toBe('0');
    expect(formatDuration(59_999)).toBe('59');
    expect(formatDuration(60_000)).toBe('1:00');
    expect(formatDuration(3_599_000)).toBe('59:59');
    expect(formatDuration(3_600_000)).toBe('1:00:00');
    expect(formatDuration(3_912_000)).toBe('1:05:12');
    expect(formatDuration(-5000)).toBe('0');
  });
});

describe('deviceLive', () => {
  const light = ceiling({ control: 'light.a' });
  it('light states', () => {
    expect(deviceLive(light, { 'light.a': st('on') })).toEqual({ look: 'on', timerSince: Date.parse(T) });
    expect(deviceLive(light, { 'light.a': st('off') })).toEqual({ look: 'off' });
    expect(deviceLive(light, { 'light.a': st('unavailable') })).toEqual({ look: 'no-data' });
    expect(deviceLive(light, {})).toEqual({ look: 'no-data' });
    expect(deviceLive(light, undefined)).toEqual({ look: 'no-data' });
    expect(deviceLive(ceiling(), { 'light.a': st('on') })).toEqual({ look: 'none' });
  });
  it('motion and leak', () => {
    const m = dev({ kind: 'motion_sensor', zoneAngle: 110, zoneRange: 5000 }, { motion: 'binary_sensor.m' });
    expect(deviceLive(m, { 'binary_sensor.m': st('on') })).toEqual({ look: 'active', timerSince: Date.parse(T) });
    expect(deviceLive(m, { 'binary_sensor.m': st('off') })).toEqual({ look: 'off' });
    const l = dev({ kind: 'leak_sensor' }, { leak: 'binary_sensor.l' });
    expect(deviceLive(l, { 'binary_sensor.l': st('on') })).toEqual({ look: 'active', timerSince: Date.parse(T) });
    expect(deviceLive(l, { 'binary_sensor.l': st('off') })).toEqual({ look: 'off' });
  });
  it('power', () => {
    const s = dev({ kind: 'socket' }, { control: 'switch.s', power: 'sensor.p' });
    const w = (v: string, unit: string) => ({ 'sensor.p': st(v, { attributes: { unit_of_measurement: unit } }) });
    expect(deviceLive(s, { 'switch.s': st('on'), ...w('309.4', 'W') })).toEqual({ look: 'on', power: 309.4 });
    expect(deviceLive(s, { 'switch.s': st('on'), ...w('0', 'W') })).toEqual({ look: 'on' });
    expect(deviceLive(s, { 'switch.s': st('off'), ...w('50', 'W') })).toEqual({ look: 'off' });
    expect(deviceLive(s, { 'switch.s': st('on'), ...w('1.2', 'kW') })).toEqual({ look: 'on', power: 1200 });
    expect(deviceLive(s, { 'switch.s': st('on'), ...w('5', 'VA') })).toEqual({ look: 'on' });
    expect(deviceLive(s, { 'switch.s': st('on'), ...w('abc', 'W') })).toEqual({ look: 'on' });
    const e = dev({ kind: 'equipment', shape: 'rect', width: 1, depth: 1, diameter: 1, icon: '', label: '' }, { power: 'sensor.p' });
    expect(deviceLive(e, w('80', 'W'))).toEqual({ look: 'none', power: 80 });
  });
  it('switch, valve, others', () => {
    const ws = dev({ kind: 'wall_switch', autoByDoubleToggle: false, windowSec: 3 }, { state: 'switch.w' });
    expect(deviceLive(ws, { 'switch.w': st('on') })).toEqual({ look: 'on' });
    const v = dev({ kind: 'valve', autoByDoubleToggle: false, windowSec: 3 }, { state: 'valve.v' });
    expect(deviceLive(v, { 'valve.v': st('open') })).toEqual({ look: 'on' });
    expect(deviceLive(v, { 'valve.v': st('closed') })).toEqual({ look: 'off' });
    expect(deviceLive(v, { 'valve.v': st('opening') })).toEqual({ look: 'no-data' });
    const b = dev({ kind: 'smart_button', separateOff: false, autoEnabled: false, on: {} as never, off: {} as never, auto: {} as never }, { on: 'sensor.a' });
    expect(deviceLive(b, { 'sensor.a': st('single') })).toEqual({ look: 'none' });
    expect(deviceLive(dev({ kind: 'climate_sensor' }, { temperature: 'sensor.t' }), { 'sensor.t': st('20') })).toEqual({ look: 'none' });
  });
});

describe('deviceLive review follow-ups', () => {
  const w = (v: string) => ({ 'sensor.p': st(v, { attributes: { unit_of_measurement: 'W' } }) });
  it('valve bound to a switch entity: on = open, off = closed', () => {
    const v = dev({ kind: 'valve', autoByDoubleToggle: false, windowSec: 3 }, { state: 'switch.v' });
    expect(deviceLive(v, { 'switch.v': st('on') })).toEqual({ look: 'on' });
    expect(deviceLive(v, { 'switch.v': st('off') })).toEqual({ look: 'off' });
    expect(deviceLive(v, { 'switch.v': st('unavailable') })).toEqual({ look: 'no-data' });
  });
  it('power bubble only from 1 W after rounding', () => {
    const s = dev({ kind: 'socket' }, { power: 'sensor.p' });
    expect(deviceLive(s, w('0.3'))).toEqual({ look: 'none' });
    expect(deviceLive(s, w('0.49'))).toEqual({ look: 'none' });
    expect(deviceLive(s, w('0.5'))).toEqual({ look: 'none', power: 0.5 });
    expect(deviceLive(s, w('1'))).toEqual({ look: 'none', power: 1 });
  });
  it('an inverter does not read the plain power role', () => {
    const props = { kind: 'equipment', shape: 'rect', width: 1, depth: 1, diameter: 1, icon: '', label: '' } as DeviceProps;
    const inv = dev({ ...props, inverter: true } as DeviceProps, { power: 'sensor.p' });
    expect(deviceLive(inv, w('80'))).toEqual({ look: 'none' });
    expect(deviceLive(dev(props, { power: 'sensor.p' }), w('80'))).toEqual({ look: 'none', power: 80 });
  });
});

describe('liveBubbles', () => {
  const now = Date.parse(T);
  it('bubbles', () => {
    const light = ceiling({ control: 'light.a' });
    expect(liveBubbles({ look: 'on', timerSince: now - 42_000 }, light, now)).toEqual([{ text: '42', tone: 'device' }]);
    const m = dev({ kind: 'motion_sensor', zoneAngle: 110, zoneRange: 5000 });
    expect(liveBubbles({ look: 'active', timerSince: now - 192_000 }, m, now)).toEqual([{ text: '3:12', tone: 'motion' }]);
    const l = dev({ kind: 'leak_sensor' });
    expect(liveBubbles({ look: 'active', timerSince: now - 5000 }, l, now)).toEqual([{ text: '5', tone: 'leak' }]);
    const s = dev({ kind: 'socket' });
    expect(liveBubbles({ look: 'on', power: 309.4 }, s, now)).toEqual([{ text: '309 W', tone: 'device' }]);
    expect(liveBubbles({ look: 'off' }, s, now)).toEqual([]);
    expect(liveBubbles({ look: 'on', timerSince: now - 1000, power: 50 }, light, now).map((b) => b.text)).toEqual(['1', '50 W']);
  });
});
