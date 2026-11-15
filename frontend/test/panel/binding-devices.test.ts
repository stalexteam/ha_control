// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'lit';
import { renderBindingList } from '../../src/panel/binding-list';
import { renderBindingProps, roleLabel, type BindingPropsOpts } from '../../src/panel/binding-props';
import { bindingStatus, type BindStatus } from '../../src/model/bindings';
import { metaFromStates } from '../../src/binding/ha-meta';
import { deviceDefaults, emptyLevel, type Device, type Level } from '../../src/model/types';
import { setDeviceProps } from '../../src/model/devices';

const st = (state: string, attributes: Record<string, string> = {}) => ({ state, attributes });
const STATES = {
  'switch.plug': st('on'),
  'sensor.volt': st('230', { device_class: 'voltage', unit_of_measurement: 'V' }),
  'sensor.watt': st('5', { device_class: 'power', unit_of_measurement: 'W' }),
  'sensor.temp': st('20', { device_class: 'temperature', unit_of_measurement: '°C' }),
};

const eq = (id: string, name: string, placed: boolean, bindings?: Device['bindings'], inverter = false): Device => ({
  id, name, invalid: false, bindings,
  placement: placed ? { mode: 'free', x: 0, y: 0, rotation: 0 } : { mode: 'none' },
  props: { ...deviceDefaults('equipment', 'free'), ...(inverter ? { inverter: true } : {}) } as Device['props'],
});

const lvl = (devices: Device[]): Level => ({ ...emptyLevel('l0'), devices });
const status = (d: Device): BindStatus => bindingStatus(d, () => 'present');

function list(level: Level) {
  const host = document.createElement('div');
  render(renderBindingList({
    level, selection: null, status, filter: 'all', query: '', onFilter: vi.fn(), onQuery: vi.fn(), onPick: vi.fn(),
    collapsed: false, onCollapse: vi.fn(),
  }), host);
  return host;
}

function props(level: Level, device: Device) {
  const host = document.createElement('div');
  const states = STATES as never;
  const o: BindingPropsOpts = {
    level, device, meta: metaFromStates(states), states, status, showAll: {}, onShowAll: vi.fn(), commit: vi.fn(),
    onNextUnbound: vi.fn(), notice: null, fieldNotice: null, setFieldNotice: vi.fn(), registryError: null,
    registryLoading: false, onRetry: vi.fn(), feed: { ready: false, error: null, stateOf: () => undefined },
  };
  render(renderBindingProps(o), host);
  return host;
}

const comboItems = (host: HTMLElement, role: string): string[] =>
  ((host.querySelector(`ps-entity-combo[data-role="${role}"]`) as unknown as { items: { entityId: string }[] }).items)
    .map(e => e.entityId);

describe('binding step devices', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('lists an unplaced device in a "Not on the plan" group after the placed ones', () => {
    const h = list(lvl([eq('a', 'Zed', false), eq('b', 'Yak', true)]));
    expect(h.querySelector('[data-group="unplaced"] h5')!.textContent).toContain('Not on the plan');
    const names = [...h.querySelectorAll('.brow .name')].map(n => n.textContent);
    expect(names).toEqual(['Yak', 'Zed']);
    expect(h.querySelector('[data-group="unplaced"] .brow[data-id="a"]')).not.toBeNull();
    expect(h.querySelector('[data-group="unplaced"] .brow[data-id="b"]')).toBeNull();
  });

  it('shows no group when every device is placed', () => {
    expect(list(lvl([eq('b', 'Yak', true)])).querySelector('[data-group="unplaced"]')).toBeNull();
  });

  it('an inverter shows Input power and Output power, not Power', () => {
    const d = eq('i', 'Inv', false, undefined, true);
    const h = props(lvl([d]), d);
    expect(h.querySelector('[data-role="power_in"] .role-label')!.textContent).toBe('Input power');
    expect(h.querySelector('[data-role="power_out"] .role-label')!.textContent).toBe('Output power');
    expect(h.querySelector('.role[data-role="power"]')).toBeNull();
  });

  it('Voltage offers only voltage sensors; the control row is called Switch', () => {
    const d = eq('v', 'V', false);
    const h = props(lvl([d]), d);
    expect(comboItems(h, 'voltage')).toEqual(['sensor.volt']);
    expect(comboItems(h, 'power')).toEqual(['sensor.watt']);
    expect(h.querySelector('[data-role="control"] .role-label')!.textContent).toBe('Switch');
    expect(roleLabel(d, 'control')).toBe('Switch');
    expect(roleLabel({ ...d, props: deviceDefaults('ceiling_light', 'free') }, 'control')).toBe('Control');
  });

  it('a dummy shows "Dummy" and counts as bound', () => {
    const d = eq('d', 'Nothing', true);
    const h = list(lvl([d]));
    expect(h.querySelector('.brow .kind')!.textContent!.trim()).toBe('Dummy');
    expect(h.querySelector('.brow .dot')!.classList.contains('bound')).toBe(true);
    expect(h.querySelector('[data-filter="unbound"] .count')!.textContent!.trim()).toBe('0');
    const pr = props(lvl([d]), d);
    expect(pr.querySelector('h4')!.textContent).toContain('Dummy');
    expect(pr.querySelector('.bfoot')!.textContent).toContain('0 not bound');
  });

  it('a bound equipment row names its role', () => {
    const d = eq('m', 'Meter', true, { power: 'sensor.watt' });
    expect(list(lvl([d])).querySelector('.brow .kind')!.textContent!.trim()).toBe('Meter');
    const inv = eq('i', 'Inv', true, undefined, true);
    expect(list(lvl([setDeviceProps(lvl([inv]), 'i', {}, 'Inv').devices[0]])).querySelector('.brow .kind')!.textContent!.trim())
      .toBe('Inverter');
  });
});
