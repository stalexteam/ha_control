// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMockHass } from '../../dev/mock-hass';
import type { HassLike } from '../../src/api';
import { deviceDefaults, type Device, type DeviceProps } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';
import { mount } from './helpers';

const st = (state: string, last_changed = '2026-11-16T10:00:00Z') => ({ state, last_changed, attributes: {} });
const free = (id: string, kind: 'smart_button' | 'ceiling_light', x: number, bindings: Device['bindings']): Device =>
  ({ id, name: id, invalid: false, bindings, placement: { mode: 'free', x, y: 1000, rotation: 0 },
    props: deviceDefaults(kind, 'free') as DeviceProps });

describe('panel live state per step', () => {
  beforeEach(() => { localStorage.clear(); document.body.innerHTML = ''; });
  afterEach(() => { vi.useRealTimers(); });

  const setup = async (action: string) => {
    const base = createMockHass();
    const hass = (a: string): HassLike => ({ ...base, states: { 'sensor.act': st(a), 'light.a': st('on') } });
    const el = await mount(hass(action));
    el.commit({ ...el.history!.current.level, ...rectRoomLevel(4000, 3000, 200), devices: [
      free('sb', 'smart_button', 1000, { on: 'sensor.act' }), free('cl', 'ceiling_light', 2000, { control: 'light.a' }),
    ] });
    return { el, hass };
  };
  const bubbles = (el: Awaited<ReturnType<typeof mount>>) =>
    [...el.shadowRoot!.querySelectorAll('g.bubbles g.device-bubbles[data-id="sb"] .bubble')].map(b => b.textContent?.trim());

  it('an action event shows an event bubble in Binding for 10 s, then fades; no ticker in Equipment', async () => {
    const { el, hass } = await setup('');
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(Date.parse('2026-11-16T10:00:30Z'));
    el.setMode('equipment');
    await el.updateComplete;
    el.hass = hass('single');
    await el.updateComplete;
    expect(el.tickerOn).toBe(false);
    expect(el.shadowRoot!.querySelector('.bubble')).toBeNull();

    el.setMode('binding');
    await el.updateComplete;
    expect(bubbles(el)).toEqual(['single']);
    expect(el.tickerOn).toBe(true);

    await vi.advanceTimersByTimeAsync(10_500);
    await el.updateComplete;
    expect(bubbles(el)).toEqual(['single']);
    expect(el.shadowRoot!.querySelector('g.device-bubbles[data-id="sb"] .bubble')!.classList.contains('bubble-out')).toBe(true);
    await vi.advanceTimersByTimeAsync(1000);
    await el.updateComplete;
    expect(bubbles(el)).toEqual([]);
    el.setMode('plan');
    await el.updateComplete;
    expect(el.tickerOn).toBe(false);
    expect(el.shadowRoot!.querySelector('g.device')).toBeNull();
  });

  it('the ticker stops when the panel is detached', async () => {
    const { el, hass } = await setup('');
    el.hass = hass('single');
    el.setMode('binding');
    await el.updateComplete;
    expect(el.tickerOn).toBe(true);
    el.remove();
    expect(el.tickerOn).toBe(false);
  });

  it('Binding feeds the tracker per message from subscribe_entities; detaching unsubscribes', async () => {
    const base = createMockHass();
    const subs: { msg: Record<string, unknown>; cb: (m: unknown) => void; unsub: ReturnType<typeof vi.fn> }[] = [];
    const subscribeMessage = <T>(cb: (m: T) => void, msg: Record<string, unknown>, opts?: { resubscribe?: boolean }) => {
      if (msg.type !== 'subscribe_entities') return base.connection.subscribeMessage!(cb, msg, opts);
      const unsub = vi.fn(() => Promise.resolve());
      subs.push({ msg, cb: cb as (m: unknown) => void, unsub });
      return Promise.resolve(unsub);
    };
    // The coalesced hass only ever shows '' for the action sensor.
    const hass: HassLike = { ...base, connection: { ...base.connection, subscribeMessage }, states: { 'sensor.act': st(''), 'light.a': st('on') } };
    const el = await mount(hass);
    el.commit({ ...el.history!.current.level, ...rectRoomLevel(4000, 3000, 200), devices: [
      free('sb', 'smart_button', 1000, { on: 'sensor.act' }), free('cl', 'ceiling_light', 2000, { control: 'light.a' }),
    ] });
    await el.updateComplete;
    expect(subs).toHaveLength(0);
    el.setMode('binding');
    await el.updateComplete;
    expect(subs.map(s => s.msg)).toEqual([{ type: 'subscribe_entities', entity_ids: ['sensor.act'] }]);
    await Promise.resolve();
    const lc = Date.parse('2026-11-16T10:00:00Z') / 1000;
    subs[0].cb({ a: { 'sensor.act': { s: '', a: {}, c: 'x', lc } } });
    subs[0].cb({ c: { 'sensor.act': { '+': { s: 'single', lc: lc + 1 } } } });
    subs[0].cb({ c: { 'sensor.act': { '+': { s: '', lc: lc + 1.01 } } } });
    await el.updateComplete;
    expect(bubbles(el)).toEqual(['single']);
    el.remove();
    expect(subs[0].unsub).toHaveBeenCalledTimes(1);
  });
});
