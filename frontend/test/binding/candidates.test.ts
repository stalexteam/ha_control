import { describe, it, expect } from 'vitest';
import { autoFill, candidates, entityLabel, haDevicesFor } from '../../src/binding/candidates';
import { ROLE_SPECS } from '../../src/model/bindings';
import { addDevice, setDeviceProps } from '../../src/model/devices';
import { deviceDefaults, type DeviceKind } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';
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
  it('final and state: lights and relays', () => {
    const m = makeMeta([ent('light.l'), ent('switch.s'), ent('binary_sensor.b'), ent('sensor.x')]);
    expect(ids(candidates(m, spec('smart_button', 'final'), false))).toEqual(['light.l', 'switch.s']);
    expect(ids(candidates(m, spec('wall_switch', 'state'), false))).toEqual(['binary_sensor.b', 'light.l', 'switch.s']);
  });
  it('sorted by name then id, memoised', () => {
    const a = candidates(meta, spec('climate_sensor', 'humidity'), false);
    expect(a.map(e => e.name)).toEqual([...a.map(e => e.name)].sort((x, y) => x.localeCompare(y)));
    expect(candidates(meta, spec('climate_sensor', 'humidity'), false)).toBe(a);
  });
});

describe('haDevicesFor', () => {
  it('lists devices with a strict candidate', () => {
    expect(haDevicesFor(fixtureMeta(), 'climate_sensor').map(d => d.id)).toEqual(['dev1']);
    expect(haDevicesFor(fixtureMeta(), 'socket')).toEqual([]);
  });

  it('smart button: lists a device with an action sensor, ignores the final spec (a device with only a light)', () => {
    const meta = makeMeta([
      ent('sensor.sw_action', { category: 'diagnostic', deviceId: 'z' }),
      ent('light.l', { deviceId: 'lamp' }),
    ], [{ id: 'z', name: 'Button', model: null, areaId: null }, { id: 'lamp', name: 'Lamp', model: null, areaId: null }]);
    expect(haDevicesFor(meta, 'smart_button').map(d => d.id)).toEqual(['z']);
    expect(haDevicesFor(meta, 'wall_switch').map(d => d.id)).toEqual(['lamp']);
  });

  it('is memoised per meta and kind', () => {
    const meta = fixtureMeta();
    expect(haDevicesFor(meta, 'climate_sensor')).toBe(haDevicesFor(meta, 'climate_sensor'));
    expect(haDevicesFor(fixtureMeta(), 'climate_sensor')).not.toBe(haDevicesFor(meta, 'climate_sensor'));
  });
});

describe('autoFill', () => {
  const add = (kind: DeviceKind) => {
    const r = addDevice(rectRoomLevel(3000, 4000, 400), deviceDefaults(kind, 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 500 }, 'D');
    return { level: r.level, id: r.deviceId! };
  };
  it('fills both climate roles', () => {
    const { level, id } = add('climate_sensor');
    const r = autoFill(level, id, 'dev1', fixtureMeta());
    expect(r.level.devices[0].bindings).toEqual({ temperature: 'sensor.t_wc', humidity: 'sensor.h_wc' });
    expect([...r.filled].sort()).toEqual(['humidity', 'temperature']);
    expect(r.ambiguous).toEqual([]);
  });
  it('fills a Zigbee2MQTT smart button from its diagnostic action sensor, not from battery or link quality', () => {
    const meta = makeMeta([
      ent('sensor.sw_action', { category: 'diagnostic', deviceId: 'z' }),
      ent('sensor.sw_battery', { deviceClass: 'battery', unit: '%', category: 'diagnostic', deviceId: 'z' }),
      ent('sensor.sw_lqi', { unit: 'lqi', category: 'diagnostic', deviceId: 'z' }),
    ]);
    const { level, id } = add('smart_button');
    const r = autoFill(level, id, 'z', meta);
    expect(r.level.devices[0].bindings).toEqual({ on: 'sensor.sw_action' });
    expect(r.ambiguous).toEqual([]);
  });
  it('fills only on of a smart button, whatever roles are active', () => {
    const meta = makeMeta([
      ent('sensor.sw_action', { category: 'diagnostic', deviceId: 'z' }),
      ent('light.l', { deviceId: 'z' }),
    ]);
    for (const flags of [{ autoEnabled: true }, { separateOff: true, autoEnabled: true }]) {
      const { level, id } = add('smart_button');
      const set = setDeviceProps(level, id, flags);
      const r = autoFill(set, id, 'z', meta);
      expect(r.level.devices[0].bindings).toEqual({ on: 'sensor.sw_action' });
      expect(r.filled).toEqual(['on']);
      expect(r.ambiguous).toEqual([]);
    }
  });
  it('fills the state of a wall switch', () => {
    const meta = makeMeta([ent('switch.relay', { deviceId: 'w' })]);
    const { level, id } = add('wall_switch');
    expect(autoFill(level, id, 'w', meta).level.devices[0].bindings).toEqual({ state: 'switch.relay' });
  });
  it('ambiguous when two candidates; never overwrites', () => {
    const meta = makeMeta([
      ent('sensor.p1', { deviceClass: 'power', unit: 'W', deviceId: 'd' }),
      ent('sensor.p2', { deviceClass: 'power', unit: 'W', deviceId: 'd' }),
      ent('switch.s', { deviceId: 'd' }),
    ]);
    const { level, id } = add('socket');
    const r = autoFill(level, id, 'd', meta);
    expect(r.ambiguous).toEqual(['power']);
    expect(r.level.devices[0].bindings).toEqual({ control: 'switch.s' });
    const pre = { ...level, devices: [{ ...level.devices[0], bindings: { control: 'switch.other' } }] };
    const r2 = autoFill(pre, id, 'd', meta);
    expect(r2.level.devices[0].bindings).toEqual({ control: 'switch.other' });
    expect(r2.filled).toEqual([]);
  });
});

describe('entityLabel', () => {
  it('Area > Device context, entity id fallback', () => {
    expect(entityLabel(fixtureMeta(), 'sensor.t_wc')).toEqual({ name: 'Temp WC', context: 'Main ▸ Sensor WC' });
    expect(entityLabel(fixtureMeta(), 'sensor.hum').context).toBe('sensor.hum');
    expect(entityLabel(fixtureMeta(), 'nope.x')).toEqual({ name: 'nope.x', context: 'nope.x' });
  });
});
