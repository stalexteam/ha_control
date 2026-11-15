import { expect, vi } from 'vitest';
import '../../src/panel/plan-studio-panel';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import type { Device, Plan } from '../../src/model/types';
import type { HassLike } from '../../src/api';
import type { EntityCombo } from '../../src/binding/entity-combo';
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

/** Registry answers of a binding-step HA mock: rejected while `on`; held until `gate` resolves when one is set. */
export interface Fail { on: boolean; gate?: Promise<void> }

/** Mock hass with live `states`; the registry commands are counted and answered from `registry`, or rejected while `fail.on`. */
export function registryHass(states: Record<string, unknown>, registry: Record<string, unknown>, fail: Fail = { on: false }):
{ hass: HassLike; calls: string[] } {
  const base = createMockHass();
  const calls: string[] = [];
  const hass: HassLike = {
    ...base,
    states,
    connection: {
      async sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
        const type = String(msg.type);
        if (!(type in registry)) return base.connection.sendMessagePromise<T>(msg);
        calls.push(type);
        await fail.gate;
        if (fail.on) throw { code: 'unauthorized', message: 'Unauthorized' };
        return structuredClone(registry[type]) as T;
      },
    },
  };
  return { hass, calls };
}

export async function press(el: PlanStudioPanel, sel: string): Promise<void> {
  $<HTMLButtonElement>(el, sel).click();
  await el.updateComplete;
}

/** The current model of device `id`. */
export const device = (el: PlanStudioPanel, id: string): Device => el.history!.current.devices.find(d => d.id === id)!;
export const combo = (el: PlanStudioPanel, role: string) => $<EntityCombo>(el, `.props ps-entity-combo[data-role="${role}"]`);

/** Binding step: selects a device through the list (All filter). */
export async function pick(el: PlanStudioPanel, id: string): Promise<void> {
  await press(el, '.blist [data-filter="all"]');
  await press(el, `.blist .brow[data-id="${id}"]`);
  expect(el.selection).toEqual({ kind: 'device', id });
}

/** Binding step: opens a role's combobox and clicks the row of `eid`. */
export async function choose(el: PlanStudioPanel, role: string, eid: string): Promise<void> {
  const c = combo(el, role);
  c.shadowRoot!.querySelector<HTMLElement>('.cbox')!.click();
  await c.updateComplete;
  const row = c.shadowRoot!.querySelector<HTMLElement>(`.opt[data-id="${eid}"]`);
  if (!row) throw new Error(`no row ${eid}`);
  row.click();
  await c.updateComplete;
  await el.updateComplete;
}

export const undo = async (el: PlanStudioPanel): Promise<void> => {
  key(el, 'keydown', 'z', { ctrlKey: true, code: 'KeyZ' });
  await el.updateComplete;
};
export const redo = async (el: PlanStudioPanel): Promise<void> => {
  key(el, 'keydown', 'y', { ctrlKey: true, code: 'KeyY' });
  await el.updateComplete;
};
