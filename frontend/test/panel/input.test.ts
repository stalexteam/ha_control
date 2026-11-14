// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { $, drawBox, key, mount, pointer, pressSave } from './helpers';
import { simulateForeignSave } from '../../dev/mock-hass';

describe('panel input edge cases', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('pointercancel aborts a select-tool drag without committing', async () => {
    const el = await mount();
    await drawBox(el);
    $<HTMLButtonElement>(el, 'button[data-tool="select"]').click();
    await el.updateComplete;
    const before = el.history!.current;
    pointer(el, 'pointerdown', 300, -100); // top wall axis
    pointer(el, 'pointermove', 300, -600);
    expect(el.activeTool.preview().level).toBeDefined();
    pointer(el, 'pointercancel', 300, -600);
    pointer(el, 'pointerup', 300, -600);
    expect(el.activeTool.preview().level).toBeUndefined();
    expect(el.history!.current).toBe(before);
  });

  it('lostpointercapture also aborts the drag', async () => {
    const el = await mount();
    await drawBox(el);
    $<HTMLButtonElement>(el, 'button[data-tool="select"]').click();
    await el.updateComplete;
    const before = el.history!.current;
    pointer(el, 'pointerdown', 300, -100);
    pointer(el, 'pointermove', 300, -600);
    pointer(el, 'lostpointercapture', 300, -600);
    pointer(el, 'pointerup', 300, -600);
    expect(el.history!.current).toBe(before);
  });

  it('space used for panning never reaches the tool buffer', async () => {
    const el = await mount();
    $<HTMLButtonElement>(el, 'button[data-tool="wall"]').click();
    await el.updateComplete;
    click0(el);
    key(el, 'keydown', '3');
    key(el, 'keydown', ' ');
    key(el, 'keydown', ' ', { repeat: true });
    pointer(el, 'pointerdown', 50, 50);
    pointer(el, 'pointermove', 80, 80);
    pointer(el, 'pointerup', 80, 80);
    key(el, 'keyup', ' ');
    expect(el.activeTool.preview().tracker?.length).toBe('3');
    // A plain tap of space (no pan) still reaches the tool as a thousands separator.
    key(el, 'keydown', ' ');
    key(el, 'keyup', ' ');
    expect(el.activeTool.preview().tracker?.length).toBe('3 ');
    expect(el.history!.current.walls.length).toBe(0); // the pan did not add a segment
  });

  it('Escape closes the conflict dialog and keys do not reach History while it is open', async () => {
    const el = await mount();
    await drawBox(el);
    await pressSave(el);
    simulateForeignSave();
    await pressSave(el);
    expect(el.shadowRoot!.querySelector('.dialog')).not.toBeNull();
    key(el, 'keydown', 'z', { ctrlKey: true });
    expect(el.history!.current.walls.length).toBe(4);
    key(el, 'keydown', 'Escape');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dialog')).toBeNull();
  });
});

function click0(el: Parameters<typeof pointer>[0]): void {
  pointer(el, 'pointerdown', 0, 0);
  pointer(el, 'pointerup', 0, 0);
}
