import type { Level, Pt } from '../model/types';
import type { Tool } from '../editor/tools/types';
import type { History } from '../editor/history';
import type { InputHost } from './input';
import type { View } from './viewport';
import type { Selection } from '../editor/tools/types';

/** Panel members the pointer / keyboard handlers reach (the panel itself satisfies this). */
export interface InputSource {
  activeTool: Tool;
  view: View;
  history: History<Level> | null;
  selection: Selection | null;
  restoreOpen: boolean;
  dialog: 'none' | 'conflict' | 'conflict-again';
  switchTo: string | null;
  newConfirm: boolean;
  deleteConfirm: boolean;
  toMm(e: { clientX: number; clientY: number }): Pt;
  focus(): void;
  requestUpdate(): void;
  undo(): void;
  redo(): void;
  doSave(): Promise<void>;
  deleteSelection(): boolean;
}

export function createInputHost(p: InputSource): InputHost {
  return {
    tool: () => p.activeTool,
    get view() { return p.view; },
    set view(v: View) { p.view = v; },
    ready: () => !!p.history,
    modal: () => p.restoreOpen || p.dialog !== 'none' || p.switchTo !== null || p.newConfirm || p.deleteConfirm,
    // Escape on the restore prompt = decide later: the draft is kept and a banner keeps offering it.
    closeModal: () => { p.restoreOpen = false; p.dialog = 'none'; p.switchTo = null; p.newConfirm = false; p.deleteConfirm = false; },
    toMm: e => p.toMm(e),
    focus: () => p.focus(),
    update: () => p.requestUpdate(),
    undo: () => p.undo(),
    redo: () => p.redo(),
    save: () => { void p.doSave(); },
    deleteSelection: () => p.deleteSelection(),
    clearSelection: () => { p.activeTool.cancel(); p.selection = null; },
  };
}
