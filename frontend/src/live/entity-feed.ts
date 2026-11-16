import type { HassLike } from '../api';
import type { HassStates } from './device-live';

/** HA's compressed state of one entity (`subscribe_entities`); `lc` / `lu` are epoch seconds, `lc` absent = `lu`. */
interface Compressed { s: string; a?: Record<string, unknown>; c?: unknown; lc?: number; lu?: number }
/** A change of one entity: `+` adds or replaces, `-` removes attributes. */
interface Diff { '+'?: Partial<Compressed>; '-'?: { a?: string[] } }
/** One `subscribe_entities` message: `a` full states, `c` changes, `r` removed entities. */
export interface EntitiesMessage { a?: Record<string, Compressed>; c?: Record<string, Diff>; r?: string[] }

/** A state in the shape of `hass.states` entries (the parts the live code reads). */
interface EntityState { state: string; attributes: Record<string, unknown>; last_changed?: string }

type Connection = HassLike['connection'];
type Unsubscribe = () => Promise<void>;
interface Sub { live: boolean; unsub: Unsubscribe | null }

const iso = (sec: unknown): string | undefined =>
  typeof sec === 'number' && Number.isFinite(sec) ? new Date(sec * 1000).toISOString() : undefined;

function release(unsub: Unsubscribe): void {
  void unsub().catch(() => undefined);
}

/**
 * Per-message states of a few entities (the event sources), from HA's `subscribe_entities`. The panel's `hass`
 * coalesces back-to-back changes (a Zigbee2MQTT `single` then `''`); this feed calls `onChange` after every message.
 * - `watch(ids)` subscribes for that set and ends the previous subscription; the same set is a no-op, null / [] stops.
 * - `disconnected` forgets the states (no unsubscribe goes out); `ready` subscribes again.
 * - Without subscription support, or when the subscription fails, the feed stays empty: `overlay` returns
 *   `hass.states` unchanged.
 */
export class EntityFeed {
  private key: string | null = null;
  private ids: string[] = [];
  private sub: Sub | null = null;
  private map = new Map<string, EntityState>();
  private conn: Connection | null = null;

  constructor(
    private readonly connection: () => Connection | undefined,
    private readonly onChange: () => void,
  ) {}

  /** `states` with the feed's entities replaced by their per-message states; `states` itself when the feed is empty. */
  overlay(states: HassStates): HassStates {
    if (this.map.size === 0) return states;
    return { ...states, ...Object.fromEntries(this.map) };
  }

  watch(ids: string[] | null): void {
    const sorted = ids ? [...new Set(ids)].sort() : [];
    const key = sorted.length ? sorted.join('\n') : null;
    if (key === this.key) return;
    this.stop();
    if (key === null) return;
    this.key = key;
    this.ids = sorted;
    const conn = this.connection();
    if (!conn?.subscribeMessage) return;
    this.conn = conn;
    conn.addEventListener?.('disconnected', this.onDisconnected);
    conn.addEventListener?.('ready', this.onReady);
    this.subscribe();
  }

  /** Ends the subscription, stops listening to the connection and forgets the states. */
  stop(): void {
    const conn = this.conn;
    this.conn = null;
    conn?.removeEventListener?.('disconnected', this.onDisconnected);
    conn?.removeEventListener?.('ready', this.onReady);
    this.drop(true);
    this.key = null;
    this.ids = [];
    this.map = new Map();
  }

  private readonly onDisconnected = (): void => {
    // The subscription ended with the socket; after a reconnect its command id may belong to another command.
    this.drop(false);
    this.map = new Map();
  };

  private readonly onReady = (): void => {
    this.drop(true);
    this.map = new Map();
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
    if (!conn?.subscribeMessage || this.ids.length === 0) return;
    const sub: Sub = { live: true, unsub: null };
    this.sub = sub;
    conn.subscribeMessage<EntitiesMessage>(m => { if (sub.live) this.apply(m); },
      { type: 'subscribe_entities', entity_ids: this.ids },
      { resubscribe: false },
    ).then(
      unsub => { if (sub.live) sub.unsub = unsub; else release(unsub); },
      () => { if (sub.live) { sub.live = false; this.sub = null; } },
    );
  }

  private apply(m: EntitiesMessage): void {
    for (const [id, c] of Object.entries(m.a ?? {})) {
      if (!c || typeof c.s !== 'string') continue;
      this.map.set(id, { state: c.s, attributes: { ...(c.a ?? {}) }, last_changed: iso(c.lc) ?? iso(c.lu) });
    }
    for (const [id, diff] of Object.entries(m.c ?? {})) {
      const cur = this.map.get(id);
      if (!cur || !diff) continue;
      const next: EntityState = { ...cur, attributes: { ...cur.attributes } };
      const add = diff['+'];
      if (add) {
        const changed = typeof add.s === 'string' && add.s !== cur.state;
        if (typeof add.s === 'string') next.state = add.s;
        if (add.a && typeof add.a === 'object') Object.assign(next.attributes, add.a);
        // last_changed moves with `lc`; HA always sends it with a new state, `lu` is the defensive fallback.
        const lc = iso(add.lc) ?? (changed ? iso(add.lu) : undefined);
        if (lc) next.last_changed = lc;
      }
      for (const k of diff['-']?.a ?? []) delete next.attributes[k];
      this.map.set(id, next);
    }
    for (const id of m.r ?? []) this.map.delete(id);
    this.onChange();
  }
}
