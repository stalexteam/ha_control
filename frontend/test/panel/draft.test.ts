// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, drawBox, key, mount, pointer, pressSave, stored } from './helpers';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';

const draftKeys = () => Object.keys(localStorage).filter(k => k.startsWith('plan_studio.draft.'));

async function prompt(el: PlanStudioPanel): Promise<void> {
  await vi.waitFor(() => expect(el.shadowRoot!.querySelector('[data-action="restore"]')).not.toBeNull());
}

describe('local draft', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('writes a draft (debounced) while dirty', async () => {
    const el = await mount();
    await drawBox(el);
    await vi.waitFor(() => expect(localStorage.getItem(`plan_studio.draft.${el.plan!.id}`)).not.toBeNull(), { timeout: 2000 });
  });

  it('restores an unsaved new plan after the panel was disconnected', async () => {
    const el = await mount();
    await drawBox(el);
    const id = el.plan!.id;
    el.remove(); // in-app navigation: no beforeunload
    expect(localStorage.getItem(`plan_studio.draft.${id}`)).not.toBeNull();

    const el2 = await mount();
    await prompt(el2);
    $<HTMLButtonElement>(el2, '[data-action="restore"]').click();
    await el2.updateComplete;
    expect(el2.plan!.id).toBe(id);
    expect(el2.history!.current.level.walls.length).toBe(4);
    expect(el2.save.dirty).toBe(true);
    expect(el2.save.baseRevision).toBeNull();
    await pressSave(el2);
    expect(el2.save.state).toBe('saved');
    expect(draftKeys()).toEqual([]);
  });

  it('restores dirty edits of a stored plan, keeping the draft base revision', async () => {
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    expect(draftKeys()).toEqual([]);
    key(el, 'keydown', 'z', { ctrlKey: true });
    expect(el.history!.current.level.walls.length).toBe(0);
    el.remove();

    const el2 = await mount();
    expect(el2.history!.current.level.walls.length).toBe(4); // server copy until the user decides
    await prompt(el2);
    $<HTMLButtonElement>(el2, '[data-action="restore"]').click();
    await el2.updateComplete;
    expect(el2.history!.current.level.walls.length).toBe(0);
    expect(el2.save.dirty).toBe(true);
    expect(el2.save.baseRevision).toBe(1);
    await pressSave(el2);
    expect(el2.save.state).toBe('saved');
    expect(stored()[0].revision).toBe(2);
    expect(draftKeys()).toEqual([]);
  });

  it('discard drops the draft; Escape keeps it for later and blocks the tools', async () => {
    const el = await mount();
    await drawBox(el);
    el.remove();

    const el2 = await mount();
    await prompt(el2);
    key(el2, 'keydown', 'Escape');
    await el2.updateComplete;
    expect(el2.shadowRoot!.querySelector('[data-action="restore"]')).toBeNull();
    expect(draftKeys().length).toBe(1);
    el2.remove();

    const el3 = await mount();
    await prompt(el3);
    key(el3, 'keydown', 'z', { ctrlKey: true }); // dialog open: History must not react
    $<HTMLButtonElement>(el3, '[data-action="discard"]').click();
    await el3.updateComplete;
    expect(draftKeys()).toEqual([]);
    expect(el3.history!.current.level.walls.length).toBe(0);
    expect(el3.save.dirty).toBe(false);
  });

  it('save as new clears the drafts of both ids', async () => {
    const { clearPlans, simulateForeignSave } = await import('../../dev/mock-hass');
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    const oldId = el.plan!.id;
    simulateForeignSave();
    key(el, 'keydown', 'z', { ctrlKey: true });
    el.remove();
    document.body.appendChild(el); // reconnect the same element: draft was flushed
    expect(localStorage.getItem(`plan_studio.draft.${oldId}`)).not.toBeNull();
    await pressSave(el);
    expect(el.save.state).toBe('conflict');
    clearPlans();
    $<HTMLButtonElement>(el, '[data-action="save-as-new"]').click();
    await vi.waitFor(() => expect(el.save.state).toBe('saved'));
    expect(el.plan!.id).not.toBe(oldId);
    expect(draftKeys()).toEqual([]);
  });
});

describe('undecided draft', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('Escape then editing keeps the stored draft; the banner can still restore it', async () => {
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    key(el, 'keydown', 'z', { ctrlKey: true }); // dirty: 0 walls
    el.remove();
    const id = el.plan!.id;
    const before = localStorage.getItem(`plan_studio.draft.${id}`);
    expect(before).not.toBeNull();

    const el2 = await mount();
    await prompt(el2);
    key(el2, 'keydown', 'Escape');
    await el2.updateComplete;
    expect(el2.shadowRoot!.querySelector('.dialog')).toBeNull();
    expect(el2.shadowRoot!.querySelector('.draft-banner')).not.toBeNull();
    // edit the server copy (4 walls): select a wall and delete it
    pointer(el2, 'pointerdown', 300, -100);
    pointer(el2, 'pointerup', 300, -100);
    key(el2, 'keydown', 'Delete');
    expect(el2.history!.current.level.walls.length).toBe(3);
    await new Promise(r => setTimeout(r, 700)); // past the draft debounce
    expect(localStorage.getItem(`plan_studio.draft.${id}`)).toBe(before);
    el2.remove(); // disconnect must not overwrite it either
    expect(localStorage.getItem(`plan_studio.draft.${id}`)).toBe(before);
    document.body.appendChild(el2);
    await el2.updateComplete;

    $<HTMLButtonElement>(el2, '.draft-banner [data-action="banner-restore"]').click();
    await el2.updateComplete;
    expect(el2.history!.current.level.walls.length).toBe(0);
    expect(el2.shadowRoot!.querySelector('.draft-banner')).toBeNull();
  });

  it('banner Discard drops the old draft and starts drafting the current edits', async () => {
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    key(el, 'keydown', 'z', { ctrlKey: true });
    el.remove();
    const id = el.plan!.id;

    const el2 = await mount();
    await prompt(el2);
    key(el2, 'keydown', 'Escape');
    await el2.updateComplete;
    pointer(el2, 'pointerdown', 300, -100);
    pointer(el2, 'pointerup', 300, -100);
    key(el2, 'keydown', 'Delete');
    $<HTMLButtonElement>(el2, '.draft-banner [data-action="banner-discard"]').click();
    await el2.updateComplete;
    expect(el2.shadowRoot!.querySelector('.draft-banner')).toBeNull();
    await vi.waitFor(() => {
      const raw = localStorage.getItem(`plan_studio.draft.${id}`);
      expect(raw && JSON.parse(raw).plan.levels[0].walls.length).toBe(3);
    }, { timeout: 2000 });
  });

  it('beforeunload flushes the pending draft immediately', async () => {
    const el = await mount();
    await drawBox(el);
    window.dispatchEvent(new Event('beforeunload'));
    expect(localStorage.getItem(`plan_studio.draft.${el.plan!.id}`)).not.toBeNull();
  });

  it('pagehide flushes the pending draft immediately', async () => {
    const el = await mount();
    await drawBox(el);
    window.dispatchEvent(new Event('pagehide'));
    expect(localStorage.getItem(`plan_studio.draft.${el.plan!.id}`)).not.toBeNull();
  });
});
