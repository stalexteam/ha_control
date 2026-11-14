import type { Id, Plan } from '../model/types';

/** Unsaved editor state kept in localStorage so in-app navigation cannot silently lose edits. */
export interface Draft {
  planId: Id;
  baseRevision: number | null;
  plan: Plan;
  savedAt: number;
}

export const DRAFT_PREFIX = 'plan_studio.draft.';
/** Id of the plan opened or saved last; preferred on the next load. */
export const LAST_PLAN_KEY = 'plan_studio.lastPlanId';

function defaultStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // access itself can throw (blocked storage)
  }
}

function isDraft(v: unknown): v is Draft {
  const d = v as Draft;
  return !!d && typeof d === 'object' && typeof d.planId === 'string' && typeof d.savedAt === 'number'
    && (d.baseRevision === null || typeof d.baseRevision === 'number')
    && !!d.plan && typeof d.plan === 'object' && Array.isArray(d.plan.levels) && d.plan.levels.length > 0;
}

/** Debounced draft writer; every storage access is guarded, failures are ignored. */
export class DraftStore {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pending: (() => Draft) | null = null;

  constructor(private readonly storage: () => Storage | null = defaultStorage, private readonly delayMs = 500) {}

  /** Writes `make()` after the delay; later calls within the delay replace the pending draft. */
  schedule(make: () => Draft): void {
    this.pending = make;
    if (this.timer !== null) return;
    this.timer = setTimeout(() => { this.timer = null; this.flush(); }, this.delayMs);
  }

  /** Writes the pending draft now, if any. */
  flush(): void {
    this.cancelTimer();
    const make = this.pending;
    this.pending = null;
    if (make) this.write(make());
  }

  /** Drops the pending write without writing. */
  cancel(): void {
    this.cancelTimer();
    this.pending = null;
  }

  write(d: Draft): void {
    try { this.storage()?.setItem(DRAFT_PREFIX + d.planId, JSON.stringify(d)); } catch { /* quota / unavailable */ }
  }

  read(planId: Id): Draft | null {
    try {
      const raw = this.storage()?.getItem(DRAFT_PREFIX + planId);
      const d: unknown = raw ? JSON.parse(raw) : null;
      return isDraft(d) && d.planId === planId ? d : null;
    } catch {
      return null;
    }
  }

  /** Newest draft of any plan (used when the server has no plans, e.g. an unsaved new plan). */
  latest(): Draft | null {
    try {
      const s = this.storage();
      if (!s) return null;
      let best: Draft | null = null;
      for (let i = 0; i < s.length; i++) {
        const k = s.key(i);
        if (!k?.startsWith(DRAFT_PREFIX)) continue;
        const d = this.read(k.slice(DRAFT_PREFIX.length));
        if (d && (!best || d.savedAt > best.savedAt)) best = d;
      }
      return best;
    } catch {
      return null;
    }
  }

  lastPlanId(): Id | null {
    try { return this.storage()?.getItem(LAST_PLAN_KEY) ?? null; } catch { return null; }
  }

  setLastPlanId(planId: Id): void {
    try { this.storage()?.setItem(LAST_PLAN_KEY, planId); } catch { /* quota / unavailable */ }
  }

  clear(planId: Id): void {
    try { this.storage()?.removeItem(DRAFT_PREFIX + planId); } catch { /* unavailable */ }
  }

  private cancelTimer(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }
}
