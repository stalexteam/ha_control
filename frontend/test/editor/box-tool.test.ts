import { describe, expect, it } from 'vitest';
import { createBoxTool } from '../../src/editor/tools/box-tool';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number) => ({ pt: { x, y }, shift: false, alt: false, ctrl: false });
const k = { shift: false, ctrl: false };
const typeKeys = (t: ReturnType<typeof createBoxTool>, s: string) => { for (const ch of s) t.key(ch, k); };

describe('box tool', () => {
  it('two clicks build 4 walls with inner measure', () => {
    const ctx = fakeContext();
    const t = createBoxTool(ctx);
    t.down(ev(0, 0)); t.move(ev(3000, 4000)); t.down(ev(3000, 4000));
    const l = ctx.level();
    expect(l.walls).toHaveLength(4);
    expect(ctx.commits).toHaveLength(1);
    expect(l.nodes.map(n => [n.x, n.y]).sort()).toEqual([[-50, -50], [-50, 4050], [3050, -50], [3050, 4050]].sort());
  });

  it('typed W Tab D Enter uses cursor quadrant', () => {
    const ctx = fakeContext();
    const t = createBoxTool(ctx);
    t.down(ev(0, 0)); t.move(ev(-1000, 1000));
    typeKeys(t, '5000'); t.key('Tab', k); typeKeys(t, '3000'); t.key('Enter', k);
    const xs = ctx.level().nodes.map(n => n.x), ys = ctx.level().nodes.map(n => n.y);
    expect(Math.min(...xs)).toBe(-5050);
    expect(Math.max(...xs)).toBe(50);
    expect(Math.min(...ys)).toBe(-50);
    expect(Math.max(...ys)).toBe(3050);
  });

  it('preview shows 4 walls after corner 1', () => {
    const t = createBoxTool(fakeContext());
    t.down(ev(0, 0)); t.move(ev(1000, 1000));
    expect(t.preview().walls).toHaveLength(4);
  });

  it('double click on one point commits nothing', () => {
    const ctx = fakeContext();
    const t = createBoxTool(ctx);
    t.down(ev(0, 0)); t.move(ev(0, 0));
    expect(t.preview().walls).toBeUndefined();
    t.down(ev(0, 0));
    expect(ctx.commits).toHaveLength(0);
  });

  it('preview carries snap before and after the first corner, and the first corner as anchor', () => {
    const ctx = fakeContext();
    const t = createBoxTool(ctx);
    t.move(ev(110, 190));
    expect(t.preview().snap?.kind).toBe('grid');
    t.down(ev(0, 0)); t.move(ev(2010, 990));
    expect(t.preview().snap?.kind).toBe('grid');
    expect(t.preview().snap?.pt).toEqual({ x: 2000, y: 1000 });
    expect(t.preview().anchor).toEqual({ x: 0, y: 0 });
  });
});
