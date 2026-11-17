// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderControlFlow, controlFlowFocus } from '../../src/render/control-flow';
import { isButtonSource, type ControlAction, type ControlSource, type Rule } from '../../src/model/types';
import type { ControlTrace, RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 20, 0).getTime();
const names: Record<string, string> = { sw: 'Switch hall', btn: 'Button vent', pir: 'Motion sensor', g: 'Daylight', a: 'Light', b: 'Vent', c: 'Socket', v: 'Cold valve' };
const act = (d: string, do_: ControlAction['do']): ControlAction => ({ device: d, do: do_ });
const rule = (sources: ControlSource[], lists: Partial<Record<'on' | 'off' | 'toggle', ControlAction[]>>, gate = false): Rule => ({
  id: 'r', name: 'Load control', zoneId: null, combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [],
  ...(gate ? { gate: { source: { device: 'g' } } } : {}),
  control: { sources, on: [], off: [], toggle: [], ...lists },
});
const dev = (id: string): ControlSource => ({ source: { device: id } });
const five: ControlSource[] = [dev('sw'), { button: 'btn' }, dev('pir'), dev('a'), dev('b')];
const uneven = rule(five, { on: [act('a', 'on'), act('b', 'on'), act('c', 'on')], toggle: [act('a', 'toggle')] }, true);
const live = (c: Partial<ControlTrace>, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: null, inputs: [], unknownInputs: 0, control: { devices: [], ...c }, ...over,
});

function draw(r: Rule, trace?: RuleTrace, over: Record<string, unknown> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderControlFlow({
    rule: r, trace, now: NOW, nameOf: id => names[id] ?? 'x', sourceLabel: s => (isButtonSource(s) ? names[s.button] : 'device' in s.source ? names[s.source.device] : 'x'),
    gives: s => (isButtonSource(s) && s.button === 'btn' ? 'toggle' : 'on / off'), focused: null, onFocus, ...over,
  }), host);
  return { host, onFocus };
}
const text = (host: HTMLElement, f: string) =>
  [...host.querySelector(`[data-block="${f}"]`)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' | ');
const ids = (host: HTMLElement) => [...host.querySelectorAll('[data-block]')].map(b => b.getAttribute('data-block')!);
const ys = (host: HTMLElement, list: string[]) =>
  new Set(list.map(id => host.querySelector(`[data-block="${id}"]`)!.getAttribute('transform')!.split(' ')[1])).size;

describe('load control flowchart', () => {
  it('static: five sources in two rows, event, gate, three uneven columns with an empty one', () => {
    const { host } = draw(uneven);
    expect(ids(host)).toEqual(['source:0', 'source:1', 'source:2', 'source:3', 'source:4', 'event', 'gate', 'on:0', 'on:1', 'on:2', 'off:empty', 'toggle:0']);
    expect(ys(host, ['source:0', 'source:1', 'source:2', 'source:3'])).toBe(1);
    expect(ys(host, ['source:0', 'source:4'])).toBe(2);
    expect(text(host, 'source:0')).toBe('Switch hall | gives on / off');
    expect(text(host, 'source:1')).toBe('Button vent | gives toggle');
    expect(text(host, 'event')).toBe('Event | no event yet');
    expect(text(host, 'gate')).toBe('Gate: Daylight | Device');
    expect(text(host, 'on:1')).toBe('Vent | on');
    expect(text(host, 'toggle:0')).toBe('Light | toggle');
    expect(text(host, 'off:empty')).toBe('nothing');
    expect(host.textContent).toContain('When on');
    expect(host.textContent).toContain('When off');
    expect(host.textContent).toContain('When toggle');
    expect(host.querySelectorAll('.fc-blk.on, .fc-blk.off, .fc-blk.nodata').length).toBe(0);
  });

  it('live: source value and detail, gives, event, dropped, device state, last action with its error on one block', () => {
    const r = rule([dev('sw'), { button: 'btn' }], { on: [act('a', 'on')], off: [act('a', 'off')], toggle: [act('a', 'toggle'), act('b', 'toggle')] });
    const t = live({
      event: { source: 'Button vent', what: 'toggle', at: NOW },
      devices: [{ id: 'a', name: 'Light', state: 'on' }, { id: 'b', name: 'Vent', state: null }],
    }, {
      inputs: [{ label: 'Switch hall', value: true, detail: 'on', gives: 'on / off' }, { label: 'Button vent', value: null, detail: '', gives: 'toggle' }],
      last: { action: 'on', target: 'Vent', at: NOW, reason: 'Button vent: toggle', error: 'target unavailable' },
    });
    const { host } = draw(r, t);
    expect(text(host, 'source:0')).toBe('Switch hall | on | gives on / off');
    expect(text(host, 'source:1')).toBe('Button vent | gives toggle');
    expect(host.querySelector('[data-block="source:0"]')!.getAttribute('class')).toContain(' on');
    expect(text(host, 'event')).toBe(`Event | Button vent: toggle ${new Date(NOW).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    expect(text(host, 'on:0')).toBe('Light | on | on');
    expect(text(host, 'off:0')).toBe('Light | off | on');
    expect(text(host, 'toggle:0')).toBe('Light | toggle | on');
    expect(text(host, 'toggle:1')).toMatch(/^Vent \| toggle \| no data \| last: .+ \| target unavailable$/);
    expect(host.querySelectorAll('.fc-err').length).toBe(1);
    expect(host.querySelector('[data-block="toggle:1"] .fc-err')!.textContent).toBe('target unavailable');
  });

  it('live: a dropped event warns and writes no last action; the last goes in the column of the event', () => {
    const r = rule([dev('sw')], { on: [act('a', 'on')], off: [act('a', 'off')] });
    const last = { action: 'off' as const, target: 'Light', at: NOW, reason: 'Switch hall: off' };
    const inputs = [{ label: 'Switch hall', value: false, detail: 'off', gives: 'on / off' }];
    const devices = [{ id: 'a', name: 'Light', state: 'off' as const }];
    const dropped = draw(r, live({ event: { source: 'Switch hall', what: 'off', at: NOW, dropped: 'gate closed' }, devices }, { inputs, last })).host;
    expect(text(dropped, 'event')).toContain('dropped: gate closed');
    expect(dropped.querySelector('[data-block="event"]')!.getAttribute('class')).toContain(' nodata');
    expect(text(dropped, 'off:0')).toBe('Light | off | off');
    const ok = draw(r, live({ event: { source: 'Switch hall', what: 'off', at: NOW }, devices }, { inputs, last })).host;
    expect(text(ok, 'off:0')).toMatch(/^Light \| off \| off \| last: /);
    expect(text(ok, 'on:0')).toBe('Light | on | off');
  });

  it('live: a gate trace is drawn as the condition flowchart does; a valve shows open / closed', () => {
    const r = rule([dev('sw')], { on: [act('b', 'on')], off: [act('v', 'close')] }, true);
    const t = live({ devices: [{ id: 'b', name: 'Vent', state: 'open' }, { id: 'v', name: 'Cold valve', state: 'closed' }] }, {
      inputs: [{ label: 'Switch hall', value: true, detail: 'on', gives: 'on / off' }], gate: { value: true, detail: '' },
    });
    const { host } = draw(r, t);
    expect(text(host, 'gate')).toBe('Gate: Daylight | open');
    expect(text(host, 'on:0')).toBe('Vent | on | open');
    expect(text(host, 'off:0')).toBe('Cold valve | close | closed');
  });

  it('no link runs through a block', () => {
    const wide = rule([...five, dev('c')], { on: [act('a', 'on'), act('b', 'on')], off: [act('c', 'off')] });
    for (const r of [uneven, wide, rule([], {}), rule([dev('sw')], { on: [act('a', 'on')] }, true)]) {
      const { host } = draw(r);
      const boxes = [...host.querySelectorAll('[data-block]')].map(g => {
        const [x, y] = g.getAttribute('transform')!.slice(10, -1).split(' ').map(Number);
        const rect = g.querySelector('rect')!;
        return { x, y, w: Number(rect.getAttribute('width')), h: Number(rect.getAttribute('height')) };
      });
      const d = [...host.querySelectorAll('.fc-link')].map(p => p.getAttribute('d')).join(' ');
      for (const [, x, y1, y2] of [...d.matchAll(/M([\d.]+) ([\d.]+) V([\d.]+)/g)].map(m => m.map(Number))) {
        const crossed = boxes.filter(b => x > b.x && x < b.x + b.w && Math.min(y1, y2) < b.y + b.h - 0.5 && Math.max(y1, y2) > b.y + 0.5);
        expect(crossed, `M${x} ${y1} V${y2}`).toEqual([]);
      }
      for (const [, x1, y, x2] of [...d.matchAll(/M([\d.]+) ([\d.]+) H([\d.]+)/g)].map(m => m.map(Number))) {
        const crossed = boxes.filter(b => y > b.y + 0.5 && y < b.y + b.h - 0.5 && Math.max(x1, x2) > b.x && Math.min(x1, x2) < b.x + b.w);
        expect(crossed, `M${x1} ${y} H${x2}`).toEqual([]);
      }
    }
  });

  it('a click on a block calls onFocus with its id; the id maps to a form field', () => {
    const { host, onFocus } = draw(uneven);
    host.querySelector('[data-block="toggle:0"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onFocus).toHaveBeenCalledWith('toggle:0');
    expect(controlFlowFocus('source:2')).toBe('control-source-2');
    expect(controlFlowFocus('gate')).toBe('control-gate');
    expect(controlFlowFocus('on:1')).toBe('control-on-1');
    expect(controlFlowFocus('off:empty')).toBe('control-off');
    expect(controlFlowFocus('event')).toBe('control-source-0');
  });
});
