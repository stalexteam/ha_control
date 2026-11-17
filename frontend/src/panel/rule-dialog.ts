import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Rule, RuleAction, RuleDo, RuleInput, RuleSource } from '../model/types';
import type { RuleProblem } from '../model/rules';
import { ruleActionsFor, RULE_DELAY_MAX } from '../model/rules';
import type { RuleTrace } from '../live/rules-feed';
import { renderRuleTrace, fieldOf, paramText, type FocusTarget } from '../render/rule-trace';
import { t } from '../i18n';

/** The rule being edited and the dialog's own UI state; the panel keeps it while the dialog is open. */
export interface RuleDraft {
  rule: Rule;
  isNew: boolean;
  /** `data-field` last focused (highlighted). */
  focused: string | null;
  /** Duration unit chosen per Held row (by `data-field`); until chosen it follows the value. */
  units?: Record<string, DurationUnit>;
}

export type DurationUnit = 's' | 'min' | 'h';
const UNIT_SECONDS: Record<DurationUnit, number> = { s: 1, min: 60, h: 3600 };
const UNITS: DurationUnit[] = ['s', 'min', 'h'];

/** The biggest unit that shows the seconds as a whole number. */
function naturalUnit(sec: number): DurationUnit {
  return Number.isInteger(sec) && sec > 0 && sec % 3600 === 0 ? 'h' : Number.isInteger(sec) && sec > 0 && sec % 60 === 0 ? 'min' : 's';
}

export interface RuleDialogOpts {
  draft: RuleDraft;
  /** Plan devices that can be inputs / action targets, and every device (for names and existence). */
  inputDevices: Device[];
  /** Illuminance sensors (Daylight and old Light level inputs) and the unit their bound entity reports (undefined = unknown). */
  lightSensors: Device[];
  lightUnit(deviceId: Id): string | undefined;
  actionDevices: Device[];
  deviceById(id: Id): Device | undefined;
  /** Other rules that can be inputs (the edited rule excluded) and every rule (for names). */
  otherRules: Rule[];
  ruleName(id: Id): string | undefined;
  /** Zones of every level: id and display name. */
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  trace: RuleTrace | undefined;
  note: string | null;
  now: number;
  onChange(rule: Rule): void;
  onFocus(field: string): void;
  onUnit(field: string, unit: DurationUnit): void;
  onOk(): void;
  onCancel(): void;
}

const NAN_SAFE = (n: number): string => (Number.isFinite(n) ? String(n) : '');

/** The text of a delay field: whole seconds; anything else becomes NaN, which `ruleProblems` reports. */
function seconds(v: string): number {
  return v.trim() === '' ? NaN : Number(v);
}

const sourceName = (o: RuleDialogOpts, s: { device: Id } | { rule: Id }): string =>
  'device' in s ? o.deviceById(s.device)?.name ?? t('rules.missingDevice') : o.ruleName(s.rule) ?? t('rules.missingRule');

function inputName(o: RuleDialogOpts, i: RuleInput): string {
  const s = i.source;
  if ('device' in s || 'rule' in s) return sourceName(o, s);
  if ('light' in s) return o.deviceById(s.light)?.name ?? t('rules.light.noSensor');
  if ('daylight' in s) return o.deviceById(s.daylight)?.name ?? t('rules.light.noSensor');
  if ('sun' in s) return t('rules.src.sun');
  if ('time' in s) return t('rules.src.time');
  return s.held.sources.length === 0 ? t('rules.src.held') : `${t('rules.src.held')}: ${s.held.sources.map(x => sourceName(o, x)).join(', ')}`;
}

const sourceMissing = (o: RuleDialogOpts, s: { device: Id } | { rule: Id }): boolean =>
  'device' in s ? !o.deviceById(s.device) : o.ruleName(s.rule) === undefined;

function isMissing(o: RuleDialogOpts, s: RuleSource): boolean {
  if ('device' in s || 'rule' in s) return sourceMissing(o, s);
  if ('light' in s) return s.light !== '' && !o.deviceById(s.light);
  if ('daylight' in s) return s.daylight !== '' && !o.deviceById(s.daylight);
  if ('held' in s) return s.held.sources.some(x => sourceMissing(o, x));
  return false;
}

/** The new source for an "Add input..." / "Set gate..." choice: `d:<id>`, `r:<id>` or a type word. */
function newSource(o: RuleDialogOpts, v: string): RuleSource | null {
  if (v.startsWith('r:')) return { rule: v.slice(2) };
  if (v.startsWith('d:')) return { device: v.slice(2) };
  if (v === 'daylight') return { daylight: o.lightSensors[0]?.id ?? '', is: 'night' };
  if (v === 'sun') return { sun: true };
  if (v === 'time') return { time: { from: '17:00', to: '01:00' } };
  if (v === 'held') return { held: { sources: [], state: 'any', seconds: 1800 } };
  return null;
}

/** The device and rule options of a select (a Held source or an input). */
function deviceRuleOptions(o: RuleDialogOpts): TemplateResult {
  return html`
    <optgroup label=${t('rules.groupDevices')}>
      ${o.inputDevices.map(d => html`<option value=${`d:${d.id}`}>${d.name}</option>`)}
    </optgroup>
    ${o.otherRules.length > 0 ? html`<optgroup label=${t('rules.groupRules')}>
      ${o.otherRules.map(x => html`<option value=${`r:${x.id}`}>${x.name}</option>`)}
    </optgroup>` : nothing}`;
}

/**
 * The options of an add-input / set-gate select: devices, rules, then the four condition types. The old Light level is
 * not offered (Daylight replaces it); existing Light level inputs still show and edit.
 */
function sourceOptions(o: RuleDialogOpts, placeholder: string): TemplateResult {
  return html`
    <option value="">${placeholder}</option>
    ${deviceRuleOptions(o)}
    <optgroup label=${t('rules.groupConditions')}>
      ${(['daylight', 'sun', 'time', 'held'] as const).map(k => html`<option value=${k}>${t(`rules.src.${k}`)}</option>`)}
    </optgroup>`;
}

function actionRow(o: RuleDialogOpts, side: 'true' | 'false', k: number, a: RuleAction): TemplateResult {
  const r = o.draft.rule;
  const key = side === 'true' ? 'onTrue' : 'onFalse';
  const list = r[key];
  const set = (next: RuleAction[]) => o.onChange({ ...r, [key]: next });
  const dev = o.deviceById(a.device);
  const takes = dev ? ruleActionsFor(dev) : [];
  const acts: RuleDo[] = takes.includes(a.do) ? takes : [...takes, a.do]; // a stale action stays visible (and flagged)
  const field = fieldOf({ action: side, index: k });
  return html`
    <div class="rline" data-field=${field} tabindex="-1">
      <select class="grow" data-part="device" data-value=${a.device}
        @change=${(e: Event) => {
          const d = o.deviceById((e.target as HTMLSelectElement).value);
          if (d) set(list.map((x, j) => (j === k ? { device: d.id, do: ruleActionsFor(d).includes(x.do) ? x.do : ruleActionsFor(d)[0] } : x)));
        }}>
        ${dev && !o.actionDevices.includes(dev) ? html`<option value=${dev.id}>${dev.name}</option>` : nothing}
        ${dev ? nothing : html`<option value=${a.device}>${t('rules.missingDevice')}</option>`}
        ${o.actionDevices.map(d => html`<option value=${d.id}>${d.name}</option>`)}
      </select>
      <select data-part="do" data-value=${a.do}
        @change=${(e: Event) => set(list.map((x, j) => (j === k ? { ...x, do: (e.target as HTMLSelectElement).value as RuleDo } : x)))}>
        ${acts.map(d => html`<option value=${d}>${t(`rules.act.${d}`)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${t('rules.remove')} @click=${() => set(list.filter((_, j) => j !== k))}>&times;</button>
    </div>`;
}

function actionList(o: RuleDialogOpts, side: 'true' | 'false'): TemplateResult {
  const r = o.draft.rule;
  const key = side === 'true' ? 'onTrue' : 'onFalse';
  return html`
    <div class="rgroup">
      <div class="rlabel">${t(side === 'true' ? 'rules.whenTrue' : 'rules.whenFalse')}</div>
      ${r[key].map((a, k) => actionRow(o, side, k, a))}
      <select class="radd" data-action=${`add-action-${side}`} .value=${''}
        @change=${(e: Event) => {
          const sel = e.target as HTMLSelectElement;
          const d = o.deviceById(sel.value);
          sel.value = '';
          if (d && ruleActionsFor(d).length > 0) o.onChange({ ...r, [key]: [...r[key], { device: d.id, do: ruleActionsFor(d)[0] }] });
        }}>
        <option value="">${t('rules.addAction')}</option>
        ${o.actionDevices.map(d => html`<option value=${d.id}>${d.name}</option>`)}
      </select>
    </div>`;
}

const num = (v: string): number => (v.trim() === '' ? NaN : Number(v));

/** An illuminance sensor select (`part` names it); a sensor no longer among them shows as its name or "Pick a light sensor". */
function sensorSelect(o: RuleDialogOpts, part: string, id: string, set: (id: string) => void): TemplateResult {
  return html`<select data-part=${part} data-value=${id} @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>
    ${o.lightSensors.some(d => d.id === id) ? nothing : html`<option value=${id}>${o.deviceById(id)?.name ?? t('rules.light.noSensor')}</option>`}
    ${o.lightSensors.map(d => html`<option value=${d.id}>${d.name}</option>`)}
  </select>`;
}

const DAYLIGHT_IS = ['night', 'dark', 'day'] as const;

/** The parameter fields of a Daylight / Light / Time / Held input; `set` replaces the source. */
function params(o: RuleDialogOpts, field: string, s: RuleSource, set: (s: RuleSource) => void): TemplateResult | typeof nothing {
  if ('daylight' in s) {
    return html`
      <div class="rparams">
        <label class="grow">${t('rules.daylight.sensor')} ${sensorSelect(o, 'daylight', s.daylight, id => set({ ...s, daylight: id }))}</label>
        <select data-part="is" data-value=${s.is}
          @change=${(e: Event) => set({ ...s, is: (e.target as HTMLSelectElement).value as typeof s.is })}>
          ${DAYLIGHT_IS.map(v => html`<option value=${v}>${t(`rules.daylight.is.${v}`)}</option>`)}
        </select>
      </div>`;
  }
  if ('light' in s) {
    const unit = s.light === '' ? undefined : o.lightUnit(s.light);
    return html`
      <div class="rparams">
        <label class="grow">${t('rules.light.sensor')}
          ${sensorSelect(o, 'light', s.light, id => set({ ...s, light: id }))}</label>
        <label>${t('rules.light.below')}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${NAN_SAFE(s.below)}
            @input=${(e: Event) => set({ ...s, below: num((e.target as HTMLInputElement).value) })} /> lx</label>
        <label>${t('rules.light.hysteresis')}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${NAN_SAFE(s.hysteresis)}
            @input=${(e: Event) => set({ ...s, hysteresis: num((e.target as HTMLInputElement).value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${s.unknownDark === true}
            @change=${(e: Event) => {
              const { unknownDark: _drop, ...rest } = s;
              set((e.target as HTMLInputElement).checked ? { ...rest, unknownDark: true } : rest);
            }} /> ${t('rules.light.unknownDark')}</label>
        ${unit !== undefined && unit !== 'lx' ? html`<p class="rwarn" data-warn="light-unit">${t('rules.light.unit').replace('{unit}', unit)}</p>` : nothing}
      </div>`;
  }
  if ('time' in s) {
    return html`
      <div class="rparams">
        <label>${t('rules.time.from')}
          <input data-part="from" type="time" .value=${s.time.from}
            @input=${(e: Event) => set({ time: { ...s.time, from: (e.target as HTMLInputElement).value } })} /></label>
        <label>${t('rules.time.to')}
          <input data-part="to" type="time" .value=${s.time.to}
            @input=${(e: Event) => set({ time: { ...s.time, to: (e.target as HTMLInputElement).value } })} /></label>
      </div>`;
  }
  if ('held' in s) {
    const h = s.held;
    const unit = o.draft.units?.[field] ?? naturalUnit(h.seconds);
    const shown = Number.isFinite(h.seconds) ? String(+(h.seconds / UNIT_SECONDS[unit]).toFixed(4)) : '';
    const setHeld = (p: Partial<typeof h>) => set({ held: { ...h, ...p } });
    return html`
      <div class="rparams">
        <div class="rsources">
          ${h.sources.length === 0 ? html`<span class="muted">${t('rules.held.noSources')}</span>` : nothing}
          ${h.sources.map((x, j) => html`
            <span class="rchip${sourceMissing(o, x) ? ' bad' : ''}" data-part="source">${sourceName(o, x)}
              <button class="btn" data-action="remove-source" title=${t('rules.held.removeSource')}
                @click=${() => setHeld({ sources: h.sources.filter((_, m) => m !== j) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${''}
            @change=${(e: Event) => {
              const sel = e.target as HTMLSelectElement;
              const x = newSource(o, sel.value);
              sel.value = '';
              if (x && ('device' in x || 'rule' in x)) setHeld({ sources: [...h.sources, x] });
            }}>
            <option value="">${t('rules.held.addSource')}</option>
            ${deviceRuleOptions(o)}
          </select>
        </div>
        <label>${t('rules.held.state')}
          <select data-part="state" data-value=${h.state}
            @change=${(e: Event) => setHeld({ state: (e.target as HTMLSelectElement).value as 'on' | 'off' | 'any' })}>
            ${(['on', 'off', 'any'] as const).map(v => html`<option value=${v}>${t(`rules.held.${v}`)}</option>`)}
          </select></label>
        <label>${t('rules.held.for')}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${shown}
            @input=${(e: Event) => {
              if (o.draft.units?.[field] === undefined) o.onUnit(field, unit); // the unit stays what is shown until picked
              setHeld({ seconds: Math.round(num((e.target as HTMLInputElement).value) * UNIT_SECONDS[unit]) });
            }} />
          <select data-part="unit" data-value=${unit} @change=${(e: Event) => o.onUnit(field, (e.target as HTMLSelectElement).value as DurationUnit)}>
            ${UNITS.map(u => html`<option value=${u}>${t(`rules.unit.${u}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return nothing;
}

/**
 * One input row (also the gate's): its name or type, NOT (not for Daylight: night / dark / day cover it), remove, and the
 * fields of its type. `set(null)` removes it.
 */
function inputRow(o: RuleDialogOpts, i: RuleInput, field: string, set: (i: RuleInput | null) => void): TemplateResult {
  const s = i.source;
  const typed = !('device' in s || 'rule' in s);
  const type = 'light' in s ? 'light' : 'daylight' in s ? 'daylight' : 'sun' in s ? 'sun' : 'time' in s ? 'time' : 'held';
  return html`
    <div class="rline${isMissing(o, s) ? ' bad' : ''}" data-field=${field} tabindex="-1">
      <span class="grow">${typed ? t(`rules.src.${type}`) : inputName(o, i)}${'sun' in s ? html` <span class="muted">${i.not ? t('rules.sun.above') : paramText(s)}</span>` : nothing}</span>
      ${'daylight' in s && !i.not ? nothing : html`<label class="rnot"><input type="checkbox" data-part="not" .checked=${i.not === true}
        @change=${(e: Event) => {
          const on = (e.target as HTMLInputElement).checked;
          const { not: _n, ...rest } = i;
          set(on ? { ...rest, not: true as const } : rest);
        }} /> ${t('rules.not')}</label>`}
      <button class="btn" data-action="remove-input" title=${t('rules.remove')} @click=${() => set(null)}>&times;</button>
      ${params(o, field, s, src => set({ ...i, source: src }))}
    </div>`;
}

function settings(o: RuleDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const picker = (apply: (source: RuleSource) => void) => (e: Event) => {
    const sel = e.target as HTMLSelectElement;
    const source = sel.value ? newSource(o, sel.value) : null;
    sel.value = '';
    if (source) apply(source);
  };
  const setGate = (i: RuleInput | null) => {
    const { gate: _g, ...rest } = r;
    o.onChange(i ? { ...rest, gate: i } : rest);
  };
  return html`
    <div class="rsettings">
      <label class="rlabel" for="rule-name">${t('rules.name')}</label>
      <input id="rule-name" data-field="name" type="text" .value=${r.name} placeholder=${t('rules.namePlaceholder')}
        @input=${(e: Event) => o.onChange({ ...r, name: (e.target as HTMLInputElement).value })} />

      <label class="rlabel" for="rule-combine">${t('rules.combine')}</label>
      <select id="rule-combine" data-field="combine" data-value=${r.combine}
        @change=${(e: Event) => o.onChange({ ...r, combine: (e.target as HTMLSelectElement).value === 'all' ? 'all' : 'any' })}>
        <option value="any">${t('rules.combine.any')}</option>
        <option value="all">${t('rules.combine.all')}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${t('rules.inputs')}</div>
        ${r.inputs.length === 0 ? html`<p class="muted">${t('rules.noInputs')}</p>` : r.inputs.map((i, k) => inputRow(o, i, fieldOf({ input: k }),
          next => o.onChange({ ...r, inputs: next ? r.inputs.map((x, j) => (j === k ? next : x)) : r.inputs.filter((_, j) => j !== k) })))}
        <select class="radd" data-action="add-input" .value=${''} @change=${picker(source => o.onChange({ ...r, inputs: [...r.inputs, { source }] }))}>
          ${sourceOptions(o, t('rules.addInput'))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${t('rules.delays')}</div>
        <div class="rline">
          <label class="grow">${t('rules.onDelay')}
            <input class="num" data-part="on-delay" type="number" min="0" max=${RULE_DELAY_MAX} step="1" .value=${NAN_SAFE(r.onDelay)}
              @input=${(e: Event) => o.onChange({ ...r, onDelay: seconds((e.target as HTMLInputElement).value) })} /></label>
          <label class="grow">${t('rules.offDelay')}
            <input class="num" data-part="off-delay" type="number" min="0" max=${RULE_DELAY_MAX} step="1" .value=${NAN_SAFE(r.offDelay)}
              @input=${(e: Event) => o.onChange({ ...r, offDelay: seconds((e.target as HTMLInputElement).value) })} /></label>
        </div>
      </div>

      <div class="rgroup">
        <div class="rlabel">${t('rules.gate')}</div>
        <p class="muted">${t('rules.gate.hint')}</p>
        ${r.gate
          ? inputRow(o, r.gate, fieldOf('gate-input'), setGate)
          : html`<select class="radd" data-action="set-gate" .value=${''} @change=${picker(source => setGate({ source }))}>
            ${sourceOptions(o, t('rules.gate.set'))}
          </select>`}
      </div>

      ${actionList(o, 'true')}
      ${actionList(o, 'false')}
    </div>`;
}

/** The rule dialog: settings on the left, the live flowchart on the right, Zone / Enabled / Cancel / OK in the footer. */
export function renderRuleDialog(o: RuleDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const zoneKnown = r.zoneId === null || o.zones.some(z => z.id === r.zoneId);
  const focus = (target: FocusTarget) => o.onFocus(fieldOf(target));
  return html`
    <div class="backdrop rule-backdrop" @change=${(e: Event) => e.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${t(o.draft.isNew ? 'rules.dialog.new' : 'rules.dialog.edit')}>
        <h3>${t(o.draft.isNew ? 'rules.dialog.new' : 'rules.dialog.edit')}</h3>
        <div class="rcols">
          ${settings(o)}
          ${renderRuleTrace({
            rule: r, inputName: i => inputName(o, i), actionName: id => o.deviceById(id)?.name ?? t('rules.missingDevice'),
            trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: focus,
          })}
        </div>
        ${o.problems.length > 0 ? html`<ul class="rproblems" role="alert">
          ${o.problems.map(p => html`<li data-problem=${p}>${t(`rules.problem.${p}`)}</li>`)}</ul>` : nothing}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${t('rules.zone')}</label>
          <select id="rule-zone" data-field="zone" data-value=${r.zoneId ?? ''}
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
