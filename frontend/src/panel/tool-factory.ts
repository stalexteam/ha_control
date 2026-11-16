import { createSelectTool } from '../editor/tools/select-tool';
import { createBoxTool } from '../editor/tools/box-tool';
import { createWallTool } from '../editor/tools/wall-tool';
import { createOpeningTool } from '../editor/tools/opening-tool';
import { createZoneTool } from '../editor/tools/zone-tool';
import { createDeviceTool } from '../editor/tools/device-tool';
import { createDeviceSelectTool } from '../editor/tools/device-select-tool';
import { createBindingSelectTool } from '../editor/tools/binding-select-tool';
import { createPowerSelectTool } from '../editor/tools/power-select-tool';
import { createPowerPlaceTool } from '../editor/tools/power-place-tool';
import type { Selection, Tool, ToolContext } from '../editor/tools/types';
import type { PowerSchema } from '../model/power';
import type { Level } from '../model/types';

export type ToolId = Tool['id'];
export type EditorMode = 'plan' | 'equipment' | 'binding' | 'power';

export const PLAN_TOOL_IDS: ToolId[] = ['select', 'box', 'wall', 'door', 'window', 'opening', 'zone'];
export const EQUIPMENT_TOOL_IDS: ToolId[] = ['device-select', 'ceiling_light', 'wall_light', 'motion_sensor',
  'illuminance_sensor', 'climate_sensor', 'wall_switch', 'smart_button', 'socket', 'exhaust_fan', 'equipment'];
/** The Binding step has a single selection-only tool; its rail is the device list. */
export const BINDING_TOOL_IDS: ToolId[] = ['binding-select'];
/** The Power step: select, then the Device tool and the service blocks (no grid tool: the grid always exists). */
export const POWER_TOOL_IDS: ToolId[] = ['power-select', 'power-device', 'power-bus', 'power-battery', 'power-pv',
  'power-transfer', 'power-remainder'];

/** Plan step single-key shortcuts (the letter of the physical key, e.code `Key<letter>`); other steps have none. */
export const PLAN_SHORTCUTS: Partial<Record<ToolId, string>> = {
  select: 'V', box: 'B', wall: 'W', door: 'D', window: 'N', opening: 'O', zone: 'Z',
};

const TOOL_IDS: Record<EditorMode, ToolId[]> = {
  plan: PLAN_TOOL_IDS, equipment: EQUIPMENT_TOOL_IDS, binding: BINDING_TOOL_IDS, power: POWER_TOOL_IDS,
};

export function toolIdsFor(mode: EditorMode): ToolId[] {
  return TOOL_IDS[mode];
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
    case 'power-select': return createPowerSelectTool(ctx);
    case 'power-device': case 'power-bus': case 'power-battery': case 'power-pv':
    case 'power-transfer': case 'power-remainder':
      return createPowerPlaceTool(ctx, id);
    default: return createDeviceTool(ctx, id);
  }
}

/** The selected element still exists in the level (or, for a power block or wire, in the schematic). */
export function selectionExists(level: Level, s: Selection, power: PowerSchema): boolean {
  if (s.kind === 'powerBlock') return power.blocks.some(x => x.id === s.id);
  if (s.kind === 'powerWire') return power.wires.some(x => x.id === s.id);
  const list = s.kind === 'wall' ? level.walls : s.kind === 'node' ? level.nodes
    : s.kind === 'opening' ? level.openings : s.kind === 'device' ? level.devices : level.zones;
  return list.some(x => x.id === s.id);
}
