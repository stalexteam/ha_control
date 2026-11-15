import type { Id, Level, Plan } from '../model/types';
import { emptyPlan, normalizeLevel } from '../model/types';
import { History } from '../editor/history';
import type { SaveController } from '../editor/save';
import type { DraftStore, Draft } from '../editor/draft';
import type { Selection, Tool } from '../editor/tools/types';
import { deletePlan, errorText, getPlan, listPlans, type HassLike, type PlanSummary } from '../api';
import { t } from '../i18n';
import { createTool, toolIdsFor, type EditorMode, type ToolId } from './tool-factory';
import type { ToolContext } from '../editor/tools/types';

/** Panel state the plan session reads and writes (the panel itself satisfies this). */
export interface SessionHost {
  hass?: HassLike;
  readonly uiLang: string;
  plan: Plan | null;
  plans: PlanSummary[];
  loadError: string | null;
  loading: boolean;
  needFit: boolean;
  deleting: boolean;
  history: History<Level> | null;
  readonly save: SaveController;
  readonly drafts: DraftStore;
  activeTool: Tool;
  readonly ctx: ToolContext;
  toolId: ToolId;
  mode: EditorMode;
  selection: Selection | null;
  notice: string | null;
  pendingDraft: Draft | null;
  restoreOpen: boolean;
  switchTo: Id | null;
  newConfirm: boolean;
  deleteConfirm: boolean;
  dialog: 'none' | 'conflict' | 'conflict-again';
}

/** Plan lifecycle: load / open / switch / new / delete, local drafts and saving. */
export class PlanSession {
  constructor(private readonly h: SessionHost) {}

  async load(): Promise<void> {
    if (!this.h.hass) return;
    this.h.loading = true;
    this.h.loadError = null;
    try {
      const list = await listPlans(this.h.hass);
      this.h.plans = list;
      if (list.length === 0) {
        this.h.save.reset(null);
        this.adopt(emptyPlan(t('plan.default', this.h.uiLang)));
        this.offerDraft(this.h.drafts.latest());
      } else {
        // Prefer the plan opened / saved last (e.g. one saved as new), else the first one.
        const last = this.h.drafts.lastPlanId();
        await this.openPlan(list.some(p => p.id === last) ? last! : list[0].id);
      }
    } catch (err) {
      this.h.loadError = errorText(err);
    } finally {
      this.h.loading = false;
    }
  }

  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(id: Id): Promise<void> {
    const plan = await getPlan(this.h.hass!, id);
    this.h.drafts.cancel();
    this.h.save.reset(plan.revision);
    this.adopt(plan);
    this.h.drafts.setLastPlanId(plan.id);
    this.offerDraft(this.h.drafts.read(plan.id));
  }

  offerDraft(d: Draft | null): void {
    this.h.pendingDraft = d;
    this.h.restoreOpen = !!d;
  }

  async refreshPlans(): Promise<void> {
    if (!this.h.hass) return;
    try { this.h.plans = await listPlans(this.h.hass); } catch { /* keep the old list */ }
  }

  /** Options of the plan selector: stored plans plus the open (maybe unsaved or renamed) one. */
  planOptions(): { id: Id; name: string }[] {
    const cur = this.h.plan!;
    const opts = this.h.plans.map(p => ({ id: p.id, name: p.id === cur.id ? cur.name : p.name }));
    if (!opts.some(p => p.id === cur.id)) opts.push({ id: cur.id, name: cur.name });
    return opts;
  }

  pickPlan(id: Id): void {
    if (!this.h.plan || id === this.h.plan.id || this.h.save.state === 'saving') return;
    if (this.h.save.dirty) { this.h.switchTo = id; return; }
    void this.switchPlan(id);
  }

  async switchPlan(id: Id): Promise<void> {
    try {
      await this.openPlan(id);
    } catch (err) {
      this.h.notice = errorText(err);
    }
  }

  /** "Discard and open": drop the unsaved edits (and their draft, unless it is an undecided older one). */
  confirmSwitch(): void {
    const id = this.h.switchTo;
    this.h.switchTo = null;
    if (!id || !this.h.plan) return;
    this.h.drafts.cancel();
    if (!this.draftBlocked()) this.h.drafts.clear(this.h.plan.id);
    void this.switchPlan(id);
  }

  busy(): boolean { return this.h.save.state === 'saving' || this.h.deleting; }

  requestNewPlan(): void {
    if (!this.h.plan || this.busy()) return;
    if (this.h.save.dirty) { this.h.newConfirm = true; return; }
    this.startNewPlan();
  }

  /** Replaces the open plan with a fresh unsaved one (tool, selection and history are reset by adopt). */
  startNewPlan(): void {
    this.h.newConfirm = false;
    this.h.drafts.cancel();
    if (this.h.plan && !this.draftBlocked()) this.h.drafts.clear(this.h.plan.id);
    this.openFresh();
  }

  openFresh(): void {
    this.h.toolId = toolIdsFor(this.h.mode)[0];
    this.h.notice = null;
    this.h.save.reset(null);
    this.adopt(emptyPlan(t('plan.default', this.h.uiLang)));
    this.offerDraft(null);
  }

  requestDelete(): void {
    if (!this.h.plan || this.busy()) return;
    this.h.deleteConfirm = true;
  }

  async confirmDelete(): Promise<void> {
    this.h.deleteConfirm = false;
    const plan = this.h.plan;
    if (!plan || !this.h.hass || this.busy()) return;
    this.h.deleting = true;
    try {
      if (this.h.save.baseRevision !== null) {
        try {
          await deletePlan(this.h.hass, plan.id);
        } catch (err) {
          this.h.save.state = 'error';
          this.h.save.errorMessage = errorText(err);
          return;
        }
      }
      this.h.drafts.cancel();
      this.h.drafts.clear(plan.id);
      this.h.drafts.clearLastPlanId(plan.id);
      if (this.h.pendingDraft?.planId === plan.id) this.offerDraft(null);
      let list: PlanSummary[] = [];
      try { list = await listPlans(this.h.hass); this.h.plans = list; } catch { list = []; }
      const next = list.find(x => x.id !== plan.id);
      if (next) {
        try { await this.openPlan(next.id); return; } catch (err) { this.h.notice = errorText(err); }
      }
      this.openFresh();
    } finally {
      this.h.deleting = false;
    }
  }

  adopt(input: Plan): void {
    this.h.plan = { ...input, levels: input.levels.map(normalizeLevel) };
    this.h.history = new History<Level>(this.h.plan.levels[0]);
    this.h.activeTool.cancel();
    this.h.activeTool = createTool(this.h.toolId, this.h.ctx);
    this.h.selection = null;
    this.h.needFit = true;
  }

  makeDraft(): Draft {
    return { planId: this.h.plan!.id, baseRevision: this.h.save.baseRevision, plan: this.currentPlan(), savedAt: Date.now() };
  }

  /** True while an undecided draft of the open plan must not be overwritten. */
  draftBlocked(): boolean {
    return !!this.h.pendingDraft && !!this.h.plan && this.h.pendingDraft.planId === this.h.plan.id;
  }

  restoreDraft(d: Draft): void {
    this.h.pendingDraft = null;
    this.h.restoreOpen = false;
    this.adopt(d.plan);
    this.h.save.baseRevision = d.baseRevision;
    this.h.save.markDirty(); // the next save goes through the normal revision / conflict flow
  }

  discardDraft(d: Draft): void {
    this.h.pendingDraft = null;
    this.h.restoreOpen = false;
    this.h.drafts.clear(d.planId);
    // Edits made while the decision was pending are drafted from now on.
    if (this.h.save.dirty && this.h.plan) this.h.drafts.schedule(() => this.makeDraft());
  }

  /** After a successful save: drop drafts of the given ids unless edits made meanwhile keep the plan dirty. */
  afterSaved(...ids: string[]): void {
    if (this.h.save.state !== 'saved') return;
    this.h.drafts.setLastPlanId(this.h.plan!.id);
    void this.refreshPlans();
    this.h.drafts.cancel();
    // An undecided older draft stays until the user restores or discards it.
    for (const id of ids) if (this.h.pendingDraft?.planId !== id) this.h.drafts.clear(id);
    if (this.h.save.dirty && !this.draftBlocked()) this.h.drafts.schedule(() => this.makeDraft());
  }

  currentPlan(): Plan {
    const plan = this.h.plan!;
    const levels = plan.levels.map((l, i) => (i === 0 ? this.h.history!.current : l));
    return { ...plan, levels, revision: this.h.save.baseRevision ?? 0 };
  }

  async doSave(): Promise<void> {
    if (!this.h.plan || this.h.save.state === 'saving') return;
    await this.h.save.save(this.currentPlan());
    this.afterSaved(this.h.plan.id);
    if (this.h.save.state === 'conflict') this.h.dialog = 'conflict';
  }

  async doOverwrite(): Promise<void> {
    if (!this.h.plan || this.h.save.state === 'saving') return;
    await this.h.save.overwrite(this.currentPlan());
    this.afterSaved(this.h.plan.id);
    // A second conflict (e.g. the plan was deleted elsewhere) leaves only "Save as new".
    this.h.dialog = this.h.save.state === 'conflict' ? 'conflict-again' : 'none';
  }

  async doSaveAsNew(): Promise<void> {
    if (!this.h.plan || this.h.save.state === 'saving') return;
    const name = `${this.h.plan.name} ${t('plan.copySuffix', this.h.uiLang)}`;
    const oldId = this.h.plan.id;
    const res = await this.h.save.saveAsNew(this.currentPlan(), name);
    if (res) { this.h.plan = res; this.h.dialog = 'none'; this.afterSaved(oldId, res.id); } else if (this.h.save.state === 'error') this.h.dialog = 'none';
  }
}
