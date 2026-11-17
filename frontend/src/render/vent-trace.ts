import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import type { RuleTrace, VentSensorTrace } from '../live/rules-feed';
import { formatDuration } from '../live/device-live';
import { clock } from '../panel/rules-panel';
import { FLOW_MAX_SCALE, clip, durationText, tone, word } from './rule-trace';
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

const PAD = 10, SW = 236, SGAP = 28, MW = 340, VGAP = 34;
export const VENT_WIDTH = PAD + SW + SGAP + SW + PAD;
const MX = (VENT_WIDTH - MW) / 2, CX = VENT_WIDTH / 2;
/** Height of a block of n text lines (first baseline 20, then every 18). */
const blockH = (n: number): number => 14 + 18 * n;

/** One decimal; -0.0 shows as 0.0. */
const f1 = (n: number): string => (Math.round(n * 10) / 10 || 0).toFixed(1);
const shown = (n: number): string => (Number.isFinite(n) ? String(+n.toFixed(4)) : '?');
const signed = (pct: number): string => `${pct > 0 ? '+' : ''}${pct} %`;
/** m:ss (h:mm:ss from an hour) of whole seconds. */
const mss = (sec: number): string => (sec < 60 ? `0:${String(sec).padStart(2, '0')}` : formatDuration(sec * 1000));

interface Blk { x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; chars: number }

function block(o: VentTraceOpts, b: Blk): TemplateResult {
  return svg`
    <g class="fc-blk${b.cls}${o.focused === b.field ? ' hl' : ''}" data-block=${b.field} transform=${`translate(${b.x} ${b.y})`}
      @click=${() => o.onFocus(b.field)}>
      <title>${b.lines.join('\n')}</title>
      <rect class="fc-box" width=${b.w} height=${b.h} rx="8"></rect>
      ${b.lines.map((l, k) => svg`<text class=${k === 0 ? 'fc-t1' : 'fc-t2'} x="10" y=${20 + 18 * k}>${clip(l, b.chars + (k === 0 ? 0 : 4))}</text>`)}
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
  const cmp = !input ? vs : vt ? `${vs}: ${vt.pct === null ? word(null) : signed(vt.pct)}` : `${vs}: ${input.detail}`;
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
    ...(last ? [t('vent.flow.last').replace('{did}', t(`rules.did.${last.action}`)).replace('{at}', clock(last.at)) + (last.error ? `: ${last.error}` : '')] : [])];

  const yC = PAD + sH + VGAP, yR = yC + blockH(2) + VGAP, yF = yR + blockH(2) + VGAP;
  const H = yF + blockH(fanLines.length) + PAD;
  const xB = PAD + SW + SGAP;
  const elbow = (x: number) => svg`<path class="fc-link" d=${`M${x + SW / 2} ${PAD + sH} V${yC - VGAP / 2} H${CX} V${yC}`}></path>`;
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${VENT_WIDTH * FLOW_MAX_SCALE}px`} viewBox=${`0 0 ${VENT_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('vent.flow.title')}>
        ${elbow(PAD)}${elbow(xB)}
        <path class="fc-link" d=${`M${CX} ${yC + blockH(2)} V${yR} M${CX} ${yR + blockH(2)} V${yF}`}></path>
        ${block(o, { x: PAD, y: PAD, w: SW, h: sH, field: 'vent-sensor', cls: vt?.a.why ? ' nodata' : '', lines: aLines, chars: 30 })}
        ${block(o, { x: xB, y: PAD, w: SW, h: sH, field: 'vent-than', cls: vt?.b.why ? ' nodata' : '', lines: bLines, chars: 30 })}
        ${block(o, { x: MX, y: yC, w: MW, h: blockH(2), field: 'vent-above', cls: input ? tone(input.value) : '', lines: [cmp, margins], chars: 43 })}
        ${block(o, { x: MX, y: yR, w: MW, h: blockH(2), field: 'vent-runon', cls: tr ? tone(tr.verdict) : '', lines: resultLines, chars: 43 })}
        ${block(o, { x: MX, y: yF, w: MW, h: blockH(fanLines.length), field: 'vent-fan', cls: '', lines: fanLines, chars: 43 })}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
