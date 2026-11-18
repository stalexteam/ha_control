// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import type { HassLike } from '../../src/api';
import { deviceDefaults, type Device, type Plan } from '../../src/model/types';
import { rectRoomLevel } from '../fixtures';
import { $, click, device, mount, pick, press } from './helpers';

const sleep = (over: Partial<Device> = {}): Device => ({
  id: 'v1', name: 'Sleep', invalid: false, placement: { mode: 'free', x: 1500, y: 1500, rotation: 0 },
  props: deviceDefaults('virtual_switch', 'free'), bindings: { control: 'virtual.v1' }, ...over,
});

function seed(devices: Device[]): void {
  const level = { ...rectRoomLevel(4000, 3000, 200), devices, switchesMigrated: true as const };
  const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level] } as Plan;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
}

/** The mock hass with its subscriptions counted by type. */
function counted(virtualStates?: Record<string, 'on' | 'off'>): { hass: HassLike; subscribed: string[] } {
  const base = createMockHass({ virtualStates });
  const subscribed: string[] = [];
  const hass: HassLike = {
    ...base,
    connection: { ...base.connection, subscribeMessage: (cb, msg, opts) => { subscribed.push(String(msg.type)); return base.connection.subscribeMessage!(cb, msg, opts); } },
  };
  return { hass, subscribed };
}

describe('virtual switch in the panel', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Equipment rail has a Virtual switch tool that places one bound to its own entity', async () => {
    seed([]);
    const el = await mount();
    await press(el, '.top button[data-mode="equipment"]');
    expect($(el, 'button[data-tool="virtual_switch"]').textContent!.trim()).toBe('Virtual switch');
    await press(el, 'button[data-tool="virtual_switch"]');
    click(el, 2000, 1500);
    await el.updateComplete;
    const d = el.level!.devices[0];
    expect(d.props.kind).toBe('virtual_switch');
    expect(d.name).toBe('Virtual switch 1');
    expect(d.placement).toMatchObject({ mode: 'free' });
    expect(d.bindings).toEqual({ control: `virtual.${d.id}` });
  });

  it('"New virtual switch" adds one that is not on the plan, listed under Not on the plan', async () => {
    seed([]);
    const el = await mount();
    await press(el, '.top button[data-mode="equipment"]');
    await press(el, '[data-action="new-virtual-switch"]');
    const d = el.level!.devices[0];
    expect(d).toMatchObject({ name: 'Virtual switch 1', placement: { mode: 'none' }, props: { kind: 'virtual_switch' } });
    expect(d.bindings).toEqual({ control: `virtual.${d.id}` });
    expect(el.selection).toEqual({ kind: 'device', id: d.id });
    expect($(el, '.props h4').textContent!.trim()).toBe('Virtual switch');
    el.selection = null;
    await el.updateComplete;
    await press(el, '[data-action="new-virtual-switch"]');
    expect(el.level!.devices.map(x => x.name)).toEqual(['Virtual switch 1', 'Virtual switch 2']);
  });

  it('a stored virtual switch with another binding is repaired on open', async () => {
    seed([sleep({ bindings: { control: 'switch.x', power: 'sensor.p' } })]);
    const el = await mount();
    expect(device(el, 'v1').bindings).toEqual({ control: 'virtual.v1' });
  });

  it('Binding: no binding fields, its live state from the integration, the live look', async () => {
    seed([sleep()]);
    const { hass, subscribed } = counted({ v1: 'on' });
    const el = await mount(hass);
    el.setMode('binding');
    await vi.waitFor(() => expect(el.virtualFeed.ready).toBe(true));
    await el.updateComplete;
    await pick(el, 'v1');
    expect(el.shadowRoot!.querySelector('.props ps-entity-combo')).toBeNull();
    expect(el.shadowRoot!.querySelector('.props .role')).toBeNull();
    expect($(el, '.props [data-field="virtual-state"]').textContent!.trim()).toBe('State: on');
    expect(subscribed.filter(s => s === 'plan_studio/virtual/subscribe')).toHaveLength(1);
    // every reader of the states sees it as an entity
    expect((el.liveStates as Record<string, { state: string }>)['virtual.v1'].state).toBe('on');
    expect(el.bindStatus(device(el, 'v1'))).toBe('bound');
    // the symbol is drawn like a socket's: a filled shape while on
    expect(el.shadowRoot!.querySelector('g.device[data-id="v1"] .icon')).not.toBeNull();
  });

  it('is watched only while the plan has a virtual switch', async () => {
    seed([]);
    const { hass, subscribed } = counted({});
    const el = await mount(hass);
    el.setMode('binding');
    await el.updateComplete;
    expect(subscribed).not.toContain('plan_studio/virtual/subscribe');
    el.commit({ ...el.level!, devices: [sleep({ placement: { mode: 'none' } })] });
    await el.updateComplete;
    expect(subscribed.filter(s => s === 'plan_studio/virtual/subscribe')).toHaveLength(1);
    // the rule dialogs and the Automation step read it too
    el.setMode('automation');
    await el.updateComplete;
    expect(subscribed.filter(s => s === 'plan_studio/virtual/subscribe')).toHaveLength(1);
    el.commit({ ...el.level!, devices: [] });
    await el.updateComplete;
    expect(el.virtualFeed.stateOf('v1')).toBeUndefined();
  });

  it('the rule dialog refuses a rule that switches a virtual switch it reads, with the integration words', async () => {
    seed([sleep({ placement: { mode: 'none' } })]);
    const plan = JSON.parse(localStorage.getItem(STORAGE_KEY)!).plans.P1 as Plan;
    plan.rules = [{ id: 'r1', name: 'Loop', zoneId: null, combine: 'any', inputs: [{ source: { device: 'v1' } }], onDelay: 0, offDelay: 0,
      onTrue: [{ device: 'v1', do: 'off' }], onFalse: [] }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
    const el = await mount();
    el.setMode('automation');
    await el.updateComplete;
    el.openRuleDialog('condition', 'r1');
    await el.updateComplete;
    const items = [...el.shadowRoot!.querySelectorAll('.rule-backdrop .rproblems li')].map(x => x.textContent);
    expect(items).toEqual(['a rule must not switch a virtual switch it reads as an input']);
    expect($<HTMLButtonElement>(el, '.rule-backdrop button[data-action="rule-ok"]').disabled).toBe(true);
  });
});
