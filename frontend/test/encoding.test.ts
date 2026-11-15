import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Every source and test file must be valid UTF-8 (a stray cp1252 byte once shipped as U+FFFD in the UI). */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap(n => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : /\.(ts|js|html|json)$/.test(n) ? [p] : [];
  });
}

describe('encoding', () => {
  it('all frontend source and test files are valid UTF-8', () => {
    const bad = [...files('frontend/src'), ...files('frontend/test'), ...files('frontend/dev')].filter(f => {
      try { new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(f)); return false; } catch { return true; }
    });
    expect(bad).toEqual([]);
  });
});
