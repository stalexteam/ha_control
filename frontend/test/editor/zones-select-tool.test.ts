import { describe, expect, it } from 'vitest';
import { createZonesSelectTool } from '../../src/editor/tools/zones-select-tool';
import { addWallsZone } from '../../src/model/zones';
import { type Zone, type Id, type Level, type ZoneVertex } from '../../src/model/types';
import type { Selection, Tool } from '../../src/editor/tools/types';
import { facePoint } from '../../src/geometry/devices';
import { rectRoomLevel } from '../fixtures';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number, o: { shift?: boolean; alt?: boolean } = {}) =>
  ({ pt: { x, y }, shift: !!o.shift, alt: !!o.alt, ctrl: false });
const free = (x: number, y: number): ZoneVertex => ({ kind: 'free', x, y });
/** Square zone (x0,y0)-(x1,y1), vertices clockwise on screen from the top-left corner (`first` replaces it). */
const square = (id: Id, x0: number, y0: number, x1: number, y1: number, first: ZoneVertex = free(x0, y0)): Zone =>
  ({ id, name: id, shape: { kind: 'polygon', vertices: [first, free(x1, y0), free(x1, y1), free(x0, y1)] }, invalid: false });
/**
 * rectRoomLevel(3000, 4000, 400): n0 (0,0), n1 (3000,0), n2 (3000,4000), n3 (0,4000); w0 = n0 -> n1 with its left face
 * at y = -200 (outside) and its right face at y = 200 (inside).
 */
const plan = (zones: Zone[]): Level => ({ ...rectRoomLevel(3000, 4000, 400), zones: zones });
const verts = (l: Level, id: Id): ZoneVertex[] => {
  const s = l.zones.find(z => z.id === id)!.shape;
  if (s.kind !== 'polygon') throw new Error('not a polygon');
  return s.vertices;
};
const click = (t: Tool, x: number, y: number) => { t.down(ev(x, y)); t.up(ev(x, y)); };
const drag = (t: Tool, from: [number, number], to: [number, number], o: { shift?: boolean; alt?: boolean } = {}) => {
  t.down(ev(...from)); t.move(ev(...to, o)); t.up(ev(...to, o));
};

function setup(level: Level) {
  const ctx = fakeContext(level);
  const selected: (Selection | null)[] = [];
  const keep = ctx.select;
  ctx.select = s => { selected.push(s); keep(s); };
  return { ctx, selected, t: createZonesSelectTool(ctx) };
}
const az = (id: Id): Selection => ({ kind: 'zone', id });

describe('zones select tool: picking', () => {
  it('click selects the zone under the point', () => {
    const { ctx, selected, t } = setup(plan([square('za', 500, 500, 1500, 1500)]));
    expect(t.id).toBe('zones-select');
    click(t, 1000, 1000);
    expect(selected).toEqual([az('za')]);
    click(t, 1510, 1000); // outside, but within tolMm (20) of the edge
    expect(selected).toEqual([az('za'), az('za')]);
    expect(ctx.commits).toHaveLength(0);
  });

  it('repeated clicks cycle overlapping zones smallest first', () => {
    const base = plan([square('big', 500, 500, 2500, 2500), square('sb', 1000, 1000, 1600, 1600), square('sa', 1000, 1000, 1600, 1600)]);
    const room = addWallsZone(base, { x: 1500, y: 2000 }, 'Kitchen');
    const { selected, t } = setup(room.level);
    click(t, 1200, 1300);
    click(t, 1205, 1302);
    click(t, 1210, 1300);
    click(t, 1200, 1300);
    click(t, 1200, 1305);
    // Same area: by id. Then the larger zones, the walls zone (the whole room) last, then around again.
    expect(selected).toEqual([az('sa'), az('sb'), az('big'), az(room.zoneId!), az('sa')]);
    click(t, 1400, 1400); // away from the previous click: the smallest again
    click(t, 1400, 1400);
    expect(selected.slice(5)).toEqual([az('sa'), az('sb')]);
  });

  it('empty click clears', () => {
    const { selected, t } = setup(plan([square('za', 500, 500, 1500, 1500)]));
    click(t, 1000, 1000);
    click(t, 2500, 3000);
    expect(selected).toEqual([az('za'), null]);
  });
});

describe('zones select tool: dragging a vertex', () => {
  it('dragging a vertex onto a node anchors it to the node', () => {
    const level = plan([square('z', 500, 500, 1500, 1500)]);
    const { ctx, t } = setup(level);
    click(t, 1000, 1000);
    t.down(ev(1500, 500));
    t.move(ev(2990, 5));
    // The preview shows the working copy; nothing is committed before the release.
    expect(verts(t.preview().level!, 'z')[1]).toEqual({ kind: 'node', nodeId: 'n1', x: 3000, y: 0 });
    expect(ctx.level()).toBe(level);
    t.up(ev(2990, 5));
    expect(ctx.commits).toHaveLength(1);
    expect(verts(ctx.level(), 'z')[1]).toEqual({ kind: 'node', nodeId: 'n1', x: 3000, y: 0 });
    expect(t.preview()).toEqual({});
  });

  it('dragging onto a wall face gives a wall vertex on that side', () => {
    const { ctx, t } = setup(plan([square('z', 500, 500, 1500, 1500)]));
    click(t, 1000, 1000);
    drag(t, [1500, 500], [1500, 190]); // near the inner (right) face of w0
    const right = verts(ctx.level(), 'z')[1];
    expect(right).toMatchObject({ kind: 'wall', wallId: 'w0', offset: 1500, side: 'right' });
    expect(right.x).toBeCloseTo(1500);
    expect(right.y).toBeCloseTo(200);
    drag(t, [1500, 200], [1500, -195]); // near the outer (left) face of w0
    const left = verts(ctx.level(), 'z')[1];
    expect(left).toMatchObject({ kind: 'wall', wallId: 'w0', offset: 1500, side: 'left' });
    expect(left.x).toBeCloseTo(1500);
    expect(left.y).toBeCloseTo(-200);
    expect(ctx.commits).toHaveLength(2);
  });

  it('a drag onto a wall midpoint or axis shows the snap marker on the chosen face, where the vertex lands', () => {
    const { ctx, t } = setup(plan([square('z', 500, 500, 1500, 1500)]));
    click(t, 1000, 1000);
    t.down(ev(1500, 500));
    t.move(ev(1500, 10)); // the midpoint of w0 (axis y = 0), pointer on the inner half: the right face (y = 200)
    const face = facePoint(ctx.level(), 'w0', 'right', 1500)!;
    expect(t.preview().snap).toMatchObject({ kind: 'mid', pt: face });
    const v = verts(t.preview().level!, 'z')[1];
    expect({ x: v.x, y: v.y }).toEqual(face);
    t.move(ev(2500, -5)); // the axis, pointer on the outer half: the left face (y = -200)
    expect(t.preview().snap).toMatchObject({ kind: 'wall', pt: facePoint(ctx.level(), 'w0', 'left', 2500) });
    t.up(ev(2500, -5));
    const w = verts(ctx.level(), 'z')[1];
    expect(w).toMatchObject({ kind: 'wall', wallId: 'w0', offset: 2500, side: 'left' });
    expect({ x: w.x, y: w.y }).toEqual(facePoint(ctx.level(), 'w0', 'left', 2500));
  });

  it('Alt-drag gives a free vertex at the pointer', () => {
    const { ctx, t } = setup(plan([square('z', 500, 500, 1500, 1500)]));
    click(t, 1000, 1000);
    drag(t, [1500, 500], [2990, 7], { alt: true }); // next to node n1, but Alt skips snapping
    expect(verts(ctx.level(), 'z')[1]).toEqual({ kind: 'free', x: 2990, y: 7 });
    // Alt with Shift: ortho from the previous vertex (500, 500), still unsnapped.
    drag(t, [2990, 7], [2003, 520], { alt: true, shift: true });
    expect(verts(ctx.level(), 'z')[1]).toEqual({ kind: 'free', x: 2003, y: 500 });
    expect(ctx.commits).toHaveLength(2);
  });

  it('dragging a lost vertex clears lost', () => {
    const lost = { ...square('z', 500, 500, 1500, 1500, { kind: 'free', x: 500, y: 500, lost: true }), invalid: true };
    const { ctx, t } = setup(plan([lost]));
    click(t, 1000, 1000);
    drag(t, [500, 500], [810, 790]); // grid snap (100 mm)
    expect(verts(ctx.level(), 'z')[0]).toEqual({ kind: 'free', x: 800, y: 800 });
    expect(ctx.level().zones[0].invalid).toBe(false);
    expect(ctx.commits).toHaveLength(1);
  });

  it('a press without movement commits nothing', () => {
    const level = plan([square('z', 500, 500, 1500, 1500)]);
    const { ctx, t } = setup(level);
    click(t, 1000, 1000);
    t.down(ev(1500, 500)); t.move(ev(1502, 501)); t.up(ev(1502, 501)); // under DRAG_PX (6 mm at scale 0.5)
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level()).toBe(level);
  });

  it('Escape cancels a vertex drag only', () => {
    const level = plan([square('z', 500, 500, 1500, 1500)]);
    const { ctx, selected, t } = setup(level);
    click(t, 1000, 1000);
    expect(t.key('Escape', { shift: false })).toBe(false); // a selection alone is not consumed
    t.down(ev(1500, 500)); t.move(ev(2000, 800));
    expect(t.key('Escape', { shift: false })).toBe(true);
    expect(t.preview()).toEqual({});
    t.up(ev(2000, 800));
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level()).toBe(level);
    expect(selected).toEqual([az('z')]);
  });

  it('a walls zone has no vertex drag', () => {
    const room = addWallsZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'Kitchen');
    const { ctx, t } = setup(room.level);
    click(t, 1500, 2000);
    const s = room.level.zones[0].shape;
    if (s.kind !== 'walls') throw new Error('not walls');
    const corner = s.outline[0];
    drag(t, [corner.x, corner.y], [corner.x + 300, corner.y + 300]);
    expect(ctx.commits).toHaveLength(0);
  });
});

describe('zones select tool: the panel selection', () => {
  it('a zone selected elsewhere (the zone list) drags with the first press', () => {
    const { ctx, t } = setup(plan([square('z', 500, 500, 1500, 1500)]));
    ctx.select(az('z')); // as the list does: not through the tool
    drag(t, [1500, 500], [2990, 5]);
    expect(ctx.commits).toHaveLength(1);
    expect(verts(ctx.level(), 'z')[1]).toEqual({ kind: 'node', nodeId: 'n1', x: 3000, y: 0 });
  });

  it('a selection cleared elsewhere (Esc) has no vertex handles', () => {
    const { ctx, t } = setup(plan([square('z', 500, 500, 1500, 1500)]));
    click(t, 1000, 1000);
    ctx.select(null);
    drag(t, [1500, 500], [2990, 5]);
    expect(ctx.commits).toHaveLength(0);
  });

  it('cancel drops a vertex drag and keeps the selection', () => {
    const level = plan([square('z', 500, 500, 1500, 1500)]);
    const { ctx, selected, t } = setup(level);
    click(t, 1000, 1000);
    t.down(ev(1500, 500)); t.move(ev(2000, 800));
    t.cancel();
    expect(t.preview()).toEqual({});
    t.up(ev(2000, 800));
    expect(ctx.commits).toHaveLength(0);
    expect(selected).toEqual([az('z')]);
    expect(ctx.selection()).toEqual(az('z'));
  });
});
