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

export function inputName(o: RuleDialogOpts, i: RuleInput): string {
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
export function newSource(o: RuleDialogOpts, v: string): RuleSource | null {
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
 * The options of an add-input / set-gate select: devices, rules, then the four condition types, then `more` (the load
 * control rule's Buttons group). The old Light level is not offered (Daylight replaces it); existing Light level inputs
 * still show and edit.
 */
export function sourceOptions(o: RuleDialogOpts, placeholder: string, more?: TemplateResult): TemplateResult {
  return html`
    <option value="">${placeholder}</option>
    ${deviceRuleOptions(o)}
    <optgroup label=${t('rules.groupConditions')}>
      ${(['daylight', 'sun', 'time', 'held'] as const).map(k => html`<option value=${k}>${t(`rules.src.${k}`)}</option>`)}
    </optgroup>
    ${more ?? nothing}`;
}

/**
 * One action list of a rule dialog: the condition rule's "When true" / "When false" or a load control rule's "When on" /
 * "When off" / "When toggle". The device selects offer `o.actionDevices`; `actionsFor` is what a device takes (its Do
 * select), `firstDo` the Do of a newly picked device; `unique` = a device already in the list is not offered again.
 */
export interface ActionListSpec<D extends string> {
  label: string;
  /** The add select's placeholder, `data-action` and `data-field` (focused for an empty list), if any. */
  addText: string;
  add: string;
  addField?: string;
  /** The `data-field` of row k. */
  field(k: number): string;
  list: { device: Id; do: D }[];
  set(next: { device: Id; do: D }[]): void;
  actionsFor(d: Device): D[];
  firstDo(d: Device): D;
  doText(d: D): string;
  unique?: boolean;
}

function actionRow<D extends string>(o: RuleDialogOpts, s: ActionListSpec<D>, k: number, a: { device: Id; do: D }): TemplateResult {
  const list = s.list;
  const dev = o.deviceById(a.device);
  const takes = dev ? s.actionsFor(dev) : [];
  const acts: D[] = takes.includes(a.do) ? takes : [...takes, a.do]; // a stale action stays visible (and flagged)
  const offered = s.unique ? o.actionDevices.filter(d => d.id === a.device || !list.some(x => x.device === d.id)) : o.actionDevices;
  return html`
    <div class="rline" data-field=${s.field(k)} tabindex="-1">
      <select class="grow" data-part="device" data-value=${a.device}
        @change=${(e: Event) => {
          const d = o.deviceById((e.target as HTMLSelectElement).value);
          if (d) s.set(list.map((x, j) => (j === k ? { device: d.id, do: s.actionsFor(d).includes(x.do) ? x.do : s.firstDo(d) } : x)));
        }}>
        ${dev && !o.actionDevices.includes(dev) ? html`<option value=${dev.id}>${dev.name}</option>` : nothing}
        ${dev ? nothing : html`<option value=${a.device}>${t('rules.missingDevice')}</option>`}
        ${offered.map(d => html`<option value=${d.id}>${d.name}</option>`)}
      </select>
      <select data-part="do" data-value=${a.do}
        @change=${(e: Event) => s.set(list.map((x, j) => (j === k ? { ...x, do: (e.target as HTMLSelectElement).value as D } : x)))}>
        ${acts.map(d => html`<option value=${d}>${s.doText(d)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${t('rules.remove')} @click=${() => s.set(list.filter((_, j) => j !== k))}>&times;</button>
    </div>`;
}

export function actionList<D extends string>(o: RuleDialogOpts, s: ActionListSpec<D>): TemplateResult {
  const offered = s.unique ? o.actionDevices.filter(d => !s.list.some(x => x.device === d.id)) : o.actionDevices;
  return html`
    <div class="rgroup">
      <div class="rlabel">${s.label}</div>
      ${s.list.map((a, k) => actionRow(o, s, k, a))}
      <select class="radd" data-action=${s.add} data-field=${s.addField ?? nothing} .value=${''}
        @change=${(e: Event) => {
          const sel = e.target as HTMLSelectElement;
          const d = o.deviceById(sel.value);
          sel.value = '';
          if (d && s.actionsFor(d).length > 0) s.set([...s.list, { device: d.id, do: s.firstDo(d) }]);
        }}>
        <option value="">${s.addText}</option>
        ${offered.map(d => html`<option value=${d.id}>${d.name}</option>`)}
      </select>
    </div>`;
}

/** The condition rule's "When true" / "When false" list. */
function conditionActions(o: RuleDialogOpts, side: 'true' | 'false'): TemplateResult {
  const r = o.draft.rule;
  const key = side === 'true' ? 'onTrue' : 'onFalse';
  return actionList<RuleDo>(o, {
    label: t(side === 'true' ? 'rules.whenTrue' : 'rules.whenFalse'), addText: t('rules.addAction'), add: `add-action-${side}`,
    field: k => fieldOf({ action: side, index: k }), list: r[key], set: next => o.onChange({ ...r, [key]: next as RuleAction[] }),
    actionsFor: ruleActionsFor, firstDo: d => ruleActionsFor(d)[0], doText: d => t(`rules.act.${d}`),
  });
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
 * One input row (also the gate's and a load control rule's source row): its name or type, `extra` (what a load control
 * source gives), NOT (not for Daylight: night / dark / day cover it), remove, and the fields of its type. `set(null)`
 * removes it.
 */
export function inputRow(o: RuleDialogOpts, i: RuleInput, field: string, set: (i: RuleInput | null) => void, extra?: TemplateResult): TemplateResult {
  const s = i.source;
  const typed = !('device' in s || 'rule' in s);
  const type = 'light' in s ? 'light' : 'daylight' in s ? 'daylight' : 'sun' in s ? 'sun' : 'time' in s ? 'time' : 'held';
  return html`
    <div class="rline${isMissing(o, s) ? ' bad' : ''}" data-field=${field} tabindex="-1">
      <span class="grow">${typed ? t(`rules.src.${type}`) : inputName(o, i)}${'sun' in s ? html` <span class="muted">${i.not ? t('rules.sun.above') : paramText(s)}</span>` : nothing}</span>
      ${extra ?? nothing}
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

/** The change handler of an add-input / set-gate select: the picked choice (see `newSource`) goes to `apply`; the select resets. */
export const picker = (o: RuleDialogOpts, apply: (source: RuleSource) => void) => (e: Event): void => {
  const sel = e.target as HTMLSelectElement;
  const source = sel.value ? newSource(o, sel.value) : null;
  sel.value = '';
  if (source) apply(source);
};

/** The "Act only when" group (`label`): its hint, then the gate's input row (`field`) or the set-gate select; writes `rule.gate`. */
export function gateGroup(o: RuleDialogOpts, label: string, field: string): TemplateResult {
  const r = o.draft.rule;
  const setGate = (i: RuleInput | null) => {
    const { gate: _g, ...rest } = r;
    o.onChange(i ? { ...rest, gate: i } : rest);
  };
  return html`
      <div class="rgroup">
        <div class="rlabel">${label}</div>
        <p class="muted">${t('rules.gate.hint')}</p>
        ${r.gate
          ? inputRow(o, r.gate, field, setGate)
          : html`<select class="radd" data-action="set-gate" .value=${''} @change=${picker(o, source => setGate({ source }))}>
            ${sourceOptions(o, t('rules.gate.set'))}
          </select>`}
      </div>`;
}

/** The Name label and field. */
export function nameField(o: RuleDialogOpts): TemplateResult {
  const r = o.draft.rule;
  return html`
      <label class="rlabel" for="rule-name">${t('rules.name')}</label>
      <input id="rule-name" data-field="name" type="text" .value=${r.name} placeholder=${t('rules.namePlaceholder')}
        @input=${(e: Event) => o.onChange({ ...r, name: (e.target as HTMLInputElement).value })} />`;
}

function settings(o: RuleDialogOpts): TemplateResult {
  const r = o.draft.rule;
  return html`
    <div class="rsettings">
      ${nameField(o)}

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
        <select class="radd" data-action="add-input" .value=${''} @change=${picker(o, source => o.onChange({ ...r, inputs: [...r.inputs, { source }] }))}>
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

      ${gateGroup(o, t('rules.gate'), fieldOf('gate-input'))}

      ${conditionActions(o, 'true')}
      ${conditionActions(o, 'false')}
    </div>`;
}

/**
 * The large rule dialog frame (the condition and the load control rule): `form` on the left, `diagram` (a `.flow`) on
 * the right, the messages (`texts`, each with its `data-problem` key), then Zone / Enabled / Cancel / OK (OK only
 * without `problems`).
 */
export interface RuleFrameOpts {
  title: string;
  rule: Rule;
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  texts: { key: string; text: string }[];
  form: TemplateResult;
  diagram: TemplateResult;
  onChange(rule: Rule): void;
  onOk(): void;
  onCancel(): void;
}

/** The rule dialog: settings on the left, the live flowchart on the right, Zone / Enabled / Cancel / OK in the footer. */
export function renderRuleDialog(o: RuleDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const focus = (target: FocusTarget) => o.onFocus(fieldOf(target));
  return renderRuleFrame({
    title: t(o.draft.isNew ? 'rules.dialog.new' : 'rules.dialog.edit'), rule: r, zones: o.zones, problems: o.problems,
    texts: o.problems.map(p => ({ key: p, text: t(`rules.problem.${p}`) })),
    form: settings(o),
    diagram: renderRuleTrace({
      rule: r, inputName: i => inputName(o, i), actionName: id => o.deviceById(id)?.name ?? t('rules.missingDevice'),
      trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: focus,
    }),
    onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
  });
}

export function renderRuleFrame(o: RuleFrameOpts): TemplateResult {
  const r = o.rule;
  const zoneKnown = r.zoneId === null || o.zones.some(z => z.id === r.zoneId);
  return html`
    <div class="backdrop rule-backdrop" @change=${(e: Event) => e.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${o.title}>
        <h3>${o.title}</h3>
        <div class="rcols">
          ${o.form}
          ${o.diagram}
        </div>
        ${o.texts.length > 0 ? html`<ul class="rproblems" role="alert">
          ${o.texts.map(p => html`<li data-problem=${p.key}>${p.text}</li>`)}</ul>` : nothing}
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
