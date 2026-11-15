import { describe, expect, it } from 'vitest';
import { createWallTool } from '../../src/editor/tools/wall-tool';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number, shift = false) => ({ pt: { x, y }, shift, alt: false });
const typeKeys = (t: ReturnType<typeof createWallTool>, s: string) => {
  for (const ch of s) t.key(ch, { shift: false });
};
const k = { shift: false };

describe('wall tool', () => {
  it('two clicks + Esc make one wall and one commit', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); t.down(ev(3000, 0));
    t.key('Escape', k);
    expect(ctx.level().walls).toHaveLength(1);
    expect(ctx.commits).toHaveLength(1);
    const l = ctx.level();
    const w = l.walls[0];
    const a = l.nodes.find(n => n.id === w.a)!, b = l.nodes.find(n => n.id === w.b)!;
    expect(Math.hypot(b.x - a.x, b.y - a.y)).toBe(3000);
  });

  it('shift locks the segment to the axis', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); t.move(ev(2000, 130, true)); t.down(ev(2000, 130, true));
    const l = ctx.level();
    expect(l.nodes.map(n => [n.x, n.y])).toEqual([[0, 0], [2000, 0]]);
  });

  it('typed length uses cursor direction', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); t.move(ev(1000, 10));
    typeKeys(t, '3450'); t.key('Enter', k);
    expect(ctx.level().nodes.map(n => [n.x, n.y])).toEqual([[0, 0], [3450, 0]]);
  });

  it('typed angle: 90 points up on screen', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); t.move(ev(1000, 0));
    typeKeys(t, '2000'); t.key('Tab', k); typeKeys(t, '90'); t.key('Enter', k);
    const n = ctx.level().nodes[1];
    expect([n.x, n.y]).toEqual([0, -2000]);
  });

  it('rejects comma in the buffer', () => {
    const t = createWallTool(fakeContext());
    t.down(ev(0, 0));
    expect(t.key('3', k)).toBe(true);
    expect(t.key(',', k)).toBe(false);
    t.key('4', k);
    expect(t.preview().tracker?.length).toBe('34');
  });

  it('zero segment is not committed and chain stays active', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); t.down(ev(0, 0));
    expect(ctx.level().walls).toHaveLength(0);
    t.down(ev(1000, 0));
    expect(ctx.level().walls).toHaveLength(1);
    expect(ctx.level().nodes.map(n => [n.x, n.y])).toEqual([[0, 0], [1000, 0]]);
  });

  it('closing on the chain start finishes the chain', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); t.down(ev(3000, 0)); t.down(ev(0, 3000)); t.down(ev(5, 5));
    expect(ctx.level().walls).toHaveLength(3);
    expect(ctx.level().nodes).toHaveLength(3);
    // chain finished: next click starts a new chain, no wall
    t.down(ev(8000, 8000));
    expect(ctx.level().walls).toHaveLength(3);
  });

  it('Esc with non-empty buffer clears it, chain survives', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); typeKeys(t, '12');
    expect(t.key('Escape', k)).toBe(true);
    expect(t.preview().tracker?.length).toBe('');
    t.down(ev(1000, 0));
    expect(ctx.level().walls).toHaveLength(1);
  });

  it('typed length right after click (no move) defaults to +X', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); typeKeys(t, '3450'); t.key('Enter', k);
    expect(ctx.level().nodes.map(n => [n.x, n.y])).toEqual([[0, 0], [3450, 0]]);
  });

  it('closing a rectangle by typed lengths reuses the start node', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0));
    for (const [x, y, len] of [[3000, 0, '3000'], [3000, 2000, '2000'], [0, 2000, '3000'], [0, 0, '2000']] as const) {
      t.move(ev(x, y)); typeKeys(t, len); t.key('Enter', k);
    }
    expect(ctx.level().walls).toHaveLength(4);
    expect(ctx.level().nodes).toHaveLength(4);
    t.down(ev(9000, 9000));
    expect(ctx.level().walls).toHaveLength(4);
  });

  it('Shift key without mouse move refreshes ortho', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.down(ev(0, 0)); t.move(ev(2000, 130));
    t.key('Shift', { shift: true });
    expect(t.preview().walls![0].b).toEqual({ x: 2000, y: 0 });
  });

  it('preview carries snap on every move and the chain anchor once started', () => {
    const ctx = fakeContext();
    const t = createWallTool(ctx);
    t.move(ev(110, 190));
    expect(t.preview().snap?.kind).toBe('grid');
    expect(t.preview().anchor).toBeUndefined();
    t.down(ev(0, 0)); t.move(ev(1000, 0));
    expect(t.preview().snap).toBeDefined();
    expect(t.preview().anchor).toEqual({ x: 0, y: 0 });
    t.down(ev(1000, 0)); t.move(ev(1000, 700));
    expect(t.preview().anchor).toEqual({ x: 1000, y: 0 });
    t.key('Escape', k);
    expect(t.preview().anchor).toBeUndefined();
  });
});
