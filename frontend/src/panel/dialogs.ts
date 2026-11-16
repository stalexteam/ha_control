import { html, nothing, type TemplateResult } from 'lit';
import { t } from '../i18n';
import type { Draft } from '../editor/draft';

/**
 * The one modal dialog that is open, or null. 'again' = a conflict overwrite failed too (e.g. the plan was
 * deleted): only "Save as new" and "Cancel" remain.
 */
export type Dialog =
  | { kind: 'restore' | 'new' | 'delete' | 'conflict' | 'conflict-again' }
  | { kind: 'switch'; to: string }
  | { kind: 'delete-rule'; id: string };

export interface RestoreOpts {
  savedAt: number;
  onRestore(): void;
  onDiscard(): void;
}

function formatTime(savedAt: number): string {
  try { return new Date(savedAt).toLocaleString(); } catch { return new Date(savedAt).toISOString(); }
}

/** Non-modal reminder of an undecided draft (the restore prompt was dismissed with Escape). */
export function renderDraftBanner(o: RestoreOpts): TemplateResult {
  return html`
    <div class="draft-banner" role="status">
      <span>${t('draft.banner').replace('{time}', formatTime(o.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${o.onRestore}>${t('draft.restore')}</button>
      <button class="btn" data-action="banner-discard" @click=${o.onDiscard}>${t('draft.discard')}</button>
    </div>`;
}

interface DialogButton { action: string; label: string; onClick(): void; primary?: boolean; disabled?: boolean }

/** Modal with a title, a text, an optional muted message and a row of buttons. */
function renderDialog(title: string, text: string, buttons: DialogButton[], message?: string | null): TemplateResult {
  return html`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${title}</h3>
        <p>${text}</p>
        ${message ? html`<p class="muted">${message}</p>` : nothing}
        <div class="actions">
          ${buttons.map(b => html`<button class="btn${b.primary ? ' primary' : ''}" data-action=${b.action}
            ?disabled=${b.disabled ?? false} @click=${b.onClick}>${b.label}</button>`)}
        </div>
      </div>
    </div>`;
}

/** State and handlers of the panel's modal dialogs; renderActiveDialog renders the open one. */
export interface ActiveDialogOpts {
  dialog: Dialog | null;
  draft: Draft | null;
  planName: string;
  /** The rule a 'delete-rule' dialog asks about. */
  ruleName: string;
  saving: boolean;
  message: string | null;
  restore(d: Draft): void;
  discard(d: Draft): void;
  startNew(): void;
  confirmDelete(): void;
  confirmDeleteRule(): void;
  confirmSwitch(): void;
  overwrite(): void;
  saveAsNew(): void;
  /** Closes the dialog without a decision (every Cancel button and Escape). */
  close(): void;
}

export function renderActiveDialog(o: ActiveDialogOpts): TemplateResult | typeof nothing {
  const cancel = { action: 'cancel', label: t('action.cancel'), onClick: o.close };
  switch (o.dialog?.kind) {
    case 'restore': {
      const d = o.draft;
      if (!d) return nothing;
      return renderDialog(t('draft.title'), t('draft.text').replace('{time}', formatTime(d.savedAt)), [
        { action: 'restore', label: t('draft.restore'), primary: true, onClick: () => o.restore(d) },
        { action: 'discard', label: t('draft.discard'), onClick: () => o.discard(d) },
      ]);
    }
    case 'new':
      return renderDialog(t('new.title'), t('new.text'), [
        { action: 'new-discard', label: t('new.discard'), primary: true, onClick: o.startNew },
        { ...cancel, action: 'new-cancel' },
      ]);
    case 'delete':
      return renderDialog(t('delete.title'), t('delete.text').replace('{name}', o.planName), [
        { action: 'delete-confirm', label: t('delete.confirm'), primary: true, onClick: o.confirmDelete },
        { ...cancel, action: 'delete-cancel' },
      ]);
    case 'delete-rule':
      return renderDialog(t('delete.rule.title'), t('delete.rule.text').replace('{name}', o.ruleName), [
        { action: 'delete-rule-confirm', label: t('delete.confirm'), primary: true, onClick: o.confirmDeleteRule },
        { ...cancel, action: 'delete-rule-cancel' },
      ]);
    case 'switch':
      return renderDialog(t('switch.title'), t('switch.text'), [
        { action: 'switch-discard', label: t('switch.discard'), primary: true, onClick: o.confirmSwitch },
        { ...cancel, action: 'switch-cancel' },
      ]);
    case 'conflict':
    case 'conflict-again': {
      const again = o.dialog.kind === 'conflict-again';
      return renderDialog(t('conflict.title'), t(again ? 'conflict.again' : 'conflict.text'), [
        ...again ? [] : [{ action: 'overwrite', label: t('conflict.overwrite'), disabled: o.saving, onClick: o.overwrite }],
        { action: 'save-as-new', label: t('conflict.saveAsNew'), primary: true, disabled: o.saving, onClick: o.saveAsNew },
        cancel,
      ], o.message);
    }
    default:
      return nothing;
  }
}
