import { html, nothing, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import type { RuleProblem } from '../model/rules';
import { t } from '../i18n';

export interface PurposeDialogOpts {
  /** Prefix of the element ids (`<prefix>-name`, `<prefix>-zone`). */
  prefix: string;
  title: string;
  hint: string;
  rule: Rule;
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  /** The messages under the body (pick hints first), each with its `data-problem` key. */
  texts: { key: string; text: string }[];
  /** The form fields after Name. */
  form: TemplateResult;
  /** The diagram column (a `.flow`). */
  diagram: TemplateResult;
  onChange(rule: Rule): void;
  onOk(): void;
  onCancel(): void;
}

/**
 * The one frame of the purpose-built automation dialogs (ventilation, boiler, leak protection): compact, sized to its
 * content (about 960 px wide, up to 90 % high, then the body scrolls); the hint, Name and the form on the left, the
 * diagram on the right (under the form on narrow screens), the problems, then Zone / Enabled / Cancel / OK.
 */
export function renderPurposeDialog(o: PurposeDialogOpts): TemplateResult {
  const r = o.rule;
  const zoneKnown = r.zoneId === null || o.zones.some(z => z.id === r.zoneId);
  return html`
    <div class="backdrop rule-backdrop" @change=${(e: Event) => e.stopPropagation()}>
      <div class="dialog rdlg pdlg" role="dialog" aria-modal="true" aria-label=${o.title}>
        <h3>${o.title}</h3>
        <div class="rcols">
          <div class="rsettings">
            <p class="muted">${o.hint}</p>
            <label class="rlabel" for=${`${o.prefix}-name`}>${t('rules.name')}</label>
            <input id=${`${o.prefix}-name`} data-field="name" type="text" .value=${r.name} placeholder=${t('rules.namePlaceholder')}
              @input=${(e: Event) => o.onChange({ ...r, name: (e.target as HTMLInputElement).value })} />
            ${o.form}
          </div>
          ${o.diagram}
        </div>
        ${o.texts.length > 0 ? html`<ul class="rproblems" role="alert">
          ${o.texts.map(p => html`<li data-problem=${p.key}>${p.text}</li>`)}</ul>` : nothing}
        <div class="rfoot">
          <label class="rlabel" for=${`${o.prefix}-zone`}>${t('rules.zone')}</label>
          <select id=${`${o.prefix}-zone`} data-field="zone" data-value=${r.zoneId ?? ''}
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
