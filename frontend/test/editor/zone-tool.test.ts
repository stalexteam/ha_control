import { describe, expect, it } from 'vitest';
import { createZoneTool } from '../../src/editor/tools/zone-tool';
import { addBox } from '../../src/model/ops';
import type { Level } from '../../src/model/types';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number) => ({ pt: { x, y }, shift: false, alt: false, ctrl: false });
const props = { type: 'partition', thickness: 100, baseline: 'center' } as const;
const empty = (): Level => ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [] });
const box = () => addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, props, 'axis');

describe('zone tool', () => {
  it('click in the room creates zone and selects it', () => {
    const name = 'Room 1';
    const ctx = fakeContext(box());
    const selected: unknown[] = [];
    ctx.select = s => { selected.push(s); };
    const t = createZoneTool(ctx);
    t.down(ev(1500, 2000));
    expect(ctx.level().zones.map(z => z.name)).toEqual([name]);
    expect(selected).toEqual([{ kind: 'zone', id: ctx.level().zones[0].id }]);
  });

  it('second click in the same room creates nothing', () => {
    const ctx = fakeContext(box());
    const t = createZoneTool(ctx);
    t.down(ev(1500, 2000)); t.down(ev(1000, 1000));
    expect(ctx.level().zones).toHaveLength(1);
    expect(ctx.commits).toHaveLength(1);
  });
});
