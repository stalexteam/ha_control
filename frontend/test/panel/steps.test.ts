// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'lit';
import { renderSteps } from '../../src/panel/steps';
import type { EditorMode } from '../../src/panel/tool-factory';
import type { BindStatus } from '../../src/model/bindings';
import { deviceDefaults, emptyLevel, type Device, type Level, type Wall, type Zone } from '../../src/model/types';
import type { PowerSchema } from '../../src/model/power';

const dev = (id: string): Device =>
  ({ id, name: id, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 }, props: deviceDefaults('socket', 'free') });

/** `zones` walls zones, then `polygons` invalid polygon zones. */
function level(walls: number, zones: number, devices: number, polygons = 0): Level {
  const w = { id: 'w', a: 'a', b: 'b', thickness: 100, type: 'bearing', baseline: 'center' } as Wall;
  const z: Zone = { id: 'z', name: 'Z', shape: { kind: 'walls', seed: { x: 0, y: 0 }, outline: [], broken: false }, invalid: false };
  const pz: Zone = { id: 'pz', name: 'Zone', shape: { kind: 'polygon', vertices: [] }, invalid: true };
  return {
    ...emptyLevel('l0'),
    walls: Array.from({ length: walls }, (_, i) => ({ ...w, id: `w${i}` })),
    zones: [
      ...Array.from({ length: zones }, (_, i) => ({ ...z, id: `z${i}` })),
      ...Array.from({ length: polygons }, (_, i) => ({ ...pz, id: `pz${i}` })),
    ],
    devices: Array.from({ length: devices }, (_, i) => dev(`d${i}`)),
  };
}

const GRID_ONLY: PowerSchema = { blocks: [{ id: 'g', kind: 'grid', x: 0, y: 0 }], wires: [] };

function draw(mode: EditorMode, lv: Level, bound: string[] = [], power: PowerSchema = GRID_ONLY) {
  const onMode = vi.fn();
  const onRename = vi.fn();
  const status = (d: Device): BindStatus => (bound.includes(d.id) ? 'bound' : 'unbound');
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(renderSteps({ mode, level: lv, status, power, rules: 0, planName: 'Home', onRename, onMode }), host);
  const q = <T extends Element>(sel: string) => host.querySelector<T>(sel);
  const text = (sel: string) => q(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? null;
  return { host, q, text, onMode, onRename };
}

describe('renderSteps', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('title cell shows the plan name and "Plan Studio"; renaming calls onRename', () => {
    const s = draw('plan', level(0, 0, 0));
    const name = s.q<HTMLInputElement>('.title input.plan-name')!;
    expect(name.value).toBe('Home');
    expect(s.text('.title')).toContain('Plan Studio');
    name.value = 'Flat';
    name.dispatchEvent(new Event('change'));
    expect(s.onRename).toHaveBeenCalledWith('Flat');
  });

  it('cell statuses read "15 walls, 6 zones", "3 devices", "1 of 3 bound", "1 block", "0 rules"; no Zones step', () => {
    const s = draw('plan', level(15, 6, 3), ['d1']);
    expect(s.text('[data-mode="plan"] .state')).toBe('15 walls, 6 zones');
    expect(s.text('[data-mode="equipment"] .state')).toBe('3 devices');
    expect(s.text('[data-mode="binding"] .state')).toBe('1 of 3 bound');
    expect(s.q('[data-mode="zones"]')).toBeNull();
    expect(s.text('[data-mode="power"] .state')).toBe('1 block');
    expect(s.text('[data-mode="automation"] .state')).toBe('0 rules');
    expect(s.text('[data-mode="binding"] .name')).toBe('Binding');
    expect(s.text('[data-mode="binding"] .n')).toBe('3');
    expect(s.text('[data-mode="power"] .name')).toBe('Power');
    expect(s.text('[data-mode="power"] .n')).toBe('4');
    expect(s.text('[data-mode="automation"] .n')).toBe('5');
  });

  it('the Plan cell counts every zone and adds the invalid ones; it is done with a wall and a zone', () => {
    const done = (s: ReturnType<typeof draw>) => s.q('[data-mode="plan"]')!.classList.contains('done');
    expect(done(draw('plan', level(1, 0, 0)))).toBe(false);
    const one = draw('plan', level(1, 0, 0, 1));
    expect(one.text('[data-mode="plan"] .state')).toBe('1 wall, 1 zone, 1 invalid');
    expect(done(one)).toBe(true);
    expect(draw('plan', level(2, 1, 0, 2)).text('[data-mode="plan"] .state')).toBe('2 walls, 3 zones, 2 invalid');
    expect(done(draw('plan', level(0, 1, 0)))).toBe(false);
  });

  it('the Power cell counts blocks and is done once the grid has a power entity and a wire exists', () => {
    const done = (s: ReturnType<typeof draw>) => s.q('[data-mode="power"]')!.classList.contains('done');
    const two: PowerSchema = { blocks: [...GRID_ONLY.blocks, { id: 'r', kind: 'remainder', x: 0, y: 100 }], wires: [] };
    const wired: PowerSchema = { ...two, wires: [{ id: 'w', from: { block: 'g', port: 'OUT' }, to: { block: 'r', port: 'IN' } }] };
    const metered = (s: PowerSchema): PowerSchema =>
      ({ ...s, blocks: s.blocks.map(b => (b.kind === 'grid' ? { ...b, power: 'sensor.grid' } : b)) });
    expect(draw('plan', level(0, 0, 0), [], two).text('[data-mode="power"] .state')).toBe('2 blocks');
    expect(done(draw('plan', level(0, 0, 0), [], wired))).toBe(false);
    expect(done(draw('plan', level(0, 0, 0), [], metered(two)))).toBe(false);
    expect(done(draw('plan', level(0, 0, 0), [], metered(wired)))).toBe(true);
  });

  it('singular counts read "1 wall, 1 zone" and "1 device"', () => {
    const s = draw('plan', level(1, 1, 1));
    expect(s.text('[data-mode="plan"] .state')).toBe('1 wall, 1 zone');
    expect(s.text('[data-mode="equipment"] .state')).toBe('1 device');
  });

  it('done: plan needs walls and zones, equipment needs devices, binding needs every device bound', () => {
    const done = (s: ReturnType<typeof draw>, m: string) => s.q(`[data-mode="${m}"]`)!.classList.contains('done');
    const empty = draw('plan', level(3, 0, 0));
    expect(done(empty, 'plan')).toBe(false);
    expect(done(empty, 'equipment')).toBe(false);
    expect(done(empty, 'binding')).toBe(false);
    const part = draw('plan', level(3, 1, 2), ['d0']);
    expect(done(part, 'plan')).toBe(true);
    expect(done(part, 'equipment')).toBe(true);
    expect(done(part, 'binding')).toBe(false);
    expect(done(draw('plan', level(3, 1, 2), ['d0', 'd1']), 'binding')).toBe(true);
  });

  it('the current step is marked; clicking the Binding cell switches mode', () => {
    const s = draw('equipment', level(4, 1, 2));
    expect(s.q('[data-mode="equipment"]')!.classList.contains('current')).toBe(true);
    expect(s.q('[data-mode="equipment"]')!.getAttribute('aria-current')).toBe('step');
    expect(s.q('[data-mode="plan"]')!.classList.contains('current')).toBe(false);
    s.q<HTMLButtonElement>('[data-mode="binding"]')!.click();
    expect(s.onMode).toHaveBeenCalledWith('binding');
  });

  it('Automation is a real step: enabled, fifth, and clicking it asks for the mode', () => {
    const s = draw('plan', level(0, 0, 0));
    const auto = s.q<HTMLButtonElement>('[data-mode="automation"]')!;
    expect(auto.disabled).toBe(false);
    expect(auto.textContent).toContain('Automation');
    expect(s.text('[data-mode="automation"] .n')).toBe('5');
    auto.click();
    expect(s.onMode).toHaveBeenCalledWith('automation');
  });

  it('Back and Next name their target', () => {
    const plan = draw('plan', level(0, 0, 0));
    expect(plan.q('[data-nav="back"]')).toBeNull();
    expect(plan.text('[data-nav="next"]')).toBe('Next: Equipment');
    plan.q<HTMLButtonElement>('[data-nav="next"]')!.click();
    expect(plan.onMode).toHaveBeenCalledWith('equipment');

    const eq = draw('equipment', level(0, 0, 0));
    expect(eq.text('[data-nav="back"]')).toBe('Back: Plan');
    expect(eq.text('[data-nav="next"]')).toBe('Next: Binding');
    eq.q<HTMLButtonElement>('[data-nav="back"]')!.click();
    expect(eq.onMode).toHaveBeenCalledWith('plan');
    eq.q<HTMLButtonElement>('[data-nav="next"]')!.click();
    expect(eq.onMode).toHaveBeenCalledWith('binding');
  });

  it('in Binding, Back is "Back: Equipment" and Next is "Next: Power"; Power leads on to Automation, the last step, which has no Next', () => {
    const s = draw('binding', level(4, 1, 2));
    expect(s.text('[data-nav="back"]')).toBe('Back: Equipment');
    expect(s.text('[data-nav="next"]')).toBe('Next: Power');
    s.q<HTMLButtonElement>('[data-nav="next"]')!.click();
    expect(s.onMode).toHaveBeenCalledWith('power');
    s.q<HTMLButtonElement>('[data-nav="back"]')!.click();
    expect(s.onMode).toHaveBeenCalledWith('equipment');
    const p = draw('power', level(4, 1, 2));
    expect(p.q('[data-mode="power"]')!.getAttribute('aria-current')).toBe('step');
    expect(p.text('[data-nav="back"]')).toBe('Back: Binding');
    expect(p.text('[data-nav="next"]')).toBe('Next: Automation');
    const a = draw('automation', level(4, 1, 2));
    expect(a.text('[data-nav="back"]')).toBe('Back: Power');
    expect(a.q('[data-nav="next"]')).toBeNull();
  });

  it('labels are sentence case (no all-caps text)', () => {
    const s = draw('binding', level(1, 1, 1));
    const words = (s.host.textContent ?? '').match(/[A-Za-z]{2,}/g) ?? [];
    expect(words.filter(w => w === w.toUpperCase())).toEqual([]);
  });
});
