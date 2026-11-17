// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderRuleTrace, WIDTH, FLOW_MAX_SCALE, gateValue, fieldOf, type FocusTarget, type RuleTraceOpts } from '../../src/render/rule-trace';
import type { Rule } from '../../src/model/types';
import type { RuleTrace } from '../../src/live/rules-feed';

const NOW = 1_000_000;
const rule: Rule = {
  id: 'r', name: 'R', zoneId: null, combine: 'all', onDelay: 0, offDelay: 120,
  inputs: [{ source: { device: 'leak' } }, { source: { rule: 'other' }, not: true }],
  onTrue: [{ device: 'valve', do: 'close' }], onFalse: [{ device: 'valve', do: 'open' }, { device: 'light', do: 'on' }],
};
const names: Record<string, string> = { leak: 'Leak sensor', other: 'Other rule', valve: 'Water valve', light: 'Light' };

function draw(over: Partial<RuleTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderRuleTrace({
    rule, inputName: i => names['device' in i.source ? i.source.device : 'rule' in i.source ? i.source.rule : ''], actionName: id => names[id],
    note: null, now: NOW, onFocus, ...over,
  }), host);
  return { host, onFocus };
}
const text = (host: HTMLElement, sel: string) => host.querySelector(sel)!.textContent!.replace(/\s+/g, ' ').trim();

describe('rule flowchart', () => {
  it('caps the scale of the svg', () => {
    const { host } = draw();
    expect((host.querySelector('svg.fc') as SVGElement).style.maxWidth).toBe(`${WIDTH * FLOW_MAX_SCALE}px`);
  });

  it('draws the blocks of an unsaved rule without live values and with the note', () => {
    const { host } = draw({ note: 'Live state appears after Save' });
    expect(host.querySelectorAll('.fc-blk[data-block^="input-"]')).toHaveLength(2);
    expect(text(host, '[data-block="input-0"]')).toBe('Leak sensor Device');
    expect(text(host, '[data-block="input-1"]')).toBe('NOT Other rule Rule');
    expect(text(host, '[data-block="combine"]')).toBe('ALL');
    expect(text(host, '[data-block="delays"]')).toBe('Result delay on 0 s, off 120 s');
    expect(text(host, '[data-block="action-true-0"]')).toBe('Water valve Close');
    expect(text(host, '[data-block="action-false-1"]')).toBe('Light Turn on');
    expect(host.textContent).toContain('When true');
    expect(host.textContent).toContain('When false');
    expect(host.querySelector('.fc-blk.on, .fc-blk.off, .fc-blk.nodata')).toBeNull();
    expect(host.querySelector('.fc-note')!.textContent).toBe('Live state appears after Save');
  });

  it('a click on a block reports its target', () => {
    const { host, onFocus } = draw();
    const click = (f: string) => host.querySelector(`[data-block="${f}"]`)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    click('input-1'); click('combine'); click('delays'); click('action-false-1');
    expect(onFocus.mock.calls.map(c => c[0] as FocusTarget)).toEqual([{ input: 1 }, 'gate', 'delays', { action: 'false', index: 1 }]);
    expect(onFocus.mock.calls.map(c => fieldOf(c[0] as FocusTarget))).toEqual(['input-1', 'combine', 'delays', 'action-false-1']);
  });

  it('overlays a saved trace: details, gate, verdict, countdown, last action, warning', () => {
    const trace: RuleTrace = {
      status: 'ok', verdict: false, pending: { to: true, at: NOW + 3200 }, unknownInputs: 1,
      inputs: [{ label: 'Leak sensor', value: true, detail: 'wet' }, { label: 'Other rule', value: null, detail: 'unknown' }],
      last: { action: 'close', target: 'Water valve', at: new Date(2026, 10, 16, 21, 43).getTime(), reason: 'leak', error: 'service failed' },
    };
    const { host } = draw({ trace });
    expect(text(host, '[data-block="input-0"]')).toBe('Leak sensor wet');
    expect(host.querySelector('[data-block="input-0"]')!.classList.contains('on')).toBe(true);
    expect(text(host, '[data-block="input-1"]')).toBe('NOT Other rule unknown');
    expect(host.querySelector('[data-block="input-1"]')!.classList.contains('nodata')).toBe(true);
    expect(text(host, '[data-block="combine"]')).toBe('ALL no data'); // ALL with an unknown input
    expect(text(host, '[data-block="delays"]')).toBe('Result false, true in 4 s');
    expect(host.querySelector('.fc-warn')!.textContent).toBe('1 input without data');
    expect(host.querySelector('.fc-last')!.textContent).toBe('Last action: closed Water valve 21:43: service failed');
    expect(host.querySelector('.fc-note')).toBeNull();
  });

  it('keeps the blocks of the edited rule when the saved trace has another input count', () => {
    const trace: RuleTrace = { status: 'ok', verdict: true, unknownInputs: 0, inputs: [{ label: 'x', value: true, detail: 'wet' }] };
    const { host } = draw({ trace, note: 'Saved version: your changes apply after Save' });
    expect(text(host, '[data-block="input-0"]')).toBe('Leak sensor Device');
    expect(text(host, '[data-block="delays"]')).toBe('Result true');
    expect(host.querySelector('.fc-note')!.textContent).toBe('Saved version: your changes apply after Save');
  });

  it('an invalid delay shows a question mark, not NaN', () => {
    const { host } = draw({ rule: { ...rule, onDelay: NaN } });
    expect(text(host, '[data-block="delays"]')).toBe('Result delay on ? s, off 120 s');
  });

  it('gate values follow the server rules (ANY ignores unknown inputs)', () => {
    expect(gateValue('any', [null, false])).toBe(false);
    expect(gateValue('any', [null, true])).toBe(true);
    expect(gateValue('any', [null, null])).toBeNull();
    expect(gateValue('all', [true, null])).toBeNull();
    expect(gateValue('all', [false, null])).toBe(false);
    expect(gateValue('all', [true, true])).toBe(true);
    expect(gateValue('all', [])).toBeNull();
  });

  describe('stage 2', () => {
    const nm = (i: { source: object }): string => {
      const s = i.source as Record<string, unknown>;
      return 'light' in s ? 'Light sensor' : 'sun' in s ? 'Sun' : 'time' in s ? 'Time window' : 'held' in s ? 'Held: Light' : 'x';
    };
    const r2: Rule = {
      ...rule, combine: 'all', offDelay: 0,
      inputs: [
        { source: { light: 'l', below: 10, hysteresis: 5 } }, { source: { sun: true } },
        { source: { time: { from: '17:00', to: '01:00' } } }, { source: { held: { sources: [{ device: 'light' }], state: 'any', seconds: 1800 } } },
      ],
      gate: { source: { held: { sources: [{ device: 'light' }], state: 'any', seconds: 1800 } } },
    };

    it('draws per-type input blocks and the gate block between the result and the actions', () => {
      const { host } = draw({ rule: r2, inputName: nm });
      expect(text(host, '[data-block="input-0"]')).toBe('Light sensor below 10 lx (+5)');
      expect(text(host, '[data-block="input-1"]')).toBe('Sun below horizon');
      expect(text(host, '[data-block="input-2"]')).toBe('Time window 17:00-01:00');
      expect(text(host, '[data-block="input-3"]')).toBe('Held: Light any (unchanged) 30 min');
      expect(text(host, '[data-block="gate-input"]')).toContain('Gate: Held: Light');
      const x = (b: string) => Number(/translate\(([\d.]+)/.exec(host.querySelector(`[data-block="${b}"]`)!.getAttribute('transform')!)![1]);
      expect(x('delays')).toBeLessThan(x('gate-input'));
      expect(x('gate-input')).toBeLessThan(x('action-true-0'));
    });

    it('draws no gate block without a gate', () => {
      const { host } = draw();
      expect(host.querySelector('[data-block="gate-input"]')).toBeNull();
    });

    it('overlays live details; a Held input and the gate count down by `until`, not by the stale detail', () => {
      const trace: RuleTrace = {
        status: 'ok', verdict: true, held: true, unknownInputs: 0,
        inputs: [
          { label: 'a', value: true, detail: '8 lx' }, { label: 'b', value: true, detail: 'below horizon' },
          { label: 'c', value: true, detail: 'in window until 01:00' }, { label: 'd', value: false, detail: 'unchanged 12 / 30 min', until: NOW + 18 * 60_000 },
        ],
        gate: { value: false, detail: 'unchanged 12 / 30 min', until: NOW + 90_000 },
      };
      const { host } = draw({ rule: r2, inputName: nm, trace });
      expect(text(host, '[data-block="input-0"]')).toBe('Light sensor 8 lx');
      expect(text(host, '[data-block="input-3"]')).toBe('Held: Light true in 18 min');
      expect(text(host, '[data-block="gate-input"]')).toBe('Gate: Held: Light closed, opens in 2 min');
      expect(host.querySelector('[data-block="gate-input"]')!.classList.contains('off')).toBe(true);
      expect(host.querySelector('[data-note="held"]')!.textContent).toBe('Actions are held until the gate opens.');
    });

    it('an open gate says open; an unknown gate says closed, no data', () => {
      const base: RuleTrace = { status: 'ok', verdict: true, unknownInputs: 0, inputs: r2.inputs.map(() => ({ label: '', value: true, detail: 'd' })) };
      const open = draw({ rule: r2, inputName: nm, trace: { ...base, gate: { value: true, detail: 'unchanged 31 / 30 min' } } });
      expect(text(open.host, '[data-block="gate-input"]')).toBe('Gate: Held: Light open');
      expect(open.host.querySelector('[data-block="gate-input"]')!.classList.contains('on')).toBe(true);
      const no = draw({ rule: r2, inputName: nm, trace: { ...base, gate: { value: null, detail: '' } } });
      expect(text(no.host, '[data-block="gate-input"]')).toBe('Gate: Held: Light closed, no data');
      expect(no.host.querySelector('[data-note="held"]')).toBeNull();
    });

    it('a click on the gate block reports gate-input', () => {
      const { host, onFocus } = draw({ rule: r2, inputName: nm });
      host.querySelector('[data-block="gate-input"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onFocus.mock.calls[0][0]).toBe('gate-input');
      expect(fieldOf('gate-input')).toBe('gate-input');
    });
  });
});
