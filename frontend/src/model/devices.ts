import { newId } from './ids';
import { DEVICE_PLACEMENTS, deviceDefaults, type Device, type DevicePlacement, type DeviceProps, type Id, type Level } from './types';
import { dist, norm, projectT, add, scale, sub } from '../geometry/vec';

const EPS = 1e-6; // mm
/** Largest aim of a wall device, degrees either way. */
export const AIM_MAX = 80;

/** Axis length of a wall, or null when the wall (or a node) is missing. */
function wallLen(level: Level, wallId: Id): number | null {
  const w = level.walls.find(x => x.id === wallId);
  if (!w) return null;
  const a = level.nodes.find(n => n.id === w.a);
  const b = level.nodes.find(n => n.id === w.b);
  if (!a || !b) return null;
  return dist(a, b);
}

function allowed(props: DeviceProps, placement: DevicePlacement): boolean {
  return DEVICE_PLACEMENTS[props.kind].includes(placement.mode);
}

/** Placement is allowed for the kind and, on a wall, the centre offset lies within [0, len]. */
function fits(level: Level, props: DeviceProps, placement: DevicePlacement): boolean {
  if (!allowed(props, placement)) return false;
  if (placement.mode === 'free') return true;
  const aim = placement.aim;
  if (aim !== undefined && (!Number.isInteger(aim) || aim < -AIM_MAX || aim > AIM_MAX)) return false;
  const l = wallLen(level, placement.wallId);
  return l !== null && placement.offset >= -EPS && placement.offset <= l + EPS;
}

function withDevices(level: Level, devices: Device[]): Level {
  return { ...level, devices };
}

export function addDevice(
  level: Level, props: DeviceProps, placement: DevicePlacement, name: string,
): { level: Level; deviceId: Id | null } {
  if (!fits(level, props, placement)) return { level, deviceId: null };
  const d: Device = { id: newId(), name, placement, props, invalid: false };
  return { level: withDevices(level, [...(level.devices ?? []), d]), deviceId: d.id };
}

/** Rejected (same level returned) when the placement is not allowed for the kind or a wall offset is outside the wall. */
export function moveDevice(level: Level, id: Id, placement: DevicePlacement): Level {
  const devices = level.devices ?? [];
  const d = devices.find(x => x.id === id);
  if (!d || !fits(level, d.props, placement)) return level;
  let props = d.props;
  if (props.kind === 'motion_sensor' && placement.mode !== d.placement.mode) {
    const old = deviceDefaults('motion_sensor', d.placement.mode);
    const next = deviceDefaults('motion_sensor', placement.mode);
    if (old.kind === 'motion_sensor' && next.kind === 'motion_sensor' && props.zoneAngle === old.zoneAngle) {
      props = { ...props, zoneAngle: next.zoneAngle };
    }
  }
  return refreshDevices(withDevices(level, devices.map(x => (x.id === id ? { ...x, placement, props } : x))));
}

/** The patch never changes the kind. */
export function setDeviceProps(level: Level, id: Id, patch: Partial<DeviceProps>, name?: string): Level {
  const devices = level.devices ?? [];
  if (!devices.some(x => x.id === id)) return level;
  return withDevices(level, devices.map(x => {
    if (x.id !== id) return x;
    const props = { ...x.props, ...patch, kind: x.props.kind } as DeviceProps;
    return { ...x, props, name: name ?? x.name };
  }));
}

export function deleteDevice(level: Level, id: Id): Level {
  return withDevices(level, (level.devices ?? []).filter(x => x.id !== id));
}

/** invalid = wall device whose offset is outside [0, len] of its wall (or whose wall is gone). Never deletes or clamps. */
export function refreshDevices(level: Level): Level {
  return withDevices(level, (level.devices ?? []).map(d => {
    if (d.placement.mode !== 'wall') return d.invalid ? { ...d, invalid: false } : d;
    const l = wallLen(level, d.placement.wallId);
    // l === null (wall gone) is a safety net: ops delete hosted devices with their wall.
    const invalid = l === null || d.placement.offset < -EPS || d.placement.offset > l + EPS;
    return { ...d, invalid };
  }));
}

/** Mutating on `out`: walls whose node A moved keep their devices at the same world position. */
export function reanchorDevices(before: Level, out: Level): void {
  if (!out.devices) return;
  for (const w of out.walls) {
    const oldW = before.walls.find(x => x.id === w.id);
    if (!oldW || oldW.a !== w.a) continue;
    const oa = before.nodes.find(n => n.id === oldW.a), ob = before.nodes.find(n => n.id === oldW.b);
    const na = out.nodes.find(n => n.id === w.a), nb = out.nodes.find(n => n.id === w.b);
    if (!oa || !ob || !na || !nb) continue;
    if (oa.x === na.x && oa.y === na.y) continue;
    const nl = dist(na, nb);
    if (nl === 0) continue;
    const odir = norm(sub(ob, oa));
    for (const d of out.devices) {
      if (d.placement.mode !== 'wall' || d.placement.wallId !== w.id) continue;
      d.placement.offset = projectT(add(oa, scale(odir, d.placement.offset)), na, nb) * nl;
    }
  }
}
