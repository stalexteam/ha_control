// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/binding/device-combo';
import type { DeviceCombo } from '../../src/binding/device-combo';
import type { DeviceMeta } from '../../src/binding/ha-meta';
import { makeMeta } from './fixtures';

const devices: DeviceMeta[] = [
  { id: 'plug', name: 'Smart plug', model: 'P1', areaId: 'hall' },
  { id: 'th2', name: 'Twin sensor', model: 'TH-200', areaId: null },
  { id: 'th1', name: 'WC sensor', model: null, areaId: 'wc' },
];
const meta = makeMeta([], devices, [['wc', 'WC'], ['hall', 'Hall']]);

async function mount(label = 'Home Assistant device'): Promise<DeviceCombo> {
  const el = document.createElement('ps-device-combo') as DeviceCombo;
  el.meta = meta; el.devices = devices; el.label = label; el.placeholder = 'Choose one to fill the empty roles';
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const q = <T extends Element>(el: DeviceCombo, s: string): T => el.shadowRoot!.querySelector<T>(s)!;
const ids = (el: DeviceCombo): string[] => [...el.shadowRoot!.querySelectorAll('.opt')].map(r => r.getAttribute('data-id')!);
async function open(el: DeviceCombo): Promise<void> { q<HTMLElement>(el, '.cbox').click(); await el.updateComplete; }
async function type(el: DeviceCombo, v: string): Promise<void> {
  const i = q<HTMLInputElement>(el, '.srch input'); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); await el.updateComplete;
}
const keyDown = (el: DeviceCombo, key: string) =>
  q<HTMLInputElement>(el, '.srch input').dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

describe('ps-device-combo', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('closed: the placeholder, a labelled combobox, no clear button', async () => {
    const el = await mount();
    expect(q(el, '.cbox').textContent).toContain('Choose one to fill the empty roles');
    expect(q(el, '.cbox').getAttribute('role')).toBe('combobox');
    expect(q(el, '.cbox').getAttribute('aria-label')).toBe('Home Assistant device');
    expect(el.shadowRoot!.querySelector('.x')).toBeNull();
  });

  it('rows show the name and "area · model"', async () => {
    const el = await mount();
    await open(el);
    expect(ids(el)).toEqual(['plug', 'th2', 'th1']);
    const rows = [...el.shadowRoot!.querySelectorAll('.opt')];
    expect(rows[0].querySelector('b')!.textContent).toBe('Smart plug');
    expect(rows[0].querySelector('small')!.textContent).toBe('Hall · P1');
    expect(rows[1].querySelector('small')!.textContent).toBe('TH-200');
    expect(rows[2].querySelector('small')!.textContent).toBe('WC');
  });

  it('searches by name, model and area', async () => {
    const el = await mount();
    await open(el);
    await type(el, '200');
    expect(ids(el)).toEqual(['th2']);
    await type(el, 'hall');
    expect(ids(el)).toEqual(['plug']);
    await type(el, 'wc');
    expect(ids(el)).toEqual(['th1']);
    await type(el, 'sensor');
    expect(ids(el)).toEqual(['th2', 'th1']);
    await type(el, 'zzz');
    expect(ids(el)).toEqual([]);
    expect(q(el, '.empty').textContent).toBe('No matching devices');
  });

  it('Enter picks the active row and fires value-changed once; the box keeps its prompt', async () => {
    const el = await mount();
    const got: unknown[] = [];
    el.addEventListener('value-changed', e => got.push((e as CustomEvent).detail));
    await open(el);
    await type(el, 'sensor');
    keyDown(el, 'ArrowDown');
    await el.updateComplete;
    keyDown(el, 'Enter');
    await el.updateComplete;
    expect(got).toEqual([{ value: 'th1' }]);
    expect(el.shadowRoot!.querySelector('.srch')).toBeNull();
    expect(q(el, '.cbox').textContent).toContain('Choose one to fill the empty roles');
  });

  it('Esc closes without picking; the search and listbox are labelled for devices', async () => {
    const el = await mount('');
    let n = 0;
    el.addEventListener('value-changed', () => { n++; });
    await open(el);
    expect(q(el, '.srch input').getAttribute('placeholder')).toBe('Search devices');
    expect(q(el, '[role=listbox]').getAttribute('aria-label')).toBe('Search devices');
    keyDown(el, 'Escape');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.srch')).toBeNull();
    expect(n).toBe(0);
  });
});
