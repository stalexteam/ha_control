import { html, nothing, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import { SWITCHED_ELSEWHERE, keptOn, type RuleLast, type RuleTrace } from '../live/rules-feed';
import { clock } from '../panel/rules-panel';
import { durationText, tone, word } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, PURPOSE_WIDTH, blockH, countdown, flowBlock } from './flow-block';
import { t } from '../i18n';

export interface TimedTraceOpts {
  /** The timed switch rule as edited in the dialog. */
  rule: Rule;
  /** A device's name ("Choose..." for an empty pick, the missing text for a deleted device). */
  deviceName(id: Id): string;
  /** The button's start / stop events ("start: on (1 hold), stop: off (2 hold)"), or null (no button, not a container). */
  events: string | null;
  /** Live values of the saved rule; undefined = parameters only. */
  trace?: RuleTrace;
  /** The note under the diagram ("Live state appears after Save" ...), or null. */
  note: string | null;
  now: number;
  /** The `data-field` last focused from the diagram, highlighted. */
  focused?: string | null;
  /** A click on a block: the `data-field` of its form field (the same name). */
  onFocus(field: string): void;
}

/** The compact width of the purpose-built automation diagrams. */
export const TIMED_WIDTH = PURPOSE_WIDTH;
const MW = TIMED_WIDTH - 2 * PAD, CX = TIMED_WIDTH / 2;

/**
 * The device block's last line: a command the rule sent ("last: turned off 21:43 (time over)"), or an entry it did not
 * send, never worded as a command ("switched off elsewhere 21:46", "button start: already on 21:50").
 */
function lastLine(l: RuleLast): string {
  const at = clock(l.at);
  if (keptOn(l)) return t('timed.flow.kept').replace('{reason}', l.reason).replace('{at}', at);
  if (l.sent === false) {
    return (l.reason === SWITCHED_ELSEWHERE ? t('timed.flow.elsewhere') : t('timed.flow.already').replace('{reason}', l.reason))
      .replace('{s}', l.action).replace('{at}', at);
  }
  return t('timed.flow.last').replace('{did}', t(`rules.did.${l.action}`)).replace('{at}', at).replace('{reason}', l.reason);
}

interface Blk { y: number; h: number; field: string; cls: string; lines: string[]; err?: string }

/**
 * The diagram of a timed switch rule, top to bottom: the button with its start / stop events, the run (its duration;
 * live: running with the countdown to its end, or idle), the device (the run's commands; live: its state and the last
 * entry). The blocks show the dialog's parameters; the live values are overlaid when `trace` is given (a saved
 * unchanged rule). A click on a block calls `onFocus` with its form field.
 */
export function renderTimedTrace(o: TimedTraceOpts): TemplateResult {
  const cfg = o.rule.timed!;
  const tr = o.trace;
  const tm = tr?.timed;
  const blocks: Blk[] = [];
  let y = PAD;
  const add = (field: string, cls: string, lines: string[], err?: string) => {
    const h = blockH(lines.length + (err ? 1 : 0));
    blocks.push({ y, h, field, cls, lines, err });
    y += h + VGAP;
  };

  add('timed-button', '', [o.deviceName(cfg.button), o.events ?? t('timed.flow.events')]);
  const forText = t(cfg.invert ? 'timed.flow.forInvert' : 'timed.flow.for').replace('{d}', durationText(cfg.minutes * 60));
  const run = !tm ? t('timed.flow.run') : !tm.running ? t('timed.flow.idle')
    : tm.until !== undefined ? t('timed.flow.running').replace('{t}', countdown(Math.max(0, Math.ceil((tm.until - o.now) / 1000))))
      : t('timed.flow.runningNow');
  add('timed-minutes', tm ? tone(tm.running) : tr ? tone(tr.verdict) : '', [run, forText]);
  const last = tr?.last;
  add('timed-device', tm ? tone(tm.device === null ? null : tm.device === 'on') : '', [
    o.deviceName(cfg.device),
    tm ? t('timed.flow.state').replace('{s}', tm.device ?? word(null)) : t(cfg.invert ? 'timed.flow.cmdInvert' : 'timed.flow.cmd'),
    ...(last ? [lastLine(last)] : []),
  ], last?.error);

  const H = y - VGAP + PAD;
  const links = blocks.slice(1).map(k => `M${CX} ${k.y - VGAP} V${k.y}`).join(' ');
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${TIMED_WIDTH}px`} viewBox=${`0 0 ${TIMED_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('timed.flow.title')}>
        <path class="fc-link" d=${links}></path>
        ${blocks.map(k => flowBlock({ x: PAD, w: MW, ...k, focused: o.focused === k.field, onClick: () => o.onFocus(k.field) }))}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
