import type { HassLike } from '../api';
import type { ContainerKind, Device } from '../model/types';
import { messageOf } from '../errors';
import { t } from '../i18n';

/** The last intent of a container: `value` only for `set`; `at` is an ISO 8601 UTC string. */
export interface ContainerIntent { action: 'toggle' | 'set' | 'auto'; value?: 'on' | 'off'; at: string }

/** Live state of one input container, as the integration reports it. */
export interface ContainerState {
  /** The kind of the saved container; a device of another kind (an unsaved Type change) is not that container. */
  kind: ContainerKind;
  status: 'ok' | 'error';
  /** Why the status is `error`. */
  reason?: 'not_configured' | 'unavailable';
  /** The unavailable entities (with `unavailable` only). */
  entities?: string[];
  /** The last intent; absent until the container has had one. */
  last?: ContainerIntent;
}

/** One `plan_studio/containers/subscribe` event: `full` replaces the map, otherwise the changed containers merge into it. */
interface ContainersEvent { full: boolean; containers: Record<string, ContainerState> }

type Unsubscribe = () => Promise<void>;
type Connection = HassLike['connection'];

/** One subscription; once the feed moves on (`live` false) its messages and its late result are ignored. */
interface Sub { live: boolean; unsub: Unsubscribe | null }

/** A failed subscription is tried again every RETRY_MS, at most RETRY_MAX times, while the same plan is watched. */
export const RETRY_MS = 5000;
export const RETRY_MAX = 12;

/** Ends a subscription; a closed connection may reject the unsubscribe, which is harmless. */
function release(unsub: Unsubscribe): void {
  void unsub().catch(() => undefined);
}

/**
 * Live outputs of the input containers of the open plan, from `plan_studio/containers/subscribe`.
 * - `watch(planId)` subscribes for that plan and ends the previous subscription; the same id is a no-op.
 * - Every message re-renders the host.
 * - A connection without subscriptions sets `error`: the plan stays usable and the symbols stay neutral.
 * - A rejected subscription sets `error` and is tried again every RETRY_MS, at most RETRY_MAX times; a success
 *   clears the error.
 * - While a plan is watched the feed listens to the connection: `disconnected` forgets the outputs at once (nothing
 *   looks live during an HA restart), `ready` subscribes again. The library is asked not to resubscribe by itself,
 *   so there is only ever one subscription.
 */
export class ContainerFeed {
  private planId: string | null = null;
  private sub: Sub | null = null;
  private map = new Map<string, ContainerState>();
  private gotFull = false;
  private failure: string | null = null;
  /** The connection of the watched plan, whose events the feed listens to; null when there is none. */
  private conn: Connection | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  /** Retries made since the last success, `ready` or watch. */
  private retries = 0;

  constructor(
    private readonly host: { requestUpdate(): void },
    private readonly connection: () => Connection | undefined,
  ) {}

  /** The first full message for the watched plan has arrived. */
  get ready(): boolean { return this.gotFull; }

  /** Why there are no live outputs (no subscription support, or the subscription failed), else null. */
  get error(): string | null { return this.failure; }

  get(deviceId: string): ContainerState | undefined { return this.map.get(deviceId); }

  /** The device's live state; undefined when the saved plan has no such container or has it as another kind. */
  stateOf(d: Device): ContainerState | undefined {
    const s = this.map.get(d.id);
    return s?.kind === d.props.kind ? s : undefined;
  }

  watch(planId: string | null): void {
    if (planId === this.planId) return;
    this.stop();
    this.planId = planId;
    if (planId !== null) this.start();
  }

  /**
   * Ends the subscription (also one still being set up), cancels the retries, stops listening to the connection
   * and forgets the outputs; any plan can be watched again.
   */
  stop(): void {
    this.unlisten();
    this.cancelRetry();
    this.retries = 0;
    this.drop(true);
    this.planId = null;
    this.map = new Map();
    this.gotFull = false;
    this.failure = null;
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

  /** The socket closed: the outputs are forgotten at once; `ready` subscribes again. */
  private readonly onDisconnected = (): void => {
    this.cancelRetry();
    // The subscription ended with the socket. No unsubscribe goes out: after the reconnect its command id may
    // belong to another command.
    this.drop(false);
    this.map = new Map();
    this.gotFull = false;
    this.host.requestUpdate();
  };

  /** (Re)connected: a fresh subscription for the watched plan, with a fresh run of retries. */
  private readonly onReady = (): void => {
    this.cancelRetry();
    this.retries = 0;
    this.drop(true);
    this.subscribe();
  };

  /** Ends the current subscription: its messages are ignored from now on; `unsubscribe` also tells the server. */
  private drop(unsubscribe: boolean): void {
    const sub = this.sub;
    this.sub = null;
    if (!sub) return;
    sub.live = false;
    if (unsubscribe && sub.unsub) release(sub.unsub);
  }

  private subscribe(): void {
    const conn = this.conn;
    const planId = this.planId;
    if (!conn?.subscribeMessage || planId === null) return;
    const sub: Sub = { live: true, unsub: null };
    this.sub = sub;
    conn.subscribeMessage<ContainersEvent>(ev => { if (sub.live) this.apply(ev); },
      { type: 'plan_studio/containers/subscribe', plan_id: planId },
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

  private apply(ev: ContainersEvent): void {
    const changed = Object.entries(ev.containers ?? {});
    if (ev.full) {
      this.map = new Map(changed);
      this.gotFull = true;
    } else {
      for (const [id, s] of changed) this.map.set(id, s);
    }
    this.host.requestUpdate();
  }

  private setFailure(msg: string | null): void {
    this.failure = msg;
    this.host.requestUpdate();
  }
}
