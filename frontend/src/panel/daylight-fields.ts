import { html, nothing, type TemplateResult } from 'lit';
import type { Device, DeviceProps } from '../model/types';
import { setDeviceProps } from '../model/devices';
import { DAYLIGHT_DEFAULTS, DEBOUNCE_MAX, debounceOk, luxOk, sunOk, type DaylightProps } from '../model/daylight';
import { fieldValue } from './field-value';
import { numField, row } from './fields';
import type { BindingPropsOpts } from './binding-props';
import { t } from '../i18n';

type Key = keyof DaylightProps;

/** A decimal number as typed: an optional sign, digits, an optional fraction (point or comma); else null. */
export function parseDecimal(s: string): number | null {
  const v = s.trim().replace('−', '-').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : null;
}

/**
 * The illuminance sensor's daylight thresholds after its bindings: lux pair, sun pair and debounce. A field shows the
 * stored value, else its default; a blank field removes the value (the default applies). A broken pair is stored and
 * shows a hint that its defaults apply, so the two fields can be changed in any order. Nothing for other kinds.
 */
export function daylightFields(o: BindingPropsOpts, d: Device): TemplateResult | typeof nothing {
  const p = d.props;
  if (p.kind !== 'illuminance_sensor') return nothing;
  const D = DAYLIGHT_DEFAULTS;
  const set = (key: Key, v: number | undefined): void => {
    if (v === p[key] || (p[key] === undefined && v === D[key])) { o.setFieldNotice(null); return; }
    o.setFieldNotice(null);
    o.commit(setDeviceProps(o.level, d.id, { [key]: v } as Partial<DeviceProps>));
  };
  const decimal = (key: Key, label: string): TemplateResult => {
    const shown = String(p[key] ?? D[key]);
    return row(label, html`<input class="val" type="text" inputmode="decimal" data-field=${key} .value=${fieldValue(shown)}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        if (el.value.trim() === '') { set(key, undefined); return; }
        const v = parseDecimal(el.value);
        if (v === null) { el.value = shown; o.setFieldNotice(t('props.badDecimal')); return; }
        set(key, v);
      }} />`);
  };
  const debounce = row(t('props.debounce'), numField({
    value: p.debounce ?? D.debounce, rule: { min: 0, max: DEBOUNCE_MAX }, bad: 'props.badDebounce', field: 'debounce',
    setNotice: msg => o.setFieldNotice(msg), apply: v => set('debounce', v), onBlank: () => set('debounce', undefined),
  }));
  const note = (key: string, text: string) => html`<p class="warn" data-note=${key}>${text}</p>`;
  return html`<div class="cfields" data-section="daylight">
    ${decimal('nightBelow', t('props.nightBelow'))}
    ${decimal('dayAbove', t('props.dayAbove'))}
    ${luxOk(p.nightBelow, p.dayAbove) ? nothing : note('lux-pair', t('props.badLuxPair')
      .replace('{night}', String(D.nightBelow)).replace('{day}', String(D.dayAbove)))}
    ${decimal('sunNight', t('props.sunNight'))}
    ${decimal('sunDay', t('props.sunDay'))}
    ${sunOk(p.sunNight, p.sunDay) ? nothing : note('sun-pair', t('props.badSunPair')
      .replace('{night}', String(D.sunNight)).replace('{day}', String(D.sunDay)))}
    ${debounce}
    ${debounceOk(p.debounce) ? nothing : note('debounce', t('props.badDebounceStored').replace('{s}', String(D.debounce)))}
  </div>`;
}
