import { addWallsZone } from '../../model/zones';
import { nextFreeName } from '../../model/ids';
import { t } from '../../i18n';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/**
 * Zone-from-room tool: a click inside closed walls creates a walls zone ("Zone N") and selects it. A loop that already
 * holds a walls zone gets that zone selected and nothing committed. Outside every loop nothing happens.
 */
export function createZoneRoomTool(ctx: ToolContext): Tool {
  return {
    id: 'zone-room',
    down(e: ToolEvent) {
      const level = ctx.level();
      const name = nextFreeName(t('zones.default'), level.zones.map(z => z.name));
      const res = addWallsZone(level, e.pt, name);
      if (res.zoneId === null) return;
      if (!res.existing) ctx.commit(res.level);
      ctx.select({ kind: 'zone', id: res.zoneId });
    },
    move() {},
    up() {},
    key() { return false; },
    preview(): Preview { return {}; },
    cancel() {},
  };
}
