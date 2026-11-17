import { html, type TemplateResult } from 'lit';
import type { Device, Id, Rule } from '../model/types';
import type { RuleProblem } from '../model/rules';
import type { RuleTrace } from '../live/rules-feed';
import type { RuleDraft } from './rule-dialog';
import { renderLeakTrace } from '../render/leak-trace';
import { renderPurposeDialog } from './purpose-dialog';
import { t } from '../i18n';

export interface LeakDialogOpts {
  draft: RuleDraft;
  /** Leak sensor and valve devices of the plan; every device (for names). */
  sensors: Device[];
  valves: Device[];
  deviceById(id: Id): Device | undefined;
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  /** Live trace; only given for a saved unchanged rule. */
  trace: RuleTrace | undefined;
  note: string | null;
  now: number;
  onChange(rule: Rule): void;
  /** A click on a diagram block: its `data-block` (see `leakFocus`). */
  onFocus(field: string): void;
  onOk(): void;
  onCancel(): void;
}

/**
 * One list of the rule (sensors or valves): a chip per id (marked when it is not a device of `list`; the x removes it),
 * then the add select with the devices of `list` not yet in it. The select carries `data-field` (the diagram focuses it);
 * the chip of the block last clicked in the diagram is highlighted.
 */
function chips(o: LeakDialogOpts, field: string, ids: Id[], list: Device[], addText: string, onSet: (ids: Id[]) => void): TemplateResult {
  const name = (id: Id) => o.deviceById(id)?.name ?? t('rules.missingDevice');
  const focused = o.draft.focused;
  return html`
    <div class="rsources" data-group=${field}>
      ${ids.map(id => html`
        <span class="rchip${list.some(d => d.id === id) ? '' : ' bad'}${focused === `${field.slice(0, -1)}:${id}` ? ' hl' : ''}"
          data-id=${id}>${name(id)}
          <button class="btn" data-action="remove" title=${t('leak.remove')}
            @click=${() => onSet(ids.filter(x => x !== id))}>&times;</button></span>`)}
      <select class="radd" data-field=${field} .value=${''}
        @change=${(e: Event) => {
          const sel = e.target as HTMLSelectElement;
          const id = sel.value;
          sel.value = '';
          if (id) onSet([...ids, id]);
        }}>
        <option value="">${addText}</option>
        ${list.filter(d => !ids.includes(d.id)).map(d => html`<option value=${d.id}>${d.name}</option>`)}
      </select>
    </div>`;
}

/** The messages under the form: a hint per empty list, the rest as the rule dialog words them. */
function problemTexts(o: LeakDialogOpts): { key: string; text: string }[] {
  const l = o.draft.rule.leak!;
  const hints: { key: string; text: string }[] = [];
  if (l.sensors.length === 0) hints.push({ key: 'pick-sensors', text: t('leak.problem.sensors') });
  if (l.valves.length === 0) hints.push({ key: 'pick-valves', text: t('leak.problem.valves') });
  const out = [...hints];
  for (const p of o.problems) {
    if (p === 'leak' && hints.length > 0) continue;
    out.push({ key: p, text: t(`rules.problem.${p}`) });
  }
  return out;
}

/**
 * The "Leak protection" dialog in the purpose-built frame: the leak sensors and the valves as chips with an add select
 * on the left, the diagram on the right.
 */
export function renderLeakDialog(o: LeakDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const l = r.leak!;
  return renderPurposeDialog({
    prefix: 'leak', title: t('leak.title'), hint: t('leak.hint'), rule: r, zones: o.zones, problems: o.problems,
    texts: problemTexts(o), onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
    form: html`
      <label class="rlabel">${t('leak.sensors')}</label>
      ${chips(o, 'leak-sensors', l.sensors, o.sensors, t('leak.addSensor'), ids => o.onChange({ ...r, leak: { ...l, sensors: ids } }))}
      <label class="rlabel">${t('leak.valves')}</label>
      ${chips(o, 'leak-valves', l.valves, o.valves, t('leak.addValve'), ids => o.onChange({ ...r, leak: { ...l, valves: ids } }))}`,
    diagram: renderLeakTrace({
      rule: r, deviceName: id => o.deviceById(id)?.name ?? t('rules.missingDevice'),
      trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: o.onFocus,
    }),
  });
}
