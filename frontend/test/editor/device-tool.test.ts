import { describe, expect, it } from 'vitest';
import { createDeviceTool } from '../../src/editor/tools/device-tool';
import { addBox } from '../../src/model/ops';
import { deviceDefaults, type DeviceProps, type Level } from '../../src/model/types';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number) => ({ pt: { x, y }, shift: false, alt: false, ctrl: false });
const props = { type: 'partition', thickness: 100, baseline: 'center' } as const;
const empty = (): Level => ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });
const box = () => addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, props, 'axis');

describe('device place tool', () => {
  it('wall switch near the top wall: wall placement, side right; click adds and selects', () => {
    const ctx = fakeContext(box());
    let selected: unknown = null;
    ctx.select = s => { selected = s; };
    const t = createDeviceTool(ctx, 'wall_switch');
    expect(t.id).toBe('wall_switch');
    t.move(ev(1500, 10));
    const pv = t.preview().device!;
    expect(pv.invalid).toBe(false);
    expect(pv.placement).toMatchObject({ mode: 'wall', side: 'right', offset: 1500 });
    t.down(ev(1500, 10)); t.up(ev(1500, 10));
    expect(ctx.level().devices).toHaveLength(1);
    expect(ctx.level().devices[0].name).toBe('Wall switch 1');
    expect(ctx.commits).toHaveLength(1);
    expect(selected).toEqual({ kind: 'device', id: ctx.level().devices[0].id });
  });

  it('wall switch in the middle of the room: nothing placed, preview invalid', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'wall_switch');
    t.move(ev(1500, 2000));
    expect(t.preview().device!.invalid).toBe(true);
    t.down(ev(1500, 2000));
    expect(ctx.level().devices).toHaveLength(0);
    expect(ctx.commits).toHaveLength(0);
  });

  it('equipment near a wall is placed free: a wall mount is chosen, not snapped to', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'equipment');
    t.move(ev(1500, 10));
    expect(t.preview().device!.placement).toMatchObject({ mode: 'free' });
    t.down(ev(1500, 10));
    expect(ctx.level().devices[0].placement).toMatchObject({ mode: 'free' });
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
    const lv = ctx.level();
    expect(lv.devices[0].placement).toEqual({ mode: 'wall', wallId: lv.walls[0].id, side: 'right', offset: 0 });
  });

  it('cursor above the top wall gives side left', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'wall_switch');
    t.move(ev(1500, -10));
    expect(t.preview().device!.placement).toMatchObject({ mode: 'wall', side: 'left', offset: 1500 });
  });

  it('keeps a user-set zone angle when a motion sensor lands on a wall; free default still becomes 110', () => {
    const ctx = fakeContext(box());
    ctx.deviceDefaults = k => ({ ...deviceDefaults(k, 'free'), ...(k === 'motion_sensor' ? { zoneAngle: 180 } : {}) } as DeviceProps);
    const t = createDeviceTool(ctx, 'motion_sensor');
    t.down(ev(1500, 10)); t.up(ev(1500, 10));
    expect(ctx.level().devices[0].props).toMatchObject({ kind: 'motion_sensor', zoneAngle: 180 });
    const ctx2 = fakeContext(box());
    const t2 = createDeviceTool(ctx2, 'motion_sensor');
    t2.down(ev(1500, 10)); t2.up(ev(1500, 10));
    expect(ctx2.level().devices[0].props).toMatchObject({ zoneAngle: (deviceDefaults('motion_sensor', 'wall') as { zoneAngle: number }).zoneAngle });
  });

  it('default name uses the smallest unused number of the kind', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'wall_switch');
    for (const x of [500, 1000, 1500]) { t.down(ev(x, 10)); t.up(ev(x, 10)); }
    expect(ctx.level().devices.map(d => d.name)).toEqual(['Wall switch 1', 'Wall switch 2', 'Wall switch 3']);
    const gone = ctx.level().devices[1].id;
    ctx.commit({ ...ctx.level(), devices: ctx.level().devices.filter(d => d.id !== gone) });
    t.down(ev(2000, 10)); t.up(ev(2000, 10));
    expect(ctx.level().devices.map(d => d.name)).toEqual(['Wall switch 1', 'Wall switch 3', 'Wall switch 2']);
  });
});

describe('aim knob from the placement tool', () => {
  // tolMm 20 => handle 120 mm. Top wall right-side device at (1500, 50) faces (0,1); knob at (1500, 170).
  const aimOf = (ctx: ReturnType<typeof fakeContext>) => { const p = ctx.level().devices[0].placement; return p.mode === 'wall' ? p.aim : NaN; };
  const k = { shift: false };
  function placed() {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'motion_sensor');
    ctx.select = () => {};
    t.down(ev(1500, 10)); t.up(ev(1500, 10));
    return { ctx, t };
  }

  it('press on the knob and drag to 45: aim 45, no extra device, one drag commit', () => {
    const { ctx, t } = placed();
    expect(ctx.commits).toHaveLength(1);
    t.down(ev(1500, 170)); t.move(ev(1500 + 300 * Math.SQRT1_2, 50 + 300 * Math.SQRT1_2)); t.up(ev(1500 + 300 * Math.SQRT1_2, 50 + 300 * Math.SQRT1_2));
    expect(ctx.level().devices).toHaveLength(1);
    expect(ctx.commits).toHaveLength(2);
    expect(aimOf(ctx)).toBe(45);
  });

  it('press 5 px off the knob centre, release without movement: no change', () => {
    const { ctx, t } = placed();
    t.down(ev(1500 + 10, 170)); t.up(ev(1500 + 11, 170));
    expect(ctx.level().devices).toHaveLength(1);
    expect(ctx.commits).toHaveLength(1);
  });

  it('grab offset: pressing off-centre then moving a little does not jump', () => {
    const { ctx, t } = placed();
    t.down(ev(1500 + 15, 170)); t.move(ev(1516.5, 182)); t.up(ev(1516.5, 182));
    expect(aimOf(ctx)).toBeUndefined();
    expect(ctx.commits).toHaveLength(1);
  });

  it('Escape mid-drag: unchanged', () => {
    const { ctx, t } = placed();
    t.down(ev(1500, 170)); t.move(ev(1000, 300));
    expect(t.key('Escape', k)).toBe(true);
    t.up(ev(1000, 300));
    expect(ctx.commits).toHaveLength(1);
    expect(aimOf(ctx)).toBeUndefined();
  });
});

describe('climate sensor and fan tools', () => {
  it('fan on open floor: invalid preview, nothing placed', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'exhaust_fan');
    t.move(ev(1500, 2000));
    expect(t.preview().device!.invalid).toBe(true);
    t.down(ev(1500, 2000)); t.up(ev(1500, 2000));
    expect(ctx.level().devices).toHaveLength(0);
  });
  it('climate sensor placed free with default name', () => {
    const ctx = fakeContext(box());
    const t = createDeviceTool(ctx, 'climate_sensor');
    t.move(ev(1500, 2000)); t.down(ev(1500, 2000)); t.up(ev(1500, 2000));
    expect(ctx.level().devices[0].placement.mode).toBe('free');
    expect(ctx.level().devices[0].name).toBe('Climate sensor 1');
  });
});
