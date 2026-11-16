import type { Id, Level, Pt } from '../../model/types';
import { detachWallEnd, finalize, mergeNodes, moveNode, moveWall } from '../../model/ops';
import { moveOpening } from '../../model/openings';
import { trimWall } from '../../model/trim';
import { snap, type SnapResult } from '../../geometry/snap';
import { nodePos, wallFrame, wallLocal } from '../../geometry/walls';
import { sub } from '../../geometry/vec';
import { hitTest, wallAt } from '../hit';
import { createZoneEditor } from './zone-edit';
import type { Preview, Selection, Tool, ToolContext, ToolEvent } from './types';

type Drag =
  | { kind: 'node'; nodeId: Id; origin: Pt }
  | { kind: 'wall'; wallId: Id; origin: Pt }
  | { kind: 'opening'; openingId: Id; grab: number };

/**
 * Select tool: pick, drag nodes/walls/openings (one commit per drag, on `up`), delete. Ctrl+press on a wall trims
 * it (one commit, no drag) and clears the selection. Zones (createZoneEditor): the vertex handles of the selected
 * polygon zone come first, then openings, nodes and walls, then the zones under the point (cycling where they
 * overlap); a double-click on an edge of the selected polygon zone inserts a vertex. `cancel` drops the gesture and
 * keeps the selection (the panel clears it where it should).
 */
export function createSelectTool(ctx: ToolContext): Tool {
  let drag: Drag | null = null;
  let start: Level | null = null; // level captured at `down` (after any detach); drag base
  let working: Level | null = null; // preview copy
  let moved = false;
  let downPt: Pt = { x: 0, y: 0 };
  let original: Level | null = null; // level before the gesture; commit only when working differs

  const setSel = (s: Selection | null) => { ctx.select(s); };
  const reset = () => { drag = null; start = null; working = null; original = null; moved = false; };
  const zones = createZoneEditor(ctx, setSel);

  /** Free (unsnapped) points are kept on whole millimetres. */
  const whole = (s: SnapResult): Pt => (s.kind === 'none' ? { x: Math.round(s.pt.x), y: Math.round(s.pt.y) } : s.pt);

  const along = (level: Level, wallId: Id, p: Pt): number =>
    wallLocal(wallFrame(level, level.walls.find(w => w.id === wallId)!), p).t;

  function update(e: ToolEvent): void {
    const d = drag;
    if (!d || !start) return;
    if (e.pt.x === downPt.x && e.pt.y === downPt.y) return; // a click without movement edits nothing
    moved = true;
    if (d.kind === 'node') {
      const s = snap(start, e.pt, {
        tolMm: ctx.tolMm(), grid: ctx.grid(), from: d.origin, ortho: e.shift, excludeNodeIds: [d.nodeId],
      });
      const ep = s.endpoint;
      const onWall = (s.kind === 'wall' || s.kind === 'mid') && ep.kind === 'wall';
      const onNode = s.kind === 'node' && ep.kind === 'node' && ep.nodeId !== d.nodeId;
      const dragged = start.nodes.find(x => x.id === d.nodeId)!;
      // A hosted node keeps sliding on its own host wall; any other drop target replaces or clears the host.
      const slides = !!dragged.host && onWall && ep.kind === 'wall' && ep.wallId === dragged.host.wallId;
      let base = start;
      if (dragged.host && !slides) {
        const c = structuredClone(start);
        delete c.nodes.find(x => x.id === d.nodeId)!.host;
        base = c;
      }
      let next = moveNode(base, d.nodeId, whole(s));
      if (onNode && ep.kind === 'node') {
        next = mergeNodes(next, d.nodeId, ep.nodeId);
      } else if (onWall && ep.kind === 'wall' && !slides) {
        const wall = start.walls.find(w => w.id === ep.wallId);
        // Never host a node on a wall that is attached to it.
        if (wall && wall.a !== d.nodeId && wall.b !== d.nodeId) {
          const out = structuredClone(next);
          out.nodes.find(x => x.id === d.nodeId)!.host = { wallId: ep.wallId, offset: ep.offset };
          next = finalize(out, next);
        }
      }
      working = next;
    } else if (d.kind === 'wall') {
      // Snap the grabbed point (ortho relative to it with Shift); the wall moves by the snapped delta.
      const w = start.walls.find(x => x.id === d.wallId)!;
      const s = snap(start, e.pt, {
        tolMm: ctx.tolMm(), grid: ctx.grid(), from: d.origin, ortho: e.shift, excludeNodeIds: [w.a, w.b],
      });
      const delta = sub(s.pt, d.origin);
      working = moveWall(start, d.wallId,
        s.kind === 'none' ? { x: Math.round(delta.x), y: Math.round(delta.y) } : delta);
    } else {
      const o = start.openings.find(x => x.id === d.openingId)!;
      working = moveOpening(start, o.id, along(start, o.wallId, e.pt) - d.grab);
    }
  }

  return {
    id: 'select',
    down(e: ToolEvent) {
      reset();
      downPt = e.pt;
      zones.note();
      const level = ctx.level();
      const trimmed = e.ctrl ? wallAt(level, e.pt, ctx.tolMm()) : null;
      if (trimmed) {
        setSel(null);
        ctx.commit(trimWall(level, trimmed, e.pt));
        return;
      }
      if (zones.press(e)) return;
      const prev = ctx.selection(); // the panel's: Esc, undo or a list pick may have changed it
      const hit = hitTest(level, e.pt, ctx.tolMm(), prev);
      if (!hit) { zones.pick(e.pt); return; }
      zones.forget();
      setSel(hit);
      original = start = working = level;
      if (hit.kind === 'node') {
        let nodeId = hit.id;
        const wall = prev?.kind === 'wall' ? level.walls.find(w => w.id === prev.id) : undefined;
        if (e.alt && wall) {
          // Alt on an end of the selected wall: detach it from the shared node, then drag the new node.
          const res = detachWallEnd(level, wall.id, wall.a === hit.id ? 'a' : 'b');
          start = working = res.level;
          nodeId = res.nodeId;
          setSel({ kind: 'node', id: nodeId });
        }
        drag = { kind: 'node', nodeId, origin: nodePos(start, nodeId) };
      } else if (hit.kind === 'wall') {
        drag = { kind: 'wall', wallId: hit.id, origin: e.pt };
      } else if (hit.kind === 'opening') {
        const o = level.openings.find(x => x.id === hit.id)!;
        drag = { kind: 'opening', openingId: o.id, grab: along(level, o.wallId, e.pt) - o.offset };
      }
    },
    move(e: ToolEvent) { if (zones.active()) zones.move(e); else update(e); },
    up(e: ToolEvent) {
      if (zones.active()) { zones.up(e); return; }
      if (drag) update(e);
      const wasMoved = moved;
      const next = working;
      const orig = original;
      reset();
      if (wasMoved && next && orig && next !== orig) ctx.commit(next);
    },
    dblclick(e: ToolEvent) { zones.dblclick(e); },
    key(key) {
      if (key === 'Escape' && drag) { reset(); return true; }
      return zones.key(key);
    },
    preview(): Preview {
      if (!drag || !working) return zones.preview();
      return { level: working, orthoFrom: drag.kind === 'node' ? drag.origin : undefined };
    },
    cancel() { reset(); zones.cancel(); },
  };
}
