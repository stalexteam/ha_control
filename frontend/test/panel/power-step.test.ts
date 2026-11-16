// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEY, createMockHass } from '../../dev/mock-hass';
import { deviceDefaults, emptyLevel, type Device, type Level, type Pt } from '../../src/model/types';
import { updateBlock, type PortName, type PowerBlock, type PowerSchema } from '../../src/model/power';
import {
  blockRect, portPlaces, routeWire, transferChips, wireEnds, type GeoCtx,
} from '../../src/geometry/power';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import type { HassLike } from '../../src/api';
import { $, click, key, mount, pointer, press, undo } from './helpers';

/** A metering device that is not on the plan; its block `m` has IN, OUT and one value line. */
const METER: Device = {
  id: 'dm', name: 'Meter 1', invalid: false, placement: { mode: 'none' }, props: deviceDefaults('equipment', 'free'),
  bindings: { power: 'sensor.m_power' },
};
const level = (): Level => ({ ...emptyLevel('L1'), devices: [METER] });
const geo: GeoCtx = { device: id => (id === METER.id ? METER : undefined) };

const grid = (x = 0, y = 0): PowerBlock => ({ id: 'grid', kind: 'grid', x, y });
const meter = (x = 0, y = 200): PowerBlock => ({ id: 'm', kind: 'device', x, y, deviceId: METER.id });
const bus = (x = 300, y = 100): PowerBlock => ({ id: 'bus', kind: 'bus', x, y, w: 240, h: 12, name: 'Bus 1' });

/** Mounts a stored plan (with `power` when given), enters the Power step and sets a 1:1 view at the origin. */
async function mountPower(power?: PowerSchema, hass?: HassLike): Promise<PlanStudioPanel> {
  const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level()], ...(power ? { power } : {}) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
  const el = await mount(hass);
  el.setMode('power');
  await el.updateComplete;
  el.view = { x: 0, y: 0, scale: 1 };
  await el.updateComplete;
  return el;
}

const block = (el: PlanStudioPanel, id: string): PowerBlock => el.power.blocks.find(b => b.id === id)!;
const portPt = (el: PlanStudioPanel, id: string, port: PortName): Pt =>
  portPlaces(el.power, block(el, id), geo).find(p => p.name === port)!.pt;

async function drag(el: PlanStudioPanel, from: Pt, to: Pt): Promise<void> {
  pointer(el, 'pointerdown', from.x, from.y);
  pointer(el, 'pointermove', (from.x + to.x) / 2, (from.y + to.y) / 2);
  pointer(el, 'pointermove', to.x, to.y);
  pointer(el, 'pointerup', to.x, to.y);
  await el.updateComplete;
}

const stepText = (el: PlanStudioPanel) => $(el, '.steps [data-mode="power"] .state').textContent!.trim();
const stepDoneCls = (el: PlanStudioPanel) => $(el, '.steps [data-mode="power"]').classList.contains('done');
const notice = (el: PlanStudioPanel) => el.shadowRoot!.querySelector('.props .warn')?.textContent?.trim() ?? null;

describe('Power step', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('is the fourth step; its rail has the select tool and the six place tools; Esc from a place tool returns to Select', async () => {
    const el = await mountPower();
    expect(el.mode).toBe('power');
    expect(el.toolId).toBe('power-select');
    expect($(el, '.steps [data-mode="power"] .n').textContent).toBe('4');
    expect($(el, '.steps [data-mode="power"] .name').textContent).toBe('Power');
    expect([...el.shadowRoot!.querySelectorAll('.tools .tool')].map(b => b.textContent!.trim())).toEqual([
      'Select', 'Device', 'Bus', 'Battery', 'PV field', 'Transfer switch', 'Remainder',
    ]);
    await press(el, 'button[data-tool="power-bus"]');
    expect(el.toolId).toBe('power-bus');
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.toolId).toBe('power-select');
  });

  it('the canvas draws the schematic instead of the plan', async () => {
    const el = await mountPower({ blocks: [grid(), meter()], wires: [] });
    expect(el.shadowRoot!.querySelector('svg.plan g.power')).not.toBeNull();
    expect(el.shadowRoot!.querySelectorAll('svg.plan g.power .blocks > g')).toHaveLength(2);
  });

  it('the step cell shows "1 block" and is done once the grid has a power entity and a wire exists', async () => {
    const el = await mountPower();
    expect(stepText(el)).toBe('1 block');
    expect(stepDoneCls(el)).toBe(false);
    const gridId = el.power.blocks[0].id;
    el.commitPower(updateBlock(el.power, gridId, { power: 'sensor.grid_power' }, geo));
    await el.updateComplete;
    expect(stepDoneCls(el)).toBe(false);
    el.commitPower({ ...el.power, blocks: [...el.power.blocks, meter()] });
    await el.updateComplete;
    expect(stepText(el)).toBe('2 blocks');
    await drag(el, portPt(el, gridId, 'OUT'), portPt(el, 'm', 'IN'));
    expect(el.power.wires).toHaveLength(1);
    expect(stepDoneCls(el)).toBe(true);
  });

  it('placing a battery snaps it to the grid, selects it and returns to power-select', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-battery"]');
    click(el, 303, 207);
    await el.updateComplete;
    expect(el.power.blocks).toHaveLength(2);
    const m = el.power.blocks[1];
    expect(m.kind).toBe('battery');
    expect(m.x % 10).toBe(0);
    expect(m.y % 10).toBe(0);
    // Centred on the click: the click lies inside the placed block.
    const r = blockRect(m, geo, el.power);
    expect(303).toBeGreaterThan(r.x);
    expect(303).toBeLessThan(r.x + r.w);
    expect(207).toBeGreaterThan(r.y);
    expect(207).toBeLessThan(r.y + r.h);
    expect(el.selection).toEqual({ kind: 'powerBlock', id: m.id });
    expect(el.toolId).toBe('power-select');
    expect(el.history!.canUndo).toBe(true);
  });

  it('the Plan device tool without an armed device asks to pick one and places nothing', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    click(el, 300, 200);
    await el.updateComplete;
    expect(el.power.blocks).toHaveLength(1);
    expect(el.toolId).toBe('power-device');
    expect(notice(el)).toBe('Pick a device in the list first');
  });

  it('dragging from the grid OUT port to the meter IN port adds one wire; the draft is ok over the IN port', async () => {
    const el = await mountPower({ blocks: [grid(), meter()], wires: [] });
    const out = portPt(el, 'grid', 'OUT');
    const inn = portPt(el, 'm', 'IN');
    pointer(el, 'pointerdown', out.x, out.y);
    pointer(el, 'pointermove', inn.x, inn.y);
    expect(el.activeTool.preview().wireDraft).toEqual({ from: out, to: inn, ok: true });
    const mOut = portPt(el, 'm', 'OUT');
    pointer(el, 'pointermove', mOut.x, mOut.y);
    expect(el.activeTool.preview().wireDraft?.ok).toBe(false); // out to out
    pointer(el, 'pointermove', inn.x, inn.y);
    pointer(el, 'pointerup', inn.x, inn.y);
    await el.updateComplete;
    expect(el.power.wires).toHaveLength(1);
    expect(el.power.wires[0]).toMatchObject({ from: { block: 'grid', port: 'OUT' }, to: { block: 'm', port: 'IN' } });
    expect(el.activeTool.preview().wireDraft).toBeUndefined();
  });

  it('dragging from the meter IN port to the grid OUT port also works (oriented out to in)', async () => {
    const el = await mountPower({ blocks: [grid(), meter()], wires: [] });
    await drag(el, portPt(el, 'm', 'IN'), portPt(el, 'grid', 'OUT'));
    expect(el.power.wires).toHaveLength(1);
    expect(el.power.wires[0]).toMatchObject({ from: { block: 'grid', port: 'OUT' }, to: { block: 'm', port: 'IN' } });
  });

  it('a wire to a bus attaches at the release point', async () => {
    const el = await mountPower({ blocks: [grid(), bus()], wires: [] });
    await drag(el, portPt(el, 'grid', 'OUT'), { x: 360, y: 106 });
    expect(el.power.wires).toHaveLength(1);
    expect(el.power.wires[0]).toMatchObject({ from: { block: 'grid', port: 'OUT' }, to: { bus: 'bus', at: 0.25 } });
  });

  it('a wire that would close a loop sets the loop notice and adds nothing', async () => {
    const el = await mountPower({
      blocks: [grid(), bus(0, 120), meter(0, 220)],
      wires: [
        { id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { bus: 'bus', at: 0.25 } },
        { id: 'w2', from: { bus: 'bus', at: 0.25 }, to: { block: 'm', port: 'IN' } },
      ],
    });
    await drag(el, portPt(el, 'm', 'OUT'), { x: 200, y: 126 });
    expect(el.power.wires.map(w => w.id)).toEqual(['w1', 'w2']);
    expect(el.history!.canUndo).toBe(false);
    expect(notice(el)).toBe('This wire would close a loop');
  });

  it('dragging a wired port pins it where it is released on the outline', async () => {
    const el = await mountPower({
      blocks: [grid(), meter()],
      wires: [{ id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { block: 'm', port: 'IN' } }],
    });
    const r = blockRect(block(el, 'm'), geo, el.power);
    await drag(el, portPt(el, 'm', 'IN'), { x: r.x - 2, y: r.y + r.h / 2 });
    expect(block(el, 'm').portPins).toEqual({ IN: { side: 'left', at: 0.5 } });
    expect(el.power.wires).toHaveLength(1);
  });

  it('moving a block snaps it to the grid and its wires follow', async () => {
    const el = await mountPower({
      blocks: [grid(), meter()],
      wires: [{ id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { block: 'm', port: 'IN' } }],
    });
    const before = $(el, 'g[data-wire="w1"] path.wire').getAttribute('d');
    const r = blockRect(block(el, 'm'), geo, el.power);
    const c = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
    await drag(el, c, { x: c.x + 203, y: c.y + 48 });
    expect(block(el, 'm')).toMatchObject({ x: 200, y: 250 });
    const after = $(el, 'g[data-wire="w1"] path.wire').getAttribute('d');
    expect(after).not.toBe(before);
    const e = wireEnds(el.power, el.power.wires[0], geo)!;
    expect(after).toBe(`M${routeWire(e.a, e.b).map(q => `${q.x} ${q.y}`).join('L')}`);
    expect(el.selection).toEqual({ kind: 'powerBlock', id: 'm' });
  });

  it('a press on a block without moving selects it and changes nothing', async () => {
    const el = await mountPower({ blocks: [grid(), meter()], wires: [] });
    const r = blockRect(block(el, 'm'), geo, el.power);
    click(el, r.x + r.w / 2 + 1, r.y + r.h / 2);
    await el.updateComplete;
    expect(el.selection).toEqual({ kind: 'powerBlock', id: 'm' });
    expect(el.history!.canUndo).toBe(false);
    click(el, 900, 900);
    await el.updateComplete;
    expect(el.selection).toBeNull();
  });

  it('Escape cancels a block drag (consumed: the selection stays) and the release commits nothing', async () => {
    const el = await mountPower({ blocks: [grid(), meter()], wires: [] });
    const r = blockRect(block(el, 'm'), geo, el.power);
    const c = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
    pointer(el, 'pointerdown', c.x, c.y);
    pointer(el, 'pointermove', c.x + 100, c.y);
    expect(el.activeTool.preview().power).toBeDefined();
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.activeTool.preview().power).toBeUndefined();
    expect(el.selection).toEqual({ kind: 'powerBlock', id: 'm' });
    pointer(el, 'pointerup', c.x + 100, c.y);
    await el.updateComplete;
    expect(block(el, 'm')).toMatchObject({ x: 0, y: 200 });
    expect(el.history!.canUndo).toBe(false);
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.selection).toBeNull();
  });

  it('dragging a bus end resizes the bus along its long axis, at least 40 long; terminals stay in place', async () => {
    const el = await mountPower({
      blocks: [grid(), bus(100, 100)],
      wires: [{ id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { bus: 'bus', at: 0.25 } }],
    });
    await drag(el, { x: 340, y: 106 }, { x: 443, y: 106 });
    expect(block(el, 'bus')).toMatchObject({ x: 100, w: 340, h: 12 });
    expect(el.power.wires[0].to).toEqual({ bus: 'bus', at: 60 / 340 });
    await drag(el, { x: 100, y: 106 }, { x: 600, y: 106 });
    expect(block(el, 'bus')).toMatchObject({ x: 400, w: 40 });
    expect(el.power.wires[0].to).toEqual({ bus: 'bus', at: 0 });
  });

  it('a click on a transfer chip sends the position and changes nothing', async () => {
    const base = createMockHass();
    const sent: Record<string, unknown>[] = [];
    const hass: HassLike = {
      ...base,
      connection: {
        ...base.connection,
        sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
          if (msg.type === 'plan_studio/power/set_position') sent.push(msg);
          return base.connection.sendMessagePromise<T>(msg);
        },
      },
    };
    const ts: PowerBlock = { id: 'ts', kind: 'transfer', x: 0, y: 200, name: 'TS', form: '2in1out' };
    const el = await mountPower({ blocks: [grid(), ts], wires: [] }, hass);
    const chip = transferChips(ts as PowerBlock & { kind: 'transfer' }, geo, el.power).find(c => c.position === '0')!.rect;
    click(el, chip.x + chip.w / 2, chip.y + chip.h / 2);
    await el.updateComplete;
    expect(sent).toEqual([{ type: 'plan_studio/power/set_position', plan_id: 'P1', block_id: 'ts', position: '0' }]);
    expect(el.history!.canUndo).toBe(false);
  });

  it('a failed position request shows its error as the notice', async () => {
    const base = createMockHass();
    const hass: HassLike = {
      ...base,
      connection: {
        ...base.connection,
        sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
          if (msg.type === 'plan_studio/power/set_position') return Promise.reject({ code: 'x', message: 'Plan not found' });
          return base.connection.sendMessagePromise<T>(msg);
        },
      },
    };
    const el = await mountPower(undefined, hass);
    el.setPowerPosition('ts', 'B');
    await vi.waitFor(() => expect(el.notice).toBe('Plan not found'));
  });

  it('Delete on the grid keeps it and shows the notice', async () => {
    const el = await mountPower();
    const gridId = el.power.blocks[0].id;
    const r = blockRect(el.power.blocks[0], geo, el.power);
    click(el, r.x + 10, r.y + 10);
    await el.updateComplete;
    expect(el.selection).toEqual({ kind: 'powerBlock', id: gridId });
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.power.blocks.map(b => b.id)).toEqual([gridId]);
    expect(el.history!.canUndo).toBe(false);
    expect(notice(el)).toBe('The grid source cannot be deleted');
  });

  it('Delete on a block removes it with its wires', async () => {
    const el = await mountPower({
      blocks: [grid(), meter()],
      wires: [{ id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { block: 'm', port: 'IN' } }],
    });
    el.selection = { kind: 'powerBlock', id: 'm' };
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.power.blocks.map(b => b.id)).toEqual(['grid']);
    expect(el.power.wires).toEqual([]);
    expect(el.selection).toBeNull();
  });

  it('Delete on a wire removes it; Ctrl+Z restores it', async () => {
    const el = await mountPower({
      blocks: [grid(), meter()],
      wires: [{ id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { block: 'm', port: 'IN' } }],
    });
    const e = wireEnds(el.power, el.power.wires[0], geo)!;
    const pts = routeWire(e.a, e.b);
    const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    click(el, mid.x, mid.y);
    await el.updateComplete;
    expect(el.selection).toEqual({ kind: 'powerWire', id: 'w1' });
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.power.wires).toEqual([]);
    await undo(el);
    expect(el.power.wires.map(w => w.id)).toEqual(['w1']);
  });

  it('the first entry to the Power step after a plan is opened fits the schematic; later entries keep the view', async () => {
    const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level()],
      power: { blocks: [grid(0, 0), meter(0, 200)], wires: [] } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
    const el = await mount();
    (el as unknown as { size: { w: number; h: number } }).size = { w: 1000, h: 800 };
    await el.updateComplete;
    const planView = el.view;
    el.setMode('power');
    await el.updateComplete;
    // Bounds (0,0)-(120,260) plus a 40-unit margin would fit at 800 / 340 = 2.35: clamped to 1.5, centred.
    expect(el.powerView.scale).toBeCloseTo(1.5);
    expect(el.powerView.x + 1000 / el.powerView.scale / 2).toBeCloseTo(60);
    expect(el.powerView.y + 800 / el.powerView.scale / 2).toBeCloseTo(130);
    expect(el.planView).toEqual(planView);
    const mine = { x: 7, y: 8, scale: 0.9 };
    el.view = mine;
    el.setMode('binding');
    await el.updateComplete;
    el.setMode('power');
    await el.updateComplete;
    expect(el.view).toEqual(mine);
  });

  it('switching Binding -> Power -> Binding keeps the plan view; the Power view is kept too', async () => {
    const el = await mountPower();
    const powerView = { x: 5, y: 6, scale: 1.2 };
    el.view = powerView;
    el.setMode('binding');
    await el.updateComplete;
    const planView = { x: 1234, y: 567, scale: 0.05 };
    el.view = planView;
    el.setMode('power');
    await el.updateComplete;
    expect(el.view).toEqual(powerView);
    expect(el.planView).toEqual(planView);
    el.setMode('binding');
    await el.updateComplete;
    expect(el.view).toEqual(planView);
    expect(el.powerView).toEqual(powerView);
  });

  it('the status bar reads 100 % at 1 px per unit, shows a plain Grid toggle and no cones toggle', async () => {
    const el = await mountPower();
    const status = $(el, '.status').textContent!.replace(/\s+/g, ' ');
    expect(status).toContain('100%');
    expect(status).toContain('Grid');
    expect(status).not.toContain('mm');
    expect(el.shadowRoot!.querySelector('.status input[data-toggle="cones"]')).toBeNull();
  });
});
