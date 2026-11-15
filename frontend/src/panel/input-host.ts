import type { Level, Pt } from '../model/types';
import type { Tool } from '../editor/tools/types';
import type { History } from '../editor/history';
import type { InputHost } from './input';
import type { Dialog } from './dialogs';
import type { View } from './viewport';
import type { Selection } from '../editor/tools/types';

/** Panel members the pointer / keyboard handlers reach (the panel itself satisfies this). */
export interface InputSource {
  activeTool: Tool;
  view: View;
  history: History<Level> | null;
  selection: Selection | null;
  dialog: Dialog | null;
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
    modal: () => p.dialog !== null,
    // Escape on the restore prompt = decide later: the draft is kept and a banner keeps offering it.
    closeModal: () => { p.dialog = null; },
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
