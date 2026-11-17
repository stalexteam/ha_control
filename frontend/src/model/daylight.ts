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
