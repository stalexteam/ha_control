/** Pure ops on condition rules (`Plan.rules`). Rules are plan-level: they reference devices and rules of any level. */
import { zoneMembers } from '../geometry/zones';
import { newId } from './ids';
import type { Device, Id, Level, Rule, RuleDo, RuleInput } from './types';

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

const inputRefs = (i: RuleInput): Id[] => {
  const s = i.source;
  if ('rule' in s) return [s.rule];
  if ('held' in s) return s.held.sources.flatMap(x => ('rule' in x ? [x.rule] : []));
  return [];
};

/** Every rule id the rule references: inputs, the gate and held sources. */
export const ruleRefs = (r: Rule): Id[] => [...r.inputs, ...(r.gate ? [r.gate] : [])].flatMap(inputRefs);

const inputDevices = (i: RuleInput): Id[] => {
  const s = i.source;
  if ('device' in s) return [s.device];
  if ('held' in s) return s.held.sources.flatMap(x => ('device' in x ? [x.device] : []));
  return [];
};

/** The other rules that take the given rule as an input. */
export const ruleUsers = (rules: Rule[], id: Id): Rule[] => rules.filter(r => r.id !== id && ruleRefs(r).includes(id));

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

export type RuleProblem = 'name' | 'inputs' | 'device-missing' | 'rule-missing' | 'cycle' | 'delay' | 'action' | 'light' | 'time' | 'held';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/** The parameter problem of one input ('light' | 'time' | 'held'), if any. */
function paramProblem(i: RuleInput): RuleProblem | null {
  const s = i.source;
  if ('light' in s) return isNum(s.below) && s.below > 0 && isNum(s.hysteresis) && s.hysteresis >= 0 ? null : 'light';
  if ('time' in s) {
    const { from, to } = s.time;
    return typeof from === 'string' && typeof to === 'string' && TIME_RE.test(from) && TIME_RE.test(to) && from !== to ? null : 'time';
  }
  if ('held' in s) {
    const h = s.held;
    const ok = Array.isArray(h.sources) && h.sources.length >= 1 && ['on', 'off', 'any'].includes(h.state)
      && Number.isInteger(h.seconds) && h.seconds >= 1 && h.seconds <= 86400;
    return ok ? null : 'held';
  }
  return null;
}

const delayOk = (n: unknown): boolean => Number.isInteger(n) && (n as number) >= 0 && (n as number) <= RULE_DELAY_MAX;

/**
 * `actionsOf` (optional) gives the actions a device takes; an action outside them is the 'action' problem.
 * `lightSensorExists` (optional) tells whether an id is an illuminance_sensor device; default = any existing device.
 */
export function ruleProblems(
  rules: Rule[], r: Rule, deviceExists: (id: Id) => boolean, actionsOf?: (id: Id) => RuleDo[] | undefined,
  lightSensorExists?: (id: Id) => boolean,
): RuleProblem[] {
  const out: RuleProblem[] = [];
  if (!r.name.trim()) out.push('name');
  if (r.inputs.length === 0) out.push('inputs');
  const all = [...r.inputs, ...(r.gate ? [r.gate] : [])];
  const devices = [...all.flatMap(inputDevices), ...r.onTrue.map(a => a.device), ...r.onFalse.map(a => a.device)];
  const lights = all.flatMap(i => ('light' in i.source ? [i.source.light] : []));
  if (devices.some(id => !deviceExists(id)) || lights.some(id => !(lightSensorExists ?? deviceExists)(id))) out.push('device-missing');
  const known = new Set(rules.map(x => x.id));
  if (ruleRefs(r).some(id => id !== r.id && !known.has(id))) out.push('rule-missing');
  if (ruleCycle(rules, r)) out.push('cycle');
  if (!delayOk(r.onDelay) || !delayOk(r.offDelay)) out.push('delay');
  for (const i of all) {
    const p = paramProblem(i);
    if (p && !out.includes(p)) out.push(p);
  }
  if (actionsOf && [...r.onTrue, ...r.onFalse].some(a => { const ok = actionsOf(a.device); return ok !== undefined && !ok.includes(a.do); })) out.push('action');
  return out;
}

/** The "Leak -> valve" template: the zone's leak sensors, any, close the zone's valve when it has exactly one. */
export function leakTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Leak ${zoneName} -> valve` : 'Leak -> valve';
  if (zoneId === null) return rule;
  const level = plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  if (!level) return rule;
  const members = zoneMembers(level, zoneId).filter(m => m.participates).map(m => m.device);
  rule.inputs = members.filter(d => d.props.kind === 'leak_sensor').map(d => ({ source: { device: d.id } }));
  const valves = members.filter(d => d.props.kind === 'valve');
  if (valves.length === 1) rule.onTrue = [{ device: valves[0].id, do: 'close' }];
  return rule;
}

const HELD_30_MIN = 1800;

/** The "Timer" template: a device unchanged for 30 minutes (no actions; the owner adds them). */
export function timerTemplate(_plan: { levels: Level[] }, zoneId: Id | null, deviceId: Id | null, name: string): Rule {
  const rule = newRule(zoneId);
  rule.name = name.trim() ? `${name.trim()} unchanged 30 min` : 'Unchanged 30 min';
  rule.inputs = [{ source: { held: { sources: deviceId === null ? [] : [{ device: deviceId }], state: 'any', seconds: HELD_30_MIN } } }];
  return rule;
}

/** The "Outside light" template: dark (light + sun + time window), gated by the light unchanged for 30 min. The owner picks the light. */
export function outsideLightTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Outside light ${zoneName}` : 'Outside light';
  rule.combine = 'all';
  const level = zoneId === null ? undefined : plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  const sensor = level
    ? zoneMembers(level, zoneId as Id).find(m => m.participates && m.device.props.kind === 'illuminance_sensor')?.device.id
    : undefined;
  rule.inputs = [
    { source: { light: sensor ?? '', below: 10, hysteresis: 5 } },
    { source: { sun: true } },
    { source: { time: { from: '17:00', to: '01:00' } } },
  ];
  rule.gate = { source: { held: { sources: [], state: 'any', seconds: HELD_30_MIN } } };
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

/** Same content, whatever the key order (a dialog copy edited back to the saved values is equal). */
export function ruleEqual(a: Rule, b: Rule): boolean {
  const canon = (_k: string, v: unknown): unknown =>
    v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([x], [y]) => (x < y ? -1 : 1))) : v;
  return JSON.stringify(a, canon) === JSON.stringify(b, canon);
}
