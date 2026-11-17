import { describe, it, expect } from 'vitest';
import { DAYLIGHT_DEFAULTS, daylightProps, daylightRaw, debounceOk, luxOk, sunOk } from '../../src/model/daylight';
import { deviceDefaults, type Device } from '../../src/model/types';

const sensor = (extra: object = {}): Device => ({
  id: 's', name: 's', invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
  props: { ...deviceDefaults('illuminance_sensor', 'free'), ...extra } as Device['props'],
});

describe('daylightProps', () => {
  it('defaults', () => {
    expect(daylightProps(sensor())).toEqual({ nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 });
    expect(DAYLIGHT_DEFAULTS.debounce).toBe(60);
  });
  it('fills partial values', () => {
    expect(daylightProps(sensor({ nightBelow: 5, debounce: 0 }))).toEqual({ nightBelow: 5, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 0 });
  });
  it('invalid pairs fall back to defaults', () => {
    expect(daylightProps(sensor({ nightBelow: 60 }))).toMatchObject({ nightBelow: 10, dayAbove: 50 });
    expect(daylightProps(sensor({ sunNight: 5 }))).toMatchObject({ sunNight: -6, sunDay: 3 });
    expect(daylightProps(sensor({ debounce: 1.5 })).debounce).toBe(60);
  });
  it('bounds', () => {
    expect(luxOk(0, 1)).toBe(true);
    expect(luxOk(-1, 50)).toBe(false);
    expect(luxOk(50, 50)).toBe(false);
    expect(luxOk(undefined, undefined)).toBe(true);
    expect(sunOk(-6, 3)).toBe(true);
    expect(sunOk(3, 3)).toBe(false);
    expect(sunOk(NaN, 3)).toBe(false);
    expect(debounceOk(0)).toBe(true);
    expect(debounceOk(3600)).toBe(true);
    expect(debounceOk(3601)).toBe(false);
    expect(debounceOk(-1)).toBe(false);
    expect(debounceOk(undefined)).toBe(true);
  });
});

describe('daylightRaw', () => {
  const lux = (state: string, unit: string | null = 'lx') => ({ state, attributes: unit ? { unit_of_measurement: unit } : {} });
  const sun = (elevation: unknown, state = 'below_horizon') => ({ state, attributes: { elevation } });
  const both = (extra: object = {}): Device => ({ ...sensor(extra), bindings: { illuminance: 'sensor.lux', sun: 'sun.sun' } });

  it('lux decides with the thresholds (strictly below / above)', () => {
    const s = both();
    expect(daylightRaw(s, { 'sensor.lux': lux('8') })).toEqual({ state: 'night', lux: 8 });
    expect(daylightRaw(s, { 'sensor.lux': lux('10') })).toEqual({ state: 'twilight', lux: 10 });
    expect(daylightRaw(s, { 'sensor.lux': lux('50') })).toEqual({ state: 'twilight', lux: 50 });
    expect(daylightRaw(s, { 'sensor.lux': lux('320'), 'sun.sun': sun(-20) })).toEqual({ state: 'day', lux: 320 });
    expect(daylightRaw(both({ nightBelow: 2, dayAbove: 5 }), { 'sensor.lux': lux('3') })).toEqual({ state: 'twilight', lux: 3 });
  });
  it('unusable lux falls back to the sun elevation', () => {
    const s = both();
    for (const bad of [lux('unavailable'), lux('unknown'), lux(''), lux('abc'), lux('8', 'klx'), lux('8', null), lux('Infinity')]) {
      expect(daylightRaw(s, { 'sensor.lux': bad, 'sun.sun': sun(-3.2) })).toEqual({ state: 'twilight', elevation: -3.2 });
    }
    expect(daylightRaw(s, { 'sun.sun': sun(-7) })).toEqual({ state: 'night', elevation: -7 });
    expect(daylightRaw(s, { 'sun.sun': sun(4) })).toEqual({ state: 'day', elevation: 4 });
    expect(daylightRaw(both({ sunNight: -1, sunDay: 1 }), { 'sun.sun': sun(-3) })).toEqual({ state: 'night', elevation: -3 });
  });
  it('no data without a usable reading', () => {
    const s = both();
    expect(daylightRaw(s, {})).toEqual({ state: null });
    expect(daylightRaw(s, undefined)).toEqual({ state: null });
    expect(daylightRaw(s, { 'sun.sun': sun(-3, 'unavailable') })).toEqual({ state: null });
    expect(daylightRaw(s, { 'sun.sun': sun('-3') })).toEqual({ state: null });
    expect(daylightRaw(s, { 'sun.sun': sun(true) })).toEqual({ state: null });
    expect(daylightRaw(sensor(), { 'sensor.lux': lux('8'), 'sun.sun': sun(-3) })).toEqual({ state: null }); // nothing bound
  });
  it('only the sun bound works', () => {
    const s: Device = { ...sensor(), bindings: { sun: 'sun.sun' } };
    expect(daylightRaw(s, { 'sun.sun': sun(10, 'above_horizon') })).toEqual({ state: 'day', elevation: 10 });
  });
});
