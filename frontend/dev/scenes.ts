import type { Device, Plan } from '../src/model/types';
import type { PowerFrame, PowerSchema } from '../src/model/power';
import { rectRoomLevel } from '../test/fixtures';

/** A named dev-harness state: the plans seeded into the mock store and the power frame the mock answers with. */
export interface Scene { plans: Plan[]; powerFrame?: PowerFrame }

function room(): Plan {
  const level = rectRoomLevel(4000, 3000, 100);
  level.zones = [{
    id: 'r0', name: 'Room 1', invalid: false,
    shape: {
      kind: 'walls', seed: { x: 2000, y: 1500 }, broken: false,
      outline: [{ x: 50, y: 50 }, { x: 3950, y: 50 }, { x: 3950, y: 2950 }, { x: 50, y: 2950 }],
    },
  }];
  level.devices = [
    {
      id: 'd-light', name: 'Ceiling light', invalid: false,
      placement: { mode: 'free', x: 2000, y: 1500, rotation: 0 },
      props: { kind: 'ceiling_light', shape: 'round', diameter: 300, length: 600, width: 100, poolRadius: null },
    },
    {
      id: 'd-socket', name: 'Socket', invalid: false,
      placement: { mode: 'wall', wallId: 'w2', side: 'left', offset: 1000 },
      props: { kind: 'socket' },
    },
  ];
  return { id: 'room', name: 'Room', schemaVersion: 2, revision: 1, levels: [level] };
}

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
      { id: 'pc', kind: 'device', x: 440, y: 700, deviceId: 'd-pc' },
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
 * +37 W at 62 / 61 / 63 %, RCBO 0 W at 229.8 V with its read-only switch on, PC 251.4 W, Boiler 0 W with its switch off.
 */

/** Position B: the inverter output path is idle, the bypass is live, the Boiler is off, the remainder is solved. */
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
    'w-pc': { power: 251.4, state: 'live' },
    'w-boiler': { power: 0, state: 'live' },
    'w-rem': { power: 1108.6, state: 'live' },
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
    pc: { power: 251.4 },
    boiler: { power: 0, switch: 'off' },
    rem: { power: 1108.6 },
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
  room: { plans: [room()] },
  power: { plans: [powerPlan()], powerFrame: POWER_FRAME },
  'power-off': { plans: [powerPlan()], powerFrame: POWER_OFF_FRAME },
  'power-nodata': { plans: [powerPlan()], powerFrame: { wires: {}, blocks: {} } },
};
