// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderOutsideTrace, OUTSIDE_WIDTH, type OutsideTraceOpts } from '../../src/render/outside-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import type { Rule } from '../../src/model/types';
import type { OutsideTrace, RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 20, 0).getTime();
const at = (h: number, m: number) => new Date(2026, 10, 17, h, m).getTime();
const fixed = { combine: 'any' as const, inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
const rule: Rule = { id: 'o', name: 'Outside light', zoneId: null, ...fixed, outside: { light: 'lamp', sensor: 'lux', noDataNight: true, afterSunset: true, pause: 30 } };
const bare: Rule = { ...rule, outside: { light: 'lamp', sensor: 'lux', pause: 30 } };
const windowed: Rule = { ...rule, outside: { ...rule.outside!, window: { from: '17:00', to: '23:00' } } };
const names: Record<string, string> = { lamp: 'Light External', lux: 'LightSensor' };

const out = (o: Partial<OutsideTrace> = {}): OutsideTrace => ({ daylight: 'night', detail: '5 lx', sun: 'below', window: null, light: 'on', ...o });
const live = (o: Partial<OutsideTrace> = {}, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: true, inputs: [], unknownInputs: 0, outside: out(o), ...over,
});

function draw(over: Partial<OutsideTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderOutsideTrace({ rule, deviceName: id => names[id] ?? 'Choose...', note: null, now: NOW, onFocus, ...over }), host);
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
const width = (host: HTMLElement, f: string) => Number(host.querySelector(`[data-block="${f}"] rect`)!.getAttribute('width'));

describe('outside light diagram', () => {
  it('has the compact width of the purpose-built family', () => {
    const { host } = draw();
    expect(OUTSIDE_WIDTH).toBe(PURPOSE_WIDTH);
    const svg = host.querySelector('svg.vt') as SVGElement;
    expect(svg.style.maxWidth).toBe(`${PURPOSE_WIDTH}px`);
    expect(svg.getAttribute('viewBox')).toMatch(new RegExp(`^0 0 ${PURPOSE_WIDTH} `));
  });

  it('parameters only: Daylight and Sun side by side, then Wants, Pause, Light top to bottom; no live tones', () => {
    const { host } = draw();
    expect(order(host)).toEqual(['outside-sensor', 'outside-sunset', 'outside-wants', 'outside-pause', 'outside-light']);
    expect(pos(host, 'outside-sensor').y).toBe(pos(host, 'outside-sunset').y);
    expect(pos(host, 'outside-sensor').x).toBeLessThan(pos(host, 'outside-sunset').x);
    const ys = ['outside-sensor', 'outside-wants', 'outside-pause', 'outside-light'].map(f => pos(host, f).y);
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    expect(text(host, 'outside-sensor')).toBe('Daylight | LightSensor | night or no data');
    expect(text(host, 'outside-sunset')).toBe('Sun | after sunset');
    expect(text(host, 'outside-wants')).toBe('Wants | on at night after sunset, else off');
    expect(text(host, 'outside-pause')).toBe('Pause | 30 min after a manual switch');
    expect(text(host, 'outside-light')).toBe('Light External | on / off');
    expect(host.querySelector('.fc-blk.on, .fc-blk.off, .fc-blk.nodata')).toBeNull();
  });

  it('only the daylight: one full-width top block; without noDataNight just night', () => {
    const { host } = draw({ rule: bare });
    expect(order(host)).toEqual(['outside-sensor', 'outside-wants', 'outside-pause', 'outside-light']);
    expect(width(host, 'outside-sensor')).toBe(width(host, 'outside-wants'));
    expect(text(host, 'outside-sensor')).toBe('Daylight | LightSensor | night');
    expect(text(host, 'outside-wants')).toBe('Wants | on at night, else off');
  });

  it('with a window: three blocks in the top row, all inside the diagram', () => {
    const { host } = draw({ rule: windowed });
    expect(order(host).slice(0, 3)).toEqual(['outside-sensor', 'outside-sunset', 'outside-window']);
    const xs = ['outside-sensor', 'outside-sunset', 'outside-window'].map(f => pos(host, f).x);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
    expect(pos(host, 'outside-window').x + width(host, 'outside-window')).toBeLessThanOrEqual(OUTSIDE_WIDTH - 10);
    expect(text(host, 'outside-window')).toBe('Time window | 17:00-23:00');
    expect(text(host, 'outside-wants')).toBe('Wants | on at night after sunset in the window, else off');
    // A bus joins the top row and runs down to Wants.
    expect(host.querySelector('.fc-link')!.getAttribute('d')).toContain(`M${OUTSIDE_WIDTH / 2} `);
  });

  it('pause 0 never pauses', () => {
    const { host } = draw({ rule: { ...rule, outside: { ...rule.outside!, pause: 0 } } });
    expect(text(host, 'outside-pause')).toBe('Never pauses | manual switches are ignored');
    const tr = draw({ rule: { ...rule, outside: { ...rule.outside!, pause: 0 } }, trace: live() });
    expect(text(tr.host, 'outside-pause')).toBe('Never pauses | manual switches are ignored');
  });

  it('night, on: tones, states and the last command (reason head; the whole reason in the tooltip)', () => {
    const tr = live({}, { last: { action: 'on', target: 'Light External', at: at(19, 42), reason: 'became true: LightSensor night, 5 lx, Sun below horizon' } });
    const { host } = draw({ trace: tr });
    expect(text(host, 'outside-sensor')).toBe('Daylight: night | LightSensor | 5 lx');
    expect(cls(host, 'outside-sensor')).toContain('on');
    expect(text(host, 'outside-sunset')).toBe('Sun: below | after sunset');
    expect(cls(host, 'outside-sunset')).toContain('on');
    expect(text(host, 'outside-wants')).toBe('Wants: on | on at night after sunset, else off');
    expect(cls(host, 'outside-wants')).toContain('on');
    expect(text(host, 'outside-pause')).toBe('No pause | 30 min after a manual switch');
    expect(text(host, 'outside-light')).toMatch(/^Light External \| state: on \| last: turned on .*19.42.* \(became true\)$/);
    expect(cls(host, 'outside-light')).toContain('on');
    expect(host.querySelector('[data-block="outside-light"] title')!.textContent).toContain('became true: LightSensor night, 5 lx, Sun below horizon');
  });

  it('day, off: off tones; sun above', () => {
    const { host } = draw({ trace: live({ daylight: 'day', detail: '1240 lx', sun: 'above', light: 'off' }, { verdict: false }) });
    expect(text(host, 'outside-sensor')).toBe('Daylight: day | LightSensor | 1240 lx');
    expect(cls(host, 'outside-sensor')).toContain('off');
    expect(text(host, 'outside-sunset')).toBe('Sun: above | after sunset');
    expect(cls(host, 'outside-sunset')).toContain('off');
    expect(text(host, 'outside-wants')).toMatch(/^Wants: off/);
    expect(cls(host, 'outside-wants')).toContain('off');
    expect(text(host, 'outside-light')).toBe('Light External | state: off');
    expect(cls(host, 'outside-light')).toContain('off');
  });

  it('a pending daylight change counts down from until (never negative)', () => {
    const tr = live({ daylight: 'twilight', detail: '5 lx (night in 1:00)', until: NOW + 42_000, light: 'off' }, { verdict: false });
    expect(text(draw({ trace: tr }).host, 'outside-sensor')).toBe('Daylight: twilight | LightSensor | 5 lx | night in 0:42');
    expect(text(draw({ trace: tr, now: NOW + 60_000 }).host, 'outside-sensor')).toBe('Daylight: twilight | LightSensor | 5 lx | night in 0:00');
  });

  it('no daylight data: no-data tone; with noDataNight it counts as night', () => {
    const { host } = draw({ trace: live({ daylight: null, detail: 'no data', sun: null, light: null }, { verdict: null }) });
    expect(text(host, 'outside-sensor')).toBe('Daylight: no data | LightSensor | counts as night');
    expect(cls(host, 'outside-sensor')).toContain('nodata');
    expect(text(host, 'outside-sunset')).toBe('Sun: no data | after sunset');
    expect(cls(host, 'outside-sunset')).toContain('nodata');
    expect(text(host, 'outside-wants')).toMatch(/^Wants: no data/);
    expect(text(host, 'outside-light')).toBe('Light External | state: no data');
    expect(cls(host, 'outside-light')).toContain('nodata');
    const plain = draw({ rule: bare, trace: live({ daylight: null, detail: 'missing', light: 'off' }) });
    expect(text(plain.host, 'outside-sensor')).toBe('Daylight: no data | LightSensor | missing');
  });

  it('window: in it counts down to its end, outside it to its start', () => {
    const inside = draw({ rule: windowed, trace: live({ window: true, windowUntil: NOW + 3 * 3600_000 + 5_000 }) });
    expect(text(inside.host, 'outside-window')).toBe('In window | 17:00-23:00 | ends in 3:00:05');
    expect(cls(inside.host, 'outside-window')).toContain('on');
    const before = draw({ rule: windowed, trace: live({ window: false, windowUntil: NOW + 754_000 }, { verdict: false }) });
    expect(text(before.host, 'outside-window')).toBe('Outside window | 17:00-23:00 | starts in 12:34');
    expect(cls(before.host, 'outside-window')).toContain('off');
  });

  it('paused: the countdown to its end; the manual switch is never worded as a command', () => {
    const tr = live({ light: 'off', pausedUntil: NOW + 754_000 }, {
      last: { action: 'off', target: 'Light External', at: at(19, 47), reason: 'switched elsewhere: paused 30 min', sent: false },
    });
    const { host } = draw({ trace: tr });
    expect(text(host, 'outside-pause')).toBe('Paused, resumes in 12:34 | 30 min after a manual switch');
    expect(cls(host, 'outside-pause')).toContain('off');
    expect(text(host, 'outside-light')).toMatch(/^Light External \| state: off \| switched off elsewhere .*19.47.*, paused 30 min$/);
    expect(text(host, 'outside-light')).not.toContain('turned');
    expect(text(draw({ trace: tr, now: NOW + 800_000 }).host, 'outside-pause')).toMatch(/^Paused, resumes in 0:00/);
  });

  it('kept on / already on by another automation', () => {
    const kept = draw({ trace: live({ light: 'on' }, { verdict: false, last: { action: 'off', target: 'Light External', at: at(6, 10), reason: 'kept on by Porch motion', sent: false } }) });
    expect(text(kept.host, 'outside-light')).toMatch(/^Light External \| state: on \| kept on by Porch motion .*06.10/);
    expect(text(kept.host, 'outside-light')).not.toContain('already off');
  });

  it('a failed command shows its error; a non-ok status is noted under the diagram', () => {
    const { host } = draw({ trace: live({ light: null }, {
      status: 'error', reason: 'target unavailable', last: { action: 'on', target: 'Light External', at: at(19, 42), reason: 'start', error: 'waiting for target' },
    }) });
    expect(host.querySelector('[data-block="outside-light"] .fc-err')!.textContent).toBe('waiting for target');
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Error: target unavailable');
  });

  it('a click on a block focuses its form field; the focused block is highlighted', () => {
    const { host, onFocus } = draw({ rule: windowed });
    for (const f of ['outside-sensor', 'outside-sunset', 'outside-window', 'outside-wants', 'outside-pause', 'outside-light']) {
      host.querySelector(`[data-block="${f}"]`)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onFocus).toHaveBeenLastCalledWith(f);
    }
    expect(cls(draw({ focused: 'outside-pause' }).host, 'outside-pause')).toContain('hl');
  });

  it('shows the note', () => {
    expect(draw({ note: 'Live state appears after Save' }).host.querySelector('.fc-note')!.textContent).toBe('Live state appears after Save');
  });
});
