import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import { keptOn, switchedElsewhere, type OutsideTrace, type RuleLast, type RuleTrace } from '../live/rules-feed';
import { clock } from '../panel/rules-panel';
import { durationText, tone, word } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, PURPOSE_WIDTH, blockH, countdown, flowBlock } from './flow-block';
import { t } from '../i18n';

export interface OutsideTraceOpts {
  /** The outside light rule as edited in the dialog. */
  rule: Rule;
  /** A device's name ("Choose..." for an empty pick, the missing text for a deleted device). */
  deviceName(id: Id): string;
  /** Live values of the saved rule; undefined = parameters only. */
  trace?: RuleTrace;
  /** The note under the diagram ("Live state appears after Save" ...), or null. */
  note: string | null;
  now: number;
  /** The `data-block` last focused from the diagram, highlighted. */
  focused?: string | null;
  /** A click on a block: its `data-block` (the form field it belongs to is `OUTSIDE_FOCUS[block] ?? block`). */
  onFocus(field: string): void;
}

/** Blocks whose form field has another name: Wants is decided by the daylight sensor first. */
export const OUTSIDE_FOCUS: Record<string, string> = { 'outside-wants': 'outside-sensor' };

export const OUTSIDE_WIDTH = PURPOSE_WIDTH;
const MW = OUTSIDE_WIDTH - 2 * PAD, CX = OUTSIDE_WIDTH / 2;
/** The top row: Daylight alone at full width; with Sun or Window halves; all three at fixed widths (the Daylight widest). */
const TOP_GAP = 16;
const TOP_W: Record<number, number[]> = { 1: [MW], 2: [(MW - TOP_GAP) / 2, (MW - TOP_GAP) / 2], 3: [176, 116, MW - 176 - 116 - 2 * TOP_GAP] };

const left = (until: number | undefined, now: number): string | null =>
  until !== undefined ? countdown(Math.max(0, Math.ceil((until - now) / 1000))) : null;

/** The daylight block's live lines below the sensor: the reading, then the pending change counting down from `until`. */
function daylightLines(o: OutsideTrace, noDataNight: boolean, now: number): string[] {
  const m = /^(.*?) \((.+) in [\d:]+\)$/.exec(o.detail);
  const reading = m ? m[1] : o.detail;
  const out = o.daylight === null && reading === t('daylight.noData') ? [] : [reading];
  if (m) out.push(`${m[2]} in ${left(o.until, now) ?? countdown(0)}`);
  if (o.daylight === null && noDataNight) out.push(t('outside.flow.countsNight'));
  return out;
}

/**
 * The light block's last line: a command the rule sent with the head of its reason ("last: turned on 19:42 (became
 * true)"), or an entry it did not send, never worded as a command ("switched off elsewhere 19:47, paused 30 min",
 * "kept on by Porch motion 06:10").
 */
function lastLine(l: RuleLast): string {
  const at = clock(l.at);
  if (keptOn(l)) return t('timed.flow.kept').replace('{reason}', l.reason).replace('{at}', at);
  if (switchedElsewhere(l)) {
    return t('outside.flow.elsewhere').replace('{s}', l.action).replace('{at}', at).replace('{why}', l.reason.replace(/^switched elsewhere:?\s*/, ''));
  }
  if (l.sent === false) return t('timed.flow.already').replace('{reason}', l.reason).replace('{s}', l.action).replace('{at}', at);
  return t('timed.flow.last').replace('{did}', t(`rules.did.${l.action}`)).replace('{at}', at).replace('{reason}', l.reason.split(':')[0]);
}

interface Blk { x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; err?: string; tip?: string }
type Item = Omit<Blk, 'x' | 'y' | 'w' | 'h'>;

/**
 * The diagram of an outside light rule, top to bottom: the Daylight block (with "Only after sunset" the Sun block, with
 * a time window the Window block beside it), Wants (on / off), the manual pause, the light. The blocks show the
 * dialog's parameters; the live values are overlaid when `trace` is given (a saved unchanged rule). A click on a block
 * calls `onFocus` with its `data-block`.
 */
export function renderOutsideTrace(o: OutsideTraceOpts): TemplateResult {
  const cfg = o.rule.outside!;
  const tr = o.trace;
  const ot = tr?.outside;
  const w = cfg.window;

  const top: Item[] = [{
    field: 'outside-sensor', cls: ot ? tone(ot.daylight === null ? null : ot.daylight === 'night') : '',
    lines: ot
      ? [`${t('outside.flow.daylight')}: ${t(`daylight.${ot.daylight ?? 'noData'}`)}`, o.deviceName(cfg.sensor), ...daylightLines(ot, cfg.noDataNight === true, o.now)]
      : [t('outside.flow.daylight'), o.deviceName(cfg.sensor), t(cfg.noDataNight ? 'outside.flow.nightOrNoData' : 'daylight.night')],
  }];
  if (cfg.afterSunset) {
    top.push({
      field: 'outside-sunset', cls: ot ? tone(ot.sun === null ? null : ot.sun === 'below') : '',
      lines: [ot ? `${t('outside.flow.sun')}: ${ot.sun === null ? word(null) : t(`outside.sun.${ot.sun}`)}` : t('outside.flow.sun'), t('outside.flow.afterSunset')],
    });
  }
  if (w) {
    const range = `${w.from}-${w.to}`;
    const until = ot && ot.window !== null ? left(ot.windowUntil, o.now) : null;
    top.push({
      field: 'outside-window', cls: ot ? tone(ot.window) : '',
      lines: !ot ? [t('outside.flow.window'), range] : [
        ot.window === null ? `${t('outside.flow.window')}: ${word(null)}` : t(ot.window ? 'outside.flow.inWindow' : 'outside.flow.outWindow'),
        range,
        ...(until ? [t(ot.window ? 'outside.flow.endsIn' : 'outside.flow.startsIn').replace('{t}', until)] : []),
      ],
    });
  }

  const blocks: Blk[] = [];
  const widths = TOP_W[top.length];
  const hTop = blockH(Math.max(...top.map(b => b.lines.length)));
  let x = PAD;
  for (const [i, b] of top.entries()) {
    blocks.push({ ...b, x, y: PAD, w: widths[i], h: hTop });
    x += widths[i] + TOP_GAP;
  }
  let y = PAD + hTop + VGAP;
  const add = (b: Item) => {
    const h = blockH(b.lines.length + (b.err ? 1 : 0));
    blocks.push({ ...b, x: PAD, y, w: MW, h });
    y += h + VGAP;
  };

  const rule = t('outside.flow.rule')
    .replace('{sun}', cfg.afterSunset ? t('outside.flow.ruleSun') : '').replace('{window}', w ? t('outside.flow.ruleWindow') : '');
  add({
    field: 'outside-wants', cls: tr ? tone(tr.verdict) : '',
    lines: [tr ? `${t('outside.flow.wants')}: ${tr.verdict === null ? word(null) : tr.verdict ? 'on' : 'off'}` : t('outside.flow.wants'), rule],
  });

  const paused = ot?.pausedUntil !== undefined && cfg.pause > 0 ? left(ot.pausedUntil, o.now) : null;
  add(cfg.pause === 0
    ? { field: 'outside-pause', cls: ot ? tone(true) : '', lines: [t('outside.flow.never'), t('outside.flow.ignored')] }
    : {
      field: 'outside-pause', cls: ot ? tone(paused === null) : '',
      lines: [
        !ot ? t('outside.flow.pause') : paused !== null ? t('outside.flow.paused').replace('{t}', paused) : t('outside.flow.noPause'),
        t('outside.flow.after').replace('{d}', durationText(cfg.pause * 60)),
      ],
    });

  const last = tr?.last;
  const lightLines = [
    o.deviceName(cfg.light),
    ot ? t('timed.flow.state').replace('{s}', ot.light ?? word(null)) : t('outside.flow.onOff'),
    ...(last ? [lastLine(last)] : []),
  ];
  add({
    field: 'outside-light', cls: ot ? tone(ot.light === null ? null : ot.light === 'on') : '', lines: lightLines, err: last?.error,
    tip: last ? [...lightLines, ...(last.error ? [last.error] : []), last.reason].join('\n') : undefined,
  });

  const H = y - VGAP + PAD;
  const wants = blocks.find(b => b.field === 'outside-wants')!;
  // The top row: a stub from each block down to a bus halfway to Wants, the bus to CX, the trunk down to Wants.
  const bus = PAD + hTop + VGAP / 2;
  const tops = blocks.slice(0, top.length);
  const xs = [CX, ...tops.map(b => b.x + b.w / 2)];
  const links = [
    ...tops.map(b => `M${b.x + b.w / 2} ${PAD + hTop} V${bus}`),
    ...(Math.max(...xs) > Math.min(...xs) ? [`M${Math.min(...xs)} ${bus} H${Math.max(...xs)}`] : []),
    `M${CX} ${bus} V${wants.y}`,
    ...blocks.slice(top.length + 1).map(k => `M${CX} ${k.y - VGAP} V${k.y}`),
  ].join(' ');
  const block = (b: Blk) => flowBlock({ ...b, focused: o.focused === b.field, onClick: () => o.onFocus(b.field) });
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${OUTSIDE_WIDTH}px`} viewBox=${`0 0 ${OUTSIDE_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('outside.flow.title')}>
        ${svg`<path class="fc-link" d=${links}></path>`}
        ${blocks.map(block)}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
