import { describe, it, expect } from 'vitest';
import {
  addBlock, blockPorts, clearPins, connect, defaultPower, deleteBlock, deleteWire, moveBlock, newBlock, normalizePower,
  setPin, stepDone, updateBlock, type PortName, type PowerBlock, type PowerSchema, type WireEnd, type WireError,
} from '../../src/model/power';

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
  const names = (b: Record<string, unknown>) => blockPorts(blk(b)).map((p) => `${p.name}:${p.dir}`);
  it('lists ports of every kind', () => {
    expect(names({ kind: 'grid' })).toEqual(['OUT:out']);
    expect(names({ kind: 'device' })).toEqual(['IN:in', 'OUT:out']);
    expect(names({ kind: 'device', inverter: true })).toEqual(['IN:in', 'OUT:out', 'PV:in', 'BAT:out']);
    expect(names({ kind: 'meter' })).toEqual(['IN:in', 'OUT:out']);
    expect(names({ kind: 'bus', w: 1, h: 1 })).toEqual([]);
    expect(names({ kind: 'battery' })).toEqual(['BAT:in']);
    expect(names({ kind: 'pv' })).toEqual(['OUT:out']);
    expect(names({ kind: 'transfer', form: '2in1out' })).toEqual(['A:in', 'B:in', 'OUT:out']);
    expect(names({ kind: 'transfer', form: '1in2out' })).toEqual(['IN:in', 'A:out', 'B:out']);
    expect(names({ kind: 'transfer', form: 'x' })).toEqual([]);
    expect(names({ kind: 'remainder' })).toEqual(['IN:in']);
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
    const m1 = newBlock('meter', { x: 5, y: 6 }, s);
    expect(m1).toMatchObject({ kind: 'meter', x: 5, y: 6, name: 'Meter 1' });
    const s2 = addBlock(s, m1);
    expect(newBlock('meter', { x: 0, y: 0 }, s2).name).toBe('Meter 2');
    expect(newBlock('bus', { x: 0, y: 0 }, s)).toMatchObject({ w: 240, h: 12, name: 'Bus 1' });
    expect(newBlock('transfer', { x: 0, y: 0 }, s)).toMatchObject({ form: '2in1out', name: 'Transfer switch 1' });
    const d = newBlock('device', { x: 0, y: 0 }, s, 'dev1');
    expect(d).toMatchObject({ kind: 'device', deviceId: 'dev1' });
    expect(d.name).toBeUndefined();
  });

  it('move, update, pins and delete are pure', () => {
    let s = schema([{ id: 'g', kind: 'grid' }, { id: 'm', kind: 'meter' }]);
    const moved = moveBlock(s, 'm', 3, 4);
    expect(moved).not.toBe(s);
    expect(s.blocks[1]).toMatchObject({ x: 0, y: 0 });
    expect(moved.blocks[1]).toMatchObject({ x: 3, y: 4 });
    s = updateBlock(moved, 'm', { name: 'M' });
    expect(s.blocks[1].name).toBe('M');
    s = setPin(s, 'm', 'IN', { side: 'left', at: 0.3 });
    expect(s.blocks[1].portPins).toEqual({ IN: { side: 'left', at: 0.3 } });
    expect(setPin(s, 'm', 'IN', null).blocks[1].portPins).toBeUndefined();
    expect(clearPins(s, 'm').blocks[1].portPins).toBeUndefined();
    const w = ok(connect(s, P('g', 'OUT'), P('m', 'IN')));
    expect(deleteBlock(w.schema, 'm').wires).toEqual([]);
    expect(deleteWire(w.schema, w.wire.id).wires).toEqual([]);
  });

  it('deleteBlock of the grid returns the same schema', () => {
    const s = defaultPower();
    expect(deleteBlock(s, s.blocks[0].id)).toBe(s);
  });

  it('changing a transfer form removes its wires', () => {
    let s = schema([{ id: 'g', kind: 'grid' }, { id: 'm', kind: 'meter' }, { id: 't', kind: 'transfer', form: '2in1out' }]);
    s = ok(connect(s, P('g', 'OUT'), P('t', 'A'))).schema;
    s = ok(connect(s, P('t', 'OUT'), P('m', 'IN'))).schema;
    expect(s.wires).toHaveLength(2);
    const changed = updateBlock(s, 't', { form: '1in2out' } as Partial<PowerBlock>);
    expect(changed.wires).toEqual([]);
    expect(updateBlock(s, 't', { name: 'T' }).wires).toHaveLength(2);
  });

  it('dropping the inverter flag removes PV and BAT wires and keeps IN and OUT', () => {
    let s = schema([
      { id: 'g', kind: 'grid' }, { id: 'inv', kind: 'device', deviceId: 'i', inverter: true }, { id: 'pv', kind: 'pv' },
      { id: 'bus', kind: 'bus', w: 1, h: 1 }, { id: 'm', kind: 'meter' },
    ]);
    s = ok(connect(s, P('g', 'OUT'), P('inv', 'IN'))).schema;
    s = ok(connect(s, P('inv', 'OUT'), P('m', 'IN'))).schema;
    s = ok(connect(s, P('pv', 'OUT'), P('inv', 'PV'))).schema;
    s = ok(connect(s, P('inv', 'BAT'), B('bus'))).schema;
    expect(s.wires).toHaveLength(4);
    const plain = updateBlock(s, 'inv', { inverter: false } as Partial<PowerBlock>);
    expect(plain.wires).toHaveLength(2);
    const invPorts = plain.wires.flatMap((w) => [w.from, w.to]).filter((e) => 'block' in e && e.block === 'inv');
    expect(invPorts.map((e) => ('block' in e ? e.port : '')).sort()).toEqual(['IN', 'OUT']);
    expect(updateBlock(s, 'inv', { inverter: true } as Partial<PowerBlock>).wires).toHaveLength(4);
  });
});

describe('connect', () => {
  const base = () => schema([
    { id: 'g', kind: 'grid' }, { id: 'd', kind: 'device', deviceId: 'x' }, { id: 'd2', kind: 'device', deviceId: 'y' },
    { id: 'inv', kind: 'device', deviceId: 'i', inverter: true }, { id: 'bat', kind: 'battery' }, { id: 'pv', kind: 'pv' },
    { id: 'bus', kind: 'bus', w: 240, h: 12 }, { id: 'bus2', kind: 'bus', w: 240, h: 12 },
    { id: 'r1', kind: 'remainder' }, { id: 'r2', kind: 'remainder' },
  ]);

  it('orients a drag from an in port to an out port', () => {
    const r = ok(connect(base(), P('d', 'IN'), P('g', 'OUT')));
    expect(r.wire.from).toEqual({ block: 'g', port: 'OUT' });
    expect(r.wire.to).toEqual({ block: 'd', port: 'IN' });
    expect(r.schema.wires).toEqual([r.wire]);
  });

  it('orients against a bus; bus-bus keeps a -> b', () => {
    const r = ok(connect(base(), B('bus'), P('g', 'OUT')));
    expect(r.wire.from).toEqual({ block: 'g', port: 'OUT' });
    expect(r.wire.to).toEqual(B('bus'));
    const t = ok(connect(base(), B('bus'), P('d', 'IN')));
    expect(t.wire.from).toEqual(B('bus'));
    const bb = ok(connect(base(), B('bus'), B('bus2')));
    expect(bb.wire.from).toEqual(B('bus'));
    expect(bb.wire.to).toEqual(B('bus2'));
  });

  it('reports each error', () => {
    expect(err(connect(base(), P('nope', 'OUT'), P('d', 'IN')))).toBe('missing');
    expect(err(connect(base(), P('g', 'IN'), P('d', 'IN')))).toBe('missing');
    expect(err(connect(base(), B('d'), P('d', 'IN')))).toBe('missing');
    expect(err(connect(base(), P('d', 'IN'), P('d', 'OUT')))).toBe('same-block');
    expect(err(connect(base(), P('d', 'IN'), P('d2', 'IN')))).toBe('direction');
    expect(err(connect(base(), P('g', 'OUT'), P('pv', 'OUT')))).toBe('direction');
    const taken = ok(connect(base(), P('g', 'OUT'), P('d', 'IN'))).schema;
    expect(err(connect(taken, P('g', 'OUT'), P('d2', 'IN')))).toBe('port-taken');
    expect(err(connect(base(), P('g', 'OUT'), P('bat', 'BAT')))).toBe('dc-mismatch');
    expect(err(connect(base(), P('pv', 'OUT'), P('inv', 'IN')))).toBe('dc-mismatch');
    expect(err(connect(base(), P('pv', 'OUT'), P('inv', 'PV')))).toBeUndefined();
    const rem = ok(connect(base(), B('bus'), P('r1', 'IN'))).schema;
    expect(err(connect(rem, B('bus'), P('r2', 'IN')))).toBe('second-remainder');
    expect(err(connect(rem, B('bus2'), P('r2', 'IN')))).toBeUndefined();
  });

  it('bus takes the class of its wired ends', () => {
    let s = ok(connect(base(), P('inv', 'BAT'), B('bus'))).schema;
    expect(err(connect(s, B('bus'), P('d', 'IN')))).toBe('dc-mismatch');
    s = ok(connect(s, B('bus'), P('bat', 'BAT'))).schema;
    // unclassified bus accepts anything
    expect(err(connect(base(), P('g', 'OUT'), B('bus')))).toBeUndefined();
  });

  it('three batteries on one bus fed by an inverter BAT connect', () => {
    const s0 = schema([
      { id: 'inv', kind: 'device', deviceId: 'i', inverter: true }, { id: 'bus', kind: 'bus', w: 1, h: 1 },
      { id: 'b1', kind: 'battery' }, { id: 'b2', kind: 'battery' }, { id: 'b3', kind: 'battery' },
    ]);
    let s = ok(connect(s0, P('inv', 'BAT'), B('bus'))).schema;
    for (const b of ['b1', 'b2', 'b3']) s = ok(connect(s, B('bus'), P(b, 'BAT'))).schema;
    expect(s.wires).toHaveLength(4);
  });

  const owner = () => {
    let s = schema([
      { id: 'grid', kind: 'grid' }, { id: 'main', kind: 'bus', w: 240, h: 12 },
      { id: 'inv', kind: 'device', deviceId: 'i', inverter: true }, { id: 'meter', kind: 'meter' },
      { id: 'tr', kind: 'transfer', form: '2in1out' },
    ]);
    s = ok(connect(s, P('grid', 'OUT'), B('main'))).schema;
    s = ok(connect(s, B('main'), P('inv', 'IN'))).schema;
    s = ok(connect(s, B('main'), P('tr', 'B'))).schema;
    s = ok(connect(s, P('inv', 'OUT'), P('meter', 'IN'))).schema;
    s = ok(connect(s, P('meter', 'OUT'), P('tr', 'A'))).schema;
    return s;
  };

  it('owner chain connects without a loop', () => {
    expect(owner().wires).toHaveLength(5);
  });

  it('a wire from the inverter chain back to main is a loop', () => {
    // inverter OUT and meter OUT are wired in the full chain, so use the chain without the meter -> A wire
    const s = owner();
    const open = { ...s, wires: s.wires.filter((w) => !('block' in w.to && w.to.block === 'tr' && w.to.port === 'A')) };
    expect(err(connect(open, P('meter', 'OUT'), B('main')))).toBe('loop');
    expect(err(connect(s, P('inv', 'OUT'), B('main')))).toBe('port-taken');
  });

  it('one bus feeding both inputs of a transfer is not a loop', () => {
    const s0 = schema([{ id: 'bus', kind: 'bus', w: 1, h: 1 }, { id: 'tr', kind: 'transfer', form: '2in1out' }]);
    const s1 = ok(connect(s0, B('bus'), P('tr', 'A'))).schema;
    expect(ok(connect(s1, B('bus'), P('tr', 'B'))).schema.wires).toHaveLength(2);
  });

  it('a loop that exists for one transfer position only is rejected', () => {
    let s = schema([
      { id: 'main', kind: 'bus', w: 1, h: 1 }, { id: 'tr', kind: 'transfer', form: '2in1out' },
      { id: 'd', kind: 'device', deviceId: 'x' },
    ]);
    s = ok(connect(s, B('main'), P('tr', 'A'))).schema;
    s = ok(connect(s, P('tr', 'OUT'), P('d', 'IN'))).schema;
    // closed with the switch on A, open on B
    expect(connect(s, P('d', 'OUT'), B('main'))).toEqual({ error: 'loop' });
  });

  describe('transfer cap', () => {
    // n transfers t1..tn; the last one carries the loop path through its B input
    const build = (n: number) => {
      const blocks: Record<string, unknown>[] = [
        { id: 'main', kind: 'bus', w: 1, h: 1 }, { id: 'd', kind: 'device', deviceId: 'x' },
      ];
      for (let i = 1; i <= n; i++) blocks.push({ id: `t${i}`, kind: 'transfer', form: '2in1out' });
      let s = schema(blocks);
      s = ok(connect(s, B('main'), P(`t${n}`, 'B'))).schema;
      s = ok(connect(s, P(`t${n}`, 'OUT'), P('d', 'IN'))).schema;
      return s;
    };
    it('checks every position of up to 10 transfers', () => {
      expect(connect(build(10), P('d', 'OUT'), B('main'))).toEqual({ error: 'loop' });
    });
    it('does not check transfers beyond the 10th', () => {
      expect('schema' in connect(build(11), P('d', 'OUT'), B('main'))).toBe(true);
    });
  });

  it('a battery fed straight from a plain device OUT is dc-mismatch', () => {
    expect(err(connect(base(), P('d', 'OUT'), P('bat', 'BAT')))).toBe('dc-mismatch');
    // two in ports: a battery BAT and a device IN cannot be wired at all
    expect(err(connect(base(), P('bat', 'BAT'), P('d', 'IN')))).toBe('direction');
  });
});

describe('normalizePower', () => {
  it('returns undefined for a missing value', () => {
    expect(normalizePower(undefined)).toBeUndefined();
    expect(normalizePower(null)).toBeUndefined();
  });

  it('returns the same object when nothing changes', () => {
    const s = owner0();
    expect(normalizePower(s)).toBe(s);
  });

  it('drops malformed entries', () => {
    const raw = {
      blocks: [
        { id: 'g', kind: 'grid', x: 0, y: 0 },
        { id: 'u', kind: 'ufo', x: 0, y: 0 },
        { id: 'n', kind: 'meter', x: 'a', y: 0 },
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
    const n = normalizePower(raw)!;
    expect(n).not.toBe(raw);
    expect(n.blocks.map((b) => b.id)).toEqual(['g', 'bus', 'd']);
    expect(n.wires.map((w) => w.id)).toEqual(['w1', 'w4']);
    expect(n.wires[0].to).toEqual({ bus: 'bus', at: 1 });
    expect(n.wires[1].from).toEqual({ bus: 'bus', at: 0 });
  });
});

function owner0(): PowerSchema {
  return {
    blocks: [blk({ id: 'g', kind: 'grid' }), blk({ id: 'd', kind: 'device', deviceId: 'x' })],
    wires: [{ id: 'w', from: { block: 'g', port: 'OUT' }, to: { block: 'd', port: 'IN' } }],
  };
}

describe('stepDone', () => {
  it('needs a grid power entity and a wire', () => {
    const s = owner0();
    expect(stepDone(s)).toBe(false);
    const withPower = updateBlock(s, 'g', { power: 'sensor.p' } as Partial<PowerBlock>);
    expect(stepDone(withPower)).toBe(true);
    expect(stepDone({ ...withPower, wires: [] })).toBe(false);
  });
});
