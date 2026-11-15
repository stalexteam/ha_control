import type { HassLike } from '../api';
import type { ContainerKind, ContainerOutput, Device } from '../model/types';
import { messageOf } from '../errors';
import { t } from '../i18n';

/** Live output of one input container, as the integration reports it. */
export interface ContainerState {
  output: ContainerOutput;
  /** null: normal; otherwise the output is the default because a binding is missing or an entity is unavailable. */
  fault: null | 'not_configured' | 'unavailable';
  /** The unavailable entities (with `unavailable` only). */
  entities?: string[];
  /** The kind of the saved container; a device of another kind (an unsaved Type change) is not that container. */
  kind: ContainerKind;
}

/** One `plan_studio/containers/subscribe` event: `full` replaces the map, otherwise the changed containers merge into it. */
interface ContainersEvent { full: boolean; containers: Record<string, ContainerState> }

type Unsubscribe = () => Promise<void>;

/** One subscription; once the feed moves on (`live` false) its messages and its late result are ignored. */
interface Sub { live: boolean; unsub: Unsubscribe | null }

/** Ends a subscription; a closed connection may reject the unsubscribe, which is harmless. */
function release(unsub: Unsubscribe): void {
  void unsub().catch(() => undefined);
}

/**
 * Live outputs of the input containers of the open plan, from `plan_studio/containers/subscribe`.
 * - `watch(planId)` subscribes for that plan and ends the previous subscription; the same id is a no-op.
 * - Every message re-renders the host.
 * - A connection without subscriptions, or a rejected subscription, sets `error`: the plan stays usable and the
 *   symbols stay neutral.
 */
export class ContainerFeed {
  private planId: string | null = null;
  private sub: Sub | null = null;
  private map = new Map<string, ContainerState>();
  private gotFull = false;
  private failure: string | null = null;

  constructor(
    private readonly host: { requestUpdate(): void },
    private readonly connection: () => HassLike['connection'] | undefined,
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
    if (planId !== null) this.start(planId);
  }

  /** Ends the subscription (also one still being set up) and forgets the outputs; any plan can be watched again. */
  stop(): void {
    const sub = this.sub;
    this.sub = null;
    this.planId = null;
    this.map = new Map();
    this.gotFull = false;
    this.failure = null;
    if (!sub) return;
    sub.live = false;
    if (sub.unsub) release(sub.unsub);
  }

  private start(planId: string): void {
    const conn = this.connection();
    if (!conn?.subscribeMessage) { this.fail(t('output.noLive')); return; }
    const sub: Sub = { live: true, unsub: null };
    this.sub = sub;
    conn.subscribeMessage<ContainersEvent>(ev => { if (sub.live) this.apply(ev); },
      { type: 'plan_studio/containers/subscribe', plan_id: planId },
    ).then(
      unsub => { if (sub.live) sub.unsub = unsub; else release(unsub); },
      err => { if (sub.live) this.fail(messageOf(err)); },
    );
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

  private fail(msg: string): void {
    this.failure = msg;
    this.host.requestUpdate();
  }
}
