import { newId } from './ids';
import { sanitizeBindings } from './bindings';

export type Id = string;

export interface Pt { x: number; y: number }

export type WallType = 'bearing' | 'partition' | 'railing' | 'fence';
/** left = the left face when looking from A to B */
export type Baseline = 'center' | 'left' | 'right';

export interface PlanNode {
  id: Id;
  x: number;
  y: number;
  host?: { wallId: Id; offset: number };
}

export interface Wall {
  id: Id;
  a: Id;
  b: Id;
  thickness: number;
  type: WallType;
  baseline: Baseline;
}

export type OpeningKind = 'opening' | 'door' | 'window' | 'gate' | 'wicket';
export type Side = 'left' | 'right';

export interface Opening {
  id: Id;
  wallId: Id;
  kind: OpeningKind;
  offset: number;
  width: number;
  hinge?: 'start' | 'end';
  swing?: Side;
  outside?: Side;
  invalid: boolean;
}

export interface Zone {
  id: Id;
  name: string;
  seed: Pt;
  outline: Pt[];
  broken: boolean;
}

/** Live output of an input container (computed by the integration). */
export type ContainerOutput = 'on' | 'off' | 'auto' | 'error';
/** A smart button trigger: slot 0..9 (0 = a one-button device) and a non-empty event (`single`, `double`, `hold` or free text). */
export interface Trigger { slot: number; event: string }
/** Input containers: kinds with a live output. */
export type ContainerKind = 'wall_switch' | 'smart_button';
/** True for the input-container kinds. */
export const isContainerKind = (kind: DeviceKind): kind is ContainerKind => kind === 'wall_switch' || kind === 'smart_button';
export type DeviceKind = 'ceiling_light' | 'wall_light' | 'motion_sensor' | 'illuminance_sensor' | ContainerKind | 'socket' | 'equipment' | 'climate_sensor' | 'exhaust_fan';
export type DevicePlacement =
  | { mode: 'wall'; wallId: Id; side: Side; offset: number; aim?: number } // offset: along axis from node A to device centre; aim: degrees off the face normal, counter-clockwise on screen, integer -90..90 (default 0)
  | { mode: 'free'; x: number; y: number; rotation: number }; // rotation in degrees
export const FAN_DIAMETERS = [100, 125, 150] as const;
export type FanDiameter = typeof FAN_DIAMETERS[number];
export type DeviceProps =
  | { kind: 'ceiling_light'; shape: 'round' | 'linear' | 'spot'; diameter: number; length: number; width: number; poolRadius: number | null }
  | { kind: 'wall_light'; coneAngle: number; coneRange: number }
  | { kind: 'motion_sensor'; zoneAngle: number; zoneRange: number }
  | { kind: 'climate_sensor'; zoneIds: Id[] } // zoneIds: rooms the reading applies to; empty = the room containing the device (derived by geometry)
  | { kind: 'exhaust_fan'; diameter: FanDiameter }
  | { kind: 'illuminance_sensor' } | { kind: 'socket' }
  | { kind: 'equipment'; shape: 'rect' | 'circle'; width: number; depth: number; diameter: number;
      icon: string; label: string }
  // windowSec: whole seconds 1..10, used only with autoByDoubleToggle.
  | { kind: 'wall_switch'; autoByDoubleToggle: boolean; windowSec: number; defaultOutput: ContainerOutput }
  // off is used only with separateOff (otherwise the on trigger toggles); auto only with autoEnabled.
  | { kind: 'smart_button'; separateOff: boolean; autoEnabled: boolean; on: Trigger; off: Trigger; auto: Trigger;
      defaultOutput: ContainerOutput };

/** Equipment icon default (an MDI name). */
export const DEFAULT_EQUIPMENT_ICON = 'mdi:cube-outline';

/** Events offered for a trigger; any other non-empty text is accepted too. */
export const TRIGGER_EVENTS = ['single', 'double', 'hold'] as const;

/** Default outputs a container may have: `auto` only with auto enabled. Empty for kinds that are not containers. */
export function allowedOutputs(p: DeviceProps): ContainerOutput[] {
  const auto = p.kind === 'wall_switch' ? p.autoByDoubleToggle : p.kind === 'smart_button' ? p.autoEnabled : null;
  if (auto === null) return [];
  return auto ? ['off', 'on', 'auto', 'error'] : ['off', 'on', 'error'];
}

/** A container default output that is not allowed (`auto` with auto disabled, or unknown) reads as `off`. Same props otherwise. */
export function normalizeDefaultOutput(p: DeviceProps): DeviceProps {
  if (p.kind !== 'wall_switch' && p.kind !== 'smart_button') return p;
  return allowedOutputs(p).includes(p.defaultOutput) ? p : { ...p, defaultOutput: 'off' };
}

export type BindingRole = 'control' | 'motion' | 'illuminance' | 'temperature' | 'humidity' | 'state' | 'power'
  | 'on' | 'off' | 'auto' | 'final';

export interface Device { id: Id; name: string; placement: DevicePlacement; props: DeviceProps; invalid: boolean; bindings?: Partial<Record<BindingRole, string>> }

export interface Level {
  id: Id;
  name: string;
  kind: 'floor' | 'site';
  order: number;
  nodes: PlanNode[];
  walls: Wall[];
  openings: Opening[];
  zones: Zone[];
  devices: Device[];
}

export interface Plan {
  id: Id;
  name: string;
  schemaVersion: 1;
  revision: number;
  levels: Level[];
}

export const WALL_PRESETS: Record<WallType, number> = {
  bearing: 400,
  partition: 100,
  railing: 100,
  fence: 50,
};

export const OPENING_DEFAULT_WIDTH: Record<OpeningKind, number> = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3000,
  wicket: 1000,
};

export function emptyLevel(id: string = newId(), name = 'Level 1'): Level {
  return { id, name, kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}

export function emptyPlan(name: string): Plan {
  return {
    id: newId(),
    name,
    schemaVersion: 1,
    revision: 0,
    levels: [emptyLevel()],
  };
}

export const DEVICE_PLACEMENTS: Record<DeviceKind, ('wall' | 'free')[]> = {
  ceiling_light: ['free'],
  wall_light: ['wall', 'free'],
  motion_sensor: ['free', 'wall'],
  illuminance_sensor: ['free', 'wall'],
  wall_switch: ['wall'],
  smart_button: ['wall', 'free'],
  socket: ['wall'],
  equipment: ['free'],
  climate_sensor: ['free', 'wall'],
  exhaust_fan: ['wall'],
};

/** Largest aim of a wall device, degrees either way. */
export const AIM_MAX = 90;
/** Kinds with a direction handle; on a wall their direction is the aim off the face normal. */
export const AIM_KINDS: ReadonlySet<DeviceKind> = new Set<DeviceKind>(['wall_light', 'motion_sensor', 'illuminance_sensor']);

export function deviceDefaults(kind: DeviceKind, mode: 'wall' | 'free'): DeviceProps {
  switch (kind) {
    case 'ceiling_light':
      return { kind, shape: 'round', diameter: 300, length: 1200, width: 100, poolRadius: null };
    case 'wall_light':
      return { kind, coneAngle: 90, coneRange: 2000 };
    case 'motion_sensor':
      return { kind, zoneAngle: mode === 'free' ? 360 : 110, zoneRange: 5000 };
    case 'climate_sensor':
      return { kind, zoneIds: [] };
    case 'exhaust_fan':
      return { kind, diameter: 100 };
    case 'equipment':
      return { kind, shape: 'rect', width: 600, depth: 600, diameter: 600, icon: DEFAULT_EQUIPMENT_ICON, label: '' };
    case 'wall_switch':
      return { kind, autoByDoubleToggle: false, windowSec: 3, defaultOutput: 'off' };
    case 'smart_button':
      return {
        kind, separateOff: false, autoEnabled: false,
        on: { slot: 0, event: 'single' }, off: { slot: 0, event: 'hold' }, auto: { slot: 0, event: 'double' },
        defaultOutput: 'off',
      };
    default:
      return { kind };
  }
}

/** Legacy equipment `symbol` -> MDI icon (stage 2a plans). */
const LEGACY_SYMBOL_ICON: Record<string, string> = {
  boiler: 'mdi:water-boiler', pc: 'mdi:desktop-tower', automation: 'mdi:server', other: DEFAULT_EQUIPMENT_ICON,
};

/** Replaces a legacy `symbol` by `icon` (a missing icon gets the default); returns the same device when there is nothing to migrate. */
function migrateEquipment(d: Device): Device {
  const p = d.props as Record<string, unknown>;
  if (p.kind !== 'equipment' || (!('symbol' in p) && typeof p.icon === 'string')) return d;
  const { symbol, ...rest } = p;
  const icon = typeof p.icon === 'string' ? p.icon : LEGACY_SYMBOL_ICON[String(symbol)] ?? DEFAULT_EQUIPMENT_ICON;
  return { ...d, props: { ...rest, icon } as DeviceProps };
}

/**
 * Legacy `switch` (stage 3) -> an input container with default props: a smart button when it had an `action`
 * binding (that entity moves to `on`; the `state` binding is dropped), otherwise a wall switch (its `state`
 * binding stays). Id, name and placement are kept. Returns the same device for any other kind.
 */
function migrateSwitch(d: Device): Device {
  if ((d.props as { kind: string }).kind !== 'switch') return d;
  const action = (d.bindings as Record<string, string | undefined> | undefined)?.action;
  if (action) return { ...d, props: deviceDefaults('smart_button', d.placement.mode), bindings: { on: action } };
  // Roles a wall switch does not have (`action: ''` and the like) are dropped by sanitizeBindings.
  return { ...d, props: deviceDefaults('wall_switch', d.placement.mode) };
}

const isWhole = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;

/** A stored trigger with a missing or invalid slot (not 0..9) or event (not a non-empty string) takes the default there. */
function completeTrigger(v: unknown, def: Trigger): unknown {
  const t = (v !== null && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const slot = isWhole(t.slot, 0, 9) ? t.slot : def.slot;
  const event = typeof t.event === 'string' && t.event ? t.event : def.event;
  return slot === t.slot && event === t.event ? v : { slot, event };
}

/**
 * Container props as the integration reads them: a missing or wrongly typed field takes the kind's default (a flag
 * must be a boolean, `windowSec` a whole 1..10, a trigger a slot 0..9 and a non-empty event), so a partial stored
 * container (for example `{ kind: 'smart_button' }`) is complete. Same device when nothing is missing.
 */
function completeContainer(d: Device): Device {
  const kind = d.props.kind;
  if (!isContainerKind(kind)) return d;
  const cur = d.props as unknown as Record<string, unknown>;
  let next: Record<string, unknown> | null = null;
  for (const [k, def] of Object.entries(deviceDefaults(kind, d.placement.mode))) {
    const v = cur[k];
    const fixed = k === 'on' || k === 'off' || k === 'auto' ? completeTrigger(v, def as Trigger)
      : k === 'windowSec' ? (isWhole(v, 1, 10) ? v : def)
      : typeof v === typeof def ? v : def;
    if (fixed !== v) (next ??= { ...cur })[k] = fixed;
  }
  return next ? { ...d, props: next as unknown as DeviceProps } : d;
}

/** A container whose stored default output is not allowed gets `off` (see normalizeDefaultOutput); same device otherwise. */
function allowedDefault(d: Device): Device {
  const props = normalizeDefaultOutput(d.props);
  return props === d.props ? d : { ...d, props };
}

/**
 * Stage-1 plans have no `devices`; a missing field means []. Legacy kinds are migrated, missing or invalid container
 * props take their defaults, a container default output that is not allowed reads as `off`, then invalid bindings
 * are dropped. Same object back when nothing changes.
 */
export function normalizeLevel(level: Level): Level {
  if (!level.devices) return { ...level, devices: [] };
  const devices = level.devices.map(d =>
    sanitizeBindings(allowedDefault(completeContainer(migrateSwitch(migrateEquipment(d))))));
  return devices.some((d, i) => d !== level.devices[i]) ? { ...level, devices } : level;
}
