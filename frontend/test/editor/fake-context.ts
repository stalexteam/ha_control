import { deviceDefaults, emptyLevel, type Level } from '../../src/model/types';
import { defaultZoneName } from '../../src/panel/next-object';
import type { Selection, ToolContext } from '../../src/editor/tools/types';

/** Minimal ToolContext: keeps the level and the selection in memory and records every commit. */
export function fakeContext(level?: Level): ToolContext & { commits: Level[] } {
  let current: Level = level ?? emptyLevel('l0');
  let selected: Selection | null = null;
  const commits: Level[] = [];
  return {
    commits,
    level: () => current,
    commit: (next: Level) => { current = next; commits.push(next); },
    power: () => ({ blocks: [], wires: [] }),
    commitPower: () => {},
    scale: () => 0.5,
    tolMm: () => 20,
    grid: () => 100,
    wallProps: () => ({ type: 'partition', thickness: 100, baseline: 'center' }),
    boxMeasure: () => 'inner',
    select: s => { selected = s; },
    selection: () => selected,
    deviceDefaults: k => deviceDefaults(k, 'free'),
    openingDefaults: k => (k === 'door' ? { width: 900, hinge: 'start', swing: 'left' } : k === 'window' ? { width: 1200, outside: 'left' } : { width: 900 }),
    zoneName: () => defaultZoneName(current),
    geo: () => ({ device: id => current.devices.find(d => d.id === id) }),
    placeDeviceId: () => null,
    setPosition: () => {},
    notify: () => {},
    pickTool: () => {},
  };
}
