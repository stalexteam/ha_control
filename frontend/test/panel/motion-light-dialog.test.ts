// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, mount, pickAutomation, press } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';

async function open(rules?: Rule[], mutate?: (p: Plan) => void, scene = 'motionlight'): Promise<PlanStudioPanel> {
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
const chipIds = (el: PlanStudioPanel, group: string) => [...el.shadowRoot!.querySelectorAll(`.rule-backdrop [data-group="${group}"] .rchip`)].map(c => c.getAttribute('data-id'));
const motion = (el: PlanStudioPanel) => el.ruleDraft!.rule.motionLight!;

async function selectZone(el: PlanStudioPanel, id: string | null): Promise<void> {
  el.selection = id === null ? null : { kind: 'zone', id };
  await el.updateComplete;
}

async function edit(el: PlanStudioPanel, id = 'rule-ml'): Promise<void> {
  await selectZone(el, 'r0');
  await press(el, `.rrow[data-id="${id}"] button[data-action="rule-edit"]`);
}

async function set(el: PlanStudioPanel, sel: string, value: string, ev = 'input'): Promise<void> {
  const f = q<HTMLInputElement | HTMLSelectElement>(el, sel);
  f.value = value;
  f.dispatchEvent(new Event(ev, { bubbles: true, composed: true }));
  await el.updateComplete;
}

describe('Light motion control form', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Automations menu lists Light motion control right after Outside light', async () => {
    const el = await open([]);
    await press(el, 'button[data-action="automations"]');
    const items = [...el.shadowRoot!.querySelectorAll('.amenu [role="menuitem"]')];
    expect(items.map(i => i.getAttribute('data-automation'))).toEqual(['vent', 'boiler', 'leak', 'timed', 'outside', 'motionLight', 'beurer']);
    expect(items[5].textContent!.trim()).toBe('Light motion control');
    expect(items[5].querySelector('svg.ticon')).toBeTruthy();
  });

  it('opens from the template with the zone\'s light, sensors and buttons, the plan\'s light sensor; OK adds the rule', async () => {
    const el = await open([]);
    await selectZone(el, 'r0');
    await pickAutomation(el, 'motionLight');
    expect(el.dialog).toEqual({ kind: 'rule' });
    expect(q(el, '.dialog.rdlg.pdlg h3').textContent).toBe('Light motion control');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Light motion control Main');
    expect(q<HTMLSelectElement>(el, '[data-field="motionlight-light"]').value).toBe('d-light');
    expect(chipIds(el, 'motionlight-sensors')).toEqual(['d-motion', 'd-motion-hall']);
    expect(q<HTMLSelectElement>(el, '[data-field="motionlight-daylight"]').value).toBe('d-lux');
    expect(q<HTMLSelectElement>(el, '[data-field="motionlight-is"]').value).toBe('dark');
    expect(q<HTMLInputElement>(el, '[data-field="motionlight-off"]').value).toBe('180');
    expect(q<HTMLInputElement>(el, '[data-field="motionlight-minon"]').value).toBe('0');
    expect(chipIds(el, 'motionlight-buttons')).toEqual(['d-button-ml']); // smart buttons only (0.22.1)
    expect(q<HTMLInputElement>(el, '[data-field="motionlight-autoafter"]').value).toBe('0');
    expect(problems(el)).toEqual([]);
    expect(q(el, '.fc-note').textContent).toBe('Live state appears after Save');
    await press(el, 'button[data-action="rule-ok"]');
    expect(el.rules[0]).toMatchObject({
      name: 'Light motion control Main', zoneId: 'r0', combine: 'any', inputs: [], onDelay: 0, offDelay: 180, onTrue: [], onFalse: [],
      motionLight: { light: 'd-light', sensors: ['d-motion', 'd-motion-hall'], daylight: { sensor: 'd-lux', is: 'dark' }, minOn: 0, buttons: ['d-button-ml'], autoAfter: 0 },
    });
  });

  it('without a zone the light and sensors start empty: two hints and OK blocked; the lists are filtered by kind', async () => {
    const el = await open([]);
    await selectZone(el, null);
    await pickAutomation(el, 'motionLight');
    expect(q<HTMLInputElement>(el, '[data-field="name"]').value).toBe('Light motion control');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Choose the light', 'Add a motion sensor']);
    // The light: devices taking on and off; no sensors, no buttons.
    const lights = options(el, 'motionlight-light');
    expect(lights).toContain('d-light');
    expect(lights).not.toContain('d-motion');
    expect(lights).not.toContain('d-lux');
    expect(lights).not.toContain('d-button-ml');
    expect(options(el, 'motionlight-sensors')).toEqual(['', 'd-motion', 'd-motion-hall']);
    expect(options(el, 'motionlight-daylight')).toEqual(['', 'd-lux']);
    await set(el, '[data-field="motionlight-light"]', 'd-light', 'change');
    await set(el, '[data-field="motionlight-sensors"]', 'd-motion', 'change');
    expect(problems(el)).toEqual([]);
    expect(okBtn(el).disabled).toBe(false);
    expect(motion(el)).toMatchObject({ light: 'd-light', sensors: ['d-motion'] });
  });

  it('the Buttons add select lists smart buttons and wall switches only', async () => {
    const el = await open([]);
    await selectZone(el, null);
    await pickAutomation(el, 'motionLight');
    expect(options(el, 'motionlight-buttons')).toEqual(['', 'd-switch-ml', 'd-button-ml']);
    await set(el, '[data-field="motionlight-buttons"]', 'd-button-ml', 'change');
    expect(motion(el).buttons).toEqual(['d-button-ml']);
    expect(options(el, 'motionlight-buttons')).toEqual(['', 'd-switch-ml']);
  });

  it('the "is" select shows only with a light sensor and patches daylight.is; clearing the sensor removes daylight', async () => {
    const el = await open([]);
    await selectZone(el, null);
    await pickAutomation(el, 'motionLight');
    // The plan's single light sensor is prefilled by the template.
    expect(motion(el).daylight).toEqual({ sensor: 'd-lux', is: 'dark' });
    expect(options(el, 'motionlight-is')).toEqual(['night', 'dark']);
    await set(el, '[data-field="motionlight-is"]', 'night', 'change');
    expect(motion(el).daylight).toEqual({ sensor: 'd-lux', is: 'night' });
    expect(q(el, '[data-block="motionlight-daylight"]').textContent).toContain('is night');
    await set(el, '[data-field="motionlight-daylight"]', '', 'change');
    expect('daylight' in motion(el)).toBe(false);
    expect(el.shadowRoot!.querySelector('.rule-backdrop [data-field="motionlight-is"]')).toBeNull();
    expect(el.shadowRoot!.querySelector('.rule-backdrop [data-block="motionlight-daylight"]')).toBeNull();
    await set(el, '[data-field="motionlight-daylight"]', 'd-lux', 'change');
    expect(motion(el).daylight).toEqual({ sensor: 'd-lux', is: 'dark' });
  });

  it('Off after writes the rule\'s offDelay; the minimum on time and auto again patch the rule; out of range blocks OK', async () => {
    const el = await open([]);
    await selectZone(el, 'r0');
    await pickAutomation(el, 'motionLight');
    await set(el, '[data-field="motionlight-off"]', '90');
    expect(el.ruleDraft!.rule.offDelay).toBe(90);
    expect(q(el, '[data-block="motionlight-wants"]').textContent).toContain('off 1:30 after it ends');
    await set(el, '[data-field="motionlight-minon"]', '45');
    expect(motion(el).minOn).toBe(45);
    expect(q(el, '[data-block="motionlight-wants"]').textContent).toContain('at least 0:45 on');
    await set(el, '[data-field="motionlight-autoafter"]', '15');
    expect(motion(el).autoAfter).toBe(15);
    expect(okBtn(el).disabled).toBe(false);
    await set(el, '[data-field="motionlight-autoafter"]', '1441');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['Light motion control: pick a light that can be switched on and off, motion sensors and buttons each only once (not the light itself), and whole numbers in range.']);
    await set(el, '[data-field="motionlight-autoafter"]', '0');
    await set(el, '[data-field="motionlight-minon"]', '1.5');
    expect(okBtn(el).disabled).toBe(true);
    await set(el, '[data-field="motionlight-minon"]', '0');
    await set(el, '[data-field="motionlight-off"]', '3601');
    expect(okBtn(el).disabled).toBe(true);
  });

  it('removing a sensor chip patches sensors; no motion sensor is valid (0.22.1)', async () => {
    const el = await open([]);
    await selectZone(el, 'r0');
    await pickAutomation(el, 'motionLight');
    await press(el, '.rule-backdrop [data-group="motionlight-sensors"] .rchip[data-id="d-motion"] button[data-action="remove"]');
    expect(motion(el).sensors).toEqual(['d-motion-hall']);
    await press(el, '.rule-backdrop [data-group="motionlight-sensors"] .rchip[data-id="d-motion-hall"] button[data-action="remove"]');
    expect(motion(el).sensors).toEqual([]);
    expect(okBtn(el).disabled).toBe(false);
  });

  it('a deleted sensor stays as a marked chip and blocks OK with the missing-device text', async () => {
    const el = await open(undefined, p => { p.levels[0].devices = p.levels[0].devices.filter(d => d.id !== 'd-motion-hall'); });
    await edit(el);
    expect(chipIds(el, 'motionlight-sensors')).toEqual(['d-motion', 'd-motion-hall']);
    expect(el.shadowRoot!.querySelector('.rule-backdrop [data-group="motionlight-sensors"] .rchip[data-id="d-motion-hall"]')!.classList).toContain('bad');
    expect(okBtn(el).disabled).toBe(true);
    expect(problems(el)).toEqual(['A device of this rule is no longer on the plan.']);
  });

  it('Edit shows live values of the saved rule with the countdowns and runs the ticker; an edit hides them', async () => {
    const el = await open();
    await edit(el);
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .rsettings [data-field="motionlight-light"]')).toBeTruthy();
    expect(q(el, '.dialog.rdlg.pdlg > .rcols > .flow svg.vt')).toBeTruthy();
    expect(flow(el)).toContain('Wants: on');
    expect(flow(el)).toMatch(/off in \d+:\d\d/);
    expect(flow(el)).toMatch(/minimum on \d+:\d\d/);
    expect(flow(el)).toContain('Mode: auto');
    expect(el.tickerOn).toBe(true);
    await set(el, '[data-field="motionlight-off"]', '200');
    expect(flow(el)).not.toContain('Wants: on');
    expect(q(el, '.fc-note').textContent).toBe('Saved version: your changes apply after Save');
  });

  it('a manual rule counts down to auto', async () => {
    const el = await open(undefined, undefined, 'motionlight-manual');
    await edit(el);
    expect(flow(el)).toContain('Mode: manual');
    expect(flow(el)).toMatch(/auto again in \d+:\d\d/);
    expect(el.tickerOn).toBe(true);
  });

  it('a click on a diagram block focuses its form field (Wants -> Off after, Mode -> Buttons)', async () => {
    const el = await open();
    await edit(el);
    for (const [block, field] of [['motionlight-light', 'motionlight-light'], ['motionlight-wants', 'motionlight-off'], ['motionlight-mode', 'motionlight-buttons'], ['motionlight-sensor:d-motion', 'motionlight-sensors']]) {
      q(el, `[data-block="${block}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await el.updateComplete;
      await el.updateComplete;
      expect(el.shadowRoot!.activeElement?.getAttribute('data-field')).toBe(field);
      expect(q(el, `[data-block="${block}"]`).classList).toContain('hl');
    }
    expect(el.shadowRoot!.querySelector('.rule-backdrop .rchip[data-id="d-motion"]')!.classList).toContain('hl');
    (el.shadowRoot!.activeElement as HTMLElement).blur(); // happy-dom keeps a stale focus across tests
  });
  it('a note says when nothing returns the rule to auto: no Auto button and "Auto again after" 0; OK stays enabled', async () => {
    const note = (el: PlanStudioPanel) => el.shadowRoot!.querySelector('.rule-backdrop [data-note="motionlight-noauto"]');
    const text = 'Nothing returns this rule to auto: no button with an Auto action (or a wall switch with double toggle) and "Auto again after" is 0. After a manual switch it stays silent until the rule is changed.';
    const el = await open([]);
    await selectZone(el, null);
    await pickAutomation(el, 'motionLight');
    expect(note(el)!.textContent).toBe(text); // no buttons, 0
    await set(el, '[data-field="motionlight-light"]', 'd-light', 'change');
    await set(el, '[data-field="motionlight-sensors"]', 'd-motion', 'change');
    await set(el, '[data-field="motionlight-buttons"]', 'd-button-ml', 'change'); // smart button without Auto
    expect(note(el)!.textContent).toBe(text);
    expect(okBtn(el).disabled).toBe(false);
    await set(el, '[data-field="motionlight-autoafter"]', '10');
    expect(note(el)).toBeNull();
    await set(el, '[data-field="motionlight-autoafter"]', '0');
    expect(note(el)).not.toBeNull();
    await set(el, '[data-field="motionlight-buttons"]', 'd-switch-ml', 'change'); // still no Auto
    expect(note(el)).not.toBeNull();
  });

  it('the note is absent with a button that has an Auto action', async () => {
    const el = await open([], p => {
      const b = p.levels[0].devices.find(d => d.id === 'd-button-ml')!;
      if (b.props.kind === 'smart_button') b.props.autoEnabled = true;
    });
    await selectZone(el, null);
    await pickAutomation(el, 'motionLight');
    await set(el, '[data-field="motionlight-buttons"]', 'd-button-ml', 'change');
    expect(el.shadowRoot!.querySelector('.rule-backdrop [data-note="motionlight-noauto"]')).toBeNull();
  });

  it('the rules list row words the mode changes plainly; a plain command still reads as before', async () => {
    const base = SCENES.motionlight.rulesFrame!['rule-ml'];
    const T = new Date(2026, 10, 17, 21, 46).getTime();
    const rows: [Record<string, unknown>, RegExp][] = [
      [{ action: 'auto', reason: 'button: auto', sent: false }, /^Ceiling light back to auto .*21.46.* \(button\)$/],
      [{ action: 'auto', reason: 'auto again', sent: false }, /^Ceiling light back to auto .*21.46.* \(no motion\)$/],
      [{ action: 'on', reason: 'button: manual' }, /^Ceiling light manual .*21.46.* \(button\)$/],
      [{ action: 'off', reason: 'button: manual', sent: false }, /^Ceiling light manual .*21.46.* \(button\)$/],
      [{ action: 'off', reason: 'switched elsewhere: manual', sent: false }, /^Ceiling light manual .*21.46.* \(switched off elsewhere\)$/],
      [{ action: 'on', reason: 'found on', sent: false }, /^Ceiling light found on .*21.46/],
      [{ action: 'on', reason: 'motion', sent: false }, /^Ceiling light already on .*21.46/],
    ];
    for (const [last, re] of rows) {
      document.body.innerHTML = ''; localStorage.clear();
      const plan: Plan = structuredClone(SCENES.motionlight.plans[0]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
      const frame = { ...SCENES.motionlight.rulesFrame, 'rule-ml': { ...base, last: { target: 'Ceiling light', at: T, ...last } } } as never;
      const el = await mount(createMockHass({ rulesFrame: frame }));
      el.setMode('automation');
      await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
      await selectZone(el, 'r0');
      expect(el.shadowRoot!.querySelector('.rrow[data-id="rule-ml"] .rlast')!.textContent).toMatch(re);
    }
  });
});
