// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderTimedTrace, TIMED_WIDTH, type TimedTraceOpts } from '../../src/render/timed-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import type { Rule } from '../../src/model/types';
import type { RuleTrace, TimedTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 22, 0).getTime();
const at = (h: number, m: number) => new Date(2026, 10, 17, h, m).getTime();
const fixed = { combine: 'any' as const, inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
const rule: Rule = { id: 't', name: 'Vent (10min)', zoneId: null, ...fixed, timed: { button: 'btn', device: 'vent', minutes: 10 } };
const inverted: Rule = { ...rule, timed: { ...rule.timed!, invert: true } };
const names: Record<string, string> = { btn: 'Button vent', vent: 'Vent' };

const live = (tm: TimedTrace, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: tm.running, inputs: [], unknownInputs: 0, timed: tm, ...over,
});

function draw(over: Partial<TimedTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderTimedTrace({
    rule, deviceName: id => names[id] ?? 'Choose...', events: 'start: on (1 hold), stop: off (2 hold)',
    note: null, now: NOW, onFocus, ...over,
  }), host);
  return { host, onFocus };
}
/** The visible lines of a block (its <title> tooltip left out). */
const text = (host: HTMLElement, f: string) =>
  [...host.querySelector(`[data-block="${f}"]`)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' | ');
const cls = (host: HTMLElement, f: string) => host.querySelector(`[data-block="${f}"]`)!.classList;
const order = (host: HTMLElement) => [...host.querySelectorAll('[data-block]')].map(b => b.getAttribute('data-block'));
const top = (host: HTMLElement, f: string) => Number(/translate\([\d.]+ ([\d.]+)\)/.exec(host.querySelector(`[data-block="${f}"]`)!.getAttribute('transform')!)![1]);

describe('timed switch diagram', () => {
  it('has the compact width of the purpose-built family', () => {
    const { host } = draw();
    expect(TIMED_WIDTH).toBe(PURPOSE_WIDTH);
    const svg = host.querySelector('svg.vt') as SVGElement;
    expect(svg.style.maxWidth).toBe(`${PURPOSE_WIDTH}px`);
    expect(svg.getAttribute('viewBox')).toMatch(new RegExp(`^0 0 ${PURPOSE_WIDTH} `));
  });

  it('parameters only: Button, Run, Device from top to bottom, no live tones', () => {
    const { host } = draw();
    expect(order(host)).toEqual(['timed-button', 'timed-minutes', 'timed-device']);
    const ys = order(host).map(f => top(host, f!));
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    expect(text(host, 'timed-button')).toBe('Button vent | start: on (1 hold), stop: off (2 hold)');
    expect(text(host, 'timed-minutes')).toBe('Run | on for 10 min, then off');
    expect(text(host, 'timed-device')).toBe('Vent | on, then off');
    expect(host.querySelector('.fc-blk.on, .fc-blk.off, .fc-blk.nodata')).toBeNull();
    expect(host.querySelector('.fc-link')!.getAttribute('d')).toMatch(/^M\S+ \S+ V\S+ M\S+ \S+ V\S+$/);
  });

  it('inverted: off for the duration, then on', () => {
    const { host } = draw({ rule: inverted });
    expect(text(host, 'timed-minutes')).toBe('Run | off for 10 min, then on');
    expect(text(host, 'timed-device')).toBe('Vent | off, then on');
  });

  it('an empty pick and a button without events', () => {
    const { host } = draw({ rule: { ...rule, timed: { button: '', device: '', minutes: 90 } }, events: null });
    expect(text(host, 'timed-button')).toBe('Choose... | start / stop events');
    expect(text(host, 'timed-minutes')).toBe('Run | on for 1 h 30 min, then off');
    expect(text(host, 'timed-device')).toBe('Choose... | on, then off');
  });

  it('running: the countdown to its end in the on tone; the device state and the last command', () => {
    const tr = live({ running: true, until: NOW + 492_000, device: 'on' }, { last: { action: 'on', target: 'Vent', at: at(21, 50), reason: 'button start' } });
    const { host } = draw({ trace: tr });
    expect(text(host, 'timed-minutes')).toBe('Running, ends in 8:12 | on for 10 min, then off');
    expect(cls(host, 'timed-minutes')).toContain('on');
    expect(text(host, 'timed-device')).toMatch(/^Vent \| state: on \| last: turned on .*21.50.* \(button start\)$/);
    expect(cls(host, 'timed-device')).toContain('on');
    // The end passed before the server's message: 0:00, never negative.
    expect(text(draw({ trace: tr, now: NOW + 600_000 }).host, 'timed-minutes')).toMatch(/^Running, ends in 0:00/);
  });

  it('idle: Idle in the off tone; a device without data', () => {
    const { host } = draw({ trace: live({ running: false, device: null }) });
    expect(text(host, 'timed-minutes')).toBe('Idle | on for 10 min, then off');
    expect(cls(host, 'timed-minutes')).toContain('off');
    expect(text(host, 'timed-device')).toBe('Vent | state: no data');
    expect(cls(host, 'timed-device')).toContain('nodata');
    expect(cls(draw({ trace: live({ running: false, device: 'off' }) }).host, 'timed-device')).toContain('off');
  });

  it('a last entry the rule did not send is never shown as a command', () => {
    const elsewhere = draw({ trace: live({ running: false, device: 'off' }, { last: { action: 'off', target: 'Vent', at: at(21, 46), reason: 'ended: switched elsewhere', sent: false } }) });
    expect(text(elsewhere.host, 'timed-device')).toMatch(/^Vent \| state: off \| switched off elsewhere .*21.46/);
    expect(text(elsewhere.host, 'timed-device')).not.toContain('turned');
    const already = draw({ trace: live({ running: true, until: NOW + 60_000, device: 'on' }, { last: { action: 'on', target: 'Vent', at: at(21, 50), reason: 'button start', sent: false } }) });
    expect(text(already.host, 'timed-device')).toMatch(/^Vent \| state: on \| button start: already on .*21.50/);
    expect(text(already.host, 'timed-device')).not.toContain('turned');
  });

  it('a failed command shows its error; a non-ok status is noted under the diagram', () => {
    const { host } = draw({ trace: live({ running: true, until: NOW + 60_000, device: null }, {
      status: 'error', reason: 'target unavailable', last: { action: 'on', target: 'Vent', at: at(21, 50), reason: 'button start', error: 'waiting for target' },
    }) });
    expect(text(host, 'timed-device')).toContain('waiting for target');
    expect(host.querySelector('[data-block="timed-device"] .fc-err')).toBeTruthy();
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Error: target unavailable');
  });

  it('a click on a block focuses its form field', () => {
    const { host, onFocus } = draw();
    for (const f of ['timed-button', 'timed-minutes', 'timed-device']) {
      host.querySelector(`[data-block="${f}"]`)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onFocus).toHaveBeenLastCalledWith(f);
    }
    expect(cls(draw({ focused: 'timed-device' }).host, 'timed-device')).toContain('hl');
  });

  it('shows the note', () => {
    expect(draw({ note: 'Live state appears after Save' }).host.querySelector('.fc-note')!.textContent).toBe('Live state appears after Save');
  });
});
