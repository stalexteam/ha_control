import { describe, it, expect } from 'vitest';
import { createToolContext, type ToolHost } from '../../src/panel/tool-context';
import { initialNext } from '../../src/panel/next-object';

function host(): ToolHost {
  return {
    history: null, view: { x: 0, y: 0, scale: 0.1 }, grid: true, wallType: 'partition', thickness: 250, boxMeasure: 'axis',
    nextProps: {} as ToolHost['nextProps'], nextObj: initialNext(), selection: null, notice: 'x', uiLang: 'en', commit: () => {},
  };
}

describe('createToolContext', () => {
  it('reads wall props, grid and tolerance from the host', () => {
    const c = createToolContext(host());
    expect(c.wallProps()).toEqual({ type: 'partition', thickness: 250, baseline: 'center' });
    expect(c.grid()).toBe(100);
    expect(c.tolMm()).toBeCloseTo(100);
  });

  it('opening defaults come from next-object state', () => {
    const h = host();
    h.nextObj = { ...h.nextObj, door: { width: 800, hinge: 'end', swing: 'right' } };
    expect(createToolContext(h).openingDefaults('door')).toEqual({ width: 800, hinge: 'end', swing: 'right' });
  });

  it('custom zone name is single-use', () => {
    const h = host();
    h.nextObj = { ...h.nextObj, zoneName: 'Kitchen' };
    const c = createToolContext(h);
    expect(c.zoneName()).toBe('Kitchen');
    c.zonePlaced!();
    expect(c.zoneName()).toBe('Room 1');
  });

  it('select clears the notice', () => {
    const h = host();
    createToolContext(h).select({ kind: 'wall', id: 'w' });
    expect(h.selection).toEqual({ kind: 'wall', id: 'w' });
    expect(h.notice).toBeNull();
  });
});
