import { describe, it, expect } from 'vitest';
import { createToolContext, type ToolHost } from '../../src/panel/tool-context';
import { initialNext } from '../../src/panel/next-object';
import { History } from '../../src/editor/history';
import { deviceDefaults, emptyLevel } from '../../src/model/types';
import type { PlanDoc } from '../../src/model/power';

function host(): ToolHost {
  return {
    history: null, view: { x: 0, y: 0, scale: 0.1 }, grid: true, wallType: 'partition', thickness: 250, boxMeasure: 'axis',
    nextProps: {} as ToolHost['nextProps'], nextObj: initialNext(), selection: null, notice: 'x', fieldNotice: 'f', mode: 'plan',
    commit: () => {}, power: { blocks: [], wires: [] }, commitPower: () => {},
    placeDeviceId: null, setPowerPosition: () => {}, pickTool: () => {},
  };
}

describe('createToolContext', () => {
  it('reads wall props, grid and tolerance from the host', () => {
    const c = createToolContext(host());
    expect(c.wallProps()).toEqual({ type: 'partition', thickness: 250, baseline: 'center' });
    expect(c.grid()).toBe(100);
    expect(c.tolMm()).toBeCloseTo(100);
    expect(c.scale()).toBe(0.1);
  });

  it('opening defaults come from next-object state', () => {
    const h = host();
    h.nextObj = { ...h.nextObj, door: { width: 800, hinge: 'end', swing: 'right' } };
    expect(createToolContext(h).openingDefaults('door')).toEqual({ width: 800, hinge: 'end', swing: 'right' });
  });

  it('select clears the notice', () => {
    const h = host();
    createToolContext(h).select({ kind: 'wall', id: 'w' });
    expect(h.selection).toEqual({ kind: 'wall', id: 'w' });
    expect(h.notice).toBeNull();
    expect(h.fieldNotice).toBeNull();
  });

  it('selection reads the panel selection', () => {
    const h = host();
    const c = createToolContext(h);
    expect(c.selection()).toBeNull();
    h.selection = { kind: 'automationZone', id: 'z' };
    expect(c.selection()).toEqual({ kind: 'automationZone', id: 'z' });
  });

  it('Power services: armed device, notice, position and tool switch go through the host', () => {
    const h = host();
    const calls: unknown[] = [];
    h.setPowerPosition = (id, p) => { calls.push(['position', id, p]); };
    h.pickTool = id => { calls.push(['tool', id]); };
    const c = createToolContext(h);
    expect(c.placeDeviceId()).toBeNull();
    h.placeDeviceId = 'd1';
    expect(c.placeDeviceId()).toBeNull(); // no plan open: d1 is not placeable, so the stale arm is dropped
    expect(h.placeDeviceId).toBeNull();
    c.notify('careful');
    expect(h.notice).toBe('careful');
    c.notify(null);
    expect(h.notice).toBeNull();
    c.setPosition('ts', '0');
    c.pickTool('power-select');
    expect(calls).toEqual([['position', 'ts', '0'], ['tool', 'power-select']]);
    expect(c.geo().device('d1')).toBeUndefined(); // no plan open
  });

  it('the armed device counts only while it is placeable; devicePlaced clears the arm', () => {
    const level = { ...emptyLevel('L1'), devices: [{
      id: 'd1', name: 'Socket', invalid: false, placement: { mode: 'free' as const, x: 0, y: 0, rotation: 0 },
      props: deviceDefaults('socket', 'free'),
    }] };
    const h = { ...host(), history: new History<PlanDoc>({ level }), placeDeviceId: 'd1' };
    const c = createToolContext(h);
    expect(c.placeDeviceId()).toBe('d1');
    c.devicePlaced?.();
    expect(h.placeDeviceId).toBeNull();
    const placed = { ...h, power: { blocks: [{ id: 'b', kind: 'device' as const, x: 0, y: 0, deviceId: 'd1' }], wires: [] }, placeDeviceId: 'd1' };
    expect(createToolContext(placed).placeDeviceId()).toBeNull(); // already in the schematic
    expect(placed.placeDeviceId).toBeNull();
  });

  it('select clears the field notice in every mode; in Binding the session notice stays', () => {
    for (const mode of ['plan', 'equipment', 'binding', 'zones']) {
      const h = { ...host(), mode };
      createToolContext(h).select({ kind: 'device', id: 'd' });
      expect(h.fieldNotice, mode).toBeNull();
      expect(h.notice, mode).toBe(mode === 'binding' ? 'x' : null);
    }
  });
});
