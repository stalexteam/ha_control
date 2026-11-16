import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { BindingRole, Device, Id, Level, Plan, Pt, WallType } from '../model/types';
import { WALL_PRESETS } from '../model/types';
import { deleteWall } from '../model/ops';
import { deleteOpening } from '../model/openings';
import { deleteZone } from '../model/zones';
import { zoneLabelPoints } from '../geometry/zones';
import { bindingStatus, type BindStatus } from '../model/bindings';
import { presence } from '../binding/ha-meta';
import { devicePose } from '../geometry/devices';
import { History } from '../editor/history';
import {
  defaultPower, deleteBlock, deleteDeviceDoc, deleteWire, pruneLevelDevices, type PlanDoc, type Position, type PowerSchema,
} from '../model/power';
import { schemaBounds } from '../geometry/power';
import { SaveController } from '../editor/save';
import type { Selection, Tool, ToolContext } from '../editor/tools/types';
import type { HassLike, PlanSummary } from '../api';
import { renderLevel } from '../render/plan-svg';
import { renderPower } from '../render/power-svg';
import { paletteFor } from '../render/theme';
import { t } from '../i18n';
import { messageOf } from '../errors';
import { renderTopBar } from './toolbar';
import { renderSteps } from './steps';
import { nextUnbound, type ListFilter } from './binding-list';
import { createTool, selectionExists, toolIdsFor, type EditorMode, type ToolId } from './tool-factory';
import type { BoxMeasure } from './props-panel';
import { initialNext } from './next-object';
import { PlanSession } from './plan-session';
import { MetaSource } from './meta-source';
import { createToolContext } from './tool-context';
import { renderRail, renderSide } from './side-panel';
import { initialNextProps } from './device-props';
import { renderStatusBar } from './statusbar';
import { renderTracker, trackerLive } from './tracker';
import { panelStyles, paletteVars } from './styles';
import { fitRect, fitView, renderGrid, revealPt, screenToMm, type View } from './viewport';
import { EditorInput } from './input';
import { renderActiveDialog, renderDraftBanner, type Dialog } from './dialogs';
import { DraftStore, type Draft } from '../editor/draft';
import { ContainerFeed } from '../live/container-feed';
import { PowerFeed, powerPayload } from '../live/power-feed';

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
  /** Wizard step: Plan / Equipment / Binding / Power (per session, not saved); cones: device cones and zones are drawn. */
  @state() mode: EditorMode = 'plan';
  /** Binding step device list: Not bound / Bound / All and the text filter. */
  @state() bindFilter: ListFilter = 'unbound';
  @state() bindQuery = '';
  /** Binding step: the device list rail is folded to a strip; "Show all" per role (both per session). */
  @state() railCollapsed = false;
  @state() showAll: Partial<Record<BindingRole, boolean>> = {};
  /** Plan step zone list text filter (per session). */
  @state() zoneQuery = '';
  @state() private cones = true;
  /** "Next device" props per kind; they drive ctx.deviceDefaults. */
  @state() nextProps = initialNextProps();
  /** "Next object" parameters of the door / window / opening / zone tools. */
  @state() nextObj = initialNext();
  /** The plan's view (mm) and the power schematic's own view (units: 1 unit = 1 screen px at scale 1). */
  @state() planView: View = { x: -1000, y: -1000, scale: 0.08 };
  @state() powerView: View = { x: -40, y: -40, scale: 1 };
  /** Power step: the device the Device tool places next (armed in the device list); null when none. */
  @state() placeDeviceId: Id | null = null;
  @state() private size = { w: 0, h: 0 };
  /** The open modal dialog; Escape closes it (the restore prompt then leaves a non-modal banner). */
  @state() dialog: Dialog | null = null;
  /** Error or warning text (field input, plan switch / open failures); shown in every step. */
  @state() notice: string | null = null;
  /** A rejected Binding field value (slot, window, event); cleared whenever a selection is made. */
  @state() fieldNotice: string | null = null;
  /**
   * Local draft found on load, waiting for Restore / Discard. While it is undecided and belongs to the open
   * plan, no new draft is written under its key (that would overwrite it).
   */
  @state() pendingDraft: Draft | null = null;
  /** Stored plans for the selector. */
  @state() plans: PlanSummary[] = [];
  /** A delete request is running. */
  @state() deleting = false;

  history: History<PlanDoc> | null = null;
  /** Schematic shown while the plan has none; made once per adopt, never saved until edited. */
  lazyPower: PowerSchema = defaultPower();
  readonly save: SaveController;
  activeTool: Tool;
  loading = false;
  needFit = false;
  /** The next entry to the Power step fits the schematic (set when a plan is adopted). */
  needPowerFit = false;
  readonly drafts = new DraftStore();
  private readonly input: EditorInput;
  private resizeObs: ResizeObserver | null = null;
  readonly ctx: ToolContext;
  readonly session = new PlanSession(this);
  /** HA states merged with the registries (loaded on the first entry to the Binding step). */
  readonly haMeta = new MetaSource(this);
  /** Live state of the open plan's input containers (subscribed while the panel is attached). */
  readonly feed = new ContainerFeed(this, () => this.hass?.connection);
  /** Live values of the schematic draft (subscribed only in the Power step of an attached panel). */
  readonly powerFeed = new PowerFeed(this, () => this.hass?.connection);

  /** Binding status of a device, from live states. Until the registries are loaded no entity is Missing (its presence is unknown). */
  readonly bindStatus = (d: Device): BindStatus => bindingStatus(d, eid => presence(this.haMeta.get(), eid, this.hass?.states));

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
    this.input = new EditorInput(this);
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
    this.feed.watch(this.plan?.id ?? null); // re-attached: subscribe again (no-op before the first load)
    this.watchPower();
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
    this.feed.stop();
    this.powerFeed.stop();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass') && this.hass && !this.plan && !this.loading && !this.loadError) void this.session.load();
    const sized = this.size.w > 0 && this.size.h > 0;
    if (this.needFit && sized) { this.needFit = false; this.fit(); }
    if (this.needPowerFit && sized && this.mode === 'power') { this.needPowerFit = false; this.fitPower(); }
    // A detached panel still updates when handed a new hass: it keeps no subscription until it is attached again.
    this.feed.watch(this.isConnected ? this.plan?.id ?? null : null);
    this.watchPower();
  }

  /** The power feed carries the draft schematic; it is idle outside the Power step and while detached. */
  private watchPower(): void {
    const level = this.isConnected && this.mode === 'power' ? this.level : null;
    this.powerFeed.watch(level && this.plan ? this.plan.id : null, level ? powerPayload(this.power, level) : null);
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

  get level(): Level | null { return this.history?.current.level ?? null; }

  get power(): PowerSchema { return this.history?.current.power ?? this.lazyPower; }

  /**
   * Pushes a level edit; `power` joins the same undo step when the edit changed the schematic too. Without `power`, a
   * stored schematic loses the wires on ports its device blocks no longer have (a wall delete took an inverter); the
   * lazy default is never written.
   */
  commit(next: Level, power?: PowerSchema): void {
    if (!this.history) return;
    const stored = this.history.current.power;
    const p = power ?? (stored && pruneLevelDevices(stored, next));
    this.history.push({ ...this.history.current, level: next, ...(p && p !== this.power ? { power: p } : {}) });
    this.save.markDirty();
    this.dropStaleSelection();
    this.requestUpdate();
  }

  commitPower(next: PowerSchema): void {
    if (!this.history) return;
    this.history.push({ ...this.history.current, power: next });
    this.save.markDirty();
    this.dropStaleSelection();
    this.requestUpdate();
  }

  private dropStaleSelection(): void {
    if (this.history && this.selection && !selectionExists(this.history.current.level, this.selection, this.power)) {
      this.activeTool.cancel();
      this.selection = null;
      this.fieldNotice = null;
    }
  }

  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection(): boolean {
    const s = this.selection;
    const level = this.level;
    if (this.mode === 'binding' || !s || !level || s.kind === 'node' || !selectionExists(level, s, this.power)) return false;
    if (this.mode === 'power') return this.deletePower(s);
    if (s.kind === 'powerBlock' || s.kind === 'powerWire') return false;
    if (s.kind === 'device') {
      const edit = deleteDeviceDoc(level, this.power, s.id);
      this.commit(edit.level, edit.power);
      return true;
    }
    this.commit(s.kind === 'wall' ? deleteWall(level, s.id) : s.kind === 'opening' ? deleteOpening(level, s.id)
      : deleteZone(level, s.id));
    return true;
  }

  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  private deletePower(s: Selection): boolean {
    const p = this.power;
    if (s.kind === 'powerWire') { this.commitPower(deleteWire(p, s.id)); return true; }
    if (s.kind !== 'powerBlock') return false;
    const next = deleteBlock(p, s.id);
    if (next === p) this.notice = t('power.gridKeep'); else this.commitPower(next);
    return true;
  }

  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(blockId: Id, p: Position): void {
    this.powerFeed.setPosition(blockId, p).catch((err: unknown) => { this.notice = messageOf(err); });
  }

  undo(): void { this.step(() => this.history?.undo() ?? null); }
  redo(): void { this.step(() => this.history?.redo() ?? null); }

  /**
   * Undo / redo drop the selection, except in the Binding step, which keeps the selected device while it exists;
   * the field notice goes with a dropped selection.
   */
  private step(op: () => PlanDoc | null): void {
    this.activeTool.cancel();
    if (op()) this.save.markDirty();
    const s = this.selection, level = this.level;
    this.selection = this.mode === 'binding' && s && level && selectionExists(level, s, this.power) ? s : null;
    if (!this.selection) this.fieldNotice = null;
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
    this.fieldNotice = null;
    if (id === 'box') this.wallType = 'bearing';
    this.toolId = id;
    this.activeTool = createTool(id, this.ctx);
  }

  /**
   * Power step device list: arms a device for the Device tool (activated when another tool is on), so the
   * next canvas click places it; the "pick a device first" notice goes. The arm stays across tool switches; a
   * placement, leaving the step or opening another plan clears it.
   */
  armDevice(id: Id): void {
    if (this.toolId !== 'power-device') this.pickTool('power-device');
    this.placeDeviceId = id;
    this.notice = null;
  }

  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(mode: EditorMode): void {
    if (mode === this.mode) return;
    if (this.mode === 'power') this.placeDeviceId = null;
    this.mode = mode;
    this.pickTool(toolIdsFor(mode)[0]);
    if (mode === 'binding' || mode === 'power') this.haMeta.enter();
  }

  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(id: Id): void {
    const level = this.level;
    const d = level?.devices.find(x => x.id === id);
    if (!level || !d) return;
    this.ctx.select({ kind: 'device', id });
    const pose = devicePose(level, d);
    if (pose) this.view = revealPt(this.view, pose.pt, this.size.w, this.size.h);
  }

  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(id: Id): void {
    const level = this.level;
    const z = level?.zones.find(x => x.id === id);
    if (!level || !z) return;
    this.ctx.select({ kind: 'zone', id });
    const at = zoneLabelPoints(level).get(id);
    if (at) this.view = revealPt(this.view, at, this.size.w, this.size.h);
  }

  nextUnboundDevice(): void {
    const level = this.level;
    const id = level ? nextUnbound(level, this.selection?.kind === 'device' ? this.selection.id : null, this.bindStatus) : null;
    if (id) this.pickDevice(id);
  }

  // ---- view / pointer ----

  /** The canvas view of the active step: the Power step has its own, so the plan view is kept meanwhile. */
  get view(): View { return this.mode === 'power' ? this.powerView : this.planView; }
  set view(v: View) { if (this.mode === 'power') this.powerView = v; else this.planView = v; }

  private svgEl(): SVGSVGElement | null { return this.renderRoot.querySelector('svg.plan'); }

  toMm(e: { clientX: number; clientY: number }): Pt { return screenToMm(this.svgEl(), this.view, e); }

  private fit(): void { this.planView = fitView(this.level?.nodes ?? [], this.size.w, this.size.h); }

  /** The whole schematic with a 40-unit margin, at most 150 %. */
  private fitPower(): void {
    const b = schemaBounds(this.power, this.ctx.geo());
    if (b) this.powerView = fitRect(b, this.size.w, this.size.h, 40, 1.5);
  }

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
      dialog: this.dialog, draft: this.pendingDraft, planName: this.plan?.name ?? '',
      saving: this.save.state === 'saving', message: this.save.errorMessage,
      restore: d => this.session.restoreDraft(d), discard: d => this.session.discardDraft(d), startNew: () => this.session.startNewPlan(),
      confirmDelete: () => { void this.session.confirmDelete(); }, confirmSwitch: () => this.session.confirmSwitch(),
      overwrite: () => this.session.doOverwrite(), saveAsNew: () => this.session.doSaveAsNew(),
      close: () => { this.dialog = null; },
    });
  }

  render() {
    if (!this.plan || !this.history) {
      return html`<div class="center">${this.loadError
        ? html`<span>${t('load.error')}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${t('action.retry')}</button>`
        : t('load.loading')}</div>`;
    }
    const pal = paletteFor(!!this.hass?.themes?.darkMode);
    const level = this.history.current.level;
    const preview = this.activeTool.preview();
    const { x, y, scale } = this.view;
    const w = Math.max(1, this.size.w) / scale, h = Math.max(1, this.size.h) / scale;
    const s = this.save;
    const power = this.mode === 'power';
    return html`
      <div class="ed${this.mode === 'binding' ? ` binding${this.railCollapsed ? ' rail-off' : ''}` : power ? ' power' : ''}"
        style=${paletteVars(pal)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${renderTopBar({
          steps: renderSteps({
            mode: this.mode, level, status: this.bindStatus, power: this.power, planName: this.plan.name,
            onRename: name => { this.plan = { ...this.plan!, name }; s.markDirty(); },
            onMode: m => this.setMode(m),
          }),
          planId: this.plan.id, plans: this.session.planOptions(),
          canUndo: this.history.canUndo, canRedo: this.history.canRedo,
          saveState: s.state, dirty: s.dirty, errorMessage: s.errorMessage,
          lead: this.narrow ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : nothing,
          onPickPlan: id => this.session.pickPlan(id),
          onNewPlan: () => this.session.requestNewPlan(), onDeletePlan: () => this.session.requestDelete(), busy: this.deleting,
          onUndo: () => this.undo(), onRedo: () => this.redo(), onSave: () => this.session.doSave(),
        })}
        ${renderRail(this, level)}
        ${renderSide(this, level)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${x} ${y} ${w} ${h}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${pal.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(e: Event) => e.preventDefault()}>
            ${this.grid ? renderGrid(this.view, w, h, pal, power ? 0.1 : 1) : nothing}
            ${this.mode === 'power' ? renderPower(this.power, {
              palette: pal, selection: this.selection, preview, scale, frame: this.powerFeed.frame, geo: this.ctx.geo(),
            }) : renderLevel(level, {
              palette: pal, selection: this.selection, preview, scale, mode: this.mode, showCones: this.cones,
              bindingStatus: this.bindStatus,
              containerState: d => this.feed.stateOf(d), containerFlash: d => this.feed.flash(d.id),
            })}
            ${preview.tracker ? renderTracker(preview.tracker, {
              palette: pal, scale, mode: this.toolId === 'box' ? 'box' : 'wall',
              live: trackerLive(preview, this.toolId === 'box' ? 'box' : 'wall', this.boxMeasure, this.thickness),
            }) : nothing}
          </svg>
          ${this.pendingDraft && this.dialog?.kind !== 'restore' ? renderDraftBanner({
            savedAt: this.pendingDraft.savedAt,
            onRestore: () => this.session.restoreDraft(this.pendingDraft!), onDiscard: () => this.session.discardDraft(this.pendingDraft!),
          }) : nothing}
        </div>
        ${renderStatusBar({
          grid: this.grid, zoomPct: Math.round(scale * (power ? 100 : 1000)),
          snap: preview.snap && preview.snap.kind !== 'none' ? t(`snap.${preview.snap.kind}`) : null,
          onGrid: on => { this.grid = on; }, cones: this.cones, onCones: on => { this.cones = on; },
          binding: this.mode === 'binding' || power, power,
        })}
        ${this.renderDialog()}
      </div>`;
  }
}

if (!customElements.get('plan-studio-panel')) customElements.define('plan-studio-panel', PlanStudioPanel);

declare global {
  interface HTMLElementTagNameMap { 'plan-studio-panel': PlanStudioPanel }
}
