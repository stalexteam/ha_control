import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Rule, Trigger } from '../model/types';
import type { RuleProblem } from '../model/rules';
import { fieldValue } from './field-value';
import type { RuleTrace } from '../live/rules-feed';
import type { RuleDraft } from './rule-dialog';
import { renderTimedTrace } from '../render/timed-trace';
import { renderPurposeDialog } from './purpose-dialog';
import { t } from '../i18n';

export interface TimedDialogOpts {
  draft: RuleDraft;
  /** Wall switch and smart button containers; devices that can be switched on and off; every device (for names). */
  buttons: Device[];
  devices: Device[];
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

/** A trigger as the button sends it: "hold" for slot 0, "1 hold" for button 1. */
const trigger = (tr: Trigger): string => (tr.slot === 0 ? tr.event : `${tr.slot} ${tr.event}`);

/**
 * Which events of a container start and stop a run: a wall switch's on / off; a smart button's on trigger (it toggles
 * without a separate off, which starts a run too) and its off trigger (only with a separate off). Null for anything else.
 */
export function timedEvents(d: Device | undefined): string | null {
  const p = d?.props;
  if (p?.kind === 'wall_switch') return t('timed.events.wall');
  if (p?.kind !== 'smart_button') return null;
  const start = t('timed.events.start').replace('{e}', trigger(p.on));
  return `${start}, ${p.separateOff ? t('timed.events.stop').replace('{e}', trigger(p.off)) : t('timed.events.noStop')}`;
}

const num = (v: string): number => (v.trim() === '' ? NaN : Number(v));

/** A select of devices: the current id stays selectable (as missing) when it is not in the list. */
function pick(field: string, value: Id, list: Device[], onPick: (id: Id) => void): TemplateResult {
  const known = value === '' || list.some(d => d.id === value);
  return html`
    <select data-field=${field} data-value=${value} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value)}>
      <option value="">${t('vent.pick')}</option>
      ${known ? nothing : html`<option value=${value}>${t('rules.missingDevice')}</option>`}
      ${list.map(d => html`<option value=${d.id}>${d.name}</option>`)}
    </select>`;
}

/** The messages under the form: a pick hint per empty select, the rest as the rule dialog words them. */
function problemTexts(o: TimedDialogOpts): { key: string; text: string }[] {
  const tm = o.draft.rule.timed!;
  const hints: { key: string; text: string }[] = [];
  if (!tm.button) hints.push({ key: 'pick-button', text: t('timed.problem.button') });
  if (!tm.device) hints.push({ key: 'pick-device', text: t('timed.problem.device') });
  const out = [...hints];
  const missing = (tm.button && !o.buttons.some(d => d.id === tm.button)) || (tm.device && !o.devices.some(d => d.id === tm.device));
  const minutesOk = Number.isInteger(tm.minutes) && tm.minutes >= 1 && tm.minutes <= 1440;
  for (const p of o.problems) {
    if (p === 'device-missing' && !missing) continue; // only empty picks: the hints say it
    if (p === 'timed' && hints.length > 0 && minutesOk) continue;
    out.push({ key: p, text: t(`rules.problem.${p}`) });
  }
  return out;
}

/**
 * The "Timed switch" dialog in the purpose-built frame: the button (with its start / stop events under it), the
 * device, the duration and Invert on the left, the diagram on the right.
 */
export function renderTimedDialog(o: TimedDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const tm = r.timed!;
  const setTimed = (next: NonNullable<Rule['timed']>) => o.onChange({ ...r, timed: next });
  const events = timedEvents(o.deviceById(tm.button));
  const name = (id: Id) => (id === '' ? t('vent.pick') : o.deviceById(id)?.name ?? t('rules.missingDevice'));
  return renderPurposeDialog({
    prefix: 'timed', title: t('timed.title'), hint: t('timed.hint'), rule: r, zones: o.zones, problems: o.problems,
    texts: problemTexts(o), onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
    form: html`
      <label class="rlabel">${t('timed.button')}</label>
      ${pick('timed-button', tm.button, o.buttons, id => setTimed({ ...tm, button: id }))}
      ${events ? html`<p class="muted" data-note="events">${events}</p>` : nothing}

      <label class="rlabel">${t('timed.device')}</label>
      ${pick('timed-device', tm.device, o.devices, id => setTimed({ ...tm, device: id }))}

      <div class="vnums">
        <label>${t('timed.minutes')}
          <input class="num" data-field="timed-minutes" type="number" min="1" max="1440" step="1"
            .value=${fieldValue(Number.isFinite(tm.minutes) ? String(tm.minutes) : '')}
            @input=${(e: Event) => setTimed({ ...tm, minutes: num((e.target as HTMLInputElement).value) })} /></label>
      </div>
      <label class="rnot rcheck"><input type="checkbox" data-field="timed-invert" .checked=${tm.invert === true}
        @change=${(e: Event) => {
          const { invert: _i, ...rest } = tm;
          setTimed((e.target as HTMLInputElement).checked ? { ...rest, invert: true } : rest);
        }} /> ${t('timed.invert')}</label>`,
    diagram: renderTimedTrace({
      rule: r, deviceName: name, events,
      trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: o.onFocus,
    }),
  });
}
