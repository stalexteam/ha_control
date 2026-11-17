// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderBeurerTrace, BEURER_FOCUS, BEURER_WIDTH, type BeurerTraceOpts } from '../../src/render/beurer-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import { beurerTemplate } from '../../src/model/rules';
import type { Rule } from '../../src/model/types';
import type { BeurerTrace, RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 20, 0).getTime();
const rule: Rule = { ...beurerTemplate(null, null), beurer: { heater: 'pad', source: 'pc', above: 200, keep: 10, every: 30 } };
const names: Record<string, string> = { pad: 'Leg heater', pc: 'Desk PC' };

const bt = (o: Partial<BeurerTrace> = {}): BeurerTrace => ({ watts: 312, detail: '312 W', heater: 'on', fresh: true, ...o });
const live = (o: Partial<BeurerTrace> = {}, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: true, inputs: [], unknownInputs: 0, beurer: bt(o), ...over,
});

function draw(over: Partial<BeurerTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderBeurerTrace({ rule, deviceName: id => names[id] ?? 'Choose...', note: null, now: NOW, onFocus, ...over }), host);
  return { host, onFocus };
}
const text = (host: HTMLElement, f: string) =>
  [...host.querySelector(`[data-block="${f}"]`)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' | ');
const order = (host: HTMLElement) => [...host.querySelectorAll('[data-block]')].map(b => b.getAttribute('data-block'));

describe('beurer heater diagram', () => {
  it('has the compact width of the purpose-built family', () => {
    const { host } = draw();
    expect(BEURER_WIDTH).toBe(PURPOSE_WIDTH);
    expect((host.querySelector('svg.vt') as SVGElement).style.maxWidth).toBe(`${PURPOSE_WIDTH}px`);
  });

  it('parameters only: source, Wants, Re-power, heater top to bottom with the rule text; no live tones', () => {
    const { host } = draw();
    expect(order(host)).toEqual(['beurer-source', 'beurer-wants', 'beurer-every', 'beurer-heater']);
    expect(text(host, 'beurer-source')).toBe('Desk PC | Power source');
    expect(text(host, 'beurer-wants')).toBe('Wants | on above 200 W, off after 1:00');
    expect(text(host, 'beurer-every')).toBe('Re-power | 30 min');
    expect(text(host, 'beurer-heater')).toBe('Leg heater | on / off');
    expect(host.querySelector('.fc-blk.on, .fc-blk.off, .fc-blk.nodata')).toBeNull();
  });

  it('live: the reading and the countdown to the next re-power in m:ss', () => {
    const { host } = draw({ trace: live({ cycleAt: NOW + 754_000 }) });
    expect(text(host, 'beurer-source')).toBe('Desk PC | 312 W');
    expect(text(host, 'beurer-wants')).toBe('Wants: on | on above 200 W, off after 1:00');
    expect(text(host, 'beurer-every')).toBe('Re-power | next in 12:34');
    expect(text(host, 'beurer-heater')).toBe('Leg heater | state: on');
    expect(host.querySelector('[data-block="beurer-source"]')!.classList.contains('on')).toBe(true);
  });

  it('the socket\'s off phase counts down as re-powering', () => {
    const { host } = draw({ trace: live({ pausedUntil: NOW + 3000, heater: 'off' }) });
    expect(text(host, 'beurer-every')).toBe('Re-power | re-powering 0:03');
  });

  it('a source without data keeps the state for a while, counting down; later it is just no data', () => {
    const { host } = draw({ trace: live({ watts: null, detail: 'no data, kept', keptUntil: NOW + 252_000 }, { pending: { to: false, at: NOW + 45_000 } }) });
    expect(text(host, 'beurer-source')).toBe('Desk PC | no data, kept 4:12');
    expect(text(host, 'beurer-wants')).toBe('Wants: on | on above 200 W, off after 1:00 | off in 0:45');
    const gone = draw({ trace: live({ watts: null, detail: 'no data' }, { verdict: null }) }).host;
    expect(text(gone, 'beurer-source')).toBe('Desk PC | no data');
    expect(gone.querySelector('[data-block="beurer-source"]')!.classList.contains('nodata')).toBe(true);
  });

  it('a kept reading takes its tone from the kept value', () => {
    const kept = (value: boolean) => live({ watts: null, detail: 'no data, kept', keptUntil: NOW + 252_000 },
      { inputs: [{ label: 'Desk PC', value, detail: 'no data, kept' }] });
    const idle = draw({ trace: kept(false) }).host.querySelector('[data-block="beurer-source"]')!;
    expect(idle.classList.contains('on')).toBe(false);
    expect(idle.classList.contains('off')).toBe(true);
    expect(draw({ trace: kept(true) }).host.querySelector('[data-block="beurer-source"]')!.classList.contains('on')).toBe(true);
  });

  it('due when wanted, the heater on, the pad\'s timer not fresh and no pause; a dash when nothing is wanted', () => {
    expect(text(draw({ trace: live({ fresh: false }) }).host, 'beurer-every')).toBe('Re-power | due');
    expect(text(draw({ trace: live({ fresh: false, heater: 'off' }, { verdict: false }) }).host, 'beurer-every')).toBe('Re-power | —');
    expect(text(draw({ trace: live({ cycleAt: NOW + 754_000 }, { verdict: false }) }).host, 'beurer-every')).toBe('Re-power | —');
  });

  it('every 0 reads never, with and without live values', () => {
    const never: Rule = { ...rule, beurer: { ...rule.beurer!, every: 0 } };
    expect(text(draw({ rule: never }).host, 'beurer-every')).toBe('Re-power | never');
    expect(text(draw({ rule: never, trace: live() }).host, 'beurer-every')).toBe('Re-power | never');
  });

  it('shows the last entry of the heater, a re-power as a command and a switch elsewhere as an entry', () => {
    const at = new Date(2026, 10, 17, 19, 42).getTime();
    const a = draw({ trace: live({}, { last: { action: 'on', target: 'Leg heater', at, reason: 're-power' } }) }).host;
    expect(text(a, 'beurer-heater')).toBe('Leg heater | state: on | last: turned on 19:42 (re-power)');
    const b = draw({ trace: live({}, { last: { action: 'off', target: 'Leg heater', at, reason: 'switched elsewhere: Desk PC', sent: false } }) }).host;
    expect(text(b, 'beurer-heater')).toContain('switched off elsewhere 19:42, Desk PC');
  });

  it('a click on a block reports its data-block; Wants belongs to the threshold field', () => {
    const { host, onFocus } = draw();
    host.querySelector('[data-block="beurer-wants"]')!.dispatchEvent(new Event('click'));
    expect(onFocus).toHaveBeenCalledWith('beurer-wants');
    expect(BEURER_FOCUS['beurer-wants']).toBe('beurer-above');
  });

  it('shows the status and the note under the diagram', () => {
    const { host } = draw({ trace: live({}, { status: 'waiting' }), note: 'Live state appears after Save' });
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Waiting for data');
    expect(host.querySelector('.fc-note')!.textContent).toBe('Live state appears after Save');
  });
});
