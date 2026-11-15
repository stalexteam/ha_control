import type { Id } from '../../model/types';
import { addBlock, newBlock, type PowerKind } from '../../model/power';
import { blockRect, snapToGrid } from '../../geometry/power';
import { t } from '../../i18n';
import type { PowerPlaceToolId, Preview, Tool, ToolContext, ToolEvent } from './types';

/**
 * A Power place tool (one per block kind but the grid): a click places a new block centred on the click with its
 * corner snapped to the grid, selects it and returns to the Power select tool. The Plan device tool places the plan
 * device armed in the device list and clears the arm; with none armed it asks for one and places nothing.
 */
export function createPowerPlaceTool(ctx: ToolContext, id: PowerPlaceToolId): Tool {
  const kind = id.slice('power-'.length) as Exclude<PowerKind, 'grid'>;
  return {
    id,
    down(e: ToolEvent) {
      let deviceId: Id | undefined;
      if (kind === 'device') {
        const armed = ctx.placeDeviceId();
        if (!armed) { ctx.notify(t('power.pickDevice')); return; }
        deviceId = armed;
      }
      const s = ctx.power();
      const b0 = newBlock(kind, { x: 0, y: 0 }, s, deviceId);
      const r = blockRect(b0, ctx.geo(), addBlock(s, b0));
      const b = { ...b0, x: snapToGrid(e.pt.x - r.w / 2), y: snapToGrid(e.pt.y - r.h / 2) };
      ctx.commitPower(addBlock(s, b));
      if (kind === 'device') ctx.devicePlaced?.();
      ctx.pickTool('power-select');
      ctx.select({ kind: 'powerBlock', id: b.id });
    },
    move() {},
    up() {},
    key() { return false; },
    preview: (): Preview => ({}),
    cancel() {},
  };
}
