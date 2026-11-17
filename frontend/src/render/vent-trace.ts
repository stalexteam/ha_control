import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import type { RuleTrace, VentSensorTrace } from '../live/rules-feed';
import { clock } from '../panel/rules-panel';
import { durationText, tone, word } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, PURPOSE_WIDTH, blockH, chars1, clip, countdown, flowBlock } from './flow-block';
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

/** The compact width of the purpose-built automation diagrams. */
export const VENT_WIDTH = PURPOSE_WIDTH;
const SGAP = 20, MW = VENT_WIDTH - 2 * PAD, SW = (MW - SGAP) / 2;
const XA = (VENT_WIDTH - SW * 2 - SGAP) / 2, XB = XA + SW + SGAP, MX = (VENT_WIDTH - MW) / 2, CX = VENT_WIDTH / 2;

/** One decimal; -0.0 shows as 0.0. */
const f1 = (n: number): string => (Math.round(n * 10) / 10 || 0).toFixed(1);
const shown = (n: number): string => (Number.isFinite(n) ? String(+n.toFixed(4)) : '?');
const signed = (pct: number): string => `${pct > 0 ? '+' : ''}${pct} %`;

/** A block of the diagram (see `flowBlock`); a click focuses its form field. */
interface Blk { x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; err?: string; tip?: string }

const block = (o: VentTraceOpts, b: Blk): TemplateResult =>
  flowBlock({ ...b, focused: o.focused === b.field, onClick: () => o.onFocus(b.field) });

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
    pending ? `${runon} (${t('vent.pending').replace('{to}', pending.to ? 'on' : 'off').replace('{t}', countdown(left))})` : runon,
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
      <svg class="vt" style=${`max-width:${VENT_WIDTH}px`} viewBox=${`0 0 ${VENT_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('vent.flow.title')}>
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
