import { zonesAt } from './zone-edit';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/**
 * Automation step tool: a click selects the smallest zone at the point (its outline counts, within the pick
 * tolerance); a click outside every zone or Esc clears the selection. It never edits anything.
 */
export function createZonePickTool(ctx: ToolContext): Tool {
  return {
    id: 'zone-pick',
    down(e: ToolEvent) {
      const id = zonesAt(ctx.level(), e.pt, ctx.tolMm())[0];
      ctx.select(id ? { kind: 'zone', id } : null);
    },
    move() {},
    up() {},
    key(key) {
      if (key !== 'Escape') return false;
      ctx.select(null);
      return true;
    },
    preview: (): Preview => ({}),
    cancel() {},
  };
}
