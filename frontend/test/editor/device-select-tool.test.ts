import { describe, expect, it } from 'vitest';
import { createDeviceSelectTool } from '../../src/editor/tools/device-select-tool';
import { addBox } from '../../src/model/ops';
import { addDevice } from '../../src/model/devices';
import { deviceDefaults, type DeviceKind, type DevicePlacement, type Level } from '../../src/model/types';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number, shift = false) => ({ pt: { x, y }, shift, alt: false, ctrl: false });
const props = { type: 'partition', thickness: 100, baseline: 'center' } as const;
const empty = (): Level => ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });
const k = { shift: false, ctrl: false };

/** Box 3000x4000 with one device; wallIndex picks the host wall for wall placements (0 = top, 3 = left). */
function withDevice(kind: DeviceKind, placement: (walls: Level['walls']) => DevicePlacement) {
  const base = addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, props, 'axis');
  const pl = placement(base.walls);
  const r = addDevice(base, deviceDefaults(kind, pl.mode), pl, 'D');
  return { lv: r.level, id: r.deviceId! };
}
const free = (x: number, y: number): (() => DevicePlacement) => () => ({ mode: 'free', x, y, rotation: 0 });
const onTop = (offset: number) => (w: Level['walls']): DevicePlacement => ({ mode: 'wall', wallId: w[0].id, side: 'right', offset });

describe('device select tool', () => {
  it('click selects a device, click on empty clears', () => {
    const { lv, id } = withDevice('equipment', free(1000, 1000));
    const ctx = fakeContext(lv);
    const sels: unknown[] = [];
    ctx.select = s => { sels.push(s); };
    const t = createDeviceSelectTool(ctx);
    expect(t.id).toBe('device-select');
    t.down(ev(1000, 1000)); t.up(ev(1000, 1000));
    t.down(ev(2500, 3000)); t.up(ev(2500, 3000));
    expect(sels).toEqual([{ kind: 'device', id }, null]);
    expect(ctx.commits).toHaveLength(0);
  });

  it('drag free equipment by 500: one commit, moved', () => {
    const { lv, id } = withDevice('equipment', free(1000, 1000));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1000, 1000)); t.move(ev(1300, 1000)); t.move(ev(1500, 1000)); t.up(ev(1500, 1000));
    expect(ctx.commits).toHaveLength(1);
    expect(ctx.level().devices.find(d => d.id === id)!.placement).toMatchObject({ mode: 'free', x: 1500, y: 1000 });
  });

  it('shift locks to the axis from the grab', () => {
    const { lv } = withDevice('equipment', free(1000, 1000));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1000, 1000)); t.move(ev(1500, 1100, true)); t.up(ev(1500, 1100, true));
    expect(ctx.level().devices[0].placement).toMatchObject({ x: 1500, y: 1000 });
  });

  it('drag a switch into the room centre: unchanged, no commit', () => {
    const { lv } = withDevice('switch', onTop(1500));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1500, 50)); t.move(ev(1500, 2000)); t.up(ev(1500, 2000));
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level().devices[0].placement).toMatchObject({ mode: 'wall', offset: 1500 });
  });

  it('wall light slides along its wall and re-hosts on another wall', () => {
    const { lv, id } = withDevice('wall_light', onTop(1500));
    const top = lv.walls[0].id;
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1500, 50)); t.move(ev(1000, 10)); t.up(ev(1000, 10));
    expect(ctx.level().devices[0].placement).toMatchObject({ wallId: top, offset: 1000 });
    expect(ctx.commits).toHaveLength(1);
    t.down(ev(1000, 50)); t.move(ev(10, 2000)); t.up(ev(10, 2000));
    const pl = ctx.level().devices.find(d => d.id === id)!.placement;
    expect(pl.mode).toBe('wall');
    expect(pl.mode === 'wall' && pl.wallId).not.toBe(top);
    expect(ctx.commits).toHaveLength(2);
  });

  it('wall light leaves the wall into a free position', () => {
    const { lv } = withDevice('wall_light', onTop(1500));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1500, 50)); t.move(ev(1500, 2000)); t.up(ev(1500, 2000));
    expect(ctx.level().devices[0].placement).toMatchObject({ mode: 'free', x: 1500, y: 2000 });
  });

  it('dragging along the wall keeps aim', () => {
    const { lv } = withDevice('motion_sensor', w => ({ mode: 'wall', wallId: w[0].id, side: 'right', offset: 1500, aim: 30 }));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1500, 50)); t.move(ev(1000, 10)); t.up(ev(1000, 10));
    expect(ctx.level().devices[0].placement).toMatchObject({ mode: 'wall', offset: 1000, aim: 30 });
  });

  it('aimed wall device leaving the wall keeps its world direction as rotation', () => {
    const { lv } = withDevice('wall_light', w => ({ mode: 'wall', wallId: w[0].id, side: 'right', offset: 1500, aim: 45 }));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1500, 50)); t.move(ev(1500, 2000)); t.up(ev(1500, 2000));
    expect(ctx.level().devices[0].placement).toMatchObject({ mode: 'free', rotation: 315 });
  });

  it('Delete removes the selected device; cancel clears selection', () => {
    const { lv } = withDevice('equipment', free(1000, 1000));
    const ctx = fakeContext(lv);
    const sels: unknown[] = [];
    ctx.select = s => { sels.push(s); };
    const t = createDeviceSelectTool(ctx);
    expect(t.key('Delete', k)).toBe(false);
    t.down(ev(1000, 1000)); t.up(ev(1000, 1000));
    expect(t.key('Delete', k)).toBe(true);
    expect(ctx.level().devices).toHaveLength(0);
    expect(ctx.commits).toHaveLength(1);
    t.cancel();
    expect(sels[sels.length - 1]).toBeNull();
  });

  it('out-and-back drag commits nothing', () => {
    const { lv } = withDevice('equipment', free(1000, 1000));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1000, 1000)); t.move(ev(1500, 1000)); t.move(ev(1000, 1000)); t.up(ev(1000, 1000));
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level().devices[0].placement).toMatchObject({ x: 1000, y: 1000 });
  });

  it('a drag that grid-snaps back to the same placement commits nothing', () => {
    const { lv } = withDevice('equipment', free(1000, 1000));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1000, 1000)); t.move(ev(1020, 1000)); t.up(ev(1020, 1000));
    expect(ctx.commits).toHaveLength(0);
  });

  it('Escape mid-drag restores and commits nothing', () => {
    const { lv } = withDevice('equipment', free(1000, 1000));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1000, 1000)); t.move(ev(1500, 1000));
    expect(t.key('Escape', k)).toBe(true);
    t.up(ev(1500, 1000));
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level().devices[0].placement).toMatchObject({ x: 1000, y: 1000 });
  });

  it('Backspace deletes the selected device', () => {
    const { lv } = withDevice('equipment', free(1000, 1000));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1000, 1000)); t.up(ev(1000, 1000));
    expect(t.key('Backspace', k)).toBe(true);
    expect(ctx.level().devices).toHaveLength(0);
  });

  it('a 1 mm jitter on a wall switch commits nothing', () => {
    const { lv } = withDevice('switch', onTop(1500));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1500, 50)); t.move(ev(1501, 50)); t.up(ev(1501, 50));
    expect(ctx.commits).toHaveLength(0);
    t.down(ev(1500, 50)); t.move(ev(1500, 49)); t.up(ev(1500, 49));
    expect(ctx.commits).toHaveLength(0);
  });

  it('a wall device grabbed 50 mm off-centre slides by exactly the pointer delta', () => {
    const { lv, id } = withDevice('wall_light', onTop(1500));
    const ctx = fakeContext(lv);
    ctx.tolMm = () => 100; // zoomed out: the icon is 120 mm wide, so a grab 50 mm off-centre still hits
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1550, 50)); t.move(ev(1700, 50)); t.up(ev(1850, 50));
    expect(ctx.level().devices.find(d => d.id === id)!.placement).toMatchObject({ mode: 'wall', side: 'right', offset: 1800 });
  });

  it('a same-wall drag near the axis never flips the side', () => {
    const { lv, id } = withDevice('wall_light', onTop(1500));
    const ctx = fakeContext(lv);
    const t = createDeviceSelectTool(ctx);
    t.down(ev(1500, 50)); t.move(ev(1600, -10)); t.up(ev(1700, -10));
    expect(ctx.level().devices.find(d => d.id === id)!.placement).toMatchObject({ mode: 'wall', side: 'right', offset: 1700 });
  });
});
