import { deviceAt } from '../../geometry/devices';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/**
 * Binding step tool: a click picks a device (or clears the selection on empty space). It never drags,
 * edits or deletes anything; Delete / Backspace are left to the panel, which ignores them in this step.
 */
export function createBindingSelectTool(ctx: ToolContext): Tool {
  return {
    id: 'binding-select',
    down(e: ToolEvent) {
      const id = deviceAt(ctx.level(), e.pt, ctx.tolMm());
      ctx.select(id ? { kind: 'device', id } : null);
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
