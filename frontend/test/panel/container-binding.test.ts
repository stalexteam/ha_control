// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import type { HassLike } from '../../src/api';
import { deviceDefaults, type Device, type DeviceKind, type DeviceProps, type Level, type Trigger } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { rectRoomLevel } from '../fixtures';
import { $, combo, device, mount, pick, redo, registryHass, undo } from './helpers';

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

/** Opens the plan above with the HA mock and enters the Binding step; resolves once the registries are loaded. */
async function open(hass: HassLike = registryHass(STATES, REGISTRY).hass): Promise<PlanStudioPanel> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    plans: { P1: { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1, levels: [level()] } },
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

async function toggle(el: PlanStudioPanel, field: string): Promise<void> {
  input(el, field).click();
  await el.updateComplete;
}

/** The default output select: option values and labels. */
function outputs(el: PlanStudioPanel): { v: string[]; labels: string[] } {
  const opts = [...$<HTMLSelectElement>(el, '.props select[data-field="defaultOutput"]').options];
  return { v: opts.map(o => o.value), labels: opts.map(o => o.textContent!.trim()) };
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
    expect(outputs(el)).toEqual({ v: ['off', 'on', 'error'], labels: ['Off', 'On', 'Error'] });

    await toggle(el, 'autoByDoubleToggle');
    expect(props(el, 'w').autoByDoubleToggle).toBe(true);
    expect(input(el, 'windowSec').value).toBe('3');
    expect(input(el, 'windowSec').closest('label')!.textContent).toContain('Window, s');
    expect(outputs(el).v).toEqual(['off', 'on', 'auto', 'error']);

    for (const bad of ['0', '11', '2.5', 'x']) {
      await type(el, 'windowSec', bad);
      expect(props(el, 'w').windowSec).toBe(3);
      expect(input(el, 'windowSec').value).toBe('3');
      expect(el.notice).toBe('Window is a whole number of seconds from 1 to 10.');
      expect($(el, '.props [role="alert"]').textContent!.trim()).toBe('Window is a whole number of seconds from 1 to 10.');
    }
    await type(el, 'windowSec', '5');
    expect(props(el, 'w').windowSec).toBe(5);
    expect(el.notice).toBeNull();

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

    const slot = () => input(el, 'on-slot');
    expect(slot().value).toBe('0');
    expect(slot().closest('label')!.textContent).toContain('Slot');
    await type(el, 'on-slot', '9');
    expect(props(el, 'b').on).toEqual({ slot: 9, event: 'single' });
    await type(el, 'on-slot', '10');
    expect(props(el, 'b').on).toEqual({ slot: 9, event: 'single' });
    expect(slot().value).toBe('9');
    expect(el.notice).toBe('Slot is a whole number from 0 to 9.');
    await type(el, 'on-slot', '0');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single' });
    expect(el.notice).toBeNull();

    const ev = () => input(el, 'on-event');
    expect(ev().value).toBe('single');
    expect(ev().closest('label')!.textContent).toContain('Event');
    const list = $<HTMLDataListElement>(el, `datalist#${ev().getAttribute('list')}`);
    expect([...list.querySelectorAll('option')].map(o => o.value)).toEqual(['single', 'double', 'hold']);
    await type(el, 'on-event', ' single_left ');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single_left' });
    expect(ev().value).toBe('single_left');
    await type(el, 'on-event', '   ');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'single_left' });
    expect(ev().value).toBe('single_left');
    expect(el.notice).toBe('Event cannot be empty.');
    await type(el, 'on-event', 'hold');
    expect(props(el, 'b').on).toEqual({ slot: 0, event: 'hold' });
    expect(el.notice).toBeNull();
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
    expect(input(el, 'off-slot').value).toBe('0');
    expect(input(el, 'off-event').value).toBe('hold');
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

  it('Auto adds the Auto section and Final state; default output offers Auto only while auto is enabled', async () => {
    const el = await open();
    await pick(el, 'b');
    expect(outputs(el)).toEqual({ v: ['off', 'on', 'error'], labels: ['Off', 'On', 'Error'] });
    await toggle(el, 'autoEnabled');
    expect(props(el, 'b').autoEnabled).toBe(true);
    expect(roles(el)).toEqual(['on', 'auto', 'final']);
    expect(['on', 'auto', 'final'].map(r => label(el, r))).toEqual(['On / Off', 'Auto', 'Final state']);
    expect(input(el, 'auto-slot').value).toBe('0');
    expect(input(el, 'auto-event').value).toBe('double');
    expect(outputs(el)).toEqual({ v: ['off', 'on', 'auto', 'error'], labels: ['Off', 'On', 'Auto', 'Error'] });

    const sel = $<HTMLSelectElement>(el, '.props select[data-field="defaultOutput"]');
    sel.value = 'auto';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;
    expect(props(el, 'b').defaultOutput).toBe('auto');
    expect($<HTMLSelectElement>(el, '.props select[data-field="defaultOutput"]').value).toBe('auto');

    // Final state matters only in toggle mode.
    await toggle(el, 'separateOff');
    expect(roles(el)).toEqual(['on', 'off', 'auto']);
    await toggle(el, 'separateOff');
    expect(roles(el)).toEqual(['on', 'auto', 'final']);

    await toggle(el, 'autoEnabled');
    expect(props(el, 'b')).toMatchObject({ autoEnabled: false, defaultOutput: 'off', auto: { slot: 0, event: 'double' } });
    expect(roles(el)).toEqual(['on']);
    expect(outputs(el).v).toEqual(['off', 'on', 'error']);
    expect($<HTMLSelectElement>(el, '.props select[data-field="defaultOutput"]').value).toBe('off');
  });

  it('sections follow the spec order: each checkbox after the section above it and before the section it reveals', async () => {
    const el = await open();
    /** Role sections, container fields and the duplicate warning in document order. */
    const order = () => [...el.shadowRoot!.querySelectorAll(
      '.props .role, .props [data-field="autoByDoubleToggle"], .props [data-field="windowSec"], .props [data-field="separateOff"], '
      + '.props [data-field="autoEnabled"], .props [data-field="defaultOutput"], .props [data-note="duplicate"]',
    )].map(n => (n.classList.contains('role') ? `role:${n.getAttribute('data-role')}`
      : n.getAttribute('data-field') ?? `note:${n.getAttribute('data-note')}`));

    await pick(el, 'w');
    expect(order()).toEqual(['role:state', 'autoByDoubleToggle', 'defaultOutput']);
    await toggle(el, 'autoByDoubleToggle');
    expect(order()).toEqual(['role:state', 'autoByDoubleToggle', 'windowSec', 'defaultOutput']);

    await pick(el, 'b');
    expect(order()).toEqual(['role:on', 'separateOff', 'autoEnabled', 'defaultOutput']);
    await toggle(el, 'separateOff');
    expect(order()).toEqual(['role:on', 'separateOff', 'role:off', 'autoEnabled', 'defaultOutput']);
    await toggle(el, 'autoEnabled');
    expect(order()).toEqual(['role:on', 'separateOff', 'role:off', 'autoEnabled', 'role:auto', 'defaultOutput']);
    await type(el, 'off-event', 'single');
    expect(order()).toEqual(['role:on', 'separateOff', 'role:off', 'autoEnabled', 'role:auto', 'defaultOutput', 'note:duplicate']);
    await toggle(el, 'separateOff');
    expect(order()).toEqual(['role:on', 'separateOff', 'autoEnabled', 'role:auto', 'role:final', 'defaultOutput']);
  });

  it('two buttons of one switch on different slots show no also-bound note; the same trigger shows it', async () => {
    const el = await open();
    await pick(el, 'k2');
    expect(q(el, '.props [data-note="also"]')).toBeNull();
    await type(el, 'on-slot', '1');
    expect($(el, '.props [data-role="on"] [data-note="also"]').textContent!.trim()).toBe('Also bound to: WC light key');
    await type(el, 'on-event', 'double');
    expect(q(el, '.props [data-note="also"]')).toBeNull();
  });

  it('identical triggers in one container show the duplicate warning', async () => {
    const el = await open();
    await pick(el, 'b');
    await toggle(el, 'separateOff');
    expect(q(el, '.props [data-note="duplicate"]')).toBeNull();
    await type(el, 'off-event', 'single');
    expect($(el, '.props [data-note="duplicate"]').textContent!.trim())
      .toBe('Two triggers of this device are identical; the first one (On, Off, Auto) wins.');
    await type(el, 'off-slot', '1');
    expect(q(el, '.props [data-note="duplicate"]')).toBeNull();
  });
});

type Sub = { msg: Record<string, unknown>; push(ev: unknown): void; unsub: ReturnType<typeof vi.fn> };

/** The registry mock plus a containers subscription the test drives; with `reject` every subscription fails with it. */
function liveHass(reject?: unknown): { hass: HassLike; subs: Sub[] } {
  const { hass } = registryHass(STATES, REGISTRY);
  const subs: Sub[] = [];
  const connection: HassLike['connection'] = {
    ...hass.connection,
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>) {
      const unsub = vi.fn(() => Promise.resolve());
      subs.push({ msg, push: ev => cb(ev as T), unsub });
      return reject === undefined ? Promise.resolve(unsub) : Promise.reject(reject);
    },
  };
  return { hass: { ...hass, connection }, subs };
}

describe('binding step: output line', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  const line = (el: PlanStudioPanel) => $(el, '.props [data-field="output"]').textContent!.trim();
  const coloured = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('svg.plan g.device')]
    .filter(g => [...g.classList].some(c => c.startsWith('out-'))).map(g => g.getAttribute('data-id'));

  /** Sends a containers event on a subscription and waits for the panel to re-render. */
  async function push(el: PlanStudioPanel, sub: Sub, ev: unknown): Promise<void> {
    sub.push(ev);
    await el.updateComplete;
  }

  it('shows the live output and the fault reason; the plan symbol takes the output colour', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    expect(live.subs.map(s => s.msg)).toEqual([{ type: 'plan_studio/containers/subscribe', plan_id: 'P1' }]);
    await pick(el, 'b');
    expect(q(el, '.props [data-field="output"]')).toBeNull(); // the runtime has not answered yet
    expect(coloured(el)).toEqual([]);

    await push(el, live.subs[0], { full: true, containers: {
      b: { output: 'on', fault: null, kind: 'smart_button' },
      w: { output: 'off', fault: 'not_configured', kind: 'wall_switch' },
      k1: { output: 'error', fault: 'unavailable', entities: ['sensor.x', 'light.y'], kind: 'smart_button' },
    } });
    expect(line(el)).toBe('Output: On');
    expect(coloured(el)).toEqual(['w', 'b', 'k1']);
    expect($(el, 'svg.plan g.device[data-id="b"]').classList.contains('out-on')).toBe(true);
    expect(el.shadowRoot!.querySelectorAll('svg.plan .fault-mark')).toHaveLength(2);

    await pick(el, 'w');
    expect(line(el)).toBe('Output: Off — default: not configured');
    await pick(el, 'k1');
    expect(line(el)).toBe('Output: Error — default: unavailable (sensor.x, light.y)');
    await pick(el, 'k2');
    expect(line(el)).toBe('Not saved yet');

    // A change re-renders the line and the symbol at once.
    await push(el, live.subs[0], { full: false, containers: { k2: { output: 'auto', fault: null, kind: 'smart_button' } } });
    expect(line(el)).toBe('Output: Auto');
    expect($(el, 'svg.plan g.device[data-id="k2"]').classList.contains('out-auto')).toBe(true);
    // A full snapshot (after a plan save) drops the containers it does not list.
    await push(el, live.subs[0], { full: true, containers: { b: { output: 'off', fault: null, kind: 'smart_button' } } });
    expect(line(el)).toBe('Not saved yet');
    expect(coloured(el)).toEqual(['b']);
    expect(live.subs).toHaveLength(1);
  });

  it('a saved container of another kind (an unsaved Type change) reads as not saved and stays neutral', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    await push(el, live.subs[0], { full: true, containers: {
      w: { output: 'on', fault: 'not_configured', kind: 'smart_button' },
      b: { output: 'on', fault: null, kind: 'smart_button' },
    } });
    await pick(el, 'w');
    expect(line(el)).toBe('Not saved yet');
    expect(coloured(el)).toEqual(['b']);
    expect(el.shadowRoot!.querySelectorAll('svg.plan .fault-mark')).toHaveLength(0);
    await pick(el, 'b');
    expect(line(el)).toBe('Output: On');
  });

  it('shows the feed error and keeps the plan neutral when the subscription fails', async () => {
    const live = liveHass({ code: 'unknown_command', message: 'Unknown command' });
    const el = await open(live.hass);
    await pick(el, 'b');
    expect(line(el)).toBe('Unknown command');
    expect(coloured(el)).toEqual([]);
    // The plan is still editable.
    await toggle(el, 'autoEnabled');
    expect(props(el, 'b').autoEnabled).toBe(true);
  });

  it('a connection without subscribeMessage says live outputs are not available', async () => {
    const el = await open(); // registryHass: sendMessagePromise only
    await pick(el, 'w');
    expect(line(el)).toBe('Live outputs are not available.');
    expect(coloured(el)).toEqual([]);
  });

  it('switching plans re-subscribes; removing the panel unsubscribes; re-attaching subscribes again', async () => {
    const live = liveHass();
    const el = await open(live.hass);
    await push(el, live.subs[0], { full: true, containers: { b: { output: 'on', fault: null, kind: 'smart_button' } } });
    expect(coloured(el)).toEqual(['b']);
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as { plans: Record<string, unknown> };
    data.plans.P2 = { id: 'P2', name: 'Cottage', schemaVersion: 1, revision: 1, levels: [level()] };
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

  it('the dev mock answers with every stored container at its default output, not configured', async () => {
    const devices = [
      ...level().devices.map(d => (d.id === 'k1' ? { ...d, props: { ...d.props, defaultOutput: 'on' } as DeviceProps } : d)),
      dev('l', 'Lamp', 'wall_light', 4500),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      plans: { P1: { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1, levels: [{ ...level(), devices }] } },
    }));
    const el = await mount(createMockHass());
    await vi.waitFor(() => expect(el.feed.ready).toBe(true));
    expect(el.feed.error).toBeNull();
    const nc = (output: string, kind = 'smart_button') => ({ output, fault: 'not_configured', kind });
    expect(['w', 'b', 'k1', 'k2', 'l'].map(id => el.feed.get(id)))
      .toEqual([nc('off', 'wall_switch'), nc('off'), nc('on'), nc('off'), undefined]);

    await expect(createMockHass().connection.subscribeMessage!(() => undefined, { type: 'other/subscribe' }))
      .rejects.toMatchObject({ code: 'unknown_command' });
  });
});
