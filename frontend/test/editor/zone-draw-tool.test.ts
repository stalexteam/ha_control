import { describe, expect, it } from 'vitest';
import { createZoneDrawTool } from '../../src/editor/tools/zone-draw-tool';
import { createTool } from '../../src/panel/tool-factory';
import { levelZones, type Level, type ZoneVertex } from '../../src/model/types';
import type { Selection, Tool } from '../../src/editor/tools/types';
import { rectRoomLevel } from '../fixtures';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number, o: { shift?: boolean; alt?: boolean } = {}) =>
  ({ pt: { x, y }, shift: !!o.shift, alt: !!o.alt, ctrl: false });
const click = (t: Tool, x: number, y: number) => { t.down(ev(x, y)); t.up(ev(x, y)); };
const key = (t: Tool, k: string) => t.key(k, { shift: false });
const verts = (l: Level, i = 0): ZoneVertex[] => {
  const s = levelZones(l)[i].shape;
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
    expect(t.id).toBe('zone-draw');
    triangle(t);
    expect(ctx.commits).toHaveLength(0);
    expect(key(t, 'Enter')).toBe(true);
    expect(ctx.commits).toHaveLength(1);
    const z = levelZones(ctx.level())[0];
    expect(z.name).toBe('Zone 1');
    expect(verts(ctx.level())).toHaveLength(3);
    expect(selected).toEqual([{ kind: 'automationZone', id: z.id }]);
    expect(t.preview().zoneDraft).toBeUndefined();
  });

  it('clicking the first vertex closes; clicking the last vertex closes', () => {
    const a = setup();
    triangle(a.t);
    click(a.t, 10, 10); // within tolMm (20) of the first vertex
    expect(levelZones(a.ctx.level())).toHaveLength(1);
    const b = setup();
    triangle(b.t);
    click(b.t, 1005, 1005);
    expect(levelZones(b.ctx.level())).toHaveLength(1);
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

  it('the second zone is "Zone 2"', () => {
    const { ctx, t } = setup();
    triangle(t); key(t, 'Enter');
    click(t, 3000, 0); click(t, 4000, 0); click(t, 4000, 1000); key(t, 'Enter');
    expect(levelZones(ctx.level()).map(z => z.name)).toEqual(['Zone 1', 'Zone 2']);
  });

  it('the factory builds it', () => {
    expect(createTool('zone-draw', fakeContext()).id).toBe('zone-draw');
  });
});
