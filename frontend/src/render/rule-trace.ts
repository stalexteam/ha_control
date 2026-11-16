import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Rule, RuleDo, RuleInput } from '../model/types';
import type { RuleTrace } from '../live/rules-feed';
import { lastText } from '../panel/rules-panel';
import { t } from '../i18n';

/** What a click on a flowchart block asks the dialog to focus. */
export type FocusTarget = { input: number } | 'gate' | 'delays' | { action: 'true' | 'false'; index: number };

/** The `data-field` of the dialog's form field a target points at. */
export function fieldOf(target: FocusTarget): string {
  if (target === 'gate') return 'combine';
  if (target === 'delays') return 'delays';
  return 'input' in target ? `input-${target.input}` : `action-${target.action}-${target.index}`;
}

export interface RuleTraceOpts {
  /** The rule as edited in the dialog. */
  rule: Rule;
  /** Names for the blocks: the input's device or rule, the action's device. */
  inputName(i: RuleInput): string;
  actionName(deviceId: string): string;
  /** Live values of the saved rule; undefined = blocks only. */
  trace?: RuleTrace;
  /** The note under the chart ("Live state appears after Save" ...), or null. */
  note: string | null;
  now: number;
  /** The `data-field` last focused from the chart or the form, highlighted. */
  focused?: string | null;
  onFocus(target: FocusTarget): void;
}

const IN_W = 210, IN_H = 50, GATE_W = 90, VERDICT_W = 150, ACT_W = 230, ACT_H = 44, HEAD_H = 26, GAP = 44, PAD = 10;
const X_GATE = PAD + IN_W + GAP, X_VERDICT = X_GATE + GATE_W + GAP, X_ACT = X_VERDICT + VERDICT_W + GAP;
export const FLOW_MAX_SCALE = 1.25;
export const WIDTH = X_ACT + ACT_W + PAD;

const secs = (n: number): string => (Number.isFinite(n) ? String(n) : '?');
const clip = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** Three-valued gate of the inputs' values after NOT, as the server combines them (an ANY ignores unknown inputs). */
export function gateValue(combine: 'all' | 'any', values: (boolean | null)[]): boolean | null {
  if (values.length === 0) return null;
  if (combine === 'all') return values.includes(false) ? false : values.includes(null) ? null : true;
  return values.includes(true) ? true : values.some(v => v !== null) ? false : null;
}

const word = (v: boolean | null): string => t(`rules.val.${v === null ? 'unknown' : v}`);
const tone = (v: boolean | null): string => (v === true ? ' on' : v === false ? ' off' : ' nodata');

interface BlockOpts { x: number; y: number; w: number; h: number; field: string; target: FocusTarget; cls?: string; lines: [string, string?]; opts: RuleTraceOpts; chars: number }

function block(b: BlockOpts): TemplateResult {
  const { x, y, w, h } = b;
  return svg`
    <g class="fc-blk${b.cls ?? ''}${b.opts.focused === b.field ? ' hl' : ''}" data-block=${b.field} transform=${`translate(${x} ${y})`}
      @click=${() => b.opts.onFocus(b.target)}>
      <rect class="fc-box" width=${w} height=${h} rx="8"></rect>
      <text class="fc-t1" x="10" y=${b.lines[1] === undefined ? h / 2 + 5 : 20}>${clip(b.lines[0], b.chars)}</text>
      ${b.lines[1] === undefined ? nothing : svg`<text class="fc-t2" x="10" y="38">${clip(b.lines[1], b.chars + 4)}</text>`}
    </g>`;
}

const link = (x1: number, y1: number, x2: number, y2: number): TemplateResult => {
  const xm = (x1 + x2) / 2;
  return svg`<path class="fc-link" d=${`M${x1} ${y1} H${xm} V${y2} H${x2}`}></path>`;
};

/**
 * The flowchart of a rule: inputs -> gate -> verdict -> "When true" / "When false" actions. The blocks are the
 * dialog's current rule; the live values (input details, gate, verdict, countdown) are overlaid when `trace` is given.
 * A click on a block calls `onFocus`.
 */
export function renderRuleTrace(o: RuleTraceOpts): TemplateResult {
  const { rule, trace } = o;
  // A saved trace only lines up with the inputs while their count is the same as in the edited copy.
  const live = trace && trace.inputs.length === rule.inputs.length ? trace.inputs : null;
  const sideH = (n: number): number => HEAD_H + 8 + Math.max(1, n) * (ACT_H + 8);
  const inputsH = Math.max(1, rule.inputs.length) * (IN_H + 12);
  const actionsH = sideH(rule.onTrue.length) + 16 + sideH(rule.onFalse.length);
  const H = Math.max(inputsH, actionsH, 150) + PAD * 2;
  const mid = H / 2;
  const inY0 = mid - inputsH / 2 + 6;
  const actY0 = mid - actionsH / 2;
  const falseY0 = actY0 + sideH(rule.onTrue.length) + 16;

  const values = rule.inputs.map((i, k) => {
    const v = live?.[k].value ?? null;
    return v === null || !i.not ? v : !v;
  });
  const gate = live ? gateValue(rule.combine, values) : undefined;
  const verdict = trace ? trace.verdict : undefined;
  const pending = trace?.pending;
  const left = pending ? Math.max(0, Math.ceil((pending.at - o.now) / 1000)) : 0;
  const unknown = trace?.unknownInputs ?? 0;

  const sides = [
    { side: 'true' as const, y0: actY0, list: rule.onTrue, head: t('rules.whenTrue') },
    { side: 'false' as const, y0: falseY0, list: rule.onFalse, head: t('rules.whenFalse') },
  ];
  const delayText = t('rules.flow.delay').replace('{on}', secs(rule.onDelay)).replace('{off}', secs(rule.offDelay));
  const verdictLine = trace === undefined ? delayText
    : `${word(verdict ?? null)}${pending ? `, ${t('rules.flow.pending').replace('{to}', word(pending.to)).replace('{n}', String(left))}` : ''}`;

  return html`
    <div class="flow">
      <svg class="fc" style=${`max-width:${WIDTH * FLOW_MAX_SCALE}px`} viewBox=${`0 0 ${WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('rules.flow.title')}>
        ${rule.inputs.map((_, k) => link(PAD + IN_W, inY0 + k * (IN_H + 12) + IN_H / 2, X_GATE, mid))}
        ${svg`<path class="fc-link" d=${`M${X_GATE + GATE_W} ${mid} H${X_VERDICT}`}></path>`}
        ${sides.map(s => link(X_VERDICT + VERDICT_W, mid, X_ACT, s.y0 + HEAD_H / 2))}
        ${rule.inputs.map((i, k) => {
          const tr = live?.[k];
          return block({
            x: PAD, y: inY0 + k * (IN_H + 12), w: IN_W, h: IN_H, field: `input-${k}`, target: { input: k }, opts: o, chars: 26,
            cls: tr ? tone(tr.value) : '',
            lines: [`${i.not ? 'NOT ' : ''}${o.inputName(i)}`, tr ? tr.detail : srcWord(i)],
          });
        })}
        ${block({
          x: X_GATE, y: mid - 28, w: GATE_W, h: 56, field: 'combine', target: 'gate', opts: o, chars: 10,
          cls: gate === undefined ? '' : tone(gate),
          lines: [rule.combine === 'all' ? 'ALL' : 'ANY', gate === undefined ? undefined : word(gate)],
        })}
        ${block({
          x: X_VERDICT, y: mid - 28, w: VERDICT_W, h: 56, field: 'delays', target: 'delays', opts: o, chars: 19,
          cls: verdict === undefined ? '' : tone(verdict ?? null), lines: [t('rules.flow.result'), verdictLine],
        })}
        ${sides.map(s => svg`
          <text class="fc-head" x=${X_ACT + 8} y=${s.y0 + HEAD_H - 8}>${s.head}</text>
          ${s.list.length === 0
            ? svg`<text class="fc-t2" x=${X_ACT + 10} y=${s.y0 + HEAD_H + 8 + ACT_H / 2 + 4}>${t('rules.noActions')}</text>`
            : s.list.map((a, k) => block({
              x: X_ACT, y: s.y0 + HEAD_H + 8 + k * (ACT_H + 8), w: ACT_W, h: ACT_H, field: `action-${s.side}-${k}`,
              target: { action: s.side, index: k }, opts: o, chars: 28, lines: [o.actionName(a.device), actText(a.do)],
            }))}`)}
      </svg>
      ${unknown > 0 ? html`<p class="fc-warn">${unknown === 1 ? t('rules.unknown1') : t('rules.unknownN').replace('{n}', String(unknown))}</p>` : nothing}
      ${trace?.last ? html`<p class="fc-last">${t('rules.flow.last')} ${lastText(trace.last)}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}

const actText = (d: RuleDo): string => t(`rules.act.${d}`);

const srcWord = (i: RuleInput): string => ('rule' in i.source ? t('rules.src.rule') : t('rules.src.device'));
