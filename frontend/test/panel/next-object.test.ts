// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { $, click, mount } from './helpers';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { addBox } from '../../src/model/ops';

async function tool(el: PlanStudioPanel, id: string): Promise<void> {
  $<HTMLButtonElement>(el, `button[data-tool="${id}"]`).click();
  await el.updateComplete;
}
async function setField(el: PlanStudioPanel, field: string, value: string): Promise<void> {
  const f = $<HTMLInputElement | HTMLSelectElement>(el, `.props [data-field="${field}"]`);
  f.value = value;
  f.dispatchEvent(new Event('change'));
  await el.updateComplete;
}
async function withBox(el: PlanStudioPanel): Promise<void> {
  const l = addBox(el.history!.current, { x: 0, y: 0 }, { x: 4000, y: 3000 }, { type: 'partition', thickness: 100, baseline: 'center' }, 'axis');
  el.history!.push(l);
  el.requestUpdate();
  await el.updateComplete;
}

describe('wall type vs thickness', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('Partition for the next wall keeps thickness 400', async () => {
    const el = await mount();
    await tool(el, 'wall');
    await setField(el, 'new-wall-type', 'partition');
    expect(el.wallType).toBe('partition');
    expect(el.thickness).toBe(400);
    expect($<HTMLInputElement>(el, '.props [data-field="new-wall-thickness"]').value).toBe('400');
  });

  it('top bar has no wall type buttons or thickness field', async () => {
    const el = await mount();
    expect(el.shadowRoot!.querySelectorAll('.top [data-walltype]').length).toBe(0);
    expect(el.shadowRoot!.querySelectorAll('.top input.num').length).toBe(0);
  });

  it('changing an existing wall type keeps its thickness', async () => {
    const el = await mount();
    await withBox(el);
    const w = el.history!.current.walls[0];
    el.selection = { kind: 'wall', id: w.id };
    await el.updateComplete;
    const sel = $<HTMLSelectElement>(el, '.props select');
    sel.value = 'bearing';
    sel.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.history!.current.walls[0]).toMatchObject({ type: 'bearing', thickness: 100 });
  });
});

describe('next object panel', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('door: width/hinge/swing; placed door and the next one use them', async () => {
    const el = await mount();
    await withBox(el);
    await tool(el, 'door');
    expect($<HTMLInputElement>(el, '.props [data-field="next-width"]').value).toBe('900');
    $<HTMLSelectElement>(el, '.props [data-field="next-hinge"]');
    $<HTMLSelectElement>(el, '.props [data-field="next-swing"]');
    await setField(el, 'next-width', '800');
    await setField(el, 'next-hinge', 'end');
    await setField(el, 'next-swing', 'right');
    click(el, 1000, 0);
    await el.updateComplete;
    click(el, 3000, 0);
    await el.updateComplete;
    const ops = el.history!.current.openings;
    expect(ops).toHaveLength(2);
    expect(ops.map(o => o.width)).toEqual([800, 800]);
    expect(ops[0]).toMatchObject({ hinge: 'end', swing: 'right' });
  });

  it('window: width and outside side', async () => {
    const el = await mount();
    await withBox(el);
    await tool(el, 'window');
    await setField(el, 'next-width', '1500');
    await setField(el, 'next-outside', 'right');
    click(el, 2000, 0);
    await el.updateComplete;
    expect(el.history!.current.openings[0]).toMatchObject({ kind: 'window', width: 1500, outside: 'right' });
  });

  it('opening: width', async () => {
    const el = await mount();
    await withBox(el);
    await tool(el, 'opening');
    await setField(el, 'next-width', '1100');
    click(el, 2000, 0);
    await el.updateComplete;
    expect(el.history!.current.openings[0]).toMatchObject({ kind: 'opening', width: 1100 });
  });

  it('invalid width is rejected with a notice', async () => {
    const el = await mount();
    await tool(el, 'door');
    for (const bad of ['0', 'abc']) {
      await setField(el, 'next-width', bad);
      expect($<HTMLElement>(el, '.props .warn').textContent).toContain('whole number');
      expect($<HTMLInputElement>(el, '.props [data-field="next-width"]').value).toBe('900');
    }
  });

  it('zone: name Room 1, custom name used, default advances', async () => {
    const el = await mount();
    await withBox(el);
    await tool(el, 'zone');
    expect($<HTMLInputElement>(el, '.props [data-field="next-zone-name"]').value).toBe('Room 1');
    await setField(el, 'next-zone-name', 'Kitchen');
    click(el, 2000, 1500);
    await el.updateComplete;
    expect(el.history!.current.zones.map(z => z.name)).toEqual(['Kitchen']);
    el.selection = null;
    await el.updateComplete;
    expect($<HTMLInputElement>(el, '.props [data-field="next-zone-name"]').value).toBe('Room 1');
  });
});

describe('layout order', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('tool rail, properties, canvas in both tabs', async () => {
    const el = await mount();
    const order = () => [...el.shadowRoot!.querySelector('.ed')!.children]
      .map(c => ['tools', 'props', 'canvas'].find(k => c.classList.contains(k))).filter(Boolean);
    expect(order()).toEqual(['tools', 'props', 'canvas']);
    $<HTMLButtonElement>(el, 'button[data-mode="equipment"]').click();
    await el.updateComplete;
    expect(order()).toEqual(['tools', 'props', 'canvas']);
  });
});
