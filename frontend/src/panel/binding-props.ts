import { html, nothing, type TemplateResult } from 'lit';
import type { BindingRole, Device, Level } from '../model/types';
import { ROLE_SPECS, alsoBoundTo, setBinding, type BindStatus, type RoleSpec } from '../model/bindings';
import { autoFill, candidates, haDevicesFor } from '../binding/candidates';
import { presence, type HaMeta } from '../binding/ha-meta';
import '../binding/entity-combo';
import { t } from '../i18n';
import { select } from './fields';

export interface BindingPropsOpts {
  level: Level;
  /** The selected device, or null. */
  device: Device | null;
  meta: HaMeta;
  status: (d: Device) => BindStatus;
  /** "Show all" per role, for the session. */
  showAll: Record<string, boolean>;
  onShowAll(key: string): void;
  commit(next: Level): void;
  onNextUnbound(): void;
  /** Report of the last HA device auto-fill, or null. */
  notice: string | null;
  setNotice(msg: string | null): void;
  /** Registry load failure text, shown with Retry; null when loaded or loading. */
  registryError: string | null;
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

/**
 * A select of the HA devices with a strict match for any role of the kind. Choosing one fills the empty roles
 * that have exactly one match on it, in one commit, and reports the result; the select then returns to its prompt.
 */
function haDevicePicker(o: BindingPropsOpts, d: Device): TemplateResult {
  const devices = haDevicesFor(o.meta, d.props.kind);
  const options = [
    { v: '', label: t(devices.length ? 'binding.haDevicePick' : 'binding.haDeviceNone') },
    ...devices.map(x => ({ v: x.id, label: x.model ? `${x.name} (${x.model})` : x.name })),
  ];
  const fill = (haId: string): false => {
    if (!haId) return false;
    const r = autoFill(o.level, d.id, haId, o.meta);
    const specs = ROLE_SPECS[d.props.kind];
    const several = r.ambiguous.map(role => ({
      role, n: candidates(o.meta, specs.find(s => s.role === role)!, false).filter(e => e.deviceId === haId).length,
    }));
    if (r.level !== o.level) o.commit(r.level);
    o.setNotice(fillReport(r.filled, several));
    return false; // an action, not a value: the select goes back to its prompt
  };
  return html`<label class="bfield"><span>${t('binding.haDevice')}</span>${select('', options, fill, 'ha-device')}</label>`;
}

/** Notes under a bound field: missing or unavailable in HA, and the other devices bound to the same entity. */
function notes(o: BindingPropsOpts, d: Device, eid: string): TemplateResult {
  const p = presence(o.meta, eid);
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
    <ps-entity-combo data-role=${role} .meta=${o.meta} .items=${candidates(o.meta, spec, all)} .value=${eid}
      .label=${roleLabel(role)} @value-changed=${(e: CustomEvent<{ value: string | null }>) => {
        e.stopPropagation();
        const next = setBinding(o.level, d.id, role, e.detail.value);
        if (next === o.level) return;
        o.setNotice(null);
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
  const open = o.level.devices.filter(x => o.status(x) !== 'bound').length;
  return html`<div class="props bprops">
    ${o.registryError ? html`<div class="reg-error" data-notice="registry"><p class="warn">${o.registryError}</p>
      <button class="btn" data-action="retry-registry" @click=${() => o.onRetry()}>${t('action.retry')}</button></div>` : nothing}
    ${d ? html`
      <h4>${d.name}</h4>
      <p class="muted kind">${t(`device.${d.props.kind}`)}</p>
      ${haDevicePicker(o, d)}
      ${o.notice ? html`<p class="note" data-notice="fill">${o.notice}</p>` : nothing}
      ${ROLE_SPECS[d.props.kind].map(spec => roleField(o, d, spec))}`
    : html`<p class="muted">${t('binding.pick')}</p>`}
    <div class="bfoot">
      <span>${t('binding.notBound').replace('{n}', String(open))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => o.onNextUnbound()}>${t('steps.nextUnbound')}</button>
    </div>
  </div>`;
}
