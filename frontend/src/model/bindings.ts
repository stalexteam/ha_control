import type { BindingRole, Device, DeviceKind, Id, Level } from './types';

export interface RoleSpec { role: BindingRole; domains: string[]; deviceClasses?: string[]; units?: string[]; primary: boolean }

const POWER: RoleSpec = { role: 'power', domains: ['sensor'], deviceClasses: ['power'], units: ['W', 'kW'], primary: false };

export const ROLE_SPECS: Record<DeviceKind, RoleSpec[]> = {
  ceiling_light: [{ role: 'control', domains: ['light', 'switch'], primary: true }],
  wall_light: [{ role: 'control', domains: ['light', 'switch'], primary: true }],
  motion_sensor: [{ role: 'motion', domains: ['binary_sensor'], deviceClasses: ['occupancy', 'motion', 'presence'], primary: true }],
  illuminance_sensor: [{ role: 'illuminance', domains: ['sensor'], deviceClasses: ['illuminance'], units: ['lx'], primary: true }],
  climate_sensor: [
    { role: 'temperature', domains: ['sensor'], deviceClasses: ['temperature'], units: ['°C', '°F'], primary: true },
    { role: 'humidity', domains: ['sensor'], deviceClasses: ['humidity'], units: ['%'], primary: true },
  ],
  switch: [
    { role: 'action', domains: ['event', 'sensor'], primary: true },
    { role: 'state', domains: ['switch', 'light', 'binary_sensor'], primary: false },
  ],
  socket: [{ role: 'control', domains: ['switch'], primary: true }, POWER],
  exhaust_fan: [{ role: 'control', domains: ['switch', 'fan'], primary: true }],
  equipment: [{ role: 'control', domains: ['switch'], primary: true }, POWER],
};

/** Kinds where one set primary is enough; all other kinds need every primary. */
export const PRIMARY_MODE: Partial<Record<DeviceKind, 'any'>> = { climate_sensor: 'any' };

export type Presence = 'present' | 'unavailable' | 'missing' | 'unknown';
export type BindStatus = 'bound' | 'partial' | 'unbound' | 'missing';

function validRoles(d: Device): ReadonlySet<BindingRole> {
  return new Set(ROLE_SPECS[d.props.kind].map(s => s.role));
}

export function setBinding(level: Level, deviceId: Id, role: BindingRole, entityId: string | null): Level {
  const d = level.devices.find(x => x.id === deviceId);
  if (!d || !validRoles(d).has(role)) return level;
  const cur = d.bindings?.[role];
  if (entityId === null || entityId === '') {
    if (cur === undefined) return level;
    const rest = { ...d.bindings };
    delete rest[role];
    const next: Device = { ...d, bindings: rest };
    if (Object.keys(rest).length === 0) delete next.bindings;
    return { ...level, devices: level.devices.map(x => (x === d ? next : x)) };
  }
  if (cur === entityId) return level;
  const next: Device = { ...d, bindings: { ...d.bindings, [role]: entityId } };
  return { ...level, devices: level.devices.map(x => (x === d ? next : x)) };
}

export function bindingStatus(d: Device, presence: (eid: string) => Presence): BindStatus {
  const b = d.bindings ?? {};
  const ids = Object.values(b).filter((e): e is string => !!e);
  if (ids.length === 0) return 'unbound';
  if (ids.some(e => presence(e) === 'missing')) return 'missing';
  const primaries = ROLE_SPECS[d.props.kind].filter(s => s.primary);
  const set = primaries.filter(s => !!b[s.role]);
  const ok = PRIMARY_MODE[d.props.kind] === 'any' ? set.length > 0 : set.length === primaries.length;
  return ok ? 'bound' : 'partial';
}

export function roleCount(d: Device): { filled: number; total: number } {
  const specs = ROLE_SPECS[d.props.kind];
  return { filled: specs.filter(s => !!d.bindings?.[s.role]).length, total: specs.length };
}

export function alsoBoundTo(level: Level, entityId: string, exceptDeviceId: Id): Device[] {
  return level.devices.filter(d => d.id !== exceptDeviceId && Object.values(d.bindings ?? {}).includes(entityId));
}

/** Drops roles invalid for the kind and empty strings; removes the field when empty. Same object when nothing changes. */
export function sanitizeBindings(d: Device): Device {
  if (!d.bindings) return d;
  const ok = validRoles(d);
  const entries = Object.entries(d.bindings).filter(([r, e]) => ok.has(r as BindingRole) && !!e);
  if (entries.length === Object.keys(d.bindings).length) return d;
  const next: Device = { ...d };
  if (entries.length) next.bindings = Object.fromEntries(entries);
  else delete next.bindings;
  return next;
}
