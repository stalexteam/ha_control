import { addWallsZone } from '../../model/zones';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/**
 * Room tool: a click inside closed walls creates a walls zone and selects it; a click in a loop that already holds a
 * walls zone selects that zone without a commit. Outside every loop nothing happens.
 */
export function createZoneTool(ctx: ToolContext): Tool {
  return {
    id: 'zone',
    down(e: ToolEvent) {
      const res = addWallsZone(ctx.level(), e.pt, ctx.zoneName());
      if (res.zoneId === null) return;
      if (!res.existing) {
        ctx.commit(res.level);
        ctx.zonePlaced?.();
      }
      ctx.select({ kind: 'zone', id: res.zoneId });
    },
    move() {},
    up() {},
    key() { return false; },
    preview(): Preview { return {}; },
    cancel() {},
  };
}
