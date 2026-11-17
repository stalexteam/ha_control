/** Daylight thresholds of an illuminance sensor: defaults, bounds and the filled-in values. */
import type { Device } from './types';

export interface DaylightProps { nightBelow: number; dayAbove: number; sunNight: number; sunDay: number; debounce: number }

export const DAYLIGHT_DEFAULTS: DaylightProps = { nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 };
export const DEBOUNCE_MAX = 3600;

const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/** The thresholds with defaults for missing fields; an invalid value or pair falls back to the defaults of that pair. */
export function daylightProps(d: Device): DaylightProps {
  const p: Partial<DaylightProps> = d.props.kind === 'illuminance_sensor' ? d.props : {};
  const D = DAYLIGHT_DEFAULTS;
  const lux = luxOk(p.nightBelow, p.dayAbove);
  const sun = sunOk(p.sunNight, p.sunDay);
  return {
    nightBelow: lux ? (p.nightBelow ?? D.nightBelow) : D.nightBelow,
    dayAbove: lux ? (p.dayAbove ?? D.dayAbove) : D.dayAbove,
    sunNight: sun ? (p.sunNight ?? D.sunNight) : D.sunNight,
    sunDay: sun ? (p.sunDay ?? D.sunDay) : D.sunDay,
    debounce: debounceOk(p.debounce) ? (p.debounce ?? D.debounce) : D.debounce,
  };
}

/** Both lux thresholds (each optional): 0 <= nightBelow < dayAbove after defaults. */
export function luxOk(night: unknown, day: unknown): boolean {
  if ((night !== undefined && !isNum(night)) || (day !== undefined && !isNum(day))) return false;
  const n = (night as number | undefined) ?? DAYLIGHT_DEFAULTS.nightBelow;
  const a = (day as number | undefined) ?? DAYLIGHT_DEFAULTS.dayAbove;
  return n >= 0 && n < a;
}

/** Both sun elevation thresholds (each optional): sunNight < sunDay after defaults. */
export function sunOk(night: unknown, day: unknown): boolean {
  if ((night !== undefined && !isNum(night)) || (day !== undefined && !isNum(day))) return false;
  const n = (night as number | undefined) ?? DAYLIGHT_DEFAULTS.sunNight;
  const a = (day as number | undefined) ?? DAYLIGHT_DEFAULTS.sunDay;
  return n < a;
}

/** Debounce: missing, or a whole number of seconds 0..3600. */
export const debounceOk = (v: unknown): boolean => v === undefined || (Number.isInteger(v) && (v as number) >= 0 && (v as number) <= DEBOUNCE_MAX);

export type DaylightState = 'night' | 'twilight' | 'day';
/** A raw (not debounced) daylight state and what decided it: the lux reading, or the sun elevation (degrees). */
export type DaylightRaw = { state: DaylightState; lux: number } | { state: DaylightState; elevation: number } | { state: null };

interface RawSt { state?: unknown; attributes?: { unit_of_measurement?: unknown; elevation?: unknown } }

const band = (v: number, night: number, day: number): DaylightState => (v < night ? 'night' : v > day ? 'day' : 'twilight');

/**
 * The raw daylight state from live states, as the server computes it: a numeric lux reading in `lx` decides; otherwise
 * (lux unbound, unavailable, unknown, not a number, another unit) a bound sun with a numeric `elevation`; else no data.
 */
export function daylightRaw(d: Device, states: Record<string, unknown> | undefined): DaylightRaw {
  const p = daylightProps(d);
  const get = (eid: string | undefined): RawSt | undefined => {
    const s = eid ? states?.[eid] : undefined;
    return s && typeof s === 'object' ? (s as RawSt) : undefined;
  };
  const lx = get(d.bindings?.illuminance);
  if (lx && lx.attributes?.unit_of_measurement === 'lx' && typeof lx.state === 'string' && lx.state.trim() !== '') {
    const v = Number(lx.state);
    if (Number.isFinite(v)) return { state: band(v, p.nightBelow, p.dayAbove), lux: v };
  }
  const sun = get(d.bindings?.sun);
  const e = sun?.attributes?.elevation;
  if (sun && sun.state !== 'unavailable' && sun.state !== 'unknown' && isNum(e)) return { state: band(e, p.sunNight, p.sunDay), elevation: e };
  return { state: null };
}
