// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'lit';
import { renderBindingProps, type BindingPropsOpts } from '../../src/panel/binding-props';
import { renderEquipmentProps, initialNextProps } from '../../src/panel/device-props';
import { bindingStatus } from '../../src/model/bindings';
import { metaFromStates } from '../../src/binding/ha-meta';
import { defaultPower } from '../../src/model/power';
import { deviceDefaults, emptyLevel, type Device, type DeviceProps, type Level } from '../../src/model/types';

const STATES = {
  'sensor.lux': { state: '8', attributes: { device_class: 'illuminance', unit_of_measurement: 'lx' } },
  'sun.sun': { state: 'below_horizon', attributes: { elevation: -3.2 } },
  'sensor.temp': { state: '20', attributes: { device_class: 'temperature', unit_of_measurement: '°C' } },
};

const sensor = (extra: object = {}, bindings: Device['bindings'] = { illuminance: 'sensor.lux' }): Device => ({
  id: 's', name: 'Lux', invalid: false, bindings, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
  props: { ...deviceDefaults('illuminance_sensor', 'free'), ...extra } as DeviceProps,
});

function mount(d: Device) {
  const host = document.createElement('div');
  const level: Level = { ...emptyLevel('l0'), devices: [d] };
  const commits: Level[] = [];
  const notices: (string | null)[] = [];
  const states = STATES as never;
  const o: BindingPropsOpts = {
    level, device: d, meta: metaFromStates(states), states, status: x => bindingStatus(x, () => 'present'), showAll: {},
    onShowAll: vi.fn(), commit: n => commits.push(n), onNextUnbound: vi.fn(), notice: null, fieldNotice: null,
    setFieldNotice: m => notices.push(m), registryError: null, registryLoading: false, onRetry: vi.fn(),
    feed: { ready: false, error: null, stateOf: () => undefined },
  };
  render(renderBindingProps(o), host);
  const field = (name: string) => host.querySelector<HTMLInputElement>(`[data-section="daylight"] input[data-field="${name}"]`)!;
  const change = (name: string, v: string) => {
    const f = field(name);
    f.value = v;
    f.dispatchEvent(new Event('change'));
    return f;
  };
  const props = () => commits.at(-1)!.devices[0].props as Record<string, unknown>;
  return { host, commits, notices, field, change, props };
}

describe('illuminance sensor daylight fields (Binding)', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('a Sun binding row offers sun entities only', () => {
    const { host } = mount(sensor());
    expect(host.querySelector('[data-role="sun"] .role-label')!.textContent).toBe('Sun');
    const items = (host.querySelector('ps-entity-combo[data-role="sun"]') as unknown as { items: { entityId: string }[] }).items;
    expect(items.map(e => e.entityId)).toEqual(['sun.sun']);
  });

  it('shows the five fields with labels and defaults', () => {
    const { host, field } = mount(sensor());
    const labels = [...host.querySelectorAll('[data-section="daylight"] .row > span')].map(x => x.textContent);
    expect(labels).toEqual(['Night below, lx', 'Day above, lx', 'Sun: night below, °', 'Sun: day above, °', 'Debounce, s']);
    expect(['nightBelow', 'dayAbove', 'sunNight', 'sunDay', 'debounce'].map(n => field(n).value)).toEqual(['10', '50', '-6', '3', '60']);
    expect(host.querySelector('[data-section="daylight"] .warn')).toBeNull();
  });

  it('commits decimals, signs and a comma; blank goes back to the default', () => {
    let m = mount(sensor());
    m.change('nightBelow', '2.5');
    expect(m.props().nightBelow).toBe(2.5);
    m = mount(sensor());
    m.change('sunNight', '-4,5');
    expect(m.props().sunNight).toBe(-4.5);
    m = mount(sensor({ dayAbove: 80 }));
    expect(m.field('dayAbove').value).toBe('80');
    m.change('dayAbove', ' ');
    expect('dayAbove' in m.props()).toBe(false);
    m = mount(sensor());
    m.change('debounce', '0');
    expect(m.props().debounce).toBe(0);
  });

  it('the same value commits nothing', () => {
    const m = mount(sensor());
    m.change('nightBelow', '10');
    m.change('debounce', '60');
    expect(m.commits).toHaveLength(0);
  });

  it('malformed text reverts with a notice', () => {
    const m = mount(sensor({ nightBelow: 5 }));
    expect(m.change('nightBelow', 'abc').value).toBe('5');
    expect(m.notices.at(-1)).toBe('Enter a number.');
    expect(m.change('debounce', '1.5').value).toBe('60');
    expect(m.change('debounce', '3601').value).toBe('60');
    expect(m.notices.at(-1)).toBe('Debounce is a whole number of seconds from 0 to 3600.');
    expect(m.commits).toHaveLength(0);
  });

  it('a broken pair is stored and shows that its defaults apply', () => {
    const m = mount(sensor());
    m.change('nightBelow', '60');
    expect(m.props().nightBelow).toBe(60);
    const lux = mount(sensor({ nightBelow: 60 }));
    expect(lux.host.querySelector('[data-note="lux-pair"]')!.textContent).toBe('Night below must be 0 or more and under Day above; 10 / 50 lx apply.');
    const sun = mount(sensor({ sunNight: 5 }));
    expect(sun.host.querySelector('[data-note="sun-pair"]')!.textContent).toBe('Sun: night below must be under day above; -6° / 3° apply.');
    expect(sun.host.querySelector('[data-note="lux-pair"]')).toBeNull();
  });

  it('other kinds have no daylight fields', () => {
    const d: Device = { ...sensor(), props: deviceDefaults('climate_sensor', 'free'), bindings: { temperature: 'sensor.temp' } };
    expect(mount(d).host.querySelector('[data-section="daylight"]')).toBeNull();
  });
});

describe('illuminance sensor in Equipment', () => {
  it('points to the Binding step for its thresholds', () => {
    const d = sensor();
    const host = document.createElement('div');
    render(renderEquipmentProps({
      level: { ...emptyLevel('l0'), devices: [d] }, power: defaultPower(), selection: { kind: 'device', id: 's' }, toolId: 'device-select',
      nextProps: initialNextProps(), notice: null, commit: vi.fn(), setNextProps: vi.fn(), setNotice: vi.fn(),
      nextWallMount: false, setNextWallMount: vi.fn(), pickDevice: vi.fn(),
    }), host);
    expect(host.querySelector('[data-note="daylight"]')!.textContent).toBe('Daylight thresholds are set in the Binding step.');
  });
});
