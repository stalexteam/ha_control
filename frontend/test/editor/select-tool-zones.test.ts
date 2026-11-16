import { describe, expect, it } from 'vitest';
import { createSelectTool } from '../../src/editor/tools/select-tool';
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
  return { ctx, selected, t: createSelectTool(ctx) };
}
const az = (id: Id): Selection => ({ kind: 'zone', id });

describe('select tool, zones: picking', () => {
  it('click selects the zone under the point', () => {
    const { ctx, selected, t } = setup(plan([square('za', 500, 500, 1500, 1500)]));
    expect(t.id).toBe('select');
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

describe('select tool, zones: dragging a vertex', () => {
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

  it('a walls zone has no vertex handles: a press on its corner picks the wall there', () => {
    const room = addWallsZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'Kitchen');
    const { ctx, t } = setup(room.level);
    click(t, 1500, 2000);
    expect(ctx.selection()).toEqual(az(room.zoneId!));
    const s = room.level.zones[0].shape;
    if (s.kind !== 'walls') throw new Error('not walls');
    const corner = s.outline[0];
    click(t, corner.x, corner.y);
    expect(ctx.selection()?.kind).toBe('wall');
    expect(t.preview().zoneVertex).toBeUndefined();
    expect(ctx.commits).toHaveLength(0);
  });
});

describe('select tool, zones: the panel selection', () => {
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

const dbl = (t: Tool, x: number, y: number) => { click(t, x, y); click(t, x, y); t.dblclick!(ev(x, y)); };

describe('select tool, zones: precedence, vertices', () => {
  it('a wall under the point wins over the zone around it', () => {
    const { selected, t } = setup(plan([square('z', 100, 100, 2900, 3900)]));
    click(t, 1500, 0); // on w0, inside the zone's edge tolerance
    expect(selected).toEqual([{ kind: 'wall', id: 'w0' }]);
  });

  it('the handles of the selected polygon win over walls', () => {
    // The vertex sits on the inner face of w0 (y = 200).
    const { ctx, t } = setup(plan([square('z', 500, 200, 1500, 1500)]));
    ctx.select(az('z'));
    drag(t, [1500, 200], [1500, 800]);
    expect(verts(ctx.level(), 'z')[1]).toEqual(free(1500, 800));
    expect(ctx.selection()).toEqual(az('z'));
  });

  it('a double-click on an edge of the selected polygon inserts a free vertex there, as one commit', () => {
    const { ctx, t } = setup(plan([square('z', 500, 500, 1500, 1500), square('o', 1000, 300, 1200, 2000)]));
    ctx.select(az('z'));
    dbl(t, 800, 1500); // on the bottom edge (1500,1500) -> (500,1500)
    expect(ctx.commits).toHaveLength(1);
    expect(verts(ctx.level(), 'z')).toEqual([free(500, 500), free(1500, 500), free(1500, 1500), free(800, 1500), free(500, 1500)]);
    expect(ctx.selection()).toEqual(az('z'));
    // Even when the clicks of the pair picked another zone, the zone selected before them gets the vertex.
    dbl(t, 1100, 500); // the top edge, inside zone o
    expect(ctx.commits).toHaveLength(2);
    expect(verts(ctx.level(), 'z')[1]).toEqual(free(1100, 500));
    expect(ctx.selection()).toEqual(az('z'));
  });

  it('a double-click on an edge between two wall vertices of one face inserts a wall vertex', () => {
    const wv = (offset: number): ZoneVertex => ({ kind: 'wall', wallId: 'w0', offset, side: 'right', x: offset, y: 200 });
    const z: Zone = { id: 'z', name: 'z', invalid: false, shape: { kind: 'polygon', vertices: [wv(500), wv(1500), free(1500, 1500), free(500, 1500)] } };
    const { ctx, t } = setup(plan([z]));
    ctx.select(az('z'));
    dbl(t, 1000, 205);
    expect(verts(ctx.level(), 'z')[1]).toMatchObject({ kind: 'wall', wallId: 'w0', side: 'right', offset: 1000, x: 1000, y: 200 });
  });

  it('a double-click off the edges, on a vertex or with no polygon selected inserts nothing', () => {
    const room = addWallsZone(rectRoomLevel(3000, 4000, 400), { x: 1500, y: 2000 }, 'Kitchen');
    const { ctx, t } = setup({ ...room.level, zones: [...room.level.zones, square('z', 500, 500, 1500, 1500)] });
    ctx.select(az('z'));
    dbl(t, 1000, 1000);
    dbl(t, 1500, 500);
    ctx.select(az(room.zoneId!));
    dbl(t, 1000, 200);
    ctx.select(null);
    dbl(t, 1000, 500);
    expect(ctx.commits).toHaveLength(0);
  });

  it('a click on a vertex handle selects the vertex; Delete removes it; at 3 vertices Delete is refused with a notice', () => {
    const { ctx, t } = setup(plan([square('z', 500, 500, 1500, 1500)]));
    const notices: (string | null)[] = [];
    ctx.notify = m => { notices.push(m); };
    ctx.select(az('z'));
    expect(t.key('Delete', { shift: false })).toBe(false); // no vertex selected: the panel deletes the zone
    click(t, 1500, 500);
    expect(t.preview().zoneVertex).toEqual({ zoneId: 'z', index: 1 });
    expect(t.key('Delete', { shift: false })).toBe(true);
    expect(verts(ctx.level(), 'z')).toEqual([free(500, 500), free(1500, 1500), free(500, 1500)]);
    expect(ctx.selection()).toEqual(az('z'));
    expect(t.preview().zoneVertex).toBeUndefined();
    click(t, 500, 1500);
    expect(t.key('Backspace', { shift: false })).toBe(true);
    expect(ctx.commits).toHaveLength(1);
    expect(notices).toEqual(['A zone needs at least 3 vertices.']);
    // Escape clears the vertex selection first.
    expect(t.key('Escape', { shift: false })).toBe(true);
    expect(t.preview().zoneVertex).toBeUndefined();
    expect(t.key('Escape', { shift: false })).toBe(false);
  });

  it('a dragged vertex snaps to another zone vertex, but not to its own zone', () => {
    const { ctx, t } = setup(plan([square('z', 500, 500, 1500, 1500), square('o', 2010, 1010, 2510, 2510)]));
    ctx.select(az('z'));
    t.down(ev(1500, 1500)); t.move(ev(2020, 1000));
    expect(t.preview().snap).toMatchObject({ kind: 'zoneVertex', pt: { x: 2010, y: 1010 } });
    t.up(ev(2020, 1000));
    expect(verts(ctx.level(), 'z')[2]).toEqual(free(2010, 1010));
    // Its own neighbour (1500,500) is no target: the grid takes the point.
    drag(t, [1500, 500], [1507, 512]);
    expect(verts(ctx.level(), 'z')[1]).toEqual(free(1500, 500));
  });
});
