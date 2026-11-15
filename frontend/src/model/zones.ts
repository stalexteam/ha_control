import { newId } from './ids';
import { levelZones, type AutomationZone, type Id, type Level, type Pt, type Zone, type ZoneVertex } from './types';
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

/**
 * Deletes the room. Its room zones become custom zones whose vertices are lost free vertices along the room's last
 * outline, so the shape stays and the zone is invalid (a lost vertex). Unknown id: the same level.
 */
export function deleteZone(level: Level, id: Id): Level {
  const room = level.zones.find(z => z.id === id);
  if (!room) return level;
  const out: Level = { ...level, zones: level.zones.filter(z => z !== room) };
  const zones = levelZones(level);
  const ofRoom = (z: AutomationZone): boolean => z.shape.kind === 'room' && z.shape.roomId === id;
  if (zones.some(ofRoom)) {
    // A lost vertex alone makes the zone invalid, so no refresh is needed (and none is imported: no import cycle).
    const vertices = room.outline.map((p): ZoneVertex => ({ kind: 'free', x: p.x, y: p.y, lost: true }));
    out.automationZones = zones.map(z => (ofRoom(z) ? { ...z, shape: { kind: 'polygon', vertices }, invalid: true } : z));
  }
  return out;
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
