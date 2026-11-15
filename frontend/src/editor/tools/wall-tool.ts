import type { Id, Pt } from '../../model/types';
import { addWallSegment, nodePos, type Endpoint } from '../../model/ops';
import { pointAlong, snap, type SnapResult } from '../../geometry/snap';
import { dist } from '../../geometry/vec';
import { parseWhole } from '../../geometry/parse';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

const clean = (v: number): number => Math.round(v * 1000) / 1000 + 0;

/** Wall chain tool: DOM-free state machine. */
export function createWallTool(ctx: ToolContext): Tool {
  let last: Endpoint | null = null;
  let lastPt: Pt | null = null;
  let chainStart: Id | null = null;
  let cursor: Pt = { x: 0, y: 0 };
  let shift = false;
  let lastDir: Pt | null = null; // last non-degenerate direction, fallback for typed length
  let lengthBuf = '';
  let angleBuf = '';
  let field: 'length' | 'angle' = 'length';

  const clearBuffers = () => { lengthBuf = ''; angleBuf = ''; field = 'length'; };
  const reset = () => { last = null; lastPt = null; chainStart = null; lastDir = null; clearBuffers(); };

  const snapAt = (pt: Pt, ortho: boolean): SnapResult =>
    snap(ctx.level(), pt, { tolMm: ctx.tolMm(), grid: ctx.grid(), from: lastPt ?? undefined, ortho: ortho && lastPt !== null });

  /** Resolves where the current segment ends, honouring typed length/angle. */
  function target(): { pt: Pt; endpoint: Endpoint; snap: SnapResult } | null {
    if (!lastPt) return null;
    const s = snapAt(cursor, shift);
    const len = parseWhole(lengthBuf, { min: 1 });
    // Angle in degrees, 0 = +X, counter-clockwise on screen (Y down); digits only, 0 allowed.
    const ang = parseWhole(angleBuf);
    if (len === null && ang === null) return { pt: s.pt, endpoint: s.endpoint, snap: s };
    const length = len ?? dist(lastPt, s.pt);
    let towards = s.pt;
    if (ang === null && dist(lastPt, s.pt) < 1) {
      // Cursor sits on the last point: reuse the previous direction, default +X.
      const d = lastDir ?? { x: 1, y: 0 };
      towards = { x: lastPt.x + d.x, y: lastPt.y + d.y };
    }
    if (ang !== null) {
      const r = (ang * Math.PI) / 180;
      towards = { x: lastPt.x + Math.cos(r), y: lastPt.y - Math.sin(r) };
    }
    const raw = pointAlong(lastPt, towards, length);
    const pt = { x: clean(raw.x), y: clean(raw.y) };
    // A typed target within 1 mm of an existing node reuses that node (closes chains, no duplicates).
    const hit = ctx.level().nodes.find(n => Math.hypot(n.x - pt.x, n.y - pt.y) < 1);
    if (hit) return { pt: { x: hit.x, y: hit.y }, endpoint: { kind: 'node', nodeId: hit.id }, snap: s };
    return { pt, endpoint: { kind: 'free', pt }, snap: s };
  }

  function commitSegment(): void {
    const t = target();
    if (!last || !t) return;
    const res = addWallSegment(ctx.level(), last, t.endpoint, ctx.wallProps());
    if (res.wallId === null || res.endNodeId === null) return; // zero segment: chain stays
    ctx.commit(res.level);
    const wall = res.level.walls.find(w => w.id === res.wallId)!;
    if (chainStart === null) chainStart = wall.a;
    const closed = res.endNodeId === chainStart;
    const prev = lastPt!;
    const np = nodePos(res.level, res.endNodeId);
    const dl = dist(prev, np);
    if (dl > 0) lastDir = { x: (np.x - prev.x) / dl, y: (np.y - prev.y) / dl };
    clearBuffers();
    if (closed) { reset(); return; }
    last = { kind: 'node', nodeId: res.endNodeId };
    lastPt = nodePos(res.level, res.endNodeId);
  }

  return {
    id: 'wall',
    down(e: ToolEvent) {
      cursor = e.pt; shift = e.shift;
      if (!last) {
        const s = snapAt(e.pt, false);
        last = s.endpoint; lastPt = s.pt;
        return;
      }
      commitSegment();
    },
    move(e: ToolEvent) { cursor = e.pt; shift = e.shift; },
    up() {},
    key(key, e) {
      shift = e.shift; // Shift pressed/released without moving the mouse
      if (!last) return false;
      if (/^[0-9]$/.test(key) || key === ' ') {
        if (field === 'length') lengthBuf += key; else angleBuf += key;
        return true;
      }
      if (key === 'Backspace') {
        if (field === 'length') lengthBuf = lengthBuf.slice(0, -1); else angleBuf = angleBuf.slice(0, -1);
        return true;
      }
      if (key === 'Tab') { field = field === 'length' ? 'angle' : 'length'; return true; }
      if (key === 'Enter') { commitSegment(); return true; }
      if (key === 'Escape') {
        if (lengthBuf !== '' || angleBuf !== '') clearBuffers(); else reset();
        return true;
      }
      return false;
    },
    preview(): Preview {
      if (!lastPt) return { snap: snap(ctx.level(), cursor, { tolMm: ctx.tolMm(), grid: ctx.grid(), ortho: false }) };
      const t = target()!;
      return {
        walls: [{ a: lastPt, b: t.pt, props: ctx.wallProps() }],
        snap: t.snap,
        tracker: { length: lengthBuf, angle: angleBuf, field, at: t.pt },
        orthoFrom: shift ? lastPt : undefined,
        anchor: lastPt,
      };
    },
    cancel() { reset(); },
  };
}
