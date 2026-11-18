/** Pure ops on condition rules (`Plan.rules`). Rules are plan-level: they reference devices and rules of any level. */
import { zoneMembers } from '../geometry/zones';
import { newId } from './ids';
import type { PowerSchema } from './power';
import { isButtonSource, type ControlAction, type ControlDo, type ControlSource, type Device, type Id, type Level, type Rule, type RuleDo, type RuleInput } from './types';

export { isButtonSource };

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

/** The condition inputs of a load control rule's sources (buttons are not inputs). */
const controlInputs = (r: Rule): RuleInput[] => (Array.isArray(r.control?.sources) ? r.control.sources : []).filter((s): s is RuleInput => typeof s === 'object' && s !== null && !isButtonSource(s));

/** Every rule id the rule references: inputs, the gate, held sources and a load control rule's sources. */
export const ruleRefs = (r: Rule): Id[] => [...r.inputs, ...controlInputs(r), ...(r.gate ? [r.gate] : [])].flatMap(inputRefs);

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

export type RuleProblem = 'name' | 'inputs' | 'device-missing' | 'rule-missing' | 'cycle' | 'delay' | 'action' | 'light' | 'daylight' | 'time' | 'held' | 'vent' | 'boiler' | 'boiler-auto' | 'leak' | 'timed' | 'outside' | 'beurer' | 'control' | 'motionLight';

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
 * (timed rules); default = any existing device. `outsideLightExists` (optional) tells whether an id is a device taking
 * 'on' (outside light rules; the sensor is checked with `lightSensorExists`); default = any existing device.
 * `heaterExists` / `powerSourceExists` (optional) tell whether an id is a device taking 'on' / a device with a power reading
 * (beurer rules); default = any existing device. `controlSourceExists` / `controlLoadExists` (optional) tell whether an id is a button /
 * wall switch / motion sensor and a device taking 'on' and 'off' (control rules); default = any existing device.
 * `motionLightExists` / `motionSensorExists` / `motionButtonExists` (optional) tell whether an id is a device taking 'on' and 'off' / a motion sensor /
 * a smart button or a wall switch with a state entity (motion light rules; the daylight sensor is checked with `lightSensorExists`); default = any existing device.
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
  outsideLightExists?: (id: Id) => boolean,
  heaterExists?: (id: Id) => boolean,
  powerSourceExists?: (id: Id) => boolean,
  controlSourceExists?: (id: Id) => boolean,
  controlLoadExists?: (id: Id) => boolean,
  motionLightExists?: (id: Id) => boolean,
  motionSensorExists?: (id: Id) => boolean,
  motionButtonExists?: (id: Id) => boolean,
): RuleProblem[] {
  const out: RuleProblem[] = [];
  if (!r.name.trim()) out.push('name');
  if (r.inputs.length === 0 && !r.vent && !r.boiler && !r.leak && !r.timed && !r.outside && !r.beurer && !r.control && !r.motionLight) out.push('inputs');
  const ctl = r.control;
  const ctlButtons = (Array.isArray(ctl?.sources) ? ctl.sources : []).filter((s): s is { button: Id } => typeof s === 'object' && s !== null && isButtonSource(s)).map(s => s.button);
  const ctlTargets = ctl ? ([ctl.on, ctl.off, ctl.toggle] as unknown[]).flatMap(l => (Array.isArray(l) ? (l as ControlAction[]) : [])) : [];
  const all = [...r.inputs, ...controlInputs(r), ...(r.gate ? [r.gate] : [])];
  const devices = [...all.flatMap(inputDevices), ...r.onTrue.map(a => a.device), ...r.onFalse.map(a => a.device)];
  const lights = all.flatMap(i => ('light' in i.source ? [i.source.light] : 'daylight' in i.source ? [i.source.daylight] : []));
  if (devices.some(id => !deviceExists(id)) || lights.some(id => !(lightSensorExists ?? deviceExists)(id))
    || (r.vent && [r.vent.sensor, r.vent.than].some(id => !(climateSensorExists ?? deviceExists)(id)))
    || (r.boiler && (!(boilerDeviceExists ?? deviceExists)(r.boiler.device) || !(buttonExists ?? deviceExists)(r.boiler.button)
      || (r.boiler.grid && gridBlockExists && !gridBlockExists(r.boiler.grid.block))))
    || (r.leak && (r.leak.sensors.some(id => !(leakSensorExists ?? deviceExists)(id)) || r.leak.valves.some(id => !(valveExists ?? deviceExists)(id))))
    || (r.timed && (!(timedButtonExists ?? deviceExists)(r.timed.button) || !(timedDeviceExists ?? deviceExists)(r.timed.device)))
    || (r.outside && (!(outsideLightExists ?? deviceExists)(r.outside.light) || !(lightSensorExists ?? deviceExists)(r.outside.sensor)))
    || (r.beurer && (!(heaterExists ?? deviceExists)(r.beurer.heater) || !(powerSourceExists ?? deviceExists)(r.beurer.source)))
    || (r.motionLight && (!(motionLightExists ?? deviceExists)(r.motionLight.light) || r.motionLight.sensors.some(id => !(motionSensorExists ?? deviceExists)(id))
      || r.motionLight.buttons.some(id => !(motionButtonExists ?? deviceExists)(id)) || (r.motionLight.daylight && !(lightSensorExists ?? deviceExists)(r.motionLight.daylight.sensor))))
    || ctlButtons.some(id => !(controlSourceExists ?? deviceExists)(id)) || ctlTargets.some(a => !(controlLoadExists ?? deviceExists)(a.device))) out.push('device-missing');
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
  if (r.outside && outsideProblem(r, r.outside)) out.push('outside');
  if (r.beurer && beurerProblem(r, r.beurer)) out.push('beurer');
  if (r.control && controlProblem(r, r.control)) out.push('control');
  if (r.motionLight && motionLightProblem(r, r.motionLight)) out.push('motionLight');
  if (r.boiler?.button && buttonAutoOk && !out.includes('device-missing') && !buttonAutoOk(r.boiler.button)) out.push('boiler-auto');
  if (actionsOf && [...r.onTrue, ...r.onFalse].some(a => { const ok = actionsOf(a.device); return ok !== undefined && !ok.includes(a.do); })) out.push('action');
  if (ctl && ctlTargets.some(a => !CONTROL_DOS.includes(a.do) || (actionsOf && !controlDoOk(a.do, actionsOf(a.device))))) out.push('action');
  return out;
}

/** A vent rule's fixed shape and data bounds; true = violated. */
function ventProblem(r: Rule, v: NonNullable<Rule['vent']>): boolean {
  if (r.inputs.length > 0 || r.motionLight || r.beurer || r.control || r.gate || r.leak || r.timed || r.outside || r.combine !== 'any' || r.onDelay !== 0) return true;
  if (!v.sensor || !v.than || v.sensor === v.than) return true;
  if (!isNum(v.above) || !isNum(v.below) || v.above <= 0 || v.below < 0 || v.below > v.above) return true;
  const [on, off] = [r.onTrue[0], r.onFalse[0]];
  return r.onTrue.length !== 1 || r.onFalse.length !== 1 || on.do !== 'on' || off.do !== 'off' || !on.device || on.device !== off.device;
}

/** A leak rule's fixed shape and data bounds; true = violated. */
function leakProblem(r: Rule, l: NonNullable<Rule['leak']>): boolean {
  if (r.vent || r.boiler || r.timed || r.outside || r.beurer || r.control || r.motionLight || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0 || r.offDelay !== 0) return true;
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
  if (r.vent || r.boiler || r.leak || r.outside || r.beurer || r.control || r.motionLight || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0 || r.offDelay !== 0) return true;
  if (r.onTrue.length > 0 || r.onFalse.length > 0) return true;
  if (!t.button || !t.device || t.button === t.device) return true;
  if (!Number.isInteger(t.minutes) || t.minutes < 1 || t.minutes > 1440) return true;
  return t.invert !== undefined && t.invert !== true;
}

export const isTimedRule = (r: Rule): boolean => r.timed !== undefined;

export const OUTSIDE_DEFAULT_PAUSE = 30;

/** An outside light rule's fixed shape and data bounds; true = violated. */
function outsideProblem(r: Rule, o: NonNullable<Rule['outside']>): boolean {
  if (r.vent || r.boiler || r.leak || r.timed || r.beurer || r.control || r.motionLight || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0 || r.offDelay !== 0) return true;
  if (r.onTrue.length > 0 || r.onFalse.length > 0) return true;
  if (!o.light || !o.sensor || o.light === o.sensor) return true;
  if (o.noDataNight !== undefined && o.noDataNight !== true) return true;
  if (o.afterSunset !== undefined && o.afterSunset !== true) return true;
  if (!Number.isInteger(o.pause) || o.pause < 0 || o.pause > 1440) return true;
  if (o.window === undefined) return false;
  const { from, to } = o.window;
  return !(typeof from === 'string' && typeof to === 'string' && TIME_RE.test(from) && TIME_RE.test(to) && from !== to);
}

export const BEURER_DEFAULTS = { above: 200, offDelay: 60, keep: 10, every: 30 } as const;

/** A beurer heater rule's fixed shape and data bounds; true = violated. */
function beurerProblem(r: Rule, b: NonNullable<Rule['beurer']>): boolean {
  if (r.vent || r.boiler || r.leak || r.timed || r.outside || r.control || r.motionLight || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0) return true;
  if (r.onTrue.length > 0 || r.onFalse.length > 0) return true;
  if (!b.heater || !b.source || b.heater === b.source) return true;
  if (!isNum(b.above) || b.above <= 0) return true;
  return ![b.keep, b.every].every(n => Number.isInteger(n) && n >= 0 && n <= 1440);
}

const CONTROL_DOS: ControlDo[] = ['on', 'off', 'toggle', 'close'];

/** The actions a device takes in a load control rule: on / off / toggle when it takes on and off, close for a valve, else none. */
export function controlActionsFor(d: Device): ControlDo[] {
  const a = ruleActionsFor(d);
  return a.includes('on') && a.includes('off') ? ['on', 'off', 'toggle'] : a.includes('close') ? ['close'] : [];
}

/** `do` against what the device takes as a rule action (`ruleActionsFor`); undefined (device unknown) is no problem. */
const controlDoOk = (d: ControlDo, taken: RuleDo[] | undefined): boolean =>
  taken === undefined || (d === 'close' ? taken.includes('close') : taken.includes('on') && taken.includes('off'));

/** JSON equality whatever the key order. */
function jsonEqual(a: unknown, b: unknown): boolean {
  const canon = (_k: string, v: unknown): unknown =>
    v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([x], [y]) => (x < y ? -1 : 1))) : v;
  return JSON.stringify(a, canon) === JSON.stringify(b, canon);
}

/** A load control rule's fixed shape and data bounds; true = violated. */
function controlProblem(r: Rule, c: NonNullable<Rule['control']>): boolean {
  if (r.vent || r.boiler || r.leak || r.timed || r.outside || r.beurer || r.motionLight || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0 || r.offDelay !== 0) return true;
  if (r.onTrue.length > 0 || r.onFalse.length > 0) return true;
  const lists = [c.on, c.off, c.toggle];
  if (!Array.isArray(c.sources) || c.sources.length === 0 || !lists.every(Array.isArray) || lists.every(l => l.length === 0)) return true;
  const sourceOk = (s: unknown): boolean => typeof s === 'object' && s !== null && (isButtonSource(s as ControlSource)
    ? typeof (s as { button: unknown }).button === 'string' && (s as { button: string }).button !== '' : typeof (s as RuleInput).source === 'object' && (s as RuleInput).source !== null);
  if (!c.sources.every(sourceOk) || c.sources.some((s, i) => c.sources.some((o, k) => k < i && jsonEqual(s, o)))) return true;
  const listOk = (l: ControlAction[]): boolean => l.every(a => typeof a === 'object' && a !== null && typeof a.device === 'string' && a.device !== '') && new Set(l.map(a => a.device)).size === l.length;
  if (!lists.every(listOk)) return true;
  const read = new Set(controlInputs(r).flatMap(inputDevices));
  return lists.some(l => l.some(a => read.has(a.device)));
}

export const isControlRule = (r: Rule): boolean => r.control !== undefined;

/** The "Load control" template: the zone's single participating wall switch / smart button and single on/off device (else empty; no load when it is the wall switch's own relay); motion sensors are never pre-picked. */
export function controlTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Load control ${zoneName}` : 'Load control';
  const level = zoneId === null ? undefined : plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  const members = level ? zoneMembers(level, zoneId as Id).filter(m => m.participates).map(m => m.device) : [];
  const buttons = members.filter(d => d.props.kind === 'wall_switch' || d.props.kind === 'smart_button');
  const loads = members.filter(d => { const a = ruleActionsFor(d); return a.includes('on') && a.includes('off'); });
  const source = buttons.length === 1 ? buttons[0] : undefined;
  const load = loads.length === 1 ? loads[0] : undefined;
  const sameRelay = source?.props.kind === 'wall_switch' && !!source.bindings?.state && source.bindings.state === load?.bindings?.control;
  const act = (do_: ControlDo): ControlAction[] => (load && !sameRelay ? [{ device: load.id, do: do_ }] : []);
  rule.control = { sources: source ? [source.props.kind === 'smart_button' ? { button: source.id } : { source: { device: source.id } }] : [], on: act('on'), off: act('off'), toggle: act('toggle') };
  return rule;
}

/**
 * Converts a 0.20.0 load control rule (`control: { sources: Id[], loads: Id[] }`) to the event shape: a smart button id
 * becomes `{ button }`, any other id a device input; `on`, `off` and `toggle` hold every load. The same object comes back
 * for any other rule, so a plan without such a rule is unchanged. `kindOf` gives a device's `props.kind`.
 */
export function migrateControl(rule: Rule, kindOf: (id: Id) => string | undefined): Rule {
  const c = rule.control as unknown as { sources?: unknown; loads?: unknown; on?: unknown } | undefined;
  if (!c || 'on' in c || !Array.isArray(c.sources) || !Array.isArray(c.loads) || ![...c.sources, ...c.loads].every(id => typeof id === 'string')) return rule;
  const loads = c.loads as Id[];
  const act = (do_: ControlDo): ControlAction[] => loads.map(device => ({ device, do: do_ }));
  const sources = (c.sources as Id[]).map((id): ControlSource => (kindOf(id) === 'smart_button' ? { button: id } : { source: { device: id } }));
  return { ...rule, control: { sources, on: act('on'), off: act('off'), toggle: act('toggle') } };
}

export const isBeurerRule = (r: Rule): boolean => r.beurer !== undefined;

/** The "Beurer heater" template: empty heater and power source, defaults 200 W / off after 60 s / keep 10 min / every 30 min. */
export function beurerTemplate(zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Beurer heater ${zoneName}` : 'Beurer heater';
  rule.offDelay = BEURER_DEFAULTS.offDelay;
  rule.beurer = { heater: '', source: '', above: BEURER_DEFAULTS.above, keep: BEURER_DEFAULTS.keep, every: BEURER_DEFAULTS.every };
  return rule;
}

export const isOutsideRule = (r: Rule): boolean => r.outside !== undefined;

/** The "Outside light" template: the zone's single participating on/off light and the plan's single illuminance sensor (else empty), pause 30. */
export function outsideTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Outside light ${zoneName}` : 'Outside light';
  const level = zoneId === null ? undefined : plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  const members = level ? zoneMembers(level, zoneId as Id).filter(m => m.participates).map(m => m.device) : [];
  const lights = members.filter(d => (d.props.kind === 'ceiling_light' || d.props.kind === 'wall_light') && ruleActionsFor(d).includes('on'));
  const sensors = plan.levels.flatMap(l => l.devices).filter(d => d.props.kind === 'illuminance_sensor');
  rule.outside = { light: lights.length === 1 ? lights[0].id : '', sensor: sensors.length === 1 ? sensors[0].id : '', noDataNight: true, afterSunset: true, pause: OUTSIDE_DEFAULT_PAUSE };
  return rule;
}

export const MOTION_LIGHT_DEFAULTS = { offDelay: 180, minOn: 0, autoAfter: 0, is: 'dark' } as const;

/** A light motion control rule's fixed shape and data bounds; true = violated. */
function motionLightProblem(r: Rule, m: NonNullable<Rule['motionLight']>): boolean {
  if (r.vent || r.boiler || r.leak || r.timed || r.outside || r.beurer || r.control || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0) return true;
  if (r.onTrue.length > 0 || r.onFalse.length > 0) return true;
  const list = (ids: unknown): ids is Id[] => Array.isArray(ids) && ids.every(id => typeof id === 'string' && id !== '') && new Set(ids).size === ids.length;
  if (typeof m.light !== 'string' || m.light === '' || !list(m.sensors) || !list(m.buttons)) return true;
  if (m.sensors.includes(m.light) || m.buttons.includes(m.light)) return true;
  if (m.daylight !== undefined && (typeof m.daylight !== 'object' || m.daylight === null || typeof m.daylight.sensor !== 'string' || m.daylight.sensor === '' || (m.daylight.is !== 'night' && m.daylight.is !== 'dark'))) return true;
  return !Number.isInteger(m.minOn) || m.minOn < 0 || m.minOn > 3600 || !Number.isInteger(m.autoAfter) || m.autoAfter < 0 || m.autoAfter > 1440;
}

export const isMotionLightRule = (r: Rule): boolean => r.motionLight !== undefined;

/** A button of a light motion control rule: a smart button, or a wall switch with a bound state entity. */
export const isMotionButton = (d: Device): boolean => d.props.kind === 'smart_button' || (d.props.kind === 'wall_switch' && !!d.bindings?.state);

/** The "Light motion control" template: the zone's single participating on/off ceiling / wall light, all its motion sensors, smart buttons and the wall switches over the light's own entity, the plan's single illuminance sensor (daylight 'dark'); never invents a device. */
export function motionLightTemplate(plan: { levels: Level[] }, zoneId: Id | null, zoneName: string | null): Rule {
  const rule = newRule(zoneId);
  rule.name = zoneId !== null && zoneName ? `Light motion control ${zoneName}` : 'Light motion control';
  rule.offDelay = MOTION_LIGHT_DEFAULTS.offDelay;
  const level = zoneId === null ? undefined : plan.levels.find(l => l.zones.some(z => z.id === zoneId));
  const members = level ? zoneMembers(level, zoneId as Id).filter(m => m.participates).map(m => m.device) : [];
  const lights = members.filter(d => (d.props.kind === 'ceiling_light' || d.props.kind === 'wall_light') && ruleActionsFor(d).includes('on') && ruleActionsFor(d).includes('off'));
  const lux = plan.levels.flatMap(l => l.devices).filter(d => d.props.kind === 'illuminance_sensor');
  const light = lights.length === 1 ? lights[0] : undefined;
  rule.motionLight = {
    light: light ? light.id : '',
    sensors: members.filter(d => d.props.kind === 'motion_sensor').map(d => d.id),
    ...(lux.length === 1 ? { daylight: { sensor: lux[0].id, is: MOTION_LIGHT_DEFAULTS.is } } : {}),
    minOn: MOTION_LIGHT_DEFAULTS.minOn,
    buttons: members.filter(d => d.props.kind === 'smart_button' || (!!light?.bindings?.control && d.props.kind === 'wall_switch' && d.bindings?.state === light.bindings.control)).map(d => d.id),
    autoAfter: MOTION_LIGHT_DEFAULTS.autoAfter,
  };
  return rule;
}

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
  if (r.vent || r.leak || r.timed || r.outside || r.beurer || r.control || r.motionLight || r.gate || r.inputs.length > 0 || r.combine !== 'any' || r.onDelay !== 0 || r.offDelay !== 0) return true;
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
export const ruleEqual = (a: Rule, b: Rule): boolean => jsonEqual(a, b);
