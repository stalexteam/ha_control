import { describe, expect, it } from 'vitest';
import { createSelectTool } from '../../src/editor/tools/select-tool';
import { addBox, addWallSegment } from '../../src/model/ops';
import { nodePos } from '../../src/geometry/walls';
import { addOpening } from '../../src/model/openings';
import type { Level } from '../../src/model/types';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number, o: { shift?: boolean; alt?: boolean; ctrl?: boolean } = {}) =>
  ({ pt: { x, y }, shift: !!o.shift, alt: !!o.alt, ctrl: !!o.ctrl });
const props = { type: 'partition', thickness: 100, baseline: 'center' } as const;
const empty = (): Level => ({ id: 'l0', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] });
const box = () => addBox(empty(), { x: 0, y: 0 }, { x: 3000, y: 4000 }, props, 'axis');
const click = (t: ReturnType<typeof createSelectTool>, x: number, y: number) => { t.down(ev(x, y)); t.up(ev(x, y)); };

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

  it('click on empty space selects nothing; click without move does not commit', () => {
    const ctx = fakeContext(box());
    const sel: unknown[] = [];
    ctx.select = s => { sel.push(s); };
    const t = createSelectTool(ctx);
    click(t, 500, 0); click(t, 1500, 2000);
    expect(ctx.commits).toHaveLength(0);
    expect(sel[1]).toBeNull();
  });

  it('alt-click on an end without movement commits nothing', () => {
    const ctx = fakeContext(box());
    const t = createSelectTool(ctx);
    click(t, 1500, 0);
    t.down(ev(3000, 0, { alt: true })); t.up(ev(3000, 0, { alt: true }));
    expect(ctx.commits).toHaveLength(0);
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

  it('Ctrl+click on a wall trims it in one commit; a plain click still selects', () => {
    const b = box();
    const top = b.walls[0], bottom = b.walls[2];
    // A partition from the middle of the top wall to the middle of the bottom wall: T-nodes at x = 1500.
    const r = addWallSegment(b, { kind: 'wall', wallId: top.id, offset: 1500 }, { kind: 'wall', wallId: bottom.id, offset: 1500 }, props);
    const tee = r.level.walls.find(w => w.id === r.wallId)!.a;
    const ctx = fakeContext(r.level);
    const sel: unknown[] = [];
    ctx.select = s => { sel.push(s); };
    const t = createSelectTool(ctx);
    click(t, 2000, 0); // select the top wall first
    t.down(ev(500, 0, { ctrl: true })); t.move(ev(800, 300, { ctrl: true })); t.up(ev(800, 300, { ctrl: true }));
    expect(ctx.commits).toHaveLength(1);
    const l = ctx.level();
    // The cut piece held node A: the top wall now starts at the former T-node, which is a plain junction.
    expect(l.walls.find(w => w.id === top.id)).toMatchObject({ a: tee, b: top.b });
    expect(l.nodes.find(n => n.id === tee)!.host).toBeUndefined();
    expect(nodePos(l, tee)).toEqual({ x: 1500, y: 0 });
    expect(nodePos(l, top.b)).toEqual({ x: 3000, y: 0 });
    expect(sel[sel.length - 1]).toBeNull();
    click(t, 2000, 0);
    expect(ctx.commits).toHaveLength(1);
    expect(sel[sel.length - 1]).toEqual({ kind: 'wall', id: top.id });
  });

  /** Host H (0,0)-(6000,0) with stems S1 and S2 hosted at x = 2000 and 4000, 200 mm thick; S1 is listed first. */
  const junctions = (): Level => ({
    ...empty(),
    nodes: [
      { id: 'h0', x: 0, y: 0 }, { id: 'h1', x: 6000, y: 0 },
      { id: 't1', x: 2000, y: 0, host: { wallId: 'H', offset: 2000 } }, { id: 's1', x: 2000, y: 3000 },
      { id: 't2', x: 4000, y: 0, host: { wallId: 'H', offset: 4000 } }, { id: 's2', x: 4000, y: 3000 },
    ],
    walls: [['S1', 't1', 's1'], ['H', 'h0', 'h1'], ['S2', 't2', 's2']]
      .map(([id, a, b]) => ({ id, a, b, thickness: 200, type: 'partition' as const, baseline: 'center' as const })),
  });

  it('Ctrl+click inside a wall next to a junction trims that wall, not the stem within tolerance', () => {
    const ctx = Object.assign(fakeContext(junctions()), { tolMm: () => 125 });
    const t = createSelectTool(ctx);
    // Inside H, 50 mm from the stem S1's face.
    t.down(ev(2150, 0, { ctrl: true })); t.up(ev(2150, 0, { ctrl: true }));
    expect(ctx.commits).toHaveLength(1);
    const l = ctx.level();
    expect(l.walls).toHaveLength(4);
    expect(l.walls.find(w => w.id === 'S1')).toMatchObject({ a: 't1', b: 's1' });
    expect(l.walls.find(w => w.id === 'S2')).toMatchObject({ a: 't2', b: 's2' });
    expect(l.walls.find(w => w.id === 'H')).toMatchObject({ a: 'h0', b: 't1' });
    expect(l.walls.some(w => w.a === 't2' && w.b === 'h1')).toBe(true);
  });

  it('a plain click inside a wall next to a junction selects that wall', () => {
    const ctx = Object.assign(fakeContext(junctions()), { tolMm: () => 125 });
    const sel: unknown[] = [];
    ctx.select = s => { sel.push(s); };
    const t = createSelectTool(ctx);
    click(t, 2150, 0);
    expect(sel[sel.length - 1]).toEqual({ kind: 'wall', id: 'H' });
    click(t, 2000, 1000); // inside the stem
    expect(sel[sel.length - 1]).toEqual({ kind: 'wall', id: 'S1' });
    click(t, 2160, 1000); // beside the stem, within tolerance
    expect(sel[sel.length - 1]).toEqual({ kind: 'wall', id: 'S1' });
    expect(ctx.commits).toHaveLength(0);
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
