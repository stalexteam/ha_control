import { fetchReadings } from '../api';
import type { HassLike, ReadingStats } from '../api';

type Connection = HassLike['connection'];

/** How often the statistics are asked for while a hint is open. */
export const ASK_MS = 2000;
/** The server answers at most this many entities per ask. */
const MAX_IDS = 200;

/**
 * Report statistics of the entities a hover hint shows (`plan_studio/readings/get`).
 * - `watch(ids)` asks at once and then every ASK_MS; the same ids again are a no-op, other ids ask at once.
 *   Without ids nothing runs.
 * - `stop()` ends the asking and forgets the answer; an answer that comes later is ignored.
 * - A failed ask (an old server, a closed socket) keeps the last good answer and changes nothing; `stats` stays null
 *   until the first answer.
 */
export class ReadingsFeed {
  /** The latest good answer by entity id; null before the first one. */
  stats: Record<string, ReadingStats> | null = null;
  private json = '';
  private ids: string[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  /** Bumped by `watch` / `stop`: answers of an earlier run are ignored. */
  private run = 0;
  private asked = 0;
  private applied = 0;

  constructor(
    private readonly host: { requestUpdate(): void },
    private readonly connection: () => Connection | undefined,
  ) {}

  watch(ids: string[]): void {
    const next = ids.slice(0, MAX_IDS);
    const json = JSON.stringify(next);
    if (json === this.json && this.timer !== null) return;
    this.stop();
    if (next.length === 0) return;
    this.json = json;
    this.ids = next;
    this.timer = setInterval(() => { void this.ask(this.run); }, ASK_MS);
    void this.ask(this.run);
  }

  stop(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    this.run++;
    this.json = '';
    this.ids = [];
    this.stats = null;
  }

  private async ask(run: number): Promise<void> {
    const conn = this.connection();
    if (!conn) return;
    const seq = ++this.asked;
    try {
      const readings = await fetchReadings(conn, this.ids);
      // a later answer already applied: this one is older
      if (run !== this.run || seq < this.applied || !readings || typeof readings !== 'object') return;
      this.applied = seq;
      this.stats = readings;
      this.host.requestUpdate();
    } catch {
      // an old server or a failed call: the hint keeps what it has
    }
  }
}
