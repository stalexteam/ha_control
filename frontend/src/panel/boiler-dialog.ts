import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Rule } from '../model/types';
import { BOILER_LIMIT, BOILER_NOMINAL, type RuleProblem } from '../model/rules';
import { fieldValue } from './field-value';
import type { RuleTrace } from '../live/rules-feed';
import type { RuleDraft } from './rule-dialog';
import { renderBoilerTrace } from '../render/boiler-trace';
import { renderPurposeDialog } from './purpose-dialog';
import { t } from '../i18n';

/** A grid block of the edited Power schematic that has a power entity. */
export interface BoilerGrid { id: Id; name: string }

export interface BoilerDialogOpts {
  draft: RuleDraft;
  /** Devices with control and power bindings; wall switch and smart button containers; grid blocks with power. */
  boilers: Device[];
  buttons: Device[];
  grids: BoilerGrid[];
  /** Every device (for names). */
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

/** A select of ids: the current id stays selectable (as `missing`) when it is not in the list. */
function pick(field: string, value: Id, list: { id: Id; name: string }[], missing: string, onPick: (id: Id) => void): TemplateResult {
  const known = value === '' || list.some(d => d.id === value);
  return html`
    <select data-field=${field} data-value=${value} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value)}>
      <option value="">${t('vent.pick')}</option>
      ${known ? nothing : html`<option value=${value}>${missing}</option>`}
      ${list.map(d => html`<option value=${d.id}>${d.name}</option>`)}
    </select>`;
}

/** The messages under the form: a pick hint per empty select, the rest as the rule dialog words them. */
function problemTexts(o: BoilerDialogOpts): { key: string; text: string }[] {
  const b = o.draft.rule.boiler!;
  const hints: { key: string; text: string }[] = [];
  if (!b.device) hints.push({ key: 'pick-device', text: t('boiler.problem.device') });
  if (!b.button) hints.push({ key: 'pick-button', text: t('boiler.problem.button') });
  if (b.grid && !b.grid.block) hints.push({ key: 'pick-grid', text: t('boiler.problem.grid') });
  const out = [...hints];
  const missing = (b.device && !o.boilers.some(d => d.id === b.device)) || (b.button && !o.buttons.some(d => d.id === b.button))
    || (b.grid?.block && !o.grids.some(g => g.id === b.grid!.block));
  for (const p of o.problems) {
    if (p === 'device-missing' && !missing) continue; // only empty picks: the hints say it
    if (p === 'boiler' && hints.length > 0) continue;
    out.push({ key: p, text: t(`rules.problem.${p}`) });
  }
  return out;
}

/**
 * The "Boiler" dialog in the purpose-built frame: the form (boiler, button, the optional power limit with its grid
 * block, limit and boiler power) on the left, the diagram on the right.
 */
export function renderBoilerDialog(o: BoilerDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const b = r.boiler!;
  const g = b.grid;
  const setBoiler = (next: NonNullable<Rule['boiler']>) => o.onChange({ ...r, boiler: next });
  const setGrid = (p: Partial<NonNullable<typeof g>>) => g && setBoiler({ ...b, grid: { ...g, ...p } });
  const toggleLimit = (on: boolean) => {
    const { grid: _g, ...rest } = b;
    setBoiler(on ? { ...rest, grid: { block: o.grids.length === 1 ? o.grids[0].id : '', limit: BOILER_LIMIT, nominal: BOILER_NOMINAL } } : rest);
  };
  const missingDevice = (id: Id) => o.deviceById(id)?.name ?? t('rules.missingDevice');
  const name = (id: Id) => (id === '' ? t('vent.pick') : o.deviceById(id)?.name ?? t('rules.missingDevice'));
  return renderPurposeDialog({
    prefix: 'boiler', title: t('boiler.title'), hint: t('boiler.hint'), rule: r, zones: o.zones, problems: o.problems,
    texts: problemTexts(o), onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
    form: html`
      <label class="rlabel">${t('boiler.device')}</label>
      ${pick('boiler-device', b.device, o.boilers, missingDevice(b.device), id => setBoiler({ ...b, device: id }))}

      <label class="rlabel">${t('boiler.button')}</label>
      ${pick('boiler-button', b.button, o.buttons, missingDevice(b.button), id => setBoiler({ ...b, button: id }))}

      <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!g}
        @change=${(e: Event) => toggleLimit((e.target as HTMLInputElement).checked)} /> ${t('boiler.limitOn')}</label>
      ${g ? html`
        <label class="rlabel">${t('boiler.grid')}</label>
        ${pick('boiler-grid', g.block, o.grids, t('boiler.missingGrid'), id => setGrid({ block: id }))}
        <div class="vnums">
          <label>${t('boiler.limit')}
            <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${fieldValue(shown(g.limit))}
              @input=${(e: Event) => setGrid({ limit: num((e.target as HTMLInputElement).value) })} /></label>
          <label>${t('boiler.nominal')}
            <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${fieldValue(shown(g.nominal))}
              @input=${(e: Event) => setGrid({ nominal: num((e.target as HTMLInputElement).value) })} /></label>
        </div>` : nothing}`,
    diagram: renderBoilerTrace({
      rule: r, deviceName: name,
      gridName: id => (id === '' ? t('vent.pick') : o.grids.find(x => x.id === id)?.name ?? t('boiler.missingGrid')),
      trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: o.onFocus,
    }),
  });
}
