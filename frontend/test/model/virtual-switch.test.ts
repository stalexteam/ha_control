import { describe, it, expect } from 'vitest';
import { ROLE_SPECS, activeRoleSpecs, bindingStatus, setBinding } from '../../src/model/bindings';
import { addDevice, addUnplacedDevice } from '../../src/model/devices';
import { defaultPower, placeableDevices } from '../../src/model/power';
import type { RuleProblem } from '../../src/model/rules';
import { controlActionsFor, isBlocker, isRuleInputDevice, newRule, ruleActionsFor, ruleProblems } from '../../src/model/rules';
import { DEVICE_PLACEMENTS, deviceDefaults, emptyLevel, normalizeLevel, virtualEntity, type Device, type Level, type Rule } from '../../src/model/types';

const level = (...devices: Device[]): Level => ({ ...emptyLevel('L1'), devices });
const vs = (id = 'v1', over: Partial<Device> = {}): Device => ({
  id, name: 'Sleep', invalid: false, placement: { mode: 'none' }, props: deviceDefaults('virtual_switch', 'free'),
  bindings: { control: `virtual.${id}` }, ...over,
});
const lamp = (id = 'l1'): Device => ({
  id, name: 'Lamp', invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
  props: deviceDefaults('socket', 'free'), bindings: { control: 'switch.lamp' },
});

describe('virtual switch device', () => {
  it('is a kind with no user roles beyond the fixed control; free or wall on the plan', () => {
    expect(deviceDefaults('virtual_switch', 'free')).toEqual({ kind: 'virtual_switch' });
    expect(DEVICE_PLACEMENTS.virtual_switch).toEqual(['free', 'wall']);
    expect(ROLE_SPECS.virtual_switch.map(s => s.role)).toEqual(['control']);
    expect(virtualEntity('v1')).toBe('virtual.v1');
  });

  it('a new one is bound to its own entity: on the plan and not on the plan', () => {
    const placed = addDevice(level(), deviceDefaults('virtual_switch', 'free'), { mode: 'free', x: 100, y: 100, rotation: 0 }, 'Sleep');
    const d = placed.level.devices[0];
    expect(d.bindings).toEqual({ control: `virtual.${d.id}` });
    const unplaced = addUnplacedDevice(level(), 'Sleep', 'virtual_switch');
    const u = unplaced.level.devices[0];
    expect(u.placement).toEqual({ mode: 'none' });
    expect(u.props.kind).toBe('virtual_switch');
    expect(u.bindings).toEqual({ control: `virtual.${u.id}` });
    // equipment stays unbound
    expect(addUnplacedDevice(level(), 'Device 1').level.devices[0].bindings).toBeUndefined();
  });

  it('a loaded one is forced to control = virtual.<its id>: a missing, wrong or extra binding is repaired, a right one kept', () => {
    const good = level(vs());
    expect(normalizeLevel(good)).toBe(good);
    for (const bindings of [undefined, { control: 'switch.x' }, { control: 'virtual.v1', power: 'sensor.p' }, { state: 'switch.y' }]) {
      const out = normalizeLevel(level(vs('v1', { bindings })));
      expect(out.devices[0].bindings).toEqual({ control: 'virtual.v1' });
    }
  });

  it('the user cannot bind it; its status is bound once the entity has a state', () => {
    const l = level(vs());
    expect(setBinding(l, 'v1', 'control', 'switch.x')).toBe(l);
    expect(setBinding(l, 'v1', 'control', null)).toBe(l);
    expect(activeRoleSpecs(l.devices[0]).map(s => s.role)).toEqual(['control']);
    expect(bindingStatus(l.devices[0], e => (e === 'virtual.v1' ? 'present' : 'missing'))).toBe('bound');
  });

  it('is switchable (on, off, toggle), an input and a blocker, never listed in the Power step', () => {
    const d = vs();
    expect(ruleActionsFor(d)).toEqual(['on', 'off']);
    expect(controlActionsFor(d)).toEqual(['on', 'off', 'toggle']);
    expect(isRuleInputDevice(d)).toBe(true);
    expect(isBlocker(d)).toBe(true);
    expect(placeableDevices(level(d, lamp()), defaultPower()).map(x => x.id)).toEqual(['l1']);
  });
});

describe('rule problems of a virtual switch', () => {
  const sleepRule = (over: Partial<Rule>): Rule => ({ ...newRule(null), id: 'r', name: 'R', ...over });
  const virtual = (id: string) => id === 'v1';
  const exists = () => true;

  /** `isVirtual` is the 23rd parameter of ruleProblems. */
  const problems = (r: Rule, isVirtual: ((id: string) => boolean) | undefined = virtual): RuleProblem[] =>
    (ruleProblems as (...a: unknown[]) => RuleProblem[])([], r, exists, ...Array<undefined>(19).fill(undefined), isVirtual);

  it('a rule must not switch a virtual switch it reads as a direct input (with or without NOT)', () => {
    expect(problems(sleepRule({ inputs: [{ source: { device: 'v1' }, not: true }], onTrue: [{ device: 'v1', do: 'off' }] }))).toContain('virtual-read');
    expect(problems(sleepRule({ inputs: [{ source: { device: 'v1' } }], onFalse: [{ device: 'v1', do: 'on' }] }))).toContain('virtual-read');
  });

  it('is not refused: another virtual switch, a real device, a Held source, no virtual predicate', () => {
    const args = (r: Rule) => problems(r);
    expect(args(sleepRule({ inputs: [{ source: { device: 'v2' } }], onTrue: [{ device: 'v1', do: 'off' }] }))).toEqual([]);
    expect(args(sleepRule({ inputs: [{ source: { device: 'l1' } }], onTrue: [{ device: 'l1', do: 'off' }] }))).toEqual([]);
    expect(args(sleepRule({ inputs: [{ source: { held: { sources: [{ device: 'v1' }], state: 'on', seconds: 60 } } }], onTrue: [{ device: 'v1', do: 'off' }] }))).toEqual([]);
    const same = sleepRule({ inputs: [{ source: { device: 'v1' } }], onTrue: [{ device: 'v1', do: 'off' }] });
    expect(ruleProblems([], same, exists)).toEqual([]);
  });
});

describe('the blocker of a light motion control rule', () => {
  const ml = (blocker: unknown): Rule => ({
    ...newRule(null), id: 'm', name: 'M',
    motionLight: { light: 'lamp', sensors: [], minOn: 0, buttons: [], autoAfter: 0, ...(blocker === undefined ? {} : { blocker }) } as Rule['motionLight'],
  });
  const problems = (r: Rule, blockerExists?: (id: string) => boolean): RuleProblem[] =>
    (ruleProblems as (...a: unknown[]) => RuleProblem[])([], r, () => true, ...Array<undefined>(20).fill(undefined), blockerExists);

  it('is optional; a device and on / off; never the light itself', () => {
    expect(problems(ml(undefined))).toEqual([]);
    expect(problems(ml({ device: 'v1', is: 'on' }))).toEqual([]);
    expect(problems(ml({ device: 'v1', is: 'off' }))).toEqual([]);
    expect(problems(ml({ device: 'lamp', is: 'on' }))).toContain('motionLight');
    expect(problems(ml({ device: 'v1', is: 'maybe' }))).toContain('motionLight');
    expect(problems(ml({ device: '', is: 'on' }))).toContain('motionLight');
  });

  it('a blocker that is not a device taking on and off counts as a missing device', () => {
    expect(problems(ml({ device: 'v1', is: 'on' }), id => id === 'v1')).toEqual([]);
    expect(problems(ml({ device: 'x', is: 'on' }), id => id === 'v1')).toContain('device-missing');
  });
});
