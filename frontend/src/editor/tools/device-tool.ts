import type { DeviceKind, DevicePlacement, DeviceProps, Level, Pt } from '../../model/types';
import { DEVICE_PLACEMENTS, deviceDefaults } from '../../model/types';
import { addDevice } from '../../model/devices';
import { snap } from '../../geometry/snap';
import { wallFrame } from '../../geometry/walls';
import { dot, perpLeft, sub } from '../../geometry/vec';
import { t } from '../../i18n';
import { createAimDrag } from './aim-drag';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** Side of the wall the cursor is on: left when it lies on the perpLeft side of the axis, else right. */
function sideOf(level: Level, wallId: string, cursor: Pt): 'left' | 'right' {
  const f = wallFrame(level, level.walls.find(w => w.id === wallId)!);
  return dot(sub(cursor, f.a), perpLeft(f.dir)) > 0 ? 'left' : 'right';
}

/** Grid-snapped (or whole-mm) free point. */
export function freePoint(ctx: ToolContext, p: Pt): Pt {
  const g = ctx.grid();
  if (g && g > 0) return { x: Math.round(p.x / g) * g, y: Math.round(p.y / g) * g };
  return { x: Math.round(p.x), y: Math.round(p.y) };
}

/**
 * Where a device of `kind` would go for a cursor at `cursor`: on a wall when the kind allows it and the
 * cursor snaps to a wall (or wall end), else free at the grid point when allowed, else null.
 * `rotation` is used for a free result.
 */
export function deviceCandidate(
  ctx: ToolContext, level: Level, kind: DeviceKind, cursor: Pt, rotation = 0,
): DevicePlacement | null {
  const modes = DEVICE_PLACEMENTS[kind];
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
        const tt = Math.max(0, Math.min(f.len, dot(sub(cursor, f.a), f.dir)));
        const d = Math.hypot(cursor.x - (f.a.x + f.dir.x * tt), cursor.y - (f.a.y + f.dir.y * tt));
        if (!best || d < best.d) best = { id: w.id, offset: w.a === ep.nodeId ? 0 : f.len, d };
      }
      if (best) return { mode: 'wall', wallId: best.id, side: sideOf(level, best.id, cursor), offset: best.offset };
    }
  }
  if (modes.includes('free')) return { mode: 'free', ...freePoint(ctx, cursor), rotation };
  return null;
}

/** Props for a new device: panel defaults, with the wall zone angle for a wall motion sensor. */
export function propsFor(ctx: ToolContext, kind: DeviceKind, placement: DevicePlacement): DeviceProps {
  const p = ctx.deviceDefaults(kind);
  if (placement.mode === 'wall' && p.kind === 'motion_sensor') {
    const w = deviceDefaults('motion_sensor', 'wall');
    const f = deviceDefaults('motion_sensor', 'free');
    // Only the untouched free default becomes the wall default; a user-set angle stays.
    if (w.kind === 'motion_sensor' && f.kind === 'motion_sensor' && p.zoneAngle === f.zoneAngle) return { ...p, zoneAngle: w.zoneAngle };
  }
  return p;
}

/** Device placement tool: one click places one device of `kind`. */
export function createDeviceTool(ctx: ToolContext, kind: DeviceKind): Tool {
  let cursor: Pt | null = null;
  let placedId: string | undefined; // the device this tool just placed (selected): its knob can be dragged
  const aim = createAimDrag(ctx);

  function probe(): { placement: DevicePlacement; props: DeviceProps; invalid: boolean } | null {
    if (!cursor) return null;
    const level = ctx.level();
    const placement = deviceCandidate(ctx, level, kind, cursor);
    if (!placement) {
      const fp = freePoint(ctx, cursor);
      return { placement: { mode: 'free', ...fp, rotation: 0 }, props: ctx.deviceDefaults(kind), invalid: true };
    }
    const props = propsFor(ctx, kind, placement);
    const ok = addDevice(level, props, placement, '').deviceId !== null;
    return { placement, props, invalid: !ok };
  }

  return {
    id: kind,
    down(e: ToolEvent) {
      cursor = e.pt;
      if (aim.start(placedId, e)) return;
      const pr = probe();
      if (!pr || pr.invalid) return;
      const level = ctx.level();
      const base = t(`device.${kind}`, ctx.lang());
      const used = new Set(level.devices.filter(d => d.props.kind === kind).map(d => d.name));
      let n = 1;
      while (used.has(`${base} ${n}`)) n++;
      const res = addDevice(level, pr.props, pr.placement, `${base} ${n}`);
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
