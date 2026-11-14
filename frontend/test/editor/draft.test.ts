import { describe, it, expect } from 'vitest';
import { DraftStore } from '../../src/editor/draft';
import { emptyPlan } from '../../src/model/types';

describe('DraftStore', () => {
  it('never throws when storage is unavailable', () => {
    const throwing = () => { throw new Error('blocked'); };
    const broken = {
      getItem: throwing, setItem: throwing, removeItem: throwing, key: throwing, get length(): number { return throwing(); },
    } as unknown as Storage;
    for (const storage of [() => null, () => broken, throwing as () => Storage]) {
      const s = new DraftStore(storage, 0);
      const plan = emptyPlan('A');
      expect(() => s.write({ planId: plan.id, baseRevision: null, plan, savedAt: 1 })).not.toThrow();
      expect(s.read(plan.id)).toBeNull();
      expect(s.latest()).toBeNull();
      expect(() => s.clear(plan.id)).not.toThrow();
    }
  });

  it('ignores malformed drafts', () => {
    const data = new Map<string, string>([['plan_studio.draft.x', '{"planId":"x"}'], ['plan_studio.draft.y', 'not json']]);
    const storage = {
      getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v),
      removeItem: (k: string) => data.delete(k), key: (i: number) => [...data.keys()][i] ?? null,
      get length() { return data.size; },
    } as unknown as Storage;
    const s = new DraftStore(() => storage);
    expect(s.read('x')).toBeNull();
    expect(s.read('y')).toBeNull();
    expect(s.latest()).toBeNull();
  });
});
