import { describe, it, expect } from 'vitest';
import { I18N_KEYS, t } from '../src/i18n';

describe('i18n', () => {
  it('has no empty values', () => {
    for (const k of I18N_KEYS) expect(t(k)).not.toBe('');
  });
});
