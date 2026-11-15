import { deviceDefaults, type Level } from '../../src/model/types';
import type { ToolContext } from '../../src/editor/tools/types';

/** Minimal ToolContext: keeps the level in memory and records every commit. */
export function fakeContext(level?: Level): ToolContext & { commits: Level[] } {
  let current: Level = level ?? { id: 'l0', name: 'Level 1', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
  const commits: Level[] = [];
  return {
    commits,
    level: () => current,
    commit: (next: Level) => { current = next; commits.push(next); },
    tolMm: () => 20,
    grid: () => 100,
    wallProps: () => ({ type: 'partition', thickness: 100, baseline: 'center' }),
    boxMeasure: () => 'inner',
    select: () => {},
    lang: () => 'en',
    deviceDefaults: k => deviceDefaults(k, 'free'),
  };
}
