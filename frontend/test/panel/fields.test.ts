import { describe, expect, it } from 'vitest';
import { parseWhole } from '../../src/panel/fields';

const NB = ' ';
const MINUS = '−';

describe('parseWhole', () => {
  describe('length / mm (min 1; was parseLength and parseMm)', () => {
    const r = { min: 1 };
    it('accepts digits with space and NBSP thousand separators', () => {
      expect(parseWhole('3450', r)).toBe(3450);
      expect(parseWhole('3 450', r)).toBe(3450);
      expect(parseWhole(`3${NB}450`, r)).toBe(3450);
      expect(parseWhole(` 1 000 000${NB}`, r)).toBe(1000000);
    });
    it('rejects zero, signs, decimals, text and empty input', () => {
      for (const s of ['0', '000', '-5', '+5', `${MINUS}5`, '3,45', '3.5', 'abc', '', '  ', NB, '12mm', '1e3']) {
        expect(parseWhole(s, r)).toBeNull();
      }
    });
    it('rejects numbers beyond the safe integer range', () => {
      expect(parseWhole('9'.repeat(30), r)).toBeNull();
    });
  });

  describe('angle (1..360; was parseNum angle)', () => {
    const r = { min: 1, max: 360 };
    it('accepts the bounds', () => {
      expect(parseWhole('1', r)).toBe(1);
      expect(parseWhole('360', r)).toBe(360);
    });
    it('rejects 0, 361 and signs', () => {
      for (const s of ['0', '361', '-1', '1.5']) expect(parseWhole(s, r)).toBeNull();
    });
  });

  describe('typed wall angle (digits only, 0 allowed, no maximum; was parseAngle)', () => {
    it('accepts 0, large values and separators', () => {
      expect(parseWhole('0')).toBe(0);
      expect(parseWhole('45')).toBe(45);
      expect(parseWhole('1 080')).toBe(1080);
      expect(parseWhole(`4${NB}5`)).toBe(45);
    });
    it('rejects signs, decimals, text and empty', () => {
      for (const s of ['-45', '+45', `${MINUS}45`, '4.5', 'x', '', ' ']) expect(parseWhole(s)).toBeNull();
    });
  });

  describe('rotation (0..359; was parseNum rotation)', () => {
    const r = { min: 0, max: 359 };
    it('accepts 0 and 359, rejects 360', () => {
      expect(parseWhole('0', r)).toBe(0);
      expect(parseWhole('359', r)).toBe(359);
      expect(parseWhole('360', r)).toBeNull();
    });
    it('rejects negatives', () => {
      expect(parseWhole('-1', r)).toBeNull();
      expect(parseWhole(`${MINUS}1`, r)).toBeNull();
    });
  });

  describe('offset (>= 0; was parseNum offset and the inline opening-offset regex)', () => {
    it('accepts 0 and separators, rejects negatives and decimals', () => {
      expect(parseWhole('0')).toBe(0);
      expect(parseWhole('1 250')).toBe(1250);
      expect(parseWhole(`1${NB}250`)).toBe(1250);
      for (const s of ['-1', '1.5', '1,5', 'a', '']) expect(parseWhole(s)).toBeNull();
    });
  });

  describe('aim (-90..90 signed; was parseNum aim)', () => {
    const r = { min: -90, max: 90, signed: true };
    it('accepts ASCII and Unicode minus within the bounds', () => {
      expect(parseWhole('45', r)).toBe(45);
      expect(parseWhole('-45', r)).toBe(-45);
      expect(parseWhole(`${MINUS}45`, r)).toBe(-45);
      expect(parseWhole('90', r)).toBe(90);
      expect(parseWhole('-90', r)).toBe(-90);
      expect(parseWhole('0', r)).toBe(0);
    });
    it('rejects out-of-range, plus sign and decimals', () => {
      for (const s of ['91', '-91', `${MINUS}91`, '+5', '4.5', '--5', '-', '']) expect(parseWhole(s, r)).toBeNull();
    });
    it('does not accept a minus unless signed', () => {
      expect(parseWhole('-5', { min: -90, max: 90 })).toBeNull();
    });
  });
});
