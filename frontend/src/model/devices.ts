import { newId } from './ids';
import {
  AIM_MAX, DEVICE_PLACEMENTS, deviceDefaults, isContainerKind,
  type ContainerKind, type Device, type DevicePlacement, type DeviceProps, type Id, type Level,
} from './types';
import { sanitizeBindings } from './bindings';
import { wallLen } from '../geometry/walls';

const EPS = 1e-6; // mm

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
  return { level: withDevices(level, [...level.devices, d]), deviceId: d.id };
}

/**
 * Props of a device going from placement mode `from` to `to`: a motion sensor whose zone angle is still the
 * default of `from` gets the default of `to`; a user-set angle stays. Anything else: the same object.
 */
export function retargetZoneAngle(props: DeviceProps, from: DevicePlacement['mode'], to: DevicePlacement['mode']): DeviceProps {
  if (props.kind !== 'motion_sensor' || from === to) return props;
  const old = deviceDefaults('motion_sensor', from);
  const next = deviceDefaults('motion_sensor', to);
  if (old.kind === 'motion_sensor' && next.kind === 'motion_sensor' && props.zoneAngle === old.zoneAngle) {
    return { ...props, zoneAngle: next.zoneAngle };
  }
  return props;
}

/** Rejected (same level returned) when the placement is not allowed for the kind or a wall offset is outside the wall. */
export function moveDevice(level: Level, id: Id, placement: DevicePlacement): Level {
  const devices = level.devices;
  const d = devices.find(x => x.id === id);
  if (!d || !fits(level, d.props, placement)) return level;
  const props = retargetZoneAngle(d.props, d.placement.mode, placement.mode);
  return refreshDevices(withDevices(level, devices.map(x => (x.id === id ? { ...x, placement, props } : x))));
}

/**
 * The patch never changes the kind. Bindings of roles the new props disable (a smart button's off and auto)
 * are dropped.
 */
export function setDeviceProps(level: Level, id: Id, patch: Partial<DeviceProps>, name?: string): Level {
  const devices = level.devices;
  if (!devices.some(x => x.id === id)) return level;
  return withDevices(level, devices.map(x => {
    if (x.id !== id) return x;
    const props = { ...x.props, ...patch, kind: x.props.kind } as DeviceProps;
    return sanitizeBindings({ ...x, props, name: name ?? x.name });
  }));
}

/**
 * Turns an input container into the other container kind: id, name and placement stay, props reset to the
 * new kind's defaults, and bindings the new kind does not have are dropped. Same level when refused: unknown
 * id, not a container, the same kind, or a placement the new kind does not allow (a free smart button).
 */
export function changeDeviceKind(level: Level, id: Id, kind: ContainerKind): Level {
  const d = level.devices.find(x => x.id === id);
  if (!d || !isContainerKind(d.props.kind) || d.props.kind === kind) return level;
  const props = deviceDefaults(kind, d.placement.mode);
  if (!allowed(props, d.placement)) return level;
  const next = sanitizeBindings({ ...d, props });
  return withDevices(level, level.devices.map(x => (x === d ? next : x)));
}

export function deleteDevice(level: Level, id: Id): Level {
  return withDevices(level, level.devices.filter(x => x.id !== id));
}

/**
 * invalid = wall device whose offset is outside [0, len] of its wall (or whose wall is gone). Never deletes or clamps.
 * An unchanged device keeps its object (the renderer caches cones on it).
 */
export function refreshDevices(level: Level): Level {
  return withDevices(level, level.devices.map(d => {
    if (d.placement.mode !== 'wall') return d.invalid ? { ...d, invalid: false } : d;
    const l = wallLen(level, d.placement.wallId);
    // l === null (wall gone) is a safety net: ops delete hosted devices with their wall.
    const invalid = l === null || d.placement.offset < -EPS || d.placement.offset > l + EPS;
    return d.invalid === invalid ? d : { ...d, invalid };
  }));
}
