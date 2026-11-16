import type { Id, Level, Pt, ZoneVertex } from '../../model/types';
import { insertZoneVertex, moveZoneVertex, removeZoneVertex } from '../../model/zones';
import { WALL_TOL, zoneContains, zoneOutline } from '../../geometry/zones';
import { orthoConstrain, snap, type SnapResult } from '../../geometry/snap';
import { wallCorners, wallFrame, wallLen, wallLocal } from '../../geometry/walls';
import { facePoint } from '../../geometry/devices';
import { dist, distToSegment, lerp, polygonArea, projectT } from '../../geometry/vec';
import { t } from '../../i18n';
import { DRAG_PX, type Preview, type Selection, type ToolContext, type ToolEvent } from './types';

/** The outlines of the level's zones except `exclude`: the zone snap targets. */
const zoneRings = (level: Level, exclude?: Id): Pt[][] =>
  level.zones.filter(z => z.id !== exclude).map(z => zoneOutline(level, z)).filter(o => o.length >= 3);

/**
 * The zone vertex placed at the pointer, and the snap result for the marker (null with Alt). Alt: a free vertex at
 * the pointer (ortho from `from` with Shift), no snapping. Otherwise snap (Shift: ortho from `from`): a node gives a
 * node vertex; a wall face corner gives a wall vertex on that face (an inner corner: its axis offset within
 * WALL_TOL of [0, length], stored clamped to it) or a free vertex (an outer one); a wall midpoint, axis or face gives
 * a wall vertex on the face of the pointer's side; a vertex or an edge of another zone (every zone but `exclude`),
 * the grid or nothing gives a free vertex. A wall vertex's x,y and the marker's point are the resolved face point
 * (facePoint), not the axis point a midpoint or axis snap returns.
 */
export function zoneVertexAt(ctx: ToolContext, level: Level, e: ToolEvent, from: Pt | undefined, exclude?: Id):
{ vertex: ZoneVertex; snap: SnapResult | null } {
  if (e.alt) {
    const p = e.shift && from ? orthoConstrain(from, e.pt) : e.pt;
    return { vertex: { kind: 'free', x: p.x, y: p.y }, snap: null };
  }
  const s = snap(level, e.pt, { tolMm: ctx.tolMm(), grid: ctx.grid(), from, ortho: e.shift, zones: zoneRings(level, exclude), corners: wallCorners(level) });
  const ep = s.endpoint;
  if (s.kind === 'node' && ep.kind === 'node') {
    return { vertex: { kind: 'node', nodeId: ep.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  }
  if (s.kind === 'corner' && s.corner) {
    // An inner corner (on the axis span) stays on its face and follows the wall; an outer one is a free vertex.
    const c = s.corner;
    const len = wallLen(level, c.wallId);
    const inner = len !== null && c.offset >= -WALL_TOL && c.offset <= len + WALL_TOL;
    const offset = inner ? Math.max(0, Math.min(len, c.offset)) : c.offset;
    const p = inner ? facePoint(level, c.wallId, c.side, offset) : null;
    if (p) return { vertex: { kind: 'wall', wallId: c.wallId, offset, side: c.side, x: p.x, y: p.y }, snap: s };
  }
  if ((s.kind === 'mid' || s.kind === 'wall') && ep.kind === 'wall') {
    const w = level.walls.find(x => x.id === ep.wallId);
    if (w) {
      const side = wallLocal(wallFrame(level, w), e.pt).side >= 0 ? 'left' : 'right';
      const p = facePoint(level, w.id, side, ep.offset) ?? s.pt;
      return { vertex: { kind: 'wall', wallId: w.id, offset: ep.offset, side, x: p.x, y: p.y }, snap: { ...s, pt: p } };
    }
  }
  return { vertex: { kind: 'free', x: s.pt.x, y: s.pt.y }, snap: s };
}

/** Ids of the zones whose outline contains p or passes within tol of it: smallest area first, then by id. */
export function zonesAt(level: Level, p: Pt, tol: number): Id[] {
  const hits: { id: Id; area: number }[] = [];
  for (const z of level.zones) {
    const o = zoneOutline(level, z);
    if (o.length < 3) continue;
    const near = o.some((a, i) => distToSegment(p, a, o[(i + 1) % o.length]) <= tol);
    if (near || zoneContains(o, p)) hits.push({ id: z.id, area: Math.abs(polygonArea(o)) });
  }
  hits.sort((a, b) => a.area - b.area || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return hits.map(h => h.id);
}

/** The polygon zone `id`'s outline and vertices, or null (missing or a walls zone). */
function polygon(level: Level, id: Id): { o: Pt[]; v: ZoneVertex[] } | null {
  const z = level.zones.find(x => x.id === id);
  return z && z.shape.kind === 'polygon' ? { o: zoneOutline(level, z), v: z.shape.vertices } : null;
}

/** The vertex handle of polygon zone `id` nearest to p within tol, with the previous vertex's point; else null. */
function handleAt(level: Level, id: Id, p: Pt, tol: number): { index: number; from: Pt } | null {
  const o = polygon(level, id)?.o;
  if (!o) return null;
  let best = -1;
  o.forEach((q, i) => { if (dist(p, q) <= tol && (best < 0 || dist(p, q) < dist(p, o[best]))) best = i; });
  return best < 0 ? null : { index: best, from: o[(best + o.length - 1) % o.length] };
}

/**
 * The vertex a double-click at p inserts into polygon zone `id`: on its nearest edge within tol (not within tol of a
 * vertex), at p projected onto it. Between two wall vertices of one wall face it is a wall vertex at the interpolated
 * offset (it follows the wall); else a free vertex on whole millimetres. Null off the edges.
 */
function edgeVertexAt(level: Level, id: Id, p: Pt, tol: number): { index: number; vertex: ZoneVertex } | null {
  const pg = polygon(level, id);
  if (!pg || pg.o.some(q => dist(p, q) <= tol)) return null;
  const { o, v } = pg;
  let best = -1, bestD = Infinity;
  o.forEach((a, i) => {
    const d = distToSegment(p, a, o[(i + 1) % o.length]);
    if (d <= tol && d < bestD) { best = i; bestD = d; }
  });
  if (best < 0) return null;
  const a = o[best], b = o[(best + 1) % o.length];
  const k = Math.max(0, Math.min(1, projectT(p, a, b)));
  const q = lerp(a, b, k);
  const va = v[best], vb = v[(best + 1) % v.length];
  const vertex: ZoneVertex = va.kind === 'wall' && vb.kind === 'wall' && va.wallId === vb.wallId && va.side === vb.side
    ? { kind: 'wall', wallId: va.wallId, side: va.side, offset: va.offset + k * (vb.offset - va.offset), x: q.x, y: q.y }
    : { kind: 'free', x: Math.round(q.x), y: Math.round(q.y) };
  return { index: best + 1, vertex };
}

export interface ZoneEditor {
  /** Every press: remembers the selection before it (for the double-click). */
  note(): void;
  /** A press on a vertex handle of the selected polygon zone starts a vertex gesture; true when it did. */
  press(e: ToolEvent): boolean;
  /** The press is on no wall, opening or node: pick the zone there (cycling where zones overlap), or clear. */
  pick(p: Pt): void;
  /** The press picked something else: the next zone pick starts from the smallest again. */
  forget(): void;
  /** A vertex gesture is in progress. */
  active(): boolean;
  move(e: ToolEvent): void;
  up(e: ToolEvent): void;
  dblclick(e: ToolEvent): void;
  key(key: string): boolean;
  preview(): Preview;
  /** Drops the gesture, the picked vertex and the cycling point. */
  cancel(): void;
}

/**
 * The Select tool's zone editing. A press on no wall, opening or node picks the zone under the point (inside, or its
 * edge within the pick tolerance); where zones overlap the smallest comes first and a press next to the previous one
 * picks the next; an empty press clears. With a polygon zone selected, a press on one of its vertex handles drags the
 * vertex (it re-snaps to a node, a wall face, another zone or the grid; Alt places it free, Shift keeps the angle to
 * the previous vertex; one commit on release), and a click without movement picks the vertex: Delete or Backspace
 * then removes it (refused with a notice at 3 vertices), Escape drops the pick. A double-click on an edge of the
 * polygon zone selected before its two clicks inserts a vertex there (one commit) and selects that zone again.
 * The selection is the panel's (a zone picked in the list drags with the first press).
 */
export function createZoneEditor(ctx: ToolContext, select: (s: Selection | null) => void): ZoneEditor {
  let lastClick: Pt | null = null; // point of the previous pick, for cycling
  let drag: { zoneId: Id; index: number; from: Pt } | null = null; // from: the previous vertex
  let original: Level | null = null;
  let working: Level | null = null;
  let lastSnap: SnapResult | null = null;
  let ortho = false;
  let moved = false;
  let downPt: Pt = { x: 0, y: 0 };
  let vertex: { zoneId: Id; index: number } | null = null; // the picked vertex
  let before: (Selection | null)[] = []; // the selection before each of the last two presses

  const selected = (): Id | null => { const s = ctx.selection(); return s?.kind === 'zone' ? s.id : null; };
  const reset = () => { drag = null; original = null; working = null; lastSnap = null; ortho = false; moved = false; };
  /** The picked vertex while its zone is still the selection. */
  const picked = () => (vertex && vertex.zoneId === selected() ? vertex : null);

  function update(e: ToolEvent): void {
    if (!drag || !original) return;
    // Pointer jitter is a click, not a drag.
    if (!moved && dist(e.pt, downPt) <= DRAG_PX / ctx.scale()) return;
    moved = true;
    const r = zoneVertexAt(ctx, original, e, drag.from, drag.zoneId);
    lastSnap = r.snap;
    ortho = e.shift;
    working = moveZoneVertex(original, drag.zoneId, drag.index, r.vertex);
  }

  return {
    note() {
      before = [before[before.length - 1] ?? null, ctx.selection()];
    },
    press(e) {
      reset();
      vertex = null;
      downPt = e.pt;
      const sel = selected();
      const level = ctx.level();
      const h = sel === null ? null : handleAt(level, sel, e.pt, ctx.tolMm());
      if (sel === null || !h) return false;
      drag = { zoneId: sel, ...h };
      original = working = level;
      return true;
    },
    pick(p) {
      const ids = zonesAt(ctx.level(), p, ctx.tolMm());
      if (ids.length === 0) { lastClick = null; select(null); return; }
      // Next to the previous click: the candidate after the selected one (-1 when it is not a candidate: the first).
      const sel = selected();
      const at = sel !== null && lastClick !== null && dist(p, lastClick) <= ctx.tolMm() ? ids.indexOf(sel) : -1;
      lastClick = p;
      select({ kind: 'zone', id: ids[(at + 1) % ids.length] });
    },
    forget() { lastClick = null; },
    active: () => drag !== null,
    move(e) { update(e); },
    up(e) {
      if (!drag) return;
      update(e);
      const next = working, orig = original, wasMoved = moved, d = drag;
      reset();
      if (!wasMoved) vertex = { zoneId: d.zoneId, index: d.index };
      else if (next && orig && next !== orig) ctx.commit(next);
    },
    dblclick(e) {
      const s = before[0];
      if (s?.kind !== 'zone') return;
      const level = ctx.level();
      const at = edgeVertexAt(level, s.id, e.pt, ctx.tolMm());
      if (!at) return;
      const next = insertZoneVertex(level, s.id, at.index, at.vertex);
      if (next === level) return;
      ctx.commit(next);
      select(s);
      lastClick = null;
    },
    key(key) {
      if (key === 'Escape' && drag) { reset(); return true; }
      const v = picked();
      if (key === 'Escape' && v) { vertex = null; return true; }
      if ((key === 'Delete' || key === 'Backspace') && v) {
        const level = ctx.level();
        const next = removeZoneVertex(level, v.zoneId, v.index);
        if (next === level) { ctx.notify(t('zones.minVertices')); return true; }
        vertex = null;
        ctx.commit(next);
        return true;
      }
      return false;
    },
    preview(): Preview {
      if (drag && working) {
        const pv: Preview = { level: working };
        if (lastSnap) pv.snap = lastSnap;
        if (ortho) pv.orthoFrom = drag.from;
        return pv;
      }
      const v = picked();
      return v ? { zoneVertex: v } : {};
    },
    cancel() { reset(); vertex = null; lastClick = null; },
  };
}
