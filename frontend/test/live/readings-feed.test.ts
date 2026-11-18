import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReadingsFeed } from '../../src/live/readings-feed';

type Answer = Record<string, { last: number | null; period: number | null; count: number }>;

function setup() {
  const calls: string[][] = [];
  const state: { answer: Answer | null } = { answer: { 'sensor.a': { last: 1, period: 2, count: 3 } } };
  const conn = {
    sendMessagePromise: vi.fn(async (msg: Record<string, unknown>) => {
      expect(msg.type).toBe('plan_studio/readings/get');
      calls.push(msg.entity_ids as string[]);
      if (state.answer === null) throw { code: 'unknown_command', message: 'nope' };
      return { readings: state.answer };
    }),
  };
  const host = { requestUpdate: vi.fn() };
  const feed = new ReadingsFeed(host, () => conn as never);
  return { feed, calls, state, host, conn };
}

const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };

describe('ReadingsFeed', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('asks at once, then every 2 s, and stops at stop()', async () => {
    const { feed, calls } = setup();
    feed.watch(['sensor.a']);
    await flush();
    expect(calls).toHaveLength(1);
    expect(feed.stats?.['sensor.a'].count).toBe(3);
    await vi.advanceTimersByTimeAsync(2000);
    expect(calls).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(4000);
    expect(calls).toHaveLength(4);
    feed.stop();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(calls).toHaveLength(4);
    expect(vi.getTimerCount()).toBe(0);
    expect(feed.stats).toBeNull();
  });

  it('the same entities again do not restart it; other entities ask at once', async () => {
    const { feed, calls } = setup();
    feed.watch(['sensor.a']);
    feed.watch(['sensor.a']);
    await flush();
    expect(calls).toHaveLength(1);
    feed.watch(['sensor.a', 'sensor.b']);
    await flush();
    expect(calls).toHaveLength(2);
    expect(calls[1]).toEqual(['sensor.a', 'sensor.b']);
    feed.stop();
  });

  it('no entities: nothing is asked', async () => {
    const { feed, calls } = setup();
    feed.watch([]);
    await vi.advanceTimersByTimeAsync(5000);
    expect(calls).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('at most 200 entities per ask', async () => {
    const { feed, calls } = setup();
    feed.watch(Array.from({ length: 250 }, (_, i) => `sensor.s${i}`));
    await flush();
    expect(calls[0]).toHaveLength(200);
    feed.stop();
  });

  it('a failed ask keeps the last answer and shows nothing new', async () => {
    const { feed, state, host } = setup();
    feed.watch(['sensor.a']);
    await flush();
    const good = feed.stats;
    host.requestUpdate.mockClear();
    state.answer = null;
    await vi.advanceTimersByTimeAsync(2000);
    expect(feed.stats).toBe(good);
    expect(host.requestUpdate).not.toHaveBeenCalled();
    state.answer = { 'sensor.a': { last: 9, period: 2, count: 4 } };
    await vi.advanceTimersByTimeAsync(2000);
    expect(feed.stats?.['sensor.a'].count).toBe(4);
    feed.stop();
  });

  it('an old server (unknown command) leaves the stats null and keeps asking quietly', async () => {
    const { feed, state, calls } = setup();
    state.answer = null;
    feed.watch(['sensor.a']);
    await flush();
    expect(feed.stats).toBeNull();
    await vi.advanceTimersByTimeAsync(2000);
    expect(calls).toHaveLength(2);
    feed.stop();
  });

  it('an answer that arrives after stop() is ignored', async () => {
    const { feed, conn, host } = setup();
    let release: (v: { readings: Answer }) => void = () => undefined;
    conn.sendMessagePromise.mockImplementationOnce(() => new Promise<{ readings: Answer }>(r => { release = r; }));
    feed.watch(['sensor.a']);
    feed.stop();
    host.requestUpdate.mockClear();
    release({ readings: { 'sensor.a': { last: 1, period: 1, count: 1 } } });
    await flush();
    expect(feed.stats).toBeNull();
    expect(host.requestUpdate).not.toHaveBeenCalled();
  });
});
