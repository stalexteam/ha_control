import { describe, it, expect, vi } from 'vitest';
import { MetaSource } from '../../src/panel/meta-source';
import { candidates } from '../../src/binding/candidates';
import { presence } from '../../src/binding/ha-meta';
import { ROLE_SPECS } from '../../src/model/bindings';
import type { HassLike } from '../../src/api';

const TEMP = ROLE_SPECS.climate_sensor[0];
type States = Record<string, { state: string; attributes: Record<string, string> }>;
const S1: States = {
  'sensor.t': { state: '21', attributes: { friendly_name: 'T', device_class: 'temperature', unit_of_measurement: '°C' } },
  'light.a': { state: 'on', attributes: { friendly_name: 'A' } },
};
const REG: Record<string, unknown> = {
  'config/entity_registry/list': [{ entity_id: 'sensor.t', device_id: 'd1' }, { entity_id: 'light.a', device_id: 'd2' }],
  'config/device_registry/list': [{ id: 'd1', name: 'Thermo' }, { id: 'd2', name: 'Lamp' }],
  'config/area_registry/list': [],
};

/** A panel stand-in: `hass` is replaced on every tick, like HA does. */
function host(states: States, gate?: Promise<void>) {
  const connection = {
    async sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
      await gate;
      return structuredClone(REG[String(msg.type)]) as T;
    },
  };
  return { hass: { connection, states } as HassLike, requestUpdate: vi.fn() };
}
const tick = (h: ReturnType<typeof host>, states: States) => { h.hass = { ...h.hass, states }; };
const valueTick = (states: States, eid: string, state: string): States => ({ ...states, [eid]: { ...states[eid], state } });

describe('MetaSource', () => {
  it('a tick that changes only state values keeps the meta and the candidate arrays', () => {
    const h = host(S1);
    const src = new MetaSource(h);
    const m1 = src.get();
    const c1 = candidates(m1, TEMP, false);
    tick(h, valueTick(S1, 'sensor.t', '22'));
    expect(src.get()).toBe(m1);
    expect(candidates(src.get(), TEMP, false)).toBe(c1);
  });

  it('a changed device_class, a new entity or a renamed one gives a new meta', () => {
    const h = host(S1);
    const src = new MetaSource(h);
    const m1 = src.get();
    tick(h, { ...S1, 'sensor.t': { state: '21', attributes: { ...S1['sensor.t'].attributes, device_class: 'humidity' } } });
    const m2 = src.get();
    expect(m2).not.toBe(m1);
    expect(m2.entities.get('sensor.t')!.deviceClass).toBe('humidity');
    tick(h, { ...h.hass.states as States, 'sensor.new': { state: '1', attributes: {} } });
    const m3 = src.get();
    expect(m3).not.toBe(m2);
    expect(m3.entities.has('sensor.new')).toBe(true);
    tick(h, { ...h.hass.states as States, 'light.a': { state: 'on', attributes: { friendly_name: 'Lamp A' } } });
    expect(src.get()).not.toBe(m3);
    expect(src.get().entities.get('light.a')!.name).toBe('Lamp A');
  });

  it('presence follows a state flipping to unavailable while the meta stays the same', () => {
    const h = host(S1);
    const src = new MetaSource(h);
    const m1 = src.get();
    expect(presence(src.get(), 'light.a', h.hass.states)).toBe('present');
    tick(h, valueTick(S1, 'light.a', 'unavailable'));
    expect(src.get()).toBe(m1);
    expect(presence(src.get(), 'light.a', h.hass.states)).toBe('unavailable');
  });

  it('after the registries load, value ticks keep the merged meta; a structural change rebuilds it', async () => {
    const h = host(S1);
    const src = new MetaSource(h);
    src.enter();
    await vi.waitFor(() => expect(src.get().registryLoaded).toBe(true));
    const m = src.get();
    const c = candidates(m, TEMP, false);
    tick(h, valueTick(S1, 'sensor.t', '25'));
    expect(src.get()).toBe(m);
    expect(candidates(src.get(), TEMP, false)).toBe(c);
    tick(h, { ...S1, 'sensor.new': { state: '1', attributes: {} } });
    expect(src.get()).not.toBe(m);
    expect(src.get().registryLoaded).toBe(true);
    expect(src.get().entities.get('sensor.t')!.deviceId).toBe('d1');
  });

  it('loading is true while a load is pending; a render is requested when it starts and when it settles', async () => {
    let release!: () => void;
    const h = host(S1, new Promise<void>(r => { release = r; }));
    const src = new MetaSource(h);
    expect(src.loading).toBe(false);
    src.enter();
    expect(src.loading).toBe(true);
    expect(h.requestUpdate).toHaveBeenCalledTimes(1);
    release();
    await vi.waitFor(() => expect(src.loading).toBe(false));
    expect(h.requestUpdate).toHaveBeenCalledTimes(2);
    expect(src.get().registryLoaded).toBe(true);
  });
});
