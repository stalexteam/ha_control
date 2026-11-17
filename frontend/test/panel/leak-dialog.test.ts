// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, mount, pickAutomation, press } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';

async function open(rules?: Rule[], mutate?: (p: Plan) => void, scene = 'leak-wet'): Promise<PlanStudioPanel> {
  const plan: Plan = structuredClone(SCENES[scene].plans[0]);
  if (rules) plan.rules = rules;
  mutate?.(plan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
  const el = await mount(createMockHass({ rulesFrame: SCENES[scene].rulesFrame }));
  el.setMode('automation');
  await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
  await el.updateComplete;
  return el;
}

const q = <T extends Element>(el: PlanStudioPanel, sel: string): T => $<T>(el, `.rule-backdrop ${sel}`);
const has = (el: PlanStudioPanel, sel: string): boolean => !!el.shadowRoot!.querySelector(`.rule-backdrop ${sel}`);
const okBtn = (el: PlanStudioPanel) => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]');
const problems = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.rule-backdrop .rproblems li')].map(x => x.textContent);
const chips = (el: PlanStudioPanel, f: string) =>
  [...el.shadowRoot!.querySelectorAll(`.rule-backdrop [data-group="${f}"] .rchip`)].map(c => c.getAttribute('data-id'));
const options = (el: PlanStudioPanel, f: string) => [...q<HTMLSelectElement>(el, `[data-field="${f}"]`).options].map(o => o.value);

async function selectZone(el: PlanStudioPanel, id: string | null): Promise<void> {
  el.selection = id === null ? null : { kind: 'zone', id };
  await el.updateComplete;
}

async function edit(el: PlanStudioPanel, id = 'rule-leakp'): Promise<void> {
  await selectZone(el, 'r0');
  await press(el, `.rrow[data-id="${id}"] button[data-action="rule-edit"]`);
}

async function add(el: PlanStudioPanel, f: string, value: string): Promise<void> {
  const s = q<HTMLSelectElement>(el, `[data-field="${f}"]`);
  s.value = value;
  s.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
}

describe('Leak protection form', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Automations menu lists Leak protection after the others', async () => {
    const el = await open([]);
    await press(el, 'button[data-action="automations"]');
    const items = [...el.shadowRoot!.querySelectorAll('.amenu [role="menuitem"]')];
    expect(items.map(i => i.getAttribute('data-automation'))).toEqual(['vent', 'boiler', 'leak']);
    expect(items[2].textContent!.trim()).toBe('Leak protection');
  });

  it('opens pre-filled with the selected zone\'s leak sensors and valves; OK adds the leak rule', async () => {
    const el = await open([]);
    await selectZone(el, 'r0');
    await pickAutomation(el, 'leak');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(q(el, 'h3').textContent).toBe('Leak protection');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Leak protection Main');
    expect(chips(el, 'leak-sensors')).toEqual(['d-leak', 'd-leak2']);
    expect(chips(el, 'leak-valves')).toEqual(['d-valve', 'd-valve2']);
    expect(okBtn(el).disabled).toBe(false);
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({
      name: 'Leak protection Main', zoneId: 'r0', combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [],
      leak: { sensors: ['d-leak', 'd-leak2'], valves: ['d-valve', 'd-valve2'] },
    });
  });

  it('without a zone the lists start empty: pick hints, OK blocked; adding one of each enables OK', async () => {
    const el = await open([]);
    await selectZone(el, null);
    await pickAutomation(el, 'leak');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Leak protection');
    expect(chips(el, 'leak-sensors')).toEqual([]);
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Add at least one leak sensor', 'Add at least one valve']);
    expect(options(el, 'leak-sensors')).toEqual(['', 'd-leak', 'd-leak2']);
    expect(options(el, 'leak-valves')).toEqual(['', 'd-valve', 'd-valve2']);
    await add(el, 'leak-sensors', 'd-leak2');
    expect(chips(el, 'leak-sensors')).toEqual(['d-leak2']);
    expect(options(el, 'leak-sensors')).toEqual(['', 'd-leak']); // an added sensor leaves the add select
    expect(q<HTMLSelectElement>(el, '[data-field="leak-sensors"]').value).toBe('');
    expect(problems(el)).toEqual(['Add at least one valve']);
    await add(el, 'leak-valves', 'd-valve');
    expect(problems(el)).toEqual([]);
    expect(okBtn(el).disabled).toBe(false);
    expect(el.ruleDraft!.rule.leak).toEqual({ sensors: ['d-leak2'], valves: ['d-valve'] });
  });

  it('a chip\'s x removes it from the rule', async () => {
    const el = await open();
    await edit(el);
    await press(el, '[data-group="leak-valves"] .rchip[data-id="d-valve2"] button[data-action="remove"]');
    expect(el.ruleDraft!.rule.leak!.valves).toEqual(['d-valve']);
    expect(options(el, 'leak-valves')).toEqual(['', 'd-valve2']);
  });

  it('a deleted device stays as a marked chip and blocks OK with the missing-device text', async () => {
    const el = await open(undefined, p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-valve2'); });
    await edit(el);
    expect(q(el, '[data-group="leak-valves"] .rchip[data-id="d-valve2"]').classList.contains('bad')).toBe(true);
    expect(q(el, '[data-group="leak-valves"] .rchip[data-id="d-valve2"]').textContent).toContain('(missing device)');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['A device of this rule is no longer on the plan.']);
  });

  it('Edit of a leak rule opens the leak form in the compact frame with live values of the saved rule', async () => {
    const el = await open();
    await edit(el);
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .rsettings [data-field="leak-sensors"]')).toBeTruthy();
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .flow svg.vt')).toBeTruthy();
    expect(q(el, '.dialog.rdlg.pdlg > .rfoot [data-field="zone"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.rule-backdrop svg.fc')).toBeNull();
    const flow = () => q<HTMLElement>(el, '.flow').textContent!;
    expect(flow()).toContain('Leak: yes');
    expect(flow()).toContain('re-closed');
    await add(el, 'leak-sensors', ''); // no-op
    const name = q<HTMLInputElement>(el, '[data-field="name"]');
    name.value = 'Renamed';
    name.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(flow()).not.toContain('Leak: yes');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
  });

  it('a click on a sensor or valve block focuses the add select of its list and highlights the block', async () => {
    const el = await open();
    await edit(el);
    q(el, '[data-block="leak-valve:d-valve2"]').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(q(el, '[data-field="leak-valves"]'));
    expect(q(el, '[data-block="leak-valve:d-valve2"]').classList.contains('hl')).toBe(true);
    expect(q(el, '[data-group="leak-valves"] .rchip[data-id="d-valve2"]').classList.contains('hl')).toBe(true);
    expect(q(el, '[data-group="leak-valves"] .rchip[data-id="d-valve"]').classList.contains('hl')).toBe(false);
    q(el, '[data-block="leak"]').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(q(el, '[data-field="leak-sensors"]'));
    (el.shadowRoot!.activeElement as HTMLElement).blur(); // happy-dom: a focused element of a removed panel breaks the next test
  });

  it('the condition dialog keeps its large frame; vent and boiler share the compact one', async () => {
    const el = await open();
    await press(el, 'button[data-template="condition"]');
    expect(has(el, '.dialog.rdlg')).toBe(true);
    expect(has(el, '.dialog.pdlg')).toBe(false);
    await press(el, 'button[data-action="rule-cancel"]');
    await selectZone(el, 'r0');
    await pickAutomation(el, 'vent');
    expect(has(el, '.dialog.rdlg.pdlg')).toBe(true);
    await press(el, 'button[data-action="rule-cancel"]');
    await pickAutomation(el, 'boiler');
    expect(has(el, '.dialog.rdlg.pdlg')).toBe(true);
  });
});
