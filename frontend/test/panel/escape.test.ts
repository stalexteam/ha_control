// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { deviceDefaults, type Device } from '../../src/model/types';
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

  it('Esc in Zones: draft, then Select', async () => {
    const el = await mount();
    el.setMode('zones');
    await el.updateComplete;
    await press(el, 'button[data-tool="zone-draw"]');
    click(el, 1000, 1000);
    expect(el.activeTool.preview().zoneDraft).toBeDefined();
    key(el, 'keydown', 'Escape');
    expect(el.activeTool.preview().zoneDraft).toBeUndefined();
    expect(el.toolId).toBe('zone-draw');
    key(el, 'keydown', 'Escape');
    expect(el.toolId).toBe('zones-select');
  });

  it('Esc with an idle Zone from room tool switches to Select', async () => {
    const el = await mount();
    el.setMode('zones');
    await el.updateComplete;
    await press(el, 'button[data-tool="zone-room"]');
    key(el, 'keydown', 'Escape');
    expect(el.toolId).toBe('zones-select');
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

describe('the Binding field notice goes with the selection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  const lamp: Device = {
    id: 'lamp', name: 'Lamp', invalid: false, placement: { mode: 'free', x: 500, y: 500, rotation: 0 },
    props: deviceDefaults('ceiling_light', 'free'),
  };
  const NOTICE = 'Slot is a whole number from 0 to 9.';

  it('Esc in Binding clears the selection and the field notice', async () => {
    const el = await mount();
    el.commit({ ...el.history!.current, devices: [lamp] });
    el.setMode('binding');
    await el.updateComplete;
    el.selection = { kind: 'device', id: 'lamp' };
    el.fieldNotice = NOTICE;
    key(el, 'keydown', 'Escape');
    expect(el.selection).toBeNull();
    expect(el.fieldNotice).toBeNull();
  });

  it('undo that removes the selected device clears the field notice', async () => {
    const el = await mount();
    el.commit({ ...el.history!.current, devices: [lamp] });
    el.setMode('binding');
    await el.updateComplete;
    el.selection = { kind: 'device', id: 'lamp' };
    el.fieldNotice = NOTICE;
    el.undo();
    expect(el.selection).toBeNull();
    expect(el.fieldNotice).toBeNull();
  });

  it('a commit that removes the selected device clears the field notice', async () => {
    const el = await mount();
    el.commit({ ...el.history!.current, devices: [lamp] });
    el.setMode('binding');
    await el.updateComplete;
    el.selection = { kind: 'device', id: 'lamp' };
    el.fieldNotice = NOTICE;
    el.commit({ ...el.history!.current, devices: [] });
    expect(el.selection).toBeNull();
    expect(el.fieldNotice).toBeNull();
  });

  it('a commit that keeps the selected device keeps the field notice', async () => {
    const el = await mount();
    el.commit({ ...el.history!.current, devices: [lamp] });
    el.setMode('binding');
    await el.updateComplete;
    el.selection = { kind: 'device', id: 'lamp' };
    el.fieldNotice = NOTICE;
    el.commit({ ...el.history!.current, devices: [{ ...lamp, name: 'Lamp 2' }] });
    expect(el.selection).toEqual({ kind: 'device', id: 'lamp' });
    expect(el.fieldNotice).toBe(NOTICE);
  });
});
