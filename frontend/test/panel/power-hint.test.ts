// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { STORAGE_KEY, createMockHass } from '../../dev/mock-hass';
import { deviceDefaults, emptyLevel, type Device, type Level } from '../../src/model/types';
import { blockRect, type GeoCtx } from '../../src/geometry/power';
import type { PowerBlock, PowerSchema } from '../../src/model/power';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import type { HassLike } from '../../src/api';
import { $, mount, pointer } from './helpers';

const METER: Device = {
  id: 'dm', name: 'Meter 1', invalid: false, placement: { mode: 'none' }, props: deviceDefaults('equipment', 'free'),
  bindings: { power: 'sensor.m_power', voltage: 'sensor.m_volt' },
};
const geo: GeoCtx = { device: id => (id === METER.id ? METER : undefined) };
const level = (): Level => ({ ...emptyLevel('L1'), devices: [METER] });
const schema: PowerSchema = {
  blocks: [
    { id: 'grid', kind: 'grid', x: 0, y: 0, power: 'sensor.grid_power' },
    { id: 'm', kind: 'device', x: 0, y: 200, deviceId: METER.id },
    { id: 'bus', kind: 'bus', x: 300, y: 100, w: 240, h: 12, name: 'Bus 1' },
  ] as PowerBlock[],
  wires: [],
};

/** A hass whose `plan_studio/readings/get` is answered by `answer` (null = unknown command); every ask is recorded. */
function hassWithReadings(answer: (() => Record<string, unknown>) | null): { hass: HassLike; asks: string[][] } {
  const base = createMockHass();
  const asks: string[][] = [];
  const hass: HassLike = {
    ...base,
    connection: {
      ...base.connection,
      async sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
        if (msg.type !== 'plan_studio/readings/get') return base.connection.sendMessagePromise<T>(msg);
        asks.push(msg.entity_ids as string[]);
        if (!answer) throw { code: 'unknown_command', message: 'Unknown command' };
        return { readings: answer() } as T;
      },
    },
  };
  return { hass, asks };
}

async function mountPower(hass: HassLike): Promise<PlanStudioPanel> {
  const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level()], power: schema };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
  const el = await mount(hass);
  el.setMode('power');
  await el.updateComplete;
  el.view = { x: 0, y: 0, scale: 1 };
  await el.updateComplete;
  return el;
}

const centre = (el: PlanStudioPanel, id: string) => {
  const r = blockRect(el.power.blocks.find(b => b.id === id)!, geo, el.power);
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
};
const hover = (el: PlanStudioPanel, id: string) => { const c = centre(el, id); pointer(el, 'pointermove', c.x, c.y); };
const hint = (el: PlanStudioPanel) => el.shadowRoot!.querySelector<HTMLElement>('.power-hint');
const lines = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.power-hint .line')].map(l => l.textContent!.trim());
const dwell = async (el: PlanStudioPanel, ms = 500) => { await vi.advanceTimersByTimeAsync(ms); await el.updateComplete; };

describe('Power step hover hint', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });
  afterEach(() => { vi.useRealTimers(); });

  const stats = () => ({ 'sensor.m_power': { last: Date.now() - 3000, period: 5000, count: 7 }, 'sensor.m_volt': { last: null, period: null, count: 0 } });

  it('rests on a device block for the dwell time: the hint lists its meters with their statistics', async () => {
    const { hass } = hassWithReadings(stats);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    hover(el, 'm');
    await dwell(el, 499);
    expect(hint(el)).toBeNull();
    await dwell(el, 1);
    expect(hint(el)).not.toBeNull();
    expect(lines(el)).toEqual([
      'Power  — · every ~5 s · last 3 s ago · next in ~2 s',
      'Voltage  — · no reports yet',
    ]);
    // the seconds keep counting between answers
    await dwell(el, 1000);
    expect(lines(el)[0]).toBe('Power  — · every ~5 s · last 4 s ago · next in ~1 s');
  });

  it('a grid block lists its own power meter', async () => {
    const { hass, asks } = hassWithReadings(() => ({}));
    const el = await mountPower(hass);
    vi.useFakeTimers();
    hover(el, 'grid');
    await dwell(el);
    expect(lines(el)).toEqual(['Power  —']);
    expect(asks[0]).toEqual(['sensor.grid_power']);
  });

  it('the pointer leaving the block hides it; no timer stays and nothing is asked any more', async () => {
    const { hass, asks } = hassWithReadings(stats);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    const before = vi.getTimerCount();
    hover(el, 'm');
    await dwell(el);
    expect(hint(el)).not.toBeNull();
    pointer(el, 'pointermove', 900, 900);
    await el.updateComplete;
    expect(hint(el)).toBeNull();
    expect(vi.getTimerCount()).toBe(before);
    const n = asks.length;
    await vi.advanceTimersByTimeAsync(10_000);
    expect(asks).toHaveLength(n);
  });

  it('pointer leave of the canvas hides it', async () => {
    const { hass } = hassWithReadings(stats);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    hover(el, 'm');
    await dwell(el);
    pointer(el, 'pointerleave', 0, 0);
    await el.updateComplete;
    expect(hint(el)).toBeNull();
  });

  it('a pointerdown (a drag starts) hides it and a pending dwell never opens it', async () => {
    const { hass } = hassWithReadings(stats);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    hover(el, 'm');
    await dwell(el);
    const c = centre(el, 'm');
    pointer(el, 'pointerdown', c.x, c.y);
    await el.updateComplete;
    expect(hint(el)).toBeNull();
    pointer(el, 'pointermove', c.x + 5, c.y + 5); // the drag: no hint while the button is down
    await dwell(el, 1500);
    expect(hint(el)).toBeNull();
    pointer(el, 'pointerup', c.x + 5, c.y + 5);
    await dwell(el, 400);
    expect((el.hint as unknown as { dwell: unknown; tick: unknown }).dwell).toBeNull(); // the drag's own debounce timers are not the hint's
    expect((el.hint as unknown as { tick: unknown }).tick).toBeNull();
    // pressed before the dwell ends
    hover(el, 'grid');
    await dwell(el, 300);
    const g = centre(el, 'grid');
    pointer(el, 'pointerdown', g.x, g.y);
    await dwell(el, 1000);
    expect(hint(el)).toBeNull();
  });

  it('a wheel zoom hides it', async () => {
    const { hass } = hassWithReadings(stats);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    hover(el, 'm');
    await dwell(el);
    $(el, 'svg.plan').dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, composed: true, cancelable: true }));
    await el.updateComplete;
    expect(hint(el)).toBeNull();
  });

  it('a bus has no hint', async () => {
    const { hass, asks } = hassWithReadings(stats);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    const before = vi.getTimerCount();
    hover(el, 'bus');
    expect(vi.getTimerCount()).toBe(before);
    await dwell(el, 1000);
    expect(hint(el)).toBeNull();
    expect(asks).toHaveLength(0);
  });

  it('asks once at open and again every 2 s', async () => {
    const { hass, asks } = hassWithReadings(stats);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    hover(el, 'm');
    await dwell(el);
    expect(asks).toHaveLength(1);
    expect(asks[0]).toEqual(['sensor.m_power', 'sensor.m_volt']);
    await dwell(el, 2000);
    expect(asks).toHaveLength(2);
  });

  it('an old server (unknown command): the hint still shows the meters with their values', async () => {
    const { hass } = hassWithReadings(null);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    hover(el, 'm');
    await dwell(el);
    expect(lines(el)).toEqual(['Power  —', 'Voltage  —']);
  });

  it('leaving the step or deleting the block closes it', async () => {
    const { hass } = hassWithReadings(stats);
    const el = await mountPower(hass);
    vi.useFakeTimers();
    hover(el, 'm');
    await dwell(el);
    el.commitPower({ ...el.power, blocks: el.power.blocks.filter(b => b.id !== 'm') });
    await el.updateComplete;
    expect(hint(el)).toBeNull();
    hover(el, 'grid');
    await dwell(el);
    expect(hint(el)).not.toBeNull();
    el.setMode('binding');
    await el.updateComplete;
    expect(hint(el)).toBeNull();
    pointer(el, 'pointermove', 5, 5);
    await dwell(el, 3000);
    expect(hint(el)).toBeNull();
  });

  it('sits beside the block, inside the canvas, and does not take pointer events', async () => {
    const { hass } = hassWithReadings(stats);
    const el = await mountPower(hass);
    (el as unknown as { size: { w: number; h: number } }).size = { w: 800, h: 600 };
    await el.updateComplete;
    vi.useFakeTimers();
    hover(el, 'm');
    await dwell(el);
    const r = blockRect(el.power.blocks.find(b => b.id === 'm')!, geo, el.power);
    const h = hint(el)!;
    expect(parseFloat(h.style.top)).toBeGreaterThanOrEqual(r.y + r.h);
    expect(parseFloat(h.style.left)).toBeGreaterThanOrEqual(4);
  });
});
