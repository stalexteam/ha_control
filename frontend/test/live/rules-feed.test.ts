import { describe, it, expect, vi, afterEach } from 'vitest';
import { RulesFeed, notConfirmed, type RuleLast, type RuleTrace } from '../../src/live/rules-feed';
import { t } from '../../src/i18n';
import { RETRY_MAX, RETRY_MS } from '../../src/live/container-feed';
import type { HassLike } from '../../src/api';

type Event = { full: boolean; rules: Record<string, RuleTrace> };
interface Sub { msg: Record<string, unknown>; opts: unknown; push(ev: Event): void; unsub: ReturnType<typeof vi.fn> }

/** A connection whose subscriptions settle on demand; it emits HA's connection events through `fire`. */
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
    settle: async () => { pending.splice(0).forEach(f => f()); await new Promise<void>(r => setTimeout(r, 0)); },
    settleNow: async () => { pending.splice(0).forEach(f => f()); await vi.advanceTimersByTimeAsync(0); },
    fire: (type: 'ready' | 'disconnected') => { [...listeners.get(type) ?? []].forEach(cb => cb()); },
    listening: () => Object.fromEntries([...listeners].map(([k, s]) => [k, s.size])),
  };
}

const host = () => ({ requestUpdate: vi.fn() });
const ok: RuleTrace = { status: 'ok', verdict: true, inputs: [], unknownInputs: 0 };
const waiting: RuleTrace = { status: 'waiting', verdict: null, inputs: [{ label: 'Leak', value: null, detail: 'unavailable' }], unknownInputs: 1 };

describe('RulesFeed', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('subscribes for the plan; a full message replaces the traces, a partial one merges', async () => {
    const h = host();
    const c = fakeConnection();
    const feed = new RulesFeed(h, () => c.connection);
    feed.watch('P1');
    expect(c.subs.map(s => s.msg)).toEqual([{ type: 'plan_studio/rules/subscribe', plan_id: 'P1' }]);
    expect(c.subs[0].opts).toEqual({ resubscribe: false });
    await c.settle();
    expect(feed.ready).toBe(false);
    expect(feed.trace('a')).toBeUndefined();

    c.subs[0].push({ full: true, rules: { a: ok, b: waiting } });
    expect(feed.ready).toBe(true);
    expect(feed.trace('a')).toEqual(ok);
    expect(feed.trace('b')).toEqual(waiting);
    expect(h.requestUpdate).toHaveBeenCalled();

    c.subs[0].push({ full: false, rules: { a: { ...ok, verdict: false } } });
    expect(feed.trace('a')?.verdict).toBe(false);
    expect(feed.trace('b')).toEqual(waiting);

    c.subs[0].push({ full: true, rules: { c: ok } });
    expect(feed.trace('a')).toBeUndefined();
    expect(feed.trace('c')).toEqual(ok);
  });

  it('words a command the device never confirmed (status reason and last entry); other errors stay as sent', async () => {
    const c = fakeConnection();
    const feed = new RulesFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    const last: RuleLast = { action: 'on', target: 'Light', at: 1, reason: 'became true: Leak wet' };
    c.subs[0].push({ full: true, rules: {
      a: { ...ok, status: 'error', reason: 'not confirmed', last: { ...last, error: 'not confirmed' } },
      b: { ...ok, status: 'error', reason: 'target unavailable', last: { ...last, error: 'waiting for target' } },
    } });
    expect(feed.trace('a')?.reason).toBe('not confirmed by the device');
    expect(feed.trace('a')?.last?.error).toBe('not confirmed by the device');
    expect(notConfirmed(feed.trace('a')!.last!)).toBe(true);
    expect(feed.trace('b')?.reason).toBe('target unavailable');
    expect(feed.trace('b')?.last?.error).toBe('waiting for target');
    expect(notConfirmed(feed.trace('b')!.last!)).toBe(false);
    c.subs[0].push({ full: false, rules: { a: { ...ok, last: { ...last, error: 'not confirmed' } } } });
    expect(feed.trace('a')?.last?.error).toBe('not confirmed by the device');
    expect(feed.trace('a')?.reason).toBeUndefined();
    expect(t('rules.error.notConfirmed')).toBe('not confirmed by the device');
  });

  it('the same plan is a no-op; another plan ends the old subscription and forgets its traces', async () => {
    const c = fakeConnection();
    const feed = new RulesFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settle();
    c.subs[0].push({ full: true, rules: { a: ok } });
    feed.watch('P1');
    expect(c.subs).toHaveLength(1);
    feed.watch('P2');
    expect(c.subs[0].unsub).toHaveBeenCalledTimes(1);
    expect(feed.ready).toBe(false);
    expect(feed.trace('a')).toBeUndefined();
    c.subs[0].push({ full: true, rules: { a: ok } }); // late message of the old plan
    expect(feed.trace('a')).toBeUndefined();
    feed.stop();
    expect(c.listening()).toEqual({ disconnected: 0, ready: 0 });
  });

  it('a disconnect forgets the traces at once; ready subscribes again', async () => {
    const h = host();
    const c = fakeConnection();
    const feed = new RulesFeed(h, () => c.connection);
    feed.watch('P1');
    await c.settle();
    c.subs[0].push({ full: true, rules: { a: ok } });
    c.fire('disconnected');
    expect(feed.ready).toBe(false);
    expect(feed.trace('a')).toBeUndefined();
    expect(c.subs[0].unsub).not.toHaveBeenCalled();
    c.fire('ready');
    expect(c.subs).toHaveLength(2);
    await c.settle();
    c.subs[1].push({ full: true, rules: { a: waiting } });
    expect(feed.trace('a')).toEqual(waiting);
  });

  it('a connection without subscriptions sets error; a rejected one retries and clears the error', async () => {
    vi.useFakeTimers();
    const none = new RulesFeed(host(), () => ({ sendMessagePromise: () => Promise.reject(new Error('x')) }));
    none.watch('P1');
    expect(none.error).toBe('Live state is not available.');

    const c = fakeConnection({ code: 'unknown_command', message: 'Not ready' });
    const feed = new RulesFeed(host(), () => c.connection);
    feed.watch('P1');
    await c.settleNow();
    expect(feed.error).toBe('Not ready');
    expect(RETRY_MAX).toBeGreaterThan(0);
    await vi.advanceTimersByTimeAsync(RETRY_MS);
    expect(c.subs).toHaveLength(2);
    feed.stop();
  });
});
