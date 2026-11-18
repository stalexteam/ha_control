import type { Device } from '../model/types';
import { activeRoleSpecs } from '../model/bindings';
import { formatWatts } from '../render/power-svg';
import { daylightRaw } from '../model/daylight';
import { t } from '../i18n';

/** `hass.states` (entity id -> state object). */
export type HassStates = Record<string, unknown> | undefined;
/** 'none': the kind has no live look or its driving role is unbound; 'active': motion detected / leak wet. */
export type LiveLook = 'none' | 'on' | 'off' | 'no-data' | 'active';
export type BubbleTone = 'device' | 'motion' | 'leak' | 'event' | 'mode' | 'unmatched';
/**
 * key: set on an action bubble (its time), so a replaced one is drawn anew and pops again. id: a stable identity of
 * the bubble (mode:<rule id>, timer, power, daylight) so it keeps its element when others come or go before it.
 */
export interface LiveBubble { text: string; tone: BubbleTone; key?: number; id?: string }
/**
 * timerSince: epoch ms of last_changed when a timer applies; power: W > 0 when a power bubble applies; daylight: an
 * illuminance sensor's raw daylight state and source ("night 8 lx", "twilight (sun)", "no data") while lux or sun is bound.
 */
export interface DeviceLive { look: LiveLook; timerSince?: number; power?: number; daylight?: string }

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
  const read = (id: string | undefined, on: string[], off: string[]) => {
    if (!id) return;
    st = getState(states, id);
    const v = st?.state ?? '';
    look = on.includes(v) ? 'on' : off.includes(v) ? 'off' : 'no-data';
  };
  const ON = ['on'], OFF = ['off'];
  switch (kind) {
    case 'ceiling_light': case 'wall_light': case 'exhaust_fan': timer = true; // falls through
    case 'socket': case 'equipment': case 'virtual_switch': {
      hasControl = !!b.control;
      read(b.control, ON, OFF);
      break;
    }
    case 'motion_sensor': case 'leak_sensor': {
      timer = true;
      read(b[kind === 'motion_sensor' ? 'motion' : 'leak'], ON, OFF);
      if (look === 'on') look = 'active';
      break;
    }
    case 'wall_switch': read(b.state, ON, OFF); break;
    // A valve may be a `switch` entity: the server maps open = on, closed = off.
    case 'valve': read(b.state, ['open', 'on'], ['closed', 'off']); break;
    default: break;
  }
  const out: DeviceLive = { look };
  if (timer && st && (look === 'on' || look === 'active')) {
    const t = since(st);
    if (t !== undefined) out.timerSince = t;
  }
  // Only an active power role (an inverter has Input / Output power instead); under 1 W after rounding is no bubble.
  const p = activeRoleSpecs(d).some(r => r.role === 'power') ? watts(states, b.power) : undefined;
  if (p !== undefined && Math.round(p) >= 1 && (look === 'on' || !hasControl)) out.power = p;
  if (kind === 'illuminance_sensor' && (b.illuminance || b.sun)) out.daylight = daylightText(d, states);
  return out;
}

/** The raw daylight state (no debounce: the rules' debounced state shows in the rule diagrams) and its source. */
function daylightText(d: Device, states: HassStates): string {
  const raw = daylightRaw(d, states);
  if (raw.state === null) return t('daylight.noData');
  const word = t(`daylight.${raw.state}`);
  // Six significant digits, as the server's reading.
  return 'lux' in raw ? `${word} ${Number(raw.lux.toPrecision(6))} lx` : `${word} ${t('daylight.bySun')}`;
}

/** Timer bubble (tone by kind), power bubble, then the daylight bubble. */
export function liveBubbles(live: DeviceLive, d: Device, now: number): LiveBubble[] {
  const out: LiveBubble[] = [];
  if (live.timerSince !== undefined) {
    const k = d.props.kind;
    out.push({ text: formatDuration(now - live.timerSince), tone: k === 'motion_sensor' ? 'motion' : k === 'leak_sensor' ? 'leak' : 'device', id: 'timer' });
  }
  if (live.power !== undefined) out.push({ text: formatWatts(live.power), tone: 'device', id: 'power' });
  if (live.daylight !== undefined) out.push({ text: live.daylight, tone: 'device', id: 'daylight' });
  return out;
}
