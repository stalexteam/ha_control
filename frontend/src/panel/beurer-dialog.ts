import { html, type TemplateResult } from 'lit';
import type { Device, Id, Rule } from '../model/types';
import type { RuleProblem } from '../model/rules';
import { fieldValue } from './field-value';
import type { RuleTrace } from '../live/rules-feed';
import type { RuleDraft } from './rule-dialog';
import { renderBeurerTrace } from '../render/beurer-trace';
import { renderPurposeDialog } from './purpose-dialog';
import { num, pick } from './outside-dialog';
import { t } from '../i18n';

export interface BeurerDialogOpts {
  draft: RuleDraft;
  /** Devices that can be switched on; devices with a Power binding; every device (for names). */
  heaters: Device[];
  sources: Device[];
  deviceById(id: Id): Device | undefined;
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  /** Live trace; only given for a saved unchanged rule. */
  trace: RuleTrace | undefined;
  note: string | null;
  now: number;
  onChange(rule: Rule): void;
  /** A click on a diagram block: its `data-block` (the form field is `BEURER_FOCUS[block] ?? block`). */
  onFocus(field: string): void;
  onOk(): void;
  onCancel(): void;
}

type Beurer = NonNullable<Rule['beurer']>;

/** The messages under the form: a pick hint per empty select, the rest as the rule dialog words them. */
function problemTexts(o: BeurerDialogOpts): { key: string; text: string }[] {
  const r = o.draft.rule, c = r.beurer!;
  const hints: { key: string; text: string }[] = [];
  if (!c.heater) hints.push({ key: 'pick-heater', text: t('beurer.problem.heater') });
  if (!c.source) hints.push({ key: 'pick-source', text: t('beurer.problem.source') });
  const out = [...hints];
  const missing = (c.heater && !o.heaters.some(d => d.id === c.heater)) || (c.source && !o.sources.some(d => d.id === c.source));
  const numsOk = Number.isFinite(c.above) && c.above > 0 && [c.keep, c.every].every(n => Number.isInteger(n) && n >= 0 && n <= 1440);
  for (const p of o.problems) {
    if (p === 'device-missing' && !missing) continue; // only empty picks: the hints say it
    if (p === 'beurer' && hints.length > 0 && numsOk) continue;
    out.push({ key: p, text: t(`rules.problem.${p}`) });
  }
  return out;
}

/**
 * The "Beurer heater" dialog in the purpose-built frame: the heater, the power source, the threshold, the off delay,
 * the keep time and the re-power interval on the left, the diagram on the right.
 */
export function renderBeurerDialog(o: BeurerDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const c = r.beurer!;
  const set = (next: Beurer) => o.onChange({ ...r, beurer: next });
  const name = (id: Id) => (id === '' ? t('vent.pick') : o.deviceById(id)?.name ?? t('rules.missingDevice'));
  const field = (key: string, label: string, value: number, min: number, max: number, onInput: (n: number) => void, note?: string) => html`
    <div class="vnums">
      <label>${label}
        <input class="num" data-field=${`beurer-${key}`} type="number" min=${min} max=${max} step="1"
          .value=${fieldValue(Number.isFinite(value) ? String(value) : '')}
          @input=${(e: Event) => onInput(num((e.target as HTMLInputElement).value))} /></label>
      ${note ? html`<span class="muted">${note}</span>` : ''}
    </div>`;
  return renderPurposeDialog({
    prefix: 'beurer', title: t('beurer.title'), hint: t('beurer.hint'), rule: r, zones: o.zones, problems: o.problems,
    texts: problemTexts(o), onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
    form: html`
      <label class="rlabel">${t('beurer.heater')}</label>
      ${pick('beurer-heater', c.heater, o.heaters, id => set({ ...c, heater: id }))}

      <label class="rlabel">${t('beurer.source')}</label>
      ${pick('beurer-source', c.source, o.sources.filter(d => d.id !== c.heater), id => set({ ...c, source: id }))}

      ${field('above', t('beurer.above'), c.above, 1, 100000, n => set({ ...c, above: n }))}
      ${field('off', t('beurer.off'), r.offDelay, 0, 86400, n => o.onChange({ ...r, offDelay: n }))}
      ${field('keep', t('beurer.keep'), c.keep, 0, 1440, n => set({ ...c, keep: n }))}
      ${field('every', t('beurer.every'), c.every, 0, 1440, n => set({ ...c, every: n }), t('beurer.everyNote'))}`,
    diagram: renderBeurerTrace({
      rule: r, deviceName: name,
      trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: o.onFocus,
    }),
  });
}
