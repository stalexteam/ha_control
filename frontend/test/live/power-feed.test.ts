// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DEBOUNCE_MS, PowerFeed, powerPayload, type PowerPayload } from '../../src/live/power-feed';
import { RETRY_MAX, RETRY_MS } from '../../src/live/container-feed';
import type { HassLike } from '../../src/api';
import { deviceDefaults, emptyLevel, type Device, type Plan } from '../../src/model/types';
import { updateBlock, type PowerBlock, type PowerFrame, type PowerSchema } from '../../src/model/power';
import { transferChips } from '../../src/geometry/power';
import { STORAGE_KEY, createMockHass } from '../../dev/mock-hass';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { $, click, mount } from '../panel/helpers';

/** One subscription made through the fake connection: its message, its options, its callback and its unsubscribe spy. */
interface Sub { msg: Record<string, unknown>; opts: unknown; push(frame: PowerFrame): void; unsub: ReturnType<typeof vi.fn> }

/**
 * A connection whose subscriptions resolve when `settleNow` is called (all pending ones, in order), or reject with the
 * failure set by `failWith`. Commands are recorded in `sent` and resolve `{}`, or reject with `failSendWith`'s error.
 * It emits HA's connection events through `fire`.
 */
function fakeConnection(reject?: unknown) {
  const subs: Sub[] = [];
  const sent: Record<string, unknown>[] = [];
  const pending: (() => void)[] = [];
  const failure: { sub: unknown; send: unknown } = { sub: reject, send: undefined };
  const listeners = new Map<string, Set<() => void>>();
  const connection: HassLike['connection'] = {
    sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
      sent.push(msg);
      return failure.send === undefined ? Promise.resolve({} as T) : Promise.reject(failure.send);
    },
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>, opts?: unknown) {
      const unsub = vi.fn(() => Promise.resolve());
      subs.push({ msg, opts, push: f => cb(f as T), unsub });
      return new Promise<() => Promise<void>>((resolve, fail) => {
        pending.push(() => (failure.sub === undefined ? resolve(unsub) : fail(failure.sub)));
      });
    },
    addEventListener(type, cb) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(cb);
    },
    removeEventListener(type, cb) { listeners.get(type)?.delete(cb); },
  };
  return {
    connection, subs, sent,
    settleNow: async () => { pending.splice(0).forEach(f => f()); await vi.advanceTimersByTimeAsync(0); },
    failWith: (err: unknown) => { failure.sub = err; },
    failSendWith: (err: unknown) => { failure.send = err; },
    fire: (type: 'ready' | 'disconnected') => { [...listeners.get(type) ?? []].forEach(cb => cb()); },
    /** The number of listeners per event type. */
    listening: () => Object.fromEntries([...listeners].map(([k, s]) => [k, s.size])),
  };
}

const NOT_READY = { code: 'unknown_command', message: 'Not ready' };
const host = () => ({ requestUpdate: vi.fn() });
const grid: PowerBlock = { id: 'grid', kind: 'grid', x: 0, y: 0, power: 'sensor.grid_power' };
const meterAt = (y: number): PowerBlock => ({ id: 'm', kind: 'meter', x: 0, y, name: 'Meter 1' });
const draft = (...blocks: PowerBlock[]): PowerPayload => ({ power: { blocks: [grid, ...blocks], wires: [] }, devices: {} });
/** Successive drafts of one schematic: the meter is added, then moved twice. */
const A = draft();
const B = draft(meterAt(200));
const C = draft(meterAt(210));
const D = draft(meterAt(220));
const frame = (watts: number): PowerFrame => ({ wires: {}, blocks: { grid: { power: watts } } });
const SUB = (p: PowerPayload, planId = 'P1') =>
  ({ type: 'plan_studio/power/subscribe', plan_id: planId, power: p.power, devices: p.devices });

describe('powerPayload', () => {
  const dev = (id: string, bindings?: Device['bindings']): Device => ({
    id, name: id, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
    props: deviceDefaults('equipment', 'free'), ...(bindings ? { bindings } : {}),
  });

  it('carries the draft and the power / control bindings of the devices its device blocks refer to', () => {
    const level = {
      ...emptyLevel('L1'),
      devices: [
        dev('pc', { power: 'sensor.pc_power', control: 'switch.pc', temperature: 'sensor.pc_temp' }),
        dev('lamp'),
        dev('boiler', { power: 'sensor.boiler_power' }), // not in the schematic
      ],
    };
    const power: PowerSchema = {
      blocks: [
        grid,
        { id: 'b-pc', kind: 'device', x: 0, y: 200, deviceId: 'pc' },
        { id: 'b-lamp', kind: 'device', x: 200, y: 200, deviceId: 'lamp' },
        { id: 'b-gone', kind: 'device', x: 400, y: 200, deviceId: 'gone' }, // its plan device was deleted
      ],
      wires: [],
    };
    const p = powerPayload(power, level);
    expect(p.power).toBe(power);
    // The deleted device has no entry: the server reports its block missing.
    expect(p.devices).toStrictEqual({ pc: { power: 'sensor.pc_power', control: 'switch.pc' }, lamp: {} });
  });
});

describe('PowerFeed', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('DEBOUNCE_MS is 300', () => {
    expect(DEBOUNCE_MS).toBe(300);
  });

  it('the first frame is applied; an equal payload (compared as JSON) is a no-op', async () => {
    const h = host();
    const c = fakeConnection();
    const feed = new PowerFeed(h, () => c.connection);
    feed.watch('P1', A);
    // The first watch subscribes at once; the feed subscribes again itself on 'ready'.
    expect(c.subs.map(s => s.msg)).toEqual([SUB(A)]);
    expect(c.subs[0].opts).toEqual({ resubscribe: false });
    expect(feed.frame).toBeNull();
    await c.settleNow();
    expect(feed.frame).toBeNull();
    expect(feed.error).toBeNull();

    c.subs[0].push(frame(1060));
    expect(feed.frame).toEqual(frame(1060));
    expect(h.requestUpdate).toHaveBeenCalled();

    // The panel builds a new payload on every update: an equal one changes nothing.
    feed.watch('P1', structuredClone(A));
    await vi.advanceTimersByTimeAsync(10 * DEBOUNCE_MS);
    expect(c.subs).toHaveLength(1);
    expect(c.subs[0].unsub).not.toHaveBeenCalled();
    expect(feed.frame).toEqual(frame(1060));
    // Frames are always full: the next one replaces it.
    c.subs[0].push({ wires: { w: { power: null, state: 'dead' } }, blocks: {} });
    expect(feed.frame).toEqual({ wires: { w: { power: null, state: 'dead' } }, blocks: {} });
  });

  it('rapid edits keep one subscription', async () => {
    const c = fakeConnection();
    const feed = new PowerFeed(host(), () => c.connection);
    feed.watch('P1', A);
    await c.settleNow();
    c.subs[0].push(frame(1));

    // Three changes within 100 ms: one new subscription DEBOUNCE_MS after the last one, with the last draft.
    feed.watch('P1', B);
    await vi.advanceTimersByTimeAsync(50);
    feed.watch('P1', C);
    await vi.advanceTimersByTimeAsync(50);
    feed.watch('P1', D);
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 1);
    expect(c.subs).toHaveLength(1);
    expect(c.subs[0].unsub).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(c.subs.map(s => s.msg)).toEqual([SUB(A), SUB(D)]);
    expect(c.subs[0].unsub).toHaveBeenCalledTimes(1);

    // The old frame stays until the new one arrives; a late event of the old subscription is ignored.
    expect(feed.frame).toEqual(frame(1));
    c.subs[0].push(frame(2));
    expect(feed.frame).toEqual(frame(1));
    await c.settleNow();
    c.subs[1].push(frame(3));
    expect(feed.frame).toEqual(frame(3));
    c.subs[0].push(frame(4));
    expect(feed.frame).toEqual(frame(3));
    await vi.advanceTimersByTimeAsync(60_000);
    expect(c.subs).toHaveLength(2);
    expect(c.subs[1].unsub).not.toHaveBeenCalled();
  });

  it('a subscription replaced before it settles is unsubscribed once it does; its failure is ignored', async () => {
    const c = fakeConnection();
    const feed = new PowerFeed(host(), () => c.connection);
    feed.watch('P1', A);
    feed.watch('P1', B);
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    expect(c.subs.map(s => s.msg)).toEqual([SUB(A), SUB(B)]);
    expect(c.subs[0].unsub).not.toHaveBeenCalled(); // not settled yet
    await c.settleNow();
    expect(c.subs.map(s => s.unsub.mock.calls.length)).toEqual([1, 0]);
    c.subs[0].push(frame(1));
    expect(feed.frame).toBeNull();

    const f = fakeConnection(NOT_READY);
    const failed = new PowerFeed(host(), () => f.connection);
    failed.watch('P1', A);
    failed.watch(null, null);
    await f.settleNow();
    expect(failed.error).toBeNull();
    expect(vi.getTimerCount()).toBe(0); // no retry
  });

  it('disconnect clears the frame and ready resubscribes with the draft', async () => {
    const h = host();
    const c = fakeConnection();
    const feed = new PowerFeed(h, () => c.connection);
    feed.watch('P1', A);
    await c.settleNow();
    c.subs[0].push(frame(1));

    h.requestUpdate.mockClear();
    c.fire('disconnected');
    expect(feed.frame).toBeNull();
    expect(h.requestUpdate).toHaveBeenCalled();
    // The subscription ended with the socket: no unsubscribe goes out, and anything it still delivers is ignored.
    expect(c.subs[0].unsub).not.toHaveBeenCalled();
    c.subs[0].push(frame(2));
    expect(feed.frame).toBeNull();

    // An edit during the outage waits for the connection.
    feed.watch('P1', B);
    await vi.advanceTimersByTimeAsync(10 * DEBOUNCE_MS);
    expect(c.subs).toHaveLength(1);
    c.fire('ready');
    expect(c.subs.map(s => s.msg)).toEqual([SUB(A), SUB(B)]);
    await c.settleNow();
    c.subs[1].push(frame(3));
    expect(feed.frame).toEqual(frame(3));
    expect(c.subs[0].unsub).not.toHaveBeenCalled();

    // An edit still waiting for its debounce when the connection comes back goes out with the 'ready' subscription.
    c.fire('disconnected');
    feed.watch('P1', C);
    c.fire('ready');
    expect(c.subs.map(s => s.msg)).toEqual([SUB(A), SUB(B), SUB(C)]);
    await vi.advanceTimersByTimeAsync(10 * DEBOUNCE_MS);
    expect(c.subs).toHaveLength(3);

    // 'ready' while a subscription is live: that one is ended first, so there is only ever one.
    await c.settleNow();
    c.fire('ready');
    expect(c.subs[2].unsub).toHaveBeenCalledTimes(1);
    expect(c.subs.map(s => s.msg)).toEqual([SUB(A), SUB(B), SUB(C), SUB(C)]);
  });

  it('leaving the Power step stops the subscription; entering again or another plan subscribes at once', async () => {
    const c = fakeConnection();
    const feed = new PowerFeed(host(), () => c.connection);
    feed.watch('P1', A);
    expect(c.listening()).toEqual({ disconnected: 1, ready: 1 });
    await c.settleNow();
    c.subs[0].push(frame(1));
    feed.watch('P1', B); // a pending re-subscription goes too

    feed.watch(null, null);
    expect(c.subs[0].unsub).toHaveBeenCalledTimes(1);
    expect(feed.frame).toBeNull();
    expect(c.listening()).toEqual({ disconnected: 0, ready: 0 });
    c.subs[0].push(frame(2));
    expect(feed.frame).toBeNull();
    await vi.advanceTimersByTimeAsync(60_000);
    c.fire('ready');
    expect(c.subs).toHaveLength(1);
    feed.watch(null, null); // idle: nothing more happens
    expect(c.subs[0].unsub).toHaveBeenCalledTimes(1);

    feed.watch('P1', B);
    expect(c.subs.map(s => s.msg)).toEqual([SUB(A), SUB(B)]);
    await c.settleNow();
    c.subs[1].push(frame(3));
    feed.watch('P2', B);
    expect(c.subs[1].unsub).toHaveBeenCalledTimes(1);
    expect(feed.frame).toBeNull(); // the old plan's values are gone at once
    expect(c.subs.map(s => s.msg)).toEqual([SUB(A), SUB(B), SUB(B, 'P2')]);
    expect(c.listening()).toEqual({ disconnected: 1, ready: 1 });
  });

  it('a failed subscription retries every RETRY_MS, at most RETRY_MAX times; an edit later tries afresh', async () => {
    const h = host();
    const c = fakeConnection(NOT_READY);
    const feed = new PowerFeed(h, () => c.connection);
    feed.watch('P1', A);
    await c.settleNow();
    expect(feed.error).toBe('Not ready');
    expect(feed.frame).toBeNull();
    expect(h.requestUpdate).toHaveBeenCalled();
    for (let i = 1; i <= RETRY_MAX; i++) {
      await vi.advanceTimersByTimeAsync(RETRY_MS - 1);
      expect(c.subs).toHaveLength(i);
      await vi.advanceTimersByTimeAsync(1);
      expect(c.subs).toHaveLength(1 + i);
      expect(c.subs[i].msg).toEqual(SUB(A));
      await c.settleNow();
    }
    await vi.advanceTimersByTimeAsync(10 * 60_000);
    expect(c.subs).toHaveLength(1 + RETRY_MAX);

    c.failWith(undefined);
    feed.watch('P1', B);
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    await c.settleNow();
    expect(c.subs[RETRY_MAX + 1].msg).toEqual(SUB(B));
    expect(feed.error).toBeNull();
    c.subs[RETRY_MAX + 1].push(frame(1));
    expect(feed.frame).toEqual(frame(1));
  });

  it('a failed re-subscription clears the frame: no values for a draft the server has not seen', async () => {
    const c = fakeConnection();
    const feed = new PowerFeed(host(), () => c.connection);
    feed.watch('P1', A);
    await c.settleNow();
    c.subs[0].push(frame(1));
    c.failWith(NOT_READY);
    feed.watch('P1', B);
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    expect(feed.frame).toEqual(frame(1));
    await c.settleNow();
    expect(feed.frame).toBeNull();
    expect(feed.error).toBe('Not ready');
  });

  it('without subscribeMessage the error is set and nothing throws', async () => {
    const feed = new PowerFeed(host(), () => ({ sendMessagePromise: () => Promise.reject(new Error('not used')) }));
    expect(() => feed.watch('P1', A)).not.toThrow();
    expect(feed.error).toBe('Live state is not available.');
    expect(feed.frame).toBeNull();
    feed.watch('P1', B);
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    expect(feed.error).toBe('Live state is not available.');
    feed.stop();
    expect(feed.error).toBeNull();

    const none = new PowerFeed(host(), () => undefined);
    expect(() => none.watch('P1', A)).not.toThrow();
    expect(none.error).toBe('Live state is not available.');
  });

  it('setPosition sends the position for the watched plan; nothing goes out while no plan is watched', async () => {
    const c = fakeConnection();
    const feed = new PowerFeed(host(), () => c.connection);
    await feed.setPosition('ts', 'A');
    expect(c.sent).toEqual([]);
    feed.watch('P1', A);
    await feed.setPosition('ts', '0');
    expect(c.sent).toEqual([{ type: 'plan_studio/power/set_position', plan_id: 'P1', block_id: 'ts', position: '0' }]);
    expect(feed.error).toBeNull();
  });

  it('a failed setPosition sets the error and rejects', async () => {
    const h = host();
    const c = fakeConnection();
    const feed = new PowerFeed(h, () => c.connection);
    feed.watch('P1', A);
    h.requestUpdate.mockClear();
    const err = { code: 'not_loaded', message: 'Plan Studio is not loaded' };
    c.failSendWith(err);
    await expect(feed.setPosition('ts', 'B')).rejects.toBe(err);
    expect(feed.error).toBe('Plan Studio is not loaded');
    expect(h.requestUpdate).toHaveBeenCalled();
  });
});

describe('PowerFeed in the panel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  type PowerSub = { msg: Record<string, unknown>; unsub: ReturnType<typeof vi.fn> };

  /** The dev mock (answering `power/subscribe` once with `powerFrame`), recording the power subscriptions it ends. */
  function recording(powerFrame?: PowerFrame): { hass: HassLike; power: PowerSub[] } {
    const base = createMockHass(powerFrame ? { powerFrame } : {});
    const power: PowerSub[] = [];
    const hass: HassLike = {
      ...base,
      connection: {
        ...base.connection,
        subscribeMessage<T>(cb: (m: T) => void, msg: Record<string, unknown>, opts?: { resubscribe?: boolean }) {
          const done = base.connection.subscribeMessage!<T>(cb, msg, opts);
          if (msg.type !== 'plan_studio/power/subscribe') return done;
          const rec: PowerSub = { msg, unsub: vi.fn() };
          power.push(rec);
          return done.then(unsub => () => { rec.unsub(); return unsub(); });
        },
      },
    };
    return { hass, power };
  }

  const pc: Device = {
    id: 'd-pc', name: 'PC', invalid: false, bindings: { power: 'sensor.pc_power', control: 'switch.pc' },
    placement: { mode: 'free', x: 0, y: 0, rotation: 0 }, props: deviceDefaults('equipment', 'free'),
  };
  const schematic: PowerSchema = {
    blocks: [grid, { id: 'b-pc', kind: 'device', x: 0, y: 200, deviceId: 'd-pc' }],
    wires: [{ id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { block: 'b-pc', port: 'IN' } }],
  };
  const live: PowerFrame = { wires: { w1: { power: 1060, state: 'live' } }, blocks: { grid: { power: 1060 } } };

  /** Mounts stored plan P1 (with `power` when given) in the Plan step. */
  async function open(hass: HassLike, power?: PowerSchema): Promise<PlanStudioPanel> {
    const plan: Plan = { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1,
      levels: [{ ...emptyLevel('L1'), devices: [pc] }], ...(power ? { power } : {}) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
    return mount(hass);
  }

  async function enterPower(el: PlanStudioPanel): Promise<void> {
    el.setMode('power');
    await el.updateComplete;
    el.view = { x: 0, y: 0, scale: 1 };
    await el.updateComplete;
  }

  it('the Power step subscribes with the draft and the bindings; the frame reaches the canvas and the properties', async () => {
    const { hass, power } = recording(live);
    const el = await open(hass, schematic);
    expect(power).toHaveLength(0); // idle outside the Power step
    await enterPower(el);
    expect(power.map(s => s.msg)).toEqual([{
      type: 'plan_studio/power/subscribe', plan_id: 'P1', power: schematic,
      devices: { 'd-pc': { power: 'sensor.pc_power', control: 'switch.pc' } },
    }]);
    await vi.waitFor(() => expect(el.powerFeed.frame).toEqual(live));
    await el.updateComplete;
    expect($(el, 'g[data-wire="w1"] path.wire').getAttribute('class')).toBe('wire live');
    el.selection = { kind: 'powerWire', id: 'w1' };
    await el.updateComplete;
    expect($(el, '.props [data-field="wire-power"]').textContent).toBe('1.06 kW');
    expect(el.save.dirty).toBe(false);

    // Leaving the step stops the subscription and forgets the values.
    el.setMode('plan');
    await el.updateComplete;
    expect(power[0].unsub).toHaveBeenCalledTimes(1);
    expect(el.powerFeed.frame).toBeNull();

    // Back in the step a fresh subscription; detaching the panel ends it.
    await enterPower(el);
    expect(power).toHaveLength(2);
    await vi.waitFor(() => expect(el.powerFeed.frame).toEqual(live));
    el.remove();
    expect(power[1].unsub).toHaveBeenCalledTimes(1);
    expect(el.powerFeed.frame).toBeNull();
    // Attached again (still in the step): subscribed again without waiting for a new hass.
    document.body.appendChild(el);
    expect(power).toHaveLength(3);
    await vi.waitFor(() => expect(el.powerFeed.frame).toEqual(live));
  });

  it('without a frame the wires have no data', async () => {
    const { hass } = recording();
    const el = await open(hass, schematic);
    await enterPower(el);
    expect($(el, 'g[data-wire="w1"] path.wire').getAttribute('class')).toBe('wire nodata');
  });

  it('a plan without power subscribes with the shown schematic and stays clean', async () => {
    const { hass, power } = recording();
    const el = await open(hass);
    await enterPower(el);
    expect(power.map(s => s.msg)).toEqual([{ type: 'plan_studio/power/subscribe', plan_id: 'P1', power: el.power, devices: {} }]);
    await vi.waitFor(() => expect(el.powerFeed.frame).toEqual({ wires: {}, blocks: {} }));
    expect(el.history!.current.power).toBeUndefined();
    expect(el.save.dirty).toBe(false);
  });

  it('an edit re-subscribes with the draft after DEBOUNCE_MS', async () => {
    const { hass, power } = recording(live);
    const el = await open(hass, schematic);
    await enterPower(el);
    el.commitPower(updateBlock(el.power, 'grid', { name: 'AC-IN' }));
    await el.updateComplete;
    expect(power).toHaveLength(1);
    await vi.waitFor(() => expect(power).toHaveLength(2), { timeout: 10 * DEBOUNCE_MS });
    expect(power[1].msg.power).toEqual(el.power);
    expect(power[0].unsub).toHaveBeenCalledTimes(1);
  });

  it('clicking chip 0 on the transfer calls powerFeed.setPosition', async () => {
    const ts: PowerBlock = { id: 'ts', kind: 'transfer', x: 0, y: 200, name: 'TS', form: '2in1out' };
    const { hass } = recording();
    const el = await open(hass, { blocks: [grid, ts], wires: [] });
    await enterPower(el);
    const set = vi.spyOn(el.powerFeed, 'setPosition');
    const chip = transferChips(ts as PowerBlock & { kind: 'transfer' }, { device: () => undefined }, el.power)
      .find(x => x.position === '0')!.rect;
    click(el, chip.x + chip.w / 2, chip.y + chip.h / 2);
    await el.updateComplete;
    expect(set).toHaveBeenCalledWith('ts', '0');
    expect(el.history!.canUndo).toBe(false);
  });
});
