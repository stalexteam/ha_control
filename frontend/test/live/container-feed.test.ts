import { describe, it, expect, vi } from 'vitest';
import { ContainerFeed, type ContainerState } from '../../src/live/container-feed';
import type { HassLike } from '../../src/api';
import { deviceDefaults, type ContainerKind, type Device } from '../../src/model/types';

type Event = { full: boolean; containers: Record<string, ContainerState> };

/** One subscription made through the fake connection: its message, its callback and its unsubscribe spy. */
interface Sub { msg: Record<string, unknown>; push(ev: Event): void; unsub: ReturnType<typeof vi.fn> }

/**
 * A connection whose subscriptions resolve when `settle` is called (all pending ones, in order), or reject with
 * `reject` when it is set.
 */
function fakeConnection(reject?: unknown) {
  const subs: Sub[] = [];
  const pending: (() => void)[] = [];
  const connection: HassLike['connection'] = {
    sendMessagePromise: () => Promise.reject(new Error('not used')),
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>) {
      const unsub = vi.fn(() => Promise.resolve());
      subs.push({ msg, push: ev => cb(ev as T), unsub });
      return new Promise<() => Promise<void>>((resolve, fail) => {
        pending.push(() => (reject === undefined ? resolve(unsub) : fail(reject)));
      });
    },
  };
  return { connection, subs, settle: async () => { pending.splice(0).forEach(f => f()); await flush(); } };
}

const flush = () => new Promise<void>(r => setTimeout(r, 0));
const host = () => ({ requestUpdate: vi.fn() });
const on: ContainerState = { output: 'on', fault: null, kind: 'smart_button' };
const off: ContainerState = { output: 'off', fault: 'not_configured', kind: 'wall_switch' };
const err: ContainerState = { output: 'error', fault: 'unavailable', entities: ['sensor.x'], kind: 'smart_button' };
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
  });
});
