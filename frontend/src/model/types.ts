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

export interface Level {
  id: Id;
  name: string;
  kind: 'floor' | 'site';
  order: number;
  nodes: PlanNode[];
  walls: Wall[];
  openings: Opening[];
  zones: Zone[];
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
      { id: newId(), name: 'Level 1', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [] },
    ],
  };
}
