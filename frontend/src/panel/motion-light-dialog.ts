import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Rule } from '../model/types';
import { RULE_DELAY_MAX, buttonHasAuto, type RuleProblem } from '../model/rules';
import { fieldValue } from './field-value';
import type { RuleTrace } from '../live/rules-feed';
import type { RuleDraft } from './rule-dialog';
import { renderMotionLightTrace } from '../render/motion-light-trace';
import { renderPurposeDialog } from './purpose-dialog';
import { chips } from './leak-dialog';
import { num, pick } from './outside-dialog';
import { t } from '../i18n';

export interface MotionLightDialogOpts {
  draft: RuleDraft;
  /** Devices that can be switched on and off; motion sensors; illuminance sensors; smart buttons and wall switches; every device (for names). */
  lights: Device[];
  sensors: Device[];
  daylightSensors: Device[];
  buttons: Device[];
  deviceById(id: Id): Device | undefined;
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  /** Live trace; only given for a saved unchanged rule. */
  trace: RuleTrace | undefined;
  note: string | null;
  now: number;
  onChange(rule: Rule): void;
  /** A click on a diagram block: its `data-block` (the form field is `motionLightFocus(block)`). */
  onFocus(field: string): void;
  onOk(): void;
  onCancel(): void;
}

type Motion = NonNullable<Rule['motionLight']>;

/** The messages under the form: a pick hint per empty value, the rest as the rule dialog words them. */
function problemTexts(o: MotionLightDialogOpts): { key: string; text: string }[] {
  const r = o.draft.rule, c = r.motionLight!;
  const hints: { key: string; text: string }[] = [];
  if (!c.light) hints.push({ key: 'pick-light', text: t('motionLight.problem.light') });
  const out = [...hints];
  const missing = (c.light && !o.lights.some(d => d.id === c.light)) || c.sensors.some(id => !o.sensors.some(d => d.id === id))
    || c.buttons.some(id => !o.buttons.some(d => d.id === id)) || (c.daylight && !o.daylightSensors.some(d => d.id === c.daylight!.sensor));
  const shapeOk = !c.sensors.includes(c.light) && !c.buttons.includes(c.light)
    && [c.minOn, c.autoAfter].every(Number.isInteger) && c.minOn >= 0 && c.minOn <= 3600 && c.autoAfter >= 0 && c.autoAfter <= 1440;
  for (const p of o.problems) {
    if (p === 'device-missing' && !missing) continue; // only empty values: the hints say it
    if (p === 'motionLight' && hints.length > 0 && shapeOk) continue;
    out.push({ key: p, text: t(`rules.problem.${p}`) });
  }
  return out;
}

/**
 * The "Light motion control" dialog in the purpose-built frame: the light, the motion sensors, the optional daylight
 * sensor, the timings and the buttons on the left, the diagram on the right.
 */
export function renderMotionLightDialog(o: MotionLightDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const c = r.motionLight!;
  const set = (next: Motion) => o.onChange({ ...r, motionLight: next });
  const name = (id: Id) => (id === '' ? t('vent.pick') : o.deviceById(id)?.name ?? t('rules.missingDevice'));
  const field = (key: string, label: string, value: number, min: number, max: number, onInput: (n: number) => void, note?: string) => html`
    <div class="vnums">
      <label>${label}
        <input class="num" data-field=${`motionlight-${key}`} type="number" min=${min} max=${max} step="1"
          .value=${fieldValue(Number.isFinite(value) ? String(value) : '')}
          @input=${(e: Event) => onInput(num((e.target as HTMLInputElement).value))} /></label>
      ${note ? html`<span class="muted">${note}</span>` : nothing}
    </div>`;
  // Buttons, none with an Auto action, and no "Auto again after": after a press nothing returns the rule to auto.
  const noAuto = c.buttons.length > 0 && c.autoAfter === 0 && !c.buttons.some(id => { const b = o.buttons.find(x => x.id === id); return !!b && buttonHasAuto(b); });
  // A chosen wall switch without Auto by double toggle cannot hand the light back to auto.
  const noToggle = c.buttons.some(id => { const b = o.buttons.find(x => x.id === id); return b?.props.kind === 'wall_switch' && !b.props.autoByDoubleToggle; });
  const d = c.daylight;
  const known = !d || o.daylightSensors.some(x => x.id === d.sensor);
  return renderPurposeDialog({
    prefix: 'motionlight', title: t('motionLight.title'), hint: t('motionLight.hint'), rule: r, zones: o.zones, problems: o.problems,
    texts: problemTexts(o), onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
    form: html`
      <label class="rlabel">${t('motionLight.light')}</label>
      ${pick('motionlight-light', c.light, o.lights, id => set({ ...c, light: id }))}

      <label class="rlabel">${t('motionLight.buttons')}</label>
      ${chips(o, 'motionlight-buttons', 'motionlight-button', c.buttons, o.buttons.filter(x => x.id !== c.light), t('motionLight.addButton'), ids => set({ ...c, buttons: ids, ...(ids.length === 0 ? { autoAfter: 0 } : {}) }))}
      <span class="muted">${t('motionLight.buttonsNote')}</span>
      ${noToggle ? html`<span class="muted" data-note="motionlight-nodoubletoggle">${t('motionLight.noDoubleToggle')}</span>` : nothing}

      <label class="rlabel">${t('motionLight.sensors')}</label>
      ${chips(o, 'motionlight-sensors', 'motionlight-sensor', c.sensors, o.sensors, t('motionLight.addSensor'), ids => set({ ...c, sensors: ids }))}
      <span class="muted">${t('motionLight.sensorsNote')}</span>

      <label class="rlabel">${t('motionLight.daylight')}</label>
      <div class="vnums">
        <select data-field="motionlight-daylight" data-value=${d?.sensor ?? ''}
          @change=${(e: Event) => {
            const id = (e.target as HTMLSelectElement).value;
            const { daylight: _drop, ...rest } = c;
            set(id === '' ? rest : { ...rest, daylight: { sensor: id, is: d?.is ?? 'dark' } });
          }}>
          <option value="">${t('motionLight.noDaylight')}</option>
          ${known ? nothing : html`<option value=${d!.sensor}>${t('rules.missingDevice')}</option>`}
          ${o.daylightSensors.map(x => html`<option value=${x.id}>${x.name}</option>`)}
        </select>
        ${d ? html`
          <select data-field="motionlight-is" data-value=${d.is}
            @change=${(e: Event) => set({ ...c, daylight: { ...d, is: (e.target as HTMLSelectElement).value as 'night' | 'dark' } })}>
            <option value="night">${t('motionLight.isNight')}</option>
            <option value="dark">${t('motionLight.isDark')}</option>
          </select>` : nothing}
      </div>

      ${field('off', t('motionLight.off'), r.offDelay, 0, RULE_DELAY_MAX, n => o.onChange({ ...r, offDelay: n }), t('motionLight.offNote'))}
      ${field('minon', t('motionLight.minOn'), c.minOn, 0, 3600, n => set({ ...c, minOn: n }))}

      ${c.buttons.length > 0 ? field('autoafter', t('motionLight.autoAfter'), c.autoAfter, 0, 1440, n => set({ ...c, autoAfter: n }), t('motionLight.autoAfterNote')) : nothing}
      ${noAuto ? html`<p class="muted" data-note="motionlight-noauto">${t('motionLight.noAutoNote')}</p>` : nothing}`,
    diagram: renderMotionLightTrace({
      rule: r, deviceName: name,
      trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: o.onFocus,
    }),
  });
}
