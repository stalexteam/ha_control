import { html, type TemplateResult } from 'lit';
import type { Level } from '../model/types';
import { t } from '../i18n';
import { renderEquipmentProps } from './device-props';
import { renderProps } from './props-panel';
import { renderToolRail } from './toolbar';
import { renderBindingList } from './binding-list';
import type { PlanStudioPanel } from './plan-studio-panel';

/** The left rail: the step's tool buttons, or the device list in the Binding step. */
export function renderRail(h: PlanStudioPanel, level: Level): TemplateResult {
  if (h.mode !== 'binding') return renderToolRail(h.mode, h.toolId, id => h.pickTool(id));
  return renderBindingList({
    level, selection: h.selection, status: h.bindStatus, filter: h.bindFilter, query: h.bindQuery,
    onFilter: f => { h.bindFilter = f; }, onQuery: q => { h.bindQuery = q; }, onPick: id => h.pickDevice(id),
  });
}

/** Binding step properties: a placeholder until the binding fields arrive (name and kind of the selected device). */
function renderBindingProps(h: PlanStudioPanel, level: Level): TemplateResult {
  const s = h.selection;
  const d = s?.kind === 'device' ? level.devices.find(x => x.id === s.id) : undefined;
  return html`<div class="props">${d
    ? html`<h4>${d.name}</h4><p class="muted">${t(`device.${d.props.kind}`)}</p>`
    : html`<p class="muted">${t('binding.pick')}</p>`}</div>`;
}

/** The properties panel of the active step. */
export function renderSide(h: PlanStudioPanel, level: Level): TemplateResult {
  if (h.mode === 'binding') return renderBindingProps(h, level);
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
