import type { TemplateResult } from 'lit';
import type { Level } from '../model/types';
import type { ToolId } from './tool-factory';
import type { EditorMode } from './tool-factory';
import type { WallType } from '../model/types';
import { renderEquipmentProps } from './device-props';
import { renderProps } from './props-panel';
import type { ToolHost } from './tool-context';

/** Panel state the properties side panel reads and writes (the panel itself satisfies this). */
export interface SideHost extends ToolHost {
  mode: EditorMode;
  toolId: ToolId;
  commitRemoval(next: Level): void;
  setWallType(type: WallType): void;
}

/** The properties panel of the active tab (Plan or Equipment). */
export function renderSide(h: SideHost, level: Level): TemplateResult {
  const common = {
    level, selection: h.selection, lang: h.uiLang, notice: h.notice,
    commit: (next: Level) => h.commit(next), remove: (next: Level) => h.commitRemoval(next),
    setNotice: (msg: string | null) => { h.notice = msg; },
  };
  if (h.mode === 'equipment') {
    return renderEquipmentProps({ ...common, toolId: h.toolId, nextProps: h.nextProps, setNextProps: np => { h.nextProps = np; } });
  }
  return renderProps({
    ...common, tool: h.toolId, boxMeasure: h.boxMeasure, wallType: h.wallType, thickness: h.thickness,
    next: h.nextObj, setNext: n => { h.nextObj = n; },
    setWallType: wt => h.setWallType(wt), setThickness: mm => { h.thickness = mm; },
    setBoxMeasure: m => { h.boxMeasure = m; },
  });
}
