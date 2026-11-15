import polygonClipping from 'polygon-clipping';
import {
  AIM_KINDS, AIM_MAX, type Device, type DeviceKind, type DevicePlacement, type DeviceProps, type Id, type Level, type Pt,
  type Side,
} from '../model/types';
import { add, cross, dist, dot, perpLeft, scale, sub } from './vec';
import { fromRing, toPoly, wallFrame } from './walls';
import {
  FAN_STEP_DEG, lineOfSightObstacles, obstaclesWithin, visibilityPolygon, type Medium, type Segment,
} from './visibility';

/**
 * pt: device centre; dir: unit facing direction (a wall device's face normal turned by its aim; along the wall for
 * wall-mounted equipment); normal: the wall face normal, wall devices only.
 */
export interface DevicePose { pt: Pt; dir: Pt; normal?: Pt }

const SEGS_PER_90 = 32;
const CIRCLE_PTS = 128;

/** Direction at angle a (degrees), counter-clockwise on screen (Y down). */
function dirAt(a: number): Pt {
  const r = (a * Math.PI) / 180;
  return { x: Math.cos(r), y: -Math.sin(r) };
}

/** Screen angle (degrees, counter-clockwise, Y down) of a direction. */
export function angleOf(d: Pt): number {
  return (Math.atan2(-d.y, d.x) * 180) / Math.PI;
}

/** Angle in degrees wrapped to [0, 360). */
export function wrap360(a: number): number {
  return ((a % 360) + 360) % 360;
}

/** Angle in degrees wrapped to [-180, 180). */
export function wrap180(a: number): number {
  return (((a % 360) + 540) % 360) - 180;
}

/**
 * A point on a wall face: the axis point at offset (from node A, not clamped), moved onto the face of its side;
 * normal = that face's outward normal (left = perpLeft(wall dir)). Null when the wall or one of its nodes is missing.
 */
function wallFace(level: Level, wallId: Id, side: Side, offset: number): { pt: Pt; normal: Pt } | null {
  const wall = level.walls.find(w => w.id === wallId);
  if (!wall) return null;
  let f;
  try { f = wallFrame(level, wall); } catch { return null; } // a node is missing
  const L = perpLeft(f.dir);
  const n = side === 'left' ? L : scale(L, -1);
  const off = side === 'left' ? f.leftOff : f.rightOff;
  return { pt: add(add(f.a, scale(f.dir, offset)), scale(n, off)), normal: n };
}

/** The face point of a wall placement (the rule of wall devices, see devicePose); null when the wall or a node is missing. */
export function facePoint(level: Level, wallId: Id, side: Side, offset: number): Pt | null {
  return wallFace(level, wallId, side, offset)?.pt ?? null;
}

/**
 * Wall device: axis point at offset, moved onto the face of its side; dir = that face's outward normal
 * (left = perpLeft(wall dir)). Wall-mounted equipment: its body centre, half its depth (a circle: its radius) off that
 * face point along the normal, with dir = perpLeft(normal) (along the wall), so a rect's width runs along the wall and its
 * back edge lies on the face. Free device: (x, y) facing (cos r, -sin r). Null when the host wall is missing, and for a
 * device not on the plan.
 */
export function devicePose(level: Level, d: Device): DevicePose | null {
  const p = d.placement;
  if (p.mode === 'none') return null;
  if (p.mode === 'free') return { pt: { x: p.x, y: p.y }, dir: dirAt(p.rotation) };
  const face = wallFace(level, p.wallId, p.side, p.offset);
  if (!face) return null;
  const n = face.normal;
  const pr = d.props;
  if (pr.kind === 'equipment') {
    const half = pr.shape === 'circle' ? pr.diameter / 2 : pr.depth / 2;
    return { pt: add(face.pt, scale(n, half)), dir: perpLeft(n), normal: n };
  }
  return { pt: face.pt, dir: p.aim ? dirAt(angleOf(n) + p.aim) : n, normal: n };
}

function circle(c: Pt, r: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < CIRCLE_PTS; i++) pts.push(add(c, scale(dirAt((360 * i) / CIRCLE_PTS), r)));
  return pts;
}

/** Sector with apex c centred on dir; 360 or more gives a full circle. */
function sector(c: Pt, dir: Pt, angle: number, r: number): Pt[] {
  if (angle >= 360) return circle(c, r);
  const n = Math.max(1, Math.ceil((angle / 90) * SEGS_PER_90));
  const start = angleOf(dir) - angle / 2;
  const pts: Pt[] = [c];
  for (let i = 0; i <= n; i++) pts.push(add(c, scale(dirAt(start + (angle * i) / n), r)));
  return pts;
}

/**
 * The kinds with a cone, zone or light pool, and the line-of-sight medium it carries: wall and ceiling lights cast
 * light, motion sensors see motion. The one list of cone kinds: coneShape must give each a shape (its switch is
 * checked for exhaustiveness against these keys) and clippedCone takes the medium from here.
 */
export const CONE_MEDIUM = {
  wall_light: 'light',
  ceiling_light: 'light',
  motion_sensor: 'motion',
} as const satisfies Partial<Record<DeviceKind, Medium>>;

/** A device kind with a cone, zone or light pool. */
export type ConeKind = keyof typeof CONE_MEDIUM;

/** The line-of-sight medium of a kind's cone, or null for a kind without one. */
export function coneMedium(kind: DeviceKind): Medium | null {
  return (CONE_MEDIUM as Partial<Record<DeviceKind, Medium>>)[kind] ?? null;
}

const hasCone = (p: DeviceProps): p is Extract<DeviceProps, { kind: ConeKind }> => coneMedium(p.kind) !== null;

/** Unclipped cone / zone / light pool polygon, or null when the device has none. */
export function coneShape(level: Level, d: Device): Pt[] | null {
  const pr = d.props;
  if (!hasCone(pr)) return null;
  const pose = devicePose(level, d);
  if (!pose) return null;
  switch (pr.kind) {
    case 'wall_light':
      return pr.coneAngle > 0 && pr.coneRange > 0 ? sector(pose.pt, pose.dir, pr.coneAngle, pr.coneRange) : null;
    case 'motion_sensor':
      return pr.zoneAngle > 0 && pr.zoneRange > 0 ? sector(pose.pt, pose.dir, pr.zoneAngle, pr.zoneRange) : null;
    case 'ceiling_light':
      return pr.poolRadius !== null && pr.poolRadius > 0 ? circle(pose.pt, pr.poolRadius) : null;
  }
}

/** Probe point of a device: the face normal step for wall devices, the centre for free ones. */
function probeOf(pose: DevicePose): Pt {
  return pose.normal ? add(pose.pt, pose.normal) : pose.pt;
}

/** Even-odd: p lies inside the closed rings the segments form (inside the walls, for line-of-sight obstacles). */
function insideSegments(p: Pt, segs: Segment[]): boolean {
  let inside = false;
  for (const [a, b] of segs) {
    if ((a.y > p.y) !== (b.y > p.y) && p.x < a.x + ((p.y - a.y) * (b.x - a.x)) / (b.y - a.y)) inside = !inside;
  }
  return inside;
}

/** The segment p-q meets one of the segments (crossing or touching). */
function crossesAny(p: Pt, q: Pt, segs: Segment[]): boolean {
  const d = sub(q, p);
  for (const [a, b] of segs) {
    const e = sub(b, a), w = sub(a, p);
    const den = cross(d, e);
    if (Math.abs(den) < 1e-12) continue; // parallel
    const t = cross(w, e) / den, s = cross(w, d) / den;
    if (t >= 0 && t <= 1 && s >= 0 && s <= 1) return true;
  }
  return false;
}

/** A sight origin closer than this to a wall edge counts as on the wall (mm); the probe itself is 1 mm off its face. */
const ORIGIN_CLEARANCE = 0.5;
/** Joined wall corners lie within this many times the thickest wall of their node (MITER_LIMIT in walls.ts). */
const ORIGIN_SLIDE_THICKNESSES = 3;
/** A wall edge within this distance of the host face line lies on it (mm). */
const ON_FACE = 1e-4;

/**
 * Where a device's sight starts: its probe point (pose + face normal for wall devices, pose for free ones), or null
 * without a pose.
 *
 * A wall device's probe that lies inside the walls or within ORIGIN_CLEARANCE of a wall edge (the device sits at a
 * room corner, a T-junction or the end of an opening) moves along the line 1 mm in front of its host face. The
 * candidates lie 1 mm (perpendicular) either side of each wall edge that line meets, so each is clear of that edge
 * at any angle. The nearest candidate wins (ties toward the host's middle) that is clear of the walls and has an
 * unobstructed line of sight to a point 1 mm in front of the host-face edge nearest the device's offset (the middle
 * of a wall edge on the face line with free space in front of it).
 *
 * Guaranteed for an origin that moved: it is at least ORIGIN_CLEARANCE from every wall edge, outside the walls, on
 * that line (1 mm in front of the host face, so on the device's side of it), at most 3 times the thickest wall + 2 mm
 * from the probe, and has a clear line of sight to that face edge, so no wall separates it from the device's own face
 * (another room, outside the building). Null when no candidate qualifies: the cone is then empty.
 */
export function sightOrigin(level: Level, d: Device, obstacles: Segment[]): Pt | null {
  const pose = devicePose(level, d);
  if (!pose) return null;
  const probe = probeOf(pose);
  const pl = d.placement;
  if (pl.mode !== 'wall') return probe;
  const blocked = (p: Pt) => insideSegments(p, obstacles) || obstaclesWithin(p, obstacles, ORIGIN_CLEARANCE).length > 0;
  if (!blocked(probe)) return probe;
  const f = wallFrame(level, level.walls.find(w => w.id === pl.wallId)!);
  const n = pose.normal!;
  const onFace = (p: Pt) => Math.abs(dot(sub(p, pose.pt), n)) <= ON_FACE;
  const mid = ([a, b]: Segment): Pt => scale(add(a, b), 0.5);
  const faces = obstacles.filter(e =>
    onFace(e[0]) && onFace(e[1]) && dist(e[0], e[1]) > 1e-9 && !insideSegments(add(mid(e), scale(n, ORIGIN_CLEARANCE)), obstacles));
  const along = (p: Pt) => dot(sub(p, f.a), f.dir);
  const gap = ([a, b]: Segment) =>
    Math.max(0, Math.min(along(a), along(b)) - pl.offset, pl.offset - Math.max(along(a), along(b)));
  const nearest = Math.min(...faces.map(gap));
  const targets = faces.filter(e => gap(e) <= nearest + 1e-6).map(e => add(mid(e), n));
  const sees = (q: Pt) => targets.some(t => !crossesAny(q, t, obstacles));
  const cap = ORIGIN_SLIDE_THICKNESSES * Math.max(...level.walls.map(w => w.thickness)) + 2;
  const cands: number[] = []; // signed distances along f.dir
  for (const [a, b] of obstacles) {
    const e = sub(b, a), w = sub(a, probe);
    const den = cross(f.dir, e);
    if (Math.abs(den) < 1e-12) continue; // parallel
    const s = cross(w, f.dir) / den;
    if (s < -1e-9 || s > 1 + 1e-9) continue;
    const t = cross(w, e) / den, step = dist(a, b) / Math.abs(den); // 1 / sin(angle to the edge)
    cands.push(t - step, t + step);
  }
  const toMiddle = pl.offset <= f.len / 2 ? 1 : -1;
  const order = cands.filter(c => Math.abs(c) <= cap)
    .sort((x, y) => Math.abs(x) - Math.abs(y) || Math.sign(y) * toMiddle - Math.sign(x) * toMiddle);
  for (const c of order) {
    const q = add(probe, scale(f.dir, c));
    if (!blocked(q) && sees(q)) return q;
  }
  return null;
}

/** The fan's chords lie inside its radius by up to cos(step / 2): this factor makes the visibility polygon cover the cone. */
const FAN_COVER = 1 / Math.cos((FAN_STEP_DEG / 2) * (Math.PI / 180));

/**
 * A ring rounded to 1e-3 mm. The cone's apex lies on the visibility polygon's edge (the host face), and float noise
 * there (2899.999999999999 against 2900) makes polygon-clipping fail with "Unable to complete output ring".
 */
const snapRing = (ring: Pt[]): Pt[] => ring.map(p => ({ x: Math.round(p.x * 1e3) / 1e3, y: Math.round(p.y * 1e3) / 1e3 }));

/**
 * Cone clipped to what the device sees from its probe point (pt + face normal for wall devices, so sight never
 * starts inside the host wall, moved off a wall it touches at a corner: see sightOrigin; pt for free ones): walls
 * block it, openings let its medium through (CONE_MEDIUM). Unclipped when no obstacle comes within reach.
 * `obstaclesOf` may be a per-level cache of lineOfSightObstacles; it runs only for a device with a cone. Returns rings
 * (outer rings and any holes, unclosed): render with fill-rule evenodd. [] when none, or when a wall device has no
 * clear sight origin (sightOrigin gives null). If clipping still fails, the result is the visibility polygon itself:
 * wider than the cone, but never through a wall.
 */
export function clippedCone(
  level: Level, d: Device, obstaclesOf: (level: Level, medium: Medium) => Segment[] = lineOfSightObstacles,
): Pt[][] {
  const shape = coneShape(level, d);
  const medium = coneMedium(d.props.kind);
  if (!shape || !medium) return [];
  const obstacles = obstaclesOf(level, medium);
  const probe = sightOrigin(level, d, obstacles);
  if (!probe) return [];
  const reach = Math.max(...shape.map(p => dist(p, probe))) * FAN_COVER;
  const near = obstaclesWithin(probe, obstacles, reach);
  if (near.length === 0) return [shape];
  const seen = visibilityPolygon(probe, near, reach);
  let mp: ReturnType<typeof polygonClipping.intersection>;
  try {
    mp = polygonClipping.intersection(toPoly(snapRing(shape)), toPoly(snapRing(seen)));
  } catch {
    // Degenerate geometry: never crash rendering, and never draw through a wall.
    return [seen];
  }
  return mp.flatMap(poly => poly.map(fromRing));
}

function hits(level: Level, d: Device, p: Pt, tol: number): boolean {
  const pose = devicePose(level, d);
  if (!pose) return false;
  const pr = d.props;
  if (pr.kind === 'ceiling_light' && pr.shape === 'linear') {
    // Segment along the facing direction, length centred on the pose point.
    const along = Math.max(-pr.length / 2, Math.min(pr.length / 2, dot(sub(p, pose.pt), pose.dir)));
    return dist(add(pose.pt, scale(pose.dir, along)), p) <= tol;
  }
  // Round lamp: the whole drawn disc (the geometry layer has no zoom, so tol covers the icon-sized minimum).
  if (pr.kind === 'ceiling_light' && pr.shape === 'round') return dist(pose.pt, p) <= pr.diameter / 2 + tol;
  if (pr.kind !== 'equipment') return dist(pose.pt, p) <= tol;
  if (pr.shape === 'circle') return dist(pose.pt, p) <= pr.diameter / 2 + tol;
  // Rect: width along dir, depth along its normal.
  const v = sub(p, pose.pt);
  return Math.abs(dot(v, pose.dir)) <= pr.width / 2 + tol
    && Math.abs(dot(v, perpLeft(pose.dir))) <= pr.depth / 2 + tol;
}

/** Device under p, or null: icon devices first (topmost first), then equipment bodies (topmost first). */
export function deviceAt(level: Level, p: Pt, tolMm: number): Id | null {
  const devices = level.devices;
  for (const bodies of [false, true]) {
    for (let i = devices.length - 1; i >= 0; i--) {
      if ((devices[i].props.kind === 'equipment') === bodies && hits(level, devices[i], p, tolMm)) return devices[i].id;
    }
  }
  return null;
}

/** Handle length in screen pixels. */
export const HANDLE_PX = 60;

/** Direction handle of a wall light or sensor: from the pose point along its direction, 60 screen px long; null for other kinds. */
export function directionHandle(level: Level, d: Device, scaleFactor: number): { from: Pt; to: Pt } | null {
  if (!AIM_KINDS.has(d.props.kind)) return null;
  const pose = devicePose(level, d);
  if (!pose) return null;
  return { from: pose.pt, to: add(pose.pt, scale(pose.dir, HANDLE_PX / scaleFactor)) };
}

/** Wall placement with `aim` set; 0 is stored as a missing key (one representation). */
export function withAim(pl: Extract<DevicePlacement, { mode: 'wall' }>, aim: number): DevicePlacement {
  const next: typeof pl = { ...pl, aim };
  if (aim === 0) delete next.aim;
  return next;
}

/**
 * Placement with its direction set from a pointer at p: wall device aim = signed angle from the face normal
 * (clamped to -AIM_MAX..AIM_MAX, 0 stored as no aim); free device rotation 0..359. Whole degrees; snap15 rounds to 15-degree steps.
 * Unchanged when the pointer is on the device or the pose is missing.
 */
export function angleFromHandle(level: Level, d: Device, p: Pt, snap15: boolean): DevicePlacement {
  const pl = d.placement;
  const pose = devicePose(level, d);
  if (pl.mode === 'none' || !pose || (p.x === pose.pt.x && p.y === pose.pt.y)) return pl;
  const a = angleOf(sub(p, pose.pt));
  const round = (v: number) => (snap15 ? Math.round(v / 15) * 15 : Math.round(v));
  if (pl.mode === 'free') return { ...pl, rotation: wrap360(round(a)) };
  const rel = wrap180(a - angleOf(pose.normal!));
  const aim = Math.max(-AIM_MAX, Math.min(AIM_MAX, round(rel)));
  return withAim(pl, aim);
}
