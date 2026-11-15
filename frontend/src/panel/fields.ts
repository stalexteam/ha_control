import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import { t } from '../i18n';
import { parseWhole, type WholeRule } from '../geometry/parse';

export function row(label: string, field: TemplateResult | string): TemplateResult {
  return html`<label class="row"><span>${label}</span>${field}</label>`;
}

/** Drop-down; a rejected change (`on` returns false) puts the DOM back on the model value. */
export function select<T extends string>(value: T, options: { v: T; label: string }[], on: (v: T) => boolean | void,
  field?: string): TemplateResult {
  return html`<select class="val" data-field=${field ?? nothing} .value=${fieldValue(value)} @change=${(e: Event) => {
    const el = e.target as HTMLSelectElement;
    if (on(el.value as T) === false) el.value = value;
  }}>
    ${options.map(op => html`<option value=${op.v} ?selected=${op.v === value}>${op.label}</option>`)}
  </select>`;
}

export interface NumFieldOpts {
  /** Current model value; null shows an empty field (only with `onBlank`). */
  value: number | null;
  rule: WholeRule;
  /** i18n key of the message for a malformed value. */
  bad: string;
  /** Called with the parsed value; returning false rejects it ("does not fit"). */
  apply(v: number): boolean | void;
  setNotice?(msg: string | null): void;
  field?: string;
  /** An unchanged value is a no-op (no commit); otherwise `apply` runs even for the same number. */
  skipSame?: boolean;
  /** An emptied field clears the value (e.g. an optional radius). */
  onBlank?(): boolean | void;
  placeholder?: string;
}

/**
 * Whole-number text field committing on change. A malformed value reverts it with `bad`; a rejected edit
 * (`apply` returns false) reverts it with "does not fit".
 */
export function numField(o: NumFieldOpts): TemplateResult {
  const shown = o.value === null ? '' : String(Math.round(o.value));
  const notice = (m: string | null) => o.setNotice?.(m);
  return html`<input class="val" type="text" inputmode="numeric" data-field=${o.field ?? nothing}
    placeholder=${o.placeholder ?? nothing} title=${o.placeholder ?? nothing} .value=${fieldValue(shown)}
    @change=${(e: Event) => {
      const el = e.target as HTMLInputElement;
      if (o.onBlank && el.value.trim() === '') {
        if (o.value === null || o.onBlank() !== false) notice(null);
        return;
      }
      const v = parseWhole(el.value, o.rule);
      if (v === null) { el.value = shown; notice(t(o.bad)); return; }
      if (o.skipSame && v === o.value) { notice(null); return; }
      if (o.apply(v) === false) { el.value = shown; notice(t('props.noFit')); return; }
      notice(null);
    }} />`;
}
