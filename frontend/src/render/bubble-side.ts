import type { Device, Level, Pt } from '../model/types';
import type { DevicePose } from '../geometry/devices';
import { distToSegment, polygonArea } from '../geometry/vec';
import { zoneContains, zoneOutline } from '../geometry/zones';

export type BubbleSide = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

/**
 * Top-left corner of a bubble stack of `stack` (w x h) on `side` of the symbol centre, relative to that centre; `gap`
 * is the distance from the centre to the stack's near edge (on both axes for a diagonal side). The stack is centred
 * on the side's axis.
 */
export function stackOrigin(side: BubbleSide, stack: { w: number; h: number }, gap: number): Pt {
  switch (side) {
    case 'up': return { x: -stack.w / 2, y: -gap - stack.h };
    case 'down': return { x: -stack.w / 2, y: gap };
    case 'left': return { x: -gap - stack.w, y: -stack.h / 2 };
    case 'right': return { x: gap, y: -stack.h / 2 };
    case 'up-left': return { x: -gap - stack.w, y: -gap - stack.h };
    case 'up-right': return { x: gap, y: -gap - stack.h };
    case 'down-left': return { x: -gap - stack.w, y: gap };
    case 'down-right': return { x: gap, y: gap };
  }
}

/** The axis side a direction points to (Y down: +y is below). */
function snap(dir: Pt): BubbleSide {
  return Math.abs(dir.x) >= Math.abs(dir.y) ? (dir.x >= 0 ? 'right' : 'left') : (dir.y >= 0 ? 'down' : 'up');
}

/** Sample points on the boundary of a rectangle: corners and edge midpoints. */
function samples(x: number, y: number, w: number, h: number): Pt[] {
  const xs = [x, x + w / 2, x + w], ys = [y, y + h / 2, y + h];
  const out: Pt[] = [];
  for (const sx of xs) for (const sy of ys) if (sx !== xs[1] || sy !== ys[1]) out.push({ x: sx, y: sy });
  return out;
}

/** Distance from the stack to the outline edges when the whole stack lies inside the outline, else null. */
function clearance(outline: Pt[], x: number, y: number, w: number, h: number): number | null {
  const pts = samples(x, y, w, h);
  if (!pts.every(p => zoneContains(outline, p))) return null;
  // A concave notch can poke into the rectangle without any sample crossing it.
  if (outline.some(v => v.x > x && v.x < x + w && v.y > y && v.y < y + h)) return null;
  let min = Infinity;
  for (const p of pts) {
    for (let i = 0; i < outline.length; i++) min = Math.min(min, distToSegment(p, outline[i], outline[(i + 1) % outline.length]));
  }
  return min;
}

/**
 * The side of the device (right, left, below, above; world units) where its bubble stack goes: inside the smallest
 * zone containing the device. A wall device: into the room (face normal snapped to an axis), else a diagonal on the room
 * side, else along the wall, else the remaining side. A free device: right / left, then the diagonals, then below /
 * above (each step: the side farther from the zone edges, ties in the listed order). When none fits (or there is no zone): a wall device into the room, a free one right.
 * `stack` is the stack size and `gap` the distance from the symbol centre to the stack, both in world units.
 */
export function bubbleSide(level: Level, d: Device, pose: DevicePose, stack: { w: number; h: number }, gap: number): BubbleSide {
  const wall = d.placement.mode === 'wall';
  const fallback: BubbleSide = wall ? snap(pose.normal ?? pose.dir) : 'right';
  let outline: Pt[] | null = null;
  let area = Infinity;
  for (const z of level.zones) {
    const o = zoneOutline(level, z);
    if (o.length < 3 || !zoneContains(o, pose.pt)) continue;
    const a = Math.abs(polygonArea(o));
    if (a < area) { area = a; outline = o; }
  }
  if (!outline) return fallback;
  const room = (side: BubbleSide): number | null => {
    const o = stackOrigin(side, stack, gap);
    return clearance(outline!, pose.pt.x + o.x, pose.pt.y + o.y, stack.w, stack.h);
  };
  const farther = (pair: BubbleSide[]): BubbleSide | null => {
    let best: BubbleSide | null = null;
    let bestClear = -1;
    for (const s of pair) {
      const c = room(s);
      if (c !== null && c > bestClear) { best = s; bestClear = c; }
    }
    return best;
  };
  const DIAGONALS: BubbleSide[] = ['down-right', 'down-left', 'up-right', 'up-left'];
  if (wall) {
    // Into the room, then the two diagonals on the room side, then along the wall, then the remaining side.
    const vertical = fallback === 'up' || fallback === 'down';
    const opposite: BubbleSide = { up: 'down', down: 'up', left: 'right', right: 'left' }[fallback as 'up' | 'down' | 'left' | 'right'] as BubbleSide;
    if (room(fallback) !== null) return fallback;
    const roomSide = DIAGONALS.filter(x => (vertical ? x.startsWith(fallback) : x.endsWith(fallback)));
    return farther(roomSide) ?? farther(vertical ? ['right', 'left'] : ['down', 'up'])
      ?? (room(opposite) !== null ? opposite : fallback);
  }
  // Free: right / left (a tie goes right), then the diagonals, then below / above.
  return farther(['right', 'left']) ?? farther(DIAGONALS) ?? farther(['down', 'up']) ?? fallback;
}
