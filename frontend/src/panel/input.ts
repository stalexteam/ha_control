import type { Pt } from '../model/types';
import type { Tool, ToolEvent } from '../editor/tools/types';
import { panBy, zoomAt, type View } from './viewport';

/** What the pointer / keyboard handlers need from the panel. */
export interface InputHost {
  tool(): Tool;
  view: View;
  ready(): boolean;
  /** A modal dialog is open: nothing may reach the tool or History. */
  modal(): boolean;
  /** Escape on a modal: close it without taking a decision. */
  closeModal(): void;
  toMm(e: { clientX: number; clientY: number }): Pt;
  focus(): void;
  update(): void;
  undo(): void;
  redo(): void;
  save(): void;
  /** Panel fallback for an unconsumed Delete; returns true when something was deleted. */
  deleteSelection(): boolean;
  /** Panel fallback for an unconsumed Escape: cancel the tool and clear the selection. */
  clearSelection(): void;
}

const MODIFIER_KEYS = ['Shift', 'Control', 'Alt', 'Meta'];

function inField(e: KeyboardEvent): boolean {
  const el = e.composedPath()[0] as HTMLElement | undefined;
  return !!el && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
}

/** Canvas pointer handling (tool gestures, pan, zoom) and panel keyboard routing. */
export class EditorInput {
  private panFrom: { x: number; y: number } | null = null;
  private spaceDown = false;
  /** Space pressed and not (yet) used for panning: it reaches the tool on keyup. */
  private spacePending = false;
  /** A primary-button gesture is in progress on the canvas. */
  private pointerActive = false;

  constructor(private readonly h: InputHost) {}

  private toolEvent(e: PointerEvent): ToolEvent {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }

  readonly pointerDown = (e: PointerEvent) => {
    this.h.focus();
    const el = e.currentTarget as Element;
    if (e.button === 1 || (e.button === 0 && this.spaceDown)) {
      e.preventDefault();
      this.spacePending = false; // this Space press is a pan, not a thousands separator
      this.panFrom = { x: e.clientX, y: e.clientY };
      el.setPointerCapture?.(e.pointerId);
      return;
    }
    if (e.button !== 0) return;
    el.setPointerCapture?.(e.pointerId);
    this.pointerActive = true;
    this.h.tool().down(this.toolEvent(e));
    this.h.update();
  };

  readonly pointerMove = (e: PointerEvent) => {
    if (this.panFrom) {
      this.h.view = panBy(this.h.view, e.clientX - this.panFrom.x, e.clientY - this.panFrom.y);
      this.panFrom = { x: e.clientX, y: e.clientY };
      return;
    }
    this.h.tool().move(this.toolEvent(e));
    this.h.update();
  };

  readonly pointerUp = (e: PointerEvent) => {
    if (this.panFrom) { this.panFrom = null; return; }
    if (e.button !== 0 || !this.pointerActive) return;
    this.pointerActive = false;
    this.h.tool().up(this.toolEvent(e));
    this.h.update();
  };

  /** pointercancel / lostpointercapture: abort a pan or an in-progress drag (nothing is committed). */
  readonly pointerAbort = () => {
    if (this.panFrom) { this.panFrom = null; return; }
    if (!this.pointerActive) return; // e.g. the lostpointercapture that follows a normal pointerup
    this.pointerActive = false;
    if (this.h.tool().preview().level) this.h.tool().cancel();
    this.h.update();
  };

  readonly wheel = (e: WheelEvent) => {
    e.preventDefault();
    this.h.view = zoomAt(this.h.view, this.h.toMm(e), e.deltaY);
  };

  readonly keyDown = (e: KeyboardEvent) => {
    if (this.h.modal()) {
      if (e.key === 'Escape') { e.preventDefault(); this.h.closeModal(); }
      return;
    }
    if (inField(e) || !this.h.ready()) return;
    const ctrl = e.ctrlKey || e.metaKey;
    // Shortcuts use the physical key (e.code) so they work with any keyboard layout
    // (with a non-Latin layout e.key is a different letter).
    const k = e.code === 'KeyZ' ? 'z' : e.code === 'KeyY' ? 'y' : e.code === 'KeyS' ? 's' : e.key.toLowerCase();
    if (ctrl && (k === 'z' || k === 'y')) {
      e.preventDefault();
      if (k === 'z' && !e.shiftKey) this.h.undo(); else this.h.redo();
      return;
    }
    if (ctrl && k === 's') { e.preventDefault(); this.h.save(); return; }
    if (e.key === ' ') {
      // Deferred to keyup so a Space held for panning never lands in the tool's length buffer.
      e.preventDefault();
      if (!e.repeat && !this.spaceDown) { this.spaceDown = true; this.spacePending = true; }
      return;
    }
    let consumed = this.h.tool().key(e.key, { shift: e.shiftKey, ctrl });
    if (!consumed && e.key === 'Delete') consumed = this.h.deleteSelection();
    if (!consumed && e.key === 'Escape') { this.h.clearSelection(); consumed = true; }
    if (consumed) e.preventDefault();
    this.h.update();
  };

  /**
   * Keyup reaches the tool only for modifier releases (Shift up turns ortho off) and for a Space tap that did
   * not pan; other keys act on keydown, so digits are never entered twice.
   */
  readonly keyUp = (e: KeyboardEvent) => {
    const blocked = this.h.modal() || inField(e);
    const mods = { shift: e.shiftKey, ctrl: e.ctrlKey || e.metaKey };
    if (e.key === ' ') {
      this.spaceDown = false;
      const tap = this.spacePending;
      this.spacePending = false;
      if (tap && !blocked) { this.h.tool().key(' ', mods); this.h.update(); }
      return;
    }
    if (blocked || !MODIFIER_KEYS.includes(e.key)) return;
    this.h.tool().key(e.key, mods);
    this.h.update();
  };

  readonly blur = () => { this.spaceDown = false; this.spacePending = false; };
}
