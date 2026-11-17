import { html, type TemplateResult } from 'lit';
import { isButtonSource, type ControlDo, type ControlSource, type Device, type RuleInput } from '../model/types';
import { controlActionsFor } from '../model/rules';
import { renderControlFlow } from '../render/control-flow';
import { actionList, gateGroup, inputName, inputRow, nameField, picker, renderRuleFrame, sourceOptions, type RuleDialogOpts } from './rule-dialog';
import { t } from '../i18n';

/**
 * The condition dialog's options (`actionDevices` = devices a load control action can switch, see `controlActionsFor`)
 * plus the smart buttons offered as sources.
 */
export interface ControlDialogOpts extends RuleDialogOpts {
  buttons: Device[];
}

const LISTS = ['on', 'off', 'toggle'] as const;
const HEADS = { on: 'control.whenOn', off: 'control.whenOff', toggle: 'control.whenToggle' } as const;

/** What a source gives: a smart button its intents (toggle, or on / off with its own Off), any other source on / off. */
function gives(o: ControlDialogOpts, s: ControlSource): 'toggle' | 'on / off' {
  if (!isButtonSource(s)) return 'on / off';
  const p = o.deviceById(s.button)?.props;
  return p?.kind === 'smart_button' && p.separateOff ? 'on / off' : 'toggle';
}

/** A source row: a condition source is the condition dialog's input row; a button shows its name, what it gives and remove (no NOT). */
function sourceRow(o: ControlDialogOpts, s: ControlSource, k: number, set: (s: ControlSource | null) => void): TemplateResult {
  const field = `control-source-${k}`;
  const what = html`<span class="muted" data-part="gives">${t('control.gives').replace('{what}', gives(o, s))}</span>`;
  if (!isButtonSource(s)) return inputRow(o, s, field, set, what);
  const dev = o.deviceById(s.button);
  return html`
    <div class="rline${dev?.props.kind === 'smart_button' ? '' : ' bad'}" data-field=${field} tabindex="-1">
      <span class="grow">${dev?.name ?? t('rules.missingDevice')}</span>
      ${what}
      <button class="btn" data-action="remove-input" title=${t('rules.remove')} @click=${() => set(null)}>&times;</button>
    </div>`;
}

/** The messages under the form: a hint per empty part (they replace the generic Load control problem), the rest as the condition dialog words them. */
function problemTexts(o: ControlDialogOpts): { key: string; text: string }[] {
  const c = o.draft.rule.control!;
  const hints: { key: string; text: string }[] = [];
  if (c.sources.length === 0) hints.push({ key: 'pick-sources', text: t('control.problem.sources') });
  if (LISTS.every(l => c[l].length === 0)) hints.push({ key: 'pick-actions', text: t('control.problem.actions') });
  return [...hints, ...o.problems.filter(p => p !== 'control' || hints.length === 0).map(p => ({ key: p, text: t(`rules.problem.${p}`) }))];
}

/**
 * The "Load control" dialog in the condition dialog's large frame, built from its pieces: Name; Sources (the condition
 * dialog's input rows plus button rows, each saying what it gives); "Act only when"; the "When on" / "When off" / "When
 * toggle" action lists. The flowchart is on the right; a click on a block focuses its field (`controlFlowFocus`).
 */
export function renderControlDialog(o: ControlDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const c = r.control!;
  const setSources = (sources: ControlSource[]): void => o.onChange({ ...r, control: { ...c, sources } });
  const name = (id: string): string => o.deviceById(id)?.name ?? t('rules.missingDevice');
  const freeButtons = o.buttons.filter(b => !c.sources.some(s => isButtonSource(s) && s.button === b.id));
  const buttonGroup = freeButtons.length > 0 ? html`<optgroup label=${t('control.group.buttons')}>
      ${freeButtons.map(b => html`<option value=${`b:${b.id}`}>${b.name}</option>`)}
    </optgroup>` : undefined;
  const addSource = (e: Event): void => {
    const sel = e.target as HTMLSelectElement;
    if (!sel.value.startsWith('b:')) { picker(o, source => setSources([...c.sources, { source }]))(e); return; }
    const button = sel.value.slice(2);
    sel.value = '';
    setSources([...c.sources, { button }]);
  };
  const form = html`
    <div class="rsettings">
      <p class="muted">${t('control.hint')}</p>
      ${nameField(o)}

      <div class="rgroup">
        <div class="rlabel">${t('control.sources')}</div>
        ${c.sources.map((s, k) => sourceRow(o, s, k,
          next => setSources(next ? c.sources.map((x, j) => (j === k ? next : x)) : c.sources.filter((_, j) => j !== k))))}
        <select class="radd" data-action="add-source" .value=${''} @change=${addSource}>
          ${sourceOptions(o, t('control.addSource'), buttonGroup)}
        </select>
      </div>

      ${gateGroup(o, t('control.gate'), 'control-gate')}

      ${LISTS.map(l => actionList<ControlDo>(o, {
        label: t(HEADS[l]), addText: t('control.addAction'), add: `add-action-${l}`, addField: `control-${l}`,
        field: k => `control-${l}-${k}`, list: c[l], set: next => o.onChange({ ...r, control: { ...c, [l]: next } }),
        actionsFor: controlActionsFor, firstDo: d => (controlActionsFor(d).includes(l) ? l : controlActionsFor(d)[0]),
        doText: d => t(`control.do.${d}`), unique: true,
      }))}
    </div>`;
  return renderRuleFrame({
    title: t('control.title'), rule: r, zones: o.zones, problems: o.problems, texts: problemTexts(o), form,
    diagram: renderControlFlow({
      rule: r, trace: o.trace, note: o.note, now: o.now, nameOf: name,
      sourceLabel: s => (isButtonSource(s) ? name(s.button) : inputName(o, s as RuleInput)),
      gives: s => gives(o, s), focused: o.draft.focused, onFocus: o.onFocus,
    }),
    onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
  });
}
