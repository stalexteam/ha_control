// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearPlans, simulateForeignSave } from '../../dev/mock-hass';
import { $, click, drawBox, mount, pressSave, stored } from './helpers';

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

  it('props panel offers New wall settings for the Wall tool; Partition drives the next wall', async () => {
    const el = await mount();
    $<HTMLButtonElement>(el, 'button[data-tool="wall"]').click();
    await el.updateComplete;
    const type = $<HTMLSelectElement>(el, '.props select[data-field="new-wall-type"]');
    type.value = 'partition';
    type.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.wallType).toBe('partition');
    expect(el.thickness).toBe(100);
    expect($<HTMLInputElement>(el, '.props input[data-field="new-wall-thickness"]').value).toBe('100');
    expect($<HTMLButtonElement>(el, '.top button[data-walltype="partition"]').classList.contains('on')).toBe(true);
    click(el, 0, 0);
    click(el, 2000, 0);
    await el.updateComplete;
    const walls = el.history!.current.walls;
    expect(walls).toHaveLength(1);
    expect(walls[0]).toMatchObject({ type: 'partition', thickness: 100 });
  });

  it('props panel thickness field sets the new wall thickness; Box shows the measure toggle there', async () => {
    const el = await mount();
    $<HTMLButtonElement>(el, 'button[data-tool="box"]').click();
    await el.updateComplete;
    const th = $<HTMLInputElement>(el, '.props input[data-field="new-wall-thickness"]');
    th.value = '250';
    th.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.thickness).toBe(250);
    $<HTMLButtonElement>(el, '.props button[data-measure="axis"]').click();
    await el.updateComplete;
    click(el, 0, 0);
    click(el, 1000, 1000);
    await el.updateComplete;
    const walls = el.history!.current.walls;
    expect(walls).toHaveLength(4);
    expect(walls.every(w => w.thickness === 250)).toBe(true);
    expect(el.history!.current.nodes.map(n => n.x).sort((a, b) => a - b)).toEqual([0, 0, 1000, 1000]);
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
