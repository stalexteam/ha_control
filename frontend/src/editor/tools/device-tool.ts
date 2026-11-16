import type { Device, DeviceKind, DevicePlacement, DeviceProps, Level, Pt } from '../../model/types';
import { DEVICE_PLACEMENTS } from '../../model/types';
import { addDevice, retargetZoneAngle } from '../../model/devices';
import { nextFreeName } from '../../model/ids';
import { snap } from '../../geometry/snap';
import { angleOf, devicePose, facePoint, fitWallMount, wrap360 } from '../../geometry/devices';
import { dist } from '../../geometry/vec';
import { wallFrame, wallLocal } from '../../geometry/walls';
import { t } from '../../i18n';
import { createAimDrag } from './aim-drag';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** Side of the wall the cursor is on: left when it lies on the perpLeft side of the axis, else right. */
function sideOf(level: Level, wallId: string, cursor: Pt): 'left' | 'right' {
  const f = wallFrame(level, level.walls.find(w => w.id === wallId)!);
  return wallLocal(f, cursor).side > 0 ? 'left' : 'right';
}

/** Grid-snapped (or whole-mm) free point. */
export function freePoint(ctx: ToolContext, p: Pt): Pt {
  const g = ctx.grid();
  if (g && g > 0) return { x: Math.round(p.x / g) * g, y: Math.round(p.y / g) * g };
  return { x: Math.round(p.x), y: Math.round(p.y) };
}

/**
 * The placement modes a placed or dragged device of `kind` may take: equipment keeps `mode` (a wall mount is chosen,
 * not snapped to; a new one follows the Device tool's Wall mount), any other kind every mode of DEVICE_PLACEMENTS.
 */
export function candidateModes(kind: DeviceKind, mode: 'wall' | 'free' = 'free'): readonly ('wall' | 'free')[] {
  return kind === 'equipment' ? [mode] : DEVICE_PLACEMENTS[kind];
}

/**
 * Where a device of `kind` would go for a cursor at `cursor`: on a wall when `modes` allow it and the
 * cursor snaps to a wall (or wall end), else free at the grid point when allowed, else null.
 * `rotation` is used for a free result.
 */
export function deviceCandidate(
  ctx: ToolContext, level: Level, kind: DeviceKind, cursor: Pt, rotation = 0, modes = candidateModes(kind),
): DevicePlacement | null {
  if (modes.includes('wall')) {
    const s = snap(level, cursor, { tolMm: ctx.tolMm(), grid: ctx.grid(), ortho: false });
    const ep = s.endpoint;
    if ((s.kind === 'wall' || s.kind === 'mid') && ep.kind === 'wall') {
      return { mode: 'wall', wallId: ep.wallId, side: sideOf(level, ep.wallId, cursor), offset: ep.offset };
    }
    if (s.kind === 'node' && ep.kind === 'node') {
      // Wall end: host on the nearest attached wall at offset 0 / len.
      let best: { id: string; offset: number; d: number } | null = null;
      for (const w of level.walls) {
        if (w.a !== ep.nodeId && w.b !== ep.nodeId) continue;
        const f = wallFrame(level, w);
        const tt = Math.max(0, Math.min(f.len, wallLocal(f, cursor).t));
        const d = Math.hypot(cursor.x - (f.a.x + f.dir.x * tt), cursor.y - (f.a.y + f.dir.y * tt));
        if (!best || d < best.d) best = { id: w.id, offset: w.a === ep.nodeId ? 0 : f.len, d };
      }
      if (best) return { mode: 'wall', wallId: best.id, side: sideOf(level, best.id, cursor), offset: best.offset };
    }
  }
  if (modes.includes('free')) return { mode: 'free', ...freePoint(ctx, cursor), rotation };
  return null;
}

/**
 * The placement the Wall mount checkbox gives a placed device. On: the wall face nearest to its centre (any distance,
 * not only within the pick tolerance), at the centre's position along that wall clamped to the wall, on the centre's
 * side, as the select tool hosts a wall device. Off: free where it is drawn, rotated to the wall tangent, so the body
 * does not move. Null when the device is not on the plan or has no wall to go to.
 */
export function wallMountPlacement(level: Level, d: Device, on: boolean): DevicePlacement | null {
  const pose = devicePose(level, d);
  if (!pose) return null;
  if (!on) {
    const rotation = wrap360(Math.round(angleOf(pose.dir)));
    return { mode: 'free', x: Math.round(pose.pt.x), y: Math.round(pose.pt.y), rotation };
  }
  let best: { placement: DevicePlacement; d: number } | null = null;
  for (const w of level.walls) {
    let f;
    try { f = wallFrame(level, w); } catch { continue; } // a node is missing
    if (f.len <= 1e-9) continue;
    const loc = wallLocal(f, pose.pt);
    const side = loc.side > 0 ? 'left' : 'right';
    const offset = Math.min(f.len, Math.max(0, Math.round(loc.t)));
    const face = facePoint(level, w.id, side, offset);
    const gap = face ? dist(face, pose.pt) : Infinity;
    if (!best || gap < best.d) best = { placement: { mode: 'wall', wallId: w.id, side, offset }, d: gap };
  }
  return best && best.d < Infinity ? fitWallMount(level, d.props, best.placement, 0) : null;
}

/**
 * Props for a new device: panel defaults (free mode), with the wall zone angle for a wall motion sensor.
 * Only the untouched free default becomes the wall default; a user-set angle stays.
 */
export function propsFor(ctx: ToolContext, kind: DeviceKind, placement: DevicePlacement): DeviceProps {
  return retargetZoneAngle(ctx.deviceDefaults(kind), 'free', placement.mode);
}

/** Device placement tool: one click places one device of `kind`. */
export function createDeviceTool(ctx: ToolContext, kind: DeviceKind): Tool {
  let cursor: Pt | null = null;
  let placedId: string | undefined; // the device this tool just placed (selected): its knob can be dragged
  const aim = createAimDrag(ctx);

  function probe(): { placement: DevicePlacement; props: DeviceProps; invalid: boolean } | null {
    if (!cursor) return null;
    const level = ctx.level();
    const modes = candidateModes(kind, ctx.wallMount() ? 'wall' : 'free');
    const placement = deviceCandidate(ctx, level, kind, cursor, 0, modes);
    if (!placement) {
      const fp = freePoint(ctx, cursor);
      return { placement: { mode: 'free', ...fp, rotation: 0 }, props: ctx.deviceDefaults(kind), invalid: true };
    }
    const props = propsFor(ctx, kind, placement);
    const fitted = fitWallMount(level, props, placement, ctx.tolMm());
    const ok = addDevice(level, props, fitted, '').deviceId !== null;
    return { placement: fitted, props, invalid: !ok };
  }

  return {
    id: kind,
    down(e: ToolEvent) {
      cursor = e.pt;
      if (aim.start(placedId, e)) return;
      const pr = probe();
      if (!pr || pr.invalid) return;
      const level = ctx.level();
      const name = nextFreeName(t(`device.${kind}`), level.devices.filter(d => d.props.kind === kind).map(d => d.name));
      const res = addDevice(level, pr.props, pr.placement, name);
      if (res.deviceId === null) return;
      ctx.commit(res.level);
      placedId = res.deviceId;
      ctx.select({ kind: 'device', id: res.deviceId });
    },
    move(e: ToolEvent) { cursor = e.pt; if (aim.active()) aim.move(e); },
    up(e: ToolEvent) { aim.end(e); },
    key(key: string) { return key === 'Escape' && aim.cancel(); },
    preview(): Preview {
      const w = aim.working();
      if (aim.active()) return w ? { level: w } : {};
      const pr = probe();
      return pr ? { device: pr } : {};
    },
    cancel() { aim.cancel(); cursor = null; placedId = undefined; },
  };
}
