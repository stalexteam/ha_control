// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { $, click, mount, pointer } from './helpers';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { TOOL_ICONS } from '../../src/panel/tool-icons';
import { BINDING_TOOL_IDS, EQUIPMENT_TOOL_IDS, PLAN_TOOL_IDS, POWER_TOOL_IDS } from '../../src/panel/tool-factory';

const ALL_TOOLS = [...PLAN_TOOL_IDS, ...EQUIPMENT_TOOL_IDS, ...BINDING_TOOL_IDS, ...POWER_TOOL_IDS];

async function press(el: PlanStudioPanel, sel: string): Promise<void> {
  $<HTMLButtonElement>(el, sel).click();
  await el.updateComplete;
}

/** A keydown from `target` (default: the panel host), as the browser sends it: composed, bubbling, cancelable. */
async function keyDown(el: PlanStudioPanel, init: KeyboardEventInit, target: EventTarget = el): Promise<KeyboardEvent> {
  const e = new KeyboardEvent('keydown', { bubbles: true, composed: true, cancelable: true, ...init });
  target.dispatchEvent(e);
  await el.updateComplete;
  return e;
}

const chip = (el: PlanStudioPanel) => $(el, '.status .tool-chip').textContent!.replace(/\s+/g, ' ').trim();

describe('tool rail and status chip', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('every tool id has an MDI icon path', () => {
    for (const id of ALL_TOOLS) expect(TOOL_ICONS[id], id).toMatch(/^M/);
  });

  it('each rail button has an icon above its label; the active one has the active class', async () => {
    const el = await mount();
    const buttons = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tools button.tool')];
    expect(buttons.every(b => b.querySelector('svg.ticon path') && b.querySelector('.tlabel'))).toBe(true);
    expect(buttons.filter(b => b.classList.contains('on')).map(b => b.dataset.tool)).toEqual(['select']);
    await press(el, '.tools button[data-tool="wall"]');
    const on = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tools button.tool.on')].map(b => b.dataset.tool);
    expect(on).toEqual(['wall']);
    expect($(el, '.tools button[data-tool="wall"] .tlabel').textContent!.trim()).toBe('Wall');
  });

  it('Plan step buttons carry their shortcut; other steps have none', async () => {
    const el = await mount();
    const keys = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tools button.tool')].map(b => b.dataset.key);
    expect(keys).toEqual(['V', 'B', 'W', 'D', 'N', 'O', 'Z']);
    el.setMode('equipment');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.tools button.tool[data-key]')).toHaveLength(0);
  });

  it('the status chip names the active tool; the Zone tool adds its method', async () => {
    const el = await mount();
    expect(chip(el)).toBe('Select');
    expect($(el, '.status .tool-chip svg path')).toBeTruthy();
    await press(el, '.tools button[data-tool="zone"]');
    expect(chip(el)).toBe('Zone · By walls');
    await press(el, '.props button[data-method="polygon"]');
    expect(chip(el)).toBe('Zone · Polygon');
    const status = $(el, '.status').textContent!.replace(/\s+/g, ' ');
    expect(status).toContain('Enter close');
    expect(status).toContain('Esc cancel');
    el.setMode('power');
    await el.updateComplete;
    expect(chip(el)).toBe('Select');
    el.setMode('binding');
    await el.updateComplete;
    expect(chip(el)).toBe('Select');
  });

  it('the status bar shows the active tool\'s key hints', async () => {
    const el = await mount();
    const status = () => $(el, '.status').textContent!.replace(/\s+/g, ' ');
    expect(status()).toContain('Esc clear selection');
    expect(status()).not.toContain('Tab');
    await press(el, '.tools button[data-tool="wall"]');
    expect(status()).toContain('Shift 90°');
    expect(status()).toContain('digits length');
    expect(status()).toContain('Tab angle');
    expect(status()).toContain('Esc finish');
    await press(el, '.tools button[data-tool="door"]');
    expect(status()).not.toContain('digits');
    expect(status()).toContain('Esc finish');
  });

  it('pressing W in the Plan step selects Wall; every Plan shortcut works by physical key', async () => {
    const el = await mount();
    const e = await keyDown(el, { key: 'w', code: 'KeyW' });
    expect(el.toolId).toBe('wall');
    expect(e.defaultPrevented).toBe(true);
    // A non-Latin layout: e.key is another letter, e.code is the same.
    await keyDown(el, { key: 'ц', code: 'KeyZ' });
    expect(el.toolId).toBe('zone');
    for (const [code, id] of [['KeyV', 'select'], ['KeyB', 'box'], ['KeyD', 'door'], ['KeyN', 'window'],
      ['KeyO', 'opening'], ['KeyZ', 'zone']] as const) {
      await keyDown(el, { key: code.slice(3).toLowerCase(), code });
      expect(el.toolId, code).toBe(id);
    }
  });

  it('pressing W while the Name input has focus types "w" and keeps the tool', async () => {
    const el = await mount();
    await press(el, '.tools button[data-tool="zone"]');
    const input = $<HTMLInputElement>(el, '.props input[data-field="next-zone-name"]');
    input.focus();
    const e = await keyDown(el, { key: 'w', code: 'KeyW' }, input);
    expect(e.defaultPrevented).toBe(false);
    expect(el.toolId).toBe('zone');
  });

  it('Ctrl+W, Alt+W, Shift+W and Cmd+W do nothing', async () => {
    const el = await mount();
    for (const mod of ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'] as const) {
      const e = await keyDown(el, { key: 'w', code: 'KeyW', [mod]: true });
      expect(el.toolId, mod).toBe('select');
      expect(e.defaultPrevented, mod).toBe(false);
    }
  });

  it('typed lengths stay digits only: digits go to the Wall buffer; the active tool\'s own key keeps the draft', async () => {
    const el = await mount();
    await keyDown(el, { key: 'w', code: 'KeyW' });
    click(el, 0, 0);
    await keyDown(el, { key: '3', code: 'Digit3' });
    await keyDown(el, { key: '5', code: 'Numpad5' });
    expect(el.activeTool.preview().tracker?.first).toBe('35');
    expect(el.toolId).toBe('wall');
    await keyDown(el, { key: 'w', code: 'KeyW' }); // already the Wall tool: nothing is cancelled
    expect(el.activeTool.preview().tracker?.first).toBe('35');
  });

  it('a shortcut never switches the tool in the middle of a drag', async () => {
    const el = await mount();
    pointer(el, 'pointerdown', 0, 0);
    await keyDown(el, { key: 'w', code: 'KeyW' });
    expect(el.toolId).toBe('select');
    pointer(el, 'pointerup', 0, 0);
    await keyDown(el, { key: 'w', code: 'KeyW' });
    expect(el.toolId).toBe('wall');
  });

  it('no shortcuts outside the Plan step', async () => {
    const el = await mount();
    for (const mode of ['equipment', 'binding', 'power'] as const) {
      el.setMode(mode);
      await el.updateComplete;
      const before = el.toolId;
      const e = await keyDown(el, { key: 'w', code: 'KeyW' });
      expect(el.toolId, mode).toBe(before);
      expect(e.defaultPrevented, mode).toBe(false);
    }
  });

  it('the Equipment rail lists Leak sensor and Valve', async () => {
    const el = await mount();
    el.setMode('equipment');
    await el.updateComplete;
    expect($(el, '.tools button[data-tool="leak_sensor"] .tlabel').textContent!.trim()).toBe('Leak sensor');
    expect($(el, '.tools button[data-tool="valve"] .tlabel').textContent!.trim()).toBe('Valve');
  });
});
