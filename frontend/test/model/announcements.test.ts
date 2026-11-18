import { describe, it, expect } from 'vitest';
import { deviceLive } from '../../src/live/device-live';
import { ROLE_SPECS, activeRoleSpecs, bindingStatus, sanitizeBindings, setBinding } from '../../src/model/bindings';
import { addUnplacedDevice, moveDevice } from '../../src/model/devices';
import { controlActionsFor, controlEvents, eventSourceLabel, newRule, ruleActionsFor, ruleProblems, ruleUsers } from '../../src/model/rules';
import { DEVICE_PLACEMENTS, deviceDefaults, emptyLevel, normalizeLevel, type Device, type Level, type Plan, type Rule } from '../../src/model/types';

const level = (...devices: Device[]): Level => ({ ...emptyLevel('L1'), devices });
const speaker = (over: Partial<Device> = {}): Device => ({
  id: 'sp', name: 'Speaker', invalid: false, placement: { mode: 'none' }, props: deviceDefaults('speaker', 'free'),
  bindings: { player: 'media_player.vlc', voice: 'tts.piper' }, ...over,
});
const phone = (over: Partial<Device> = {}): Device => ({
  id: 'ph', name: 'Phone', invalid: false, placement: { mode: 'none' }, props: { kind: 'phone', notify: 'mobile_app_phone' }, ...over,
});
const lamp: Device = {
  id: 'l1', name: 'Lamp', invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
  props: deviceDefaults('socket', 'free'), bindings: { control: 'switch.lamp' },
};
const button: Device = {
  id: 'b1', name: 'Button', invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
  props: deviceDefaults('smart_button', 'free'), bindings: { on: 'sensor.b_action' },
};
const boilerDev: Device = {
  id: 'bo', name: 'Boiler', invalid: false, placement: { mode: 'none' }, props: deviceDefaults('equipment', 'free'),
  bindings: { control: 'switch.boiler', power: 'sensor.boiler_power' },
};

const rule = (over: Partial<Rule>): Rule => ({ ...newRule(null), id: 'r', name: 'R', ...over });
const lightRule: Rule = rule({ id: 'ml', name: 'Light Main', motionLight: { light: 'l1', sensors: [], minOn: 0, buttons: [], autoAfter: 0 }, offDelay: 180 });
const boilerRule: Rule = rule({ id: 'bl', name: 'Boiler', boiler: { device: 'bo', button: 'b1' } });
const devices = [speaker(), phone(), lamp, button, boilerDev];
const problems = (rules: Rule[], r: Rule, ds: Device[] = devices) => ruleProblems(rules, r, id => ds.some(d => d.id === id),
  id => { const d = ds.find(x => x.id === id); return d && ruleActionsFor(d); });

describe('speaker and phone devices', () => {
  it('speaker: player (media_player, required) and voice (tts, optional); free / wall on the plan', () => {
    expect(deviceDefaults('speaker', 'free')).toEqual({ kind: 'speaker' });
    expect(DEVICE_PLACEMENTS.speaker).toEqual(['free', 'wall']);
    expect(ROLE_SPECS.speaker).toEqual([
      { role: 'player', domains: ['media_player'], primary: true },
      { role: 'voice', domains: ['tts'], primary: false },
    ]);
  });

  it('phone: no entity roles, never placed on the plan, only a notify service prop', () => {
    expect(DEVICE_PLACEMENTS.phone).toEqual([]);
    expect(ROLE_SPECS.phone).toEqual([]);
    expect(deviceDefaults('phone', 'free')).toEqual({ kind: 'phone' });
    const l = level(phone());
    expect(moveDevice(l, 'ph', { mode: 'free', x: 1, y: 1, rotation: 0 })).toBe(l);
  });

  it('"New ..." under Not on the plan adds a speaker or a phone off the plan, with no bindings', () => {
    for (const kind of ['speaker', 'phone'] as const) {
      const made = addUnplacedDevice(level(), kind === 'speaker' ? 'Speaker 1' : 'Phone 1', kind);
      const d = made.level.devices[0];
      expect(d).toMatchObject({ placement: { mode: 'none' }, props: { kind } });
      expect(d.bindings).toBeUndefined();
    }
  });

  it('the server binds a speaker strictly to player / voice: foreign roles are dropped on load, a phone keeps none', () => {
    const out = normalizeLevel(level(speaker({ bindings: { player: 'media_player.vlc', control: 'switch.x', state: 'switch.y' } as Device['bindings'] }),
      phone({ bindings: { control: 'switch.z' } })));
    expect(out.devices[0].bindings).toEqual({ player: 'media_player.vlc' });
    expect(out.devices[1].bindings).toBeUndefined();
    const good = level(speaker());
    expect(normalizeLevel(good)).toBe(good);
    expect(sanitizeBindings(speaker({ bindings: { voice: '' } })).bindings).toBeUndefined();
  });

  it('setBinding accepts player and voice of a speaker only', () => {
    const l = level(speaker({ bindings: undefined }));
    expect(setBinding(setBinding(l, 'sp', 'player', 'media_player.a'), 'sp', 'voice', 'tts.b').devices[0].bindings)
      .toEqual({ player: 'media_player.a', voice: 'tts.b' });
    expect(setBinding(l, 'sp', 'control', 'switch.x')).toBe(l);
    expect(setBinding(level(phone()), 'ph', 'player', 'media_player.a').devices[0].bindings).toBeUndefined();
    expect(activeRoleSpecs(speaker()).map(s => s.role)).toEqual(['player', 'voice']);
  });

  it('binding status: a speaker needs its player, a phone its notify service', () => {
    const present = () => 'present' as const;
    expect(bindingStatus(speaker(), present)).toBe('bound');
    expect(bindingStatus(speaker({ bindings: { voice: 'tts.piper' } }), present)).toBe('partial');
    expect(bindingStatus(speaker({ bindings: undefined }), present)).toBe('unbound');
    expect(bindingStatus(phone(), present)).toBe('bound');
    expect(bindingStatus(phone({ props: { kind: 'phone' } }), present)).toBe('unbound');
  });
});

describe('live look of a speaker', () => {
  const states = { 'media_player.vlc': { state: 'playing', attributes: {} }, 'media_player.idle': { state: 'idle', attributes: {} }, 'media_player.off': { state: 'unavailable', attributes: {} } };
  it('on while its player plays, off while it does anything else, no data when the player has none', () => {
    expect(deviceLive(speaker({ bindings: { player: 'media_player.vlc' } }), states).look).toBe('on');
    expect(deviceLive(speaker({ bindings: { player: 'media_player.idle' } }), states).look).toBe('off');
    expect(deviceLive(speaker({ bindings: { player: 'media_player.off' } }), states).look).toBe('no-data');
    expect(deviceLive(speaker({ bindings: { player: 'media_player.nope' } }), states).look).toBe('no-data');
    expect(deviceLive(speaker({ bindings: undefined }), states).look).toBe('none');
    expect(deviceLive(phone(), states).look).toBe('none');
  });
});

describe('announcement actions of a device', () => {
  it('a speaker plays, and says only with a voice; a phone notifies', () => {
    expect(ruleActionsFor(speaker())).toEqual(['say', 'play']);
    expect(ruleActionsFor(speaker({ bindings: { player: 'media_player.vlc' } }))).toEqual(['play']);
    expect(ruleActionsFor(phone())).toEqual(['notify']);
    expect(controlActionsFor(speaker())).toEqual(['say', 'play']);
    expect(controlActionsFor(phone())).toEqual(['notify']);
    expect(controlActionsFor(lamp)).toEqual(['on', 'off', 'toggle']);
  });
});

describe('rule problems of announcements', () => {
  it('a Condition rule: text / media must be non-empty, the title optional but non-empty', () => {
    const base = { inputs: [{ source: { device: 'l1' } }] };
    const ok = rule({ ...base, onTrue: [{ device: 'sp', do: 'say', text: 'Go bathe' }, { device: 'sp', do: 'play', media: 'media-source://a.mp3' }, { device: 'ph', do: 'notify', text: 'Hi', title: 'Boiler' }] });
    expect(problems([ok], ok)).toEqual([]);
    for (const bad of [{ device: 'sp', do: 'say', text: '  ' }, { device: 'sp', do: 'say' }, { device: 'sp', do: 'play', media: '' },
      { device: 'ph', do: 'notify', text: 'x', title: ' ' }, { device: 'ph', do: 'notify' }]) {
      const r = rule({ ...base, onTrue: [bad as Rule['onTrue'][number]] });
      expect(problems([r], r)).toContain('announce');
    }
  });

  it('an announcement the device cannot take is the action problem (say without a voice, play on a phone)', () => {
    const noVoice = [speaker({ bindings: { player: 'media_player.vlc' } }), phone(), lamp];
    const r = rule({ inputs: [{ source: { device: 'l1' } }], onTrue: [{ device: 'sp', do: 'say', text: 'x' }] });
    expect(problems([r], r, noVoice)).toContain('action');
    const r2 = rule({ inputs: [{ source: { device: 'l1' } }], onFalse: [{ device: 'ph', do: 'play', media: 'x' }] });
    expect(problems([r2], r2)).toContain('action');
  });

  it('a Load control rule: announcements are unique per (device, do); play + say on one speaker is fine', () => {
    const c = (on: unknown[]) => rule({ control: { sources: [{ button: 'b1' }], on, off: [], toggle: [] } as unknown as Rule['control'] });
    const ok = c([{ device: 'sp', do: 'play', media: 'a' }, { device: 'sp', do: 'say', text: 'b' }, { device: 'ph', do: 'notify', text: 'c' }]);
    expect(problems([ok], ok)).toEqual([]);
    const twice = c([{ device: 'sp', do: 'say', text: 'a' }, { device: 'sp', do: 'say', text: 'b' }]);
    expect(problems([twice], twice)).toContain('control');
    const lampTwice = c([{ device: 'l1', do: 'on' }, { device: 'l1', do: 'off' }]);
    expect(problems([lampTwice], lampTwice)).toContain('control');
    const empty = c([{ device: 'sp', do: 'say', text: '' }]);
    expect(problems([empty], empty)).toContain('announce');
  });
});

describe('event sources of purpose-built rules', () => {
  const ctl = (sources: unknown[]) => rule({ id: 'lc', name: 'Auto sound', control: { sources, on: [{ device: 'sp', do: 'play', media: 'a' }], off: [], toggle: [] } as unknown as Rule['control'] });

  it('the events of a rule by its kind: light motion auto / manual, boiler auto / manual / done, nothing else', () => {
    expect(controlEvents(lightRule)).toEqual(['auto', 'manual']);
    expect(controlEvents(boilerRule)).toEqual(['auto', 'manual', 'done']);
    expect(controlEvents(rule({ inputs: [{ source: { device: 'l1' } }] }))).toEqual([]);
    expect(controlEvents(ctl([{ button: 'b1' }]))).toEqual([]);
  });

  it('is worded "<rule name>: entered auto / entered manual / heating done"', () => {
    expect(eventSourceLabel('Light Main', 'auto')).toBe('Light Main: entered auto');
    expect(eventSourceLabel('Light Main', 'manual')).toBe('Light Main: entered manual');
    expect(eventSourceLabel('Boiler', 'done')).toBe('Boiler: heating done');
  });

  it('accepts a valid event source and refuses a wrong what, a wrong kind and a bad shape', () => {
    const rules = [lightRule, boilerRule];
    const ok = ctl([{ event: { rule: 'ml', what: 'auto' } }, { event: { rule: 'bl', what: 'done' } }]);
    expect(problems([...rules, ok], ok)).toEqual([]);
    for (const src of [{ event: { rule: 'ml', what: 'done' } }, { event: { rule: 'lc', what: 'auto' } }, { event: { rule: 'ml' } },
      { event: { rule: 'ml', what: 'auto', x: 1 } }, { event: 'ml' }, { event: { rule: 'ml', what: 'auto' }, button: 'b1' }]) {
      const r = ctl([src]);
      expect(problems([...rules, r], r), JSON.stringify(src)).toContain('control');
    }
    const twice = ctl([{ event: { rule: 'ml', what: 'auto' } }, { event: { rule: 'ml', what: 'auto' } }]);
    expect(problems([...rules, twice], twice)).toContain('control');
  });

  it('a missing rule is named (the server accepts it, the engine says "rule missing")', () => {
    const r = ctl([{ event: { rule: 'gone', what: 'auto' } }]);
    expect(problems([r], r)).toContain('rule-missing');
  });

  it('deleting a rule names the Load control rules that listen to it', () => {
    const r = ctl([{ event: { rule: 'ml', what: 'auto' } }]);
    expect(ruleUsers([lightRule, r], 'ml').map(x => x.name)).toEqual(['Auto sound']);
  });
});

describe('contract: a plan the panel builds is what the server validates', () => {
  it('both devices, the three actions and the event sources have exactly the server shapes', () => {
    const lc = rule({
      id: 'lc', name: 'Go bathe',
      control: {
        sources: [{ event: { rule: 'bl', what: 'done' } }, { event: { rule: 'ml', what: 'auto' } }],
        on: [{ device: 'sp', do: 'say', text: 'Go bathe' }, { device: 'sp', do: 'play', media: 'media-source://media_source/local/Auto.mp3' },
          { device: 'ph', do: 'notify', text: 'Boiler is hot', title: 'Boiler' }],
        off: [], toggle: [],
      },
    });
    const cond = rule({ id: 'c', name: 'Cond', inputs: [{ source: { device: 'l1' } }], onTrue: [{ device: 'ph', do: 'notify', text: 'on' }], onFalse: [{ device: 'sp', do: 'say', text: 'off' }] });
    const plan: Plan = { id: 'P', name: 'P', schemaVersion: 2, revision: 1, levels: [level(...devices)], rules: [lightRule, boilerRule, lc, cond] };
    expect(problems(plan.rules!, lc)).toEqual([]);
    expect(problems(plan.rules!, cond)).toEqual([]);
    const json = JSON.parse(JSON.stringify(plan)) as Plan;
    expect(json.levels[0].devices.find(d => d.id === 'sp')).toMatchObject({ props: { kind: 'speaker' }, bindings: { player: 'media_player.vlc', voice: 'tts.piper' } });
    expect(json.levels[0].devices.find(d => d.id === 'ph')).toMatchObject({ props: { kind: 'phone', notify: 'mobile_app_phone' } });
    expect(json.rules!.find(r => r.id === 'lc')!.control).toEqual({
      sources: [{ event: { rule: 'bl', what: 'done' } }, { event: { rule: 'ml', what: 'auto' } }],
      on: [{ device: 'sp', do: 'say', text: 'Go bathe' }, { device: 'sp', do: 'play', media: 'media-source://media_source/local/Auto.mp3' },
        { device: 'ph', do: 'notify', text: 'Boiler is hot', title: 'Boiler' }],
      off: [], toggle: [],
    });
    expect(json.rules!.find(r => r.id === 'c')).toMatchObject({ onTrue: [{ device: 'ph', do: 'notify', text: 'on' }], onFalse: [{ device: 'sp', do: 'say', text: 'off' }] });
  });
});
