import { newId } from './ids';
import { refreshZones } from './zones';
import { OPENING_DEFAULT_WIDTH, type Id, type Level, type Opening, type OpeningKind } from './types';

const EPS = 1e-6; // mm

/** Axis length of a wall, or null when the wall (or a node) is missing. */
function wallLen(level: Level, wallId: Id): number | null {
  const w = level.walls.find(x => x.id === wallId);
  if (!w) return null;
  const a = level.nodes.find(n => n.id === w.a);
  const b = level.nodes.find(n => n.id === w.b);
  if (!a || !b) return null;
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function overlaps(o: { offset: number; width: number }, p: { offset: number; width: number }): boolean {
  return o.offset < p.offset + p.width - EPS && p.offset < o.offset + o.width - EPS;
}

/** True when [offset, offset+width] fits the wall and overlaps no other opening on it. */
function fits(level: Level, wallId: Id, offset: number, width: number, ignore?: Id): boolean {
  const l = wallLen(level, wallId);
  if (l === null || width <= 0 || offset < -EPS || offset + width > l + EPS) return false;
  return !level.openings.some(o => o.wallId === wallId && o.id !== ignore && overlaps(o, { offset, width }));
}

function withOpenings(level: Level, openings: Opening[]): Level {
  return { ...level, openings };
}

export function addOpening(
  level: Level, wallId: Id, kind: OpeningKind, centerOffset: number, width?: number,
): { level: Level; openingId: Id | null } {
  const w = width ?? OPENING_DEFAULT_WIDTH[kind];
  const offset = centerOffset - w / 2;
  if (!fits(level, wallId, offset, w)) return { level, openingId: null };
  const o: Opening = { id: newId(), wallId, kind, offset, width: w, invalid: false };
  if (kind === 'door' || kind === 'gate' || kind === 'wicket') { o.hinge = 'start'; o.swing = 'left'; }
  if (kind === 'window') o.outside = 'left';
  return { level: refreshZones(withOpenings(level, [...level.openings, o])), openingId: o.id };
}

/** Rejected (same level returned) when the new place is out of the wall or overlaps. */
export function moveOpening(level: Level, id: Id, offset: number): Level {
  const o = level.openings.find(x => x.id === id);
  if (!o || !fits(level, o.wallId, offset, o.width, id)) return level;
  return refreshZones(refreshOpenings(withOpenings(level, level.openings.map(x => (x.id === id ? { ...x, offset } : x)))));
}

/** New width keeping the start offset; rejected (same level returned) when it does not fit or overlaps. */
export function resizeOpening(level: Level, id: Id, width: number): Level {
  const o = level.openings.find(x => x.id === id);
  if (!o || !fits(level, o.wallId, o.offset, width, id)) return level;
  return refreshZones(refreshOpenings(withOpenings(level, level.openings.map(x => (x.id === id ? { ...x, width } : x)))));
}

export function setOpeningProps(
  level: Level, id: Id, patch: Partial<Pick<Opening, 'width' | 'kind' | 'hinge' | 'swing' | 'outside'>>,
): Level {
  if (!level.openings.some(x => x.id === id)) return level;
  return refreshZones(refreshOpenings(withOpenings(level, level.openings.map(x => (x.id === id ? { ...x, ...patch } : x)))));
}

export function deleteOpening(level: Level, id: Id): Level {
  return refreshZones(refreshOpenings(withOpenings(level, level.openings.filter(x => x.id !== id))));
}

/** invalid = outside [0, len] of its wall or overlapping another opening. Never deletes or clamps. */
export function refreshOpenings(level: Level): Level {
  return withOpenings(level, level.openings.map(o => {
    const l = wallLen(level, o.wallId);
    const invalid = l === null || o.offset < -EPS || o.offset + o.width > l + EPS
      || level.openings.some(p => p.id !== o.id && p.wallId === o.wallId && overlaps(o, p));
    return { ...o, invalid };
  }));
}
