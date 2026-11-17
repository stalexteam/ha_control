import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import type { RuleTrace } from '../live/rules-feed';
import { durationText, tone, word } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, PURPOSE_WIDTH, blockH, countdown, flowBlock } from './flow-block';
import { lastLine } from './outside-trace';
import { t } from '../i18n';

export interface BeurerTraceOpts {
  /** The beurer heater rule as edited in the dialog. */
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
  /** A click on a block: its `data-block` (the form field it belongs to is `BEURER_FOCUS[block] ?? block`). */
  onFocus(field: string): void;
}

/** Blocks whose form field has another name: Wants is decided by the threshold. */
export const BEURER_FOCUS: Record<string, string> = { 'beurer-wants': 'beurer-above' };

export const BEURER_WIDTH = PURPOSE_WIDTH;
const MW = BEURER_WIDTH - 2 * PAD, CX = BEURER_WIDTH / 2;

const left = (until: number, now: number): string => countdown(Math.max(0, Math.ceil((until - now) / 1000)));

interface Blk { y: number; h: number; field: string; cls: string; lines: string[]; err?: string; tip?: string }

/**
 * The diagram of a beurer heater rule, top to bottom: the power source (live: its reading, or the kept state counting
 * down), Wants (on / off, the off delay counting down), Re-power (the next cycle, the socket's off phase or "due") and
 * the heater (its state and the last entry). The blocks show the dialog's parameters; the live values are overlaid
 * when `trace` is given (a saved unchanged rule). A click on a block calls `onFocus` with its `data-block`.
 */
export function renderBeurerTrace(o: BeurerTraceOpts): TemplateResult {
  const cfg = o.rule.beurer!;
  const tr = o.trace;
  const bt = tr?.beurer;
  const blocks: Blk[] = [];
  let y = PAD;
  const add = (field: string, cls: string, lines: string[], err?: string, tip?: string) => {
    const h = blockH(lines.length + (err ? 1 : 0));
    blocks.push({ y, h, field, cls, lines, err, tip });
    y += h + VGAP;
  };

  const kept = bt?.watts === null && bt.keptUntil !== undefined;
  const reading = !bt ? t('beurer.source') : bt.watts !== null ? bt.detail
    : kept ? t('beurer.flow.kept').replace('{t}', left(bt.keptUntil!, o.now)) : t('beurer.flow.noData');
  add('beurer-source', bt ? tone(bt.watts !== null ? bt.watts > cfg.above : kept ? tr!.inputs[0]?.value ?? null : null) : '',
    [o.deviceName(cfg.source), reading]);

  const pending = tr?.pending;
  add('beurer-wants', tr ? tone(tr.verdict) : '', [
    tr ? `${t('beurer.flow.wants')}: ${tr.verdict === null ? word(null) : tr.verdict ? 'on' : 'off'}` : t('beurer.flow.wants'),
    t('beurer.flow.rule').replace('{w}', String(cfg.above)).replace('{d}', countdown(o.rule.offDelay)),
    ...(pending ? [t('rules.flow.pending').replace('{to}', pending.to ? 'on' : 'off').replace('{t}', left(pending.at, o.now))] : []),
  ]);

  const wanted = tr?.verdict === true;
  const repower = cfg.every === 0 ? t('beurer.flow.never')
    : bt && !wanted ? '—'
    : bt?.pausedUntil !== undefined ? t('beurer.flow.now').replace('{t}', left(bt.pausedUntil, o.now))
    : bt?.cycleAt !== undefined ? t('beurer.flow.next').replace('{t}', left(bt.cycleAt, o.now))
    : bt && wanted && bt.heater === 'on' && !bt.fresh ? t('beurer.flow.due')
    : bt ? '—' : durationText(cfg.every * 60);
  add('beurer-every', bt ? tone(bt.pausedUntil !== undefined ? false : wanted ? true : null) : '', [t('beurer.flow.repower'), repower]);

  const last = tr?.last;
  const lines = [
    o.deviceName(cfg.heater),
    bt ? t('timed.flow.state').replace('{s}', bt.heater ?? word(null)) : t('outside.flow.onOff'),
    ...(last ? [lastLine(last)] : []),
  ];
  add('beurer-heater', bt ? tone(bt.heater === null ? null : bt.heater === 'on') : '', lines, last?.error,
    last ? [...lines, ...(last.error ? [last.error] : []), last.reason].join('\n') : undefined);

  const H = y - VGAP + PAD;
  const links = blocks.slice(1).map(k => `M${CX} ${k.y - VGAP} V${k.y}`).join(' ');
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${BEURER_WIDTH}px`} viewBox=${`0 0 ${BEURER_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('beurer.flow.title')}>
        ${svg`<path class="fc-link" d=${links}></path>`}
        ${blocks.map(k => flowBlock({ x: PAD, w: MW, ...k, focused: o.focused === k.field, onClick: () => o.onFocus(k.field) }))}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
