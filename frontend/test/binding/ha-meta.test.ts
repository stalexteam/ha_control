import { describe, it, expect } from 'vitest';
import { loadRegistries, mergeMeta, metaFromStates, presence, sameStructure, stateOf } from '../../src/binding/ha-meta';
import { candidates } from '../../src/binding/candidates';
import { ROLE_SPECS } from '../../src/model/bindings';
import { ent, makeMeta } from './fixtures';

describe('metaFromStates', () => {
  it('maps states, registryLoaded false, candidates work', () => {
    const m = metaFromStates({
      'sensor.h': { state: '40', attributes: { device_class: 'humidity', unit_of_measurement: '%', friendly_name: 'H' } },
      'sensor.x': { state: 'unavailable', attributes: {} },
    });
    expect(m.registryLoaded).toBe(false);
    expect(m.entities.get('sensor.h')).toMatchObject({ domain: 'sensor', name: 'H', deviceClass: 'humidity', unit: '%' });
    expect(m.entities.get('sensor.h')).not.toHaveProperty('state');
    expect(candidates(m, ROLE_SPECS.climate_sensor[1], false).map(e => e.entityId)).toEqual(['sensor.h']);
    expect(metaFromStates(undefined).entities.size).toBe(0);
  });
});

describe('presence', () => {
  const live = { 'light.a': { state: 'on' }, 'light.u': { state: 'unavailable' }, 'light.d': { state: 'on' } };
  it('present / unavailable / missing / unknown, from the live states', () => {
    const loaded = makeMeta([ent('light.a'), ent('light.u'), ent('light.d', { disabled: true }), ent('light.reg')]);
    expect(presence(loaded, 'light.d', live)).toBe('unavailable');
    expect(presence(loaded, 'light.a', live)).toBe('present');
    expect(presence(loaded, 'light.u', live)).toBe('unavailable');
    expect(presence(loaded, 'light.reg', live)).toBe('unavailable'); // registry only: not in the states
    expect(presence(loaded, 'light.zzz', live)).toBe('missing');
    const notLoaded = makeMeta([ent('light.a')], [], [], false);
    expect(presence(notLoaded, 'light.a', live)).toBe('present');
    expect(presence(notLoaded, 'light.zzz', live)).toBe('unknown');
  });

  it('follows a state flipping to unavailable with the same meta', () => {
    const meta = makeMeta([ent('light.a')]);
    expect(presence(meta, 'light.a', { 'light.a': { state: 'on' } })).toBe('present');
    expect(presence(meta, 'light.a', { 'light.a': { state: 'unavailable' } })).toBe('unavailable');
  });

  it('stateOf reads the live state text; null when the entity has no state', () => {
    expect(stateOf({ 'sensor.t': { state: '21.5' } }, 'sensor.t')).toBe('21.5');
    expect(stateOf({ 'sensor.n': { state: 7 } }, 'sensor.n')).toBe('7');
    expect(stateOf({}, 'sensor.t')).toBeNull();
    expect(stateOf(undefined, 'sensor.t')).toBeNull();
  });
});

describe('sameStructure', () => {
  const a = {
    'sensor.t': { state: '21', attributes: { friendly_name: 'T', device_class: 'temperature', unit_of_measurement: '°C' } },
    'light.k': { state: 'on', attributes: { friendly_name: 'Kitchen', brightness: 10 } },
  };
  it('state values and other attributes do not change the structure', () => {
    expect(sameStructure(a, a)).toBe(true);
    expect(sameStructure(a, { ...a, 'sensor.t': { ...a['sensor.t'], state: '22' } })).toBe(true);
    expect(sameStructure(a, { ...a, 'light.k': { state: 'off', attributes: { friendly_name: 'Kitchen', brightness: 99 } } })).toBe(true);
    expect(sameStructure(undefined, {})).toBe(true);
  });
  it('a changed icon attribute does not rebuild the metadata', () => {
    const attrs = a['sensor.t'].attributes;
    expect(sameStructure(a, { ...a, 'sensor.t': { state: '21', attributes: { ...attrs, icon: 'mdi:x' } } })).toBe(true);
  });
  it('a new or removed entity, or a changed name, class or unit, does', () => {
    const attrs = a['sensor.t'].attributes;
    expect(sameStructure(a, { ...a, 'sensor.new': { state: '1', attributes: {} } })).toBe(false);
    expect(sameStructure(a, { 'sensor.t': a['sensor.t'] })).toBe(false);
    expect(sameStructure(a, { ...a, 'sensor.t': { state: '21', attributes: { ...attrs, device_class: 'humidity' } } })).toBe(false);
    expect(sameStructure(a, { ...a, 'sensor.t': { state: '21', attributes: { ...attrs, unit_of_measurement: '°F' } } })).toBe(false);
    expect(sameStructure(a, { ...a, 'sensor.t': { state: '21', attributes: { ...attrs, friendly_name: 'T2' } } })).toBe(false);
    expect(sameStructure(a, undefined)).toBe(false);
  });
});

describe('loadRegistries / mergeMeta', () => {
  const answers: Record<string, unknown> = {
    'config/entity_registry/list': [
      { entity_id: 'sensor.t', device_id: 'd1', area_id: null, name: null, original_name: 'T reg', hidden_by: null, disabled_by: null, entity_category: 'diagnostic', icon: null },
      { entity_id: 'sensor.orig', device_id: null, area_id: null, name: null, original_name: 'X', hidden_by: null, disabled_by: null, entity_category: null, icon: null },
      { entity_id: 'light.off', device_id: null, area_id: 'a1', name: 'Off light', hidden_by: 'user', disabled_by: 'integration', entity_category: null, icon: 'mdi:x' },
    ],
    'config/device_registry/list': [{ id: 'd1', name: 'Dev', name_by_user: 'My dev', model: 'M1', area_id: 'a2' }],
    'config/area_registry/list': [{ area_id: 'a1', name: 'Hall' }, { area_id: 'a2', name: 'Kitchen' }],
  };
  function fakeHass() {
    const calls: string[] = [];
    const hass = { connection: { sendMessagePromise: async <T>(msg: Record<string, unknown>): Promise<T> => { calls.push(String(msg.type)); return answers[String(msg.type)] as T; } } };
    return { hass, calls };
  }

  it('maps fields', async () => {
    const { hass, calls } = fakeHass();
    const r = await loadRegistries(hass);
    expect([...calls].sort()).toEqual(['config/area_registry/list', 'config/device_registry/list', 'config/entity_registry/list']);
    expect(r.entities.get('sensor.t')).toMatchObject({ name: 'T reg', deviceId: 'd1', category: 'diagnostic', hidden: false, disabled: false });
    expect(r.entities.get('light.off')).toMatchObject({ hidden: true, disabled: true, areaId: 'a1', name: 'Off light' });
    expect(r.devices.get('d1')).toEqual({ id: 'd1', name: 'My dev', model: 'M1', areaId: 'a2' });
    expect(r.areas.get('a1')).toBe('Hall');
  });

  it('entity metadata has no icon and takes class and unit from live states only', async () => {
    const { hass } = fakeHass();
    const r = await loadRegistries(hass);
    const e = r.entities.get('light.off')!;
    expect(e).not.toHaveProperty('icon');
    expect(e.deviceClass).toBeNull();
    expect(e.unit).toBeNull();
  });

  it('rejects when one command fails', async () => {
    const hass = { connection: { sendMessagePromise: async <T>(msg: Record<string, unknown>): Promise<T> => {
      if (msg.type === 'config/device_registry/list') throw new Error('boom');
      return [] as T;
    } } };
    await expect(loadRegistries(hass)).rejects.toThrow('boom');
  });

  it('merge sets registryLoaded; registry fields win, live class and unit kept', async () => {
    const regs = await loadRegistries(fakeHass().hass);
    const states = { 'sensor.t': { state: '99', attributes: { device_class: 'temperature', unit_of_measurement: '°C' } }, 'sensor.only': { state: '1', attributes: {} } };
    const m = mergeMeta(metaFromStates(states), regs);
    expect(m.registryLoaded).toBe(true);
    expect(m.entities.get('sensor.orig')!.name).toBe('X');
    expect(m.entities.get('sensor.t')).toMatchObject({ name: 'T reg', deviceClass: 'temperature', unit: '°C', category: 'diagnostic', deviceId: 'd1' });
    expect(m.entities.has('sensor.only')).toBe(true);
    expect(m.entities.has('light.off')).toBe(true);
    expect(presence(m, 'light.off', states)).toBe('unavailable');
    expect(presence(m, 'sensor.t', states)).toBe('present');
  });

  it('name precedence: live friendly_name, registry name, original_name, entity id', () => {
    const regs = {
      entities: new Map([
        ['light.k', ent('light.k', { name: 'light.k' })],
        ['light.foo', ent('light.foo', { name: 'Foo' })],
      ]),
      devices: new Map(), areas: new Map(),
    };
    const base = metaFromStates({ 'light.k': { state: 'on', attributes: { friendly_name: 'Kitchen light' } } });
    const m = mergeMeta(base, regs);
    expect(m.entities.get('light.k')!.name).toBe('Kitchen light');
    expect(m.entities.get('light.foo')!.name).toBe('Foo');
  });
});
