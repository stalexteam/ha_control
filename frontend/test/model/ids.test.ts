import { afterEach, describe, expect, it, vi } from 'vitest';
import { newId } from '../../src/model/ids';

describe('newId', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns 12 lowercase hex chars and is unique', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => newId()));
    expect(ids.size).toBe(1000);
    for (const id of ids) expect(id).toMatch(/^[0-9a-f]{12}$/);
  });

  it('works without crypto.randomUUID (insecure HTTP context)', () => {
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
      throw new TypeError('crypto.randomUUID is not a function');
    });
    expect(newId()).toMatch(/^[0-9a-f]{12}$/);
  });
});
