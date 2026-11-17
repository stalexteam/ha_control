import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Rule } from '../model/types';
import type { RuleProblem } from '../model/rules';
import { fieldValue } from './field-value';
import type { RuleTrace } from '../live/rules-feed';
import type { RuleDraft } from './rule-dialog';
import { renderVentTrace } from '../render/vent-trace';
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
  /** A click on a diagram block: the `data-field` of its form field. */
  onFocus(field: string): void;
  onOk(): void;
  onCancel(): void;
}

const num = (v: string): number => (v.trim() === '' ? NaN : Number(v));
const shown = (n: number): string => (Number.isFinite(n) ? String(+n.toFixed(4)) : '');

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

/** The messages under the form: a pick hint per empty select, the run-on range, the rest as the rule dialog words them. */
function problemTexts(o: VentDialogOpts): { key: string; text: string }[] {
  const r = o.draft.rule;
  const v = r.vent!;
  const hints: { key: string; text: string }[] = [];
  if (!v.sensor) hints.push({ key: 'pick-sensor', text: t('vent.problem.sensor') });
  if (!v.than) hints.push({ key: 'pick-than', text: t('vent.problem.than') });
  if (!(r.onTrue[0]?.device)) hints.push({ key: 'pick-fan', text: t('vent.problem.fan') });
  const out = [...hints];
  const setIds = [v.sensor, v.than, r.onTrue[0]?.device, r.onFalse[0]?.device].filter((x): x is Id => !!x);
  for (const p of o.problems) {
    if (p === 'device-missing' && !setIds.some(id => !o.deviceById(id)) && !(v.sensor && !o.climateSensors.some(d => d.id === v.sensor))
      && !(v.than && !o.climateSensors.some(d => d.id === v.than))) continue; // only empty picks: the hints say it
    if (p === 'vent' && hints.length > 0) continue;
    out.push({ key: p, text: p === 'delay' ? t('vent.problem.runon') : t(`rules.problem.${p}`) });
  }
  return out;
}

/**
 * The "Wet zone ventilation" dialog in the rule dialog's frame: the form (two climate sensors, the fan, margins,
 * run-on) on the left, the diagram on the right, Zone / Enabled / Cancel / OK in the footer.
 */
export function renderVentDialog(o: VentDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const v = r.vent!;
  const setVent = (p: Partial<typeof v>) => o.onChange({ ...r, vent: { ...v, ...p } });
  const fan = r.onTrue[0]?.device ?? '';
  const zoneKnown = r.zoneId === null || o.zones.some(z => z.id === r.zoneId);
  const title = t('vent.title');
  const texts = problemTexts(o);
  return html`
    <div class="backdrop rule-backdrop" @change=${(e: Event) => e.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${title}>
        <h3>${title}</h3>
        <div class="rcols">
          <div class="rsettings">
            <p class="muted">${t('vent.hint')}</p>
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
                <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${fieldValue(shown(v.above))}
                  @input=${(e: Event) => setVent({ above: num((e.target as HTMLInputElement).value) })} /></label>
              <label>${t('vent.below')}
                <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${fieldValue(shown(v.below))}
                  @input=${(e: Event) => setVent({ below: num((e.target as HTMLInputElement).value) })} /></label>
              <label>${t('vent.runon')}
                <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${fieldValue(shown(r.offDelay / 60))}
                  @input=${(e: Event) => o.onChange({ ...r, offDelay: Math.round(num((e.target as HTMLInputElement).value)) * 60 })} /></label>
            </div>
          </div>
          ${renderVentTrace({
            rule: r, deviceName: id => (id === '' ? t('vent.pick') : o.deviceById(id)?.name ?? t('rules.missingDevice')),
            trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: o.onFocus,
          })}
        </div>
        ${texts.length > 0 ? html`<ul class="rproblems" role="alert">
          ${texts.map(p => html`<li data-problem=${p.key}>${p.text}</li>`)}</ul>` : nothing}
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
