// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'lit';
import { nextUnbound, renderBindingList, type ListFilter } from '../../src/panel/binding-list';
import type { BindStatus } from '../../src/model/bindings';
import { deviceDefaults, emptyLevel, type Device, type DeviceKind, type Level } from '../../src/model/types';
import type { Selection } from '../../src/editor/tools/types';

const dev = (id: string, name: string, kind: DeviceKind, bindings?: Device['bindings']): Device =>
  ({ id, name, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 }, props: deviceDefaults(kind, 'free'), bindings });

/** List order is by name: Bath fan, Desk lamp, Hall motion, Kitchen socket, Window switch. */
function sample(): Level {
  return {
    ...emptyLevel('l0'),
    devices: [
      dev('k', 'Kitchen socket', 'socket', { power: 'sensor.p' }),
      dev('h', 'Hall motion', 'motion_sensor', { motion: 'binary_sensor.gone' }),
      dev('d', 'Desk lamp', 'ceiling_light', { control: 'light.desk' }),
      dev('b', 'Bath fan', 'exhaust_fan'),
      dev('w', 'Window switch', 'switch', { action: 'event.w' }),
    ],
  };
}
const STATUS: Record<string, BindStatus> = { k: 'partial', h: 'missing', d: 'bound', b: 'unbound', w: 'bound' };
const status = (d: Device): BindStatus => STATUS[d.id];

function draw(o: { level?: Level; filter?: ListFilter; query?: string; selection?: Selection | null } = {}) {
  const onFilter = vi.fn(), onQuery = vi.fn(), onPick = vi.fn();
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(renderBindingList({
    level: o.level ?? sample(), selection: o.selection ?? null, status,
    filter: o.filter ?? 'unbound', query: o.query ?? '', onFilter, onQuery, onPick,
  }), host);
  const rows = () => [...host.querySelectorAll<HTMLElement>('.brow')];
  const names = () => rows().map(r => r.querySelector('.name')!.textContent!.trim());
  const count = (f: ListFilter) => host.querySelector(`[data-filter="${f}"] .count`)!.textContent!.trim();
  const empty = () => host.querySelector('.empty')?.textContent?.trim() ?? null;
  return { host, rows, names, count, empty, onFilter, onQuery, onPick };
}

describe('renderBindingList', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('filter counts: partial and missing count as Not bound', () => {
    const s = draw();
    expect(s.count('unbound')).toBe('3');
    expect(s.count('bound')).toBe('2');
    expect(s.count('all')).toBe('5');
    expect(s.host.querySelector('[data-filter="unbound"]')!.textContent).toContain('Not bound');
    expect(s.host.querySelector('[data-filter="unbound"]')!.getAttribute('aria-checked')).toBe('true');
    expect(s.host.querySelector('[data-filter="all"]')!.getAttribute('aria-checked')).toBe('false');
  });

  it('rows follow the filter, in name order, with a status dot, the kind and filled/total', () => {
    expect(draw().names()).toEqual(['Bath fan', 'Hall motion', 'Kitchen socket']);
    expect(draw({ filter: 'bound' }).names()).toEqual(['Desk lamp', 'Window switch']);
    const all = draw({ filter: 'all' });
    expect(all.names()).toEqual(['Bath fan', 'Desk lamp', 'Hall motion', 'Kitchen socket', 'Window switch']);
    const k = all.rows()[3];
    expect(k.querySelector('.dot')!.classList.contains('partial')).toBe(true);
    expect(k.querySelector('.kind')!.textContent!.trim()).toBe('Socket');
    expect(k.querySelector('.cnt')!.textContent!.trim()).toBe('1/2');
    expect(all.rows()[0].querySelector('.dot')!.classList.contains('unbound')).toBe(true);
    expect(all.rows()[1].querySelector('.dot')!.classList.contains('bound')).toBe(true);
    expect(all.rows()[2].querySelector('.dot')!.classList.contains('missing')).toBe(true);
  });

  it('clicking a filter or a row reports it; the selected row is marked', () => {
    const s = draw({ filter: 'all', selection: { kind: 'device', id: 'd' } });
    s.host.querySelector<HTMLButtonElement>('[data-filter="bound"]')!.click();
    expect(s.onFilter).toHaveBeenCalledWith('bound');
    s.rows()[3].click();
    expect(s.onPick).toHaveBeenCalledWith('k');
    expect(s.rows().map(r => r.classList.contains('sel'))).toEqual([false, true, false, false, false]);
  });

  it('search narrows by name and by kind, case-insensitive; typing reports the query', () => {
    expect(draw({ filter: 'all', query: 'desk' }).names()).toEqual(['Desk lamp']);
    expect(draw({ filter: 'all', query: 'SOCKET' }).names()).toEqual(['Kitchen socket']);
    expect(draw({ filter: 'all', query: 'motion sensor' }).names()).toEqual(['Hall motion']);
    const s = draw();
    const input = s.host.querySelector<HTMLInputElement>('input.list-search')!;
    input.value = 'fan';
    input.dispatchEvent(new Event('input'));
    expect(s.onQuery).toHaveBeenCalledWith('fan');
  });

  it('empty states', () => {
    const allBound: Level = { ...sample(), devices: sample().devices.filter(d => STATUS[d.id] === 'bound') };
    expect(draw({ level: allBound, filter: 'unbound' }).empty()).toBe('Every device is bound.');
    const noneBound: Level = { ...sample(), devices: sample().devices.filter(d => STATUS[d.id] !== 'bound') };
    expect(draw({ level: noneBound, filter: 'bound' }).empty()).toBe('No bound devices yet.');
    expect(draw({ filter: 'all', query: 'zzz' }).empty()).toBe('No devices match this filter.');
    expect(draw({ filter: 'unbound', query: 'zzz' }).empty()).toBe('No devices match this filter.');
    expect(draw({ level: emptyLevel('e'), filter: 'unbound' }).empty()).toBe('No devices on the plan yet. Place them in the Equipment step.');
    expect(draw().empty()).toBeNull();
  });
});

describe('nextUnbound', () => {
  it('goes to the next not-bound device in list order and wraps around', () => {
    const lv = sample();
    expect(nextUnbound(lv, null, status)).toBe('b');
    expect(nextUnbound(lv, 'b', status)).toBe('h');
    expect(nextUnbound(lv, 'h', status)).toBe('k');
    expect(nextUnbound(lv, 'k', status)).toBe('b');
    expect(nextUnbound(lv, 'd', status)).toBe('h'); // from a bound device
    expect(nextUnbound(lv, 'w', status)).toBe('b'); // last in order: wraps
    expect(nextUnbound(lv, 'gone', status)).toBe('b');
  });

  it('a single not-bound device is returned again; none -> null', () => {
    const lv = sample();
    const one = (d: Device): BindStatus => (d.id === 'h' ? 'partial' : 'bound');
    expect(nextUnbound(lv, 'h', one)).toBe('h');
    expect(nextUnbound(lv, null, () => 'bound')).toBeNull();
    expect(nextUnbound(emptyLevel('e'), null, status)).toBeNull();
  });
});
