import { describe, it, expect, vi, afterEach } from 'vitest';
import { VirtualFeed } from '../../src/live/virtual-feed';
import { RETRY_MAX, RETRY_MS } from '../../src/live/rules-feed';
import type { HassLike } from '../../src/api';

type Event = { states: Record<string, 'on' | 'off'> };
interface Sub { msg: Record<string, unknown>; push(ev: Event): void; unsub: ReturnType<typeof vi.fn> }

function fakeConnection(reject?: unknown) {
  const subs: Sub[] = [];
  const pending: (() => void)[] = [];
  const listeners = new Map<string, Set<() => void>>();
  const connection: HassLike['connection'] = {
    sendMessagePromise: () => Promise.reject(new Error('not used')),
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>) {
      const unsub = vi.fn(() => Promise.resolve());
      subs.push({ msg, push: ev => cb(ev as T), unsub });
      return new Promise<() => Promise<void>>((resolve, fail) => { pending.push(() => (reject === undefined ? resolve(unsub) : fail(reject))); });
    },
    addEventListener(type, cb) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type)!.add(cb); },
    removeEventListener(type, cb) { listeners.get(type)?.delete(cb); },
  };
  return {
    connection, subs,
    settle: async () => { pending.splice(0).forEach(f => f()); await new Promise<void>(r => setTimeout(r, 0)); },
    fire: (type: 'ready' | 'disconnected') => { [...listeners.get(type) ?? []].forEach(cb => cb()); },
  };
}

const T0 = Date.parse('2026-11-18T10:00:00Z');
const host = () => ({ requestUpdate: vi.fn() });

describe('VirtualFeed', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('subscribes for the plan and keeps the whole map of each event', async () => {
    const h = host();
    const c = fakeConnection();
    const feed = new VirtualFeed(h, () => c.connection, () => T0);
    feed.watch('P1');
    expect(c.subs.map(s => s.msg)).toEqual([{ type: 'plan_studio/virtual/subscribe', plan_id: 'P1' }]);
    await c.settle();
    expect(feed.ready).toBe(false);
    c.subs[0].push({ states: { a: 'on', b: 'off' } });
    expect(feed.ready).toBe(true);
    expect([feed.stateOf('a'), feed.stateOf('b'), feed.stateOf('c')]).toEqual(['on', 'off', undefined]);
    expect(h.requestUpdate).toHaveBeenCalled();
    // every event is the whole map: a device that is missing is gone
    c.subs[0].push({ states: { b: 'on' } });
    expect([feed.stateOf('a'), feed.stateOf('b')]).toEqual([undefined, 'on']);
    c.subs[0].push({ states: {} });
    expect(feed.stateOf('b')).toBeUndefined();
  });

  it('merge adds virtual.<id> entries a state reader takes as they are; the same states object while nothing has none', async () => {
    const c = fakeConnection();
    let now = T0;
    const feed = new VirtualFeed(host(), () => c.connection, () => now);
    const states = { 'light.a': { state: 'on', attributes: {} } };
    feed.watch('P1');
    await c.settle();
    expect(feed.merge(states)).toBe(states);
    expect(feed.merge(undefined)).toBeUndefined();
    c.subs[0].push({ states: { v1: 'off' } });
    const merged = feed.merge(states) as Record<string, unknown>;
    expect(merged['light.a']).toBe(states['light.a']);
    expect(merged['virtual.v1']).toEqual({ state: 'off', attributes: {}, last_changed: new Date(T0).toISOString() });
    expect(feed.merge(states)).toBe(merged); // cached while neither input changed
    expect(feed.merge({ ...states })).not.toBe(merged);
    // the time of a state moves only with its change
    now = T0 + 5000;
    c.subs[0].push({ states: { v1: 'off', v2: 'on' } });
    const next = feed.merge(states) as Record<string, { last_changed: string }>;
    expect(next['virtual.v1'].last_changed).toBe(new Date(T0).toISOString());
    expect(next['virtual.v2'].last_changed).toBe(new Date(T0 + 5000).toISOString());
    now = T0 + 9000;
    c.subs[0].push({ states: { v1: 'on', v2: 'on' } });
    const last = feed.merge(states) as Record<string, { state: string; last_changed: string }>;
    expect(last['virtual.v1']).toMatchObject({ state: 'on', last_changed: new Date(T0 + 9000).toISOString() });
    expect(last['virtual.v2'].last_changed).toBe(new Date(T0 + 5000).toISOString());
  });

  it('a different plan or null ends the subscription and forgets the states', async () => {
    const c = fakeConnection();
    const feed = new VirtualFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    c.subs[0].push({ states: { v1: 'on' } });
    feed.watch('P1');
    expect(c.subs).toHaveLength(1);
    feed.watch(null);
    expect(c.subs[0].unsub).toHaveBeenCalled();
    expect(feed.stateOf('v1')).toBeUndefined();
    expect(feed.ready).toBe(false);
    c.subs[0].push({ states: { v1: 'off' } }); // a late message of the ended subscription
    expect(feed.stateOf('v1')).toBeUndefined();
  });

  it('forgets at a disconnect and subscribes again at ready', async () => {
    const c = fakeConnection();
    const feed = new VirtualFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    c.subs[0].push({ states: { v1: 'on' } });
    c.fire('disconnected');
    expect(feed.stateOf('v1')).toBeUndefined();
    c.fire('ready');
    expect(c.subs).toHaveLength(2);
    await c.settle();
    c.subs[1].push({ states: { v1: 'off' } });
    expect(feed.stateOf('v1')).toBe('off');
  });

  it('a rejected subscription sets the error and is tried again, at most RETRY_MAX times', async () => {
    vi.useFakeTimers();
    const c = fakeConnection({ code: 'unknown_command', message: 'Unknown command' });
    const h = host();
    const feed = new VirtualFeed(h, () => c.connection);
    feed.watch('P1');
    await vi.advanceTimersByTimeAsync(0);
    c.settle();
    await vi.advanceTimersByTimeAsync(0);
    expect(feed.error).toContain('Unknown command');
    for (let i = 0; i < RETRY_MAX + 2; i++) { await vi.advanceTimersByTimeAsync(RETRY_MS); c.settle(); await vi.advanceTimersByTimeAsync(0); }
    expect(c.subs.length).toBe(RETRY_MAX + 1);
    feed.stop();
  });
});
