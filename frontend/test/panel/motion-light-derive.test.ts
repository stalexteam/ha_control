// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';

const spy = vi.hoisted(() => ({ calls: 0 }));
vi.mock('../../src/model/neighbours', async importActual => {
  const actual = await importActual<typeof import('../../src/model/neighbours')>();
  return { ...actual, planNeighbours: (...a: Parameters<typeof actual.planNeighbours>) => { spy.calls++; return actual.planNeighbours(...a); } };
});

import { $, mount, pickAutomation } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { Plan } from '../../src/model/types';

describe('Light motion control dialog derives neighbours only with presence', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); spy.calls = 0; });

  it('no derivation while "Keep on while someone is present" is off; ticking derives', async () => {
    const plan: Plan = structuredClone(SCENES.motionlight.plans[0]);
    plan.rules = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
    const el = await mount(createMockHass({ rulesFrame: SCENES.motionlight.rulesFrame }));
    el.setMode('automation');
    await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
    el.selection = { kind: 'zone', id: 'r0' };
    await el.updateComplete;
    await pickAutomation(el, 'motionLight');
    el.requestUpdate();
    await el.updateComplete;
    expect(spy.calls).toBe(0);
    const box = $<HTMLInputElement>(el, '.rule-backdrop [data-field="motionlight-presence"]');
    box.checked = true;
    box.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(spy.calls).toBeGreaterThan(0);
  });
});
