// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, mount, pickAutomation, press } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { isBeurerRule } from '../../src/model/rules';

async function open(withRule = false): Promise<PlanStudioPanel> {
  const plan: Plan = structuredClone(SCENES.beurer.plans[0]);
  if (!withRule) plan.rules = [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
  const el = await mount(createMockHass({ rulesFrame: SCENES.beurer.rulesFrame }));
  el.setMode('automation');
  await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
  await el.updateComplete;
  return el;
}

const q = <T extends Element>(el: PlanStudioPanel, sel: string): T => $<T>(el, `.rule-backdrop ${sel}`);
const okBtn = (el: PlanStudioPanel) => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]');
const problems = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.rule-backdrop .rproblems li')].map(x => x.textContent);
const options = (el: PlanStudioPanel, f: string) => [...q<HTMLSelectElement>(el, `[data-field="${f}"]`).options].map(o => o.value);

async function set(el: PlanStudioPanel, sel: string, value: string, ev = 'input'): Promise<void> {
  const f = q<HTMLInputElement | HTMLSelectElement>(el, sel);
  f.value = value;
  f.dispatchEvent(new Event(ev, { bubbles: true, composed: true }));
  await el.updateComplete;
}

async function openNew(el: PlanStudioPanel): Promise<void> {
  el.selection = null;
  await el.updateComplete;
  await pickAutomation(el, 'beurer');
}

describe('Beurer heater form', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Automations menu lists Beurer heater last, with an icon; choosing it opens the dialog on a beurer rule', async () => {
    const el = await open();
    await press(el, 'button[data-action="automations"]');
    const items = [...el.shadowRoot!.querySelectorAll('.amenu [role="menuitem"]')];
    expect(items.map(i => i.getAttribute('data-automation'))).toEqual(['vent', 'boiler', 'leak', 'timed', 'outside', 'beurer']);
    expect(items[5].textContent!.trim()).toBe('Beurer heater');
    expect(items[5].querySelector('svg.ticon')).toBeTruthy();
    await press(el, '.amenu [data-automation="beurer"]');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(isBeurerRule(el.ruleDraft!.rule)).toBe(true);
    expect(q(el, '.dialog.rdlg.pdlg h3').textContent).toBe('Beurer heater');
  });

  it('renders the six fields with the template values', async () => {
    const el = await open();
    await openNew(el);
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Beurer heater');
    expect(q<HTMLSelectElement>(el, '[data-field="beurer-heater"]').value).toBe('');
    expect(q<HTMLSelectElement>(el, '[data-field="beurer-source"]').value).toBe('');
    expect(['above', 'off', 'keep', 'every'].map(k => q<HTMLInputElement>(el, `[data-field="beurer-${k}"]`).value)).toEqual(['200', '60', '10', '30']);
    expect(q(el, '.rsettings').textContent).toContain('0 = never');
    expect(q(el, '.fc-note').textContent).toBe('Live state appears after Save');
  });

  it('the heater list holds the devices taking on; the power source list holds devices with a Power binding, without the chosen heater', async () => {
    const el = await open();
    await openNew(el);
    expect(options(el, 'beurer-heater')).toEqual(expect.arrayContaining(['', 'd-leg', 'd-light']));
    expect(options(el, 'beurer-heater')).not.toContain('d-desk');
    expect(options(el, 'beurer-source')).toEqual(expect.arrayContaining(['', 'd-leg', 'd-desk']));
    expect(options(el, 'beurer-source')).not.toContain('d-light');
    await set(el, '[data-field="beurer-heater"]', 'd-leg', 'change');
    expect(options(el, 'beurer-source')).toContain('d-desk');
    expect(options(el, 'beurer-source')).not.toContain('d-leg');
  });

  it('Off after writes the rule\'s off delay; Re-power every 0 writes beurer.every 0', async () => {
    const el = await open();
    await openNew(el);
    await set(el, '[data-field="beurer-off"]', '90');
    expect(el.ruleDraft!.rule.offDelay).toBe(90);
    await set(el, '[data-field="beurer-every"]', '0');
    expect(el.ruleDraft!.rule.beurer!.every).toBe(0);
    await set(el, '[data-field="beurer-above"]', '350');
    await set(el, '[data-field="beurer-keep"]', '15');
    expect(el.ruleDraft!.rule.beurer).toMatchObject({ above: 350, keep: 15, every: 0 });
    expect(q(el, '[data-block="beurer-wants"]').textContent).toContain('on above 350 W, off after 1:30');
  });

  it('OK is blocked with an empty heater or source, a pick hint each; picking both enables it and OK adds the rule', async () => {
    const el = await open();
    await openNew(el);
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Choose the heater', 'Choose the power source']);
    await set(el, '[data-field="beurer-heater"]', 'd-leg', 'change');
    expect(problems(el)).toEqual(['Choose the power source']);
    await set(el, '[data-field="beurer-source"]', 'd-desk', 'change');
    expect(problems(el)).toEqual([]);
    expect(okBtn(el).disabled).toBe(false);
    await set(el, '[data-field="beurer-above"]', '0');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Beurer heater: pick a heater that can be switched on and a different device with a Power binding, a threshold above 0 W, and whole minutes 0 to 1440.']);
    await set(el, '[data-field="beurer-above"]', '250');
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({ offDelay: 60, beurer: { heater: 'd-leg', source: 'd-desk', above: 250, keep: 10, every: 30 } });
  });

  it('a saved unchanged rule shows live values in the diagram; an edit drops them', async () => {
    const el = await open(true);
    el.selection = { kind: 'zone', id: 'z-yard' };
    await el.updateComplete;
    await press(el, '.rrow[data-id="rule-beurer"] button[data-action="rule-edit"]');
    expect(q(el, '[data-block="beurer-source"]').textContent).toContain('312 W');
    expect(q(el, '[data-block="beurer-every"]').textContent).toMatch(/next in \d+:\d\d/);
    await set(el, '[data-field="beurer-above"]', '300');
    expect(q(el, '[data-block="beurer-source"]').textContent).not.toContain('312 W');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
  });
});
