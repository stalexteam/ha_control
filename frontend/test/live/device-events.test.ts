import { describe, expect, it } from 'vitest';
import { DeviceEventTracker, EVENT_MS, FADE_MS } from '../../src/live/device-events';
import type { Device, DeviceProps, Level } from '../../src/model/types';

const dev = (props: DeviceProps, bindings?: Device['bindings'], id = 'd1'): Device => ({
  id, name: 'D', placement: { mode: 'free', x: 0, y: 0 } as Device['placement'], props, invalid: false, bindings,
});
const lvl = (...devices: Device[]) => ({ devices } as unknown as Level);
const st = (state: string, extra: Record<string, unknown> = {}) => ({ state, last_changed: '2026-11-16T10:00:00Z', ...extra });
const btn = (b: Device['bindings']) => dev({ kind: 'smart_button' } as DeviceProps, b);

describe('DeviceEventTracker', () => {
  it('action sensor events', () => {
    const t = new DeviceEventTracker();
    const l = lvl(btn({ on: 'sensor.a' }));
    t.update(l, { 'sensor.a': st('single') }, 0);
    expect(t.event('d1', 0)).toBeNull();
    t.update(l, { 'sensor.a': st('') }, 1000);
    expect(t.event('d1', 1000)).toBeNull();
    t.update(l, { 'sensor.a': st('single') }, 2000);
    expect(t.event('d1', 2000)?.text).toBe('single');
    expect(t.event('d1', 11_999)?.text).toBe('single');
    expect(t.event('d1', 2000 + EVENT_MS)).toBeNull();
  });
  it('newer event restarts the clock', () => {
    const t = new DeviceEventTracker();
    const l = lvl(btn({ on: 'sensor.a' }));
    t.update(l, { 'sensor.a': st('') }, 0);
    t.update(l, { 'sensor.a': st('2_double') }, 1000);
    t.update(l, { 'sensor.a': st('single') }, 4000);
    expect(t.event('d1', 13_999)?.text).toBe('single');
    expect(t.event('d1', 14_000)).toBeNull();
  });
  it('unknown, unavailable and empty never show', () => {
    const t = new DeviceEventTracker();
    const l = lvl(btn({ on: 'sensor.a' }));
    t.update(l, { 'sensor.a': st('x') }, 0);
    for (const v of ['unknown', 'unavailable', '']) t.update(l, { 'sensor.a': st(v) }, 10);
    expect(t.event('d1', 10)).toBeNull();
  });
  it('event entity shows event_type', () => {
    const t = new DeviceEventTracker();
    const l = lvl(btn({ off: 'event.b' }));
    t.update(l, { 'event.b': st('2026-11-16T10:00:00Z', { attributes: { event_type: 'single' } }) }, 0);
    t.update(l, { 'event.b': st('2026-11-16T10:00:05Z', { attributes: { event_type: 'double' } }) }, 5000);
    expect(t.event('d1', 5000)?.text).toBe('double');
  });
  it('same entity in several roles gives one event', () => {
    const t = new DeviceEventTracker();
    const l = lvl(btn({ on: 'sensor.a', off: 'sensor.a', auto: 'sensor.a' }));
    t.update(l, { 'sensor.a': st('') }, 0);
    t.update(l, { 'sensor.a': st('single') }, 1000);
    expect(t.event('d1', 1000)).toEqual({ text: 'single', at: 1000 });
  });
  it('wall switch needs on<->off', () => {
    const t = new DeviceEventTracker();
    const l = lvl(dev({ kind: 'wall_switch' } as DeviceProps, { state: 'switch.w' }));
    t.update(l, { 'switch.w': st('off') }, 0);
    t.update(l, { 'switch.w': st('on') }, 1000);
    expect(t.event('d1', 1000)?.text).toBe('on');
    t.update(l, { 'switch.w': st('unavailable') }, 20_000);
    t.update(l, { 'switch.w': st('on') }, 21_000);
    expect(t.event('d1', 21_000)).toBeNull();
  });
  it('valve open/closed, opening ignored, switch entity maps', () => {
    const t = new DeviceEventTracker();
    const l = lvl(dev({ kind: 'valve' } as DeviceProps, { state: 'valve.v' }));
    t.update(l, { 'valve.v': st('closed') }, 0);
    t.update(l, { 'valve.v': st('open') }, 1000);
    expect(t.event('d1', 1000)?.text).toBe('open');
    t.update(l, { 'valve.v': st('opening') }, 20_000);
    expect(t.event('d1', 20_000)).toBeNull();
    const t2 = new DeviceEventTracker();
    const l2 = lvl(dev({ kind: 'valve' } as DeviceProps, { state: 'switch.v' }));
    t2.update(l2, { 'switch.v': st('on') }, 0);
    t2.update(l2, { 'switch.v': st('off') }, 1000);
    expect(t2.event('d1', 1000)?.text).toBe('closed');
  });
  it('rebinding takes a new baseline', () => {
    const t = new DeviceEventTracker();
    const states = { 'sensor.a': st(''), 'sensor.b': st('single') };
    t.update(lvl(btn({ on: 'sensor.a' })), states, 0);
    t.update(lvl(btn({ on: 'sensor.b' })), states, 1000);
    expect(t.event('d1', 1000)).toBeNull();
  });
  it('leaving bubble fades for FADE_MS', () => {
    const t = new DeviceEventTracker();
    const l = lvl(dev({ kind: 'motion_sensor', zoneAngle: 110, zoneRange: 5000 } as DeviceProps, { motion: 'binary_sensor.m' }));
    const since = Date.parse('2026-11-16T10:00:00Z');
    t.update(l, { 'binary_sensor.m': st('on') }, since + 42_000);
    expect(t.leaving('d1', since + 42_000)).toEqual([]);
    t.update(l, { 'binary_sensor.m': st('off') }, since + 43_000);
    expect(t.leaving('d1', since + 43_000 + FADE_MS - 1)).toEqual([{ text: '42', tone: 'motion' }]);
    expect(t.leaving('d1', since + 43_000 + FADE_MS)).toEqual([]);
  });
});
