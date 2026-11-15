// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEY } from '../../dev/mock-hass';
import { emptyPlan, type Plan } from '../../src/model/types';
import { $, drawBox, key, mount, stored } from './helpers';

function seed(...names: string[]): Plan[] {
  const plans = names.map((n, i) => ({ ...emptyPlan(n), revision: i + 1 }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: Object.fromEntries(plans.map(p => [p.id, p])) }));
  return plans;
}

const btn = (el: Parameters<typeof $>[0], action: string) => $<HTMLButtonElement>(el, `[data-action="${action}"]`);

describe('plan management', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('delete with confirmation removes the plan and opens the other one', async () => {
    const [first, second] = seed('First', 'Second');
    const el = await mount();
    expect(el.plan!.id).toBe(first.id);
    localStorage.setItem('plan_studio.lastPlanId', first.id);
    localStorage.setItem(`plan_studio.draft.${first.id}`, 'x');
    btn(el, 'delete-plan').click();
    await el.updateComplete;
    expect($(el, '.dialog').textContent).toContain("Delete plan 'First'? This cannot be undone.");
    btn(el, 'delete-confirm').click();
    await vi.waitFor(() => expect(el.plan!.id).toBe(second.id));
    expect(stored().map(p => p.id)).toEqual([second.id]);
    expect(localStorage.getItem(`plan_studio.draft.${first.id}`)).toBeNull();
    expect(localStorage.getItem('plan_studio.lastPlanId')).toBe(second.id);
  });

  it('cancel keeps the plan', async () => {
    seed('First', 'Second');
    const el = await mount();
    const id = el.plan!.id;
    btn(el, 'delete-plan').click();
    await el.updateComplete;
    btn(el, 'delete-cancel').click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dialog')).toBeNull();
    expect(el.plan!.id).toBe(id);
    expect(stored().length).toBe(2);
  });

  it('Escape cancels the delete dialog and keys do not reach the editor', async () => {
    seed('First');
    const el = await mount();
    await drawBox(el);
    btn(el, 'delete-plan').click();
    await el.updateComplete;
    key(el, 'keydown', 'z', { ctrlKey: true });
    expect(el.history!.current.level.walls.length).toBe(4);
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dialog')).toBeNull();
    expect(stored().length).toBe(1);
  });

  it('deleting the last plan yields an empty unsaved plan', async () => {
    const [only] = seed('Only');
    const el = await mount();
    btn(el, 'delete-plan').click();
    await el.updateComplete;
    btn(el, 'delete-confirm').click();
    await vi.waitFor(() => expect(el.plan!.id).not.toBe(only.id));
    expect(stored()).toEqual([]);
    expect(el.save.baseRevision).toBeNull();
    expect(el.save.dirty).toBe(false);
    expect(el.history!.current.level.walls.length).toBe(0);
  });

  it('shows a delete error and keeps the plan open', async () => {
    const [first] = seed('First', 'Second');
    const el = await mount();
    el.hass = {
      ...el.hass!,
      connection: { sendMessagePromise: () => Promise.reject({ code: 'unauthorized', message: 'Admin only' }) },
    };
    btn(el, 'delete-plan').click();
    await el.updateComplete;
    btn(el, 'delete-confirm').click();
    await vi.waitFor(() => expect(el.save.state).toBe('error'));
    await el.updateComplete;
    expect(el.plan!.id).toBe(first.id);
    expect($(el, '.save-state').textContent).toContain('Admin only');
  });

  it('load failure shows the message of a numeric WebSocket error', async () => {
    const { createMockHass } = await import('../../dev/mock-hass');
    const el = document.createElement('plan-studio-panel');
    el.hass = { ...createMockHass(), connection: { sendMessagePromise: () => Promise.reject(3) } };
    document.body.appendChild(el);
    await vi.waitFor(() => expect(el.loadError).toBe('Connection lost'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.center')!.textContent).toContain('Failed to load the plan: Connection lost');
  });

  it('delete failure shows the message of a numeric WebSocket error', async () => {
    seed('First', 'Second');
    const el = await mount();
    el.hass = { ...el.hass!, connection: { sendMessagePromise: () => Promise.reject(3) } };
    btn(el, 'delete-plan').click();
    await el.updateComplete;
    btn(el, 'delete-confirm').click();
    await vi.waitFor(() => expect(el.save.state).toBe('error'));
    await el.updateComplete;
    expect($(el, '.save-state').textContent).toContain('Connection lost');
  });

  it('deleting a never-saved plan only discards it locally', async () => {
    const el = await mount();
    const id = el.plan!.id;
    btn(el, 'delete-plan').click();
    await el.updateComplete;
    btn(el, 'delete-confirm').click();
    await vi.waitFor(() => expect(el.plan!.id).not.toBe(id));
    expect(el.save.baseRevision).toBeNull();
  });

  it('new plan with unsaved changes asks first', async () => {
    const [first] = seed('First');
    const el = await mount();
    await drawBox(el);
    btn(el, 'new-plan').click();
    await el.updateComplete;
    btn(el, 'new-cancel').click();
    await el.updateComplete;
    expect(el.plan!.id).toBe(first.id);
    expect(el.history!.current.level.walls.length).toBe(4);
    btn(el, 'new-plan').click();
    await el.updateComplete;
    btn(el, 'new-discard').click();
    await vi.waitFor(() => expect(el.plan!.id).not.toBe(first.id));
    expect(el.save.baseRevision).toBeNull();
    expect(el.save.dirty).toBe(false);
    expect(el.history!.current.level.walls.length).toBe(0);
    expect(localStorage.getItem(`plan_studio.draft.${first.id}`)).toBeNull();
  });

  it('new plan from a clean state needs no confirmation', async () => {
    const [first] = seed('First');
    const el = await mount();
    btn(el, 'new-plan').click();
    await vi.waitFor(() => expect(el.plan!.id).not.toBe(first.id));
    expect(stored().length).toBe(1);
  });
});
