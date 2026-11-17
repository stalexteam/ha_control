import { describe, it, expect } from 'vitest';
import { DAYLIGHT_DEFAULTS, daylightProps, debounceOk, luxOk, sunOk } from '../../src/model/daylight';
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
