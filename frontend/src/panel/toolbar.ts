import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import type { SaveState } from '../editor/save';
import { t } from '../i18n';
import { PLAN_SHORTCUTS, toolIdsFor, type EditorMode, type ToolId } from './tool-factory';
import { toolIcon } from './tool-icons';

export interface TopBarOpts {
  /** The wizard title block (renderSteps) under the action bar. */
  steps: TemplateResult;
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

/** Header: an action bar (plans, undo / redo, save) like an HA page toolbar, then the wizard steps. */
export function renderTopBar(o: TopBarOpts): TemplateResult {
  return html`
    <div class="top"><div class="bar">
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
      <span class="sp"></span>
      <button class="btn" title=${t('action.undo')} aria-label=${t('action.undo')} ?disabled=${!o.canUndo}
        @click=${o.onUndo}>↶</button>
      <button class="btn" title=${t('action.redo')} aria-label=${t('action.redo')} ?disabled=${!o.canRedo}
        @click=${o.onRedo}>↷</button>
      <span class="save-state ${o.saveState}" title=${o.saveState === 'error' ? o.errorMessage ?? '' : ''}>
        ${saveLabel(o)}${o.saveState === 'error' && o.errorMessage ? html`: ${o.errorMessage}` : nothing}</span>
      <button class="btn primary" data-action="save" ?disabled=${o.saveState === 'saving'} @click=${o.onSave}>
        ${t('action.save')}</button>
    </div>${o.steps}</div>`;
}

/**
 * Tools that start a group on the rail: Plan groups Select · Box, Wall · Door, Window, Opening · Zone; Equipment puts
 * the device kinds after Select; Power puts the Device tool, then the service blocks, after Select.
 */
const GROUP_STARTS: ToolId[] = ['box', 'door', 'zone', 'ceiling_light', 'power-device', 'power-bus'];

/**
 * The step's tool buttons (with a separator before each group): an icon above the label, the Plan step's shortcut
 * letter in `data-key` (drawn faintly in the corner by CSS, so it is not part of the label text).
 */
export function toolButtons(mode: EditorMode, active: ToolId, onPick: (id: ToolId) => void): TemplateResult[] {
  return toolIdsFor(mode).map(id => {
    const k = mode === 'plan' ? PLAN_SHORTCUTS[id] : undefined;
    const label = t(`tool.${id}`);
    return html`
      ${GROUP_STARTS.includes(id) ? html`<div class="tool-sep"></div>` : nothing}
      <button class="tool ${active === id ? 'on' : ''}" data-tool=${id} data-key=${k ?? nothing}
        aria-pressed=${active === id ? 'true' : 'false'} aria-keyshortcuts=${k ?? nothing}
        title=${k ? `${label} (${k})` : label} @click=${() => onPick(id)}>
        ${toolIcon(id)}<span class="tlabel">${label}</span></button>`;
  });
}

export function renderToolRail(mode: EditorMode, active: ToolId, onPick: (id: ToolId) => void): TemplateResult {
  return html`<div class="tools">${toolButtons(mode, active, onPick)}</div>`;
}
