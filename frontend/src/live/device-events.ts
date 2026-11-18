import type { Device, Id, Level } from '../model/types';
import { activeRoleSpecs } from '../model/bindings';
import { deviceLive, liveBubbles, type BubbleTone, type DeviceLive, type HassStates, type LiveBubble } from './device-live';
import { t } from '../i18n';

/** How long an action bubble shows, and how long an ended bubble fades. */
export const EVENT_MS = 10_000;
export const FADE_MS = 400;
/** An ended action bubble stays in `leaving` this long, so the 1 s ticker catches it and lets it fade. */
export const EVENT_FADE_WINDOW_MS = 1000;

interface St { state: string; last_changed?: string; attributes?: { event_type?: unknown } }
interface Watch { entity: string; settled: boolean; valve: boolean }
interface Seen { last: string }
/** An action bubble: the text shown, when it came and its tone (`unmatched` = a button press that matches no trigger). */
export interface ActionEvent { text: string; at: number; tone: Extract<BubbleTone, 'event' | 'unmatched'> }
interface Leave { bubble: LiveBubble; at: number }
type Slot = 'timer' | 'power';

const NO_VALUE = new Set(['', 'unknown', 'unavailable']);
const SLOTS: Slot[] = ['timer', 'power'];

const stateOf = (states: HassStates, id: string): St | undefined => {
  const s = states?.[id];
  return s && typeof s === 'object' && typeof (s as St).state === 'string' ? (s as St) : undefined;
};

/** The action value a trigger waits for: the event alone for slot 0, else `<slot>_<event>` (as the server's `expected_value`). */
export function expectedAction(slot: number, event: string): string {
  return slot === 0 ? event : `${slot}_${event}`;
}

/** The active triggers of a smart button (on; off with separateOff; auto with autoEnabled) that have an entity and an event. */
export function buttonTriggers(d: Device): { entity: string; value: string }[] {
  if (d.props.kind !== 'smart_button') return [];
  const out: { entity: string; value: string }[] = [];
  for (const { role } of activeRoleSpecs(d)) {
    if (role !== 'on' && role !== 'off' && role !== 'auto') continue;
    const entity = d.bindings?.[role];
    const tr = d.props[role];
    if (entity && tr && typeof tr.event === 'string' && tr.event) out.push({ entity, value: expectedAction(tr.slot, tr.event) });
  }
  return out;
}

/** Event sources of a device: one entry per distinct entity. */
function watches(d: Device): Watch[] {
  const b = d.bindings ?? {};
  const kind = d.props.kind;
  const out: Watch[] = [];
  const add = (entity: string | undefined, settled: boolean, valve = false) => {
    if (entity && !out.some((w) => w.entity === entity)) out.push({ entity, settled, valve });
  };
  if (kind === 'smart_button') {
    // Only active roles: `off` needs separateOff, `auto` needs autoEnabled.
    for (const { role } of activeRoleSpecs(d)) if (role === 'on' || role === 'off' || role === 'auto') add(b[role], false);
  }
  else if (kind === 'wall_switch') add(b.state, true);
  else if (kind === 'valve') add(b.state, true, true);
  return out;
}

/** Settled value of a switch or valve entity, or undefined while it is in between or has no data. */
function settled(raw: string, valve: boolean): string | undefined {
  if (raw === 'on' || (valve && raw === 'open')) return valve ? 'open' : 'on';
  if (raw === 'off' || (valve && raw === 'closed')) return valve ? 'closed' : 'off';
  return undefined;
}

/** New baseline value of one watch and the event text, if any. A watch without a baseline only sets it. */
function read(w: Watch, s: St, prev: Seen | undefined): { value?: string; text?: string } {
  if (w.settled) {
    const v = settled(s.state, w.valve);
    if (v === undefined) return {};
    return { value: v, text: prev && prev.last !== v ? v : undefined };
  }
  if (w.entity.startsWith('event.')) {
    // The state is the time of the last event. Unknown / unavailable (HA restart, reconnect) keep the baseline.
    if (NO_VALUE.has(s.state)) return {};
    const et = s.attributes?.event_type;
    const ok = prev && prev.last !== s.state && typeof et === 'string' && et !== '';
    return { value: s.state, text: ok ? (et as string) : undefined };
  }
  return { value: s.state, text: prev && prev.last !== s.state && !NO_VALUE.has(s.state) ? s.state : undefined };
}

/** The timer or power bubble of a live state at `now`, if it has one. */
function bubble(live: DeviceLive, slot: Slot, d: Device, now: number): LiveBubble | undefined {
  const only: DeviceLive = slot === 'timer' ? { look: live.look, timerSince: live.timerSince } : { look: live.look, power: live.power };
  return liveBubbles(only, d, now)[0];
}

/** The distinct event source entities of the level's devices, sorted. */
export function eventSources(level: Level): string[] {
  const ids = new Set<string>();
  for (const d of level.devices) for (const w of watches(d)) ids.add(w.entity);
  return [...ids].sort();
}

/** Tracks action events (10 s bubble) and ended bubbles (fading) per device, from hass.states only. */
export class DeviceEventTracker {
  private seen = new Map<string, Seen>();
  private events = new Map<Id, ActionEvent>();
  /** The live state behind the device's timer and power bubbles at the last update. */
  private bubbles = new Map<Id, DeviceLive>();
  private leave = new Map<Id, Leave[]>();

  /** Compare states with the last seen ones for every event source of the level's devices; record new events and bubble exits. */
  update(level: Level, states: HassStates, now: number): void {
    for (const d of level.devices) {
      this.updateEvents(level, d, states, now);
      this.updateBubbles(d, states, now);
    }
  }

  /** The device's event bubble text while under EVENT_MS old, else null. */
  event(deviceId: Id, now: number): ActionEvent | null {
    const e = this.events.get(deviceId);
    return e && now - e.at < EVENT_MS ? e : null;
  }

  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(deviceId: Id, now: number): LiveBubble[] {
    const out = (this.leave.get(deviceId) ?? []).filter((l) => now - l.at < FADE_MS).map((l) => l.bubble);
    const e = this.events.get(deviceId);
    const age = e ? now - e.at : -1;
    if (e && age >= EVENT_MS && age < EVENT_MS + EVENT_FADE_WINDOW_MS) out.push({ text: e.text, tone: e.tone, key: e.at });
    return out;
  }

  private updateEvents(level: Level, d: Device, states: HassStates, now: number): void {
    const ws = watches(d);
    const prefix = `${d.id}|`;
    const keep = new Set(ws.map((w) => prefix + w.entity));
    // A role rebound away (or unbound) loses its baseline, so binding it again starts fresh.
    for (const k of [...this.seen.keys()]) if (k.startsWith(prefix) && !keep.has(k)) this.seen.delete(k);
    for (const w of ws) {
      const s = stateOf(states, w.entity);
      if (!s) continue;
      const key = prefix + w.entity;
      const { value, text } = read(w, s, this.seen.get(key));
      if (value !== undefined) this.seen.set(key, { last: value });
      if (!text) continue;
      if (d.props.kind !== 'smart_button') { this.events.set(d.id, { text, at: now, tone: 'event' }); continue; }
      // A press: shown here when this device's trigger takes it, nowhere else when another button's does, else as "no trigger".
      if (buttonTriggers(d).some(x => x.entity === w.entity && x.value === text)) this.events.set(d.id, { text, at: now, tone: 'event' });
      else if (!level.devices.some(o => o !== d && buttonTriggers(o).some(x => x.entity === w.entity && x.value === text))) {
        this.events.set(d.id, { text: t('live.noTrigger').replace('{action}', text), at: now, tone: 'unmatched' });
      }
    }
  }

  private updateBubbles(d: Device, states: HassStates, now: number): void {
    const live = deviceLive(d, states);
    const prev = this.bubbles.get(d.id);
    if (prev) {
      const list = (this.leave.get(d.id) ?? []).filter((l) => now - l.at < FADE_MS);
      for (const slot of SLOTS) {
        // The ended bubble is formatted now, so a timer fades with its value at the exit time.
        const gone = bubble(prev, slot, d, now);
        if (gone && !bubble(live, slot, d, now)) list.push({ bubble: gone, at: now });
      }
      if (list.length) this.leave.set(d.id, list); else this.leave.delete(d.id);
    }
    this.bubbles.set(d.id, live);
  }
}
