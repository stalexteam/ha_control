// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import type { HassLike } from '../../src/api';
import { deviceDefaults, type Device, type DeviceKind, type DeviceProps, type Level, type Trigger } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { rectRoomLevel } from '../fixtures';
import { $, click, combo, device, mount, pick, redo, registryHass, undo } from './helpers';

const st = (state: string, attributes: Record<string, string> = {}) => ({ state, attributes });

/** A Zigbee2MQTT action sensor (plain, diagnostic), a relay and a lamp. */
const STATES: Record<string, unknown> = {
  'sensor.wc_action': st('', { friendly_name: 'WC switch action' }),
  'switch.hall': st('on', { friendly_name: 'Hall relay' }),
  'light.wc': st('off', { friendly_name: 'WC light' }),
};

const REGISTRY: Record<string, unknown> = {
  'config/entity_registry/list': [
    { entity_id: 'sensor.wc_action', device_id: 'sw1', entity_category: 'diagnostic' },
    { entity_id: 'switch.hall', device_id: 'relay1' },
    { entity_id: 'light.wc', device_id: 'lamp1' },
  ],
  'config/device_registry/list': [
    { id: 'sw1', name: 'WC switch' },
    { id: 'relay1', name: 'Hall relay' },
    { id: 'lamp1', name: 'WC light' },
  ],
  'config/area_registry/list': [],
};

const onWall = (offset: number) => ({ mode: 'wall' as const, wallId: 'w0', side: 'right' as const, offset });
const dev = (id: string, name: string, kind: DeviceKind, offset: number, patch: Partial<DeviceProps> = {},
  bindings?: Device['bindings']): Device =>
  ({ id, name, invalid: false, placement: onWall(offset), props: { ...deviceDefaults(kind, 'wall'), ...patch } as DeviceProps, bindings });
const trig = (slot: number, event: string): Trigger => ({ slot, event });

/**
 * Hall switch: a wall switch. WC button: a smart button in toggle mode bound to the WC action sensor (slot 0).
 * WC light key / WC vent key: two smart buttons on the same action sensor, slots 1 and 2.
 */
function level(): Level {
  return {
    ...rectRoomLevel(6000, 4000, 200),
    devices: [
      dev('w', 'Hall switch', 'wall_switch', 500),
      dev('b', 'WC button', 'smart_button', 1500, {}, { on: 'sensor.wc_action' }),
      dev('k1', 'WC light key', 'smart_button', 2500, { on: trig(1, 'single') }, { on: 'sensor.wc_action' }),
      dev('k2', 'WC vent key', 'smart_button', 3500, { on: trig(2, 'single') }, { on: 'sensor.wc_action' }),
    ],
  };
}

/** Opens the plan above (or `lv`) with the HA mock and enters the Binding step; resolves once the registries are loaded. */
async function open(hass: HassLike = registryHass(STATES, REGISTRY).hass, lv: unknown = level()): Promise<PlanStudioPanel> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    plans: { P1: { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [lv] } },
  }));
  const el = await mount(hass);
  $<HTMLButtonElement>(el, '[data-mode="binding"]').click();
  await vi.waitFor(() => expect(el.haMeta.get().registryLoaded).toBe(true));
  await el.updateComplete;
  return el;
}

const q = <T extends Element>(el: PlanStudioPanel, sel: string): T | null => el.shadowRoot!.querySelector<T>(sel);
const input = (el: PlanStudioPanel, field: string) => $<HTMLInputElement>(el, `.props input[data-field="${field}"]`);
const roles = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.props .role')].map(r => r.getAttribute('data-role'));
const label = (el: PlanStudioPanel, role: string) => $(el, `.props .role[data-role="${role}"] .role-label`).textContent!.trim();
const props = (el: PlanStudioPanel, id: string) => device(el, id).props as Record<string, unknown>;

/** Types `v` into a text field and commits it (change). */
async function type(el: PlanStudioPanel, field: string, v: string): Promise<void> {
  const f = input(el, field);
  f.value = v;
  f.dispatchEvent(new Event('change', { bubbles: true }));
  await el.updateComplete;
}

/** Picks an option of a role's Button (slot) select. */
async function chooseSlot(el: PlanStudioPanel, role: string, v: string): Promise<void> {
  const f = $<HTMLSelectElement>(el, `.props select[data-field="${role}-slot"]`);
  f.value = v;
  f.dispatchEvent(new Event('change', { bubbles: true }));
  await el.updateComplete;
}

const OTHER = '__other';
const evSelect = (el: PlanStudioPanel, role: string) => $<HTMLSelectElement>(el, `.props select[data-field="${role}-event"]`);
/** The option marked selected in the markup (happy-dom reports a wrong `value` for a freshly rendered select). */
const markedEvent = (el: PlanStudioPanel, role: string) => evSelect(el, role).querySelector('option[selected]')!.getAttribute('value');
const customInput = (el: PlanStudioPanel, role: string) => input(el, `${role}-event-custom`);

function evOptions(el: PlanStudioPanel, role: string): { v: string[]; labels: string[] } {
  const opts = [...evSelect(el, role).options];
  return { v: opts.map(o => o.value), labels: opts.map(o => o.textContent!.trim()) };
}

/** Picks an option of a role's event select. */
async function chooseEvent(el: PlanStudioPanel, role: string, v: string): Promise<void> {
  const f = evSelect(el, role);
  f.value = v;
  f.dispatchEvent(new Event('change', { bubbles: true }));
  await el.updateComplete;
}

async function toggle(el: PlanStudioPanel, field: string): Promise<void> {
  input(el, field).click();
  await el.updateComplete;
}

describe('binding step: container sections', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('wall switch shows State, the auto checkbox, and the window only when checked', async () => {
    const el = await open();
    await pick(el, 'w');
    expect(roles(el)).toEqual(['state']);
    expect(label(el, 'state')).toBe('State');
    const auto = input(el, 'autoByDoubleToggle');
    expect(auto.type).toBe('checkbox');
    expect(auto.checked).toBe(false);
    expect(auto.closest('label')!.textContent).toContain('Auto by double toggle');
    expect(q(el, '.props input[data-field="windowSec"]')).toBeNull();
    expect(q(el, '.props [data-field="defaultOutput"]')).toBeNull();

    await toggle(el, 'autoByDoubleToggle');
    expect(props(el, 'w').autoByDoubleToggle).toBe(true);
    expect(input(el, 'windowSec').value).toBe('3');
    expect(input(el, 'windowSec').closest('label')!.textContent).toContain('Window, s');

    for (const bad of ['0', '11', '2.5', 'x']) {
      await type(el, 'windowSec', bad);
      expect(props(el, 'w').windowSec).toBe(3);
      expect(input(el, 'windowSec').value).toBe('3');
      expect(el.fieldNotice).toBe('Window is a whole number of seconds from 1 to 10.');
      expect($(el, '.props [role="alert"]').textContent!.trim()).toBe('Window is a whole number of seconds from 1 to 10.');
    }
    await type(el, 'windowSec', '5');
    expect(props(el, 'w').windowSec).toBe(5);
    expect(el.fieldNotice).toBeNull();

    // One undo step per action.
    await undo(el);
    expect(props(el, 'w')).toMatchObject({ autoByDoubleToggle: true, windowSec: 3 });
    await undo(el);
    expect(props(el, 'w').autoByDoubleToggle).toBe(false);
    expect(q(el, '.props input[data-field="windowSec"]')).toBeNull();
    expect(input(el, 'autoByDoubleToggle').checked).toBe(false);
  });

  it('smart button in toggle mode shows one On / Off section with slot and event', async () => {
    const el = await open();
    await pick(el, 'b');
    expect(roles(el)).toEqual(['on']);
    expect(label(el, 'on')).toBe('On / Off');
    expect(combo(el, 'on').label).toBe('On / Off');
    expect(input(el, 'separateOff').checked).toBe(false);
    expect(input(el, 'autoEnabled').checked).toBe(false);

    const slot = () => $<HTMLSelectElement>(el, '.props select[data-field="on-slot"]');
    expect(q(el, '.props input[data-field="on-slot"]')).toBeNull();
    expect(slot().closest('label')!.textContent).toContain('Button');
    expect([...slot().options].map(o => [o.value, o.textContent!.trim()])).toEqual([
      ['0', '— (single button)'], ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => [String(n), String(n)]),
    ]);
    expect(slot().value).toBe('0');
    await chooseSlot(el, 'on', '2');
    expect(props(el, 'b').on).toEqual({ slot: 2, event: 'single' });
    expect(slot().value).toBe('2');
    await chooseSlot(el, 'on', '0');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single' });
    expect(slot().value).toBe('0');
    // One undo step per choice.
    await chooseSlot(el, 'on', '2');
    await undo(el);
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single' });
    expect(slot().value).toBe('0');

    expect(evSelect(el, 'on').closest('label')!.textContent).toContain('Event');
    expect(evSelect(el, 'on').value).toBe('single');
    expect(customInput(el, 'on').hidden).toBe(true);
    expect(evOptions(el, 'on')).toEqual({ v: ['single', 'double', 'hold', OTHER], labels: ['single', 'double', 'hold', 'Other…'] });
    expect(q(el, '.props datalist')).toBeNull();
  });

  it('choosing a standard event stores it in one undo step', async () => {
    const el = await open();
    await pick(el, 'b');
    await chooseEvent(el, 'on', 'hold');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'hold' });
    expect(customInput(el, 'on').hidden).toBe(true);
    await undo(el);
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single' });
    expect(evSelect(el, 'on').value).toBe('single');
  });

  it('Other… reveals a text input without changing the event; a value commits, blank reverts with the notice', async () => {
    const el = await open();
    await pick(el, 'b');
    await chooseEvent(el, 'on', OTHER);
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single' });
    expect(evSelect(el, 'on').value).toBe(OTHER);
    expect(customInput(el, 'on').hidden).toBe(false);
    expect(customInput(el, 'on').value).toBe('');
    await type(el, 'on-event-custom', '   ');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single' });
    expect(el.fieldNotice).toBe('Event cannot be empty.');
    await type(el, 'on-event-custom', ' single_left ');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single_left' });
    expect(el.fieldNotice).toBeNull();
    expect(evSelect(el, 'on').value).toBe(OTHER);
    expect(customInput(el, 'on').value).toBe('single_left');
    await type(el, 'on-event-custom', '');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single_left' });
    expect(customInput(el, 'on').value).toBe('single_left');
    expect(el.fieldNotice).toBe('Event cannot be empty.');
  });

  it('a stored custom event shows Other… with its text; a standard option hides the input again', async () => {
    const el = await open();
    await pick(el, 'b');
    await chooseEvent(el, 'on', OTHER);
    await type(el, 'on-event-custom', 'single_left');
    expect(evSelect(el, 'on').value).toBe(OTHER);
    await pick(el, 'k1');
    await pick(el, 'b');
    expect(evSelect(el, 'on').value).toBe(OTHER);
    expect(customInput(el, 'on').hidden).toBe(false);
    expect(customInput(el, 'on').value).toBe('single_left');
    await chooseEvent(el, 'on', 'double');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'double' });
    expect(evSelect(el, 'on').value).toBe('double');
    expect(customInput(el, 'on').hidden).toBe(true);
  });

  it('Other… then back to the stored standard event hides the input without a commit', async () => {
    const el = await open();
    await pick(el, 'b');
    await chooseEvent(el, 'on', OTHER);
    await chooseEvent(el, 'on', 'single');
    expect(customInput(el, 'on').hidden).toBe(true);
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single' });
  });

  it('typing hold into Other… switches the select to hold and hides the input', async () => {
    const el = await open();
    await pick(el, 'b');
    await chooseEvent(el, 'on', OTHER);
    await type(el, 'on-event-custom', 'hold');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'hold' });
    expect(evSelect(el, 'on').value).toBe('hold');
    expect(markedEvent(el, 'on')).toBe('hold');
    expect(customInput(el, 'on').hidden).toBe(true);
    // Typing the event already stored (nothing to commit) does the same.
    await chooseEvent(el, 'on', OTHER);
    expect(customInput(el, 'on').hidden).toBe(false);
    await type(el, 'on-event-custom', ' hold ');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'hold' });
    expect(evSelect(el, 'on').value).toBe('hold');
    expect(customInput(el, 'on').hidden).toBe(true);
    // Nothing lingers: another device and back shows hold in the select.
    await pick(el, 'k1');
    await pick(el, 'b');
    expect(markedEvent(el, 'on')).toBe('hold');
    expect(customInput(el, 'on').hidden).toBe(true);
    // One undo step.
    await undo(el);
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single' });
    expect(evSelect(el, 'on').value).toBe('single');
  });

  it('a field notice disappears when another device is picked; a session error stays', async () => {
    const el = await open();
    await pick(el, 'b');
    await chooseEvent(el, 'on', OTHER);
    await type(el, 'on-event-custom', '   ');
    const msg = 'Event cannot be empty.';
    expect(el.fieldNotice).toBe(msg);
    expect($(el, '.props [data-notice="field"]').textContent!.trim()).toBe(msg);
    expect($(el, '.props [role="alert"]').textContent!.trim()).toBe(msg);
    // A session error (a failed plan switch) meanwhile.
    await el.session.switchPlan('missing');
    await el.updateComplete;
    expect(el.notice).toBe('Plan not found');

    await pick(el, 'k1');
    expect(el.fieldNotice).toBeNull();
    expect(q(el, '.props [data-notice="field"]')).toBeNull();
    expect(el.notice).toBe('Plan not found');
    expect($(el, '.props [data-notice="session"]').textContent!.trim()).toBe('Plan not found');

    // A click on the plan picks a device the same way.
    await pick(el, 'w');
    await toggle(el, 'autoByDoubleToggle');
    await type(el, 'windowSec', '0');
    expect(el.fieldNotice).toBe('Window is a whole number of seconds from 1 to 10.');
    click(el, 1500, 100); // the WC button on the inner face of the top wall
    await el.updateComplete;
    expect(el.selection).toEqual({ kind: 'device', id: 'b' });
    expect(el.fieldNotice).toBeNull();
    expect(q(el, '.props [data-notice="field"]')).toBeNull();
    expect(el.notice).toBe('Plan not found');
  });

  it('Separate Off adds the Off section prefilled with the On entity; unchecking drops the off binding; undo restores it', async () => {
    const el = await open();
    await pick(el, 'b');
    await toggle(el, 'separateOff');
    expect(props(el, 'b').separateOff).toBe(true);
    expect(device(el, 'b').bindings).toEqual({ on: 'sensor.wc_action', off: 'sensor.wc_action' });
    expect(roles(el)).toEqual(['on', 'off']);
    expect(label(el, 'on')).toBe('On');
    expect(label(el, 'off')).toBe('Off');
    expect(combo(el, 'off').value).toBe('sensor.wc_action');
    expect($<HTMLSelectElement>(el, '.props select[data-field="off-slot"]').value).toBe('0');
    expect(markedEvent(el, 'off')).toBe('hold');
    // Turning it on is one step.
    await undo(el);
    expect(props(el, 'b').separateOff).toBe(false);
    expect(device(el, 'b').bindings).toEqual({ on: 'sensor.wc_action' });
    await redo(el);
    expect(device(el, 'b').bindings).toEqual({ on: 'sensor.wc_action', off: 'sensor.wc_action' });

    await toggle(el, 'separateOff');
    expect(props(el, 'b').separateOff).toBe(false);
    expect(device(el, 'b').bindings).toEqual({ on: 'sensor.wc_action' });
    expect(roles(el)).toEqual(['on']);
    expect(label(el, 'on')).toBe('On / Off');
    await undo(el);
    expect(props(el, 'b').separateOff).toBe(true);
    expect(device(el, 'b').bindings).toEqual({ on: 'sensor.wc_action', off: 'sensor.wc_action' });
    expect(input(el, 'separateOff').checked).toBe(true);
    expect(roles(el)).toEqual(['on', 'off']);
  });

  it('Auto starts the Auto entity as the On entity, in one step; with no On entity it stays empty', async () => {
    const el = await open();
    await pick(el, 'b');
    await toggle(el, 'autoEnabled');
    expect(props(el, 'b').autoEnabled).toBe(true);
    expect(device(el, 'b').bindings).toEqual({ on: 'sensor.wc_action', auto: 'sensor.wc_action' });
    expect(combo(el, 'auto').value).toBe('sensor.wc_action');
    await undo(el);
    expect(props(el, 'b').autoEnabled).toBe(false);
    expect(device(el, 'b').bindings).toEqual({ on: 'sensor.wc_action' });
    await redo(el);
    expect(device(el, 'b').bindings).toEqual({ on: 'sensor.wc_action', auto: 'sensor.wc_action' });

    // Unbound On: nothing to copy.
    await toggle(el, 'autoEnabled');
    combo(el, 'on').dispatchEvent(new CustomEvent('value-changed', { detail: { value: null } }));
    await el.updateComplete;
    expect(device(el, 'b').bindings).toBeUndefined();
    await toggle(el, 'autoEnabled');
    expect(props(el, 'b').autoEnabled).toBe(true);
    expect(device(el, 'b').bindings).toBeUndefined();
  });

  it('Auto adds the Auto section; there is no Final state or default output', async () => {
    const el = await open();
    await pick(el, 'b');
    await toggle(el, 'autoEnabled');
    expect(props(el, 'b').autoEnabled).toBe(true);
    expect(roles(el)).toEqual(['on', 'auto']);
    expect(['on', 'auto'].map(r => label(el, r))).toEqual(['On / Off', 'Auto']);
    expect($<HTMLSelectElement>(el, '.props select[data-field="auto-slot"]').value).toBe('0');
    expect(markedEvent(el, 'auto')).toBe('double');
    expect(q(el, '.props [data-field="defaultOutput"]')).toBeNull();

    await toggle(el, 'separateOff');
    expect(roles(el)).toEqual(['on', 'off', 'auto']);
    await toggle(el, 'separateOff');
    expect(roles(el)).toEqual(['on', 'auto']);

    await toggle(el, 'autoEnabled');
    expect(props(el, 'b')).toMatchObject({ autoEnabled: false, auto: { slot: 0, event: 'double' } });
    expect(roles(el)).toEqual(['on']);
  });

  it('no Final state field and no Default output select, also for a v0.4 plan that stored them', async () => {
    const v04 = level();
    // The v0.4 fields are not in today's types: the stored JSON carries them anyway.
    const withOld = (d: Device, role: 'state' | 'on', eid: string): Device => ({
      ...d, props: { ...d.props, defaultOutput: 'on' } as unknown as DeviceProps,
      bindings: { ...d.bindings, [role]: eid, final: 'light.wc' } as Device['bindings'],
    });
    v04.devices = [withOld(v04.devices[0], 'state', 'switch.hall'), withOld(v04.devices[1], 'on', 'sensor.wc_action'), ...v04.devices.slice(2)];
    const el = await open(undefined, v04);
    for (const id of ['w', 'b']) {
      await pick(el, id);
      expect(roles(el)).not.toContain('final');
      expect(q(el, '.props [data-role="final"]')).toBeNull();
      expect(q(el, '.props [data-field="defaultOutput"]')).toBeNull();
      expect(q(el, '.props select[data-field="defaultOutput"]')).toBeNull();
      expect($(el, '.props').textContent).not.toMatch(/Final state|Default output/);
    }
    expect('defaultOutput' in props(el, 'w')).toBe(false);
    expect('defaultOutput' in props(el, 'b')).toBe(false);
  });

  it('sections follow the spec order: each checkbox after the section above it and before the section it reveals', async () => {
    const el = await open();
    /** Role sections, container fields and the duplicate warning in document order. */
    const order = () => [...el.shadowRoot!.querySelectorAll(
      '.props .role, .props [data-field="autoByDoubleToggle"], .props [data-field="windowSec"], .props [data-field="separateOff"], '
      + '.props [data-field="autoEnabled"], .props [data-note="duplicate"]',
    )].map(n => (n.classList.contains('role') ? `role:${n.getAttribute('data-role')}`
      : n.getAttribute('data-field') ?? `note:${n.getAttribute('data-note')}`));

    await pick(el, 'w');
    expect(order()).toEqual(['role:state', 'autoByDoubleToggle']);
    await toggle(el, 'autoByDoubleToggle');
    expect(order()).toEqual(['role:state', 'autoByDoubleToggle', 'windowSec']);

    await pick(el, 'b');
    expect(order()).toEqual(['role:on', 'separateOff', 'autoEnabled']);
    await toggle(el, 'separateOff');
    expect(order()).toEqual(['role:on', 'separateOff', 'role:off', 'autoEnabled']);
    await toggle(el, 'autoEnabled');
    expect(order()).toEqual(['role:on', 'separateOff', 'role:off', 'autoEnabled', 'role:auto']);
    await chooseEvent(el, 'off', 'single');
    expect(order()).toEqual(['role:on', 'separateOff', 'role:off', 'autoEnabled', 'role:auto', 'note:duplicate']);
    await toggle(el, 'separateOff');
    expect(order()).toEqual(['role:on', 'separateOff', 'autoEnabled', 'role:auto']);
  });

  it('two buttons of one switch on different slots show no also-bound note; the same trigger shows it', async () => {
    const el = await open();
    await pick(el, 'k2');
    expect(q(el, '.props [data-note="also"]')).toBeNull();
    await chooseSlot(el, 'on', '1');
    expect($(el, '.props [data-role="on"] [data-note="also"]').textContent!.trim()).toBe('Also bound to: WC light key');
    await chooseEvent(el, 'on', 'double');
    expect(q(el, '.props [data-note="also"]')).toBeNull();
  });

  it('identical triggers in one container show the duplicate warning', async () => {
    const el = await open();
    await pick(el, 'b');
    await toggle(el, 'separateOff');
    expect(q(el, '.props [data-note="duplicate"]')).toBeNull();
    await chooseEvent(el, 'off', 'single');
    expect($(el, '.props [data-note="duplicate"]').textContent!.trim())
      .toBe('Two triggers of this device are identical; the first one (On, Off, Auto) wins.');
    await chooseSlot(el, 'off', '1');
    expect(q(el, '.props [data-note="duplicate"]')).toBeNull();
  });

  it('renders no settings block (no stray divider) unless the duplicate warning shows', async () => {
    const el = await open();
    await pick(el, 'w');
    expect(q(el, '.props .cfields')).toBeNull();
    await pick(el, 'b');
    expect(q(el, '.props .cfields')).toBeNull();
    await toggle(el, 'separateOff');
    await chooseEvent(el, 'off', 'single');
    expect(q(el, '.props .cfields [data-note="duplicate"]')).not.toBeNull();
  });
});

type Sub = { msg: Record<string, unknown>; push(ev: unknown): void; unsub: ReturnType<typeof vi.fn> };

/**
 * The registry mock plus a containers subscription the test drives; with `reject` every subscription fails with it.
 * `fire` emits HA's connection events.
 */
function liveHass(reject?: unknown): { hass: HassLike; subs: Sub[]; fire(type: 'ready' | 'disconnected'): void } {
  const { hass } = registryHass(STATES, REGISTRY);
  const subs: Sub[] = [];
  const listeners = new Map<string, Set<() => void>>();
  const connection: HassLike['connection'] = {
    ...hass.connection,
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>) {
      // Nor are the entity feed and the rule traces (mode bubbles) of the Binding step.
      if (msg.type === 'subscribe_entities' || msg.type === 'plan_studio/rules/subscribe') return Promise.resolve(() => Promise.resolve());
      const unsub = vi.fn(() => Promise.resolve());
      subs.push({ msg, push: ev => cb(ev as T), unsub });
      return reject === undefined ? Promise.resolve(unsub) : Promise.reject(reject);
    },
    addEventListener(type, cb) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(cb);
    },
    removeEventListener(type, cb) { listeners.get(type)?.delete(cb); },
  };
  return { hass: { ...hass, connection }, subs, fire: type => { [...listeners.get(type) ?? []].forEach(cb => cb()); } };
}

describe('binding step: output line', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  const line = (el: PlanStudioPanel) => $(el, '.props [data-field="output"]').textContent!.trim();
  const coloured = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('svg.plan g.device')]
    .filter(g => /device-(wall_switch|smart_button)/.test(g.getAttribute('class')!) && !g.classList.contains('no-data')).map(g => g.getAttribute('data-id'));
  /** The plan badges by device id. */
  const badges = (el: PlanStudioPanel) => Object.fromEntries([...el.shadowRoot!.querySelectorAll('svg.plan g.device')]
    .filter(g => g.querySelector('g.badge')).map(g => [g.getAttribute('data-id'), g.querySelector('g.badge')!.getAttribute('data-badge')]));

  /** Sends a containers event on a subscription and waits for the panel to re-render. */
  async function push(el: PlanStudioPanel, sub: Sub, ev: unknown): Promise<void> {
    sub.push(ev);
    await el.updateComplete;
  }

  it('the output line shows No events yet, the status error or Not saved yet; symbols are live and errors get the alert', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    expect(live.subs.map(s => s.msg)).toEqual([{ type: 'plan_studio/containers/subscribe', plan_id: 'P1' }]);
    await pick(el, 'b');
    expect(q(el, '.props [data-field="output"]')).toBeNull(); // the runtime has not answered yet
    expect(coloured(el)).toEqual([]);

    await push(el, live.subs[0], { full: true, containers: {
      b: { kind: 'smart_button', status: 'ok' },
      w: { kind: 'wall_switch', status: 'error', reason: 'not_configured' },
      k1: { kind: 'smart_button', status: 'error', reason: 'unavailable', entities: ['light.y', 'sensor.x'] },
    } });
    expect(line(el)).toBe('No events yet');
    expect(coloured(el)).toEqual(['w', 'b', 'k1']);
    expect(badges(el)).toEqual({ w: 'alert', k1: 'alert' });

    await pick(el, 'w');
    expect(line(el)).toBe('Status: error, not configured');
    await pick(el, 'k1');
    expect(line(el)).toBe('Status: error, unavailable (light.y, sensor.x)');
    await pick(el, 'k2');
    expect(line(el)).toBe('Not saved yet');

    // A change re-renders the line and the symbol at once.
    await push(el, live.subs[0], { full: false, containers: { k2: { kind: 'smart_button', status: 'ok' } } });
    expect(line(el)).toBe('No events yet');
    expect(coloured(el)).toContain('k2');
    // A full snapshot (after a plan save) drops the containers it does not list.
    await push(el, live.subs[0], { full: true, containers: { b: { kind: 'smart_button', status: 'ok' } } });
    expect(line(el)).toBe('Not saved yet');
    expect(coloured(el)).toEqual(['b']);
    expect(badges(el)).toEqual({});
    expect(live.subs).toHaveLength(1);
  });

  it('the output line shows the last event (toggle, set on, set off, auto) at its local time; an error replaces it', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    /** An ISO UTC instant whose local time is h:m:s today. */
    const local = (h: number, m: number, s: number) => new Date(2026, 10, 15, h, m, s).toISOString();
    const b = (last: Record<string, string>, more: Record<string, unknown> = {}) =>
      ({ b: { kind: 'smart_button', status: 'ok', last, ...more } });
    await push(el, live.subs[0], { full: true, containers: b({ action: 'toggle', at: local(12, 3, 15) }) });
    await pick(el, 'b');
    expect(line(el)).toBe('Last event: toggle, 12:03:15');

    await push(el, live.subs[0], { full: false, containers: b({ action: 'set', value: 'on', at: local(9, 5, 7) }) });
    expect(line(el)).toBe('Last event: set on, 09:05:07');
    await push(el, live.subs[0], { full: false, containers: b({ action: 'set', value: 'off', at: local(0, 0, 5) }) });
    expect(line(el)).toBe('Last event: set off, 00:00:05');
    await push(el, live.subs[0], { full: false, containers: b({ action: 'auto', at: local(23, 59, 59) }) });
    expect(line(el)).toBe('Last event: auto, 23:59:59');

    // While the status is error the line shows it instead of the last event.
    await push(el, live.subs[0], { full: false, containers: b({ action: 'auto', at: local(23, 59, 59) },
      { status: 'error', reason: 'unavailable', entities: ['sensor.wc_action'] }) });
    expect(line(el)).toBe('Status: error, unavailable (sensor.wc_action)');
    await push(el, live.subs[0], { full: false, containers: b({ action: 'auto', at: local(23, 59, 59) }) });
    expect(line(el)).toBe('Last event: auto, 23:59:59');
  });

  it('the output line parses the server timestamp format (microseconds, +00:00) to local HH:MM:SS', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    // The server sends dt_util.utcnow().isoformat(); build the same shape for a known local time.
    const server = new Date(2026, 10, 15, 12, 3, 15).toISOString().replace('.000Z', '.123456+00:00');
    expect(server).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.123456\+00:00$/);
    await push(el, live.subs[0], { full: true, containers: {
      b: { kind: 'smart_button', status: 'ok', last: { action: 'toggle', at: server } },
    } });
    await pick(el, 'b');
    expect(line(el)).toBe('Last event: toggle, 12:03:15');
  });

  it('a partial-frame intent shows no badge on the plan (the 3 s flash is gone)', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    await push(el, live.subs[0], { full: true, containers: { b: { kind: 'smart_button', status: 'ok' } } });
    await push(el, live.subs[0], { full: false, containers: {
      b: { kind: 'smart_button', status: 'ok', last: { action: 'set', value: 'on', at: '2026-11-15T10:00:01+00:00' } },
    } });
    expect(badges(el)).toEqual({});
  });

  it('HA restart: the outputs go neutral at the disconnect and come back after the reconnect', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    await push(el, live.subs[0], { full: true, containers: { b: { kind: 'smart_button', status: 'ok' } } });
    await pick(el, 'b');
    expect(line(el)).toBe('No events yet');
    expect(coloured(el)).toEqual(['b']);
    const noData = () => [...el.shadowRoot!.querySelectorAll('svg.plan g.device.no-data')].map(g => g.getAttribute('data-id'));
    expect(noData()).toEqual(['w', 'k1', 'k2']);

    live.fire('disconnected');
    await el.updateComplete;
    expect(coloured(el)).toEqual([]);
    expect(noData()).toEqual(['w', 'b', 'k1', 'k2']);
    expect(q(el, '.props [data-field="output"]')).toBeNull();

    live.fire('ready');
    expect(live.subs.map(s => s.msg)).toEqual([0, 1].map(() => ({ type: 'plan_studio/containers/subscribe', plan_id: 'P1' })));
    await push(el, live.subs[1], { full: true, containers: {
      b: { kind: 'smart_button', status: 'ok', last: { action: 'toggle', at: '2026-11-15T10:00:00+00:00' } },
    } });
    expect(line(el)).toMatch(/^Last event: toggle, \d\d:\d\d:\d\d$/);
    expect(coloured(el)).toEqual(['b']);
    expect(noData()).toEqual(['w', 'k1', 'k2']);
    expect(badges(el)).toEqual({}); // the reconnect snapshot does not flash
  });

  it('a saved container of another kind (an unsaved Type change) reads as not saved and stays neutral', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    await push(el, live.subs[0], { full: true, containers: {
      w: { kind: 'smart_button', status: 'error', reason: 'not_configured' },
      b: { kind: 'smart_button', status: 'ok' },
    } });
    await pick(el, 'w');
    expect(line(el)).toBe('Not saved yet');
    expect(coloured(el)).toEqual(['b']);
    expect(badges(el)).toEqual({});
    await pick(el, 'b');
    expect(line(el)).toBe('No events yet');
  });

  it('shows the feed error and keeps the plan neutral when the subscription fails', async () => {
    const live = liveHass({ code: 'unknown_command', message: 'Unknown command' });
    const el = await open(live.hass);
    await pick(el, 'b');
    expect(line(el)).toBe('Unknown command');
    expect(coloured(el)).toEqual([]);
    expect(badges(el)).toEqual({});
    // The plan is still editable.
    await toggle(el, 'autoEnabled');
    expect(props(el, 'b').autoEnabled).toBe(true);
  });

  it('a connection without subscribeMessage says live outputs are not available', async () => {
    const el = await open(); // registryHass: sendMessagePromise only
    await pick(el, 'w');
    expect(line(el)).toBe('Live state is not available.');
    expect(coloured(el)).toEqual([]);
  });

  it('switching plans re-subscribes; removing the panel unsubscribes; re-attaching subscribes again', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    await push(el, live.subs[0], { full: true, containers: { b: { kind: 'smart_button', status: 'ok' } } });
    expect(coloured(el)).toEqual(['b']);
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as { plans: Record<string, unknown> };
    data.plans.P2 = { id: 'P2', name: 'Cottage', schemaVersion: 2, revision: 1, levels: [level()] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    el.session.pickPlan('P2');
    await vi.waitFor(() => expect(el.plan!.id).toBe('P2'));
    await el.updateComplete;
    expect(live.subs.map(s => s.msg.plan_id)).toEqual(['P1', 'P2']);
    expect(live.subs[0].unsub).toHaveBeenCalledTimes(1);
    expect(coloured(el)).toEqual([]); // nothing from P1 is carried over

    el.remove();
    await vi.waitFor(() => expect(live.subs[1].unsub).toHaveBeenCalledTimes(1));
    // A detached panel may still be handed a new hass object: it must not subscribe again.
    el.hass = { ...live.hass };
    await el.updateComplete;
    expect(live.subs).toHaveLength(2);
    document.body.appendChild(el);
    await el.updateComplete;
    expect(live.subs.map(s => s.msg.plan_id)).toEqual(['P1', 'P2', 'P2']);
    expect(live.subs[2].unsub).not.toHaveBeenCalled();
  });

  it('the dev mock answers with every stored container as error, not configured', async () => {
    const devices = [
      ...level().devices,
      dev('l', 'Lamp', 'wall_light', 4500),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      plans: { P1: { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [{ ...level(), devices }] } },
    }));
    const el = await mount(createMockHass());
    await vi.waitFor(() => expect(el.feed.ready).toBe(true));
    expect(el.feed.error).toBeNull();
    const nc = (kind = 'smart_button') => ({ kind, status: 'error', reason: 'not_configured' });
    expect(['w', 'b', 'k1', 'k2', 'l'].map(id => el.feed.get(id)))
      .toEqual([nc('wall_switch'), nc(), nc(), nc(), undefined]);

    await expect(createMockHass().connection.subscribeMessage!(() => undefined, { type: 'other/subscribe' }))
      .rejects.toMatchObject({ code: 'unknown_command' });
  });

  const withValve = (): Level => ({ ...level(), devices: [...level().devices, dev('v', 'Water valve', 'valve', 4500)] });

  it('Last event reads set open / set closed; a wall switch reads set on', async () => {
    const live = liveHass();
    const el = await open(live.hass, withValve());
    const at = new Date(2026, 10, 15, 9, 5, 7).toISOString();
    const ev = (value: string) => ({ full: true, containers: {
      v: { kind: 'valve', status: 'ok', last: { action: 'set', value, at } },
      w: { kind: 'wall_switch', status: 'ok', last: { action: 'set', value, at } } } });
    await push(el, live.subs[0], ev('on'));
    await pick(el, 'v');
    expect(line(el)).toBe('Last event: set open, 09:05:07');
    await push(el, live.subs[0], ev('off'));
    expect(line(el)).toBe('Last event: set closed, 09:05:07');
    await pick(el, 'w');
    expect(line(el)).toBe('Last event: set off, 09:05:07');
  });
});

describe('binding step: valve', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });
  const withValve = (): Level => ({ ...level(), devices: [...level().devices, dev('v', 'Water valve', 'valve', 4500)] });

  it('shows the auto flag and the window like a wall switch', async () => {
    const el = await open(registryHass(STATES, REGISTRY).hass, withValve());
    await pick(el, 'v');
    expect(roles(el)).toEqual(['state']);
    expect(input(el, 'autoByDoubleToggle').closest('label')!.textContent).toContain('Auto by double toggle');
    expect(q(el, '.props input[data-field="windowSec"]')).toBeNull();
    await toggle(el, 'autoByDoubleToggle');
    expect(input(el, 'windowSec').closest('label')!.textContent).toContain('Window, s');
  });
});
