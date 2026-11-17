import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Rule } from '../model/types';
import type { RuleProblem } from '../model/rules';
import { fieldValue } from './field-value';
import type { RuleTrace } from '../live/rules-feed';
import type { RuleDraft } from './rule-dialog';
import { renderOutsideTrace } from '../render/outside-trace';
import { renderPurposeDialog } from './purpose-dialog';
import { t } from '../i18n';

export interface OutsideDialogOpts {
  draft: RuleDraft;
  /** Devices that can be switched on; illuminance sensors; every device (for names). */
  lights: Device[];
  sensors: Device[];
  deviceById(id: Id): Device | undefined;
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  /** Live trace; only given for a saved unchanged rule. */
  trace: RuleTrace | undefined;
  note: string | null;
  now: number;
  onChange(rule: Rule): void;
  /** A click on a diagram block: its `data-block` (the form field is `OUTSIDE_FOCUS[block] ?? block`). */
  onFocus(field: string): void;
  onOk(): void;
  onCancel(): void;
}

type Outside = NonNullable<Rule['outside']>;

/** The window a newly ticked "Time window" starts with (as the condition rule's Time input). */
const DEFAULT_WINDOW = { from: '17:00', to: '01:00' };

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

/** A checkbox of an optional `true` flag: ticked sets it, unticked drops the key. */
function flag(field: string, key: 'noDataNight' | 'afterSunset', o: Outside, label: string, set: (next: Outside) => void): TemplateResult {
  return html`
    <label class="rnot rcheck"><input type="checkbox" data-field=${field} .checked=${o[key] === true}
      @change=${(e: Event) => {
        const { [key]: _drop, ...rest } = o;
        set((e.target as HTMLInputElement).checked ? { ...rest, [key]: true } : rest);
      }} /> ${label}</label>`;
}

/** The messages under the form: a pick hint per empty select, the rest as the rule dialog words them. */
function problemTexts(o: OutsideDialogOpts): { key: string; text: string }[] {
  const c = o.draft.rule.outside!;
  const hints: { key: string; text: string }[] = [];
  if (!c.light) hints.push({ key: 'pick-light', text: t('outside.problem.light') });
  if (!c.sensor) hints.push({ key: 'pick-sensor', text: t('outside.problem.sensor') });
  const out = [...hints];
  const missing = (c.light && !o.lights.some(d => d.id === c.light)) || (c.sensor && !o.sensors.some(d => d.id === c.sensor));
  const pauseOk = Number.isInteger(c.pause) && c.pause >= 0 && c.pause <= 1440;
  const windowOk = !c.window || (c.window.from !== '' && c.window.to !== '' && c.window.from !== c.window.to);
  for (const p of o.problems) {
    if (p === 'device-missing' && !missing) continue; // only empty picks: the hints say it
    if (p === 'outside' && hints.length > 0 && pauseOk && windowOk) continue;
    out.push({ key: p, text: t(`rules.problem.${p}`) });
  }
  return out;
}

/**
 * The "Outside light" dialog in the purpose-built frame: the light, the daylight sensor, the night options, the
 * optional time window and the pause on the left, the diagram on the right.
 */
export function renderOutsideDialog(o: OutsideDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const c = r.outside!;
  const set = (next: Outside) => o.onChange({ ...r, outside: next });
  const w = c.window;
  const name = (id: Id) => (id === '' ? t('vent.pick') : o.deviceById(id)?.name ?? t('rules.missingDevice'));
  return renderPurposeDialog({
    prefix: 'outside', title: t('outside.title'), hint: t('outside.hint'), rule: r, zones: o.zones, problems: o.problems,
    texts: problemTexts(o), onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
    form: html`
      <label class="rlabel">${t('outside.light')}</label>
      ${pick('outside-light', c.light, o.lights, id => set({ ...c, light: id }))}

      <label class="rlabel">${t('outside.sensor')}</label>
      ${pick('outside-sensor', c.sensor, o.sensors, id => set({ ...c, sensor: id }))}

      ${flag('outside-nodata', 'noDataNight', c, t('outside.noDataNight'), set)}
      ${flag('outside-sunset', 'afterSunset', c, t('outside.afterSunset'), set)}

      <label class="rnot rcheck"><input type="checkbox" data-field="outside-window" .checked=${w !== undefined}
        @change=${(e: Event) => {
          const { window: _w, ...rest } = c;
          set((e.target as HTMLInputElement).checked ? { ...rest, window: { ...DEFAULT_WINDOW } } : rest);
        }} /> ${t('outside.window')}</label>
      ${w ? html`
        <div class="vnums">
          <label>${t('rules.time.from')}
            <input data-field="outside-from" type="time" .value=${fieldValue(w.from)}
              @input=${(e: Event) => set({ ...c, window: { ...w, from: (e.target as HTMLInputElement).value } })} /></label>
          <label>${t('rules.time.to')}
            <input data-field="outside-to" type="time" .value=${fieldValue(w.to)}
              @input=${(e: Event) => set({ ...c, window: { ...w, to: (e.target as HTMLInputElement).value } })} /></label>
        </div>` : nothing}

      <div class="vnums">
        <label>${t('outside.pause')}
          <input class="num" data-field="outside-pause" type="number" min="0" max="1440" step="1"
            .value=${fieldValue(Number.isFinite(c.pause) ? String(c.pause) : '')}
            @input=${(e: Event) => set({ ...c, pause: num((e.target as HTMLInputElement).value) })} /></label>
        <span class="muted">${t('outside.pauseNote')}</span>
      </div>`,
    diagram: renderOutsideTrace({
      rule: r, deviceName: name,
      trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: o.onFocus,
    }),
  });
}
