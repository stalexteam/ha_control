import { describe, it, expect } from 'vitest';
import { markSwitchesMigrated, migrateDevices } from '../../src/model/migrate-devices';
import { setDeviceControllable } from '../../src/model/devices';
import type { PlanDoc, PowerSchema, PowerWire } from '../../src/model/power';
import { deviceDefaults, emptyLevel, type Device, type DeviceKind, type Level } from '../../src/model/types';

const dev = (id: string, kind: DeviceKind, bindings?: Device['bindings']): Device => ({
  id, name: id, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 }, props: deviceDefaults(kind, 'free'),
  ...(bindings ? { bindings } : {}),
});
const levelOf = (...devices: Device[]): Level => ({ ...emptyLevel('L1'), devices });
/** A stored v0.7 schematic: its raw blocks may be meters or carry a block-level inverter flag. */
const doc = (level: Level, blocks: Record<string, unknown>[], wires: PowerWire[] = []): PlanDoc =>
  ({ level, power: { blocks, wires } as unknown as PowerSchema });
const grid = { id: 'g', kind: 'grid', x: 0, y: 0 };

describe('migrateDevices', () => {
  it('migrate meter with switch', () => {
    const pins = { IN: { side: 'left', at: 0.5 } };
    const wires: PowerWire[] = [
      { id: 'w1', from: { block: 'g', port: 'OUT' }, to: { block: 'rcbo', port: 'IN' } },
      { id: 'w2', from: { block: 'rcbo', port: 'OUT' }, to: { block: 'r', port: 'IN' } },
    ];
    const d = doc(levelOf(), [
      grid,
      {
        id: 'rcbo', kind: 'meter', x: 10, y: 200, name: 'RCBO output', portPins: pins, power: 'sensor.rcbo_power',
        voltage: 'sensor.rcbo_v', switch: { entity: 'switch.rcbo', controllable: false },
      },
      { id: 'r', kind: 'remainder', x: 0, y: 400 },
    ], wires);
    const m = migrateDevices(d);
    expect(m.level.devices).toHaveLength(1);
    const dv = m.level.devices[0];
    expect(dv).toMatchObject({
      name: 'RCBO output', placement: { mode: 'none' }, invalid: false,
      bindings: { power: 'sensor.rcbo_power', voltage: 'sensor.rcbo_v', control: 'switch.rcbo' },
    });
    expect(dv.props.kind).toBe('equipment');
    expect('controllable' in dv.props).toBe(false);
    expect(m.power!.blocks[1]).toEqual({ id: 'rcbo', kind: 'device', deviceId: dv.id, x: 10, y: 200, name: 'RCBO output', portPins: pins });
    expect(m.power!.blocks[0]).toBe(d.power!.blocks[0]);
    expect(m.power!.wires).toEqual(wires);
  });

  it('a controllable meter switch makes a controllable device; unnamed meters are "Meter N" among the converted ones', () => {
    const m = migrateDevices(doc(levelOf(), [
      grid,
      { id: 'a', kind: 'meter', x: 0, y: 100 },
      { id: 'b', kind: 'meter', x: 0, y: 200, name: 'Main', switch: { entity: 'switch.main', controllable: true } },
      { id: 'c', kind: 'meter', x: 0, y: 300, name: '' },
    ]));
    expect(m.level.devices.map(d => d.name)).toEqual(['Meter 1', 'Main', 'Meter 3']);
    expect(m.level.devices[0].bindings).toBeUndefined();
    expect(m.level.devices[1].props).toMatchObject({ kind: 'equipment', controllable: true });
    expect(m.level.devices[1].bindings).toEqual({ control: 'switch.main' });
    expect(m.power!.blocks.map(b => b.kind)).toEqual(['grid', 'device', 'device', 'device']);
  });

  it('a malformed meter is left for normalizePower to drop: no device is made for it', () => {
    const d = doc(levelOf(), [grid, { id: 'bad', kind: 'meter', x: 'a', y: 0, power: 'sensor.p' }]);
    expect(migrateDevices(d)).toBe(d);
  });

  it('migrate inverter block', () => {
    const d = doc(levelOf(dev('inv', 'equipment', { power: 'sensor.inv' })), [
      grid, { id: 'b-inv', kind: 'device', x: 0, y: 100, deviceId: 'inv', inverter: true },
    ]);
    const m = migrateDevices(d);
    expect(m.level.devices[0].props).toMatchObject({ kind: 'equipment', inverter: true });
    expect(m.level.devices[0].bindings).toEqual({ power_out: 'sensor.inv' });
    expect(m.power!.blocks[1]).toEqual({ id: 'b-inv', kind: 'device', x: 0, y: 100, deviceId: 'inv' });
  });

  it('a block-level inverter flag on another kind (or a false one) is dropped and the device is untouched', () => {
    const d = doc(levelOf(dev('s', 'socket', { power: 'sensor.s' }), dev('e', 'equipment', { power: 'sensor.e' })), [
      { id: 'b-s', kind: 'device', x: 0, y: 0, deviceId: 's', inverter: true },
      { id: 'b-e', kind: 'device', x: 0, y: 0, deviceId: 'e', inverter: false },
    ]);
    const m = migrateDevices(d);
    expect(m.level).toBe(d.level);
    expect(m.power!.blocks.map(b => 'inverter' in b)).toEqual([false, false]);
  });

  it('migrate keeps controls operable', () => {
    const d: PlanDoc = {
      level: levelOf(dev('boiler', 'equipment', { control: 'switch.boiler' }), dev('s', 'socket', { control: 'switch.s' }),
        dev('bare', 'equipment')),
    };
    const m = migrateDevices(d);
    expect(m.level.devices[0].props).toMatchObject({ kind: 'equipment', controllable: true });
    expect(m.level.devices[1]).toBe(d.level.devices[1]);
    expect(m.level.devices[2]).toBe(d.level.devices[2]);
    expect(m.power).toBeUndefined();
  });

  it('migrate is idempotent', () => {
    const d = doc(levelOf(dev('inv', 'equipment', { power: 'sensor.inv' }), dev('boiler', 'equipment', { control: 'switch.boiler' })), [
      grid,
      { id: 'b-inv', kind: 'device', x: 0, y: 100, deviceId: 'inv', inverter: true },
      { id: 'rcbo', kind: 'meter', x: 0, y: 200, name: 'RCBO', switch: { entity: 'switch.rcbo', controllable: false } },
    ]);
    const once = migrateDevices(d);
    expect(once).not.toBe(d);
    expect(migrateDevices(once)).toBe(once);
    // The converted meter's switch stays read-only, the old plan device's switch stays operable.
    expect(once.level.devices.map(x => x.props.kind === 'equipment' && !!x.props.controllable)).toEqual([false, true, false]);

    const plain: PlanDoc = { level: levelOf(dev('s', 'socket', { control: 'switch.s' }), dev('l', 'ceiling_light'), dev('e', 'equipment')) };
    expect(migrateDevices(plain)).toBe(plain);
  });

  it('a switch made read-only after the migration stays read-only when the plan opens again', () => {
    const once = migrateDevices({ level: levelOf(dev('boiler', 'equipment', { control: 'switch.boiler' })) });
    const readOnly: PlanDoc = { level: setDeviceControllable(once.level, 'boiler', false) };
    expect(migrateDevices(readOnly)).toBe(readOnly);
  });

  it('markSwitchesMigrated marks a level with an equipment switch, once; any other level is the same object', () => {
    const fresh = levelOf(dev('boiler', 'equipment', { control: 'switch.boiler' }));
    const marked = markSwitchesMigrated(fresh);
    expect(marked).toEqual({ ...fresh, switchesMigrated: true });
    expect(markSwitchesMigrated(marked)).toBe(marked);
    const none = levelOf(dev('s', 'socket', { control: 'switch.s' }), dev('e', 'equipment', { power: 'sensor.e' }));
    expect(markSwitchesMigrated(none)).toBe(none);
    // A read-only switch on a marked level is left alone by the migration.
    const later = { ...marked, devices: [...marked.devices, dev('pc', 'equipment', { control: 'switch.pc' })] };
    expect(migrateDevices({ level: later }).level).toBe(later);
  });
});
