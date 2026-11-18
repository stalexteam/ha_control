/** A small Home Assistant sample for the dev harness: live states and the three registries, one HA device per kind. */

interface DemoEntity {
  id: string; name: string; state: string; device?: string; cls?: string; unit?: string; category?: string; attrs?: Record<string, unknown>;
}

const AREAS = [
  { area_id: 'kitchen', name: 'Kitchen' },
  { area_id: 'hall', name: 'Hall' },
  { area_id: 'bath', name: 'Bathroom' },
  { area_id: 'utility', name: 'Utility' },
];

const DEVICES = [
  { id: 'kitchen_ceiling', name: 'Kitchen ceiling', model: 'LED-900', area_id: 'kitchen' },
  { id: 'hall_sconce', name: 'Hall sconce', model: null, area_id: 'hall' },
  { id: 'hall_motion', name: 'Hall motion sensor', model: 'MS-1', area_id: 'hall' },
  { id: 'bath_climate', name: 'Bath climate', model: 'TH-1', area_id: 'bath' },
  { id: 'hall_switch', name: 'Hall switch', model: 'SW-2', area_id: 'hall' },
  { id: 'kitchen_socket', name: 'Kitchen socket', model: 'Plug-16A', area_id: 'kitchen' },
  { id: 'bath_fan', name: 'Bath fan', model: null, area_id: 'bath' },
  { id: 'boiler', name: 'Boiler', model: 'B-80', area_id: 'utility' },
  { id: 'bath_leak', name: 'Bath leak sensor', model: 'LS-1', area_id: 'bath' },
  { id: 'water_valve', name: 'Water valve', model: 'V-1', area_id: 'utility' },
  { id: 'living_speaker', name: 'Living room speaker', model: 'SP-1', area_id: 'hall' },
];

const ENTITIES: DemoEntity[] = [
  { id: 'light.kitchen_ceiling', name: 'Kitchen ceiling', state: 'on', device: 'kitchen_ceiling' },
  { id: 'light.hall_sconce', name: 'Hall sconce', state: 'off', device: 'hall_sconce' },
  { id: 'binary_sensor.hall_motion', name: 'Hall motion', state: 'on', device: 'hall_motion', cls: 'motion' },
  { id: 'sensor.hall_lux', name: 'Hall illuminance', state: '120', device: 'hall_motion', cls: 'illuminance', unit: 'lx' },
  { id: 'sensor.bath_temp', name: 'Bath temperature', state: '23.4', device: 'bath_climate', cls: 'temperature', unit: '°C' },
  { id: 'sensor.bath_hum', name: 'Bath humidity', state: '61', device: 'bath_climate', cls: 'humidity', unit: '%' },
  { id: 'sensor.bath_battery', name: 'Bath climate battery', state: '87', device: 'bath_climate', cls: 'battery', unit: '%', category: 'diagnostic' },
  { id: 'event.hall_switch_button', name: 'Hall switch button', state: '2026-11-15T08:00:00+00:00', device: 'hall_switch' },
  { id: 'switch.hall_switch_relay', name: 'Hall switch relay', state: 'off', device: 'hall_switch' },
  { id: 'switch.kitchen_socket', name: 'Kitchen socket', state: 'on', device: 'kitchen_socket' },
  { id: 'sensor.kitchen_socket_power', name: 'Kitchen socket power', state: '309', device: 'kitchen_socket', cls: 'power', unit: 'W' },
  { id: 'fan.bath_fan', name: 'Bath fan', state: 'unavailable', device: 'bath_fan' },
  { id: 'switch.boiler', name: 'Boiler', state: 'on', device: 'boiler' },
  { id: 'sensor.boiler_power', name: 'Boiler power', state: '1.8', device: 'boiler', cls: 'power', unit: 'kW' },
  { id: 'binary_sensor.bath_leak', name: 'Bath leak', state: 'on', device: 'bath_leak', cls: 'moisture' },
  { id: 'valve.water_valve', name: 'Water valve', state: 'open', device: 'water_valve' },
  { id: 'media_player.living_room', name: 'Living room speaker', state: 'idle', device: 'living_speaker' },
  { id: 'media_player.hall', name: 'Hall player', state: 'playing' },
  { id: 'tts.piper', name: 'Piper', state: 'unknown' },
  { id: 'sun.sun', name: 'Sun', state: 'above_horizon', attrs: { elevation: 24.5 } },
  { id: 'sensor.porch_lux', name: 'Porch illuminance', state: 'unavailable', cls: 'illuminance', unit: 'lx' },
  { id: 'sensor.boiler_voltage', name: 'Boiler voltage', state: '229', device: 'boiler', cls: 'voltage', unit: 'V' },
];

/** Fixed offsets from module load, so the Binding screenshot shows timers however late it is taken. */
const AGO: Record<string, number> = {
  'light.kitchen_ceiling': 42_000, 'binary_sensor.hall_motion': 7_000, 'binary_sensor.bath_leak': 192_000,
};

export const DEMO_STATES: Record<string, unknown> = Object.fromEntries(ENTITIES.map(e => [e.id, {
  state: e.state,
  last_changed: new Date(Date.now() - (AGO[e.id] ?? 3_600_000)).toISOString(),
  attributes: {
    friendly_name: e.name,
    ...(e.cls ? { device_class: e.cls } : {}),
    ...(e.unit ? { unit_of_measurement: e.unit } : {}),
    ...e.attrs,
  },
}]));

/** Answers of config/entity_registry/list, config/device_registry/list and config/area_registry/list. */
export const DEMO_REGISTRY: Record<string, unknown> = {
  'config/entity_registry/list': ENTITIES.map(e => ({
    entity_id: e.id, device_id: e.device ?? null, area_id: null, name: null, original_name: e.name,
    hidden_by: null, disabled_by: null, entity_category: e.category ?? null,
  })),
  'config/device_registry/list': DEVICES,
  'config/area_registry/list': AREAS,
};

/** The notify services of the sample (a phone's Binding select); the names under `hass.services.notify`. */
export const DEMO_SERVICES: Record<string, Record<string, unknown>> = {
  notify: { mobile_app_phone: {}, notify: {}, persistent_notification: {} },
};
