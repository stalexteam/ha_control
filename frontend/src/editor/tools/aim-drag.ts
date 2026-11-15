import type { Id, Level, Pt } from '../../model/types';
import { moveDevice } from '../../model/devices';
import { angleFromHandle, angleOf, devicePose, directionHandle } from '../../geometry/devices';
import { dist, sub } from '../../geometry/vec';
import type { ToolContext, ToolEvent } from './types';

/** Drag of the direction handle (knob) of one device. One commit on `up`, only when the placement changed. */
export interface AimDrag {
  /** Starts a drag when `e` hits the knob of device `id`; returns false (nothing started) otherwise. */
  start(id: Id | undefined, e: ToolEvent): boolean;
  move(e: ToolEvent): void;
  /** Ends the drag; commits when the placement changed. Returns true when a drag was active. */
  end(e: ToolEvent): boolean;
  /** Aborts without committing. Returns true when a drag was active. */
  cancel(): boolean;
  active(): boolean;
  /** Working level for the live preview, or null when idle or nothing moved yet. */
  working(): Level | null;
}

const placementOf = (l: Level, id: Id) => JSON.stringify(l.devices.find(d => d.id === id)?.placement);

export function createAimDrag(ctx: ToolContext): AimDrag {
  let st: { id: Id; original: Level; work: Level; downPt: Pt; offset: number; moved: boolean } | null = null;

  // Angle of the pointer minus the current angle of the device, so a press off the knob centre does not jump.
  const offsetAt = (level: Level, id: Id, p: Pt): number => {
    const d = level.devices.find(x => x.id === id);
    const pose = d ? devicePose(level, d) : null;
    const h = d ? directionHandle(level, d, 10 / ctx.tolMm()) : null;
    if (!pose || !h) return 0;
    const diff = (a: number, b: number) => ((((a - b) % 360) + 540) % 360) - 180;
    return diff(angleOf(sub(p, pose.pt)), angleOf(sub(h.to, pose.pt)));
  };

  function update(e: ToolEvent): void {
    if (!st) return;
    // Pointer jitter (under 3 screen px; tolMm is 10 px) is a click, not a drag.
    if (!st.moved && dist(e.pt, st.downPt) <= ctx.tolMm() * 0.3) return;
    st.moved = true;
    const d = st.original.devices.find(x => x.id === st!.id);
    const pose = d ? devicePose(st.original, d) : null;
    if (!d || !pose) return;
    // Shift the pointer around the device by the grab offset, keeping its distance.
    const r = dist(e.pt, pose.pt);
    const a = (angleOf(sub(e.pt, pose.pt)) - st.offset) * Math.PI / 180;
    const p = r === 0 ? e.pt : { x: pose.pt.x + Math.cos(a) * r, y: pose.pt.y - Math.sin(a) * r };
    const next = angleFromHandle(st.original, d, p, e.shift);
    st.work = JSON.stringify(next) === JSON.stringify(d.placement) ? st.original : moveDevice(st.original, d.id, next);
  }

  return {
    start(id, e) {
      st = null;
      if (!id) return false;
      const level = ctx.level();
      const d = level.devices.find(x => x.id === id);
      const h = d ? directionHandle(level, d, 10 / ctx.tolMm()) : null;
      if (!d || !h || dist(e.pt, h.to) > ctx.tolMm()) return false;
      st = { id, original: level, work: level, downPt: e.pt, offset: offsetAt(level, id, e.pt), moved: false };
      return true;
    },
    move: update,
    end(e) {
      if (!st) return false;
      update(e);
      const s = st;
      st = null;
      if (s.moved && s.work !== s.original && placementOf(s.work, s.id) !== placementOf(s.original, s.id)) ctx.commit(s.work);
      return true;
    },
    cancel() { const was = st !== null; st = null; return was; },
    active: () => st !== null,
    working: () => (st ? st.work : null),
  };
}
