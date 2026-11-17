import type { BindingRole, Device, DeviceKind, Id, Level, Trigger } from './types';

export interface RoleSpec {
  role: BindingRole; domains: string[]; deviceClasses?: string[]; units?: string[]; primary: boolean;
  /** Domains whose entities match only without a device class and a unit (non-measuring, e.g. Zigbee2MQTT action sensors). */
  plainDomains?: string[];
  /** Entity categories the strict filter still offers (default: none). */
  categories?: string[];
}

/** A power meter: a `sensor` of class power, or with a W / kW unit (also the Power step's power fields). */
export const POWER: RoleSpec = { role: 'power', domains: ['sensor'], deviceClasses: ['power'], units: ['W', 'kW'], primary: false };
/** A voltage meter: a `sensor` of class voltage, or with a V / kV / mV unit. */
export const VOLTAGE: RoleSpec = { role: 'voltage', domains: ['sensor'], deviceClasses: ['voltage'], units: ['V', 'kV', 'mV'], primary: false };
/** An inverter's input and output power: the Power filter. */
export const POWER_IN: RoleSpec = { ...POWER, role: 'power_in' };
export const POWER_OUT: RoleSpec = { ...POWER, role: 'power_out' };
/** The sun entity (`sun.sun`): its elevation backs the illuminance sensor's daylight state. */
export const SUN: RoleSpec = { role: 'sun', domains: ['sun'], primary: true };
/** Smart button roles whose binding is a trigger (entity, slot and event). */
const TRIGGER_ROLES = ['on', 'off', 'auto'] as const;
export type TriggerRole = typeof TRIGGER_ROLES[number];
export const isTriggerRole = (r: BindingRole): r is TriggerRole => (TRIGGER_ROLES as readonly string[]).includes(r);
/** A trigger role: events, or plain sensors. Zigbee2MQTT registers its action sensors as diagnostic, with no class and no unit. */
const trigger = (role: TriggerRole): RoleSpec => ({
  role, domains: ['event', 'sensor'], plainDomains: ['sensor'], categories: ['diagnostic'], primary: true,
});

export const ROLE_SPECS: Record<DeviceKind, RoleSpec[]> = {
  ceiling_light: [{ role: 'control', domains: ['light', 'switch'], primary: true }],
  wall_light: [{ role: 'control', domains: ['light', 'switch'], primary: true }],
  motion_sensor: [{ role: 'motion', domains: ['binary_sensor'], deviceClasses: ['occupancy', 'motion', 'presence'], primary: true }],
  illuminance_sensor: [{ role: 'illuminance', domains: ['sensor'], deviceClasses: ['illuminance'], units: ['lx'], primary: true },
    // Fallback while the lux reading is unusable; one of illuminance / sun is enough (see PRIMARY_MODE).
    SUN],
  climate_sensor: [
    { role: 'temperature', domains: ['sensor'], deviceClasses: ['temperature'], units: ['°C', '°F'], primary: true },
    { role: 'humidity', domains: ['sensor'], deviceClasses: ['humidity'], units: ['%'], primary: true },
  ],
  wall_switch: [{ role: 'state', domains: ['switch', 'light', 'binary_sensor'], primary: true }],
  valve: [{ role: 'state', domains: ['valve', 'switch'], primary: true }],
  leak_sensor: [{ role: 'leak', domains: ['binary_sensor'], deviceClasses: ['moisture'], primary: true }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [trigger('on'), trigger('off'), trigger('auto')],
  socket: [{ role: 'control', domains: ['switch'], primary: true }, POWER],
  exhaust_fan: [{ role: 'control', domains: ['switch', 'fan'], primary: true }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: 'control', domains: ['switch'], primary: false }, POWER, VOLTAGE, POWER_IN, POWER_OUT],
};

/** How many of the statuses are not `bound` (partly bound and missing count as not bound). */
export const countNotBound = (statuses: Iterable<BindStatus>): number => { let n = 0; for (const s of statuses) if (s !== 'bound') n++; return n; };

/** Kinds where one set primary is enough; all other kinds need every primary. */
export const PRIMARY_MODE: Partial<Record<DeviceKind, 'any'>> = { climate_sensor: 'any', illuminance_sensor: 'any' };

export type Presence = 'present' | 'unavailable' | 'missing' | 'unknown';
export type BindStatus = 'bound' | 'partial' | 'unbound' | 'missing';

/**
 * The roles the device uses now: all roles of its kind, except for a smart button, where `off` needs separateOff,
 * and `auto` needs autoEnabled, and for equipment, where the inverter flag swaps `power` for `power_in` and `power_out`.
 */
export function activeRoleSpecs(d: Device): RoleSpec[] {
  const p = d.props;
  const specs = ROLE_SPECS[p.kind];
  if (p.kind === 'smart_button') {
    return specs.filter(({ role: r }) => (r === 'off' ? p.separateOff : r === 'auto' ? p.autoEnabled : true));
  }
  if (p.kind === 'equipment') {
    const inverter = !!p.inverter;
    return specs.filter(({ role: r }) => (r === 'power' ? !inverter : r === 'power_in' || r === 'power_out' ? inverter : true));
  }
  return specs;
}

function validRoles(d: Device): ReadonlySet<BindingRole> {
  return new Set(activeRoleSpecs(d).map(s => s.role));
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
    // Controllable belongs to the switch: a switch bound later starts read-only.
    if (role === 'control' && d.props.kind === 'equipment' && d.props.controllable) {
      const { controllable: _drop, ...props } = d.props;
      next.props = props;
    }
    return { ...level, devices: level.devices.map(x => (x === d ? next : x)) };
  }
  if (cur === entityId) return level;
  const next: Device = { ...d, bindings: { ...d.bindings, [role]: entityId } };
  return { ...level, devices: level.devices.map(x => (x === d ? next : x)) };
}

/** A device whose roles are all optional (equipment) is bound with nothing bound: a dummy needs nothing. */
export function bindingStatus(d: Device, presence: (eid: string) => Presence): BindStatus {
  const b = d.bindings ?? {};
  const ids = Object.values(b).filter((e): e is string => !!e);
  const primaries = activeRoleSpecs(d).filter(s => s.primary);
  if (ids.length === 0) return primaries.length === 0 ? 'bound' : 'unbound';
  if (ids.some(e => presence(e) === 'missing')) return 'missing';
  const set = primaries.filter(s => !!b[s.role]);
  const ok = PRIMARY_MODE[d.props.kind] === 'any' ? set.length > 0 : set.length === primaries.length;
  return ok ? 'bound' : 'partial';
}

export function roleCount(d: Device): { filled: number; total: number } {
  const specs = activeRoleSpecs(d);
  return { filled: specs.filter(s => !!d.bindings?.[s.role]).length, total: specs.length };
}

/** The action value a trigger waits for, as the integration compares it: slot 0 -> `event`, slot N -> `N_event`. */
export const expectedValue = (t: Trigger): string => (t.slot === 0 ? t.event : `${t.slot}_${t.event}`);

/**
 * What a binding listens to: the entity id; for a smart button trigger, `${entity}|${expected value}` (so slot 0 with
 * event `1_single` equals slot 1 with `single`). Null when unbound.
 */
export function bindingKey(d: Device, role: BindingRole): string | null {
  const eid = d.bindings?.[role];
  if (!eid) return null;
  const p = d.props;
  if (p.kind !== 'smart_button' || !isTriggerRole(role)) return eid;
  return `${eid}|${expectedValue(p[role])}`;
}

/**
 * The other devices with an active binding equal to this role's binding key. Trigger-aware: two buttons
 * (slots) or two events of one physical switch are not shared.
 */
export function alsoBoundTo(level: Level, d: Device, role: BindingRole): Device[] {
  const key = bindingKey(d, role);
  if (key === null) return [];
  return level.devices.filter(o => o.id !== d.id && activeRoleSpecs(o).some(s => bindingKey(o, s.role) === key));
}

/** Active trigger roles of a smart button whose trigger equals an earlier active one (on, off, auto: the first wins). */
export function duplicateTriggers(d: Device): BindingRole[] {
  const seen = new Set<string>();
  const dup: BindingRole[] = [];
  for (const { role } of activeRoleSpecs(d)) {
    const key = isTriggerRole(role) ? bindingKey(d, role) : null;
    if (key === null) continue;
    if (seen.has(key)) dup.push(role);
    else seen.add(key);
  }
  return dup;
}

/** Drops roles not active for the device (see activeRoleSpecs) and empty strings; removes the field when empty. Same object when nothing changes. */
export function sanitizeBindings(d: Device): Device {
  if (!d.bindings) return d;
  const ok = validRoles(d);
  const entries = Object.entries(d.bindings).filter(([r, e]) => ok.has(r as BindingRole) && !!e);
  if (entries.length > 0 && entries.length === Object.keys(d.bindings).length) return d;
  const next: Device = { ...d };
  if (entries.length) next.bindings = Object.fromEntries(entries);
  else delete next.bindings;
  return next;
}
