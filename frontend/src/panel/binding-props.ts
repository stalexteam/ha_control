import { html, nothing, type TemplateResult } from 'lit';
import { isContainerKind, type BindingRole, type Device, type Level } from '../model/types';
import {
  activeRoleSpecs, alsoBoundTo, countNotBound, isTriggerRole, setBinding, type BindStatus, type RoleSpec,
} from '../model/bindings';
import { candidates } from '../binding/candidates';
import { presence, type HaMeta, type States } from '../binding/ha-meta';
import '../binding/entity-combo';
import { setDeviceProps } from '../model/devices';
import { deviceNameRow } from './device-props';
import { containerFields, containerFlags, triggerFields } from './container-fields';
import type { ContainerFeed } from '../live/container-feed';
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
  /** The message for a rejected field value (slot, window, event), shown with the session error; or null. */
  fieldNotice: string | null;
  /** Shows (or, with null, clears) the message for a rejected field value. */
  setFieldNotice(msg: string | null): void;
  /** Registry load failure text, shown with Retry; null when loaded or not tried yet. */
  registryError: string | null;
  /** A registry load is running: Retry shows "Loading…" and is disabled. */
  registryLoading: boolean;
  onRetry(): void;
  /** Live container outputs of the open plan, for the output line. */
  feed: Pick<ContainerFeed, 'ready' | 'error' | 'stateOf'>;
}

/** The role's name; a smart button in toggle mode calls its `on` role "On / Off" (that trigger does both). */
function roleLabel(d: Device, r: BindingRole): string {
  return r === 'on' && d.props.kind === 'smart_button' && !d.props.separateOff ? t('binding.onOff') : t(`role.${r}`);
}

/**
 * Output line of an input container: its live output; "Not saved yet" when the saved plan has no such container (or
 * has it as the other kind, after an unsaved Type change); the feed error when there are no live outputs. Nothing
 * until the runtime first answers, or for other kinds.
 */
function outputLine(o: BindingPropsOpts, d: Device): TemplateResult | typeof nothing {
  if (!isContainerKind(d.props.kind)) return nothing;
  const s = o.feed.stateOf(d);
  const text = s ? null : o.feed.error ?? (o.feed.ready ? t('output.notSaved') : null);
  return text === null ? nothing : html`<p class="note" data-field="output">${text}</p>`;
}

/** Notes under a bound field: missing or unavailable in HA, and the other devices bound to the same entity (or trigger). */
function notes(o: BindingPropsOpts, d: Device, role: BindingRole, eid: string): TemplateResult {
  const p = presence(o.meta, eid, o.states);
  const others = alsoBoundTo(o.level, d, role);
  return html`
    ${p === 'missing' ? html`<p class="warn" data-note="missing">${t('binding.missing')}</p>` : nothing}
    ${p === 'unavailable' ? html`<p class="note" data-note="unavailable">${t('binding.unavailable')}</p>` : nothing}
    ${others.length ? html`<p class="note" data-note="also">${t('binding.alsoBound')
      .replace('{names}', others.map(x => x.name).join(', '))}</p>` : nothing}`;
}

/**
 * One role: its label, a "Show all" switch and the entity combobox fed by the role's candidates; a smart button
 * trigger role adds its slot and event under the combobox.
 */
function roleField(o: BindingPropsOpts, d: Device, spec: RoleSpec): TemplateResult {
  const { role } = spec;
  const eid = d.bindings?.[role] ?? null;
  const all = !!o.showAll[role];
  const label = roleLabel(d, role);
  return html`<div class="role" data-role=${role}>
    <div class="role-head">
      <span class="role-label">${label}</span>
      <label class="showall"><input type="checkbox" data-showall=${role} .checked=${all}
        @change=${() => o.onShowAll(role)} />${t('binding.showAll')}</label>
    </div>
    <ps-entity-combo data-role=${role} .meta=${o.meta} .states=${o.states} .items=${candidates(o.meta, spec, all)} .value=${eid}
      .label=${label} @value-changed=${(e: CustomEvent<{ value: string | null }>) => {
        e.stopPropagation();
        const next = setBinding(o.level, d.id, role, e.detail.value);
        if (next === o.level) return;
        o.commit(next);
      }}></ps-entity-combo>
    ${d.props.kind === 'smart_button' && isTriggerRole(role) ? triggerFields(o, d, role) : nothing}
    ${eid ? notes(o, d, role, eid) : nothing}
  </div>`;
}

/**
 * Binding step properties: the selected device's name and kind, an input container's output line, one field
 * per active role and, for an input container, its checkboxes after the sections above them and
 * its settings after the roles; with nothing selected, an invitation to pick a device. The footer counts the devices
 * not bound and offers Next unbound device.
 */
export function renderBindingProps(o: BindingPropsOpts): TemplateResult {
  const d = o.device;
  const open = countNotBound(o.level.devices.map(o.status));
  return html`<div class="props bprops">
    ${o.notice ? html`<p class="warn" data-notice="session" role="alert">${o.notice}</p>` : nothing}
    ${o.fieldNotice ? html`<p class="warn" data-notice="field" role="alert">${o.fieldNotice}</p>` : nothing}
    ${o.registryError ? html`<div class="reg-error" data-notice="registry"><p class="warn">${o.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${o.registryLoading}
        @click=${() => o.onRetry()}>${t(o.registryLoading ? 'load.loading' : 'action.retry')}</button></div>` : nothing}
    ${d ? html`
      <h4>${t(`device.${d.props.kind}`)}</h4>
      ${deviceNameRow(d, name => o.commit(setDeviceProps(o.level, d.id, {}, name)))}
      ${outputLine(o, d)}
      ${activeRoleSpecs(d).map(spec => html`${roleField(o, d, spec)}${containerFlags(o, d, spec.role)}`)}
      ${containerFields(o, d)}`
    : html`<p class="muted">${t('binding.pick')}</p>`}
    <div class="bfoot">
      <span>${t('binding.notBound').replace('{n}', String(open))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => o.onNextUnbound()}>${t('steps.nextUnbound')}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${o.registryLoading}
      @click=${() => o.onRetry()}>${t('binding.reload')}</button>
  </div>`;
}
