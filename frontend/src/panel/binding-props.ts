import { html, nothing, type TemplateResult } from 'lit';
import type { BindingRole, Device, Level } from '../model/types';
import { ROLE_SPECS, alsoBoundTo, countNotBound, setBinding, type BindStatus, type RoleSpec } from '../model/bindings';
import { autoFill, candidates, haDevicesFor } from '../binding/candidates';
import { presence, type HaMeta, type States } from '../binding/ha-meta';
import '../binding/entity-combo';
import '../binding/device-combo';
import { t } from '../i18n';

export interface BindingPropsOpts {
  level: Level;
  /** The selected device, or null. */
  device: Device | null;
  /** Structural HA metadata; live values come from `states`. */
  meta: HaMeta;
  /** hass.states: live state values (shown on rows, and "unavailable"). */
  states: States;
  status: (d: Device) => BindStatus;
  /** "Show all" per role, for the session. */
  showAll: Partial<Record<BindingRole, boolean>>;
  onShowAll(role: BindingRole): void;
  commit(next: Level): void;
  onNextUnbound(): void;
  /** Session error (plan switch or open failure), shown as a warning whatever is selected; or null. */
  notice: string | null;
  /** Report of the last HA device auto-fill, or null. */
  fillNotice: string | null;
  setFillNotice(msg: string | null): void;
  /** Registry load failure text, shown with Retry; null when loaded or not tried yet. */
  registryError: string | null;
  /** A registry load is running: Retry shows "Loading…" and is disabled. */
  registryLoading: boolean;
  onRetry(): void;
}

const roleLabel = (r: BindingRole): string => t(`role.${r}`);

/** What the HA device picker filled, and the roles left empty because several entities matched (with the count). */
function fillReport(filled: BindingRole[], several: { role: BindingRole; n: number }[]): string {
  if (filled.length === 0 && several.length === 0) return t('binding.nothingToFill');
  const head = filled.length
    ? t('binding.filled').replace('{roles}', filled.map(roleLabel).join(', '))
    : t('binding.nothingFilled');
  if (several.length === 0) return head;
  return `${head}; ${t('binding.several').replace('{roles}', several.map(s => `${roleLabel(s.role)} (${s.n})`).join(', '))}`;
}

/** Placeholder key of the HA device picker: devices to choose, registries loading, load failed, or none match. */
function pickerText(o: BindingPropsOpts, n: number): string {
  if (n > 0) return 'binding.haDevicePick';
  if (o.registryLoading || (!o.meta.registryLoaded && !o.registryError)) return 'binding.haDevicesLoading';
  return !o.meta.registryLoaded ? 'binding.haDevicesUnavailable' : 'binding.haDeviceNone';
}

/**
 * A searchable picker of the HA devices with a strict match for any role of the kind (by name, model and area).
 * Choosing one fills the empty roles that have exactly one match on it, in one commit, and reports the result.
 */
function haDevicePicker(o: BindingPropsOpts, d: Device): TemplateResult {
  const devices = haDevicesFor(o.meta, d.props.kind);
  const fill = (haId: string): void => {
    const r = autoFill(o.level, d.id, haId, o.meta);
    const specs = ROLE_SPECS[d.props.kind];
    const several = r.ambiguous.map(role => ({
      role, n: candidates(o.meta, specs.find(s => s.role === role)!, false).filter(e => e.deviceId === haId).length,
    }));
    if (r.level !== o.level) o.commit(r.level);
    o.setFillNotice(fillReport(r.filled, several));
  };
  return html`<div class="bfield"><span>${t('binding.haDevice')}</span>
    <ps-device-combo data-field="ha-device" .meta=${o.meta} .devices=${devices} .label=${t('binding.haDevice')}
      .placeholder=${t(pickerText(o, devices.length))}
      @value-changed=${(e: CustomEvent<{ value: string | null }>) => {
        e.stopPropagation();
        if (e.detail.value) fill(e.detail.value);
      }}></ps-device-combo></div>`;
}

/** Notes under a bound field: missing or unavailable in HA, and the other devices bound to the same entity. */
function notes(o: BindingPropsOpts, d: Device, eid: string): TemplateResult {
  const p = presence(o.meta, eid, o.states);
  const others = alsoBoundTo(o.level, eid, d.id);
  return html`
    ${p === 'missing' ? html`<p class="warn" data-note="missing">${t('binding.missing')}</p>` : nothing}
    ${p === 'unavailable' ? html`<p class="note" data-note="unavailable">${t('binding.unavailable')}</p>` : nothing}
    ${others.length ? html`<p class="note" data-note="also">${t('binding.alsoBound')
      .replace('{names}', others.map(x => x.name).join(', '))}</p>` : nothing}`;
}

/** One role: its label, a "Show all" switch and the entity combobox fed by the role's candidates. */
function roleField(o: BindingPropsOpts, d: Device, spec: RoleSpec): TemplateResult {
  const { role } = spec;
  const eid = d.bindings?.[role] ?? null;
  const all = !!o.showAll[role];
  return html`<div class="role" data-role=${role}>
    <div class="role-head">
      <span class="role-label">${roleLabel(role)}</span>
      <label class="showall"><input type="checkbox" data-showall=${role} .checked=${all}
        @change=${() => o.onShowAll(role)} />${t('binding.showAll')}</label>
    </div>
    <ps-entity-combo data-role=${role} .meta=${o.meta} .states=${o.states} .items=${candidates(o.meta, spec, all)} .value=${eid}
      .label=${roleLabel(role)} @value-changed=${(e: CustomEvent<{ value: string | null }>) => {
        e.stopPropagation();
        const next = setBinding(o.level, d.id, role, e.detail.value);
        if (next === o.level) return;
        o.setFillNotice(null);
        o.commit(next);
      }}></ps-entity-combo>
    ${eid ? notes(o, d, eid) : nothing}
  </div>`;
}

/**
 * Binding step properties: the selected device's name and kind, the HA device picker and one field per role;
 * with nothing selected, an invitation to pick a device. The footer counts the devices not bound and offers
 * Next unbound device.
 */
export function renderBindingProps(o: BindingPropsOpts): TemplateResult {
  const d = o.device;
  const open = countNotBound(o.level.devices.map(o.status));
  return html`<div class="props bprops">
    ${o.notice ? html`<p class="warn" data-notice="session" role="alert">${o.notice}</p>` : nothing}
    ${o.registryError ? html`<div class="reg-error" data-notice="registry"><p class="warn">${o.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${o.registryLoading}
        @click=${() => o.onRetry()}>${t(o.registryLoading ? 'load.loading' : 'action.retry')}</button></div>` : nothing}
    ${d ? html`
      <h4>${d.name}</h4>
      <p class="muted kind">${t(`device.${d.props.kind}`)}</p>
      ${haDevicePicker(o, d)}
      ${o.fillNotice ? html`<p class="note" data-notice="fill">${o.fillNotice}</p>` : nothing}
      ${ROLE_SPECS[d.props.kind].map(spec => roleField(o, d, spec))}`
    : html`<p class="muted">${t('binding.pick')}</p>`}
    <div class="bfoot">
      <span>${t('binding.notBound').replace('{n}', String(open))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => o.onNextUnbound()}>${t('steps.nextUnbound')}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${o.registryLoading}
      @click=${() => o.onRetry()}>${t('binding.reload')}</button>
  </div>`;
}
