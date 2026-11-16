// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, click, key, mount, press, stored, undo } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';

async function open(rules?: Rule[]): Promise<PlanStudioPanel> {
  const plan: Plan = structuredClone(SCENES.room.plans[0]);
  if (rules) plan.rules = rules;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
  const el = await mount(createMockHass({ rulesFrame: SCENES.room.rulesFrame }));
  el.setMode('automation');
  await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
  await el.updateComplete;
  return el;
}

const q = <T extends Element>(el: PlanStudioPanel, sel: string): T => $<T>(el, `.rule-backdrop ${sel}`);
const names = (el: PlanStudioPanel, sel: string) => [...el.shadowRoot!.querySelectorAll(`.rule-backdrop ${sel}`)].map(x => x.textContent!.trim());
const okBtn = (el: PlanStudioPanel) => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]');

async function type(el: PlanStudioPanel, sel: string, value: string): Promise<void> {
  const f = q<HTMLInputElement>(el, sel);
  f.value = value;
  f.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await el.updateComplete;
}

async function choose(el: PlanStudioPanel, sel: string, value: string): Promise<void> {
  const f = q<HTMLSelectElement>(el, sel);
  f.value = value;
  f.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
}

describe('Rule dialog', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('"Leak -> valve" in a zone opens pre-filled; Cancel adds nothing', async () => {
    const el = await open([]);
    click(el, 300, 300); // Main
    await el.updateComplete;
    await press(el, 'button[data-template="leak"]');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Leak Main -> valve');
    expect(names(el, '[data-field="input-0"] .grow')).toEqual(['Leak sensor']);
    expect(q<HTMLSelectElement>(el, '[data-field="action-true-0"] [data-part="device"]').value).toBe('d-valve');
    expect(q<HTMLSelectElement>(el, '[data-field="action-true-0"] [data-part="do"]').value).toBe('close');
    expect(q<HTMLSelectElement>(el, '[data-field="zone"]').value).toBe('r0');
    await press(el, 'button[data-action="rule-cancel"]');
    expect(el.dialog).toBeNull();
    expect(el.rules).toEqual([]);
  });

  it('OK adds one rule as one undo step; the plan is not saved by it', async () => {
    const el = await open([]);
    await press(el, 'button[data-template="condition"]');
    expect(okBtn(el).disabled).toBe(true);
    expect(names(el, '.rproblems li')).toEqual(['Give the rule a name.', 'Add at least one input.']);
    await type(el, '[data-field="name"]', 'Water');
    await choose(el, 'select[data-action="add-input"]', 'd:d-leak');
    await choose(el, 'select[data-action="add-action-true"]', 'd-valve');
    expect(okBtn(el).disabled).toBe(false);
    expect(el.rules).toEqual([]); // nothing before OK
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.dialog).toBeNull();
    expect(el.rules).toHaveLength(1);
    expect(el.rules[0]).toMatchObject({ name: 'Water', zoneId: null, combine: 'any', inputs: [{ source: { device: 'd-leak' } }], onTrue: [{ device: 'd-valve', do: 'open' }] });
    expect(stored()[0].rules ?? []).toHaveLength(0);
    await undo(el);
    expect(el.rules).toEqual([]);
  });

  it('the new rule defaults to the selected zone; the zone list has "No zone" and every zone', async () => {
    const el = await open([]);
    click(el, 2500, 1500);
    await el.updateComplete;
    await press(el, 'button[data-template="condition"]');
    const z = q<HTMLSelectElement>(el, '[data-field="zone"]');
    expect(z.value).toBe('z-mid');
    expect([...z.options].map(o => o.textContent!.trim())).toEqual(['No zone', 'Main', 'Door', 'Middle', 'Yard']);
  });

  it('editing a saved rule changes it only on OK; Edit loads that rule whatever the template', async () => {
    const el = await open();
    const before = structuredClone(el.rules.find(r => r.id === 'rule-motion'));
    el.openRuleDialog('leak', 'rule-motion');
    await el.updateComplete;
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Light on motion');
    expect(q<HTMLSelectElement>(el, '[data-field="combine"]').value).toBe('all');
    expect(q<HTMLInputElement>(el, '[data-field="input-1"] [data-part="not"]').checked).toBe(true);
    await type(el, '[data-field="name"]', 'Renamed');
    await type(el, '[data-part="off-delay"]', '30');
    expect(el.rules.find(r => r.id === 'rule-motion')).toEqual(before);
    await press(el, 'button[data-action="rule-cancel"]');
    expect(el.rules.find(r => r.id === 'rule-motion')).toEqual(before);
    el.openRuleDialog('condition', 'rule-motion');
    await el.updateComplete;
    await type(el, '[data-field="name"]', 'Renamed');
    await type(el, '[data-part="off-delay"]', '30');
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules.find(r => r.id === 'rule-motion')).toMatchObject({ name: 'Renamed', offDelay: 30 });
    await undo(el);
    expect(el.rules.find(r => r.id === 'rule-motion')).toEqual(before);
  });

  it('OK stays disabled for a bad delay and for a cycle, with a message each', async () => {
    const el = await open();
    el.openRuleDialog('condition', 'rule-leak');
    await el.updateComplete;
    await type(el, '[data-part="on-delay"]', '1.5');
    expect(names(el, '.rproblems li')).toEqual(['Delays are whole seconds from 0 to 3600.']);
    await type(el, '[data-part="on-delay"]', '3601');
    expect(okBtn(el).disabled).toBe(true);
    await type(el, '[data-part="on-delay"]', '5');
    expect(okBtn(el).disabled).toBe(false);
    await press(el, 'button[data-action="rule-cancel"]');
    // rule-motion takes rule-leak as an input (fine) ...
    el.openRuleDialog('condition', 'rule-motion');
    await el.updateComplete;
    await choose(el, 'select[data-action="add-input"]', 'r:rule-leak');
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules.find(r => r.id === 'rule-motion')!.inputs).toHaveLength(3);
    // ... so rule-leak taking rule-motion would be a loop
    el.openRuleDialog('condition', 'rule-leak');
    await el.updateComplete;
    await choose(el, 'select[data-action="add-input"]', 'r:rule-motion');
    expect(names(el, '.rproblems li')).toEqual(['These inputs make the rules depend on each other in a loop.']);
    expect(okBtn(el).disabled).toBe(true);
  });

  it('a missing device is flagged and blocks OK', async () => {
    const bad: Rule = { id: 'r-bad', name: 'Bad', zoneId: null, combine: 'any', inputs: [{ source: { device: 'gone' } }], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
    const el = await open([bad]);
    el.openRuleDialog('condition', 'r-bad');
    await el.updateComplete;
    expect(names(el, '.rproblems li')).toEqual(['A device of this rule is no longer on the plan.']);
    expect(names(el, '[data-field="input-0"] .grow')).toEqual(['(missing device)']);
    expect(okBtn(el).disabled).toBe(true);
  });

  it('inputs offer input devices and other rules only; actions offer actionable devices only', async () => {
    const el = await open();
    el.openRuleDialog('condition', 'rule-leak');
    await el.updateComplete;
    const opts = [...q<HTMLSelectElement>(el, 'select[data-action="add-input"]').options].map(o => o.value).filter(Boolean);
    expect(opts).toContain('d:d-leak');
    expect(opts).toContain('d:d-valve');
    expect(opts).toContain('r:rule-motion');
    expect(opts).not.toContain('r:rule-leak');
    const act = [...q<HTMLSelectElement>(el, 'select[data-action="add-action-true"]').options].map(o => o.value).filter(Boolean);
    expect(act).toContain('d-valve');
    expect(act).not.toContain('d-leak');
    expect(act).not.toContain('d-motion');
    // a valve takes open / close only
    expect([...q<HTMLSelectElement>(el, '[data-field="action-true-0"] [data-part="do"]').options].map(o => o.value)).toEqual(['open', 'close']);
  });

  it('keys, canvas clicks, steps and tools do nothing while open; Esc cancels', async () => {
    const el = await open([]);
    await press(el, 'button[data-template="condition"]');
    click(el, 300, 300);
    expect(el.selection).toBeNull();
    key(el, 'keydown', 'z', { ctrlKey: true, code: 'KeyZ' });
    key(el, 'keydown', 'Delete');
    el.setMode('plan');
    el.pickTool('select');
    expect(el.mode).toBe('automation');
    expect(el.toolId).toBe('zone-pick');
    await el.updateComplete;
    for (const x of el.shadowRoot!.querySelectorAll('.ed > :not(.backdrop)')) expect(x.hasAttribute('inert')).toBe(true);
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.dialog).toBeNull();
    expect(el.ruleDraft).toBeNull();
    expect(el.rules).toEqual([]);
    expect(el.shadowRoot!.querySelector('.rule-backdrop')).toBeNull();
    for (const x of el.shadowRoot!.querySelectorAll('.ed > *')) expect(x.hasAttribute('inert')).toBe(false);
  });

  it('a click on an input block focuses that input field and highlights the block', async () => {
    const el = await open();
    el.openRuleDialog('condition', 'rule-motion');
    await el.updateComplete;
    q<SVGElement>(el, '.fc-blk[data-block="input-1"]').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await vi.waitFor(() => expect(el.ruleDraft!.focused).toBe('input-1'));
    await el.updateComplete;
    const row = q<HTMLElement>(el, '[data-field="input-1"]');
    const active = el.shadowRoot!.activeElement;
    expect(active === row || row.contains(active)).toBe(true);
    expect(q(el, '.fc-blk[data-block="input-1"]').classList.contains('hl')).toBe(true);
  });

  it('notes: "Live state appears after Save" for a new rule; the saved trace plus a note after an edit', async () => {
    const el = await open();
    await press(el, 'button[data-template="condition"]');
    expect(q(el, '.fc-note').textContent).toBe('Live state appears after Save');
    await press(el, 'button[data-action="rule-cancel"]');
    el.openRuleDialog('condition', 'rule-leak');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.rule-backdrop .fc-note')).toBeNull();
    expect(q(el, '.fc-blk[data-block="input-0"]').textContent).toContain('wet');
    await type(el, '[data-field="name"]', 'Other name');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
    expect(q(el, '.fc-blk[data-block="input-0"]').textContent).not.toContain('wet'); // no live values after an edit
    expect(q(el, '.fc-blk[data-block="input-0"]').classList.contains('on')).toBe(false);
    await type(el, '[data-field="name"]', 'Leak Main -> valve'); // back to the saved values
    expect(el.shadowRoot!.querySelector('.rule-backdrop .fc-note')).toBeNull();
    expect(q(el, '.fc-blk[data-block="input-0"]').textContent).toContain('wet');
  });
});
