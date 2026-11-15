import type { Pt } from '../../model/types';
import { addBox } from '../../model/ops';
import { snap } from '../../geometry/snap';
import { parseWhole } from '../../geometry/parse';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** Box (rectangular room) tool: DOM-free state machine. */
export function createBoxTool(ctx: ToolContext): Tool {
  let c1: Pt | null = null;
  let cursor: Pt = { x: 0, y: 0 };
  let wBuf = '';
  let dBuf = '';
  // Tracker field names: 'length' = width, 'angle' = depth.
  let field: 'length' | 'angle' = 'length';

  const reset = () => { c1 = null; wBuf = ''; dBuf = ''; field = 'length'; };
  const snapPt = (p: Pt) => snap(ctx.level(), p, { tolMm: ctx.tolMm(), grid: ctx.grid(), ortho: false });

  /** Opposite corner: typed W/D signed by the cursor quadrant, else the snapped cursor. */
  function corner2(): Pt | null {
    if (!c1) return null;
    if (wBuf !== '' || dBuf !== '') {
      const w = parseWhole(wBuf, { min: 1 }), d = parseWhole(dBuf, { min: 1 });
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
      if (/^[0-9]$/.test(key) || key === ' ') {
        if (field === 'length') wBuf += key; else dBuf += key;
        return true;
      }
      if (key === 'Backspace') {
        if (field === 'length') wBuf = wBuf.slice(0, -1); else dBuf = dBuf.slice(0, -1);
        return true;
      }
      if (key === 'Tab') { field = field === 'length' ? 'angle' : 'length'; return true; }
      if (key === 'Enter') {
        const c2 = corner2();
        if (c2) commit(c2);
        return true;
      }
      if (key === 'Escape') {
        if (wBuf !== '' || dBuf !== '') { wBuf = ''; dBuf = ''; field = 'length'; } else reset();
        return true;
      }
      return false;
    },
    preview(): Preview {
      if (!c1) return { snap: snapPt(cursor) };
      const c2 = corner2();
      const typing = wBuf !== '' || dBuf !== '';
      const out: Preview = {
        tracker: { length: wBuf, angle: dBuf, field, at: cursor },
        anchor: c1,
        snap: typing ? undefined : snapPt(cursor),
      };
      if (!c2 || degenerate(c1, c2)) return out;
      const props = ctx.wallProps();
      const m = ctx.boxMeasure();
      const h = m === 'inner' ? props.thickness / 2 : m === 'outer' ? -props.thickness / 2 : 0;
      const x0 = Math.min(c1.x, c2.x) - h, x1 = Math.max(c1.x, c2.x) + h;
      const y0 = Math.min(c1.y, c2.y) - h, y1 = Math.max(c1.y, c2.y) + h;
      if (x1 - x0 < 1 || y1 - y0 < 1) return out;
      const p = [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
      out.walls = p.map((a, i) => ({ a, b: p[(i + 1) % 4], props: { ...props, baseline: 'center' as const } }));
      return out;
    },
    cancel() { reset(); },
  };
}
