// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEY } from '../../dev/mock-hass';
import { emptyPlan, type Plan } from '../../src/model/types';
import { $, drawBox, mount } from './helpers';

function seed(...names: string[]): Plan[] {
  const plans = names.map((n, i) => ({ ...emptyPlan(n), revision: i + 1 }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: Object.fromEntries(plans.map(p => [p.id, p])) }));
  return plans;
}

describe('plan selection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('opens the last used plan when it still exists', async () => {
    const [, second] = seed('First', 'Second');
    localStorage.setItem('plan_studio.lastPlanId', second.id);
    const el = await mount();
    expect(el.plan!.id).toBe(second.id);
  });

  it('falls back to the first plan when the last id is unknown', async () => {
    const [first] = seed('First', 'Second');
    localStorage.setItem('plan_studio.lastPlanId', 'gone');
    const el = await mount();
    expect(el.plan!.id).toBe(first.id);
  });

  it('switches plans with the toolbar selector and remembers the choice', async () => {
    const [first, second] = seed('First', 'Second');
    const el = await mount();
    expect(el.plan!.id).toBe(first.id);
    const sel = $<HTMLSelectElement>(el, 'select.plan-pick');
    expect([...sel.options].map(o => o.textContent!.trim())).toEqual(['First', 'Second']);
    sel.value = second.id;
    sel.dispatchEvent(new Event('change'));
    await vi.waitFor(() => expect(el.plan!.id).toBe(second.id));
    expect(localStorage.getItem('plan_studio.lastPlanId')).toBe(second.id);
  });

  it('asks before switching away from unsaved changes', async () => {
    const [first, second] = seed('First', 'Second');
    const el = await mount();
    await drawBox(el);
    const sel = $<HTMLSelectElement>(el, 'select.plan-pick');
    sel.value = second.id;
    sel.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.plan!.id).toBe(first.id);
    $<HTMLButtonElement>(el, '[data-action="switch-cancel"]').click();
    await el.updateComplete;
    expect(el.plan!.id).toBe(first.id);
    expect(el.history!.current.walls.length).toBe(4);
    expect($<HTMLSelectElement>(el, 'select.plan-pick').value).toBe(first.id);

    sel.value = second.id;
    sel.dispatchEvent(new Event('change'));
    await el.updateComplete;
    $<HTMLButtonElement>(el, '[data-action="switch-discard"]').click();
    await vi.waitFor(() => expect(el.plan!.id).toBe(second.id));
    expect(el.save.dirty).toBe(false);
    expect(localStorage.getItem(`plan_studio.draft.${first.id}`)).toBeNull();
  });

  it('a plan saved as new stays reachable after reload', async () => {
    const { simulateForeignSave } = await import('../../dev/mock-hass');
    const [first] = seed('First');
    const el = await mount();
    await drawBox(el);
    simulateForeignSave();
    $<HTMLButtonElement>(el, 'button[data-action="save"]').click();
    await vi.waitFor(() => expect(el.save.state).toBe('conflict'));
    await el.updateComplete;
    $<HTMLButtonElement>(el, '[data-action="save-as-new"]').click();
    await vi.waitFor(() => expect(el.save.state).toBe('saved'));
    const newId = el.plan!.id;
    expect(newId).not.toBe(first.id);
    el.remove();
    const el2 = await mount();
    expect(el2.plan!.id).toBe(newId);
  });
});

describe('plan without levels', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('opens with one empty floor level instead of crashing', async () => {
    const [p] = seed('Broken');
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    raw.plans[p.id].levels = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    const el = await mount();
    expect(el.plan!.levels).toHaveLength(1);
    expect(el.plan!.levels[0].kind).toBe('floor');
    expect(el.history!.current.walls).toEqual([]);
    await drawBox(el);
    expect(el.history!.current.walls).toHaveLength(4);
  });
});
