import { savePlan, RevisionConflictError, type HassLike } from '../api';
import type { Plan } from '../model/types';
import { newId } from '../model/ids';
import { messageOf } from '../errors';

export type SaveState = 'idle' | 'saving' | 'saved' | 'conflict' | 'error';

export class SaveController {
  state: SaveState = 'idle';
  errorMessage: string | null = null;
  dirty = false;
  baseRevision: number | null = null;
  private dirtyVersion = 0;
  private inflight: Promise<unknown> | null = null;

  constructor(private hass: Pick<HassLike, 'connection'>, private onChange: () => void) {}

  /** Starts over for a freshly opened plan (no pending edits, no error). */
  reset(baseRevision: number | null): void {
    this.state = 'idle';
    this.errorMessage = null;
    this.dirty = false;
    this.dirtyVersion++;
    this.baseRevision = baseRevision;
    this.onChange();
  }

  markDirty(): void {
    this.dirty = true;
    this.dirtyVersion++;
    this.onChange();
  }

  save(plan: Plan): Promise<void> {
    if (this.inflight) return this.inflight.then(() => undefined);
    return this.run(plan, this.baseRevision, false).then(() => undefined);
  }

  overwrite(plan: Plan): Promise<void> {
    if (this.inflight) return this.inflight.then(() => undefined);
    return this.run(plan, this.baseRevision, true).then(() => undefined);
  }

  /**
   * Saves a copy under a new id and name. Returns the new plan (revision set) on
   * success; the caller must adopt it. Returns null on failure or when another
   * save is already in flight (state shows conflict/error).
   */
  async saveAsNew(plan: Plan, name: string): Promise<Plan | null> {
    if (this.inflight) {
      await this.inflight;
      return null;
    }
    const fresh: Plan = { ...plan, id: newId(), name, revision: 0 };
    const rev = await this.run(fresh, null, false);
    return rev === null ? null : { ...fresh, revision: rev };
  }

  /** Returns the new revision, or null if the save did not succeed. */
  private run(plan: Plan, expected: number | null, force: boolean): Promise<number | null> {
    const p = this.doRun(plan, expected, force).finally(() => {
      this.inflight = null;
    });
    this.inflight = p;
    return p;
  }

  private async doRun(plan: Plan, expected: number | null, force: boolean): Promise<number | null> {
    this.state = 'saving';
    this.errorMessage = null;
    const version = this.dirtyVersion;
    this.onChange();
    try {
      const rev = await savePlan(this.hass, plan, expected, force);
      this.baseRevision = rev;
      // Edits made while the request was in flight stay dirty.
      this.dirty = this.dirtyVersion !== version;
      this.state = 'saved';
      this.onChange();
      return rev;
    } catch (err) {
      if (err instanceof RevisionConflictError) {
        this.state = 'conflict';
        this.errorMessage = err.message;
      } else {
        this.state = 'error';
        this.errorMessage = messageOf(err);
      }
      this.onChange();
      return null;
    }
  }
}
