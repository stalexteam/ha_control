// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import type { HassLike } from '../../src/api';
import type { EntityCombo } from '../../src/binding/entity-combo';
import { deviceDefaults, type Device, type DeviceKind, type DevicePlacement, type Level } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { rectRoomLevel } from '../fixtures';
import { $, key, mount, pressSave, stored } from './helpers';

const st = (state: string, attributes: Record<string, string> = {}) => ({ state, attributes });

/** Live states: a smart plug, two climate sensor devices, two lamps (one unavailable). */
const STATES: Record<string, unknown> = {
  'switch.plug': st('on', { friendly_name: 'Plug relay' }),
  'sensor.plug_power': st('12', { friendly_name: 'Plug power', device_class: 'power', unit_of_measurement: 'W' }),
  'sensor.plug_volt': st('230', { friendly_name: 'Plug voltage', device_class: 'voltage', unit_of_measurement: 'V' }),
  'sensor.t_wc': st('21.5', { friendly_name: 'Temp WC', device_class: 'temperature', unit_of_measurement: '°C' }),
  'sensor.h_wc': st('55', { friendly_name: 'Hum WC', device_class: 'humidity', unit_of_measurement: '%' }),
  'sensor.t_a': st('21', { friendly_name: 'Temp A', device_class: 'temperature', unit_of_measurement: '°C' }),
  'sensor.t_b': st('22', { friendly_name: 'Temp B', device_class: 'temperature', unit_of_measurement: '°C' }),
  'sensor.h_b': st('50', { friendly_name: 'Hum B', device_class: 'humidity', unit_of_measurement: '%' }),
  'light.desk': st('off', { friendly_name: 'Desk lamp' }),
  'light.dead': st('unavailable', { friendly_name: 'Dead lamp' }),
};

const REGISTRY: Record<string, unknown> = {
  'config/entity_registry/list': [
    { entity_id: 'switch.plug', device_id: 'plug1' },
    { entity_id: 'sensor.plug_power', device_id: 'plug1' },
    { entity_id: 'sensor.plug_volt', device_id: 'plug1' },
    { entity_id: 'sensor.t_wc', device_id: 'th1' },
    { entity_id: 'sensor.h_wc', device_id: 'th1' },
    { entity_id: 'sensor.t_a', device_id: 'th2' },
    { entity_id: 'sensor.t_b', device_id: 'th2' },
    { entity_id: 'sensor.h_b', device_id: 'th2' },
    { entity_id: 'light.desk', device_id: 'lamp1' },
    { entity_id: 'light.dead', device_id: 'lamp1' },
  ],
  'config/device_registry/list': [
    { id: 'plug1', name: 'Smart plug', model: 'P1' },
    { id: 'th1', name: 'WC sensor', area_id: 'wc' },
    { id: 'th2', name: 'Twin sensor' },
    { id: 'lamp1', name: 'Desk lamp' },
  ],
  'config/area_registry/list': [{ area_id: 'wc', name: 'WC' }],
};

/** Mock hass with live states; the registry commands are counted and answered, or rejected while `fail.on`. */
function haHass(fail = { on: false }): { hass: HassLike; calls: string[] } {
  const base = createMockHass();
  const calls: string[] = [];
  const hass: HassLike = {
    ...base,
    states: STATES,
    connection: {
      sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
        const type = String(msg.type);
        if (!(type in REGISTRY)) return base.connection.sendMessagePromise<T>(msg);
        calls.push(type);
        return fail.on ? Promise.reject({ code: 'unauthorized', message: 'Unauthorized' })
          : Promise.resolve(structuredClone(REGISTRY[type]) as T);
      },
    },
  };
  return { hass, calls };
}

const free = (x: number, y: number): DevicePlacement => ({ mode: 'free', x, y, rotation: 0 });
const dev = (id: string, name: string, kind: DeviceKind, placement: DevicePlacement, bindings?: Device['bindings']): Device =>
  ({ id, name, invalid: false, placement, props: deviceDefaults(kind, placement.mode), bindings });

/**
 * List order (by name): Dead light (bound, entity unavailable), Desk light (bound), Ghost light (bound to an
 * entity absent from states and registry), Hall socket, Kitchen light (bound, same entity as Desk light), WC climate.
 */
function level(): Level {
  return {
    ...rectRoomLevel(6000, 4000, 200),
    devices: [
      dev('s', 'Hall socket', 'socket', { mode: 'wall', wallId: 'w0', side: 'right', offset: 1000 }),
      dev('c', 'WC climate', 'climate_sensor', free(3000, 2000)),
      dev('g', 'Ghost light', 'ceiling_light', free(1000, 2000), { control: 'light.gone' }),
      dev('u', 'Dead light', 'ceiling_light', free(5000, 2000), { control: 'light.dead' }),
      dev('k', 'Kitchen light', 'ceiling_light', free(4000, 3000), { control: 'light.desk' }),
      dev('d', 'Desk light', 'ceiling_light', free(2000, 3000), { control: 'light.desk' }),
    ],
  };
}

async function press(el: PlanStudioPanel, sel: string): Promise<void> {
  $<HTMLButtonElement>(el, sel).click();
  await el.updateComplete;
}

const notice = (el: PlanStudioPanel) => el.shadowRoot!.querySelector('[data-notice="registry"]');
const dot = (el: PlanStudioPanel, id: string) => [...$(el, `.blist .brow[data-id="${id}"] .dot`).classList];
const device = (el: PlanStudioPanel, id: string) => el.history!.current.devices.find(d => d.id === id)!;
const combo = (el: PlanStudioPanel, role: string) => $<EntityCombo>(el, `.props ps-entity-combo[data-role="${role}"]`);

/** Opens the stored plan with the HA mock and enters the Binding step; resolves once the registry load settled. */
async function open(fail = { on: false }): Promise<{ el: PlanStudioPanel; calls: string[] }> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    plans: { P1: { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1, levels: [level()] } },
  }));
  const { hass, calls } = haHass(fail);
  const el = await mount(hass);
  expect(calls).toEqual([]);
  await press(el, '[data-mode="binding"]');
  await vi.waitFor(() => expect(calls).toHaveLength(3));
  if (fail.on) await vi.waitFor(() => expect(notice(el)).not.toBeNull());
  else await vi.waitFor(() => expect(dot(el, 'g')).toContain('missing'));
  return { el, calls };
}

/** Selects a device through the list (All filter). */
async function pick(el: PlanStudioPanel, id: string): Promise<void> {
  await press(el, '.blist [data-filter="all"]');
  await press(el, `.blist .brow[data-id="${id}"]`);
  expect(el.selection).toEqual({ kind: 'device', id });
}

/** Opens a role's combobox and clicks the row of `eid`. */
async function choose(el: PlanStudioPanel, role: string, eid: string): Promise<void> {
  const c = combo(el, role);
  c.shadowRoot!.querySelector<HTMLElement>('.cbox')!.click();
  await c.updateComplete;
  const row = c.shadowRoot!.querySelector<HTMLElement>(`.opt[data-id="${eid}"]`);
  if (!row) throw new Error(`no row ${eid}`);
  row.click();
  await c.updateComplete;
  await el.updateComplete;
}

async function haDevice(el: PlanStudioPanel, id: string): Promise<HTMLSelectElement> {
  const sel = $<HTMLSelectElement>(el, '.props select[data-field="ha-device"]');
  sel.value = id;
  sel.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
  return sel;
}

const undo = async (el: PlanStudioPanel) => {
  key(el, 'keydown', 'z', { ctrlKey: true, code: 'KeyZ' });
  await el.updateComplete;
};

describe('binding step', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('entering the step loads the three registries once; coming back does not load them again', async () => {
    const { el, calls } = await open();
    expect([...calls].sort()).toEqual(['config/area_registry/list', 'config/device_registry/list', 'config/entity_registry/list']);
    await press(el, '[data-mode="equipment"]');
    await press(el, '[data-mode="binding"]');
    await el.updateComplete;
    expect(calls).toHaveLength(3);
    expect(notice(el)).toBeNull();
  });

  it('a failed registry load shows the notice with Retry, flags nothing as Missing and fields still work; Retry loads again', async () => {
    const fail = { on: true };
    const { el, calls } = await open(fail);
    expect(notice(el)!.textContent).toContain("Couldn't load the Home Assistant registries: Unauthorized");
    await pick(el, 's');
    expect(el.shadowRoot!.querySelectorAll('.blist .dot.missing')).toHaveLength(0);
    expect(dot(el, 'g')).toContain('bound');
    await choose(el, 'control', 'switch.plug');
    expect(device(el, 's').bindings).toEqual({ control: 'switch.plug' });
    // Re-entering the step does not retry by itself.
    await press(el, '[data-mode="equipment"]');
    await press(el, '[data-mode="binding"]');
    expect(calls).toHaveLength(3);
    expect(notice(el)).not.toBeNull();
    fail.on = false;
    await press(el, '[data-action="retry-registry"]');
    await vi.waitFor(() => expect(calls).toHaveLength(6));
    await vi.waitFor(() => expect(notice(el)).toBeNull());
    await press(el, '.blist [data-filter="all"]');
    expect(dot(el, 'g')).toContain('missing');
  });

  it('a socket shows its name, kind, and the Control and Power fields', async () => {
    const { el } = await open();
    await pick(el, 's');
    expect($(el, '.props h4').textContent!.trim()).toBe('Hall socket');
    expect($(el, '.props').textContent).toContain('Socket');
    const roles = [...el.shadowRoot!.querySelectorAll('.props .role')];
    expect(roles.map(r => r.querySelector('.role-label')!.textContent!.trim())).toEqual(['Control', 'Power']);
    expect(roles.map(r => r.getAttribute('data-role'))).toEqual(['control', 'power']);
    expect(combo(el, 'control').label).toBe('Control');
  });

  it('Show all widens one field to its whole domain', async () => {
    const { el } = await open();
    await pick(el, 's');
    const ids = () => combo(el, 'power').items.map(e => e.entityId);
    expect(ids()).toEqual(['sensor.plug_power']);
    const box = $<HTMLInputElement>(el, '.props input[data-showall="power"]');
    expect(box.checked).toBe(false);
    box.click();
    await el.updateComplete;
    expect(ids()).toContain('sensor.plug_volt');
    expect(ids()).toContain('sensor.t_wc');
    expect(combo(el, 'control').items.map(e => e.entityId)).toEqual(['switch.plug']);
  });

  it('picking an entity stores bindings.control and the status turns bound; Undo removes it', async () => {
    const { el } = await open();
    await pick(el, 's');
    expect(dot(el, 's')).toContain('unbound');
    await choose(el, 'control', 'switch.plug');
    expect(device(el, 's').bindings).toEqual({ control: 'switch.plug' });
    expect(el.bindStatus(device(el, 's'))).toBe('bound');
    expect(dot(el, 's')).toContain('bound');
    expect(combo(el, 'control').value).toBe('switch.plug');
    expect(el.save.dirty).toBe(true);
    await undo(el);
    expect(device(el, 's').bindings).toBeUndefined();
    expect(el.bindStatus(device(el, 's'))).toBe('unbound');
  });

  it('clearing a field removes the role', async () => {
    const { el } = await open();
    await pick(el, 'd');
    combo(el, 'control').shadowRoot!.querySelector<HTMLElement>('.x')!.click();
    await el.updateComplete;
    expect(device(el, 'd').bindings).toBeUndefined();
  });

  it('the plan saves and reloads with the binding', async () => {
    const { el } = await open();
    await pick(el, 's');
    await choose(el, 'control', 'switch.plug');
    await pressSave(el);
    expect(stored()[0].levels[0].devices.find(d => d.id === 's')!.bindings).toEqual({ control: 'switch.plug' });
    document.body.innerHTML = '';
    const again = await mount(haHass().hass);
    expect(device(again, 's').bindings).toEqual({ control: 'switch.plug' });
  });

  it('an entity absent from states and registry: red dot in the list and the missing note under the field', async () => {
    const { el } = await open();
    expect(dot(el, 'g')).toContain('missing');
    await pick(el, 'g');
    expect($(el, '.props [data-role="control"] [data-note="missing"]').textContent!.trim())
      .toBe('This entity is not in Home Assistant any more. Pick another one or clear the field.');
    expect(combo(el, 'control').value).toBe('light.gone');
  });

  it('an unavailable entity is noted but still bound; a shared entity names the other devices', async () => {
    const { el } = await open();
    await pick(el, 'u');
    expect(dot(el, 'u')).toContain('bound');
    expect($(el, '.props [data-note="unavailable"]').textContent!.trim()).toBe('Unavailable in Home Assistant');
    expect(el.shadowRoot!.querySelector('.props [data-note="missing"]')).toBeNull();
    await pick(el, 'k');
    expect($(el, '.props [data-note="also"]').textContent!.trim()).toBe('Also bound to: Desk light');
    expect(el.shadowRoot!.querySelector('.props [data-note="unavailable"]')).toBeNull();
  });

  it('the HA device picker fills the empty climate roles in one undoable commit', async () => {
    const { el } = await open();
    await pick(el, 'c');
    const sel = $<HTMLSelectElement>(el, '.props select[data-field="ha-device"]');
    expect([...sel.options].map(o => o.value)).toEqual(['', 'th2', 'th1']);
    expect([...sel.options].map(o => o.textContent!.trim()).slice(1)).toEqual(['Twin sensor', 'WC sensor']);
    await haDevice(el, 'th1');
    expect(device(el, 'c').bindings).toEqual({ temperature: 'sensor.t_wc', humidity: 'sensor.h_wc' });
    expect($(el, '.props [data-notice="fill"]').textContent!.trim()).toBe('Filled: Temperature, Humidity');
    expect($<HTMLSelectElement>(el, '.props select[data-field="ha-device"]').value).toBe('');
    await undo(el);
    expect(device(el, 'c').bindings).toBeUndefined();
  });

  it('the HA device picker leaves ambiguous roles empty and says how many matched', async () => {
    const { el } = await open();
    await pick(el, 'c');
    await haDevice(el, 'th2');
    expect(device(el, 'c').bindings).toEqual({ humidity: 'sensor.h_b' });
    expect($(el, '.props [data-notice="fill"]').textContent!.trim()).toBe('Filled: Humidity; several matches for: Temperature (2)');
    // Filled roles are never overwritten.
    await haDevice(el, 'th1');
    expect(device(el, 'c').bindings).toEqual({ humidity: 'sensor.h_b', temperature: 'sensor.t_wc' });
    expect($(el, '.props [data-notice="fill"]').textContent!.trim()).toBe('Filled: Temperature');
    await haDevice(el, 'th2');
    expect($(el, '.props [data-notice="fill"]').textContent!.trim()).toBe('Nothing to fill: no empty role matches an entity of this device.');
    expect(el.history!.canUndo).toBe(true);
  });

  it('Next unbound device in the properties panel moves the selection; the footer counts not-bound devices', async () => {
    const { el } = await open();
    expect($(el, '.props').textContent).toContain('Pick a device on the plan or in the list, or press Next unbound device.');
    await press(el, '.props [data-action="next-unbound"]');
    expect(el.selection).toEqual({ kind: 'device', id: 'g' });
    expect($(el, '.props .bfoot').textContent).toContain('3 not bound');
    await press(el, '.props [data-action="next-unbound"]');
    expect(el.selection).toEqual({ kind: 'device', id: 's' });
  });

  it('Delete and Backspace in the binding step keep the selected device', async () => {
    const { el } = await open();
    await pick(el, 's');
    key(el, 'keydown', 'Delete');
    key(el, 'keydown', 'Backspace');
    await el.updateComplete;
    expect(el.history!.current.devices).toHaveLength(6);
    expect(el.history!.canUndo).toBe(false);
    expect(el.selection).toEqual({ kind: 'device', id: 's' });
  });

  it('the status bar shows only the Esc hint in the binding step, with the grid and cones toggles', async () => {
    const { el } = await open();
    const text = () => $(el, '.status').textContent!.replace(/\s+/g, ' ');
    expect(text()).not.toContain('Shift');
    expect(text()).not.toContain('Tab');
    expect(text()).not.toContain('digits');
    expect(text()).toContain('Esc clear selection');
    expect(el.shadowRoot!.querySelector('.status input[data-toggle="cones"]')).not.toBeNull();
    expect(text()).toContain('Grid 100 mm');
    await press(el, '[data-mode="plan"]');
    expect(text()).toContain('Shift');
    expect(text()).toContain('Esc finish');
  });

  it('the device list rail collapses to a strip and stays collapsed for the session', async () => {
    const { el } = await open();
    const toggle = () => $<HTMLButtonElement>(el, '.blist [data-action="toggle-rail"]');
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    await press(el, '.blist [data-action="toggle-rail"]');
    expect($(el, '.ed').classList.contains('rail-off')).toBe(true);
    expect(el.shadowRoot!.querySelector('.blist .brow')).toBeNull();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    await press(el, '[data-mode="equipment"]');
    expect($(el, '.ed').classList.contains('rail-off')).toBe(false);
    await press(el, '[data-mode="binding"]');
    expect($(el, '.ed').classList.contains('rail-off')).toBe(true);
    await press(el, '.blist [data-action="toggle-rail"]');
    expect($(el, '.ed').classList.contains('rail-off')).toBe(false);
    expect(el.shadowRoot!.querySelector('.blist .brow')).not.toBeNull();
  });
});
