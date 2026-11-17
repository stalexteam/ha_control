// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderControlTrace, controlFocus, CONTROL_WIDTH, type ControlTraceOpts } from '../../src/render/control-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import type { Rule } from '../../src/model/types';
import type { ControlTrace, RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 20, 0).getTime();
const rule = (sources: string[], loads: string[]): Rule => ({
  id: 'r', name: 'Load control', zoneId: null, combine: 'any', inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [],
  control: {
    sources: sources.map(id => (kinds[id] === 'smart_button' ? { button: id } : { source: { device: id } })),
    on: loads.map(device => ({ device, do: 'on' as const })), off: loads.map(device => ({ device, do: 'off' as const })), toggle: loads.map(device => ({ device, do: 'toggle' as const })),
  },
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

  it('five loads and five sources sit in two rows of at most three', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const { host } = draw(rule(ids, ids));
    expect(rowCount(host, ids.map(i => `control-source:${i}`))).toBe(2);
    expect(rowCount(host, ids.map(i => `control-load:${i}`))).toBe(2);
    expect(rowCount(host, ids.slice(0, 3).map(i => `control-load:${i}`))).toBe(1);
  });

  it('no link runs through a block (the trunk of several rows runs in a column gap)', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    for (const r of [rule(ids, ids), rule(['sw', 'btn', 'pir', 'a'], ['b', 'c']), rule(['sw'], ['a', 'b', 'c'])]) {
      const { host } = draw(r);
      const boxes = [...host.querySelectorAll('[data-block]')].map(g => {
        const [x, y] = g.getAttribute('transform')!.slice(10, -1).split(' ').map(Number);
        const rect = g.querySelector('rect')!;
        return { x, y, w: Number(rect.getAttribute('width')), h: Number(rect.getAttribute('height')) };
      });
      const d = host.querySelector('.fc-link')!.getAttribute('d')!;
      for (const [, x, y1, y2] of [...d.matchAll(/M([\d.]+) ([\d.]+) V([\d.]+)/g)].map(m => m.map(Number))) {
        const crossed = boxes.filter(b => x > b.x && x < b.x + b.w && Math.min(y1, y2) < b.y + b.h - 0.5 && Math.max(y1, y2) > b.y + 0.5);
        expect(crossed, `M${x} ${y1} V${y2}`).toEqual([]);
      }
    }
  });

  it('four sources take two rows; a name of 19 characters is not clipped', () => {
    const ids = ['sw', 'btn', 'pir', 'a'];
    const { host } = draw(rule(ids, ['b']), { deviceName: id => (id === 'a' ? 'Bathroom heater 123' : names[id]) });
    expect(rowCount(host, ids.map(i => `control-source:${i}`))).toBe(2);
    expect(rowCount(host, ids.slice(0, 3).map(i => `control-source:${i}`))).toBe(1);
    expect(text(host, 'control-source:a')).toBe('Bathroom heater 123');
  });

  it('a source of an unknown or no kind shows its name only', () => {
    const r = rule(['x', 'y'], ['a']);
    expect(text(draw(r, { deviceKind: () => undefined }).host, 'control-source:x')).toBe('x');
    const t2 = live({ sources: [{ id: 'x', name: 'x', kind: null, state: null }, { id: 'y', name: 'x', kind: 'socket', state: 'on' }] });
    const { host } = draw(r, { trace: t2, deviceKind: () => 'wall_switch' });
    expect(text(host, 'control-source:x')).toBe('x');
    expect(text(host, 'control-source:y')).toBe('x');
  });

  it('shows the last action; an error goes in the block line and the status shows under the diagram', () => {
    const last = { action: 'on' as const, target: 'Light', at: NOW, reason: 'Button vent: toggle', error: 'target unavailable' };
    const { host } = draw(rule(['btn'], ['a']), { trace: live({ loads: [{ id: 'a', name: 'Light', state: null }] }, { last, status: 'error', reason: 'target unavailable' }) });
    const lastBlock = text(host, 'control-last');
    expect(lastBlock).toBe('last: Light turned on 20:00 (Button vent: toggle) | target unavailable');
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Error: target unavailable');
  });

  it('the last line names the load; one that was in that state already says so once', () => {
    const at = new Date(2026, 10, 17, 21, 43).getTime();
    const tr = (last: NonNullable<RuleTrace['last']>) => live({ loads: [{ id: 'a', name: 'Light', state: 'off' }] }, { last });
    const sent = draw(rule(['sw'], ['a']), { trace: tr({ action: 'off', target: 'Light', at, reason: 'Switch hall: off' }) }).host;
    expect(text(sent, 'control-last')).toBe('last: Light turned off 21:43 (Switch hall: off)');
    const already = draw(rule(['sw'], ['a']), { trace: tr({ action: 'off', target: 'Lamp 2', at, reason: 'Switch A: off', sent: false }) }).host;
    expect(text(already, 'control-last')).toBe('last: Lamp 2 already off 21:43 (Switch A: off)');
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
