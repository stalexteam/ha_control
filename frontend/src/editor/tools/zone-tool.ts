import { addZone } from '../../model/zones';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** Zone tool: a click inside a closed room creates a zone and selects it. */
export function createZoneTool(ctx: ToolContext): Tool {
  return {
    id: 'zone',
    down(e: ToolEvent) {
      const level = ctx.level();
      const res = addZone(level, e.pt, ctx.zoneName());
      if (res.zoneId === null) return;
      ctx.commit(res.level);
      ctx.zonePlaced?.();
      ctx.select({ kind: 'zone', id: res.zoneId });
    },
    move() {},
    up() {},
    key() { return false; },
    preview(): Preview { return {}; },
    cancel() {},
  };
}
