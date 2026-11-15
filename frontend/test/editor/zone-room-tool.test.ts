import { describe, expect, it } from 'vitest';
import { createZoneRoomTool } from '../../src/editor/tools/zone-room-tool';
import { addBox } from '../../src/model/ops';
import { addZone } from '../../src/model/zones';
import { levelZones, type Id, type Level } from '../../src/model/types';
import type { Selection } from '../../src/editor/tools/types';
import { rectRoomLevel } from '../fixtures';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number) => ({ pt: { x, y }, shift: false, alt: false, ctrl: false });

/** A 3000 x 4000 room 'Kitchen' (rectRoomLevel, 400 mm walls). */
function kitchen(): { level: Level; roomId: Id } {
  const r = addZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'Kitchen');
  return { level: r.level, roomId: r.zoneId! };
}

function setup(level: Level) {
  const ctx = fakeContext(level);
  const selected: (Selection | null)[] = [];
  ctx.select = s => { selected.push(s); };
  return { ctx, selected, t: createZoneRoomTool(ctx) };
}

describe('zone room tool', () => {
  it('room tool creates a room zone and selects it', () => {
    const { level, roomId } = kitchen();
    const { ctx, selected, t } = setup(level);
    expect(t.id).toBe('zone-room');
    t.down(ev(1000, 1000)); t.up(ev(1000, 1000));
    expect(ctx.commits).toHaveLength(1);
    const zones = levelZones(ctx.level());
    expect(zones).toHaveLength(1);
    expect(zones[0]).toMatchObject({ name: 'Kitchen', shape: { kind: 'room', roomId }, invalid: false });
    expect(selected).toEqual([{ kind: 'automationZone', id: zones[0].id }]);
  });

  it('the smallest room containing the point wins', () => {
    // A closet box inside the hall: the hall outline is one ring, so it contains the closet too.
    const hall = addZone(rectRoomLevel(3000, 4000, 400), { x: 500, y: 3000 }, 'Hall').level;
    const boxed = addBox(hall, { x: 1000, y: 1000 }, { x: 2000, y: 2000 }, { type: 'partition', thickness: 100, baseline: 'center' }, 'axis');
    const level = addZone(boxed, { x: 1500, y: 1500 }, 'Closet').level;
    const closet = level.zones.find(r => r.name === 'Closet')!;
    const { ctx, t } = setup(level);
    t.down(ev(1500, 1500));
    expect(levelZones(ctx.level()).map(z => z.shape)).toEqual([{ kind: 'room', roomId: closet.id }]);
    expect(levelZones(ctx.level())[0].name).toBe('Closet');
  });

  it('clicking the same room again selects the existing zone without a commit', () => {
    const { level } = kitchen();
    const { ctx, selected, t } = setup(level);
    t.down(ev(1000, 1000)); t.up(ev(1000, 1000));
    const after = ctx.level();
    t.down(ev(2000, 3000)); t.up(ev(2000, 3000));
    expect(ctx.commits).toHaveLength(1);
    expect(ctx.level()).toBe(after);
    const id = levelZones(after)[0].id;
    expect(selected).toEqual([{ kind: 'automationZone', id }, { kind: 'automationZone', id }]);
  });

  it('outside rooms nothing happens', () => {
    const { level } = kitchen();
    const { ctx, selected, t } = setup(level);
    t.down(ev(5000, 5000)); t.up(ev(5000, 5000));
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level()).toBe(level);
    expect(selected).toEqual([]);
  });

  it('Escape is never consumed', () => {
    const { level } = kitchen();
    const { t } = setup(level);
    expect(t.key('Escape', { shift: false })).toBe(false);
    t.down(ev(1000, 1000));
    expect(t.key('Escape', { shift: false })).toBe(false);
  });
});
