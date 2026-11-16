// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, click, key, mount, press, stored, undo } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan, Rule } from '../../src/model/types';
import type { RuleTrace } from '../../src/live/rules-feed';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';

const rule = (id: string, name: string, zoneId: string | null, extra: Partial<Rule> = {}): Rule =>
  ({ id, name, zoneId, combine: 'any', inputs: [{ source: { device: 'd-leak' } }], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [], ...extra });

const RULES: Rule[] = [
  rule('r-mid', 'Middle rule', 'z-mid'),
  rule('r-main', 'Main rule', 'r0'),
  rule('r-none', 'Loose rule', null),
  rule('r-gone', 'Orphan rule', 'z-removed'),
];
const AT = new Date(2026, 10, 16, 21, 43).getTime();
const TRACES: Record<string, RuleTrace> = {
  'r-mid': { status: 'ok', verdict: true, inputs: [], unknownInputs: 0, last: { action: 'close', target: 'Water valve', at: AT, reason: 'leak' } },
  'r-main': { status: 'waiting', verdict: null, inputs: [], unknownInputs: 1 },
  'r-none': { status: 'ok', verdict: false, inputs: [], unknownInputs: 0 },
};

async function open(): Promise<PlanStudioPanel> {
  const plan: Plan = { ...structuredClone(SCENES.room.plans[0]), rules: structuredClone(RULES) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
  const el = await mount(createMockHass({ rulesFrame: TRACES }));
  el.setMode('automation');
  await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
  await el.updateComplete;
  return el;
}

const title = (el: PlanStudioPanel) => $(el, '.rules-title').textContent!.trim();
const rows = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll<HTMLElement>('.rrow')].map(r => r.dataset.id);

describe('Automation step', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('is a real step: the cell says "4 rules", the rail has Select and the two templates', async () => {
    const el = await open();
    expect($(el, '[data-mode="automation"]').getAttribute('aria-current')).toBe('step');
    expect($(el, '[data-mode="automation"] .state').textContent!.trim()).toBe('4 rules');
    expect(el.toolId).toBe('zone-pick');
    expect($(el, 'button[data-tool="zone-pick"]').textContent).toContain('Select');
    expect($(el, 'button[data-template="condition"]').textContent).toContain('Condition');
    expect($(el, 'button[data-template="leak"]').textContent).toContain('Leak -> valve');
  });

  it('without a zone: "Rules without a zone", orphans marked "zone removed"', async () => {
    const el = await open();
    expect(title(el)).toBe('Rules without a zone');
    expect(rows(el)).toEqual(['r-none', 'r-gone']);
    expect($(el, '.rrow[data-id="r-gone"] .orphan').textContent).toContain('zone removed');
    expect(el.shadowRoot!.querySelector('.rrow[data-id="r-none"] .orphan')).toBeNull();
  });

  it('a click inside a zone selects the smallest one; Esc or a click outside clears', async () => {
    const el = await open();
    click(el, 2500, 1500); // inside Main and Middle
    await el.updateComplete;
    expect(el.selection).toEqual({ kind: 'zone', id: 'z-mid' });
    expect(title(el)).toBe('Middle');
    expect(rows(el)).toEqual(['r-mid']);
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.selection).toBeNull();
    expect(title(el)).toBe('Rules without a zone');
    click(el, 300, 300); // Main only
    await el.updateComplete;
    expect(title(el)).toBe('Main');
    expect(rows(el)).toEqual(['r-main']);
    click(el, -3000, -3000);
    await el.updateComplete;
    expect(el.selection).toBeNull();
    expect(title(el)).toBe('Rules without a zone');
  });

  it('Delete does not remove the selected zone in this step', async () => {
    const el = await open();
    click(el, 2500, 1500);
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.level!.zones.map(z => z.id)).toContain('z-mid');
  });

  it('a row shows name, verdict dot, status and the last action', async () => {
    const el = await open();
    click(el, 2500, 1500);
    await el.updateComplete;
    const r = $(el, '.rrow[data-id="r-mid"]');
    expect(r.querySelector('.rname')!.textContent).toContain('Middle rule');
    expect(r.querySelector('.vdot')!.getAttribute('data-verdict')).toBe('true');
    expect(r.querySelector('.rstatus')!.textContent).toContain('OK');
    expect(r.querySelector('.rlast')!.textContent).toBe('closed Water valve 21:43');
    click(el, 300, 300);
    await el.updateComplete;
    const w = $(el, '.rrow[data-id="r-main"]');
    expect(w.querySelector('.vdot')!.getAttribute('data-verdict')).toBe('unknown');
    expect(w.querySelector('.rstatus')!.textContent).toContain('Waiting for data');
    expect(w.querySelector('.rwarn')!.textContent).toContain('1 input without data');
    expect(w.querySelector('.rlast')).toBeNull();
    el.selection = null;
    await el.updateComplete;
    expect($(el, '.rrow[data-id="r-none"] .vdot').getAttribute('data-verdict')).toBe('false');
    expect($(el, '.rrow[data-id="r-gone"] .rstatus').textContent).toContain('Not saved yet'); // no trace
  });

  it('Delete asks to confirm and removes on confirm only; undo brings it back', async () => {
    const el = await open();
    await press(el, '.rrow[data-id="r-none"] button[data-action="rule-delete"]');
    expect(el.dialog).toEqual({ kind: 'delete-rule', id: 'r-none' });
    expect($(el, '.dialog').textContent).toContain('Loose rule');
    await press(el, 'button[data-action="delete-rule-cancel"]');
    expect(el.dialog).toBeNull();
    expect(el.rules).toHaveLength(4);
    await press(el, '.rrow[data-id="r-none"] button[data-action="rule-delete"]');
    await press(el, 'button[data-action="delete-rule-confirm"]');
    expect(el.dialog).toBeNull();
    expect(el.rules.map(r => r.id)).toEqual(['r-mid', 'r-main', 'r-gone']);
    expect($(el, '[data-mode="automation"] .state').textContent!.trim()).toBe('3 rules');
    await undo(el);
    expect(el.rules).toHaveLength(4);
    expect(stored()[0].rules).toHaveLength(4); // nothing saved by the delete itself
  });

  it('the templates and Edit call openRuleDialog', async () => {
    const el = await open();
    const spy = vi.spyOn(el, 'openRuleDialog').mockImplementation(() => undefined);
    await press(el, 'button[data-template="condition"]');
    expect(spy).toHaveBeenLastCalledWith('condition');
    await press(el, 'button[data-template="leak"]');
    expect(spy).toHaveBeenLastCalledWith('leak');
    await press(el, '.rrow[data-id="r-none"] button[data-action="rule-edit"]');
    expect(spy).toHaveBeenLastCalledWith('condition', 'r-none');
  });

  it('draws the zones explicitly with the selected one highlighted', async () => {
    const el = await open();
    expect(el.shadowRoot!.querySelectorAll('svg.plan path.zone').length).toBe(4);
    expect(el.shadowRoot!.querySelector('svg.plan path.zone.selected')).toBeNull();
    click(el, 2500, 1500);
    await el.updateComplete;
    expect($(el, 'svg.plan path.zone.selected').getAttribute('data-id')).toBe('z-mid');
  });
});
