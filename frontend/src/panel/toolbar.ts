import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import type { SaveState } from '../editor/save';
import { t } from '../i18n';
import { toolIdsFor, type EditorMode, type ToolId } from './tool-factory';

export interface TopBarOpts {
  /** Plan or Equipment tab; the wall type settings show only in the Plan tab. */
  mode: EditorMode;
  onMode(mode: EditorMode): void;
  planName: string;
  planId: string;
  /** Plans the selector offers (stored plans plus the open one); hidden when there is only one. */
  plans: { id: string; name: string }[];
  canUndo: boolean;
  canRedo: boolean;
  saveState: SaveState;
  dirty: boolean;
  errorMessage: string | null;
  /** Leading content, e.g. HA's menu button in narrow mode. */
  lead?: TemplateResult | typeof nothing;
  onRename(name: string): void;
  onPickPlan(id: string): void;
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
    case 'saving': return t('save.saving');
    case 'conflict': return t('save.conflict');
    case 'error': return t('save.error');
    default:
      if (o.dirty) return t('save.dirty');
      return t(o.saveState === 'saved' ? 'save.saved' : 'save.clean');
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
  return html`
    <div class="top">
      ${o.lead ?? nothing}
      ${o.plans.length > 1 ? html`
        <select class="plan-pick" aria-label=${t('plan.pick')} title=${t('plan.pick')}
          ?disabled=${o.saveState === 'saving'} .value=${fieldValue(o.planId)}
          @change=${(e: Event) => {
            const el = e.target as HTMLSelectElement;
            const id = el.value;
            el.value = o.planId; // the panel switches (maybe after a confirmation) and re-renders
            if (id !== o.planId) o.onPickPlan(id);
          }}>
          ${o.plans.map(p => html`<option value=${p.id} ?selected=${p.id === o.planId}>${p.name}</option>`)}
        </select>` : nothing}
      <button class="btn" data-action="new-plan" title=${t('plan.new')} aria-label=${t('plan.new')}
        ?disabled=${o.busy || o.saveState === 'saving'} @click=${o.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${t('plan.delete')} aria-label=${t('plan.delete')}
        ?disabled=${o.busy || o.saveState === 'saving'} @click=${o.onDeletePlan}>&#128465;</button>
      <input class="plan-name" .value=${fieldValue(o.planName)} aria-label=${t('plan.name')} title=${t('plan.name')}
        @change=${(e: Event) => o.onRename((e.target as HTMLInputElement).value)} />
      <span class="seg mode-tabs">
        ${(['plan', 'equipment'] as EditorMode[]).map(m => html`
          <button class="tab ${o.mode === m ? 'on' : ''}" data-mode=${m} @click=${() => o.onMode(m)}>
            ${t(`mode.${m}`)}</button>`)}
      </span>
      <span class="sp"></span>
      <button class="btn" title=${t('action.undo')} aria-label=${t('action.undo')} ?disabled=${!o.canUndo}
        @click=${o.onUndo}>↶</button>
      <button class="btn" title=${t('action.redo')} aria-label=${t('action.redo')} ?disabled=${!o.canRedo}
        @click=${o.onRedo}>↷</button>
      <span class="save-state ${o.saveState}" title=${o.saveState === 'error' ? o.errorMessage ?? '' : ''}>
        ${saveLabel(o)}${o.saveState === 'error' && o.errorMessage ? html`: ${o.errorMessage}` : nothing}</span>
      <button class="btn primary" data-action="save" ?disabled=${o.saveState === 'saving'} @click=${o.onSave}>
        ${t('action.save')}</button>
    </div>`;
}

export function renderToolRail(mode: EditorMode, active: ToolId, onPick: (id: ToolId) => void): TemplateResult {
  return html`
    <div class="tools">
      ${toolIdsFor(mode).map(id => html`
        ${id === 'zone' || id === 'ceiling_light' ? html`<div class="tool-sep"></div>` : nothing}
        <button class="tool ${active === id ? 'on' : ''}" data-tool=${id} @click=${() => onPick(id)}>
          ${t(`tool.${id}`)}</button>`)}
    </div>`;
}
