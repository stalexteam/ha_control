import type { Pt, Id, Level, OpeningKind, DeviceKind, DevicePlacement, DeviceProps } from "../../model/types";
import type { Position, PowerKind, PowerSchema } from "../../model/power";
import type { WallProps } from "../../model/ops";
import type { SnapResult } from "../../geometry/snap";
import type { GeoCtx } from "../../geometry/power";

/** Pointer event in plan coordinates (mm). `pt` is not snapped. */
export interface ToolEvent {
  pt: Pt;
  shift: boolean;
  alt: boolean;
  /** Ctrl (Cmd on macOS) is held. */
  ctrl: boolean;
}

/** How the Zone tool makes the next zone: from the closed walls around a click, or as a drawn polygon. */
export type ZoneMethod = "walls" | "polygon";

/** Pointer travel (screen px) below which a press-move-release is a click, not a drag. */
export const DRAG_PX = 3;

/** Services the editor provides to a tool. */
export interface ToolContext {
  /** Current level. */
  level(): Level;
  /** Pushes `next` to History and marks the document dirty. */
  commit(next: Level): void;
  /** The power schematic (a default one while the plan has none). */
  power(): PowerSchema;
  /** Pushes `next` to the shared History and marks the document dirty. */
  commitPower(next: PowerSchema): void;
  /** Screen pixels per mm. */
  scale(): number;
  /** Pick tolerance in mm (10 screen px). */
  tolMm(): number;
  grid(): number | null;
  wallProps(): WallProps;
  boxMeasure(): "inner" | "axis" | "outer";
  select(sel: Selection | null): void;
  /** The panel's current selection (also set by the panel itself, e.g. from a list or by Esc). */
  selection(): Selection | null;
  /** The panel's "next device" props for the free mode. */
  deviceDefaults(kind: DeviceKind): DeviceProps;
  /** The Device tool's Wall mount: the next equipment device goes on a wall, like a socket. */
  wallMount(): boolean;
  /** The panel's "next opening" values for the door / window / opening tool. */
  openingDefaults(kind: OpeningKind): OpeningDefaults;
  /** Name the Zone tool gives the next zone. */
  zoneName(): string;
  /** How the Zone tool makes the next zone (read when the tool is created). */
  zoneMethod(): ZoneMethod;
  /** The next zone takes part in automation. */
  zoneAutomation(): boolean;
  /** Called after the Zone tool placed a zone (a typed name is single-use). */
  zonePlaced?(): void;
  /** Plan devices for the power schematic geometry (device block names and lines). */
  geo(): GeoCtx;
  /** The device the Power step's Device tool places next (armed in the device list), or null. */
  placeDeviceId(): Id | null;
  /** Called after the Device tool placed the armed device (the arm is cleared). */
  devicePlaced?(): void;
  /** Sets a transfer switch position live (not part of the plan document). */
  setPosition(blockId: Id, p: Position): void;
  /** Shows (or clears with null) the panel notice. */
  notify(msg: string | null): void;
  /** Activates another tool of the step, as the tool rail does (the selection is cleared). */
  pickTool(id: Tool["id"]): void;
}

export interface OpeningDefaults {
  width: number;
  hinge?: "start" | "end";
  swing?: "left" | "right";
  outside?: "left" | "right";
}

export type Selection = { kind: "wall" | "node" | "opening" | "zone" | "device" | "powerBlock" | "powerWire"; id: Id };

/** Transient overlay a tool asks the renderer to draw. */
export interface Preview {
  walls?: { a: Pt; b: Pt; props: WallProps }[];
  opening?: { wallId: Id; offset: number; width: number; kind: OpeningKind; invalid?: boolean };
  snap?: SnapResult;
  /** Typed input next to the cursor: wall length + angle, box width + depth. */
  tracker?: { first: string; second: string; field: "first" | "second"; at: Pt };
  orthoFrom?: Pt;
  /** Fixed start of the segment / box being drawn (chain start or last fixed point). */
  anchor?: Pt;
  /** Working copy of the level during a drag; the renderer draws it instead of the committed level. */
  level?: Level;
  /** The polygon zone being drawn: fixed points, the cursor (null while off the plan) and whether closing now is invalid. */
  zoneDraft?: { points: Pt[]; cursor: Pt | null; invalid: boolean };
  /** The vertex of the selected polygon zone picked by a click on its handle (Delete removes it). */
  zoneVertex?: { zoneId: Id; index: number };
  device?: { placement: DevicePlacement; props: DeviceProps; invalid: boolean };
  /** Working copy of the power schematic during a drag; the renderer draws it instead of the committed one. */
  power?: PowerSchema;
  /** The wire being dragged from a port (schematic units) and whether releasing here would connect. */
  wireDraft?: { from: Pt; to: Pt; ok: boolean };
}

/** The Power step's place tools: one per block kind except the grid (it always exists). */
export type PowerPlaceToolId = `power-${Exclude<PowerKind, "grid">}`;

export interface Tool {
  readonly id: "select" | "box" | "wall" | "door" | "window" | "opening" | "zone" | "device-select" | "binding-select" | "zone-pick"
    | DeviceKind | "power-select" | PowerPlaceToolId;
  down(e: ToolEvent): void;
  move(e: ToolEvent): void;
  up(e: ToolEvent): void;
  /** A double-click on the canvas (after the down / up pairs of its two clicks). */
  dblclick?(e: ToolEvent): void;
  /**
   * Returns true when the tool consumed the key. Ctrl+Z (Cmd+Z) comes as "Undo" first: a tool that consumes it
   * (a draft vertex removed) keeps it from the plan's undo.
   */
  key(key: string, e: { shift: boolean }): boolean;
  preview(): Preview;
  cancel(): void;
}
