// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEY } from '../../dev/mock-hass';
import { deviceDefaults, emptyLevel, type Device, type DeviceKind } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { $, click, key, mount } from './helpers';

const dev = (id: string, name: string, kind: DeviceKind, x: number, bindings?: Device['bindings']): Device =>
  ({ id, name, invalid: false, placement: { mode: 'free', x, y: 1000, rotation: 0 }, props: deviceDefaults(kind, 'free'), bindings });

/** A plan with three free devices: Bath light (bound to an entity absent from states), Kitchen climate, Desk climate. */
async function mountWithDevices(): Promise<PlanStudioPanel> {
  const level = {
    ...emptyLevel('L1'),
    devices: [
      dev('k', 'Kitchen climate', 'climate_sensor', 1000),
      dev('l', 'Bath light', 'ceiling_light', 3000, { control: 'light.absent' }),
      dev('d', 'Desk climate', 'climate_sensor', 5000),
    ],
  };
  const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
  return mount();
}

async function press(el: PlanStudioPanel, sel: string): Promise<void> {
  $<HTMLButtonElement>(el, sel).click();
  await el.updateComplete;
}

/** Class names of the main grid children, in DOM order. */
const columns = (el: PlanStudioPanel) => [...$(el, '.ed').children].map(c => c.classList[0]);

describe('wizard steps in the panel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('Next cycles plan -> equipment -> binding -> zones -> power, Back returns; each step activates its first tool', async () => {
    const el = await mount();
    expect(el.mode).toBe('plan');
    await press(el, '.steps [data-nav="next"]');
    expect(el.mode).toBe('equipment');
    expect(el.toolId).toBe('device-select');
    await press(el, '.steps [data-nav="next"]');
    expect(el.mode).toBe('binding');
    expect(el.toolId).toBe('binding-select');
    await press(el, '.steps [data-nav="next"]');
    expect(el.mode).toBe('zones');
    expect(el.toolId).toBe('zones-select');
    await press(el, '.steps [data-nav="next"]');
    expect(el.mode).toBe('power');
    expect(el.toolId).toBe('power-select');
    expect(el.shadowRoot!.querySelector('.steps [data-nav="next"]')).toBeNull();
    await press(el, '.steps [data-nav="back"]');
    expect(el.mode).toBe('zones');
    await press(el, '.steps [data-nav="back"]');
    expect(el.mode).toBe('binding');
    await press(el, '.steps [data-nav="back"]');
    expect(el.mode).toBe('equipment');
    await press(el, '.steps [data-nav="back"]');
    expect(el.mode).toBe('plan');
    expect(el.toolId).toBe('select');
  });

  it('the header has six step cells: five steps and the Automation placeholder', async () => {
    const el = await mount();
    const cells = [...el.shadowRoot!.querySelectorAll('.steps .step')];
    expect(cells.map(c => c.querySelector('.name')!.textContent)).toEqual(
      ['Plan', 'Equipment', 'Binding', 'Zones', 'Power', 'Automation']);
    expect(cells.map(c => c.querySelector('.n')!.textContent)).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('step cells switch the mode directly', async () => {
    const el = await mount();
    await press(el, '.top .steps button[data-mode="power"]');
    expect(el.mode).toBe('power');
    await press(el, '.top .steps button[data-mode="binding"]');
    expect(el.mode).toBe('binding');
    await press(el, '.top .steps button[data-mode="plan"]');
    expect(el.mode).toBe('plan');
  });

  it('layout order is rail | props | canvas in every step, with the device list as the rail in binding', async () => {
    const el = await mount();
    const order = (cols: string[]) => ['tools', 'blist', 'zlist', 'props', 'canvas'].map(c => cols.indexOf(c));
    expect(order(columns(el))).toEqual([1, -1, -1, 2, 3]);
    await press(el, '[data-mode="binding"]');
    expect(order(columns(el))).toEqual([-1, 1, -1, 2, 3]);
    expect($(el, '.ed').classList.contains('binding')).toBe(true);
    expect(el.shadowRoot!.querySelector('.tools')).toBeNull();
    await press(el, '[data-mode="zones"]');
    expect(order(columns(el))).toEqual([-1, -1, 1, 2, 3]);
    expect($(el, '.ed').classList.contains('zones')).toBe(true);
    expect($(el, '.ed').classList.contains('binding')).toBe(false);
    await press(el, '[data-mode="power"]');
    expect(order(columns(el))).toEqual([1, -1, -1, 2, 3]);
    expect($(el, '.ed').classList.contains('zones')).toBe(false);
  });

  it('binding props panel shows a placeholder; the selected device shows its name and kind', async () => {
    const el = await mountWithDevices();
    await press(el, '[data-mode="binding"]');
    expect($(el, '.props').textContent).toContain('Pick a device on the plan or in the list');
    click(el, 1000, 1000);
    await el.updateComplete;
    expect(el.selection).toEqual({ kind: 'device', id: 'k' });
    expect($<HTMLInputElement>(el, '.props input[data-field="name"]').value).toBe('Kitchen climate');
    expect($(el, '.props h4').textContent!.trim()).toBe('Climate sensor');
  });

  it('Delete and Backspace do nothing in binding mode', async () => {
    const el = await mountWithDevices();
    await press(el, '[data-mode="binding"]');
    click(el, 1000, 1000);
    await el.updateComplete;
    expect(el.selection).toEqual({ kind: 'device', id: 'k' });
    expect(el.deleteSelection()).toBe(false);
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    key(el, 'keydown', 'Backspace');
    await el.updateComplete;
    expect(el.history!.current.level.devices.map(d => d.id)).toEqual(['k', 'l', 'd']);
    expect(el.history!.canUndo).toBe(false);
    expect(el.selection).toEqual({ kind: 'device', id: 'k' });
    // Control: the same key deletes in the Equipment step.
    await press(el, '[data-mode="equipment"]');
    click(el, 1000, 1000);
    await el.updateComplete;
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.history!.current.level.devices.map(d => d.id)).toEqual(['l', 'd']);
  });

  it('list rows select, Next unbound device walks the not-bound devices, Esc clears', async () => {
    const el = await mountWithDevices();
    await press(el, '[data-mode="binding"]');
    // Not bound: Desk climate, Kitchen climate (name order); Bath light is bound to an entity not in states (unknown, not missing).
    expect([...el.shadowRoot!.querySelectorAll('.blist .brow .name')].map(n => n.textContent!.trim())).toEqual(['Desk climate', 'Kitchen climate']);
    expect($(el, '.steps [data-mode="binding"] .state').textContent!.trim()).toBe('1 of 3 bound');
    await press(el, '.blist [data-filter="all"]');
    expect(el.shadowRoot!.querySelector('.blist .brow[data-id="l"] .dot')!.classList.contains('bound')).toBe(true);
    await press(el, '.blist .brow[data-id="k"]');
    expect(el.selection).toEqual({ kind: 'device', id: 'k' });
    await press(el, '.props [data-action="next-unbound"]');
    expect(el.selection).toEqual({ kind: 'device', id: 'd' });
    await press(el, '.props [data-action="next-unbound"]');
    expect(el.selection).toEqual({ kind: 'device', id: 'k' });
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.selection).toBeNull();
  });

  it('the plan shows status rings in binding mode only', async () => {
    const el = await mountWithDevices();
    expect(el.shadowRoot!.querySelectorAll('svg.plan .bind-ring')).toHaveLength(0);
    await press(el, '[data-mode="binding"]');
    expect(el.shadowRoot!.querySelectorAll('svg.plan .bind-unbound')).toHaveLength(2);
    expect(el.shadowRoot!.querySelector('svg.plan g.device[data-id="l"] .bind-ring')).toBeNull();
  });

  it('a binding to an entity whose state is unavailable still counts as bound', async () => {
    const el = await mountWithDevices();
    el.hass = { ...el.hass!, states: { 'light.absent': { state: 'unavailable', attributes: {} } } };
    await press(el, '[data-mode="binding"]');
    expect($(el, '.steps [data-mode="binding"] .state').textContent!.trim()).toBe('1 of 3 bound');
  });
});
