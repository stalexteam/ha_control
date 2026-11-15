import type { Pt } from '../../model/types';
import { addBox, boxCorners } from '../../model/ops';
import { snap } from '../../geometry/snap';
import { parseWhole } from '../../geometry/parse';
import { createTypedInput } from './typed-input';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** Box (rectangular room) tool: DOM-free state machine. */
export function createBoxTool(ctx: ToolContext): Tool {
  let c1: Pt | null = null;
  let cursor: Pt = { x: 0, y: 0 };
  const input = createTypedInput(); // width, depth (mm)

  const reset = () => { c1 = null; input.clear(); };
  const snapPt = (p: Pt) => snap(ctx.level(), p, { tolMm: ctx.tolMm(), grid: ctx.grid(), ortho: false });

  /** Opposite corner: typed W/D signed by the cursor quadrant, else the snapped cursor. */
  function corner2(): Pt | null {
    if (!c1) return null;
    if (input.typing()) {
      const w = parseWhole(input.first, { min: 1 }), d = parseWhole(input.second, { min: 1 });
      if (w === null || d === null) return null;
      return { x: c1.x + (cursor.x >= c1.x ? w : -w), y: c1.y + (cursor.y >= c1.y ? d : -d) };
    }
    return snapPt(cursor).pt;
  }

  /** Degenerate before the measure offset is applied (addBox only checks after it). */
  const degenerate = (a: Pt, b: Pt): boolean => Math.abs(a.x - b.x) < 1 || Math.abs(a.y - b.y) < 1;

  function commit(c2: Pt): void {
    if (!c1 || degenerate(c1, c2)) return;
    const next = addBox(ctx.level(), c1, c2, ctx.wallProps(), ctx.boxMeasure());
    if (next === ctx.level()) return; // degenerate
    ctx.commit(next);
    reset();
  }

  return {
    id: 'box',
    down(e: ToolEvent) {
      cursor = e.pt;
      if (!c1) { c1 = snapPt(e.pt).pt; return; }
      const c2 = corner2();
      if (c2) commit(c2);
    },
    move(e: ToolEvent) { cursor = e.pt; },
    up() {},
    key(key) {
      if (!c1) return false;
      return input.key(key, () => {
        const c2 = corner2();
        if (c2) commit(c2);
      }, reset);
    },
    preview(): Preview {
      if (!c1) return { snap: snapPt(cursor) };
      const c2 = corner2();
      const out: Preview = {
        tracker: input.tracker(cursor),
        anchor: c1,
        snap: input.typing() ? undefined : snapPt(cursor),
      };
      if (!c2 || degenerate(c1, c2)) return out;
      const props = ctx.wallProps();
      const p = boxCorners(c1, c2, props.thickness, ctx.boxMeasure());
      if (!p) return out;
      out.walls = p.map((a, i) => ({ a, b: p[(i + 1) % 4], props: { ...props, baseline: 'center' as const } }));
      return out;
    },
    cancel() { reset(); },
  };
}
