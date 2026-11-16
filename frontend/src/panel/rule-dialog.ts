import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Rule, RuleAction, RuleDo, RuleInput } from '../model/types';
import type { RuleProblem } from '../model/rules';
import { ruleActionsFor, RULE_DELAY_MAX } from '../model/rules';
import type { RuleTrace } from '../live/rules-feed';
import { renderRuleTrace, fieldOf, type FocusTarget } from '../render/rule-trace';
import { t } from '../i18n';

/** The rule being edited and the dialog's own UI state; the panel keeps it while the dialog is open. */
export interface RuleDraft {
  rule: Rule;
  isNew: boolean;
  /** `data-field` last focused (highlighted). */
  focused: string | null;
}

export interface RuleDialogOpts {
  draft: RuleDraft;
  /** Plan devices that can be inputs / action targets, and every device (for names and existence). */
  inputDevices: Device[];
  actionDevices: Device[];
  deviceById(id: Id): Device | undefined;
  /** Other rules that can be inputs (the edited rule excluded) and every rule (for names). */
  otherRules: Rule[];
  ruleName(id: Id): string | undefined;
  /** Zones of every level: id and display name. */
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  trace: RuleTrace | undefined;
  note: string | null;
  now: number;
  onChange(rule: Rule): void;
  onFocus(field: string): void;
  onOk(): void;
  onCancel(): void;
}

const NAN_SAFE = (n: number): string => (Number.isFinite(n) ? String(n) : '');

/** The text of a delay field: whole seconds; anything else becomes NaN, which `ruleProblems` reports. */
function seconds(v: string): number {
  return v.trim() === '' ? NaN : Number(v);
}

function inputName(o: RuleDialogOpts, i: RuleInput): string {
  if ('device' in i.source) return o.deviceById(i.source.device)?.name ?? t('rules.missingDevice');
  return o.ruleName(i.source.rule) ?? t('rules.missingRule');
}

function actionRow(o: RuleDialogOpts, side: 'true' | 'false', k: number, a: RuleAction): TemplateResult {
  const r = o.draft.rule;
  const key = side === 'true' ? 'onTrue' : 'onFalse';
  const list = r[key];
  const set = (next: RuleAction[]) => o.onChange({ ...r, [key]: next });
  const dev = o.deviceById(a.device);
  const acts: RuleDo[] = dev ? ruleActionsFor(dev) : [a.do];
  const field = fieldOf({ action: side, index: k });
  return html`
    <div class="rline" data-field=${field} tabindex="-1">
      <select class="grow" data-part="device" data-value=${a.device}
        @change=${(e: Event) => {
          const d = o.deviceById((e.target as HTMLSelectElement).value);
          if (d) set(list.map((x, j) => (j === k ? { device: d.id, do: ruleActionsFor(d).includes(x.do) ? x.do : ruleActionsFor(d)[0] } : x)));
        }}>
        ${dev && !o.actionDevices.includes(dev) ? html`<option value=${dev.id}>${dev.name}</option>` : nothing}
        ${dev ? nothing : html`<option value=${a.device}>${t('rules.missingDevice')}</option>`}
        ${o.actionDevices.map(d => html`<option value=${d.id}>${d.name}</option>`)}
      </select>
      <select data-part="do" data-value=${a.do}
        @change=${(e: Event) => set(list.map((x, j) => (j === k ? { ...x, do: (e.target as HTMLSelectElement).value as RuleDo } : x)))}>
        ${acts.map(d => html`<option value=${d}>${t(`rules.act.${d}`)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${t('rules.remove')} @click=${() => set(list.filter((_, j) => j !== k))}>&times;</button>
    </div>`;
}

function actionList(o: RuleDialogOpts, side: 'true' | 'false'): TemplateResult {
  const r = o.draft.rule;
  const key = side === 'true' ? 'onTrue' : 'onFalse';
  return html`
    <div class="rgroup">
      <div class="rlabel">${t(side === 'true' ? 'rules.whenTrue' : 'rules.whenFalse')}</div>
      ${r[key].map((a, k) => actionRow(o, side, k, a))}
      <select class="radd" data-action=${`add-action-${side}`} .value=${''}
        @change=${(e: Event) => {
          const sel = e.target as HTMLSelectElement;
          const d = o.deviceById(sel.value);
          sel.value = '';
          if (d && ruleActionsFor(d).length > 0) o.onChange({ ...r, [key]: [...r[key], { device: d.id, do: ruleActionsFor(d)[0] }] });
        }}>
        <option value="">${t('rules.addAction')}</option>
        ${o.actionDevices.map(d => html`<option value=${d.id}>${d.name}</option>`)}
      </select>
    </div>`;
}

function inputRow(o: RuleDialogOpts, i: RuleInput, k: number): TemplateResult {
  const r = o.draft.rule;
  const missing = 'device' in i.source ? !o.deviceById(i.source.device) : o.ruleName(i.source.rule) === undefined;
  return html`
    <div class="rline${missing ? ' bad' : ''}" data-field=${fieldOf({ input: k })} tabindex="-1">
      <span class="grow">${inputName(o, i)}</span>
      <label class="rnot"><input type="checkbox" data-part="not" .checked=${i.not === true}
        @change=${(e: Event) => {
          const on = (e.target as HTMLInputElement).checked;
          o.onChange({ ...r, inputs: r.inputs.map((x, j) => {
            if (j !== k) return x;
            const { not: _n, ...rest } = x;
            return on ? { ...rest, not: true as const } : rest;
          }) });
        }} /> ${t('rules.not')}</label>
      <button class="btn" data-action="remove-input" title=${t('rules.remove')}
        @click=${() => o.onChange({ ...r, inputs: r.inputs.filter((_, j) => j !== k) })}>&times;</button>
    </div>`;
}

function settings(o: RuleDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const add = (e: Event) => {
    const sel = e.target as HTMLSelectElement;
    const v = sel.value;
    sel.value = '';
    if (!v) return;
    const source = v.startsWith('r:') ? { rule: v.slice(2) } : { device: v.slice(2) };
    o.onChange({ ...r, inputs: [...r.inputs, { source }] });
  };
  return html`
    <div class="rsettings">
      <label class="rlabel" for="rule-name">${t('rules.name')}</label>
      <input id="rule-name" data-field="name" type="text" .value=${r.name} placeholder=${t('rules.namePlaceholder')}
        @input=${(e: Event) => o.onChange({ ...r, name: (e.target as HTMLInputElement).value })} />

      <label class="rlabel" for="rule-combine">${t('rules.combine')}</label>
      <select id="rule-combine" data-field="combine" data-value=${r.combine}
        @change=${(e: Event) => o.onChange({ ...r, combine: (e.target as HTMLSelectElement).value === 'all' ? 'all' : 'any' })}>
        <option value="any">${t('rules.combine.any')}</option>
        <option value="all">${t('rules.combine.all')}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${t('rules.inputs')}</div>
        ${r.inputs.length === 0 ? html`<p class="muted">${t('rules.noInputs')}</p>` : r.inputs.map((i, k) => inputRow(o, i, k))}
        <select class="radd" data-action="add-input" .value=${''} @change=${add}>
          <option value="">${t('rules.addInput')}</option>
          <optgroup label=${t('rules.groupDevices')}>
            ${o.inputDevices.map(d => html`<option value=${`d:${d.id}`}>${d.name}</option>`)}
          </optgroup>
          ${o.otherRules.length > 0 ? html`<optgroup label=${t('rules.groupRules')}>
            ${o.otherRules.map(x => html`<option value=${`r:${x.id}`}>${x.name}</option>`)}
          </optgroup>` : nothing}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${t('rules.delays')}</div>
        <div class="rline">
          <label class="grow">${t('rules.onDelay')}
            <input class="num" data-part="on-delay" type="number" min="0" max=${RULE_DELAY_MAX} step="1" .value=${NAN_SAFE(r.onDelay)}
              @input=${(e: Event) => o.onChange({ ...r, onDelay: seconds((e.target as HTMLInputElement).value) })} /></label>
          <label class="grow">${t('rules.offDelay')}
            <input class="num" data-part="off-delay" type="number" min="0" max=${RULE_DELAY_MAX} step="1" .value=${NAN_SAFE(r.offDelay)}
              @input=${(e: Event) => o.onChange({ ...r, offDelay: seconds((e.target as HTMLInputElement).value) })} /></label>
        </div>
      </div>

      ${actionList(o, 'true')}
      ${actionList(o, 'false')}
    </div>`;
}

/** The rule dialog: settings on the left, the live flowchart on the right, Zone / Enabled / Cancel / OK in the footer. */
export function renderRuleDialog(o: RuleDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const zoneKnown = r.zoneId === null || o.zones.some(z => z.id === r.zoneId);
  const focus = (target: FocusTarget) => o.onFocus(fieldOf(target));
  return html`
    <div class="backdrop rule-backdrop" @change=${(e: Event) => e.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${t(o.draft.isNew ? 'rules.dialog.new' : 'rules.dialog.edit')}>
        <h3>${t(o.draft.isNew ? 'rules.dialog.new' : 'rules.dialog.edit')}</h3>
        <div class="rcols">
          ${settings(o)}
          ${renderRuleTrace({
            rule: r, inputName: i => inputName(o, i), actionName: id => o.deviceById(id)?.name ?? t('rules.missingDevice'),
            trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: focus,
          })}
        </div>
        ${o.problems.length > 0 ? html`<ul class="rproblems" role="alert">
          ${o.problems.map(p => html`<li data-problem=${p}>${t(`rules.problem.${p}`)}</li>`)}</ul>` : nothing}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${t('rules.zone')}</label>
          <select id="rule-zone" data-field="zone" data-value=${r.zoneId ?? ''}
            @change=${(e: Event) => o.onChange({ ...r, zoneId: (e.target as HTMLSelectElement).value || null })}>
            <option value="">${t('rules.zone.none')}</option>
            ${zoneKnown ? nothing : html`<option value=${r.zoneId!}>${t('rules.zone.removed')}</option>`}
            ${o.zones.map(z => html`<option value=${z.id}>${z.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${r.enabled !== false}
            @change=${(e: Event) => {
              const { enabled: _e, ...rest } = r;
              o.onChange((e.target as HTMLInputElement).checked ? rest : { ...rest, enabled: false });
            }} /> ${t('rules.enabled')}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${o.onCancel}>${t('action.cancel')}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${o.problems.length > 0} @click=${o.onOk}>${t('action.ok')}</button>
        </div>
      </div>
    </div>`;
}
