// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderMotionLightTrace, motionLightFocus, MOTION_LIGHT_WIDTH, type MotionLightTraceOpts } from '../../src/render/motion-light-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import { lastLine } from '../../src/render/outside-trace';
import type { Rule } from '../../src/model/types';
import { clock } from '../../src/panel/rules-panel';
import { motionModeLast, type MotionLightTrace, type RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 20, 0).getTime();
const at = (h: number, m: number) => new Date(2026, 10, 17, h, m).getTime();
const fixed = { combine: 'any' as const, inputs: [], onDelay: 0, onTrue: [], onFalse: [] };
const rule: Rule = {
  id: 'm', name: 'Light motion control', zoneId: null, ...fixed, offDelay: 180,
  motionLight: { light: 'lamp', sensors: ['s1', 's2'], daylight: { sensor: 'lux', is: 'dark' }, minOn: 60, buttons: ['b1'], autoAfter: 30 },
};
const bare: Rule = { ...rule, motionLight: { light: 'lamp', sensors: ['s1'], minOn: 0, buttons: [], autoAfter: 0 } };
const many: Rule = { ...rule, motionLight: { ...rule.motionLight!, sensors: ['s1', 's2', 's3', 's4'] } };
const names: Record<string, string> = { lamp: 'Kitchen light', s1: 'Motion kitchen', s2: 'Motion hall', s3: 'Motion three', s4: 'Motion four', lux: 'LightSensor', b1: 'Smart button 1' };

const motion = (m: Partial<MotionLightTrace> = {}): MotionLightTrace => ({
  mode: 'auto', motion: false, dark: true, light: 'on', daylight: { state: 'night', detail: '5 lx' },
  sensors: [{ id: 's1', name: 'Motion kitchen', state: 'off' }, { id: 's2', name: 'Motion hall', state: 'off' }], ...m,
});
const live = (m: Partial<MotionLightTrace> = {}, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: true, inputs: [], unknownInputs: 0, motionLight: motion(m), ...over,
});

function draw(over: Partial<MotionLightTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderMotionLightTrace({ rule, deviceName: id => names[id] ?? 'Choose...', note: null, now: NOW, onFocus, ...over }), host);
  return { host, onFocus };
}
/** The visible lines of a block (its <title> tooltip left out). */
const text = (host: HTMLElement, f: string) =>
  [...host.querySelector(`[data-block="${f}"]`)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' | ');
const cls = (host: HTMLElement, f: string) => host.querySelector(`[data-block="${f}"]`)!.classList;
const order = (host: HTMLElement) => [...host.querySelectorAll('[data-block]')].map(b => b.getAttribute('data-block'));
const pos = (host: HTMLElement, f: string) => {
  const m = /translate\(([\d.]+) ([\d.]+)\)/.exec(host.querySelector(`[data-block="${f}"]`)!.getAttribute('transform')!)!;
  return { x: Number(m[1]), y: Number(m[2]) };
};

describe('light motion control diagram', () => {
  it('has the compact width of the purpose-built family', () => {
    const { host } = draw();
    expect(MOTION_LIGHT_WIDTH).toBe(PURPOSE_WIDTH);
    const svg = host.querySelector('svg.vt') as SVGElement;
    expect(svg.style.maxWidth).toBe(`${PURPOSE_WIDTH}px`);
    expect(svg.getAttribute('viewBox')).toMatch(new RegExp(`^0 0 ${PURPOSE_WIDTH} `));
  });

  it('parameters only: sensors and Daylight in a row, then Wants, Mode, Light top to bottom; no live tones', () => {
    const { host } = draw();
    expect(order(host)).toEqual(['motionlight-sensor:s1', 'motionlight-sensor:s2', 'motionlight-daylight', 'motionlight-wants', 'motionlight-mode', 'motionlight-light']);
    const row = ['motionlight-sensor:s1', 'motionlight-sensor:s2', 'motionlight-daylight'].map(f => pos(host, f));
    expect(new Set(row.map(p => p.y)).size).toBe(1);
    expect(row.map(p => p.x)).toEqual([...row.map(p => p.x)].sort((a, b) => a - b));
    const ys = ['motionlight-wants', 'motionlight-mode', 'motionlight-light'].map(f => pos(host, f).y);
    expect(ys[0]).toBeGreaterThan(row[0].y);
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    expect(text(host, 'motionlight-sensor:s1')).toBe('Motion kitchen | Motion sensor');
    expect(text(host, 'motionlight-daylight')).toBe('Daylight | LightSensor | is dark');
    expect(text(host, 'motionlight-wants')).toBe('Wants | on at motion when dark, off 3:00 after it ends, at least 1:00 on | off at once when daylight comes');
    expect(text(host, 'motionlight-mode')).toBe('Mode | back to auto: a button\'s Auto action');
    expect(text(host, 'motionlight-light')).toBe('Kitchen light | on / off');
    expect(host.querySelector('.fc-blk.on, .fc-blk.off, .fc-blk.nodata')).toBeNull();
  });

  it('the rule text: no "when dark" without a daylight sensor, ", at least" only with a minimum on time', () => {
    const { host } = draw({ rule: { ...bare, offDelay: 180 } });
    expect(order(host)).toEqual(['motionlight-sensor:s1', 'motionlight-wants', 'motionlight-mode', 'motionlight-light']);
    expect(text(host, 'motionlight-wants')).toBe('Wants | on at motion, off 3:00 after it ends');
    expect(text(draw({ rule: { ...rule, motionLight: { ...rule.motionLight!, minOn: 0 } } }).host, 'motionlight-wants')).toBe('Wants | on at motion when dark, off 3:00 after it ends | off at once when daylight comes');
  });

  it('more than three blocks wrap into rows of three, a trunk beside them runs down to Wants', () => {
    const { host } = draw({ rule: many });
    const ps = ['motionlight-sensor:s1', 'motionlight-sensor:s2', 'motionlight-sensor:s3', 'motionlight-sensor:s4', 'motionlight-daylight'].map(f => pos(host, f));
    expect(ps[0].y).toBe(ps[2].y);
    expect(ps[3].y).toBeGreaterThan(ps[0].y);
    expect(ps[3].y).toBe(ps[4].y);
    expect(ps[3].x).toBe(ps[0].x);
    expect(pos(host, 'motionlight-wants').y).toBeGreaterThan(ps[3].y);
    const d = host.querySelector('.fc-link')!.getAttribute('d')!;
    expect(d).toContain(`V${pos(host, 'motionlight-wants').y}`);
  });

  it('no sensors: one muted block says auto does nothing; the Daylight block is still shown', () => {
    const r: Rule = { ...rule, motionLight: { ...rule.motionLight!, sensors: [] } };
    const { host } = draw({ rule: r });
    expect(order(host).slice(0, 2)).toEqual(['motionlight-sensors', 'motionlight-daylight']);
    expect(text(host, 'motionlight-sensors')).toBe('no motion sensors: auto does nothing');
    const k = cls(host, 'motionlight-sensors');
    expect(k.contains('on') || k.contains('off') || k.contains('nodata')).toBe(false);
    expect(text(draw({ rule: r, trace: live({ sensors: [] }) }).host, 'motionlight-sensors')).toBe('no motion sensors: auto does nothing');
  });

  it('no button: the Mode block says auto (no button), with and without live values', () => {
    expect(text(draw({ rule: bare }).host, 'motionlight-mode')).toBe('Mode | auto (no button)');
    expect(text(draw({ rule: bare, trace: live({}) }).host, 'motionlight-mode')).toBe('Mode: auto (no button)');
    expect(text(draw({ trace: live({}) }).host, 'motionlight-mode')).toBe('Mode: auto');
  });

  it('auto without motion sensors (verdict null): Wants shows no on / off value', () => {
    const r: Rule = { ...bare, motionLight: { ...bare.motionLight!, sensors: [] } };
    const { host } = draw({ rule: r, trace: live({ sensors: [], dark: null }, { verdict: null }) });
    expect(text(host, 'motionlight-wants')).toBe('Wants | on at motion, off 3:00 after it ends');
    expect(cls(host, 'motionlight-wants')).not.toContain('nodata');
  });

  it('waiting for new motion shows in the Wants block only while the trace says so', () => {
    const w = draw({ trace: live({ waiting: true }, { verdict: false }) });
    expect(text(w.host, 'motionlight-wants')).toContain('waiting for new motion');
    expect(text(draw({ trace: live({}, { verdict: false }) }).host, 'motionlight-wants')).not.toContain('waiting for new motion');
  });

  it('auto, off pending: sensors clear, Daylight night, off in and minimum on count down, the light on', () => {
    const { host } = draw({ trace: live({ offAt: NOW + 161_000, minUntil: NOW + 38_000 }, { last: { action: 'on', target: 'Kitchen light', at: at(19, 42), reason: 'became true: Motion kitchen motion, LightSensor night, 5 lx' } }) });
    expect(text(host, 'motionlight-sensor:s1')).toBe('Motion kitchen | clear');
    expect(cls(host, 'motionlight-sensor:s1')).toContain('off');
    expect(text(host, 'motionlight-daylight')).toBe('Daylight: night | LightSensor | 5 lx');
    expect(cls(host, 'motionlight-daylight')).toContain('on');
    expect(text(host, 'motionlight-wants')).toBe('Wants: on | on at motion when dark, off 3:00 after it ends, at least 1:00 on | off at once when daylight comes | off in 2:41 | minimum on 0:38');
    expect(cls(host, 'motionlight-wants')).toContain('on');
    expect(text(host, 'motionlight-mode')).toBe('Mode: auto');
    expect(text(host, 'motionlight-light')).toMatch(/^Kitchen light \| state: on \| last: turned on .*19.42.* \(became true\)$/);
    expect(cls(host, 'motionlight-light')).toContain('on');
  });

  it('a countdown never goes negative', () => {
    const { host } = draw({ trace: live({ offAt: NOW - 5_000 }) });
    expect(text(host, 'motionlight-wants')).toContain('off in 0:00');
  });

  it('motion and no data: the sensor words and tones; daylight without data; not dark', () => {
    const { host } = draw({ trace: live({ motion: true, dark: null, daylight: { state: null, detail: 'no data' }, sensors: [{ id: 's1', name: 'Motion kitchen', state: 'on' }, { id: 's2', name: 'Motion hall', state: null }] }) });
    expect(text(host, 'motionlight-sensor:s1')).toBe('Motion kitchen | motion');
    expect(cls(host, 'motionlight-sensor:s1')).toContain('on');
    expect(text(host, 'motionlight-sensor:s2')).toBe('Motion hall | no data');
    expect(cls(host, 'motionlight-sensor:s2')).toContain('nodata');
    expect(text(host, 'motionlight-daylight')).toBe('Daylight: no data | LightSensor | no data');
    expect(cls(host, 'motionlight-daylight')).toContain('nodata');
    const day = draw({ trace: live({ dark: false, daylight: { state: 'day', detail: '1240 lx (night in 1:00)' } }, { verdict: false }) });
    expect(text(day.host, 'motionlight-daylight')).toBe('Daylight: day | LightSensor | 1240 lx');
    expect(cls(day.host, 'motionlight-daylight')).toContain('off');
    expect(day.host.querySelector('[data-block="motionlight-daylight"] title')!.textContent).toContain('1240 lx (night in 1:00)');
    expect(text(day.host, 'motionlight-wants')).toMatch(/^Wants: off/);
  });

  it('manual with auto again: Wants is silent, Mode counts down; the last entry is shown', () => {
    const { host } = draw({ trace: live({ mode: 'manual', autoAt: NOW + 754_000 }, { verdict: null, last: { action: 'on', target: 'Kitchen light', at: at(19, 43), reason: 'button: manual' } }) });
    expect(text(host, 'motionlight-mode')).toBe('Mode: manual | auto again in 12:34');
    expect(cls(host, 'motionlight-mode')).toContain('off');
    expect(text(host, 'motionlight-wants')).toBe('Wants | on at motion when dark, off 3:00 after it ends, at least 1:00 on | off at once when daylight comes');
    expect(cls(host, 'motionlight-wants')).not.toContain('nodata');
    expect(text(host, 'motionlight-light')).toBe(`Kitchen light | state: on | last: manual ${clock(at(19, 43))} (button)`);
  });

  it('manual without a countdown: the way back is a button', () => {
    const { host } = draw({ trace: live({ mode: 'manual' }, { verdict: null, last: { action: 'off', target: 'Kitchen light', at: at(19, 43), reason: 'button: manual', sent: false } }) });
    expect(text(host, 'motionlight-mode')).toBe('Mode: manual | back to auto: a button\'s Auto action');
    expect(text(host, 'motionlight-light')).toBe(`Kitchen light | state: on | last: manual ${clock(at(19, 43))} (button)`);
  });

  it('the light without data, a command error and a status note', () => {
    const { host } = draw({ trace: live({ light: null }, { status: 'error', reason: 'target unavailable', verdict: null, last: { action: 'on', target: 'Kitchen light', at: at(19, 44), reason: 'became true: motion', error: 'target unavailable' } }) });
    expect(text(host, 'motionlight-light')).toContain('Kitchen light | state: no data');
    expect(text(host, 'motionlight-light')).toContain('target unavailable');
    expect(cls(host, 'motionlight-light')).toContain('nodata');
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Error: target unavailable');
  });

  it('mode-change entries are worded plainly, never as refused commands; other entries keep the shared wording', () => {
    const lastOf = (last: RuleTrace['last']) => text(draw({ trace: live({}, { last }) }).host, 'motionlight-light').split(' | ')[2];
    const c = clock(at(21, 41));
    const e = (action: 'on' | 'off' | 'auto', reason: string, extra: object = {}) => ({ action, target: 'Kitchen light', at: at(21, 41), reason, ...extra }) as RuleTrace['last'];
    expect(lastOf(e('auto', 'button: auto', { sent: false }))).toBe(`last: back to auto ${c} (button)`);
    expect(lastOf(e('auto', 'auto again', { sent: false }))).toBe(`last: back to auto ${c} (no motion)`);
    expect(lastOf(e('on', 'button: manual'))).toBe(`last: manual ${c} (button)`);
    expect(lastOf(e('off', 'button: manual', { sent: false }))).toBe(`last: manual ${c} (button)`);
    expect(lastOf(e('off', 'switched off elsewhere: waits for new motion', { sent: false }))).toBe(`last: switched off elsewhere ${c}, waits for new motion`);
    expect(motionModeLast(e('off', 'switched elsewhere: manual', { sent: false })!)).toBeUndefined(); // no longer written, no table row
    expect(lastOf(e('on', 'found on', { sent: false }))).toBe(`last: found on ${c}`);
    expect(lastOf(e('on', 'became true: Motion kitchen motion'))).toBe(`last: turned on ${c} (became true)`);
    expect(lastOf(e('off', 'back to auto: no motion'))).toBe(`last: turned off ${c} (back to auto: no motion)`);
    expect(lastOf(e('off', 'back to auto: not dark'))).toBe(`last: turned off ${c} (back to auto: it is light)`);
    expect(lastOf(e('on', 'back to auto: motion'))).toBe(`last: turned on ${c} (back to auto: motion)`);
    const kept = e('off', 'kept on by Timer', { sent: false })!;
    expect(lastOf(kept)).toBe(lastLine(kept)); // an off kept back on entering auto keeps the shared wording
    const err = text(draw({ trace: live({}, { last: e('on', 'button: manual', { error: 'target unavailable' }) }) }).host, 'motionlight-light');
    expect(err).toContain(`last: manual ${c} (button)`);
    expect(err).toContain('target unavailable');
  });

  it('a click on a block calls onFocus with its data-block; the focused block is highlighted; the focus map', () => {
    const { host, onFocus } = draw({ focused: 'motionlight-mode' });
    host.querySelector('[data-block="motionlight-sensor:s2"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onFocus).toHaveBeenCalledWith('motionlight-sensor:s2');
    expect(cls(host, 'motionlight-mode')).toContain('hl');
    expect(motionLightFocus('motionlight-sensor:s2')).toBe('motionlight-sensors');
    expect(motionLightFocus('motionlight-wants')).toBe('motionlight-off');
    expect(motionLightFocus('motionlight-mode')).toBe('motionlight-buttons');
    expect(motionLightFocus('motionlight-light')).toBe('motionlight-light');
  });

  describe('the blocker', () => {
    const blk: Rule = { ...rule, motionLight: { ...rule.motionLight!, blocker: { device: 'sleep', is: 'on' } } };
    const nm: Record<string, string> = { ...names, sleep: 'Sleep' };
    const drawB = (over: Partial<MotionLightTraceOpts> = {}) => draw({ rule: blk, deviceName: id => nm[id] ?? 'Choose...', ...over });

    it('parameters only: a block after the Daylight block names the device and the blocking state', () => {
      const { host } = drawB();
      expect(order(host)).toEqual(['motionlight-sensor:s1', 'motionlight-sensor:s2', 'motionlight-daylight', 'motionlight-blocker', 'motionlight-wants', 'motionlight-mode', 'motionlight-light']);
      expect(text(host, 'motionlight-blocker')).toBe('Blocked while | Sleep is on');
      expect(motionLightFocus('motionlight-blocker')).toBe('motionlight-blocker');
      const off = draw({ rule: { ...blk, motionLight: { ...blk.motionLight!, blocker: { device: 'sleep', is: 'off' } } }, deviceName: id => nm[id] ?? '' });
      expect(text(off.host, 'motionlight-blocker')).toBe('Blocked while | Sleep is off');
      expect(draw().host.querySelector('[data-block="motionlight-blocker"]')).toBeNull();
    });

    it('while blocked it says blocked by <name>; otherwise its state is shown', () => {
      const blocked = drawB({ trace: live({ blocked: true, motion: true, light: 'off', blocker: { name: 'Sleep', state: 'on', is: 'on' } }, { verdict: false }) }).host;
      expect(text(blocked, 'motionlight-blocker')).toBe('blocked by Sleep');
      expect(cls(blocked, 'motionlight-blocker').contains('ok')).toBe(false);
      const free = drawB({ trace: live({ blocker: { name: 'Sleep', state: 'off', is: 'on' } }) }).host;
      expect(text(free, 'motionlight-blocker')).toBe('Blocked while | Sleep is on | now off');
      const nodata = drawB({ trace: live({ blocker: { name: 'Sleep', state: null, is: 'on' } }) }).host;
      expect(text(nodata, 'motionlight-blocker')).toBe('Blocked while | Sleep is on | now no data');
    });

    it('a click focuses the form field; the new reasons are worded', () => {
      const { host, onFocus } = drawB();
      (host.querySelector('[data-block="motionlight-blocker"]') as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onFocus).toHaveBeenCalledWith('motionlight-blocker');
      const last = (reason: string, action: 'on' | 'off') => text(drawB({ trace: live({}, { last: { action, target: 'Kitchen light', at: at(7, 5), reason } }) }).host, 'motionlight-light');
      expect(last('blocked', 'off')).toContain(`last: turned off ${clock(at(7, 5))} (blocked)`);
      expect(last('unblocked: motion', 'on')).toContain(`last: turned on ${clock(at(7, 5))} (unblocked: motion)`);
      expect(last('unblocked: no motion', 'off')).toContain('(unblocked: no motion)');
      expect(last('unblocked: not dark', 'off')).toContain('(unblocked: not dark)');
      expect(last('daylight', 'off')).toContain(`last: turned off ${clock(at(7, 5))} (daylight)`);
      for (const r of ['blocked', 'unblocked: motion', 'unblocked: no motion', 'unblocked: not dark', 'daylight']) {
        expect(motionModeLast({ action: 'off', target: 'x', at: 0, reason: r })).toBeDefined();
      }
    });
  });
});
