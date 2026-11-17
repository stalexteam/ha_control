// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, mount, pickAutomation, press } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { lastText } from '../../src/panel/rules-panel';

async function open(rules?: Rule[], mutate?: (p: Plan) => void, scene = 'outside'): Promise<PlanStudioPanel> {
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
const options = (el: PlanStudioPanel, f: string) => [...q<HTMLSelectElement>(el, `[data-field="${f}"]`).options].map(o => o.value);
const flow = (el: PlanStudioPanel) => q<HTMLElement>(el, '.flow').textContent!;

async function selectZone(el: PlanStudioPanel, id: string | null): Promise<void> {
  el.selection = id === null ? null : { kind: 'zone', id };
  await el.updateComplete;
}

async function edit(el: PlanStudioPanel, id = 'rule-yard'): Promise<void> {
  await selectZone(el, 'z-yard');
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

describe('Outside light form', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Automations menu lists Light motion control after Outside light and Beurer heater last; the rail keeps the universal templates', async () => {
    const el = await open([]);
    expect([...el.shadowRoot!.querySelectorAll('.tools button[data-template]')].map(b => b.getAttribute('data-template'))).toEqual(['condition', 'timer', 'control']);
    await press(el, 'button[data-action="automations"]');
    const items = [...el.shadowRoot!.querySelectorAll('.amenu [role="menuitem"]')];
    expect(items.map(i => i.getAttribute('data-automation'))).toEqual(['vent', 'boiler', 'leak', 'timed', 'outside', 'motionLight', 'beurer']);
    expect(items[4].textContent!.trim()).toBe('Outside light');
    expect(items[4].querySelector('svg.ticon')).toBeTruthy();
  });

  it('opens pre-filled with the zone\'s light and the plan\'s sensor, the night options on, pause 30; OK adds the rule', async () => {
    const el = await open([]);
    await selectZone(el, 'z-yard');
    await pickAutomation(el, 'outside');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(q(el, '.dialog.rdlg.pdlg h3').textContent).toBe('Outside light');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Outside light Yard');
    expect(q<HTMLSelectElement>(el, '[data-field="outside-light"]').value).toBe('d-yard-light');
    expect(q<HTMLSelectElement>(el, '[data-field="outside-sensor"]').value).toBe('d-lux');
    expect(q<HTMLInputElement>(el, '[data-field="outside-nodata"]').checked).toBe(true);
    expect(q<HTMLInputElement>(el, '[data-field="outside-sunset"]').checked).toBe(true);
    expect(q<HTMLInputElement>(el, '[data-field="outside-window"]').checked).toBe(false);
    expect(el.shadowRoot!.querySelector('.rule-backdrop [data-field="outside-from"]')).toBeNull();
    expect(q<HTMLInputElement>(el, '[data-field="outside-pause"]').value).toBe('30');
    expect(problems(el)).toEqual([]);
    expect(q(el, '.fc-note').textContent).toBe('Live state appears after Save');
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({
      name: 'Outside light Yard', zoneId: 'z-yard', combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [],
      outside: { light: 'd-yard-light', sensor: 'd-lux', noDataNight: true, afterSunset: true, pause: 30 },
    });
    expect(el.rules[0].outside!.window).toBeUndefined();
  });

  it('without a zone the light starts empty: a pick hint, OK blocked; the lists hold on/off devices and illuminance sensors', async () => {
    const el = await open([]);
    await selectZone(el, null);
    await pickAutomation(el, 'outside');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Outside light');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Choose the light']);
    expect(options(el, 'outside-light')).toEqual(['', 'd-light', 'd-socket', 'd-fan', 'd-yard-light']);
    expect(options(el, 'outside-sensor')).toEqual(['', 'd-lux']);
    await set(el, '[data-field="outside-sensor"]', '', 'change');
    expect(problems(el)).toEqual(['Choose the light', 'Choose the daylight sensor']);
    await set(el, '[data-field="outside-light"]', 'd-light', 'change');
    await set(el, '[data-field="outside-sensor"]', 'd-lux', 'change');
    expect(problems(el)).toEqual([]);
    expect(okBtn(el).disabled).toBe(false);
  });

  it('checkboxes set and drop the flags; the window adds From / To; the pause is 0..1440 whole minutes', async () => {
    const el = await open([]);
    await selectZone(el, 'z-yard');
    await pickAutomation(el, 'outside');
    const o = () => el.ruleDraft!.rule.outside!;
    await check(el, '[data-field="outside-nodata"]', false);
    expect('noDataNight' in o()).toBe(false);
    await check(el, '[data-field="outside-sunset"]', false);
    expect('afterSunset' in o()).toBe(false);
    expect(el.shadowRoot!.querySelector('.rule-backdrop [data-block="outside-sunset"]')).toBeNull();
    await check(el, '[data-field="outside-sunset"]', true);
    expect(o().afterSunset).toBe(true);
    await check(el, '[data-field="outside-window"]', true);
    expect(o().window).toEqual({ from: '17:00', to: '01:00' });
    expect(q(el, '[data-block="outside-window"]').textContent).toContain('17:00-01:00');
    await set(el, '[data-field="outside-to"]', '17:00');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Outside light: pick a light that can be switched on and a different daylight sensor, a time window with different From and To, and a pause of 0 to 1440 minutes.']);
    await set(el, '[data-field="outside-to"]', '23:00');
    expect(o().window).toEqual({ from: '17:00', to: '23:00' });
    expect(okBtn(el).disabled).toBe(false);
    await check(el, '[data-field="outside-window"]', false);
    expect('window' in o()).toBe(false);
    await set(el, '[data-field="outside-pause"]', '1441');
    expect(okBtn(el).disabled).toBe(true);
    await set(el, '[data-field="outside-pause"]', '2.5');
    expect(okBtn(el).disabled).toBe(true);
    await set(el, '[data-field="outside-pause"]', '');
    expect(okBtn(el).disabled).toBe(true);
    await set(el, '[data-field="outside-pause"]', '0');
    expect(okBtn(el).disabled).toBe(false);
    expect(o().pause).toBe(0);
    expect(q(el, '[data-block="outside-pause"]').textContent).toContain('Never pauses');
  });

  it('a deleted light stays selectable as missing and blocks OK with the missing-device text', async () => {
    const el = await open(undefined, p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-yard-light'); });
    await edit(el);
    expect(q<HTMLSelectElement>(el, '[data-field="outside-light"]').value).toBe('d-yard-light');
    expect(options(el, 'outside-light')).toContain('d-yard-light');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['A device of this rule is no longer on the plan.']);
  });

  it('Edit opens the compact frame with live values of the saved rule; an edit hides them', async () => {
    const el = await open();
    await edit(el);
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .rsettings [data-field="outside-light"]')).toBeTruthy();
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .flow svg.vt')).toBeTruthy();
    expect(flow(el)).toContain('Daylight: night');
    expect(flow(el)).toContain('Wants: on');
    expect(flow(el)).toContain('No pause');
    expect(el.tickerOn).toBe(false);
    await set(el, '[data-field="outside-pause"]', '45');
    expect(flow(el)).not.toContain('Daylight: night');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
  });

  it('a paused rule counts down and runs the ticker; so does a pending daylight change or a window', async () => {
    const paused = await open(undefined, undefined, 'outside-paused');
    await edit(paused);
    expect(flow(paused)).toMatch(/Paused, resumes in 1[12]:[0-5]\d/);
    expect(flow(paused)).toMatch(/switched off elsewhere .*, paused 30 min/);
    expect(paused.tickerOn).toBe(true);
    document.body.innerHTML = '';
    const evening = await open();
    await edit(evening, 'rule-yard-win');
    expect(flow(evening)).toMatch(/night in 0:[0-4]\d/);
    expect(flow(evening)).toContain('In window');
    expect(flow(evening)).toContain('Never pauses');
    expect(evening.tickerOn).toBe(true);
  });

  it('a click on a diagram block focuses its form field (Wants -> the sensor)', async () => {
    const el = await open();
    await edit(el);
    for (const [block, field] of [['outside-pause', 'outside-pause'], ['outside-wants', 'outside-sensor']]) {
      q(el, `[data-block="${block}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await el.updateComplete;
      await el.updateComplete;
      expect(el.shadowRoot!.activeElement?.getAttribute('data-field')).toBe(field);
      expect(q(el, `[data-block="${block}"]`).classList).toContain('hl');
    }
    (el.shadowRoot!.activeElement as HTMLElement).blur(); // happy-dom keeps a stale focus across tests
  });

  it('the condition rule made by the old Outside light template still opens in the condition dialog', async () => {
    const el = await open();
    await selectZone(el, 'r0');
    await press(el, '.rrow[data-id="rule-outside"] button[data-action="rule-edit"]');
    expect(el.shadowRoot!.querySelector('.rule-backdrop .pdlg')).toBeNull();
    expect(q<HTMLSelectElement>(el, '[data-field="combine"]').value).toBe('all');
  });
});

describe('rules list: an outside light pause entry', () => {
  it('is worded as a switch elsewhere, never as a command', () => {
    const at = new Date(2026, 10, 17, 20, 0).getTime();
    expect(lastText({ action: 'off', target: 'Yard light', at, reason: 'switched elsewhere: paused 30 min', sent: false })).toMatch(/^Yard light switched off elsewhere .*20.00/);
  });
});
