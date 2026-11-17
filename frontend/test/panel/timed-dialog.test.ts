// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, mount, pickAutomation, press } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { lastText } from '../../src/panel/rules-panel';

async function open(rules?: Rule[], mutate?: (p: Plan) => void, scene = 'timed-run'): Promise<PlanStudioPanel> {
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
const okBtn = (el: PlanStudioPanel) => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]');
const problems = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.rule-backdrop .rproblems li')].map(x => x.textContent);
const options = (el: PlanStudioPanel, f: string) => [...q<HTMLSelectElement>(el, `[data-field="${f}"]`).options].map(o => [o.value, o.textContent!.trim()]);
const events = (el: PlanStudioPanel) => el.shadowRoot!.querySelector('.rule-backdrop [data-note="events"]')?.textContent?.trim() ?? null;
const sceneRule = (id: string): Rule => structuredClone(SCENES.timed.plans[0].rules!.find(r => r.id === id)!);

async function selectZone(el: PlanStudioPanel, id: string | null): Promise<void> {
  el.selection = id === null ? null : { kind: 'zone', id };
  await el.updateComplete;
}

async function edit(el: PlanStudioPanel, id = 'rule-timed', zone = 'z-wc'): Promise<void> {
  await selectZone(el, zone);
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

describe('Timed switch form', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Automations menu lists Timed switch last', async () => {
    const el = await open([]);
    await press(el, 'button[data-action="automations"]');
    const items = [...el.shadowRoot!.querySelectorAll('.amenu [role="menuitem"]')];
    expect(items.map(i => i.getAttribute('data-automation'))).toEqual(['vent', 'boiler', 'leak', 'timed']);
    expect(items[3].textContent!.trim()).toBe('Timed switch');
  });

  it('opens pre-filled with the zone\'s button and device, 15 min; OK adds the timed rule', async () => {
    const el = await open([]);
    await selectZone(el, 'z-wc');
    await pickAutomation(el, 'timed');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(q(el, '.dialog.rdlg.pdlg h3').textContent).toBe('Timed switch');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Timed switch WC');
    expect(q<HTMLSelectElement>(el, '[data-field="timed-button"]').value).toBe('d-button-vent');
    expect(q<HTMLSelectElement>(el, '[data-field="timed-device"]').value).toBe('d-vent');
    expect(q<HTMLInputElement>(el, '[data-field="timed-minutes"]').value).toBe('15');
    expect(q<HTMLInputElement>(el, '[data-field="timed-invert"]').checked).toBe(false);
    expect(events(el)).toBe('start: on (1 hold), stop: off (2 hold)');
    expect(okBtn(el).disabled).toBe(false);
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({
      name: 'Timed switch WC', zoneId: 'z-wc', combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [],
      timed: { button: 'd-button-vent', device: 'd-vent', minutes: 15 },
    });
    expect(el.rules[0].timed!.invert).toBeUndefined();
  });

  it('without a zone the selects start empty: pick hints, OK blocked; the lists hold buttons and on/off devices', async () => {
    const el = await open([]);
    await selectZone(el, null);
    await pickAutomation(el, 'timed');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Timed switch');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Choose the button', 'Choose the device']);
    expect(events(el)).toBeNull();
    expect(options(el, 'timed-button')).toEqual([['', 'Choose...'], ['d-button-vent', 'Button vent'], ['d-switch-hall', 'Switch hall']]);
    expect(options(el, 'timed-device').map(o => o[0])).toEqual(['', 'd-light', 'd-socket', 'd-fan', 'd-vent']);
    await set(el, '[data-field="timed-button"]', 'd-switch-hall', 'change');
    expect(events(el)).toBe('start: switched on, stop: switched off');
    expect(problems(el)).toEqual(['Choose the device']);
    await set(el, '[data-field="timed-device"]', 'd-light', 'change');
    expect(problems(el)).toEqual([]);
    expect(okBtn(el).disabled).toBe(false);
    expect(el.ruleDraft!.rule.timed).toEqual({ button: 'd-switch-hall', device: 'd-light', minutes: 15 });
  });

  it('a smart button without a separate off: the on trigger starts, no stop', async () => {
    const el = await open([], p => {
      const b = p.levels[0].devices.find(d => d.id === 'd-button-vent')!;
      b.props = { ...b.props, separateOff: false, on: { slot: 0, event: 'single' } } as typeof b.props;
    });
    await selectZone(el, 'z-wc');
    await pickAutomation(el, 'timed');
    expect(events(el)).toBe('start: on (single), no stop');
  });

  it('duration 1..1440 whole minutes; invert sets and clears the flag', async () => {
    const el = await open([]);
    await selectZone(el, 'z-wc');
    await pickAutomation(el, 'timed');
    await set(el, '[data-field="timed-minutes"]', '0');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Timed switch: pick a button and a different device that can be switched on, and a duration of 1 to 1440 minutes.']);
    await set(el, '[data-field="timed-minutes"]', '');
    expect(okBtn(el).disabled).toBe(true);
    await set(el, '[data-field="timed-minutes"]', '1440');
    expect(okBtn(el).disabled).toBe(false);
    expect(el.ruleDraft!.rule.timed!.minutes).toBe(1440);
    expect(q(el, '[data-block="timed-minutes"]').textContent).toContain('on for 24 h, then off');
    await check(el, '[data-field="timed-invert"]', true);
    expect(el.ruleDraft!.rule.timed!.invert).toBe(true);
    expect(q(el, '[data-block="timed-minutes"]').textContent).toContain('off for 24 h, then on');
    await check(el, '[data-field="timed-invert"]', false);
    expect('invert' in el.ruleDraft!.rule.timed!).toBe(false);
  });

  it('a deleted device stays selectable as missing and blocks OK with the missing-device text', async () => {
    const el = await open(undefined, p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-vent'); });
    await edit(el);
    expect(q<HTMLSelectElement>(el, '[data-field="timed-device"]').value).toBe('d-vent');
    expect(options(el, 'timed-device')).toContainEqual(['d-vent', '(missing device)']);
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['A device of this rule is no longer on the plan.']);
  });

  it('Edit of a timed rule opens the compact frame with live values of the saved rule; an edit hides them', async () => {
    const el = await open();
    await edit(el);
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .rsettings [data-field="timed-button"]')).toBeTruthy();
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .flow svg.vt')).toBeTruthy();
    expect(q(el, '.dialog.rdlg.pdlg > .rfoot [data-field="zone"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.rule-backdrop svg.fc')).toBeNull();
    const flow = () => q<HTMLElement>(el, '.flow').textContent!;
    expect(flow()).toMatch(/Running, ends in \d+:\d\d/);
    expect(flow()).toContain('Button vent');
    expect(flow()).toContain('start: on (1 hold), stop: off (2 hold)');
    expect(el.tickerOn).toBe(true);
    await set(el, '[data-field="timed-minutes"]', '12');
    expect(flow()).not.toContain('Running');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
    expect(el.tickerOn).toBe(false);
  });

  it('an idle saved rule runs no ticker', async () => {
    const el = await open(undefined, undefined, 'timed');
    await edit(el);
    expect(q<HTMLElement>(el, '.flow').textContent).toContain('Idle');
    expect(el.tickerOn).toBe(false);
  });

  it('a click on a diagram block focuses its form field', async () => {
    const el = await open();
    await edit(el);
    q(el, '[data-block="timed-device"]').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement?.getAttribute('data-field')).toBe('timed-device');
    expect(q(el, '[data-block="timed-device"]').classList).toContain('hl');
    (el.shadowRoot!.activeElement as HTMLElement).blur(); // happy-dom keeps a stale focus across tests
  });

  it('the inverted scene rule opens with the box checked', async () => {
    const el = await open([sceneRule('rule-timed-inv')]);
    await edit(el, 'rule-timed-inv', 'r0');
    expect(q<HTMLInputElement>(el, '[data-field="timed-invert"]').checked).toBe(true);
    expect(events(el)).toBe('start: switched on, stop: switched off');
  });
});

describe('rules list: a last entry the rule did not send', () => {
  const at = new Date(2026, 10, 17, 21, 46).getTime();
  it('switched elsewhere and already in that state are not worded as commands', () => {
    expect(lastText({ action: 'off', target: 'Vent', at, reason: 'ended: switched elsewhere', sent: false })).toMatch(/^Vent switched off elsewhere .*21.46/);
    expect(lastText({ action: 'on', target: 'Vent', at, reason: 'button start', sent: false })).toMatch(/^Vent already on .*21.46/);
    expect(lastText({ action: 'off', target: 'Vent', at, reason: 'time over' })).toMatch(/^turned off Vent .*21.46/);
  });

  it('kept on / already on by another automation names it, never "already off"', () => {
    expect(lastText({ action: 'off', target: 'Vent', at, reason: 'kept on by WC vent', sent: false })).toMatch(/^Vent kept on by WC vent .*21.46/);
    expect(lastText({ action: 'on', target: 'Vent', at, reason: 'already on by WC vent, Boiler', sent: false })).toMatch(/^Vent already on by WC vent, Boiler .*21.46/);
  });
});
