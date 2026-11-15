import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { Id, Level, Plan, Pt, WallType } from '../model/types';
import { WALL_PRESETS } from '../model/types';
import { deleteWall } from '../model/ops';
import { deleteOpening } from '../model/openings';
import { deleteDevice } from '../model/devices';
import { deleteZone } from '../model/zones';
import { History } from '../editor/history';
import { SaveController } from '../editor/save';
import type { Selection, Tool, ToolContext } from '../editor/tools/types';
import type { HassLike, PlanSummary } from '../api';
import { renderLevel } from '../render/plan-svg';
import { paletteFor } from '../render/theme';
import { t } from '../i18n';
import { renderToolRail, renderTopBar } from './toolbar';
import { createTool, selectionExists, toolIdsFor, type EditorMode, type ToolId } from './tool-factory';
import type { BoxMeasure } from './props-panel';
import { initialNext } from './next-object';
import { PlanSession } from './plan-session';
import { createToolContext } from './tool-context';
import { renderSide } from './side-panel';
import { initialNextProps } from './device-props';
import { renderStatusBar } from './statusbar';
import { renderTracker, trackerLive } from './tracker';
import { panelStyles, paletteVars } from './styles';
import { fitView, renderGrid, screenToMm, type View } from './viewport';
import { EditorInput } from './input';
import { createInputHost } from './input-host';
import { renderActiveDialog, renderDraftBanner } from './dialogs';
import { DraftStore, type Draft } from '../editor/draft';

export class PlanStudioPanel extends LitElement {
  static styles = panelStyles;

  @property({ attribute: false }) hass?: HassLike;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel: unknown;

  @state() plan: Plan | null = null;
  @state() loadError: string | null = null;
  @state() selection: Selection | null = null;
  @state() toolId: ToolId = 'select';
  @state() wallType: WallType = 'bearing';
  @state() thickness = WALL_PRESETS.bearing;
  @state() boxMeasure: BoxMeasure = 'inner';
  @state() grid = true;
  /** Plan / Equipment tab (per session, not saved); cones: device cones and zones are drawn. */
  @state() mode: EditorMode = 'plan';
  @state() private cones = true;
  /** "Next device" props per kind; they drive ctx.deviceDefaults. */
  @state() nextProps = initialNextProps();
  /** "Next object" parameters of the door / window / opening / zone tools. */
  @state() nextObj = initialNext();
  @state() view: View = { x: -1000, y: -1000, scale: 0.08 };
  @state() private size = { w: 0, h: 0 };
  @state() dialog: 'none' | 'conflict' | 'conflict-again' = 'none';
  @state() notice: string | null = null;
  /**
   * Local draft found on load, waiting for Restore / Discard. While it is undecided and belongs to the open
   * plan, no new draft is written under its key (that would overwrite it).
   */
  @state() pendingDraft: Draft | null = null;
  /** The modal restore prompt is shown; Escape hides it and leaves a non-modal banner instead. */
  @state() restoreOpen = false;
  /** Stored plans for the selector. */
  @state() plans: PlanSummary[] = [];
  /** Plan the user picked while the current one is dirty: waiting for confirmation. */
  @state() switchTo: Id | null = null;

  /** Confirmation for "New plan" (current plan is dirty) is open. */
  @state() newConfirm = false;
  /** Confirmation for "Delete plan" is open. */
  @state() deleteConfirm = false;
  /** A delete request is running. */
  @state() deleting = false;

  history: History<Level> | null = null;
  readonly save: SaveController;
  activeTool: Tool;
  loading = false;
  needFit = false;
  readonly drafts = new DraftStore();
  private readonly input: EditorInput;
  private resizeObs: ResizeObserver | null = null;
  readonly ctx: ToolContext;
  readonly session = new PlanSession(this);

  doSave(): Promise<void> { return this.session.doSave(); }

  constructor() {
    super();
    const self = this;
    // HA hands the panel a new hass object on every state change; always read the latest one.
    const hassProxy = {
      get connection() { return self.hass!.connection; },
    };
    this.save = new SaveController(hassProxy, () => {
      if (this.save.dirty && this.plan && !this.session.draftBlocked()) this.drafts.schedule(() => this.session.makeDraft());
      this.requestUpdate();
    });
    this.ctx = createToolContext(this);
    this.activeTool = createTool('select', this.ctx);
    const host = createInputHost(this);
    this.input = new EditorInput(host);
  }

  get uiLang(): string { return this.hass?.language ?? 'en'; }

  // ---- lifecycle ----

  private onBeforeUnload = (e: BeforeUnloadEvent) => {
    this.drafts.flush(); // the debounced draft must not be lost with the page
    if (!this.save.dirty) return;
    e.preventDefault();
    e.returnValue = '';
  };

  private onPageHide = () => { this.drafts.flush(); };

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    this.addEventListener('keydown', this.input.keyDown);
    this.addEventListener('keyup', this.input.keyUp);
    this.addEventListener('blur', this.input.blur);
    window.addEventListener('beforeunload', this.onBeforeUnload);
    window.addEventListener('pagehide', this.onPageHide);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.input.keyDown);
    this.removeEventListener('keyup', this.input.keyUp);
    this.removeEventListener('blur', this.input.blur);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    window.removeEventListener('pagehide', this.onPageHide);
    // In-app navigation removes the panel without beforeunload: keep dirty edits as a local draft.
    if (this.plan && this.save.dirty && !this.session.draftBlocked()) this.drafts.write(this.session.makeDraft());
    this.drafts.cancel();
    this.resizeObs?.disconnect();
    this.resizeObs = null;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass') && this.hass && !this.plan && !this.loading && !this.loadError) void this.session.load();
    if (this.needFit && this.size.w > 0 && this.size.h > 0) { this.needFit = false; this.fit(); }
  }

  protected updated(): void {
    const canvas = this.renderRoot.querySelector('.canvas');
    if (canvas && !this.resizeObs && typeof ResizeObserver !== 'undefined') {
      this.resizeObs = new ResizeObserver(entries => {
        const r = entries[0].contentRect;
        if (r.width !== this.size.w || r.height !== this.size.h) this.size = { w: r.width, h: r.height };
      });
      this.resizeObs.observe(canvas);
    }
  }

  // ---- editing ----

  commit(next: Level): void {
    if (!this.history) return;
    this.history.push(next);
    this.save.markDirty();
    if (this.selection && !selectionExists(next, this.selection)) { this.activeTool.cancel(); this.selection = null; }
    this.requestUpdate();
  }

  /** Commit from outside the tool that removes the selected element. */
  commitRemoval(next: Level): void {
    this.activeTool.cancel();
    this.selection = null;
    this.commit(next);
  }

  deleteSelection(): boolean {
    const s = this.selection;
    const level = this.history?.current;
    if (!s || !level || s.kind === 'node' || !selectionExists(level, s)) return false;
    this.commitRemoval(s.kind === 'wall' ? deleteWall(level, s.id) : s.kind === 'opening' ? deleteOpening(level, s.id)
      : s.kind === 'device' ? deleteDevice(level, s.id) : deleteZone(level, s.id));
    return true;
  }

  undo(): void { this.step(() => this.history?.undo() ?? null); }
  redo(): void { this.step(() => this.history?.redo() ?? null); }

  private step(op: () => Level | null): void {
    this.activeTool.cancel();
    this.selection = null;
    if (op()) this.save.markDirty();
    this.requestUpdate();
  }

  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(wt: WallType): void {
    this.wallType = wt;
  }

  pickTool(id: ToolId): void {
    this.activeTool.cancel();
    this.selection = null;
    this.notice = null;
    if (id === 'box') this.wallType = 'bearing';
    this.toolId = id;
    this.activeTool = createTool(id, this.ctx);
  }

  /** Plan / Equipment tab: cancels the tool, clears the selection, activates the tab's first tool. */
  setMode(mode: EditorMode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    this.pickTool(toolIdsFor(mode)[0]);
  }

  // ---- view / pointer ----

  private svgEl(): SVGSVGElement | null { return this.renderRoot.querySelector('svg.plan'); }

  toMm(e: { clientX: number; clientY: number }): Pt { return screenToMm(this.svgEl(), this.view, e); }

  private fit(): void { this.view = fitView(this.history?.current.nodes ?? [], this.size.w, this.size.h); }

  /**
   * After a chrome button is clicked, give focus back to the panel: otherwise Enter / Space typed for the
   * tracker would also activate the focused button.
   */
  private refocus = (e: Event) => {
    const el = e.composedPath()[0];
    if (el instanceof Element && el.closest('button')) this.focus();
  };

  /**
   * After a props-panel field commits (change event), hand focus back to the panel so editor
   * shortcuts (Ctrl+Z, Delete, typed lengths) work again without an extra click on the canvas.
   */
  private refocusAfterChange = (e: Event) => {
    const el = e.composedPath()[0];
    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
      el.blur();
      this.focus();
    }
  };

  // ---- render ----

  private renderDialog(): TemplateResult | typeof nothing {
    return renderActiveDialog({
      lang: this.uiLang, draft: this.pendingDraft, restoreOpen: this.restoreOpen, newConfirm: this.newConfirm,
      deleteConfirm: this.deleteConfirm, switchTo: this.switchTo, dialog: this.dialog, planName: this.plan?.name ?? '',
      saving: this.save.state === 'saving', message: this.save.errorMessage,
      restore: d => this.session.restoreDraft(d), discard: d => this.session.discardDraft(d), startNew: () => this.session.startNewPlan(),
      cancelNew: () => { this.newConfirm = false; }, confirmDelete: () => { void this.session.confirmDelete(); },
      cancelDelete: () => { this.deleteConfirm = false; }, confirmSwitch: () => this.session.confirmSwitch(),
      cancelSwitch: () => { this.switchTo = null; }, overwrite: () => this.session.doOverwrite(), saveAsNew: () => this.session.doSaveAsNew(),
      cancelConflict: () => { this.dialog = 'none'; },
    });
  }

  render() {
    const lang = this.uiLang;
    if (!this.plan || !this.history) {
      return html`<div class="center">${this.loadError
        ? html`<span>${t('load.error', lang)}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${t('action.retry', lang)}</button>`
        : t('load.loading', lang)}</div>`;
    }
    const pal = paletteFor(!!this.hass?.themes?.darkMode);
    const level = this.history.current;
    const preview = this.activeTool.preview();
    const { x, y, scale } = this.view;
    const w = Math.max(1, this.size.w) / scale, h = Math.max(1, this.size.h) / scale;
    const s = this.save;
    return html`
      <div class="ed" style=${paletteVars(pal)} @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${renderTopBar({
          lang, mode: this.mode, onMode: m => this.setMode(m), planName: this.plan.name, planId: this.plan.id, plans: this.session.planOptions(),
          canUndo: this.history.canUndo, canRedo: this.history.canRedo,
          saveState: s.state, dirty: s.dirty, errorMessage: s.errorMessage,
          lead: this.narrow ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : nothing,
          onRename: name => { this.plan = { ...this.plan!, name }; s.markDirty(); },
          onPickPlan: id => this.session.pickPlan(id),
          onNewPlan: () => this.session.requestNewPlan(), onDeletePlan: () => this.session.requestDelete(), busy: this.deleting,
          onUndo: () => this.undo(), onRedo: () => this.redo(), onSave: () => this.session.doSave(),
        })}
        ${renderToolRail(this.mode, this.toolId, lang, id => this.pickTool(id))}
        ${renderSide(this, level)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${x} ${y} ${w} ${h}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${pal.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(e: Event) => e.preventDefault()}>
            ${this.grid ? renderGrid(this.view, w, h, pal) : nothing}
            ${renderLevel(level, { palette: pal, selection: this.selection, preview, scale, lang, mode: this.mode, showCones: this.cones })}
            ${preview.tracker ? renderTracker(preview.tracker, {
              palette: pal, scale, lang, mode: this.toolId === 'box' ? 'box' : 'wall',
              live: trackerLive(preview, this.toolId === 'box' ? 'box' : 'wall', this.boxMeasure, this.thickness),
            }) : nothing}
          </svg>
          ${this.pendingDraft && !this.restoreOpen ? renderDraftBanner({
            lang, savedAt: this.pendingDraft.savedAt,
            onRestore: () => this.session.restoreDraft(this.pendingDraft!), onDiscard: () => this.session.discardDraft(this.pendingDraft!),
          }) : nothing}
        </div>
        ${renderStatusBar({
          lang, grid: this.grid, zoomPct: Math.round(scale * 1000),
          snap: preview.snap && preview.snap.kind !== 'none' ? t(`snap.${preview.snap.kind}`, lang) : null,
          onGrid: on => { this.grid = on; }, cones: this.cones, onCones: on => { this.cones = on; },
        })}
        ${this.renderDialog()}
      </div>`;
  }
}

if (!customElements.get('plan-studio-panel')) customElements.define('plan-studio-panel', PlanStudioPanel);

declare global {
  interface HTMLElementTagNameMap { 'plan-studio-panel': PlanStudioPanel }
}
