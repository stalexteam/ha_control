import { describe, it, expect } from 'vitest';
import {
  addBlock, blockPorts, clearPins, connect, defaultPower, deleteBlock, deleteDeviceBlocks, deleteDeviceDoc, deleteWire,
  moveBlock, newBlock,
  normalizePower, placeableDevices, pruneDeviceBlocks, pruneLevelDevices, setPin, stepDone, updateBlock, type PortName, type PowerBlock,
  type PowerSchema, type WireEnd, type WireError,
} from '../../src/model/power';
import type { GeoCtx } from '../../src/geometry/power';
import { deviceDefaults, emptyLevel, type Device, type DeviceKind, type DeviceProps } from '../../src/model/types';

const device = (id: string, kind: DeviceKind = 'equipment', flags: { inverter?: true } = {},
  placement: Device['placement'] = { mode: 'none' }): Device =>
  ({ id, name: id, invalid: false, placement, props: { ...deviceDefaults(kind, 'free'), ...flags } as DeviceProps });
const geo = (...devices: Device[]): GeoCtx => ({ device: (id) => devices.find((d) => d.id === id) });
/** The device `i` is an inverter; any other device id is unknown, so its block has IN and OUT only. */
const G = geo(device('i', 'equipment', { inverter: true }));
const blk = (b: Record<string, unknown>) => ({ x: 0, y: 0, ...b }) as unknown as PowerBlock;
const schema = (blocks: Record<string, unknown>[], wires: PowerSchema['wires'] = []): PowerSchema =>
  ({ blocks: blocks.map(blk), wires });
const P = (block: string, port: PortName): WireEnd => ({ block, port });
const B = (bus: string, at = 0.5): WireEnd => ({ bus, at });
const ok = (r: ReturnType<typeof connect>) => {
  if ('error' in r) throw new Error(`unexpected ${r.error}`);
  return r;
};
const err = (r: ReturnType<typeof connect>): WireError | undefined => ('error' in r ? r.error : undefined);

describe('blockPorts', () => {
  const names = (b: Record<string, unknown>, g: GeoCtx = G) => blockPorts(blk(b), g).map((p) => `${p.name}:${p.dir}`);
  it('lists ports of every kind', () => {
    expect(names({ kind: 'grid' })).toEqual(['OUT:out']);
    expect(names({ kind: 'device', deviceId: 'x' })).toEqual(['IN:in', 'OUT:out']);
    expect(names({ kind: 'device', deviceId: 'i' })).toEqual(['IN:in', 'OUT:out', 'PV:in', 'BAT:out']);
    expect(names({ kind: 'bus', w: 1, h: 1 })).toEqual([]);
    expect(names({ kind: 'battery' })).toEqual(['BAT:in']);
    expect(names({ kind: 'pv' })).toEqual(['OUT:out']);
    expect(names({ kind: 'transfer', form: '2in1out' })).toEqual(['A:in', 'B:in', 'OUT:out']);
    expect(names({ kind: 'transfer', form: '1in2out' })).toEqual(['IN:in', 'A:out', 'B:out']);
    expect(names({ kind: 'transfer', form: 'x' })).toEqual([]);
    expect(names({ kind: 'remainder' })).toEqual(['IN:in']);
  });

  it('a device block follows its device: PV and BAT only while it is an equipment inverter', () => {
    const b = { kind: 'device', deviceId: 'd' };
    expect(names(b, geo(device('d', 'equipment', { inverter: true })))).toEqual(['IN:in', 'OUT:out', 'PV:in', 'BAT:out']);
    expect(names(b, geo(device('d')))).toEqual(['IN:in', 'OUT:out']);
    expect(names(b, geo(device('d', 'socket', {}, { mode: 'wall', wallId: 'w', side: 'left', offset: 0 })))).toEqual(['IN:in', 'OUT:out']);
    expect(names(b, geo())).toEqual(['IN:in', 'OUT:out']);
    // A stale block-level flag (migrateDevices removes it) no longer counts.
    expect(names({ ...b, inverter: true }, geo(device('d')))).toEqual(['IN:in', 'OUT:out']);
  });

  it('output:false hides OUT of a device block, but an inverter keeps it; a missing field keeps OUT', () => {
    const b = { kind: 'device', deviceId: 'd', output: false };
    expect(names(b, geo(device('d')))).toEqual(['IN:in']);
    expect(names(b, geo(device('d', 'socket')))).toEqual(['IN:in']);
    expect(names(b, geo(device('d', 'equipment', { inverter: true })))).toEqual(['IN:in', 'OUT:out', 'PV:in', 'BAT:out']);
    expect(names({ kind: 'device', deviceId: 'd' }, geo(device('d')))).toEqual(['IN:in', 'OUT:out']);
  });
});

describe('block ops', () => {
  it('defaultPower has one grid at the origin', () => {
    const s = defaultPower();
    expect(s.blocks).toHaveLength(1);
    expect(s.blocks[0]).toMatchObject({ kind: 'grid', x: 0, y: 0 });
    expect(s.wires).toEqual([]);
  });

  it('newBlock names, sizes and defaults', () => {
    const s = defaultPower();
    const b1 = newBlock('battery', { x: 5, y: 6 }, s);
    expect(b1).toMatchObject({ kind: 'battery', x: 5, y: 6, name: 'Battery 1' });
    const s2 = addBlock(s, b1);
    expect(newBlock('battery', { x: 0, y: 0 }, s2).name).toBe('Battery 2');
    expect(newBlock('bus', { x: 0, y: 0 }, s)).toMatchObject({ w: 240, h: 12, name: 'Bus 1' });
    expect(newBlock('transfer', { x: 0, y: 0 }, s)).toMatchObject({ form: '2in1out', name: 'Transfer switch 1' });
    const d = newBlock('device', { x: 0, y: 0 }, s, 'dev1');
    expect(d).toMatchObject({ kind: 'device', deviceId: 'dev1' });
    expect(d.name).toBeUndefined();
    expect(d).toMatchObject({ output: false });
  });

  it('move, update, pins and delete are pure', () => {
    let s = schema([{ id: 'g', kind: 'grid' }, { id: 'm', kind: 'device', deviceId: 'm' }]);
    const moved = moveBlock(s, 'm', 3, 4);
    expect(moved).not.toBe(s);
    expect(s.blocks[1]).toMatchObject({ x: 0, y: 0 });
    expect(moved.blocks[1]).toMatchObject({ x: 3, y: 4 });
    s = updateBlock(moved, 'm', { name: 'M' }, G);
    expect(s.blocks[1].name).toBe('M');
    s = setPin(s, 'm', 'IN', { side: 'left', at: 0.3 });
    expect(s.blocks[1].portPins).toEqual({ IN: { side: 'left', at: 0.3 } });
    expect(setPin(s, 'm', 'IN', null).blocks[1].portPins).toBeUndefined();
    expect(clearPins(s, 'm').blocks[1].portPins).toBeUndefined();
    const w = ok(connect(s, P('g', 'OUT'), P('m', 'IN'), G));
    expect(deleteBlock(w.schema, 'm').wires).toEqual([]);
    expect(deleteWire(w.schema, w.wire.id).wires).toEqual([]);
  });

  it('deleteBlock of the grid returns the same schema', () => {
    const s = defaultPower();
    expect(deleteBlock(s, s.blocks[0].id)).toBe(s);
  });

  it('changing a transfer form removes its wires', () => {
    let s = schema([
      { id: 'g', kind: 'grid' }, { id: 'm', kind: 'device', deviceId: 'm' }, { id: 't', kind: 'transfer', form: '2in1out' },
    ]);
    s = ok(connect(s, P('g', 'OUT'), P('t', 'A'), G)).schema;
    s = ok(connect(s, P('t', 'OUT'), P('m', 'IN'), G)).schema;
    expect(s.wires).toHaveLength(2);
    const changed = updateBlock(s, 't', { form: '1in2out' } as Partial<PowerBlock>, G);
    expect(changed.wires).toEqual([]);
    expect(updateBlock(s, 't', { name: 'T' }, G).wires).toHaveLength(2);
  });

  it('once its device is no longer an inverter, an update of the block removes its PV and BAT wires and keeps IN and OUT', () => {
    let s = schema([
      { id: 'g', kind: 'grid' }, { id: 'inv', kind: 'device', deviceId: 'i' }, { id: 'pv', kind: 'pv' },
      { id: 'bus', kind: 'bus', w: 1, h: 1 }, { id: 'm', kind: 'device', deviceId: 'm' },
    ]);
    s = ok(connect(s, P('g', 'OUT'), P('inv', 'IN'), G)).schema;
    s = ok(connect(s, P('inv', 'OUT'), P('m', 'IN'), G)).schema;
    s = ok(connect(s, P('pv', 'OUT'), P('inv', 'PV'), G)).schema;
    s = ok(connect(s, P('inv', 'BAT'), B('bus'), G)).schema;
    expect(s.wires).toHaveLength(4);
    const plain = updateBlock(s, 'inv', {}, geo(device('i')));
    expect(plain.wires).toHaveLength(2);
    const invPorts = plain.wires.flatMap((w) => [w.from, w.to]).filter((e) => 'block' in e && e.block === 'inv');
    expect(invPorts.map((e) => ('block' in e ? e.port : '')).sort()).toEqual(['IN', 'OUT']);
    expect(updateBlock(s, 'inv', {}, G).wires).toHaveLength(4);
  });
});

describe('connect', () => {
  const base = () => schema([
    { id: 'g', kind: 'grid' }, { id: 'd', kind: 'device', deviceId: 'x' }, { id: 'd2', kind: 'device', deviceId: 'y' },
    { id: 'inv', kind: 'device', deviceId: 'i' }, { id: 'bat', kind: 'battery' }, { id: 'pv', kind: 'pv' },
    { id: 'bus', kind: 'bus', w: 240, h: 12 }, { id: 'bus2', kind: 'bus', w: 240, h: 12 },
    { id: 'r1', kind: 'remainder' }, { id: 'r2', kind: 'remainder' },
  ]);

  it('orients a drag from an in port to an out port', () => {
    const r = ok(connect(base(), P('d', 'IN'), P('g', 'OUT'), G));
    expect(r.wire.from).toEqual({ block: 'g', port: 'OUT' });
    expect(r.wire.to).toEqual({ block: 'd', port: 'IN' });
    expect(r.schema.wires).toEqual([r.wire]);
  });

  it('orients against a bus; bus-bus keeps a -> b', () => {
    const r = ok(connect(base(), B('bus'), P('g', 'OUT'), G));
    expect(r.wire.from).toEqual({ block: 'g', port: 'OUT' });
    expect(r.wire.to).toEqual(B('bus'));
    const t = ok(connect(base(), B('bus'), P('d', 'IN'), G));
    expect(t.wire.from).toEqual(B('bus'));
    const bb = ok(connect(base(), B('bus'), B('bus2'), G));
    expect(bb.wire.from).toEqual(B('bus'));
    expect(bb.wire.to).toEqual(B('bus2'));
  });

  it('reports each error', () => {
    expect(err(connect(base(), P('nope', 'OUT'), P('d', 'IN'), G))).toBe('missing');
    expect(err(connect(base(), P('g', 'IN'), P('d', 'IN'), G))).toBe('missing');
    expect(err(connect(base(), B('d'), P('d', 'IN'), G))).toBe('missing');
    expect(err(connect(base(), P('d', 'IN'), P('d', 'OUT'), G))).toBe('same-block');
    expect(err(connect(base(), P('d', 'IN'), P('d2', 'IN'), G))).toBe('direction');
    expect(err(connect(base(), P('g', 'OUT'), P('pv', 'OUT'), G))).toBe('direction');
    const taken = ok(connect(base(), P('g', 'OUT'), P('d', 'IN'), G)).schema;
    expect(err(connect(taken, P('g', 'OUT'), P('d2', 'IN'), G))).toBe('port-taken');
    expect(err(connect(base(), P('g', 'OUT'), P('bat', 'BAT'), G))).toBe('dc-mismatch');
    expect(err(connect(base(), P('pv', 'OUT'), P('inv', 'IN'), G))).toBe('dc-mismatch');
    expect(err(connect(base(), P('pv', 'OUT'), P('inv', 'PV'), G))).toBeUndefined();
    const rem = ok(connect(base(), B('bus'), P('r1', 'IN'), G)).schema;
    expect(err(connect(rem, B('bus'), P('r2', 'IN'), G))).toBe('second-remainder');
    expect(err(connect(rem, B('bus2'), P('r2', 'IN'), G))).toBeUndefined();
  });

  it('bus takes the class of its wired ends', () => {
    let s = ok(connect(base(), P('inv', 'BAT'), B('bus'), G)).schema;
    expect(err(connect(s, B('bus'), P('d', 'IN'), G))).toBe('dc-mismatch');
    s = ok(connect(s, B('bus'), P('bat', 'BAT'), G)).schema;
    // unclassified bus accepts anything
    expect(err(connect(base(), P('g', 'OUT'), B('bus'), G))).toBeUndefined();
  });

  it('three batteries on one bus fed by an inverter BAT connect', () => {
    const s0 = schema([
      { id: 'inv', kind: 'device', deviceId: 'i' }, { id: 'bus', kind: 'bus', w: 1, h: 1 },
      { id: 'b1', kind: 'battery' }, { id: 'b2', kind: 'battery' }, { id: 'b3', kind: 'battery' },
    ]);
    let s = ok(connect(s0, P('inv', 'BAT'), B('bus'), G)).schema;
    for (const b of ['b1', 'b2', 'b3']) s = ok(connect(s, B('bus'), P(b, 'BAT'), G)).schema;
    expect(s.wires).toHaveLength(4);
  });

  const owner = () => {
    let s = schema([
      { id: 'grid', kind: 'grid' }, { id: 'main', kind: 'bus', w: 240, h: 12 },
      { id: 'inv', kind: 'device', deviceId: 'i' }, { id: 'rcbo', kind: 'device', deviceId: 'rcbo' },
      { id: 'tr', kind: 'transfer', form: '2in1out' },
    ]);
    s = ok(connect(s, P('grid', 'OUT'), B('main'), G)).schema;
    s = ok(connect(s, B('main'), P('inv', 'IN'), G)).schema;
    s = ok(connect(s, B('main'), P('tr', 'B'), G)).schema;
    s = ok(connect(s, P('inv', 'OUT'), P('rcbo', 'IN'), G)).schema;
    s = ok(connect(s, P('rcbo', 'OUT'), P('tr', 'A'), G)).schema;
    return s;
  };

  it('owner chain connects without a loop', () => {
    expect(owner().wires).toHaveLength(5);
  });

  it('a wire from the inverter chain back to main is a loop', () => {
    // inverter OUT and RCBO OUT are wired in the full chain, so use the chain without the RCBO -> A wire
    const s = owner();
    const open = { ...s, wires: s.wires.filter((w) => !('block' in w.to && w.to.block === 'tr' && w.to.port === 'A')) };
    expect(err(connect(open, P('rcbo', 'OUT'), B('main'), G))).toBe('loop');
    expect(err(connect(s, P('inv', 'OUT'), B('main'), G))).toBe('port-taken');
  });

  it('one bus feeding both inputs of a transfer is not a loop', () => {
    const s0 = schema([{ id: 'bus', kind: 'bus', w: 1, h: 1 }, { id: 'tr', kind: 'transfer', form: '2in1out' }]);
    const s1 = ok(connect(s0, B('bus'), P('tr', 'A'), G)).schema;
    expect(ok(connect(s1, B('bus'), P('tr', 'B'), G)).schema.wires).toHaveLength(2);
  });

  it('a loop that exists for one transfer position only is rejected', () => {
    let s = schema([
      { id: 'main', kind: 'bus', w: 1, h: 1 }, { id: 'tr', kind: 'transfer', form: '2in1out' },
      { id: 'd', kind: 'device', deviceId: 'x' },
    ]);
    s = ok(connect(s, B('main'), P('tr', 'A'), G)).schema;
    s = ok(connect(s, P('tr', 'OUT'), P('d', 'IN'), G)).schema;
    // closed with the switch on A, open on B
    expect(connect(s, P('d', 'OUT'), B('main'), G)).toEqual({ error: 'loop' });
  });

  describe('transfer cap', () => {
    // n transfers t1..tn; the last one carries the loop path through its B input
    const build = (n: number) => {
      const blocks: Record<string, unknown>[] = [
        { id: 'main', kind: 'bus', w: 1, h: 1 }, { id: 'd', kind: 'device', deviceId: 'x' },
      ];
      for (let i = 1; i <= n; i++) blocks.push({ id: `t${i}`, kind: 'transfer', form: '2in1out' });
      let s = schema(blocks);
      s = ok(connect(s, B('main'), P(`t${n}`, 'B'), G)).schema;
      s = ok(connect(s, P(`t${n}`, 'OUT'), P('d', 'IN'), G)).schema;
      return s;
    };
    it('checks every position of up to 10 transfers', () => {
      expect(connect(build(10), P('d', 'OUT'), B('main'), G)).toEqual({ error: 'loop' });
    });
    it('does not check transfers beyond the 10th', () => {
      expect('schema' in connect(build(11), P('d', 'OUT'), B('main'), G)).toBe(true);
    });
  });

  it('a battery fed straight from a plain device OUT is dc-mismatch', () => {
    expect(err(connect(base(), P('d', 'OUT'), P('bat', 'BAT'), G))).toBe('dc-mismatch');
    // two in ports: a battery BAT and a device IN cannot be wired at all
    expect(err(connect(base(), P('bat', 'BAT'), P('d', 'IN'), G))).toBe('direction');
  });
});

describe('normalizePower', () => {
  it('returns undefined for a missing value', () => {
    expect(normalizePower(undefined, G)).toBeUndefined();
    expect(normalizePower(null, G)).toBeUndefined();
  });

  it('returns the same object when nothing changes', () => {
    const s = owner0();
    expect(normalizePower(s, G)).toBe(s);
  });

  it('drops malformed entries', () => {
    const raw = {
      blocks: [
        { id: 'g', kind: 'grid', x: 0, y: 0 },
        { id: 'u', kind: 'ufo', x: 0, y: 0 },
        { id: 'n', kind: 'pv', x: 'a', y: 0 },
        { id: 'old', kind: 'meter', x: 0, y: 0 }, // a v0.7 kind: migrateDevices converts it before normalizePower
        { id: 'bus', kind: 'bus', x: 1, y: 1, w: 10, h: 2 },
        { id: 'd', kind: 'device', x: 1, y: 1, deviceId: 'x' },
      ],
      wires: [
        { id: 'w1', from: { block: 'g', port: 'OUT' }, to: { bus: 'bus', at: 1.5 } },
        { id: 'w2', from: { block: 'g', port: 'OUT' }, to: { block: 'ghost', port: 'IN' } },
        { id: 'w3', from: { block: 'g', port: 'OUT' }, to: 5 },
        { id: 'w4', from: { bus: 'bus', at: -2 }, to: { block: 'd', port: 'IN' } },
      ],
    };
    const n = normalizePower(raw, G)!;
    expect(n).not.toBe(raw);
    expect(n.blocks.map((b) => b.id)).toEqual(['g', 'bus', 'd']);
    expect(n.wires.map((w) => w.id)).toEqual(['w1', 'w4']);
    expect(n.wires[0].to).toEqual({ bus: 'bus', at: 1 });
    expect(n.wires[1].from).toEqual({ bus: 'bus', at: 0 });
  });

  it('keeps a valid bus, transfer and pins as they are (the same object)', () => {
    const s: PowerSchema = {
      blocks: [
        blk({ id: 'g', kind: 'grid', portPins: { OUT: { side: 'bottom', at: 0.5 } } }),
        blk({ id: 'bus', kind: 'bus', w: 12, h: 240 }),
        blk({ id: 'ts', kind: 'transfer', form: '1in2out', portPins: { A: { side: 'left', at: 0 }, B: { side: 'right', at: 1 } } }),
      ],
      wires: [{ id: 'w', from: { block: 'g', port: 'OUT' }, to: { bus: 'bus', at: 0.5 } }],
    };
    expect(normalizePower(s, G)).toBe(s);
  });

  it('repairs a bus without a finite size of at least 1 to 240 x 12; its wires stay', () => {
    const raw = {
      blocks: [
        { id: 'g', kind: 'grid', x: 0, y: 0 },
        { id: 'b1', kind: 'bus', x: 5, y: 6, w: null, h: 12, name: 'Main' },
        { id: 'b2', kind: 'bus', x: 0, y: 0, w: 100 },
        { id: 'b3', kind: 'bus', x: 0, y: 0, w: 100, h: 0 },
        { id: 'b4', kind: 'bus', x: 0, y: 0, w: Infinity, h: 12 },
        { id: 'b5', kind: 'bus', x: 0, y: 0, w: '240', h: 12 },
        { id: 'ok', kind: 'bus', x: 0, y: 0, w: 12, h: 300 },
      ],
      wires: [{ id: 'w', from: { block: 'g', port: 'OUT' }, to: { bus: 'b1', at: 0.5 } }],
    };
    const n = normalizePower(raw, G)!;
    expect(n.blocks[1]).toEqual({ id: 'b1', kind: 'bus', x: 5, y: 6, w: 240, h: 12, name: 'Main' });
    expect(n.blocks.slice(2).map((b) => (b.kind === 'bus' ? [b.w, b.h] : null)))
      .toEqual([[240, 12], [240, 12], [240, 12], [240, 12], [12, 300]]);
    expect(n.blocks[6]).toBe(raw.blocks[6]);
    expect(n.wires).toEqual(raw.wires);
  });

  it('resets a transfer with an unknown form to 2in1out and drops its wires', () => {
    const raw = {
      blocks: [
        { id: 'g', kind: 'grid', x: 0, y: 0 },
        { id: 'ts', kind: 'transfer', x: 0, y: 0, form: '3in1out', name: 'TS' },
        { id: 'nf', kind: 'transfer', x: 0, y: 0 },
        { id: 'ok', kind: 'transfer', x: 0, y: 0, form: '1in2out' },
        { id: 'd', kind: 'device', x: 0, y: 0, deviceId: 'x' },
      ],
      wires: [
        { id: 'w1', from: { block: 'g', port: 'OUT' }, to: { block: 'ts', port: 'A' } },
        { id: 'w2', from: { block: 'nf', port: 'OUT' }, to: { block: 'd', port: 'IN' } },
        { id: 'w3', from: { block: 'ok', port: 'A' }, to: { block: 'd', port: 'IN' } },
      ],
    };
    const n = normalizePower(raw, G)!;
    expect(n.blocks[1]).toEqual({ id: 'ts', kind: 'transfer', x: 0, y: 0, form: '2in1out', name: 'TS' });
    expect(n.blocks[2]).toEqual({ id: 'nf', kind: 'transfer', x: 0, y: 0, form: '2in1out' });
    expect(n.blocks[3]).toBe(raw.blocks[3]);
    expect(n.wires.map((w) => w.id)).toEqual(['w3']);
  });

  it('drops pins with an unknown side, a bad place or a port the block lacks; clamps a pin to 0..1', () => {
    const raw = {
      blocks: [
        { id: 'g', kind: 'grid', x: 0, y: 0, portPins: { OUT: { side: 'up', at: 0.5 } } },
        { id: 'm', kind: 'device', x: 0, y: 0, deviceId: 'm', portPins: {
          IN: { side: 'left', at: 1.4 }, OUT: { side: 'right', at: 0.3 }, PV: { side: 'top', at: 0.5 }, BAT: 5,
        } },
        { id: 'd', kind: 'device', x: 0, y: 0, deviceId: 'x', portPins: { IN: { side: 'top', at: 'mid' } } },
        { id: 'p', kind: 'pv', x: 0, y: 0, portPins: 'none' },
        { id: 'b', kind: 'bus', x: 0, y: 0, w: 240, h: 12, portPins: { IN: { side: 'top', at: 0.5 } } },
        { id: 'ts', kind: 'transfer', x: 0, y: 0, form: '2in1out', portPins: { A: { side: 'left', at: -1 } } },
        { id: 'i', kind: 'device', x: 0, y: 0, deviceId: 'i', portPins: { PV: { side: 'top', at: 0.5 } } },
      ],
      wires: [],
    };
    const n = normalizePower(raw, G)!;
    expect('portPins' in n.blocks[0]).toBe(false);
    expect(n.blocks[1].portPins).toEqual({ IN: { side: 'left', at: 1 }, OUT: { side: 'right', at: 0.3 } });
    expect('portPins' in n.blocks[2]).toBe(false);
    expect('portPins' in n.blocks[3]).toBe(false);
    expect('portPins' in n.blocks[4]).toBe(false);
    expect(n.blocks[5].portPins).toEqual({ A: { side: 'left', at: 0 } });
    // The ports come from the device: an inverter device block keeps its PV pin.
    expect(n.blocks[6]).toBe(raw.blocks[6]);
    expect(n.blocks.map((b) => b.id)).toEqual(['g', 'm', 'd', 'p', 'b', 'ts', 'i']);
  });

  it('drops a wire on a port the block lacks: PV on a device that is not an inverter, IN on the grid', () => {
    const raw = {
      blocks: [
        { id: 'g', kind: 'grid', x: 0, y: 0 },
        { id: 's', kind: 'device', x: 0, y: 0, deviceId: 's' },
        { id: 'i', kind: 'device', x: 0, y: 0, deviceId: 'i' },
        { id: 'p', kind: 'pv', x: 0, y: 0 },
        { id: 'q', kind: 'pv', x: 0, y: 0 },
      ],
      wires: [
        { id: 'w-s', from: { block: 'p', port: 'OUT' }, to: { block: 's', port: 'PV' } },
        { id: 'w-i', from: { block: 'q', port: 'OUT' }, to: { block: 'i', port: 'PV' } },
        { id: 'w-g', from: { block: 'p', port: 'OUT' }, to: { block: 'g', port: 'IN' } },
      ],
    };
    const n = normalizePower(raw, geo(device('s', 'socket'), device('i', 'equipment', { inverter: true })))!;
    expect(n.wires.map((w) => w.id)).toEqual(['w-i']);
  });
});

function owner0(): PowerSchema {
  return {
    blocks: [blk({ id: 'g', kind: 'grid' }), blk({ id: 'd', kind: 'device', deviceId: 'x' })],
    wires: [{ id: 'w', from: { block: 'g', port: 'OUT' }, to: { block: 'd', port: 'IN' } }],
  };
}

describe('device blocks of one device', () => {
  const s = () => schema(
    [{ id: 'g', kind: 'grid' }, { id: 'a', kind: 'device', deviceId: 'i' }, { id: 'p', kind: 'pv' },
      { id: 'b', kind: 'battery' }, { id: 'x', kind: 'device', deviceId: 'x', portPins: { IN: { side: 'top', at: 0.5 } } }],
    [
      { id: 'w-in', from: P('g', 'OUT'), to: P('a', 'IN') },
      { id: 'w-pv', from: P('p', 'OUT'), to: P('a', 'PV') },
      { id: 'w-bat', from: P('a', 'BAT'), to: P('b', 'BAT') },
      { id: 'w-x', from: P('a', 'OUT'), to: P('x', 'IN') },
    ],
  );

  it('pruneDeviceBlocks drops the wires and pins of ports the device no longer has; the same schema otherwise', () => {
    const inv = s();
    expect(pruneDeviceBlocks(inv, 'i', G)).toBe(inv);
    expect(pruneDeviceBlocks(inv, 'nobody', G)).toBe(inv);
    const pinned = setPin(inv, 'a', 'PV', { side: 'left', at: 0.5 });
    const plain = pruneDeviceBlocks(pinned, 'i', geo(device('i')));
    expect(plain.wires.map((w) => w.id)).toEqual(['w-in', 'w-x']);
    expect('portPins' in plain.blocks[1]).toBe(false);
  });

  it('pruneLevelDevices prunes every device block with the devices of the level; the same schema otherwise', () => {
    const inv = s();
    const lvl = (...devices: Device[]) => ({ ...emptyLevel('L1'), devices });
    expect(pruneLevelDevices(inv, lvl(device('i', 'equipment', { inverter: true }), device('x')))).toBe(inv);
    expect(pruneLevelDevices(inv, lvl(device('x'))).wires.map((w) => w.id)).toEqual(['w-in', 'w-x']);
  });

  it('deleteDeviceBlocks removes every block of the device with its wires', () => {
    const inv = s();
    const twice = addBlock(inv, blk({ id: 'a2', kind: 'device', deviceId: 'i' }));
    const out = deleteDeviceBlocks(twice, 'i');
    expect(out.blocks.map((b) => b.id)).toEqual(['g', 'p', 'b', 'x']);
    expect(out.wires).toEqual([]);
    expect(deleteDeviceBlocks(inv, 'nobody')).toBe(inv);
  });

  it('deleteDeviceDoc of a placed inverter keeps its block (Device missing) without the PV and BAT wires and pins', () => {
    const level = { ...emptyLevel('L1'), devices: [device('i', 'equipment', { inverter: true }, { mode: 'free', x: 0, y: 0, rotation: 0 })] };
    const pinned = setPin(s(), 'a', 'BAT', { side: 'left', at: 0.5 });
    const out = deleteDeviceDoc(level, pinned, 'i');
    expect(out.level.devices).toEqual([]);
    expect(out.power.blocks.map((b) => b.id)).toEqual(['g', 'a', 'p', 'b', 'x']);
    expect(out.power.wires.map((w) => w.id)).toEqual(['w-in', 'w-x']);
    expect('portPins' in out.power.blocks[1]).toBe(false);
  });
});

describe('stepDone', () => {
  it('needs a grid power entity and a wire', () => {
    const s = owner0();
    expect(stepDone(s)).toBe(false);
    const withPower = updateBlock(s, 'g', { power: 'sensor.p' } as Partial<PowerBlock>, G);
    expect(stepDone(withPower)).toBe(true);
    expect(stepDone({ ...withPower, wires: [] })).toBe(false);
  });
});

describe('placeableDevices', () => {
  it('lists devices not on the plan too, minus those already in the schematic', () => {
    const level = {
      ...emptyLevel('L1'),
      devices: [device('rcbo'), device('used'), device('lamp', 'ceiling_light', {}, { mode: 'free', x: 0, y: 0, rotation: 0 })],
    };
    const power = schema([{ id: 'g', kind: 'grid' }, { id: 'b', kind: 'device', deviceId: 'used' }]);
    expect(placeableDevices(level, power).map((d) => d.id)).toEqual(['rcbo']);
  });
});
