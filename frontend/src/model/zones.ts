/**
 * Pure ops on zones (`Level.zones`) and device opt-outs (`Device.zoneBlacklist`). They only replace those two: the
 * walls, nodes and openings arrays stay by reference (render caches key on them). A refused or empty edit returns the
 * same level.
 */
import { newId } from './ids';
import type { Device, Id, Level, Pt, Zone, ZoneShape, ZoneVertex } from './types';
import { outlineFromHoles, roomHoles, sameOutline } from '../geometry/rooms';
import { selfIntersects, vertexPoint, zoneInvalidReason, zoneOutline } from '../geometry/zones';

/** A polygon zone needs at least this many vertices. */
const MIN_VERTICES = 3;

type WallsZone = Zone & { shape: Extract<ZoneShape, { kind: 'walls' }> };
type PolygonZone = Zone & { shape: Extract<ZoneShape, { kind: 'polygon' }> };

const withZones = (level: Level, zones: Zone[]): Level => ({ ...level, zones });
const replaceZone = (level: Level, z: Zone, next: Zone): Level => withZones(level, level.zones.map(x => (x === z ? next : x)));

/** A free vertex at p that was anchored and lost its anchor. */
export const lostVertex = (p: Pt): ZoneVertex => ({ kind: 'free', x: p.x, y: p.y, lost: true });

const samePts = (a: Pt[], b: Pt[]): boolean => a.length === b.length && a.every((p, i) => p.x === b[i].x && p.y === b[i].y);

// sameVertex, sameShape and sameZone compare field by field: update them whenever ZoneVertex or Zone gains a field.
function sameVertex(a: ZoneVertex, b: ZoneVertex): boolean {
  if (a.x !== b.x || a.y !== b.y) return false;
  switch (a.kind) {
    case 'free': return b.kind === 'free' && a.lost === b.lost;
    case 'node': return b.kind === 'node' && a.nodeId === b.nodeId;
    case 'wall': return b.kind === 'wall' && a.wallId === b.wallId && a.offset === b.offset && a.side === b.side;
  }
}

function sameShape(s: ZoneShape, t: ZoneShape): boolean {
  if (s.kind === 'walls') {
    return t.kind === 'walls' && s.broken === t.broken && s.seed.x === t.seed.x && s.seed.y === t.seed.y
      && samePts(s.outline, t.outline);
  }
  return t.kind === 'polygon' && s.vertices.length === t.vertices.length
    && s.vertices.every((v, i) => sameVertex(v, t.vertices[i]));
}

function sameZone(a: Zone, b: Zone): boolean {
  return a.id === b.id && a.name === b.name && a.automation === b.automation && a.invalid === b.invalid
    && sameShape(a.shape, b.shape);
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

/** The polygon zone with fresh vertex caches; same object when nothing changes. */
function refreshPolygon(level: Level, z: PolygonZone): Zone {
  const s = z.shape;
  const vertices = s.vertices.map(v => refreshVertex(level, v));
  return vertices.some((v, i) => v !== s.vertices[i]) ? { ...z, shape: { kind: 'polygon', vertices } } : z;
}

/**
 * The walls zone with its outline re-detected from its seed (the smallest hole of the wall union around it). A seed
 * outside every hole, or in a hole an earlier walls zone already took (`taken`, appended to), makes the zone broken
 * with its last outline. Same object when nothing changes.
 */
function redetect(z: WallsZone, holes: Pt[][], taken: Pt[][]): Zone {
  const s = z.shape;
  const o = outlineFromHoles(holes, s.seed);
  if (!o || taken.some(t => sameOutline(t, o))) return s.broken ? z : { ...z, shape: { ...s, broken: true } };
  taken.push(o);
  return !s.broken && samePts(o, s.outline) ? z : { ...z, shape: { ...s, outline: o, broken: false } };
}

/** The zone with `invalid` recomputed; same object when it holds. */
function withInvalid(level: Level, z: Zone): Zone {
  const invalid = zoneInvalidReason(level, z) !== null;
  return z.invalid === invalid ? z : { ...z, invalid };
}

/** A polygon zone with fresh vertex caches and `invalid`. */
const refreshOne = (level: Level, z: PolygonZone): Zone => withInvalid(level, refreshPolygon(level, z));

/**
 * Post-edit step for zones: walls outlines are re-detected from their seeds (a zone with no own loop becomes broken
 * and keeps its outline), anchored polygon vertices re-resolve their cached x,y (a vertex whose node or wall is gone
 * becomes a lost free vertex at its cached x,y), and `invalid` is recomputed. Same level (and the same zone objects)
 * when nothing changes.
 */
export function refreshZones(level: Level): Level {
  const zones = level.zones;
  if (zones.length === 0) return level;
  const holes = zones.some(z => z.shape.kind === 'walls') ? roomHoles(level) : [];
  const taken: Pt[][] = [];
  const next = zones.map(z => withInvalid(level,
    z.shape.kind === 'walls' ? redetect(z as WallsZone, holes, taken) : refreshPolygon(level, z as PolygonZone)));
  return next.some((z, i) => z !== zones[i]) ? withZones(level, next) : level;
}

/**
 * `level` with every zone equal to the zone of the same id in `before` replaced by that object (the zones array of
 * `before` when all are), so an edit that leaves the zones alone keeps their objects.
 */
export function reuseZones(level: Level, before: Level): Level {
  const zones = level.zones, prev = before.zones;
  const next = zones.map(z => {
    const p = prev.find(x => x.id === z.id);
    return p && p !== z && sameZone(p, z) ? p : z;
  });
  if (next.length === prev.length && next.every((z, i) => z === prev[i])) return zones === prev ? level : withZones(level, prev);
  return next.some((z, i) => z !== zones[i]) ? withZones(level, next) : level;
}

/**
 * A walls zone whose outline is the smallest closed wall loop around `seed`. A seed in a loop that already holds a
 * (not broken) walls zone returns that zone with `existing: true` and the same level. Outside every loop: the same
 * level, null.
 */
export function addWallsZone(level: Level, seed: Pt, name: string): { level: Level; zoneId: Id | null; existing: boolean } {
  const holes = roomHoles(level);
  const outline = outlineFromHoles(holes, seed);
  if (!outline) return { level, zoneId: null, existing: false };
  for (const z of level.zones) {
    if (z.shape.kind !== 'walls' || z.shape.broken) continue;
    const o = outlineFromHoles(holes, z.shape.seed);
    if (o && sameOutline(o, outline)) return { level, zoneId: z.id, existing: true };
  }
  const zone: Zone = { id: newId(), name, shape: { kind: 'walls', seed: { x: seed.x, y: seed.y }, outline, broken: false }, invalid: false };
  return { level: withZones(level, [...level.zones, zone]), zoneId: zone.id, existing: false };
}

/** A vertex placed by the user: a free vertex never keeps `lost`. */
const placed = (v: ZoneVertex): ZoneVertex => (v.kind === 'free' && v.lost ? { kind: 'free', x: v.x, y: v.y } : v);

/**
 * A polygon zone through `vertices` (caches resolved; a free vertex never keeps `lost`). Fewer than 3 vertices or a
 * self-intersecting outline: same level, null.
 */
export function addPolygonZone(level: Level, vertices: ZoneVertex[], name: string): { level: Level; zoneId: Id | null } {
  if (vertices.length < MIN_VERTICES) return { level, zoneId: null };
  const zone = refreshOne(level, { id: newId(), name, shape: { kind: 'polygon', vertices: vertices.map(placed) }, invalid: false });
  if (selfIntersects(zoneOutline(level, zone))) return { level, zoneId: null };
  return { level: withZones(level, [...level.zones, zone]), zoneId: zone.id };
}

/** Same level for an unknown id or an unchanged name. */
export function renameZone(level: Level, id: Id, name: string): Level {
  const z = level.zones.find(x => x.id === id);
  if (!z || z.name === name) return level;
  return replaceZone(level, z, { ...z, name });
}

/** on: the zone takes part in automation (the field is removed); off: `automation: false`. Same level for no change. */
export function setZoneAutomation(level: Level, id: Id, on: boolean): Level {
  const z = level.zones.find(x => x.id === id);
  if (!z || (z.automation !== false) === on) return level;
  if (!on) return replaceZone(level, z, { ...z, automation: false });
  const { automation: _dropped, ...rest } = z;
  return replaceZone(level, z, rest);
}

/** The device with blacklist `ids`; an empty list removes the field. */
function withBlacklist(d: Device, ids: Id[]): Device {
  if (ids.length > 0) return { ...d, zoneBlacklist: ids };
  const { zoneBlacklist: _dropped, ...rest } = d;
  return rest;
}

/** Removes the zone and its id from every device's blacklist (an emptied blacklist goes). Unknown id: same level. */
export function deleteZone(level: Level, id: Id): Level {
  if (!level.zones.some(z => z.id === id)) return level;
  const devices = level.devices.map(d =>
    (d.zoneBlacklist?.includes(id) ? withBlacklist(d, d.zoneBlacklist.filter(x => x !== id)) : d));
  return {
    ...level,
    zones: level.zones.filter(z => z.id !== id),
    devices: devices.some((d, i) => d !== level.devices[i]) ? devices : level.devices,
  };
}

/** The polygon zone `id`, or null (unknown id or a walls zone). */
function polygonOf(level: Level, id: Id): PolygonZone | null {
  const z = level.zones.find(x => x.id === id);
  return z && z.shape.kind === 'polygon' ? (z as PolygonZone) : null;
}

/** Commits new vertices of polygon zone z (caches and `invalid` refreshed); same level when nothing changes. */
function withVertices(level: Level, z: PolygonZone, vertices: ZoneVertex[]): Level {
  const next = refreshOne(level, { ...z, shape: { kind: 'polygon', vertices } });
  return sameZone(next, z) ? level : replaceZone(level, z, next);
}

const isIndex = (i: number, n: number): boolean => Number.isInteger(i) && i >= 0 && i < n;

/**
 * Replaces vertex `index` of a polygon zone by `v` (a free vertex never keeps `lost`), then refreshes the zone's
 * caches and `invalid`; a self-intersecting result is kept as invalid. Same level for an unknown zone, a walls zone,
 * an index out of range, or no change.
 */
export function moveZoneVertex(level: Level, id: Id, index: number, v: ZoneVertex): Level {
  const z = polygonOf(level, id);
  if (!z || !isIndex(index, z.shape.vertices.length)) return level;
  return withVertices(level, z, z.shape.vertices.map((x, i) => (i === index ? placed(v) : x)));
}

/**
 * Inserts `v` (a free vertex never keeps `lost`) before vertex `index` of a polygon zone (index = the vertex count
 * appends); a self-intersecting result is kept as invalid. Same level for an unknown zone, a walls zone or an index
 * out of range.
 */
export function insertZoneVertex(level: Level, id: Id, index: number, v: ZoneVertex): Level {
  const z = polygonOf(level, id);
  if (!z || !isIndex(index, z.shape.vertices.length + 1)) return level;
  const vertices = [...z.shape.vertices];
  vertices.splice(index, 0, placed(v));
  return withVertices(level, z, vertices);
}

/** Removes vertex `index` of a polygon zone; refused (same level) at 3 vertices, for a walls zone or a bad index. */
export function removeZoneVertex(level: Level, id: Id, index: number): Level {
  const z = polygonOf(level, id);
  if (!z || z.shape.vertices.length <= MIN_VERTICES || !isIndex(index, z.shape.vertices.length)) return level;
  return withVertices(level, z, z.shape.vertices.filter((_, i) => i !== index));
}

/**
 * A walls zone becomes a polygon of lost free vertices along its cached outline (so it is invalid until its vertices
 * are placed again), keeping its id, name and automation flag (device opt-outs keep matching). Same level for an
 * unknown id, a polygon zone or an outline under 3 points.
 */
export function keepZoneOutline(level: Level, id: Id): Level {
  const z = level.zones.find(x => x.id === id);
  if (!z || z.shape.kind !== 'walls' || z.shape.outline.length < MIN_VERTICES) return level;
  const vertices = z.shape.outline.map(lostVertex);
  return replaceZone(level, z, refreshOne(level, { ...z, shape: { kind: 'polygon', vertices } }));
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
  if (!participates && !level.zones.some(z => z.id === zoneId)) return level;
  const next = withBlacklist(d, participates ? list.filter(x => x !== zoneId) : [...list, zoneId]);
  return { ...level, devices: level.devices.map(x => (x === d ? next : x)) };
}
