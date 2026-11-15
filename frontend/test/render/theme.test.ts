import { describe, expect, it } from 'vitest';
import { paletteFor, type PlanPalette } from '../../src/render/theme';

/** WCAG 2 relative luminance of a #rrggbb colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio of two #rrggbb colours (1..21). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const POWER_KEYS: (keyof PlanPalette)[] = [
  'powerLive', 'powerIdle', 'powerDead', 'powerNoData', 'powerRemainder',
  'blockFill', 'blockStroke', 'blockName', 'blockValue', 'portFill', 'portIcon',
];

describe('contrast', () => {
  it('matches the WCAG reference values', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
    expect(contrast('#ffffff', '#ffffff')).toBe(1);
  });
});

describe.each([['dark', true], ['light', false]] as const)('%s power palette', (_name, dark) => {
  const p = paletteFor(dark);

  it('defines every power colour as #rrggbb', () => {
    for (const k of POWER_KEYS) expect(p[k], k).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('block names reach 7:1 and values 4.5:1 against the block fill', () => {
    expect(contrast(p.blockName, p.blockFill)).toBeGreaterThanOrEqual(7);
    expect(contrast(p.blockValue, p.blockFill)).toBeGreaterThanOrEqual(4.5);
  });

  it('port icons reach 4.5:1 against the port fill', () => {
    expect(contrast(p.portIcon, p.portFill)).toBeGreaterThanOrEqual(4.5);
  });

  it('a live wire and a remainder outline stand out from the background (3:1)', () => {
    expect(contrast(p.powerLive, p.background)).toBeGreaterThanOrEqual(3);
    expect(contrast(p.powerRemainder, p.background)).toBeGreaterThanOrEqual(3);
  });
});
