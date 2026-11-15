import { expect, vi } from 'vitest';
import '../../src/panel/plan-studio-panel';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import type { Plan } from '../../src/model/types';
import type { HassLike } from '../../src/api';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';

export function stored(): Plan[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? Object.values((JSON.parse(raw) as { plans: Record<string, Plan> }).plans) : [];
}

export async function mount(hass: HassLike = createMockHass()): Promise<PlanStudioPanel> {
  const el = document.createElement('plan-studio-panel');
  el.hass = hass;
  document.body.appendChild(el);
  await vi.waitFor(() => expect(el.plan).not.toBeNull());
  await el.updateComplete;
  return el;
}

export const $ = <T extends Element>(el: PlanStudioPanel, sel: string): T => {
  const found = el.shadowRoot!.querySelector<T>(sel);
  if (!found) throw new Error(`not found: ${sel}`);
  return found;
};

/** happy-dom reports an identity screen CTM, so client coordinates equal plan millimetres. */
export function pointer(el: PlanStudioPanel, type: string, x: number, y: number, button = 0): void {
  $(el, 'svg.plan').dispatchEvent(new PointerEvent(type, { button, clientX: x, clientY: y, bubbles: true, composed: true }));
}

export function click(el: PlanStudioPanel, x: number, y: number): void {
  pointer(el, 'pointerdown', x, y);
  pointer(el, 'pointerup', x, y);
}

export function key(el: PlanStudioPanel, type: 'keydown' | 'keyup', k: string, init: KeyboardEventInit = {}): void {
  el.dispatchEvent(new KeyboardEvent(type, { key: k, bubbles: true, composed: true, ...init }));
}

/** Box from (100,100) to (500,400), inner measure, 400 walls: axis rectangle (-100,-100)-(700,600). */
export async function drawBox(el: PlanStudioPanel): Promise<void> {
  $<HTMLButtonElement>(el, 'button[data-tool="box"]').click();
  await el.updateComplete;
  expect(el.wallType).toBe('bearing');
  expect(el.thickness).toBe(400);
  click(el, 100, 100);
  click(el, 500, 400);
  await el.updateComplete;
}

export async function pressSave(el: PlanStudioPanel): Promise<void> {
  $<HTMLButtonElement>(el, 'button[data-action="save"]').click();
  await vi.waitFor(() => expect(el.save.state).not.toBe('saving'));
  await el.updateComplete;
}
