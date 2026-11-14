/**
 * Snapshot-based undo/redo history.
 *
 * `current` is the present state. `push` makes `next` the current state and
 * discards any redo tail. `cap` bounds the number of states retained
 * (past plus current); the oldest states are dropped first.
 */
export class History<T> {
  private past: T[] = [];
  private future: T[] = [];
  private present: T;

  constructor(initial: T, private readonly cap = 200) {
    this.present = initial;
  }

  get current(): T {
    return this.present;
  }

  push(next: T): void {
    this.past.push(this.present);
    // Keep at most cap states in total: cap - 1 past states plus the current one.
    while (this.past.length > Math.max(0, this.cap - 1)) this.past.shift();
    this.present = next;
    this.future = [];
  }

  undo(): T | null {
    if (!this.canUndo) return null;
    this.future.push(this.present);
    this.present = this.past.pop() as T;
    return this.present;
  }

  redo(): T | null {
    if (!this.canRedo) return null;
    this.past.push(this.present);
    this.present = this.future.pop() as T;
    return this.present;
  }

  get canUndo(): boolean {
    return this.past.length > 0;
  }

  get canRedo(): boolean {
    return this.future.length > 0;
  }
}
