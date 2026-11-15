import type { TemplateResult } from 'lit';
import type { Level } from '../model/types';
import { renderEquipmentProps } from './device-props';
import { renderProps } from './props-panel';
import type { PlanStudioPanel } from './plan-studio-panel';

/** The properties panel of the active tab (Plan or Equipment). */
export function renderSide(h: PlanStudioPanel, level: Level): TemplateResult {
  const common = {
    level, selection: h.selection, notice: h.notice,
    commit: (next: Level) => h.commit(next),
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
