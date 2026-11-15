import { describe, expect, it } from 'vitest';
import { cached, ringD } from '../../src/render/shared';
import { emptyLevel, type Level } from '../../src/model/types';

describe('ringD', () => {
  it('closed path through every point; empty ring gives an empty string', () => {
    expect(ringD([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 5 }])).toBe('M0 0L10 0L10 5Z');
    expect(ringD([])).toBe('');
  });
});

describe('cached', () => {
  it('computes once per level object', () => {
    const map = new WeakMap<Level, number>();
    let calls = 0;
    const make = () => ++calls;
    const a = emptyLevel('a'), b = emptyLevel('b');
    expect(cached(map, a, make)).toBe(1);
    expect(cached(map, a, make)).toBe(1);
    expect(cached(map, b, make)).toBe(2);
    expect(calls).toBe(2);
  });
});
