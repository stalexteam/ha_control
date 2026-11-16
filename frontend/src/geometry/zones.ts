import type { Device, Id, Level, Pt, Zone, ZoneVertex } from '../model/types';
import { devicePose, facePoint } from './devices';
import { cross, dist, distToSegment, dot, pointInPolygon, polygonArea, sub } from './vec';
import { wallLen } from './walls';

/** A point within this distance of a zone edge is inside the zone (mm). */
const EDGE_TOL = 1;
/** A wall vertex whose offset lies further than this outside [0, wall length] makes its zone invalid (mm). */
const WALL_TOL = 1;
/** Consecutive ring points closer than this are one point (mm). */
const SAME_PT = 1e-6;
/** Three points turning by less than this sine are collinear. */
const COLLINEAR = 1e-9;
/** A ring with a smaller area (mm2) has no area centroid. */
const AREA_EPS = 1e-6;
/** A polygon zone outline with a smaller area (mm2) has collapsed (e.g. to fewer than three distinct points). */
const MIN_ZONE_AREA = 1;

/** Why a zone is invalid, in priority order (see zoneInvalidReason). */
export type ZoneInvalidReason = 'broken' | 'lost' | 'beyond' | 'crossing';

/**
 * Where a vertex lies now: a free vertex at its x,y; a node vertex at its node; a wall vertex at the face point of
 * its wall (the rule of wall devices, facePoint) with the offset clamped to the wall's length. Null when the node or
 * the wall (or one of its nodes) is missing.
 */
export function vertexPoint(level: Level, v: ZoneVertex): Pt | null {
  switch (v.kind) {
    case 'free':
      return { x: v.x, y: v.y };
    case 'node': {
      const n = level.nodes.find(x => x.id === v.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case 'wall': {
      const len = wallLen(level, v.wallId);
      return len === null ? null : facePoint(level, v.wallId, v.side, Math.max(0, Math.min(len, v.offset)));
    }
  }
}

/** The zone's outline: a walls zone's cached outline; per polygon vertex its vertexPoint, else its cached x,y. */
export function zoneOutline(level: Level, z: Zone): Pt[] {
  const s = z.shape;
  if (s.kind === 'walls') return s.outline;
  return s.vertices.map(v => vertexPoint(level, v) ?? { x: v.x, y: v.y });
}

/** The zone's own area in m2, rounded to 1 decimal (overlapping zones are not subtracted). */
export function zoneArea(level: Level, z: Zone): number {
  return Math.round(Math.abs(polygonArea(zoneOutline(level, z))) / 1e5) / 10;
}

/** Sign of the turn a -> b -> c (Y down: the sign of the cross product); 0 when collinear or two points coincide. */
function orient(a: Pt, b: Pt, c: Pt): number {
  const v = cross(sub(b, a), sub(c, a));
  return Math.abs(v) <= COLLINEAR * dist(a, b) * dist(a, c) ? 0 : Math.sign(v);
}

/** p, known to be collinear with a-b, lies on the segment (ends included). */
const between = (p: Pt, a: Pt, b: Pt): boolean => dot(sub(a, p), sub(b, p)) <= 0;

/** The segments p1-p2 and q1-q2 cross or touch. */
export function segmentsMeet(p1: Pt, p2: Pt, q1: Pt, q2: Pt): boolean {
  const d1 = orient(q1, q2, p1), d2 = orient(q1, q2, p2), d3 = orient(p1, p2, q1), d4 = orient(p1, p2, q2);
  if (d1 * d2 < 0 && d3 * d4 < 0) return true;
  return (d3 === 0 && between(q1, p1, p2)) || (d4 === 0 && between(q2, p1, p2))
    || (d1 === 0 && between(p1, q1, q2)) || (d2 === 0 && between(p2, q1, q2));
}

/** The ring without repeated consecutive points (the last point repeating the first included). */
function distinctRing(ring: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of ring) if (out.length === 0 || dist(out[out.length - 1], p) > SAME_PT) out.push(p);
  while (out.length > 1 && dist(out[0], out[out.length - 1]) <= SAME_PT) out.pop();
  return out;
}

/**
 * The closed ring crosses or touches itself. Repeated consecutive points are ignored; two adjacent edges meeting at
 * their shared vertex do not count, but one running back over the other (a collinear overlap) does. Fewer than three
 * distinct points: false.
 */
export function selfIntersects(ring: Pt[]): boolean {
  const p = distinctRing(ring);
  const n = p.length;
  if (n < 3) return false;
  for (let i = 0; i < n; i++) {
    const a = p[i], b = p[(i + 1) % n], c = p[(i + 2) % n];
    if (orient(a, b, c) === 0 && dot(sub(b, a), sub(c, b)) < 0) return true; // edge b-c runs back over a-b
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue; // adjacent across the closing vertex
      if (segmentsMeet(a, b, p[j], p[(j + 1) % n])) return true;
    }
  }
  return false;
}

/**
 * Why the zone is invalid, or null. A walls zone: 'broken' (its walls no longer close it). A polygon, in priority
 * order: 'lost' (a free vertex lost its anchor, or a node or wall vertex's anchor is missing), 'beyond' (a wall vertex
 * offset lies outside [-1, length + 1] mm), 'crossing' (the outline crosses itself or collapsed: fewer than three
 * distinct points or under 1 mm2 of area).
 */
export function zoneInvalidReason(level: Level, z: Zone): ZoneInvalidReason | null {
  const s = z.shape;
  if (s.kind === 'walls') return s.broken ? 'broken' : null;
  if (s.vertices.some(v => (v.kind === 'free' ? v.lost === true : vertexPoint(level, v) === null))) return 'lost';
  const beyond = (v: ZoneVertex): boolean => {
    if (v.kind !== 'wall') return false;
    const len = wallLen(level, v.wallId);
    return len !== null && (v.offset < -WALL_TOL || v.offset > len + WALL_TOL);
  };
  if (s.vertices.some(beyond)) return 'beyond';
  const outline = zoneOutline(level, z);
  return Math.abs(polygonArea(outline)) < MIN_ZONE_AREA || selfIntersects(outline) ? 'crossing' : null;
}

/** p lies inside the outline or within 1 mm of one of its edges. */
export function zoneContains(outline: Pt[], p: Pt): boolean {
  return pointInPolygon(p, outline)
    || outline.some((a, i) => distToSegment(p, a, outline[(i + 1) % outline.length]) <= EDGE_TOL);
}

const participates = (d: Device, zoneId: Id): boolean => !(d.zoneBlacklist ?? []).includes(zoneId);

/** The zones (in level order) containing the device's pose point; participates = the zone is not blacklisted. */
export function deviceZones(level: Level, d: Device): { zone: Zone; participates: boolean }[] {
  const pose = devicePose(level, d);
  if (!pose) return [];
  return level.zones
    .filter(z => zoneContains(zoneOutline(level, z), pose.pt))
    .map(zone => ({ zone, participates: participates(d, zone.id) }));
}

/** The devices (in level order) whose pose point lies in the zone; [] when the zone is missing. */
export function zoneMembers(level: Level, zoneId: Id): { device: Device; participates: boolean }[] {
  const zone = level.zones.find(z => z.id === zoneId);
  if (!zone) return [];
  const outline = zoneOutline(level, zone);
  const out: { device: Device; participates: boolean }[] = [];
  for (const device of level.devices) {
    const pose = devicePose(level, device);
    if (pose && zoneContains(outline, pose.pt)) out.push({ device, participates: participates(device, zoneId) });
  }
  return out;
}

/**
 * Where a zone's label sits: the area centroid when the ring has an area and the centroid lies inside it, else the
 * mean of the vertices ((0, 0) for an empty outline).
 */
export function zoneLabelPoint(outline: Pt[]): Pt {
  const n = outline.length;
  if (n === 0) return { x: 0, y: 0 };
  const a = polygonArea(outline);
  if (Math.abs(a) > AREA_EPS) {
    let cx = 0, cy = 0;
    for (let i = 0; i < n; i++) {
      const p = outline[i], q = outline[(i + 1) % n];
      const c = p.x * q.y - q.x * p.y;
      cx += (p.x + q.x) * c;
      cy += (p.y + q.y) * c;
    }
    const centroid = { x: cx / (6 * a), y: cy / (6 * a) };
    if (pointInPolygon(centroid, outline)) return centroid;
  }
  return {
    x: outline.reduce((s, p) => s + p.x, 0) / n,
    y: outline.reduce((s, p) => s + p.y, 0) / n,
  };
}
