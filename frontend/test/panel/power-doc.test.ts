// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { drawBox, mount, pressSave, stored, undo } from './helpers';
import { STORAGE_KEY } from '../../dev/mock-hass';
import { selectionExists } from '../../src/panel/tool-factory';
import { addBlock, newBlock, defaultPower, type PowerSchema } from '../../src/model/power';
import { setDeviceControllable } from '../../src/model/devices';
import { deviceDefaults, emptyLevel, type Device, type Plan } from '../../src/model/types';

const withPv = (s: PowerSchema): PowerSchema => addBlock(s, newBlock('pv', { x: 10, y: 20 }, s));

/** A plan saved by v0.7: a meter with a read-only switch, a block-level inverter, and a Boiler whose switch was operable. */
function v07Plan(): Plan {
  const equipment = (id: string, bindings: Device['bindings']): Device => ({
    id, name: id, invalid: false, placement: { mode: 'free', x: 1000, y: 1000, rotation: 0 },
    props: deviceDefaults('equipment', 'free'), bindings,
  });
  const power = {
    blocks: [
      { id: 'grid', kind: 'grid', x: 0, y: 0, power: 'sensor.grid_power' },
      { id: 'inv', kind: 'device', x: 0, y: 100, deviceId: 'inverter', inverter: true },
      { id: 'rcbo', kind: 'meter', x: 0, y: 200, name: 'RCBO output', power: 'sensor.rcbo_power',
        switch: { entity: 'switch.rcbo', controllable: false } },
      { id: 'boiler', kind: 'device', x: 0, y: 300, deviceId: 'boiler' },
    ],
    wires: [
      { id: 'w1', from: { block: 'grid', port: 'OUT' }, to: { block: 'inv', port: 'IN' } },
      { id: 'w2', from: { block: 'inv', port: 'OUT' }, to: { block: 'rcbo', port: 'IN' } },
      { id: 'w3', from: { block: 'rcbo', port: 'OUT' }, to: { block: 'boiler', port: 'IN' } },
    ],
  } as unknown as PowerSchema;
  const level = { ...emptyLevel('L1'), devices: [
    equipment('inverter', { power: 'sensor.inv_power' }), equipment('boiler', { control: 'switch.boiler' }),
  ] };
  return { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1, levels: [level], power };
}

const flags = (d: Device) => (d.props.kind === 'equipment' ? { inverter: !!d.props.inverter, controllable: !!d.props.controllable } : null);

describe('power in the plan document', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('save without power edits writes no power key', async () => {
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    expect(stored().length).toBe(1);
    expect('power' in stored()[0]).toBe(false);
    expect(el.history!.current.power).toBeUndefined();
    expect(el.power.blocks.map(b => b.kind)).toEqual(['grid']);
  });

  it('commitPower then save stores the schematic', async () => {
    const el = await mount();
    const next = withPv(el.power);
    el.commitPower(next);
    expect(el.save.dirty).toBe(true);
    await pressSave(el);
    expect(stored()[0].power).toEqual(next);
  });

  it('a draft carries power and restoring it brings it back', async () => {
    const el = await mount();
    const next = withPv(defaultPower());
    el.commitPower(next);
    const draft = el.session.makeDraft();
    expect(draft.plan.power).toEqual(next);
    el.session.restoreDraft({ ...draft, plan: JSON.parse(JSON.stringify(draft.plan)) as Plan });
    expect(el.history!.current.power).toEqual(next);
    expect(el.save.dirty).toBe(true);
  });

  it('undo walks power and level edits in order', async () => {
    const el = await mount();
    const level0 = el.level!;
    const p1 = withPv(el.power);
    el.commitPower(p1);
    const level1 = { ...level0, name: 'Edited' };
    el.commit(level1);
    expect(el.level).toBe(level1);
    expect(el.power).toBe(p1);
    await undo(el);
    expect(el.level).toBe(level0);
    expect(el.power).toBe(p1);
    await undo(el);
    expect(el.history!.current.power).toBeUndefined();
    expect(el.power.blocks.map(b => b.kind)).toEqual(['grid']);
  });

  it('opening a v0.7 plan migrates its meter and inverter into devices; the wires stay and nothing is dirty', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: v07Plan() } }));
    const el = await mount();
    const { level, power } = el.history!.current;
    const rcbo = power!.blocks.find(b => b.id === 'rcbo')!;
    expect(rcbo.kind).toBe('device');
    const meter = level.devices.find(d => rcbo.kind === 'device' && d.id === rcbo.deviceId)!;
    expect(meter).toMatchObject({ name: 'RCBO output', placement: { mode: 'none' },
      bindings: { power: 'sensor.rcbo_power', control: 'switch.rcbo' } });
    expect(level.devices.map(d => [d.id === meter.id ? 'meter' : d.id, flags(d)])).toEqual([
      ['inverter', { inverter: true, controllable: false }],
      ['boiler', { inverter: false, controllable: true }],
      ['meter', { inverter: false, controllable: false }],
    ]);
    expect(level.devices[0].bindings).toEqual({ power_out: 'sensor.inv_power' });
    expect(power!.blocks.some(b => 'inverter' in b)).toBe(false);
    expect(power!.wires.map(w => w.id)).toEqual(['w1', 'w2', 'w3']);
    expect(el.save.dirty).toBe(false);
  });

  it('restoring a v0.7 draft migrates it too', async () => {
    const el = await mount();
    el.session.restoreDraft({ planId: 'P1', baseRevision: 1, plan: v07Plan(), savedAt: 0 });
    const { level, power } = el.history!.current;
    expect(power!.blocks.map(b => b.kind)).toEqual(['grid', 'device', 'device', 'device']);
    expect(level.devices).toHaveLength(3);
    expect(el.save.dirty).toBe(true);
  });

  it('a saved plan keeps a switch made read-only after the migration read-only when it opens again', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: v07Plan() } }));
    const el = await mount();
    el.commit(setDeviceControllable(el.level!, 'boiler', false));
    await pressSave(el);
    expect(stored()[0].levels[0].switchesMigrated).toBe(true);
    document.body.innerHTML = '';
    const again = await mount();
    expect(flags(again.level!.devices.find(d => d.id === 'boiler')!)).toEqual({ inverter: false, controllable: false });
    expect(again.save.dirty).toBe(false);
  });

  it('a switch added to a plan that had none is saved marked, so it stays read-only', async () => {
    const el = await mount();
    expect('switchesMigrated' in el.level!).toBe(false);
    const pc: Device = {
      id: 'pc', name: 'PC', invalid: false, placement: { mode: 'none' }, props: deviceDefaults('equipment', 'free'),
      bindings: { control: 'switch.pc' },
    };
    el.commit({ ...el.level!, devices: [pc] });
    await pressSave(el);
    expect(stored()[0].levels[0].switchesMigrated).toBe(true);
    expect('switchesMigrated' in el.level!).toBe(false); // the mark is added on the way out only
    document.body.innerHTML = '';
    const again = await mount();
    expect(flags(again.level!.devices[0])).toEqual({ inverter: false, controllable: false });
  });

  it('deleting the wall of a wall-mounted inverter drops its BAT wire; one undo brings both back', async () => {
    const el = await mount();
    await drawBox(el);
    const wallId = el.level!.walls[0].id;
    const inv: Device = {
      id: 'inv', name: 'Inverter', invalid: false, placement: { mode: 'wall', wallId, side: 'right', offset: 500 },
      props: { ...deviceDefaults('equipment', 'wall'), inverter: true } as Device['props'], bindings: {},
    };
    el.commit({ ...el.level!, devices: [inv] });
    const block = newBlock('device', { x: 0, y: 100 }, el.power, 'inv');
    const bat = newBlock('battery', { x: 0, y: 200 }, el.power);
    const s = addBlock(addBlock(el.power, block), bat);
    el.commitPower({ ...s, wires: [{ id: 'wb', from: { block: block.id, port: 'BAT' }, to: { block: bat.id, port: 'BAT' } }] });
    const before = el.history!.current;
    el.selection = { kind: 'wall', id: wallId };
    expect(el.deleteSelection()).toBe(true);
    expect(el.level!.devices).toHaveLength(0);
    expect(el.power.wires).toEqual([]);
    expect(el.power.blocks.map(b => b.id)).toContain(block.id);
    await undo(el);
    expect(el.history!.current).toBe(before);
  });

  it('a level edit with nothing stale keeps the same power object and adds no power key', async () => {
    const el = await mount();
    await drawBox(el);
    expect(el.history!.current.power).toBeUndefined();
    const p1 = withPv(el.power);
    el.commitPower(p1);
    el.commit({ ...el.level!, name: 'Edited' });
    expect(el.history!.current.power).toBe(p1);
  });

  it('selectionExists finds power blocks and wires', async () => {
    const el = await mount();
    const s = withPv(defaultPower());
    const wire = { id: 'w1', from: { block: s.blocks[1].id, port: 'OUT' as const }, to: { block: s.blocks[0].id, port: 'OUT' as const } };
    const sch = { ...s, wires: [wire] };
    const lvl = el.level!;
    expect(selectionExists(lvl, { kind: 'powerBlock', id: s.blocks[1].id }, sch)).toBe(true);
    expect(selectionExists(lvl, { kind: 'powerBlock', id: 'nope' }, sch)).toBe(false);
    expect(selectionExists(lvl, { kind: 'powerWire', id: 'w1' }, sch)).toBe(true);
    expect(selectionExists(lvl, { kind: 'powerWire', id: 'nope' }, sch)).toBe(false);
  });
});
