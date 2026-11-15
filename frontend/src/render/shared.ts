import type { Level, Pt } from '../model/types';

/** Closed SVG path data of a ring; '' for an empty ring. */
export const ringD = (r: Pt[]): string => (r.length === 0 ? '' : `M${r.map(p => `${p.x} ${p.y}`).join('L')}Z`);

/** `make(level)` cached per level object (levels are immutable snapshots): one computation per frame. */
export function cached<V>(map: WeakMap<Level, V>, level: Level, make: (l: Level) => V): V {
  let v = map.get(level);
  if (v === undefined) { v = make(level); map.set(level, v); }
  return v;
}
