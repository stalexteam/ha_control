// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, click, mount, press, undo } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';

async function open(rules?: Rule[], mutate?: (p: Plan) => void): Promise<PlanStudioPanel> {
  const plan: Plan = structuredClone(SCENES.room.plans[0]);
  if (rules) plan.rules = rules;
  mutate?.(plan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
  const el = await mount(createMockHass({ rulesFrame: SCENES.room.rulesFrame }));
  el.setMode('automation');
  await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
  await el.updateComplete;
  return el;
}

const q = <T extends Element>(el: PlanStudioPanel, sel: string): T => $<T>(el, `.rule-backdrop ${sel}`);
const okBtn = (el: PlanStudioPanel) => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]');
const ventRule = (): Rule => structuredClone(SCENES.room.plans[0].rules!.find(r => r.id === 'rule-vent')!);

async function edit(el: PlanStudioPanel): Promise<void> {
  click(el, 300, 300); // Main
  await el.updateComplete;
  await press(el, '.rrow[data-id="rule-vent"] button[data-action="rule-edit"]');
}

async function set(el: PlanStudioPanel, sel: string, value: string, ev = 'input'): Promise<void> {
  const f = q<HTMLInputElement | HTMLSelectElement>(el, sel);
  f.value = value;
  f.dispatchEvent(new Event(ev, { bubbles: true, composed: true }));
  await el.updateComplete;
}

describe('Wet zone ventilation form', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the rail template opens the vent form pre-filled from the selected zone', async () => {
    const el = await open([]);
    click(el, 300, 300); // Main
    await el.updateComplete;
    await press(el, 'button[data-template="vent"]');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Vent Main');
    expect(q<HTMLSelectElement>(el, '[data-field="vent-sensor"]').value).toBe('d-wc-climate');
    expect(q<HTMLSelectElement>(el, '[data-field="vent-than"]').value).toBe('');
    expect(q<HTMLSelectElement>(el, '[data-field="vent-fan"]').value).toBe('d-fan');
    expect(q<HTMLInputElement>(el, '[data-field="vent-above"]').value).toBe('9');
    expect(q<HTMLInputElement>(el, '[data-field="vent-below"]').value).toBe('5');
    expect(q<HTMLInputElement>(el, '[data-field="vent-runon"]').value).toBe('10');
    expect(okBtn(el).disabled).toBe(true); // "Compare with" is empty
  });

  it('fields edit the rule: run-on minutes <-> offDelay seconds, the fan writes both actions; OK adds it', async () => {
    const el = await open([]);
    click(el, 300, 300);
    await el.updateComplete;
    await press(el, 'button[data-template="vent"]');
    await set(el, '[data-field="vent-than"]', 'd-main-climate', 'change');
    await set(el, '[data-field="vent-runon"]', '15');
    await set(el, '[data-field="vent-above"]', '12');
    await set(el, '[data-field="vent-below"]', '4');
    await set(el, '[data-field="vent-fan"]', '', 'change');
    expect(el.ruleDraft!.rule.onTrue).toEqual([]);
    expect(el.ruleDraft!.rule.onFalse).toEqual([]);
    expect(okBtn(el).disabled).toBe(true);
    await set(el, '[data-field="vent-fan"]', 'd-fan', 'change');
    expect(okBtn(el).disabled).toBe(false);
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({
      name: 'Vent Main', zoneId: 'r0', combine: 'any', inputs: [], onDelay: 0, offDelay: 900,
      vent: { sensor: 'd-wc-climate', than: 'd-main-climate', above: 12, below: 4 },
      onTrue: [{ device: 'd-fan', do: 'on' }], onFalse: [{ device: 'd-fan', do: 'off' }],
    });
  });

  it('OK is blocked while the same sensor is on both sides or the margins are wrong', async () => {
    const el = await open([ventRule()]);
    await edit(el);
    expect(q<HTMLInputElement>(el, '[data-field="vent-runon"]').value).toBe('10');
    expect(okBtn(el).disabled).toBe(false);
    await set(el, '[data-field="vent-than"]', 'd-wc-climate', 'change');
    expect(okBtn(el).disabled).toBe(true);
    await set(el, '[data-field="vent-than"]', 'd-main-climate', 'change');
    await set(el, '[data-field="vent-below"]', '20');
    expect(okBtn(el).disabled).toBe(true);
    expect(q(el, '.rproblems [data-problem="vent"]')).toBeTruthy();
  });

  it('Edit of a vent rule opens the vent form, not the flowchart dialog', async () => {
    const el = await open([ventRule()]);
    await edit(el);
    expect(q(el, '[data-field="vent-sensor"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.rule-backdrop svg.fc')).toBeNull();
  });

  it('a deleted climate sensor blocks OK', async () => {
    const el = await open([ventRule()], p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-main-climate'); });
    await edit(el);
    expect(okBtn(el).disabled).toBe(true);
    expect(q(el, '.rproblems [data-problem="device-missing"]')).toBeTruthy();
  });

  it('a deleted fan blocks OK', async () => {
    const el = await open([ventRule()], p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-fan'); });
    await edit(el);
    expect(okBtn(el).disabled).toBe(true);
  });

  it('a saved unchanged rule shows the live detail, verdict, run-on countdown and last action; an edit hides them', async () => {
    const el = await open([ventRule()]);
    await edit(el);
    const live = q<HTMLElement>(el, '.vent-live').textContent!;
    expect(live).toContain('17.4 / 9.7 g/m³ (+80 %)');
    expect(live).toContain('Condition true');
    expect(live).toMatch(/off in \d+:\d\d/);
    expect(live).toContain('WC fan');
    await set(el, '[data-field="vent-above"]', '10');
    expect(q<HTMLElement>(el, '.vent-live').textContent).not.toContain('17.4');
  });

  it('empty picks show pick hints, not the missing-device text', async () => {
    const el = await open([]);
    click(el, 300, 300);
    await el.updateComplete;
    await press(el, 'button[data-template="vent"]');
    await set(el, '[data-field="vent-fan"]', '', 'change');
    const keys = [...el.shadowRoot!.querySelectorAll('.rule-backdrop .rproblems li')].map(x => x.textContent);
    expect(keys).toEqual(['Choose the sensor to compare with', 'Choose the fan']);
  });

  it('run-on out of 0..60 min shows its own message; the field keeps what is typed', async () => {
    const el = await open([ventRule()]);
    await edit(el);
    await set(el, '[data-field="vent-runon"]', '61');
    expect(okBtn(el).disabled).toBe(true);
    expect(q(el, '.rproblems [data-problem="delay"]').textContent).toBe('Run-on: 0 to 60 min');
    expect(q<HTMLInputElement>(el, '[data-field="vent-runon"]').value).toBe('61');
    await set(el, '[data-field="vent-runon"]', '60');
    expect(el.ruleDraft!.rule.offDelay).toBe(3600);
    expect(okBtn(el).disabled).toBe(false);
  });

  it('no live block at all for a saved rule the server has no trace of', async () => {
    const plan: Plan = structuredClone(SCENES.room.plans[0]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
    const el = await mount(createMockHass({ rulesFrame: {} }));
    el.setMode('automation');
    await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
    await edit(el);
    expect(el.shadowRoot!.querySelector('.rule-backdrop .vent-live')).toBeNull();
  });

  it('Cancel leaves rules untouched; one undo reverts an OK; a normal rule opens the rule dialog', async () => {
    const el = await open([]);
    click(el, 300, 300);
    await el.updateComplete;
    await press(el, 'button[data-template="vent"]');
    await set(el, '[data-field="vent-than"]', 'd-main-climate', 'change');
    await press(el, 'button[data-action="rule-cancel"]');
    expect(el.rules).toEqual([]);
    await press(el, 'button[data-template="vent"]');
    await set(el, '[data-field="vent-than"]', 'd-main-climate', 'change');
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules).toHaveLength(1);
    await undo(el);
    expect(el.rules).toEqual([]);
    await press(el, 'button[data-template="leak"]');
    expect(el.shadowRoot!.querySelector('.rule-backdrop svg.fc')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.rule-backdrop [data-field="vent-sensor"]')).toBeNull();
  });
});
