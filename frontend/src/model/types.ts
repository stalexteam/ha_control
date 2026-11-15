import type { PowerSchema } from './power';
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
  /** Light passes through (line of sight of lamps); missing = the kind's default (see passesLight in model/openings). */
  passesLight?: boolean;
  /** PIR motion passes through (line of sight of motion sensors); missing = the kind's default (see passesPir in model/openings). */
  passesPir?: boolean;
  invalid: boolean;
}

export interface Zone {
  id: Id;
  name: string;
  seed: Pt;
  outline: Pt[];
  broken: boolean;
}

/**
 * A corner of a custom automation zone. `x, y` of an anchored vertex are a cache of its last resolved position.
 * free: a plain point; lost = it was anchored and the anchor disappeared. node: a wall corner or end. wall: a point on
 * a wall face, offset along the axis from node A, side = the face (left = the left face looking from A to B).
 */
export type ZoneVertex =
  | { kind: 'free'; x: number; y: number; lost?: true }
  | { kind: 'node'; nodeId: Id; x: number; y: number }
  | { kind: 'wall'; wallId: Id; offset: number; side: Side; x: number; y: number };
/** room: the outline of that room (`Level.zones`); polygon: three or more vertices. */
export type ZoneShape = { kind: 'room'; roomId: Id } | { kind: 'polygon'; vertices: ZoneVertex[] };
/** An automation zone; `invalid` is derived (see zoneInvalidReason in geometry/zones). */
export interface AutomationZone { id: Id; name: string; shape: ZoneShape; invalid: boolean }

/** A smart button trigger: slot 0..9 (0 = a one-button device) and a non-empty event (`single`, `double`, `hold` or free text). */
export interface Trigger { slot: number; event: string }
/** Input containers: kinds with a live output. */
export type ContainerKind = 'wall_switch' | 'smart_button';
/** True for the input-container kinds. */
export const isContainerKind = (kind: DeviceKind): kind is ContainerKind => kind === 'wall_switch' || kind === 'smart_button';
export type DeviceKind = 'ceiling_light' | 'wall_light' | 'motion_sensor' | 'illuminance_sensor' | ContainerKind | 'socket' | 'equipment' | 'climate_sensor' | 'exhaust_fan';
export type DevicePlacement =
  | { mode: 'wall'; wallId: Id; side: Side; offset: number; aim?: number } // offset: along axis from node A to device centre; aim: degrees off the face normal, counter-clockwise on screen, integer -90..90 (default 0)
  | { mode: 'free'; x: number; y: number; rotation: number } // rotation in degrees
  | { mode: 'none' }; // not on the plan (equipment only): never drawn, hit, in zones or cones, or invalid
/** The placement mode whose defaults (deviceDefaults) apply: a device not on the plan takes the free ones. */
export const defaultsMode = (mode: DevicePlacement['mode']): 'wall' | 'free' => (mode === 'wall' ? 'wall' : 'free');
export const FAN_DIAMETERS = [100, 125, 150] as const;
export type FanDiameter = typeof FAN_DIAMETERS[number];
export type DeviceProps =
  | { kind: 'ceiling_light'; shape: 'round' | 'linear' | 'spot'; diameter: number; length: number; width: number; poolRadius: number | null }
  | { kind: 'wall_light'; coneAngle: number; coneRange: number }
  | { kind: 'motion_sensor'; zoneAngle: number; zoneRange: number }
  | { kind: 'exhaust_fan'; diameter: FanDiameter }
  // A climate sensor's reading applies to the automation zones containing it (its stage-2a `zoneIds` is retired).
  | { kind: 'illuminance_sensor' } | { kind: 'socket' } | { kind: 'climate_sensor' }
  // inverter: Power is replaced by Input / Output power; controllable: Plan Studio may switch its control.
  // A missing flag means false. Shape, size, icon and label matter only while the device is on the plan.
  | { kind: 'equipment'; shape: 'rect' | 'circle'; width: number; depth: number; diameter: number;
      icon: string; label: string; inverter?: true; controllable?: true }
  // windowSec: whole seconds 1..10, used only with autoByDoubleToggle.
  | { kind: 'wall_switch'; autoByDoubleToggle: boolean; windowSec: number }
  // off is used only with separateOff (otherwise the on trigger toggles); auto only with autoEnabled.
  | { kind: 'smart_button'; separateOff: boolean; autoEnabled: boolean; on: Trigger; off: Trigger; auto: Trigger };

/** Equipment icon default (an MDI name). */
export const DEFAULT_EQUIPMENT_ICON = 'mdi:cube-outline';

/** Events offered for a trigger; any other non-empty text is accepted too. */
export const TRIGGER_EVENTS = ['single', 'double', 'hold'] as const;

export type BindingRole = 'control' | 'motion' | 'illuminance' | 'temperature' | 'humidity' | 'state' | 'power'
  | 'on' | 'off' | 'auto' | 'voltage' | 'power_in' | 'power_out';

/** zoneBlacklist: automation zones the device opts out of (missing = []; the field is removed when it becomes empty). */
export interface Device {
  id: Id; name: string; placement: DevicePlacement; props: DeviceProps; invalid: boolean;
  bindings?: Partial<Record<BindingRole, string>>; zoneBlacklist?: Id[];
}

export interface Level {
  id: Id;
  name: string;
  kind: 'floor' | 'site';
  order: number;
  nodes: PlanNode[];
  walls: Wall[];
  openings: Opening[];
  /** Rooms (the stored key stays `zones`). */
  zones: Zone[];
  devices: Device[];
  /** Missing = []: read it through levelZones. */
  automationZones?: AutomationZone[];
  /**
   * The level's equipment switches went through the v0.7 migration (see migrateDevices): from then on a switch without
   * the controllable flag is read-only. Missing on levels saved before v0.7.2 and on levels without an equipment switch.
   */
  switchesMigrated?: true;
}

/** The level's automation zones (a missing field means none). */
export function levelZones(level: Level): AutomationZone[] {
  return level.automationZones ?? [];
}

export interface Plan {
  id: Id;
  name: string;
  schemaVersion: 1;
  revision: number;
  levels: Level[];
  /** Power-flow schematic; absent until the schematic is edited. */
  power?: PowerSchema;
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

/** The placements a kind may take on the plan ('none' is not one: see addUnplacedDevice). Equipment on a wall = wall mount. */
export const DEVICE_PLACEMENTS: Record<DeviceKind, ('wall' | 'free')[]> = {
  ceiling_light: ['free'],
  wall_light: ['wall', 'free'],
  motion_sensor: ['free', 'wall'],
  illuminance_sensor: ['free', 'wall'],
  wall_switch: ['wall'],
  smart_button: ['wall', 'free'],
  socket: ['wall'],
  equipment: ['free', 'wall'],
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
    case 'exhaust_fan':
      return { kind, diameter: 100 };
    case 'equipment':
      return { kind, shape: 'rect', width: 600, depth: 600, diameter: 600, icon: DEFAULT_EQUIPMENT_ICON, label: '' };
    case 'wall_switch':
      return { kind, autoByDoubleToggle: false, windowSec: 3 };
    case 'smart_button':
      return {
        kind, separateOff: false, autoEnabled: false,
        on: { slot: 0, event: 'single' }, off: { slot: 0, event: 'hold' }, auto: { slot: 0, event: 'double' },
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
  const mode = defaultsMode(d.placement.mode);
  if (action) return { ...d, props: deviceDefaults('smart_button', mode), bindings: { on: action } };
  // Roles a wall switch does not have (`action: ''` and the like) are dropped by sanitizeBindings.
  return { ...d, props: deviceDefaults('wall_switch', mode) };
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
  for (const [k, def] of Object.entries(deviceDefaults(kind, defaultsMode(d.placement.mode)))) {
    const v = cur[k];
    const fixed = k === 'on' || k === 'off' || k === 'auto' ? completeTrigger(v, def as Trigger)
      : k === 'windowSec' ? (isWhole(v, 1, 10) ? v : def)
      : typeof v === typeof def ? v : def;
    if (fixed !== v) (next ??= { ...cur })[k] = fixed;
  }
  return next ? { ...d, props: next as unknown as DeviceProps } : d;
}

/** A climate sensor's stored `zoneIds` (retired by automation zones) is dropped; same device when it has none. */
function dropClimateZoneIds(d: Device): Device {
  if (d.props.kind !== 'climate_sensor' || !('zoneIds' in d.props)) return d;
  const { zoneIds: _dropped, ...props } = d.props as DeviceProps & { zoneIds: unknown };
  return { ...d, props: props as DeviceProps };
}

/** A container's stored `defaultOutput` (removed in v0.5) is dropped; same device when it has none. */
function dropDefaultOutput(d: Device): Device {
  if (!isContainerKind(d.props.kind) || !('defaultOutput' in d.props)) return d;
  const { defaultOutput: _dropped, ...props } = d.props as DeviceProps & { defaultOutput: unknown };
  return { ...d, props: props as DeviceProps };
}

/**
 * Stage-1 plans have no `devices`; a missing field means []. Legacy kinds are migrated, missing or invalid container
 * props take their defaults, a stored container `defaultOutput` and a stored climate `zoneIds` are dropped, then
 * invalid bindings (such as a v0.4 `final`) are dropped. A missing `automationZones` stays missing (it means []).
 * Same object back when nothing changes.
 */
export function normalizeLevel(level: Level): Level {
  if (!level.devices) return { ...level, devices: [] };
  const devices = level.devices.map(d =>
    sanitizeBindings(dropClimateZoneIds(dropDefaultOutput(completeContainer(migrateSwitch(migrateEquipment(d)))))));
  return devices.some((d, i) => d !== level.devices[i]) ? { ...level, devices } : level;
}
