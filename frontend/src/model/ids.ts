import type { Id } from './types';

/**
 * 12 hex chars from crypto.getRandomValues. crypto.randomUUID is not used
 * because browsers only expose it in secure contexts (HTTPS / localhost),
 * and Home Assistant is often served over plain HTTP.
 */
/** `${base} N` with the smallest N >= 1 that is not in `used` (e.g. "Room 3"). */
export function nextFreeName(base: string, used: Iterable<string>): string {
  const taken = new Set(used);
  let n = 1;
  while (taken.has(`${base} ${n}`)) n++;
  return `${base} ${n}`;
}

export function newId(): Id {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
