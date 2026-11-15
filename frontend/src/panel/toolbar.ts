import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import type { WallType } from '../model/types';
import { WALL_PRESETS } from '../model/types';
import type { SaveState } from '../editor/save';
import { t } from '../i18n';
import { toolIdsFor, type EditorMode, type ToolId } from './tool-factory';

export type { ToolId } from './tool-factory';
const EDITOR_WALL_TYPES: WallType[] = ['bearing', 'partition', 'railing'];

export interface TopBarOpts {
  lang: string;
  /** Plan or Equipment tab; the wall type settings show only in the Plan tab. */
  mode: EditorMode;
  onMode(mode: EditorMode): void;
  planName: string;
  planId: string;
  /** Plans the selector offers (stored plans plus the open one); hidden when there is only one. */
  plans: { id: string; name: string }[];
  wallType: WallType;
  thickness: number;
  canUndo: boolean;
  canRedo: boolean;
  saveState: SaveState;
  dirty: boolean;
  errorMessage: string | null;
  /** Leading content, e.g. HA's menu button in narrow mode. */
  lead?: TemplateResult | typeof nothing;
  onRename(name: string): void;
  onPickPlan(id: string): void;
  onWallType(type: WallType): void;
  onThickness(mm: number): void;
  onUndo(): void;
  onRedo(): void;
  onSave(): void;
  onNewPlan(): void;
  onDeletePlan(): void;
  /** A delete request is running. */
  busy: boolean;
}

function saveLabel(o: TopBarOpts): string {
  switch (o.saveState) {
    case 'saving': return t('save.saving', o.lang);
    case 'conflict': return t('save.conflict', o.lang);
    case 'error': return t('save.error', o.lang);
    default:
      if (o.dirty) return t('save.dirty', o.lang);
      return t(o.saveState === 'saved' ? 'save.saved' : 'save.clean', o.lang);
  }
}

/** Integer mm > 0, or null. */
export function parseMm(value: string): number | null {
  const s = value.replace(/[\s ]/g, '');
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return n > 0 ? n : null;
}

export function renderTopBar(o: TopBarOpts): TemplateResult {
  const lang = o.lang;
  return html`
    <div class="top">
      ${o.lead ?? nothing}
      ${o.plans.length > 1 ? html`
        <select class="plan-pick" aria-label=${t('plan.pick', lang)} title=${t('plan.pick', lang)}
          ?disabled=${o.saveState === 'saving'} .value=${fieldValue(o.planId)}
          @change=${(e: Event) => {
            const el = e.target as HTMLSelectElement;
            const id = el.value;
            el.value = o.planId; // the panel switches (maybe after a confirmation) and re-renders
            if (id !== o.planId) o.onPickPlan(id);
          }}>
          ${o.plans.map(p => html`<option value=${p.id} ?selected=${p.id === o.planId}>${p.name}</option>`)}
        </select>` : nothing}
      <button class="btn" data-action="new-plan" title=${t('plan.new', lang)} aria-label=${t('plan.new', lang)}
        ?disabled=${o.busy || o.saveState === 'saving'} @click=${o.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${t('plan.delete', lang)} aria-label=${t('plan.delete', lang)}
        ?disabled=${o.busy || o.saveState === 'saving'} @click=${o.onDeletePlan}>&#128465;</button>
      <input class="plan-name" .value=${fieldValue(o.planName)} aria-label=${t('plan.name', lang)} title=${t('plan.name', lang)}
        @change=${(e: Event) => o.onRename((e.target as HTMLInputElement).value)} />
      <span class="seg mode-tabs">
        ${(['plan', 'equipment'] as EditorMode[]).map(m => html`
          <button class="tab ${o.mode === m ? 'on' : ''}" data-mode=${m} @click=${() => o.onMode(m)}>
            ${t(`mode.${m}`, lang)}</button>`)}
      </span>
      <span class="sp"></span>
      ${o.mode === 'plan' ? html`
        <span class="muted">${t('walltype.label', lang)}:</span>
        ${EDITOR_WALL_TYPES.map(wt => html`
          <button class="tab ${o.wallType === wt ? 'on' : ''}" data-walltype=${wt} @click=${() => o.onWallType(wt)}>
            ${t(`walltype.${wt}`, lang)} ${WALL_PRESETS[wt]}</button>`)}
        <input class="num" type="text" inputmode="numeric" .value=${fieldValue(String(o.thickness))}
          aria-label=${t('props.thickness', lang)} title=${t('props.thickness', lang)}
          @change=${(e: Event) => {
            const el = e.target as HTMLInputElement;
            const v = parseMm(el.value);
            if (v === null) el.value = String(o.thickness); else o.onThickness(v);
          }} />
        <span class="muted">${t('unit.mm', lang)}</span>
        <span class="sp"></span>` : nothing}
      <button class="btn" title=${t('action.undo', lang)} aria-label=${t('action.undo', lang)} ?disabled=${!o.canUndo}
        @click=${o.onUndo}>↶</button>
      <button class="btn" title=${t('action.redo', lang)} aria-label=${t('action.redo', lang)} ?disabled=${!o.canRedo}
        @click=${o.onRedo}>↷</button>
      <span class="save-state ${o.saveState}" title=${o.saveState === 'error' ? o.errorMessage ?? '' : ''}>
        ${saveLabel(o)}${o.saveState === 'error' && o.errorMessage ? html`: ${o.errorMessage}` : nothing}</span>
      <button class="btn primary" data-action="save" ?disabled=${o.saveState === 'saving'} @click=${o.onSave}>
        ${t('action.save', lang)}</button>
    </div>`;
}

export function renderToolRail(mode: EditorMode, active: ToolId, lang: string, onPick: (id: ToolId) => void): TemplateResult {
  return html`
    <div class="tools">
      ${toolIdsFor(mode).map(id => html`
        ${id === 'zone' || id === 'ceiling_light' ? html`<div class="tool-sep"></div>` : nothing}
        <button class="tool ${active === id ? 'on' : ''}" data-tool=${id} @click=${() => onPick(id)}>
          ${t(`tool.${id}`, lang)}</button>`)}
    </div>`;
}
