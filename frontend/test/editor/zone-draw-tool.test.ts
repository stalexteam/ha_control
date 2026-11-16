import { describe, expect, it } from 'vitest';
import { createZoneDrawTool } from '../../src/editor/tools/zone-draw-tool';
import { createTool } from '../../src/panel/tool-factory';
import { type Level, type ZoneVertex } from '../../src/model/types';
import type { Selection, Tool } from '../../src/editor/tools/types';
import { facePoint } from '../../src/geometry/devices';
import { rectRoomLevel, twoRoomsLevel } from '../fixtures';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number, o: { shift?: boolean; alt?: boolean } = {}) =>
  ({ pt: { x, y }, shift: !!o.shift, alt: !!o.alt, ctrl: false });
const click = (t: Tool, x: number, y: number) => { t.down(ev(x, y)); t.up(ev(x, y)); };
const key = (t: Tool, k: string) => t.key(k, { shift: false });
const verts = (l: Level, i = 0): ZoneVertex[] => {
  const s = l.zones[i].shape;
  if (s.kind !== 'polygon') throw new Error('not a polygon');
  return s.vertices;
};

function setup(level?: Level) {
  const ctx = fakeContext(level);
  const selected: (Selection | null)[] = [];
  ctx.select = s => { selected.push(s); };
  return { ctx, selected, t: createZoneDrawTool(ctx) };
}
const triangle = (t: Tool) => { click(t, 0, 0); click(t, 1000, 0); click(t, 1000, 1000); };

describe('zone draw tool', () => {
  it('three clicks and Enter create "Zone 1" and select it', () => {
    const { ctx, selected, t } = setup();
    expect(t.id).toBe('zone');
    triangle(t);
    expect(ctx.commits).toHaveLength(0);
    expect(key(t, 'Enter')).toBe(true);
    expect(ctx.commits).toHaveLength(1);
    const z = ctx.level().zones[0];
    expect(z.name).toBe('Zone 1');
    expect(verts(ctx.level())).toHaveLength(3);
    expect(selected).toEqual([{ kind: 'zone', id: z.id }]);
    expect(t.preview().zoneDraft).toBeUndefined();
  });

  it('clicking the first vertex closes; clicking the last vertex closes', () => {
    const a = setup();
    triangle(a.t);
    click(a.t, 10, 10); // within tolMm (20) of the first vertex
    expect(a.ctx.level().zones).toHaveLength(1);
    const b = setup();
    triangle(b.t);
    click(b.t, 1005, 1005);
    expect(b.ctx.level().zones).toHaveLength(1);
    expect(verts(b.ctx.level())).toHaveLength(3);
  });

  it('fewer than three vertices: Enter does nothing', () => {
    const { ctx, t } = setup();
    click(t, 0, 0); click(t, 1000, 0);
    expect(key(t, 'Enter')).toBe(false);
    expect(ctx.commits).toHaveLength(0);
    expect(t.preview().zoneDraft?.points).toHaveLength(2);
  });

  it('Backspace removes the last vertex and is consumed; with no vertices it is not consumed', () => {
    const { t } = setup();
    expect(key(t, 'Backspace')).toBe(false);
    click(t, 0, 0); click(t, 1000, 0);
    expect(key(t, 'Backspace')).toBe(true);
    expect(t.preview().zoneDraft?.points).toHaveLength(1);
    expect(key(t, 'Backspace')).toBe(true);
    expect(key(t, 'Backspace')).toBe(false);
  });

  it('cancel drops the draft; Escape is consumed only with a draft', () => {
    const { ctx, t } = setup();
    expect(key(t, 'Escape')).toBe(false);
    triangle(t);
    expect(key(t, 'Escape')).toBe(true);
    expect(t.preview().zoneDraft).toBeUndefined();
    expect(key(t, 'Enter')).toBe(false);
    triangle(t);
    t.cancel();
    expect(t.preview().zoneDraft).toBeUndefined();
    expect(ctx.commits).toHaveLength(0);
  });

  it('a vertex that would make the edges cross is rejected and the preview is marked invalid', () => {
    const { t } = setup();
    click(t, 0, 0); click(t, 1000, 1000); click(t, 1000, 0);
    t.move(ev(0, 1000)); // (1000,0)->(0,1000) crosses (0,0)->(1000,1000)
    expect(t.preview().zoneDraft?.invalid).toBe(true);
    click(t, 0, 1000);
    expect(t.preview().zoneDraft?.points).toHaveLength(3);
    t.move(ev(2000, 0));
    expect(t.preview().zoneDraft?.invalid).toBe(false);
    expect(t.preview().zoneDraft?.cursor).toEqual({ x: 2000, y: 0 });
  });

  it('a vertex within 1 mm of the previous one is rejected', () => {
    const { t } = setup(rectRoomLevel(3000, 4000, 400));
    click(t, 0, 0); // node n0
    t.down(ev(0, 0, { alt: true })); // free vertex at the same point
    expect(t.preview().zoneDraft?.points).toHaveLength(1);
  });

  it('a closing edge that crosses the outline is rejected and the draft stays', () => {
    const { ctx, t } = setup();
    click(t, 2000, 500); click(t, 1000, 0); click(t, 1000, 1000); click(t, 0, 500);
    expect(t.preview().zoneDraft?.points).toHaveLength(4); // the closing edge (0,500)-(2000,500) crosses the third edge
    expect(key(t, 'Enter')).toBe(false);
    expect(ctx.commits).toHaveLength(0);
    expect(t.preview().zoneDraft?.points).toHaveLength(4);
  });

  it('a vertex near a node is anchored to it; near a wall face it is a wall vertex', () => {
    const { ctx, t } = setup(rectRoomLevel(3000, 4000, 400));
    click(t, 5, 5); // node n0
    click(t, 1500, 195); // right face of w0 (y = 200)
    click(t, 1500, 2000);
    key(t, 'Enter');
    const v = verts(ctx.level());
    expect(v[0]).toMatchObject({ kind: 'node', nodeId: 'n0' });
    expect(v[1]).toMatchObject({ kind: 'wall', wallId: 'w0', side: 'right' });
    expect(v[2]).toMatchObject({ kind: 'free', x: 1500, y: 2000 });
  });

  it('a mid or axis snap gives a vertex on the face of the pointer side; the snap marker sits there', () => {
    // twoRoomsLevel: w0 runs n0 (0,0) -> n1 (3000,0), 200 mm thick: its axis is y = 0, its faces y = -100 and y = 100.
    const { ctx, t } = setup(twoRoomsLevel());
    t.move(ev(1500, 10)); // the midpoint of w0, pointer on the inner half
    const mid = t.preview().snap!;
    expect(mid.kind).toBe('mid');
    expect(mid.pt).toEqual(facePoint(ctx.level(), 'w0', 'right', 1500));
    expect(mid.pt.y).toBeCloseTo(100);
    click(t, 1500, 10);
    expect(t.preview().zoneDraft!.points[0]).toEqual(facePoint(ctx.level(), 'w0', 'right', 1500));
    t.move(ev(2500, -5)); // the axis of w0, pointer on the outer half: the outer face
    const axis = t.preview().snap!;
    expect(axis.kind).toBe('wall');
    expect(axis.pt).toEqual(facePoint(ctx.level(), 'w0', 'left', 2500));
    expect(axis.pt.y).toBeCloseTo(-100);
    expect(t.preview().zoneDraft!.cursor).toEqual(axis.pt);
    click(t, 2500, -5);
    expect(t.preview().zoneDraft!.points[1]).toEqual(axis.pt);
    click(t, 2000, 1500);
    key(t, 'Enter');
    const v = verts(ctx.level());
    expect(v[0]).toMatchObject({ kind: 'wall', wallId: 'w0', offset: 1500, side: 'right' });
    expect({ x: v[0].x, y: v[0].y }).toEqual(facePoint(ctx.level(), 'w0', 'right', 1500));
    expect(v[1]).toMatchObject({ kind: 'wall', wallId: 'w0', offset: 2500, side: 'left' });
    expect({ x: v[1].x, y: v[1].y }).toEqual(facePoint(ctx.level(), 'w0', 'left', 2500));
  });

  it('the snap marker shows before the first click; Shift shows the ortho guide from the last vertex', () => {
    const { t } = setup();
    expect(t.preview()).toEqual({});
    t.move(ev(1010, 1990));
    expect(t.preview().snap).toMatchObject({ kind: 'grid', pt: { x: 1000, y: 2000 } });
    expect(t.preview().zoneDraft).toBeUndefined();
    expect(t.preview().orthoFrom).toBeUndefined();
    click(t, 1010, 1990);
    t.move(ev(3000, 2030, { shift: true }));
    expect(t.preview().orthoFrom).toEqual({ x: 1000, y: 2000 });
    expect(t.preview().snap?.pt).toEqual({ x: 3000, y: 2000 });
    t.move(ev(3000, 2030));
    expect(t.preview().orthoFrom).toBeUndefined();
    t.cancel();
    expect(t.preview()).toEqual({});
  });

  it('hovering the first or the last vertex to close is not invalid unless the closing edge crosses', () => {
    const a = setup();
    triangle(a.t);
    a.t.move(ev(5, 5)); // the first vertex
    expect(a.t.preview().zoneDraft?.invalid).toBe(false);
    expect(a.t.preview().zoneDraft?.cursor).toEqual({ x: 0, y: 0 });
    a.t.move(ev(1003, 1003)); // the last vertex
    expect(a.t.preview().zoneDraft?.invalid).toBe(false);
    expect(a.t.preview().zoneDraft?.cursor).toEqual({ x: 1000, y: 1000 });
    const b = setup();
    click(b.t, 2000, 500); click(b.t, 1000, 0); click(b.t, 1000, 1000); click(b.t, 0, 500);
    b.t.move(ev(1995, 505)); // the closing edge (0,500)-(2000,500) crosses the third edge
    expect(b.t.preview().zoneDraft?.invalid).toBe(true);
    b.t.move(ev(5, 495));
    expect(b.t.preview().zoneDraft?.invalid).toBe(true);
  });

  it('Delete removes the last vertex like Backspace; with no vertices it is not consumed', () => {
    const { t } = setup();
    expect(key(t, 'Delete')).toBe(false);
    click(t, 0, 0); click(t, 1000, 0);
    expect(key(t, 'Delete')).toBe(true);
    expect(t.preview().zoneDraft?.points).toEqual([{ x: 0, y: 0 }]);
    expect(key(t, 'Delete')).toBe(true);
    expect(t.preview().zoneDraft).toBeUndefined();
    expect(key(t, 'Delete')).toBe(false);
  });

  it('the second zone is "Zone 2"', () => {
    const { ctx, t } = setup();
    triangle(t); key(t, 'Enter');
    click(t, 3000, 0); click(t, 4000, 0); click(t, 4000, 1000); key(t, 'Enter');
    expect(ctx.level().zones.map(z => z.name)).toEqual(['Zone 1', 'Zone 2']);
  });

  it('the factory builds it for the Zone tool with the Polygon method', () => {
    const ctx = fakeContext();
    ctx.zoneMethod = () => 'polygon';
    const t = createTool('zone', ctx);
    click(t, 0, 0);
    expect(t.preview().zoneDraft?.points).toEqual([{ x: 0, y: 0 }]);
  });

  it('the zone takes the name and Automation from the context; zonePlaced runs after the commit', () => {
    const { ctx, t } = setup();
    let placed = 0;
    ctx.zoneName = () => 'Yard';
    ctx.zoneAutomation = () => false;
    ctx.zonePlaced = () => { placed++; };
    triangle(t); key(t, 'Enter');
    expect(ctx.level().zones[0]).toMatchObject({ name: 'Yard', automation: false });
    expect(ctx.commits).toHaveLength(1);
    expect(placed).toBe(1);
    ctx.zoneAutomation = () => true;
    click(t, 3000, 0); click(t, 4000, 0); click(t, 4000, 1000); key(t, 'Enter');
    expect('automation' in ctx.level().zones[1]).toBe(false);
  });

  it('Undo (Ctrl+Z) removes the last vertex and is consumed; with no draft it is not consumed', () => {
    const { ctx, t } = setup();
    expect(key(t, 'Undo')).toBe(false);
    triangle(t);
    expect(key(t, 'Undo')).toBe(true);
    expect(t.preview().zoneDraft?.points).toEqual([{ x: 0, y: 0 }, { x: 1000, y: 0 }]);
    expect(key(t, 'Undo')).toBe(true);
    expect(key(t, 'Undo')).toBe(true);
    expect(t.preview().zoneDraft).toBeUndefined();
    expect(key(t, 'Undo')).toBe(false);
    expect(ctx.commits).toHaveLength(0);
  });

  it('vertices snap to other zones: their vertices first, then their edges, before the grid; walls come first', () => {
    const other = { ...rectRoomLevel(3000, 4000, 400), zones: [
      { id: 'o', name: 'o', invalid: false, shape: { kind: 'polygon' as const, vertices: [
        { kind: 'free' as const, x: 1010, y: 1010 }, { kind: 'free' as const, x: 2010, y: 1010 },
        { kind: 'free' as const, x: 2010, y: 2010 }, { kind: 'free' as const, x: 1010, y: 2010 }] } },
    ] };
    const { t } = setup(other);
    t.move(ev(1020, 1025));
    expect(t.preview().snap).toMatchObject({ kind: 'zoneVertex', pt: { x: 1010, y: 1010 } });
    t.move(ev(1500, 1022)); // 12 mm from the top edge
    expect(t.preview().snap).toMatchObject({ kind: 'zoneEdge', pt: { x: 1500, y: 1010 } });
    t.move(ev(1500, 1100)); // off the edges: the grid
    expect(t.preview().snap).toMatchObject({ kind: 'grid', pt: { x: 1500, y: 1100 } });
    t.move(ev(1500, 190)); // the inner face of w0 wins
    expect(t.preview().snap?.kind).toBe('wall');
    click(t, 1500, 1022);
    expect(t.preview().zoneDraft?.points).toEqual([{ x: 1500, y: 1010 }]);
  });

  describe('wall corners', () => {
    const lShape = (): Level => ({
      id: 'l', name: 'L', kind: 'floor', order: 0, openings: [], zones: [], devices: [],
      nodes: [{ id: 'n0', x: 0, y: 0 }, { id: 'n1', x: 4000, y: 0 }, { id: 'n2', x: 4000, y: 3000 }],
      walls: [{ id: 'A', a: 'n0', b: 'n1', thickness: 100, type: 'partition', baseline: 'center' },
        { id: 'B', a: 'n1', b: 'n2', thickness: 100, type: 'partition', baseline: 'center' }],
    });
    it('a click on an inner corner adds a wall vertex on the face', () => {
      const { ctx, t } = setup(lShape());
      click(t, 3960, 60);
      click(t, 2000, 1000); click(t, 3000, 1500); key(t, 'Enter');
      const v = verts(ctx.level())[0];
      expect(v.kind).toBe('wall');
      if (v.kind !== 'wall') return;
      expect(v.wallId).toBe('A'); expect(v.side).toBe('right');
      expect(v.offset).toBeCloseTo(3950);
      expect(v.x).toBeCloseTo(3950); expect(v.y).toBeCloseTo(50);
    });
    it('a click on an outer corner adds a free vertex and the zone is valid', () => {
      const { ctx, t } = setup(lShape());
      click(t, 4055, -45);
      click(t, 2000, 1000); click(t, 3000, 1500); key(t, 'Enter');
      const v = verts(ctx.level())[0];
      expect(v.kind).toBe('free');
      expect(v.x).toBeCloseTo(4050); expect(v.y).toBeCloseTo(-50);
      expect(ctx.level().zones[0].invalid).toBeFalsy();
    });
    it('a free-end corner (axis offset ~0 by float noise) adds a wall vertex at offset 0', () => {
      // A (0,0)-(500,100): its left corner at the free end projects to an offset of about -1.8e-15.
      const lv: Level = { ...lShape(), nodes: [{ id: 'n0', x: 0, y: 0 }, { id: 'n1', x: 500, y: 100 }],
        walls: [{ id: 'A', a: 'n0', b: 'n1', thickness: 100, type: 'partition', baseline: 'center' }] };
      const corner = facePoint(lv, 'A', 'left', 0)!;
      const { ctx, t } = setup(lv);
      click(t, corner.x + 2, corner.y - 2);
      click(t, 2000, 1000); click(t, 3000, 1500); key(t, 'Enter');
      const v = verts(ctx.level())[0];
      expect(v.kind).toBe('wall');
      if (v.kind !== 'wall') return;
      expect(v.wallId).toBe('A'); expect(v.side).toBe('left');
      expect(v.offset).toBe(0);
    });
    it('Alt-click at a corner adds a free vertex at the pointer', () => {
      const { ctx, t } = setup(lShape());
      t.down(ev(3960, 60, { alt: true })); t.up(ev(3960, 60, { alt: true }));
      click(t, 2000, 1000); click(t, 3000, 1500); key(t, 'Enter');
      expect(verts(ctx.level())[0]).toEqual({ kind: 'free', x: 3960, y: 60 });
    });
  });
});
