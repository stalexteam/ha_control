import { describe, it, expect } from 'vitest';
import {
  RULE_DELAY_MAX, boilerTemplate, buttonHasAuto, isBoilerDevice, isBoilerRule, isVentRule, ventTemplate, addRule, deleteRule, isLeakRule, isTimedRule, timedTemplate, isRuleInputDevice, leakProtectionTemplate, newRule, isOutsideRule, outsideTemplate, beurerTemplate, isBeurerRule, BEURER_DEFAULTS, controlTemplate, controlActionsFor, migrateControl, isControlRule, MOTION_LIGHT_DEFAULTS, isMotionLightRule, motionLightTemplate, ruleRefs, timerTemplate, ruleActionsFor, ruleCycle, ruleProblems,
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
const leakRule = (): Rule => ({ ...newRule(null), id: 'k', name: 'Leak', inputs: [], leak: { sensors: ['s1'], valves: ['v1'] } });

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

  it('daylight source: problems, sensor check, no refs', () => {
    const dl = (over: object = {}, not?: true): Rule => rule('a', { inputs: [{ source: { daylight: 's', is: 'night', ...over } as never, ...(not ? { not } : {}) }] });
    expect(ruleProblems([], dl(), exists)).toEqual([]);
    for (const is of ['night', 'dark', 'day']) expect(ruleProblems([], dl({ is }), exists)).toEqual([]);
    expect(ruleProblems([], dl({ is: 'twilight' }), exists)).toContain('daylight');
    expect(ruleProblems([], dl({}, true), exists)).toContain('daylight');
    expect(ruleProblems([], dl(), exists, undefined, () => false)).toContain('device-missing');
    expect(ruleProblems([], dl(), id => id !== 's')).toContain('device-missing');
    expect(ruleRefs(dl())).toEqual([]);
    // the old light source is still valid
    const old = rule('a', { inputs: [{ source: { light: 's', below: 10, hysteresis: 5, unknownDark: true } }] });
    expect(ruleProblems([], old, exists)).toEqual([]);
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

  describe('leak protection', () => {
    const zone: Zone = {
      id: 'z1', name: 'Bath', invalid: false,
      shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
    };
    const lvl = (devices: Device[]) => ({ levels: [{ ...emptyLevel('L'), zones: [zone], devices }] });
    const leak = (over: Partial<Rule> = {}, l: Partial<NonNullable<Rule['leak']>> = {}): Rule => ({
      ...newRule(null), id: 'k', name: 'Leak', inputs: [], leak: { sensors: ['s1', 's2'], valves: ['v1'], ...l }, ...over,
    });
    const probs = (r: Rule, ...p: (((id: string) => boolean) | undefined)[]) => ruleProblems([r], r, exists, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ...p);

    it('template: the zone participating sensors and valves, named by zone', () => {
      const r = leakProtectionTemplate(lvl([
        dev('s1', 'leak_sensor', 100, 100), dev('s2', 'leak_sensor', 200, 200), dev('v1', 'valve', 300, 300), dev('v2', 'valve', 400, 400),
        dev('out', 'leak_sensor', 5000, 5000), dev('vo', 'valve', 6000, 6000), dev('m', 'motion_sensor', 500, 500),
      ]), 'z1', 'Bath');
      expect(r.name).toBe('Leak protection Bath');
      expect(r.zoneId).toBe('z1');
      expect(r.leak).toEqual({ sensors: ['s1', 's2'], valves: ['v1', 'v2'] });
      expect(r).toMatchObject({ inputs: [], combine: 'any', onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] });
      expect(isLeakRule(r)).toBe(true);
      expect(isLeakRule(rule('a'))).toBe(false);
    });
    it('template skips devices that opted out of the zone; none or no zone gives empty lists', () => {
      const out = { ...dev('s2', 'leak_sensor', 200, 200), zoneBlacklist: ['z1'] };
      const r = leakProtectionTemplate(lvl([dev('s1', 'leak_sensor', 100, 100), out, { ...dev('v2', 'valve', 400, 400), zoneBlacklist: ['z1'] }]), 'z1', 'Bath');
      expect(r.leak).toEqual({ sensors: ['s1'], valves: [] });
      const g = leakProtectionTemplate(lvl([dev('s1', 'leak_sensor', 100, 100)]), null, null);
      expect(g.name).toBe('Leak protection');
      expect(g.leak).toEqual({ sensors: [], valves: [] });
    });
    it('valid rule', () => {
      expect(probs(leak())).toEqual([]);
      expect(probs(leak(), () => true, () => true)).toEqual([]);
    });
    it('shape and bounds', () => {
      for (const l of [{ sensors: [] }, { valves: [] }, { sensors: ['s1', 's1'] }, { valves: ['v1', 'v1'] }, { sensors: [''] }, { valves: [''] }])
        expect(probs(leak({}, l)), JSON.stringify(l)).toEqual(['leak']);
      for (const o of [{ inputs: [{ source: { device: 'x' } }] }, { combine: 'all' as const }, { onDelay: 1 }, { offDelay: 1 },
        { gate: { source: { sun: true as const } } }, { onTrue: [{ device: 'f', do: 'close' as const }] }, { onFalse: [{ device: 'f', do: 'open' as const }] },
        { vent: { sensor: 'a', than: 'b', above: 9, below: 5 } }, { boiler: { device: 'd', button: 'b' } }])
        expect(probs(leak(o)), JSON.stringify(o)).toContain('leak');
    });
    it('a sensor or valve that is not one, or is missing, is device-missing', () => {
      expect(probs(leak(), id => id !== 's2')).toEqual(['device-missing']);
      expect(probs(leak(), undefined, id => id !== 'v1')).toEqual(['device-missing']);
      expect(ruleProblems([leak()], leak(), id => id !== 'v1')).toEqual(['device-missing']);
    });
    it('an old condition rule from the former template stays valid', () => {
      const old = rule('o', { inputs: [{ source: { device: 'd' } }], onTrue: [{ device: 'v', do: 'close' }] });
      expect(ruleProblems([old], old, exists)).toEqual([]);
    });
  });

  describe('outside light', () => {
    const zone: Zone = {
      id: 'z1', name: 'Yard', invalid: false,
      shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
    };
    const lvl = (devices: Device[]) => ({ levels: [{ ...emptyLevel('L'), zones: [zone], devices }] });
    const outside = (over: Partial<Rule> = {}, o: Partial<NonNullable<Rule['outside']>> = {}): Rule => ({
      ...newRule(null), id: 'o', name: 'O', inputs: [], outside: { light: 'l', sensor: 's', pause: 30, ...o }, ...over,
    });
    const probs = (r: Rule, ...p: (((id: string) => boolean) | undefined)[]) => ruleProblems([r], r, exists, undefined, ...p);

    it('template: the zone single light and the plan single illuminance sensor, pause 30', () => {
      const r = outsideTemplate(lvl([dev('l', 'ceiling_light', 100, 100), dev('s', 'illuminance_sensor', 5000, 5000), dev('m', 'motion_sensor', 300, 300)]), 'z1', 'Yard');
      expect(r.name).toBe('Outside light Yard');
      expect(r.outside).toEqual({ light: 'l', sensor: 's', noDataNight: true, afterSunset: true, pause: 30 });
      expect(r).toMatchObject({ zoneId: 'z1', inputs: [], onTrue: [], onFalse: [] });
      expect(isOutsideRule(r)).toBe(true);
      expect(isOutsideRule(rule('a'))).toBe(false);
    });
    it('template leaves ambiguous or missing picks empty', () => {
      const r = outsideTemplate(lvl([dev('l', 'ceiling_light', 100, 100), dev('w', 'wall_light', 200, 200), dev('s', 'illuminance_sensor', 5000, 5000), dev('s2', 'illuminance_sensor', 6000, 6000)]), 'z1', 'Yard');
      expect(r.outside).toMatchObject({ light: '', sensor: '', pause: 30 });
      const g = outsideTemplate(lvl([dev('l', 'ceiling_light', 100, 100)]), null, null);
      expect(g.name).toBe('Outside light');
      expect(g.outside).toMatchObject({ light: '', sensor: '' });
    });
    it('valid rule and bounds', () => {
      expect(probs(outside())).toEqual([]);
      expect(probs(outside({}, { pause: 0 }))).toEqual([]);
      expect(probs(outside({}, { pause: 1440, noDataNight: true, afterSunset: true, window: { from: '18:00', to: '06:00' } }))).toEqual([]);
    });
    it('shape and bounds', () => {
      for (const o of [{ pause: -1 }, { pause: 1441 }, { pause: 1.5 }, { pause: NaN }, { light: '' }, { sensor: '' }, { sensor: 'l' },
        { noDataNight: false as unknown as true }, { afterSunset: false as unknown as true },
        { window: { from: '18:00', to: '18:00' } }, { window: { from: '24:00', to: '06:00' } }, { window: { from: '1:00', to: '06:00' } }])
        expect(probs(outside({}, o)), JSON.stringify(o)).toEqual(['outside']);
      for (const o of [{ inputs: [{ source: { device: 'x' } }] }, { combine: 'all' as const }, { onDelay: 1 }, { offDelay: 1 },
        { gate: { source: { sun: true as const } } }, { onTrue: [{ device: 'f', do: 'on' as const }] }, { onFalse: [{ device: 'f', do: 'off' as const }] },
        { vent: { sensor: 'a', than: 'b', above: 9, below: 5 } }, { boiler: { device: 'd', button: 'b' } }, { leak: { sensors: ['s'], valves: ['v'] } },
        { timed: { button: 'b', device: 'd', minutes: 5 } }])
        expect(probs(outside(o)), JSON.stringify(o)).toContain('outside');
    });
    it('a light or sensor that is not one, or is missing, is device-missing', () => {
      expect(probs(outside(), id => id !== 's')).toEqual(['device-missing']);
      expect(probs(outside(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, id => id !== 'l')).toEqual(['device-missing']);
      expect(ruleProblems([outside()], outside(), id => id !== 'l')).toEqual(['device-missing']);
    });
    it('other kinds reject an outside key', () => {
      const o = { light: 'l', sensor: 's', pause: 5 };
      expect(ruleProblems([], { ...leakRule(), outside: o }, exists)).toContain('leak');
      expect(ruleProblems([], { ...newRule(null), id: 't', name: 'T', inputs: [], timed: { button: 'b', device: 'd', minutes: 5 }, outside: o }, exists)).toContain('timed');
    });
  });

  describe('beurer rule', () => {
    const beurer = (over: Partial<Rule> = {}, b: Partial<NonNullable<Rule['beurer']>> = {}): Rule => ({
      ...newRule(null), id: 'b', name: 'B', offDelay: 60, beurer: { heater: 'h', source: 'p', above: 200, keep: 10, every: 30, ...b }, ...over,
    });
    const probs = (r: Rule, heater?: (id: string) => boolean, source?: (id: string) => boolean) =>
      ruleProblems([r], r, exists, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, heater, source);

    it('template and defaults', () => {
      const t = beurerTemplate(null, null);
      expect(t.name).toBe('Beurer heater');
      expect(beurerTemplate('z1', 'WC').name).toBe('Beurer heater WC');
      expect(beurerTemplate('z1', 'WC').zoneId).toBe('z1');
      expect(t).toMatchObject({ inputs: [], onTrue: [], onFalse: [], combine: 'any', onDelay: 0, offDelay: 60, beurer: { heater: '', source: '', above: 200, keep: 10, every: 30 } });
      expect(BEURER_DEFAULTS).toEqual({ above: 200, offDelay: 60, keep: 10, every: 30 });
      expect(isBeurerRule(t)).toBe(true);
      expect(isBeurerRule(rule('a'))).toBe(false);
      expect(ruleProblems([t], t, exists)).toEqual(['beurer']);
      const ok = { ...t, beurer: { ...t.beurer!, heater: 'h', source: 'p' } };
      expect(ruleProblems([ok], ok, exists)).toEqual([]);
      expect(ruleProblems([ok], ok, () => false)).toEqual(['device-missing']);
    });
    it('a valid rule has no problems and never the inputs problem', () => {
      expect(probs(beurer())).toEqual([]);
      expect(probs(beurer({ offDelay: 0 }, { keep: 0, every: 0 }))).toEqual([]);
      expect(probs(beurer({ offDelay: 3600 }, { keep: 1440, every: 1440, above: 0.5 }))).toEqual([]);
    });
    it('shape and bounds', () => {
      for (const b of [{ heater: '' }, { source: '' }, { source: 'h' }, { above: 0 }, { above: -1 }, { above: NaN },
        { keep: 1.5 }, { keep: -1 }, { keep: 1441 }, { every: 1.5 }, { every: -1 }, { every: 1441 }])
        expect(probs(beurer({}, b)), JSON.stringify(b)).toContain('beurer');
      for (const o of [{ inputs: [{ source: { device: 'x' } }] }, { combine: 'all' as const }, { onDelay: 5 },
        { onTrue: [{ device: 'f', do: 'on' as const }] }, { onFalse: [{ device: 'f', do: 'off' as const }] },
        { gate: { source: { sun: true as const } } },
        { vent: { sensor: 'a', than: 'b', above: 9, below: 5 } }, { boiler: { device: 'd', button: 'b' } }, { leak: { sensors: ['s'], valves: ['v'] } },
        { timed: { button: 'b', device: 'd', minutes: 5 } }, { outside: { light: 'l', sensor: 's', pause: 5 } }])
        expect(probs(beurer(o)), JSON.stringify(o)).toContain('beurer');
    });
    it('offDelay out of range stays the delay problem', () => {
      expect(probs(beurer({ offDelay: 3601 }))).toContain('delay');
    });
    it('a missing heater or power source is device-missing', () => {
      expect(probs(beurer(), id => id !== 'h')).toEqual(['device-missing']);
      expect(probs(beurer(), undefined, id => id !== 'p')).toEqual(['device-missing']);
    });
    it('other kinds reject a beurer key', () => {
      const b = { heater: 'h', source: 'p', above: 200, keep: 10, every: 30 };
      expect(ruleProblems([], { ...newRule(null), id: 'v', name: 'V', vent: { sensor: 'a', than: 'b', above: 9, below: 5 }, onTrue: [{ device: 'f', do: 'on' }], onFalse: [{ device: 'f', do: 'off' }], beurer: b }, exists)).toContain('vent');
      expect(ruleProblems([], { ...newRule(null), id: 'k', name: 'K', boiler: { device: 'd', button: 'b' }, beurer: b }, exists)).toContain('boiler');
      expect(ruleProblems([], { ...leakRule(), beurer: b }, exists)).toContain('leak');
      expect(ruleProblems([], { ...newRule(null), id: 't', name: 'T', timed: { button: 'b', device: 'd', minutes: 5 }, beurer: b }, exists)).toContain('timed');
      expect(ruleProblems([], { ...newRule(null), id: 'o', name: 'O', outside: { light: 'l', sensor: 's', pause: 5 }, beurer: b }, exists)).toContain('outside');
    });
  });

  describe('motion light rule', () => {
    const zone: Zone = {
      id: 'z1', name: 'Hall', invalid: false,
      shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
    };
    const lvl = (devices: Device[]) => ({ levels: [{ ...emptyLevel('L'), zones: [zone], devices }] });
    const ctlBody = { sources: [{ button: 'b' }], on: [], off: [], toggle: [{ device: 't', do: 'toggle' as const }] };
    const ml = (over: Partial<Rule> = {}, m: Partial<NonNullable<Rule['motionLight']>> = {}): Rule => ({
      ...newRule(null), id: 'm', name: 'M', offDelay: 180,
      motionLight: { light: 'l', sensors: ['s1', 's2'], daylight: { sensor: 'ls', is: 'dark' }, minOn: 0, buttons: ['b1'], autoAfter: 0, ...m }, ...over,
    });
    const probs = (r: Rule, p: { light?: (id: string) => boolean; sensor?: (id: string) => boolean; button?: (id: string) => boolean; lux?: (id: string) => boolean } = {}) =>
      ruleProblems([r], r, exists, undefined, p.lux, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, p.light, p.sensor, p.button);
    const noDay = (r: Rule): Rule => { const { daylight: _d, ...rest } = r.motionLight!; return { ...r, motionLight: rest }; };

    it('defaults and the rule test', () => {
      expect(MOTION_LIGHT_DEFAULTS).toEqual({ offDelay: 180, minOn: 0, autoAfter: 0, is: 'dark' });
      expect(isMotionLightRule(ml())).toBe(true);
      expect(isMotionLightRule(rule('a'))).toBe(false);
    });
    it('a valid rule has no problems and never the inputs problem', () => {
      expect(probs(ml())).toEqual([]);
      expect(probs(noDay(ml()))).toEqual([]);
      expect(probs(ml({}, { buttons: [] }))).toEqual([]);
      expect(probs(ml({}, { sensors: [] }))).toEqual([]);
      expect(probs(noDay(ml({}, { sensors: [], buttons: [] })))).toEqual([]); // a light only
      expect(probs(ml({ offDelay: 0 }, { minOn: 3600, autoAfter: 1440, daylight: { sensor: 'ls', is: 'night' } }))).toEqual([]);
      expect(probs(ml({ offDelay: 3600 }))).toEqual([]);
    });
    it('shape, numbers and duplicates', () => {
      for (const m of [{ light: '' }, { sensors: ['s1', 's1'] }, { sensors: ['s1', ''] }, { buttons: ['b1', 'b1'] }, { buttons: [''] },
        { sensors: ['l', 's1'] }, { buttons: ['l'] },
        { daylight: { sensor: 'ls', is: 'day' as unknown as 'dark' } }, { daylight: { sensor: '', is: 'dark' as const } },
        { minOn: -1 }, { minOn: 1.5 }, { minOn: 3601 }, { autoAfter: -1 }, { autoAfter: 1.5 }, { autoAfter: 1441 }])
        expect(probs(ml({}, m)), JSON.stringify(m)).toContain('motionLight');
      for (const o of [{ inputs: [{ source: { device: 'x' } }] }, { combine: 'all' as const }, { onDelay: 5 },
        { onTrue: [{ device: 'f', do: 'on' as const }] }, { onFalse: [{ device: 'f', do: 'off' as const }] },
        { gate: { source: { sun: true as const } } },
        { vent: { sensor: 'a', than: 'b', above: 9, below: 5 } }, { boiler: { device: 'd', button: 'b' } }, { leak: { sensors: ['s'], valves: ['v'] } },
        { timed: { button: 'b', device: 'd', minutes: 5 } }, { outside: { light: 'l', sensor: 's', pause: 5 } },
        { beurer: { heater: 'h', source: 'p', above: 200, keep: 10, every: 30 } }, { control: ctlBody }])
        expect(probs(ml(o)), JSON.stringify(o)).toContain('motionLight');
      expect(probs(ml({ inputs: [{ source: { device: 'x' } }] }))).not.toContain('inputs');
    });
    it('offDelay out of range stays the delay problem', () => {
      expect(probs(ml({ offDelay: 3601 }))).toEqual(['delay']);
    });
    it('a missing light, sensor, button or daylight sensor is device-missing', () => {
      expect(probs(ml(), { light: id => id !== 'l' })).toEqual(['device-missing']);
      expect(probs(ml(), { sensor: id => id !== 's2' })).toEqual(['device-missing']);
      expect(probs(ml(), { button: id => id !== 'b1' })).toEqual(['device-missing']);
      expect(probs(ml(), { lux: id => id !== 'ls' })).toEqual(['device-missing']);
      expect(probs(noDay(ml()), { lux: () => false })).toEqual([]);
    });
    it('other kinds reject a motionLight key', () => {
      const m = ml().motionLight!;
      expect(ruleProblems([], { ...newRule(null), id: 'v', name: 'V', vent: { sensor: 'a', than: 'b', above: 9, below: 5 }, onTrue: [{ device: 'f', do: 'on' }], onFalse: [{ device: 'f', do: 'off' }], motionLight: m }, exists)).toContain('vent');
      expect(ruleProblems([], { ...newRule(null), id: 'k', name: 'K', boiler: { device: 'd', button: 'b' }, motionLight: m }, exists)).toContain('boiler');
      expect(ruleProblems([], { ...leakRule(), motionLight: m }, exists)).toContain('leak');
      expect(ruleProblems([], { ...newRule(null), id: 't', name: 'T', timed: { button: 'b', device: 'd', minutes: 5 }, motionLight: m }, exists)).toContain('timed');
      expect(ruleProblems([], { ...newRule(null), id: 'o', name: 'O', outside: { light: 'l', sensor: 's', pause: 5 }, motionLight: m }, exists)).toContain('outside');
      expect(ruleProblems([], { ...newRule(null), id: 'u', name: 'U', offDelay: 60, beurer: { heater: 'h', source: 'p', above: 200, keep: 10, every: 30 }, motionLight: m }, exists)).toContain('beurer');
      expect(ruleProblems([], { ...newRule(null), id: 'c', name: 'C', control: ctlBody, motionLight: m }, exists)).toContain('control');
    });
    it('template: the zone single light, its motion sensors and buttons, the single plan illuminance sensor', () => {
      const r = motionLightTemplate(lvl([dev('l', 'ceiling_light', 100, 100), dev('m1', 'motion_sensor', 200, 200), dev('m2', 'motion_sensor', 300, 300),
        dev('b', 'smart_button', 400, 400), dev('w', 'wall_switch', 500, 500), dev('ls', 'illuminance_sensor', 5000, 5000)]), 'z1', 'Hall');
      expect(r.name).toBe('Light motion control Hall');
      expect(r).toMatchObject({ zoneId: 'z1', inputs: [], onTrue: [], onFalse: [], combine: 'any', onDelay: 0, offDelay: 180 });
      expect(r.motionLight).toEqual({ light: 'l', sensors: ['m1', 'm2'], buttons: ['b'], daylight: { sensor: 'ls', is: 'dark' }, minOn: 0, autoAfter: 0 });
      expect(ruleProblems([r], r, exists)).toEqual([]);
    });
    it('template pre-fills only smart buttons, never a wall switch', () => {
      const bind = (d: Device, b: Record<string, string>): Device => ({ ...d, bindings: b });
      const r = motionLightTemplate(lvl([bind(dev('l', 'ceiling_light', 100, 100), { control: 'light.a' }), dev('b', 'smart_button', 400, 400),
        bind(dev('w1', 'wall_switch', 500, 500), { state: 'light.a' }), bind(dev('w2', 'wall_switch', 600, 600), { state: 'switch.other' }), dev('w3', 'wall_switch', 700, 700)]), 'z1', 'Hall');
      expect(r.motionLight!.buttons).toEqual(['b']);
      const none = motionLightTemplate(lvl([dev('l', 'ceiling_light', 100, 100), bind(dev('w1', 'wall_switch', 500, 500), { state: 'light.a' })]), 'z1', 'Hall');
      expect(none.motionLight!.buttons).toEqual([]);
    });
    it('template never invents devices', () => {
      const two = motionLightTemplate(lvl([dev('l', 'ceiling_light', 100, 100), dev('w', 'wall_light', 200, 200), dev('ls', 'illuminance_sensor', 5000, 5000), dev('ls2', 'illuminance_sensor', 6000, 6000)]), 'z1', 'Hall');
      expect(two.motionLight).toEqual({ light: '', sensors: [], buttons: [], minOn: 0, autoAfter: 0 });
      expect(ruleProblems([two], two, exists)).toEqual(['motionLight']);
      const g = motionLightTemplate(lvl([dev('l', 'ceiling_light', 100, 100), dev('m1', 'motion_sensor', 200, 200), dev('ls', 'illuminance_sensor', 5000, 5000)]), null, null);
      expect(g.name).toBe('Light motion control');
      expect(g.motionLight).toEqual({ light: '', sensors: [], buttons: [], daylight: { sensor: 'ls', is: 'dark' }, minOn: 0, autoAfter: 0 });
    });
  });

  describe('control rule', () => {
    const zone: Zone = {
      id: 'z1', name: 'Hall', invalid: false,
      shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
    };
    const lvl = (devices: Device[]) => ({ levels: [{ ...emptyLevel('L'), zones: [zone], devices }] });
    const ctl = (c: Partial<NonNullable<Rule['control']>> = {}): NonNullable<Rule['control']> => ({
      sources: [{ button: 'b' }], on: [], off: [], toggle: [{ device: 'l', do: 'toggle' }], ...c,
    });
    const control = (over: Partial<Rule> = {}, c: Partial<NonNullable<Rule['control']>> = {}): Rule => ({
      ...newRule(null), id: 'c', name: 'C', control: ctl(c), ...over,
    });
    const probs = (r: Rule, src?: (id: string) => boolean, load?: (id: string) => boolean, actionsOf?: Parameters<typeof ruleProblems>[3], rules: Rule[] = [r]) =>
      ruleProblems(rules, r, exists, actionsOf, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, src, load);

    it('template: the single button and the single on/off device of the zone', () => {
      const r = controlTemplate(lvl([dev('b', 'smart_button', 100, 100), dev('s', 'socket', 200, 200), dev('m', 'motion_sensor', 300, 300)]), 'z1', 'Hall');
      expect(r.name).toBe('Load control Hall');
      expect(r.control).toEqual({ sources: [{ button: 'b' }], on: [{ device: 's', do: 'on' }], off: [{ device: 's', do: 'off' }], toggle: [{ device: 's', do: 'toggle' }] });
      expect(r).toMatchObject({ zoneId: 'z1', inputs: [], combine: 'any', onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] });
      expect(isControlRule(r)).toBe(true);
      expect(isControlRule(rule('a'))).toBe(false);
    });
    it('template: a wall switch is a device source', () => {
      const r = controlTemplate(lvl([dev('w', 'wall_switch', 100, 100), dev('l', 'ceiling_light', 250, 250)]), 'z1', 'Hall');
      expect(r.control!.sources).toEqual([{ source: { device: 'w' } }]);
      expect(r.control!.toggle).toEqual([{ device: 'l', do: 'toggle' }]);
    });
    it('template leaves ambiguous or missing picks empty', () => {
      const r = controlTemplate(lvl([dev('b', 'wall_switch', 100, 100), dev('b2', 'smart_button', 150, 150), dev('f', 'exhaust_fan', 200, 200), dev('l', 'ceiling_light', 250, 250)]), 'z1', 'Hall');
      expect(r.control).toEqual({ sources: [], on: [], off: [], toggle: [] });
      const g = controlTemplate(lvl([dev('b', 'wall_switch', 100, 100), dev('l', 'ceiling_light', 250, 250)]), null, null);
      expect(g.name).toBe('Load control');
      expect(g.control).toEqual({ sources: [], on: [], off: [], toggle: [] });
    });
    it('template leaves the lists empty when the wall switch and the load are the same relay', () => {
      const ws = { ...dev('b', 'wall_switch', 100, 100), bindings: { state: 'switch.hall' } };
      const same = { ...dev('l', 'ceiling_light', 250, 250), bindings: { control: 'switch.hall' } };
      expect(controlTemplate(lvl([ws, same]), 'z1', 'Hall').control).toEqual({ sources: [{ source: { device: 'b' } }], on: [], off: [], toggle: [] });
      const other = { ...same, bindings: { control: 'switch.lamp' } };
      expect(controlTemplate(lvl([ws, other]), 'z1', 'Hall').control!.toggle).toEqual([{ device: 'l', do: 'toggle' }]);
    });
    it('controlActionsFor: on / off / toggle, close for a valve, else none', () => {
      expect(controlActionsFor(dev('l', 'ceiling_light'))).toEqual(['on', 'off', 'toggle']);
      expect(controlActionsFor(dev('e', 'equipment', 0, 0, { controllable: true }))).toEqual(['on', 'off', 'toggle']);
      expect(controlActionsFor(dev('v', 'valve'))).toEqual(['close']);
      expect(controlActionsFor(dev('m', 'motion_sensor'))).toEqual([]);
      expect(controlActionsFor(dev('e', 'equipment'))).toEqual([]);
    });
    it('valid rules have no problems and never the inputs problem', () => {
      expect(probs(control())).toEqual([]);
      expect(probs(control({}, { sources: [{ source: { device: 'w' }, not: true }, { button: 'b' }], on: [{ device: 'l', do: 'on' }], off: [{ device: 'l', do: 'off' }, { device: 'l2', do: 'off' }], toggle: [{ device: 'l', do: 'toggle' }] }))).toEqual([]);
      expect(probs(control({ gate: { source: { sun: true } } }))).toEqual([]);
      expect(probs(control({}, { toggle: [], on: [{ device: 'v', do: 'close' }] }))).toEqual([]);
    });
    it('shape: control', () => {
      for (const c of [{ sources: [] }, { toggle: [] }, { sources: [{ button: 'b' }, { button: 'b' }] },
        { sources: [{ source: { device: 'w' }, not: true as const }, { not: true as const, source: { device: 'w' } }] },
        { toggle: [{ device: 'l', do: 'toggle' as const }, { device: 'l', do: 'toggle' as const }] },
        { on: [{ device: 'w', do: 'on' as const }], sources: [{ source: { device: 'w' } }] },
        { toggle: [{ device: 'h', do: 'toggle' as const }], sources: [{ source: { held: { sources: [{ device: 'h' }], state: 'any' as const, seconds: 5 } } }] }])
        expect(probs(control({}, c)), JSON.stringify(c)).toEqual(['control']);
      for (const o of [{ inputs: [{ source: { device: 'x' } }] }, { combine: 'all' as const }, { onDelay: 5 }, { offDelay: 5 },
        { onTrue: [{ device: 'f', do: 'on' as const }] }, { onFalse: [{ device: 'f', do: 'off' as const }] },
        { vent: { sensor: 'a', than: 'b', above: 9, below: 5 } }, { boiler: { device: 'd', button: 'b' } }, { leak: { sensors: ['s'], valves: ['v'] } },
        { timed: { button: 'b', device: 'd', minutes: 5 } }, { outside: { light: 'l', sensor: 's', pause: 5 } },
        { beurer: { heater: 'h', source: 'p', above: 200, keep: 10, every: 30 } }])
        expect(probs(control(o)), JSON.stringify(o)).toContain('control');
    });
    it('a button source may be a target too', () => {
      expect(probs(control({}, { sources: [{ button: 'l' }] }))).toEqual([]);
    });
    it('action: close only on a valve, on / off / toggle only on devices taking on and off, never open', () => {
      const actionsOf = (id: string) => (id === 'v' ? ruleActionsFor(dev('v', 'valve')) : ruleActionsFor(dev('s', 'socket')));
      expect(probs(control({}, { toggle: [{ device: 's', do: 'toggle' }] }), undefined, undefined, actionsOf)).toEqual([]);
      expect(probs(control({}, { toggle: [], on: [{ device: 'v', do: 'close' }] }), undefined, undefined, actionsOf)).toEqual([]);
      expect(probs(control({}, { on: [{ device: 's', do: 'close' as never }] }), undefined, undefined, actionsOf)).toEqual(['action']);
      expect(probs(control({}, { toggle: [{ device: 'v', do: 'toggle' }] }), undefined, undefined, actionsOf)).toEqual(['action']);
      expect(probs(control({}, { on: [{ device: 's', do: 'open' as never }] }))).toEqual(['action']);
      expect(probs(control({}, { on: [{ device: 's', do: 'open' as never }] }), undefined, undefined, actionsOf)).toEqual(['action']);
    });
    it('device-missing: an unknown button, target or device inside a source; rule-missing: a rule source of a missing rule', () => {
      expect(probs(control(), id => id !== 'b')).toEqual(['device-missing']);
      expect(probs(control(), undefined, id => id !== 'l')).toEqual(['device-missing']);
      const gone = control({}, { sources: [{ source: { held: { sources: [{ device: 'x' }], state: 'any', seconds: 5 } } }] });
      expect(ruleProblems([gone], gone, id => id !== 'x')).toEqual(['device-missing']);
      const rm = control({}, { sources: [{ source: { rule: 'nope' } }] });
      expect(probs(rm)).toEqual(['rule-missing']);
      expect(ruleRefs(rm)).toEqual(['nope']);
    });
    it('source parameters are checked as in the condition rule', () => {
      expect(probs(control({}, { sources: [{ source: { daylight: 's', is: 'night' }, not: true }] }))).toEqual(['daylight']);
      expect(probs(control({}, { sources: [{ source: { light: 's', below: 0, hysteresis: 1 } }] }))).toEqual(['light']);
      expect(probs(control({}, { sources: [{ source: { time: { from: '08:00', to: '08:00' } } }] }))).toEqual(['time']);
      expect(probs(control({}, { sources: [{ source: { held: { sources: [{ device: 's' }], state: 'any', seconds: 0 } } }] }))).toEqual(['held']);
    });
    it('a rule source takes part in the cycle check', () => {
      const a = control({ id: 'a' }, { sources: [{ source: { rule: 'b' } }] });
      const b = rule('b', { inputs: refs('a') });
      expect(ruleProblems([a, b], a, exists)).toContain('cycle');
    });
    it('other kinds reject a control key', () => {
      const c = ctl();
      expect(ruleProblems([], { ...newRule(null), id: 'v', name: 'V', vent: { sensor: 'a', than: 'b', above: 9, below: 5 }, onTrue: [{ device: 'f', do: 'on' }], onFalse: [{ device: 'f', do: 'off' }], control: c }, exists)).toContain('vent');
      expect(ruleProblems([], { ...newRule(null), id: 'k', name: 'K', boiler: { device: 'd', button: 'b' }, control: c }, exists)).toContain('boiler');
      expect(ruleProblems([], { ...leakRule(), control: c }, exists)).toContain('leak');
      expect(ruleProblems([], { ...newRule(null), id: 't', name: 'T', timed: { button: 'b', device: 'd', minutes: 5 }, control: c }, exists)).toContain('timed');
      expect(ruleProblems([], { ...newRule(null), id: 'o', name: 'O', outside: { light: 'l', sensor: 's', pause: 5 }, control: c }, exists)).toContain('outside');
      expect(ruleProblems([], { ...newRule(null), id: 'u', name: 'U', beurer: { heater: 'h', source: 'p', above: 200, keep: 10, every: 30 }, control: c }, exists)).toContain('beurer');
    });
    describe('migrateControl', () => {
      const old = (sources: string[], loads: string[]): Rule => ({ ...newRule(null), id: 'c', name: 'C', control: { sources, loads } as unknown as Rule['control'] });
      const kindOf = (id: string) => (id === 'btn' ? 'smart_button' : id === 'ws' ? 'wall_switch' : undefined);
      it('converts the 0.20.0 shape', () => {
        const r = migrateControl(old(['btn', 'ws'], ['l1', 'l2']), kindOf);
        expect(r.control).toEqual({
          sources: [{ button: 'btn' }, { source: { device: 'ws' } }],
          on: [{ device: 'l1', do: 'on' }, { device: 'l2', do: 'on' }],
          off: [{ device: 'l1', do: 'off' }, { device: 'l2', do: 'off' }],
          toggle: [{ device: 'l1', do: 'toggle' }, { device: 'l2', do: 'toggle' }],
        });
        expect(r).toMatchObject({ id: 'c', name: 'C', inputs: [], onTrue: [] });
      });
      it('returns the same object for a new-shape and a non-control rule, and is idempotent', () => {
        const fresh = control();
        expect(migrateControl(fresh, kindOf)).toBe(fresh);
        const plain = rule('a');
        expect(migrateControl(plain, kindOf)).toBe(plain);
        const once = migrateControl(old(['btn'], ['l1']), kindOf);
        expect(migrateControl(once, kindOf)).toBe(once);
      });
    });
  });

  describe('timed switch', () => {
    const zone: Zone = {
      id: 'z1', name: 'Hall', invalid: false,
      shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
    };
    const lvl = (devices: Device[]) => ({ levels: [{ ...emptyLevel('L'), zones: [zone], devices }] });
    const timed = (over: Partial<Rule> = {}, t: Partial<NonNullable<Rule['timed']>> = {}): Rule => ({
      ...newRule(null), id: 't', name: 'T', inputs: [], timed: { button: 'b', device: 'd', minutes: 15, ...t }, ...over,
    });
    const probs = (r: Rule, ...p: (((id: string) => boolean) | undefined)[]) => ruleProblems([r], r, exists, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ...p);

    it('template: the single button and single on/off device of the zone, 15 min', () => {
      const r = timedTemplate(lvl([dev('b', 'smart_button', 100, 100), dev('f', 'exhaust_fan', 200, 200), dev('m', 'motion_sensor', 300, 300)]), 'z1', 'Hall');
      expect(r.name).toBe('Timed switch Hall');
      expect(r.timed).toEqual({ button: 'b', device: 'f', minutes: 15 });
      expect(r).toMatchObject({ zoneId: 'z1', inputs: [], onTrue: [], onFalse: [] });
      expect(isTimedRule(r)).toBe(true);
      expect(isTimedRule(rule('a'))).toBe(false);
    });
    it('template leaves ambiguous or missing picks empty', () => {
      const r = timedTemplate(lvl([dev('b', 'wall_switch', 100, 100), dev('b2', 'smart_button', 150, 150), dev('f', 'exhaust_fan', 200, 200), dev('l', 'ceiling_light', 250, 250)]), 'z1', 'Hall');
      expect(r.timed).toEqual({ button: '', device: '', minutes: 15 });
      const g = timedTemplate(lvl([dev('b', 'wall_switch', 100, 100)]), null, null);
      expect(g.name).toBe('Timed switch');
      expect(g.timed).toEqual({ button: '', device: '', minutes: 15 });
    });
    it('valid rule, invert true allowed, bounds', () => {
      expect(probs(timed())).toEqual([]);
      expect(probs(timed({}, { invert: true }))).toEqual([]);
      expect(probs(timed({}, { minutes: 1 }))).toEqual([]);
      expect(probs(timed({}, { minutes: 1440 }))).toEqual([]);
    });
    it('shape and bounds', () => {
      for (const t of [{ minutes: 0 }, { minutes: 1441 }, { minutes: 1.5 }, { minutes: NaN }, { button: '' }, { device: '' }, { device: 'b' }, { invert: false as unknown as true }])
        expect(probs(timed({}, t)), JSON.stringify(t)).toEqual(['timed']);
      for (const o of [{ inputs: [{ source: { device: 'x' } }] }, { combine: 'all' as const }, { onDelay: 1 }, { offDelay: 1 },
        { gate: { source: { sun: true as const } } }, { onTrue: [{ device: 'f', do: 'on' as const }] }, { onFalse: [{ device: 'f', do: 'off' as const }] },
        { vent: { sensor: 'a', than: 'b', above: 9, below: 5 } }, { boiler: { device: 'd', button: 'b' } }, { leak: { sensors: ['s'], valves: ['v'] } }])
        expect(probs(timed(o)), JSON.stringify(o)).toContain('timed');
    });
    it('a button or device that is not one, or is missing, is device-missing', () => {
      expect(probs(timed(), id => id !== 'b')).toEqual(['device-missing']);
      expect(probs(timed(), undefined, id => id !== 'd')).toEqual(['device-missing']);
      expect(ruleProblems([timed()], timed(), id => id !== 'd')).toEqual(['device-missing']);
    });
    it('other kinds reject a timed key', () => {
      const t = { button: 'b', device: 'd', minutes: 5 };
      expect(ruleProblems([], { ...leakRule(), timed: t }, exists)).toContain('leak');
    });
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
    expect(ruleActionsFor(dev('d', 'valve'))).toEqual(['close']);
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
});

describe('vent rule', () => {
  const vent = (over: Partial<Rule> = {}, v: Partial<NonNullable<Rule['vent']>> = {}): Rule => ({
    ...newRule(null), id: 'v', name: 'Vent', inputs: [], offDelay: 600,
    vent: { sensor: 's', than: 't', above: 9, below: 5, ...v },
    onTrue: [{ device: 'f', do: 'on' }], onFalse: [{ device: 'f', do: 'off' }], ...over,
  });
  const probs = (r: Rule, climate?: (id: string) => boolean) => ruleProblems([r], r, exists, undefined, undefined, climate);

  it('a valid vent rule has no problems and isVentRule', () => {
    expect(probs(vent())).toEqual([]);
    expect(isVentRule(vent())).toBe(true);
    expect(isVentRule(rule('a'))).toBe(false);
    expect(probs(vent({ offDelay: 0 }, { below: 0 }))).toEqual([]);
    expect(probs(vent({}, { below: 9 }))).toEqual([]);
  });
  it('data bounds', () => {
    for (const v of [{ above: 0 }, { above: -1 }, { below: -1 }, { below: 10 }, { above: NaN }, { sensor: 't' }, { sensor: '' }, { than: '' }]) {
      expect(probs(vent({}, v)), JSON.stringify(v)).toContain('vent');
    }
    expect(probs(vent({}, { sensor: '' }), id => id !== '')).toContain('device-missing');
  });
  it('fixed fields', () => {
    expect(probs(vent({ inputs: [{ source: { device: 'd' } }] }))).toContain('vent');
    expect(probs(vent({ combine: 'all' }))).toContain('vent');
    expect(probs(vent({ onDelay: 5 }))).toContain('vent');
    expect(probs(vent({ gate: { source: { sun: true } } }))).toContain('vent');
    expect(probs(vent({ offDelay: 3601 }))).toContain('delay');
    expect(probs(vent({ onTrue: [{ device: 'f', do: 'off' }] }))).toContain('vent');
    expect(probs(vent({ onFalse: [{ device: 'g', do: 'off' }] }))).toContain('vent');
    expect(probs(vent({ onTrue: [], onFalse: [] }))).toEqual(['vent']);
    expect(probs(vent({ onTrue: [{ device: 'f', do: 'on' }, { device: 'g', do: 'on' }] }))).toContain('vent');
  });
  it('missing or non-climate sensor ids', () => {
    expect(probs(vent(), id => id === 's')).toEqual(['device-missing']);
    expect(probs(vent(), () => false)).toEqual(['device-missing']);
    expect(ruleProblems([vent()], vent(), id => id !== 't')).toContain('device-missing');
    expect(ruleProblems([vent()], vent(), id => id !== 'f')).toContain('device-missing');
  });
  it('references no rules', () => {
    expect(ruleRefs(vent())).toEqual([]);
    expect(ruleCycle([vent()], vent())).toBeNull();
    const user = rule('u', { inputs: refs('v') });
    expect(ruleUsers([vent(), user], 'v').map(r => r.id)).toEqual(['u']);
  });

  const zone: Zone = {
    id: 'z1', name: 'WC', invalid: false,
    shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
  };
  const lvl = (devices: Device[]) => ({ levels: [{ ...emptyLevel('L'), zones: [zone], devices }] });
  const fan = (id: string, x: number, y: number): Device => dev(id, 'exhaust_fan', x, y, { diameter: 100 });
  it('template with sensor and one fan', () => {
    const r = ventTemplate(lvl([dev('c1', 'climate_sensor', 100, 100), dev('c2', 'climate_sensor', 200, 200), fan('f1', 300, 300)]), 'z1', 'WC');
    expect(r.name).toBe('Vent WC');
    expect(r.vent).toEqual({ sensor: 'c1', than: '', above: 9, below: 5 });
    expect(r.offDelay).toBe(600);
    expect(r.inputs).toEqual([]);
    expect(r.onTrue).toEqual([{ device: 'f1', do: 'on' }]);
    expect(r.onFalse).toEqual([{ device: 'f1', do: 'off' }]);
  });
  it('template without a sensor, with two fans, without a zone', () => {
    const r = ventTemplate(lvl([fan('f1', 300, 300), fan('f2', 400, 400)]), 'z1', 'WC');
    expect(r.vent?.sensor).toBe('');
    expect(r.onTrue).toEqual([]);
    expect(r.onFalse).toEqual([]);
    expect(probs(r)).toContain('vent');
    const g = ventTemplate(lvl([]), null, null);
    expect(g.name).toBe('Vent');
    expect(g.vent).toEqual({ sensor: '', than: '', above: 9, below: 5 });
  });
  it('template skips devices that opted out of the zone', () => {
    const out = { ...fan('f1', 300, 300), zoneBlacklist: ['z1'] };
    const r = ventTemplate(lvl([{ ...dev('c1', 'climate_sensor', 100, 100), zoneBlacklist: ['z1'] }, dev('c2', 'climate_sensor', 200, 200), out]), 'z1', 'WC');
    expect(r.vent?.sensor).toBe('c2');
    expect(r.onTrue).toEqual([]);
  });
});

describe('boiler rule', () => {
  const boiler = (over: Partial<Rule> = {}, b: Partial<NonNullable<Rule['boiler']>> = {}): Rule => ({
    ...newRule(null), id: 'b', name: 'Boiler', inputs: [],
    boiler: { device: 'd', button: 'btn', grid: { block: 'g', limit: 3000, nominal: 1400 }, ...b }, ...over,
  });
  const probs = (r: Rule, ...p: ((id: string) => boolean)[]) => ruleProblems([r], r, exists, undefined, undefined, undefined, ...p);

  it('valid rule, with and without grid', () => {
    expect(probs(boiler())).toEqual([]);
    expect(isBoilerRule(boiler())).toBe(true);
    expect(isBoilerRule(rule('a'))).toBe(false);
    expect(probs(boiler({ boiler: { device: 'd', button: 'btn' } }))).toEqual([]);
  });
  it('shape and bounds', () => {
    for (const b of [{ device: '' }, { button: '' }, { button: 'd' }, { grid: { block: '', limit: 1, nominal: 1 } },
      { grid: { block: 'g', limit: 0, nominal: 1 } }, { grid: { block: 'g', limit: 1, nominal: 0 } }, { grid: { block: 'g', limit: NaN, nominal: 1 } }])
      expect(probs(boiler({}, b)), JSON.stringify(b)).toEqual(['boiler']);
    for (const o of [{ inputs: [{ source: { device: 'x' } }] }, { combine: 'all' as const }, { onDelay: 1 }, { offDelay: 1 },
      { gate: { source: { sun: true as const } } }, { onTrue: [{ device: 'f', do: 'on' as const }] }, { onFalse: [{ device: 'f', do: 'off' as const }] }])
      expect(probs(boiler(o)), JSON.stringify(o)).toContain('boiler');
  });
  it('an empty grid block is only a boiler problem without a lookup', () => {
    expect(probs(boiler({}, { grid: { block: '', limit: 3000, nominal: 1400 } }))).toEqual(['boiler']);
  });
  it('lookups', () => {
    expect(probs(boiler(), id => id !== 'd')).toEqual(['device-missing']);
    expect(probs(boiler(), () => true, id => id !== 'btn')).toEqual(['device-missing']);
    expect(probs(boiler(), () => true, () => true, id => id !== 'g')).toEqual(['device-missing']);
    expect(probs(boiler({ boiler: { device: 'd', button: 'btn' } }), () => true, () => true, () => false)).toEqual([]);
    expect(ruleProblems([boiler()], boiler(), id => id !== 'btn')).toEqual(['device-missing']);
  });

  const zone: Zone = {
    id: 'z1', name: 'WC', invalid: false,
    shape: { kind: 'polygon', vertices: [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].map(([x, y]) => ({ kind: 'free' as const, x, y })) },
  };
  const plan = (devices: Device[], grids = 1) => ({
    levels: [{ ...emptyLevel('L'), zones: [zone], devices }],
    power: { blocks: [...Array(grids).keys()].map(i => ({ id: `g${i}`, kind: 'grid' as const, x: 0, y: 0 })), wires: [] },
  });
  const heater = (id: string, x = 100): Device => ({ ...dev(id, 'equipment', x, 100, { controllable: true }), bindings: { control: 'switch.a', power: 'sensor.a' } });
  it('a boiler device has control and power; equipment only when controllable', () => {
    expect(isBoilerDevice(heater('h'))).toBe(true);
    expect(isBoilerDevice({ ...heater('h'), props: { ...heater('h').props, controllable: undefined } as Device['props'] })).toBe(false);
    expect(isBoilerDevice({ ...dev('s', 'socket'), bindings: { control: 'switch.s', power: 'sensor.s' } })).toBe(true);
    expect(isBoilerDevice({ ...dev('s', 'socket'), bindings: { control: 'switch.s' } })).toBe(false);
    expect(isBoilerDevice({ ...heater('h'), bindings: { power: 'sensor.a' } })).toBe(false);
  });
  it('template skips equipment that is not controllable', () => {
    const plain: Device = { ...dev('p', 'equipment', 100, 100), bindings: { control: 'switch.a', power: 'sensor.a' } };
    expect(boilerTemplate(plan([plain]), 'z1', 'WC').boiler?.device).toBe('');
  });
  it('a button has an Auto action: wall switch double toggle; smart button auto enabled with an event', () => {
    expect(buttonHasAuto(dev('w', 'wall_switch', 0, 0, { autoByDoubleToggle: true }))).toBe(true);
    expect(buttonHasAuto(dev('w', 'wall_switch', 0, 0, { autoByDoubleToggle: false }))).toBe(false);
    expect(buttonHasAuto(dev('s', 'smart_button', 0, 0, { autoEnabled: true, auto: { slot: 0, event: 'hold' } }))).toBe(true);
    expect(buttonHasAuto(dev('s', 'smart_button', 0, 0, { autoEnabled: false, auto: { slot: 0, event: 'hold' } }))).toBe(false);
    expect(buttonHasAuto(dev('s', 'smart_button', 0, 0, { autoEnabled: true, auto: { slot: 0, event: ' ' } }))).toBe(false);
  });
  it('a button without an Auto action is a boiler-auto problem', () => {
    const r = boiler();
    expect(ruleProblems([r], r, exists, undefined, undefined, undefined, undefined, undefined, undefined, id => id !== 'btn')).toEqual(['boiler-auto']);
    expect(ruleProblems([r], r, exists, undefined, undefined, undefined, undefined, undefined, undefined, () => true)).toEqual([]);
    expect(ruleProblems([r], r, exists, undefined, undefined, undefined, undefined, id => id !== 'btn', undefined, () => false)).toEqual(['device-missing']);
    expect(ruleProblems([r], r, exists, undefined, undefined, undefined, undefined, undefined, undefined, () => false)).toEqual(['boiler-auto']);
    const empty = boiler({}, { button: '' });
    expect(ruleProblems([empty], empty, exists, undefined, undefined, undefined, undefined, undefined, undefined, () => false)).toEqual(['boiler']);
  });
  it('template picks the single device, button and grid', () => {
    const r = boilerTemplate(plan([heater('h'), dev('w', 'wall_switch', 200, 200), dev('c', 'climate_sensor', 300, 300)]), 'z1', 'WC');
    expect(r.name).toBe('Cost effective boiler WC');
    expect(r.boiler).toEqual({ device: 'h', button: 'w', grid: { block: 'g0', limit: 3000, nominal: 1400 } });
    expect([r.inputs, r.onTrue, r.onFalse, r.offDelay]).toEqual([[], [], [], 0]);
    expect(boilerTemplate(plan([dev('s', 'smart_button', 200, 200)]), 'z1', null).boiler?.button).toBe('s');
  });
  it('template leaves ambiguous picks empty and omits grid unless exactly one', () => {
    const r = boilerTemplate(plan([heater('h1'), heater('h2', 200), dev('w1', 'wall_switch', 300, 300), dev('w2', 'smart_button', 400, 400)], 2), 'z1', 'WC');
    expect(r.boiler).toEqual({ device: '', button: '' });
    const none = boilerTemplate({ levels: plan([]).levels }, null, null);
    expect(none.name).toBe('Cost effective boiler');
    expect(none.boiler).toEqual({ device: '', button: '' });
    const out = { ...heater('h'), zoneBlacklist: ['z1'] };
    expect(boilerTemplate(plan([out]), 'z1', 'WC').boiler?.device).toBe('');
    expect(probs(r)).toContain('boiler');
  });
});
