import { describe, it, expect, vi } from 'vitest';
import { EntityFeed, type EntitiesMessage } from '../../src/live/entity-feed';
import { DeviceEventTracker } from '../../src/live/device-events';
import type { HassLike } from '../../src/api';
import type { Device, DeviceProps, Level } from '../../src/model/types';

/** One subscription made through the fake connection: its message, options, callback and unsubscribe spy. */
interface Sub { msg: Record<string, unknown>; opts: unknown; push(m: EntitiesMessage): void; unsub: ReturnType<typeof vi.fn> }

/** A connection whose subscriptions resolve on `settle`; it emits HA's connection events through `fire`. */
function fakeConnection() {
  const subs: Sub[] = [];
  const pending: (() => void)[] = [];
  const listeners = new Map<string, Set<() => void>>();
  const connection: HassLike['connection'] = {
    sendMessagePromise: () => Promise.reject(new Error('not used')),
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>, opts?: unknown) {
      const unsub = vi.fn(() => Promise.resolve());
      subs.push({ msg, opts, push: m => cb(m as T), unsub });
      return new Promise<() => Promise<void>>(resolve => { pending.push(() => resolve(unsub)); });
    },
    addEventListener(type, cb) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(cb);
    },
    removeEventListener(type, cb) { listeners.get(type)?.delete(cb); },
  };
  return {
    connection, subs,
    settle: async () => { pending.splice(0).forEach(f => f()); await new Promise(r => setTimeout(r, 0)); },
    fire: (type: 'ready' | 'disconnected') => { [...listeners.get(type) ?? []].forEach(cb => cb()); },
    listening: () => [...listeners.values()].reduce((n, s) => n + s.size, 0),
  };
}

const LC = 1_794_830_400; // 2026-11-16T10:00:00Z in epoch seconds
const iso = (sec: number) => new Date(sec * 1000).toISOString();

describe('EntityFeed', () => {
  it('subscribes to subscribe_entities for the watched ids and applies a / c / r messages', async () => {
    const c = fakeConnection();
    const onChange = vi.fn();
    const feed = new EntityFeed(() => c.connection, onChange);
    feed.watch(['sensor.b', 'sensor.a']);
    expect(c.subs.map(s => s.msg)).toEqual([{ type: 'subscribe_entities', entity_ids: ['sensor.a', 'sensor.b'] }]);
    expect(c.subs[0].opts).toEqual({ resubscribe: false });
    await c.settle();
    const hass = { 'sensor.a': { state: 'old' }, 'light.x': { state: 'on' } };
    expect(feed.overlay(hass)).toBe(hass);

    c.subs[0].push({ a: {
      'sensor.a': { s: 'x', a: { k: 1, j: 2 }, c: 'ctx', lc: LC },
      'sensor.b': { s: 'y', a: {}, c: 'ctx', lc: LC, lu: LC + 5 },
      'sensor.n': { s: 'z', a: {}, c: 'ctx', lc: undefined as unknown as number, lu: LC + 7 },
    } });
    expect(onChange).toHaveBeenCalledTimes(1);
    const o1 = feed.overlay(hass)!;
    expect(o1['light.x']).toEqual({ state: 'on' });
    expect(o1['sensor.a']).toEqual({ state: 'x', attributes: { k: 1, j: 2 }, last_changed: iso(LC) });
    expect(o1['sensor.n']).toEqual({ state: 'z', attributes: {}, last_changed: iso(LC + 7) });

    c.subs[0].push({ c: {
      'sensor.a': { '+': { s: 'single', a: { k: 3 }, lc: LC + 10 }, '-': { a: ['j'] } },
      'sensor.b': { '+': { lu: LC + 20 } },
      'sensor.missing': { '+': { s: 'q' } },
    } });
    const o2 = feed.overlay(hass)!;
    expect(o2['sensor.a']).toEqual({ state: 'single', attributes: { k: 3 }, last_changed: iso(LC + 10) });
    expect(o2['sensor.b']).toEqual({ state: 'y', attributes: {}, last_changed: iso(LC) });
    expect(o2['sensor.missing']).toBeUndefined();

    c.subs[0].push({ r: ['sensor.a'] });
    expect(feed.overlay(hass)!['sensor.a']).toEqual({ state: 'old' });
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('a press of single then empty in one synchronous burst still makes the single bubble', async () => {
    const c = fakeConnection();
    const t = new DeviceEventTracker();
    const level = { devices: [{ id: 'b1', name: 'B', invalid: false, placement: { mode: 'free', x: 0, y: 0 },
      props: { kind: 'smart_button', separateOff: false, autoEnabled: false } as DeviceProps,
      bindings: { on: 'sensor.act' } } as Device] } as unknown as Level;
    // The panel's hass only ever shows the coalesced last value ('').
    const hass = { 'sensor.act': { state: '', last_changed: iso(LC) } };
    const feed = new EntityFeed(() => c.connection, () => t.update(level, feed.overlay(hass), 5000));
    t.update(level, hass, 0);
    feed.watch(['sensor.act']);
    await c.settle();
    c.subs[0].push({ a: { 'sensor.act': { s: '', a: {}, c: 'x', lc: LC } } });
    c.subs[0].push({ c: { 'sensor.act': { '+': { s: 'single', lc: LC + 1 } } } });
    c.subs[0].push({ c: { 'sensor.act': { '+': { s: '', lc: LC + 1.01 } } } });
    expect(t.event('b1', 5000)?.text).toBe('single');
  });

  it('resubscribes when the source set changes; the same set is a no-op', async () => {
    const c = fakeConnection();
    const feed = new EntityFeed(() => c.connection, () => undefined);
    feed.watch(['sensor.a']);
    await c.settle();
    c.subs[0].push({ a: { 'sensor.a': { s: 'x', a: {}, c: 'c', lc: LC } } });
    feed.watch(['sensor.a']);
    expect(c.subs).toHaveLength(1);
    feed.watch(['sensor.a', 'event.b']);
    expect(c.subs).toHaveLength(2);
    expect(c.subs[0].unsub).toHaveBeenCalledTimes(1);
    expect(c.subs[1].msg).toEqual({ type: 'subscribe_entities', entity_ids: ['event.b', 'sensor.a'] });
    // The old subscription's late messages are ignored; the map starts empty.
    c.subs[0].push({ a: { 'sensor.a': { s: 'late', a: {}, c: 'c', lc: LC } } });
    expect(feed.overlay({})).toEqual({});
    feed.watch([]);
    await c.settle();
    expect(c.subs[1].unsub).toHaveBeenCalledTimes(1);
    expect(c.listening()).toBe(0);
  });

  it('unsubscribes on stop; a closed socket forgets the states and ready subscribes again', async () => {
    const c = fakeConnection();
    const onChange = vi.fn();
    const feed = new EntityFeed(() => c.connection, onChange);
    feed.watch(['sensor.a']);
    await c.settle();
    c.subs[0].push({ a: { 'sensor.a': { s: 'x', a: {}, c: 'c', lc: LC } } });
    c.fire('disconnected');
    expect(feed.overlay({})).toEqual({});
    c.subs[0].push({ a: { 'sensor.a': { s: 'stale', a: {}, c: 'c', lc: LC } } });
    expect(feed.overlay({})).toEqual({});
    expect(c.subs[0].unsub).not.toHaveBeenCalled();
    c.fire('ready');
    expect(c.subs).toHaveLength(2);
    await c.settle();
    feed.stop();
    expect(c.subs[1].unsub).toHaveBeenCalledTimes(1);
    expect(c.listening()).toBe(0);
  });

  it('without subscribeMessage the feed stays empty (hass.states is the fallback)', () => {
    const feed = new EntityFeed(() => ({ sendMessagePromise: () => Promise.reject(new Error('x')) }), () => undefined);
    feed.watch(['sensor.a']);
    const hass = { 'sensor.a': { state: 'on' } };
    expect(feed.overlay(hass)).toBe(hass);
  });

  it('a rejected subscription leaves the fallback', async () => {
    const conn: HassLike['connection'] = {
      sendMessagePromise: () => Promise.reject(new Error('x')),
      subscribeMessage: () => Promise.reject({ code: 'unknown_command' }),
    };
    const feed = new EntityFeed(() => conn, () => undefined);
    feed.watch(['sensor.a']);
    await new Promise(r => setTimeout(r, 0));
    const hass = { 'sensor.a': { state: 'on' } };
    expect(feed.overlay(hass)).toBe(hass);
  });
});
