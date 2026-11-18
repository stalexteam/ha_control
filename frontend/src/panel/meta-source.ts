import { loadRegistries, mergeMeta, metaFromStates, sameStructure, type HaMeta, type Registries, type States } from '../binding/ha-meta';
import { messageOf } from '../errors';
import { t } from '../i18n';
import type { PlanStudioPanel } from './plan-studio-panel';

/**
 * HA metadata for the Binding step: entities from `hass.states`, merged with the entity, device and area
 * registries once they are loaded.
 * - The metadata is structural (names, classes, units, devices, areas). HA hands over a new `hass.states` on every
 *   state change; the metadata, and with it the memoised candidate lists, keep their identity unless the entity
 *   set or a structural attribute changed. Live values (state text, "unavailable") are read from `hass.states`.
 * - The registries load on the first entry to the Binding step. A failure keeps the states-only metadata (nothing
 *   is flagged Missing) and leaves a notice until Retry succeeds. Reload runs the same load again.
 */
export class MetaSource {
  /** User-facing registry load failure, or null. */
  error: string | null = null;
  private regs: Registries | null = null;
  private tried = false;
  private pending = false;
  /** States-only metadata and the latest states it is known to match. */
  private base: { states: States; meta: HaMeta } | null = null;
  private merged: { base: HaMeta; regs: Registries | null; meta: HaMeta } | null = null;

  constructor(private readonly h: Pick<PlanStudioPanel, 'hass' | 'requestUpdate'> & { liveStates?: States }) {}

  /** A registry load is in progress. */
  get loading(): boolean { return this.pending; }

  get(): HaMeta {
    const states = this.h.liveStates ?? this.h.hass?.states;
    const b = this.base;
    if (!b || !sameStructure(b.states, states)) this.base = { states, meta: metaFromStates(states) };
    else b.states = states;
    const base = this.base!.meta;
    const m = this.merged;
    if (m && m.base === base && m.regs === this.regs) return m.meta;
    const meta = this.regs ? mergeMeta(base, this.regs) : base;
    this.merged = { base, regs: this.regs, meta };
    return meta;
  }

  /** First entry to the Binding step: loads the registries unless an attempt was made already. */
  enter(): void {
    if (!this.tried) this.retry();
  }

  /**
   * Loads the registries (again, when loaded already: Retry after a failure, "Reload from Home Assistant"); a no-op
   * while a load runs. The panel re-renders when the load starts and settles. A failed reload keeps the older registries.
   */
  retry(): void {
    const hass = this.h.hass;
    if (this.pending || !hass) return;
    this.tried = true;
    this.pending = true;
    this.h.requestUpdate();
    void loadRegistries(hass).then(
      regs => { this.regs = regs; this.error = null; },
      err => { this.error = t('binding.registryError').replace('{error}', messageOf(err)); },
    ).finally(() => { this.pending = false; this.h.requestUpdate(); });
  }
}
