import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { BindingRole, Device, Id, Level, Plan, Pt, Rule, WallType } from '../model/types';
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
  defaultPower, deleteBlock, deleteDeviceDoc, deleteWire, pruneLevelDevices, type PlanDoc, type Position, type PowerBlock, type PowerSchema,
} from '../model/power';
import { blockRect, hitPower, schemaBounds } from '../geometry/power';
import { PowerHint, blockMeters } from './power-hint';
import { hintSize, placeHint } from '../render/power-hint';
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
import { ruleModeBubbles } from '../live/rule-mode';
import { RulesFeed, type RuleTrace } from '../live/rules-feed';
import { addRule, deleteRule, isRuleInputDevice, ruleUsers, leakProtectionTemplate, ventTemplate, isVentRule, isLeakRule, boilerTemplate, buttonHasAuto, isBoilerDevice, isBoilerRule, isTimedRule, timedTemplate, newRule, isOutsideRule, outsideTemplate, isMotionLightRule, isMotionButton, isBlocker, motionLightTemplate, isBeurerRule, beurerTemplate, isControlRule, controlTemplate, controlActionsFor, timerTemplate, ruleActionsFor, ruleEqual, ruleProblems, updateRule } from '../model/rules';
import { renderAutomationsMenu, type RuleTemplate } from './rule-templates';
import { renderRuleDialog, type RuleDialogOpts, type RuleDraft } from './rule-dialog';
import { renderVentDialog } from './vent-dialog';
import { renderBoilerDialog } from './boiler-dialog';
import { renderLeakDialog } from './leak-dialog';
import { renderTimedDialog } from './timed-dialog';
import { renderOutsideDialog } from './outside-dialog';
import { OUTSIDE_FOCUS } from '../render/outside-trace';
import { renderBeurerDialog } from './beurer-dialog';
import { renderMotionLightDialog } from './motion-light-dialog';
import { planNeighbours } from '../model/neighbours';
import { motionLightFocus } from '../render/motion-light-trace';
import { BEURER_FOCUS } from '../render/beurer-trace';
import { renderControlDialog } from './control-dialog';
import { controlFlowFocus } from '../render/control-flow';
import { leakFocus } from '../render/leak-trace';
import { BOILER_FOCUS } from '../render/boiler-trace';
import { PowerFeed, powerPayload } from '../live/power-feed';
import { deviceLive, liveBubbles } from '../live/device-live';
import { DeviceEventTracker, eventSources } from '../live/device-events';
import { EntityFeed } from '../live/entity-feed';
import { VirtualFeed } from '../live/virtual-feed';
import { UpdateCheck } from '../live/update-check';

/** The integration version this bundle was built from (Vite `define`, from manifest.json). */
declare const __PLAN_STUDIO_VERSION__: string | undefined;
/** Not defined where the bundle is not built by Vite with the config (dev harness): then empty = no update check. */
const BUNDLE_VERSION = typeof __PLAN_STUDIO_VERSION__ === 'string' ? __PLAN_STUDIO_VERSION__ : '';

export class PlanStudioPanel extends LitElement {
  static styles = panelStyles;

  @property({ attribute: false }) hass?: HassLike;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel: unknown;

  @state() plan: Plan | null = null;
  /** The Automation rail's "Automations" menu while open: where it sits (viewport px), else null. */
  @state() automationsMenu: { x: number; y: number } | null = null;
  @state() loadError: string | null = null;
  @state() selection: Selection | null = null;
  @state() toolId: ToolId = 'select';
  @state() wallType: WallType = 'bearing';
  @state() thickness = WALL_PRESETS.bearing;
  @state() boxMeasure: BoxMeasure = 'inner';
  @state() grid = true;
  /** Wizard step: Plan / Equipment / Binding / Power / Automation (per session, not saved); cones: device cones and zones are drawn. */
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
  /** The rule the open 'rule' dialog edits (a copy; nothing reaches the plan before OK). */
  @state() ruleDraft: RuleDraft | null = null;
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
  /** Live traces of the saved rules (subscribed only in the Automation step of an attached panel). */
  readonly rulesFeed = new RulesFeed(this, () => this.hass?.connection);
  /** The states of the plan's virtual switches (kept by the integration); `liveStates` merges them into hass.states. */
  readonly virtualFeed = new VirtualFeed(this, () => this.hass?.connection);
  /** Live values of the schematic draft (subscribed only in the Power step of an attached panel). */
  readonly powerFeed = new PowerFeed(this, () => this.hass?.connection);

  /** The Power step's hover hint: the report statistics of the meters of the block the pointer rests on. */
  readonly hint = new PowerHint(this, () => this.hass?.connection, id => {
    const b = this.power.blocks.find(x => x.id === id);
    return b && this.mode === 'power' ? blockMeters(b, this.ctx.geo(), this.powerFeed.frame?.blocks[id]) : [];
  });

  /** Action events and ended bubbles of the open level's devices, from hass.states and the entity feed. */
  private readonly events = new DeviceEventTracker();
  /** Per-message states of the event sources (Binding step of an attached panel), so no press is coalesced away. */
  readonly entityFeed = new EntityFeed(() => this.hass?.connection, () => this.onEntities());
  /** Reloads the page (the "updated on the server" notice); replaceable in tests. */
  reloadPage: () => void = () => location.reload();
  /** Asks the server for its version at start and after every reconnect; `serverVersion` is set while it differs. */
  private readonly updateCheck = new UpdateCheck(() => this.hass?.connection, BUNDLE_VERSION, () => this.requestUpdate());
  private trackedLevel: Level | null = null;
  private ticker: ReturnType<typeof setInterval> | null = null;
  /** True while the 1 s ticker runs (Binding step with a timer, event or fading bubble). */
  get tickerOn(): boolean { return this.ticker !== null; }

  /** Binding status of a device, from live states. Until the registries are loaded no entity is Missing (its presence is unknown). */
  readonly bindStatus = (d: Device): BindStatus => bindingStatus(d, eid => presence(this.haMeta.get(), eid, this.liveStates));

  /** hass.states plus the virtual switches (`virtual.<device id>`): every reader of live states takes these. */
  get liveStates(): HassLike['states'] { return this.virtualFeed.merge(this.hass?.states); }

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
    this.watchRules();
    this.watchVirtual();
    this.watchEntities();
    this.updateCheck.watch();
  }

  disconnectedCallback(): void {
    this.updateCheck.stop();
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
    this.hint.hide();
    this.rulesFeed.stop();
    this.virtualFeed.stop();
    this.entityFeed.stop();
    this.stopTicker();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (this.ruleDraft && !this.modal) this.ruleDraft = null; // Esc closed the rule dialog
    if (changed.has('hass') && this.hass && !this.plan && !this.loading && !this.loadError) void this.session.load();
    // New states, or a new level whose devices have no baseline yet.
    const cur = this.history?.current.level ?? null;
    this.watchEntities();
    if (changed.has('hass') && this.isConnected) this.updateCheck.watch(); // hass may arrive after the element is attached
    if (cur && this.hass && (changed.has('hass') || cur !== this.trackedLevel)) {
      this.events.update(cur, this.entityFeed.overlay(this.liveStates!), Date.now());
    }
    this.trackedLevel = cur;
    const sized = this.size.w > 0 && this.size.h > 0;
    if (this.needFit && sized) { this.needFit = false; this.fit(); }
    if (this.needPowerFit && sized && this.mode === 'power') { this.needPowerFit = false; this.fitPower(); }
    // A detached panel still updates when handed a new hass: it keeps no subscription until it is attached again.
    this.feed.watch(this.isConnected ? this.plan?.id ?? null : null);
    this.watchPower();
    this.watchRules();
    this.watchVirtual();
    this.hint.sync(); // closes when the step changed or the block went; follows an edited binding
  }

  /** The rules feed watches the open plan in the Binding (mode bubbles) and Automation steps of an attached panel. */
  private watchRules(): void {
    this.rulesFeed.watch(this.isConnected && (this.mode === 'automation' || this.mode === 'binding') ? this.plan?.id ?? null : null);
  }

  /** The virtual feed watches the open plan while it has a virtual switch (any step: the Binding look, the rule dialogs, the Automation step). */
  private watchVirtual(): void {
    const any = this.isConnected && !!this.plan && this.planLevels().some(l => l.devices.some(d => d.props.kind === 'virtual_switch'));
    this.virtualFeed.watch(any ? this.plan!.id : null);
  }

  /** The entity feed watches the open level's event sources in the Binding and Automation steps of an attached panel. */
  private watchEntities(): void {
    const level = this.isConnected && (this.mode === 'binding' || this.mode === 'automation') ? this.history?.current.level : undefined;
    this.entityFeed.watch(level ? eventSources(level) : null);
  }

  /** Every entity feed message: the tracker sees each value, even one the next message replaces at once. */
  private onEntities(): void {
    const level = this.history?.current.level;
    if (level && this.hass) this.events.update(level, this.entityFeed.overlay(this.liveStates!), Date.now());
    this.requestUpdate();
  }

  /** The power feed carries the draft schematic; it is idle outside the Power step and while detached. */
  private watchPower(): void {
    const level = this.isConnected && this.mode === 'power' ? this.level : null;
    this.powerFeed.watch(level && this.plan ? this.plan.id : null, level ? powerPayload(this.power, level) : null);
  }

  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  private syncTicker(): void {
    const level = this.history?.current.level;
    const now = Date.now();
    const need = this.isConnected && (this.mode === 'binding' || this.mode === 'automation') && !!level && !!this.hass && level.devices.some(d =>
      deviceLive(d, this.liveStates).timerSince !== undefined || this.events.event(d.id, now) !== null
      || this.events.leaving(d.id, now).length > 0);
    const tr = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : undefined;
    const countdown = !!tr && (!!tr.pending || tr.inputs.some(i => i.until !== undefined && i.until > now) || (tr.gate?.until ?? 0) > now
      || (tr.boiler?.until ?? 0) > now || (tr.boiler?.settling ?? 0) > now || (tr.timed?.running === true && (tr.timed.until ?? 0) > now)
      || [tr.outside?.pausedUntil, tr.outside?.until, tr.outside?.windowUntil, tr.beurer?.pausedUntil, tr.beurer?.cycleAt, tr.beurer?.keptUntil, tr.motionLight?.offAt, tr.motionLight?.minUntil, tr.motionLight?.autoAt].some(u => (u ?? 0) > now));
    if ((need || countdown) && !this.ticker) this.ticker = setInterval(() => this.requestUpdate(), 1000);
    else if (!need && !countdown) this.stopTicker();
  }

  private stopTicker(): void {
    if (this.ticker !== null) clearInterval(this.ticker);
    this.ticker = null;
  }

  protected updated(): void {
    this.syncTicker();
    // Behind the rule dialog nothing takes the focus or a click (the backdrop only covers it visually).
    for (const el of this.renderRoot.querySelectorAll('.ed > :not(.backdrop)')) el.toggleAttribute('inert', this.modal);
    // A dialog select shows its `data-value` once its options exist (a value set before them is lost).
    for (const sel of this.renderRoot.querySelectorAll<HTMLSelectElement>('.rule-backdrop select[data-value]')) sel.value = sel.dataset.value ?? '';
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

  /** Pushes a rules edit into the same undo history; an empty list drops the key. */
  commitRules(next: Rule[]): void {
    if (!this.history) return;
    const { rules: _old, ...rest } = this.history.current;
    this.history.push({ ...rest, ...(next.length > 0 ? { rules: next } : {}) });
    this.save.markDirty();
    this.requestUpdate();
  }

  get rules(): Rule[] { return this.history?.current.rules ?? []; }

  /** True while the rule dialog is open: nothing behind it reacts. */
  get modal(): boolean { return this.dialog?.kind === 'rule'; }

  /** The plan's levels with the edited one in place of the stored first level (the plan keeps its stale copy). */
  private planLevels(): Level[] {
    const cur = this.level;
    return (this.plan?.levels ?? []).map((l, i) => (i === 0 && cur ? cur : l));
  }

  /**
   * Opens the rule dialog: a rule id edits that rule (the template does not matter then); otherwise a new rule
   * from the template, in the selected zone. The dialog works on a copy; OK commits one edit, Cancel drops it.
   */
  openRuleDialog(template: RuleTemplate, ruleId?: Id): void {
    if (!this.plan || !this.history || this.dialog !== null) return;
    let draft: RuleDraft;
    if (ruleId !== undefined) {
      const rule = this.rules.find(r => r.id === ruleId);
      if (!rule) return;
      draft = { rule: structuredClone(rule), isNew: false, focused: null };
    } else {
      const levels = this.planLevels();
      const zoneId = this.selection?.kind === 'zone' ? this.selection.id : null;
      const zone = levels.flatMap(l => l.zones).find(z => z.id === zoneId);
      const dev = this.selection?.kind === 'device' ? levels.flatMap(l => l.devices).find(x => x.id === (this.selection as { id: Id }).id) : undefined;
      const zid = zone?.id ?? null;
      const rule = template === 'leak' ? leakProtectionTemplate({ levels }, zid, zone?.name ?? null)
        : template === 'timer' ? timerTemplate({ levels }, zid, dev && isRuleInputDevice(dev) ? dev.id : null, dev && isRuleInputDevice(dev) ? dev.name : '')
        : template === 'outside' ? outsideTemplate({ levels }, zid, zone?.name ?? null)
        : template === 'control' ? controlTemplate({ levels }, zid, zone?.name ?? null)
        : template === 'beurer' ? beurerTemplate(zid, zone?.name ?? null)
        : template === 'motionLight' ? motionLightTemplate({ levels }, zid, zone?.name ?? null)
        : template === 'vent' ? ventTemplate({ levels }, zid, zone?.name ?? null)
        : template === 'timed' ? timedTemplate({ levels }, zid, zone?.name ?? null)
        : template === 'boiler' ? boilerTemplate({ levels, power: { ...this.power, blocks: this.boilerGridBlocks() } }, zid, zone?.name ?? null)
        : newRule(zid);
      draft = { rule, isNew: true, focused: null };
    }
    this.ruleDraft = draft;
    this.dialog = { kind: 'rule' };
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.rule-backdrop [data-field="name"]')?.focus());
  }

  /** The edited Power schematic's grid blocks that have a power entity (the boiler rule's power limit reads one). */
  private boilerGridBlocks(): PowerBlock[] {
    return this.power.blocks.filter(b => b.kind === 'grid' && !!b.power);
  }

  /** Opens the "Automations" menu beside its rail button (focus on the first item), or closes it when open. */
  toggleAutomationsMenu(button: HTMLElement): void {
    if (this.automationsMenu) { this.automationsMenu = null; return; }
    const r = button.getBoundingClientRect();
    this.automationsMenu = { x: r.right + 4, y: r.top };
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.amenu [role="menuitem"]')?.focus());
  }

  /** Closes the "Automations" menu (Escape, a click outside) and hands the focus back to its rail button. */
  closeAutomationsMenu(): void {
    this.automationsMenu = null;
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.tools button[data-action="automations"]')?.focus());
  }

  /** A purpose-built automation picked from the menu: its dialog, pre-filled for the selected zone. */
  private pickAutomation(tpl: RuleTemplate): void {
    this.automationsMenu = null;
    this.openRuleDialog(tpl);
  }

  /**
   * A click on a flowchart block: the block (`field`) gets the highlight, the form field `target` (by default the
   * one of the same name) the focus.
   */
  private focusRuleField(field: string, target = field): void {
    if (this.ruleDraft) this.ruleDraft = { ...this.ruleDraft, focused: field };
    void this.updateComplete.then(() => {
      const row = this.renderRoot.querySelector<HTMLElement>(`.rule-backdrop [data-field="${target}"]`);
      const el = row?.matches('input, select, button') ? row : row?.querySelector<HTMLElement>('select, input, button') ?? row;
      el?.scrollIntoView?.({ block: 'nearest' });
      el?.focus();
    });
  }

  /** OK: the rule is added or changed as one undoable edit (an unchanged rule closes the dialog without an edit). */
  private commitRuleDraft(): void {
    const d = this.ruleDraft;
    this.dialog = null;
    this.ruleDraft = null;
    if (!d) return;
    const stored = this.rules.find(r => r.id === d.rule.id);
    if (d.isNew) this.commitRules(addRule(this.rules, d.rule));
    else if (stored && !ruleEqual(stored, d.rule)) this.commitRules(updateRule(this.rules, d.rule));
  }

  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  private shownRuleTrace(rule: Rule): RuleTrace | undefined {
    const saved = this.session.savedRules.find(r => r.id === rule.id);
    return saved && ruleEqual(saved, rule) ? this.rulesFeed.trace(rule.id) : undefined;
  }

  private renderRuleDialogNow(): TemplateResult | typeof nothing {
    const d = this.ruleDraft;
    if (!this.modal || !d || !this.plan) return nothing;
    const levels = this.planLevels();
    const devices = levels.flatMap(l => l.devices);
    const rule = d.rule;
    const saved = this.session.savedRules.find(r => r.id === rule.id);
    const trace = this.shownRuleTrace(rule);
    const note = !saved ? t('rules.flow.new') : ruleEqual(saved, rule) ? null : t('rules.flow.edited');
    const multi = levels.length > 1;
    const zones = levels.flatMap(l => l.zones.map(z => ({ id: z.id, name: multi ? `${z.name} (${l.name})` : z.name })));
    const problems = ruleProblems(this.rules, rule, id => devices.some(x => x.id === id),
      id => { const x = devices.find(v => v.id === id); return x && ruleActionsFor(x); },
      id => devices.some(x => x.id === id && x.props.kind === 'illuminance_sensor'),
      id => devices.some(x => x.id === id && x.props.kind === 'climate_sensor'),
      id => devices.some(x => x.id === id && isBoilerDevice(x)),
      id => devices.some(x => x.id === id && (x.props.kind === 'wall_switch' || x.props.kind === 'smart_button')),
      id => this.boilerGridBlocks().some(b => b.id === id),
      id => { const x = devices.find(v => v.id === id); return !x || buttonHasAuto(x); },
      id => devices.some(x => x.id === id && x.props.kind === 'leak_sensor'),
      id => devices.some(x => x.id === id && x.props.kind === 'valve'),
      id => devices.some(x => x.id === id && (x.props.kind === 'wall_switch' || x.props.kind === 'smart_button')),
      id => devices.some(x => x.id === id && ruleActionsFor(x).includes('on')),
      id => devices.some(x => x.id === id && ruleActionsFor(x).includes('on')),
      id => devices.some(x => x.id === id && ruleActionsFor(x).includes('on')),
      id => devices.some(x => x.id === id && !!x.bindings?.power),
      id => devices.some(x => x.id === id && x.props.kind === 'smart_button'),
      id => devices.some(x => x.id === id && controlActionsFor(x).length > 0),
      id => devices.some(x => x.id === id && ruleActionsFor(x).includes('on') && ruleActionsFor(x).includes('off')),
      id => devices.some(x => x.id === id && x.props.kind === 'motion_sensor'),
      id => devices.some(x => x.id === id && isMotionButton(x)),
      id => devices.some(x => x.id === id && x.props.kind === 'virtual_switch'),
      id => devices.some(x => x.id === id && isBlocker(x)));
    if (isBoilerRule(rule)) {
      return renderBoilerDialog({
        draft: d,
        boilers: devices.filter(isBoilerDevice),
        buttons: devices.filter(x => x.props.kind === 'wall_switch' || x.props.kind === 'smart_button'),
        grids: this.boilerGridBlocks().map(b => ({ id: b.id, name: b.name || t('power.kind.grid') })),
        deviceById: id => devices.find(x => x.id === id),
        zones, problems, trace, note, now: Date.now(),
        onChange: r => { this.ruleDraft = { ...(this.ruleDraft ?? d), rule: r }; },
        onFocus: f => this.focusRuleField(f, BOILER_FOCUS[f] ?? f),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => { this.dialog = null; this.ruleDraft = null; },
      });
    }
    if (isLeakRule(rule)) {
      return renderLeakDialog({
        draft: d,
        sensors: devices.filter(x => x.props.kind === 'leak_sensor'),
        valves: devices.filter(x => x.props.kind === 'valve'),
        deviceById: id => devices.find(x => x.id === id),
        zones, problems, trace, note, now: Date.now(),
        onChange: r => { this.ruleDraft = { ...(this.ruleDraft ?? d), rule: r }; },
        onFocus: f => this.focusRuleField(f, leakFocus(f)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => { this.dialog = null; this.ruleDraft = null; },
      });
    }
    if (isTimedRule(rule)) {
      return renderTimedDialog({
        draft: d,
        buttons: devices.filter(x => x.props.kind === 'wall_switch' || x.props.kind === 'smart_button'),
        devices: devices.filter(x => ruleActionsFor(x).includes('on')),
        deviceById: id => devices.find(x => x.id === id),
        zones, problems, trace, note, now: Date.now(),
        onChange: r => { this.ruleDraft = { ...(this.ruleDraft ?? d), rule: r }; },
        onFocus: f => this.focusRuleField(f),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => { this.dialog = null; this.ruleDraft = null; },
      });
    }
    if (isOutsideRule(rule)) {
      return renderOutsideDialog({
        draft: d,
        lights: devices.filter(x => ruleActionsFor(x).includes('on')),
        sensors: devices.filter(x => x.props.kind === 'illuminance_sensor'),
        deviceById: id => devices.find(x => x.id === id),
        zones, problems, trace, note, now: Date.now(),
        onChange: r => { this.ruleDraft = { ...(this.ruleDraft ?? d), rule: r }; },
        onFocus: f => this.focusRuleField(f, OUTSIDE_FOCUS[f] ?? f),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => { this.dialog = null; this.ruleDraft = null; },
      });
    }
    if (isMotionLightRule(rule)) {
      return renderMotionLightDialog({
        draft: d,
        lights: devices.filter(x => { const a = ruleActionsFor(x); return a.includes('on') && a.includes('off'); }),
        sensors: devices.filter(x => x.props.kind === 'motion_sensor'),
        daylightSensors: devices.filter(x => x.props.kind === 'illuminance_sensor'),
        buttons: devices.filter(isMotionButton),
        blockers: devices.filter(isBlocker),
        deviceById: id => devices.find(x => x.id === id),
        zones, problems, trace, note, now: Date.now(),
        neighbours: planNeighbours(levels, rule.zoneId, rule.motionLight!.sensors),
        onChange: r => { this.ruleDraft = { ...(this.ruleDraft ?? d), rule: r }; },
        onFocus: f => this.focusRuleField(f, motionLightFocus(f)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => { this.dialog = null; this.ruleDraft = null; },
      });
    }
    if (isBeurerRule(rule)) {
      return renderBeurerDialog({
        draft: d,
        heaters: devices.filter(x => ruleActionsFor(x).includes('on')),
        sources: devices.filter(x => !!x.bindings?.power),
        deviceById: id => devices.find(x => x.id === id),
        zones, problems, trace, note, now: Date.now(),
        onChange: r => { this.ruleDraft = { ...(this.ruleDraft ?? d), rule: r }; },
        onFocus: f => this.focusRuleField(f, BEURER_FOCUS[f] ?? f),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => { this.dialog = null; this.ruleDraft = null; },
      });
    }
    if (isVentRule(rule)) {
      return renderVentDialog({
        draft: d,
        climateSensors: devices.filter(x => x.props.kind === 'climate_sensor'),
        fans: devices.filter(x => { const a = ruleActionsFor(x); return a.includes('on') && a.includes('off'); }),
        deviceById: id => devices.find(x => x.id === id),
        zones, problems, trace, note, now: Date.now(),
        onChange: r => { this.ruleDraft = { ...(this.ruleDraft ?? d), rule: r }; },
        onFocus: f => this.focusRuleField(f),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => { this.dialog = null; this.ruleDraft = null; },
      });
    }
    const opts: RuleDialogOpts = {
      draft: d,
      inputDevices: devices.filter(isRuleInputDevice),
      lightSensors: devices.filter(x => x.props.kind === 'illuminance_sensor'),
      lightUnit: id => {
        const eid = devices.find(x => x.id === id)?.bindings?.illuminance;
        const st = eid ? (this.liveStates as Record<string, { attributes?: { unit_of_measurement?: string } }> | undefined)?.[eid] : undefined;
        return st?.attributes?.unit_of_measurement;
      },
      actionDevices: devices.filter(x => ruleActionsFor(x).length > 0),
      deviceById: id => devices.find(x => x.id === id),
      // A Load control rule has no verdict, so it is never offered as a source (a rule that already reads one keeps its row).
      otherRules: this.rules.filter(r => r.id !== rule.id && !isControlRule(r)),
      ruleName: id => this.rules.find(r => r.id === id)?.name,
      zones, problems,
      trace, note, now: Date.now(),
      onChange: r => { this.ruleDraft = { ...(this.ruleDraft ?? d), rule: r }; },
      onFocus: f => this.focusRuleField(f),
      onUnit: (field, unit) => { const cur = this.ruleDraft ?? d; this.ruleDraft = { ...cur, units: { ...cur.units, [field]: unit } }; },
      onOk: () => this.commitRuleDraft(),
      onCancel: () => { this.dialog = null; this.ruleDraft = null; },
    };
    // Load control is the event twin of the condition rule: the same dialog pieces, its own action devices and buttons.
    if (isControlRule(rule)) {
      return renderControlDialog({
        ...opts,
        actionDevices: devices.filter(x => controlActionsFor(x).length > 0),
        buttons: devices.filter(x => x.props.kind === 'smart_button'),
        onFocus: f => this.focusRuleField(f, controlFlowFocus(f)),
      });
    }
    return renderRuleDialog(opts);
  }

  /** Deletes the rule a 'delete-rule' dialog asked about (undoable until the plan is saved). */
  private confirmDeleteRule(): void {
    const d = this.dialog;
    this.dialog = null;
    if (d?.kind === 'delete-rule') this.commitRules(deleteRule(this.rules, d.id));
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
    if (this.mode === 'binding' || this.mode === 'automation' || !s || !level || s.kind === 'node' || !selectionExists(level, s, this.power)) return false;
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

  undo(): void { if (!this.modal) this.step(() => this.history?.undo() ?? null); }
  redo(): void { if (!this.modal) this.step(() => this.history?.redo() ?? null); }

  /**
   * Undo / redo drop the selection, except in the Binding step (the selected device) and the Automation step (the
   * selected zone), which keep it while it exists; the field notice goes with a dropped selection.
   */
  private step(op: () => PlanDoc | null): void {
    this.activeTool.cancel();
    if (op()) this.save.markDirty();
    const s = this.selection, level = this.level;
    const keep = this.mode === 'binding' || this.mode === 'automation';
    this.selection = keep && s && level && selectionExists(level, s, this.power) ? s : null;
    if (!this.selection) this.fieldNotice = null;
    this.requestUpdate();
  }

  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(wt: WallType): void {
    this.wallType = wt;
  }

  pickTool(id: ToolId): void {
    if (this.modal) return;
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
    if (mode === this.mode || this.modal) return;
    if (this.mode === 'power') this.placeDeviceId = null;
    this.automationsMenu = null;
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

  /** Power step pointer move without a button: the block under the pointer (not a bus, wire or empty space) rests for the hint. */
  hintHover(e: { clientX: number; clientY: number }): void {
    if (this.mode !== 'power') return;
    const hit = hitPower(this.power, this.toMm(e), this.ctx.tolMm(), this.ctx.geo());
    const id = hit?.kind === 'block' ? hit.id : hit?.kind === 'port' || hit?.kind === 'chip' ? hit.block : null;
    this.hint.move(id !== null && this.hint.meterCount(id) > 0 ? id : null);
  }

  /** The open hover hint over the canvas: its lines beside the hovered block (screen pixels of the canvas). */
  private renderHint(now: number): TemplateResult | typeof nothing {
    const id = this.hint.openId;
    const lines = this.hint.lines(now);
    const b = id === null ? undefined : this.power.blocks.find(x => x.id === id);
    if (!lines || !b) return nothing;
    const { x, y, scale } = this.view;
    const r = blockRect(b, this.ctx.geo(), this.power);
    const at = placeHint({ x: (r.x - x) * scale, y: (r.y - y) * scale, w: r.w * scale, h: r.h * scale }, hintSize(lines), this.size);
    return html`<div class="power-hint" role="tooltip" style=${`left:${at.left}px;top:${at.top}px`}>
      ${lines.map(l => html`<div class="line">${l}</div>`)}</div>`;
  }

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
      ruleName: this.dialog?.kind === 'delete-rule' ? this.rules.find(r => r.id === (this.dialog as { id: string }).id)?.name ?? '' : '',
      ruleUsers: this.dialog?.kind === 'delete-rule' ? ruleUsers(this.rules, this.dialog.id).map(r => r.name) : [],
      saving: this.save.state === 'saving', message: this.save.errorMessage,
      restore: d => this.session.restoreDraft(d), discard: d => this.session.discardDraft(d), startNew: () => this.session.startNewPlan(),
      confirmDelete: () => { void this.session.confirmDelete(); }, confirmDeleteRule: () => this.confirmDeleteRule(), confirmSwitch: () => this.session.confirmSwitch(),
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
    const now = Date.now();
    const states = this.liveStates;
    return html`
      <div class="ed${this.mode === 'binding' ? ` binding${this.railCollapsed ? ' rail-off' : ''}` : power ? ' power' : this.mode === 'automation' ? ' automation' : ''}"
        style=${paletteVars(pal)} ?data-update=${this.updateCheck.serverVersion !== null}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${this.updateCheck.serverVersion === null ? nothing : html`<div class="update-bar" role="status">
          <span>${t('update.notice').replace('{version}', this.updateCheck.serverVersion)}</span>
          <button data-action="reload" @click=${() => this.reloadPage()}>${t('update.reload')}</button></div>`}
        ${renderTopBar({
          steps: renderSteps({
            mode: this.mode, level, status: this.bindStatus, power: this.power, rules: this.rules.length, planName: this.plan.name,
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
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort} @pointerleave=${() => this.hint.hide()}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(e: Event) => e.preventDefault()}>
            ${this.grid ? renderGrid(this.view, w, h, pal, power ? 0.1 : 1) : nothing}
            ${this.mode === 'power' ? renderPower(this.power, {
              palette: pal, selection: this.selection, preview, scale, frame: this.powerFeed.frame, geo: this.ctx.geo(),
            }) : renderLevel(level, {
              palette: pal, selection: this.selection, preview, scale, mode: this.mode, showCones: this.cones,
              bindingStatus: this.bindStatus,
              containerState: d => this.feed.stateOf(d),
              live: d => deviceLive(d, states),
              bubbles: d => {
                const live = deviceLive(d, states);
                const ev = this.events.event(d.id, now);
                return {
                  shown: [...ruleModeBubbles(this.session.savedRules, id => this.rulesFeed.trace(id), d.id), ...liveBubbles(live, d, now), ...(ev ? [{ text: ev.text, tone: ev.tone, key: ev.at }] : [])],
                  leaving: this.events.leaving(d.id, now),
                };
              },
            })}
            ${preview.tracker ? renderTracker(preview.tracker, {
              palette: pal, scale, mode: this.toolId === 'box' ? 'box' : 'wall',
              live: trackerLive(preview, this.toolId === 'box' ? 'box' : 'wall', this.boxMeasure, this.thickness),
            }) : nothing}
          </svg>
          ${power ? this.renderHint(now) : nothing}
          ${this.pendingDraft && this.dialog?.kind !== 'restore' ? renderDraftBanner({
            savedAt: this.pendingDraft.savedAt,
            onRestore: () => this.session.restoreDraft(this.pendingDraft!), onDiscard: () => this.session.discardDraft(this.pendingDraft!),
          }) : nothing}
        </div>
        ${renderStatusBar({
          grid: this.grid, zoomPct: Math.round(scale * (power ? 100 : 1000)),
          snap: preview.snap && preview.snap.kind !== 'none' ? t(`snap.${preview.snap.kind}`) : null,
          onGrid: on => { this.grid = on; }, cones: this.cones, onCones: on => { this.cones = on; },
          tool: this.toolId, zoneMethod: this.nextObj.zone.method, power,
        })}
        ${this.automationsMenu ? renderAutomationsMenu(this.automationsMenu, tpl => this.pickAutomation(tpl), () => this.closeAutomationsMenu()) : nothing}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
}

if (!customElements.get('plan-studio-panel')) customElements.define('plan-studio-panel', PlanStudioPanel);

declare global {
  interface HTMLElementTagNameMap { 'plan-studio-panel': PlanStudioPanel }
}
