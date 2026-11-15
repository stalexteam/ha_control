// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEY, createMockHass } from '../../dev/mock-hass';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { $, click, drawBox, key, mount, pressSave, stored } from './helpers';

async function tab(el: PlanStudioPanel, mode: 'plan' | 'equipment'): Promise<void> {
  $<HTMLButtonElement>(el, `.top button[data-mode="${mode}"]`).click();
  await el.updateComplete;
}

async function tool(el: PlanStudioPanel, id: string): Promise<void> {
  $<HTMLButtonElement>(el, `button[data-tool="${id}"]`).click();
  await el.updateComplete;
}

describe('Equipment tab', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('loads a stage-1 plan without devices, places a ceiling light and saves it', async () => {
    const level = { id: 'L1', name: 'Level 1', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [] };
    const plan = { id: 'P1', name: 'Old', schemaVersion: 1, revision: 1, levels: [level] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
    const el = await mount();
    expect(el.plan!.id).toBe('P1');
    await tab(el, 'equipment');
    await tool(el, 'ceiling_light');
    click(el, 1000, 1000);
    await el.updateComplete;
    expect(el.history!.current.devices).toHaveLength(1);
    await pressSave(el);
    expect(el.save.state).toBe('saved');
    const devices = stored()[0].levels[0].devices;
    expect(devices).toHaveLength(1);
    expect(devices[0].props.kind).toBe('ceiling_light');
  });

  it('tab switch changes the tool rail and clears the selection', async () => {
    const el = await mount();
    expect(el.shadowRoot!.querySelectorAll('.tools button.tool')).toHaveLength(7);
    await drawBox(el);
    await tool(el, 'select');
    click(el, 300, -100);
    await el.updateComplete;
    expect(el.selection?.kind).toBe('wall');
    await tab(el, 'equipment');
    expect(el.selection).toBeNull();
    expect(el.toolId).toBe('device-select');
    const tools = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tools button.tool')];
    expect(tools).toHaveLength(8);
    expect(tools.map(b => b.dataset.tool)).toEqual(['device-select', 'ceiling_light', 'wall_light', 'motion_sensor',
      'illuminance_sensor', 'switch', 'socket', 'equipment']);
    expect(tools[1].textContent!.trim()).toBe('Ceiling light');
    await tab(el, 'plan');
    expect(el.toolId).toBe('select');
    expect(el.shadowRoot!.querySelectorAll('.tools button.tool')).toHaveLength(7);
  });

  it('deleting a hosting wall in the Plan tab removes its switch; Ctrl+Z brings both back', async () => {
    const el = await mount();
    await drawBox(el);
    await tab(el, 'equipment');
    await tool(el, 'switch');
    click(el, 100, -100);
    await el.updateComplete;
    const devices = el.history!.current.devices;
    expect(devices).toHaveLength(1);
    expect(devices[0].placement.mode).toBe('wall');
    const wallId = devices[0].placement.mode === 'wall' ? devices[0].placement.wallId : '';
    await tab(el, 'plan');
    click(el, 100, -100);
    await el.updateComplete;
    expect(el.selection).toEqual({ kind: 'wall', id: wallId });
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.history!.current.walls.some(w => w.id === wallId)).toBe(false);
    expect(el.history!.current.devices).toHaveLength(0);
    key(el, 'keydown', 'z', { ctrlKey: true, code: 'KeyZ' });
    await el.updateComplete;
    expect(el.history!.current.walls.some(w => w.id === wallId)).toBe(true);
    expect(el.history!.current.devices).toHaveLength(1);
  });

  it('unchecking Cones & zones removes the cone elements', async () => {
    const el = await mount();
    await tab(el, 'equipment');
    await tool(el, 'motion_sensor');
    click(el, 1000, 1000);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.cone').length).toBeGreaterThan(0);
    const box = $<HTMLInputElement>(el, '.status input[data-toggle="cones"]');
    expect(box.checked).toBe(true);
    box.checked = false;
    box.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.cone')).toHaveLength(0);
  });

  it('next-device cone angle drives the next wall light', async () => {
    const el = await mount();
    await drawBox(el);
    await tab(el, 'equipment');
    await tool(el, 'wall_light');
    const f = $<HTMLInputElement>(el, '.props input[data-field="next-coneAngle"]');
    expect(f.value).toBe('90');
    f.value = '60';
    f.dispatchEvent(new Event('change'));
    await el.updateComplete;
    click(el, 100, -100);
    await el.updateComplete;
    const d = el.history!.current.devices;
    expect(d).toHaveLength(1);
    expect(d[0].props).toMatchObject({ kind: 'wall_light', coneAngle: 60 });
  });

  it('rejects an out-of-range angle in the next-device fields', async () => {
    const el = await mount();
    await tab(el, 'equipment');
    await tool(el, 'wall_light');
    const f = $<HTMLInputElement>(el, '.props input[data-field="next-coneAngle"]');
    f.value = '400';
    f.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(f.value).toBe('90');
  });

  it('aim field on a wall motion sensor accepts -30, 90 and -90 and rejects 91', async () => {
    const el = await mount();
    await drawBox(el);
    await tab(el, 'equipment');
    await tool(el, 'motion_sensor');
    click(el, 100, -100);
    await el.updateComplete;
    const f = () => $<HTMLInputElement>(el, '.props input[data-field="aim"]');
    const aim = () => { const p = el.history!.current.devices[0].placement; return p.mode === 'wall' ? p.aim : NaN; };
    f().value = '-30'; f().dispatchEvent(new Event('change')); await el.updateComplete;
    expect(aim()).toBe(-30);
    f().value = '90'; f().dispatchEvent(new Event('change')); await el.updateComplete;
    expect(aim()).toBe(90);
    f().value = '-90'; f().dispatchEvent(new Event('change')); await el.updateComplete;
    expect(aim()).toBe(-90);
    f().value = '-30'; f().dispatchEvent(new Event('change')); await el.updateComplete;
    f().value = '91'; f().dispatchEvent(new Event('change')); await el.updateComplete;
    expect(aim()).toBe(-30);
    expect(f().value).toBe('-30');
    expect(el.shadowRoot!.querySelector('.props .warn')).not.toBeNull();
  });

  it('aim field is hidden for a switch', async () => {
    const el = await mount();
    await drawBox(el);
    await tab(el, 'equipment');
    await tool(el, 'switch');
    click(el, 100, -100);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.props input[data-field="aim"]')).toBeNull();
  });

  it('device properties edit the selected device and Delete removes it', async () => {
    const el = await mount();
    await tab(el, 'equipment');
    await tool(el, 'ceiling_light');
    click(el, 1000, 1000);
    await el.updateComplete;
    const id = el.history!.current.devices[0].id;
    expect(el.selection).toEqual({ kind: 'device', id });
    const rot = $<HTMLInputElement>(el, '.props input[data-field="rotation"]');
    rot.value = '45';
    rot.dispatchEvent(new Event('change'));
    await el.updateComplete;
    const pl = el.history!.current.devices[0].placement;
    expect(pl.mode === 'free' && pl.rotation).toBe(45);
    $<HTMLButtonElement>(el, '.props button[data-action="delete-device"]').click();
    await el.updateComplete;
    expect(el.history!.current.devices).toHaveLength(0);
    expect(el.selection).toBeNull();
  });
});

describe('Equipment tab: rejected edits', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  async function wallSwitch(el: PlanStudioPanel): Promise<void> {
    await tool(el, 'wall');
    click(el, 0, 0);
    click(el, 3000, 0);
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.history!.current.walls).toHaveLength(1);
    await tab(el, 'equipment');
    await tool(el, 'switch');
    click(el, 1000, 0);
    await el.updateComplete;
    expect(el.history!.current.devices).toHaveLength(1);
    expect(el.selection?.kind).toBe('device');
  }

  it('an offset outside the wall is rejected: notice shown, offset and field unchanged', async () => {
    const el = await mount();
    await wallSwitch(el);
    const before = el.history!.current.devices[0].placement;
    expect($<HTMLSelectElement>(el, '.props select[data-field="side"]').value).toBe(before.mode === 'wall' ? before.side : '');
    const f = $<HTMLInputElement>(el, '.props input[data-field="offset"]');
    const shown = f.value;
    f.value = '5000';
    f.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.history!.current.devices[0].placement).toEqual(before);
    expect($<HTMLInputElement>(el, '.props input[data-field="offset"]').value).toBe(shown);
    expect($(el, '.props .warn').textContent).toContain('Does not fit');
  });

  it('a malformed offset shows the offset message', async () => {
    const el = await mount();
    await wallSwitch(el);
    const f = $<HTMLInputElement>(el, '.props input[data-field="offset"]');
    f.value = 'abc';
    f.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect($(el, '.props .warn').textContent).toContain('0 or more');
  });

  it('rotation 0 is accepted and 360 is rejected', async () => {
    const el = await mount();
    await tab(el, 'equipment');
    await tool(el, 'ceiling_light');
    click(el, 1000, 1000);
    await el.updateComplete;
    const rot = () => $<HTMLInputElement>(el, '.props input[data-field="rotation"]');
    const rotation = () => { const p = el.history!.current.devices[0].placement; return p.mode === 'free' ? p.rotation : NaN; };
    rot().value = '30'; rot().dispatchEvent(new Event('change')); await el.updateComplete;
    rot().value = '0'; rot().dispatchEvent(new Event('change')); await el.updateComplete;
    expect(rotation()).toBe(0);
    rot().value = '360'; rot().dispatchEvent(new Event('change')); await el.updateComplete;
    expect(rotation()).toBe(0);
    expect(rot().value).toBe('0');
    expect(el.shadowRoot!.querySelector('.props .warn')).not.toBeNull();
  });

  it('re-entering the current value commits nothing and stays clean', async () => {
    const el = await mount();
    await tab(el, 'equipment');
    await tool(el, 'ceiling_light');
    click(el, 1000, 1000);
    await el.updateComplete;
    await pressSave(el);
    expect(el.save.state).toBe('saved');
    const before = el.history!.current;
    const field = (n: string) => $<HTMLInputElement>(el, `.props input[data-field="${n}"]`);
    for (const n of ['diameter', 'rotation', 'name']) {
      const f = field(n);
      f.value = n === 'name' ? ` ${f.value} ` : f.value;
      f.dispatchEvent(new Event('change'));
      await el.updateComplete;
    }
    expect(el.history!.current).toBe(before);
    expect(el.save.state).toBe('saved');
  });

  it('undo with a device selected clears the selection', async () => {
    const el = await mount();
    await tab(el, 'equipment');
    await tool(el, 'ceiling_light');
    click(el, 1000, 1000);
    await el.updateComplete;
    expect(el.selection?.kind).toBe('device');
    key(el, 'keydown', 'z', { ctrlKey: true, code: 'KeyZ' });
    await el.updateComplete;
    expect(el.selection).toBeNull();
    expect(el.history!.current.devices).toHaveLength(0);
    expect($(el, '.props').textContent).toContain('Next device');
  });
});

describe('Equipment tab: typing survives re-renders', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('a focused field keeps the typed text when HA pushes a new hass object', async () => {
    const el = await mount();
    await tab(el, 'equipment');
    await tool(el, 'wall_light');
    const f = $<HTMLInputElement>(el, '.props input[data-field="next-coneRange"]');
    f.focus();
    expect(el.shadowRoot!.activeElement).toBe(f);
    f.value = '15';
    el.hass = createMockHass({ language: 'en' });
    await el.updateComplete;
    el.requestUpdate();
    await el.updateComplete;
    expect($<HTMLInputElement>(el, '.props input[data-field="next-coneRange"]').value).toBe('15');
    f.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.nextProps.wall_light).toMatchObject({ coneRange: 15 });
    expect($<HTMLInputElement>(el, '.props input[data-field="next-coneRange"]').value).toBe('15');
  });

  it('a focused plan field (new wall thickness) keeps the typed text across a re-render', async () => {
    const el = await mount();
    await tool(el, 'wall');
    const f = $<HTMLInputElement>(el, '.props input[data-field="new-wall-thickness"]');
    f.focus();
    f.value = '12';
    el.hass = createMockHass({ language: 'en' });
    await el.updateComplete;
    el.requestUpdate();
    await el.updateComplete;
    expect(f.value).toBe('12');
  });
});
