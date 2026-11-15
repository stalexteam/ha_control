// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/binding/entity-combo';
import type { EntityCombo } from '../../src/binding/entity-combo';
import { ent, makeMeta } from './fixtures';

const entities = [
  ent('sensor.t_wc', { name: 'Temp WC', deviceClass: 'temperature', unit: '°C', state: '21.5', deviceId: 'dev1' }),
  ent('sensor.t_kit', { name: 'Temp Kitchen', deviceClass: 'temperature', unit: '°C', state: '22' }),
  ent('light.main', { name: 'Main light', state: 'on' }),
];
const meta = makeMeta(entities, [{ id: 'dev1', name: 'Sensor WC', model: null, areaId: 'a1' }], [['a1', 'Main']]);

async function mount(value: string | null, items = entities, m = meta): Promise<EntityCombo> {
  const el = document.createElement('ps-entity-combo') as EntityCombo;
  el.meta = m; el.items = items; el.value = value; el.label = 'Temperature';
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const q = <T extends Element>(el: EntityCombo, s: string): T => el.shadowRoot!.querySelector<T>(s)!;
const rows = (el: EntityCombo): Element[] => [...el.shadowRoot!.querySelectorAll('.opt')];
async function open(el: EntityCombo): Promise<void> { q<HTMLElement>(el, '.cbox').click(); await el.updateComplete; }
async function type(el: EntityCombo, v: string): Promise<void> {
  const i = q<HTMLInputElement>(el, '.srch input'); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); await el.updateComplete;
}

describe('ps-entity-combo', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('closed box shows name and context', async () => {
    const el = await mount('sensor.t_wc');
    expect(q(el, '.cbox b').textContent).toBe('Temp WC');
    expect(q(el, '.cbox small').textContent).toBe('Main ▸ Sensor WC');
    expect(el.shadowRoot!.querySelector('.srch')).toBeNull();
  });

  it('opening shows a focused search field and rows', async () => {
    const el = await mount(null);
    await open(el);
    expect(q(el, '.srch input')).toBeTruthy();
    expect(el.shadowRoot!.activeElement).toBe(q(el, '.srch input'));
    expect(rows(el)).toHaveLength(3);
    expect(rows(el)[0].textContent).toContain('Sensor');
    expect(rows(el)[0].textContent).toContain('21.5 °C');
  });

  it('typing filters by name, id and context', async () => {
    const el = await mount(null);
    await open(el);
    await type(el, 'wc');
    expect(rows(el)).toHaveLength(1);
    await type(el, 'light.m');
    expect(rows(el)).toHaveLength(1);
    await type(el, 'sensor wc');
    expect(rows(el)).toHaveLength(1);
    await type(el, 'nothing like it');
    expect(rows(el)).toHaveLength(0);
    await type(el, 'main ▸');
    expect(rows(el)).toHaveLength(1);
  });

  it('click on a row fires value-changed and closes', async () => {
    const el = await mount(null);
    let got: unknown = 'none';
    el.addEventListener('value-changed', e => { got = (e as CustomEvent).detail; });
    await open(el);
    (rows(el)[0] as HTMLElement).click();
    await el.updateComplete;
    expect(got).toEqual({ value: 'sensor.t_wc' });
    expect(rows(el)).toHaveLength(0);
  });

  it('x clears with null and does not open', async () => {
    const el = await mount('sensor.t_wc');
    let got: unknown = 'none';
    el.addEventListener('value-changed', e => { got = (e as CustomEvent).detail; });
    q<HTMLElement>(el, '.x').click();
    await el.updateComplete;
    expect(got).toEqual({ value: null });
    expect(el.shadowRoot!.querySelector('.srch')).toBeNull();
  });

  it('keyboard: arrows move, Enter picks, Esc closes', async () => {
    const el = await mount(null);
    let got: unknown = 'none';
    el.addEventListener('value-changed', e => { got = (e as CustomEvent).detail; });
    await open(el);
    const input = q<HTMLInputElement>(el, '.srch input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); await el.updateComplete;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); await el.updateComplete;
    expect(got).toEqual({ value: 'sensor.t_kit' });
    await open(el);
    q<HTMLInputElement>(el, '.srch input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.srch')).toBeNull();
  });

  it('click outside closes', async () => {
    const el = await mount(null);
    await open(el);
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.srch')).toBeNull();
  });

  it('renders at most 100 rows for 3000 items and still searches all', async () => {
    const many = Array.from({ length: 3000 }, (_, i) => ent(`sensor.s${i}`, { name: `Sensor ${i}` }));
    const el = await mount(null, many, makeMeta(many));
    await open(el);
    expect(rows(el)).toHaveLength(100);
    await type(el, 'sensor.s2999');
    expect(rows(el)).toHaveLength(1);
  });

  it('a value missing from items shows its id', async () => {
    const el = await mount('sensor.gone');
    expect(q(el, '.cbox b').textContent).toBe('sensor.gone');
  });
  it('wires aria: listbox id, activedescendant, controls, active row', async () => {
    const el = await mount(null);
    await open(el);
    const input = q<HTMLInputElement>(el, '.srch input');
    const lb = q(el, '[role=listbox]');
    expect(lb.id).toBeTruthy();
    expect(lb.getAttribute('aria-label')).toBe('Temperature');
    expect(input.getAttribute('aria-controls')).toBe(lb.id);
    expect(q(el, '.cbox').getAttribute('aria-controls')).toBe(lb.id);
    expect(rows(el).every(r => !!r.id)).toBe(true);
    expect(input.getAttribute('aria-activedescendant')).toBe(rows(el)[0].id);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); await el.updateComplete;
    expect(input.getAttribute('aria-activedescendant')).toBe(rows(el)[1].id);
    expect(rows(el)[1].classList.contains('on')).toBe(true);
  });

  it('focus returns to the box after Enter and after a row click', async () => {
    const el = await mount(null);
    await open(el);
    q<HTMLInputElement>(el, '.srch input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete; await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(q(el, '.cbox'));
    q<HTMLElement>(el, '.cbox').blur();
    await open(el);
    (rows(el)[0] as HTMLElement).click();
    await el.updateComplete; await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(q(el, '.cbox'));
  });

  it('Esc returns focus to the box', async () => {
    const el = await mount(null);
    await open(el);
    q<HTMLInputElement>(el, '.srch input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete; await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(q(el, '.cbox'));
  });

  it('closes when focus leaves the component', async () => {
    const el = await mount(null);
    await open(el);
    q<HTMLInputElement>(el, '.srch input').dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true, relatedTarget: document.body }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.srch')).toBeNull();
  });

  it('x is a sibling of the combobox, not inside it', async () => {
    const el = await mount('sensor.t_wc');
    expect(q(el, '.cbox').querySelector('.x')).toBeNull();
    expect(q(el, '.x')).toBeTruthy();
  });

  it('removes the document listener on disconnect while open', async () => {
    const el = await mount(null);
    await open(el);
    el.remove();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.srch')).not.toBeNull();
  });

  it('Enter with zero rows does nothing and active stays valid', async () => {
    const el = await mount(null);
    let n = 0;
    el.addEventListener('value-changed', () => { n++; });
    await open(el);
    await type(el, 'zzzz');
    const input = q<HTMLInputElement>(el, '.srch input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;
    expect(n).toBe(0);
    await type(el, '');
    expect(input.getAttribute('aria-activedescendant')).toBe(rows(el)[0].id);
  });

  it('Enter picks the highlighted row when the items shrink under the active index', async () => {
    const el = await mount(null);
    let got: unknown = 'none';
    el.addEventListener('value-changed', e => { got = (e as CustomEvent).detail; });
    await open(el);
    const input = q<HTMLInputElement>(el, '.srch input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await el.updateComplete;
    expect(rows(el)[2].classList.contains('on')).toBe(true);
    el.items = [entities[1]];
    await el.updateComplete;
    expect(rows(el)[0].classList.contains('on')).toBe(true);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;
    expect(got).toEqual({ value: 'sensor.t_kit' });
  });

  it('the listbox holds only options: the hint and the empty text sit outside it', async () => {
    const many = Array.from({ length: 150 }, (_, i) => ent(`sensor.s${i}`, { name: `Sensor ${i}` }));
    const el = await mount(null, many, makeMeta(many));
    await open(el);
    const lb = () => q(el, '[role=listbox]');
    expect(el.shadowRoot!.querySelector('.hint')).not.toBeNull();
    expect(lb().querySelector('.hint')).toBeNull();
    expect([...lb().children].every(c => c.getAttribute('role') === 'option')).toBe(true);
    await type(el, 'zzzz');
    expect(el.shadowRoot!.querySelector('.empty')).not.toBeNull();
    expect(lb().querySelector('.empty')).toBeNull();
    expect(lb().children).toHaveLength(0);
  });

  it('the listbox label falls back to the search label when label is empty', async () => {
    const el = await mount(null);
    el.label = '';
    await open(el);
    expect(q(el, '[role=listbox]').getAttribute('aria-label')).toBe('Search entities');
  });

  it('shows a hint only when more than 100 rows match; no aria-label when label is empty', async () => {
    const many = Array.from({ length: 150 }, (_, i) => ent(`sensor.s${i}`, { name: `Sensor ${i}` }));
    const el = await mount(null, many, makeMeta(many));
    el.label = '';
    await open(el);
    expect(el.shadowRoot!.querySelector('.hint')).not.toBeNull();
    expect(q(el, '.cbox').hasAttribute('aria-label')).toBe(false);
    await type(el, 'sensor.s14');
    expect(el.shadowRoot!.querySelector('.hint')).toBeNull();
  });
});
