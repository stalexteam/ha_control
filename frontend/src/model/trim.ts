import { newId } from './ids';
import type { Id, Level, PlanNode, Pt, Wall } from './types';
import { clone, deleteWall, dropOrphans, finalize, hostPoint } from './ops';
import { lostVertex } from './zones';
import { findNode, nodePos } from '../geometry/walls';
import { dist, dot, lineIntersect, norm, projectT, sub } from '../geometry/vec';

const END_EPS = 1; // mm: a crossing this close to the crossing wall's end node is at that node
const INSIDE_EPS = 1e-6; // mm: cuts lie strictly inside the trimmed wall, its own ends excluded

/** Where the trimmed wall can be cut, at `t` along it from node A: a T-node hosted on it, or a crossing wall's axis. */
type Cut = { t: number; nodeId: Id } | { t: number; wall: Wall; pt: Pt };

function cutsOf(level: Level, w: Wall, a: Pt, dir: Pt, len: number): Cut[] {
  const inside = (t: number) => t > INSIDE_EPS && t < len - INSIDE_EPS;
  const hostedHere = new Set(level.nodes.filter(n => n.host?.wallId === w.id).map(n => n.id));
  const cuts: Cut[] = [];
  for (const id of hostedHere) {
    const t = findNode(level, id).host!.offset;
    if (inside(t)) cuts.push({ t, nodeId: id });
  }
  for (const v of level.walls) {
    if (v.id === w.id) continue;
    // A wall sharing an end with w meets it only there; one ending at a T-node on w is cut by that node.
    if ([v.a, v.b].some(id => id === w.a || id === w.b || hostedHere.has(id))) continue;
    const p = nodePos(level, v.a), q = nodePos(level, v.b);
    const lv = dist(p, q);
    const x = lv === 0 ? null : lineIntersect(a, dir, p, sub(q, p));
    if (!x) continue;
    const s = projectT(x, p, q) * lv;
    if (s < -END_EPS || s > lv + END_EPS) continue;
    const t = dot(sub(x, a), dir);
    if (inside(t)) cuts.push({ t, wall: v, pt: x });
  }
  return cuts;
}

/** Cut nearest to `tc` among `cuts`; at equal distance a hosted T-node wins over a crossing. */
function nearest(cuts: Cut[], tc: number): Cut | undefined {
  let best: Cut | undefined;
  for (const c of cuts) {
    const d = Math.abs(c.t - tc), bd = best ? Math.abs(best.t - tc) : Infinity;
    if (d < bd || (d === bd && 'nodeId' in c)) best = c;
  }
  return best;
}

/**
 * Mutating on `out`: the node a new wall end at `c` uses. A hosted T-node is reused and stops being hosted; a
 * crossing reuses the crossing wall's end node within 1 mm, otherwise gets a new node hosted on that wall.
 */
function endNode(out: Level, c: Cut): Id {
  if ('nodeId' in c) {
    delete findNode(out, c.nodeId).host;
    return c.nodeId;
  }
  for (const id of [c.wall.a, c.wall.b]) if (dist(nodePos(out, id), c.pt) <= END_EPS) return id;
  const { pt, offset } = hostPoint(out, c.wall, c.pt);
  const node: PlanNode = { id: newId(), x: pt.x, y: pt.y, host: { wallId: c.wall.id, offset } };
  out.nodes.push(node);
  return node.id;
}

/**
 * Removes the piece of a wall between the nearest intersections on each side of `at` (T-nodes hosted on it and
 * crossings with other walls' axes, its own ends excluded). Both sides: two walls, the first keeps the id. One
 * side: the wall is shortened. None: the wall is deleted. Openings, wall devices, T-nodes and zone wall vertices on a
 * kept part move with it; items centred on the cut piece are deleted (T-nodes there are only unhosted, zone vertices
 * there become lost free vertices at their cached position). Pure; the same level when the wall is unknown.
 */
export function trimWall(level: Level, wallId: Id, at: Pt): Level {
  const w = level.walls.find(x => x.id === wallId);
  if (!w) return level;
  const a = nodePos(level, w.a), b = nodePos(level, w.b);
  const len = dist(a, b);
  const dir = norm(sub(b, a));
  const tc = dot(sub(at, a), dir);
  const cuts = cutsOf(level, w, a, dir, len);
  const left = nearest(cuts.filter(c => c.t < tc), tc);
  const right = nearest(cuts.filter(c => c.t > tc), tc);
  if (!left && !right) return deleteWall(level, wallId);

  const out = clone(level);
  const ow = out.walls.find(x => x.id === wallId)!;
  let second = wallId; // the wall of the part after the cut piece
  let shift = 0; // distance from node A to the start of that part
  if (right) {
    const r = endNode(out, right);
    shift = dot(sub(nodePos(out, r), a), dir);
    if (left) {
      const w2: Wall = { ...ow, id: newId(), a: r };
      out.walls.push(w2);
      second = w2.id;
    } else {
      ow.a = r;
    }
  }
  if (left) ow.b = endNode(out, left);

  /** Mutating: re-homes an item of the trimmed wall centred at `c`; false when it lies on the cut piece. */
  const keep = (h: { wallId: Id; offset: number }, c: number): boolean => {
    if (h.wallId !== wallId) return true;
    if (left && c <= left.t) return true;
    if (!right || c < right.t) return false;
    h.wallId = second;
    h.offset -= shift;
    return true;
  };
  out.openings = out.openings.filter(o => keep(o, o.offset + o.width / 2));
  out.devices = out.devices.filter(d => d.placement.mode !== 'wall' || keep(d.placement, d.placement.offset));
  for (const n of out.nodes) if (n.host && !keep(n.host, n.host.offset)) delete n.host;
  for (const z of out.zones) {
    const s = z.shape;
    if (s.kind === 'polygon') s.vertices = s.vertices.map(v => (v.kind !== 'wall' || keep(v, v.offset) ? v : lostVertex(v)));
  }
  dropOrphans(out);
  return finalize(out, level);
}
