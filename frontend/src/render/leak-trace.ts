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
/** Sensor and valve blocks: three per row, rows RGAP apart; the Leak block in the middle. */
const PER_ROW = 3, BW = 140, GAP = 20, RGAP = 12, LW = 220;
const CX = LEAK_WIDTH / 2;

/** The form field of a diagram block: a sensor (or the Leak block) the sensors' add select, a valve the valves'. */
export function leakFocus(block: string): string {
  return block.startsWith('leak-valve') ? 'leak-valves' : 'leak-sensors';
}

interface Blk { x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; err?: string }

/** Left edges of n blocks in rows of PER_ROW, each row centred. */
function rowXs(n: number): number[] {
  return Array.from({ length: n }, (_, i) => {
    const inRow = Math.min(PER_ROW, n - Math.floor(i / PER_ROW) * PER_ROW);
    return (LEAK_WIDTH - inRow * BW - (inRow - 1) * GAP) / 2 + (i % PER_ROW) * (BW + GAP);
  });
}

/** Blocks of one group (sensors or valves) from y0, rows of PER_ROW; returns the blocks and the y below them. */
function group(y0: number, items: { field: string; cls: string; lines: string[]; err?: string }[]): { blocks: Blk[]; bottom: number } {
  const h = blockH(Math.max(...items.map(b => b.lines.length + (b.err ? 1 : 0))));
  const xs = rowXs(items.length);
  const blocks = items.map((b, i) => ({ ...b, x: xs[i], y: y0 + Math.floor(i / PER_ROW) * (h + RGAP), w: BW, h }));
  return { blocks, bottom: y0 + Math.ceil(items.length / PER_ROW) * (h + RGAP) - RGAP };
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
  const valves = l.valves.length === 0
    ? [{ field: 'leak-valves', cls: '', lines: [t('leak.flow.addValve')] }]
    : l.valves.map(id => {
      const v = tr?.leak?.valves.find(x => x.id === id);
      const name = o.deviceName(id);
      const state = v?.state ?? null;
      const mine = last && last.target === (v?.name ?? name) ? last : undefined;
      const lastLine = mine ? (mine.reason === 're-closed: leak' ? t('leak.flow.reclosed') : t('vent.flow.last').replace('{did}', t(`rules.did.${mine.action}`)))
        .replace('{at}', clock(mine.at)) : null;
      return {
        field: `leak-valve:${id}`,
        cls: tr ? (state === 'closed' ? tone(true) : state === 'open' ? '' : tone(null)) : '',
        lines: [name, tr ? (state === null ? word(null) : t(`leak.state.${state}`)) : t('leak.flow.close'), ...(lastLine ? [lastLine] : [])],
        err: mine?.error,
      };
    });

  const top = group(PAD, sensors);
  const yL = top.bottom + VGAP, hL = blockH(2);
  const bottom = group(yL + hL + VGAP, valves);
  const leak: Blk = {
    x: CX - LW / 2, y: yL, w: LW, h: hL, field: 'leak', cls: tr ? tone(tr.verdict) : '',
    lines: [tr ? `${t('leak.flow.leak')}: ${tr.verdict === null ? word(null) : t(tr.verdict ? 'leak.yes' : 'leak.no')}` : t('leak.flow.leak'), t('leak.flow.any')],
  };
  const H = bottom.bottom + PAD;
  // Links run behind the blocks: each sensor elbows into the Leak block, the Leak block into each valve.
  const links = [
    ...top.blocks.map(b => `M${b.x + BW / 2} ${b.y + b.h} V${yL - VGAP / 2} H${CX} V${yL}`),
    ...bottom.blocks.map(b => `M${CX} ${yL + hL} V${bottom.blocks[0].y - VGAP / 2} H${b.x + BW / 2} V${b.y}`),
  ].join(' ');
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
