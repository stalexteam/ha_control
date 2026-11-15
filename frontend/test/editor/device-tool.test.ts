import { describe, expect, it } from 'vitest';
import { createDeviceTool } from '../../src/editor/tools/device-tool';
import { addBox } from '../../src/model/ops';
import type { Level } from '../../src/model/types';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number) => ({ pt: { x, y }, shift: false, alt: false, ctrl: false });
const props = { type: 'partition', thickness: 100, baseline: 'center' } as const;
const empty = (): Level => ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });
const box = () => addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, props, 'axis');

describe('device place tool', () => {
  it('switch near the top wall: wall placement, side right; click adds and selects', () => {
    const ctx = fakeContext(box());
    let selected: unknown = null;
    ctx.select = s => { selected = s; };
    const t = createDeviceTool(ctx, 'switch');
    expect(t.id).toBe('switch');
    t.move(ev(1500, 10));
    const pv = t.preview().device!;
    expect(pv.invalid).toBe(false);
    expect(pv.placement).toMatchObject({ mode: 'wall', side: 'right', offset: 1500 });
    t.down(ev(1500, 10)); t.up(ev(1500, 10));
    expect(ctx.level().devices).toHaveLength(1);
    expect(ctx.level().devices[0].name).toBe('Switch 1');
    expect(ctx.commits).toHaveLength(1);
    expect(selected).toEqual({ kind: 'device', id: ctx.level().devices[0].id });
  });

  it('switch in the middle of the room: nothing placed, preview invalid', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'switch');
    t.move(ev(1500, 2000));
    expect(t.preview().device!.invalid).toBe(true);
    t.down(ev(1500, 2000));
    expect(ctx.level().devices).toHaveLength(0);
    expect(ctx.commits).toHaveLength(0);
  });

  it('ceiling light snaps to the grid', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'ceiling_light');
    t.move(ev(1234, 567)); t.down(ev(1234, 567));
    expect(ctx.level().devices[0].placement).toEqual({ mode: 'free', x: 1200, y: 600, rotation: 0 });
  });

  it('motion sensor on a wall gets zoneAngle 110, free gets 360', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'motion_sensor');
    t.move(ev(1500, 10)); t.down(ev(1500, 10));
    expect(ctx.level().devices[0].placement.mode).toBe('wall');
    expect(ctx.level().devices[0].props).toMatchObject({ zoneAngle: 110 });
    t.move(ev(1500, 2000)); t.down(ev(1500, 2000));
    expect(ctx.level().devices[1].props).toMatchObject({ zoneAngle: 360 });
  });

  it('wall corner (node snap) hosts a wall device on an attached wall', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'socket');
    t.move(ev(5, 5)); t.down(ev(5, 5));
    expect(ctx.level().devices[0].placement).toMatchObject({ mode: 'wall' });
  });
});
