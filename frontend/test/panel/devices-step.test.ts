// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEY } from '../../dev/mock-hass';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { $, click, device, key, mount, press, undo } from './helpers';
import { rectRoomLevel } from '../fixtures';
import { t } from '../../src/i18n';
import { deviceDefaults, type Device, type DevicePlacement, type Plan } from '../../src/model/types';

type Flags = { inverter?: true; controllable?: true };

/** An equipment device named after its id. */
const eq = (id: string, placement: DevicePlacement, bindings?: Device['bindings'], flags: Flags = {}): Device => ({
  id, name: id, invalid: false, placement, props: { ...deviceDefaults('equipment', 'free'), ...flags }, bindings,
});
const none: DevicePlacement = { mode: 'none' };

/** Stores one plan: a 4000 x 3000 room (200 mm walls, w0 on top, w3 on the left) with `devices` and raw `power`. */
function seed(devices: Device[], power?: unknown): void {
  const level = { ...rectRoomLevel(4000, 3000, 200), devices, switchesMigrated: true as const };
  const plan = { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1, levels: [level], ...(power ? { power } : {}) } as Plan;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
}

async function equipmentStep(el: PlanStudioPanel): Promise<void> {
  await press(el, '.top button[data-mode="equipment"]');
}

async function check(el: PlanStudioPanel, field: string, on: boolean): Promise<void> {
  const box = $<HTMLInputElement>(el, `.props input[data-field="${field}"]`);
  box.checked = on;
  box.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
}

const has = (el: PlanStudioPanel, sel: string) => el.shadowRoot!.querySelector(sel) !== null;
const heading = (el: PlanStudioPanel) => $(el, '.props h4').textContent!.replace(/\s+/g, ' ').trim();

describe('Equipment step devices', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('the rail and the device kind read "Device"; the new texts are exact', async () => {
    const el = await mount();
    await equipmentStep(el);
    expect($(el, 'button[data-tool="equipment"]').textContent!.trim()).toBe('Device');
    const copy: Record<string, string> = {
      'tool.equipment': 'Device', 'device.equipment': 'Device', 'props.wallMount': 'Wall mount', 'props.inverter': 'Inverter',
      'props.controllable': 'Controllable', 'props.bindSwitchHint': 'Bind a switch in the Binding step',
      'devices.unplaced': 'Not on the plan', 'devices.new': 'New device', 'deviceRole.meter': 'Meter',
      'deviceRole.switch': 'Switch', 'deviceRole.metered-switch': 'Metered switch', 'deviceRole.dummy': 'Dummy',
    };
    expect(Object.fromEntries(Object.keys(copy).map(k => [k, t(k)]))).toEqual(copy);
  });

  it('Wall mount moves a free device onto the nearest wall face, along-wall position kept; off leaves it free in place', async () => {
    seed([eq('d1', { mode: 'free', x: 500, y: 1500, rotation: 0 })]);
    const el = await mount();
    await equipmentStep(el);
    el.pickDevice('d1');
    await el.updateComplete;
    expect($<HTMLInputElement>(el, '.props input[data-field="wallMount"]').checked).toBe(false);
    await check(el, 'wallMount', true);
    // The left wall's room face is x = 100 (400 away); the top and bottom faces are 1400 away.
    expect(device(el, 'd1').placement).toEqual({ mode: 'wall', wallId: 'w3', side: 'right', offset: 1500 });
    expect($<HTMLInputElement>(el, '.props input[data-field="wallMount"]').checked).toBe(true);
    // Off: free at the wall pose (the 600 deep body's centre 300 off the face), turned to the wall tangent.
    await check(el, 'wallMount', false);
    expect(device(el, 'd1').placement).toEqual({ mode: 'free', x: 400, y: 1500, rotation: 90 });
    await undo(el);
    expect(device(el, 'd1').placement).toMatchObject({ mode: 'wall', wallId: 'w3' });
  });

  it('the Device tool with Wall mount places a device on a wall like a socket', async () => {
    seed([]);
    const el = await mount();
    await equipmentStep(el);
    await press(el, 'button[data-tool="equipment"]');
    expect($<HTMLInputElement>(el, '.props input[data-field="next-wallMount"]').checked).toBe(false);
    await check(el, 'next-wallMount', true);
    expect(el.nextObj.wallMount).toBe(true);
    click(el, 1500, 2000); // the middle of the room: no wall, nothing placed
    await el.updateComplete;
    expect(el.level!.devices).toHaveLength(0);
    click(el, 1500, 150); // near the top wall's room face (y = 100)
    await el.updateComplete;
    const d = el.level!.devices[0];
    expect(d.name).toBe('Device 1');
    expect(d.placement).toMatchObject({ mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 });
  });

  it('"New device" adds an unplaced "Device N" and selects it; a row of the list selects its device', async () => {
    seed([eq('u1', none), eq('p1', { mode: 'free', x: 1000, y: 1000, rotation: 0 })]);
    const el = await mount();
    await equipmentStep(el);
    expect($(el, '[data-list="unplaced"] h4').textContent!.trim()).toBe('Not on the plan');
    // Only the device that is not on the plan is listed.
    const rows = [...el.shadowRoot!.querySelectorAll<HTMLElement>('[data-list="unplaced"] [data-id]')];
    expect(rows.map(r => r.dataset.id)).toEqual(['u1']);
    expect(rows[0].textContent).toContain('Dummy');
    await press(el, '[data-list="unplaced"] [data-id="u1"]');
    expect(el.selection).toEqual({ kind: 'device', id: 'u1' });
    expect(has(el, '[data-list="unplaced"]')).toBe(false);
    click(el, 3000, 2500); // empty canvas: nothing selected, the list is back
    await el.updateComplete;
    expect(el.selection).toBeNull();
    await press(el, '[data-action="new-device"]');
    const made = el.level!.devices[2];
    expect(made).toMatchObject({ name: 'Device 1', placement: { mode: 'none' }, props: { kind: 'equipment' } });
    expect(el.selection).toEqual({ kind: 'device', id: made.id });
    await undo(el);
    expect(el.level!.devices).toHaveLength(2);
  });

  it('an unplaced device shows Name, the role, Inverter, the switch hint and Delete, and no plan fields', async () => {
    seed([eq('u1', none)]);
    const el = await mount();
    await equipmentStep(el);
    el.pickDevice('u1');
    await el.updateComplete;
    expect(heading(el)).toBe('Device · Dummy');
    expect(has(el, '.props input[data-field="name"]')).toBe(true);
    expect(has(el, '.props input[data-field="inverter"]')).toBe(true);
    expect(has(el, '.props [data-action="delete-device"]')).toBe(true);
    for (const f of ['shape', 'width', 'depth', 'diameter', 'icon', 'label', 'wallMount', 'rotation', 'offset', 'zone-membership']) {
      expect(has(el, `.props [data-field="${f}"]`), f).toBe(false);
    }
  });

  it('Inverter moves Power to Output power and back', async () => {
    seed([eq('u1', none, { power: 'sensor.u1_power' })]);
    const el = await mount();
    await equipmentStep(el);
    el.pickDevice('u1');
    await el.updateComplete;
    expect(heading(el)).toBe('Device · Meter');
    await check(el, 'inverter', true);
    expect(device(el, 'u1').bindings).toEqual({ power_out: 'sensor.u1_power' });
    expect(heading(el)).toBe('Device · Inverter');
    await check(el, 'inverter', false);
    expect(device(el, 'u1').bindings).toEqual({ power: 'sensor.u1_power' });
  });

  it('Controllable shows only with a switch bound; otherwise the hint', async () => {
    seed([eq('u1', none), eq('u2', none, { control: 'switch.u2' })]);
    const el = await mount();
    await equipmentStep(el);
    el.pickDevice('u1');
    await el.updateComplete;
    expect(has(el, '.props input[data-field="controllable"]')).toBe(false);
    expect($(el, '.props [data-note="bind-switch"]').textContent!.trim()).toBe('Bind a switch in the Binding step');
    el.pickDevice('u2');
    await el.updateComplete;
    expect(heading(el)).toBe('Device · Switch');
    expect(has(el, '.props [data-note="bind-switch"]')).toBe(false);
    await check(el, 'controllable', true);
    expect(device(el, 'u2').props).toMatchObject({ controllable: true });
  });

  it('deleting an unplaced device removes its schematic blocks and their wires in one step; Ctrl+Z restores all', async () => {
    const power = {
      blocks: [
        { id: 'grid', kind: 'grid', x: 0, y: 0 },
        { id: 'blk', kind: 'device', x: 0, y: 100, deviceId: 'u1' },
        { id: 'rem', kind: 'remainder', x: 0, y: 200 },
      ],
      wires: [
        { id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { block: 'blk', port: 'IN' } },
        { id: 'w2', from: { block: 'blk', port: 'OUT' }, to: { block: 'rem', port: 'IN' } },
      ],
    };
    seed([eq('u1', none, { power: 'sensor.u1_power' })], power);
    const el = await mount();
    await equipmentStep(el);
    const before = el.history!.current;
    await press(el, '[data-list="unplaced"] [data-id="u1"]');
    await press(el, '[data-action="delete-device"]');
    expect(el.level!.devices).toHaveLength(0);
    expect(el.power.blocks.map(b => b.id)).toEqual(['grid', 'rem']);
    expect(el.power.wires).toEqual([]);
    await undo(el);
    expect(el.history!.current).toEqual(before);
    // The Delete key takes the same path.
    await press(el, '[data-list="unplaced"] [data-id="u1"]');
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.level!.devices).toHaveLength(0);
    expect(el.power.blocks.map(b => b.id)).toEqual(['grid', 'rem']);
  });

  it('turning Inverter off drops the PV and BAT wires of its blocks in the same undo step', async () => {
    const power = {
      blocks: [
        { id: 'grid', kind: 'grid', x: 0, y: 0 },
        { id: 'inv', kind: 'device', x: 0, y: 100, deviceId: 'd-inv' },
        { id: 'pv', kind: 'pv', x: -200, y: 100 },
        { id: 'bat', kind: 'battery', x: -200, y: 200 },
      ],
      wires: [
        { id: 'w-in', from: { block: 'grid', port: 'OUT' }, to: { block: 'inv', port: 'IN' } },
        { id: 'w-pv', from: { block: 'pv', port: 'OUT' }, to: { block: 'inv', port: 'PV' } },
        { id: 'w-bat', from: { block: 'inv', port: 'BAT' }, to: { block: 'bat', port: 'BAT' } },
      ],
    };
    seed([eq('d-inv', { mode: 'free', x: 1000, y: 1000, rotation: 0 }, { power_out: 'sensor.inv' }, { inverter: true })], power);
    const el = await mount();
    expect(el.power.wires.map(w => w.id)).toEqual(['w-in', 'w-pv', 'w-bat']);
    await equipmentStep(el);
    el.pickDevice('d-inv');
    await el.updateComplete;
    await check(el, 'inverter', false);
    expect(device(el, 'd-inv').bindings).toEqual({ power: 'sensor.inv' });
    expect(el.power.wires.map(w => w.id)).toEqual(['w-in']);
    await undo(el);
    expect(device(el, 'd-inv').props).toMatchObject({ inverter: true });
    expect(el.power.wires.map(w => w.id)).toEqual(['w-in', 'w-pv', 'w-bat']);
  });

  it('a PV wire on the block of a device that is not an inverter is dropped on load', async () => {
    const power = {
      blocks: [
        { id: 'grid', kind: 'grid', x: 0, y: 0 },
        { id: 'sb', kind: 'device', x: 0, y: 100, deviceId: 'd-s', inverter: true },
        { id: 'pv', kind: 'pv', x: -200, y: 100 },
      ],
      wires: [
        { id: 'w-in', from: { block: 'grid', port: 'OUT' }, to: { block: 'sb', port: 'IN' } },
        { id: 'w-pv', from: { block: 'pv', port: 'OUT' }, to: { block: 'sb', port: 'PV' } },
      ],
    };
    const socket: Device = {
      id: 'd-s', name: 'Socket', invalid: false, props: { kind: 'socket' },
      placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 1000 },
    };
    seed([socket], power);
    const el = await mount();
    expect(el.power.wires.map(w => w.id)).toEqual(['w-in']);
  });
});
