import { html, type TemplateResult } from 'lit';
import type { Device, Id, Rule } from '../model/types';
import type { RuleProblem } from '../model/rules';
import type { RuleTrace } from '../live/rules-feed';
import type { RuleDraft } from './rule-dialog';
import { renderControlTrace } from '../render/control-trace';
import { renderPurposeDialog } from './purpose-dialog';
import { chips } from './leak-dialog';
import { t } from '../i18n';

export interface ControlDialogOpts {
  draft: RuleDraft;
  /** Wall switch, smart button and motion sensor devices of the plan; devices that take on and off; every device (for names). */
  sources: Device[];
  loads: Device[];
  deviceById(id: Id): Device | undefined;
  zones: { id: Id; name: string }[];
  problems: RuleProblem[];
  /** Live trace; only given for a saved unchanged rule. */
  trace: RuleTrace | undefined;
  note: string | null;
  now: number;
  onChange(rule: Rule): void;
  /** A click on a diagram block: its `data-block` (see `controlFocus`). */
  onFocus(field: string): void;
  onOk(): void;
  onCancel(): void;
}

/** The messages under the form: a hint per empty list, the rest as the rule dialog words them. */
function problemTexts(o: ControlDialogOpts): { key: string; text: string }[] {
  const c = o.draft.rule.control!;
  const hints: { key: string; text: string }[] = [];
  if (c.sources.length === 0) hints.push({ key: 'pick-sources', text: t('control.problem.sources') });
  if (c.loads.length === 0) hints.push({ key: 'pick-loads', text: t('control.problem.loads') });
  const out = [...hints];
  for (const p of o.problems) {
    if (p === 'control' && hints.length > 0) continue;
    out.push({ key: p, text: t(`rules.problem.${p}`) });
  }
  return out;
}

/**
 * The "Load control" dialog in the purpose-built frame: the sources and the loads as chips with an add select on the
 * left, the diagram on the right.
 */
export function renderControlDialog(o: ControlDialogOpts): TemplateResult {
  const r = o.draft.rule;
  const c = r.control!;
  return renderPurposeDialog({
    prefix: 'control', title: t('control.title'), hint: t('control.hint'), rule: r, zones: o.zones, problems: o.problems,
    texts: problemTexts(o), onChange: o.onChange, onOk: o.onOk, onCancel: o.onCancel,
    form: html`
      <label class="rlabel">${t('control.sources')}</label>
      ${chips(o, 'control-sources', 'control-source', c.sources, o.sources, t('control.addSource'), ids => o.onChange({ ...r, control: { ...c, sources: ids } }))}
      <label class="rlabel">${t('control.loads')}</label>
      ${chips(o, 'control-loads', 'control-load', c.loads, o.loads.filter(d => !c.sources.includes(d.id)), t('control.addLoad'), ids => o.onChange({ ...r, control: { ...c, loads: ids } }))}`,
    diagram: renderControlTrace({
      rule: r, deviceName: id => o.deviceById(id)?.name ?? t('rules.missingDevice'),
      deviceKind: id => o.deviceById(id)?.props.kind,
      separateOff: id => { const p = o.deviceById(id)?.props; return p?.kind === 'smart_button' && p.separateOff === true; },
      trace: o.trace, note: o.note, now: o.now, focused: o.draft.focused, onFocus: o.onFocus,
    }),
  });
}
