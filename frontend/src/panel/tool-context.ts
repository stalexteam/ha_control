import { emptyLevel, type Level } from '../model/types';
import type { Selection, ToolContext } from '../editor/tools/types';
import type { DeviceKind, DeviceProps, WallType, OpeningKind } from '../model/types';
import type { History } from '../editor/history';
import { defaultZoneName, openingDefaults, type NextObjects } from './next-object';
import type { BoxMeasure } from './props-panel';
import type { View } from './viewport';

const EMPTY_LEVEL: Level = emptyLevel('', '');

/** The panel state the tools read (the panel itself satisfies this). */
export interface ToolHost {
  history: History<Level> | null;
  view: View;
  grid: boolean;
  wallType: WallType;
  thickness: number;
  boxMeasure: BoxMeasure;
  nextProps: Record<DeviceKind, DeviceProps>;
  nextObj: NextObjects;
  selection: Selection | null;
  notice: string | null;
  fillNotice: string | null;
  mode: string;
  commit(next: Level): void;
}

export function createToolContext(h: ToolHost): ToolContext {
  return {
    level: () => h.history?.current ?? EMPTY_LEVEL,
    commit: next => h.commit(next),
    scale: () => h.view.scale,
    tolMm: () => 10 / h.view.scale,
    grid: () => (h.grid ? 100 : null),
    wallProps: () => ({ type: h.wallType, thickness: h.thickness, baseline: 'center' }),
    boxMeasure: () => h.boxMeasure,
    select: s => { h.selection = s; h.fillNotice = null; if (h.mode !== 'binding') h.notice = null; },
    deviceDefaults: k => h.nextProps[k],
    openingDefaults: (k: OpeningKind) => openingDefaults(h.nextObj, k),
    zoneName: () => h.nextObj.zoneName ?? defaultZoneName(h.history?.current ?? EMPTY_LEVEL),
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => { h.nextObj = { ...h.nextObj, zoneName: null }; },
  };
}
