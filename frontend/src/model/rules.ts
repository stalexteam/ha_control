/** Pure ops on condition rules (`Plan.rules`). Rules are plan-level: they reference devices and rules of any level. */
import { zoneMembers } from '../geometry/zones';
import { newId } from './ids';
import type { PowerSchema } from './power';
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

export type RuleProblem = 'name' | 'inputs' | 'device-missing' | 'rule-missing' | 'cycle' | 'delay' | 'action' | 'light' | 'daylight' | 'time' | 'held' | 'vent' | 'boiler' | 'boiler-auto' | 'leak' | 'timed';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/** The parameter problem of one input ('light' | 'daylight' | 'time' | 'held'), if any. */
function paramProblem(i: RuleInput): RuleProblem | null {
  const s = i.source;
  if ('daylight' in s) return ['night', 'dark', 'day'].includes(s.is) && i.not === undefined ? null : 'daylight';
  if ('light' in s) return isNum(s.below) && s.below > 0 && isNum(s.hysteresis) && s.hysteresis >= 0 && (s.unknownDark === undefined || s.unknownDark === true) ? null : 'light';
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
 * `climateSensorExists` (optional) the same for climate_sensor devices (vent rules).
 * `boilerDeviceExists` (optional) tells whether an id is a boiler device (`isBoilerDevice`), `buttonExists` a
 * wall_switch or smart_button, `gridBlockExists` a Power grid block with a power entity (boiler rules); defaults: any
 * existing device, any existing device, no check. `buttonAutoOk` (optional) tells whether the boiler's button has an
 * Auto action ('boiler-auto' otherwise; not checked for a missing device). `leakSensorExists` / `valveExists`
 * (optional) tell whether an id is a leak_sensor / valve device (leak rules); default = any existing device.
 * `timedButtonExists` / `timedDeviceExists` (optional) tell whether an id is a button container / a device taking 'on'
 * (timed rules); default = any existing device.
 */
export function ruleProblems(
  rules: Rule[], r: Rule, deviceExists: (id: Id) => boolean, actionsOf?: (id: Id) => RuleDo[] | undefined,
  lightSensorExists?: (id: Id) => boolean,
  climateSensorExists?: (id: Id) => boolean,
  boilerDeviceExists?: (id: Id) => boolean,
  buttonExists?: (id: Id) => boolean,
  gridBlockExists?: (id: Id) => boolean,
  buttonAutoOk?: (id: Id) => boolean,
  leakSensorExists?: (id: Id) => boolean,
  valveExists?: (id: Id) => boolean,
  timedButtonExists?: (id: Id) => boolean,
  timedDeviceExists?: (id: Id) => boolean,
): RuleProblem[] {
  const out: RuleProblem[] = [];
  if (!r.name.trim()) out.push('name');
  if (r.inputs.length === 0 && !r.vent && !r.boiler && !r.leak && !r.timed) out.push('inputs');
  const all = [...r.inputs, ...(r.gate ? [r.gate] : [])];
  const devices = [...all.flatMap(inputDevices), ...r.onTrue.map(a => a.device), ...r.onFalse.map(a => a.device)];
  const lights = all.flatMap(i => ('light' in i.source ? [i.source.light] : 'daylight' in i.source ? [i.source.daylight] : []));
  if (devices.some(id => !deviceExists(id)) || lights.some(id => !(lightSensorExists ?? deviceExists)(id))
    || (r.vent && [r.vent.sensor, r.vent.than].some(id => !(climateSensorExists ?? deviceExists)(id)))
    || (r.boiler && (!(boilerDeviceExists ?? deviceExists)(r.boiler.device) || !(buttonExists ?? deviceExists)(r.boiler.button)
      || (r.boiler.grid && gridBlockExists && !gridBlockExists(r.boiler.grid.block))))
    || (r.leak && (r.leak.sensors.some(id => !(leakSensorExists ?? deviceExists)(id)) || r.leak.valves.some(id => !(valveExists ?? deviceExists)(id))))
    || (r.timed && (!(timedButtonExists ?? deviceExists)(r.timed.button) || !(timedDeviceExists ?? deviceExists)(r.timed.device)))) out.push('device-missing');
  const known = new Set(rules.map(x => x.id));
  if (ruleRefs(r).some(id => id !== r.id && !known.has(id))) out.push('rule-missing');
  if (ruleCycle(rules, r)) out.push('cycle');
  if (!delayOk(r.onDelay) || !delayOk(r.offDelay)) out.push('delay');
  for (const i of all) {
    const p = paramProblem(i);
    if (p && !out.includes(p)) out.push(p);
  }
  if (r.vent && ventProblem(r, r.vent)) out.push('vent');
  if (r.boiler && boilerProblem(r, r.boiler)) out.push('boiler');
  if (r.leak && leakProblem(r, r.leak)) out.push('leak');
  if (r.timed && timedProblem(r, r.timed)) out.push('timed');
  if (r.boiler?.button && buttonAutoOk && !out.includes('device-missing') && !buttonAutoOk(r.boiler.button)) out.push('boiler-auto');
  if (actionsOf && [...r.onTrue, ...r.onFalse].some(a => { const ok = actionsOf(a.device); return ok !== undefined && !ok.includes(a.do); })) out.push('action');
  return out;
}

/** A vent rule's fixed shape and data bounds; true = violated. */
function ventProblem(r: Rule, v: NonNullable<Rule['vent']>): boolean {
  if (r.inputs.length > 0 || r.gate || r.leak || r.timed || r.combine !== 'any' || r.onDelay !== 0) return true;
  if (!v.sensor || !v.than || v.sensor === v.than) return true;
  if (!isNum(v.above) || !isNum(v.below) || v.above <= 0 || v.below < 0 || v.below > v.above) return true;
  const [on, off] = [r.onTrue[0], r.onFalse[0]];
  return r.onTrue.length !== 1 || r.onFalse.length !== 1 || on.do !== 'on' || off.do !== 'off' || !on.device || on.device !== off.device;
}

/** A leak rule's fixed shape and data bounds; true = violated. */
function leakProblem(r: Rule, l: NonNullable<Rule['leak']>): boolean {
  if (r.vent || r.boiler || r.timed || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0 || r.offDelay !== 0) return true;
  if (r.onTrue.length > 0 || r.onFalse.length > 0) return true;
  const list = (ids: unknown): boolean => Array.isArray(ids) && ids.length >= 1 && ids.every(id => typeof id === 'string' && id !== '') && new Set(ids).size === ids.length;
  return !list(l.sensors) || !list(l.valves);
}

export const isLeakRule = (r: Rule): boolean => r.leak !== undefined;

/** The "Leak protection" template: the zone's participating leak sensors and valves (the lists may be empty; the owner completes them). */
export function leakProtectionTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Leak protection ${zoneName}` : 'Leak protection';
  const level = zoneId === null ? undefined : plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  const members = level ? zoneMembers(level, zoneId as Id).filter(m => m.participates).map(m => m.device) : [];
  rule.leak = { sensors: members.filter(d => d.props.kind === 'leak_sensor').map(d => d.id), valves: members.filter(d => d.props.kind === 'valve').map(d => d.id) };
  return rule;
}

export const TIMED_DEFAULT_MINUTES = 15;

/** A timed switch rule's fixed shape and data bounds; true = violated. */
function timedProblem(r: Rule, t: NonNullable<Rule['timed']>): boolean {
  if (r.vent || r.boiler || r.leak || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0 || r.offDelay !== 0) return true;
  if (r.onTrue.length > 0 || r.onFalse.length > 0) return true;
  if (!t.button || !t.device || t.button === t.device) return true;
  if (!Number.isInteger(t.minutes) || t.minutes < 1 || t.minutes > 1440) return true;
  return t.invert !== undefined && t.invert !== true;
}

export const isTimedRule = (r: Rule): boolean => r.timed !== undefined;

/** The "Timed switch" template: the zone's single button container and single on/off device (else empty), 15 min. */
export function timedTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Timed switch ${zoneName}` : 'Timed switch';
  const level = zoneId === null ? undefined : plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  const members = level ? zoneMembers(level, zoneId as Id).filter(m => m.participates).map(m => m.device) : [];
  const buttons = members.filter(d => d.props.kind === 'wall_switch' || d.props.kind === 'smart_button');
  const devices = members.filter(d => { const a = ruleActionsFor(d); return a.includes('on') && a.includes('off'); });
  rule.timed = { button: buttons.length === 1 ? buttons[0].id : '', device: devices.length === 1 ? devices[0].id : '', minutes: TIMED_DEFAULT_MINUTES };
  return rule;
}

/** A boiler rule's fixed shape and data bounds; true = violated. */
function boilerProblem(r: Rule, b: NonNullable<Rule['boiler']>): boolean {
  if (r.vent || r.leak || r.timed || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0 || r.offDelay !== 0) return true;
  if (r.onTrue.length > 0 || r.onFalse.length > 0) return true;
  if (!b.device || !b.button || b.device === b.button) return true;
  if (b.grid === undefined) return false;
  const g = b.grid;
  return !g.block || !isNum(g.limit) || !isNum(g.nominal) || g.limit <= 0 || g.nominal <= 0;
}

export const isBoilerRule = (r: Rule): boolean => r.boiler !== undefined;

/** A device a boiler rule can drive: control and power bound; equipment only when controllable (as rule actions). */
export const isBoilerDevice = (d: Device): boolean =>
  !!d.bindings?.control && !!d.bindings?.power && (d.props.kind !== 'equipment' || d.props.controllable === true);

/** A boiler button has an Auto action: a wall switch's double toggle, a smart button's auto trigger with an event. */
export function buttonHasAuto(d: Device): boolean {
  const p = d.props;
  if (p.kind === 'wall_switch') return p.autoByDoubleToggle;
  if (p.kind === 'smart_button') return p.autoEnabled && p.auto.event.trim() !== '';
  return true;
}

export const BOILER_LIMIT = 3000;
export const BOILER_NOMINAL = 1400;

/** The "Cost effective boiler" template: the zone's single device with control and power, its single button container, the plan's single grid block. */
export function boilerTemplate(plan: { levels: Level[]; power?: PowerSchema }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Cost effective boiler ${zoneName}` : 'Cost effective boiler';
  const level = zoneId === null ? undefined : plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  const members = level ? zoneMembers(level, zoneId as Id).filter(m => m.participates).map(m => m.device) : [];
  const devices = members.filter(isBoilerDevice);
  const buttons = members.filter(d => d.props.kind === 'wall_switch' || d.props.kind === 'smart_button');
  rule.boiler = { device: devices.length === 1 ? devices[0].id : '', button: buttons.length === 1 ? buttons[0].id : '' };
  const grids = (plan.power?.blocks ?? []).filter(b => b.kind === 'grid');
  if (grids.length === 1) rule.boiler.grid = { block: grids[0].id, limit: BOILER_LIMIT, nominal: BOILER_NOMINAL };
  return rule;
}

export const isVentRule = (r: Rule): boolean => r.vent !== undefined;

const VENT_RUN_ON = 600;

/** The "Wet zone ventilation" template: the zone's first climate sensor, its exhaust fan when exactly one; the owner picks the rest. */
export function ventTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Vent ${zoneName}` : 'Vent';
  rule.offDelay = VENT_RUN_ON;
  const level = zoneId === null ? undefined : plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  const members = level ? zoneMembers(level, zoneId as Id).filter(m => m.participates).map(m => m.device) : [];
  const fans = members.filter(d => d.props.kind === 'exhaust_fan');
  rule.vent = { sensor: members.find(d => d.props.kind === 'climate_sensor')?.id ?? '', than: '', above: 9, below: 5 };
  if (fans.length === 1) {
    rule.onTrue = [{ device: fans[0].id, do: 'on' }];
    rule.onFalse = [{ device: fans[0].id, do: 'off' }];
  }
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
    { source: { light: sensor ?? '', below: 10, hysteresis: 5, unknownDark: true } },
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
  if (p.kind === 'valve') return ['close'];
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
