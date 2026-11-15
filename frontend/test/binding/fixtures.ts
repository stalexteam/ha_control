import type { HaMeta, EntityMeta, DeviceMeta } from '../../src/binding/ha-meta';

export function ent(entityId: string, o: Partial<EntityMeta> = {}): EntityMeta {
  return {
    entityId, domain: entityId.split('.')[0], name: entityId, deviceClass: null, unit: null,
    deviceId: null, areaId: null, hidden: false, disabled: false, category: null, ...o,
  };
}

export function makeMeta(entities: EntityMeta[], devices: DeviceMeta[] = [], areas: [string, string][] = [], registryLoaded = true): HaMeta {
  return {
    entities: new Map(entities.map(e => [e.entityId, e])),
    devices: new Map(devices.map(d => [d.id, d])),
    areas: new Map(areas),
    registryLoaded,
  };
}

export function fixtureMeta(registryLoaded = true): HaMeta {
  return makeMeta([
    ent('sensor.hum', { name: 'Humidity', deviceClass: 'humidity', unit: '%' }),
    ent('sensor.bat', { name: 'Battery', deviceClass: 'battery', unit: '%' }),
    ent('sensor.pct', { name: 'Classless pct', unit: '%' }),
    ent('sensor.pow', { name: 'Power', deviceClass: 'power', unit: 'W' }),
    ent('sensor.w', { name: 'Classless W', unit: 'W' }),
    ent('sensor.diag_pow', { name: 'Diag power', deviceClass: 'power', unit: 'W', category: 'diagnostic' }),
    ent('light.hidden', { name: 'Hidden light', hidden: true }),
    ent('light.main', { name: 'Main light' }),
    ent('binary_sensor.occ', { name: 'Occupancy', deviceClass: 'occupancy' }),
    ent('binary_sensor.door', { name: 'Door', deviceClass: 'door' }),
    ent('event.btn', { name: 'Button' }),
    ent('sensor.t_wc', { name: 'Temp WC', deviceClass: 'temperature', unit: '°C', deviceId: 'dev1' }),
    ent('sensor.h_wc', { name: 'Hum WC', deviceClass: 'humidity', unit: '%', deviceId: 'dev1' }),
  ], [{ id: 'dev1', name: 'Sensor WC', model: null, areaId: 'a1' }], [['a1', 'Main']], registryLoaded);
}
