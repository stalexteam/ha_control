import type { DevicePlacement, Id, Level, Pt } from '../../model/types';
import { moveDevice } from '../../model/devices';
import { angleOf, deviceAt, devicePose, wrap360 } from '../../geometry/devices';
import { orthoConstrain } from '../../geometry/snap';
import { wallFrame, wallLocal } from '../../geometry/walls';
import { add, dist, dot, sub } from '../../geometry/vec';
import { createAimDrag } from './aim-drag';
import { candidateModes, deviceCandidate } from './device-tool';
import { DRAG_PX, type Preview, type Selection, type Tool, type ToolContext, type ToolEvent } from './types';

const placementOf = (l: Level, id: Id) => JSON.stringify(l.devices.find(d => d.id === id)?.placement);
const placementChanged = (a: Level, b: Level, id: Id | undefined) => id === undefined || placementOf(a, id) !== placementOf(b, id);

/** Device select tool: pick, drag (slide / re-host / leave the wall; one commit on `up`), delete. */
export function createDeviceSelectTool(ctx: ToolContext): Tool {
  let sel: Selection | null = null;
  let drag: { id: Id; grab: Pt } | null = null; // grab: device centre minus the pointer at `down`
  const aim = createAimDrag(ctx); // direction handle (knob) drag
  let original: Level | null = null;
  let working: Level | null = null;
  let moved = false;
  let downPt: Pt = { x: 0, y: 0 };

  const setSel = (s: Selection | null) => { sel = s; ctx.select(s); };
  const reset = () => { drag = null; original = null; working = null; moved = false; };

  function update(e: ToolEvent): void {
    if (!drag || !original) return;
    // Pointer jitter is a click, not a drag.
    if (!moved && dist(e.pt, downPt) <= DRAG_PX / ctx.scale()) return;
    moved = true;
    if (e.pt.x === downPt.x && e.pt.y === downPt.y) { working = original; return; } // back at the grab point: nothing moved
    const d = original.devices.find(x => x.id === drag!.id);
    if (!d || d.placement.mode === 'none') return; // never hit, so never dragged: a guard
    const p = e.shift ? orthoConstrain(downPt, e.pt) : e.pt;
    // A free device keeps the grab offset so it does not jump to the pointer; a wall device follows the pointer.
    const pl = d.placement;
    const free = pl.mode === 'free';
    // Leaving the wall keeps the world direction (as the free rotation) so the cone does not jump.
    const pose = free ? null : devicePose(original, d);
    const rot = pl.mode === 'free' ? pl.rotation : pose ? wrap360(Math.round(angleOf(pose.dir))) : 0;
    const cand = deviceCandidate(ctx, original, d.props.kind, free ? add(p, drag.grab) : p, rot,
      candidateModes(d.props.kind, pl.mode));
    // A wall candidate keeps the aim of a wall device; a free device landing on a wall starts at aim 0.
    const keep = cand && cand.mode === 'wall' && pl.mode === 'wall' && pl.aim !== undefined ? { ...cand, aim: pl.aim } : cand;
    working = keep ? moveDevice(original, d.id, wallStable(original, d.placement, keep, p)) : original;
  }

  /** On the same wall: keep the along-wall grab offset and the original side (flip only past the other face). */
  function wallStable(level: Level, from: DevicePlacement, cand: DevicePlacement, p: Pt): DevicePlacement {
    if (from.mode !== 'wall' || cand.mode !== 'wall' || cand.wallId !== from.wallId) return cand;
    const w = level.walls.find(x => x.id === from.wallId);
    if (!w) return cand;
    const f = wallFrame(level, w);
    const offset = Math.max(0, Math.min(f.len, from.offset + dot(sub(p, downPt), f.dir)));
    const s = wallLocal(f, p).side;
    const tol = ctx.tolMm();
    const side = from.side === 'left' ? (s < -(f.rightOff + tol) ? 'right' : 'left') : (s > f.leftOff + tol ? 'left' : 'right');
    return { ...cand, offset, side };
  }

  return {
    id: 'device-select',
    down(e: ToolEvent) {
      reset();
      downPt = e.pt;
      const level = ctx.level();
      const tol = ctx.tolMm();
      // The direction handle of the selected device wins over devices and walls.
      if (aim.start(sel?.kind === 'device' ? sel.id : undefined, e)) return;
      const id = deviceAt(level, e.pt, tol);
      if (!id) { setSel(null); return; }
      setSel({ kind: 'device', id });
      const d = level.devices.find(x => x.id === id)!;
      const pose = devicePose(level, d);
      original = working = level;
      // Only a free device keeps the grab offset; a wall device follows the pointer.
      drag = { id, grab: pose && d.placement.mode === 'free' ? sub(pose.pt, e.pt) : { x: 0, y: 0 } };
    },
    move(e: ToolEvent) { if (aim.active()) aim.move(e); else update(e); },
    up(e: ToolEvent) {
      if (aim.end(e)) return;
      if (drag) update(e);
      const next = working, orig = original, wasMoved = moved, id = drag?.id;
      reset();
      if (wasMoved && next && orig && next !== orig && placementChanged(orig, next, id)) ctx.commit(next);
    },
    key(key) {
      if (key === 'Escape' && aim.cancel()) return true;
      if (key === 'Escape' && drag) { reset(); return true; }
      return false;
    },
    preview(): Preview {
      const w = aim.working();
      if (w) return { level: w };
      return drag && working ? { level: working } : {};
    },
    cancel() { aim.cancel(); reset(); setSel(null); },
  };
}
