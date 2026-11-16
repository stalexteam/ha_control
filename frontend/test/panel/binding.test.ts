// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import type { HassLike } from '../../src/api';
import { candidates } from '../../src/binding/candidates';
import { loadRegistries, mergeMeta, metaFromStates } from '../../src/binding/ha-meta';
import { ROLE_SPECS } from '../../src/model/bindings';
import { defaultsMode, deviceDefaults, type Device, type DeviceKind, type DevicePlacement, type Level } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { rectRoomLevel } from '../fixtures';
import {
  $, choose, combo, device, mount, pick, press, pressSave, redo, registryHass, stored, undo, type Fail,
} from './helpers';

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
    { id: 'th2', name: 'Twin sensor', model: 'TH-200' },
    { id: 'lamp1', name: 'Desk lamp' },
  ],
  'config/area_registry/list': [{ area_id: 'wc', name: 'WC' }],
};

/** Mock hass with the live states above; the registry commands are counted and answered, or rejected while `fail.on`. */
const haHass = (fail: Fail = { on: false }): { hass: HassLike; calls: string[] } => registryHass(STATES, REGISTRY, fail);

const free = (x: number, y: number): DevicePlacement => ({ mode: 'free', x, y, rotation: 0 });
const dev = (id: string, name: string, kind: DeviceKind, placement: DevicePlacement, bindings?: Device['bindings']): Device =>
  ({ id, name, invalid: false, placement, props: deviceDefaults(kind, defaultsMode(placement.mode)), bindings });

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

const notice = (el: PlanStudioPanel) => el.shadowRoot!.querySelector('[data-notice="registry"]');
const dot = (el: PlanStudioPanel, id: string) => [...$(el, `.blist .brow[data-id="${id}"] .dot`).classList];

/** Opens the stored plan with the HA mock and enters the Binding step; resolves once the registry load settled. */
async function open(fail: Fail = { on: false }): Promise<{ el: PlanStudioPanel; calls: string[] }> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    plans: { P1: { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level()] } },
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
    const fail: Fail = { on: true };
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
    let release!: () => void;
    fail.gate = new Promise<void>(r => { release = r; });
    await press(el, '[data-action="retry-registry"]');
    const retry = $<HTMLButtonElement>(el, '[data-action="retry-registry"]');
    expect(retry.disabled).toBe(true);
    expect(retry.textContent!.trim()).toBe('Loading…');
    expect(calls).toHaveLength(6);
    release();
    await vi.waitFor(() => expect(notice(el)).toBeNull());
    await press(el, '.blist [data-filter="all"]');
    expect(dot(el, 'g')).toContain('missing');
  });

  it('a session error notice shows as a warning in the Binding step with nothing selected', async () => {
    const { el } = await open();
    expect(el.selection).toBeNull();
    el.notice = 'Plan not found';
    await el.updateComplete;
    const n = $(el, '.props [data-notice="session"]');
    expect(n.textContent!.trim()).toBe('Plan not found');
    expect(n.classList.contains('warn')).toBe(true);
    await pick(el, 'c');
    expect($(el, '.props [data-notice="session"]').textContent!.trim()).toBe('Plan not found');
    expect(el.notice).toBe('Plan not found');
  });

  it('Reload from Home Assistant loads the registries again, guarded while loading, with the same error notice', async () => {
    const fail: Fail = { on: false };
    const { el, calls } = await open(fail);
    expect(notice(el)).toBeNull();
    const reload = () => $<HTMLButtonElement>(el, '.props [data-action="reload-registries"]');
    expect(reload().textContent!.trim()).toBe('Reload from Home Assistant');
    let release!: () => void;
    fail.gate = new Promise<void>(r => { release = r; });
    await press(el, '.props [data-action="reload-registries"]');
    expect(calls).toHaveLength(6);
    expect(reload().disabled).toBe(true);
    reload().click();
    await el.updateComplete;
    expect(calls).toHaveLength(6);
    fail.on = true;
    release();
    await vi.waitFor(() => expect(notice(el)).not.toBeNull());
    expect(notice(el)!.textContent).toContain("Couldn't load the Home Assistant registries: Unauthorized");
    expect(reload().disabled).toBe(false);
    // Entering the step again still does not load by itself.
    await press(el, '[data-mode="equipment"]');
    await press(el, '[data-mode="binding"]');
    expect(calls).toHaveLength(6);
    fail.on = false; fail.gate = undefined;
    await press(el, '.props [data-action="reload-registries"]');
    await vi.waitFor(() => expect(notice(el)).toBeNull());
    expect(calls).toHaveLength(9);
  });

  it('a socket shows its name, kind, and the Control and Power fields', async () => {
    const { el } = await open();
    await pick(el, 's');
    expect($<HTMLInputElement>(el, '.props input[data-field="name"]').value).toBe('Hall socket');
    expect($(el, '.props h4').textContent!.trim()).toBe('Socket');
    const roles = [...el.shadowRoot!.querySelectorAll('.props .role')];
    expect(roles.map(r => r.querySelector('.role-label')!.textContent!.trim())).toEqual(['Control', 'Power']);
    expect(roles.map(r => r.getAttribute('data-role'))).toEqual(['control', 'power']);
    expect(combo(el, 'control').label).toBe('Control');
  });

  it('the name field renames the device: trimmed, shown in the list, undoable; a blank name reverts', async () => {
    const { el } = await open();
    await pick(el, 's');
    const field = () => $<HTMLInputElement>(el, '.props input[data-field="name"]');
    const change = async (v: string) => {
      field().value = v;
      field().dispatchEvent(new Event('change', { bubbles: true }));
      await el.updateComplete;
    };
    expect(field().value).toBe('Hall socket');
    await change('  Desk socket ');
    expect(device(el, 's').name).toBe('Desk socket');
    expect($(el, '.blist .brow[data-id="s"]').textContent).toContain('Desk socket');
    expect(el.save.dirty).toBe(true);
    await change('   ');
    expect(device(el, 's').name).toBe('Desk socket');
    expect(field().value).toBe('Desk socket');
    await undo(el);
    expect(device(el, 's').name).toBe('Hall socket');
    expect(field().value).toBe('Hall socket');
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

  it('Undo and Redo in the binding step keep the selected device and its properties', async () => {
    const { el } = await open();
    await pick(el, 's');
    await choose(el, 'control', 'switch.plug');
    await undo(el);
    expect(el.selection).toEqual({ kind: 'device', id: 's' });
    expect($<HTMLInputElement>(el, '.props input[data-field="name"]').value).toBe('Hall socket');
    expect(combo(el, 'control').value).toBeNull();
    await redo(el);
    expect(device(el, 's').bindings).toEqual({ control: 'switch.plug' });
    expect(el.selection).toEqual({ kind: 'device', id: 's' });
    expect(combo(el, 'control').value).toBe('switch.plug');
  });

  it('a state flipping to unavailable shows the note without rebuilding the candidate lists', async () => {
    const { el } = await open();
    await pick(el, 'd');
    const items = combo(el, 'control').items;
    expect(el.shadowRoot!.querySelector('.props [data-note="unavailable"]')).toBeNull();
    el.hass = { ...el.hass!, states: { ...STATES, 'light.desk': st('unavailable', { friendly_name: 'Desk lamp' }) } };
    await el.updateComplete;
    expect($(el, '.props [data-note="unavailable"]').textContent!.trim()).toBe('Unavailable in Home Assistant');
    expect(combo(el, 'control').items).toBe(items);
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

  it('Next unbound device in the properties panel moves the selection; the footer counts not-bound devices', async () => {
    const { el } = await open();
    expect($(el, '.props').textContent).toContain('Pick a device on the plan or in the list, or press Next unbound device.');
    await press(el, '.props [data-action="next-unbound"]');
    expect(el.selection).toEqual({ kind: 'device', id: 'g' });
    expect($(el, '.props .bfoot').textContent).toContain('3 not bound');
    await press(el, '.props [data-action="next-unbound"]');
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
    await press(el, '.tools button[data-tool="wall"]'); // the drawing hints belong to the Wall tool
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

describe('dev harness mock', () => {
  it('demo mode answers the registries and has states: every device kind has an HA device and candidates', async () => {
    const hass = createMockHass({ demo: true });
    const meta = mergeMeta(metaFromStates(hass.states), await loadRegistries(hass));
    for (const kind of Object.keys(ROLE_SPECS) as DeviceKind[]) {
      for (const spec of ROLE_SPECS[kind]) expect(candidates(meta, spec, false).length, `${kind}.${spec.role}`).toBeGreaterThan(0);
    }
  });

  it('without demo the registry commands are rejected, so tests do not depend on the sample', async () => {
    await expect(loadRegistries(createMockHass())).rejects.toMatchObject({ code: 'unknown_command' });
  });
});
