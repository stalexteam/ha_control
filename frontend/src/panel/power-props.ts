import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Id, Level } from '../model/types';
import {
  clearPins, deleteBlock, deleteWire, placeableDevices, updateBlock,
  type Position, type PowerBlock, type PowerFrame, type PowerSchema, type PowerSwitch, type PowerWire, type WireEnd,
} from '../model/power';
import { POWER, activeRoleSpecs } from '../model/bindings';
import { candidates, entityLabel, type MatchSpec } from '../binding/candidates';
import type { HaMeta, States } from '../binding/ha-meta';
import '../binding/entity-combo';
import { blockName, type GeoCtx } from '../geometry/power';
import { formatWatts } from '../render/power-svg';
import { BUS_MIN } from '../editor/tools/power-select-tool';
import type { Selection } from '../editor/tools/types';
import { fieldValue } from './field-value';
import { numField, row, select } from './fields';
import type { ToolId } from './tool-factory';
import { t } from '../i18n';

/** Strict entity filters of the block fields (power uses the Binding step's POWER spec). */
export const VOLTAGE: MatchSpec = { domains: ['sensor'], deviceClasses: ['voltage'], units: ['V'] };
export const SOC: MatchSpec = { domains: ['sensor'], deviceClasses: ['battery'], units: ['%'] };
export const SWITCH: MatchSpec = { domains: ['switch'] };
/** The thinnest bus, in schematic units. */
const BUS_THICK_MIN = 6;
const POSITIONS: Position[] = ['A', '0', 'B'];
/** A plan device's bindings the schematic reads: its meter and its switch. */
const BOUND_ROLES = ['power', 'control'] as const;

export interface PowerPropsOpts {
  power: PowerSchema;
  /** The level whose devices the schematic's device blocks refer to. */
  level: Level;
  selection: Selection | null;
  /** Structural HA metadata; live values come from `states`. */
  meta: HaMeta;
  states: States;
  /** The live frame, or null (no live values: a dash). */
  frame: PowerFrame | null;
  /** Session error or warning text. */
  notice: string | null;
  /** Why there are no live values (the live feed's subscription failed), or null. */
  feedError: string | null;
  toolId: ToolId;
  /** The plan device the Plan device tool places next, or null. */
  placeDeviceId: Id | null;
  /** Arms a plan device for the Plan device tool. */
  onPlaceDevice(id: Id): void;
  /** Pushes an undoable edit of the schematic. */
  commitPower(next: PowerSchema): void;
  /** Sets a transfer switch position live (not a plan edit). */
  setPosition(blockId: Id, p: Position): void;
}

type Block<K extends PowerBlock['kind']> = Extract<PowerBlock, { kind: K }>;
type Field = 'power' | 'voltage' | 'soc' | 'switch';

/** Sets an entity field of a block, or removes it (null). Entity fields never change the block's ports. */
function setField(o: PowerPropsOpts, b: PowerBlock, key: Field, value: string | PowerSwitch | null): void {
  const { [key]: _drop, ...rest } = b as PowerBlock & Partial<Record<Field, unknown>>;
  const next = (value === null ? rest : { ...rest, [key]: value }) as PowerBlock;
  o.commitPower({ ...o.power, blocks: o.power.blocks.map(x => (x.id === b.id ? next : x)) });
}

/** A strict entity combobox under its label, like a Binding step role. */
function entityField(o: PowerPropsOpts, field: Field, label: string, spec: MatchSpec, value: string | undefined,
  set: (eid: string | null) => void): TemplateResult {
  return html`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${field}>${label}</span></div>
    <ps-entity-combo data-field=${field} .meta=${o.meta} .states=${o.states} .items=${candidates(o.meta, spec, false)}
      .value=${value ?? null} .label=${label} @value-changed=${(e: CustomEvent<{ value: string | null }>) => {
        e.stopPropagation();
        const eid = e.detail.value || null;
        if (eid !== (value ?? null)) set(eid);
      }}></ps-entity-combo>
  </div>`;
}

function check(field: string, label: string, value: boolean, on: (v: boolean) => void): TemplateResult {
  return html`<div class="cflag">${row(label, html`<input type="checkbox" data-field=${field} .checked=${fieldValue(value)}
    @change=${(e: Event) => on((e.target as HTMLInputElement).checked)} />`)}</div>`;
}

/** The block name; a blank name reverts. The placeholder is the name the canvas shows for an unnamed block. */
function nameRow(o: PowerPropsOpts, b: PowerBlock): TemplateResult {
  const cur = b.name ?? '';
  return row(t('props.name'), html`<input class="val wide" type="text" data-field="name"
    placeholder=${t(`power.kind.${b.kind}`)} .value=${fieldValue(cur)} @change=${(e: Event) => {
      const el = e.target as HTMLInputElement;
      const name = el.value.trim();
      if (name && name !== cur) o.commitPower(updateBlock(o.power, b.id, { name }));
      else el.value = cur;
    }} />`);
}

/** The plan device's power and control bindings, read-only (they are edited in the Binding step). */
function boundRows(o: PowerPropsOpts, d: Device): TemplateResult {
  const roles = new Set(activeRoleSpecs(d).map(s => s.role));
  return html`${BOUND_ROLES.filter(r => roles.has(r)).map(r => {
    const eid = d.bindings?.[r];
    return html`<div class="role">
      <div class="role-head"><span class="role-label">${t(`role.${r}`)}</span></div>
      <div class="bound" data-bound=${r}>${eid
        ? html`<b>${entityLabel(o.meta, eid).name}</b><small>${eid}</small>` : '—'}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${t('power.boundHint')}</p>`;
}

function deviceFields(o: PowerPropsOpts, b: Block<'device'>): TemplateResult {
  const d = o.level.devices.find(x => x.id === b.deviceId);
  return html`
    ${row(t('props.name'), html`<span class="val ro" data-field="device-name">${d?.name ?? '—'}</span>`)}
    ${d ? html`${row(t('props.kind'), html`<span class="val ro">${t(`device.${d.props.kind}`)}</span>`)}${boundRows(o, d)}`
      : html`<p class="warn" data-note="device-missing">${t('power.missing')}</p>`}
    ${check('inverter', t('power.inverter'), !!b.inverter, on => o.commitPower(updateBlock(o.power, b.id, { inverter: on })))}`;
}

function meterFields(o: PowerPropsOpts, b: Block<'meter'>): TemplateResult {
  const sw = b.switch;
  return html`
    ${entityField(o, 'power', t('power.field.power'), POWER, b.power, v => setField(o, b, 'power', v))}
    ${entityField(o, 'voltage', t('power.field.voltage'), VOLTAGE, b.voltage, v => setField(o, b, 'voltage', v))}
    ${entityField(o, 'switch', t('power.field.switch'), SWITCH, sw?.entity,
      v => setField(o, b, 'switch', v ? { entity: v, controllable: sw?.controllable ?? false } : null))}
    ${sw ? check('controllable', t('power.controllable'), sw.controllable,
      on => setField(o, b, 'switch', { ...sw, controllable: on })) : nothing}`;
}

/** Form, and the live position buttons (the live position is marked; none without a frame). */
function transferFields(o: PowerPropsOpts, b: Block<'transfer'>): TemplateResult {
  const live = o.frame?.blocks[b.id]?.position;
  const forms = (['2in1out', '1in2out'] as const).map(v => ({ v, label: t(`power.form.${v}`) }));
  return html`
    ${row(t('power.form'), select(b.form, forms, v => {
      if (v !== b.form) o.commitPower(updateBlock(o.power, b.id, { form: v }));
    }, 'form'))}
    <div class="row"><span>${t('power.position')}</span><span class="seg pos">${POSITIONS.map(p => html`
      <button class=${p === live ? 'on' : ''} data-position=${p} @click=${() => o.setPosition(b.id, p)}>${p}</button>`)}
    </span></div>
    <p class="note">${t('power.positionHint')}</p>`;
}

/**
 * Orientation (switching swaps w and h; wire `at` values run along the long side, so the wires stay on), Length (the
 * long side, at least BUS_MIN) and Thickness (at least 6); the length stays above the thickness.
 */
function busFields(o: PowerPropsOpts, b: Block<'bus'>): TemplateResult {
  const horizontal = b.w >= b.h;
  const len = horizontal ? b.w : b.h;
  const thick = horizontal ? b.h : b.w;
  const resize = (l: number, th: number): false | void => {
    if (l === len && th === thick) return false; // a clamped value equal to the current one shows the current one
    o.commitPower(updateBlock(o.power, b.id, horizontal ? { w: l, h: th } : { w: th, h: l }));
  };
  const num = (field: string, value: number, apply: (v: number) => false | void) =>
    numField({ value, rule: { min: 1 }, bad: 'props.badNumber', field, skipSame: true, apply });
  const orientations = (['h', 'v'] as const).map(v => ({ v, label: t(`power.orientation.${v}`) }));
  return html`
    ${row(t('power.orientation'), select(horizontal ? 'h' : 'v', orientations, v => {
      if (v !== (horizontal ? 'h' : 'v')) o.commitPower(updateBlock(o.power, b.id, { w: b.h, h: b.w }));
    }, 'bus-orientation'))}
    ${row(t('power.busLength'), num('bus-length', len, v => resize(Math.max(BUS_MIN, thick + 1, v), thick)))}
    ${row(t('power.busThickness'), num('bus-thickness', thick, v => resize(len, Math.min(Math.max(BUS_THICK_MIN, v), len - 1))))}`;
}

function kindFields(o: PowerPropsOpts, b: PowerBlock): TemplateResult | typeof nothing {
  switch (b.kind) {
    case 'grid': return html`
      ${entityField(o, 'power', t('power.field.power'), POWER, b.power, v => setField(o, b, 'power', v))}
      ${entityField(o, 'voltage', t('power.field.voltage'), VOLTAGE, b.voltage, v => setField(o, b, 'voltage', v))}`;
    case 'device': return deviceFields(o, b);
    case 'meter': return meterFields(o, b);
    case 'battery': return html`
      ${entityField(o, 'power', t('power.field.batteryPower'), POWER, b.power, v => setField(o, b, 'power', v))}
      ${entityField(o, 'soc', t('power.field.soc'), SOC, b.soc, v => setField(o, b, 'soc', v))}`;
    case 'pv': return entityField(o, 'power', t('power.field.power'), POWER, b.power, v => setField(o, b, 'power', v));
    case 'transfer': return transferFields(o, b);
    case 'bus': return busFields(o, b);
    default: return nothing;
  }
}

function blockProps(o: PowerPropsOpts, b: PowerBlock): TemplateResult {
  const pinned = !!b.portPins && Object.keys(b.portPins).length > 0;
  return html`
    <h4>${t(`power.title.${b.kind}`)}</h4>
    ${b.kind === 'device' ? nothing : nameRow(o, b)}
    ${kindFields(o, b)}
    <div class="pactions">
      ${pinned ? html`<button class="btn" data-action="auto-ports"
        @click=${() => o.commitPower(clearPins(o.power, b.id))}>${t('power.autoPorts')}</button>` : nothing}
      ${b.kind === 'grid' ? nothing : html`<button class="btn danger" data-action="delete-block"
        @click=${() => o.commitPower(deleteBlock(o.power, b.id))}>${t('action.delete')}</button>`}
    </div>`;
}

/** A wire: its ends (block name and port, or the bus name), the live value or a dash, and Delete. */
function wireProps(o: PowerPropsOpts, w: PowerWire): TemplateResult {
  const g: GeoCtx = { device: id => o.level.devices.find(d => d.id === id) };
  const end = (e: WireEnd): string => {
    const b = o.power.blocks.find(x => x.id === ('block' in e ? e.block : e.bus));
    const name = b ? blockName(b, g) || t(`power.kind.${b.kind}`) : '—';
    return 'block' in e ? `${name} · ${e.port}` : name;
  };
  return html`
    <h4>${t('power.wire')}</h4>
    ${row(t('power.wire.from'), html`<span class="val ro wide" data-field="wire-from">${end(w.from)}</span>`)}
    ${row(t('power.wire.to'), html`<span class="val ro wide" data-field="wire-to">${end(w.to)}</span>`)}
    ${row(t('power.wire.power'), html`<span class="val ro" data-field="wire-power">${formatWatts(o.frame?.wires[w.id]?.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => o.commitPower(deleteWire(o.power, w.id))}>${t('action.delete')}</button></div>`;
}

/** The Plan device tool's list: a click arms the device, the next canvas click places it. */
function deviceList(o: PowerPropsOpts): TemplateResult {
  const list = placeableDevices(o.level, o.power);
  return html`
    <p class="muted" data-note="power-hint">${t('power.help.device')}</p>
    ${list.length === 0 ? html`<p class="muted" data-note="no-devices">${t('power.noDevices')}</p>` : html`<div class="pdevs">
      ${list.map(d => html`<button class="pdev${d.id === o.placeDeviceId ? ' sel' : ''}" data-place-device=${d.id}
        aria-pressed=${d.id === o.placeDeviceId ? 'true' : 'false'} @click=${() => o.onPlaceDevice(d.id)}>
        <span class="name">${d.name}</span><span class="kind">${t(`device.${d.props.kind}`)}</span>
      </button>`)}
    </div>`}`;
}

function content(o: PowerPropsOpts): TemplateResult {
  if (o.toolId === 'power-device') return deviceList(o);
  const s = o.selection;
  const b = s?.kind === 'powerBlock' ? o.power.blocks.find(x => x.id === s.id) : undefined;
  if (b) return blockProps(o, b);
  const w = s?.kind === 'powerWire' ? o.power.wires.find(x => x.id === s.id) : undefined;
  if (w) return wireProps(o, w);
  if (o.toolId !== 'power-select') return html`<p class="muted" data-note="power-hint">${t('power.help.place')}</p>`;
  return html`<p class="muted" data-note="power-hint">${t('power.pick')}</p><p class="muted">${t('power.help.select')}</p>`;
}

/**
 * The Power step properties: the live feed error at the top, then the Plan device tool's device list, the selected
 * block (name, per-kind entity fields, Inverter, transfer form and live position, bus size, Auto ports, Delete) or
 * wire (ends, live value, Delete), or a hint. Every edit is one undoable commit; a transfer position is live state,
 * not an edit.
 */
export function renderPowerProps(o: PowerPropsOpts): TemplateResult {
  return html`<div class="props pprops">
    ${o.notice ? html`<p class="warn" data-notice="session" role="alert">${o.notice}</p>` : nothing}
    ${o.feedError ? html`<p class="note" data-notice="feed">${o.feedError}</p>` : nothing}
    ${content(o)}
  </div>`;
}
