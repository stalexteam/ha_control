import type { ToolEvent } from '../editor/tools/types';
import type { PlanStudioPanel } from './plan-studio-panel';
import { PLAN_SHORTCUTS, type EditorMode, type ToolId } from './tool-factory';
import { panBy, zoomAt } from './viewport';

/** The panel members the pointer / keyboard handlers use. */
export type InputHost = Pick<PlanStudioPanel,
  'activeTool' | 'view' | 'history' | 'selection' | 'dialog' | 'automationsMenu' | 'toMm' | 'focus' | 'requestUpdate' | 'undo' | 'redo' | 'doSave' | 'deleteSelection' | 'mode' | 'toolId' | 'pickTool'>;

const MODIFIER_KEYS = ['Shift', 'Control', 'Alt', 'Meta'];

/** The select tool an unconsumed Esc returns to, per step; the Binding step has no other tool. */
const HOME_TOOL: Partial<Record<EditorMode, ToolId>> = {
  plan: 'select', equipment: 'device-select', power: 'power-select', automation: 'zone-pick',
};

/** Plan step tools by physical key code (`KeyW` -> wall). */
const PLAN_KEYS = new Map(Object.entries(PLAN_SHORTCUTS).map(([id, k]) => [`Key${k}`, id as ToolId]));

/** The first element of the composed path, so a field inside a nested shadow root counts too. */
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

  private toolEvent(e: MouseEvent): ToolEvent {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }

  readonly pointerDown = (e: PointerEvent) => {
    if (this.h.dialog !== null) return; // a modal dialog covers the canvas
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
    this.h.activeTool.down(this.toolEvent(e));
    this.h.requestUpdate();
  };

  readonly pointerMove = (e: PointerEvent) => {
    if (this.h.dialog !== null) return; // a modal dialog covers the canvas
    if (this.panFrom) {
      this.h.view = panBy(this.h.view, e.clientX - this.panFrom.x, e.clientY - this.panFrom.y);
      this.panFrom = { x: e.clientX, y: e.clientY };
      return;
    }
    this.h.activeTool.move(this.toolEvent(e));
    this.h.requestUpdate();
  };

  readonly pointerUp = (e: PointerEvent) => {
    if (this.h.dialog !== null) return; // a modal dialog covers the canvas
    if (this.panFrom) { this.panFrom = null; return; }
    if (e.button !== 0 || !this.pointerActive) return;
    this.pointerActive = false;
    this.h.activeTool.up(this.toolEvent(e));
    this.h.requestUpdate();
  };

  /** pointercancel / lostpointercapture: abort a pan or an in-progress drag (nothing is committed). */
  readonly pointerAbort = () => {
    if (this.panFrom) { this.panFrom = null; return; }
    if (!this.pointerActive) return; // e.g. the lostpointercapture that follows a normal pointerup
    this.pointerActive = false;
    const pv = this.h.activeTool.preview();
    if (pv.level || pv.power || pv.wireDraft) this.h.activeTool.cancel();
    this.h.requestUpdate();
  };

  readonly dblClick = (e: MouseEvent) => {
    if (this.h.dialog !== null) return; // a modal dialog covers the canvas
    if (e.button !== 0) return;
    this.h.activeTool.dblclick?.(this.toolEvent(e));
    this.h.requestUpdate();
  };

  readonly wheel = (e: WheelEvent) => {
    if (this.h.dialog !== null) return; // a modal dialog covers the canvas
    e.preventDefault();
    this.h.view = zoomAt(this.h.view, this.h.toMm(e), e.deltaY);
  };

  readonly keyDown = (e: KeyboardEvent) => {
    if (this.h.automationsMenu !== null && e.key === 'Escape') { e.preventDefault(); this.h.automationsMenu = null; return; }
    if (this.h.dialog !== null) {
      if (e.key === 'Escape') { e.preventDefault(); this.h.dialog = null; } // closes without deciding: a restore prompt leaves its banner
      return;
    }
    if (inField(e) || !this.h.history) return;
    const ctrl = e.ctrlKey || e.metaKey;
    // Shortcuts use the physical key (e.code) so they work with any keyboard layout
    // (with a non-Latin layout e.key is a different letter).
    const k = e.code === 'KeyZ' ? 'z' : e.code === 'KeyY' ? 'y' : e.code === 'KeyS' ? 's' : e.key.toLowerCase();
    if (ctrl && (k === 'z' || k === 'y')) {
      e.preventDefault();
      // A tool may take Ctrl+Z for itself (a draft vertex goes) before it reaches the plan's undo.
      if (k === 'z' && !e.shiftKey && this.h.activeTool.key('Undo', { shift: false })) { this.h.requestUpdate(); return; }
      if (k === 'z' && !e.shiftKey) this.h.undo(); else this.h.redo();
      return;
    }
    if (ctrl && k === 's') { e.preventDefault(); void this.h.doSave(); return; }
    if (e.key === ' ') {
      // Deferred to keyup so a Space held for panning never lands in the tool's length buffer.
      e.preventDefault();
      if (!e.repeat && !this.spaceDown) { this.spaceDown = true; this.spacePending = true; }
      return;
    }
    // Plan step tool shortcuts: a bare letter key (no modifier, so Ctrl+W / Ctrl+Z keep their meaning), never in the
    // middle of a drag. The typed lengths of the Wall and Box tools take digits and Space only, so no letter is ever
    // part of a length.
    const bare = !ctrl && !e.altKey && !e.shiftKey && !this.pointerActive;
    const shortcut = this.h.mode === 'plan' && bare ? PLAN_KEYS.get(e.code) : undefined;
    if (shortcut) {
      e.preventDefault();
      if (shortcut !== this.h.toolId) this.h.pickTool(shortcut); // the active tool's own key keeps its draft
      this.h.requestUpdate();
      return;
    }
    let consumed = this.h.activeTool.key(e.key, { shift: e.shiftKey });
    // Only a fresh press deletes the selection: a held Backspace that empties a draft never runs on into a delete.
    if (!consumed && (e.key === 'Delete' || e.key === 'Backspace') && !e.repeat) consumed = this.h.deleteSelection();
    if (!consumed && e.key === 'Escape') {
      // Nothing to cancel: leave a placement tool for the step's select tool.
      const home = HOME_TOOL[this.h.mode];
      if (home && this.h.toolId !== home) this.h.pickTool(home);
      else { this.h.activeTool.cancel(); this.h.selection = null; }
      consumed = true;
    }
    if (consumed) e.preventDefault();
    this.h.requestUpdate();
  };

  /**
   * Keyup reaches the tool only for modifier releases (Shift up turns ortho off) and for a Space tap that did
   * not pan; other keys act on keydown, so digits are never entered twice.
   */
  readonly keyUp = (e: KeyboardEvent) => {
    const blocked = this.h.dialog !== null || inField(e);
    const mods = { shift: e.shiftKey };
    if (e.key === ' ') {
      this.spaceDown = false;
      const tap = this.spacePending;
      this.spacePending = false;
      if (tap && !blocked) { this.h.activeTool.key(' ', mods); this.h.requestUpdate(); }
      return;
    }
    if (blocked || !MODIFIER_KEYS.includes(e.key)) return;
    this.h.activeTool.key(e.key, mods);
    this.h.requestUpdate();
  };

  readonly blur = () => { this.spaceDown = false; this.spacePending = false; };
}
