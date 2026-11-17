// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderControlTrace, controlFocus, CONTROL_WIDTH, type ControlTraceOpts } from '../../src/render/control-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import type { Rule } from '../../src/model/types';
import type { ControlTrace, RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 20, 0).getTime();
const rule = (sources: string[], loads: string[]): Rule => ({
  id: 'r', name: 'Load control', zoneId: null, combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [], control: { sources, loads },
});
const names: Record<string, string> = { sw: 'Switch hall', btn: 'Button vent', pir: 'Motion sensor', a: 'Light', b: 'Vent', c: 'Socket', d: 'Fan', e: 'Heater' };
const kinds: Record<string, string> = { sw: 'wall_switch', btn: 'smart_button', 'btn-sep': 'smart_button', pir: 'motion_sensor' };
const live = (c: Partial<ControlTrace>, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: null, inputs: [], unknownInputs: 0, control: { sources: [], loads: [], ...c }, ...over,
});

function draw(r: Rule, over: Partial<ControlTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderControlTrace({
    rule: r, deviceName: id => names[id] ?? 'x', deviceKind: id => kinds[id] ?? 'equipment', separateOff: id => id === 'btn-sep',
    note: null, now: NOW, onFocus, ...over,
  }), host);
  return { host, onFocus };
}
const text = (host: HTMLElement, f: string) =>
  [...host.querySelector(`[data-block="${f}"]`)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' | ');
const order = (host: HTMLElement) => [...host.querySelectorAll('[data-block]')].map(b => b.getAttribute('data-block'));
const rowCount = (host: HTMLElement, ids: string[]) =>
  new Set(ids.map(id => host.querySelector(`[data-block="${id}"]`)!.getAttribute('transform')!.split(' ')[1])).size;

describe('load control diagram', () => {
  it('has the compact width and routes focus to the lists', () => {
    const { host } = draw(rule(['sw'], ['a']));
    expect(CONTROL_WIDTH).toBe(PURPOSE_WIDTH);
    expect((host.querySelector('svg.vt') as SVGElement).style.maxWidth).toBe(`${PURPOSE_WIDTH}px`);
    expect(controlFocus('control-source:sw')).toBe('control-sources');
    expect(controlFocus('control')).toBe('control-sources');
    expect(controlFocus('control-load:a')).toBe('control-loads');
  });

  it('parameters only: source and load names, the static texts and the rule text', () => {
    const { host } = draw(rule(['sw', 'btn', 'pir'], ['a', 'b']));
    expect(order(host)).toEqual(['control-source:sw', 'control-source:btn', 'control-source:pir', 'control', 'control-load:a', 'control-load:b']);
    expect(text(host, 'control-source:sw')).toBe('Switch hall | repeated');
    expect(text(host, 'control-source:btn')).toBe('Button vent | toggle');
    expect(text(host, 'control-source:pir')).toBe('Motion sensor | repeated');
    expect(text(host, 'control')).toBe('Sets the loads | button: toggle (any on: all off) or on / off; switch, motion: repeat');
    expect(text(host, 'control-load:a')).toBe('Light');
    expect(host.querySelectorAll('.fc-blk.on, .fc-blk.off, .fc-blk.na').length).toBe(0);
  });

  it('a smart button with its own off shows on / off', () => {
    const { host } = draw(rule(['btn-sep'], ['a']), { deviceName: () => 'Button 2' });
    expect(text(host, 'control-source:btn-sep')).toBe('Button 2 | on / off');
  });

  it('live: a wall switch shows on, a motion sensor motion / clear, loads on / no data', () => {
    const r = rule(['sw', 'pir', 'btn'], ['a', 'b']);
    const t = live({
      sources: [
        { id: 'sw', name: 'Switch hall', kind: 'wall_switch', state: 'on' },
        { id: 'pir', name: 'Motion sensor', kind: 'motion_sensor', state: 'on' },
        { id: 'btn', name: 'Button vent', kind: 'smart_button', state: null },
      ],
      loads: [{ id: 'a', name: 'Light', state: 'on' }, { id: 'b', name: 'Vent', state: null }],
    });
    const { host } = draw(r, { trace: t });
    expect(text(host, 'control-source:sw')).toBe('Switch hall | on | repeated');
    expect(text(host, 'control-source:pir')).toBe('Motion sensor | motion | repeated');
    expect(text(host, 'control-source:btn')).toBe('Button vent | toggle');
    expect(text(host, 'control-load:a')).toBe('Light | on');
    expect(text(host, 'control-load:b')).toBe('Vent | no data');
    const t2 = live({
      sources: [{ id: 'pir', name: 'Motion sensor', kind: 'motion_sensor', state: 'off' }, { id: 'sw', name: 'Switch hall', kind: 'wall_switch', state: null }],
      loads: [],
    });
    const two = draw(rule(['pir', 'sw'], ['a']), { trace: t2 }).host;
    expect(text(two, 'control-source:pir')).toBe('Motion sensor | clear | repeated');
    expect(text(two, 'control-source:sw')).toBe('Switch hall | no data | repeated');
  });

  it('five loads and five sources sit in two rows of at most four', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const { host } = draw(rule(ids, ids));
    expect(rowCount(host, ids.map(i => `control-source:${i}`))).toBe(2);
    expect(rowCount(host, ids.map(i => `control-load:${i}`))).toBe(2);
    expect(rowCount(host, ids.slice(0, 4).map(i => `control-load:${i}`))).toBe(1);
  });

  it('shows the last action; an error goes in the block line and the status shows under the diagram', () => {
    const last = { action: 'on' as const, target: 'Light', at: NOW, reason: 'Button vent: toggle', error: 'target unavailable' };
    const { host } = draw(rule(['btn'], ['a']), { trace: live({ loads: [{ id: 'a', name: 'Light', state: null }] }, { last, status: 'error', reason: 'target unavailable' }) });
    const lastBlock = text(host, 'control-last');
    expect(lastBlock).toContain('20:00');
    expect(lastBlock).toContain('target unavailable');
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Error: target unavailable');
  });

  it('has no last line without an entry and shows the note when given', () => {
    const { host } = draw(rule(['sw'], ['a']), { trace: live({ loads: [{ id: 'a', name: 'Light', state: 'off' }] }), note: 'Saved version' });
    expect(host.querySelector('.fc-note')!.textContent).toBe('Saved version');
    expect(host.querySelector('[data-block="control-last"]')).toBeNull();
  });

  it('empty lists show an add hint; clicking a block calls onFocus with its data-block', () => {
    const { host, onFocus } = draw(rule([], []));
    expect(order(host)).toEqual(['control-sources', 'control', 'control-loads']);
    expect(text(host, 'control-sources')).toBe('Add a button, a wall switch or a motion sensor');
    expect(text(host, 'control-loads')).toBe('Add a load');
    host.querySelector('[data-block="control-loads"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onFocus).toHaveBeenCalledWith('control-loads');
  });
});
