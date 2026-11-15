import { newId } from './ids';
import { DEVICE_PLACEMENTS, deviceDefaults, type Device, type DevicePlacement, type DeviceProps, type Id, type Level } from './types';
import { wallLen } from '../geometry/walls';

const EPS = 1e-6; // mm
/** Largest aim of a wall device, degrees either way. */
export const AIM_MAX = 90;

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

/** The patch never changes the kind. */
export function setDeviceProps(level: Level, id: Id, patch: Partial<DeviceProps>, name?: string): Level {
  const devices = level.devices;
  if (!devices.some(x => x.id === id)) return level;
  return withDevices(level, devices.map(x => {
    if (x.id !== id) return x;
    const props = { ...x.props, ...patch, kind: x.props.kind } as DeviceProps;
    return { ...x, props, name: name ?? x.name };
  }));
}

export function deleteDevice(level: Level, id: Id): Level {
  return withDevices(level, level.devices.filter(x => x.id !== id));
}

/** Climate sensor with zone ids that are not zones of the level: the unknown ids dropped; same object when none. */
function dropUnknownZones(level: Level, d: Device): Device {
  if (d.props.kind !== 'climate_sensor') return d;
  const ids = d.props.zoneIds.filter(id => level.zones.some(z => z.id === id));
  return ids.length === d.props.zoneIds.length ? d : { ...d, props: { ...d.props, zoneIds: ids } };
}

/** invalid = wall device whose offset is outside [0, len] of its wall (or whose wall is gone). Climate sensors lose ids of deleted zones. Never deletes or clamps. */
export function refreshDevices(level: Level): Level {
  return withDevices(level, level.devices.map(dev => {
    const d = dropUnknownZones(level, dev);
    if (d.placement.mode !== 'wall') return d.invalid ? { ...d, invalid: false } : d;
    const l = wallLen(level, d.placement.wallId);
    // l === null (wall gone) is a safety net: ops delete hosted devices with their wall.
    const invalid = l === null || d.placement.offset < -EPS || d.placement.offset > l + EPS;
    return { ...d, invalid };
  }));
}
