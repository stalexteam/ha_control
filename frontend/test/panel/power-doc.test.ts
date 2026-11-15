// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { drawBox, mount, pressSave, stored, undo } from './helpers';
import { selectionExists } from '../../src/panel/tool-factory';
import { addBlock, newBlock, defaultPower, type PowerSchema } from '../../src/model/power';
import type { Plan } from '../../src/model/types';

const withPv = (s: PowerSchema): PowerSchema => addBlock(s, newBlock('pv', { x: 10, y: 20 }, s));

describe('power in the plan document', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('save without power edits writes no power key', async () => {
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    expect(stored().length).toBe(1);
    expect('power' in stored()[0]).toBe(false);
    expect(el.history!.current.power).toBeUndefined();
    expect(el.power.blocks.map(b => b.kind)).toEqual(['grid']);
  });

  it('commitPower then save stores the schematic', async () => {
    const el = await mount();
    const next = withPv(el.power);
    el.commitPower(next);
    expect(el.save.dirty).toBe(true);
    await pressSave(el);
    expect(stored()[0].power).toEqual(next);
  });

  it('a draft carries power and restoring it brings it back', async () => {
    const el = await mount();
    const next = withPv(defaultPower());
    el.commitPower(next);
    const draft = el.session.makeDraft();
    expect(draft.plan.power).toEqual(next);
    el.session.restoreDraft({ ...draft, plan: JSON.parse(JSON.stringify(draft.plan)) as Plan });
    expect(el.history!.current.power).toEqual(next);
    expect(el.save.dirty).toBe(true);
  });

  it('undo walks power and level edits in order', async () => {
    const el = await mount();
    const level0 = el.level!;
    const p1 = withPv(el.power);
    el.commitPower(p1);
    const level1 = { ...level0, name: 'Edited' };
    el.commit(level1);
    expect(el.level).toBe(level1);
    expect(el.power).toBe(p1);
    await undo(el);
    expect(el.level).toBe(level0);
    expect(el.power).toBe(p1);
    await undo(el);
    expect(el.history!.current.power).toBeUndefined();
    expect(el.power.blocks.map(b => b.kind)).toEqual(['grid']);
  });

  it('selectionExists finds power blocks and wires', async () => {
    const el = await mount();
    const s = withPv(defaultPower());
    const wire = { id: 'w1', from: { block: s.blocks[1].id, port: 'OUT' as const }, to: { block: s.blocks[0].id, port: 'OUT' as const } };
    const sch = { ...s, wires: [wire] };
    const lvl = el.level!;
    expect(selectionExists(lvl, { kind: 'powerBlock', id: s.blocks[1].id }, sch)).toBe(true);
    expect(selectionExists(lvl, { kind: 'powerBlock', id: 'nope' }, sch)).toBe(false);
    expect(selectionExists(lvl, { kind: 'powerWire', id: 'w1' }, sch)).toBe(true);
    expect(selectionExists(lvl, { kind: 'powerWire', id: 'nope' }, sch)).toBe(false);
  });
});
