import { describe, expect, it } from 'vitest';
import { DeviceEventTracker, EVENT_MS, EVENT_FADE_WINDOW_MS, FADE_MS, eventSources, expectedAction, buttonTriggers } from '../../src/live/device-events';
import type { Device, DeviceProps, Level } from '../../src/model/types';

const dev = (props: DeviceProps, bindings?: Device['bindings'], id = 'd1'): Device => ({
  id, name: 'D', placement: { mode: 'free', x: 0, y: 0 } as Device['placement'], props, invalid: false, bindings,
});
const lvl = (...devices: Device[]) => ({ devices } as unknown as Level);
const st = (state: string, extra: Record<string, unknown> = {}) => ({ state, last_changed: '2026-11-16T10:00:00Z', ...extra });
// Every active role waits for an action of `ev` (default 'single'), so the presses these tests send are matched.
const btn = (b: Device['bindings'], flags = { separateOff: true, autoEnabled: true }, ev = 'single') =>
  dev({ kind: 'smart_button', ...flags, on: { slot: 0, event: ev }, off: { slot: 0, event: ev }, auto: { slot: 0, event: ev } } as DeviceProps, b);

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
    const l = lvl(btn({ off: 'event.b' }, undefined, 'double'));
    t.update(l, { 'event.b': st('2026-11-16T10:00:00Z', { attributes: { event_type: 'single' } }) }, 0);
    t.update(l, { 'event.b': st('2026-11-16T10:00:05Z', { attributes: { event_type: 'double' } }) }, 5000);
    expect(t.event('d1', 5000)?.text).toBe('double');
  });
  it('same entity in several roles gives one event', () => {
    const t = new DeviceEventTracker();
    const l = lvl(btn({ on: 'sensor.a', off: 'sensor.a', auto: 'sensor.a' }));
    t.update(l, { 'sensor.a': st('') }, 0);
    t.update(l, { 'sensor.a': st('single') }, 1000);
    expect(t.event('d1', 1000)).toEqual({ text: 'single', at: 1000, tone: 'event' });
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
    expect(t.leaving('d1', since + 43_000 + FADE_MS - 1)).toEqual([{ text: '43', tone: 'motion' }]);
    expect(t.leaving('d1', since + 43_000 + FADE_MS)).toEqual([]);
  });
  it('a fading timer shows the value at the exit time, not at the last update', () => {
    const t = new DeviceEventTracker();
    const l = lvl(dev({ kind: 'ceiling_light' } as DeviceProps, { control: 'light.a' }));
    const since = Date.parse('2026-11-16T10:00:00Z');
    t.update(l, { 'light.a': st('on') }, since + 5000);
    t.update(l, { 'light.a': st('off') }, since + 65_500);
    expect(t.leaving('d1', since + 65_500)).toEqual([{ text: '1:05', tone: 'device' }]);
  });
  it('event entity: the state alone is the change value; unknown/unavailable keep the baseline', () => {
    const t = new DeviceEventTracker();
    const l = lvl(btn({ on: 'event.b' }, undefined, 'double'));
    const e = (state: string, lc: string, et = 'single') => ({ 'event.b': { state, last_changed: lc, attributes: { event_type: et } } });
    t.update(l, e('2026-11-16T10:00:00Z', '2026-11-16T10:00:00Z'), 0);
    // Same state, other last_changed: no event.
    t.update(l, e('2026-11-16T10:00:00Z', '2026-11-16T10:01:00Z'), 1000);
    expect(t.event('d1', 1000)).toBeNull();
    // HA restart: unavailable, then the restored state comes back: no event.
    t.update(l, e('unavailable', '2026-11-16T10:02:00Z'), 2000);
    t.update(l, e('2026-11-16T10:00:00Z', '2026-11-16T10:03:00Z'), 3000);
    t.update(l, e('unknown', '2026-11-16T10:04:00Z'), 4000);
    t.update(l, e('2026-11-16T10:00:00Z', '2026-11-16T10:05:00Z'), 5000);
    expect(t.event('d1', 5000)).toBeNull();
    t.update(l, e('2026-11-16T10:06:00Z', '2026-11-16T10:06:00Z', 'double'), 6000);
    expect(t.event('d1', 6000)?.text).toBe('double');
  });
  it('the event bubble fades out after EVENT_MS, inside a window a 1 s tick catches', () => {
    expect(EVENT_FADE_WINDOW_MS).toBe(1000);
    const t = new DeviceEventTracker();
    const l = lvl(dev({ kind: 'smart_button', separateOff: true, autoEnabled: false, on: { slot: 0, event: 'single' }, off: { slot: 0, event: 'double' } } as DeviceProps, { on: 'sensor.a', off: 'sensor.a' }));
    t.update(l, { 'sensor.a': st('') }, 0);
    t.update(l, { 'sensor.a': st('single') }, 1000);
    expect(t.leaving('d1', 1000 + EVENT_MS - 1)).toEqual([]);
    expect(t.leaving('d1', 1000 + EVENT_MS)).toEqual([{ text: 'single', tone: 'event', key: 1000 }]);
    expect(t.leaving('d1', 1000 + EVENT_MS + 999)).toEqual([{ text: 'single', tone: 'event', key: 1000 }]);
    expect(t.leaving('d1', 1000 + EVENT_MS + 1000)).toEqual([]);
    // A replaced event is a new bubble (its key is its time), so it pops again.
    t.update(l, { 'sensor.a': st('') }, 2000);
    t.update(l, { 'sensor.a': st('double') }, 3000);
    expect(t.event('d1', 3000)).toEqual({ text: 'double', at: 3000, tone: 'event' });
    expect(t.leaving('d1', 1000 + EVENT_MS)).toEqual([]);
  });
  it('only active roles: smart button off/auto need their flags', () => {
    const states = { 'sensor.off': st(''), 'sensor.auto': st('') };
    const next = { 'sensor.off': st('single'), 'sensor.auto': st('hold') };
    const t = new DeviceEventTracker();
    const l = lvl(btn({ off: 'sensor.off', auto: 'sensor.auto' }, { separateOff: false, autoEnabled: false }));
    t.update(l, states, 0);
    t.update(l, next, 1000);
    expect(t.event('d1', 1000)).toBeNull();
    expect(eventSources(l)).toEqual([]);
    const t2 = new DeviceEventTracker();
    const l2 = lvl(btn({ off: 'sensor.off' }, { separateOff: true, autoEnabled: false }));
    t2.update(l2, states, 0);
    t2.update(l2, next, 1000);
    expect(t2.event('d1', 1000)?.text).toBe('single');
  });
  it('eventSources lists the distinct event source entities of a level', () => {
    const l = lvl(
      btn({ on: 'sensor.a', off: 'event.b', auto: 'sensor.a' }),
      dev({ kind: 'wall_switch' } as DeviceProps, { state: 'switch.w' }, 'd2'),
      dev({ kind: 'valve' } as DeviceProps, { state: 'sensor.a' }, 'd3'),
      dev({ kind: 'ceiling_light' } as DeviceProps, { control: 'light.a' }, 'd4'),
    );
    expect(eventSources(l)).toEqual(['event.b', 'sensor.a', 'switch.w']);
  });

  describe('a press that matches no trigger', () => {
    const tb = (id: string, b: Device['bindings'], props: Record<string, unknown>) =>
      dev({ kind: 'smart_button', separateOff: false, autoEnabled: false, ...props } as DeviceProps, b, id);
    const press = (l: Level, entity: string, value: string, extra: Record<string, unknown> = {}) => {
      const t = new DeviceEventTracker();
      t.update(l, { [entity]: st('', extra) }, 0);
      t.update(l, { [entity]: st(value, extra) }, 1000);
      return t;
    };
    it('expectedAction and buttonTriggers', () => {
      expect(expectedAction(0, 'single')).toBe('single');
      expect(expectedAction(2, 'hold')).toBe('2_hold');
      const d = tb('a', { on: 'sensor.a', off: 'sensor.b', auto: 'sensor.c' }, { separateOff: true, on: { slot: 1, event: 'single' }, off: { slot: 0, event: 'hold' }, auto: { slot: 0, event: 'double' } });
      expect(buttonTriggers(d)).toEqual([{ entity: 'sensor.a', value: '1_single' }, { entity: 'sensor.b', value: 'hold' }]);
    });
    it('a matching trigger shows the raw action', () => {
      const l = lvl(tb('a', { on: 'sensor.a' }, { on: { slot: 0, event: 'single' } }));
      expect(press(l, 'sensor.a', 'single').event('a', 1000)).toEqual({ text: 'single', at: 1000, tone: 'event' });
    });
    it('slot 1 trigger vs plain action: no trigger', () => {
      const l = lvl(tb('a', { on: 'sensor.a' }, { on: { slot: 1, event: 'single' } }));
      expect(press(l, 'sensor.a', 'single').event('a', 1000)).toEqual({ text: 'single: no trigger', at: 1000, tone: 'unmatched' });
    });
    it('an unconfigured trigger has none', () => {
      const l = lvl(tb('a', { on: 'sensor.a' }, { on: undefined }));
      expect(press(l, 'sensor.a', 'single').event('a', 1000)?.tone).toBe('unmatched');
    });
    describe('three devices on one entity', () => {
      const l = lvl(
        tb('a', { on: 'sensor.a', auto: 'sensor.a' }, { autoEnabled: true, on: { slot: 1, event: 'single' }, auto: { slot: 1, event: 'double' } }),
        tb('b', { on: 'sensor.a' }, { on: { slot: 2, event: 'single' } }),
        tb('c', { on: 'sensor.a', off: 'sensor.a' }, { separateOff: true, on: { slot: 1, event: 'hold' }, off: { slot: 2, event: 'hold' } }),
      );
      const ev = (t: DeviceEventTracker, id: string) => t.event(id, 1000);
      it('2_single only on b', () => {
        const t = press(l, 'sensor.a', '2_single');
        expect(ev(t, 'a')).toBeNull(); expect(ev(t, 'c')).toBeNull();
        expect(ev(t, 'b')).toEqual({ text: '2_single', at: 1000, tone: 'event' });
      });
      it('1_double only on a', () => {
        const t = press(l, 'sensor.a', '1_double');
        expect(ev(t, 'a')?.tone).toBe('event'); expect(ev(t, 'b')).toBeNull(); expect(ev(t, 'c')).toBeNull();
      });
      it('3_single on all three as no trigger', () => {
        const t = press(l, 'sensor.a', '3_single');
        for (const id of ['a', 'b', 'c']) expect(ev(t, id)).toEqual({ text: '3_single: no trigger', at: 1000, tone: 'unmatched' });
      });
    });
    it('a disabled auto role is no trigger', () => {
      const l = lvl(tb('a', { on: 'sensor.a', auto: 'sensor.a' }, { autoEnabled: false, on: { slot: 0, event: 'single' }, auto: { slot: 0, event: 'double' } }));
      expect(press(l, 'sensor.a', 'double').event('a', 1000)?.tone).toBe('unmatched');
    });
    it('event entity compares event_type', () => {
      const l = lvl(tb('a', { on: 'event.b' }, { on: { slot: 0, event: 'single' } }));
      const t = new DeviceEventTracker();
      t.update(l, { 'event.b': st('2026-11-16T10:00:00Z', { attributes: { event_type: 'single' } }) }, 0);
      t.update(l, { 'event.b': st('2026-11-16T10:00:05Z', { attributes: { event_type: 'single' } }) }, 1000);
      expect(t.event('a', 1000)?.tone).toBe('event');
      t.update(l, { 'event.b': st('2026-11-16T10:00:09Z', { attributes: { event_type: 'double' } }) }, 2000);
      expect(t.event('a', 2000)).toEqual({ text: 'double: no trigger', at: 2000, tone: 'unmatched' });
    });
    it('a wall switch on the same entity does not count; its bubble is unchanged', () => {
      const w = dev({ kind: 'wall_switch' } as DeviceProps, { state: 'switch.w' }, 'w');
      const b = tb('a', { on: 'switch.w' }, { on: { slot: 0, event: 'x' } });
      const t = new DeviceEventTracker();
      const l = lvl(w, b);
      t.update(l, { 'switch.w': st('off') }, 0);
      t.update(l, { 'switch.w': st('on') }, 1000);
      expect(t.event('w', 1000)).toEqual({ text: 'on', at: 1000, tone: 'event' });
      expect(t.event('a', 1000)).toEqual({ text: 'on: no trigger', at: 1000, tone: 'unmatched' });
    });
    it('the fading bubble keeps tone and text', () => {
      const l = lvl(tb('a', { on: 'sensor.a' }, { on: { slot: 1, event: 'single' } }));
      const t = press(l, 'sensor.a', 'single');
      expect(t.leaving('a', 1000 + EVENT_MS)).toEqual([{ text: 'single: no trigger', tone: 'unmatched', key: 1000 }]);
    });
  });
});
