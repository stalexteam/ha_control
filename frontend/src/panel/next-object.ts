import { html, nothing, type TemplateResult } from 'lit';
import { fieldValue } from './field-value';
import type { Level, OpeningKind, Side } from '../model/types';
import { OPENING_DEFAULT_WIDTH } from '../model/types';
import type { OpeningDefaults } from '../editor/tools/types';
import { t } from '../i18n';
import { parseMm } from './toolbar';

export type NextOpeningKind = 'door' | 'window' | 'opening';

/** Parameters of the next door / window / opening / zone, remembered per tool for the session. */
export interface NextObjects {
  door: { width: number; hinge: 'start' | 'end'; swing: Side };
  window: { width: number; outside: Side };
  opening: { width: number };
  /** Name typed for the next zone; null means the automatic "Room N". */
  zoneName: string | null;
}

export function initialNext(): NextObjects {
  return {
    door: { width: OPENING_DEFAULT_WIDTH.door, hinge: 'start', swing: 'left' },
    window: { width: OPENING_DEFAULT_WIDTH.window, outside: 'left' },
    opening: { width: OPENING_DEFAULT_WIDTH.opening },
    zoneName: null,
  };
}

export function openingDefaults(n: NextObjects, kind: OpeningKind): OpeningDefaults {
  if (kind === 'door') return { ...n.door };
  if (kind === 'window') return { ...n.window };
  return { width: n.opening.width };
}

/** "Room N" with the smallest N not used by a zone name on the level. */
export function defaultZoneName(level: Level): string {
  const base = t('zone.default');
  const used = new Set(level.zones.map(z => z.name));
  let n = 1;
  while (used.has(`${base} ${n}`)) n++;
  return `${base} ${n}`;
}

export interface NextObjectOpts {
  tool: string;
  level: Level;
  next: NextObjects;
  setNext(n: NextObjects): void;
  setNotice(msg: string | null): void;
}

export const isNextObjectTool = (tool: string): boolean =>
  tool === 'door' || tool === 'window' || tool === 'opening' || tool === 'zone';

function sel<T extends string>(field: string, value: T, options: { v: T; label: string }[], on: (v: T) => void): TemplateResult {
  return html`<select class="val" data-field=${field} @change=${(e: Event) => on((e.target as HTMLSelectElement).value as T)}>
    ${options.map(op => html`<option value=${op.v} ?selected=${op.v === value}>${op.label}</option>`)}
  </select>`;
}

const row = (label: string, field: TemplateResult): TemplateResult => html`<label class="row"><span>${label}</span>${field}</label>`;

/** Panel section for the object the active door / window / opening / zone tool will create. */
export function renderNextObject(o: NextObjectOpts): TemplateResult | typeof nothing {
  const n = o.next;
  if (o.tool === 'zone') {
    const shown = n.zoneName ?? defaultZoneName(o.level);
    return html`
      <h4>${t('props.nextZone')}</h4>
      ${row(t('props.name'), html`<input class="val wide" type="text" data-field="next-zone-name" .value=${fieldValue(shown)}
        @change=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          const name = el.value.trim();
          if (!name) { el.value = shown; return; }
          if (name !== shown) o.setNext({ ...n, zoneName: name });
        }} />`)}`;
  }
  if (o.tool !== 'door' && o.tool !== 'window' && o.tool !== 'opening') return nothing;
  const kind: NextOpeningKind = o.tool;
  const width = n[kind].width;
  const sides = (['left', 'right'] as Side[]).map(v => ({ v, label: t(`side.${v}`) }));
  const patch = (p: object) => o.setNext({ ...n, [kind]: { ...n[kind], ...p } });
  return html`
    <h4>${t(`props.next.${kind}`)}</h4>
    ${row(`${t('props.width')}, ${t('unit.mm')}`, html`<input class="val" type="text" inputmode="numeric"
      data-field="next-width" .value=${fieldValue(String(width))}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const v = parseMm(el.value);
        if (v === null) { el.value = String(width); o.setNotice(t('props.badWidth')); return; }
        o.setNotice(null);
        if (v !== width) patch({ width: v });
      }} />`)}
    ${kind === 'door' ? html`
      ${row(t('props.hinge'), sel('next-hinge', n.door.hinge,
        (['start', 'end'] as const).map(v => ({ v, label: t(`hinge.${v}`) })), v => { if (v !== n.door.hinge) patch({ hinge: v }); }))}
      ${row(t('props.swing'), sel('next-swing', n.door.swing, sides, v => { if (v !== n.door.swing) patch({ swing: v }); }))}` : nothing}
    ${kind === 'window' ? row(t('props.outside'), sel('next-outside', n.window.outside, sides,
      v => { if (v !== n.window.outside) patch({ outside: v }); })) : nothing}`;
}
