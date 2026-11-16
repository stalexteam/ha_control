import { describe, expect, it } from 'vitest';
import { createZoneRoomTool } from '../../src/editor/tools/zone-room-tool';
import { addBox } from '../../src/model/ops';
import { addWallsZone } from '../../src/model/zones';
import type { Level } from '../../src/model/types';
import type { Selection } from '../../src/editor/tools/types';
import { rectRoomLevel } from '../fixtures';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number) => ({ pt: { x, y }, shift: false, alt: false, ctrl: false });

/** A 3000 x 4000 room (rectRoomLevel, 400 mm walls) without zones. */
const kitchen = (): Level => rectRoomLevel(3000, 4000, 400);

function setup(level: Level) {
  const ctx = fakeContext(level);
  const selected: (Selection | null)[] = [];
  ctx.select = s => { selected.push(s); };
  return { ctx, selected, t: createZoneRoomTool(ctx) };
}

describe('zone room tool', () => {
  it('a click inside closed walls creates a walls zone "Zone 1" and selects it', () => {
    const { ctx, selected, t } = setup(kitchen());
    expect(t.id).toBe('zone-room');
    t.down(ev(1000, 1000)); t.up(ev(1000, 1000));
    expect(ctx.commits).toHaveLength(1);
    const zones = ctx.level().zones;
    expect(zones).toHaveLength(1);
    expect(zones[0]).toMatchObject({ name: 'Zone 1', shape: { kind: 'walls', seed: { x: 1000, y: 1000 }, broken: false }, invalid: false });
    expect(selected).toEqual([{ kind: 'zone', id: zones[0].id }]);
  });

  it('the smallest loop containing the point wins', () => {
    // A closet box inside the hall: the hall outline is one ring, so it contains the closet too.
    const hall = addWallsZone(kitchen(), { x: 500, y: 3000 }, 'Hall').level;
    const level = addBox(hall, { x: 1000, y: 1000 }, { x: 2000, y: 2000 }, { type: 'partition', thickness: 100, baseline: 'center' }, 'axis');
    const { ctx, t } = setup(level);
    t.down(ev(1500, 1500));
    const zones = ctx.level().zones;
    expect(zones.map(z => z.name)).toEqual(['Hall', 'Zone 1']);
    const s = zones[1].shape;
    if (s.kind !== 'walls') throw new Error('not walls');
    for (const p of s.outline) {
      expect([1050, 1950]).toContain(p.x);
      expect([1050, 1950]).toContain(p.y);
    }
  });

  it('clicking the same loop again selects the existing zone without a commit', () => {
    const { ctx, selected, t } = setup(kitchen());
    t.down(ev(1000, 1000)); t.up(ev(1000, 1000));
    const after = ctx.level();
    t.down(ev(2000, 3000)); t.up(ev(2000, 3000));
    expect(ctx.commits).toHaveLength(1);
    expect(ctx.level()).toBe(after);
    const id = after.zones[0].id;
    expect(selected).toEqual([{ kind: 'zone', id }, { kind: 'zone', id }]);
  });

  it('outside every loop nothing happens', () => {
    const level = kitchen();
    const { ctx, selected, t } = setup(level);
    t.down(ev(5000, 5000)); t.up(ev(5000, 5000));
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level()).toBe(level);
    expect(selected).toEqual([]);
  });

  it('Escape is never consumed', () => {
    const { t } = setup(kitchen());
    expect(t.key('Escape', { shift: false })).toBe(false);
    t.down(ev(1000, 1000));
    expect(t.key('Escape', { shift: false })).toBe(false);
  });
});
