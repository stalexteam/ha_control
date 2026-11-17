// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, mount, press } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { isControlRule } from '../../src/model/rules';

async function open(rules?: Rule[], mutate?: (p: Plan) => void): Promise<PlanStudioPanel> {
  const plan: Plan = structuredClone(SCENES.control.plans[0]);
  if (rules) plan.rules = rules;
  mutate?.(plan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
  const el = await mount(createMockHass({ rulesFrame: SCENES.control.rulesFrame }));
  el.setMode('automation');
  await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
  await el.updateComplete;
  return el;
}

const q = <T extends Element>(el: PlanStudioPanel, sel: string): T => $<T>(el, `.rule-backdrop ${sel}`);
const okBtn = (el: PlanStudioPanel) => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]');
const problems = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.rule-backdrop .rproblems li')].map(x => x.textContent);
const chips = (el: PlanStudioPanel, f: string) =>
  [...el.shadowRoot!.querySelectorAll(`.rule-backdrop [data-group="${f}"] .rchip`)].map(c => c.getAttribute('data-id'));
const options = (el: PlanStudioPanel, f: string) => [...q<HTMLSelectElement>(el, `[data-field="${f}"]`).options].map(o => o.value);

async function add(el: PlanStudioPanel, f: string, value: string): Promise<void> {
  const s = q<HTMLSelectElement>(el, `[data-field="${f}"]`);
  s.value = value;
  s.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
}

async function edit(el: PlanStudioPanel): Promise<void> {
  el.selection = { kind: 'zone', id: 'r0' };
  await el.updateComplete;
  await press(el, '.rrow[data-id="rule-control"] button[data-action="rule-edit"]');
}

async function openNew(el: PlanStudioPanel): Promise<void> {
  el.selection = null;
  await el.updateComplete;
  await press(el, 'button[data-template="control"]');
}

describe('Load control form', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('Load control is a universal template: a rail button after Timer, not an Automations menu item; it opens a control rule dialog', async () => {
    const el = await open([]);
    const rail = [...el.shadowRoot!.querySelectorAll('button[data-template]')].map(b => b.getAttribute('data-template'));
    expect(rail).toEqual(['condition', 'timer', 'control']);
    expect($(el, 'button[data-template="control"]').textContent).toContain('Load control');
    await press(el, 'button[data-action="automations"]');
    const items = [...el.shadowRoot!.querySelectorAll('.amenu [role="menuitem"]')];
    expect(items.map(i => i.getAttribute('data-automation'))).toEqual(['vent', 'boiler', 'leak', 'timed', 'outside', 'beurer']);
    await press(el, 'button[data-action="automations"]');
    await press(el, 'button[data-template="control"]');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(isControlRule(el.ruleDraft!.rule)).toBe(true);
    expect(q(el, 'h3').textContent).toBe('Load control');
  });

  it('with empty lists OK is disabled and the hints show; adding a source and a load enables OK', async () => {
    const el = await open([]);
    await openNew(el);
    expect(chips(el, 'control-sources')).toEqual([]);
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Add a button, a wall switch or a motion sensor', 'Add a load']);
    await add(el, 'control-sources', 'd-motion');
    expect(el.ruleDraft!.rule.control).toEqual({ sources: ['d-motion'], loads: [] });
    expect(problems(el)).toEqual(['Add a load']);
    await add(el, 'control-loads', 'd-light');
    expect(problems(el)).toEqual([]);
    expect(okBtn(el).disabled).toBe(false);
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({ combine: 'any', inputs: [], onTrue: [], onFalse: [], control: { sources: ['d-motion'], loads: ['d-light'] } });
  });

  it('the Sources add select lists wall switches, smart buttons and motion sensors only', async () => {
    const el = await open([]);
    await openNew(el);
    expect(options(el, 'control-sources').sort()).toEqual(['', 'd-button-vent', 'd-motion', 'd-switch-hall']);
  });

  it('the Loads add select lists devices taking on and off only; a picked source never shows there', async () => {
    const el = await open([]);
    await openNew(el);
    const all = options(el, 'control-loads');
    expect(all).toEqual(expect.arrayContaining(['', 'd-light', 'd-socket', 'd-vent', 'd-fan']));
    for (const id of ['d-motion', 'd-leak', 'd-valve', 'd-switch-hall', 'd-button-vent', 'd-lux', 'd-corner']) expect(all).not.toContain(id);
    await add(el, 'control-sources', 'd-motion');
    expect(options(el, 'control-sources')).not.toContain('d-motion');
    expect(options(el, 'control-loads')).toEqual(all);
    await add(el, 'control-loads', 'd-light');
    expect(options(el, 'control-loads')).not.toContain('d-light');
  });

  it('adding a source patches control.sources; a chip\'s x patches the list', async () => {
    const el = await open();
    await edit(el);
    expect(chips(el, 'control-sources')).toEqual(['d-switch-hall', 'd-button-vent', 'd-motion']);
    expect(chips(el, 'control-loads')).toEqual(['d-light', 'd-vent', 'd-socket']);
    await press(el, '[data-group="control-loads"] .rchip[data-id="d-vent"] button[data-action="remove"]');
    expect(el.ruleDraft!.rule.control!.loads).toEqual(['d-light', 'd-socket']);
    await press(el, '[data-group="control-sources"] .rchip[data-id="d-motion"] button[data-action="remove"]');
    expect(el.ruleDraft!.rule.control!.sources).toEqual(['d-switch-hall', 'd-button-vent']);
    await add(el, 'control-sources', 'd-motion');
    expect(el.ruleDraft!.rule.control!.sources).toEqual(['d-switch-hall', 'd-button-vent', 'd-motion']);
  });

  it('Edit opens the compact frame with the live values of the saved rule; an edit drops them', async () => {
    const el = await open();
    await edit(el);
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .rsettings [data-field="control-sources"]')).toBeTruthy();
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .flow svg.vt')).toBeTruthy();
    expect(q(el, '.dialog.rdlg.pdlg > .rfoot [data-field="zone"]')).toBeTruthy();
    const flow = () => q<HTMLElement>(el, '.flow').textContent!;
    expect(flow()).toContain('no data');
    expect(flow()).toContain('Socket');
    await press(el, '[data-group="control-loads"] .rchip[data-id="d-vent"] button[data-action="remove"]');
    expect(flow()).not.toContain('no data');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
  });

  it('a deleted device stays as a marked chip and blocks OK', async () => {
    const el = await open(undefined, p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-vent'); });
    await edit(el);
    expect(q(el, '[data-group="control-loads"] .rchip[data-id="d-vent"]').classList.contains('bad')).toBe(true);
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['A device of this rule is no longer on the plan.']);
  });

  it('a click on a load block focuses the Loads add select and highlights the block and its chip', async () => {
    const el = await open();
    await edit(el);
    q(el, '[data-block="control-load:d-vent"]').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(q(el, '[data-field="control-loads"]'));
    expect(q(el, '[data-block="control-load:d-vent"]').classList.contains('hl')).toBe(true);
    expect(q(el, '[data-group="control-loads"] .rchip[data-id="d-vent"]').classList.contains('hl')).toBe(true);
    (el.shadowRoot!.activeElement as HTMLElement).blur(); // happy-dom: a focused element of a removed panel breaks the next test
  });
});
