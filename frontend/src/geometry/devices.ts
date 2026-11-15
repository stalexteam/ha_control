import polygonClipping, { type Polygon } from 'polygon-clipping';
import type { Device, Id, Level, Pt } from '../model/types';
import { add, dist, dot, perpLeft, scale, sub } from './vec';
import { wallFrame } from './walls';
import { outlineFromHoles, roomHoles } from './rooms';

/** pt: device centre; dir: unit facing direction (a wall device's face normal turned by its aim); normal: the wall face normal, wall devices only. */
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

/**
 * Wall device: axis point at offset, moved onto the face of its side; dir = that face's outward normal
 * (left = perpLeft(wall dir)). Free device: (x, y) facing (cos r, -sin r). Null when the host wall is missing.
 */
export function devicePose(level: Level, d: Device): DevicePose | null {
  const p = d.placement;
  if (p.mode === 'free') return { pt: { x: p.x, y: p.y }, dir: dirAt(p.rotation) };
  const wall = level.walls.find(w => w.id === p.wallId);
  if (!wall) return null;
  let f;
  try { f = wallFrame(level, wall); } catch { return null; } // a node is missing
  const L = perpLeft(f.dir);
  const n = p.side === 'left' ? L : scale(L, -1);
  const off = p.side === 'left' ? f.leftOff : f.rightOff;
  return { pt: add(add(f.a, scale(f.dir, p.offset)), scale(n, off)), dir: p.aim ? dirAt(angleOf(n) + p.aim) : n, normal: n };
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

/** Unclipped cone / zone / light pool polygon, or null when the device has none. */
export function coneShape(level: Level, d: Device): Pt[] | null {
  const pr = d.props;
  if (pr.kind !== 'wall_light' && pr.kind !== 'motion_sensor' && pr.kind !== 'ceiling_light') return null;
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

const toPoly = (ring: Pt[]): Polygon => [ring.map(p => [p.x, p.y] as [number, number])];

/**
 * Cone clipped to the room the device is in (smallest room hole containing the probe point:
 * pt + face normal for wall devices, pt for free ones). Unclipped when outside every room.
 * `holes` may be passed pre-computed (roomHoles(level)) to avoid recomputing per device.
 * Returns rings (outer rings and any holes, unclosed): render with fill-rule evenodd. [] when none.
 */
export function clippedCone(level: Level, d: Device, holes: Pt[][] = roomHoles(level)): Pt[][] {
  const shape = coneShape(level, d);
  if (!shape) return [];
  const pose = devicePose(level, d)!;
  const probe = pose.normal ? add(pose.pt, pose.normal) : pose.pt; // the face normal, not the aim, so the room does not change with aim
  const room = outlineFromHoles(holes, probe);
  if (!room) return [shape];
  let mp: ReturnType<typeof polygonClipping.intersection>;
  try {
    mp = polygonClipping.intersection(toPoly(shape), toPoly(room));
  } catch {
    // Degenerate geometry: never crash rendering; fall back to the unclipped shape.
    return [shape];
  }
  return mp.flatMap(poly => poly.map(r => {
    const pts = r.map(([x, y]) => ({ x, y }));
    const f = pts[0], l = pts[pts.length - 1];
    if (pts.length > 1 && f.x === l.x && f.y === l.y) pts.pop();
    return pts;
  }));
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
  if (pr.kind !== 'equipment') return dist(pose.pt, p) <= tol;
  if (pr.shape === 'circle') return dist(pose.pt, p) <= pr.diameter / 2 + tol;
  // Rect: width along dir, depth along its normal.
  const v = sub(p, pose.pt);
  return Math.abs(dot(v, pose.dir)) <= pr.width / 2 + tol
    && Math.abs(dot(v, perpLeft(pose.dir))) <= pr.depth / 2 + tol;
}

/** Device under p, or null: icon devices first (topmost first), then equipment bodies (topmost first). */
export function deviceAt(level: Level, p: Pt, tolMm: number): Id | null {
  const devices = level.devices ?? [];
  for (const bodies of [false, true]) {
    for (let i = devices.length - 1; i >= 0; i--) {
      if ((devices[i].props.kind === 'equipment') === bodies && hits(level, devices[i], p, tolMm)) return devices[i].id;
    }
  }
  return null;
}
