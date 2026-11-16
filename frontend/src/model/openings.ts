import { newId } from './ids';
import { wallLen } from '../geometry/walls';
import { OPENING_DEFAULT_WIDTH, type Id, type Level, type Opening, type OpeningKind } from './types';

// Opening edits leave zones alone: walls zone outlines ignore openings (see roomHoles in geometry/rooms).

const EPS = 1e-6; // mm

/** Kinds drawn as a door leaf: they carry hinge and swing. */
export const DOOR_KINDS: readonly OpeningKind[] = ['door', 'gate', 'wicket'];

/** Fields setOpeningProps may change; a key set to undefined is removed from the opening. */
export type OpeningPatch = Partial<Pick<Opening, 'width' | 'kind' | 'hinge' | 'swing' | 'outside' | 'passesLight' | 'passesPir'>>;

/** Whether light passes an opening of this kind when its `passesLight` is not set: only a plain opening (a gap). */
export const passesLightByDefault = (kind: OpeningKind): boolean => kind === 'opening';

/** Effective `passesLight`: the explicit value, else the kind's default (opening true; door, window, gate, wicket false). */
export const passesLight = (o: Opening): boolean => o.passesLight ?? passesLightByDefault(o.kind);

/** Whether PIR motion passes an opening of this kind when its `passesPir` is not set: only a plain opening (a gap). */
export const passesPirByDefault = (kind: OpeningKind): boolean => kind === 'opening';

/** Effective `passesPir`: the explicit value, else the kind's default (opening true; door, window, gate, wicket false). */
export const passesPir = (o: Opening): boolean => o.passesPir ?? passesPirByDefault(o.kind);

function overlaps(o: { offset: number; width: number }, p: { offset: number; width: number }): boolean {
  return o.offset < p.offset + p.width - EPS && p.offset < o.offset + o.width - EPS;
}

/** True when [offset, offset+width] fits the wall and overlaps no other opening on it. */
export function fits(level: Level, wallId: Id, offset: number, width: number, ignore?: Id): boolean {
  const l = wallLen(level, wallId);
  if (l === null || width <= 0 || offset < -EPS || offset + width > l + EPS) return false;
  return !level.openings.some(o => o.wallId === wallId && o.id !== ignore && overlaps(o, { offset, width }));
}

function withOpenings(level: Level, openings: Opening[]): Level {
  return { ...level, openings };
}

export function addOpening(
  level: Level, wallId: Id, kind: OpeningKind, centerOffset: number, width?: number,
  extra: Pick<Opening, 'hinge' | 'swing' | 'outside'> = {},
): { level: Level; openingId: Id | null } {
  const w = width ?? OPENING_DEFAULT_WIDTH[kind];
  const offset = centerOffset - w / 2;
  if (!fits(level, wallId, offset, w)) return { level, openingId: null };
  const o: Opening = { id: newId(), wallId, kind, offset, width: w, invalid: false };
  if (DOOR_KINDS.includes(kind)) { o.hinge = extra.hinge ?? 'start'; o.swing = extra.swing ?? 'left'; }
  if (kind === 'window') o.outside = extra.outside ?? 'left';
  return { level: withOpenings(level, [...level.openings, o]), openingId: o.id };
}

/** Rejected (same level returned) when the new place is out of the wall or overlaps. */
export function moveOpening(level: Level, id: Id, offset: number): Level {
  const o = level.openings.find(x => x.id === id);
  if (!o || !fits(level, o.wallId, offset, o.width, id)) return level;
  return refreshOpenings(withOpenings(level, level.openings.map(x => (x.id === id ? { ...x, offset } : x))));
}

/** New width keeping the start offset; rejected (same level returned) when it does not fit or overlaps. */
export function resizeOpening(level: Level, id: Id, width: number): Level {
  const o = level.openings.find(x => x.id === id);
  if (!o || !fits(level, o.wallId, o.offset, width, id)) return level;
  return refreshOpenings(withOpenings(level, level.openings.map(x => (x.id === id ? { ...x, width } : x))));
}

/** Patch for a kind switch: doors get hinge+swing, windows get outside, irrelevant fields are dropped. */
export function kindPatch(o: Opening, kind: OpeningKind): OpeningPatch {
  if (DOOR_KINDS.includes(kind)) return { kind, hinge: o.hinge ?? 'start', swing: o.swing ?? 'left', outside: undefined };
  if (kind === 'window') return { kind, outside: o.outside ?? 'left', hinge: undefined, swing: undefined };
  return { kind, hinge: undefined, swing: undefined, outside: undefined };
}

/** Applies the patch; keys it sets to undefined are removed so they disappear from the JSON. */
export function setOpeningProps(level: Level, id: Id, patch: OpeningPatch): Level {
  if (!level.openings.some(x => x.id === id)) return level;
  const patched = (x: Opening): Opening => {
    const c = { ...x, ...patch };
    for (const k of Object.keys(patch) as (keyof OpeningPatch)[]) if (patch[k] === undefined) delete c[k];
    return c;
  };
  return refreshOpenings(withOpenings(level, level.openings.map(x => (x.id === id ? patched(x) : x))));
}

export function deleteOpening(level: Level, id: Id): Level {
  return refreshOpenings(withOpenings(level, level.openings.filter(x => x.id !== id)));
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
