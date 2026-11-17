import type { HassLike } from '../api';
import type { Id } from '../model/types';
import { messageOf } from '../errors';
import { t } from '../i18n';

/** One input of a rule as the server reports it: `value` null = no data, `detail` a short word such as "wet". */
export interface RuleInputTrace {
  label: string; value: boolean | null; detail: string;
  /** Held input only: epoch ms when it turns true (the detail text is stale between evaluations). */
  until?: number;
  /** Load control rule only: what the source gives, "toggle" or "on / off". */
  gives?: string;
  /** Wet zone ventilation rule only: the two sensors (a = wet zone, b = compare with) and the signed whole percent. */
  vent?: { a: VentSensorTrace; b: VentSensorTrace; pct: number | null };
}

/** One climate sensor of a vent rule: unrounded values (t in °C) or null; `why` = the reason it has no data, else null. */
export interface VentSensorTrace { t: number | null; rh: number | null; ah: number | null; why: string | null }

/**
 * A boiler rule's state: `grid` and `boilerW` in W (null = no data; `grid` also null without a power limit),
 * `headroom` = grid + nominal - boiler (unknown boiler = 0), the value compared with the limit (null without grid data
 * or limit), `phase` null in manual, `until` = epoch ms of the next self-check (waiting, or the heating grace).
 */
export interface BoilerTrace {
  mode: 'auto' | 'manual';
  phase: 'heating' | 'waiting' | 'blackout' | 'limit' | 'done' | null;
  grid: number | null; boilerW: number | null; headroom: number | null;
  relay: 'on' | 'off' | null;
  until?: number;
}

/** One valve of a leak protection rule: `state` null = no data (unavailable, unknown, no entity). */
export interface LeakValveTrace { id: string; name: string; state: 'open' | 'closed' | null }

/** The gate as the server reports it: `value` is after NOT (true = open); `until` = epoch ms when a Held gate opens. */
export interface RuleGateTrace { value: boolean | null; detail: string; until?: number }

/**
 * The last firing of a rule: `action` is on / off / open / close, `target` a device name, `at` epoch ms. `sent: false`
 * = the rule sent no command: the device already read `action`, someone else switched it to `action` (reason
 * `ended: switched elsewhere`), or another automation keeps the shared device on (reason "kept on by <rules>" /
 * "already on by <rules>").
 */
export interface RuleLast { action: 'on' | 'off' | 'open' | 'close'; target: string; at: number; reason: string; error?: string; sent?: false }

/** The `RuleLast.reason` of a timed switch run that ended because someone else switched its device. */
export const SWITCHED_ELSEWHERE = 'ended: switched elsewhere';

/** An entry not sent because other automations keep the shared device on: its reason names them. */
export function keptOn(l: RuleLast): boolean {
  return l.sent === false && /^(kept|already) on by /.test(l.reason);
}

/** The mode changes of a light motion control rule by their exact `RuleLast.reason`; the row and the diagram word them from this one list. */
export const MOTION_MODE_REASONS: Record<string, 'auto' | 'autoAgain' | 'manualButton' | 'manualElsewhere' | 'found'> = {
  'button: auto': 'auto', 'auto again': 'autoAgain', 'button: manual': 'manualButton',
  'switched elsewhere: manual': 'manualElsewhere', 'found on': 'found',
};

/** Which mode change an entry of a light motion control rule is (undefined = a plain command or other entry). */
export function motionModeLast(l: RuleLast): 'auto' | 'autoAgain' | 'manualButton' | 'manualElsewhere' | 'found' | undefined {
  return MOTION_MODE_REASONS[l.reason];
}

/**
 * An entry of someone else switching the device (`sent: false`): a timed switch run that ended
 * (`ended: switched elsewhere`) or an outside light rule that pauses (`switched elsewhere: paused 30 min`).
 */
export function switchedElsewhere(l: RuleLast): boolean {
  return l.sent === false && (l.reason === SWITCHED_ELSEWHERE || l.reason.startsWith('switched elsewhere'));
}

/**
 * An outside light rule's state: `daylight` the debounced state of its sensor (null = no data), `detail` the reading
 * with the pending change ("5 lx (night in 1:00)"), `until` = epoch ms of that change (only while pending); `sun`
 * null without "Only after sunset" or without data; `window` null without a time window, `windowUntil` = epoch ms of
 * its next boundary; `pausedUntil` = epoch ms when the manual pause ends (only while paused); `light` null = no data.
 */
export interface OutsideTrace {
  daylight: 'night' | 'twilight' | 'day' | null;
  detail: string;
  until?: number;
  sun: 'below' | 'above' | null;
  window: boolean | null;
  windowUntil?: number;
  pausedUntil?: number;
  light: 'on' | 'off' | null;
}

/**
 * A beurer heater rule's state: `watts` the power source's reading (null = no data), `detail` it as text ("312 W",
 * "no data, kept", "no data"), `keptUntil` = epoch ms the kept state ends (only while kept without data); `heater`
 * null = no data; `fresh` = the pad's own timer was restarted within the interval, `cycleAt` = epoch ms of the next
 * re-power (only while fresh, interval > 0 and no pause), `pausedUntil` = epoch ms the socket's off phase ends.
 */
export interface BeurerTrace {
  watts: number | null;
  detail: string;
  keptUntil?: number;
  heater: 'on' | 'off' | null;
  fresh: boolean;
  cycleAt?: number;
  pausedUntil?: number;
}

/**
 * A load control rule's event and devices: the latest event (`what` = the action list it ran; `dropped` = the closed gate
 * stopped it) and every device of the three lists once with its state (null = no data; open / closed for a valve).
 */
export interface ControlTrace {
  event?: { source: string; what: 'on' | 'off' | 'toggle'; at: number; dropped?: 'gate closed' };
  devices: { id: Id; name: string; state: 'on' | 'off' | 'open' | 'closed' | null }[];
}

/**
 * A light motion control rule's state: the `mode` (the verdict is null in manual), `motion` any sensor on, every sensor with its
 * state (null = no data), `dark` null without a daylight sensor, `daylight` the sensor's debounced state with its reading,
 * `light` null = no data; `offAt` = epoch ms the light goes off (only while an off is pending), `minUntil` = epoch ms the
 * minimum on time ends (only while it runs), `autoAt` = epoch ms auto returns (only in manual with "Auto again after").
 */
export interface MotionLightTrace {
  mode: 'auto' | 'manual';
  motion: boolean;
  sensors: { id: Id; name: string; state: 'on' | 'off' | null }[];
  dark: boolean | null;
  daylight?: { state: string | null; detail: string };
  light: 'on' | 'off' | null;
  offAt?: number;
  minUntil?: number;
  autoAt?: number;
}

/** A timed switch rule's run: `until` = epoch ms of its end (only while running); `device` null = no data. */
export interface TimedTrace { running: boolean; until?: number; device: 'on' | 'off' | null }

/** Live state of one saved rule, from `plan_studio/rules/subscribe`. */
export interface RuleTrace {
  status: 'ok' | 'disabled' | 'waiting' | 'error';
  /** Why the status is `error` (device missing, target missing, target unavailable, service failed, cycle, rule missing). */
  reason?: string;
  verdict: boolean | null;
  /** A debounce is running: the verdict is about to become `to` at epoch ms `at`. */
  pending?: { to: boolean; at: number };
  inputs: RuleInputTrace[];
  gate?: RuleGateTrace;
  /** The closed gate holds the rule's actions back. */
  held?: boolean;
  /** How many inputs have no data (a warning when > 0). */
  unknownInputs: number;
  last?: RuleLast;
  /** The automations keeping this rule's shared device on now (vent, timed switch, boiler, on/off pair); absent = none. */
  holders?: string[];
  /** Boiler rule only. */
  boiler?: BoilerTrace;
  /** Leak protection rule only: its valves (the sensors are the inputs). */
  leak?: { valves: LeakValveTrace[] };
  /** Timed switch rule only. */
  timed?: TimedTrace;
  /** Outside light rule only. */
  outside?: OutsideTrace;
  /** Beurer heater rule only. */
  beurer?: BeurerTrace;
  /** Light motion control rule only. */
  motionLight?: MotionLightTrace;
  /** Load control rule only. */
  control?: ControlTrace;
}

/** One `plan_studio/rules/subscribe` event: `full` replaces the map, otherwise the changed rules merge into it. */
interface RulesEvent { full: boolean; rules: Record<string, RuleTrace> }

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
 * Live state (verdict, status, last action) of the rules of the open plan, from `plan_studio/rules/subscribe`.
 * - `watch(planId)` subscribes for that plan and ends the previous subscription; the same id is a no-op.
 * - Every message re-renders the host.
 * - A connection without subscriptions sets `error`: the plan stays usable and the rules show no live state.
 * - A rejected subscription sets `error` and is tried again every RETRY_MS, at most RETRY_MAX times; a success
 *   clears the error.
 * - While a plan is watched the feed listens to the connection: `disconnected` forgets the traces at once (nothing
 *   looks live during an HA restart), `ready` subscribes again. The library is asked not to resubscribe by itself,
 *   so there is only ever one subscription.
 */
export class RulesFeed {
  private planId: string | null = null;
  private sub: Sub | null = null;
  private map = new Map<string, RuleTrace>();
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

  /** Why there are no live rule state (no subscription support, or the subscription failed), else null. */
  get error(): string | null { return this.failure; }

  /** The live trace of a saved rule; undefined for a rule the server does not know (not saved yet). */
  trace(ruleId: string): RuleTrace | undefined { return this.map.get(ruleId); }

  watch(planId: string | null): void {
    if (planId === this.planId) return;
    this.stop();
    this.planId = planId;
    if (planId !== null) this.start();
  }

  /**
   * Ends the subscription (also one still being set up), cancels the retries, stops listening to the
   * connection and forgets the states; any plan can be watched again.
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

  /** The socket closed: the states are forgotten at once; `ready` subscribes again. */
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
    conn.subscribeMessage<RulesEvent>(ev => { if (sub.live) this.apply(ev); },
      { type: 'plan_studio/rules/subscribe', plan_id: planId },
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

  private apply(ev: RulesEvent): void {
    const changed = Object.entries(ev.rules ?? {});
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
