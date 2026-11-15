import { newId } from './ids';

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

export type DeviceKind = 'ceiling_light' | 'wall_light' | 'motion_sensor' | 'illuminance_sensor' | 'switch' | 'socket' | 'equipment';
export type DevicePlacement =
  | { mode: 'wall'; wallId: Id; side: Side; offset: number; aim?: number } // offset: along axis from node A to device centre; aim: degrees off the face normal, counter-clockwise on screen, integer -90..90 (default 0)
  | { mode: 'free'; x: number; y: number; rotation: number }; // rotation in degrees
export type DeviceProps =
  | { kind: 'ceiling_light'; shape: 'round' | 'linear' | 'spot'; diameter: number; length: number; width: number; poolRadius: number | null }
  | { kind: 'wall_light'; coneAngle: number; coneRange: number }
  | { kind: 'motion_sensor'; zoneAngle: number; zoneRange: number }
  | { kind: 'illuminance_sensor' } | { kind: 'switch' } | { kind: 'socket' }
  | { kind: 'equipment'; shape: 'rect' | 'circle'; width: number; depth: number; diameter: number;
      symbol: 'boiler' | 'pc' | 'automation' | 'other'; label: string };

export interface Device { id: Id; name: string; placement: DevicePlacement; props: DeviceProps; invalid: boolean }

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

export function emptyPlan(name: string): Plan {
  return {
    id: newId(),
    name,
    schemaVersion: 1,
    revision: 0,
    levels: [
      { id: newId(), name: 'Level 1', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] },
    ],
  };
}

export const DEVICE_PLACEMENTS: Record<DeviceKind, ('wall' | 'free')[]> = {
  ceiling_light: ['free'],
  wall_light: ['wall', 'free'],
  motion_sensor: ['free', 'wall'],
  illuminance_sensor: ['free', 'wall'],
  switch: ['wall'],
  socket: ['wall'],
  equipment: ['free'],
};

export function deviceDefaults(kind: DeviceKind, mode: 'wall' | 'free'): DeviceProps {
  switch (kind) {
    case 'ceiling_light':
      return { kind, shape: 'round', diameter: 300, length: 1200, width: 100, poolRadius: null };
    case 'wall_light':
      return { kind, coneAngle: 90, coneRange: 2000 };
    case 'motion_sensor':
      return { kind, zoneAngle: mode === 'free' ? 360 : 110, zoneRange: 5000 };
    case 'equipment':
      return { kind, shape: 'rect', width: 600, depth: 600, diameter: 600, symbol: 'other', label: '' };
    default:
      return { kind };
  }
}

/** Stage-1 plans have no `devices`; a missing field means []. Same object back when already present. */
export function normalizeLevel(level: Level): Level {
  return level.devices ? level : { ...level, devices: [] };
}
