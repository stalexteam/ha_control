import { describe, it, expect } from 'vitest';
import { deviceDefaults, normalizeLevel, type Device, type Level } from '../../src/model/types';

const legacy = (symbol: string): Device => ({
  id: 'e', name: 'e', invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
  props: { kind: 'equipment', shape: 'rect', width: 600, depth: 600, diameter: 600, symbol, label: '' } as unknown as Device['props'],
});
const lvl = (d: Device): Level => ({ id: 'l', name: 'L', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [d] });

describe('equipment icon migration', () => {
  it.each([['boiler', 'mdi:water-boiler'], ['pc', 'mdi:desktop-tower'], ['automation', 'mdi:server'], ['other', 'mdi:cube-outline']])(
    'legacy %s -> %s, symbol dropped', (symbol, icon) => {
      const p = normalizeLevel(lvl(legacy(symbol))).devices[0].props as Record<string, unknown>;
      expect(p.icon).toBe(icon);
      expect('symbol' in p).toBe(false);
    });
  it('unknown legacy symbol falls back to cube-outline', () => {
    expect((normalizeLevel(lvl(legacy('zzz'))).devices[0].props as Record<string, unknown>).icon).toBe('mdi:cube-outline');
  });
  it('an already migrated level is returned as the same object', () => {
    const migrated = normalizeLevel(lvl(legacy('pc')));
    expect(normalizeLevel(migrated)).toBe(migrated);
  });
  it('fresh equipment defaults to mdi:cube-outline', () => {
    expect(deviceDefaults('equipment', 'free')).toMatchObject({ icon: 'mdi:cube-outline' });
    expect('symbol' in deviceDefaults('equipment', 'free')).toBe(false);
  });
  it('equipment with neither symbol nor icon gets cube-outline', () => {
    const d = legacy('x');
    const { symbol, ...rest } = d.props as unknown as Record<string, unknown>;
    void symbol;
    const out = normalizeLevel(lvl({ ...d, props: rest as unknown as Device['props'] })).devices[0].props as Record<string, unknown>;
    expect(out.icon).toBe('mdi:cube-outline');
  });
  it('mixed level: unmigrated devices keep their references', () => {
    const plain: Device = { id: 'p', name: 'p', invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 }, props: deviceDefaults('socket', 'free') };
    const l = { ...lvl(legacy('pc')), devices: [plain, legacy('pc')] };
    const out = normalizeLevel(l);
    expect(out).not.toBe(l);
    expect(out.devices[0]).toBe(plain);
    expect(out.devices[1]).not.toBe(l.devices[1]);
  });
});
