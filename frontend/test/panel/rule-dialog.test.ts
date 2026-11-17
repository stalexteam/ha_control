// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, click, key, mount, press, pressSave, stored, undo } from './helpers';
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

  it('a rule changed with OK but not saved is compared with its saved version: no live values until Save', async () => {
    const el = await open();
    el.openRuleDialog('condition', 'rule-leak');
    await el.updateComplete;
    await type(el, '[data-field="name"]', 'Other name');
    await press(el, 'button[data-action="rule-ok"]');
    el.openRuleDialog('condition', 'rule-leak');
    await el.updateComplete;
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
    expect(q(el, '.fc-blk[data-block="input-0"]').textContent).not.toContain('wet');
    await type(el, '[data-field="name"]', 'Leak Main -> valve'); // back to the saved values
    expect(el.shadowRoot!.querySelector('.rule-backdrop .fc-note')).toBeNull();
    expect(q(el, '.fc-blk[data-block="input-0"]').textContent).toContain('wet');
    await type(el, '[data-field="name"]', 'Other name');
    await press(el, 'button[data-action="rule-cancel"]');
    await pressSave(el);
    el.openRuleDialog('condition', 'rule-leak');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.rule-backdrop .fc-note')).toBeNull(); // saved now
    expect(q(el, '.fc-blk[data-block="input-0"]').textContent).toContain('wet');
  });

  it('a rule added with OK but not saved still says "Live state appears after Save"', async () => {
    const el = await open([]);
    await press(el, 'button[data-template="condition"]');
    await type(el, '[data-field="name"]', 'Water');
    await choose(el, 'select[data-action="add-input"]', 'd:d-leak');
    await press(el, 'button[data-action="rule-ok"]');
    el.openRuleDialog('condition', el.rules[0].id);
    await el.updateComplete;
    expect(q(el, '.fc-note').textContent).toBe('Live state appears after Save');
  });

  describe('stage 2 inputs, gate and templates', () => {
    const rule = (el: PlanStudioPanel, id: string): Rule => el.rules.find(r => r.id === id)!;
    const edit = async (id: string): Promise<PlanStudioPanel> => {
      const el = await open();
      el.openRuleDialog('condition', id);
      await el.updateComplete;
      return el;
    };

    it('"Add input..." offers devices, rules and the four condition types', async () => {
      const el = await edit('rule-leak');
      const sel = q<HTMLSelectElement>(el, 'select[data-action="add-input"]');
      const opts = [...sel.options].map(o => o.value).filter(Boolean);
      expect(opts).toEqual(expect.arrayContaining(['d:d-leak', 'r:rule-motion', 'light', 'sun', 'time', 'held']));
      expect([...sel.options].filter(o => ['light', 'sun', 'time', 'held'].includes(o.value)).map(o => o.textContent!.trim()))
        .toEqual(['Light level', 'Sun', 'Time window', 'Held']);
    });

    it('a Light input edits sensor, below and hysteresis; a non-lx unit shows the warning', async () => {
      const el = await edit('rule-outside');
      expect(q<HTMLSelectElement>(el, '[data-field="input-0"] [data-part="light"]').value).toBe('d-lux');
      expect([...q<HTMLSelectElement>(el, '[data-field="input-0"] [data-part="light"]').options].map(o => o.value)).toEqual(['d-lux']);
      expect(el.shadowRoot!.querySelector('.rule-backdrop [data-warn="light-unit"]')).toBeNull();
      await type(el, '[data-field="input-0"] [data-part="below"]', '20');
      await type(el, '[data-field="input-0"] [data-part="hysteresis"]', '3');
      await press(el, 'button[data-action="rule-ok"]');
      expect(rule(el, 'rule-outside').inputs[0].source).toEqual({ light: 'd-lux', below: 20, hysteresis: 3 });
      (el.hass as unknown as { states: unknown }).states = { 'sensor.hall_lux': { state: '1', attributes: { unit_of_measurement: 'klx' } } };
      el.openRuleDialog('condition', 'rule-outside');
      await el.updateComplete;
      expect(q(el, '[data-warn="light-unit"]').textContent).toContain('klx');
    });

    it('a Light input with a bad threshold blocks OK', async () => {
      const el = await edit('rule-outside');
      await type(el, '[data-field="input-0"] [data-part="below"]', '0');
      expect(names(el, '.rproblems li')).toEqual(['Light level: below must be above 0 and hysteresis 0 or more.']);
      expect(okBtn(el).disabled).toBe(true);
    });

    it('a Time input edits from and to; equal times block OK', async () => {
      const el = await edit('rule-outside');
      expect(q<HTMLInputElement>(el, '[data-field="input-2"] [data-part="from"]').value).toBe('17:00');
      await type(el, '[data-field="input-2"] [data-part="to"]', '17:00');
      expect(names(el, '.rproblems li')).toEqual(['Time window: both times set and different.']);
      await type(el, '[data-field="input-2"] [data-part="to"]', '23:30');
      expect(okBtn(el).disabled).toBe(false);
      await press(el, 'button[data-action="rule-ok"]');
      expect(rule(el, 'rule-outside').inputs[2].source).toEqual({ time: { from: '17:00', to: '23:30' } });
    });

    it('adds Sun, Light, Time and Held inputs with defaults', async () => {
      const el = await edit('rule-leak');
      for (const v of ['sun', 'light', 'time', 'held']) await choose(el, 'select[data-action="add-input"]', v);
      await choose(el, '[data-field="input-4"] [data-part="add-source"]', 'd:d-socket');
      await type(el, '[data-field="input-4"] [data-part="duration"]', '10');
      await choose(el, '[data-field="input-4"] [data-part="unit"]', 'min');
      await choose(el, '[data-field="input-4"] [data-part="state"]', 'on');
      await press(el, 'button[data-action="rule-ok"]');
      expect(rule(el, 'rule-leak').inputs.slice(1).map(i => i.source)).toEqual([
        { sun: true },
        { light: 'd-lux', below: 10, hysteresis: 5 },
        { time: { from: '17:00', to: '01:00' } },
        { held: { sources: [{ device: 'd-socket' }], state: 'on', seconds: 600 } },
      ]);
    });

    it('a Held row: duration keeps its unit while typing, sources are removable, no sources blocks OK', async () => {
      const el = await edit('rule-outside');
      await choose(el, 'select[data-action="add-input"]', 'held');
      expect(names(el, '.rproblems li')).toEqual(['Held: pick at least one source and a time of 1 s to 24 h.']);
      const field = '[data-field="input-3"]';
      expect(q<HTMLSelectElement>(el, `${field} [data-part="unit"]`).value).toBe('min'); // 1800 s
      expect(q<HTMLInputElement>(el, `${field} [data-part="duration"]`).value).toBe('30');
      await choose(el, `${field} [data-part="unit"]`, 'h');
      expect(q<HTMLInputElement>(el, `${field} [data-part="duration"]`).value).toBe('0.5');
      await type(el, `${field} [data-part="duration"]`, '60');
      expect(q<HTMLSelectElement>(el, `${field} [data-part="unit"]`).value).toBe('h'); // not snapped to another unit
      await choose(el, `${field} [data-part="add-source"]`, 'r:rule-leak');
      expect(el.ruleDraft!.rule.inputs[3].source).toMatchObject({ held: { sources: [{ rule: 'rule-leak' }], seconds: 216000 } });
      expect(names(el, '.rproblems li')).toEqual(['Held: pick at least one source and a time of 1 s to 24 h.']); // 60 h too long
      await type(el, `${field} [data-part="duration"]`, '2');
      expect(el.shadowRoot!.querySelector('.rule-backdrop .rproblems')).toBeNull();
      await press(el, `${field} [data-action="remove-source"]`);
      expect(names(el, '.rproblems li')).toHaveLength(1);
    });

    it('the gate section sets, edits and removes one row', async () => {
      const el = await edit('rule-leak');
      expect(el.shadowRoot!.querySelector('.rule-backdrop [data-field="gate-input"]')).toBeNull();
      await choose(el, 'select[data-action="set-gate"]', 'sun');
      expect(el.shadowRoot!.querySelector('.rule-backdrop select[data-action="set-gate"]')).toBeNull(); // one gate only
      expect(q(el, '[data-block="gate-input"]').textContent).toContain('Sun');
      await press(el, '[data-field="gate-input"] input[data-part="not"]');
      await press(el, 'button[data-action="rule-ok"]');
      expect(rule(el, 'rule-leak').gate).toEqual({ source: { sun: true }, not: true });
      el.openRuleDialog('condition', 'rule-leak');
      await el.updateComplete;
      await press(el, '[data-field="gate-input"] [data-action="remove-input"]');
      await press(el, 'button[data-action="rule-ok"]');
      expect('gate' in rule(el, 'rule-leak')).toBe(false);
    });

    it('a gate with a bad parameter blocks OK', async () => {
      const el = await edit('rule-leak');
      await choose(el, 'select[data-action="set-gate"]', 'time');
      await type(el, '[data-field="gate-input"] [data-part="from"]', '01:00');
      expect(names(el, '.rproblems li')).toEqual(['Time window: both times set and different.']);
    });

    it('a click on the gate block focuses the gate row', async () => {
      const el = await edit('rule-outside');
      q(el, '[data-block="gate-input"]').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.ruleDraft!.focused).toBe('gate-input');
    });

    it('Timer and Outside light templates follow the model shapes', async () => {
      const el = await open([]);
      click(el, 300, 300); // Main
      await el.updateComplete;
      await press(el, 'button[data-template="outside"]');
      expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Outside light Main');
      expect(q<HTMLSelectElement>(el, '[data-field="combine"]').value).toBe('all');
      expect(q<HTMLSelectElement>(el, '[data-field="input-0"] [data-part="light"]').value).toBe('d-lux');
      expect(el.ruleDraft!.rule.gate).toEqual({ source: { held: { sources: [], state: 'any', seconds: 1800 } } });
      await press(el, 'button[data-action="rule-cancel"]');
      await press(el, 'button[data-template="timer"]');
      expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Unchanged 30 min');
      expect(el.ruleDraft!.rule.inputs).toEqual([{ source: { held: { sources: [], state: 'any', seconds: 1800 } } }]);
      await press(el, 'button[data-action="rule-cancel"]');
      el.selection = { kind: 'device', id: 'd-light' };
      await press(el, 'button[data-template="timer"]');
      expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Ceiling light unchanged 30 min');
      expect(el.ruleDraft!.rule.inputs[0].source).toEqual({ held: { sources: [{ device: 'd-light' }], state: 'any', seconds: 1800 } });
    });

    it('the flowchart of a saved stage-2 rule shows live values, the countdown and the held note', async () => {
      const el = await edit('rule-outside');
      expect(q(el, '[data-block="input-0"]').textContent).toContain('8 lx');
      expect(q(el, '[data-block="gate-input"]').textContent).toMatch(/closed, opens in 1[23] min/);
      expect(q(el, '[data-note="held"]').textContent).toBe('Actions are held until the gate opens.');
    });
  });
});
