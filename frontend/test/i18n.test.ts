import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { I18N_KEYS } from '../src/i18n';

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap(n => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? sources(p) : p.endsWith('.ts') && n !== 'i18n.ts' ? [p] : [];
  });
}

const keys = new Set(I18N_KEYS);
const namespaces = new Set(I18N_KEYS.map(k => k.split('.')[0]));
const files = sources(join(__dirname, '../src')).map(p => ({ p, text: readFileSync(p, 'utf8') }));

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
});
