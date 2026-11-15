import { describe, expect, it } from 'vitest';
import { createTypedInput } from '../../src/editor/tools/typed-input';

describe('createTypedInput', () => {
  const noop = () => {};
  it('digits and space go to the active buffer; Tab switches; Backspace erases in the active one', () => {
    const inp = createTypedInput();
    for (const k of ['1', ' ', '2']) expect(inp.key(k, noop, noop)).toBe(true);
    expect(inp.key('Tab', noop, noop)).toBe(true);
    inp.key('4', noop, noop); inp.key('5', noop, noop);
    expect(inp.key('Backspace', noop, noop)).toBe(true);
    expect(inp.tracker({ x: 1, y: 2 })).toEqual({ first: '1 2', second: '4', field: 'second', at: { x: 1, y: 2 } });
    inp.key('Tab', noop, noop);
    expect(inp.tracker({ x: 0, y: 0 }).field).toBe('first');
  });
  it('other keys are not consumed and leave the buffers alone', () => {
    const inp = createTypedInput();
    for (const k of [',', '.', '-', 'a', 'Shift']) expect(inp.key(k, noop, noop)).toBe(false);
    expect(inp.typing()).toBe(false);
  });
  it('Enter runs the commit callback', () => {
    const inp = createTypedInput();
    let n = 0;
    expect(inp.key('Enter', () => n++, noop)).toBe(true);
    expect(n).toBe(1);
  });
  it('Escape clears typed text (first buffer active again); with nothing typed it runs the escape callback', () => {
    const inp = createTypedInput();
    let escaped = 0;
    inp.key('7', noop, noop); inp.key('Tab', noop, noop);
    expect(inp.key('Escape', noop, () => escaped++)).toBe(true);
    expect(escaped).toBe(0);
    expect(inp.tracker({ x: 0, y: 0 })).toMatchObject({ first: '', second: '', field: 'first' });
    expect(inp.key('Escape', noop, () => escaped++)).toBe(true);
    expect(escaped).toBe(1);
  });
  it('typing() is true while either buffer holds text; clear() empties both', () => {
    const inp = createTypedInput();
    inp.key('Tab', noop, noop); inp.key('3', noop, noop);
    expect(inp.typing()).toBe(true);
    expect([inp.first, inp.second]).toEqual(['', '3']);
    inp.clear();
    expect(inp.typing()).toBe(false);
    expect(inp.tracker({ x: 0, y: 0 }).field).toBe('first');
  });
});
