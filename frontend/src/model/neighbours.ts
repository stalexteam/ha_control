import type { Device, Id, Level, Pt, Rule, Zone } from './types';
import { wallFrame } from '../geometry/walls';
import { zoneContains, zoneMembers, zoneOutline } from '../geometry/zones';
import { perpLeft } from '../geometry/vec';

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

/**
 * The neighbours of a zone: zones that share an opening with it (a door, gap, gate or wicket whose wall has one of them
 * on each side; a window is no way through), with the motion sensors placed in them (zone membership as everywhere,
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
