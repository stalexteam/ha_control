// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { $, click, mount } from './helpers';

customElements.define('ha-icon-picker', class extends HTMLElement { value = ''; });

type Picker = HTMLElement & { value: string };
const pickerOf = (el: PlanStudioPanel, f: string) => $<Picker>(el, `.props ha-icon-picker[data-field="${f}"]`);
const emit = (p: Picker, value: string) =>
  p.dispatchEvent(new CustomEvent('value-changed', { detail: { value }, bubbles: true, composed: true }));

async function tool(el: PlanStudioPanel, mode: string, id: string): Promise<void> {
  if (mode) { $<HTMLButtonElement>(el, `.top button[data-mode="${mode}"]`).click(); await el.updateComplete; }
  $<HTMLButtonElement>(el, `button[data-tool="${id}"]`).click();
  await el.updateComplete;
}

describe('equipment icon with ha-icon-picker', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('next-device: renders the picker, binds value, stores a valid icon', async () => {
    const el = await mount();
    await tool(el, 'equipment', 'equipment');
    expect(el.shadowRoot!.querySelector('.props input[data-field="next-icon"]')).toBeNull();
    const p = pickerOf(el, 'next-icon');
    expect(p.value).toBe('mdi:cube-outline');
    emit(p, 'mdi:water-boiler');
    await el.updateComplete;
    expect(el.nextProps.equipment).toMatchObject({ icon: 'mdi:water-boiler' });
  });

  it('next-device: bad or empty value raises the notice and reverts the picker', async () => {
    const el = await mount();
    await tool(el, 'equipment', 'equipment');
    const p = pickerOf(el, 'next-icon');
    p.value = 'water-boiler';
    emit(p, 'water-boiler');
    await el.updateComplete;
    expect(el.nextProps.equipment).toMatchObject({ icon: 'mdi:cube-outline' });
    expect(p.value).toBe('mdi:cube-outline');
    expect(el.shadowRoot!.textContent).toContain('mdi:water-boiler');
    p.value = '';
    emit(p, '');
    await el.updateComplete;
    expect(p.value).toBe('mdi:cube-outline');
  });

  it('selected device: value-changed updates the stored icon', async () => {
    const el = await mount();
    await tool(el, 'equipment', 'equipment');
    click(el, 1000, 1000);
    await el.updateComplete;
    await tool(el, '', 'device-select');
    click(el, 1000, 1000);
    await el.updateComplete;
    expect(el.selection?.kind).toBe('device');
    emit(pickerOf(el, 'icon'), 'mdi:water-boiler');
    await el.updateComplete;
    expect(el.history!.current.devices[0].props).toMatchObject({ icon: 'mdi:water-boiler' });
  });
});
