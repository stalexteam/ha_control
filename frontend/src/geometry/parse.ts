/** Bounds of a whole-number field; `signed` also accepts a leading minus (ASCII or Unicode). */
export interface WholeRule { min?: number; max?: number; signed?: boolean }

/**
 * Whole number from typed text: whitespace and NBSP are thousand separators, everything else (decimals, signs
 * unless `signed`, units) is rejected. Null when malformed or outside [min, max] (min defaults to 0).
 */
export function parseWhole(s: string, { min = 0, max = Number.MAX_SAFE_INTEGER, signed = false }: WholeRule = {}): number | null {
  const digits = s.replace(/\s/g, '').replace('−', '-');
  if (!(signed ? /^-?\d+$/ : /^\d+$/).test(digits)) return null;
  const n = Number(digits);
  return Number.isSafeInteger(n) && n >= min && n <= max ? n : null;
}
