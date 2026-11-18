import { fetchInfo } from '../api';
import type { HassLike } from '../api';

type Connection = HassLike['connection'];

/**
 * Tells whether the server runs another Plan Studio version than this bundle (a deploy under an open tab).
 * Asks at `watch` and after every `ready` of the connection; once a different version is seen `serverVersion`
 * keeps it until the page is reloaded. An old server (unknown command) or any failure leaves it null, silently.
 */
export class UpdateCheck {
  /** The server's version while it differs from the bundle's; null otherwise. */
  serverVersion: string | null = null;
  private conn: Connection | null = null;
  private run = 0;

  constructor(
    private readonly connection: () => Connection | undefined,
    private readonly bundleVersion: string,
    private readonly onChange: () => void,
  ) {}

  /** Starts listening to the current connection (a no-op for the same one) and asks once. */
  watch(): void {
    const conn = this.connection();
    if (!conn || conn === this.conn) return;
    this.stop();
    this.conn = conn;
    conn.addEventListener?.('ready', this.onReady);
    void this.check();
  }

  stop(): void {
    this.conn?.removeEventListener?.('ready', this.onReady);
    this.conn = null;
    this.run++;
  }

  private onReady = (): void => { void this.check(); };

  private async check(): Promise<void> {
    const conn = this.conn;
    if (!conn) return;
    const run = ++this.run;
    try {
      const { version } = await fetchInfo({ connection: conn });
      if (run !== this.run || typeof version !== 'string' || !version) return;
      const next = version === this.bundleVersion ? null : version;
      if (next === null && this.serverVersion !== null) return; // once seen, the notice stays until the reload
      if (next !== this.serverVersion) { this.serverVersion = next; this.onChange(); }
    } catch {
      // an old server or a failed call: no notice
    }
  }
}
