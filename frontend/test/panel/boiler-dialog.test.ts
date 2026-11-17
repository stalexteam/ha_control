// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, mount, pickAutomation, press, undo } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';

async function open(rules?: Rule[], mutate?: (p: Plan) => void, rulesFrame = SCENES.boiler.rulesFrame): Promise<PlanStudioPanel> {
  const plan: Plan = structuredClone(SCENES.boiler.plans[0]);
  if (rules) plan.rules = rules;
  mutate?.(plan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
  const el = await mount(createMockHass({ rulesFrame }));
  el.setMode('automation');
  await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
  await el.updateComplete;
  return el;
}

const q = <T extends Element>(el: PlanStudioPanel, sel: string): T => $<T>(el, `.rule-backdrop ${sel}`);
const has = (el: PlanStudioPanel, sel: string): boolean => !!el.shadowRoot!.querySelector(`.rule-backdrop ${sel}`);
const okBtn = (el: PlanStudioPanel) => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]');
const sceneRule = (id: string): Rule => structuredClone(SCENES.boiler.plans[0].rules!.find(r => r.id === id)!);
const problems = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.rule-backdrop .rproblems li')].map(x => x.textContent);

async function selectZone(el: PlanStudioPanel, id: string): Promise<void> {
  el.selection = { kind: 'zone', id };
  await el.updateComplete;
}

async function edit(el: PlanStudioPanel, id: string): Promise<void> {
  await selectZone(el, 'z-util');
  await press(el, `.rrow[data-id="${id}"] button[data-action="rule-edit"]`);
}

async function set(el: PlanStudioPanel, sel: string, value: string, ev = 'input'): Promise<void> {
  const f = q<HTMLInputElement | HTMLSelectElement>(el, sel);
  f.value = value;
  f.dispatchEvent(new Event(ev, { bubbles: true, composed: true }));
  await el.updateComplete;
}

async function check(el: PlanStudioPanel, sel: string, on: boolean): Promise<void> {
  const f = q<HTMLInputElement>(el, sel);
  f.checked = on;
  f.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
}

describe('Boiler form', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Automations menu offers the Cost effective boiler; it opens the boiler form pre-filled from the selected zone', async () => {
    const el = await open([]);
    await selectZone(el, 'z-util');
    await pickAutomation(el, 'boiler');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(q(el, 'h3').textContent).toBe('Cost effective boiler');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Cost effective boiler Utility');
    expect(q<HTMLSelectElement>(el, '[data-field="boiler-device"]').value).toBe('d-boiler');
    expect(q<HTMLSelectElement>(el, '[data-field="boiler-button"]').value).toBe('d-button-boiler');
    expect(q<HTMLInputElement>(el, '[data-field="boiler-limit-on"]').checked).toBe(true);
    expect(q<HTMLSelectElement>(el, '[data-field="boiler-grid"]').value).toBe('grid');
    expect(q<HTMLInputElement>(el, '[data-field="boiler-limit"]').value).toBe('3000');
    expect(q<HTMLInputElement>(el, '[data-field="boiler-nominal"]').value).toBe('1400');
    expect(okBtn(el).disabled).toBe(false);
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({
      name: 'Cost effective boiler Utility', zoneId: 'z-util', combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [],
      boiler: { device: 'd-boiler', button: 'd-button-boiler', grid: { block: 'grid', limit: 3000, nominal: 1400 } },
    });
  });

  it('selects offer only eligible devices: boilers with control + power, wall switches and smart buttons, grids with power', async () => {
    const el = await open([], p => {
      p.power!.blocks.push({ id: 'grid2', kind: 'grid', x: 0, y: 200, name: 'No sensor' });
    });
    await selectZone(el, 'z-util');
    await pickAutomation(el, 'boiler');
    const opts = (f: string) => [...q<HTMLSelectElement>(el, `[data-field="${f}"]`).options].map(o => o.value);
    expect(opts('boiler-device')).toEqual(['', 'd-socket', 'd-boiler']);
    expect(opts('boiler-button')).toEqual(['', 'd-button-boiler']);
    expect(opts('boiler-grid')).toEqual(['', 'grid']);
  });

  it('the template skips a grid block without a power entity', async () => {
    const el = await open([], p => { delete (p.power!.blocks[0] as { power?: string }).power; });
    await selectZone(el, 'z-util');
    await pickAutomation(el, 'boiler');
    expect(q<HTMLInputElement>(el, '[data-field="boiler-limit-on"]').checked).toBe(false);
    expect(el.ruleDraft!.rule.boiler!.grid).toBeUndefined();
  });

  it('the Power limit checkbox adds the grid with the single grid block and defaults, and removes it', async () => {
    const el = await open([sceneRule('rule-boiler-nl')]);
    await edit(el, 'rule-boiler-nl');
    expect(q<HTMLInputElement>(el, '[data-field="boiler-limit-on"]').checked).toBe(false);
    expect(has(el, '[data-field="boiler-grid"]')).toBe(false);
    expect(has(el, '[data-field="boiler-limit"]')).toBe(false);
    expect(has(el, '[data-block="boiler-grid"]')).toBe(false);
    await check(el, '[data-field="boiler-limit-on"]', true);
    expect(el.ruleDraft!.rule.boiler!.grid).toEqual({ block: 'grid', limit: 3000, nominal: 1400 });
    expect(has(el, '[data-block="boiler-grid"]')).toBe(true);
    expect(has(el, '[data-block="boiler-limit"]')).toBe(true);
    await set(el, '[data-field="boiler-limit"]', '2500');
    await set(el, '[data-field="boiler-nominal"]', '1500');
    expect(el.ruleDraft!.rule.boiler!.grid).toEqual({ block: 'grid', limit: 2500, nominal: 1500 });
    await check(el, '[data-field="boiler-limit-on"]', false);
    expect(el.ruleDraft!.rule.boiler).toEqual({ device: 'd-boiler', button: 'd-button-boiler' });
    expect('grid' in el.ruleDraft!.rule.boiler!).toBe(false);
  });

  it('with several grid blocks the checkbox leaves the Grid pick empty and OK waits for it', async () => {
    const el = await open([sceneRule('rule-boiler-nl')], p => {
      p.power!.blocks.push({ id: 'grid2', kind: 'grid', x: 0, y: 200, name: 'Generator', power: 'sensor.gen_power' });
    });
    await edit(el, 'rule-boiler-nl');
    await check(el, '[data-field="boiler-limit-on"]', true);
    expect(el.ruleDraft!.rule.boiler!.grid).toEqual({ block: '', limit: 3000, nominal: 1400 });
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Choose the grid block']);
    await set(el, '[data-field="boiler-grid"]', 'grid2', 'change');
    expect(okBtn(el).disabled).toBe(false);
  });

  it('OK is blocked on empty picks (pick hints) and a limit or boiler power not above 0', async () => {
    const el = await open([sceneRule('rule-boiler')]);
    await edit(el, 'rule-boiler');
    expect(okBtn(el).disabled).toBe(false);
    await set(el, '[data-field="boiler-device"]', '', 'change');
    await set(el, '[data-field="boiler-button"]', '', 'change');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Choose the boiler', 'Choose the button']);
    await set(el, '[data-field="boiler-device"]', 'd-boiler', 'change');
    await set(el, '[data-field="boiler-button"]', 'd-button-boiler', 'change');
    expect(okBtn(el).disabled).toBe(false);
    await set(el, '[data-field="boiler-limit"]', '0');
    expect(okBtn(el).disabled).toBe(true);
    expect(q(el, '.rproblems [data-problem="boiler"]')).toBeTruthy();
    await set(el, '[data-field="boiler-limit"]', '3000');
    await set(el, '[data-field="boiler-nominal"]', '');
    expect(okBtn(el).disabled).toBe(true);
    expect(q<HTMLInputElement>(el, '[data-field="boiler-nominal"]').value).toBe('');
  });

  it('a deleted boiler or a grid block that lost its power entity blocks OK with the missing-device text', async () => {
    const el = await open([sceneRule('rule-boiler')], p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-boiler'); });
    await edit(el, 'rule-boiler');
    expect(okBtn(el).disabled).toBe(true);
    expect(q(el, '.rproblems [data-problem="device-missing"]')).toBeTruthy();
    expect(q<HTMLSelectElement>(el, '[data-field="boiler-device"]').value).toBe('d-boiler');
    document.body.innerHTML = ''; localStorage.clear();
    const el2 = await open([sceneRule('rule-boiler')], p => { delete (p.power!.blocks[0] as { power?: string }).power; });
    await edit(el2, 'rule-boiler');
    expect(okBtn(el2).disabled).toBe(true);
    expect(q(el2, '.rproblems [data-problem="device-missing"]')).toBeTruthy();
  });

  it('Edit of a boiler rule opens the boiler form in the shared frame, not the flowchart dialog', async () => {
    const el = await open();
    await edit(el, 'rule-boiler');
    expect(q(el, '.dialog.rdlg > .rcols > .rsettings [data-field="boiler-device"]')).toBeTruthy();
    expect(q(el, '.dialog.rdlg > .rcols > .flow svg.vt')).toBeTruthy();
    expect(q(el, '.dialog.rdlg > .rfoot [data-field="zone"]')).toBeTruthy();
    expect(q(el, '.dialog.rdlg > .rfoot [data-field="enabled"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.rule-backdrop svg.fc')).toBeNull();
  });

  it('a saved unchanged rule shows live values; an edit hides them and notes the saved version', async () => {
    const el = await open();
    await edit(el, 'rule-boiler');
    const flow = () => q<HTMLElement>(el, '.flow').textContent!;
    expect(flow()).toContain('Mode: auto');
    expect(flow()).toContain('blackout');
    expect(q(el, '[data-block="boiler-grid"]').classList).toContain('nodata');
    await set(el, '[data-field="boiler-limit"]', '2800');
    expect(flow()).not.toContain('Mode: auto');
    expect(flow()).not.toContain('blackout');
    expect(flow()).toContain('grid + 1400 - boiler ≤ 2800 W');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
  });

  it('the relay countdown runs the 1 s ticker while the saved rule is shown', async () => {
    const el = await open();
    await edit(el, 'rule-boiler-nl');
    expect(q<HTMLElement>(el, '[data-block="boiler-device"]').textContent).toMatch(/heating, power check in 0:\d\d/);
    expect(el.tickerOn).toBe(true);
    await set(el, '[data-field="name"]', 'Other');
    expect(el.tickerOn).toBe(false);
  });

  it('a new rule shows no live values', async () => {
    const el = await open();
    await selectZone(el, 'z-util');
    await pickAutomation(el, 'boiler');
    expect(q<HTMLElement>(el, '.flow').textContent).not.toContain('Mode: auto');
    expect(q(el, '.fc-note').textContent).toBe('Live state appears after Save');
  });

  it('a click on a diagram block focuses its form field and highlights the block', async () => {
    const el = await open();
    await edit(el, 'rule-boiler');
    for (const f of ['boiler-grid', 'boiler-limit', 'boiler-button', 'boiler-device', 'boiler-nominal']) {
      q(el, `[data-block="${f}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await el.updateComplete;
      await el.updateComplete;
      expect(el.shadowRoot!.activeElement?.getAttribute('data-field')).toBe(f);
      expect(q(el, `[data-block="${f}"]`).classList).toContain('hl');
    }
    (el.shadowRoot!.activeElement as HTMLElement).blur(); // happy-dom trips over a focused element of a removed panel
  });

  it('Cancel leaves rules untouched; one undo reverts an OK', async () => {
    const el = await open([]);
    await selectZone(el, 'z-util');
    await pickAutomation(el, 'boiler');
    await press(el, 'button[data-action="rule-cancel"]');
    expect(el.rules).toEqual([]);
    await pickAutomation(el, 'boiler');
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules).toHaveLength(1);
    await undo(el);
    expect(el.rules).toEqual([]);
  });
});

describe('Automations menu', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  const items = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.amenu [role="menuitem"]')];

  it('one rail button replaces the purpose-built templates; the condition templates stay', async () => {
    const el = await open([]);
    const rail = [...el.shadowRoot!.querySelectorAll('.tools button[data-template]')].map(b => b.getAttribute('data-template'));
    expect(rail).toEqual(['condition', 'leak', 'timer', 'outside']);
    expect(el.shadowRoot!.querySelector('button[data-template="vent"], button[data-template="boiler"]')).toBeNull();
    const btn = $<HTMLButtonElement>(el, '.tools button[data-action="automations"]');
    expect(btn.textContent).toContain('Automations');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(el.shadowRoot!.querySelector('.amenu')).toBeNull();
  });

  it('lists both automations, focuses the first; arrows move the focus; the button toggles it', async () => {
    const el = await open([]);
    await press(el, 'button[data-action="automations"]');
    expect($(el, 'button[data-action="automations"]').getAttribute('aria-expanded')).toBe('true');
    expect(items(el).map(i => i.getAttribute('data-automation'))).toEqual(['vent', 'boiler']);
    expect(items(el).map(i => i.textContent!.trim())).toEqual(['Wet zone ventilation', 'Cost effective boiler']);
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(items(el)[0]);
    const menu = $(el, '.amenu');
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    expect(el.shadowRoot!.activeElement).toBe(items(el)[1]);
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    expect(el.shadowRoot!.activeElement).toBe(items(el)[0]);
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true }));
    expect(el.shadowRoot!.activeElement).toBe(items(el)[1]);
    (el.shadowRoot!.activeElement as HTMLElement).blur();
    await press(el, 'button[data-action="automations"]');
    expect(el.shadowRoot!.querySelector('.amenu')).toBeNull();
  });

  it('each item opens its own dialog and closes the menu', async () => {
    const el = await open([]);
    await selectZone(el, 'z-util');
    await pickAutomation(el, 'vent');
    expect(el.shadowRoot!.querySelector('.amenu')).toBeNull();
    expect(q(el, 'h3').textContent).toBe('Wet zone ventilation');
    expect(q(el, '[data-field="vent-sensor"]')).toBeTruthy();
    await press(el, 'button[data-action="rule-cancel"]');
    await pickAutomation(el, 'boiler');
    expect(q(el, 'h3').textContent).toBe('Cost effective boiler');
    expect(q(el, '[data-field="boiler-device"]')).toBeTruthy();
  });

  it('Escape closes the menu (and nothing else); a click outside closes it', async () => {
    const el = await open([]);
    await selectZone(el, 'z-util');
    await press(el, 'button[data-action="automations"]');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.automationsMenu).toBeNull();
    expect(el.shadowRoot!.querySelector('.amenu')).toBeNull();
    expect(el.selection).toEqual({ kind: 'zone', id: 'z-util' });
    await press(el, 'button[data-action="automations"]');
    $(el, '.amenu-back').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.amenu')).toBeNull();
    expect(el.dialog).toBeNull();
  });

  it('leaving the Automation step closes the menu', async () => {
    const el = await open([]);
    await press(el, 'button[data-action="automations"]');
    el.setMode('plan');
    await el.updateComplete;
    expect(el.automationsMenu).toBeNull();
    expect(el.shadowRoot!.querySelector('.amenu')).toBeNull();
  });
});
