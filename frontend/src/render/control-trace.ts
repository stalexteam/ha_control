import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import type { RuleTrace } from '../live/rules-feed';
import { tone } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, PURPOSE_WIDTH, blockH, flowBlock } from './flow-block';
import { lastLine } from './outside-trace';
import { t } from '../i18n';

export interface ControlTraceOpts {
  /** The load control rule as edited in the dialog. */
  rule: Rule;
  /** A device's name (the missing text for a deleted device). */
  deviceName(id: Id): string;
  /** A device's `props.kind` (undefined for a deleted device) and whether a smart button has its own Off. */
  deviceKind(id: Id): string | undefined;
  separateOff(id: Id): boolean;
  /** Live values of the saved rule; undefined = parameters only. */
  trace?: RuleTrace;
  /** The note under the diagram ("Live state appears after Save" ...), or null. */
  note: string | null;
  now: number;
  /** The `data-block` last focused from the diagram, highlighted. */
  focused?: string | null;
  /** A click on a block: its `data-block` (the form field it belongs to is `controlFocus(block)`). */
  onFocus(field: string): void;
}

export const CONTROL_WIDTH = PURPOSE_WIDTH;
/** Source and load blocks: up to 4 per row on a grid whose middle gap is at CX (the trunk runs there), rows RGAP apart with a bus in each gap. */
const PER_ROW = 4, GAP = 10, RGAP = 24;
const BW = (CONTROL_WIDTH - 2 * PAD - (PER_ROW - 1) * GAP) / PER_ROW;
const CX = CONTROL_WIDTH / 2, FULL = CONTROL_WIDTH - 2 * PAD;

/** The form field of a diagram block: a load (and the last action) the Loads add select, anything else the Sources'. */
export function controlFocus(block: string): string {
  return block.startsWith('control-load') || block === 'control-last' ? 'control-loads' : 'control-sources';
}

/** `wide`: one block over the full width (the hint of an empty list, the Sets block). */
interface Item { field: string; cls: string; lines: string[]; wide?: true }
interface Blk extends Item { x: number; y: number; w: number; h: number; err?: string }

/** Left edge of block i of n: a single row (n <= 4) centred, otherwise the grid columns. */
const blockX = (n: number, i: number): number => (n <= PER_ROW ? CX - (n * BW + (n - 1) * GAP) / 2 + i * (BW + GAP) : PAD + (i % PER_ROW) * (BW + GAP));

/**
 * Blocks of one group in rows from y0 (`above` the Sets block: a bus below each row, else above each row). Returns the
 * blocks, the y below them and the link path: a stub from each block to its row's bus, the bus to CX and the trunk at CX
 * between the outermost bus and `edge` (the Sets block's top or bottom).
 */
function group(y0: number, items: Item[], above: boolean, edge: number): { blocks: Blk[]; bottom: number; links: string } {
  const h = blockH(Math.max(...items.map(b => b.lines.length)));
  const rows = Math.ceil(items.length / PER_ROW);
  const top = (r: number) => y0 + r * (h + RGAP);
  const blocks = items.map((b, i) => ({ ...b, x: b.wide ? PAD : blockX(items.length, i), y: top(Math.floor(i / PER_ROW)), w: b.wide ? FULL : BW, h }));
  const bus = (r: number) => (above ? top(r) + h + (r === rows - 1 ? VGAP : RGAP) / 2 : top(r) - (r === 0 ? VGAP : RGAP) / 2);
  const parts: string[] = [];
  for (let r = 0; r < rows; r++) {
    const row = blocks.slice(r * PER_ROW, (r + 1) * PER_ROW);
    for (const b of row) parts.push(`M${b.x + b.w / 2} ${above ? b.y + h : b.y} V${bus(r)}`);
    const xs = [CX, ...row.map(b => b.x + b.w / 2)];
    if (Math.max(...xs) > Math.min(...xs)) parts.push(`M${Math.min(...xs)} ${bus(r)} H${Math.max(...xs)}`);
  }
  parts.push(above ? `M${CX} ${bus(0)} V${edge}` : `M${CX} ${edge} V${bus(rows - 1)}`);
  return { blocks, bottom: top(rows - 1) + h, links: parts.join(' ') };
}

/**
 * The diagram of a load control rule, top to bottom: the sources in rows (a wall switch on / off, a motion sensor
 * motion / clear, a smart button its events), the "Sets the loads" block with the rule in words, the loads in rows
 * (on / off / no data) and the last action under them. The blocks show the dialog's parameters; the live values are
 * overlaid when `trace` is given (a saved unchanged rule). A click on a block calls `onFocus` with its `data-block`.
 */
export function renderControlTrace(o: ControlTraceOpts): TemplateResult {
  const c = o.rule.control!;
  const tr = o.trace;
  const ct = tr?.control;
  const state = (s: 'on' | 'off' | null | undefined, on: string, off: string): string => (s === 'on' ? on : s === 'off' ? off : t('control.flow.noData'));
  const toneOf = (s: 'on' | 'off' | null | undefined): string => (ct ? tone(s == null ? null : s === 'on') : '');

  const sources: Item[] = c.sources.length === 0
    ? [{ field: 'control-sources', cls: '', lines: [t('control.problem.sources')], wide: true }]
    : c.sources.map(id => {
      const live = ct?.sources.find(s => s.id === id);
      const kind = live?.kind ?? o.deviceKind(id);
      const name = o.deviceName(id);
      if (kind === 'smart_button') return { field: `control-source:${id}`, cls: '', lines: [name, t(o.separateOff(id) ? 'control.flow.onOff' : 'control.flow.toggle')] };
      const word = kind === 'motion_sensor' ? state(live?.state, t('control.flow.motion'), t('control.flow.clear')) : state(live?.state, 'on', 'off');
      return { field: `control-source:${id}`, cls: toneOf(live?.state), lines: [name, ...(ct ? [word] : []), t('control.flow.repeat')] };
    });
  const loads: Item[] = c.loads.length === 0
    ? [{ field: 'control-loads', cls: '', lines: [t('control.problem.loads')], wide: true }]
    : c.loads.map(id => {
      const live = ct?.loads.find(l => l.id === id);
      return { field: `control-load:${id}`, cls: toneOf(live?.state), lines: [o.deviceName(id), ...(ct ? [state(live?.state, 'on', 'off')] : [])] };
    });

  const hS = blockH(Math.max(...sources.map(b => b.lines.length)));
  const hMid = blockH(2);
  const yMid = PAD + Math.ceil(sources.length / PER_ROW) * (hS + RGAP) - RGAP + VGAP;
  const top = group(PAD, sources, true, yMid);
  const bottom = group(yMid + hMid + VGAP, loads, false, yMid + hMid);
  const mid: Blk = { x: PAD, y: yMid, w: FULL, h: hMid, field: 'control', cls: '', lines: [t('control.flow.sets'), t('control.flow.rule')] };

  const last = tr?.last;
  const lastBlk: Blk | undefined = last
    ? { x: PAD, y: bottom.bottom + VGAP / 2, w: FULL, h: blockH(1 + (last.error ? 1 : 0)), field: 'control-last', cls: '', lines: [lastLine(last)], err: last.error }
    : undefined;
  const H = (lastBlk ? lastBlk.y + lastBlk.h : bottom.bottom) + PAD;
  const links = `${top.links} ${bottom.links}`;
  const block = (b: Blk) => flowBlock({ ...b, focused: o.focused === b.field, onClick: () => o.onFocus(b.field) });
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${CONTROL_WIDTH}px`} viewBox=${`0 0 ${CONTROL_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('control.flow.title')}>
        ${svg`<path class="fc-link" d=${links}></path>`}
        ${top.blocks.map(block)}${block(mid)}${bottom.blocks.map(block)}${lastBlk ? block(lastBlk) : nothing}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
