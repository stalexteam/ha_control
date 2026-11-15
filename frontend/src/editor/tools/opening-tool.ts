import type { Id, Pt } from '../../model/types';
import { addOpening } from '../../model/openings';
import { wallFrame, wallLocal } from '../../geometry/walls';
import { add, scale } from '../../geometry/vec';
import { wallAt } from '../hit';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** Door / window / opening tool: places an opening centred at the cursor's projection onto a wall axis. */
export function createOpeningTool(ctx: ToolContext, kind: 'door' | 'window' | 'opening'): Tool {
  let cursor: Pt | null = null;
  const def = () => ctx.openingDefaults(kind);

  function target(): { wallId: Id; center: number; pt: Pt } | null {
    if (!cursor) return null;
    const level = ctx.level();
    const wallId = wallAt(level, cursor, ctx.tolMm());
    if (!wallId) return null;
    const f = wallFrame(level, level.walls.find(w => w.id === wallId)!);
    const center = wallLocal(f, cursor).t;
    return { wallId, center, pt: add(f.a, scale(f.dir, center)) };
  }

  return {
    id: kind,
    down(e: ToolEvent) {
      cursor = e.pt;
      const tg = target();
      if (!tg) return;
      const d = def();
      const res = addOpening(ctx.level(), tg.wallId, kind, tg.center, d.width, d);
      if (res.openingId === null) return; // overlap / does not fit: nothing happens
      ctx.commit(res.level);
    },
    move(e: ToolEvent) { cursor = e.pt; },
    up() {},
    key() { return false; },
    preview(): Preview {
      const tg = target();
      if (!tg) return {};
      const { width, ...rest } = def();
      const probe = addOpening(ctx.level(), tg.wallId, kind, tg.center, width, rest);
      return {
        opening: { wallId: tg.wallId, offset: tg.center - width / 2, width, kind, invalid: probe.openingId === null },
        snap: { pt: tg.pt, kind: 'wall', endpoint: { kind: 'wall', wallId: tg.wallId, offset: tg.center } },
      };
    },
    cancel() { cursor = null; },
  };
}
