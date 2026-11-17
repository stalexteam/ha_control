import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Rule } from '../model/types';
import type { RuleProblem } from '../model/rules';
import { RULE_DELAY_MAX } from '../model/rules';
import type { RuleTrace } from '../live/rules-feed';
import { lastText } from './rules-panel';
import type { RuleDraft } from './rule-dialog';
import { t } from '../i18n';

export interface VentDialogOpts {
  draft: RuleDraft;
  /** Climate sensors and on/off-capable devices of the plan; every device (for names). */
  climateSensors: Device[];
  fans: Device[];
  deviceById(id: Id): Device | undefined;
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  /** Live trace; only given for a saved unchanged rule. */
  trace: RuleTrace | undefined;
  note: string | null;
  now: number;
  onChange(rule: Rule): void;
  onOk(): void;
  onCancel(): void;
}

const num = (v: string): number => (v.trim() === '' ? NaN : Number(v));
const shown = (n: number): string => (Number.isFinite(n) ? String(+n.toFixed(4)) : '');
const valWord = (v: boolean | null): string => t(`rules.verdict.${v === null ? 'unknown' : v}`);

/** A select of devices: the current id stays selectable (as "missing") when it is not in the list. */
function deviceSelect(o: VentDialogOpts, field: string, value: Id, list: Device[], onPick: (id: Id) => void): TemplateResult {
  const known = value === '' || list.some(d => d.id === value);
  return html`
    <select data-field=${field} data-value=${value} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value)}>
      <option value="">${t('vent.pick')}</option>
      ${known ? nothing : html`<option value=${value}>${o.deviceById(value)?.name ?? t('rules.missingDevice')}</option>`}
      ${list.map(d => html`<option value=${d.id}>${d.name}</option>`)}
    </select>`;
}

function live(o: VentDialogOpts): TemplateResult {
  const tr = o.trace;
  if (!tr) return html`<div class="vent-live"><p class="fc-note">${o.note ?? ''}</p></div>`;
  const left = tr.pending ? Math.max(0, Math.ceil((tr.pending.at - o.now) / 1000)) : 0;
  const status = tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`);
  return html`
    <div class="vent-live">
      <p class="fc-last">${status}</p>
      ${tr.inputs[0] ? html`<p class="fc-last" data-part="detail">${tr.inputs[0].label}: ${tr.inputs[0].detail}</p>` : nothing}
      <p class="fc-last" data-part="verdict">${valWord(tr.verdict)}${tr.pending
        ? `, ${t('rules.flow.pending').replace('{to}', t(`rules.val.${tr.pending.to}`)).replace('{n}', String(left))}` : ''}</p>
      ${tr.last ? html`<p class="fc-last">${t('rules.flow.last')} ${lastText(tr.last)}</p>` : nothing}
    </div>`;
}

/** The "Wet zone ventilation" dialog: two climate sensors, margins, run-on and the fan; Zone / Enabled / Cancel / OK in the footer. */
export function renderVentDialog(o: VentDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const v = r.vent!;
  const setVent = (p: Partial<typeof v>) => o.onChange({ ...r, vent: { ...v, ...p } });
  const fan = r.onTrue[0]?.device ?? '';
  const zoneKnown = r.zoneId === null || o.zones.some(z => z.id === r.zoneId);
  const title = t('vent.title');
  return html`
    <div class="backdrop rule-backdrop" @change=${(e: Event) => e.stopPropagation()}>
      <div class="dialog vdlg" role="dialog" aria-modal="true" aria-label=${title}>
        <h3>${title}</h3>
        <p class="muted">${t('vent.hint')}</p>
        <div class="vform">
          <label class="rlabel" for="vent-name">${t('rules.name')}</label>
          <input id="vent-name" data-field="name" type="text" .value=${r.name} placeholder=${t('rules.namePlaceholder')}
            @input=${(e: Event) => o.onChange({ ...r, name: (e.target as HTMLInputElement).value })} />

          <label class="rlabel">${t('vent.sensor')}</label>
          ${deviceSelect(o, 'vent-sensor', v.sensor, o.climateSensors, id => setVent({ sensor: id }))}

          <label class="rlabel">${t('vent.than')}</label>
          ${deviceSelect(o, 'vent-than', v.than, o.climateSensors, id => setVent({ than: id }))}

          <label class="rlabel">${t('vent.fan')}</label>
          ${deviceSelect(o, 'vent-fan', fan, o.fans, id => o.onChange({
            ...r,
            onTrue: id ? [{ device: id, do: 'on' }] : [],
            onFalse: id ? [{ device: id, do: 'off' }] : [],
          }))}

          <div class="vnums">
            <label>${t('vent.above')}
              <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${shown(v.above)}
                @input=${(e: Event) => setVent({ above: num((e.target as HTMLInputElement).value) })} /></label>
            <label>${t('vent.below')}
              <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${shown(v.below)}
                @input=${(e: Event) => setVent({ below: num((e.target as HTMLInputElement).value) })} /></label>
            <label>${t('vent.runon')}
              <input class="num" data-field="vent-runon" type="number" min="0" max=${RULE_DELAY_MAX / 60} step="any" .value=${shown(r.offDelay / 60)}
                @input=${(e: Event) => o.onChange({ ...r, offDelay: Math.round(num((e.target as HTMLInputElement).value) * 60) })} /></label>
          </div>
        </div>
        ${live(o)}
        ${o.problems.length > 0 ? html`<ul class="rproblems" role="alert">
          ${o.problems.map(p => html`<li data-problem=${p}>${t(`rules.problem.${p}`)}</li>`)}</ul>` : nothing}
        <div class="rfoot">
          <label class="rlabel" for="vent-zone">${t('rules.zone')}</label>
          <select id="vent-zone" data-field="zone" data-value=${r.zoneId ?? ''}
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
