// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'lit';
import { STORAGE_KEY } from '../../dev/mock-hass';
import { metaFromStates } from '../../src/binding/ha-meta';
import type { EntityCombo } from '../../src/binding/entity-combo';
import { blockPorts, type Position, type PowerBlock, type PowerFrame, type PowerSchema } from '../../src/model/power';
import { deviceDefaults, emptyLevel, type Device, type DeviceKind, type Id, type Level } from '../../src/model/types';
import { renderPowerProps, type PowerPropsOpts } from '../../src/panel/power-props';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { $, click, mount, press, redo, undo } from './helpers';

const st = (state: string, attributes: Record<string, string> = {}) => ({ state, attributes });

/** Live states: power, voltage and battery sensors, a switch, a light; matched by class and unit only. */
const STATES: Record<string, unknown> = {
  'sensor.grid_power': st('1060', { friendly_name: 'Grid power', device_class: 'power', unit_of_measurement: 'W' }),
  'sensor.rcbo_power': st('0.4', { friendly_name: 'RCBO power', device_class: 'power', unit_of_measurement: 'kW' }),
  'sensor.grid_voltage': st('231', { friendly_name: 'Grid voltage', device_class: 'voltage', unit_of_measurement: 'V' }),
  'sensor.bat1_soc': st('87', { friendly_name: 'BAT 1 SOC', device_class: 'battery', unit_of_measurement: '%' }),
  'sensor.bath_hum': st('61', { friendly_name: 'Bath humidity', device_class: 'humidity', unit_of_measurement: '%' }),
  'switch.rcbo': st('on', { friendly_name: 'RCBO relay' }),
  'light.desk': st('off', { friendly_name: 'Desk lamp' }),
};
const META = metaFromStates(STATES);

const dev = (id: Id, name: string, kind: DeviceKind, bindings?: Device['bindings']): Device => ({
  id, name, invalid: false, placement: { mode: 'free', x: 1000, y: 1000, rotation: 0 }, props: deviceDefaults(kind, 'free'),
  ...(bindings ? { bindings } : {}),
});

/** Hall socket and Boiler (equipment) qualify by kind, Desk light by its control binding; Bare light and Hall motion do not. */
function level(): Level {
  return {
    ...emptyLevel('L1'),
    devices: [
      dev('s', 'Hall socket', 'socket'),
      dev('e', 'Boiler', 'equipment', { power: 'sensor.grid_power', control: 'switch.rcbo' }),
      dev('l1', 'Bare light', 'ceiling_light'),
      dev('l2', 'Desk light', 'ceiling_light', { control: 'light.desk' }),
      dev('m', 'Hall motion', 'motion_sensor'),
    ],
  };
}

const grid: PowerBlock = { id: 'grid', kind: 'grid', x: 0, y: 0 };
const meter: PowerBlock = { id: 'm1', kind: 'meter', x: 0, y: 200, name: 'RCBO output' };
const boiler: PowerBlock = { id: 'boiler', kind: 'device', x: 300, y: 200, deviceId: 'e' };
const transfer: PowerBlock = { id: 'ts', kind: 'transfer', x: 0, y: 400, name: 'Apartment input', form: '2in1out' };
const bus: PowerBlock = { id: 'bus', kind: 'bus', x: 300, y: 100, w: 240, h: 12, name: 'Main bus' };
const vbus: PowerBlock = { id: 'vbus', kind: 'bus', x: 600, y: 100, w: 12, h: 240, name: 'Riser' };
const battery: PowerBlock = { id: 'b1', kind: 'battery', x: 0, y: 600, name: 'BAT 1' };

const schema = (...blocks: PowerBlock[]): PowerSchema => ({ blocks: [grid, ...blocks], wires: [] });

/** Renders the Power properties into a container; commitPower stores the schema and renders again, as the panel does. */
function harness(power: PowerSchema, over: Partial<PowerPropsOpts> = {}) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const calls = { armed: [] as Id[], positions: [] as [Id, Position][], commits: 0 };
  const o: PowerPropsOpts = {
    power, level: level(), selection: null, meta: META, states: STATES, frame: null, notice: null, feedError: null,
    toolId: 'power-select', placeDeviceId: null,
    onPlaceDevice: id => { calls.armed.push(id); },
    commitPower: next => { o.power = next; calls.commits++; draw(); },
    setPosition: (id, p) => { calls.positions.push([id, p]); },
    ...over,
  };
  const draw = () => render(renderPowerProps(o), host);
  draw();
  const q = <T extends Element = HTMLElement>(sel: string): T | null => host.querySelector<T>(sel);
  const blk = (id: Id): PowerBlock => o.power.blocks.find(b => b.id === id)!;
  return { host, o, calls, q, blk };
}

const selected = (id: Id) => ({ selection: { kind: 'powerBlock' as const, id } });

/** Opens an entity combobox and clicks the row of `eid`. */
async function choose(c: EntityCombo, eid: string): Promise<void> {
  await c.updateComplete;
  c.shadowRoot!.querySelector<HTMLElement>('.cbox')!.click();
  await c.updateComplete;
  const row = c.shadowRoot!.querySelector<HTMLElement>(`.opt[data-id="${eid}"]`);
  if (!row) throw new Error(`no row ${eid}`);
  row.click();
  await c.updateComplete;
}

function change(el: HTMLInputElement | HTMLSelectElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function toggle(el: HTMLInputElement): void {
  el.checked = !el.checked;
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

const ids = (c: EntityCombo) => c.items.map(e => e.entityId);

describe('Power properties', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('the Plan device tool lists placeable devices by name: no device already placed, no light without bindings; a click arms one', () => {
    const h = harness(schema(boiler), { toolId: 'power-device', placeDeviceId: 'l2' });
    const rows = [...h.host.querySelectorAll<HTMLButtonElement>('[data-place-device]')];
    expect(rows.map(r => r.dataset.placeDevice)).toEqual(['l2', 's']);
    expect(rows.map(r => r.querySelector('.name')!.textContent)).toEqual(['Desk light', 'Hall socket']);
    expect(rows[0].classList.contains('sel')).toBe(true);
    expect(rows[1].classList.contains('sel')).toBe(false);
    rows[1].click();
    expect(h.calls.armed).toEqual(['s']);
    expect(h.calls.commits).toBe(0);
  });

  it('with nothing left to place the device list says so', () => {
    const h = harness(schema(boiler, { id: 'x', kind: 'device', x: 0, y: 0, deviceId: 's' },
      { id: 'y', kind: 'device', x: 0, y: 0, deviceId: 'l2' }), { toolId: 'power-device' });
    expect(h.q('[data-place-device]')).toBeNull();
    expect(h.q('[data-note="no-devices"]')).not.toBeNull();
  });

  it('nothing selected shows a short hint', () => {
    const h = harness(schema());
    expect(h.q('[data-note="power-hint"]')!.textContent).toContain('Select a block or a wire');
    expect(h.q('ps-entity-combo')).toBeNull();
  });

  it('the notice is shown above the content', () => {
    const h = harness(schema(), { notice: 'This wire would close a loop' });
    expect(h.q('.warn')!.textContent!.trim()).toBe('This wire would close a loop');
  });

  it('the live feed error is a muted line at the top, under the notice', () => {
    expect(harness(schema()).q('[data-notice="feed"]')).toBeNull();
    document.body.innerHTML = '';
    const h = harness(schema(), { notice: 'This wire would close a loop', feedError: 'Connection lost' });
    const kids = [...h.q('.pprops')!.children];
    expect(kids.map(k => k.getAttribute('data-notice') ?? k.getAttribute('data-note'))).toEqual(['session', 'feed', 'power-hint', null]);
    expect(h.q('[data-notice="feed"]')!.textContent).toBe('Connection lost');
    expect(h.q('[data-notice="feed"]')!.className).toBe('note');
  });

  it('choosing a power entity for a meter stores it; the power list is strict (power class or W / kW only)', async () => {
    const h = harness(schema(meter), selected('m1'));
    const power = h.q<EntityCombo>('ps-entity-combo[data-field="power"]')!;
    expect(ids(power)).toEqual(['sensor.grid_power', 'sensor.rcbo_power']);
    expect(ids(h.q<EntityCombo>('ps-entity-combo[data-field="voltage"]')!)).toEqual(['sensor.grid_voltage']);
    expect(ids(h.q<EntityCombo>('ps-entity-combo[data-field="switch"]')!)).toEqual(['switch.rcbo']);
    await choose(power, 'sensor.rcbo_power');
    expect(h.blk('m1')).toMatchObject({ power: 'sensor.rcbo_power' });
    expect(h.calls.commits).toBe(1);
  });

  it('clearing an entity removes it from the block', async () => {
    const h = harness(schema({ ...meter, power: 'sensor.rcbo_power' }), selected('m1'));
    const power = h.q<EntityCombo>('ps-entity-combo[data-field="power"]')!;
    power.dispatchEvent(new CustomEvent('value-changed', { detail: { value: null }, bubbles: true, composed: true }));
    expect('power' in h.blk('m1')).toBe(false);
    expect(h.calls.commits).toBe(1);
  });

  it('"Controllable" appears only with a switch; a new switch is read-only; the box toggles it', async () => {
    const h = harness(schema(meter), selected('m1'));
    expect(h.q('[data-field="controllable"]')).toBeNull();
    await choose(h.q<EntityCombo>('ps-entity-combo[data-field="switch"]')!, 'switch.rcbo');
    expect(h.blk('m1')).toMatchObject({ switch: { entity: 'switch.rcbo', controllable: false } });
    const box = h.q<HTMLInputElement>('input[data-field="controllable"]')!;
    expect(box.checked).toBe(false);
    toggle(box);
    expect(h.blk('m1')).toMatchObject({ switch: { entity: 'switch.rcbo', controllable: true } });
    expect(h.calls.commits).toBe(2);
  });

  it('a block name edit commits; a blank name reverts', () => {
    const h = harness(schema(meter), selected('m1'));
    const name = h.q<HTMLInputElement>('input[data-field="name"]')!;
    change(name, '  Breaker  ');
    expect(h.blk('m1').name).toBe('Breaker');
    change(name, '   ');
    expect(h.blk('m1').name).toBe('Breaker');
    expect(name.value).toBe('Breaker');
    expect(h.calls.commits).toBe(1);
  });

  it('the grid has Power and Voltage; a battery has Power (+ charging) and SOC; a PV field has Power', () => {
    const fields = (id: Id, ...blocks: PowerBlock[]) => {
      const h = harness(schema(...blocks), selected(id));
      return [...h.host.querySelectorAll<EntityCombo>('ps-entity-combo')].map(c => c.dataset.field);
    };
    expect(fields('grid')).toEqual(['power', 'voltage']);
    expect(fields('b1', battery)).toEqual(['power', 'soc']);
    expect(fields('pv', { id: 'pv', kind: 'pv', x: 0, y: 0 })).toEqual(['power']);
    const h = harness(schema(battery), selected('b1'));
    expect(h.q('[data-label="power"]')!.textContent).toBe('Power (+ charging)');
    expect(ids(h.q<EntityCombo>('ps-entity-combo[data-field="soc"]')!)).toEqual(['sensor.bat1_soc']);
  });

  it('a device block shows the plan device name and its bindings read-only, and no name field', () => {
    const h = harness(schema(boiler), selected('boiler'));
    expect(h.q('input[data-field="name"]')).toBeNull();
    expect(h.q('[data-field="device-name"]')!.textContent).toBe('Boiler');
    expect(h.q('ps-entity-combo')).toBeNull();
    expect(h.q('[data-bound="power"]')!.textContent).toContain('sensor.grid_power');
    expect(h.q('[data-bound="control"]')!.textContent).toContain('switch.rcbo');
    expect(h.q('[data-note="bound-hint"]')!.textContent).toBe('Bound in the Binding step');
  });

  it('a device block whose plan device is gone says so', () => {
    const h = harness(schema({ ...boiler, deviceId: 'gone' }), selected('boiler'));
    expect(h.q('[data-note="device-missing"]')!.textContent).toBe('Device missing');
  });

  it('toggling "Inverter" adds the PV and BAT ports, and unticking removes them', () => {
    const h = harness(schema(boiler), selected('boiler'));
    const box = h.q<HTMLInputElement>('input[data-field="inverter"]')!;
    expect(box.checked).toBe(false);
    toggle(box);
    expect(blockPorts(h.blk('boiler')).map(p => p.name)).toEqual(['IN', 'OUT', 'PV', 'BAT']);
    toggle(h.q<HTMLInputElement>('input[data-field="inverter"]')!);
    expect(blockPorts(h.blk('boiler')).map(p => p.name)).toEqual(['IN', 'OUT']);
    expect(h.calls.commits).toBe(2);
  });

  it('changing the transfer form removes its wires', () => {
    const s: PowerSchema = {
      blocks: [grid, meter, transfer],
      wires: [
        { id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { block: 'm1', port: 'IN' } },
        { id: 'w2', from: { block: 'm1', port: 'OUT' }, to: { block: 'ts', port: 'A' } },
      ],
    };
    const h = harness(s, selected('ts'));
    const form = h.q<HTMLSelectElement>('select[data-field="form"]')!;
    expect([...form.options].map(op => op.textContent)).toEqual(['2 inputs → 1 output', '1 input → 2 outputs']);
    change(form, '1in2out');
    expect(h.blk('ts')).toMatchObject({ form: '1in2out' });
    expect(h.o.power.wires.map(w => w.id)).toEqual(['w1']);
  });

  it('a position button sets the position live: setPosition, no commit; the live position is marked', () => {
    const frame: PowerFrame = { wires: {}, blocks: { ts: { position: 'B' } } };
    const h = harness(schema(transfer), { ...selected('ts'), frame });
    expect([...h.host.querySelectorAll('[data-position]')].map(b => b.textContent!.trim())).toEqual(['A', '0', 'B']);
    expect(h.q('[data-position="B"]')!.classList.contains('on')).toBe(true);
    h.q<HTMLButtonElement>('[data-position="0"]')!.click();
    expect(h.calls.positions).toEqual([['ts', '0']]);
    expect(h.calls.commits).toBe(0);
  });

  it('without a live frame no position is marked (no guess)', () => {
    const h = harness(schema(transfer), selected('ts'));
    expect(h.q('[data-position].on')).toBeNull();
  });

  it('"Auto ports" shows only when the block has pins and clears them', () => {
    expect(harness(schema(meter), selected('m1')).q('[data-action="auto-ports"]')).toBeNull();
    document.body.innerHTML = '';
    const h = harness(schema({ ...meter, portPins: { IN: { side: 'left', at: 0.5 } } }), selected('m1'));
    h.q<HTMLButtonElement>('[data-action="auto-ports"]')!.click();
    expect('portPins' in h.blk('m1')).toBe(false);
    expect(h.q('[data-action="auto-ports"]')).toBeNull();
  });

  it('bus Length below 40 is clamped, Thickness below 6 too; a vertical bus edits its height as the length', () => {
    const h = harness(schema(bus, vbus), selected('bus'));
    const len = h.q<HTMLInputElement>('input[data-field="bus-length"]')!;
    expect(len.value).toBe('240');
    expect(h.q<HTMLInputElement>('input[data-field="bus-thickness"]')!.value).toBe('12');
    change(len, '20');
    expect(h.blk('bus')).toMatchObject({ w: 40, h: 12 });
    change(h.q<HTMLInputElement>('input[data-field="bus-thickness"]')!, '2');
    expect(h.blk('bus')).toMatchObject({ w: 40, h: 6 });
    // A clamped value equal to the current one commits nothing and shows the current value again.
    change(h.q<HTMLInputElement>('input[data-field="bus-length"]')!, '10');
    expect(h.calls.commits).toBe(2);
    expect(h.q<HTMLInputElement>('input[data-field="bus-length"]')!.value).toBe('40');

    document.body.innerHTML = '';
    const v = harness(schema(bus, vbus), selected('vbus'));
    change(v.q<HTMLInputElement>('input[data-field="bus-length"]')!, '300');
    expect(v.blk('vbus')).toMatchObject({ w: 12, h: 300 });
  });

  it('bus Orientation shows the current one; switching it swaps w and h and keeps the wires', () => {
    const s: PowerSchema = {
      blocks: [grid, bus, boiler],
      wires: [{ id: 'w1', from: { bus: 'bus', at: 0.2 }, to: { block: 'boiler', port: 'IN' } }],
    };
    const h = harness(s, selected('bus'));
    const o = h.q<HTMLSelectElement>('select[data-field="bus-orientation"]')!;
    expect([...o.options].map(op => op.textContent)).toEqual(['Horizontal', 'Vertical']);
    expect(o.value).toBe('h');
    change(o, 'v');
    expect(h.blk('bus')).toMatchObject({ x: 300, y: 100, w: 12, h: 240 });
    expect(h.o.power.wires).toEqual(s.wires);
    expect(h.calls.commits).toBe(1);
    expect(h.q<HTMLSelectElement>('select[data-field="bus-orientation"]')!.value).toBe('v');
    expect(h.q<HTMLInputElement>('input[data-field="bus-length"]')!.value).toBe('240');
    change(h.q<HTMLSelectElement>('select[data-field="bus-orientation"]')!, 'h');
    expect(h.blk('bus')).toMatchObject({ w: 240, h: 12 });
    expect(h.calls.commits).toBe(2);
  });

  it('a wire shows its two ends, the live value or a dash, and Delete removes it', () => {
    const s: PowerSchema = {
      blocks: [{ ...grid, name: 'AC-IN' }, bus, boiler],
      wires: [
        { id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { bus: 'bus', at: 0.5 } },
        { id: 'w2', from: { bus: 'bus', at: 0.2 }, to: { block: 'boiler', port: 'IN' } },
      ],
    };
    const wire = { selection: { kind: 'powerWire' as const, id: 'w2' } };
    const h = harness(s, wire);
    expect(h.q('[data-field="wire-from"]')!.textContent).toBe('Main bus');
    expect(h.q('[data-field="wire-to"]')!.textContent).toBe('Boiler · IN');
    expect(h.q('[data-field="wire-power"]')!.textContent).toBe('—');
    h.q<HTMLButtonElement>('[data-action="delete-wire"]')!.click();
    expect(h.o.power.wires.map(w => w.id)).toEqual(['w1']);

    document.body.innerHTML = '';
    const frame: PowerFrame = { wires: { w2: { power: 1060, state: 'live' } }, blocks: {} };
    expect(harness(s, { ...wire, frame }).q('[data-field="wire-power"]')!.textContent).toBe('1.06 kW');
  });

  it('a block other than the grid has a Delete button', () => {
    expect(harness(schema(), selected('grid')).q('[data-action="delete-block"]')).toBeNull();
    document.body.innerHTML = '';
    const h = harness(schema(meter), selected('m1'));
    h.q<HTMLButtonElement>('[data-action="delete-block"]')!.click();
    expect(h.o.power.blocks.map(b => b.id)).toEqual(['grid']);
  });
});

/** Mounts a stored plan with the level above (and `power` when given) and enters the Power step at a 1:1 view. */
async function mountPower(power?: PowerSchema): Promise<PlanStudioPanel> {
  const plan = { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1, levels: [level()], ...(power ? { power } : {}) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
  const el = await mount();
  el.setMode('power');
  await el.updateComplete;
  el.view = { x: 0, y: 0, scale: 1 };
  await el.updateComplete;
  return el;
}

describe('Power properties in the panel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('a device armed in the list is placed by the next canvas click: selected, back to Select, the arm cleared', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    await press(el, '.props [data-place-device="s"]');
    expect(el.placeDeviceId).toBe('s');
    expect(el.toolId).toBe('power-device');
    // Picking the Plan device tool again keeps the arm.
    await press(el, 'button[data-tool="power-device"]');
    expect(el.placeDeviceId).toBe('s');
    expect($(el, '.props [data-place-device="s"]').classList.contains('sel')).toBe(true);
    click(el, 400, 300);
    await el.updateComplete;
    const placed = el.power.blocks.find(b => b.kind === 'device');
    expect(placed).toMatchObject({ kind: 'device', deviceId: 's' });
    expect(el.selection).toEqual({ kind: 'powerBlock', id: placed!.id });
    expect(el.toolId).toBe('power-select');
    expect(el.placeDeviceId).toBeNull();
    // The placed device is no longer listed.
    await press(el, 'button[data-tool="power-device"]');
    expect(el.shadowRoot!.querySelector('.props [data-place-device="s"]')).toBeNull();
  });

  it('a click in the device list arms the device, activates the Plan device tool and clears the pick notice', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    click(el, 400, 300);
    await el.updateComplete;
    expect(el.notice).toBe('Pick a device in the list first');
    await press(el, '.props [data-place-device="l2"]');
    expect(el.notice).toBeNull();
    expect(el.placeDeviceId).toBe('l2');
    el.pickTool('power-select');
    el.armDevice('s');
    await el.updateComplete;
    expect(el.toolId).toBe('power-device');
    expect(el.placeDeviceId).toBe('s');
  });

  it('a stale arm is not placed: place s, Undo, arm s, Redo, click leaves one block for s and asks for a pick', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    await press(el, '.props [data-place-device="s"]');
    click(el, 400, 300);
    await el.updateComplete;
    await undo(el);
    expect(el.power.blocks.some(b => b.kind === 'device')).toBe(false);
    await press(el, 'button[data-tool="power-device"]');
    await press(el, '.props [data-place-device="s"]');
    expect(el.placeDeviceId).toBe('s');
    await redo(el);
    expect(el.shadowRoot!.querySelector('.props [data-place-device="s"]')).toBeNull();
    click(el, 600, 300);
    await el.updateComplete;
    expect(el.power.blocks.filter(b => b.kind === 'device' && b.deviceId === 's')).toHaveLength(1);
    expect(el.notice).toBe('Pick a device in the list first');
    expect(el.placeDeviceId).toBeNull();
    expect(el.toolId).toBe('power-device');
  });

  it('an armed device that left the level is not placed', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    await press(el, '.props [data-place-device="s"]');
    el.commit({ ...el.level!, devices: el.level!.devices.filter(d => d.id !== 's') });
    await el.updateComplete;
    click(el, 400, 300);
    await el.updateComplete;
    expect(el.power.blocks.map(b => b.kind)).toEqual(['grid']);
    expect(el.notice).toBe('Pick a device in the list first');
    expect(el.placeDeviceId).toBeNull();
  });

  it('leaving the Power step clears the arm', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    await press(el, '.props [data-place-device="s"]');
    el.setMode('zones');
    await el.updateComplete;
    expect(el.placeDeviceId).toBeNull();
  });

  it('opening another plan clears the arm (the armed device belongs to the old plan)', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    await press(el, '.props [data-place-device="s"]');
    el.session.startNewPlan();
    await el.updateComplete;
    expect(el.placeDeviceId).toBeNull();
  });

  it('the side panel edits the selected block through the shared history: Ctrl+Z undoes a rename', async () => {
    const el = await mountPower({ blocks: [grid, meter], wires: [] });
    el.selection = { kind: 'powerBlock', id: 'm1' };
    await el.updateComplete;
    const name = $<HTMLInputElement>(el, '.props input[data-field="name"]');
    name.value = 'Breaker';
    name.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.power.blocks.find(b => b.id === 'm1')!.name).toBe('Breaker');
    expect(el.save.dirty).toBe(true);
    await undo(el);
    expect(el.power.blocks.find(b => b.id === 'm1')!.name).toBe('RCBO output');
  });

  it('switching a bus to Vertical is one undoable edit', async () => {
    const el = await mountPower({ blocks: [grid, bus], wires: [] });
    el.selection = { kind: 'powerBlock', id: 'bus' };
    await el.updateComplete;
    const o = $<HTMLSelectElement>(el, '.props select[data-field="bus-orientation"]');
    o.value = 'v';
    o.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.power.blocks.find(b => b.id === 'bus')).toMatchObject({ w: 12, h: 240 });
    expect(el.save.dirty).toBe(true);
    await undo(el);
    expect(el.power.blocks.find(b => b.id === 'bus')).toMatchObject({ w: 240, h: 12 });
  });

  it('a position button is live state: it sends the position and leaves the plan clean', async () => {
    const el = await mountPower({ blocks: [grid, transfer], wires: [] });
    const sent: [Id, Position][] = [];
    el.setPowerPosition = (id, p) => { sent.push([id, p]); };
    el.selection = { kind: 'powerBlock', id: 'ts' };
    await el.updateComplete;
    await press(el, '.props [data-position="B"]');
    expect(sent).toEqual([['ts', 'B']]);
    expect(el.save.dirty).toBe(false);
    expect(el.history!.canUndo).toBe(false);
  });
});
