import { addZone } from '../../model/zones';
import { t } from '../../i18n';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** Zone tool: a click inside a closed room creates a zone and selects it. */
export function createZoneTool(ctx: ToolContext): Tool {
  return {
    id: 'zone',
    down(e: ToolEvent) {
      const level = ctx.level();
      const name = `${t('zone.default', ctx.lang())} ${level.zones.length + 1}`;
      const res = addZone(level, e.pt, name);
      if (res.zoneId === null) return;
      ctx.commit(res.level);
      ctx.select({ kind: 'zone', id: res.zoneId });
    },
    move() {},
    up() {},
    key() { return false; },
    preview(): Preview { return {}; },
    cancel() {},
  };
}
