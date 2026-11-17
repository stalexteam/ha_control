import type { Device, DeviceProps, Plan, Rule, Zone } from '../src/model/types';
import type { BeurerTrace, ControlTrace, OutsideTrace, RuleTrace } from '../src/live/rules-feed';
import { fitWallMount } from '../src/geometry/devices';
import type { PowerFrame, PowerSchema } from '../src/model/power';
import { rectRoomLevel } from '../test/fixtures';

/**
 * A named dev-harness state: the plans seeded into the mock store, the power and rules frames the mock answers with,
 * and live states replacing the demo sample's.
 */
export interface Scene { plans: Plan[]; powerFrame?: PowerFrame; rulesFrame?: Record<string, RuleTrace>; states?: Record<string, unknown> }

function room(): Plan {
  const level = rectRoomLevel(4000, 3000, 100);
  // A short partition meeting the top wall mid-length (a T joint): n4 sits on w0's axis at 2000.
  level.nodes.push({ id: 'n4', x: 2000, y: 0, host: { wallId: 'w0', offset: 2000 } }, { id: 'n5', x: 2000, y: 600 });
  level.walls.push({ id: 'w4', a: 'n4', b: 'n5', thickness: 100, type: 'partition', baseline: 'center' });
  const box: DeviceProps = { kind: 'equipment', shape: 'rect', width: 600, depth: 400, diameter: 600, icon: 'mdi:flash', label: '' };
  const poly = (id: string, name: string, pts: [number, number][]): Zone => ({
    id, name, invalid: false, shape: { kind: 'polygon', vertices: pts.map(([x, y]) => ({ kind: 'free', x, y })) },
  });
  // Overlapping zones: "Door" and "Middle" lie inside the room's walls zone, "Yard" is outdoors.
  level.zones = [{
    id: 'r0', name: 'Main', invalid: false,
    shape: {
      kind: 'walls', seed: { x: 2000, y: 1500 }, broken: false,
      outline: [{ x: 50, y: 50 }, { x: 3950, y: 50 }, { x: 3950, y: 2950 }, { x: 50, y: 2950 }],
    },
  },
  poly('z-door', 'Door', [[50, 1900], [1300, 1900], [1300, 2950], [50, 2950]]),
  poly('z-mid', 'Middle', [[1700, 700], [3300, 700], [3300, 2300], [1700, 2300]]),
  poly('z-yard', 'Yard', [[-500, 3400], [4500, 3400], [4500, 5000], [-500, 5000]]),
  ];
  level.devices = [
    {
      id: 'd-light', name: 'Ceiling light', invalid: false, bindings: { control: 'light.kitchen_ceiling' },
      placement: { mode: 'free', x: 2000, y: 1500, rotation: 0 },
      props: { kind: 'ceiling_light', shape: 'round', diameter: 300, length: 600, width: 100, poolRadius: null },
    },
    {
      id: 'd-socket', name: 'Socket', invalid: false, bindings: { control: 'switch.kitchen_socket', power: 'sensor.kitchen_socket_power' },
      placement: { mode: 'wall', wallId: 'w2', side: 'left', offset: 1000 },
      props: { kind: 'socket' },
    },
    {
      id: 'd-leak', name: 'Leak sensor', invalid: false, bindings: { leak: 'binary_sensor.bath_leak' },
      placement: { mode: 'free', x: 800, y: 700, rotation: 0 },
      props: { kind: 'leak_sensor' },
    },
    {
      id: 'd-lux', name: 'Light sensor', invalid: false, bindings: { illuminance: 'sensor.hall_lux' },
      placement: { mode: 'free', x: 1500, y: 700, rotation: 0 },
      props: { kind: 'illuminance_sensor' },
    },
    {
      id: 'd-motion', name: 'Motion sensor', invalid: false, bindings: { motion: 'binary_sensor.hall_motion' },
      placement: { mode: 'free', x: 3000, y: 2400, rotation: 225 },
      props: { kind: 'motion_sensor', zoneAngle: 110, zoneRange: 3000 },
    },
    {
      id: 'd-valve', name: 'Water valve', invalid: false,
      placement: { mode: 'free', x: 1200, y: 700, rotation: 0 },
      props: { kind: 'valve', autoByDoubleToggle: false, windowSec: 3 },
    },
    {
      id: 'd-wc-climate', name: 'WC climate', invalid: false, bindings: { temperature: 'sensor.wc_temperature', humidity: 'sensor.wc_humidity' },
      placement: { mode: 'free', x: 600, y: 2400, rotation: 0 },
      props: { kind: 'climate_sensor' },
    },
    {
      id: 'd-main-climate', name: 'Main climate', invalid: false, bindings: { temperature: 'sensor.main_temperature', humidity: 'sensor.main_humidity' },
      placement: { mode: 'free', x: 3400, y: 2400, rotation: 0 },
      props: { kind: 'climate_sensor' },
    },
    {
      id: 'd-fan', name: 'WC fan', invalid: false, bindings: { control: 'switch.wc_fan' },
      placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 800 },
      props: { kind: 'exhaust_fan', diameter: 100 },
    },
    {
      // Wall-mounted body pushed into the top-right corner: fitWallMount keeps it flush between the faces (offset 3650).
      id: 'd-corner', name: 'Corner box', invalid: false, bindings: {},
      placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 3650 },
      props: { kind: 'equipment', shape: 'rect', width: 600, depth: 400, diameter: 600, icon: 'mdi:flash', label: '' },
    },
    {
      // Wall-mounted body pushed into the partition (offset 1900): fitWallMount stops it flush at its face (1650).
      id: 'd-tee', name: 'Tee box', invalid: false, bindings: {}, props: box,
      placement: fitWallMount(level, box, { mode: 'wall', wallId: 'w0', side: 'right', offset: 1900 }, 0),
    },
  ];
  const rules: Rule[] = [
    {
      id: 'rule-leak', name: 'Leak Main -> valve', zoneId: 'r0', combine: 'any', inputs: [{ source: { device: 'd-leak' } }],
      onDelay: 0, offDelay: 0, onTrue: [{ device: 'd-valve', do: 'close' }], onFalse: [],
    },
    {
      id: 'rule-motion', name: 'Light on motion', zoneId: 'r0', combine: 'all',
      inputs: [{ source: { device: 'd-motion' } }, { source: { device: 'd-socket' }, not: true }],
      onDelay: 0, offDelay: 120, onTrue: [{ device: 'd-light', do: 'on' }], onFalse: [{ device: 'd-light', do: 'off' }],
    },
    {
      id: 'rule-outside', name: 'Outside light Main', zoneId: 'r0', combine: 'all',
      inputs: [
        { source: { light: 'd-lux', below: 10, hysteresis: 5 } },
        { source: { sun: true } },
        { source: { time: { from: '17:00', to: '01:00' } } },
      ],
      gate: { source: { held: { sources: [{ device: 'd-light' }], state: 'any', seconds: 1800 } } },
      onDelay: 0, offDelay: 0, onTrue: [{ device: 'd-light', do: 'on' }], onFalse: [{ device: 'd-light', do: 'off' }],
    },
    {
      id: 'rule-vent', name: 'Vent Main', zoneId: 'r0', combine: 'any', inputs: [],
      vent: { sensor: 'd-wc-climate', than: 'd-main-climate', above: 9, below: 5 },
      onDelay: 0, offDelay: 600, onTrue: [{ device: 'd-fan', do: 'on' }], onFalse: [{ device: 'd-fan', do: 'off' }],
    },
  ];
  return { id: 'room', name: 'Room', schemaVersion: 2, revision: 1, levels: [level], rules };
}

/** The mock's rules snapshot of the room scene: one rule that fired, one waiting for an input without data. */
const ROOM_RULES: Record<string, RuleTrace> = {
  'rule-leak': {
    status: 'ok', verdict: true, inputs: [{ label: 'Leak sensor', value: true, detail: 'wet' }], unknownInputs: 0,
    last: { action: 'close', target: 'Water valve', at: new Date().setHours(21, 43, 0, 0), reason: 'leak' },
  },
  'rule-motion': {
    status: 'waiting', verdict: null, unknownInputs: 1,
    inputs: [{ label: 'Motion sensor', value: true, detail: 'motion' }, { label: 'Socket', value: null, detail: 'unavailable' }],
  },
};

/** Mock trace of the Outside light rule: dark and after sunset, but the gate is closed for another 12 minutes. */
const OUTSIDE_TRACE: RuleTrace = {
  status: 'ok', verdict: true, held: true, unknownInputs: 0,
  inputs: [
    { label: 'Light sensor', value: true, detail: '8 lx' },
    { label: 'Sun', value: true, detail: 'below horizon' },
    { label: 'Time window', value: true, detail: 'in window until 01:00' },
  ],
  gate: { value: false, detail: 'unchanged 18 / 30 min', until: Date.now() + 12 * 60_000 },
};
ROOM_RULES['rule-outside'] = OUTSIDE_TRACE;

/**
 * The room with daylight (scene `daylight`): the Light sensor (lux + sun) reads 8 lx, night; the Porch sensor's lux is
 * unavailable, so the sun (-3.2 deg) gives twilight. Rule "Porch light": Porch night (pending: twilight in 0:42) and
 * the time window, gated by the Light sensor being dark.
 */
function daylightPlan(): Plan {
  const plan = room();
  const level = plan.levels[0];
  level.devices = level.devices.map(d => (d.id === 'd-lux' ? { ...d, bindings: { illuminance: 'sensor.hall_lux', sun: 'sun.sun' } } : d));
  level.devices.push({
    id: 'd-porch', name: 'Porch sensor', invalid: false, bindings: { illuminance: 'sensor.porch_lux', sun: 'sun.sun' },
    placement: { mode: 'free', x: 3500, y: 1500, rotation: 0 }, props: { kind: 'illuminance_sensor', nightBelow: 5, debounce: 90 },
  });
  plan.rules = [...(plan.rules ?? []), {
    id: 'rule-daylight', name: 'Porch light', zoneId: 'r0', combine: 'all',
    inputs: [{ source: { daylight: 'd-porch', is: 'night' } }, { source: { time: { from: '17:00', to: '01:00' } } }],
    gate: { source: { daylight: 'd-lux', is: 'dark' } },
    onDelay: 0, offDelay: 0, onTrue: [{ device: 'd-light', do: 'on' }], onFalse: [{ device: 'd-light', do: 'off' }],
  }];
  return plan;
}

const DAYLIGHT_TRACE: RuleTrace = {
  status: 'ok', verdict: true, unknownInputs: 0,
  inputs: [
    { label: 'Porch sensor', value: true, detail: 'night, sun -3.2° (twilight in 0:42)', until: Date.now() + 42_000 },
    { label: 'Time window', value: true, detail: 'in window until 01:00' },
  ],
  gate: { value: true, detail: 'night, 8 lx' },
};

const DAYLIGHT_STATES: Record<string, unknown> = {
  'sensor.hall_lux': { state: '8', last_changed: new Date().toISOString(), attributes: { friendly_name: 'Hall illuminance', device_class: 'illuminance', unit_of_measurement: 'lx' } },
  'sun.sun': { state: 'below_horizon', last_changed: new Date().toISOString(), attributes: { friendly_name: 'Sun', elevation: -3.2 } },
};
ROOM_RULES['rule-vent'] = {
  status: 'ok', verdict: true, unknownInputs: 0, pending: { to: false, at: Date.now() + 7 * 60_000 },
  inputs: [{
    label: 'WC climate vs Main climate', value: true, detail: '17.4 / 9.7 g/m³ (+79 %)',
    vent: { a: { t: 24, rh: 80, ah: 17.365683782352708, why: null }, b: { t: 22, rh: 50, ah: 9.681989763300054, why: null }, pct: 79 },
  }],
  last: { action: 'on', target: 'WC fan', at: new Date().setHours(21, 43, 0, 0), reason: 'vent' },
};

/** Scene `vent-long`: long sensor names and a last fan call that failed (the diagram clips and adds an error line). */
function ventLongPlan(): Plan {
  const p = room();
  const names: Record<string, string> = {
    'd-wc-climate': 'Bathroom ceiling climate sensor (Aqara T1, by the shower)',
    'd-main-climate': 'Living room reference climate sensor',
  };
  for (const d of p.levels[0].devices) if (names[d.id]) d.name = names[d.id];
  return p;
}

/**
 * Scene `flow`: the room with long device names and more condition rules for the flowchart: `rule-leak2` (two leak
 * sensors close the valve), `rule-many` (ten inputs, six actions on one side only, live trace) and `rule-six` (six
 * inputs, a gate, both sides).
 */
function flowPlan(): Plan {
  const p = room();
  const names: Record<string, string> = {
    'd-leak': 'Leak sensor under the kitchen sink cabinet (Aqara)',
    'd-motion': 'Hallway motion sensor by the entrance door',
    'd-light': 'Ceiling light in the living room, main group',
    'd-valve': 'Cold water main valve in the bathroom riser',
  };
  for (const d of p.levels[0].devices) if (names[d.id]) d.name = names[d.id];
  p.levels[0].devices.push({
    id: 'd-leak2', name: 'Leak WC', invalid: false, bindings: { leak: 'binary_sensor.wc_leak' },
    placement: { mode: 'free', x: 600, y: 2000, rotation: 0 }, props: { kind: 'leak_sensor' },
  });
  const act = (device: string, d: 'on' | 'off' | 'close' | 'open') => ({ device, do: d });
  p.rules!.push({
    id: 'rule-leak2', name: 'Leak WC -> valve', zoneId: 'r0', combine: 'any', onDelay: 0, offDelay: 0,
    inputs: [{ source: { device: 'd-leak2' } }, { source: { device: 'd-leak' } }],
    onTrue: [act('d-valve', 'close')], onFalse: [],
  }, {
    id: 'rule-many', name: 'Ten inputs', zoneId: 'r0', combine: 'any', onDelay: 5, offDelay: 300,
    inputs: [
      { source: { device: 'd-leak' } }, { source: { device: 'd-motion' } }, { source: { device: 'd-socket' }, not: true },
      { source: { light: 'd-lux', below: 10, hysteresis: 5 } }, { source: { sun: true } },
      { source: { time: { from: '22:00', to: '06:30' } } }, { source: { rule: 'rule-leak' } }, { source: { rule: 'rule-motion' }, not: true },
      { source: { held: { sources: [{ device: 'd-light' }, { device: 'd-socket' }], state: 'on', seconds: 5400 } } },
      { source: { device: 'd-fan' } },
    ],
    onTrue: [act('d-light', 'on'), act('d-valve', 'close'), act('d-socket', 'off'), act('d-fan', 'on'), act('d-socket', 'on'), act('d-fan', 'off')],
    onFalse: [],
  }, {
    id: 'rule-six', name: 'Six inputs', zoneId: 'r0', combine: 'all', onDelay: 0, offDelay: 60,
    inputs: [
      { source: { device: 'd-motion' } }, { source: { light: 'd-lux', below: 25, hysteresis: 5 } }, { source: { sun: true } },
      { source: { time: { from: '17:00', to: '01:00' } } }, { source: { device: 'd-socket' }, not: true }, { source: { rule: 'rule-leak' }, not: true },
    ],
    gate: { source: { held: { sources: [{ device: 'd-light' }], state: 'any', seconds: 1800 } } },
    onTrue: [act('d-light', 'on')], onFalse: [act('d-light', 'off'), act('d-fan', 'off')],
  });
  return p;
}

const FLOW_RULES: Record<string, RuleTrace> = {
  ...ROOM_RULES,
  'rule-leak2': {
    status: 'ok', verdict: true, unknownInputs: 0,
    inputs: [{ label: 'Leak WC', value: false, detail: 'dry' }, { label: 'Leak kitchen', value: true, detail: 'wet' }],
    last: { action: 'close', target: 'Cold water main valve', at: new Date().setHours(21, 43, 0, 0), reason: 'leak' },
  },
  'rule-many': {
    status: 'ok', verdict: true, unknownInputs: 1, pending: { to: false, at: Date.now() + 4 * 60_000 },
    inputs: [
      { label: '', value: true, detail: 'wet' }, { label: '', value: false, detail: 'clear' }, { label: '', value: false, detail: 'on' },
      { label: '', value: true, detail: '8 lx' }, { label: '', value: true, detail: 'below horizon' },
      { label: '', value: false, detail: 'outside the window' }, { label: '', value: true, detail: 'true' },
      { label: '', value: null, detail: 'unknown' },
      { label: '', value: false, detail: 'on 40 / 90 min', until: Date.now() + 50 * 60_000 },
      { label: '', value: false, detail: 'off' },
    ],
    last: { action: 'on', target: 'Ceiling light', at: new Date().setHours(21, 43, 0, 0), reason: 'many', error: 'target unavailable' },
  },
};

/** The vent rule while the humidity of the reference sensor is unavailable (scene `vent-na`). */
const VENT_NA: RuleTrace = {
  status: 'waiting', verdict: null, unknownInputs: 1,
  inputs: [{
    label: 'WC climate vs Main climate', value: null, detail: 'unavailable',
    vent: { a: { t: 24, rh: 80, ah: 17.365683782352708, why: null }, b: { t: 22, rh: null, ah: null, why: 'unavailable' }, pct: null },
  }],
  last: { action: 'off', target: 'WC fan', at: new Date().setHours(5, 8, 0, 0), reason: 'vent' },
};

/**
 * Scene `boiler`: the room with a Utility zone in its top-right corner holding the Boiler (control + power) and the
 * wall switch "Button Boiler", the AC-IN grid block with a power entity, and two boiler rules: `rule-boiler` with the
 * power limit (live: blackout, the grid has no data) and `rule-boiler-nl` without it (live: heating, power check
 * countdown). Scene `boiler-limit`: the limited rule waits after a kettle took it over the limit.
 */
function boilerPlan(): Plan {
  const p = room();
  const level = p.levels[0];
  level.zones.push({
    id: 'z-util', name: 'Utility', invalid: false,
    shape: { kind: 'polygon', vertices: [[3300, 100], [4100, 100], [4100, 1300], [3300, 1300]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
  });
  level.devices.push(
    {
      id: 'd-boiler', name: 'Boiler', invalid: false, bindings: { control: 'switch.boiler', power: 'sensor.boiler_power' },
      placement: { mode: 'free', x: 3650, y: 900, rotation: 0 },
      props: { kind: 'equipment', shape: 'circle', width: 600, depth: 400, diameter: 500, icon: 'mdi:water-boiler', label: '', controllable: true },
    },
    {
      id: 'd-button-boiler', name: 'Button Boiler', invalid: false, bindings: { state: 'switch.wallswitch_boiler' },
      placement: { mode: 'wall', wallId: 'w1', side: 'right', offset: 700 },
      props: { kind: 'wall_switch', autoByDoubleToggle: true, windowSec: 3 },
    },
  );
  p.power = { blocks: [{ id: 'grid', kind: 'grid', x: 0, y: 0, name: 'AC-IN', power: 'sensor.grid_power' }], wires: [] };
  const fixed = { combine: 'any' as const, inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
  p.rules!.push(
    { id: 'rule-boiler', name: 'Cost effective boiler Utility', zoneId: 'z-util', ...fixed,
      boiler: { device: 'd-boiler', button: 'd-button-boiler', grid: { block: 'grid', limit: 3000, nominal: 1400 } } },
    { id: 'rule-boiler-nl', name: 'Cost effective boiler, no limit', zoneId: 'z-util', ...fixed,
      boiler: { device: 'd-boiler', button: 'd-button-boiler' } },
  );
  return p;
}

const BOILER_RULES: Record<string, RuleTrace> = {
  ...ROOM_RULES,
  'rule-boiler': {
    status: 'ok', verdict: true, inputs: [], unknownInputs: 0,
    last: { action: 'off', target: 'Boiler', at: new Date().setHours(21, 43, 0, 0), reason: 'blackout' },
    boiler: { mode: 'auto', phase: 'blackout', grid: null, boilerW: 0, headroom: null, relay: 'off' },
  },
  'rule-boiler-nl': {
    status: 'ok', verdict: true, inputs: [], unknownInputs: 0,
    last: { action: 'on', target: 'Boiler', at: new Date().setHours(21, 44, 0, 0), reason: 'auto' },
    boiler: { mode: 'auto', phase: 'heating', grid: null, boilerW: 0, headroom: null, relay: 'on', until: Date.now() + 45_000 },
  },
};

/** The limited boiler rule after a kettle: 546 W + 2000 W kettle + 1400 W nominal over 3000 W, waiting to retry. */
const BOILER_LIMIT_RULES: Record<string, RuleTrace> = {
  ...BOILER_RULES,
  'rule-boiler': {
    status: 'ok', verdict: true, inputs: [], unknownInputs: 0,
    last: { action: 'off', target: 'Boiler', at: new Date().setHours(21, 43, 0, 0), reason: 'power limit' },
    boiler: { mode: 'auto', phase: 'limit', grid: 2546, boilerW: 0, headroom: 3946, relay: 'off' },
  },
  'rule-boiler-nl': {
    status: 'ok', verdict: true, inputs: [], unknownInputs: 0,
    boiler: { mode: 'auto', phase: 'waiting', grid: null, boilerW: 0, headroom: null, relay: 'off', until: Date.now() + 12_000 },
  },
};

/** The limited boiler rule heating within the limit (scene `boiler-heat`): 546 + 1400 - 1380 = 566 of 3000 W. */
const BOILER_HEAT_RULES: Record<string, RuleTrace> = {
  ...BOILER_RULES,
  'rule-boiler': {
    status: 'ok', verdict: true, inputs: [], unknownInputs: 0,
    last: { action: 'on', target: 'Boiler', at: new Date().setHours(21, 44, 0, 0), reason: 'auto' },
    boiler: { mode: 'auto', phase: 'heating', grid: 546, boilerW: 1380, headroom: 566, relay: 'on' },
  },
  'rule-boiler-nl': {
    status: 'ok', verdict: false, inputs: [], unknownInputs: 0,
    boiler: { mode: 'manual', phase: null, grid: null, boilerW: 1380, headroom: null, relay: 'on' },
  },
};

/**
 * Scene `leak`: the room with a second leak sensor (Leak WC) and a second valve (Hot water valve), and the leak
 * protection rule `rule-leakp` over both (live: dry, both valves open). Scene `leak-wet`: Leak WC wet, both valves
 * closed, the last action a re-close of the Water valve. Scene `leak-na`: the kitchen sensor and the Hot water valve
 * unavailable; the close of that valve waits for it.
 */
function leakPlan(): Plan {
  const p = room();
  p.levels[0].devices.push(
    {
      id: 'd-leak2', name: 'Leak WC', invalid: false, bindings: { leak: 'binary_sensor.wc_leak' },
      placement: { mode: 'free', x: 600, y: 2000, rotation: 0 }, props: { kind: 'leak_sensor' },
    },
    {
      id: 'd-valve2', name: 'Hot water valve', invalid: false, bindings: { state: 'valve.hot_water' },
      placement: { mode: 'free', x: 1200, y: 1100, rotation: 0 }, props: { kind: 'valve', autoByDoubleToggle: false, windowSec: 3 },
    },
  );
  p.rules!.push({
    id: 'rule-leakp', name: 'Leak protection Main', zoneId: 'r0', combine: 'any', inputs: [], onDelay: 0, offDelay: 0,
    onTrue: [], onFalse: [], leak: { sensors: ['d-leak2', 'd-leak'], valves: ['d-valve', 'd-valve2'] },
  });
  return p;
}

/** Scene `leak-many`: the leak protection rule over five sensors and four valves (layout of several rows). */
function leakManyPlan(): Plan {
  const p = leakPlan();
  const level = p.levels[0];
  const add = (id: string, name: string, kind: 'leak_sensor' | 'valve', x: number) => level.devices.push(kind === 'leak_sensor'
    ? { id, name, invalid: false, bindings: {}, placement: { mode: 'free', x, y: 2600, rotation: 0 }, props: { kind } }
    : { id, name, invalid: false, bindings: {}, placement: { mode: 'free', x, y: 2700, rotation: 0 }, props: { kind, autoByDoubleToggle: false, windowSec: 3 } });
  add('d-leak3', 'Leak bathroom', 'leak_sensor', 1000);
  add('d-leak4', 'Leak dishwasher', 'leak_sensor', 1400);
  add('d-leak5', 'Leak boiler room', 'leak_sensor', 1800);
  add('d-valve3', 'Boiler inlet valve', 'valve', 2200);
  add('d-valve4', 'Garden valve', 'valve', 2600);
  p.rules!.find(r => r.id === 'rule-leakp')!.leak = {
    sensors: ['d-leak2', 'd-leak', 'd-leak3', 'd-leak4', 'd-leak5'], valves: ['d-valve', 'd-valve2', 'd-valve3', 'd-valve4'],
  };
  return p;
}

const valves = (a: 'open' | 'closed' | null, b: 'open' | 'closed' | null) => ({
  valves: [{ id: 'd-valve', name: 'Water valve', state: a }, { id: 'd-valve2', name: 'Hot water valve', state: b }],
});
const LEAK_DRY: RuleTrace = {
  status: 'ok', verdict: false, unknownInputs: 0, leak: valves('open', 'open'),
  inputs: [{ label: 'Leak WC', value: false, detail: 'dry' }, { label: 'Leak sensor', value: false, detail: 'dry' }],
};
const LEAK_WET: RuleTrace = {
  status: 'ok', verdict: true, unknownInputs: 0, leak: valves('closed', 'closed'),
  inputs: [{ label: 'Leak WC', value: true, detail: 'wet' }, { label: 'Leak sensor', value: false, detail: 'dry' }],
  last: { action: 'close', target: 'Water valve', at: new Date().setHours(21, 47, 0, 0), reason: 're-closed: leak' },
};
const LEAK_NA: RuleTrace = {
  status: 'error', reason: 'target unavailable', verdict: true, unknownInputs: 1, leak: valves('closed', null),
  inputs: [{ label: 'Leak WC', value: true, detail: 'wet' }, { label: 'Leak sensor', value: null, detail: 'unavailable' }],
  last: { action: 'close', target: 'Hot water valve', at: new Date().setHours(21, 43, 0, 0), reason: 'leak', error: 'waiting for target' },
};

/**
 * Scene `timed`: the room with a WC zone in its top-right corner holding the smart button "Button vent" (1 hold
 * starts, 2 hold stops) and the fan "Vent", the wall switch "Switch hall", and two timed switch rules: `rule-timed`
 * "Vent (10min)" and the inverted `rule-timed-inv` (Switch hall -> Socket off for 30 min, then on). Live: both idle,
 * the vent's last run ended by time. Scene `timed-run`: the vent runs (ends in 8:12). Scene `timed-else`: the vent
 * was switched off elsewhere. Scene `timed-inv`: the inverted rule runs; the vent run started with the vent already on.
 */
function timedPlan(): Plan {
  const p = room();
  const level = p.levels[0];
  level.zones.push({
    id: 'z-wc', name: 'WC', invalid: false,
    shape: { kind: 'polygon', vertices: [[3300, 100], [3950, 100], [3950, 1000], [3300, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
  });
  level.devices.push(
    {
      id: 'd-button-vent', name: 'Button vent', invalid: false, bindings: { on: 'sensor.button_vent_action' },
      placement: { mode: 'wall', wallId: 'w1', side: 'right', offset: 800 },
      props: {
        kind: 'smart_button', separateOff: true, autoEnabled: false,
        on: { slot: 1, event: 'hold' }, off: { slot: 2, event: 'hold' }, auto: { slot: 0, event: 'double' },
      },
    },
    {
      id: 'd-vent', name: 'Vent', invalid: false, bindings: { control: 'switch.vent' },
      placement: { mode: 'wall', wallId: 'w1', side: 'right', offset: 400 },
      props: { kind: 'exhaust_fan', diameter: 100 },
    },
    {
      id: 'd-switch-hall', name: 'Switch hall', invalid: false, bindings: { state: 'switch.wallswitch_hall' },
      placement: { mode: 'wall', wallId: 'w3', side: 'right', offset: 1500 },
      props: { kind: 'wall_switch', autoByDoubleToggle: false, windowSec: 3 },
    },
  );
  const fixed = { combine: 'any' as const, inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
  p.rules!.push(
    { id: 'rule-timed', name: 'Vent (10min)', zoneId: 'z-wc', ...fixed, timed: { button: 'd-button-vent', device: 'd-vent', minutes: 10 } },
    { id: 'rule-timed-inv', name: 'Socket pause', zoneId: 'r0', ...fixed, timed: { button: 'd-switch-hall', device: 'd-socket', minutes: 30, invert: true } },
  );
  return p;
}

const at = (h: number, m: number): number => new Date().setHours(h, m, 0, 0);
const TIMED_IDLE: Record<string, RuleTrace> = {
  ...ROOM_RULES,
  'rule-timed': {
    status: 'ok', verdict: false, inputs: [], unknownInputs: 0, timed: { running: false, device: 'off' },
    last: { action: 'off', target: 'Vent', at: at(21, 43), reason: 'time over' },
  },
  'rule-timed-inv': { status: 'ok', verdict: false, inputs: [], unknownInputs: 0, timed: { running: false, device: 'on' } },
};
const TIMED_RUN: Record<string, RuleTrace> = {
  ...TIMED_IDLE,
  'rule-timed': {
    status: 'ok', verdict: true, inputs: [], unknownInputs: 0, timed: { running: true, until: Date.now() + 492_000, device: 'on' },
    last: { action: 'on', target: 'Vent', at: at(21, 50), reason: 'button start' },
  },
};
const TIMED_ELSE: Record<string, RuleTrace> = {
  ...TIMED_IDLE,
  'rule-timed': {
    status: 'ok', verdict: false, inputs: [], unknownInputs: 0, timed: { running: false, device: 'off' },
    last: { action: 'off', target: 'Vent', at: at(21, 46), reason: 'ended: switched elsewhere', sent: false },
  },
};
const TIMED_INV: Record<string, RuleTrace> = {
  ...TIMED_IDLE,
  'rule-timed': {
    status: 'ok', verdict: true, inputs: [], unknownInputs: 0, timed: { running: true, until: Date.now() + 185_000, device: 'on' },
    last: { action: 'on', target: 'Vent', at: at(21, 50), reason: 'button start', sent: false },
  },
  'rule-timed-inv': {
    status: 'ok', verdict: true, inputs: [], unknownInputs: 0, timed: { running: true, until: Date.now() + 1_385_000, device: 'off' },
    last: { action: 'off', target: 'Socket', at: at(21, 40), reason: 'button start' },
  },
};

/**
 * Scene `outside`: the room with the ceiling light "Yard light" in the Yard zone and two outside light rules on it:
 * `rule-yard` "Yard light" (Light sensor, no data = night, after sunset, pause 30 min) and `rule-yard-win` "Yard
 * evening" (also the window 17:00-23:00, pause 0). Live: night, the yard light on; the evening rule in its window at
 * twilight (night in 0:42). Scene `outside-paused`: someone switched the light off, paused for 12:34 more. Scene
 * `outside-day`: day, off. Scene `outside-window`: night, but the evening rule is outside its window.
 */
function outsidePlan(): Plan {
  const p = room();
  p.levels[0].devices.push({
    id: 'd-yard-light', name: 'Yard light', invalid: false, bindings: { control: 'light.yard' },
    placement: { mode: 'free', x: 2000, y: 4200, rotation: 0 },
    props: { kind: 'ceiling_light', shape: 'round', diameter: 300, length: 600, width: 100, poolRadius: null },
  });
  const fixed = { combine: 'any' as const, inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
  p.rules!.push(
    { id: 'rule-yard', name: 'Yard light', zoneId: 'z-yard', ...fixed, outside: { light: 'd-yard-light', sensor: 'd-lux', noDataNight: true, afterSunset: true, pause: 30 } },
    { id: 'rule-yard-win', name: 'Yard evening', zoneId: 'z-yard', ...fixed, outside: { light: 'd-yard-light', sensor: 'd-lux', afterSunset: true, window: { from: '17:00', to: '23:00' }, pause: 0 } },
  );
  return p;
}

const outsideTrace = (o: Partial<OutsideTrace>, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: true, unknownInputs: 0,
  inputs: [{ label: 'Light sensor', value: o.daylight === 'night', detail: o.detail ?? '' }, { label: 'Sun', value: o.sun === 'below', detail: `${o.sun} horizon` }],
  outside: { daylight: 'night', detail: '5 lx', sun: 'below', window: null, light: 'on', ...o },
  ...over,
});
const YARD_NIGHT = outsideTrace({}, { last: { action: 'on', target: 'Yard light', at: at(19, 42), reason: 'became true: Light sensor night, 5 lx, Sun below horizon' } });
const YARD_EVENING = outsideTrace(
  { daylight: 'twilight', detail: '12 lx (night in 1:00)', until: Date.now() + 42_000, window: true, windowUntil: Date.now() + 2 * 3600_000 + 754_000, light: 'on' },
  { verdict: false, last: { action: 'off', target: 'Yard light', at: at(19, 42), reason: 'kept on by Yard light', sent: false } },
);
const OUTSIDE_RULES: Record<string, RuleTrace> = { ...ROOM_RULES, 'rule-yard': YARD_NIGHT, 'rule-yard-win': YARD_EVENING };
const OUTSIDE_PAUSED: Record<string, RuleTrace> = {
  ...OUTSIDE_RULES,
  'rule-yard': outsideTrace({ detail: '4 lx', pausedUntil: Date.now() + 754_000, light: 'off' }, {
    last: { action: 'off', target: 'Yard light', at: Date.now() - 1_046_000, reason: 'switched elsewhere: paused 30 min', sent: false },
  }),
};
const OUTSIDE_DAY: Record<string, RuleTrace> = {
  ...OUTSIDE_RULES,
  'rule-yard': outsideTrace({ daylight: 'day', detail: '1240 lx', sun: 'above', light: 'off' }, {
    verdict: false, last: { action: 'off', target: 'Yard light', at: at(7, 12), reason: 'became false: Light sensor day, 1240 lx' },
  }),
  'rule-yard-win': outsideTrace({ daylight: 'day', detail: '1240 lx', sun: 'above', window: false, windowUntil: Date.now() + 9 * 3600_000, light: 'off' }, { verdict: false }),
};
const OUTSIDE_WINDOW: Record<string, RuleTrace> = {
  ...OUTSIDE_RULES,
  'rule-yard-win': outsideTrace({ window: false, windowUntil: Date.now() + 17 * 3600_000 + 754_000 }, {
    verdict: false, last: { action: 'off', target: 'Yard light', at: at(23, 0), reason: 'kept on by Yard light', sent: false },
  }),
};

/**
 * Scene `beurer`: the room with the heater "Leg heater" (a metered controllable device) and the power source "Desk PC" (power binding) and the
 * rule `rule-beurer` "Beurer heater" in the Yard zone. Live: the PC draws 312 W, the heater is on, next re-power in 12:34.
 * Scene `beurer-cycle`: the socket's off phase (0:03 left). `beurer-kept`: the PC reading dropped out, kept 4:12 more, the
 * off delay running. `beurer-due`: the pad's timer is not fresh, re-power due. `beurer-idle`: nothing wanted, heater off.
 */
function beurerPlan(): Plan {
  const p = room();
  p.levels[0].devices.push(
    equipment('d-leg', 'Leg heater', free(2000, 4200), { control: 'switch.leg_heater', power: 'sensor.leg_heater_power' }, { controllable: true }),
    equipment('d-desk', 'Desk PC', free(3200, 4200), { power: 'sensor.desk_pc_power' }),
  );
  p.rules!.push({
    id: 'rule-beurer', name: 'Beurer heater Yard', zoneId: 'z-yard', combine: 'any', inputs: [], onDelay: 0, offDelay: 60, onTrue: [], onFalse: [],
    beurer: { heater: 'd-leg', source: 'd-desk', above: 200, keep: 10, every: 30 },
  });
  return p;
}

/**
 * Scene `control`: the `timed` room with a load control rule `rule-control` "Load control Main": sources Switch hall
 * (wall switch), Button vent (smart button, On / Off) and Motion sensor, loads Ceiling light, Vent and Socket. Live: the
 * switch on, the motion clear, the light on and the socket without data; the last entry a repeat of the switch.
 * Scene `control-error`: the last command failed (target unavailable). Scene `control-many`: five loads (two rows).
 */
function controlPlan(extraLoads = false): Plan {
  const p = timedPlan();
  if (extraLoads) {
    p.levels[0].devices.push({
      id: 'd-heater', name: 'Bathroom heater', invalid: false, bindings: { control: 'switch.heater' }, placement: { mode: 'free', x: 3000, y: 1800, rotation: 0 },
      props: { kind: 'equipment', shape: 'rect', width: 400, depth: 300, diameter: 400, icon: 'mdi:radiator', label: '', controllable: true },
    });
  }
  p.rules = p.rules!.filter(r => r.timed === undefined);
  p.rules.push({
    id: 'rule-control', name: 'Load control Main', zoneId: 'r0', combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [],
    control: { sources: ['d-switch-hall', 'd-button-vent', 'd-motion'], loads: ['d-light', 'd-vent', 'd-socket', ...(extraLoads ? ['d-fan', 'd-heater'] : [])] },
  });
  return p;
}

const controlTrace = (over: Partial<RuleTrace> = {}, c: Partial<ControlTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: null, unknownInputs: 0, inputs: [],
  control: {
    sources: [
      { id: 'd-switch-hall', name: 'Switch hall', kind: 'wall_switch', state: 'on' },
      { id: 'd-button-vent', name: 'Button vent', kind: 'smart_button', state: null },
      { id: 'd-motion', name: 'Motion sensor', kind: 'motion_sensor', state: 'off' },
    ],
    loads: [
      { id: 'd-light', name: 'Ceiling light', state: 'on' },
      { id: 'd-vent', name: 'Vent', state: 'off' },
      { id: 'd-socket', name: 'Socket', state: null },
    ],
    ...c,
  },
  last: { action: 'on', target: 'Socket', at: at(21, 43), reason: 'Switch hall: on' },
  ...over,
});

const beurerTrace = (b: Partial<BeurerTrace>, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: true, unknownInputs: 0, inputs: [],
  beurer: { watts: 312, detail: '312 W', heater: 'on', fresh: true, cycleAt: Date.now() + 754_000, ...b },
  last: { action: 'on', target: 'Leg heater', at: at(21, 10), reason: 're-power' },
  ...over,
});
const BEURER_RULES: Record<string, RuleTrace> = { ...ROOM_RULES, 'rule-beurer': beurerTrace({}) };

const equipment = (id: string, name: string, placement: Device['placement'], bindings: Device['bindings'],
  flags: { inverter?: true; controllable?: true } = {}): Device => ({
  id, name, invalid: false, bindings, placement,
  props: { kind: 'equipment', shape: 'rect', width: 600, depth: 400, diameter: 600, icon: 'mdi:flash', label: '', ...flags },
});
const free = (x: number, y: number): Device['placement'] => ({ mode: 'free', x, y, rotation: 0 });

/**
 * The owner's installation (spec §9 live check): AC-IN -> Main bus -> Inverter (PV roof, battery bus with three
 * batteries) -> RCBO output -> Apartment input (transfer A; B is the bypass from the Main bus) -> Apartment bus ->
 * PC, Boiler and the remainder. Units are screen px at 100 %. Stored in the one device model: the inverter is an
 * equipment device with the inverter flag, the RCBO a metered switch (read-only) that is not on the plan, and the
 * level is marked switchesMigrated, so the panel's migration leaves it as it is.
 */
function powerPlan(): Plan {
  const level = rectRoomLevel(6000, 4000, 200);
  level.devices = [
    equipment('d-inverter', 'Inverter', free(1000, 1000),
      { power_in: 'sensor.inverter_in_power', power_out: 'sensor.inverter_out_power' }, { inverter: true }),
    {
      id: 'd-pc', name: 'PC', invalid: false, bindings: { power: 'sensor.pc_power' },
      placement: { mode: 'wall', wallId: 'w0', side: 'right', offset: 3000 }, props: { kind: 'socket' },
    },
    equipment('d-boiler', 'Boiler', free(4500, 2500), { control: 'switch.boiler', power: 'sensor.boiler_power' },
      { controllable: true }),
    equipment('d-rcbo', 'RCBO output', { mode: 'none' },
      { power: 'sensor.rcbo_power', voltage: 'sensor.rcbo_voltage', control: 'switch.rcbo' }),
  ];
  level.switchesMigrated = true;
  const power: PowerSchema = {
    blocks: [
      { id: 'grid', kind: 'grid', x: 620, y: 30, name: 'AC-IN', power: 'sensor.grid_power', voltage: 'sensor.grid_voltage' },
      { id: 'main', kind: 'bus', x: 480, y: 150, w: 640, h: 20, name: 'Main bus' },
      { id: 'inv', kind: 'device', x: 620, y: 230, deviceId: 'd-inverter' },
      { id: 'pv', kind: 'pv', x: 340, y: 228, name: 'PV roof', power: 'sensor.pv_roof_power' },
      { id: 'batbus', kind: 'bus', x: 120, y: 340, w: 400, h: 20, name: 'Battery bus' },
      { id: 'b1', kind: 'battery', x: 120, y: 410, name: 'BAT 1', power: 'sensor.bat1_power', soc: 'sensor.bat1_soc' },
      { id: 'b2', kind: 'battery', x: 260, y: 410, name: 'BAT 2', power: 'sensor.bat2_power', soc: 'sensor.bat2_soc' },
      { id: 'b3', kind: 'battery', x: 400, y: 410, name: 'BAT 3', power: 'sensor.bat3_power', soc: 'sensor.bat3_soc' },
      { id: 'rcbo', kind: 'device', x: 620, y: 370, deviceId: 'd-rcbo' },
      {
        id: 'ts', kind: 'transfer', x: 611.5, y: 520, name: 'Apartment input', form: '2in1out',
        portPins: { B: { side: 'right', at: 0.5 } },
      },
      { id: 'apt', kind: 'bus', x: 380, y: 630, w: 600, h: 20, name: 'Apartment bus' },
      { id: 'pc', kind: 'device', x: 440, y: 700, deviceId: 'd-pc', output: false },
      { id: 'boiler', kind: 'device', x: 620, y: 700, deviceId: 'd-boiler' },
      { id: 'rem', kind: 'remainder', x: 800, y: 700, name: 'Other' },
    ],
    wires: [
      { id: 'w-grid', from: { block: 'grid', port: 'OUT' }, to: { bus: 'main', at: 0.3125 } },
      { id: 'w-inv-in', from: { bus: 'main', at: 0.3125 }, to: { block: 'inv', port: 'IN' } },
      { id: 'w-bypass', from: { bus: 'main', at: 0.875 }, to: { block: 'ts', port: 'B' } },
      { id: 'w-pv', from: { block: 'pv', port: 'OUT' }, to: { block: 'inv', port: 'PV' } },
      { id: 'w-bat', from: { block: 'inv', port: 'BAT' }, to: { bus: 'batbus', at: 0.9 } },
      { id: 'w-b1', from: { bus: 'batbus', at: 0.15 }, to: { block: 'b1', port: 'BAT' } },
      { id: 'w-b2', from: { bus: 'batbus', at: 0.5 }, to: { block: 'b2', port: 'BAT' } },
      { id: 'w-b3', from: { bus: 'batbus', at: 0.85 }, to: { block: 'b3', port: 'BAT' } },
      { id: 'w-inv-out', from: { block: 'inv', port: 'OUT' }, to: { block: 'rcbo', port: 'IN' } },
      { id: 'w-rcbo', from: { block: 'rcbo', port: 'OUT' }, to: { block: 'ts', port: 'A' } },
      { id: 'w-apt', from: { block: 'ts', port: 'OUT' }, to: { bus: 'apt', at: 0.5 } },
      { id: 'w-pc', from: { bus: 'apt', at: 0.2 }, to: { block: 'pc', port: 'IN' } },
      { id: 'w-boiler', from: { bus: 'apt', at: 0.5 }, to: { block: 'boiler', port: 'IN' } },
      { id: 'w-rem', from: { bus: 'apt', at: 0.8 }, to: { block: 'rem', port: 'IN' } },
    ],
  };
  return { id: 'power', name: 'Power', schemaVersion: 2, revision: 1, levels: [level], power };
}

/*
 * Frames computed by the server evaluator (power.py `evaluate`) for powerPlan() from these readings: grid 1060 W at
 * 231.4 V, inverter input -300 W (exporting through its input) and output 0 W, PV roof 500 W, batteries +40 / +38 /
 * +37 W at 62 / 61 / 63 %, RCBO 0 W at 229.8 V with its read-only switch on, PC unavailable (position B) or 0 W (position 0), Boiler 0 W with its switch off.
 */

/**
 * Position B: the inverter output path is idle, the bypass is live, the Boiler is off. The PC's power entity is
 * unavailable (its block carries the alert mark), so the remainder absorbs it: 1360 W less the Boiler's 0 W.
 */
const POWER_FRAME: PowerFrame = {
  wires: {
    'w-grid': { power: 1060, state: 'live' },
    'w-inv-in': { power: -300, state: 'live' },
    'w-bypass': { power: 1360, state: 'live' },
    'w-pv': { power: 500, state: 'live' },
    'w-bat': { power: 115, state: 'live' },
    'w-b1': { power: 40, state: 'live' },
    'w-b2': { power: 38, state: 'live' },
    'w-b3': { power: 37, state: 'live' },
    'w-inv-out': { power: 0, state: 'live' },
    'w-rcbo': { power: 0, state: 'live' },
    'w-apt': { power: 1360, state: 'live' },
    'w-pc': { power: null, state: 'live' },
    'w-boiler': { power: 0, state: 'live' },
    'w-rem': { power: 1360, state: 'live' },
  },
  blocks: {
    grid: { power: 1060, voltage: 231.4 },
    inv: { power_in: -300, power_out: 0, loss: 85 },
    pv: { power: 500 },
    b1: { power: 40, soc: 62 },
    b2: { power: 38, soc: 61 },
    b3: { power: 37, soc: 63 },
    rcbo: { power: 0, voltage: 229.8, switch: 'on' },
    ts: { position: 'B' },
    pc: { power: null, alert: ['unavailable:sensor.pc_power'] },
    boiler: { power: 0, switch: 'off' },
    rem: { power: 1360, absorbed: ['pc'] },
  },
};

/** Position 0 (grid -300 W, PC 0 W): the apartment side is de-energized; the inverter exports 300 W to the grid. */
const POWER_OFF_FRAME: PowerFrame = {
  wires: {
    'w-grid': { power: -300, state: 'live' },
    'w-inv-in': { power: -300, state: 'live' },
    'w-bypass': { power: 0, state: 'live' },
    'w-pv': { power: 500, state: 'live' },
    'w-bat': { power: 115, state: 'live' },
    'w-b1': { power: 40, state: 'live' },
    'w-b2': { power: 38, state: 'live' },
    'w-b3': { power: 37, state: 'live' },
    'w-inv-out': { power: 0, state: 'live' },
    'w-rcbo': { power: 0, state: 'live' },
    'w-apt': { power: 0, state: 'dead' },
    'w-pc': { power: 0, state: 'dead' },
    'w-boiler': { power: 0, state: 'dead' },
    'w-rem': { power: 0, state: 'dead' },
  },
  blocks: {
    grid: { power: -300, voltage: 231.4 },
    inv: { power_in: -300, power_out: 0, loss: 85 },
    pv: { power: 500 },
    b1: { power: 40, soc: 62 },
    b2: { power: 38, soc: 61 },
    b3: { power: 37, soc: 63 },
    rcbo: { power: 0, voltage: 229.8, switch: 'on' },
    ts: { position: '0' },
    pc: { power: 0 },
    boiler: { power: 0, switch: 'off' },
    rem: { power: 0 },
  },
};

export const SCENES: Record<string, Scene> = {
  room: { plans: [room()], rulesFrame: ROOM_RULES },
  daylight: { plans: [daylightPlan()], rulesFrame: { ...ROOM_RULES, 'rule-daylight': DAYLIGHT_TRACE }, states: DAYLIGHT_STATES },
  'vent-na': { plans: [room()], rulesFrame: { ...ROOM_RULES, 'rule-vent': VENT_NA } },
  'vent-long': {
    plans: [ventLongPlan()],
    rulesFrame: { ...ROOM_RULES, 'rule-vent': { ...ROOM_RULES['rule-vent'], last: { ...ROOM_RULES['rule-vent'].last!, error: 'target unavailable' } } },
  },
  flow: { plans: [flowPlan()], rulesFrame: FLOW_RULES },
  power: { plans: [powerPlan()], powerFrame: POWER_FRAME },
  'power-off': { plans: [powerPlan()], powerFrame: POWER_OFF_FRAME },
  'power-nodata': { plans: [powerPlan()], powerFrame: { wires: {}, blocks: {} } },
  boiler: { plans: [boilerPlan()], rulesFrame: BOILER_RULES },
  leak: { plans: [leakPlan()], rulesFrame: { ...ROOM_RULES, 'rule-leakp': LEAK_DRY } },
  'leak-wet': { plans: [leakPlan()], rulesFrame: { ...ROOM_RULES, 'rule-leakp': LEAK_WET } },
  'leak-many': { plans: [leakManyPlan()], rulesFrame: ROOM_RULES },
  'leak-na': { plans: [leakPlan()], rulesFrame: { ...ROOM_RULES, 'rule-leakp': LEAK_NA } },
  'boiler-limit': { plans: [boilerPlan()], rulesFrame: BOILER_LIMIT_RULES },
  'boiler-heat': { plans: [boilerPlan()], rulesFrame: BOILER_HEAT_RULES },
  timed: { plans: [timedPlan()], rulesFrame: TIMED_IDLE },
  'timed-run': { plans: [timedPlan()], rulesFrame: TIMED_RUN },
  'timed-else': { plans: [timedPlan()], rulesFrame: TIMED_ELSE },
  'timed-inv': { plans: [timedPlan()], rulesFrame: TIMED_INV },
  outside: { plans: [outsidePlan()], rulesFrame: OUTSIDE_RULES },
  'outside-paused': { plans: [outsidePlan()], rulesFrame: OUTSIDE_PAUSED },
  'outside-day': { plans: [outsidePlan()], rulesFrame: OUTSIDE_DAY },
  'outside-window': { plans: [outsidePlan()], rulesFrame: OUTSIDE_WINDOW },
  control: { plans: [controlPlan()], rulesFrame: { ...ROOM_RULES, 'rule-control': controlTrace() } },
  'control-error': { plans: [controlPlan()], rulesFrame: { ...ROOM_RULES, 'rule-control': controlTrace({ status: 'error', reason: 'target unavailable', last: { action: 'on', target: 'Socket', at: at(21, 43), reason: 'Button vent: toggle', error: 'target unavailable' } }) } },
  'control-many': {
    plans: [controlPlan(true)],
    rulesFrame: { ...ROOM_RULES, 'rule-control': controlTrace({}, { loads: [
      { id: 'd-light', name: 'Ceiling light', state: 'on' }, { id: 'd-vent', name: 'Vent', state: 'off' }, { id: 'd-socket', name: 'Socket', state: null },
      { id: 'd-fan', name: 'WC fan', state: 'on' }, { id: 'd-heater', name: 'Bathroom heater', state: 'off' },
    ] }) },
  },
  beurer: { plans: [beurerPlan()], rulesFrame: BEURER_RULES },
  'beurer-cycle': { plans: [beurerPlan()], rulesFrame: { ...ROOM_RULES, 'rule-beurer': beurerTrace({ cycleAt: undefined, pausedUntil: Date.now() + 3_000, heater: 'off' }) } },
  'beurer-kept': { plans: [beurerPlan()], rulesFrame: { ...ROOM_RULES, 'rule-beurer': beurerTrace({ watts: null, detail: 'no data, kept', keptUntil: Date.now() + 252_000 }, { pending: { to: false, at: Date.now() + 45_000 } }) } },
  'beurer-due': { plans: [beurerPlan()], rulesFrame: { ...ROOM_RULES, 'rule-beurer': beurerTrace({ fresh: false, cycleAt: undefined }) } },
  'beurer-idle': { plans: [beurerPlan()], rulesFrame: { ...ROOM_RULES, 'rule-beurer': beurerTrace({ watts: 4, detail: '4 W', heater: 'off', fresh: false, cycleAt: undefined }, { verdict: false, last: { action: 'off', target: 'Leg heater', at: at(22, 5), reason: 'became false: Power below 200 W' } }) } },
};
