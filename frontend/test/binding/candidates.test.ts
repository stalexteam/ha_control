import { describe, it, expect } from 'vitest';
import { candidates, entityLabel } from '../../src/binding/candidates';
import { ROLE_SPECS } from '../../src/model/bindings';
import type { DeviceKind } from '../../src/model/types';
import { ent, fixtureMeta, makeMeta } from './fixtures';

const ids = (l: readonly { entityId: string }[]) => l.map(e => e.entityId).sort();
const spec = (k: DeviceKind, role: string) => ROLE_SPECS[k].find(s => s.role === role)!;

describe('candidates', () => {
  const meta = fixtureMeta();
  it('humidity: class match or classless unit; battery excluded', () => {
    expect(ids(candidates(meta, spec('climate_sensor', 'humidity'), false))).toEqual(['sensor.h_wc', 'sensor.hum', 'sensor.pct']);
  });
  it('power excludes diagnostic; showAll includes it and keeps domain filter only', () => {
    expect(ids(candidates(meta, spec('socket', 'power'), false))).toEqual(['sensor.pow', 'sensor.w']);
    const all = ids(candidates(meta, spec('socket', 'power'), true));
    expect(all).toContain('sensor.diag_pow');
    expect(all).toContain('sensor.bat');
  });
  it('control excludes hidden light, showAll includes', () => {
    expect(ids(candidates(meta, spec('ceiling_light', 'control'), false))).toEqual(['light.main']);
    expect(ids(candidates(meta, spec('ceiling_light', 'control'), true))).toContain('light.hidden');
  });
  it('motion includes occupancy and excludes door', () => {
    expect(ids(candidates(meta, spec('motion_sensor', 'motion'), false))).toEqual(['binary_sensor.occ']);
  });
  it('on: events and plain sensors (no class, no unit), diagnostic allowed; measuring sensors and config excluded', () => {
    const m = makeMeta([
      ent('event.btn'),
      ent('sensor.sw_action', { category: 'diagnostic' }), // Zigbee2MQTT action sensor
      ent('sensor.sw_battery', { deviceClass: 'battery', unit: '%', category: 'diagnostic' }),
      ent('sensor.sw_lqi', { unit: 'lqi', category: 'diagnostic' }),
      ent('sensor.temp', { deviceClass: 'temperature', unit: '°C' }),
      ent('sensor.cfg', { category: 'config' }),
      ent('sensor.hidden_action', { hidden: true }),
    ]);
    expect(ids(candidates(m, spec('smart_button', 'on'), false))).toEqual(['event.btn', 'sensor.sw_action']);
    expect(ids(candidates(m, spec('smart_button', 'on'), true))).toHaveLength(7);
    // off and auto share the filter.
    expect(ids(candidates(m, spec('smart_button', 'off'), false))).toEqual(['event.btn', 'sensor.sw_action']);
    expect(ids(candidates(m, spec('smart_button', 'auto'), false))).toEqual(['event.btn', 'sensor.sw_action']);
  });
  it('wall switch state: lights, relays and binary sensors', () => {
    const m = makeMeta([ent('light.l'), ent('switch.s'), ent('binary_sensor.b'), ent('sensor.x')]);
    expect(ids(candidates(m, spec('wall_switch', 'state'), false))).toEqual(['binary_sensor.b', 'light.l', 'switch.s']);
  });
  it('sorted by name then id, memoised', () => {
    const a = candidates(meta, spec('climate_sensor', 'humidity'), false);
    expect(a.map(e => e.name)).toEqual([...a.map(e => e.name)].sort((x, y) => x.localeCompare(y)));
    expect(candidates(meta, spec('climate_sensor', 'humidity'), false)).toBe(a);
  });
});

describe('entityLabel', () => {
  it('Area > Device context, entity id fallback', () => {
    expect(entityLabel(fixtureMeta(), 'sensor.t_wc')).toEqual({ name: 'Temp WC', context: 'Main ▸ Sensor WC' });
    expect(entityLabel(fixtureMeta(), 'sensor.hum').context).toBe('sensor.hum');
    expect(entityLabel(fixtureMeta(), 'nope.x')).toEqual({ name: 'nope.x', context: 'nope.x' });
  });
});
