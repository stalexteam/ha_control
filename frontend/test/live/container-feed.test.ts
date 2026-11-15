import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContainerFeed, type ContainerState } from '../../src/live/container-feed';
import type { HassLike } from '../../src/api';
import { deviceDefaults, type ContainerKind, type Device } from '../../src/model/types';

type Event = { full: boolean; containers: Record<string, ContainerState> };

/** One subscription made through the fake connection: its message, its options, its callback and its unsubscribe spy. */
interface Sub { msg: Record<string, unknown>; opts: unknown; push(ev: Event): void; unsub: ReturnType<typeof vi.fn> }

/**
 * A connection whose subscriptions resolve when `settle` is called (all pending ones, in order), or reject with
 * the failure set when they settle (`reject`, changed by `failWith`). It emits HA's connection events through `fire`.
 */
function fakeConnection(reject?: unknown) {
  const subs: Sub[] = [];
  const pending: (() => void)[] = [];
  const failure = { err: reject };
  const listeners = new Map<string, Set<() => void>>();
  const connection: HassLike['connection'] = {
    sendMessagePromise: () => Promise.reject(new Error('not used')),
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>, opts?: unknown) {
      const unsub = vi.fn(() => Promise.resolve());
      subs.push({ msg, opts, push: ev => cb(ev as T), unsub });
      return new Promise<() => Promise<void>>((resolve, fail) => {
        pending.push(() => (failure.err === undefined ? resolve(unsub) : fail(failure.err)));
      });
    },
    addEventListener(type, cb) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(cb);
    },
    removeEventListener(type, cb) { listeners.get(type)?.delete(cb); },
  };
  return {
    connection, subs,
    settle: async () => { pending.splice(0).forEach(f => f()); await flush(); },
    /** Settles under fake timers (flush would wait on a faked setTimeout). */
    settleNow: async () => { pending.splice(0).forEach(f => f()); await vi.advanceTimersByTimeAsync(0); },
    failWith: (err: unknown) => { failure.err = err; },
    fire: (type: 'ready' | 'disconnected') => { [...listeners.get(type) ?? []].forEach(cb => cb()); },
    /** The number of listeners per event type. */
    listening: () => Object.fromEntries([...listeners].map(([k, s]) => [k, s.size])),
  };
}

const flush = () => new Promise<void>(r => setTimeout(r, 0));
const SUBSCRIBE = { type: 'plan_studio/containers/subscribe', plan_id: 'P1' };
const NOT_READY = { code: 'unknown_command', message: 'Not ready' };
const host = () => ({ requestUpdate: vi.fn() });
const on: ContainerState = { kind: 'smart_button', status: 'ok', last: { action: 'set', value: 'on', at: '2026-11-15T10:00:00+00:00' } };
const off: ContainerState = { kind: 'wall_switch', status: 'error', reason: 'not_configured' };
const err: ContainerState = { kind: 'smart_button', status: 'error', reason: 'unavailable', entities: ['sensor.x'] };
/** A device of the given kind (only id and kind matter to the feed). */
const dev = (id: string, kind: ContainerKind): Device =>
  ({ id, name: id, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 }, props: deviceDefaults(kind, 'free') });

describe('ContainerFeed', () => {
  it('full message replaces the map; partial merges', async () => {
    const h = host();
    const c = fakeConnection();
    const feed = new ContainerFeed(h, () => c.connection);
    feed.watch('P1');
    expect(c.subs.map(s => s.msg)).toEqual([{ type: 'plan_studio/containers/subscribe', plan_id: 'P1' }]);
    await c.settle();
    expect(feed.ready).toBe(false);
    expect(feed.error).toBeNull();
    expect(feed.get('a')).toBeUndefined();

    c.subs[0].push({ full: true, containers: { a: on, b: off } });
    expect(feed.ready).toBe(true);
    expect(feed.get('a')).toEqual(on);
    expect(feed.get('b')).toEqual(off);
    expect(h.requestUpdate).toHaveBeenCalled();

    h.requestUpdate.mockClear();
    c.subs[0].push({ full: false, containers: { a: err } });
    expect(feed.get('a')).toEqual(err);
    expect(feed.get('b')).toEqual(off);
    expect(h.requestUpdate).toHaveBeenCalled();

    // After a plan save the server sends a full snapshot again: deleted containers disappear.
    c.subs[0].push({ full: true, containers: { c: on } });
    expect(feed.get('a')).toBeUndefined();
    expect(feed.get('b')).toBeUndefined();
    expect(feed.get('c')).toEqual(on);
    expect(feed.ready).toBe(true);
  });

  it('ContainerState carries status and last', () => {
    const toggled: ContainerState = { kind: 'smart_button', status: 'ok', last: { action: 'toggle', at: '2026-11-15T10:00:00+00:00' } };
    expect(toggled.last?.value).toBeUndefined();
    expect([on.status, off.status, err.status]).toEqual(['ok', 'error', 'error']);
    expect([off.reason, err.reason, err.entities]).toEqual(['not_configured', 'unavailable', ['sensor.x']]);
    expect(on.last).toEqual({ action: 'set', value: 'on', at: '2026-11-15T10:00:00+00:00' });
  });

  it('stateOf gives the state of a device only when the saved container is of the same kind', async () => {
    const c = fakeConnection();
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    c.subs[0].push({ full: true, containers: { a: on, b: off } });
    expect(feed.stateOf(dev('a', 'smart_button'))).toEqual(on);
    expect(feed.stateOf(dev('b', 'wall_switch'))).toEqual(off);
    // An unsaved Type change: the saved container is of the other kind.
    expect(feed.stateOf(dev('a', 'wall_switch'))).toBeUndefined();
    expect(feed.stateOf(dev('b', 'smart_button'))).toBeUndefined();
    expect(feed.stateOf(dev('x', 'smart_button'))).toBeUndefined();
  });

  it('a partial message before the first full one does not make the feed ready', async () => {
    const c = fakeConnection();
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    c.subs[0].push({ full: false, containers: { a: on } });
    expect(feed.ready).toBe(false);
    expect(feed.get('a')).toEqual(on);
  });

  it('watching another plan unsubscribes the old one', async () => {
    const c = fakeConnection();
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    c.subs[0].push({ full: true, containers: { a: on } });

    feed.watch('P1'); // same plan: no-op
    expect(c.subs).toHaveLength(1);
    expect(c.subs[0].unsub).not.toHaveBeenCalled();
    expect(feed.ready).toBe(true);

    feed.watch('P2');
    expect(c.subs[0].unsub).toHaveBeenCalledTimes(1);
    expect(c.subs.map(s => s.msg.plan_id)).toEqual(['P1', 'P2']);
    // The old plan's outputs are gone at once and its late messages are ignored.
    expect(feed.ready).toBe(false);
    expect(feed.get('a')).toBeUndefined();
    c.subs[0].push({ full: true, containers: { a: on } });
    expect(feed.ready).toBe(false);
    expect(feed.get('a')).toBeUndefined();

    await c.settle();
    c.subs[1].push({ full: true, containers: { b: off } });
    expect(feed.get('b')).toEqual(off);

    feed.watch(null);
    expect(c.subs[1].unsub).toHaveBeenCalledTimes(1);
    expect(feed.ready).toBe(false);
    expect(feed.get('b')).toBeUndefined();
    expect(c.subs).toHaveLength(2);
  });

  it('a subscription ended before it settles is unsubscribed once it does', async () => {
    const c = fakeConnection();
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch('P1');
    feed.watch('P2'); // P1 still pending
    feed.stop(); // P2 still pending
    expect(c.subs.every(s => s.unsub.mock.calls.length === 0)).toBe(true);
    await c.settle();
    expect(c.subs.map(s => s.unsub.mock.calls.length)).toEqual([1, 1]);
    c.subs[1].push({ full: true, containers: { a: on } });
    expect(feed.ready).toBe(false);
    expect(feed.get('a')).toBeUndefined();
  });

  it('stop() ends the subscription; the same plan can be watched again afterwards', async () => {
    const c = fakeConnection();
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    feed.stop();
    expect(c.subs[0].unsub).toHaveBeenCalledTimes(1);
    feed.stop();
    expect(c.subs[0].unsub).toHaveBeenCalledTimes(1);
    feed.watch('P1');
    expect(c.subs).toHaveLength(2);
  });

  it('an unsubscribe rejected by a closed connection is harmless', async () => {
    const c = fakeConnection();
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    c.subs[0].unsub.mockImplementation(() => Promise.reject(3));
    expect(() => feed.stop()).not.toThrow();
    await flush();
  });

  it('subscribe failure keeps the plan usable', async () => {
    const h = host();
    const c = fakeConnection({ code: 'unknown_command', message: 'Unknown command' });
    const feed = new ContainerFeed(h, () => c.connection);
    expect(() => feed.watch('P1')).not.toThrow();
    await c.settle();
    expect(feed.ready).toBe(false);
    expect(feed.error).toBe('Unknown command');
    expect(feed.get('a')).toBeUndefined();
    expect(h.requestUpdate).toHaveBeenCalled();
    // Another plan starts clean.
    feed.watch('P2');
    expect(feed.error).toBeNull();
  });

  it('a failure of a subscription already replaced is ignored', async () => {
    const c = fakeConnection({ code: 'unknown_command', message: 'Unknown command' });
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch('P1');
    feed.watch(null);
    await c.settle();
    expect(feed.error).toBeNull();
  });

  it('missing subscribeMessage → error set, no throw', () => {
    const feed = new ContainerFeed(host(), () => ({ sendMessagePromise: () => Promise.reject(new Error('not used')) }));
    expect(() => feed.watch('P1')).not.toThrow();
    expect(feed.ready).toBe(false);
    expect(feed.error).toBe('Live outputs are not available.');
    expect(feed.get('a')).toBeUndefined();
    expect(() => feed.stop()).not.toThrow();
    expect(feed.error).toBeNull();

    const none = new ContainerFeed(host(), () => undefined);
    expect(() => none.watch('P1')).not.toThrow();
    expect(none.error).toBe('Live outputs are not available.');
  });

  it('watching no plan subscribes to nothing', () => {
    const c = fakeConnection();
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch(null);
    expect(c.subs).toHaveLength(0);
    expect(feed.ready).toBe(false);
    expect(feed.error).toBeNull();
    expect(c.listening()).toEqual({});
  });
});

describe('ContainerFeed: connection loss', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('disconnect clears; ready resubscribes', async () => {
    const h = host();
    const c = fakeConnection();
    const feed = new ContainerFeed(h, () => c.connection);
    feed.watch('P1');
    // The feed subscribes again itself on 'ready': the library's own resubscription would be a second one.
    expect(c.subs[0].opts).toEqual({ resubscribe: false });
    await c.settle();
    c.subs[0].push({ full: true, containers: { a: on } });
    expect(feed.get('a')).toEqual(on);

    h.requestUpdate.mockClear();
    c.fire('disconnected');
    expect(feed.get('a')).toBeUndefined();
    expect(feed.ready).toBe(false);
    expect(h.requestUpdate).toHaveBeenCalled();
    expect(c.subs).toHaveLength(1);
    // The subscription ended with the socket: no unsubscribe goes out (its id may belong to another command after
    // the reconnect), and anything it still delivers is ignored.
    expect(c.subs[0].unsub).not.toHaveBeenCalled();
    c.subs[0].push({ full: true, containers: { a: on } });
    expect(feed.get('a')).toBeUndefined();
    expect(feed.ready).toBe(false);

    c.fire('ready');
    expect(c.subs.map(s => s.msg)).toEqual([SUBSCRIBE, SUBSCRIBE]);
    await c.settle();
    h.requestUpdate.mockClear();
    c.subs[1].push({ full: true, containers: { b: off } });
    expect(feed.ready).toBe(true);
    expect(feed.get('b')).toEqual(off);
    expect(feed.get('a')).toBeUndefined();
    expect(h.requestUpdate).toHaveBeenCalled();
    expect(c.subs[0].unsub).not.toHaveBeenCalled();

    // 'ready' while a subscription is still live: that one is ended first, so nothing is counted twice.
    c.fire('ready');
    expect(c.subs[1].unsub).toHaveBeenCalledTimes(1);
    expect(c.subs).toHaveLength(3);
    await c.settle();
    c.subs[1].push({ full: false, containers: { a: on } });
    expect(feed.get('a')).toBeUndefined();
    c.subs[2].push({ full: true, containers: { a: err } });
    expect(feed.get('a')).toEqual(err);
    expect(feed.get('b')).toBeUndefined();
    expect(c.subs.map(s => s.unsub.mock.calls.length)).toEqual([0, 1, 0]);
  });

  it('a failed resubscribe retries every 5 s and stops after 12 attempts', async () => {
    vi.useFakeTimers();
    const h = host();
    const c = fakeConnection();
    const feed = new ContainerFeed(h, () => c.connection);
    feed.watch('P1');
    await c.settleNow();
    c.fire('disconnected');
    c.failWith(NOT_READY); // HA restarting: the integration is not loaded yet
    c.fire('ready');
    await c.settleNow();
    expect(c.subs).toHaveLength(2);
    expect(feed.error).toBe('Not ready'); // the output line shows the error meanwhile
    for (let i = 1; i <= 12; i++) {
      await vi.advanceTimersByTimeAsync(4999);
      expect(c.subs).toHaveLength(1 + i);
      await vi.advanceTimersByTimeAsync(1);
      expect(c.subs).toHaveLength(2 + i);
      expect(c.subs[1 + i].msg).toEqual(SUBSCRIBE);
      await c.settleNow();
    }
    await vi.advanceTimersByTimeAsync(10 * 60_000);
    expect(c.subs).toHaveLength(14);
    expect(feed.error).toBe('Not ready');
    expect(feed.ready).toBe(false);
  });

  it('a retry that succeeds clears the error and brings the outputs back', async () => {
    vi.useFakeTimers();
    const h = host();
    const c = fakeConnection(NOT_READY);
    const feed = new ContainerFeed(h, () => c.connection);
    feed.watch('P1');
    await c.settleNow();
    expect(feed.error).toBe('Not ready');
    await vi.advanceTimersByTimeAsync(5000);
    await c.settleNow();
    expect(c.subs).toHaveLength(2);
    c.failWith(undefined);
    await vi.advanceTimersByTimeAsync(5000);
    h.requestUpdate.mockClear();
    await c.settleNow();
    expect(c.subs).toHaveLength(3);
    expect(feed.error).toBeNull();
    expect(h.requestUpdate).toHaveBeenCalled();
    c.subs[2].push({ full: true, containers: { a: on } });
    expect(feed.get('a')).toEqual(on);
    await vi.advanceTimersByTimeAsync(10 * 60_000);
    expect(c.subs).toHaveLength(3);
    // A later failure (after another reconnect) gets a fresh run of 12 retries.
    c.failWith(NOT_READY);
    c.fire('disconnected');
    c.fire('ready');
    await c.settleNow();
    expect(c.subs).toHaveLength(4);
    for (let i = 0; i < 13; i++) {
      await vi.advanceTimersByTimeAsync(5000);
      await c.settleNow();
    }
    expect(c.subs).toHaveLength(4 + 12);
  });

  it('stop removes the listeners and cancels the retries', async () => {
    vi.useFakeTimers();
    const c = fakeConnection(NOT_READY);
    const feed = new ContainerFeed(host(), () => c.connection);
    feed.watch('P1');
    expect(c.listening()).toEqual({ disconnected: 1, ready: 1 });
    await c.settleNow();
    expect(feed.error).toBe('Not ready');

    // Another plan: the retries of the old one stop; one set of listeners stays.
    feed.watch('P2');
    expect(c.listening()).toEqual({ disconnected: 1, ready: 1 });
    await c.settleNow();
    await vi.advanceTimersByTimeAsync(5000);
    expect(c.subs.map(s => s.msg.plan_id)).toEqual(['P1', 'P2', 'P2']);

    feed.stop();
    expect(c.listening()).toEqual({ disconnected: 0, ready: 0 });
    await vi.advanceTimersByTimeAsync(10 * 60_000);
    c.fire('ready');
    c.fire('disconnected');
    expect(c.subs).toHaveLength(3);
    expect(feed.error).toBeNull();
  });
});
