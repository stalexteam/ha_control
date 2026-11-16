import { newId } from './ids';
import {
  AIM_MAX, DEVICE_PLACEMENTS, defaultsMode, deviceDefaults,
  type BindingRole, type Device, type DevicePlacement, type DeviceProps, type Id, type Level, type SwitchKind,
} from './types';
import { sanitizeBindings } from './bindings';
import { wallLen } from '../geometry/walls';

const EPS = 1e-6; // mm

/** A plan placement the kind allows ('none' never: a device goes off the plan only through addUnplacedDevice). */
function allowed(props: DeviceProps, placement: DevicePlacement): boolean {
  return placement.mode !== 'none' && DEVICE_PLACEMENTS[props.kind].includes(placement.mode);
}

/** Placement is allowed for the kind and, on a wall, the centre offset lies within [0, len]. */
function fits(level: Level, props: DeviceProps, placement: DevicePlacement): boolean {
  if (placement.mode === 'none' || !allowed(props, placement)) return false;
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

/** A new equipment device that is not on the plan, with the free defaults. */
export function addUnplacedDevice(level: Level, name: string): { level: Level; id: Id } {
  const d: Device = { id: newId(), name, placement: { mode: 'none' }, props: deviceDefaults('equipment', 'free'), invalid: false };
  return { level: withDevices(level, [...level.devices, d]), id: d.id };
}

/** What an equipment device is, by what is bound: the switch is `control`, a measurement any power or voltage. */
export type DeviceRole = 'meter' | 'switch' | 'metered-switch' | 'dummy';
const MEASUREMENTS: BindingRole[] = ['power', 'power_in', 'power_out', 'voltage'];

/** The role of an equipment device (null for other kinds): see DeviceRole. */
export function deviceRole(d: Device): DeviceRole | null {
  if (d.props.kind !== 'equipment') return null;
  const b = d.bindings ?? {};
  const measures = MEASUREMENTS.some(r => !!b[r]);
  if (b.control) return measures ? 'metered-switch' : 'switch';
  return measures ? 'meter' : 'dummy';
}

/** An inverter: equipment with the inverter flag (its schematic block has PV and BAT ports). False for a missing device. */
export const isInverter = (d: Device | undefined): boolean => d?.props.kind === 'equipment' && !!d.props.inverter;

/**
 * Plan Studio may operate the device's control: equipment by its controllable flag; every other kind always (sockets,
 * lights and fans are actuators Plan Studio operates).
 */
export const isControllable = (d: Device): boolean => d.props.kind !== 'equipment' || !!d.props.controllable;

/** Equipment props with a flag set (`true`) or removed (a missing flag means false). */
function withFlag(p: Extract<DeviceProps, { kind: 'equipment' }>, flag: 'inverter' | 'controllable', on: boolean): DeviceProps {
  const next = { ...p };
  if (on) next[flag] = true;
  else delete next[flag];
  return next;
}

/**
 * Turns an equipment device's inverter flag on or off, carrying the reading over: on moves `power` to `power_out`;
 * off moves `power_out` to `power` and drops `power_in`. Same level when the flag is already so, the id is unknown or
 * the device is not equipment.
 */
export function setDeviceInverter(level: Level, id: Id, on: boolean): Level {
  const d = level.devices.find(x => x.id === id);
  if (!d || d.props.kind !== 'equipment' || !!d.props.inverter === on) return level;
  const [from, to] = on ? (['power', 'power_out'] as const) : (['power_out', 'power'] as const);
  const bindings = { ...d.bindings };
  if (bindings[from]) bindings[to] = bindings[from];
  delete bindings[from];
  // sanitizeBindings drops the roles the new flag disables (power_in when off) and an empty bindings field.
  const next = sanitizeBindings({ ...d, props: withFlag(d.props, 'inverter', on), bindings });
  return withDevices(level, level.devices.map(x => (x === d ? next : x)));
}

/** Sets an equipment device's controllable flag. Same level when it is already so, the id is unknown or not equipment. */
export function setDeviceControllable(level: Level, id: Id, on: boolean): Level {
  const d = level.devices.find(x => x.id === id);
  if (!d || d.props.kind !== 'equipment' || !!d.props.controllable === on) return level;
  const next: Device = { ...d, props: withFlag(d.props, 'controllable', on) };
  return withDevices(level, level.devices.map(x => (x === d ? next : x)));
}

/**
 * Props of a device going from placement mode `from` to `to`: a motion sensor whose zone angle is still the
 * default of `from` gets the default of `to`; a user-set angle stays. Anything else: the same object.
 */
export function retargetZoneAngle(props: DeviceProps, from: DevicePlacement['mode'], to: DevicePlacement['mode']): DeviceProps {
  if (props.kind !== 'motion_sensor' || from === to) return props;
  const old = deviceDefaults('motion_sensor', defaultsMode(from));
  const next = deviceDefaults('motion_sensor', defaultsMode(to));
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
export function changeDeviceKind(level: Level, id: Id, kind: SwitchKind): Level {
  const d = level.devices.find(x => x.id === id);
  if (!d || (d.props.kind !== 'wall_switch' && d.props.kind !== 'smart_button') || d.props.kind === kind) return level;
  const props = deviceDefaults(kind, defaultsMode(d.placement.mode));
  if (!allowed(props, d.placement)) return level;
  const next = sanitizeBindings({ ...d, props });
  return withDevices(level, level.devices.map(x => (x === d ? next : x)));
}

export function deleteDevice(level: Level, id: Id): Level {
  return withDevices(level, level.devices.filter(x => x.id !== id));
}

/**
 * invalid = wall device whose offset is outside [0, len] of its wall (or whose wall is gone). Never deletes or clamps.
 * A free device and one not on the plan are never invalid.
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
