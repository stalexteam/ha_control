import { html, nothing, type TemplateResult } from 'lit';
import type { Device } from '../model/types';
import { setDeviceProps } from '../model/devices';
import { domainOf } from '../binding/ha-meta';
import { numField, row } from './fields';
import type { BindingPropsOpts } from './binding-props';
import { t } from '../i18n';

/** True when the light entity's live state lists a colour mode other than `onoff` (it can dim). No state: false. */
export function supportsBrightness(o: BindingPropsOpts, eid: string): boolean {
  if (domainOf(eid) !== 'light') return false;
  const s = (o.states as Record<string, { attributes?: { supported_color_modes?: unknown } }> | undefined)?.[eid];
  const modes = s?.attributes?.supported_color_modes;
  return Array.isArray(modes) && modes.some(m => m !== 'onoff');
}

/**
 * A light's "Brightness when switched on, %" after its roles: whole 1-100, blank = the lamp's own level (prop removed).
 * Offered only when the control binding is a light entity that can dim. Nothing for other kinds.
 */
export function brightnessFields(o: BindingPropsOpts, d: Device): TemplateResult | typeof nothing {
  const p = d.props;
  if (p.kind !== 'ceiling_light' && p.kind !== 'wall_light') return nothing;
  const eid = d.bindings?.control;
  if (!eid || !supportsBrightness(o, eid)) return nothing;
  const set = (v: number | undefined): void => {
    o.setFieldNotice(null);
    if (v !== p.brightness) o.commit(setDeviceProps(o.level, d.id, { brightness: v }));
  };
  return html`<div class="cfields" data-section="brightness">
    ${row(t('device.brightness'), numField({
      value: p.brightness ?? null, rule: { min: 1, max: 100 }, bad: 'props.badBrightness', field: 'brightness',
      setNotice: msg => o.setFieldNotice(msg), apply: v => set(v), onBlank: () => set(undefined),
    }))}
    <p class="muted" data-note="brightness-hint">${t('device.brightnessHint')}</p>
  </div>`;
}
