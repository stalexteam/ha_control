// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderLeakTrace, LEAK_WIDTH, type LeakTraceOpts } from '../../src/render/leak-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import type { Rule } from '../../src/model/types';
import type { RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 22, 0).getTime();
const AT = new Date(2026, 10, 17, 21, 43).getTime();
const rule = (sensors = ['wc', 'kit'], valves = ['cold', 'hot']): Rule => ({
  id: 'l', name: 'Leak protection', zoneId: null, combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [],
  leak: { sensors, valves },
});
const names: Record<string, string> = { wc: 'Leak WC', kit: 'Leak Kitchen', a: 'Leak A', b: 'Leak B', cold: 'Cold water valve', hot: 'Hot water valve' };

const wet: RuleTrace = {
  status: 'ok', verdict: true, unknownInputs: 0,
  inputs: [{ label: 'Leak WC', value: true, detail: 'wet' }, { label: 'Leak Kitchen', value: false, detail: 'dry' }],
  last: { action: 'close', target: 'Cold water valve', at: AT, reason: 're-closed: leak' },
  leak: { valves: [{ id: 'cold', name: 'Cold water valve', state: 'closed' }, { id: 'hot', name: 'Hot water valve', state: null }] },
};

function draw(over: Partial<LeakTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderLeakTrace({ rule: rule(), deviceName: id => names[id] ?? '(missing device)', note: null, now: NOW, onFocus, ...over }), host);
  return { host, onFocus };
}
const text = (host: HTMLElement, f: string) =>
  [...host.querySelector(`[data-block="${f}"]`)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' | ');
const cls = (host: HTMLElement, f: string) => host.querySelector(`[data-block="${f}"]`)!.classList;
const order = (host: HTMLElement) => [...host.querySelectorAll('[data-block]')].map(b => b.getAttribute('data-block'));
const pos = (host: HTMLElement, f: string) => {
  const m = /translate\(([\d.]+) ([\d.]+)\)/.exec(host.querySelector(`[data-block="${f}"]`)!.getAttribute('transform')!)!;
  const w = Number(host.querySelector(`[data-block="${f}"] rect`)!.getAttribute('width'));
  return { x: Number(m[1]), y: Number(m[2]), w };
};

describe('leak diagram', () => {
  it('has the compact width of the purpose-built family and never grows above 1:1', () => {
    const { host } = draw();
    expect(LEAK_WIDTH).toBe(PURPOSE_WIDTH);
    const svg = host.querySelector('svg.vt') as SVGElement;
    expect(svg.style.maxWidth).toBe(`${PURPOSE_WIDTH}px`);
    expect(svg.getAttribute('viewBox')).toMatch(new RegExp(`^0 0 ${PURPOSE_WIDTH} `));
  });

  it('sensors on top, the Leak block, the valves at the bottom; parameters without live data', () => {
    const { host } = draw();
    expect(order(host)).toEqual(['leak-sensor:wc', 'leak-sensor:kit', 'leak', 'leak-valve:cold', 'leak-valve:hot']);
    expect(text(host, 'leak-sensor:wc')).toBe('Leak WC | Leak sensor');
    expect(text(host, 'leak')).toBe('Leak | any sensor wet');
    expect(text(host, 'leak-valve:cold')).toBe('Cold water valve | close on leak');
    expect(pos(host, 'leak-sensor:wc').y).toBe(pos(host, 'leak-sensor:kit').y);
    expect(pos(host, 'leak').y).toBeGreaterThan(pos(host, 'leak-sensor:wc').y);
    expect(pos(host, 'leak-valve:cold').y).toBe(pos(host, 'leak-valve:hot').y);
    expect(pos(host, 'leak-valve:cold').y).toBeGreaterThan(pos(host, 'leak').y);
    for (const b of order(host)) expect(cls(host, b!).contains('on') || cls(host, b!).contains('nodata')).toBe(false);
  });

  it('live: sensor details with dry / wet / no data tones, the Leak verdict, valve states and the last action', () => {
    const tr: RuleTrace = { ...wet, inputs: [...wet.inputs.slice(0, 1), { label: 'Leak Kitchen', value: null, detail: 'unavailable' }] };
    const { host } = draw({ trace: tr });
    expect(text(host, 'leak-sensor:wc')).toBe('Leak WC | wet');
    expect(cls(host, 'leak-sensor:wc').contains('on')).toBe(true);
    expect(text(host, 'leak-sensor:kit')).toBe('Leak Kitchen | unavailable');
    expect(cls(host, 'leak-sensor:kit').contains('nodata')).toBe(true);
    expect(text(host, 'leak')).toBe('Leak: yes | any sensor wet');
    expect(cls(host, 'leak').contains('on')).toBe(true);
    expect(text(host, 'leak-valve:cold')).toBe('Cold water valve | closed | re-closed 21:43');
    expect(cls(host, 'leak-valve:cold').contains('on')).toBe(true);
    expect(text(host, 'leak-valve:hot')).toBe('Hot water valve | no data');
    expect(cls(host, 'leak-valve:hot').contains('nodata')).toBe(true);
  });

  it('dry: Leak no, a dry sensor and an open valve are neutral; the last close shows as closed with its time', () => {
    const tr: RuleTrace = {
      status: 'ok', verdict: false, unknownInputs: 0,
      inputs: [{ label: 'Leak WC', value: false, detail: 'dry' }, { label: 'Leak Kitchen', value: false, detail: 'dry' }],
      last: { action: 'close', target: 'Hot water valve', at: AT, reason: 'leak' },
      leak: { valves: [{ id: 'cold', name: 'Cold water valve', state: 'open' }, { id: 'hot', name: 'Hot water valve', state: 'open' }] },
    };
    const { host } = draw({ trace: tr });
    expect(text(host, 'leak')).toBe('Leak: no | any sensor wet');
    expect(text(host, 'leak-sensor:wc')).toBe('Leak WC | dry');
    expect(text(host, 'leak-valve:cold')).toBe('Cold water valve | open');
    expect(text(host, 'leak-valve:hot')).toBe('Hot water valve | open | last: closed 21:43');
    for (const b of order(host)) expect(cls(host, b!).contains('on') || cls(host, b!).contains('nodata')).toBe(false);
  });

  it('no sensor data: Leak no data; a failed last action adds the error line on its valve', () => {
    const tr: RuleTrace = {
      ...wet, verdict: null, status: 'waiting',
      inputs: [{ label: 'Leak WC', value: null, detail: 'unknown' }, { label: 'Leak Kitchen', value: null, detail: 'unknown' }],
      last: { action: 'close', target: 'Cold water valve', at: AT, reason: 'leak', error: 'target unavailable' },
    };
    const { host } = draw({ trace: tr });
    expect(text(host, 'leak')).toBe('Leak: no data | any sensor wet');
    expect(cls(host, 'leak').contains('nodata')).toBe(true);
    expect(text(host, 'leak-valve:cold')).toBe('Cold water valve | closed | last: closed 21:43 | target unavailable');
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Waiting for data');
  });

  it('four sensors: three per row, the last row centred; every block inside the width', () => {
    const { host } = draw({ rule: rule(['wc', 'kit', 'a', 'b'], ['cold']) });
    const ys = ['wc', 'kit', 'a', 'b'].map(id => pos(host, `leak-sensor:${id}`).y);
    expect(ys[0]).toBe(ys[2]);
    expect(ys[3]).toBeGreaterThan(ys[0]);
    const last = pos(host, 'leak-sensor:b');
    expect(last.x + last.w / 2).toBe(LEAK_WIDTH / 2);
    for (const b of order(host)) {
      const p = pos(host, b!);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x + p.w).toBeLessThanOrEqual(LEAK_WIDTH);
    }
  });

  it('empty lists show a placeholder block that leads to the add field', () => {
    const { host, onFocus } = draw({ rule: rule([], []) });
    expect(order(host)).toEqual(['leak-sensors', 'leak', 'leak-valves']);
    expect(text(host, 'leak-sensors')).toBe('Add a leak sensor');
    expect(text(host, 'leak-valves')).toBe('Add a valve');
    host.querySelector('[data-block="leak-valves"]')!.dispatchEvent(new MouseEvent('click'));
    expect(onFocus).toHaveBeenCalledWith('leak-valves');
  });

  it('a click on a block calls onFocus with its field; the focused block is highlighted', () => {
    const { host, onFocus } = draw({ focused: 'leak-valve:hot' });
    host.querySelector('[data-block="leak-sensor:kit"]')!.dispatchEvent(new MouseEvent('click'));
    expect(onFocus).toHaveBeenCalledWith('leak-sensor:kit');
    expect(cls(host, 'leak-valve:hot').contains('hl')).toBe(true);
    expect(cls(host, 'leak-valve:cold').contains('hl')).toBe(false);
  });

  it('shows the note under the diagram', () => {
    const { host } = draw({ note: 'Live state appears after Save' });
    expect(host.querySelector('.fc-note')!.textContent).toBe('Live state appears after Save');
  });
});
