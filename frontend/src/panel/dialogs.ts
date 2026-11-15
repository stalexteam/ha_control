import { html, nothing, type TemplateResult } from 'lit';
import { t } from '../i18n';
import type { Draft } from '../editor/draft';

export interface ConflictOpts {
  lang: string;
  /** 'again' = overwrite failed too (e.g. the plan was deleted): only "Save as new" and "Cancel" remain. */
  mode: 'conflict' | 'again';
  busy: boolean;
  message: string | null;
  onOverwrite(): void;
  onSaveAsNew(): void;
  onCancel(): void;
}

export function renderConflictDialog(o: ConflictOpts): TemplateResult {
  const lang = o.lang;
  return html`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t('conflict.title', lang)}</h3>
        <p>${t(o.mode === 'conflict' ? 'conflict.text' : 'conflict.again', lang)}</p>
        ${o.message ? html`<p class="muted">${o.message}</p>` : nothing}
        <div class="actions">
          ${o.mode === 'conflict' ? html`<button class="btn" data-action="overwrite" ?disabled=${o.busy}
            @click=${o.onOverwrite}>${t('conflict.overwrite', lang)}</button>` : nothing}
          <button class="btn primary" data-action="save-as-new" ?disabled=${o.busy}
            @click=${o.onSaveAsNew}>${t('conflict.saveAsNew', lang)}</button>
          <button class="btn" data-action="cancel" @click=${o.onCancel}>${t('conflict.cancel', lang)}</button>
        </div>
      </div>
    </div>`;
}

export interface RestoreOpts {
  lang: string;
  savedAt: number;
  onRestore(): void;
  onDiscard(): void;
}

function formatTime(savedAt: number, lang: string): string {
  try { return new Date(savedAt).toLocaleString(lang); } catch { return new Date(savedAt).toISOString(); }
}

/** Prompt for a local draft found on load. Escape (handled by the panel) means "decide later". */
export function renderRestoreDialog(o: RestoreOpts): TemplateResult {
  const lang = o.lang;
  const when = formatTime(o.savedAt, lang);
  return html`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t('draft.title', lang)}</h3>
        <p>${t('draft.text', lang).replace('{time}', when)}</p>
        <div class="actions">
          <button class="btn primary" data-action="restore" @click=${o.onRestore}>${t('draft.restore', lang)}</button>
          <button class="btn" data-action="discard" @click=${o.onDiscard}>${t('draft.discard', lang)}</button>
        </div>
      </div>
    </div>`;
}

/** Non-modal reminder of an undecided draft (the restore prompt was dismissed with Escape). */
export function renderDraftBanner(o: RestoreOpts): TemplateResult {
  const lang = o.lang;
  return html`
    <div class="draft-banner" role="status">
      <span>${t('draft.banner', lang).replace('{time}', formatTime(o.savedAt, lang))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${o.onRestore}>${t('draft.restore', lang)}</button>
      <button class="btn" data-action="banner-discard" @click=${o.onDiscard}>${t('draft.discard', lang)}</button>
    </div>`;
}

export interface SwitchOpts {
  lang: string;
  onDiscard(): void;
  onCancel(): void;
}

/** Confirmation before opening another plan while the current one has unsaved changes. */
export function renderSwitchDialog(o: SwitchOpts): TemplateResult {
  const lang = o.lang;
  return html`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t('switch.title', lang)}</h3>
        <p>${t('switch.text', lang)}</p>
        <div class="actions">
          <button class="btn primary" data-action="switch-discard" @click=${o.onDiscard}>${t('switch.discard', lang)}</button>
          <button class="btn" data-action="switch-cancel" @click=${o.onCancel}>${t('switch.cancel', lang)}</button>
        </div>
      </div>
    </div>`;
}

export interface NewPlanOpts {
  lang: string;
  onDiscard(): void;
  onCancel(): void;
}

/** Confirmation before starting a new plan while the current one has unsaved changes. */
export function renderNewPlanDialog(o: NewPlanOpts): TemplateResult {
  const lang = o.lang;
  return html`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t('new.title', lang)}</h3>
        <p>${t('new.text', lang)}</p>
        <div class="actions">
          <button class="btn primary" data-action="new-discard" @click=${o.onDiscard}>${t('new.discard', lang)}</button>
          <button class="btn" data-action="new-cancel" @click=${o.onCancel}>${t('new.cancel', lang)}</button>
        </div>
      </div>
    </div>`;
}

export interface DeletePlanOpts {
  lang: string;
  name: string;
  onDelete(): void;
  onCancel(): void;
}

export function renderDeleteDialog(o: DeletePlanOpts): TemplateResult {
  const lang = o.lang;
  return html`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t('delete.title', lang)}</h3>
        <p>${t('delete.text', lang).replace('{name}', o.name)}</p>
        <div class="actions">
          <button class="btn primary" data-action="delete-confirm" @click=${o.onDelete}>${t('delete.confirm', lang)}</button>
          <button class="btn" data-action="delete-cancel" @click=${o.onCancel}>${t('delete.cancel', lang)}</button>
        </div>
      </div>
    </div>`;
}

/** State and handlers of the panel's modal dialogs; renderActiveDialog picks the one that is open. */
export interface ActiveDialogOpts {
  lang: string;
  draft: Draft | null;
  restoreOpen: boolean;
  newConfirm: boolean;
  deleteConfirm: boolean;
  switchTo: string | null;
  dialog: 'none' | 'conflict' | 'conflict-again';
  planName: string;
  saving: boolean;
  message: string | null;
  restore(d: Draft): void;
  discard(d: Draft): void;
  startNew(): void;
  cancelNew(): void;
  confirmDelete(): void;
  cancelDelete(): void;
  confirmSwitch(): void;
  cancelSwitch(): void;
  overwrite(): void;
  saveAsNew(): void;
  cancelConflict(): void;
}

export function renderActiveDialog(o: ActiveDialogOpts): TemplateResult | typeof nothing {
  const lang = o.lang;
  const d = o.draft;
  if (d && o.restoreOpen) {
    return renderRestoreDialog({ lang, savedAt: d.savedAt, onRestore: () => o.restore(d), onDiscard: () => o.discard(d) });
  }
  if (o.newConfirm) return renderNewPlanDialog({ lang, onDiscard: o.startNew, onCancel: o.cancelNew });
  if (o.deleteConfirm) return renderDeleteDialog({ lang, name: o.planName, onDelete: o.confirmDelete, onCancel: o.cancelDelete });
  if (o.switchTo) return renderSwitchDialog({ lang, onDiscard: o.confirmSwitch, onCancel: o.cancelSwitch });
  if (o.dialog === 'none') return nothing;
  return renderConflictDialog({
    lang, mode: o.dialog === 'conflict' ? 'conflict' : 'again', busy: o.saving, message: o.message,
    onOverwrite: o.overwrite, onSaveAsNew: o.saveAsNew, onCancel: o.cancelConflict,
  });
}
