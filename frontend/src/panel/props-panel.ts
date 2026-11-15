import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import type { Baseline, Level, Opening, OpeningKind, Side, Wall, WallType } from '../model/types';
import { WALL_PRESETS } from '../model/types';
import { deleteWall, setWallProps } from '../model/ops';
import { deleteOpening, moveOpening, resizeOpening, setOpeningProps } from '../model/openings';
import { deleteZone, renameZone } from '../model/zones';
import { wallFrame } from '../geometry/walls';
import { roomAreaM2 } from '../geometry/rooms';
import type { Selection } from '../editor/tools/types';
import { formatArea, formatMm } from '../render/plan-svg';
import { t } from '../i18n';
import { parseMm, type ToolId } from './toolbar';

export type BoxMeasure = 'inner' | 'axis' | 'outer';

export interface PropsOpts {
  level: Level;
  selection: Selection | null;
  tool: ToolId;
  boxMeasure: BoxMeasure;
  /** Settings for the next wall drawn (shared with the top bar). */
  wallType: WallType;
  thickness: number;
  lang: string;
  /** Validation message from the last rejected edit, shown under the fields. */
  notice: string | null;
  commit(next: Level): void;
  /** Commits a level in which the selected element was deleted. */
  remove(next: Level): void;
  setBoxMeasure(m: BoxMeasure): void;
  setWallType(type: WallType): void;
  setThickness(mm: number): void;
  setNotice(msg: string | null): void;
}

const DOOR_KINDS: OpeningKind[] = ['door', 'gate', 'wicket'];

/** Patch for a kind switch: doors get hinge+swing, windows get outside, irrelevant fields are dropped. */
export function kindPatch(o: Opening, kind: OpeningKind): Partial<Opening> {
  if (DOOR_KINDS.includes(kind)) return { kind, hinge: o.hinge ?? 'start', swing: o.swing ?? 'left', outside: undefined };
  if (kind === 'window') return { kind, outside: o.outside ?? 'left', hinge: undefined, swing: undefined };
  return { kind, hinge: undefined, swing: undefined, outside: undefined };
}

/** setOpeningProps, then strips fields the patch set to undefined so they disappear from the JSON. */
export function applyOpeningPatch(level: Level, id: string, patch: Partial<Opening>): Level {
  const next = setOpeningProps(level, id, patch);
  const drop = Object.keys(patch).filter(k => patch[k as keyof Opening] === undefined) as (keyof Opening)[];
  if (drop.length === 0) return next;
  return {
    ...next,
    openings: next.openings.map(o => {
      if (o.id !== id) return o;
      const c = { ...o };
      for (const k of drop) delete c[k];
      return c;
    }),
  };
}

function row(label: string, field: TemplateResult | string): TemplateResult {
  return html`<label class="row"><span>${label}</span>${field}</label>`;
}

function select<T extends string>(value: T, options: { v: T; label: string }[], on: (v: T) => void): TemplateResult {
  return html`<select class="val" @change=${(e: Event) => on((e.target as HTMLSelectElement).value as T)}>
    ${options.map(op => html`<option value=${op.v} ?selected=${op.v === value}>${op.label}</option>`)}
  </select>`;
}

/** Text field committing on change; `apply` returns false to reject (the field then reverts). */
function mmField(value: number, apply: (v: number) => boolean, o: PropsOpts, badMsg: string): TemplateResult {
  return html`<input class="val" type="text" inputmode="numeric" .value=${fieldValue(String(Math.round(value)))}
    @change=${(e: Event) => {
      const el = e.target as HTMLInputElement;
      const v = parseMm(el.value);
      if (v === null || !apply(v)) {
        el.value = String(Math.round(value));
        o.setNotice(t(v === null ? badMsg : 'props.noFit', o.lang));
      } else o.setNotice(null);
    }} />`;
}

function wallProps(w: Wall, o: PropsOpts): TemplateResult {
  const lang = o.lang;
  const len = wallFrame(o.level, w).len;
  const types: WallType[] = ['bearing', 'partition', 'railing', ...(w.type === 'fence' ? ['fence' as WallType] : [])];
  const set = (patch: Parameters<typeof setWallProps>[2]) => o.commit(setWallProps(o.level, w.id, patch));
  return html`
    <h4>${t('props.wall', lang)}</h4>
    ${row(t('props.type', lang), select(w.type, types.map(v => ({ v, label: t(`walltype.${v}`, lang) })),
      v => set({ type: v, thickness: WALL_PRESETS[v] })))}
    ${row(t('props.thickness', lang), mmField(w.thickness, v => { set({ thickness: v }); return true; }, o, 'props.badWidth'))}
    ${row(t('props.baseline', lang), select<Baseline>(w.baseline,
      (['center', 'left', 'right'] as Baseline[]).map(v => ({ v, label: t(`baseline.${v}`, lang) })), v => set({ baseline: v })))}
    ${row(t('props.length', lang), html`<span class="val ro">${formatMm(len)} ${t('unit.mm', lang)}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => o.remove(deleteWall(o.level, w.id))}>
      ${t('action.delete', lang)}</button>`;
}

function openingProps(op: Opening, o: PropsOpts): TemplateResult {
  const lang = o.lang;
  const kinds: OpeningKind[] = ['door', 'window', 'opening', ...(DOOR_KINDS.slice(1).includes(op.kind) ? [op.kind] : [])];
  const patch = (p: Partial<Opening>) => o.commit(applyOpeningPatch(o.level, op.id, p));
  const sides = (['left', 'right'] as Side[]).map(v => ({ v, label: t(`side.${v}`, lang) }));
  const isDoor = DOOR_KINDS.includes(op.kind);
  return html`
    <h4>${t(`kind.${op.kind}`, lang)}</h4>
    ${row(t('props.kind', lang), select(op.kind, kinds.map(v => ({ v, label: t(`kind.${v}`, lang) })), v => patch(kindPatch(op, v))))}
    ${row(t('props.width', lang), mmField(op.width, v => {
      const next = resizeOpening(o.level, op.id, v);
      if (next === o.level) return false; // same rule as the offset field: no "invalid" opening from typing
      o.commit(next);
      return true;
    }, o, 'props.badWidth'))}
    ${row(t('props.offset', lang), html`<input class="val" type="text" inputmode="numeric" .value=${fieldValue(String(Math.round(op.offset)))}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const s = el.value.replace(/[\s ]/g, '');
        const next = /^\d+$/.test(s) ? moveOpening(o.level, op.id, Number(s)) : o.level;
        if (next === o.level) { el.value = String(Math.round(op.offset)); o.setNotice(t('props.noFit', lang)); return; }
        o.setNotice(null);
        o.commit(next);
      }} />`)}
    ${isDoor ? html`
      ${row(t('props.hinge', lang), select(op.hinge ?? 'start',
        (['start', 'end'] as const).map(v => ({ v, label: t(`hinge.${v}`, lang) })), v => patch({ hinge: v })))}
      ${row(t('props.swing', lang), select(op.swing ?? 'left', sides, v => patch({ swing: v })))}` : nothing}
    ${op.kind === 'window' ? row(t('props.outside', lang), select(op.outside ?? 'left', sides, v => patch({ outside: v }))) : nothing}
    ${op.invalid ? html`<p class="warn">${t('props.invalidOpening', lang)}</p>` : nothing}
    <button class="btn danger" data-action="delete-opening" @click=${() => o.remove(deleteOpening(o.level, op.id))}>
      ${t('action.delete', lang)}</button>`;
}

function zoneProps(z: Level['zones'][number], o: PropsOpts): TemplateResult {
  const lang = o.lang;
  return html`
    <h4>${t('props.zone', lang)}</h4>
    ${row(t('props.name', lang), html`<input class="val wide" type="text" .value=${fieldValue(z.name)}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const name = el.value.trim();
        if (!name) { el.value = z.name; return; }
        if (name !== z.name) o.commit(renameZone(o.level, z.id, name));
      }} />`)}
    ${row(t('props.area', lang), html`<span class="val ro">${formatArea(roomAreaM2(z.outline), lang)}</span>`)}
    ${z.broken ? html`<p class="warn">${t('props.broken', lang)}</p>` : nothing}
    <button class="btn danger" data-action="delete-zone" @click=${() => o.remove(deleteZone(o.level, z.id))}>
      ${t('action.delete', lang)}</button>`;
}

/** Settings of the next wall drawn by the Wall / Box tool (the same panel state as the top bar). */
function newWallProps(o: PropsOpts): TemplateResult {
  const lang = o.lang;
  const types: WallType[] = ['bearing', 'partition', 'railing'];
  return html`
    <h4>${t('props.newWall', lang)}</h4>
    ${row(t('props.type', lang), html`<select class="val" data-field="new-wall-type"
      @change=${(e: Event) => o.setWallType((e.target as HTMLSelectElement).value as WallType)}>
      ${types.map(v => html`<option value=${v} ?selected=${v === o.wallType}>${t(`walltype.${v}`, lang)}</option>`)}
    </select>`)}
    ${row(`${t('props.thickness', lang)}, ${t('unit.mm', lang)}`, html`<input class="val" type="text" inputmode="numeric"
      data-field="new-wall-thickness" .value=${fieldValue(String(o.thickness))}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const v = parseMm(el.value);
        if (v === null) { el.value = String(o.thickness); o.setNotice(t('props.badWidth', lang)); return; }
        o.setNotice(null);
        o.setThickness(v);
      }} />`)}
    ${o.tool === 'box' ? html`
      <div class="muted">${t('props.measure', lang)}</div>
      <div class="seg">
        ${(['inner', 'axis', 'outer'] as BoxMeasure[]).map(m => html`
          <button class="tab ${o.boxMeasure === m ? 'on' : ''}" data-measure=${m} @click=${() => o.setBoxMeasure(m)}>
            ${t(`measure.${m}`, lang)}</button>`)}
      </div>` : nothing}`;
}

export function renderProps(o: PropsOpts): TemplateResult {
  const { level, selection: s } = o;
  let body: TemplateResult | typeof nothing = nothing;
  if (s?.kind === 'wall') {
    const w = level.walls.find(x => x.id === s.id);
    if (w) body = wallProps(w, o);
  } else if (s?.kind === 'opening') {
    const op = level.openings.find(x => x.id === s.id);
    if (op) body = openingProps(op, o);
  } else if (s?.kind === 'zone') {
    const z = level.zones.find(x => x.id === s.id);
    if (z) body = zoneProps(z, o);
  } else if (s?.kind === 'node') {
    const n = level.nodes.find(x => x.id === s.id);
    if (n) body = html`<h4>${t('props.node', o.lang)}</h4>
      ${row('X', html`<span class="val ro">${formatMm(n.x)}</span>`)}${row('Y', html`<span class="val ro">${formatMm(n.y)}</span>`)}`;
  }
  return html`
    <div class="props">
      ${body === nothing && (o.tool === 'wall' || o.tool === 'box') ? newWallProps(o)
        : body === nothing ? html`<p class="muted">${t('props.none', o.lang)}</p>` : body}
      ${o.notice ? html`<p class="warn">${o.notice}</p>` : nothing}
    </div>`;
}
