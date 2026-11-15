import type { Pt, Id, Level, OpeningKind, DeviceKind, DevicePlacement, DeviceProps } from "../../model/types";
import type { WallProps } from "../../model/ops";
import type { SnapResult } from "../../geometry/snap";

/** Pointer event in plan coordinates (mm). `pt` is not snapped. */
export interface ToolEvent {
  pt: Pt;
  shift: boolean;
  alt: boolean;
}

/** Services the editor provides to a tool. */
export interface ToolContext {
  /** Current level. */
  level(): Level;
  /** Pushes `next` to History and marks the document dirty. */
  commit(next: Level): void;
  tolMm(): number;
  grid(): number | null;
  wallProps(): WallProps;
  boxMeasure(): "inner" | "axis" | "outer";
  select(sel: Selection | null): void;
  /** The panel's "next device" props for the free mode. */
  deviceDefaults(kind: DeviceKind): DeviceProps;
  /** The panel's "next opening" values for the door / window / opening tool. */
  openingDefaults(kind: OpeningKind): OpeningDefaults;
  /** Name the zone tool gives the next room. */
  zoneName(): string;
  /** Called after the zone tool placed a zone (the automatic name advances). */
  zonePlaced?(): void;
}

export interface OpeningDefaults {
  width: number;
  hinge?: "start" | "end";
  swing?: "left" | "right";
  outside?: "left" | "right";
}

export type Selection = { kind: "wall" | "node" | "opening" | "zone" | "device"; id: Id };

/** Transient overlay a tool asks the renderer to draw. */
export interface Preview {
  walls?: { a: Pt; b: Pt; props: WallProps }[];
  opening?: { wallId: Id; offset: number; width: number; kind: OpeningKind; invalid?: boolean };
  snap?: SnapResult;
  tracker?: { length: string; angle: string; field: "length" | "angle"; at: Pt };
  orthoFrom?: Pt;
  /** Fixed start of the segment / box being drawn (chain start or last fixed point). */
  anchor?: Pt;
  /** Working copy of the level during a drag; the renderer draws it instead of the committed level. */
  level?: Level;
  device?: { placement: DevicePlacement; props: DeviceProps; invalid: boolean };
}

export interface Tool {
  readonly id: "select" | "box" | "wall" | "door" | "window" | "opening" | "zone" | "device-select" | DeviceKind;
  down(e: ToolEvent): void;
  move(e: ToolEvent): void;
  up(e: ToolEvent): void;
  /** Returns true when the tool consumed the key. */
  key(key: string, e: { shift: boolean }): boolean;
  preview(): Preview;
  cancel(): void;
}
