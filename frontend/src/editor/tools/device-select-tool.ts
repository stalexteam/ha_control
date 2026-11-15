import type { DevicePlacement, Id, Level, Pt } from '../../model/types';
import { deleteDevice, moveDevice } from '../../model/devices';
import { deviceAt, devicePose } from '../../geometry/devices';
import { orthoConstrain } from '../../geometry/snap';
import { wallFrame } from '../../geometry/walls';
import { add, dist, dot, perpLeft, sub } from '../../geometry/vec';
import { deviceCandidate } from './device-tool';
import type { Preview, Selection, Tool, ToolContext, ToolEvent } from './types';

const placementOf = (l: Level, id: Id) => JSON.stringify(l.devices.find(d => d.id === id)?.placement);
const placementChanged = (a: Level, b: Level, id: Id | undefined) => id === undefined || placementOf(a, id) !== placementOf(b, id);

/** Device select tool: pick, drag (slide / re-host / leave the wall; one commit on `up`), delete. */
export function createDeviceSelectTool(ctx: ToolContext): Tool {
  let sel: Selection | null = null;
  let drag: { id: Id; grab: Pt } | null = null; // grab: device centre minus the pointer at `down`
  let original: Level | null = null;
  let working: Level | null = null;
  let moved = false;
  let downPt: Pt = { x: 0, y: 0 };

  const setSel = (s: Selection | null) => { sel = s; ctx.select(s); };
  const reset = () => { drag = null; original = null; working = null; moved = false; };

  function update(e: ToolEvent): void {
    if (!drag || !original) return;
    // Pointer jitter (under 3 screen px; tolMm is 10 px) is a click, not a drag.
    if (!moved && dist(e.pt, downPt) <= ctx.tolMm() * 0.3) return;
    moved = true;
    if (e.pt.x === downPt.x && e.pt.y === downPt.y) { working = original; return; } // back at the grab point: nothing moved
    const d = original.devices.find(x => x.id === drag!.id);
    if (!d) return;
    const p = e.shift ? orthoConstrain(downPt, e.pt) : e.pt;
    // A free device keeps the grab offset so it does not jump to the pointer; a wall device follows the pointer.
    const pl = d.placement;
    const free = pl.mode === 'free';
    const cand = deviceCandidate(ctx, original, d.props.kind, free ? add(p, drag.grab) : p, pl.mode === 'free' ? pl.rotation : 0);
    working = cand ? moveDevice(original, d.id, wallStable(original, d.placement, cand, p)) : original;
  }

  /** On the same wall: keep the along-wall grab offset and the original side (flip only past the other face). */
  function wallStable(level: Level, from: DevicePlacement, cand: DevicePlacement, p: Pt): DevicePlacement {
    if (from.mode !== 'wall' || cand.mode !== 'wall' || cand.wallId !== from.wallId) return cand;
    const w = level.walls.find(x => x.id === from.wallId);
    if (!w) return cand;
    const f = wallFrame(level, w);
    const offset = Math.max(0, Math.min(f.len, from.offset + dot(sub(p, downPt), f.dir)));
    const s = dot(sub(p, f.a), perpLeft(f.dir));
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
      const id = deviceAt(level, e.pt, ctx.tolMm());
      if (!id) { setSel(null); return; }
      setSel({ kind: 'device', id });
      const d = level.devices.find(x => x.id === id)!;
      const pose = devicePose(level, d);
      original = working = level;
      // Only a free device keeps the grab offset; a wall device follows the pointer.
      drag = { id, grab: pose && d.placement.mode === 'free' ? sub(pose.pt, e.pt) : { x: 0, y: 0 } };
    },
    move(e: ToolEvent) { update(e); },
    up(e: ToolEvent) {
      if (drag) update(e);
      const next = working, orig = original, wasMoved = moved, id = drag?.id;
      reset();
      if (wasMoved && next && orig && next !== orig && placementChanged(orig, next, id)) ctx.commit(next);
    },
    key(key) {
      if (key === 'Escape' && drag) { reset(); return true; }
      if (key !== 'Delete' && key !== 'Backspace') return false;
      if (!sel || sel.kind !== 'device') return false;
      const level = ctx.level();
      if (!level.devices.some(x => x.id === sel!.id)) return false;
      ctx.commit(deleteDevice(level, sel.id));
      setSel(null);
      return true;
    },
    preview(): Preview {
      return drag && working ? { level: working } : {};
    },
    cancel() { reset(); setSel(null); },
  };
}
