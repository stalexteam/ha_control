import type { Device, Id, Level, Pt, Rule, Zone } from './types';
import { wallFrame } from '../geometry/walls';
import { segmentsMeet, zoneContains, zoneLabelPoint, zoneMembers, zoneOutline } from '../geometry/zones';
import { dist, distToSegment, dot, perpLeft, pointInPolygon, sub } from '../geometry/vec';
import { wallLocal } from '../geometry/walls';

/** How far beyond a wall face the probe of an opening looks for the zone on that side (mm). */
const PROBE = 100;

/** A zone next to the rule's zone and the motion sensors placed in it (the rule's own sensors left out). */
export interface NeighbourZone { zone: Zone; sensors: Device[] }

/** The zones on each side of an opening: probes just beyond the two faces of its wall at the opening's centre. */
function sidesOf(level: Level, wallId: Id, centre: number): [Zone[], Zone[]] | null {
  const wall = level.walls.find(w => w.id === wallId);
  if (!wall) return null;
  let frame;
  try { frame = wallFrame(level, wall); } catch { return null; }
  const c: Pt = { x: frame.a.x + frame.dir.x * centre, y: frame.a.y + frame.dir.y * centre };
  const n = perpLeft(frame.dir);
  const left = { x: c.x + n.x * (frame.leftOff + PROBE), y: c.y + n.y * (frame.leftOff + PROBE) };
  const right = { x: c.x - n.x * (frame.rightOff + PROBE), y: c.y - n.y * (frame.rightOff + PROBE) };
  const at = (p: Pt) => level.zones.filter(z => zoneContains(zoneOutline(level, z), p));
  return [at(left), at(right)];
}

/** Zone edges closer than this are one line; a shared stretch shorter than this is a point (mm). */
const TOL = 1;

/** A point lies in the body of a wall (axis to both faces, ends included). */
function inWall(level: Level, p: Pt): boolean {
  return level.walls.some(w => {
    let f;
    try { f = wallFrame(level, w); } catch { return false; }
    const { t, side } = wallLocal(f, p);
    return t >= -TOL && t <= f.len + TOL && side >= -f.rightOff - TOL && side <= f.leftOff + TOL;
  });
}

/** Strictly inside the ring (not on its edge). */
const strictlyIn = (ring: Pt[], p: Pt): boolean => pointInPolygon(p, ring) && !ring.some((a, i) => distToSegment(p, a, ring[(i + 1) % ring.length]) <= TOL);

/** The rings share an area: an edge crossing, a corner or a label point strictly inside the other ring. */
function overlaps(a: Pt[], b: Pt[]): boolean {
  if (a.some(p => strictlyIn(b, p)) || b.some(p => strictlyIn(a, p))) return true;
  if (strictlyIn(b, zoneLabelPoint(a)) || strictlyIn(a, zoneLabelPoint(b))) return true;
  const proper = (p: Pt, q: Pt, r: Pt, s: Pt): boolean => {
    const c = (x: Pt, y: Pt, z: Pt) => (y.x - x.x) * (z.y - x.y) - (y.y - x.y) * (z.x - x.x);
    return c(r, s, p) * c(r, s, q) < -TOL * TOL && c(p, q, r) * c(p, q, s) < -TOL * TOL;
  };
  return a.some((p, i) => b.some((r, j) => proper(p, a[(i + 1) % a.length], r, b[(j + 1) % b.length])));
}

/** The rings share a stretch of edge (longer than a point) that no wall covers: open ground between them. */
function sharesOpenEdge(level: Level, a: Pt[], b: Pt[]): boolean {
  for (let i = 0; i < a.length; i++) {
    const p = a[i], q = a[(i + 1) % a.length], len = dist(p, q);
    if (len < TOL) continue;
    const dir = sub(q, p);
    for (let j = 0; j < b.length; j++) {
      const r = b[j], s = b[(j + 1) % b.length];
      if (distToSegment(r, p, q) > TOL && distToSegment(s, p, q) > TOL && !segmentsMeet(p, q, r, s)) continue;
      const line = (x: Pt) => Math.abs((x.x - p.x) * dir.y - (x.y - p.y) * dir.x) / len;
      if (line(r) > TOL || line(s) > TOL) continue; // not on one line
      const tr = dot(sub(r, p), dir) / len, ts = dot(sub(s, p), dir) / len;
      const from = Math.max(0, Math.min(tr, ts)), to = Math.min(len, Math.max(tr, ts));
      if (to - from <= TOL) continue; // a touch at a point
      const mid = from + (to - from) / 2;
      if (!inWall(level, { x: p.x + dir.x / len * mid, y: p.y + dir.y / len * mid })) return true;
    }
  }
  return false;
}

/**
 * The neighbours of a zone: zones that share an opening with it (a door, gap, gate or wicket whose wall has one of them
 * on each side; a window is no way through), zones that overlap it or touch it along an edge with no wall on that
 * stretch (open ground; a touch at one point is not a passage), with the motion sensors placed in them (zone membership as everywhere,
 * a device that opted out of the zone left out) except `own` (the rule's own sensors). Zones left without a sensor are
 * not listed. In level order.
 */
export function neighbourZones(level: Level, zoneId: Id, own: Id[]): NeighbourZone[] {
  if (!level.zones.some(z => z.id === zoneId)) return [];
  const found = new Set<Id>();
  for (const o of level.openings) {
    if (o.invalid || o.kind === 'window') continue;
    const sides = sidesOf(level, o.wallId, o.offset + o.width / 2);
    if (!sides) continue;
    const [l, r] = sides;
    const toward = (mine: Zone[], other: Zone[]) => { if (mine.some(z => z.id === zoneId)) for (const z of other) if (z.id !== zoneId) found.add(z.id); };
    toward(l, r);
    toward(r, l);
  }
  const mine = level.zones.find(z => z.id === zoneId)!;
  const ring = zoneOutline(level, mine);
  if (ring.length >= 3) {
    for (const z of level.zones) {
      const other = zoneOutline(level, z);
      if (z.id !== zoneId && other.length >= 3 && (overlaps(ring, other) || sharesOpenEdge(level, ring, other))) found.add(z.id);
    }
  }
  const out: NeighbourZone[] = [];
  for (const zone of level.zones) {
    if (!found.has(zone.id)) continue;
    const sensors = zoneMembers(level, zone.id).filter(m => m.participates && m.device.props.kind === 'motion_sensor' && !own.includes(m.device.id)).map(m => m.device);
    if (sensors.length > 0) out.push({ zone, sensors });
  }
  return out;
}

/** The neighbours of the zone wherever it lives (the plan's levels); a null or unknown zone has none. */
export function planNeighbours(levels: Level[], zoneId: Id | null, own: Id[]): NeighbourZone[] {
  const level = zoneId === null ? undefined : levels.find(l => l.zones.some(z => z.id === zoneId));
  return level ? neighbourZones(level, zoneId as Id, own) : [];
}

/** The sensor ids of the neighbours: distinct, sorted (a stable list: a changed list is a changed rule). */
export const neighbourIds = (list: NeighbourZone[]): Id[] => [...new Set(list.flatMap(n => n.sensors.map(d => d.id)))].sort();

/**
 * The rules with `motionLight.neighbours` derived from the plan: the sorted ids for a rule with `presence`, none for a
 * rule without. A rule that does not change stays the same object (so does the array when nothing changes).
 */
export function withNeighbours(rules: Rule[], levels: Level[]): Rule[] {
  let changed = false;
  const next = rules.map(r => {
    const m = r.motionLight;
    if (!m) return r;
    const { neighbours: had, ...rest } = m;
    const want = m.presence === true ? neighbourIds(planNeighbours(levels, r.zoneId, m.sensors)) : undefined;
    if (want === undefined ? had === undefined : had !== undefined && had.length === want.length && had.every((id, i) => id === want[i])) return r;
    changed = true;
    return { ...r, motionLight: want === undefined ? rest : { ...rest, neighbours: want } };
  });
  return changed ? next : rules;
}
