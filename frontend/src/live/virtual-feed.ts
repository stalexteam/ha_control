import type { HassLike } from '../api';
import type { Id } from '../model/types';
import { virtualEntity } from '../model/types';
import { messageOf } from '../errors';
import { t } from '../i18n';
import { RETRY_MAX, RETRY_MS } from './rules-feed';

type Unsubscribe = () => Promise<void>;
type Connection = HassLike['connection'];
type States = Record<string, unknown> | undefined;

/** One `plan_studio/virtual/subscribe` event: the whole map of the plan's virtual switches (device id -> state). */
interface VirtualEvent { states: Record<Id, 'on' | 'off'> }

/** One subscription; once the feed moves on (`live` false) its messages and its late result are ignored. */
interface Sub { live: boolean; unsub: Unsubscribe | null }

function release(unsub: Unsubscribe): void {
  void unsub().catch(() => undefined);
}

/**
 * The states of the open plan's virtual switches, kept by the integration (`plan_studio/virtual/subscribe`; every event
 * is the whole map). They are not in `hass.states`: `merge` adds them as `virtual.<device id>` entries
 * (`{state, attributes: {}, last_changed}`) so the live look, the rule dialogs and the binding status read them like any
 * entity. The lifecycle is the rules feed's: `watch(planId)`, retries on a rejected subscription, forgotten at a
 * disconnect, subscribed again at `ready`.
 */
export class VirtualFeed {
  private planId: string | null = null;
  private sub: Sub | null = null;
  private map = new Map<Id, { state: 'on' | 'off'; since: string }>();
  private gotFull = false;
  private failure: string | null = null;
  private conn: Connection | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retries = 0;
  /** The merge of the last `merge` call: its inputs and its result (a stable object while neither changed). */
  private merged: { states: States; version: number; out: States } | null = null;
  private version = 0;

  constructor(
    private readonly host: { requestUpdate(): void },
    private readonly connection: () => Connection | undefined,
    private readonly now: () => number = Date.now,
  ) {}

  /** The first event for the watched plan has arrived. */
  get ready(): boolean { return this.gotFull; }

  /** Why there is no live state (no subscription support, or the subscription failed), else null. */
  get error(): string | null { return this.failure; }

  /** The state of a virtual switch device; undefined while unknown (not saved yet, or no event yet). */
  stateOf(deviceId: Id): 'on' | 'off' | undefined { return this.map.get(deviceId)?.state; }

  /** `states` with the virtual switches added; `states` itself while there are none. */
  merge(states: States): States {
    if (this.map.size === 0) return states;
    const m = this.merged;
    if (m && m.states === states && m.version === this.version) return m.out;
    const out: Record<string, unknown> = { ...states };
    for (const [id, v] of this.map) out[virtualEntity(id)] = { state: v.state, attributes: {}, last_changed: v.since };
    this.merged = { states, version: this.version, out };
    return out;
  }

  watch(planId: string | null): void {
    if (planId === this.planId) return;
    this.stop();
    this.planId = planId;
    if (planId !== null) this.start();
  }

  stop(): void {
    this.unlisten();
    this.cancelRetry();
    this.retries = 0;
    this.drop(true);
    this.planId = null;
    this.forget();
    this.failure = null;
  }

  private forget(): void {
    this.map = new Map();
    this.gotFull = false;
    this.version++;
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

  private readonly onDisconnected = (): void => {
    this.cancelRetry();
    this.drop(false);
    this.forget();
    this.host.requestUpdate();
  };

  private readonly onReady = (): void => {
    this.cancelRetry();
    this.retries = 0;
    this.drop(true);
    this.subscribe();
  };

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
    conn.subscribeMessage<VirtualEvent>(ev => { if (sub.live) this.apply(ev); },
      { type: 'plan_studio/virtual/subscribe', plan_id: planId },
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

  /** The event is the whole map: a device whose state did not change keeps its time, a new or changed one gets this frame's. */
  private apply(ev: VirtualEvent): void {
    const at = new Date(this.now()).toISOString();
    const next = new Map<Id, { state: 'on' | 'off'; since: string }>();
    for (const [id, state] of Object.entries(ev.states ?? {})) {
      if (state !== 'on' && state !== 'off') continue;
      const cur = this.map.get(id);
      next.set(id, cur && cur.state === state ? cur : { state, since: at });
    }
    this.map = next;
    this.gotFull = true;
    this.version++;
    this.host.requestUpdate();
  }

  private setFailure(msg: string | null): void {
    this.failure = msg;
    this.host.requestUpdate();
  }
}
