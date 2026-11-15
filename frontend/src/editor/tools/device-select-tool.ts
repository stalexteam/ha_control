import type { DevicePlacement, Id, Level, Pt } from '../../model/types';
import { deleteDevice, moveDevice } from '../../model/devices';
import { angleFromHandle, angleOf, deviceAt, devicePose, directionHandle } from '../../geometry/devices';
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
  let drag: { id: Id; grab: Pt; knob: boolean } | null = null; // grab: device centre minus the pointer at `down`; knob: dragging the direction handle
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
    if (drag.knob) { working = moveDevice(original, d.id, angleFromHandle(original, d, e.pt, e.shift)); return; }
    const p = e.shift ? orthoConstrain(downPt, e.pt) : e.pt;
    // A free device keeps the grab offset so it does not jump to the pointer; a wall device follows the pointer.
    const pl = d.placement;
    const free = pl.mode === 'free';
    // Leaving the wall keeps the world direction (as the free rotation) so the cone does not jump.
    const pose = free ? null : devicePose(original, d);
    const rot = pl.mode === 'free' ? pl.rotation : pose ? ((Math.round(angleOf(pose.dir)) % 360) + 360) % 360 : 0;
    const cand = deviceCandidate(ctx, original, d.props.kind, free ? add(p, drag.grab) : p, rot);
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
      const tol = ctx.tolMm();
      // The direction handle of the selected device wins over devices and walls.
      const cur = sel?.kind === 'device' ? level.devices.find(x => x.id === sel!.id) : undefined;
      const h = cur ? directionHandle(level, cur, 10 / tol) : null; // tolMm is 10 screen px
      if (cur && h && dist(e.pt, h.to) <= tol) {
        original = working = level;
        drag = { id: cur.id, grab: { x: 0, y: 0 }, knob: true };
        return;
      }
      const id = deviceAt(level, e.pt, tol);
      if (!id) { setSel(null); return; }
      setSel({ kind: 'device', id });
      const d = level.devices.find(x => x.id === id)!;
      const pose = devicePose(level, d);
      original = working = level;
      // Only a free device keeps the grab offset; a wall device follows the pointer.
      drag = { id, grab: pose && d.placement.mode === 'free' ? sub(pose.pt, e.pt) : { x: 0, y: 0 }, knob: false };
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
