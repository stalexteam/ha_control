import { LitElement, css, html, svg, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, state } from 'lit/decorators.js';
import { t } from '../i18n';

/** One row: the value it picks, its two text lines and the lower-case text the search matches. */
export interface ComboRow { id: string; name: string; context: string; search: string }
interface Shown<R> { rows: R[]; more: boolean }

const MAX_ROWS = 100;
let nextUid = 0;

/** A 24x24 icon from a bundled MDI path, so the comboboxes need no icon font. */
export const mdiIcon = (path: string): TemplateResult =>
  html`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${svg`<path d=${path}></path>`}</svg>`;

/**
 * Searchable combobox laid out like Home Assistant's pickers: a closed box (icon, text, clear button when a value
 * is set, caret) and, open, a search field above a listbox of at most 100 rows. Keyboard: Enter / Space / ArrowDown
 * open; arrows move; Enter picks; Esc closes; focus returns to the box. Subclasses supply the rows, cached while
 * `rowDeps()` keep their identity and the query is unchanged, and how the box and a row look.
 * Fires `value-changed` ({ value }).
 */
export abstract class ComboBase<R extends ComboRow = ComboRow> extends LitElement {
  @property() value: string | null = null;
  @property() label = '';
  @state() private isOpen = false;
  @state() private query = '';
  @state() private active = 0;
  private readonly uid = `psc${nextUid++}`;
  private shown: { deps: readonly unknown[]; value: Shown<R> } | null = null;

  /** Inputs of the row list, compared by identity. */
  protected abstract rowDeps(): readonly unknown[];
  /** All rows in display order; read lazily, so an empty search stops after 101 rows. */
  protected abstract allRows(): Iterable<R>;
  /** Icon and text of the closed box. */
  protected abstract renderBox(): TemplateResult;
  /** Icon, text and side column of one row. */
  protected abstract renderRow(row: R): TemplateResult;
  /** Placeholder of the search field, and the listbox label when `label` is empty. */
  protected abstract searchLabel(): string;
  /** Text shown when no row matches. */
  protected abstract emptyText(): string;

  private readonly onOutside = (e: Event): void => {
    if (!e.composedPath().includes(this)) this.close();
  };

  static styles = css`
    :host {
      display: block; position: relative;
      --c-text: var(--primary-text-color, #e8eaed);
      --c-muted: var(--secondary-text-color, #9aa3b2);
      --c-divider: var(--divider-color, #2c313a);
      --c-surface: var(--card-background-color, #1c1f26);
      --c-primary: var(--primary-color, #03a9f4);
      --c-hover: rgba(var(--rgb-primary-color, 3, 169, 244), .08);
      --c-tint: rgba(var(--rgb-primary-color, 3, 169, 244), .16);
    }
    .field { display: flex; align-items: center; background: var(--c-surface); border-bottom: 1px solid var(--c-muted); border-radius: 6px 6px 0 0; padding-right: 6px; }
    .field:hover { background: var(--c-hover); }
    .cbox { flex: 1; min-width: 0; display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 6px; padding: 8px 4px 8px 10px; cursor: pointer; min-height: 52px; color: var(--c-text); }
    .cbox:focus-visible, .x:focus-visible { outline: 2px solid var(--c-primary); outline-offset: -2px; }
    .ico { width: 22px; height: 22px; fill: var(--c-muted); }
    .cbox b, .opt b { display: block; font-weight: 500; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cbox small, .opt small { display: block; color: var(--c-muted); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ph { color: var(--c-muted); }
    .x, .car { color: var(--c-muted); padding: 2px 4px; font-size: 16px; background: none; border: 0; font-family: inherit; cursor: pointer; }
    .x:hover { color: var(--c-text); }
    .drop { position: absolute; z-index: 30; left: 0; right: 0; top: calc(100% + 4px); background: var(--c-surface); color: var(--c-text); border-radius: 8px; box-shadow: 0 8px 28px rgba(0, 0, 0, .45); overflow: hidden; }
    .srch { margin: 10px; display: flex; align-items: center; gap: 8px; border: 1px solid var(--c-muted); border-radius: 8px; padding: 7px 10px; }
    .srch:focus-within { border-color: var(--c-primary); }
    .srch input { flex: 1; min-width: 0; background: none; border: 0; color: var(--c-text); font: inherit; outline: none; }
    .opts { max-height: 300px; overflow: auto; border-top: 1px solid var(--c-divider); }
    .opt { display: grid; grid-template-columns: 28px 1fr auto; gap: 8px; align-items: center; padding: 9px 12px; border-bottom: 1px solid var(--c-divider); cursor: pointer; }
    .opt:hover { background: var(--c-hover); }
    .opt.on { background: var(--c-tint); }
    .side { text-align: right; font-size: 12.5px; color: var(--c-muted); }
    .hint { padding: 8px 12px; color: var(--c-muted); font-size: 12.5px; }
    .empty { padding: 12px; color: var(--c-muted); }
  `;

  connectedCallback(): void { super.connectedCallback(); document.addEventListener('pointerdown', this.onOutside, true); }
  disconnectedCallback(): void { document.removeEventListener('pointerdown', this.onOutside, true); super.disconnectedCallback(); }

  private close(): void { if (this.isOpen) { this.isOpen = false; this.query = ''; } }

  private openList(): void {
    this.isOpen = true; this.query = ''; this.active = 0;
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>('.srch input')?.focus());
  }

  private pick(value: string | null): void {
    this.close();
    this.focusBox();
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value }, bubbles: true, composed: true }));
  }

  /** Search runs over all rows; at most MAX_ROWS are rendered. Cached per row inputs and query. */
  private filtered(): Shown<R> {
    const deps = [...this.rowDeps(), this.query.trim().toLowerCase()];
    const c = this.shown;
    if (c && c.deps.length === deps.length && c.deps.every((d, i) => d === deps[i])) return c.value;
    const q = deps[deps.length - 1] as string;
    const rows: R[] = [];
    let more = false;
    for (const r of this.allRows()) {
      if (q && !r.search.includes(q)) continue;
      if (rows.length === MAX_ROWS) { more = true; break; }
      rows.push(r);
    }
    const value = { rows, more };
    this.shown = { deps, value };
    return value;
  }

  private optId(i: number): string { return `${this.uid}-opt-${i}`; }

  /** The active row index kept inside the rows (the rows can shrink while the list is open). */
  private clamped(rows: readonly R[]): number { return Math.min(this.active, Math.max(rows.length - 1, 0)); }

  private onSearchKey(e: KeyboardEvent): void {
    const { rows } = this.filtered();
    if (e.key === 'ArrowDown') { e.preventDefault(); this.active = Math.max(0, Math.min(this.active + 1, rows.length - 1)); this.scrollActive(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.active = Math.max(this.active - 1, 0); this.scrollActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); const r = rows[this.clamped(rows)]; if (r) this.pick(r.id); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this.close(); this.focusBox(); }
  }

  private onFocusOut(e: FocusEvent): void {
    const to = e.relatedTarget as Node | null;
    if (this.isOpen && !(to && this.shadowRoot?.contains(to))) this.close();
  }

  private scrollActive(): void {
    void this.updateComplete.then(() => (this.renderRoot.querySelector('.opt.on') as HTMLElement | null)?.scrollIntoView?.({ block: 'nearest' }));
  }

  private focusBox(): void { void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.cbox')?.focus()); }

  private onBoxKey(e: KeyboardEvent): void {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); this.openList(); }
  }

  private renderClosed(): TemplateResult {
    return html`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? 'true' : 'false'}
        aria-controls=${`${this.uid}-lb`} aria-label=${ifDefined(this.label || undefined)} @click=${() => (this.isOpen ? this.close() : this.openList())} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? html`<button class="x" type="button" title=${t('combo.clear')} aria-label=${t('combo.clear')}
          @click=${() => this.pick(null)}>✕</button>` : nothing}</div>`;
  }

  private renderDrop(): TemplateResult {
    const { rows, more } = this.filtered();
    const active = this.clamped(rows);
    return html`<div class="drop" @pointerdown=${(e: Event) => { if ((e.target as HTMLElement).tagName !== 'INPUT') e.preventDefault(); }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${ifDefined(rows.length ? this.optId(active) : undefined)}
        .value=${this.query} @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; this.active = 0; }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${rows.map((r, i) => html`<div class="opt ${i === active ? 'on' : ''}" id=${this.optId(i)} role="option"
            aria-selected=${r.id === this.value ? 'true' : 'false'} data-id=${r.id}
            @click=${() => this.pick(r.id)} @pointerenter=${() => { this.active = i; }}>${this.renderRow(r)}</div>`)}
      </div>
      ${rows.length === 0 ? html`<div class="empty">${this.emptyText()}</div>` : nothing}
      ${more ? html`<div class="hint">${t('combo.more')}</div>` : nothing}
    </div>`;
  }

  render(): TemplateResult {
    return html`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : nothing}</div>`;
  }
}
