import type { Level, Pt, ZoneVertex } from '../../model/types';
import { addPolygonZone } from '../../model/zones';
import { nextFreeName } from '../../model/ids';
import { segmentsMeet, selfIntersects } from '../../geometry/zones';
import { cross, dist, dot, sub } from '../../geometry/vec';
import { t } from '../../i18n';
import type { SnapResult } from '../../geometry/snap';
import { zoneVertexAt } from './zones-select-tool';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

const MIN_VERTICES = 3;
const SAME_MM = 1;

const pt = (v: ZoneVertex): Pt => ({ x: v.x, y: v.y });

/**
 * Polygon zone drawing tool. Each click adds a vertex placed by the same snap rules as the zone vertex drag (node ->
 * node vertex; wall midpoint, axis or face -> wall vertex on the face of the pointer's side; grid or nothing -> free;
 * Alt: free; Shift: ortho from the last vertex). The snap marker shows where the vertex lands, before the first click
 * too. A vertex is rejected within 1 mm of the previous one or when its edge would cross an earlier, non-adjacent
 * edge. With 3 or more vertices a click on the first or the last vertex, or Enter, closes the zone (rejected while
 * the closing edge crosses the outline); hovering either vertex previews the closing. Backspace or Delete removes
 * the last vertex; Escape drops the draft.
 */
export function createZoneDrawTool(ctx: ToolContext): Tool {
  let draft: ZoneVertex[] = [];
  let cursor: Pt | null = null;
  let invalid = false;
  let lastSnap: SnapResult | null = null; // the snap marker of the last pointer move
  let ortho = false; // Shift was held on the last pointer move

  const last = (): Pt | undefined => (draft.length ? pt(draft[draft.length - 1]) : undefined);

  /** The new edge last -> p is a repeat of the last point, folds back over the last edge, or crosses an earlier one. */
  function rejects(p: Pt): boolean {
    const n = draft.length;
    if (n === 0) return false;
    const pts = draft.map(pt);
    if (dist(pts[n - 1], p) <= SAME_MM) return true;
    if (n >= 2) {
      const d1 = sub(pts[n - 1], pts[n - 2]), d2 = sub(p, pts[n - 1]);
      if (Math.abs(cross(d1, d2)) <= 1e-9 * Math.hypot(d1.x, d1.y) * Math.hypot(d2.x, d2.y) && dot(d1, d2) < 0) return true;
    }
    for (let i = 0; i + 2 < n; i++) if (segmentsMeet(pts[n - 1], p, pts[i], pts[i + 1])) return true;
    return false;
  }

  /** With 3 or more vertices: the first or the last vertex within the pick tolerance of p (a click there closes). */
  function closingVertex(p: Pt): Pt | null {
    if (draft.length < MIN_VERTICES) return null;
    const tol = ctx.tolMm();
    const first = pt(draft[0]), end = pt(draft[draft.length - 1]);
    return dist(p, first) <= tol ? first : dist(p, end) <= tol ? end : null;
  }

  function close(): boolean {
    if (draft.length < MIN_VERTICES || selfIntersects(draft.map(pt))) return false;
    const level: Level = ctx.level();
    const name = nextFreeName(t('zones.default'), level.zones.map(z => z.name));
    const res = addPolygonZone(level, draft, name);
    if (res.zoneId === null) return false;
    draft = []; cursor = null; invalid = false;
    ctx.commit(res.level);
    ctx.select({ kind: 'zone', id: res.zoneId });
    return true;
  }

  const place = (e: ToolEvent) => zoneVertexAt(ctx, ctx.level(), e, last());

  return {
    id: 'zone-draw',
    down(e: ToolEvent) {
      if (closingVertex(e.pt)) {
        close();
        return;
      }
      const v = place(e).vertex;
      if (rejects(pt(v))) return;
      draft = [...draft, v];
      cursor = pt(v);
      invalid = false;
    },
    move(e: ToolEvent) {
      ortho = e.shift;
      // Hovering the first or the last vertex previews the closing: invalid only when the closing edge crosses.
      const end = closingVertex(e.pt);
      if (end) {
        cursor = end;
        lastSnap = null;
        invalid = selfIntersects(draft.map(pt));
        return;
      }
      const r = place(e);
      lastSnap = r.snap;
      cursor = pt(r.vertex);
      invalid = rejects(cursor);
    },
    up() {},
    key(key: string) {
      if (key === 'Enter') return close();
      if (key === 'Backspace' || key === 'Delete') {
        if (draft.length === 0) return false;
        draft = draft.slice(0, -1);
        invalid = false;
        return true;
      }
      if (key === 'Escape') {
        if (draft.length === 0) return false;
        draft = []; cursor = null; invalid = false;
        return true;
      }
      return false;
    },
    preview(): Preview {
      const pv: Preview = {};
      if (draft.length > 0) pv.zoneDraft = { points: draft.map(pt), cursor, invalid };
      if (lastSnap) pv.snap = lastSnap;
      const from = last();
      if (ortho && from) pv.orthoFrom = from;
      return pv;
    },
    cancel() { draft = []; cursor = null; invalid = false; lastSnap = null; ortho = false; },
  };
}
