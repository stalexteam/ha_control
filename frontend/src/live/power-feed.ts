import type { HassLike } from '../api';
import type { Id, Level } from '../model/types';
import type { Position, PowerFrame, PowerSchema } from '../model/power';
import { messageOf } from '../errors';
import { t } from '../i18n';
import { RETRY_MAX, RETRY_MS } from './container-feed';

/** What `plan_studio/power/subscribe` evaluates: the draft schematic and the bindings of its plan devices. */
export interface PowerPayload { power: PowerSchema; devices: Record<Id, { power?: string; control?: string }> }

/** A changed draft is sent again once the edits pause for this long. */
export const DEBOUNCE_MS = 300;

type Unsubscribe = () => Promise<void>;
type Connection = HassLike['connection'];

/** One subscription; once the feed moves on (`live` false) its frames, its late result and its failure are ignored. */
interface Sub { live: boolean; unsub: Unsubscribe | null }

/** Ends a subscription; a closed connection may reject the unsubscribe, which is harmless. */
function release(unsub: Unsubscribe): void {
  void unsub().catch(() => undefined);
}

/**
 * The payload for a draft: the schematic, and the `power` / `control` bindings of every plan device a device block
 * refers to. A device block whose plan device is gone gets no entry, so the server reports the block missing.
 */
export function powerPayload(power: PowerSchema, level: Level): PowerPayload {
  const byId = new Map(level.devices.map(d => [d.id, d]));
  const devices: PowerPayload['devices'] = {};
  for (const b of power.blocks) {
    const d = b.kind === 'device' ? byId.get(b.deviceId) : undefined;
    if (!d) continue;
    const { power: p, control } = d.bindings ?? {};
    devices[d.id] = { ...(p ? { power: p } : {}), ...(control ? { control } : {}) };
  }
  return { power, devices };
}

/**
 * Live values of the schematic being edited, from `plan_studio/power/subscribe` (every frame is full).
 * - `watch(planId, payload)` subscribes with the draft. The same plan with an equal payload (compared as JSON) is a
 *   no-op, so the panel may build the payload on every update. A new plan subscribes at once and drops the old frame;
 *   a changed payload subscribes again DEBOUNCE_MS after the last change, and the old frame stays until the new one
 *   arrives. A null plan or payload stops the feed.
 * - One subscription at a time: an ended one is unsubscribed (once it settles, if it is late) and its frames and
 *   failure are ignored.
 * - A failed subscription sets `error`, clears the frame (no values for a draft the server has not seen) and is tried
 *   again every RETRY_MS, at most RETRY_MAX times; a success clears the error.
 * - While a plan is watched the feed listens to the connection: `disconnected` clears the frame at once and holds the
 *   subscribing, `ready` subscribes again with the latest payload. The library is asked not to resubscribe by itself.
 */
export class PowerFeed {
  private planId: Id | null = null;
  private payload: PowerPayload | null = null;
  /** The payload as JSON, compared with the next one. */
  private json = '';
  private sub: Sub | null = null;
  private current: PowerFrame | null = null;
  private failure: string | null = null;
  /** The connection of the watched plan, whose events the feed listens to; null when there is none. */
  private conn: Connection | null = null;
  /** The socket is closed: nothing is subscribed until `ready`. */
  private offline = false;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  /** Retries made since the last success, `ready`, payload change or watch. */
  private retries = 0;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly host: { requestUpdate(): void },
    private readonly connection: () => Connection | undefined,
  ) {}

  /** The latest frame of the current draft; null before the first one, after a failure and while disconnected. */
  get frame(): PowerFrame | null { return this.current; }

  /** Why there are no live values (no subscription support, a failed subscription or position request), else null. */
  get error(): string | null { return this.failure; }

  watch(planId: Id | null, payload: PowerPayload | null): void {
    if (planId === null || payload === null) { this.stop(); return; }
    const json = JSON.stringify(payload);
    if (planId === this.planId) {
      if (json === this.json) return;
      this.payload = payload;
      this.json = json;
      this.cancelDebounce();
      this.debounceTimer = setTimeout(() => { this.debounceTimer = null; this.restart(); }, DEBOUNCE_MS);
      return;
    }
    this.stop();
    this.planId = planId;
    this.payload = payload;
    this.json = json;
    this.start();
  }

  /**
   * Ends the subscription (also one still being set up), cancels the timers, stops listening to the connection and
   * forgets the frame and the error; any plan can be watched again.
   */
  stop(): void {
    this.unlisten();
    this.cancelRetry();
    this.cancelDebounce();
    this.retries = 0;
    this.drop(true);
    this.planId = null;
    this.payload = null;
    this.json = '';
    this.current = null;
    this.failure = null;
    this.offline = false;
  }

  /** Sets a transfer position of the watched plan live on the server; nothing is sent while no plan is watched. */
  async setPosition(blockId: Id, p: Position): Promise<void> {
    const conn = this.connection();
    if (!conn || this.planId === null) return;
    try {
      await conn.sendMessagePromise({ type: 'plan_studio/power/set_position', plan_id: this.planId, block_id: blockId, position: p });
    } catch (err) {
      this.setFailure(messageOf(err));
      throw err;
    }
  }

  private start(): void {
    const conn = this.connection();
    if (!conn?.subscribeMessage) { this.setFailure(t('output.noLive')); return; }
    this.conn = conn;
    conn.addEventListener?.('disconnected', this.onDisconnected);
    conn.addEventListener?.('ready', this.onReady);
    this.subscribe();
  }

  private unlisten(): void {
    const conn = this.conn;
    this.conn = null;
    conn?.removeEventListener?.('disconnected', this.onDisconnected);
    conn?.removeEventListener?.('ready', this.onReady);
  }

  /** The socket closed: the frame is forgotten at once; `ready` subscribes again. */
  private readonly onDisconnected = (): void => {
    this.offline = true;
    this.cancelRetry();
    // The subscription ended with the socket. No unsubscribe goes out: after the reconnect its command id may
    // belong to another command.
    this.drop(false);
    this.current = null;
    this.host.requestUpdate();
  };

  /** (Re)connected: a fresh subscription with the latest payload. */
  private readonly onReady = (): void => {
    this.offline = false;
    this.restart();
  };

  /** Replaces the subscription with one for the latest payload, with a fresh run of retries; the frame stays. */
  private restart(): void {
    this.cancelRetry();
    this.cancelDebounce();
    this.retries = 0;
    this.drop(true);
    this.subscribe();
  }

  /** Ends the current subscription: its frames are ignored from now on; `unsubscribe` also tells the server. */
  private drop(unsubscribe: boolean): void {
    const sub = this.sub;
    this.sub = null;
    if (!sub) return;
    sub.live = false;
    if (unsubscribe && sub.unsub) release(sub.unsub);
  }

  private subscribe(): void {
    const { conn, planId, payload } = this;
    if (!conn?.subscribeMessage || planId === null || payload === null || this.offline) return;
    const sub: Sub = { live: true, unsub: null };
    this.sub = sub;
    conn.subscribeMessage<PowerFrame>(f => { if (sub.live) { this.current = f; this.host.requestUpdate(); } },
      { type: 'plan_studio/power/subscribe', plan_id: planId, power: payload.power, devices: payload.devices },
      { resubscribe: false },
    ).then(
      unsub => {
        if (!sub.live) { release(unsub); return; }
        sub.unsub = unsub;
        this.retries = 0;
        if (this.failure !== null) this.setFailure(null);
      },
      err => {
        if (!sub.live) return;
        sub.live = false;
        this.sub = null;
        this.current = null;
        this.setFailure(messageOf(err));
        this.scheduleRetry();
      },
    );
  }

  private scheduleRetry(): void {
    if (this.retries >= RETRY_MAX) return;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      this.retries++;
      this.subscribe();
    }, RETRY_MS);
  }

  private cancelRetry(): void {
    if (this.retryTimer !== null) clearTimeout(this.retryTimer);
    this.retryTimer = null;
  }

  private cancelDebounce(): void {
    if (this.debounceTimer !== null) clearTimeout(this.debounceTimer);
    this.debounceTimer = null;
  }

  private setFailure(msg: string | null): void {
    this.failure = msg;
    this.host.requestUpdate();
  }
}
