import { describe, it, expect } from 'vitest';
import { loadRegistries, mergeMeta, metaFromStates, presence } from '../../src/binding/ha-meta';
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
    expect(m.entities.get('sensor.h')).toMatchObject({ domain: 'sensor', name: 'H', deviceClass: 'humidity', unit: '%', state: '40' });
    expect(candidates(m, ROLE_SPECS.climate_sensor[1], false).map(e => e.entityId)).toEqual(['sensor.h']);
    expect(metaFromStates(undefined).entities.size).toBe(0);
  });
});

describe('presence', () => {
  it('present / unavailable / missing / unknown', () => {
    const loaded = makeMeta([ent('light.a'), ent('light.u', { state: 'unavailable' }), ent('light.d', { disabled: true })]);
    expect(presence(loaded, 'light.d')).toBe('unavailable');
    expect(presence(loaded, 'light.a')).toBe('present');
    expect(presence(loaded, 'light.u')).toBe('unavailable');
    expect(presence(loaded, 'light.zzz')).toBe('missing');
    const notLoaded = makeMeta([ent('light.a')], [], [], false);
    expect(presence(notLoaded, 'light.a')).toBe('present');
    expect(presence(notLoaded, 'light.zzz')).toBe('unknown');
  });
});

describe('loadRegistries / mergeMeta', () => {
  const answers: Record<string, unknown> = {
    'config/entity_registry/list': [
      { entity_id: 'sensor.t', device_id: 'd1', area_id: null, name: null, original_name: 'T reg', hidden_by: null, disabled_by: null, entity_category: 'diagnostic', icon: null, original_icon: 'mdi:thermometer' },
      { entity_id: 'sensor.orig', device_id: null, area_id: null, name: null, original_name: 'X', hidden_by: null, disabled_by: null, entity_category: null, icon: null, original_icon: null },
      { entity_id: 'light.off', device_id: null, area_id: 'a1', name: 'Off light', hidden_by: 'user', disabled_by: 'integration', entity_category: null, icon: 'mdi:x', original_icon: 'mdi:y' },
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
    expect(r.entities.get('sensor.t')).toMatchObject({ name: 'T reg', deviceId: 'd1', category: 'diagnostic', icon: 'mdi:thermometer', hidden: false, disabled: false });
    expect(r.entities.get('light.off')).toMatchObject({ hidden: true, disabled: true, icon: 'mdi:x', areaId: 'a1', name: 'Off light', state: 'unavailable' });
    expect(r.devices.get('d1')).toEqual({ id: 'd1', name: 'My dev', model: 'M1', areaId: 'a2' });
    expect(r.areas.get('a1')).toBe('Hall');
  });

  it('rejects when one command fails', async () => {
    const hass = { connection: { sendMessagePromise: async <T>(msg: Record<string, unknown>): Promise<T> => {
      if (msg.type === 'config/device_registry/list') throw new Error('boom');
      return [] as T;
    } } };
    await expect(loadRegistries(hass)).rejects.toThrow('boom');
  });

  it('merge sets registryLoaded; registry fields win, live state kept', async () => {
    const regs = await loadRegistries(fakeHass().hass);
    const base = metaFromStates({ 'sensor.t': { state: '99', attributes: { device_class: 'temperature', unit_of_measurement: '°C' } }, 'sensor.only': { state: '1', attributes: {} } });
    const m = mergeMeta(base, regs);
    expect(m.registryLoaded).toBe(true);
    expect(m.entities.get('sensor.orig')!.name).toBe('X');
    expect(m.entities.get('sensor.t')).toMatchObject({ name: 'T reg', state: '99', category: 'diagnostic', deviceId: 'd1' });
    expect(m.entities.has('sensor.only')).toBe(true);
    expect(m.entities.has('light.off')).toBe(true);
    expect(presence(m, 'light.off')).toBe('unavailable');
    expect(presence(m, 'sensor.t')).toBe('present');
  });

  it('name precedence: live friendly_name, registry name, original_name, entity id', () => {
    const regs = {
      entities: new Map([
        ['light.k', ent('light.k', { name: 'light.k', state: 'unavailable' })],
        ['light.foo', ent('light.foo', { name: 'Foo', state: 'unavailable' })],
      ]),
      devices: new Map(), areas: new Map(),
    };
    const base = metaFromStates({ 'light.k': { state: 'on', attributes: { friendly_name: 'Kitchen light' } } });
    const m = mergeMeta(base, regs);
    expect(m.entities.get('light.k')!.name).toBe('Kitchen light');
    expect(m.entities.get('light.foo')!.name).toBe('Foo');
  });
});
