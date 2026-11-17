import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import type { RuleTrace } from '../live/rules-feed';
import { clock } from '../panel/rules-panel';
import { tone, word } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, PURPOSE_WIDTH, blockH, flowBlock } from './flow-block';
import { t } from '../i18n';

export interface LeakTraceOpts {
  /** The leak protection rule as edited in the dialog. */
  rule: Rule;
  /** A device's name (the missing text for a deleted device). */
  deviceName(id: Id): string;
  /** Live values of the saved rule; undefined = parameters only. */
  trace?: RuleTrace;
  /** The note under the diagram ("Live state appears after Save" ...), or null. */
  note: string | null;
  now: number;
  /** The `data-block` last focused from the diagram, highlighted. */
  focused?: string | null;
  /** A click on a block: its `data-block` (the form field it belongs to is `leakFocus(block)`). */
  onFocus(field: string): void;
}

export const LEAK_WIDTH = PURPOSE_WIDTH;
/**
 * Sensor and valve blocks: two per row on a grid whose middle gap is at CX, rows RGAP apart (a bus runs in each gap);
 * the Leak block in the middle.
 */
const PER_ROW = 2, GAP = 20, RGAP = 24, LW = 220;
const BW = (LEAK_WIDTH - 2 * PAD - (PER_ROW - 1) * GAP) / PER_ROW;
const CX = LEAK_WIDTH / 2;

/** The form field of a diagram block: a sensor (or the Leak block) the sensors' add select, a valve the valves'. */
export function leakFocus(block: string): string {
  return block.startsWith('leak-valve') ? 'leak-valves' : 'leak-sensors';
}

interface Blk { x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; err?: string }
interface Item { field: string; cls: string; lines: string[]; err?: string }

/** Left edges: a single block centred; otherwise the grid columns (an odd last block in the left one, clear of CX). */
const blockX = (n: number, i: number): number => (n === 1 ? CX - BW / 2 : PAD + (i % PER_ROW) * (BW + GAP));

/**
 * Blocks of one group in rows from y0: the sensors (`above` the Leak block, a bus in the gap below each row) or the
 * valves (a bus in the gap above each row). Returns the blocks, the y below them and the link path: a stub from each
 * block to its row's bus, the bus to CX, and the trunk at CX (through the grid's middle gap) between the outermost bus
 * and `edge`, the Leak block's top (sensors) or bottom (valves) edge.
 */
function group(y0: number, items: Item[], above: boolean, edge: number): { blocks: Blk[]; bottom: number; links: string } {
  const h = blockH(Math.max(...items.map(b => b.lines.length + (b.err ? 1 : 0))));
  const rows = Math.ceil(items.length / PER_ROW);
  const top = (r: number) => y0 + r * (h + RGAP);
  const blocks = items.map((b, i) => ({ ...b, x: blockX(items.length, i), y: top(Math.floor(i / PER_ROW)), w: BW, h }));
  // Sensors: the bus below each row (the last one halfway to the Leak block); valves: the bus above each row.
  const bus = (r: number) => (above ? top(r) + h + (r === rows - 1 ? VGAP : RGAP) / 2 : top(r) - (r === 0 ? VGAP : RGAP) / 2);
  const parts: string[] = [];
  for (let r = 0; r < rows; r++) {
    const row = blocks.slice(r * PER_ROW, (r + 1) * PER_ROW);
    for (const b of row) parts.push(`M${b.x + BW / 2} ${above ? b.y + h : b.y} V${bus(r)}`);
    const xs = [CX, ...row.map(b => b.x + BW / 2)];
    if (Math.max(...xs) > Math.min(...xs)) parts.push(`M${Math.min(...xs)} ${bus(r)} H${Math.max(...xs)}`);
  }
  parts.push(above ? `M${CX} ${bus(0)} V${edge}` : `M${CX} ${edge} V${bus(rows - 1)}`);
  return { blocks, bottom: top(rows - 1) + h, links: parts.join(' ') };
}

/**
 * The diagram of a leak protection rule, top to bottom: the leak sensors in rows (dry / wet / no data), the Leak block
 * (any sensor wet), the valves side by side (open / closed / no data, the last action on its valve). The blocks show
 * the dialog's parameters; the live values are overlaid when `trace` is given (a saved unchanged rule). A click on a
 * block calls `onFocus` with its `data-block`.
 */
export function renderLeakTrace(o: LeakTraceOpts): TemplateResult {
  const l = o.rule.leak!;
  const tr = o.trace;
  const last = tr?.last;

  const sensors = l.sensors.length === 0
    ? [{ field: 'leak-sensors', cls: '', lines: [t('leak.flow.addSensor')] }]
    : l.sensors.map((id, i) => {
      const input = tr?.inputs[i];
      return { field: `leak-sensor:${id}`, cls: input ? tone(input.value) : '', lines: [o.deviceName(id), input ? input.detail : t('device.leak_sensor')] };
    });
  const valveName = (id: Id) => tr?.leak?.valves.find(x => x.id === id)?.name ?? o.deviceName(id);
  // The last action belongs to one valve: the first of that name (a renamed valve loses it).
  const lastValve = last ? l.valves.find(id => valveName(id) === last.target) : undefined;
  const valves = l.valves.length === 0
    ? [{ field: 'leak-valves', cls: '', lines: [t('leak.flow.addValve')] }]
    : l.valves.map(id => {
      const v = tr?.leak?.valves.find(x => x.id === id);
      const name = o.deviceName(id);
      const state = v?.state ?? null;
      const mine = id === lastValve ? last : undefined;
      const lastLine = mine ? (mine.reason === 're-closed: leak' ? t('leak.flow.reclosed') : t('vent.flow.last').replace('{did}', t(`rules.did.${mine.action}`)))
        .replace('{at}', clock(mine.at)) : null;
      return {
        field: `leak-valve:${id}`,
        cls: tr ? (state === 'closed' ? tone(true) : state === 'open' ? '' : tone(null)) : '',
        lines: [name, tr ? (state === null ? word(null) : t(`leak.state.${state}`)) : t('leak.flow.close'), ...(lastLine ? [lastLine] : [])],
        err: mine?.error,
      };
    });

  const hL = blockH(2);
  const sensorH = blockH(Math.max(...sensors.map(b => b.lines.length)));
  const yL = PAD + Math.ceil(sensors.length / PER_ROW) * (sensorH + RGAP) - RGAP + VGAP;
  const top = group(PAD, sensors, true, yL);
  const bottom = group(yL + hL + VGAP, valves, false, yL + hL);
  const leak: Blk = {
    x: CX - LW / 2, y: yL, w: LW, h: hL, field: 'leak', cls: tr ? tone(tr.verdict) : '',
    lines: [tr ? `${t('leak.flow.leak')}: ${tr.verdict === null ? word(null) : t(tr.verdict ? 'leak.yes' : 'leak.no')}` : t('leak.flow.leak'), t('leak.flow.any')],
  };
  const H = bottom.bottom + PAD;
  const links = `${top.links} ${bottom.links}`;
  const block = (b: Blk) => flowBlock({ ...b, focused: o.focused === b.field, onClick: () => o.onFocus(b.field) });
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${LEAK_WIDTH}px`} viewBox=${`0 0 ${LEAK_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('leak.flow.title')}>
        ${svg`<path class="fc-link" d=${links}></path>`}
        ${top.blocks.map(block)}${block(leak)}${bottom.blocks.map(block)}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
