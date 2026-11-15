import type { Plan } from '../src/model/types';
import { rectRoomLevel } from '../test/fixtures';

/** A named dev-harness state: the plans seeded into the mock store (and, later, a power frame). */
export interface Scene { plans: Plan[]; powerFrame?: unknown }

function room(): Plan {
  const level = rectRoomLevel(4000, 3000, 100);
  level.zones = [{
    id: 'r0', name: 'Room 1', seed: { x: 2000, y: 1500 }, broken: false,
    outline: [{ x: 50, y: 50 }, { x: 3950, y: 50 }, { x: 3950, y: 2950 }, { x: 50, y: 2950 }],
  }];
  level.devices = [
    {
      id: 'd-light', name: 'Ceiling light', invalid: false,
      placement: { mode: 'free', x: 2000, y: 1500, rotation: 0 },
      props: { kind: 'ceiling_light', shape: 'round', diameter: 300, length: 600, width: 100, poolRadius: null },
    },
    {
      id: 'd-socket', name: 'Socket', invalid: false,
      placement: { mode: 'wall', wallId: 'w2', side: 'left', offset: 1000 },
      props: { kind: 'socket' },
    },
  ];
  return { id: 'room', name: 'Room', schemaVersion: 1, revision: 1, levels: [level] };
}

export const SCENES: Record<string, Scene> = {
  room: { plans: [room()] },
};
