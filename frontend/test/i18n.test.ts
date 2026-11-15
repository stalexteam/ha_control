import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { I18N_KEYS } from '../src/i18n';
import { DEVICE_PLACEMENTS, WALL_PRESETS, OPENING_DEFAULT_WIDTH } from '../src/model/types';
import { LIGHT_SHAPES, EQUIPMENT_SHAPES, EQUIPMENT_SYMBOLS } from '../src/panel/device-props';

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap(n => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? sources(p) : p.endsWith('.ts') && n !== 'i18n.ts' ? [p] : [];
  });
}

const keys = new Set(I18N_KEYS);
const namespaces = new Set(I18N_KEYS.map(k => k.split('.')[0]));
const files = sources(join(__dirname, '../src')).map(p => ({ p, text: readFileSync(p, 'utf8') }));

/** Every string literal passed directly to t(...), whatever its namespace. */
export function tCalls(text: string): string[] {
  return [...text.matchAll(/\bt\(\s*['"`]([^'"`$]+)['"`]/g)].map(m => m[1]);
}

/** Literal keys: 'ns.key' strings of a dictionary namespace; dynamic: `ns.${…}` template prefixes. */
function used(): { literal: Map<string, string>; prefix: Map<string, string> } {
  const literal = new Map<string, string>();
  const prefix = new Map<string, string>();
  for (const { p, text } of files) {
    for (const m of text.matchAll(/(['"])([A-Za-z][\w-]*(?:\.[\w-]+)+)\1/g)) {
      if (namespaces.has(m[2].split('.')[0])) literal.set(m[2], p);
    }
    for (const m of text.matchAll(/`([A-Za-z][\w.]*\.)\$\{/g)) {
      if (namespaces.has(m[1].split('.')[0])) prefix.set(m[1], p);
    }
  }
  return { literal, prefix };
}

describe('i18n', () => {
  it('finds the keys the code uses', () => {
    const { literal, prefix } = used();
    expect(literal.size).toBeGreaterThan(50);
    expect(prefix.size).toBeGreaterThan(5);
  });

  it('every literal key used in src is in the dictionary (t() returns the key on a typo)', () => {
    const missing = [...used().literal].filter(([k]) => !keys.has(k)).map(([k, p]) => `${k} (${p})`);
    expect(missing).toEqual([]);
  });

  it('every dynamic key prefix used in src has dictionary entries', () => {
    const missing = [...used().prefix].filter(([pre]) => !I18N_KEYS.some(k => k.startsWith(pre))).map(([pre, p]) => `${pre} (${p})`);
    expect(missing).toEqual([]);
  });

  it('every string literal passed to t() is in the dictionary (catches a typo in the namespace too)', () => {
    const missing = files.flatMap(({ p, text }) => tCalls(text).filter(k => !keys.has(k)).map(k => `${k} (${p})`));
    expect(missing).toEqual([]);
  });

  it('tCalls reports a typo key in a source string', () => {
    const bad = tCalls("x(t('prps.badAim'), t(`snap.${k}`), t('props.badAim'))").filter(k => !keys.has(k));
    expect(bad).toEqual(['prps.badAim']);
  });

  it('dynamic key prefixes have an entry for every member of their source-of-truth set', () => {
    const sets: Record<string, readonly string[]> = {
      device: Object.keys(DEVICE_PLACEMENTS),
      walltype: Object.keys(WALL_PRESETS),
      kind: Object.keys(OPENING_DEFAULT_WIDTH),
      shape: [...LIGHT_SHAPES, ...EQUIPMENT_SHAPES],
      symbol: EQUIPMENT_SYMBOLS,
      side: ['left', 'right'],
      hinge: ['start', 'end'],
      baseline: ['center', 'left', 'right'],
    };
    const missing = Object.entries(sets).flatMap(([pre, members]) => members.map(m => `${pre}.${m}`)).filter(k => !keys.has(k));
    expect(missing).toEqual([]);
  });
});
