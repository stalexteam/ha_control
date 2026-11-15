/**
 * Pure ops on automation zones (`Level.automationZones`) and device opt-outs (`Device.zoneBlacklist`). They only
 * replace those two: the walls, nodes and openings arrays stay by reference (render caches key on them). A refused or
 * empty edit returns the same level.
 */
import { newId } from './ids';
import { levelZones, type AutomationZone, type Device, type Id, type Level, type Pt, type ZoneVertex } from './types';
import { selfIntersects, vertexPoint, zoneInvalidReason, zoneOutline } from '../geometry/zones';

/** A polygon zone needs at least this many vertices. */
const MIN_VERTICES = 3;

const withZones = (level: Level, automationZones: AutomationZone[]): Level => ({ ...level, automationZones });

/** A free vertex at p that was anchored and lost its anchor. */
export const lostVertex = (p: Pt): ZoneVertex => ({ kind: 'free', x: p.x, y: p.y, lost: true });

function sameVertex(a: ZoneVertex, b: ZoneVertex): boolean {
  if (a.x !== b.x || a.y !== b.y) return false;
  switch (a.kind) {
    case 'free': return b.kind === 'free' && a.lost === b.lost;
    case 'node': return b.kind === 'node' && a.nodeId === b.nodeId;
    case 'wall': return b.kind === 'wall' && a.wallId === b.wallId && a.offset === b.offset && a.side === b.side;
  }
}

function sameZone(a: AutomationZone, b: AutomationZone): boolean {
  if (a.id !== b.id || a.name !== b.name || a.invalid !== b.invalid) return false;
  const s = a.shape, t = b.shape;
  if (s.kind === 'room') return t.kind === 'room' && s.roomId === t.roomId;
  return t.kind === 'polygon' && s.vertices.length === t.vertices.length
    && s.vertices.every((v, i) => sameVertex(v, t.vertices[i]));
}

/**
 * The vertex with its cached x,y set to where it resolves now; a node or wall vertex whose anchor is gone becomes a
 * lost free vertex at its cached x,y. Same object when nothing changes.
 */
function refreshVertex(level: Level, v: ZoneVertex): ZoneVertex {
  if (v.kind === 'free') return v;
  const p = vertexPoint(level, v);
  if (!p) return lostVertex(v);
  return p.x === v.x && p.y === v.y ? v : { ...v, x: p.x, y: p.y };
}

/** The zone with fresh vertex caches and `invalid`; same object when nothing changes. */
function refreshZone(level: Level, z: AutomationZone): AutomationZone {
  let next = z;
  const s = z.shape;
  if (s.kind === 'polygon') {
    const vertices = s.vertices.map(v => refreshVertex(level, v));
    if (vertices.some((v, i) => v !== s.vertices[i])) next = { ...z, shape: { kind: 'polygon', vertices } };
  }
  const invalid = zoneInvalidReason(level, next) !== null;
  return next.invalid === invalid ? next : { ...next, invalid };
}

/**
 * Post-edit step for automation zones: anchored vertices re-resolve their cached x,y, vertices whose node or wall is
 * gone become lost free vertices at their cached x,y, and `invalid` is recomputed. Same level (and the same zone
 * objects) when nothing changes; a level without zones is returned as is.
 */
export function refreshAutomationZones(level: Level): Level {
  const zones = level.automationZones;
  if (!zones || zones.length === 0) return level;
  const next = zones.map(z => refreshZone(level, z));
  return next.some((z, i) => z !== zones[i]) ? withZones(level, next) : level;
}

/**
 * `level` with every zone equal to the zone of the same id in `before` replaced by that object (the zones array of
 * `before` when all are), so an edit that leaves the zones alone keeps their objects.
 */
export function reuseZones(level: Level, before: Level): Level {
  const zones = level.automationZones, prev = before.automationZones;
  if (!zones || !prev) return level;
  const next = zones.map(z => {
    const p = prev.find(x => x.id === z.id);
    return p && p !== z && sameZone(p, z) ? p : z;
  });
  if (next.length === prev.length && next.every((z, i) => z === prev[i])) return withZones(level, prev);
  return next.some((z, i) => z !== zones[i]) ? withZones(level, next) : level;
}

function addZoneObject(level: Level, zone: AutomationZone): { level: Level; zoneId: Id } {
  return { level: withZones(level, [...levelZones(level), refreshZone(level, zone)]), zoneId: zone.id };
}

/**
 * A zone following the outline of room `roomId` (a `Level.zones` entry). A room that already has a room zone gets no
 * second one: the same level and that zone's id. Unknown room: the same level and null.
 */
export function addRoomZone(level: Level, roomId: Id, name: string): { level: Level; zoneId: Id | null } {
  if (!level.zones.some(r => r.id === roomId)) return { level, zoneId: null };
  const existing = levelZones(level).find(z => z.shape.kind === 'room' && z.shape.roomId === roomId);
  if (existing) return { level, zoneId: existing.id };
  return addZoneObject(level, { id: newId(), name, shape: { kind: 'room', roomId }, invalid: false });
}

/** A custom zone through `vertices` (caches resolved). Fewer than 3 vertices or a self-intersecting outline: same level, null. */
export function addPolygonZone(level: Level, vertices: ZoneVertex[], name: string): { level: Level; zoneId: Id | null } {
  if (vertices.length < MIN_VERTICES) return { level, zoneId: null };
  const zone = refreshZone(level, { id: newId(), name, shape: { kind: 'polygon', vertices: [...vertices] }, invalid: false });
  if (selfIntersects(zoneOutline(level, zone))) return { level, zoneId: null };
  return addZoneObject(level, zone);
}

/** Same level for an unknown id or an unchanged name. */
export function renameAutomationZone(level: Level, id: Id, name: string): Level {
  const zones = levelZones(level);
  const z = zones.find(x => x.id === id);
  if (!z || z.name === name) return level;
  return withZones(level, zones.map(x => (x === z ? { ...z, name } : x)));
}

/** The device with blacklist `ids`; an empty list removes the field. */
function withBlacklist(d: Device, ids: Id[]): Device {
  if (ids.length > 0) return { ...d, zoneBlacklist: ids };
  const { zoneBlacklist: _dropped, ...rest } = d;
  return rest;
}

/** Removes the zone and its id from every device's blacklist (an emptied blacklist goes). Unknown id: same level. */
export function deleteAutomationZone(level: Level, id: Id): Level {
  const zones = levelZones(level);
  if (!zones.some(z => z.id === id)) return level;
  const devices = level.devices.map(d =>
    (d.zoneBlacklist?.includes(id) ? withBlacklist(d, d.zoneBlacklist.filter(x => x !== id)) : d));
  return {
    ...level,
    automationZones: zones.filter(z => z.id !== id),
    devices: devices.some((d, i) => d !== level.devices[i]) ? devices : level.devices,
  };
}

/**
 * Replaces vertex `index` of a custom zone by `v` (a free vertex never keeps `lost`), then refreshes the zone's caches
 * and `invalid`; a self-intersecting result is kept as invalid. Same level for an unknown zone, a room zone, an index
 * out of range, or no change.
 */
export function moveZoneVertex(level: Level, id: Id, index: number, v: ZoneVertex): Level {
  const zones = levelZones(level);
  const z = zones.find(x => x.id === id);
  if (!z || z.shape.kind !== 'polygon' || !Number.isInteger(index) || index < 0 || index >= z.shape.vertices.length) {
    return level;
  }
  const placed: ZoneVertex = v.kind === 'free' ? { kind: 'free', x: v.x, y: v.y } : v;
  const vertices = z.shape.vertices.map((x, i) => (i === index ? placed : x));
  const next = refreshZone(level, { ...z, shape: { kind: 'polygon', vertices } });
  return sameZone(next, z) ? level : withZones(level, zones.map(x => (x === z ? next : x)));
}

/**
 * Opts the device out of the zone (participates false: the id joins its blacklist) or back in (the id leaves it; an
 * emptied blacklist goes). Same level for an unknown device, an unknown zone when opting out, or no change.
 */
export function setZoneParticipation(level: Level, deviceId: Id, zoneId: Id, participates: boolean): Level {
  const d = level.devices.find(x => x.id === deviceId);
  if (!d) return level;
  const list = d.zoneBlacklist ?? [];
  if (list.includes(zoneId) !== participates) return level;
  if (!participates && !levelZones(level).some(z => z.id === zoneId)) return level;
  const next = withBlacklist(d, participates ? list.filter(x => x !== zoneId) : [...list, zoneId]);
  return { ...level, devices: level.devices.map(x => (x === d ? next : x)) };
}
