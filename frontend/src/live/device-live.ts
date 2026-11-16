import type { Device } from '../model/types';
import { formatWatts } from '../render/power-svg';

/** `hass.states` (entity id -> state object). */
export type HassStates = Record<string, unknown> | undefined;
/** 'none': the kind has no live look or its driving role is unbound; 'active': motion detected / leak wet. */
export type LiveLook = 'none' | 'on' | 'off' | 'no-data' | 'active';
export type BubbleTone = 'device' | 'motion' | 'leak' | 'event';
export interface LiveBubble { text: string; tone: BubbleTone }
/** timerSince: epoch ms of last_changed when a timer applies; power: W > 0 when a power bubble applies. */
export interface DeviceLive { look: LiveLook; timerSince?: number; power?: number }

interface HassState { state: string; last_changed?: string; attributes?: { unit_of_measurement?: string } }

const TO_WATTS: Record<string, number> = { W: 1, kW: 1000, MW: 1e6, mW: 1e-3 };

/** Elapsed time as `s` (under 1 min), `m:ss` (under 1 h) or `h:mm:ss`; negative clamps to 0. */
export function formatDuration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return String(s);
  const p = (n: number) => String(n).padStart(2, '0');
  if (s < 3600) return `${Math.floor(s / 60)}:${p(s % 60)}`;
  return `${Math.floor(s / 3600)}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
}

const getState = (states: HassStates, id: string | undefined): HassState | undefined => {
  const s = id ? states?.[id] : undefined;
  return s && typeof s === 'object' && typeof (s as HassState).state === 'string' ? (s as HassState) : undefined;
};

function watts(states: HassStates, id: string | undefined): number | undefined {
  const s = getState(states, id);
  if (!s || s.state.trim() === '') return undefined;
  const k = TO_WATTS[s.attributes?.unit_of_measurement ?? ''];
  const v = Number(s.state);
  return k === undefined || !Number.isFinite(v) ? undefined : v * k;
}

const since = (s: HassState): number | undefined => {
  const t = s.last_changed ? Date.parse(s.last_changed) : NaN;
  return Number.isFinite(t) ? t : undefined;
};

/** Live look, timer start and power of a device, from hass.states only. */
export function deviceLive(d: Device, states: HassStates): DeviceLive {
  const b = d.bindings ?? {};
  const kind = d.props.kind;
  let look = 'none' as LiveLook;
  let timer = false;
  let hasControl = false;
  let st = undefined as HassState | undefined;
  const read = (id: string | undefined, on: string, off: string) => {
    if (!id) return;
    st = getState(states, id);
    look = st?.state === on ? 'on' : st?.state === off ? 'off' : 'no-data';
  };
  switch (kind) {
    case 'ceiling_light': case 'wall_light': case 'exhaust_fan': timer = true; // falls through
    case 'socket': case 'equipment': {
      hasControl = !!b.control;
      read(b.control, 'on', 'off');
      break;
    }
    case 'motion_sensor': case 'leak_sensor': {
      timer = true;
      read(b[kind === 'motion_sensor' ? 'motion' : 'leak'], 'on', 'off');
      if (look === 'on') look = 'active';
      break;
    }
    case 'wall_switch': read(b.state, 'on', 'off'); break;
    case 'valve': read(b.state, 'open', 'closed'); break;
    default: break;
  }
  const out: DeviceLive = { look };
  if (timer && st && (look === 'on' || look === 'active')) {
    const t = since(st);
    if (t !== undefined) out.timerSince = t;
  }
  const p = watts(states, b.power);
  if (p !== undefined && p > 0 && (look === 'on' || !hasControl)) out.power = p;
  return out;
}

/** Timer bubble (tone by kind) then power bubble. */
export function liveBubbles(live: DeviceLive, d: Device, now: number): LiveBubble[] {
  const out: LiveBubble[] = [];
  if (live.timerSince !== undefined) {
    const k = d.props.kind;
    out.push({ text: formatDuration(now - live.timerSince), tone: k === 'motion_sensor' ? 'motion' : k === 'leak_sensor' ? 'leak' : 'device' });
  }
  if (live.power !== undefined) out.push({ text: formatWatts(live.power), tone: 'device' });
  return out;
}
