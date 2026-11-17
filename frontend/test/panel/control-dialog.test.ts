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
const all = (el: PlanStudioPanel, sel: string) => [...el.shadowRoot!.querySelectorAll(`.rule-backdrop ${sel}`)];
const okBtn = (el: PlanStudioPanel) => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]');
const problems = (el: PlanStudioPanel) => all(el, '.rproblems li').map(x => x.textContent!.trim());
const options = (el: PlanStudioPanel, sel: string) => [...q<HTMLSelectElement>(el, sel).options].map(o => o.value);
const control = (el: PlanStudioPanel) => el.ruleDraft!.rule.control!;

async function choose(el: PlanStudioPanel, sel: string, value: string): Promise<void> {
  const s = q<HTMLSelectElement>(el, sel);
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

describe('Load control dialog', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the rail button opens the event dialog in the large frame: form left, flowchart right, no ANY / ALL, no delays', async () => {
    const el = await open([]);
    const rail = [...el.shadowRoot!.querySelectorAll('button[data-template]')].map(b => b.getAttribute('data-template'));
    expect(rail).toEqual(['condition', 'timer', 'control']);
    await openNew(el);
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(isControlRule(el.ruleDraft!.rule)).toBe(true);
    expect(q(el, '.dialog.rdlg').classList.contains('pdlg')).toBe(false);
    expect(q(el, 'h3').textContent).toBe('Load control');
    expect(q(el, '.dialog.rdlg > .rcols > .rsettings select[data-action="add-source"]')).toBeTruthy();
    expect(q(el, '.dialog.rdlg > .rcols > .flow svg.fc')).toBeTruthy();
    expect(q(el, '.dialog.rdlg > .rfoot [data-field="zone"]')).toBeTruthy();
    expect(q(el, '.rsettings').textContent).toContain('Reacts to events.');
    expect(all(el, '[data-field="combine"], [data-field="delays"]')).toEqual([]);
    expect(all(el, '.rsettings .rlabel').map(x => x.textContent!.trim())).toEqual(['Name', 'Sources', 'Act only when', 'When on', 'When off', 'When toggle']);
  });

  it('with no source and no action OK is disabled and the two empty-state texts show; one source and one action enable it', async () => {
    const el = await open([]);
    await openNew(el);
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Add a source', 'Add an action to at least one list']);
    await choose(el, 'select[data-action="add-source"]', 'd:d-switch-hall');
    expect(problems(el)).toEqual(['Add an action to at least one list']);
    await choose(el, 'select[data-action="add-action-off"]', 'd-light');
    expect(problems(el)).toEqual([]);
    expect(okBtn(el).disabled).toBe(false);
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({ combine: 'any', inputs: [], onTrue: [], onFalse: [], control: { sources: [{ source: { device: 'd-switch-hall' } }], on: [], off: [{ device: 'd-light', do: 'off' }], toggle: [] } });
  });

  it('Sources: the add select has the condition groups plus Buttons; a button row shows what it gives without NOT, a device row with NOT', async () => {
    const el = await open([]);
    await openNew(el);
    const groups = all(el, 'select[data-action="add-source"] optgroup').map(g => g.getAttribute('label'));
    expect(groups).toEqual(['Devices', 'Conditions', 'Buttons']);
    const buttons = [...q(el, 'select[data-action="add-source"] optgroup[label="Buttons"]').querySelectorAll('option')].map(o => o.value);
    expect(buttons.sort()).toEqual(['b:d-button-hall', 'b:d-button-vent']);
    expect(options(el, 'select[data-action="add-source"]')).toEqual(expect.arrayContaining(['d:d-switch-hall', 'd:d-motion', 'daylight', 'sun', 'time', 'held']));
    await choose(el, 'select[data-action="add-source"]', 'b:d-button-hall');
    await choose(el, 'select[data-action="add-source"]', 'b:d-button-vent');
    await choose(el, 'select[data-action="add-source"]', 'd:d-motion');
    expect(control(el).sources).toEqual([{ button: 'd-button-hall' }, { button: 'd-button-vent' }, { source: { device: 'd-motion' } }]);
    const row = (k: number) => q(el, `[data-field="control-source-${k}"]`);
    expect(row(0).textContent).toContain('Button hall');
    expect(row(0).querySelector('[data-part="gives"]')!.textContent).toBe('gives toggle');
    expect(row(1).querySelector('[data-part="gives"]')!.textContent).toBe('gives on / off');
    expect(row(2).querySelector('[data-part="gives"]')!.textContent).toBe('gives on / off');
    expect(row(0).querySelector('[data-part="not"]')).toBeNull();
    expect(row(1).querySelector('[data-part="not"]')).toBeNull();
    expect(row(2).querySelector('[data-part="not"]')).toBeTruthy();
    // A button already listed is not offered again.
    expect(options(el, 'select[data-action="add-source"]')).not.toContain('b:d-button-hall');
    const not = row(2).querySelector<HTMLInputElement>('[data-part="not"]')!;
    not.checked = true;
    not.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(control(el).sources[2]).toEqual({ source: { device: 'd-motion' }, not: true });
    await press(el, '[data-field="control-source-0"] button[data-action="remove-input"]');
    expect(control(el).sources).toEqual([{ button: 'd-button-vent' }, { source: { device: 'd-motion' }, not: true }]);
  });

  it('a condition source keeps its parameters: a Held source edits like the condition rule\'s', async () => {
    const el = await open([]);
    await openNew(el);
    await choose(el, 'select[data-action="add-source"]', 'held');
    await choose(el, '[data-field="control-source-0"] [data-part="add-source"]', 'd:d-motion');
    expect(control(el).sources).toEqual([{ source: { held: { sources: [{ device: 'd-motion' }], state: 'any', seconds: 1800 } } }]);
  });

  it('the three action lists: add with the list\'s own Do, remove, a valve takes only close, a device is not offered twice in one list', async () => {
    const el = await open([]);
    await openNew(el);
    const offered = options(el, 'select[data-action="add-action-on"]');
    expect(offered).toEqual(expect.arrayContaining(['', 'd-light', 'd-socket', 'd-vent', 'd-fan', 'd-valve']));
    for (const id of ['d-motion', 'd-leak', 'd-switch-hall', 'd-button-vent', 'd-lux', 'd-corner']) expect(offered).not.toContain(id);
    await choose(el, 'select[data-action="add-action-on"]', 'd-light');
    await choose(el, 'select[data-action="add-action-off"]', 'd-light');
    await choose(el, 'select[data-action="add-action-toggle"]', 'd-light');
    await choose(el, 'select[data-action="add-action-on"]', 'd-valve');
    expect(control(el)).toMatchObject({
      on: [{ device: 'd-light', do: 'on' }, { device: 'd-valve', do: 'close' }], off: [{ device: 'd-light', do: 'off' }], toggle: [{ device: 'd-light', do: 'toggle' }],
    });
    expect(options(el, '[data-field="control-on-1"] [data-part="do"]')).toEqual(['close']);
    expect(options(el, '[data-field="control-on-0"] [data-part="do"]')).toEqual(['on', 'off', 'toggle']);
    // Not twice in one list: neither in the add select nor in another row's device select; other lists still offer it.
    expect(options(el, 'select[data-action="add-action-on"]')).not.toContain('d-light');
    expect(options(el, 'select[data-action="add-action-on"]')).not.toContain('d-valve');
    expect(options(el, '[data-field="control-on-1"] [data-part="device"]')).not.toContain('d-light');
    expect(options(el, '[data-field="control-on-1"] [data-part="device"]')).toContain('d-valve');
    expect(options(el, 'select[data-action="add-action-off"]')).toContain('d-valve');
    await choose(el, '[data-field="control-off-0"] [data-part="do"]', 'toggle');
    expect(control(el).off).toEqual([{ device: 'd-light', do: 'toggle' }]);
    await choose(el, '[data-field="control-on-1"] [data-part="device"]', 'd-socket');
    expect(control(el).on[1]).toEqual({ device: 'd-socket', do: 'on' });
    await press(el, '[data-field="control-on-0"] button[data-action="remove-action"]');
    expect(control(el).on).toEqual([{ device: 'd-socket', do: 'on' }]);
    await press(el, '[data-field="control-toggle-0"] button[data-action="remove-action"]');
    expect(control(el).toggle).toEqual([]);
    expect(el.ruleDraft!.rule).toMatchObject({ onTrue: [], onFalse: [] });
  });

  it('"Act only when" sets and clears rule.gate', async () => {
    const el = await open([]);
    await openNew(el);
    await choose(el, 'select[data-action="set-gate"]', 'sun');
    expect(el.ruleDraft!.rule.gate).toEqual({ source: { sun: true } });
    expect(q(el, '[data-field="control-gate"]').textContent).toContain('Sun');
    expect(q(el, '.flow').textContent).toContain('Gate: Sun');
    await press(el, '[data-field="control-gate"] button[data-action="remove-input"]');
    expect('gate' in el.ruleDraft!.rule).toBe(false);
    expect(q(el, 'select[data-action="set-gate"]')).toBeTruthy();
  });

  it('editing the saved rule shows the live overlay; an edit drops it', async () => {
    const el = await open();
    await edit(el);
    expect(all(el, '.rsettings [data-field^="control-source-"]')).toHaveLength(3);
    expect(q<HTMLSelectElement>(el, '[data-field="control-off-2"] [data-part="do"]').value).toBe('close');
    const flow = () => q<HTMLElement>(el, '.flow').textContent!;
    expect(flow()).toContain('Button hall: toggle');
    expect(flow()).toContain('target unavailable');
    expect(all(el, '.fc-note')).toEqual([]);
    await press(el, '[data-field="control-on-1"] button[data-action="remove-action"]');
    expect(flow()).not.toContain('target unavailable');
    expect(flow()).toContain('no event yet');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
  });

  it('a click on a flowchart block focuses its form field and highlights the block', async () => {
    const el = await open();
    await edit(el);
    q(el, '[data-block="toggle:0"]').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(q(el, '[data-field="control-toggle-0"] [data-part="device"]'));
    expect(q(el, '[data-block="toggle:0"]').classList.contains('hl')).toBe(true);
    q(el, '[data-block="gate"]').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(q(el, '[data-field="control-gate"]').contains(el.shadowRoot!.activeElement)).toBe(true);
    (el.shadowRoot!.activeElement as HTMLElement).blur(); // happy-dom: a focused element of a removed panel breaks the next test
  });

  it('a deleted device stays as a marked row and blocks OK', async () => {
    const el = await open(undefined, p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-vent' && d.id !== 'd-button-hall'); });
    await edit(el);
    expect(q<HTMLSelectElement>(el, '[data-field="control-on-1"] [data-part="device"]').value).toBe('d-vent');
    expect(q(el, '[data-field="control-on-1"] [data-part="device"]').textContent).toContain('(missing device)');
    expect(q(el, '[data-field="control-source-0"]').classList.contains('bad')).toBe(true);
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toContain('A device of this rule is no longer on the plan.');
  });

  it('a 0.20.0-shape rule in a loaded plan opens converted', async () => {
    const old = { ...SCENES.control.plans[0].rules!.find(r => r.control)!, control: { sources: ['d-button-vent', 'd-motion'], loads: ['d-light'] } } as unknown as Rule;
    const { gate: _g, ...noGate } = old;
    const el = await open([noGate]);
    expect(el.rules[0].control).toEqual({
      sources: [{ button: 'd-button-vent' }, { source: { device: 'd-motion' } }],
      on: [{ device: 'd-light', do: 'on' }], off: [{ device: 'd-light', do: 'off' }], toggle: [{ device: 'd-light', do: 'toggle' }],
    });
    await edit(el);
    expect(q(el, '[data-field="control-source-0"]').textContent).toContain('Button vent');
    expect(q(el, '[data-field="control-source-1"]').textContent).toContain('Motion sensor');
    for (const l of ['on', 'off', 'toggle']) expect(q<HTMLSelectElement>(el, `[data-field="control-${l}-0"] [data-part="do"]`).value).toBe(l);
    expect(okBtn(el).disabled).toBe(false);
  });

  it('a plan without a 0.20.0 rule keeps its rule objects', async () => {
    const el = await open();
    expect(el.rules.length).toBeGreaterThan(0);
    el.rules.forEach((r, i) => expect(r).toBe(el.session.savedRules[i]));
  });
});
