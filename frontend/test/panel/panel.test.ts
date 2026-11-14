// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearPlans, simulateForeignSave } from '../../dev/mock-hass';
import { $, drawBox, mount, pressSave, stored } from './helpers';

describe('<plan-studio-panel>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('starts with an unsaved empty plan, draws a box and saves 4 walls', async () => {
    const el = await mount();
    expect(el.save.baseRevision).toBeNull();
    await drawBox(el);
    expect(el.history!.current.walls.length).toBe(4);
    expect(el.save.dirty).toBe(true);
    await pressSave(el);
    expect(el.save.state).toBe('saved');
    const plans = stored();
    expect(plans.length).toBe(1);
    expect(plans[0].revision).toBe(1);
    expect(plans[0].levels[0].walls.length).toBe(4);
    expect(plans[0].levels[0].walls.every(w => w.type === 'bearing' && w.thickness === 400)).toBe(true);
  });

  it('undoes with Ctrl+Z and redoes with Ctrl+Y', async () => {
    const el = await mount();
    await drawBox(el);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }));
    expect(el.history!.current.walls.length).toBe(0);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, bubbles: true }));
    expect(el.history!.current.walls.length).toBe(4);
  });

  it('offers overwrite on conflict and only save-as-new after a second conflict', async () => {
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    simulateForeignSave();
    await pressSave(el);
    expect(el.save.state).toBe('conflict');
    expect(el.shadowRoot!.querySelector('[data-action="overwrite"]')).not.toBeNull();

    clearPlans(); // deleted elsewhere: overwrite conflicts again
    $<HTMLButtonElement>(el, '[data-action="overwrite"]').click();
    await vi.waitFor(() => expect(el.save.state).toBe('conflict'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[data-action="overwrite"]')).toBeNull();

    const oldId = el.plan!.id;
    $<HTMLButtonElement>(el, '[data-action="save-as-new"]').click();
    await vi.waitFor(() => expect(el.save.state).toBe('saved'));
    await el.updateComplete;
    expect(el.plan!.id).not.toBe(oldId);
    expect(el.shadowRoot!.querySelector('.dialog')).toBeNull();
    expect(stored().map(p => p.id)).toEqual([el.plan!.id]);
  });
});
