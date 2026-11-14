import type { Id, Pt } from '../../model/types';
import { OPENING_DEFAULT_WIDTH } from '../../model/types';
import { addOpening } from '../../model/openings';
import { wallFrame } from '../../geometry/walls';
import { add, dot, scale, sub } from '../../geometry/vec';
import { wallAt } from '../hit';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** Door / window / opening tool: places an opening centred at the cursor's projection onto a wall axis. */
export function createOpeningTool(ctx: ToolContext, kind: 'door' | 'window' | 'opening'): Tool {
  let cursor: Pt | null = null;
  const width = OPENING_DEFAULT_WIDTH[kind];

  function target(): { wallId: Id; center: number; pt: Pt } | null {
    if (!cursor) return null;
    const level = ctx.level();
    const wallId = wallAt(level, cursor, ctx.tolMm());
    if (!wallId) return null;
    const f = wallFrame(level, level.walls.find(w => w.id === wallId)!);
    const center = dot(sub(cursor, f.a), f.dir);
    return { wallId, center, pt: add(f.a, scale(f.dir, center)) };
  }

  return {
    id: kind,
    down(e: ToolEvent) {
      cursor = e.pt;
      const tg = target();
      if (!tg) return;
      const res = addOpening(ctx.level(), tg.wallId, kind, tg.center);
      if (res.openingId === null) return; // overlap / does not fit: nothing happens
      ctx.commit(res.level);
    },
    move(e: ToolEvent) { cursor = e.pt; },
    up() {},
    key() { return false; },
    preview(): Preview {
      const tg = target();
      if (!tg) return {};
      const probe = addOpening(ctx.level(), tg.wallId, kind, tg.center);
      return {
        opening: { wallId: tg.wallId, offset: tg.center - width / 2, width, kind, invalid: probe.openingId === null },
        snap: { pt: tg.pt, kind: 'wall', endpoint: { kind: 'wall', wallId: tg.wallId, offset: tg.center } },
      };
    },
    cancel() { cursor = null; },
  };
}
