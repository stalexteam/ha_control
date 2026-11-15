import { levelZones, type Id, type Level, type Pt, type ZoneVertex } from '../../model/types';
import { moveZoneVertex } from '../../model/automation-zones';
import { zoneContains, zoneOutline } from '../../geometry/zones';
import { orthoConstrain, snap, type SnapResult } from '../../geometry/snap';
import { wallFrame, wallLocal } from '../../geometry/walls';
import { dist, distToSegment, polygonArea } from '../../geometry/vec';
import { DRAG_PX, type Preview, type Tool, type ToolContext, type ToolEvent } from './types';

/**
 * The zone vertex placed at the pointer, and the snap result for the marker (null with Alt). Alt: a free vertex at
 * the pointer (ortho from `from` with Shift), no snapping. Otherwise snap (Shift: ortho from `from`): a node gives a
 * node vertex; a wall midpoint, axis or face gives a wall vertex on the face of the pointer's side; the grid or
 * nothing gives a free vertex.
 */
export function zoneVertexAt(ctx: ToolContext, level: Level, e: ToolEvent, from: Pt | undefined):
{ vertex: ZoneVertex; snap: SnapResult | null } {
  if (e.alt) {
    const p = e.shift && from ? orthoConstrain(from, e.pt) : e.pt;
    return { vertex: { kind: 'free', x: p.x, y: p.y }, snap: null };
  }
  const s = snap(level, e.pt, { tolMm: ctx.tolMm(), grid: ctx.grid(), from, ortho: e.shift });
  const ep = s.endpoint;
  if (s.kind === 'node' && ep.kind === 'node') {
    return { vertex: { kind: 'node', nodeId: ep.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  }
  if ((s.kind === 'mid' || s.kind === 'wall') && ep.kind === 'wall') {
    const w = level.walls.find(x => x.id === ep.wallId);
    if (w) {
      const side = wallLocal(wallFrame(level, w), e.pt).side >= 0 ? 'left' : 'right';
      return { vertex: { kind: 'wall', wallId: w.id, offset: ep.offset, side, x: s.pt.x, y: s.pt.y }, snap: s };
    }
  }
  return { vertex: { kind: 'free', x: s.pt.x, y: s.pt.y }, snap: s };
}

/** Ids of the zones whose outline contains p or passes within tol of it: smallest area first, then by id. */
function zonesAt(level: Level, p: Pt, tol: number): Id[] {
  const hits: { id: Id; area: number }[] = [];
  for (const z of levelZones(level)) {
    const o = zoneOutline(level, z);
    const near = o.some((a, i) => distToSegment(p, a, o[(i + 1) % o.length]) <= tol);
    if (near || zoneContains(o, p)) hits.push({ id: z.id, area: Math.abs(polygonArea(o)) });
  }
  hits.sort((a, b) => a.area - b.area || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return hits.map(h => h.id);
}

/** The vertex handle of polygon zone `id` nearest to p within tol, with the previous vertex's point; else null. */
function handleAt(level: Level, id: Id, p: Pt, tol: number): { index: number; from: Pt } | null {
  const z = levelZones(level).find(x => x.id === id);
  if (!z || z.shape.kind !== 'polygon') return null;
  const o = zoneOutline(level, z);
  let best = -1;
  o.forEach((q, i) => { if (dist(p, q) <= tol && (best < 0 || dist(p, q) < dist(p, o[best]))) best = i; });
  return best < 0 ? null : { index: best, from: o[(best + o.length - 1) % o.length] };
}

/**
 * Zones select tool. A click picks the zone under the point (inside, or its edge within the pick tolerance); where
 * zones overlap, the smallest comes first and a click next to the previous one picks the next; an empty click clears.
 * With a custom zone selected, a press on one of its vertex handles drags the vertex: it re-snaps to a node, a wall
 * face or the grid, Alt places it free, Shift keeps the angle to the previous vertex. One commit on `up`.
 * The selection is the panel's (a zone picked in the list drags with the first press); `cancel` drops a gesture only.
 */
export function createZonesSelectTool(ctx: ToolContext): Tool {
  let lastClick: Pt | null = null; // point of the previous pick, for cycling
  let drag: { zoneId: Id; index: number; from: Pt } | null = null; // from: the previous vertex
  let original: Level | null = null;
  let working: Level | null = null;
  let lastSnap: SnapResult | null = null;
  let ortho = false;
  let moved = false;
  let downPt: Pt = { x: 0, y: 0 };

  const selected = (): Id | null => { const s = ctx.selection(); return s?.kind === 'automationZone' ? s.id : null; };
  const setSel = (id: Id | null) => { ctx.select(id === null ? null : { kind: 'automationZone', id }); };
  const reset = () => { drag = null; original = null; working = null; lastSnap = null; ortho = false; moved = false; };

  function update(e: ToolEvent): void {
    if (!drag || !original) return;
    // Pointer jitter is a click, not a drag.
    if (!moved && dist(e.pt, downPt) <= DRAG_PX / ctx.scale()) return;
    moved = true;
    const r = zoneVertexAt(ctx, original, e, drag.from);
    lastSnap = r.snap;
    ortho = e.shift;
    working = moveZoneVertex(original, drag.zoneId, drag.index, r.vertex);
  }

  function pick(level: Level, p: Pt): void {
    const ids = zonesAt(level, p, ctx.tolMm());
    if (ids.length === 0) { lastClick = null; setSel(null); return; }
    // Next to the previous click: the candidate after the selected one (-1 when it is not a candidate: the first).
    const sel = selected();
    const at = sel !== null && lastClick !== null && dist(p, lastClick) <= ctx.tolMm() ? ids.indexOf(sel) : -1;
    lastClick = p;
    setSel(ids[(at + 1) % ids.length]);
  }

  return {
    id: 'zones-select',
    down(e: ToolEvent) {
      reset();
      downPt = e.pt;
      const level = ctx.level();
      const sel = selected();
      const h = sel === null ? null : handleAt(level, sel, e.pt, ctx.tolMm());
      if (sel !== null && h) {
        drag = { zoneId: sel, ...h };
        original = working = level;
        return;
      }
      pick(level, e.pt);
    },
    move(e: ToolEvent) { update(e); },
    up(e: ToolEvent) {
      if (drag) update(e);
      const next = working, orig = original, wasMoved = moved;
      reset();
      if (wasMoved && next && orig && next !== orig) ctx.commit(next);
    },
    key(key) {
      if (key === 'Escape' && drag) { reset(); return true; }
      return false;
    },
    preview(): Preview {
      if (!drag || !working) return {};
      const pv: Preview = { level: working };
      if (lastSnap) pv.snap = lastSnap;
      if (ortho) pv.orthoFrom = drag.from;
      return pv;
    },
    cancel() { reset(); lastClick = null; },
  };
}
