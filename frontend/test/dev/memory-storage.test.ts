import { describe, expect, it } from 'vitest';
import { memoryStorage } from '../../dev/memory-storage';

describe('memoryStorage', () => {
  it('seeds, reads, writes, removes and clears like Storage', () => {
    const s = memoryStorage({ a: '1' });
    expect(s.getItem('a')).toBe('1');
    expect(s.length).toBe(1);
    expect(s.key(0)).toBe('a');
    expect(s.getItem('zz')).toBeNull();
    s.setItem('b', '2');
    expect(s.length).toBe(2);
    s.removeItem('a');
    expect(s.getItem('a')).toBeNull();
    s.clear();
    expect(s.length).toBe(0);
  });
});
