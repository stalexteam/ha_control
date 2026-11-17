import type { Device, DeviceProps, Plan, Rule, Zone } from '../src/model/types';
import type { RuleTrace } from '../src/live/rules-feed';
import { fitWallMount } from '../src/geometry/devices';
import type { PowerFrame, PowerSchema } from '../src/model/power';
import { rectRoomLevel } from '../test/fixtures';

/** A named dev-harness state: the plans seeded into the mock store and the power frame the mock answers with. */
export interface Scene { plans: Plan[]; powerFrame?: PowerFrame; rulesFrame?: Record<string, RuleTrace> }

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
  'vent-na': { plans: [room()], rulesFrame: { ...ROOM_RULES, 'rule-vent': VENT_NA } },
  'vent-long': {
    plans: [ventLongPlan()],
    rulesFrame: { ...ROOM_RULES, 'rule-vent': { ...ROOM_RULES['rule-vent'], last: { ...ROOM_RULES['rule-vent'].last!, error: 'target unavailable' } } },
  },
  flow: { plans: [flowPlan()], rulesFrame: FLOW_RULES },
  power: { plans: [powerPlan()], powerFrame: POWER_FRAME },
  'power-off': { plans: [powerPlan()], powerFrame: POWER_OFF_FRAME },
  'power-nodata': { plans: [powerPlan()], powerFrame: { wires: {}, blocks: {} } },
};
