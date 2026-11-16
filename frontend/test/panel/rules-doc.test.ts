// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { drawBox, mount, pressSave, stored, undo } from './helpers';
import { newRule } from '../../src/model/rules';

describe('rules in the plan document', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('a plan without rules saves without the key', async () => {
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    expect('rules' in stored()[0]).toBe(false);
    expect(el.rules).toEqual([]);
  });

  it('rules survive save and reopen, in the same undo history', async () => {
    const el = await mount();
    const r = { ...newRule(null), name: 'R', inputs: [{ source: { device: 'd' } }] };
    el.commitRules([r]);
    expect(el.save.dirty).toBe(true);
    await pressSave(el);
    expect(stored()[0].rules).toEqual([r]);
    el.session.adopt(stored()[0]);
    expect(el.rules).toEqual([r]);
    el.commitRules([]);
    expect(el.history!.current.rules).toBeUndefined();
    await undo(el);
    expect(el.rules).toEqual([r]);
    expect(el.session.currentPlan().rules).toEqual([r]);
  });
});
