/** Pure ops on condition rules (`Plan.rules`). Rules are plan-level: they reference devices and rules of any level. */
import { zoneMembers } from '../geometry/zones';
import { newId } from './ids';
import type { Device, Id, Level, Rule, RuleDo } from './types';

export const RULE_DELAY_MAX = 3600;

export function newRule(zoneId: Id | null): Rule {
  return { id: newId(), name: '', zoneId, combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}

export const addRule = (rules: Rule[], r: Rule): Rule[] => [...rules, r];
export const updateRule = (rules: Rule[], r: Rule): Rule[] => rules.map(x => (x.id === r.id ? r : x));
/** References to the deleted rule are left in place; they become errors (rule-missing). */
export const deleteRule = (rules: Rule[], id: Id): Rule[] => rules.filter(x => x.id !== id);

/** The rules listed for a zone; null = the rules without a zone or whose zone no longer exists. */
export function rulesFor(rules: Rule[], zoneId: Id | null, zoneExists: (id: Id) => boolean): Rule[] {
  if (zoneId === null) return rules.filter(r => r.zoneId === null || !zoneExists(r.zoneId));
  return rules.filter(r => r.zoneId === zoneId);
}

const ruleRefs = (r: Rule): Id[] => r.inputs.flatMap(i => ('rule' in i.source ? [i.source.rule] : []));

/** Ids on a reference cycle through the candidate (the candidate first), else null. The candidate replaces the stored rule of its id. */
export function ruleCycle(rules: Rule[], candidate: Rule): Id[] | null {
  const byId = new Map(rules.map(r => [r.id, r] as const));
  byId.set(candidate.id, candidate);
  const dead = new Set<Id>();
  const walk = (id: Id, path: Id[]): Id[] | null => {
    if (id === candidate.id && path.length > 0) return path;
    if (path.includes(id) || dead.has(id)) return null;
    const r = byId.get(id);
    if (!r) return null;
    for (const next of ruleRefs(r)) {
      const hit = walk(next, [...path, id]);
      if (hit) return hit;
    }
    dead.add(id);
    return null;
  };
  for (const next of ruleRefs(candidate)) {
    const hit = walk(next, [candidate.id]);
    if (hit) return hit;
  }
  return null;
}

export type RuleProblem = 'name' | 'inputs' | 'device-missing' | 'rule-missing' | 'cycle' | 'delay';

const delayOk = (n: unknown): boolean => Number.isInteger(n) && (n as number) >= 0 && (n as number) <= RULE_DELAY_MAX;

export function ruleProblems(rules: Rule[], r: Rule, deviceExists: (id: Id) => boolean): RuleProblem[] {
  const out: RuleProblem[] = [];
  if (!r.name.trim()) out.push('name');
  if (r.inputs.length === 0) out.push('inputs');
  const devices = [
    ...r.inputs.flatMap(i => ('device' in i.source ? [i.source.device] : [])),
    ...r.onTrue.map(a => a.device), ...r.onFalse.map(a => a.device),
  ];
  if (devices.some(id => !deviceExists(id))) out.push('device-missing');
  const known = new Set(rules.map(x => x.id));
  if (ruleRefs(r).some(id => id !== r.id && !known.has(id))) out.push('rule-missing');
  if (ruleCycle(rules, r)) out.push('cycle');
  if (!delayOk(r.onDelay) || !delayOk(r.offDelay)) out.push('delay');
  return out;
}

/** The "Leak -> valve" template: the zone's leak sensors, any, close the zone's valve when it has exactly one. */
export function leakTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Leak ${zoneName} -> valve` : 'Leak -> valve';
  if (zoneId === null) return rule;
  const level = plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  if (!level) return rule;
  const members = zoneMembers(level, zoneId).map(m => m.device);
  rule.inputs = members.filter(d => d.props.kind === 'leak_sensor').map(d => ({ source: { device: d.id } }));
  const valves = members.filter(d => d.props.kind === 'valve');
  if (valves.length === 1) rule.onTrue = [{ device: valves[0].id, do: 'close' }];
  return rule;
}

const INPUT_KINDS = new Set(['leak_sensor', 'motion_sensor', 'ceiling_light', 'wall_light', 'socket', 'exhaust_fan', 'equipment', 'wall_switch', 'valve']);
export const isRuleInputDevice = (d: Device): boolean => INPUT_KINDS.has(d.props.kind);

export function ruleActionsFor(d: Device): RuleDo[] {
  const p = d.props;
  if (p.kind === 'valve') return ['open', 'close'];
  if (p.kind === 'equipment') return p.controllable === true ? ['on', 'off'] : [];
  if (p.kind === 'ceiling_light' || p.kind === 'wall_light' || p.kind === 'socket' || p.kind === 'exhaust_fan') return ['on', 'off'];
  return [];
}
