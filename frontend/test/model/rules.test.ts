import { describe, it, expect } from 'vitest';
import {
  RULE_DELAY_MAX, addRule, deleteRule, isRuleInputDevice, leakTemplate, newRule, outsideLightTemplate, ruleRefs, timerTemplate, ruleActionsFor, ruleCycle, ruleProblems,
  rulesFor, ruleUsers, updateRule,
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

  it('an action its device cannot take is a problem', () => {
    const valve = dev('v', 'valve');
    const acts = (id: string) => (id === 'v' ? ruleActionsFor(valve) : undefined);
    const ok = rule('a', { onTrue: [{ device: 'v', do: 'close' }] });
    expect(ruleProblems([], ok, exists, acts)).toEqual([]);
    const bad = rule('a', { onFalse: [{ device: 'v', do: 'on' }] });
    expect(ruleProblems([], bad, exists, acts)).toEqual(['action']);
    expect(ruleProblems([], bad, exists)).toEqual([]); // no lookup, no check
    const cleared = rule('a', { onTrue: [{ device: 'v', do: 'close' }] });
    expect(ruleProblems([], cleared, exists, () => [])).toEqual(['action']);
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

  const inp = (source: object, extra: object = {}) => ({ source, ...extra }) as Rule['inputs'][number];
  const probs = (i: Rule['inputs'][number], rules: Rule[] = []) => ruleProblems(rules, rule('a', { inputs: [i] }), exists);
  const held = (over: object = {}) => ({ held: { sources: [{ device: 'd' }], state: 'any', seconds: 1800, ...over } });

  it('light input bounds and sensor kind', () => {
    expect(probs(inp({ light: 'd', below: 10, hysteresis: 5 }))).toEqual([]);
    expect(probs(inp({ light: 'd', below: 10, hysteresis: 0 }))).toEqual([]);
    expect(probs(inp({ light: 'd', below: 0, hysteresis: 5 }))).toEqual(['light']);
    expect(probs(inp({ light: 'd', below: 10, hysteresis: 5, unknownDark: true }))).toEqual([]);
    expect(probs(inp({ light: 'd', below: 10, hysteresis: 5, unknownDark: false as unknown as true }))).toEqual(['light']);
    expect(probs(inp({ light: 'd', below: 10, hysteresis: -1 }))).toEqual(['light']);
    expect(probs(inp({ light: 'd', below: NaN, hysteresis: 1 }))).toEqual(['light']);
    expect(ruleProblems([], rule('a', { inputs: [inp({ light: 'x', below: 10, hysteresis: 1 })] }), () => false)).toContain('device-missing');
    const r = rule('a', { inputs: [inp({ light: 'd', below: 10, hysteresis: 1 })] });
    expect(ruleProblems([], r, exists, undefined, () => false)).toEqual(['device-missing']);
    expect(ruleProblems([], r, exists, undefined, id => id === 'd')).toEqual([]);
  });

  it('sun and time inputs', () => {
    expect(probs(inp({ sun: true }, { not: true }))).toEqual([]);
    expect(probs(inp({ time: { from: '17:00', to: '01:00' } }))).toEqual([]);
    expect(probs(inp({ time: { from: '00:00', to: '23:59' } }))).toEqual([]);
    for (const t of [{ from: '17:00', to: '17:00' }, { from: '24:00', to: '01:00' }, { from: '7:00', to: '08:00' }, { from: '10:60', to: '11:00' }, { from: '10:00', to: 5 }])
      expect(probs(inp({ time: t }))).toEqual(['time']);
  });

  it('held input bounds and sources', () => {
    expect(probs(inp(held()))).toEqual([]);
    expect(probs(inp(held({ seconds: 1 })))).toEqual([]);
    expect(probs(inp(held({ seconds: 86400, state: 'off' })))).toEqual([]);
    for (const over of [{ seconds: 0 }, { seconds: 86401 }, { seconds: 1.5 }, { state: 'x' }, { sources: [] }])
      expect(probs(inp(held(over)))).toEqual(['held']);
    expect(ruleProblems([], rule('a', { inputs: [inp(held())] }), () => false)).toContain('device-missing');
    expect(probs(inp(held({ sources: [{ rule: 'nope' }] })))).toContain('rule-missing');
    expect(probs(inp(held({ sources: [{ rule: 'b' }] })), [rule('b')])).toEqual([]);
  });

  it('gate is validated like an input', () => {
    const g = (gate: Rule['gate']) => ruleProblems([], rule('a', { gate }), exists);
    expect(g({ source: { device: 'd' }, not: true })).toEqual([]);
    expect(g({ source: { sun: true } })).toEqual([]);
    expect(g({ source: { time: { from: '1:00', to: '2:00' } } })).toEqual(['time']);
    expect(g({ source: { light: 'd', below: 0, hysteresis: 0 } })).toEqual(['light']);
    expect(g(inp(held({ seconds: 0 })))).toEqual(['held']);
    expect(ruleProblems([], rule('a', { gate: { source: { device: 'x' } } }), () => false)).toContain('device-missing');
    expect(ruleProblems([], rule('a', { gate: { source: { rule: 'nope' } } }), exists)).toContain('rule-missing');
  });

  it('ruleRefs and cycles through gate and held', () => {
    const a = rule('a', { inputs: [...refs('i'), inp(held({ sources: [{ device: 'd' }, { rule: 'h' }] }))], gate: { source: { rule: 'g' } } });
    expect(ruleRefs(a).sort()).toEqual(['g', 'h', 'i']);
    expect(ruleRefs(rule('b'))).toEqual([]);
    const viaGate = rule('b', { gate: { source: { rule: 'a' } } });
    expect(ruleCycle([viaGate], rule('a', { inputs: refs('b') }))).not.toBeNull();
    const viaHeld = rule('b', { inputs: [inp(held({ sources: [{ rule: 'a' }] }))] });
    expect(new Set(ruleCycle([viaHeld], rule('a', { inputs: refs('b') })))).toEqual(new Set(['a', 'b']));
    expect(ruleProblems([viaGate], rule('a', { inputs: refs('b') }), exists)).toContain('cycle');
    expect(ruleUsers([viaGate, viaHeld], 'a').map(r => r.id)).toEqual(['b', 'b']);
  });

  it('timerTemplate', () => {
    const plan = { levels: [] };
    const t = timerTemplate(plan, 'z1', 'd1', 'Pump');
    expect(t).toMatchObject({
      name: 'Pump unchanged 30 min', zoneId: 'z1', combine: 'any', onTrue: [], onFalse: [],
      inputs: [{ source: { held: { sources: [{ device: 'd1' }], state: 'any', seconds: 1800 } } }],
    });
    expect(t.gate).toBeUndefined();
    expect(timerTemplate(plan, null, null, '').inputs[0].source).toEqual({ held: { sources: [], state: 'any', seconds: 1800 } });
  });

  it('outsideLightTemplate picks the first participating illuminance sensor of the zone', () => {
    const zone: Zone = {
      id: 'z1', name: 'Yard', invalid: false,
      shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
    };
    const lvl = { ...emptyLevel('l1'), zones: [zone],
      devices: [dev('far', 'illuminance_sensor', 5000, 5000), { ...dev('s1', 'illuminance_sensor'), zoneBlacklist: ['z1'] }, dev('s2', 'illuminance_sensor', 600, 600)] };
    const r = outsideLightTemplate({ levels: [lvl] }, 'z1', 'Yard');
    expect(r.name).toBe('Outside light Yard');
    expect(r.combine).toBe('all');
    expect(r.inputs).toEqual([
      { source: { light: 's2', below: 10, hysteresis: 5, unknownDark: true } },
      { source: { sun: true } },
      { source: { time: { from: '17:00', to: '01:00' } } },
    ]);
    expect(r.gate).toEqual({ source: { held: { sources: [], state: 'any', seconds: 1800 } } });
    expect(r.onTrue).toEqual([]);
    const e = outsideLightTemplate({ levels: [lvl] }, null, null);
    expect(e.name).toBe('Outside light');
    expect(e.inputs[0].source).toEqual({ light: '', below: 10, hysteresis: 5, unknownDark: true });
  });
});
