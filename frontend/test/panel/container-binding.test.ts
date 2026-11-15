// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEY } from '../../dev/mock-hass';
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
async function open(): Promise<PlanStudioPanel> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    plans: { P1: { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1, levels: [level()] } },
  }));
  const el = await mount(registryHass(STATES, REGISTRY).hass);
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
