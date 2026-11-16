import polygonClipping, { type Polygon, type Ring } from 'polygon-clipping';
import type { Baseline, Id, Level, Opening, PlanNode, Pt, Wall } from '../model/types';
import { add, cross, dist, dot, lineIntersect, norm, perpLeft, polygonArea, scale, sub } from './vec';

export interface WallFrame { a: Pt; b: Pt; dir: Pt; len: number; leftOff: number; rightOff: number }

const MITER_LIMIT = 3; // x max thickness from the node
const AREA_EPS = 1e-6;

/** Node by id; throws when it is missing. */
export function findNode(level: Level, id: Id): PlanNode {
  const n = level.nodes.find(x => x.id === id);
  if (!n) throw new Error(`node not found: ${id}`);
  return n;
}

/** Position of a node (a copy); throws when it is missing. */
export function nodePos(level: Level, id: Id): Pt {
  const n = findNode(level, id);
  return { x: n.x, y: n.y };
}

/** Axis length of a wall, or null when the wall (or a node) is missing. */
export function wallLen(level: Level, wallId: Id): number | null {
  const w = level.walls.find(x => x.id === wallId);
  if (!w) return null;
  const a = level.nodes.find(n => n.id === w.a);
  const b = level.nodes.find(n => n.id === w.b);
  if (!a || !b) return null;
  return dist(a, b);
}

/** Frame of a wall body from a to b; leftOff/rightOff: distance from the A->B axis to the left/right face. */
export function segmentFrame(a: Pt, b: Pt, thickness: number, baseline: Baseline): WallFrame {
  const t = thickness;
  const [leftOff, rightOff] = baseline === 'left' ? [0, t] : baseline === 'right' ? [t, 0] : [t / 2, t / 2];
  return { a, b, dir: norm(sub(b, a)), len: dist(a, b), leftOff, rightOff };
}

/** Frame of a wall of the level (see segmentFrame); throws when a node is missing. */
export function wallFrame(level: Level, wall: Wall): WallFrame {
  return segmentFrame(nodePos(level, wall.a), nodePos(level, wall.b), wall.thickness, wall.baseline);
}

/** p in the wall's frame: t along the axis from A, side across it (positive = left face, i.e. perpLeft(dir)). */
export function wallLocal(f: WallFrame, p: Pt): { t: number; side: number } {
  const rel = sub(p, f.a);
  return { t: dot(rel, f.dir), side: dot(rel, perpLeft(f.dir)) };
}

type CornerKey = 'al' | 'ar' | 'bl' | 'br';
/** extraA/extraB: extra end points, ordered from the end's left corner to its right corner. */
interface Body { wall: Wall; f: WallFrame; c: Record<CornerKey, Pt>; extraA?: Pt[]; extraB?: Pt[] }

/** One wall end seen from its node: u points away from the node; faces named relative to u. */
interface End {
  body: Body; end: 'a' | 'b'; p: Pt; u: Pt;
  offL: number; offR: number; leftKey: CornerKey; rightKey: CornerKey; far: Pt;
}

function endOf(body: Body, end: 'a' | 'b'): End {
  const { f } = body;
  return end === 'a'
    ? { body, end, p: f.a, u: f.dir, offL: f.leftOff, offR: f.rightOff, leftKey: 'al', rightKey: 'ar', far: f.b }
    : { body, end, p: f.b, u: scale(f.dir, -1), offL: f.rightOff, offR: f.leftOff, leftKey: 'br', rightKey: 'bl', far: f.a };
}

const leftFace = (e: End): Pt => add(e.p, scale(perpLeft(e.u), e.offL));
const rightFace = (e: End): Pt => sub(e.p, scale(perpLeft(e.u), e.offR));

function within(p: Pt | null, n: Pt, limit: number): p is Pt {
  return p !== null && dist(p, n) <= limit;
}

function buildBodies(level: Level): Body[] {
  const bodies: Body[] = [];
  for (const wall of level.walls) {
    const f = wallFrame(level, wall);
    if (f.len < 1e-9) continue;
    const L = perpLeft(f.dir);
    bodies.push({
      wall, f, c: {
        al: add(f.a, scale(L, f.leftOff)), ar: sub(f.a, scale(L, f.rightOff)),
        bl: add(f.b, scale(L, f.leftOff)), br: sub(f.b, scale(L, f.rightOff)),
      },
    });
  }
  return bodies;
}

/** Trim each end at a T-node by the host face that looks toward the wall. */
function trimAtHost(ends: End[], host: Body): void {
  const hf = host.f;
  const L = perpLeft(hf.dir);
  for (const e of ends) {
    if (e.body === host) continue;
    const side = dot(sub(e.far, hf.a), L);
    const facePt = side >= 0 ? add(hf.a, scale(L, hf.leftOff)) : sub(hf.a, scale(L, hf.rightOff));
    const limit = MITER_LIMIT * Math.max(e.body.wall.thickness, host.wall.thickness);
    const l = lineIntersect(leftFace(e), e.u, facePt, hf.dir);
    const r = lineIntersect(rightFace(e), e.u, facePt, hf.dir);
    if (within(l, e.p, limit)) e.body.c[e.leftKey] = l;
    if (within(r, e.p, limit)) e.body.c[e.rightKey] = r;
  }
}

/** Miter neighbouring walls (sorted by angle) at a regular node. */
function miter(ends: End[], n: Pt): void {
  ends.sort((x, y) => Math.atan2(x.u.y, x.u.x) - Math.atan2(y.u.y, y.u.x));
  const limit = MITER_LIMIT * Math.max(...ends.map(e => e.body.wall.thickness));
  for (let i = 0; i < ends.length; i++) {
    // Increasing atan2 turns toward -perpLeft(u), so Wi's right face looks at Wi+1's left face.
    const wi = ends[i], wj = ends[(i + 1) % ends.length];
    const p = lineIntersect(rightFace(wi), wi.u, leftFace(wj), wj.u);
    if (!within(p, n, limit)) continue;
    wi.body.c[wi.rightKey] = p;
    wj.body.c[wj.leftKey] = p;
  }
  if (ends.length < 3) return;
  const done = stepAcrossParallel(ends, n, limit);
  // Fill the concave gap: add the node point when it lies outside the end edge (opposite the wall body).
  for (const e of ends) {
    if (done.has(e)) continue;
    const lc = e.body.c[e.leftKey], rc = e.body.c[e.rightKey];
    const edge = sub(rc, lc);
    const sn = cross(edge, sub(n, lc)), sf = cross(edge, sub(e.far, lc));
    if (sn * sf < 0) setExtra(e, [n]);
  }
}

function setExtra(e: End, pts: Pt[]): void {
  if (e.end === 'a') e.body.extraA = pts; else e.body.extraB = pts;
}

/**
 * A 180-degree gap between collinear-opposite ends (k >= 3): the faces are parallel, so there is no miter.
 * When the faces are offset, the wider end's face runs on past the node to the far face of the next wall
 * beyond the narrower end, the narrower end stops on that same face line, and the wider end takes the
 * whole hub (node, narrower end edge, step) so the narrower one never pokes into the thick body.
 */
function stepAcrossParallel(ends: End[], n: Pt, limit: number): Set<End> {
  const k = ends.length;
  for (let i = 0; i < k; i++) {
    const wi = ends[i], wj = ends[(i + 1) % k];
    if (Math.abs(cross(wi.u, wj.u)) > 1e-9 || dot(wi.u, wj.u) > 0) continue;
    const d = wi.offR - wj.offL;
    if (Math.abs(d) < 1e-9) continue;
    if (d > 0) {
      // wi wider: its right face meets the left face of wk, the wall after wj.
      const wk = ends[(i + 2) % k];
      const P = lineIntersect(rightFace(wi), wi.u, leftFace(wk), wk.u);
      const Q = lineIntersect(leftFace(wj), wj.u, leftFace(wk), wk.u);
      if (!within(P, n, limit) || !within(Q, n, limit)) continue;
      const jr = wj.body.c[wj.rightKey];
      wi.body.c[wi.rightKey] = P;
      wj.body.c[wj.leftKey] = Q;
      setExtra(wi, [n, jr, Q]);
    } else {
      // wj wider: its left face meets the right face of wh, the wall before wi.
      const wh = ends[(i - 1 + k) % k];
      const Q = lineIntersect(leftFace(wj), wj.u, rightFace(wh), wh.u);
      const P = lineIntersect(rightFace(wi), wi.u, rightFace(wh), wh.u);
      if (!within(P, n, limit) || !within(Q, n, limit)) continue;
      const il = wi.body.c[wi.leftKey];
      wi.body.c[wi.rightKey] = P;
      wj.body.c[wj.leftKey] = Q;
      setExtra(wj, [P, il, n]);
    }
    return new Set([wi, wj]);
  }
  return new Set();
}

function joinedBodies(level: Level): Body[] {
  const bodies = buildBodies(level);
  const byId = new Map(bodies.map(b => [b.wall.id, b]));
  for (const node of level.nodes) {
    const ends: End[] = [];
    for (const b of bodies) {
      if (b.wall.a === node.id) ends.push(endOf(b, 'a'));
      if (b.wall.b === node.id) ends.push(endOf(b, 'b'));
    }
    if (ends.length === 0) continue;
    const host = node.host ? byId.get(node.host.wallId) : undefined;
    if (host) trimAtHost(ends, host);
    else if (ends.length >= 2) miter(ends, { x: node.x, y: node.y });
  }
  return bodies;
}

function ring(b: Body): Pt[] {
  return [b.c.ar, b.c.br, ...(b.extraB ?? []), b.c.bl, b.c.al, ...(b.extraA ?? [])];
}

/** Wall contours with joins, no opening cut-outs. */
export function wallOutlines(level: Level): Map<Id, Pt[]> {
  return new Map(joinedBodies(level).map(b => [b.wall.id, ring(b)]));
}

/** Sutherland–Hodgman against the half-plane where g(p) >= 0 (g affine). */
function clipHalf(poly: Pt[], g: (p: Pt) => number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const gp = g(p), gq = g(q);
    if (gp >= 0) out.push(p);
    if ((gp >= 0) !== (gq >= 0)) out.push(add(p, scale(sub(q, p), gp / (gp - gq))));
  }
  return out;
}

/**
 * Wall contours split by the wall's valid openings that `cut` accepts (default: every valid opening);
 * an invalid opening never cuts.
 */
export function wallPieces(level: Level, cut: (o: Opening) => boolean = () => true): Map<Id, Pt[][]> {
  const res = new Map<Id, Pt[][]>();
  for (const b of joinedBodies(level)) {
    const contour = ring(b);
    const ops = level.openings
      .filter(o => o.wallId === b.wall.id && !o.invalid && cut(o))
      .sort((x, y) => x.offset - y.offset);
    const t = (p: Pt) => dot(sub(p, b.f.a), b.f.dir);
    const intervals: [number, number][] = [];
    let lo = -Infinity;
    for (const o of ops) {
      intervals.push([lo, o.offset]);
      lo = Math.max(lo, o.offset + o.width);
    }
    intervals.push([lo, Infinity]);
    const pieces: Pt[][] = [];
    for (const [l, h] of intervals) {
      if (h <= l) continue;
      let poly = contour;
      if (l > -Infinity) poly = clipHalf(poly, p => t(p) - l);
      if (h < Infinity) poly = clipHalf(poly, p => h - t(p));
      if (poly.length >= 3 && Math.abs(polygonArea(poly)) > AREA_EPS) pieces.push(poly);
    }
    res.set(b.wall.id, pieces);
  }
  return res;
}

/** A ring as a polygon-clipping polygon (outer ring only). */
export const toPoly = (ring: Pt[]): Polygon => [ring.map(p => [p.x, p.y] as [number, number])];

/** A polygon-clipping ring as points, without the closing duplicate. */
export function fromRing(r: Ring): Pt[] {
  const pts = r.map(([x, y]) => ({ x, y }));
  const f = pts[0], l = pts[pts.length - 1];
  if (pts.length > 1 && f.x === l.x && f.y === l.y) pts.pop();
  return pts;
}

/** Union of all wall contours (or pieces). MultiPolygon: [polygon][ring][pt], rings not closed. */
export function wallsUnion(level: Level, cutOpenings: boolean): Pt[][][] {
  return unionOf(cutOpenings ? [...wallPieces(level).values()].flat() : [...wallOutlines(level).values()]);
}

/** Union of wall polygons (contours or pieces). MultiPolygon: [polygon][ring][pt], rings not closed. */
export function unionOf(polys: Pt[][]): Pt[][][] {
  const geoms: Polygon[] = polys.map(toPoly);
  if (geoms.length === 0) return [];
  let mp: ReturnType<typeof polygonClipping.union>;
  try {
    mp = polygonClipping.union(geoms[0], ...geoms.slice(1));
  } catch {
    // Degenerate geometry: never crash rendering; no holes means no walls zone outlines are detected.
    return polys.map(r => [r.map(p => ({ x: p.x, y: p.y }))]);
  }
  return mp.map(poly => poly.map(fromRing));
}
