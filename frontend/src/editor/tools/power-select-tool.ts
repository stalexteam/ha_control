import type { Id, Pt } from '../../model/types';
import {
  connect, moveBlock, setPin, type PortName, type PowerBlock, type PowerSchema, type WireEnd,
} from '../../model/power';
import { blockRect, hitPower, pinAt, portPlaces, snapToGrid } from '../../geometry/power';
import { dist } from '../../geometry/vec';
import { t } from '../../i18n';
import { DRAG_PX, type Preview, type Tool, type ToolContext, type ToolEvent } from './types';

/** A bus is at least this long along its long axis. */
export const BUS_MIN = 40;

type PortRef = { block: Id; port: PortName };
type Gesture =
  /** From a free port: `at` is the port, `to` the pointer; `ok` when releasing here would connect. */
  | { kind: 'wire'; from: PortRef; at: Pt; to: Pt; ok: boolean }
  /** A wired port sliding along its block's outline. */
  | { kind: 'pin'; from: PortRef }
  | { kind: 'bus-end'; id: Id; end: 'start' | 'end' }
  | { kind: 'move'; id: Id };

const isWired = (s: PowerSchema, p: PortRef): boolean =>
  s.wires.some(w => [w.from, w.to].some(e => 'block' in e && e.block === p.block && e.port === p.port));

/**
 * The bus resized by dragging one of its ends to p (snapped to the grid, at least BUS_MIN long). The wires on it keep
 * their place along the bus (clamped to the new ends). The same schema comes back when nothing changes.
 */
export function resizeBus(s: PowerSchema, id: Id, end: 'start' | 'end', p: Pt): PowerSchema {
  const b = s.blocks.find(x => x.id === id);
  if (b?.kind !== 'bus') return s;
  const horizontal = b.w >= b.h;
  const pos = horizontal ? b.x : b.y;
  const len = horizontal ? b.w : b.h;
  const v = snapToGrid(horizontal ? p.x : p.y);
  const lo = end === 'start' ? Math.min(v, pos + len - BUS_MIN) : pos;
  const hi = end === 'end' ? Math.max(v, pos + BUS_MIN) : pos + len;
  if (lo === pos && hi === pos + len) return s;
  const patch = horizontal ? { x: lo, w: hi - lo } : { y: lo, h: hi - lo };
  const fix = (e: WireEnd): WireEnd => ('bus' in e && e.bus === id
    ? { bus: id, at: Math.min(1, Math.max(0, (pos + e.at * len - lo) / (hi - lo))) } : e);
  return {
    ...s,
    blocks: s.blocks.map(x => (x.id === id ? { ...x, ...patch } as PowerBlock : x)),
    wires: s.wires.map(w => {
      const from = fix(w.from);
      const to = fix(w.to);
      return from === w.from && to === w.to ? w : { ...w, from, to };
    }),
  };
}

/**
 * Power step select tool. A press acts on what hitPower finds:
 * - a transfer chip sets that position live (no drag, nothing committed);
 * - a free port starts a wire: release on a port or a bus connects (oriented out to in), or a refused wire leaves its
 *   reason as the notice; the draft is `ok` while the pointer is over a target that would connect;
 * - a wired port slides along its block's outline and is pinned where it is released;
 * - a bus end resizes the bus along its long axis;
 * - a block or a bus body is selected, and a drag beyond DRAG_PX moves it on the grid;
 * - a wire is selected; empty space clears the selection.
 * A port clicked without a drag selects its block. One commit on `up`; Escape cancels a drag.
 */
export function createPowerSelectTool(ctx: ToolContext): Tool {
  let gesture: Gesture | null = null;
  let original: PowerSchema | null = null;
  let working: PowerSchema | null = null;
  let moved = false;
  let downPt: Pt = { x: 0, y: 0 };

  const reset = () => { gesture = null; original = null; working = null; moved = false; };

  /** The wire end under p: a port, a point of a bus, or a bus end; null for anything else. */
  function targetAt(s: PowerSchema, p: Pt): WireEnd | null {
    const hit = hitPower(s, p, ctx.tolMm(), ctx.geo());
    if (hit?.kind === 'port') return { block: hit.block, port: hit.port };
    if (hit?.kind === 'bus') return { bus: hit.id, at: hit.at };
    if (hit?.kind === 'bus-end') return { bus: hit.id, at: hit.end === 'start' ? 0 : 1 };
    return null;
  }

  function update(e: ToolEvent): void {
    const g = gesture;
    const s = original;
    if (!g || !s) return;
    // Pointer jitter is a click, not a drag.
    if (!moved && dist(e.pt, downPt) <= DRAG_PX / ctx.scale()) return;
    moved = true;
    if (g.kind === 'wire') {
      const target = targetAt(s, e.pt);
      gesture = { ...g, to: e.pt, ok: !!target && !('error' in connect(s, g.from, target)) };
      return;
    }
    if (g.kind === 'bus-end') { working = resizeBus(s, g.id, g.end, e.pt); return; }
    const b = s.blocks.find(x => x.id === (g.kind === 'pin' ? g.from.block : g.id));
    if (!b) return;
    if (g.kind === 'pin') {
      working = setPin(s, b.id, g.from.port, pinAt(blockRect(b, ctx.geo(), s), e.pt));
      return;
    }
    const x = snapToGrid(b.x + e.pt.x - downPt.x);
    const y = snapToGrid(b.y + e.pt.y - downPt.y);
    working = x === b.x && y === b.y ? s : moveBlock(s, b.id, x, y);
  }

  function finishWire(s: PowerSchema, from: PortRef, p: Pt): void {
    const target = targetAt(s, p);
    if (!target) return;
    const r = connect(s, from, target);
    if ('error' in r) { ctx.notify(t(`power.err.${r.error}`)); return; }
    ctx.commitPower(r.schema);
    ctx.notify(null);
  }

  return {
    id: 'power-select',
    down(e: ToolEvent) {
      reset();
      downPt = e.pt;
      const s = ctx.power();
      const hit = hitPower(s, e.pt, ctx.tolMm(), ctx.geo());
      if (!hit) { ctx.select(null); return; }
      if (hit.kind === 'chip') { ctx.setPosition(hit.block, hit.position); return; }
      if (hit.kind === 'wire') { ctx.select({ kind: 'powerWire', id: hit.id }); return; }
      original = working = s;
      if (hit.kind === 'port') {
        const from = { block: hit.block, port: hit.port };
        if (isWired(s, from)) { gesture = { kind: 'pin', from }; return; }
        const b = s.blocks.find(x => x.id === hit.block)!;
        const at = portPlaces(s, b, ctx.geo()).find(p => p.name === hit.port)!.pt;
        gesture = { kind: 'wire', from, at, to: at, ok: false };
        return;
      }
      ctx.select({ kind: 'powerBlock', id: hit.id });
      gesture = hit.kind === 'bus-end' ? { kind: 'bus-end', id: hit.id, end: hit.end } : { kind: 'move', id: hit.id };
    },
    move(e: ToolEvent) { update(e); },
    up(e: ToolEvent) {
      update(e);
      const g = gesture, s = original, next = working, wasMoved = moved;
      reset();
      if (!g || !s) return;
      if (!wasMoved) {
        if (g.kind === 'wire' || g.kind === 'pin') ctx.select({ kind: 'powerBlock', id: g.from.block });
        return;
      }
      if (g.kind === 'wire') finishWire(s, g.from, e.pt);
      else if (next && next !== s) ctx.commitPower(next);
    },
    key(key) {
      if (key === 'Escape' && gesture) { reset(); return true; }
      return false;
    },
    preview(): Preview {
      const g = gesture;
      if (!g) return {};
      if (g.kind === 'wire') return { wireDraft: { from: g.at, to: g.to, ok: g.ok } };
      return working ? { power: working } : {};
    },
    cancel() { reset(); },
  };
}
