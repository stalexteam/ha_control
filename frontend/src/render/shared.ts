import type { Pt } from '../model/types';

/** Closed SVG path data of a ring; '' for an empty ring. */
export const ringD = (r: Pt[]): string => (r.length === 0 ? '' : `M${r.map(p => `${p.x} ${p.y}`).join('L')}Z`);

/**
 * `make(key)` cached per key object: a level, or one of its arrays (levels and their parts are immutable snapshots).
 * One computation per frame.
 */
export function cached<K extends object, V>(map: WeakMap<K, V>, key: K, make: (k: K) => V): V {
  let v = map.get(key);
  if (v === undefined) { v = make(key); map.set(key, v); }
  return v;
}
