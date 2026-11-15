// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'lit';
import { renderSteps } from '../../src/panel/steps';
import type { EditorMode } from '../../src/panel/tool-factory';
import type { BindStatus } from '../../src/model/bindings';
import { deviceDefaults, emptyLevel, type AutomationZone, type Device, type Level, type Wall, type Zone } from '../../src/model/types';

const dev = (id: string): Device =>
  ({ id, name: id, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 }, props: deviceDefaults('socket', 'free') });

function level(walls: number, zones: number, devices: number, automationZones = 0): Level {
  const w = { id: 'w', a: 'a', b: 'b', thickness: 100, type: 'bearing', baseline: 'center' } as Wall;
  const z = { id: 'z', name: 'Z', seed: { x: 0, y: 0 }, outline: [], broken: false } as unknown as Zone;
  const az: AutomationZone = { id: 'az', name: 'Zone', shape: { kind: 'polygon', vertices: [] }, invalid: true };
  return {
    ...emptyLevel('l0'),
    walls: Array.from({ length: walls }, (_, i) => ({ ...w, id: `w${i}` })),
    zones: Array.from({ length: zones }, (_, i) => ({ ...z, id: `z${i}` })),
    devices: Array.from({ length: devices }, (_, i) => dev(`d${i}`)),
    ...(automationZones ? { automationZones: Array.from({ length: automationZones }, (_, i) => ({ ...az, id: `az${i}` })) } : {}),
  };
}

function draw(mode: EditorMode, lv: Level, bound: string[] = []) {
  const onMode = vi.fn();
  const onRename = vi.fn();
  const status = (d: Device): BindStatus => (bound.includes(d.id) ? 'bound' : 'unbound');
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(renderSteps({ mode, level: lv, status, planName: 'Home', onRename, onMode }), host);
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

  it('cell statuses read "15 walls, 6 rooms", "3 devices", "1 of 3 bound", "0 zones", "Comes later"', () => {
    const s = draw('plan', level(15, 6, 3), ['d1']);
    expect(s.text('[data-mode="plan"] .state')).toBe('15 walls, 6 rooms');
    expect(s.text('[data-mode="equipment"] .state')).toBe('3 devices');
    expect(s.text('[data-mode="binding"] .state')).toBe('1 of 3 bound');
    expect(s.text('[data-mode="zones"] .state')).toBe('0 zones');
    expect(s.text('[data-step="automation"] .state')).toBe('Comes later');
    expect(s.text('[data-mode="binding"] .name')).toBe('Binding');
    expect(s.text('[data-mode="binding"] .n')).toBe('3');
    expect(s.text('[data-mode="zones"] .name')).toBe('Zones');
    expect(s.text('[data-mode="zones"] .n')).toBe('4');
    expect(s.text('[data-step="automation"] .n')).toBe('5');
  });

  it('the Zones cell counts every zone (invalid ones too) and is done with one or more', () => {
    const done = (s: ReturnType<typeof draw>) => s.q('[data-mode="zones"]')!.classList.contains('done');
    expect(done(draw('plan', level(0, 0, 0)))).toBe(false);
    const one = draw('plan', level(0, 0, 0, 1));
    expect(one.text('[data-mode="zones"] .state')).toBe('1 zone');
    expect(done(one)).toBe(true);
    expect(draw('plan', level(0, 0, 0, 2)).text('[data-mode="zones"] .state')).toBe('2 zones');
  });

  it('singular counts read "1 wall, 1 room" and "1 device"', () => {
    const s = draw('plan', level(1, 1, 1));
    expect(s.text('[data-mode="plan"] .state')).toBe('1 wall, 1 room');
    expect(s.text('[data-mode="equipment"] .state')).toBe('1 device');
  });

  it('done: plan needs walls and rooms, equipment needs devices, binding needs every device bound', () => {
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

  it('Automation is disabled', () => {
    const s = draw('plan', level(0, 0, 0));
    const auto = s.q<HTMLButtonElement>('[data-step="automation"]')!;
    expect(auto.disabled).toBe(true);
    expect(auto.textContent).toContain('Automation');
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

  it('in Binding, Back is "Back: Equipment" and Next is "Next: Zones"', () => {
    const s = draw('binding', level(4, 1, 2));
    expect(s.text('[data-nav="back"]')).toBe('Back: Equipment');
    expect(s.text('[data-nav="next"]')).toBe('Next: Zones');
    s.q<HTMLButtonElement>('[data-nav="next"]')!.click();
    expect(s.onMode).toHaveBeenCalledWith('zones');
    s.q<HTMLButtonElement>('[data-nav="back"]')!.click();
    expect(s.onMode).toHaveBeenCalledWith('equipment');
  });

  it('Zones, the last step, has "Back: Binding" and no Next', () => {
    const s = draw('zones', level(4, 1, 2));
    expect(s.q('[data-mode="zones"]')!.getAttribute('aria-current')).toBe('step');
    expect(s.text('[data-nav="back"]')).toBe('Back: Binding');
    expect(s.q('[data-nav="next"]')).toBeNull();
    s.q<HTMLButtonElement>('[data-nav="back"]')!.click();
    expect(s.onMode).toHaveBeenCalledWith('binding');
  });

  it('labels are sentence case (no all-caps text)', () => {
    const s = draw('binding', level(1, 1, 1));
    const words = (s.host.textContent ?? '').match(/[A-Za-z]{2,}/g) ?? [];
    expect(words.filter(w => w === w.toUpperCase())).toEqual([]);
  });
});
