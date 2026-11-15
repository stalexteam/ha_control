import { html, nothing, type TemplateResult } from 'lit';
import {
  TRIGGER_EVENTS, allowedOutputs, type BindingRole, type ContainerOutput, type Device, type DeviceProps, type Level,
  type Trigger,
} from '../model/types';
import { duplicateTriggers, setBinding, type TriggerRole } from '../model/bindings';
import { setDeviceProps } from '../model/devices';
import type { WholeRule } from '../geometry/parse';
import { fieldValue } from './field-value';
import { numField, row, select } from './fields';
import type { BindingPropsOpts } from './binding-props';
import { t } from '../i18n';

/** Trigger slot: 0 = a one-button device, 1..9 = the button of a multi-button one. */
const SLOT: WholeRule = { min: 0, max: 9 };
/** Double-toggle window of a wall switch, whole seconds. */
const WINDOW: WholeRule = { min: 1, max: 10 };

/** Commits a container edit as one undo step and clears the field notice; false when the model refused it. */
function commit(o: BindingPropsOpts, next: Level): boolean {
  if (next === o.level) return false;
  o.setNotice(null);
  o.commit(next);
  return true;
}

const setProps = (o: BindingPropsOpts, d: Device, patch: Partial<DeviceProps>): boolean =>
  commit(o, setDeviceProps(o.level, d.id, patch));

/** A labelled checkbox in its own block between role sections; a refused change puts it back on the model value. */
function check(field: string, label: string, value: boolean, on: (v: boolean) => boolean): TemplateResult {
  return html`<div class="cflag">${row(label, html`<input type="checkbox" data-field=${field} .checked=${fieldValue(value)}
    @change=${(e: Event) => {
      const el = e.target as HTMLInputElement;
      if (!on(el.checked)) el.checked = value;
    }} />`)}</div>`;
}

/** The default output select: only the outputs the props allow, in allowedOutputs order. */
function defaultOutputRow(o: BindingPropsOpts, d: Device, p: DeviceProps & { defaultOutput: ContainerOutput }): TemplateResult {
  const options = allowedOutputs(p).map(v => ({ v, label: t(`output.${v}`) }));
  return row(t('binding.defaultOutput'),
    select<ContainerOutput>(p.defaultOutput, options, v => setProps(o, d, { defaultOutput: v }), 'defaultOutput'));
}

/**
 * A smart button trigger under its role's combobox: Slot (0..9) and Event (`single`, `double`, `hold` offered,
 * any other non-empty text accepted). A malformed slot or a blank event reverts with a notice.
 */
export function triggerFields(o: BindingPropsOpts, d: Device, role: TriggerRole): TemplateResult {
  const p = d.props;
  if (p.kind !== 'smart_button') return html`${nothing}`;
  const cur = p[role];
  const set = (patch: Partial<Trigger>): boolean => setProps(o, d, { [role]: { ...cur, ...patch } } as Partial<DeviceProps>);
  const list = `ps-events-${role}`;
  return html`<div class="trigger" data-trigger=${role}>
    ${row(t('binding.slot'), numField({
      value: cur.slot, rule: SLOT, bad: 'props.badSlot', field: `${role}-slot`, skipSame: true,
      setNotice: msg => o.setNotice(msg), apply: v => set({ slot: v }),
    }))}
    ${row(t('binding.event'), html`<input class="val wide" type="text" list=${list} data-field=${`${role}-event`}
      .value=${fieldValue(cur.event)} @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const v = el.value.trim();
        if (!v) { el.value = cur.event; o.setNotice(t('props.badEvent')); return; }
        el.value = v;
        o.setNotice(null);
        if (v !== cur.event) set({ event: v });
      }} />`)}
    <datalist id=${list}>${TRIGGER_EVENTS.map(v => html`<option value=${v}></option>`)}</datalist>
  </div>`;
}

/**
 * The container checkboxes that follow a role section, so each sits under the section above it and before the
 * section it reveals (ticking one never moves it from under the pointer):
 * - wall switch, after State: "Auto by double toggle", then "Window, s" while it is checked;
 * - smart button, after On / Off (On): "Separate Off", then "Auto" unless the Off section comes between them;
 * - smart button, after Off: "Auto".
 * Turning "Separate Off" or "Auto" on while its entity is empty starts that entity as the On entity, in the same commit.
 * Nothing after any other role or for other kinds.
 */
export function containerFlags(o: BindingPropsOpts, d: Device, role: BindingRole): TemplateResult {
  const p = d.props;
  if (p.kind === 'wall_switch' && role === 'state') {
    return html`
      ${check('autoByDoubleToggle', t('binding.autoByDoubleToggle'), p.autoByDoubleToggle,
        v => setProps(o, d, { autoByDoubleToggle: v }))}
      ${p.autoByDoubleToggle ? html`<div class="cflag">${row(t('binding.window'), numField({
        value: p.windowSec, rule: WINDOW, bad: 'props.badWindow', field: 'windowSec', skipSame: true,
        setNotice: msg => o.setNotice(msg), apply: v => setProps(o, d, { windowSec: v }),
      }))}</div>` : nothing}`;
  }
  if (p.kind !== 'smart_button' || (role !== 'on' && role !== 'off')) return html`${nothing}`;
  /** Turns a part on or off; turning it on with its entity empty starts it as the On entity, in the same commit. */
  const part = (flag: 'separateOff' | 'autoEnabled', target: 'off' | 'auto') => (on: boolean): boolean => {
    const next = setDeviceProps(o.level, d.id, { [flag]: on });
    return commit(o, on && !d.bindings?.[target] ? setBinding(next, d.id, target, d.bindings?.on ?? null) : next);
  };
  const separate = part('separateOff', 'off');
  const auto = check('autoEnabled', t('binding.autoEnabled'), p.autoEnabled, part('autoEnabled', 'auto'));
  if (role === 'off') return auto;
  return html`${check('separateOff', t('binding.separateOff'), p.separateOff, separate)}${p.separateOff ? nothing : auto}`;
}

/** Container settings after all the roles: the default output and, for a smart button, the duplicate-trigger warning. */
export function containerFields(o: BindingPropsOpts, d: Device): TemplateResult {
  const p = d.props;
  if (p.kind !== 'wall_switch' && p.kind !== 'smart_button') return html`${nothing}`;
  return html`<div class="cfields">
    ${defaultOutputRow(o, d, p)}
    ${p.kind === 'smart_button' && duplicateTriggers(d).length
      ? html`<p class="warn" data-note="duplicate">${t('binding.duplicate')}</p>` : nothing}
  </div>`;
}
