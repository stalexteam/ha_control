import { newId } from './ids';
import type { Id, Level, Pt, Zone } from './types';
import { outlineFromHoles, roomHoles, sameOutline } from '../geometry/rooms';

export function addZone(level: Level, seed: Pt, name: string): { level: Level; zoneId: Id | null } {
  const holes = roomHoles(level);
  const outline = outlineFromHoles(holes, seed);
  if (!outline) return { level, zoneId: null };
  for (const z of level.zones) {
    const o = z.broken ? null : outlineFromHoles(holes, z.seed);
    if (o && sameOutline(o, outline)) return { level, zoneId: null };
  }
  const zone: Zone = { id: newId(), name, seed: { ...seed }, outline, broken: false };
  return { level: { ...level, zones: [...level.zones, zone] }, zoneId: zone.id };
}

export function renameZone(level: Level, id: Id, name: string): Level {
  return { ...level, zones: level.zones.map(z => (z.id === id ? { ...z, name } : z)) };
}

export function deleteZone(level: Level, id: Id): Level {
  return { ...level, zones: level.zones.filter(z => z.id !== id) };
}

/** Re-detect every zone's contour from its seed; zones without own contour become broken (outline kept). */
export function refreshZones(level: Level): Level {
  if (level.zones.length === 0) return level;
  const holes = roomHoles(level);
  const taken: Pt[][] = [];
  const zones = level.zones.map(z => {
    const o = outlineFromHoles(holes, z.seed);
    if (!o || taken.some(t => sameOutline(t, o))) return { ...z, broken: true };
    taken.push(o);
    return { ...z, outline: o, broken: false };
  });
  return { ...level, zones };
}
