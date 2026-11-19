import type { Device, Id, Level, Pt, Rule, Zone } from './types';
import { clippedCone } from '../geometry/devices';
import { wallFrame, wallLocal } from '../geometry/walls';
import { segmentsMeet, zoneContains, zoneLabelPoint, zoneOutline } from '../geometry/zones';
import { dist, distToSegment, dot, perpLeft, pointInPolygon, polygonArea, sub } from '../geometry/vec';

/** How far beyond a wall face the probe of an opening looks for the rule's zone on that side (mm). */
const PROBE = 100;

/**
 * The motion sensors whose line-of-sight cone covers the area beyond one passage of the rule's zone, grouped by the zone
 * that area lies in (`zone` null = outside: no zone there). The rule's own sensors are left out.
 */
export interface NeighbourZone { zone: Zone | null; sensors: Device[] }

/** A point beyond a passage and the zone it leads to (null: no zone but the rule's own holds it). */
interface Sample { pt: Pt; zone: Zone | null }

/** Passage samples: this far beyond the far face (or the shared edge), and across the passage (fractions of the width). */
const DEPTHS = [300, 600];
const ACROSS = [-0.4, -0.2, 0, 0.2, 0.4];

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

/** The stretches of an edge of `a` shared with `b` (longer than a point) that no wall covers: open ground between them. */
function openEdges(level: Level, a: Pt[], b: Pt[]): { p: Pt; q: Pt }[] {
  const out: { p: Pt; q: Pt }[] = [];
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
      const at = (t: number): Pt => ({ x: p.x + dir.x / len * t, y: p.y + dir.y / len * t });
      if (!inWall(level, at(from + (to - from) / 2))) out.push({ p: at(from), q: at(to) });
    }
  }
  return out;
}

const areaOf = (level: Level, z: Zone): number => Math.abs(polygonArea(zoneOutline(level, z)));

/** The smallest zone but the rule's own holding the point, or null. */
function destination(level: Level, zoneId: Id, p: Pt): Zone | null {
  let best: Zone | null = null;
  for (const z of level.zones) {
    if (z.id === zoneId || !zoneContains(zoneOutline(level, z), p)) continue;
    if (!best || areaOf(level, z) < areaOf(level, best)) best = z;
  }
  return best;
}

/** The sample points beyond the passages of the zone: openings in its walls, then open ground shared with other zones. */
function samples(level: Level, mine: Zone): Sample[] {
  const ring = zoneOutline(level, mine);
  const out: Sample[] = [];
  const push = (pt: Pt, zone: Zone | null) => { if (!zoneContains(ring, pt)) out.push({ pt, zone }); };
  for (const o of level.openings) {
    if (o.invalid || o.kind === 'window') continue;
    const wall = level.walls.find(w => w.id === o.wallId);
    if (!wall) continue;
    let f;
    try { f = wallFrame(level, wall); } catch { continue; }
    const mid = o.offset + o.width / 2;
    const c: Pt = { x: f.a.x + f.dir.x * mid, y: f.a.y + f.dir.y * mid };
    const n = perpLeft(f.dir);
    // The rule's zone on one side (a probe just beyond that face): the area lies beyond the far face of the other side.
    const sides: { near: Pt; sign: 1 | -1; farOff: number }[] = [
      { near: { x: c.x + n.x * (f.leftOff + PROBE), y: c.y + n.y * (f.leftOff + PROBE) }, sign: -1, farOff: f.rightOff },
      { near: { x: c.x - n.x * (f.rightOff + PROBE), y: c.y - n.y * (f.rightOff + PROBE) }, sign: 1, farOff: f.leftOff },
    ];
    for (const { near, sign, farOff } of sides) {
      if (!zoneContains(ring, near)) continue;
      for (const a of ACROSS) for (const d of DEPTHS) {
        const pt = { x: c.x + f.dir.x * a * o.width + n.x * sign * (farOff + d), y: c.y + f.dir.y * a * o.width + n.y * sign * (farOff + d) };
        push(pt, destination(level, mine.id, pt));
      }
    }
  }
  if (ring.length < 3) return out;
  for (const z of level.zones) {
    const other = zoneOutline(level, z);
    if (z.id === mine.id || other.length < 3) continue;
    for (const { p, q } of openEdges(level, ring, other)) {
      const dir = sub(q, p), len = dist(p, q), n = { x: -dir.y / len, y: dir.x / len };
      const probe = { x: (p.x + q.x) / 2 + n.x * 50, y: (p.y + q.y) / 2 + n.y * 50 };
      const sign = strictlyIn(ring, probe) ? -1 : 1; // away from the rule's zone
      for (let k = 1; k <= ACROSS.length; k++) for (const d of DEPTHS) {
        const t = k / (ACROSS.length + 1);
        push({ x: p.x + dir.x * t + n.x * sign * d, y: p.y + dir.y * t + n.y * sign * d }, z);
      }
    }
    if (overlaps(ring, other)) {
      const xs = other.map(v => v.x), ys = other.map(v => v.y);
      const x0 = Math.min(...xs), y0 = Math.min(...ys), x1 = Math.max(...xs), y1 = Math.max(...ys);
      const step = Math.max(200, Math.max(x1 - x0, y1 - y0) / 60);
      for (let x = x0 + step / 2; x < x1; x += step) {
        for (let y = y0 + step / 2; y < y1; y += step) {
          const pt = { x, y };
          if (!strictlyIn(other, pt) || zoneContains(ring, pt)) continue;
          if (ring.some((v, i) => distToSegment(pt, v, ring[(i + 1) % ring.length]) <= DEPTHS[1])) out.push({ pt, zone: z });
        }
      }
    }
  }
  return out;
}

/** The cone of a motion sensor as rings (even-odd), cached per level object. */
const cones = new WeakMap<Level, Map<Id, Pt[][]>>();
function coneOf(level: Level, d: Device): Pt[][] {
  let m = cones.get(level);
  if (!m) cones.set(level, m = new Map());
  let c = m.get(d.id);
  if (!c) {
    // A geometry failure must never block a Save or a draft: the sensor then sees nothing.
    try { c = clippedCone(level, d); } catch { c = []; }
    m.set(d.id, c);
  }
  return c;
}
const covers = (rings: Pt[][], p: Pt): boolean => rings.reduce((inside, ring) => (pointInPolygon(p, ring) ? !inside : inside), false);

const results = new WeakMap<Level, Map<string, NeighbourZone[]>>();

/**
 * The neighbours of a zone, by cones: motion sensors (not `own`, the rule's own) whose line-of-sight cone (`clippedCone`)
 * covers the area beyond a passage of the zone: a door, gap, gate or wicket in a wall with the zone on one side (a window
 * is no way through), or open ground shared with a touching or overlapping zone (no wall on the shared stretch; a touch
 * at one point is not a passage). The area is sampled 300 and 600 mm beyond the far wall face (or the shared edge),
 * outside the zone. Grouped by the zone the area lies in (`zone` null = outside), in level order, outside last; where the
 * sensor hangs does not matter. Cached per level object (the dialog asks every second).
 */
export function neighbourZones(level: Level, zoneId: Id, own: Id[]): NeighbourZone[] {
  const key = `${zoneId}|${[...own].sort().join(',')}`;
  let perLevel = results.get(level);
  if (!perLevel) results.set(level, perLevel = new Map());
  const cached = perLevel.get(key);
  if (cached) return cached;
  const mine = level.zones.find(z => z.id === zoneId);
  const out: NeighbourZone[] = [];
  if (mine) {
    const pts = samples(level, mine);
    const sensors = level.devices.filter(d => d.props.kind === 'motion_sensor' && !own.includes(d.id));
    for (const zone of [...level.zones, null]) {
      const here = pts.filter(s => (s.zone?.id ?? null) === (zone?.id ?? null));
      if (here.length === 0) continue;
      const seen = sensors.filter(d => { const c = coneOf(level, d); return c.length > 0 && here.some(s => covers(c, s.pt)); });
      if (seen.length > 0) out.push({ zone, sensors: seen });
    }
  }
  perLevel.set(key, out);
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
