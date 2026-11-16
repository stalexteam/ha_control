import { addWallsZone, setZoneAutomation } from '../../model/zones';
import { t } from '../../i18n';
import { createZoneDrawTool } from './zone-draw-tool';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/**
 * The Zone tool with the method the context holds when it is created (the panel re-creates it on a method switch).
 * Polygon: createZoneDrawTool. By walls: a click inside closed walls creates a walls zone from the smallest loop around
 * it (with the context's name and Automation) and selects it; a click in a loop that already holds a walls zone
 * selects that zone without a commit; outside every loop the notice says to click inside walls or use Polygon.
 */
export function createZoneTool(ctx: ToolContext): Tool {
  if (ctx.zoneMethod() === 'polygon') return createZoneDrawTool(ctx);
  return {
    id: 'zone',
    down(e: ToolEvent) {
      const res = addWallsZone(ctx.level(), e.pt, ctx.zoneName());
      if (res.zoneId === null) { ctx.notify(t('zones.noLoop')); return; }
      if (!res.existing) {
        ctx.commit(ctx.zoneAutomation() ? res.level : setZoneAutomation(res.level, res.zoneId, false));
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
