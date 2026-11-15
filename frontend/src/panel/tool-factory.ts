import { createSelectTool } from '../editor/tools/select-tool';
import { createBoxTool } from '../editor/tools/box-tool';
import { createWallTool } from '../editor/tools/wall-tool';
import { createOpeningTool } from '../editor/tools/opening-tool';
import { createZoneTool } from '../editor/tools/zone-tool';
import { createDeviceTool } from '../editor/tools/device-tool';
import { createDeviceSelectTool } from '../editor/tools/device-select-tool';
import { createBindingSelectTool } from '../editor/tools/binding-select-tool';
import type { Selection, Tool, ToolContext } from '../editor/tools/types';
import type { Level } from '../model/types';

export type ToolId = Tool['id'];
export type EditorMode = 'plan' | 'equipment' | 'binding';

export const PLAN_TOOL_IDS: ToolId[] = ['select', 'box', 'wall', 'door', 'window', 'opening', 'zone'];
export const EQUIPMENT_TOOL_IDS: ToolId[] = ['device-select', 'ceiling_light', 'wall_light', 'motion_sensor',
  'illuminance_sensor', 'climate_sensor', 'wall_switch', 'smart_button', 'socket', 'exhaust_fan', 'equipment'];
/** The Binding step has a single selection-only tool; its rail is the device list. */
export const BINDING_TOOL_IDS: ToolId[] = ['binding-select'];

export function toolIdsFor(mode: EditorMode): ToolId[] {
  return mode === 'plan' ? PLAN_TOOL_IDS : mode === 'equipment' ? EQUIPMENT_TOOL_IDS : BINDING_TOOL_IDS;
}

export function createTool(id: ToolId, ctx: ToolContext): Tool {
  switch (id) {
    case 'select': return createSelectTool(ctx);
    case 'box': return createBoxTool(ctx);
    case 'wall': return createWallTool(ctx);
    case 'door': case 'window': case 'opening': return createOpeningTool(ctx, id);
    case 'zone': return createZoneTool(ctx);
    case 'device-select': return createDeviceSelectTool(ctx);
    case 'binding-select': return createBindingSelectTool(ctx);
    default: return createDeviceTool(ctx, id);
  }
}

/** The selected element still exists in the level. */
export function selectionExists(level: Level, s: Selection): boolean {
  const list = s.kind === 'wall' ? level.walls : s.kind === 'node' ? level.nodes
    : s.kind === 'opening' ? level.openings : s.kind === 'device' ? level.devices : level.zones;
  return list.some(x => x.id === s.id);
}
