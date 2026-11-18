import { describe, it, expect } from 'vitest';
import { hintLines, placeHint } from '../../src/render/power-hint';

const NOW = 1_000_000_000;
const full = { last: NOW - 3000, period: 5000, count: 9 };

describe('hintLines', () => {
  it('a full line: value, period, age of the last report, time to the next', () => {
    expect(hintLines([{ label: 'Power', value: '1442 W', stats: full }], NOW))
      .toEqual(['Power  1442 W · every ~5 s · last 3 s ago · next in ~2 s']);
  });

  it('an overdue next reads "next expected ... ago"', () => {
    expect(hintLines([{ label: 'Power', value: '1442 W', stats: { last: NOW - 9000, period: 5000, count: 9 } }], NOW))
      .toEqual(['Power  1442 W · every ~5 s · last 9 s ago · next expected 4 s ago']);
  });

  it('without a period only the last report is told', () => {
    expect(hintLines([{ label: 'Power', value: '1442 W', stats: { last: NOW - 3000, period: null, count: 1 } }], NOW))
      .toEqual(['Power  1442 W · last 3 s ago']);
  });

  it('no reports: "no reports yet"', () => {
    expect(hintLines([{ label: 'Power', value: '1442 W', stats: { last: null, period: null, count: 0 } }], NOW))
      .toEqual(['Power  1442 W · no reports yet']);
  });

  it('without an answer (stats undefined) only the label and the value', () => {
    expect(hintLines([{ label: 'Voltage', value: '—' }], NOW)).toEqual(['Voltage  —']);
  });

  it('the seconds advance with now', () => {
    const at = (n: number) => hintLines([{ label: 'Power', value: '1 W', stats: full }], n)[0];
    expect(at(NOW + 1000)).toBe('Power  1 W · every ~5 s · last 4 s ago · next in ~1 s');
    expect(at(NOW + 2000)).toBe('Power  1 W · every ~5 s · last 5 s ago · next in ~0 s');
    expect(at(NOW + 3000)).toBe('Power  1 W · every ~5 s · last 6 s ago · next expected 1 s ago');
  });

  it('a clock ahead of the server never shows a negative age', () => {
    expect(hintLines([{ label: 'P', value: '1 W', stats: { last: NOW + 1500, period: null, count: 1 } }], NOW)[0]).toBe('P  1 W · last 0 s ago');
  });

  it('durations: seconds with a unit under a minute, m:ss, h:mm:ss; a period under a second is <1 s', () => {
    const line = (ms: number, period: number | null) =>
      hintLines([{ label: 'P', value: 'v', stats: { last: NOW - ms, period, count: 3 } }], NOW)[0];
    expect(line(59_000, null)).toBe('P  v · last 59 s ago');
    expect(line(60_000, null)).toBe('P  v · last 1:00 ago');
    expect(line(3_599_000, null)).toBe('P  v · last 59:59 ago');
    expect(line(3_600_000, null)).toBe('P  v · last 1:00:00 ago');
    expect(line(1000, 400)).toContain('every ~<1 s');
    expect(line(1000, 90_000)).toContain('every ~1:30');
  });

  it('one line per meter', () => {
    expect(hintLines([{ label: 'In', value: '1 W', stats: full }, { label: 'Out', value: '2 W' }], NOW)).toHaveLength(2);
  });
});

describe('placeHint', () => {
  const box = { w: 800, h: 600 };
  const size = { w: 200, h: 40 };
  const block = { x: 300, y: 100, w: 120, h: 60 };

  it('below the block, centred on it', () => {
    expect(placeHint(block, size, box)).toEqual({ left: 260, top: 168 });
  });

  it('above when there is no room below', () => {
    expect(placeHint({ ...block, y: 520 }, size, box)).toEqual({ left: 260, top: 472 });
  });

  it('shifted to stay inside the canvas', () => {
    expect(placeHint({ ...block, x: 0 }, size, box).left).toBe(4);
    expect(placeHint({ ...block, x: 760 }, size, box).left).toBe(box.w - size.w - 4);
  });

  it('beside the block when it fits neither above nor below, and never over the block', () => {
    const tall = { x: 100, y: 10, w: 120, h: 570 };
    const p = placeHint(tall, size, box);
    expect(p.left).toBe(228);
    expect(p.top).toBeGreaterThanOrEqual(4);
  });
});
