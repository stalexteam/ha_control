import { describe, expect, it } from 'vitest';
import { createBindingSelectTool } from '../../src/editor/tools/binding-select-tool';
import { addDevice } from '../../src/model/devices';
import { deviceDefaults } from '../../src/model/types';
import type { Selection } from '../../src/editor/tools/types';
import { rectRoomLevel } from '../fixtures';
import { fakeContext } from './fake-context';

const ev = (x: number, y: number) => ({ pt: { x, y }, shift: false, alt: false });
const k = { shift: false };

function setup() {
  const r = addDevice(rectRoomLevel(3000, 4000, 200), deviceDefaults('ceiling_light', 'free'), { mode: 'free', x: 1000, y: 1000, rotation: 0 }, 'L');
  const ctx = fakeContext(r.level);
  const sels: (Selection | null)[] = [];
  ctx.select = s => { sels.push(s); };
  return { ctx, sels, id: r.deviceId!, tool: createBindingSelectTool(ctx) };
}

describe('binding select tool', () => {
  it('a click selects a device; a click on empty space clears', () => {
    const { tool, sels, id, ctx } = setup();
    expect(tool.id).toBe('binding-select');
    tool.down(ev(1000, 1000)); tool.up(ev(1000, 1000));
    tool.down(ev(2500, 3000)); tool.up(ev(2500, 3000));
    expect(sels).toEqual([{ kind: 'device', id }, null]);
    expect(ctx.commits).toHaveLength(0);
  });

  it('a drag never moves the device and never commits', () => {
    const { tool, ctx } = setup();
    const before = ctx.level();
    tool.down(ev(1000, 1000)); tool.move(ev(1500, 1500)); tool.up(ev(1500, 1500));
    expect(ctx.commits).toHaveLength(0);
    expect(ctx.level()).toBe(before);
    expect(tool.preview()).toEqual({});
  });

  it('Delete and Backspace are not consumed (the tool deletes nothing)', () => {
    const { tool, ctx } = setup();
    tool.down(ev(1000, 1000)); tool.up(ev(1000, 1000));
    expect(tool.key('Delete', k)).toBe(false);
    expect(tool.key('Backspace', k)).toBe(false);
    expect(ctx.commits).toHaveLength(0);
  });

  it('Escape clears the selection', () => {
    const { tool, sels } = setup();
    tool.down(ev(1000, 1000)); tool.up(ev(1000, 1000));
    expect(tool.key('Escape', k)).toBe(true);
    expect(sels.at(-1)).toBeNull();
  });
});
