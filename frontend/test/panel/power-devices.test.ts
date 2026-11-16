// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { mdiLock, mdiMapMarker } from '@mdi/js';
import { STORAGE_KEY } from '../../dev/mock-hass';
import { metaFromStates } from '../../src/binding/ha-meta';
import type { EntityCombo } from '../../src/binding/entity-combo';
import { blockLines, blockRect, HEAD_H, FOOT_H, type GeoCtx } from '../../src/geometry/power';
import { blockPorts, type PowerBlock, type PowerFrame, type PowerSchema } from '../../src/model/power';
import { deviceDefaults, emptyLevel, type Device, type DeviceKind, type DeviceProps, type Id, type Level } from '../../src/model/types';
import { renderPowerProps, type PowerPropsOpts } from '../../src/panel/power-props';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { renderPower } from '../../src/render/power-svg';
import { paletteFor } from '../../src/render/theme';
import { $, click, mount, press, undo } from './helpers';

const st = (state: string, attributes: Record<string, string> = {}) => ({ state, attributes });
const STATES: Record<string, unknown> = {
  'sensor.rcbo_power': st('400', { friendly_name: 'RCBO power', device_class: 'power', unit_of_measurement: 'W' }),
  'sensor.inv_in': st('-300', { friendly_name: 'Inverter in', device_class: 'power', unit_of_measurement: 'W' }),
  'sensor.rcbo_voltage': st('230', { friendly_name: 'RCBO voltage', device_class: 'voltage', unit_of_measurement: 'V' }),
  'sensor.bath_hum': st('61', { friendly_name: 'Bath humidity', device_class: 'humidity', unit_of_measurement: '%' }),
  'switch.rcbo': st('on', { friendly_name: 'RCBO relay' }),
  'light.desk': st('off', { friendly_name: 'Desk lamp' }),
};
const META = metaFromStates(STATES);

type Flags = { inverter?: true; controllable?: true };
const dev = (id: Id, name: string, o: { kind?: DeviceKind; bindings?: Device['bindings']; flags?: Flags;
  placement?: Device['placement'] } = {}): Device => ({
  id, name, invalid: false, placement: o.placement ?? { mode: 'none' },
  props: { ...deviceDefaults(o.kind ?? 'equipment', 'free'), ...o.flags } as DeviceProps,
  ...(o.bindings ? { bindings: o.bindings } : {}),
});
const FREE: Device['placement'] = { mode: 'free', x: 1000, y: 1000, rotation: 0 };

const grid: PowerBlock = { id: 'grid', kind: 'grid', x: 0, y: 0 };
const blockOf = (id: Id, deviceId: Id, x = 0, y = 200): PowerBlock => ({ id, kind: 'device', x, y, deviceId });

/** Renders the Power properties; commit and commitPower store the edit and render again, as the panel does. */
function harness(level: Level, power: PowerSchema, over: Partial<PowerPropsOpts> = {}) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const calls = { armed: [] as Id[], commits: 0, levelCommits: 0 };
  const o: PowerPropsOpts = {
    power, level, selection: null, meta: META, states: STATES, frame: null, notice: null, feedError: null,
    toolId: 'power-select', placeDeviceId: null,
    onPlaceDevice: id => { calls.armed.push(id); },
    commit: (next, p) => { o.level = next; if (p) o.power = p; calls.levelCommits++; draw(); },
    commitPower: next => { o.power = next; calls.commits++; draw(); },
    setPosition: () => {},
    ...over,
  };
  const draw = () => render(renderPowerProps(o), host);
  draw();
  const q = <T extends Element = HTMLElement>(sel: string): T | null => host.querySelector<T>(sel);
  const device = (id: Id): Device => o.level.devices.find(d => d.id === id)!;
  return { host, o, calls, q, device };
}

const sel = (id: Id) => ({ selection: { kind: 'powerBlock' as const, id } });
const setCombo = (c: EntityCombo, value: string | null) =>
  c.dispatchEvent(new CustomEvent('value-changed', { detail: { value }, bubbles: true, composed: true }));
function toggle(el: HTMLInputElement, on: boolean): void {
  el.checked = on;
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Power step device properties', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('an equipment block edits its device: Name, Power, Voltage, Switch; the header names the role', () => {
    const level = { ...emptyLevel('L1'), devices: [dev('r', 'RCBO', { bindings: { power: 'sensor.rcbo_power', control: 'switch.rcbo' } })] };
    const h = harness(level, { blocks: [grid, blockOf('rb', 'r')], wires: [] }, sel('rb'));
    expect(h.q('h4')!.textContent).toBe('Device · Metered switch');
    const combos = [...h.host.querySelectorAll<EntityCombo>('ps-entity-combo')];
    expect(combos.map(c => c.dataset.field)).toEqual(['power', 'voltage', 'control']);
    expect([...h.host.querySelectorAll('.role-label')].map(l => l.textContent)).toEqual(['Power', 'Voltage', 'Switch']);
    // Strict lists: the power list has no voltage or humidity sensor; the switch list only switches.
    expect(combos[0].items.map(e => e.entityId)).toEqual(['sensor.inv_in', 'sensor.rcbo_power']);
    expect(combos[1].items.map(e => e.entityId)).toEqual(['sensor.rcbo_voltage']);
    expect(combos[2].items.map(e => e.entityId)).toEqual(['switch.rcbo']);
    setCombo(combos[1], 'sensor.rcbo_voltage');
    expect(h.device('r').bindings).toEqual({ power: 'sensor.rcbo_power', control: 'switch.rcbo', voltage: 'sensor.rcbo_voltage' });
    setCombo(h.q<EntityCombo>('ps-entity-combo[data-field="power"]')!, null);
    expect(h.device('r').bindings).toEqual({ control: 'switch.rcbo', voltage: 'sensor.rcbo_voltage' });
    const name = h.q<HTMLInputElement>('input[data-field="name"]')!;
    name.value = 'RCBO output';
    name.dispatchEvent(new Event('change', { bubbles: true }));
    expect(h.device('r').name).toBe('RCBO output');
    expect(h.calls.levelCommits).toBe(3);
    expect(h.calls.commits).toBe(0);
  });

  it('Controllable shows only while a switch is bound and sets the flag', () => {
    const level = { ...emptyLevel('L1'), devices: [dev('r', 'RCBO', { bindings: { control: 'switch.rcbo' } }), dev('d', 'Dummy')] };
    const h = harness(level, { blocks: [grid, blockOf('rb', 'r'), blockOf('db', 'd', 300)], wires: [] }, sel('rb'));
    toggle(h.q<HTMLInputElement>('input[data-field="controllable"]')!, true);
    expect(h.device('r').props).toMatchObject({ controllable: true });
    document.body.innerHTML = '';
    const d = harness(level, { blocks: [grid, blockOf('db', 'd')], wires: [] }, sel('db'));
    expect(d.q('h4')!.textContent).toBe('Device · Dummy');
    expect(d.q('input[data-field="controllable"]')).toBeNull();
  });

  it('Inverter on swaps Power for Input / Output power; off drops the PV and BAT wires in the same commit', () => {
    const level = { ...emptyLevel('L1'), devices: [dev('i', 'Inverter', { flags: { inverter: true }, bindings: { power_in: 'sensor.inv_in' } })] };
    const power: PowerSchema = {
      blocks: [grid, blockOf('ib', 'i'), { id: 'pv', kind: 'pv', x: 300, y: 0 }],
      wires: [
        { id: 'w-in', from: { block: 'grid', port: 'OUT' }, to: { block: 'ib', port: 'IN' } },
        { id: 'w-pv', from: { block: 'pv', port: 'OUT' }, to: { block: 'ib', port: 'PV' } },
      ],
    };
    const h = harness(level, power, sel('ib'));
    expect(h.q('h4')!.textContent).toBe('Device · Inverter');
    expect([...h.host.querySelectorAll<EntityCombo>('ps-entity-combo')].map(c => c.dataset.field))
      .toEqual(['power_in', 'power_out', 'voltage', 'control']);
    toggle(h.q<HTMLInputElement>('input[data-field="inverter"]')!, false);
    expect(h.calls.levelCommits).toBe(1);
    expect(h.device('i').props).not.toHaveProperty('inverter');
    expect(h.o.power.wires.map(w => w.id)).toEqual(['w-in']);
    expect([...h.host.querySelectorAll<EntityCombo>('ps-entity-combo')].map(c => c.dataset.field))
      .toEqual(['power', 'voltage', 'control']);
  });

  it('a socket block keeps the read-only bindings view, with its kind as the header', () => {
    const level = { ...emptyLevel('L1'), devices: [dev('s', 'Hall socket', { kind: 'socket', placement: FREE, bindings: { control: 'switch.rcbo' } })] };
    const h = harness(level, { blocks: [grid, blockOf('sb', 's')], wires: [] }, sel('sb'));
    expect(h.q('h4')!.textContent).toBe('Socket');
    expect(h.q('ps-entity-combo')).toBeNull();
    expect(h.q('input[data-field="name"]')).toBeNull();
    expect(h.q('[data-bound="control"]')!.textContent).toContain('switch.rcbo');
  });

  it('with the Device tool the list has "New device" on top: it adds an unplaced device and arms it', () => {
    const level = { ...emptyLevel('L1'), devices: [dev('s', 'Hall socket', { kind: 'socket', placement: FREE })] };
    const h = harness(level, { blocks: [grid], wires: [] }, { toolId: 'power-device' });
    const first = h.q('.pprops [data-action], .pprops [data-place-device]')!;
    expect(first.getAttribute('data-action')).toBe('new-device');
    expect(first.textContent!.trim()).toBe('New device');
    (first as HTMLButtonElement).click();
    const made = h.o.level.devices.find(d => d.id !== 's')!;
    expect(made).toMatchObject({ name: 'Device 1', placement: { mode: 'none' }, props: { kind: 'equipment' } });
    expect(h.calls.armed).toEqual([made.id]);
    expect(h.calls.levelCommits).toBe(1);
  });
});

const P = paletteFor(true);
function draw(s: PowerSchema, devices: Device[], frame: PowerFrame | null = null): SVGSVGElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const geo: GeoCtx = { device: id => devices.find(d => d.id === id) };
  render(html`<svg>${renderPower(s, { palette: P, selection: null, preview: {}, scale: 1, frame, geo })}</svg>`, host);
  return host.querySelector('svg')!;
}
const texts = (root: Element, id: Id) =>
  [...root.querySelectorAll(`g.block[data-id="${id}"] text`)].map(x => x.textContent!.trim());
const icons = (root: Element, id: Id, d: string) =>
  [...root.querySelectorAll(`g.block[data-id="${id}"] path`)].filter(p => p.getAttribute('d') === d).length;

describe('Power step device blocks', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('an inverter block shows In, Out, voltage and loss lines and has PV and BAT ports', () => {
    const inv = dev('i', 'Inverter', { flags: { inverter: true },
      bindings: { power_in: 'sensor.inv_in', power_out: 'sensor.inv_out', voltage: 'sensor.v' } });
    const b = blockOf('ib', 'i');
    const g: GeoCtx = { device: id => (id === 'i' ? inv : undefined) };
    expect(blockLines(b, g)).toBe(4);
    expect(blockPorts(b, g).map(p => p.name)).toEqual(['IN', 'OUT', 'PV', 'BAT']);
    const root = draw({ blocks: [b], wires: [] }, [inv],
      { wires: {}, blocks: { ib: { power_in: -300, power_out: 0, voltage: 229.8, loss: 85 } } });
    expect(texts(root, 'ib').filter(x => !['IN', 'OUT', 'PV', 'BAT'].includes(x)))
      .toEqual(['Inverter', 'In −300 W', 'Out 0 W', '230 V', 'Loss 85 W']);
    expect([...root.querySelectorAll('g.block[data-id="ib"] g.port')].map(p => p.getAttribute('data-port')))
      .toEqual(['IN', 'OUT', 'PV', 'BAT']);
  });

  it('a metered switch shows power, voltage and the switch; the lock only while not controllable', () => {
    const r = dev('r', 'RCBO', { bindings: { power: 'sensor.p', voltage: 'sensor.v', control: 'switch.r' } });
    const c = dev('c', 'Relay', { flags: { controllable: true }, bindings: { control: 'switch.c' } });
    const root = draw({ blocks: [blockOf('rb', 'r'), blockOf('cb', 'c', 300)], wires: [] }, [r, c],
      { wires: {}, blocks: { rb: { power: 400, voltage: 229.8, switch: 'on' }, cb: { switch: 'off' } } });
    expect(texts(root, 'rb').filter(x => x !== 'IN' && x !== 'OUT')).toEqual(['RCBO', '400 W', '230 V']);
    expect(root.querySelector('g.block[data-id="rb"] g.switch')!.getAttribute('data-state')).toBe('on');
    expect(icons(root, 'rb', mdiLock)).toBe(1);
    expect(icons(root, 'cb', mdiLock)).toBe(0);
  });

  it('a dummy block has only its name', () => {
    const d = dev('d', 'Dummy');
    const b = blockOf('db', 'd');
    const g: GeoCtx = { device: () => d };
    expect(blockLines(b, g)).toBe(0);
    expect(blockRect(b, g).h).toBe(HEAD_H + FOOT_H);
    const root = draw({ blocks: [b], wires: [] }, [d], { wires: {}, blocks: { db: { power: 10 } } });
    expect(texts(root, 'db').filter(x => x !== 'IN' && x !== 'OUT')).toEqual(['Dummy']);
    expect(root.querySelector('g.block[data-id="db"] g.switch')).toBeNull();
  });

  it('a block of a placed device has the pin mark; one not on the plan, or whose device is gone, has none', () => {
    const placed = dev('p', 'Boiler', { placement: FREE });
    const off = dev('u', 'RCBO');
    const root = draw({ blocks: [blockOf('pb', 'p'), blockOf('ub', 'u', 300), blockOf('gb', 'gone', 600)], wires: [] }, [placed, off]);
    expect(icons(root, 'pb', mdiMapMarker)).toBe(1);
    expect(icons(root, 'ub', mdiMapMarker)).toBe(0);
    expect(icons(root, 'gb', mdiMapMarker)).toBe(0);
  });
});

/** A level with a socket on the plan; the Power step entered at a 1:1 view. */
async function mountPower(power?: PowerSchema, devices: Device[] = [dev('s', 'Hall socket', { kind: 'socket', placement: FREE })]):
Promise<PlanStudioPanel> {
  const level = { ...emptyLevel('L1'), devices };
  const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level], ...(power ? { power } : {}) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
  const el = await mount();
  el.setMode('power');
  await el.updateComplete;
  el.view = { x: 0, y: 0, scale: 1 };
  await el.updateComplete;
  return el;
}

describe('Power step devices in the panel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('the rail has a Device tool and no Meter tool', async () => {
    const el = await mountPower();
    const tools = [...el.shadowRoot!.querySelectorAll('.tools .tool')].map(b => b.textContent!.trim());
    expect(tools).toEqual(['Select', 'Device', 'Bus', 'Battery', 'PV field', 'Transfer switch', 'Remainder']);
    expect(el.shadowRoot!.querySelector('button[data-tool="power-meter"]')).toBeNull();
  });

  it('"New device" adds an unplaced device and arms it; the next canvas click places its block', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    await press(el, '.props [data-action="new-device"]');
    const made = el.level!.devices.find(d => d.id !== 's')!;
    expect(made).toMatchObject({ name: 'Device 1', placement: { mode: 'none' } });
    expect(el.placeDeviceId).toBe(made.id);
    click(el, 400, 300);
    await el.updateComplete;
    const b = el.power.blocks.find(x => x.kind === 'device');
    expect(b).toMatchObject({ kind: 'device', deviceId: made.id });
    expect(el.selection).toEqual({ kind: 'powerBlock', id: b!.id });
    expect(el.toolId).toBe('power-select');
    expect($(el, '.props h4').textContent).toBe('Device · Dummy');
  });

  it('binding Power in the block properties is one undoable edit of the level', async () => {
    const el = await mountPower({ blocks: [grid, blockOf('rb', 'r')], wires: [] }, [dev('r', 'RCBO')]);
    el.selection = { kind: 'powerBlock', id: 'rb' };
    await el.updateComplete;
    setCombo($<EntityCombo>(el, '.props ps-entity-combo[data-field="power"]'), 'sensor.rcbo_power');
    await el.updateComplete;
    expect(el.level!.devices[0].bindings).toEqual({ power: 'sensor.rcbo_power' });
    expect(el.save.dirty).toBe(true);
    expect($(el, '.props h4').textContent).toBe('Device · Meter');
    await undo(el);
    expect(el.level!.devices[0].bindings).toBeUndefined();
  });

  it('the Inverter checkbox turns the device into an inverter and back; Ctrl+Z restores its PV wire', async () => {
    const inv = dev('i', 'Inverter', { flags: { inverter: true } });
    const el = await mountPower({
      blocks: [grid, blockOf('ib', 'i'), { id: 'pv', kind: 'pv', x: 300, y: 0 }],
      wires: [{ id: 'w-pv', from: { block: 'pv', port: 'OUT' }, to: { block: 'ib', port: 'PV' } }],
    }, [inv]);
    el.selection = { kind: 'powerBlock', id: 'ib' };
    await el.updateComplete;
    const box = $<HTMLInputElement>(el, '.props input[data-field="inverter"]');
    box.checked = false;
    box.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.power.wires).toEqual([]);
    expect(el.level!.devices[0].props).not.toHaveProperty('inverter');
    await undo(el);
    expect(el.power.wires.map(w => w.id)).toEqual(['w-pv']);
    expect(el.level!.devices[0].props).toMatchObject({ inverter: true });
  });

  it('the Enable output checkbox hides the OUT port and drops its wire; Ctrl+Z restores the wire', async () => {
    const el = await mountPower({
      blocks: [grid, blockOf('a', 's'), blockOf('b', 's', 300)],
      wires: [{ id: 'w-ab', from: { block: 'a', port: 'OUT' }, to: { block: 'b', port: 'IN' } }],
    });
    el.selection = { kind: 'powerBlock', id: 'a' };
    await el.updateComplete;
    const box = $<HTMLInputElement>(el, '.props input[data-field="output"]');
    expect(box.checked).toBe(true);
    box.checked = false;
    box.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.power.wires).toEqual([]);
    expect(el.power.blocks.find(b => b.id === 'a')).toMatchObject({ output: false });
    expect($<HTMLInputElement>(el, '.props input[data-field="output"]').checked).toBe(false);
    await undo(el);
    expect(el.power.wires.map(w => w.id)).toEqual(['w-ab']);
    expect(el.power.blocks.find(b => b.id === 'a')).not.toHaveProperty('output');
  });

  it('an inverter block has no Enable output checkbox', async () => {
    const el = await mountPower({ blocks: [grid, blockOf('ib', 'i')], wires: [] }, [dev('i', 'Inverter', { flags: { inverter: true } })]);
    el.selection = { kind: 'powerBlock', id: 'ib' };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.props input[data-field="output"]')).toBeNull();
  });

  it('a device block placed by the Device tool has output:false', async () => {
    const el = await mountPower();
    await press(el, 'button[data-tool="power-device"]');
    await press(el, '.props [data-place-device="s"]');
    click(el, 400, 300);
    await el.updateComplete;
    expect(el.power.blocks.find(x => x.kind === 'device')).toMatchObject({ deviceId: 's', output: false });
  });
});
