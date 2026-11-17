import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import type { RuleTrace, VentSensorTrace } from '../live/rules-feed';
import { formatDuration } from '../live/device-live';
import { clock } from '../panel/rules-panel';
import { FLOW_MAX_SCALE, WIDTH, clip, durationText, tone, word } from './rule-trace';
import { t } from '../i18n';

export interface VentTraceOpts {
  /** The vent rule as edited in the dialog. */
  rule: Rule;
  /** A device's name ("Choose..." for an empty pick, the missing text for a deleted device). */
  deviceName(id: Id): string;
  /** Live values of the saved rule; undefined = parameters only. */
  trace?: RuleTrace;
  /** The note under the diagram ("Live state appears after Save" ...), or null. */
  note: string | null;
  now: number;
  /** The `data-field` last focused from the diagram, highlighted. */
  focused?: string | null;
  /** A click on a block: the `data-field` of its form field. */
  onFocus(field: string): void;
}

/** As wide as the condition flowchart: in the same column both draw their text at the same scale. */
export const VENT_WIDTH = WIDTH;
const PAD = 10, SW = 330, SGAP = 40, MW = 460, VGAP = 34;
const XA = (VENT_WIDTH - SW * 2 - SGAP) / 2, XB = XA + SW + SGAP, MX = (VENT_WIDTH - MW) / 2, CX = VENT_WIDTH / 2;
/** Characters that fit a box of width w: 13 px medium first line, 12 px other lines (the clip box catches wide glyphs). */
const chars1 = (w: number): number => Math.floor((w - 20) / 6.6);
const chars2 = (w: number): number => Math.floor((w - 20) / 6);
/** Height of a block of n text lines (first baseline 20, then every 18). */
const blockH = (n: number): number => 14 + 18 * n;

/** One decimal; -0.0 shows as 0.0. */
const f1 = (n: number): string => (Math.round(n * 10) / 10 || 0).toFixed(1);
const shown = (n: number): string => (Number.isFinite(n) ? String(+n.toFixed(4)) : '?');
const signed = (pct: number): string => `${pct > 0 ? '+' : ''}${pct} %`;
/** m:ss (h:mm:ss from an hour) of whole seconds. */
const mss = (sec: number): string => (sec < 60 ? `0:${String(sec).padStart(2, '0')}` : formatDuration(sec * 1000));

/**
 * A block: `lines` (the first bold), then `err` in the error colour; the text is clipped to the box, the tooltip
 * (`tip`, else the lines) has it all.
 */
interface Blk { x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; err?: string; tip?: string }

function block(o: VentTraceOpts, b: Blk): TemplateResult {
  const all = b.err ? [...b.lines, b.err] : b.lines;
  return svg`
    <g class="fc-blk${b.cls}${o.focused === b.field ? ' hl' : ''}" data-block=${b.field} transform=${`translate(${b.x} ${b.y})`}
      @click=${() => o.onFocus(b.field)}>
      <title>${b.tip ?? all.join('\n')}</title>
      <rect class="fc-box" width=${b.w} height=${b.h} rx="8"></rect>
      <svg class="fc-clip" width=${b.w - 8} height=${b.h}>
        ${all.map((l, k) => svg`<text class=${k === 0 ? 'fc-t1' : k === b.lines.length ? 'fc-err' : 'fc-t2'} x="10" y=${20 + 18 * k}>${
          clip(l, k === 0 ? chars1(b.w) : chars2(b.w))}</text>`)}
      </svg>
    </g>`;
}

/** Name, then the values (or the reason there are none, then whatever is known); without live data the role. */
function sensorLines(name: string, role: string, s: VentSensorTrace | undefined): string[] {
  if (!s) return [name, role];
  const known = [s.t !== null ? `${f1(s.t)} °C` : '', s.rh !== null ? `${f1(s.rh)} %` : ''].filter(Boolean).join(' ');
  if (s.why) return known ? [name, s.why, known] : [name, s.why];
  return [name, known || '—', s.ah !== null ? `${f1(s.ah)} g/m³` : '—'];
}

/**
 * The diagram of a wet zone ventilation rule, top to bottom: the two climate sensors side by side, the comparison,
 * the result with the run-on, the fan. The blocks show the dialog's parameters; the live values are overlaid when
 * `trace` is given (a saved unchanged rule). A click on a block calls `onFocus` with its form field.
 */
export function renderVentTrace(o: VentTraceOpts): TemplateResult {
  const r = o.rule;
  const v = r.vent!;
  const tr = o.trace;
  const input = tr?.inputs[0];
  const vt = input?.vent;
  const nameA = o.deviceName(v.sensor), nameB = o.deviceName(v.than);
  const fan = r.onTrue[0]?.device ?? '';

  const aLines = sensorLines(nameA, t('vent.sensor'), vt?.a);
  const bLines = sensorLines(nameB, t('vent.than'), vt?.b);
  const sH = blockH(Math.max(aLines.length, bLines.length));
  const vs = t('vent.flow.vs').replace('{a}', nameA).replace('{b}', nameB);
  // The percent (or "no data") stays whole: long names are clipped before it.
  const pct = vt ? `: ${vt.pct === null ? word(null) : signed(vt.pct)}` : input ? `: ${input.detail}` : '';
  const cmp = vt ? `${clip(vs, chars1(MW) - pct.length)}${pct}` : `${vs}${pct}`;
  const margins = t('vent.flow.margins').replace('{above}', shown(v.above)).replace('{below}', shown(v.below));

  const pending = tr?.pending;
  const left = pending ? Math.max(0, Math.ceil((pending.at - o.now) / 1000)) : 0;
  const runon = t('vent.flow.runon').replace('{t}', durationText(r.offDelay));
  const resultLines = [
    tr ? `${t('rules.flow.result')}: ${word(tr.verdict)}` : t('rules.flow.result'),
    pending ? `${runon} (${t('vent.pending').replace('{to}', pending.to ? 'on' : 'off').replace('{t}', mss(left))})` : runon,
  ];
  const last = tr?.last;
  const fanLines = [o.deviceName(fan), `${r.onTrue[0]?.do ?? '?'} / ${r.onFalse[0]?.do ?? '?'}`,
    ...(last ? [t('vent.flow.last').replace('{did}', t(`rules.did.${last.action}`)).replace('{at}', clock(last.at))] : [])];
  const fanErr = last?.error;
  const fanH = blockH(fanLines.length + (fanErr ? 1 : 0));

  const yC = PAD + sH + VGAP, yR = yC + blockH(2) + VGAP, yF = yR + blockH(2) + VGAP;
  const H = yF + fanH + PAD;
  const elbow = (x: number) => svg`<path class="fc-link" d=${`M${x + SW / 2} ${PAD + sH} V${yC - VGAP / 2} H${CX} V${yC}`}></path>`;
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${VENT_WIDTH * FLOW_MAX_SCALE}px`} viewBox=${`0 0 ${VENT_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('vent.flow.title')}>
        ${elbow(XA)}${elbow(XB)}
        <path class="fc-link" d=${`M${CX} ${yC + blockH(2)} V${yR} M${CX} ${yR + blockH(2)} V${yF}`}></path>
        ${block(o, { x: XA, y: PAD, w: SW, h: sH, field: 'vent-sensor', cls: vt?.a.why ? ' nodata' : '', lines: aLines })}
        ${block(o, { x: XB, y: PAD, w: SW, h: sH, field: 'vent-than', cls: vt?.b.why ? ' nodata' : '', lines: bLines })}
        ${block(o, { x: MX, y: yC, w: MW, h: blockH(2), field: 'vent-above', cls: input ? tone(input.value) : '', lines: [cmp, margins], tip: `${vs}${pct}\n${margins}` })}
        ${block(o, { x: MX, y: yR, w: MW, h: blockH(2), field: 'vent-runon', cls: tr ? tone(tr.verdict) : '', lines: resultLines })}
        ${block(o, { x: MX, y: yF, w: MW, h: fanH, field: 'vent-fan', cls: '', lines: fanLines, err: fanErr })}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
