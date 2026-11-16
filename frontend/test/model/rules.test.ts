import { describe, it, expect } from 'vitest';
import {
  RULE_DELAY_MAX, addRule, deleteRule, isRuleInputDevice, leakTemplate, newRule, ruleActionsFor, ruleCycle, ruleProblems,
  rulesFor, updateRule,
} from '../../src/model/rules';
import { deviceDefaults, emptyLevel, type Device, type DeviceKind, type Rule, type Zone } from '../../src/model/types';

const dev = (id: string, kind: DeviceKind, x = 500, y = 500, extra: object = {}): Device => ({
  id, name: id, invalid: false, placement: { mode: 'free', x, y, rotation: 0 },
  props: { ...deviceDefaults(kind, 'free'), ...extra } as Device['props'],
});
const rule = (id: string, over: Partial<Rule> = {}): Rule => ({ ...newRule(null), id, name: id, inputs: [{ source: { device: 'd' } }], ...over });
const refs = (...ids: string[]) => ids.map(r => ({ source: { rule: r } }));
const exists = () => true;

describe('rules model', () => {
  it('newRule defaults', () => {
    const r = newRule('z1');
    expect(r).toMatchObject({ name: '', zoneId: 'z1', combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] });
    expect(r.id).toBeTruthy();
    expect(newRule(null).zoneId).toBeNull();
    expect(RULE_DELAY_MAX).toBe(3600);
  });

  it('add, update by id, delete', () => {
    const a = rule('a'), b = rule('b');
    let rs = addRule(addRule([], a), b);
    expect(rs.map(r => r.id)).toEqual(['a', 'b']);
    rs = updateRule(rs, { ...a, name: 'A2' });
    expect(rs[0].name).toBe('A2');
    expect(rs[1]).toBe(b);
    expect(deleteRule(rs, 'a')).toEqual([b]);
  });

  it('rulesFor: a zone, none, orphans', () => {
    const rs = [rule('a', { zoneId: 'z1' }), rule('b', { zoneId: null }), rule('c', { zoneId: 'gone' })];
    const ze = (id: string) => id === 'z1';
    expect(rulesFor(rs, 'z1', ze).map(r => r.id)).toEqual(['a']);
    expect(rulesFor(rs, null, ze).map(r => r.id)).toEqual(['b', 'c']);
  });

  it('ruleCycle: A->B->A, self, none', () => {
    const a = rule('a', { inputs: refs('b') }), b = rule('b', { inputs: refs('a') });
    expect(new Set(ruleCycle([b], a))).toEqual(new Set(['a', 'b']));
    expect(ruleCycle([], rule('s', { inputs: refs('s') }))).toEqual(['s']);
    expect(ruleCycle([rule('b')], rule('a', { inputs: refs('b') }))).toBeNull();
    // a cycle not through the candidate is not reported
    expect(ruleCycle([rule('x', { inputs: refs('y') }), rule('y', { inputs: refs('x') })], rule('c', { inputs: refs('x') }))).toBeNull();
  });

  it('ruleProblems', () => {
    const ok = rule('a', { onTrue: [{ device: 'd', do: 'on' }] });
    expect(ruleProblems([ok], ok, exists)).toEqual([]);
    expect(ruleProblems([], rule('a', { name: ' ' }), exists)).toContain('name');
    expect(ruleProblems([], rule('a', { inputs: [] }), exists)).toContain('inputs');
    expect(ruleProblems([], ok, () => false)).toContain('device-missing');
    expect(ruleProblems([], rule('a', { onFalse: [{ device: 'x', do: 'off' }] }), id => id === 'd')).toContain('device-missing');
    expect(ruleProblems([], rule('a', { inputs: refs('nope') }), exists)).toContain('rule-missing');
    const a = rule('a', { inputs: refs('b') });
    expect(ruleProblems([rule('b', { inputs: refs('a') })], a, exists)).toContain('cycle');
    expect(ruleProblems([], rule('a', { onDelay: -1 }), exists)).toContain('delay');
    expect(ruleProblems([], rule('a', { offDelay: 3601 }), exists)).toContain('delay');
    expect(ruleProblems([], rule('a', { onDelay: 1.5 }), exists)).toContain('delay');
  });

  it('leakTemplate in a zone and without', () => {
    const zone: Zone = {
      id: 'z1', name: 'Bath', invalid: false,
      shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
    };
    const level = { ...emptyLevel('L'), zones: [zone], devices: [
      dev('l1', 'leak_sensor', 100, 100), dev('l2', 'leak_sensor', 200, 200), dev('v1', 'valve', 300, 300),
      dev('out', 'leak_sensor', 5000, 5000), dev('v2', 'valve', 6000, 6000),
    ] };
    const r = leakTemplate({ levels: [level] }, 'z1', 'Bath');
    expect(r.name).toBe('Leak Bath -> valve');
    expect(r.combine).toBe('any');
    expect(r.zoneId).toBe('z1');
    expect(r.inputs).toEqual([{ source: { device: 'l1' } }, { source: { device: 'l2' } }]);
    expect(r.onTrue).toEqual([{ device: 'v1', do: 'close' }]);
    const g = leakTemplate({ levels: [level] }, null, null);
    expect(g.name).toBe('Leak -> valve');
    expect(g.inputs).toEqual([]);
    expect(g.onTrue).toEqual([]);
  });

  it('leakTemplate skips devices that opted out of the zone (ruling A1)', () => {
    const zone: Zone = {
      id: 'z1', name: 'Bath', invalid: false,
      shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
    };
    const out = { ...dev('l2', 'leak_sensor', 200, 200), zoneBlacklist: ['z1'] };
    const level = { ...emptyLevel('L'), zones: [zone], devices: [
      dev('l1', 'leak_sensor', 100, 100), out, dev('v1', 'valve', 300, 300), { ...dev('v2', 'valve', 400, 400), zoneBlacklist: ['z1'] },
    ] };
    const r = leakTemplate({ levels: [level] }, 'z1', 'Bath');
    expect(r.inputs).toEqual([{ source: { device: 'l1' } }]);
    expect(r.onTrue).toEqual([{ device: 'v1', do: 'close' }]);
  });

  it('input devices and action targets', () => {
    for (const k of ['leak_sensor', 'motion_sensor', 'ceiling_light', 'wall_light', 'socket', 'exhaust_fan', 'equipment', 'wall_switch', 'valve'] as const)
      expect(isRuleInputDevice(dev('d', k))).toBe(true);
    for (const k of ['smart_button', 'climate_sensor', 'illuminance_sensor'] as const) expect(isRuleInputDevice(dev('d', k))).toBe(false);
    expect(ruleActionsFor(dev('d', 'ceiling_light'))).toEqual(['on', 'off']);
    expect(ruleActionsFor(dev('d', 'socket'))).toEqual(['on', 'off']);
    expect(ruleActionsFor(dev('d', 'valve'))).toEqual(['open', 'close']);
    expect(ruleActionsFor(dev('d', 'equipment'))).toEqual([]);
    expect(ruleActionsFor(dev('d', 'equipment', 0, 0, { controllable: true }))).toEqual(['on', 'off']);
    expect(ruleActionsFor(dev('d', 'leak_sensor'))).toEqual([]);
  });
});
