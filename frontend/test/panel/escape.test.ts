// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { click, key, mount, press } from './helpers';

describe('Esc returns to Select', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('Esc twice: chain, then Select', async () => {
    const el = await mount();
    await press(el, 'button[data-tool="wall"]');
    click(el, 0, 0);
    expect(el.activeTool.preview().anchor).toBeDefined();
    key(el, 'keydown', 'Escape');
    expect(el.activeTool.preview().anchor).toBeUndefined();
    expect(el.toolId).toBe('wall');
    key(el, 'keydown', 'Escape');
    expect(el.toolId).toBe('select');
  });

  it('Esc with an idle Door tool switches to Select', async () => {
    const el = await mount();
    await press(el, 'button[data-tool="door"]');
    key(el, 'keydown', 'Escape');
    expect(el.toolId).toBe('select');
  });

  it('Esc in Equipment with the Ceiling light tool switches to device-select', async () => {
    const el = await mount();
    el.setMode('equipment');
    await el.updateComplete;
    await press(el, 'button[data-tool="ceiling_light"]');
    expect(el.toolId).toBe('ceiling_light');
    key(el, 'keydown', 'Escape');
    expect(el.toolId).toBe('device-select');
  });

  it('Esc in Select clears the selection and keeps Select', async () => {
    const el = await mount();
    el.selection = { kind: 'wall', id: 'w1' };
    key(el, 'keydown', 'Escape');
    expect(el.selection).toBeNull();
    expect(el.toolId).toBe('select');
  });

  it('Esc in Binding does nothing to the tool', async () => {
    const el = await mount();
    el.setMode('binding');
    await el.updateComplete;
    key(el, 'keydown', 'Escape');
    expect(el.toolId).toBe('binding-select');
  });
});
