import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { Id, Level, Plan, Pt, WallType } from '../model/types';
import { WALL_PRESETS, emptyPlan, normalizeLevel } from '../model/types';
import { newId } from '../model/ids';
import { deleteWall } from '../model/ops';
import { deleteOpening } from '../model/openings';
import { deleteZone } from '../model/zones';
import { History } from '../editor/history';
import { SaveController } from '../editor/save';
import { createSelectTool } from '../editor/tools/select-tool';
import { createBoxTool } from '../editor/tools/box-tool';
import { createWallTool } from '../editor/tools/wall-tool';
import { createOpeningTool } from '../editor/tools/opening-tool';
import { createZoneTool } from '../editor/tools/zone-tool';
import type { Selection, Tool, ToolContext } from '../editor/tools/types';
import { deletePlan, getPlan, listPlans, type HassLike, type PlanSummary } from '../api';
import { paletteFor, renderLevel } from '../render/plan-svg';
import { t } from '../i18n';
import { renderToolRail, renderTopBar, type ToolId } from './toolbar';
import { renderProps, type BoxMeasure } from './props-panel';
import { renderStatusBar } from './statusbar';
import { renderTracker, trackerLive } from './tracker';
import { panelStyles, paletteVars } from './styles';
import { fitView, renderGrid, screenToMm, type View } from './viewport';
import { EditorInput, type InputHost } from './input';
import { renderConflictDialog, renderDeleteDialog, renderDraftBanner, renderNewPlanDialog, renderRestoreDialog, renderSwitchDialog } from './dialogs';
import { DraftStore, type Draft } from '../editor/draft';

const EMPTY_LEVEL: Level = { id: '', name: '', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };

function exists(level: Level, s: Selection): boolean {
  const list = s.kind === 'wall' ? level.walls : s.kind === 'node' ? level.nodes
    : s.kind === 'opening' ? level.openings : level.zones;
  return list.some(x => x.id === s.id);
}

function errorText(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return String(err);
}

export class PlanStudioPanel extends LitElement {
  static styles = panelStyles;

  @property({ attribute: false }) hass?: HassLike;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel: unknown;

  @state() plan: Plan | null = null;
  @state() private loadError: string | null = null;
  @state() selection: Selection | null = null;
  @state() toolId: ToolId = 'select';
  @state() wallType: WallType = 'bearing';
  @state() thickness = WALL_PRESETS.bearing;
  @state() private boxMeasure: BoxMeasure = 'inner';
  @state() private grid = true;
  @state() private view: View = { x: -1000, y: -1000, scale: 0.08 };
  @state() private size = { w: 0, h: 0 };
  @state() private dialog: 'none' | 'conflict' | 'conflict-again' = 'none';
  @state() private notice: string | null = null;
  /**
   * Local draft found on load, waiting for Restore / Discard. While it is undecided and belongs to the open
   * plan, no new draft is written under its key (that would overwrite it).
   */
  @state() private pendingDraft: Draft | null = null;
  /** The modal restore prompt is shown; Escape hides it and leaves a non-modal banner instead. */
  @state() private restoreOpen = false;
  /** Stored plans for the selector. */
  @state() private plans: PlanSummary[] = [];
  /** Plan the user picked while the current one is dirty: waiting for confirmation. */
  @state() private switchTo: Id | null = null;

  /** Confirmation for "New plan" (current plan is dirty) is open. */
  @state() private newConfirm = false;
  /** Confirmation for "Delete plan" is open. */
  @state() private deleteConfirm = false;
  /** A delete request is running. */
  @state() private deleting = false;

  history: History<Level> | null = null;
  readonly save: SaveController;
  activeTool: Tool;
  private loading = false;
  private needFit = false;
  readonly drafts = new DraftStore();
  private readonly input: EditorInput;
  private resizeObs: ResizeObserver | null = null;
  private readonly ctx: ToolContext;

  constructor() {
    super();
    const self = this;
    // HA hands the panel a new hass object on every state change; always read the latest one.
    const hassProxy: HassLike = {
      get connection() { return self.hass!.connection; },
      get language() { return self.uiLang; },
      get themes() { return self.hass?.themes; },
    };
    this.save = new SaveController(hassProxy, () => {
      if (this.save.dirty && this.plan && !this.draftBlocked()) this.drafts.schedule(() => this.makeDraft());
      this.requestUpdate();
    });
    this.ctx = {
      level: () => this.history?.current ?? EMPTY_LEVEL,
      commit: next => this.commit(next),
      tolMm: () => 10 / this.view.scale,
      grid: () => (this.grid ? 100 : null),
      wallProps: () => ({ type: this.wallType, thickness: this.thickness, baseline: 'center' }),
      boxMeasure: () => this.boxMeasure,
      select: s => { this.selection = s; this.notice = null; },
      lang: () => this.uiLang,
    };
    this.activeTool = this.makeTool('select');
    const host: InputHost = {
      tool: () => this.activeTool,
      get view() { return self.view; },
      set view(v: View) { self.view = v; },
      ready: () => !!this.history,
      modal: () => this.restoreOpen || this.dialog !== 'none' || this.switchTo !== null
        || this.newConfirm || this.deleteConfirm,
      // Escape on the restore prompt = decide later: the draft is kept and a banner keeps offering it.
      closeModal: () => { this.restoreOpen = false; this.dialog = 'none'; this.switchTo = null;
        this.newConfirm = false; this.deleteConfirm = false; },
      toMm: e => this.toMm(e),
      focus: () => this.focus(),
      update: () => this.requestUpdate(),
      undo: () => this.undo(),
      redo: () => this.redo(),
      save: () => { void this.doSave(); },
      deleteSelection: () => this.deleteSelection(),
      clearSelection: () => { this.activeTool.cancel(); this.selection = null; },
    };
    this.input = new EditorInput(host);
  }

  private get uiLang(): string { return this.hass?.language ?? 'en'; }

  private makeTool(id: ToolId): Tool {
    switch (id) {
      case 'box': return createBoxTool(this.ctx);
      case 'wall': return createWallTool(this.ctx);
      case 'door': case 'window': case 'opening': return createOpeningTool(this.ctx, id);
      case 'zone': return createZoneTool(this.ctx);
      default: return createSelectTool(this.ctx);
    }
  }

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
    if (this.plan && this.save.dirty && !this.draftBlocked()) this.drafts.write(this.makeDraft());
    this.drafts.cancel();
    this.resizeObs?.disconnect();
    this.resizeObs = null;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass') && this.hass && !this.plan && !this.loading && !this.loadError) void this.load();
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

  async load(): Promise<void> {
    if (!this.hass) return;
    this.loading = true;
    this.loadError = null;
    try {
      const list = await listPlans(this.hass);
      this.plans = list;
      if (list.length === 0) {
        this.save.reset(null);
        this.adopt(emptyPlan(t('plan.default', this.uiLang)));
        this.offerDraft(this.drafts.latest());
      } else {
        // Prefer the plan opened / saved last (e.g. one saved as new), else the first one.
        const last = this.drafts.lastPlanId();
        await this.openPlan(list.some(p => p.id === last) ? last! : list[0].id);
      }
    } catch (err) {
      this.loadError = errorText(err);
    } finally {
      this.loading = false;
    }
  }

  /** Loads a stored plan from the server and makes it the open one. */
  private async openPlan(id: Id): Promise<void> {
    const plan = await getPlan(this.hass!, id);
    this.drafts.cancel();
    this.save.reset(plan.revision);
    this.adopt(plan);
    this.drafts.setLastPlanId(plan.id);
    this.offerDraft(this.drafts.read(plan.id));
  }

  private offerDraft(d: Draft | null): void {
    this.pendingDraft = d;
    this.restoreOpen = !!d;
  }

  private async refreshPlans(): Promise<void> {
    if (!this.hass) return;
    try { this.plans = await listPlans(this.hass); } catch { /* keep the old list */ }
  }

  /** Options of the plan selector: stored plans plus the open (maybe unsaved or renamed) one. */
  private planOptions(): { id: Id; name: string }[] {
    const cur = this.plan!;
    const opts = this.plans.map(p => ({ id: p.id, name: p.id === cur.id ? cur.name : p.name }));
    if (!opts.some(p => p.id === cur.id)) opts.push({ id: cur.id, name: cur.name });
    return opts;
  }

  private pickPlan(id: Id): void {
    if (!this.plan || id === this.plan.id || this.save.state === 'saving') return;
    if (this.save.dirty) { this.switchTo = id; return; }
    void this.switchPlan(id);
  }

  private async switchPlan(id: Id): Promise<void> {
    try {
      await this.openPlan(id);
    } catch (err) {
      this.notice = errorText(err);
    }
  }

  /** "Discard and open": drop the unsaved edits (and their draft, unless it is an undecided older one). */
  private confirmSwitch(): void {
    const id = this.switchTo;
    this.switchTo = null;
    if (!id || !this.plan) return;
    this.drafts.cancel();
    if (!this.draftBlocked()) this.drafts.clear(this.plan.id);
    void this.switchPlan(id);
  }

  // ---- new / delete ----

  private busy(): boolean { return this.save.state === 'saving' || this.deleting; }

  private requestNewPlan(): void {
    if (!this.plan || this.busy()) return;
    if (this.save.dirty) { this.newConfirm = true; return; }
    this.startNewPlan();
  }

  /** Replaces the open plan with a fresh unsaved one (tool, selection and history are reset by adopt). */
  private startNewPlan(): void {
    this.newConfirm = false;
    this.drafts.cancel();
    if (this.plan && !this.draftBlocked()) this.drafts.clear(this.plan.id);
    this.openFresh();
  }

  private openFresh(): void {
    this.toolId = 'select';
    this.notice = null;
    this.save.reset(null);
    this.adopt(emptyPlan(t('plan.default', this.uiLang)));
    this.offerDraft(null);
  }

  private requestDelete(): void {
    if (!this.plan || this.busy()) return;
    this.deleteConfirm = true;
  }

  private async confirmDelete(): Promise<void> {
    this.deleteConfirm = false;
    const plan = this.plan;
    if (!plan || !this.hass || this.busy()) return;
    this.deleting = true;
    try {
      if (this.save.baseRevision !== null) {
        try {
          await deletePlan(this.hass, plan.id);
        } catch (err) {
          this.save.state = 'error';
          this.save.errorMessage = errorText(err);
          return;
        }
      }
      this.drafts.cancel();
      this.drafts.clear(plan.id);
      this.drafts.clearLastPlanId(plan.id);
      if (this.pendingDraft?.planId === plan.id) this.offerDraft(null);
      let list: PlanSummary[] = [];
      try { list = await listPlans(this.hass); this.plans = list; } catch { list = []; }
      const next = list.find(x => x.id !== plan.id);
      if (next) {
        try { await this.openPlan(next.id); return; } catch (err) { this.notice = errorText(err); }
      }
      this.openFresh();
    } finally {
      this.deleting = false;
    }
  }

  private adopt(input: Plan): void {
    // A plan without levels (foreign or hand-edited data) gets one empty floor instead of crashing the editor.
    const plan: Plan = Array.isArray(input.levels) && input.levels.length > 0 ? input : {
      ...input,
      levels: [{ id: newId(), name: 'Level 1', kind: 'floor', order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] }],
    };
    this.plan = { ...plan, levels: plan.levels.map(normalizeLevel) };
    this.history = new History<Level>(this.plan.levels[0]);
    this.activeTool.cancel();
    this.activeTool = this.makeTool(this.toolId);
    this.selection = null;
    this.needFit = true;
  }

  // ---- local draft ----

  private makeDraft(): Draft {
    return { planId: this.plan!.id, baseRevision: this.save.baseRevision, plan: this.currentPlan(), savedAt: Date.now() };
  }

  /** True while an undecided draft of the open plan must not be overwritten. */
  private draftBlocked(): boolean {
    return !!this.pendingDraft && !!this.plan && this.pendingDraft.planId === this.plan.id;
  }

  private restoreDraft(d: Draft): void {
    this.pendingDraft = null;
    this.restoreOpen = false;
    this.adopt(d.plan);
    this.save.baseRevision = d.baseRevision;
    this.save.markDirty(); // the next save goes through the normal revision / conflict flow
  }

  private discardDraft(d: Draft): void {
    this.pendingDraft = null;
    this.restoreOpen = false;
    this.drafts.clear(d.planId);
    // Edits made while the decision was pending are drafted from now on.
    if (this.save.dirty && this.plan) this.drafts.schedule(() => this.makeDraft());
  }

  /** After a successful save: drop drafts of the given ids unless edits made meanwhile keep the plan dirty. */
  private afterSaved(...ids: string[]): void {
    if (this.save.state !== 'saved') return;
    this.drafts.setLastPlanId(this.plan!.id);
    void this.refreshPlans();
    this.drafts.cancel();
    // An undecided older draft stays until the user restores or discards it.
    for (const id of ids) if (this.pendingDraft?.planId !== id) this.drafts.clear(id);
    if (this.save.dirty && !this.draftBlocked()) this.drafts.schedule(() => this.makeDraft());
  }

  // ---- editing ----

  private commit(next: Level): void {
    if (!this.history) return;
    this.history.push(next);
    this.save.markDirty();
    if (this.selection && !exists(next, this.selection)) { this.activeTool.cancel(); this.selection = null; }
    this.requestUpdate();
  }

  /** Commit from outside the tool that removes the selected element. */
  private commitRemoval(next: Level): void {
    this.activeTool.cancel();
    this.selection = null;
    this.commit(next);
  }

  private deleteSelection(): boolean {
    const s = this.selection;
    const level = this.history?.current;
    if (!s || !level || s.kind === 'node' || !exists(level, s)) return false;
    this.commitRemoval(s.kind === 'wall' ? deleteWall(level, s.id) : s.kind === 'opening' ? deleteOpening(level, s.id)
      : deleteZone(level, s.id));
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

  /** Wall type for the next wall; the thickness follows the type preset. */
  setWallType(wt: WallType): void {
    this.wallType = wt;
    this.thickness = WALL_PRESETS[wt];
  }

  pickTool(id: ToolId): void {
    this.activeTool.cancel();
    this.selection = null;
    this.notice = null;
    if (id === 'box') { this.wallType = 'bearing'; this.thickness = WALL_PRESETS.bearing; }
    this.toolId = id;
    this.activeTool = this.makeTool(id);
  }

  // ---- saving ----

  private currentPlan(): Plan {
    const plan = this.plan!;
    const levels = plan.levels.map((l, i) => (i === 0 ? this.history!.current : l));
    return { ...plan, levels, revision: this.save.baseRevision ?? 0 };
  }

  async doSave(): Promise<void> {
    if (!this.plan || this.save.state === 'saving') return;
    await this.save.save(this.currentPlan());
    this.afterSaved(this.plan.id);
    if (this.save.state === 'conflict') this.dialog = 'conflict';
  }

  private async doOverwrite(): Promise<void> {
    if (!this.plan || this.save.state === 'saving') return;
    await this.save.overwrite(this.currentPlan());
    this.afterSaved(this.plan.id);
    // A second conflict (e.g. the plan was deleted elsewhere) leaves only "Save as new".
    this.dialog = this.save.state === 'conflict' ? 'conflict-again' : 'none';
  }

  private async doSaveAsNew(): Promise<void> {
    if (!this.plan || this.save.state === 'saving') return;
    const name = `${this.plan.name} ${t('plan.copySuffix', this.uiLang)}`;
    const oldId = this.plan.id;
    const res = await this.save.saveAsNew(this.currentPlan(), name);
    if (res) { this.plan = res; this.dialog = 'none'; this.afterSaved(oldId, res.id); } else if (this.save.state === 'error') this.dialog = 'none';
  }

  // ---- view / pointer ----

  private svgEl(): SVGSVGElement | null { return this.renderRoot.querySelector('svg.plan'); }

  private toMm(e: { clientX: number; clientY: number }): Pt { return screenToMm(this.svgEl(), this.view, e); }

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
    const d = this.pendingDraft;
    if (d && this.restoreOpen) {
      return renderRestoreDialog({
        lang: this.uiLang, savedAt: d.savedAt, onRestore: () => this.restoreDraft(d), onDiscard: () => this.discardDraft(d),
      });
    }
    if (this.newConfirm) {
      return renderNewPlanDialog({
        lang: this.uiLang, onDiscard: () => this.startNewPlan(), onCancel: () => { this.newConfirm = false; },
      });
    }
    if (this.deleteConfirm) {
      return renderDeleteDialog({
        lang: this.uiLang, name: this.plan?.name ?? '',
        onDelete: () => { void this.confirmDelete(); }, onCancel: () => { this.deleteConfirm = false; },
      });
    }
    if (this.switchTo) {
      return renderSwitchDialog({
        lang: this.uiLang, onDiscard: () => this.confirmSwitch(), onCancel: () => { this.switchTo = null; },
      });
    }
    if (this.dialog === 'none') return nothing;
    return renderConflictDialog({
      lang: this.uiLang, mode: this.dialog === 'conflict' ? 'conflict' : 'again',
      busy: this.save.state === 'saving', message: this.save.errorMessage,
      onOverwrite: () => this.doOverwrite(), onSaveAsNew: () => this.doSaveAsNew(),
      onCancel: () => { this.dialog = 'none'; },
    });
  }

  render() {
    const lang = this.uiLang;
    if (!this.plan || !this.history) {
      return html`<div class="center">${this.loadError
        ? html`<span>${t('load.error', lang)}: ${this.loadError}</span>
            <button @click=${() => this.load()}>${t('action.retry', lang)}</button>`
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
          lang, planName: this.plan.name, planId: this.plan.id, plans: this.planOptions(), wallType: this.wallType, thickness: this.thickness,
          canUndo: this.history.canUndo, canRedo: this.history.canRedo,
          saveState: s.state, dirty: s.dirty, errorMessage: s.errorMessage,
          lead: this.narrow ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : nothing,
          onRename: name => { this.plan = { ...this.plan!, name }; s.markDirty(); },
          onPickPlan: id => this.pickPlan(id),
          onNewPlan: () => this.requestNewPlan(), onDeletePlan: () => this.requestDelete(), busy: this.deleting,
          onWallType: wt => this.setWallType(wt),
          onThickness: mm => { this.thickness = mm; },
          onUndo: () => this.undo(), onRedo: () => this.redo(), onSave: () => this.doSave(),
        })}
        ${renderToolRail(this.toolId, lang, id => this.pickTool(id))}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${x} ${y} ${w} ${h}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${pal.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(e: Event) => e.preventDefault()}>
            ${this.grid ? renderGrid(this.view, w, h, pal) : nothing}
            ${renderLevel(level, { palette: pal, selection: this.selection, preview, scale, lang })}
            ${preview.tracker ? renderTracker(preview.tracker, {
              palette: pal, scale, lang, mode: this.toolId === 'box' ? 'box' : 'wall',
              live: trackerLive(preview, this.toolId === 'box' ? 'box' : 'wall', this.boxMeasure, this.thickness),
            }) : nothing}
          </svg>
          ${this.pendingDraft && !this.restoreOpen ? renderDraftBanner({
            lang, savedAt: this.pendingDraft.savedAt,
            onRestore: () => this.restoreDraft(this.pendingDraft!), onDiscard: () => this.discardDraft(this.pendingDraft!),
          }) : nothing}
        </div>
        ${renderProps({
          level, selection: this.selection, tool: this.toolId, boxMeasure: this.boxMeasure, lang, notice: this.notice,
          wallType: this.wallType, thickness: this.thickness,
          setWallType: wt => this.setWallType(wt), setThickness: mm => { this.thickness = mm; },
          commit: next => this.commit(next), remove: next => this.commitRemoval(next),
          setBoxMeasure: m => { this.boxMeasure = m; }, setNotice: msg => { this.notice = msg; },
        })}
        ${renderStatusBar({
          lang, grid: this.grid, zoomPct: Math.round(scale * 1000),
          snap: preview.snap && preview.snap.kind !== 'none' ? t(`snap.${preview.snap.kind}`, lang) : null,
          onGrid: on => { this.grid = on; },
        })}
        ${this.renderDialog()}
      </div>`;
  }
}

if (!customElements.get('plan-studio-panel')) customElements.define('plan-studio-panel', PlanStudioPanel);

declare global {
  interface HTMLElementTagNameMap { 'plan-studio-panel': PlanStudioPanel }
}
