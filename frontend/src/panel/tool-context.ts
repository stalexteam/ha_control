import { emptyLevel, type Id, type Level } from '../model/types';
import type { Selection, Tool, ToolContext } from '../editor/tools/types';
import type { DeviceKind, DeviceProps, WallType, OpeningKind } from '../model/types';
import type { History } from '../editor/history';
import type { PlanDoc, Position, PowerSchema } from '../model/power';
import { defaultZoneName, openingDefaults, type NextObjects } from './next-object';
import type { BoxMeasure } from './props-panel';
import type { View } from './viewport';

const EMPTY_LEVEL: Level = emptyLevel('', '');

/** The panel state the tools read (the panel itself satisfies this). */
export interface ToolHost {
  history: History<PlanDoc> | null;
  view: View;
  grid: boolean;
  wallType: WallType;
  thickness: number;
  boxMeasure: BoxMeasure;
  nextProps: Record<DeviceKind, DeviceProps>;
  nextObj: NextObjects;
  selection: Selection | null;
  notice: string | null;
  fieldNotice: string | null;
  mode: string;
  commit(next: Level): void;
  readonly power: PowerSchema;
  commitPower(next: PowerSchema): void;
  /** Power step: the plan device the Plan device tool places next (armed in the device list). */
  placeDeviceId: Id | null;
  setPowerPosition(blockId: Id, p: Position): void;
  pickTool(id: Tool['id']): void;
}

export function createToolContext(h: ToolHost): ToolContext {
  return {
    level: () => h.history?.current.level ?? EMPTY_LEVEL,
    commit: next => h.commit(next),
    power: () => h.power,
    commitPower: next => h.commitPower(next),
    scale: () => h.view.scale,
    tolMm: () => 10 / h.view.scale,
    grid: () => (h.grid ? 100 : null),
    wallProps: () => ({ type: h.wallType, thickness: h.thickness, baseline: 'center' }),
    boxMeasure: () => h.boxMeasure,
    // A field message belongs to the selected element; a session error (Binding) outlives the selection.
    select: s => { h.selection = s; h.fieldNotice = null; if (h.mode !== 'binding') h.notice = null; },
    selection: () => h.selection,
    deviceDefaults: k => h.nextProps[k],
    openingDefaults: (k: OpeningKind) => openingDefaults(h.nextObj, k),
    zoneName: () => h.nextObj.zoneName ?? defaultZoneName(h.history?.current.level ?? EMPTY_LEVEL),
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => { h.nextObj = { ...h.nextObj, zoneName: null }; },
    geo: () => {
      const devices = (h.history?.current.level ?? EMPTY_LEVEL).devices;
      return { device: id => devices.find(d => d.id === id) };
    },
    placeDeviceId: () => h.placeDeviceId,
    devicePlaced: () => { h.placeDeviceId = null; },
    setPosition: (blockId, p) => h.setPowerPosition(blockId, p),
    notify: msg => { h.notice = msg; },
    pickTool: id => h.pickTool(id),
  };
}
