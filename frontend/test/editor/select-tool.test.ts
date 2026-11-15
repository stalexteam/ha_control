import { describe, expect, it } from 'vitest';
import { createSelectTool } from '../../src/editor/tools/select-tool';
import { addBox, addWallSegment, nodePos } from '../../src/model/ops';
import { addOpening } from '../../src/model/openings';
import type { Level } from '../../src/model/types';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number, o: { shift?: boolean; alt?: boolean } = {}) =>
  ({ pt: { x, y }, shift: !!o.shift, alt: !!o.alt, ctrl: false });
const props = { type: 'partition', thickness: 100, baseline: 'center' } as const;
const empty = (): Level => ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });
const box = () => addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, props, 'axis');
const click = (t: ReturnType<typeof createSelectTool>, x: number, y: number) => { t.down(ev(x, y)); t.up(ev(x, y)); };
const k = { shift: false, ctrl: false };

describe('select tool', () => {
  it('dragging a corner of the selected wall is one commit, both walls change', () => {
    const ctx = fakeContext(box());
    const t = createSelectTool(ctx);
    const top = ctx.level().walls[0], right = ctx.level().walls[1];
    click(t, 1500, 0);
    t.down(ev(3000, 0)); t.move(ev(3250, 0)); t.move(ev(3500, 0)); t.up(ev(3500, 0));
    expect(ctx.commits).toHaveLength(1);
    const l = ctx.level();
    expect(nodePos(l, top.b)).toEqual({ x: 3500, y: 0 });
    expect(l.walls.find(w => w.id === right.id)!.a).toBe(top.b);
  });

  it('shift wall-body drag with jitter moves strictly along y', () => {
    const ctx = fakeContext(box());
    const t = createSelectTool(ctx);
    const top = ctx.level().walls[0];
    t.down(ev(1500, 0)); t.move(ev(1540, 300, { shift: true })); t.up(ev(1540, 300, { shift: true }));
    expect(ctx.commits).toHaveLength(1);
    expect(nodePos(ctx.level(), top.a)).toEqual({ x: 0, y: 300 });
    expect(nodePos(ctx.level(), top.b)).toEqual({ x: 3000, y: 300 });
  });

  it('wall-body drag snaps the grab point to the grid', () => {
    const ctx = fakeContext(box());
    const t = createSelectTool(ctx);
    const top = ctx.level().walls[0];
    t.down(ev(1500, 0)); t.move(ev(1500 + 1234, 567)); t.up(ev(1500 + 1234, 567));
    expect(ctx.commits).toHaveLength(1);
    // The box's other walls move with the shared nodes, so only the grid can attract the grab point.
    expect(nodePos(ctx.level(), top.a)).toEqual({ x: 1200, y: 600 });
    expect(nodePos(ctx.level(), top.b)).toEqual({ x: 4200, y: 600 });
  });

  it('wall-body drag without grid moves by whole millimetres', () => {
    const c = Object.assign(fakeContext(box()), { grid: () => null });
    const t = createSelectTool(c);
    const top = c.level().walls[0];
    t.down(ev(1500, 0)); t.move(ev(1500 + 1234.4, 567.6)); t.up(ev(1500 + 1234.4, 567.6));
    expect(c.commits).toHaveLength(1);
    expect(nodePos(c.level(), top.a)).toEqual({ x: 1234, y: 568 });
    expect(nodePos(c.level(), top.b)).toEqual({ x: 4234, y: 568 });
  });

  it('free node drag without grid lands on whole millimetres', () => {
    const c = Object.assign(fakeContext(box()), { grid: () => null });
    const t = createSelectTool(c);
    const top = c.level().walls[0];
    click(t, 1500, 0);
    t.down(ev(3000, 0)); t.move(ev(3250.4, -700.6)); t.up(ev(3250.4, -700.6));
    expect(c.commits).toHaveLength(1);
    expect(nodePos(c.level(), top.b)).toEqual({ x: 3250, y: -701 });
  });

  it('alt-drag of an end detaches it, neighbour stays', () => {
    const ctx = fakeContext(box());
    const t = createSelectTool(ctx);
    const top = ctx.level().walls[0], right = ctx.level().walls[1];
    const rightA = right.a;
    click(t, 1500, 0);
    t.down(ev(3000, 0, { alt: true })); t.move(ev(3000, 600)); t.up(ev(3000, 600));
    expect(ctx.commits).toHaveLength(1);
    const l = ctx.level();
    expect(l.walls.find(w => w.id === right.id)!.a).toBe(rightA);
    expect(nodePos(l, rightA)).toEqual({ x: 3000, y: 0 });
    const nb = l.walls.find(w => w.id === top.id)!.b;
    expect(nb).not.toBe(rightA);
    expect(nodePos(l, nb)).toEqual({ x: 3000, y: 600 });
  });

  it('opening drag beyond the wall is rejected; inside moves once', () => {
    const base = box();
    const { level } = addOpening(base, base.walls[0].id, 'door', 1500);
    const ctx = fakeContext(level);
    const t = createSelectTool(ctx);
    t.down(ev(1500, 0)); t.move(ev(5000, 0)); t.up(ev(5000, 0));
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level().openings[0].offset).toBe(1050);
    t.down(ev(1500, 0)); t.move(ev(1600, 0)); t.move(ev(1700, 0)); t.up(ev(1700, 0));
    expect(ctx.commits).toHaveLength(1);
    expect(ctx.level().openings[0].offset).toBe(1250);
  });

  it('Delete removes the selected wall and its openings', () => {
    const base = box();
    const { level } = addOpening(base, base.walls[0].id, 'door', 1500);
    const ctx = fakeContext(level);
    const t = createSelectTool(ctx);
    click(t, 500, 0);
    expect(t.key('Delete', k)).toBe(true);
    expect(ctx.level().walls).toHaveLength(3);
    expect(ctx.level().openings).toHaveLength(0);
  });

  it('click on empty space selects nothing; click without move does not commit', () => {
    const ctx = fakeContext(box());
    const sel: unknown[] = [];
    ctx.select = s => { sel.push(s); };
    const t = createSelectTool(ctx);
    click(t, 500, 0); click(t, 1500, 2000);
    expect(ctx.commits).toHaveLength(0);
    expect(sel[1]).toBeNull();
    expect(t.key('Delete', k)).toBe(false);
  });

  it('alt-click on an end without movement commits nothing', () => {
    const ctx = fakeContext(box());
    const t = createSelectTool(ctx);
    click(t, 1500, 0);
    t.down(ev(3000, 0, { alt: true })); t.up(ev(3000, 0, { alt: true }));
    expect(ctx.commits).toHaveLength(0);
  });

  it('cancel clears the selection so Delete does nothing', () => {
    const ctx = fakeContext(box());
    const t = createSelectTool(ctx);
    click(t, 500, 0);
    t.cancel();
    expect(t.key('Delete', k)).toBe(false);
    expect(ctx.level().walls).toHaveLength(4);
  });

  it('Delete is a no-op when the selected id no longer exists', () => {
    const ctx = fakeContext(box());
    const t = createSelectTool(ctx);
    click(t, 500, 0);
    ctx.commit({ ...ctx.level(), walls: [] });
    const n = ctx.commits.length;
    expect(t.key('Delete', k)).toBe(false);
    expect(ctx.commits).toHaveLength(n);
  });

  const withFree = () => {
    const r = addWallSegment(box(), { kind: 'free', pt: { x: 6000, y: 2000 } }, { kind: 'free', pt: { x: 7000, y: 2000 } }, props);
    return { level: r.level, wall: r.level.walls.find(w => w.id === r.wallId)! };
  };

  it('dragging a free wall end onto a box corner merges into one shared node', () => {
    const { level, wall } = withFree();
    const ctx = fakeContext(level);
    const corner = level.walls[1].a; // (3000, 0)
    const t = createSelectTool(ctx);
    click(t, 6500, 2000);
    t.down(ev(6000, 2000)); t.move(ev(3010, 5)); t.up(ev(3010, 5));
    expect(ctx.commits).toHaveLength(1);
    const l = ctx.level();
    expect(l.walls.find(w => w.id === wall.id)!.a).toBe(corner);
    expect(l.nodes.filter(n => n.x === 3000 && n.y === 0)).toHaveLength(1);
  });

  it('dragging a free wall end onto the middle of a box wall makes a T-node', () => {
    const { level, wall } = withFree();
    const ctx = fakeContext(level);
    const t = createSelectTool(ctx);
    click(t, 6500, 2000);
    t.down(ev(6000, 2000)); t.move(ev(1000, 2)); t.up(ev(1000, 2));
    expect(ctx.commits).toHaveLength(1);
    const l = ctx.level();
    const n = l.nodes.find(x => x.id === l.walls.find(w => w.id === wall.id)!.a)!;
    expect(n.host).toEqual({ wallId: level.walls[0].id, offset: 1000 });
    expect(nodePos(l, n.id)).toEqual({ x: 1000, y: 0 });
  });

  it('dragging a free end near its own wall does not host it on that wall', () => {
    const { level, wall } = withFree();
    const ctx = fakeContext(level);
    const t = createSelectTool(ctx);
    click(t, 6500, 2000);
    t.down(ev(6000, 2000)); t.move(ev(6300, 2008)); t.up(ev(6300, 2008));
    const n = ctx.level().nodes.find(x => x.id === ctx.level().walls.find(w => w.id === wall.id)!.a)!;
    expect(n.host).toBeUndefined();
  });

  const hosted = () => {
    const { level, wall } = withFree();
    const ctx = fakeContext(level);
    const t = createSelectTool(ctx);
    click(t, 6500, 2000);
    t.down(ev(6000, 2000)); t.move(ev(1000, 2)); t.up(ev(1000, 2)); // T-node on the top wall
    click(t, 4000, 1000); // reselect the dragged wall
    return { ctx, t, wall, level };
  };

  it('dropping a hosted node on another wall replaces its host', () => {
    const { ctx, t, wall, level } = hosted();
    t.down(ev(1000, 0)); t.move(ev(3000, 1000)); t.up(ev(3000, 1000));
    const l = ctx.level();
    const n = l.nodes.find(x => x.id === l.walls.find(w => w.id === wall.id)!.a)!;
    expect(n.host).toEqual({ wallId: level.walls[1].id, offset: 1000 });
    expect(nodePos(l, n.id)).toEqual({ x: 3000, y: 1000 });
  });

  it('dropping a hosted node in free space clears its host', () => {
    const { ctx, t, wall } = hosted();
    t.down(ev(1000, 0)); t.move(ev(2000, 2000)); t.up(ev(2000, 2000));
    const l = ctx.level();
    const n = l.nodes.find(x => x.id === l.walls.find(w => w.id === wall.id)!.a)!;
    expect(n.host).toBeUndefined();
    expect(nodePos(l, n.id)).toEqual({ x: 2000, y: 2000 });
  });

  it('cancel also clears the editor selection', () => {
    const ctx = fakeContext(box());
    const sel: unknown[] = [];
    ctx.select = x => { sel.push(x); };
    const t = createSelectTool(ctx);
    click(t, 500, 0);
    t.cancel();
    expect(sel[sel.length - 1]).toBeNull();
  });
});
