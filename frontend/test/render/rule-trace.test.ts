// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderRuleTrace, WIDTH, FLOW_MAX_SCALE, gateValue, fieldOf, type FocusTarget, type RuleTraceOpts } from '../../src/render/rule-trace';
import { countdown } from '../../src/render/flow-block';
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
/** The visible lines of a block (its <title> tooltip left out). */
const text = (host: HTMLElement, sel: string) =>
  [...host.querySelector(sel)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' ').replace(/\s+/g, ' ');
type Box = { x: number; y: number; w: number; h: number };
/** A block's box in viewBox units. */
function box(host: HTMLElement, f: string): Box {
  const g = host.querySelector(`[data-block="${f}"]`)!;
  const [, x, y] = /translate\(([\d.-]+) ([\d.-]+)\)/.exec(g.getAttribute('transform')!)!.map(Number);
  const r = g.querySelector('rect')!;
  return { x, y, w: Number(r.getAttribute('width')), h: Number(r.getAttribute('height')) };
}
const fields = (host: HTMLElement) => [...host.querySelectorAll('[data-block]')].map(b => b.getAttribute('data-block')!);
const viewH = (host: HTMLElement) => Number(host.querySelector('svg.fc')!.getAttribute('viewBox')!.split(' ')[3]);
/** The corner points of the orthogonal link paths ("M x y V y H x ..."), one list per path. */
function linkPoints(host: HTMLElement): [number, number][][] {
  return [...host.querySelectorAll('.fc-link')].map(p => {
    const pts: [number, number][] = [];
    let x = 0, y = 0;
    for (const [, c, n] of p.getAttribute('d')!.matchAll(/([MVH])\s*([\d.-]+(?:\s+[\d.-]+)?)/g)) {
      const v = n.trim().split(/\s+/).map(Number);
      if (c === 'M') [x, y] = v; else if (c === 'V') y = v[0]; else x = v[0];
      pts.push([x, y]);
    }
    return pts;
  });
}

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
    expect(text(host, '[data-block="delays"]')).toBe('Result false, true in 0:04');
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

  it('live countdowns use the vent run-on format (m:ss, h:mm:ss); parameters keep their units', () => {
    expect([countdown(4), countdown(45), countdown(232), countdown(3725)]).toEqual(['0:04', '0:45', '3:52', '1:02:05']);
    const trace: RuleTrace = { status: 'ok', verdict: true, unknownInputs: 0, pending: { to: false, at: NOW + 232_000 }, inputs: [] };
    const { host } = draw({ trace, rule: { ...rule, offDelay: 300 } });
    expect(text(host, '[data-block="delays"]')).toBe('Result true, false in 3:52');
    expect(text(draw({ rule: { ...rule, offDelay: 300 } }).host, '[data-block="delays"]')).toBe('Result delay on 0 s, off 300 s');
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

  describe('top to bottom', () => {
    const many = (n: number, over: Partial<Rule> = {}): Rule => ({
      ...rule, inputs: Array.from({ length: n }, () => ({ source: { device: 'leak' } })), ...over,
    });
    const bottom = (b: Box) => b.y + b.h;
    const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

    it('has the vent diagram width: inputs, then ANY/ALL, then the result, then the gate, then the actions', () => {
      const { host } = draw({ rule: { ...rule, gate: { source: { sun: true } } } });
      expect(host.querySelector('svg.fc')!.getAttribute('viewBox')).toMatch(new RegExp(`^0 0 ${WIDTH} `));
      const inputsBottom = Math.max(...[0, 1].map(k => bottom(box(host, `input-${k}`))));
      expect(inputsBottom).toBeLessThan(box(host, 'combine').y);
      expect(bottom(box(host, 'combine'))).toBeLessThan(box(host, 'delays').y);
      expect(bottom(box(host, 'delays'))).toBeLessThan(box(host, 'gate-input').y);
      expect(bottom(box(host, 'gate-input'))).toBeLessThan(box(host, 'action-true-0').y);
      expect(bottom(box(host, 'gate-input'))).toBeLessThan(box(host, 'action-false-0').y);
    });

    it('draws When true on the left of When false, each a column under its heading', () => {
      const { host } = draw();
      const t0 = box(host, 'action-true-0'), f0 = box(host, 'action-false-0'), f1 = box(host, 'action-false-1');
      expect(t0.x + t0.w).toBeLessThan(f0.x);
      expect(f1.x).toBe(f0.x);
      expect(f1.y).toBeGreaterThan(bottom(f0));
      expect(t0.y).toBe(f0.y);
      const heads = [...host.querySelectorAll('.fc-head')];
      expect(heads.map(h => h.textContent)).toEqual(['When true', 'When false']);
      expect(Number(heads[0].getAttribute('y'))).toBeLessThan(t0.y);
    });

    it('says No actions in an empty column; a long column does not move the other one', () => {
      const r: Rule = { ...rule, onFalse: [], onTrue: Array.from({ length: 6 }, () => ({ device: 'valve', do: 'close' as const })) };
      const { host } = draw({ rule: r });
      expect(host.textContent).toContain('No actions');
      expect(fields(host).filter(f => f.startsWith('action-true-'))).toHaveLength(6);
      expect(viewH(host)).toBeGreaterThanOrEqual(bottom(box(host, 'action-true-5')));
      const short = draw();
      expect(box(host, 'action-true-0')).toEqual(box(short.host, 'action-true-0'));
    });

    it('wraps many inputs into rows inside the width, nothing overlaps', () => {
      for (const n of [1, 3, 4, 5, 6, 9, 10]) {
        const { host } = draw({ rule: many(n, { gate: { source: { sun: true } } }) });
        const boxes = fields(host).map(f => box(host, f));
        for (const b of boxes) {
          expect(b.x).toBeGreaterThanOrEqual(0);
          expect(b.x + b.w).toBeLessThanOrEqual(WIDTH);
          expect(b.y + b.h).toBeLessThanOrEqual(viewH(host));
        }
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) expect(overlaps(boxes[i], boxes[j])).toBe(false);
        const ins = Array.from({ length: n }, (_, k) => box(host, `input-${k}`));
        expect(new Set(ins.map(b => b.y)).size).toBe(Math.ceil(n / 4));
        if (n > 4) expect(ins[4].y - bottom(ins[0])).toBeGreaterThanOrEqual(36); // room for the bus between rows
        expect(Math.max(...ins.map(bottom))).toBeLessThan(box(host, 'combine').y);
      }
    });

    it('links stay attached: every input and every chain block is joined, no link crosses a block', () => {
      for (const n of [1, 2, 3, 5, 9, 10]) {
        for (const gate of [undefined, { source: { sun: true as const } }]) {
          const { host } = draw({ rule: many(n, gate ? { gate } : {}) });
          const paths = linkPoints(host);
          const all = paths.flat(), starts = paths.map(p => p[0]), ends = paths.map(p => p[p.length - 1]);
          const at = (pts: [number, number][], x: number, y: number) => pts.some(([px, py]) => Math.abs(px - x) < 0.01 && Math.abs(py - y) < 0.01);
          for (let k = 0; k < n; k++) {
            const b = box(host, `input-${k}`);
            expect(at(starts, b.x + b.w / 2, bottom(b)), `n=${n} input-${k}`).toBe(true);
          }
          const chain = ['combine', 'delays', ...(gate ? ['gate-input'] : [])].map(f => box(host, f));
          for (const b of chain) expect(at(all, b.x + b.w / 2, b.y)).toBe(true);
          for (const b of chain) expect(at(all, b.x + b.w / 2, bottom(b))).toBe(true);
          expect(ends.filter(([, y]) => y > bottom(chain[chain.length - 1]))).toHaveLength(2); // into both columns
          // Each segment stays clear of every block (ending on its edge where it attaches is fine).
          const boxes = fields(host).map(f => box(host, f));
          for (const p of paths) for (let i = 1; i < p.length; i++) {
            const [x1, y1] = p[i - 1], [x2, y2] = p[i];
            const seg: Box = x1 === x2
              ? { x: x1, y: Math.min(y1, y2) + 0.5, w: 0.001, h: Math.abs(y2 - y1) - 1 }
              : { x: Math.min(x1, x2) + 0.5, y: y1, w: Math.abs(x2 - x1) - 1, h: 0.001 };
            for (const b of boxes) expect(overlaps(seg, b), `n=${n} gate=${!!gate} ${p.join(' ')}`).toBe(false);
          }
        }
      }
    });

    it('grows taller with more inputs and actions', () => {
      const small = viewH(draw().host);
      expect(viewH(draw({ rule: many(10) }).host)).toBeGreaterThan(small);
      expect(viewH(draw({ rule: { ...rule, onTrue: Array.from({ length: 8 }, () => ({ device: 'valve', do: 'close' as const })) } }).host)).toBeGreaterThan(small);
    });

    it('clips long names to the box; the tooltip has the full text', () => {
      const long = 'L'.repeat(90);
      const { host } = draw({ inputName: () => long, actionName: () => long });
      for (const f of ['input-0', 'action-true-0']) {
        const b = host.querySelector(`[data-block="${f}"]`)!;
        expect(b.querySelector('svg.fc-clip')).not.toBeNull();
        expect(b.querySelector('text')!.textContent!.endsWith('…')).toBe(true);
        expect(b.querySelector('title')!.textContent).toContain(long);
      }
    });
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
      expect(box(host, 'delays').y + box(host, 'delays').h).toBeLessThan(box(host, 'gate-input').y);
      expect(box(host, 'gate-input').y + box(host, 'gate-input').h).toBeLessThan(box(host, 'action-true-0').y);
    });

    it('shows the server detail of a dark-by-default light input', () => {
      const trace: RuleTrace = {
        status: 'ok', verdict: true, unknownInputs: 0,
        inputs: [{ label: 'a', value: true, detail: 'no data (dark)' }, ...r2.inputs.slice(1).map(() => ({ label: '', value: true, detail: 'd' }))],
      };
      const { host } = draw({ rule: r2, inputName: nm, trace });
      expect(text(host, '[data-block="input-0"]')).toBe('Light sensor no data (dark)');
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
      expect(text(host, '[data-block="input-3"]')).toBe('Held: Light true in 18:00');
      expect(text(host, '[data-block="gate-input"]')).toBe('Gate: Held: Light closed, opens in 1:30');
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

    describe('daylight', () => {
      const r3: Rule = {
        ...rule, combine: 'all', offDelay: 0,
        inputs: [{ source: { daylight: 'lux', is: 'night' } }, { source: { daylight: 'lux', is: 'dark' } }],
        gate: { source: { daylight: 'lux', is: 'day' } },
      };
      const nm3 = (): string => 'Porch';

      it('blocks show the asked state before live values', () => {
        const { host } = draw({ rule: r3, inputName: nm3 });
        expect(text(host, '[data-block="input-0"]')).toBe('Porch is night');
        expect(text(host, '[data-block="input-1"]')).toBe('Porch is dark');
        expect(text(host, '[data-block="gate-input"]')).toBe('Gate: Porch is day');
      });

      it('a pending change ticks from `until`; the detail stays otherwise', () => {
        const trace: RuleTrace = {
          status: 'ok', verdict: true, unknownInputs: 0,
          inputs: [
            { label: 'Porch', value: true, detail: 'night, 62 lx (day in 0:42)', until: NOW + 42_000 },
            { label: 'Porch', value: true, detail: 'twilight, sun -3.2°' },
          ],
          gate: { value: false, detail: 'night, 62 lx (day in 0:42)', until: NOW + 42_000 },
        };
        const at = (now: number) => draw({ rule: r3, inputName: nm3, trace, now }).host;
        expect(text(at(NOW), '[data-block="input-0"]')).toBe('Porch night, 62 lx (day in 0:42)');
        expect(text(at(NOW + 10_000), '[data-block="input-0"]')).toBe('Porch night, 62 lx (day in 0:32)');
        expect(text(at(NOW + 10_000), '[data-block="input-1"]')).toBe('Porch twilight, sun -3.2°');
        expect(text(at(NOW + 10_000), '[data-block="gate-input"]')).toBe('Gate: Porch closed, night, 62 lx (day in 0:32)');
        // Past `until` before the next frame: the change is due, so the countdown stays at its last second.
        expect(text(at(NOW + 60_000), '[data-block="input-0"]')).toBe('Porch night, 62 lx (day in 0:01)');
      });

      it('an open daylight gate shows its state too; no data stays closed, no data', () => {
        const base: RuleTrace = { status: 'ok', verdict: true, unknownInputs: 0, inputs: r3.inputs.map(() => ({ label: '', value: true, detail: 'd' })) };
        const open = draw({ rule: r3, inputName: nm3, trace: { ...base, gate: { value: true, detail: 'day, 320 lx' } } });
        expect(text(open.host, '[data-block="gate-input"]')).toBe('Gate: Porch open, day, 320 lx');
        const no = draw({ rule: r3, inputName: nm3, trace: { ...base, gate: { value: null, detail: 'no data' } } });
        expect(text(no.host, '[data-block="gate-input"]')).toBe('Gate: Porch closed, no data');
      });
    });

    it('a click on the gate block reports gate-input', () => {
      const { host, onFocus } = draw({ rule: r2, inputName: nm });
      host.querySelector('[data-block="gate-input"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onFocus.mock.calls[0][0]).toBe('gate-input');
      expect(fieldOf('gate-input')).toBe('gate-input');
    });
  });
});
