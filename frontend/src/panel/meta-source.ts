import { loadRegistries, mergeMeta, metaFromStates, type HaMeta, type Registries } from '../binding/ha-meta';
import { messageOf } from '../errors';
import { t } from '../i18n';
import type { PlanStudioPanel } from './plan-studio-panel';

/**
 * HA metadata for the Binding step: entities from `hass.states`, merged with the entity, device and area
 * registries once they are loaded. The registries load on the first entry to the Binding step; a failure keeps
 * the states-only metadata (nothing is flagged Missing) and leaves a notice until Retry succeeds. The merged
 * metadata is memoised on the identity of `hass.states` and of the loaded registries.
 */
export class MetaSource {
  /** User-facing registry load failure, or null. */
  error: string | null = null;
  private regs: Registries | null = null;
  private tried = false;
  private pending = false;
  private memo: { states: unknown; regs: Registries | null; meta: HaMeta } | null = null;

  constructor(private readonly h: Pick<PlanStudioPanel, 'hass' | 'requestUpdate'>) {}

  get(): HaMeta {
    const states = this.h.hass?.states;
    const m = this.memo;
    if (m && m.states === states && m.regs === this.regs) return m.meta;
    const base = metaFromStates(states);
    const meta = this.regs ? mergeMeta(base, this.regs) : base;
    this.memo = { states, regs: this.regs, meta };
    return meta;
  }

  /** First entry to the Binding step: loads the registries unless an attempt was made already. */
  enter(): void {
    if (!this.tried) this.retry();
  }

  /** Loads the registries unless they are loaded or loading; the panel re-renders when the load settles. */
  retry(): void {
    const hass = this.h.hass;
    if (this.regs || this.pending || !hass) return;
    this.tried = true;
    this.pending = true;
    void loadRegistries(hass).then(
      regs => { this.regs = regs; this.error = null; },
      err => { this.error = t('binding.registryError').replace('{error}', messageOf(err)); },
    ).finally(() => { this.pending = false; this.h.requestUpdate(); });
  }
}
