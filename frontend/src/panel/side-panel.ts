import type { TemplateResult } from 'lit';
import type { Level } from '../model/types';
import { renderEquipmentProps } from './device-props';
import { renderProps } from './props-panel';
import { renderToolRail } from './toolbar';
import { renderBindingList } from './binding-list';
import { renderBindingProps } from './binding-props';
import { renderZonesList } from './zones-list';
import { renderZonesProps } from './zones-props';
import { renderPowerProps } from './power-props';
import type { PlanStudioPanel } from './plan-studio-panel';

/** The left rail: the step's tool buttons, the tools and the zone list in the Zones step, or the device list in the Binding step. */
export function renderRail(h: PlanStudioPanel, level: Level): TemplateResult {
  if (h.mode === 'zones') {
    return renderZonesList({
      level, selection: h.selection, toolId: h.toolId, query: h.zoneQuery,
      onTool: id => h.pickTool(id), onQuery: q => { h.zoneQuery = q; }, onPick: id => h.pickZone(id),
    });
  }
  if (h.mode !== 'binding') return renderToolRail(h.mode, h.toolId, id => h.pickTool(id));
  return renderBindingList({
    level, selection: h.selection, status: h.bindStatus, filter: h.bindFilter, query: h.bindQuery,
    onFilter: f => { h.bindFilter = f; }, onQuery: q => { h.bindQuery = q; }, onPick: id => h.pickDevice(id),
    collapsed: h.railCollapsed, onCollapse: c => { h.railCollapsed = c; },
  });
}

/** Binding step properties of the selected device, wired to the panel's HA metadata and session state. */
function bindingSide(h: PlanStudioPanel, level: Level): TemplateResult {
  const s = h.selection;
  return renderBindingProps({
    level, device: s?.kind === 'device' ? level.devices.find(x => x.id === s.id) ?? null : null,
    meta: h.haMeta.get(), states: h.hass?.states, status: h.bindStatus,
    showAll: h.showAll, onShowAll: role => { h.showAll = { ...h.showAll, [role]: !h.showAll[role] }; },
    commit: next => h.commit(next), onNextUnbound: () => h.nextUnboundDevice(),
    notice: h.notice, fieldNotice: h.fieldNotice, setFieldNotice: msg => { h.fieldNotice = msg; },
    registryError: h.haMeta.error, registryLoading: h.haMeta.loading, onRetry: () => h.haMeta.retry(),
    feed: h.feed,
  });
}

/** The properties panel of the active step. */
export function renderSide(h: PlanStudioPanel, level: Level): TemplateResult {
  if (h.mode === 'binding') return bindingSide(h, level);
  if (h.mode === 'power') {
    return renderPowerProps({
      power: h.power, level, selection: h.selection, meta: h.haMeta.get(), states: h.hass?.states, frame: h.powerFeed.frame,
      notice: h.notice, feedError: h.powerFeed.error, toolId: h.toolId, placeDeviceId: h.placeDeviceId, onPlaceDevice: id => h.armDevice(id),
      commitPower: next => h.commitPower(next), setPosition: (id, p) => h.setPowerPosition(id, p),
    });
  }
  if (h.mode === 'zones') return renderZonesProps({ level, selection: h.selection, notice: h.notice, commit: next => h.commit(next) });
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
