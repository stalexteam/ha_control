import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import type { Baseline, Level, Opening, OpeningKind, Side, Wall, WallType } from '../model/types';
import { deleteWall, setWallProps } from '../model/ops';
import { deleteOpening, moveOpening, resizeOpening, setOpeningProps } from '../model/openings';
import { deleteZone, renameZone } from '../model/zones';
import { wallFrame } from '../geometry/walls';
import { roomAreaM2 } from '../geometry/rooms';
import type { Selection } from '../editor/tools/types';
import { formatArea, formatMm } from '../render/plan-svg';
import { t } from '../i18n';
import { numField, row, select } from './fields';
import type { ToolId } from './tool-factory';
import { isNextObjectTool, renderNextObject, type NextObjects } from './next-object';

export type BoxMeasure = 'inner' | 'axis' | 'outer';

export interface PropsOpts {
  level: Level;
  selection: Selection | null;
  tool: ToolId;
  boxMeasure: BoxMeasure;
  /** Settings for the next wall drawn. */
  wallType: WallType;
  thickness: number;
  /** Parameters of the next door / window / opening / zone. */
  next: NextObjects;
  setNext(n: NextObjects): void;
  /** Validation message from the last rejected edit, shown under the fields. */
  notice: string | null;
  commit(next: Level): void;
  /** Commits a level in which the selected element was deleted. */
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

/** Width/thickness field: a malformed value reverts with the width message. */
function mmField(o: PropsOpts, value: number, apply: (v: number) => boolean | void): TemplateResult {
  return numField({ value, rule: { min: 1 }, bad: 'props.badWidth', setNotice: o.setNotice, apply });
}

/** Commits an opening edit; the model returns the same level when the edit does not fit. */
function commitIfChanged(o: PropsOpts, next: Level): boolean {
  if (next === o.level) return false; // no "invalid" opening from typing
  o.commit(next);
  return true;
}

function wallProps(w: Wall, o: PropsOpts): TemplateResult {
  const len = wallFrame(o.level, w).len;
  const types: WallType[] = ['bearing', 'partition', 'railing', ...(w.type === 'fence' ? ['fence' as WallType] : [])];
  const set = (patch: Parameters<typeof setWallProps>[2]) => o.commit(setWallProps(o.level, w.id, patch));
  return html`
    <h4>${t('props.wall')}</h4>
    ${row(t('props.type'), select(w.type, types.map(v => ({ v, label: t(`walltype.${v}`) })),
      v => set({ type: v }), 'wall-type'))}
    ${row(t('props.thickness'), mmField(o, w.thickness, v => { set({ thickness: v }); }))}
    ${row(t('props.baseline'), select<Baseline>(w.baseline,
      (['center', 'left', 'right'] as Baseline[]).map(v => ({ v, label: t(`baseline.${v}`) })), v => set({ baseline: v })))}
    ${row(t('props.length'), html`<span class="val ro">${formatMm(len)} ${t('unit.mm')}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => o.commit(deleteWall(o.level, w.id))}>
      ${t('action.delete')}</button>`;
}

function openingProps(op: Opening, o: PropsOpts): TemplateResult {
  const kinds: OpeningKind[] = ['door', 'window', 'opening', ...(DOOR_KINDS.slice(1).includes(op.kind) ? [op.kind] : [])];
  const patch = (p: Partial<Opening>) => o.commit(applyOpeningPatch(o.level, op.id, p));
  const sides = (['left', 'right'] as Side[]).map(v => ({ v, label: t(`side.${v}`) }));
  const isDoor = DOOR_KINDS.includes(op.kind);
  return html`
    <h4>${t(`kind.${op.kind}`)}</h4>
    ${row(t('props.kind'), select(op.kind, kinds.map(v => ({ v, label: t(`kind.${v}`) })), v => patch(kindPatch(op, v))))}
    ${row(t('props.width'), mmField(o, op.width, v => commitIfChanged(o, resizeOpening(o.level, op.id, v))))}
    ${row(t('props.offset'), numField({
      value: op.offset, rule: { min: 0 }, bad: 'props.noFit', setNotice: o.setNotice,
      apply: v => commitIfChanged(o, moveOpening(o.level, op.id, v)),
    }))}
    ${isDoor ? html`
      ${row(t('props.hinge'), select(op.hinge ?? 'start',
        (['start', 'end'] as const).map(v => ({ v, label: t(`hinge.${v}`) })), v => patch({ hinge: v })))}
      ${row(t('props.swing'), select(op.swing ?? 'left', sides, v => patch({ swing: v })))}` : nothing}
    ${op.kind === 'window' ? row(t('props.outside'), select(op.outside ?? 'left', sides, v => patch({ outside: v }))) : nothing}
    ${op.invalid ? html`<p class="warn">${t('props.invalidOpening')}</p>` : nothing}
    <button class="btn danger" data-action="delete-opening" @click=${() => o.commit(deleteOpening(o.level, op.id))}>
      ${t('action.delete')}</button>`;
}

function zoneProps(z: Level['zones'][number], o: PropsOpts): TemplateResult {
  return html`
    <h4>${t('props.zone')}</h4>
    ${row(t('props.name'), html`<input class="val wide" type="text" .value=${fieldValue(z.name)}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const name = el.value.trim();
        if (!name) { el.value = z.name; return; }
        if (name !== z.name) o.commit(renameZone(o.level, z.id, name));
      }} />`)}
    ${row(t('props.area'), html`<span class="val ro">${formatArea(roomAreaM2(z.outline))}</span>`)}
    ${z.broken ? html`<p class="warn">${t('props.broken')}</p>` : nothing}
    <button class="btn danger" data-action="delete-zone" @click=${() => o.commit(deleteZone(o.level, z.id))}>
      ${t('action.delete')}</button>`;
}

/** Settings of the next wall drawn by the Wall / Box tool (the same panel state as the top bar). */
function newWallProps(o: PropsOpts): TemplateResult {
  const types: WallType[] = ['bearing', 'partition', 'railing'];
  return html`
    <h4>${t('props.newWall')}</h4>
    ${row(t('props.type'), html`<select class="val" data-field="new-wall-type"
      @change=${(e: Event) => o.setWallType((e.target as HTMLSelectElement).value as WallType)}>
      ${types.map(v => html`<option value=${v} ?selected=${v === o.wallType}>${t(`walltype.${v}`)}</option>`)}
    </select>`)}
    ${row(`${t('props.thickness')}, ${t('unit.mm')}`, numField({
      value: o.thickness, rule: { min: 1 }, bad: 'props.badWidth', setNotice: o.setNotice, field: 'new-wall-thickness',
      apply: v => { o.setThickness(v); },
    }))}
    ${o.tool === 'box' ? html`
      <div class="muted">${t('props.measure')}</div>
      <div class="seg">
        ${(['inner', 'axis', 'outer'] as BoxMeasure[]).map(m => html`
          <button class="tab ${o.boxMeasure === m ? 'on' : ''}" data-measure=${m} @click=${() => o.setBoxMeasure(m)}>
            ${t(`measure.${m}`)}</button>`)}
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
    if (n) body = html`<h4>${t('props.node')}</h4>
      ${row('X', html`<span class="val ro">${formatMm(n.x)}</span>`)}${row('Y', html`<span class="val ro">${formatMm(n.y)}</span>`)}`;
  }
  return html`
    <div class="props">
      ${body === nothing && (o.tool === 'wall' || o.tool === 'box') ? newWallProps(o)
        : body === nothing && isNextObjectTool(o.tool) ? renderNextObject({ tool: o.tool, level, next: o.next, setNext: o.setNext, setNotice: o.setNotice })
        : body === nothing ? html`<p class="muted">${t('props.none')}</p>` : body}
      ${o.notice ? html`<p class="warn">${o.notice}</p>` : nothing}
    </div>`;
}
