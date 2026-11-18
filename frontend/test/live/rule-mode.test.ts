import { describe, it, expect } from 'vitest';
import { ruleModeBubbles } from '../../src/live/rule-mode';
import type { RuleTrace } from '../../src/live/rules-feed';
import type { Rule } from '../../src/model/types';

const base = { zoneId: null, combine: 'any' as const, inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
const ml = (id: string, over: Partial<NonNullable<Rule['motionLight']>> = {}, r: Partial<Rule> = {}): Rule =>
  ({ ...base, id, name: id, motionLight: { light: 'L', sensors: ['m'], minOn: 0, buttons: [], autoAfter: 0, ...over }, ...r });
const boiler = (id: string, r: Partial<Rule> = {}): Rule => ({ ...base, id, name: id, boiler: { device: 'B', button: 'btn' }, ...r });
const mlTrace = (mode: 'auto' | 'manual', verdict: boolean | null): RuleTrace =>
  ({ status: 'ok', verdict, inputs: [], unknownInputs: 0, motionLight: { mode, motion: false, sensors: [], dark: true, light: 'on' } });
const bTrace = (mode: 'auto' | 'manual', phase: 'heating' | 'waiting' | null): RuleTrace =>
  ({ status: 'ok', verdict: null, inputs: [], unknownInputs: 0, boiler: { mode, phase, grid: null, boilerW: null, headroom: null, relay: null } });
const of = (m: Record<string, RuleTrace>) => (id: string) => m[id];

describe('ruleModeBubbles', () => {
  it('motion light auto: verdict true is on, false is off, no key', () => {
    expect(ruleModeBubbles([ml('a')], of({ a: mlTrace('auto', true) }), 'L')).toEqual([{ text: 'auto: on', tone: 'mode', id: 'mode:a' }]);
    const off = ruleModeBubbles([ml('a')], of({ a: mlTrace('auto', false) }), 'L');
    expect(off).toEqual([{ text: 'auto: off', tone: 'mode', id: 'mode:a' }]);
    expect('key' in off[0]).toBe(false);
  });
  it('gives none for manual, inert auto, no trace, disabled rule and another device', () => {
    expect(ruleModeBubbles([ml('a')], of({ a: mlTrace('manual', null) }), 'L')).toEqual([]);
    expect(ruleModeBubbles([ml('a', { sensors: [] })], of({ a: mlTrace('auto', null) }), 'L')).toEqual([]);
    expect(ruleModeBubbles([ml('a')], of({}), 'L')).toEqual([]);
    expect(ruleModeBubbles([ml('a', {}, { enabled: false })], of({ a: mlTrace('auto', true) }), 'L')).toEqual([]);
    expect(ruleModeBubbles([ml('a')], of({ a: mlTrace('auto', true) }), 'other')).toEqual([]);
  });
  it('boiler: auto heating is on, auto otherwise off, manual none', () => {
    expect(ruleModeBubbles([boiler('b')], of({ b: bTrace('auto', 'heating') }), 'B')).toEqual([{ text: 'auto: on', tone: 'mode', id: 'mode:b' }]);
    expect(ruleModeBubbles([boiler('b')], of({ b: bTrace('auto', 'waiting') }), 'B')).toEqual([{ text: 'auto: off', tone: 'mode', id: 'mode:b' }]);
    expect(ruleModeBubbles([boiler('b')], of({ b: bTrace('auto', null) }), 'B')).toEqual([{ text: 'auto: off', tone: 'mode', id: 'mode:b' }]);
    expect(ruleModeBubbles([boiler('b')], of({ b: bTrace('manual', null) }), 'B')).toEqual([]);
  });
  it('two rules on one device give two bubbles in rule order', () => {
    const r = ruleModeBubbles([ml('a'), ml('c')], of({ a: mlTrace('auto', false), c: mlTrace('auto', true) }), 'L');
    expect(r.map(b => b.text)).toEqual(['auto: off', 'auto: on']);
  });
});
