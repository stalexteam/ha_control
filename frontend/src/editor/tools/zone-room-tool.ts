import type { Level, Pt, Zone } from '../../model/types';
import { addRoomZone } from '../../model/automation-zones';
import { zoneContains } from '../../geometry/zones';
import { polygonArea } from '../../geometry/vec';
import type { Preview, Tool, ToolContext, ToolEvent } from './types';

/** The smallest room (a `Level.zones` entry) whose outline contains p (ties: by id), or null. */
function roomAt(level: Level, p: Pt): Zone | null {
  let best: { room: Zone; area: number } | null = null;
  for (const room of level.zones) {
    if (room.outline.length < 3 || !zoneContains(room.outline, p)) continue;
    const area = Math.abs(polygonArea(room.outline));
    if (!best || area < best.area || (area === best.area && room.id < best.room.id)) best = { room, area };
  }
  return best ? best.room : null;
}

/**
 * Zone-from-room tool: a click inside a room creates a room zone named after the room and selects it. A room that
 * already has a room zone gets that zone selected and nothing committed. Outside every room nothing happens.
 */
export function createZoneRoomTool(ctx: ToolContext): Tool {
  return {
    id: 'zone-room',
    down(e: ToolEvent) {
      const level = ctx.level();
      const room = roomAt(level, e.pt);
      if (!room) return;
      const res = addRoomZone(level, room.id, room.name);
      if (res.zoneId === null) return;
      if (res.level !== level) ctx.commit(res.level);
      ctx.select({ kind: 'automationZone', id: res.zoneId });
    },
    move() {},
    up() {},
    key() { return false; },
    preview(): Preview { return {}; },
    cancel() {},
  };
}
