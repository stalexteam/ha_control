import { describe, expect, it } from 'vitest';
import { createOpeningTool } from '../../src/editor/tools/opening-tool';
import { addBox } from '../../src/model/ops';
import type { Level } from '../../src/model/types';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number) => ({ pt: { x, y }, shift: false, alt: false });
const props = { type: 'partition', thickness: 100, baseline: 'center' } as const;
const empty = (): Level => ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });
const box = () => addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, props, 'axis');

describe('opening tool', () => {
  it('door click mid-wall places a door at offset 1050; second click there is rejected', () => {
    const ctx = fakeContext(box());
    const t = createOpeningTool(ctx, 'door');
    expect(t.id).toBe('door');
    t.move(ev(1500, 0)); t.down(ev(1500, 0));
    expect(ctx.level().openings).toHaveLength(1);
    expect(ctx.level().openings[0].kind).toBe('door');
    expect(ctx.level().openings[0].offset).toBe(1050);
    t.move(ev(1500, 0));
    expect(t.preview().opening?.invalid).toBe(true);
    t.down(ev(1500, 0));
    expect(ctx.level().openings).toHaveLength(1);
    expect(ctx.commits).toHaveLength(1);
  });

  it('preview is centred on the projection and absent off walls', () => {
    const ctx = fakeContext(box());
    const t = createOpeningTool(ctx, 'window');
    t.move(ev(1000, 10));
    expect(t.preview().opening).toMatchObject({ offset: 400, width: 1200, kind: 'window', invalid: false });
    t.move(ev(1500, 2000));
    expect(t.preview().opening).toBeUndefined();
  });

  it('preview carries a wall snap on the hosting wall axis', () => {
    for (const kind of ['door', 'window', 'opening'] as const) {
      const ctx = fakeContext(box());
      const t = createOpeningTool(ctx, kind);
      t.move(ev(1500, 30));
      const s = t.preview().snap!;
      expect(s.kind).toBe('wall');
      expect(s.pt).toEqual({ x: 1500, y: 0 });
      expect(s.endpoint).toMatchObject({ kind: 'wall', wallId: ctx.level().walls[0].id });
      t.move(ev(1500, 2000));
      expect(t.preview().snap).toBeUndefined();
    }
  });
});
