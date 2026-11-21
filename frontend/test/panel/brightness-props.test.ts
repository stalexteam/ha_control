// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'lit';
import { renderBindingProps, type BindingPropsOpts } from '../../src/panel/binding-props';
import { bindingStatus } from '../../src/model/bindings';
import { metaFromStates } from '../../src/binding/ha-meta';
import { wordErrors } from '../../src/live/rules-feed';
import { deviceDefaults, emptyLevel, type Device, type DeviceProps, type Level } from '../../src/model/types';

const STATES = {
  'light.dim': { state: 'off', attributes: { supported_color_modes: ['brightness', 'color_temp'] } },
  'light.plain': { state: 'off', attributes: { supported_color_modes: ['onoff'] } },
  'switch.relay': { state: 'off', attributes: {} },
};

const light = (control: string | null, extra: object = {}): Device => ({
  id: 'l', name: 'Lamp', invalid: false, bindings: control ? { control } : {},
  placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
  props: { ...deviceDefaults('ceiling_light', 'free'), ...extra } as DeviceProps,
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
  const field = () => host.querySelector<HTMLInputElement>('input[data-field="brightness"]');
  const change = (v: string) => { const f = field()!; f.value = v; f.dispatchEvent(new Event('change')); };
  const props = () => commits.at(-1)!.devices[0].props as Record<string, unknown>;
  return { host, commits, notices, field, change, props };
}

describe('light brightness field (Binding)', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('is shown for a light entity with a brightness mode, with label and hint', () => {
    const { host, field } = mount(light('light.dim'));
    expect(field()).not.toBeNull();
    expect(host.querySelector('[data-section="brightness"]')!.textContent).toContain('Brightness when switched on, %');
    expect(host.querySelector('[data-section="brightness"]')!.textContent).toContain("empty = the lamp's own");
  });

  it('is hidden for an on/off-only light, a switch entity, no state and no binding', () => {
    expect(mount(light('light.plain')).field()).toBeNull();
    expect(mount(light('switch.relay')).field()).toBeNull();
    expect(mount(light('light.gone')).field()).toBeNull();
    expect(mount(light(null)).field()).toBeNull();
  });

  it('shows the stored value; a wall light has the field too', () => {
    expect(mount(light('light.dim', { brightness: 49 })).field()!.value).toBe('49');
    const d = { ...light('light.dim'), props: { ...deviceDefaults('wall_light', 'wall') } as DeviceProps };
    expect(mount(d).field()).not.toBeNull();
  });

  it('saves a whole number 1-100 and clears on empty', () => {
    let m = mount(light('light.dim'));
    m.change('49');
    expect(m.props().brightness).toBe(49);
    m = mount(light('light.dim', { brightness: 49 }));
    m.change('');
    expect('brightness' in m.props() && m.props().brightness !== undefined).toBe(false);
  });

  it('rejects 0, 101, 1.5 and text: no commit, notice, field reverts', () => {
    for (const bad of ['0', '101', '1.5', 'abc']) {
      const m = mount(light('light.dim', { brightness: 30 }));
      m.change(bad);
      expect(m.commits).toHaveLength(0);
      expect(m.notices.at(-1)).toBeTruthy();
      expect(m.field()!.value).toBe('30');
    }
  });
});

describe('rule entry error wording', () => {
  it('words "device switched back"', () => {
    const tr = { last: { error: 'device switched back' } } as never;
    expect((wordErrors(tr) as { last: { error: string } }).last.error).toBe('the device switched back');
  });
});
