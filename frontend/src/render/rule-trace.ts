import { html, nothing, svg, type TemplateResult } from 'lit';
import { isAnnounce, type Rule, type RuleDo, type RuleInput, type RuleSource } from '../model/types';
import type { RuleGateTrace, RuleTrace } from '../live/rules-feed';
import { lastText } from '../panel/rules-panel';
import { t } from '../i18n';
import { FLOW_MAX_SCALE, FLOW_PAD as PAD, FLOW_VGAP as VGAP, FLOW_WIDTH, blockH, countdown, flowBlock } from './flow-block';

export { FLOW_MAX_SCALE };

/** What a click on a flowchart block asks the dialog to focus. */
export type FocusTarget = { input: number } | 'gate' | 'gate-input' | 'delays' | { action: 'true' | 'false'; index: number };

/** The `data-field` of the dialog's form field a target points at. */
export function fieldOf(target: FocusTarget): string {
  if (target === 'gate') return 'combine';
  if (target === 'gate-input') return 'gate-input';
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

/** The viewBox width, the same as the vent diagram's. */
export const WIDTH = FLOW_WIDTH;
export const CX = WIDTH / 2;
export const IN_W = 230;
/** Inputs: up to PER_ROW blocks a row on a grid centred on CX; the middle grid gap is at CX, so the trunk passes rows. */
const IN_GAP = 26, PER_ROW = 4, ROW_GAP = 36, BH = blockH(2);
const GRID_X = (WIDTH - PER_ROW * IN_W - (PER_ROW - 1) * IN_GAP) / 2;
/** The ANY / ALL block, the result and gate blocks, the two action columns (as the vent diagram's sensors). */
const COMB_W = 200, SW = 330, SGAP = 40;
export const MW = 460, ACT_GAP = 8, HEAD_H = 24;
const XA = (WIDTH - SW * 2 - SGAP) / 2, XB = XA + SW + SGAP;

/** "45 s", "30 min", "1 h", "1 h 30 min": a duration in whole seconds, the biggest exact units. */
export function durationText(sec: number): string {
  if (!Number.isFinite(sec)) return '?';
  const s = Math.round(sec);
  if (s < 60) return `${s} ${t('rules.unit.s')}`;
  const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60);
  if (h === 0) return `${m} ${t('rules.unit.min')}`;
  return m === 0 ? `${h} ${t('rules.unit.h')}` : `${h} ${t('rules.unit.h')} ${m} ${t('rules.unit.min')}`;
}

/** The live countdown to `until` (at least 1 s while it runs), as the vent diagram's run-on. */
export const remaining = (until: number, now: number): string => countdown(Math.max(1, Math.ceil((until - now) / 1000)));

/** The second line of an input block before live values: its parameters in a few words. */
export function paramText(s: RuleSource, not = false): string {
  if ('light' in s) return `${t('rules.light.below').toLowerCase()} ${s.below} lx (+${s.hysteresis})`;
  if ('daylight' in s) return t(`rules.daylight.is.${s.is}`);
  if ('sun' in s) return t(not ? 'rules.sun.above' : 'rules.sun.below');
  if ('time' in s) return `${s.time.from}-${s.time.to}`;
  if ('held' in s) return `${t(`rules.held.${s.held.state}`)} ${durationText(s.held.seconds)}`;
  return 'rule' in s ? t('rules.src.rule') : t('rules.src.device');
}

const secs = (n: number): string => (Number.isFinite(n) ? String(n) : '?');

/** Three-valued gate of the inputs' values after NOT, as the server combines them (an ANY ignores unknown inputs). */
export function gateValue(combine: 'all' | 'any', values: (boolean | null)[]): boolean | null {
  if (values.length === 0) return null;
  if (combine === 'all') return values.includes(false) ? false : values.includes(null) ? null : true;
  return values.includes(true) ? true : values.some(v => v !== null) ? false : null;
}

export type LiveTrace = { value: boolean | null; detail: string; until?: number };

/**
 * A Held input counts down by its `until`: the server's text is stale between evaluations. A Daylight input's detail
 * ends in its pending change ("night, 62 lx (day in 0:42)"), whose countdown ticks from `until` the same way.
 */
export function liveDetail(tr: LiveTrace, now: number, s: RuleSource): string {
  if ('daylight' in s) return daylightDetail(tr, now);
  return tr.until !== undefined && tr.until > now && tr.value !== true ? t('rules.flow.trueIn').replace('{t}', remaining(tr.until, now)) : tr.detail;
}

export const daylightDetail = (tr: LiveTrace, now: number): string =>
  tr.until === undefined ? tr.detail : tr.detail.replace(/ in [\d:]+\)$/, ` in ${remaining(tr.until, now)})`);

export const word = (v: boolean | null): string => t(`rules.val.${v === null ? 'unknown' : v}`);
export const tone = (v: boolean | null): string => (v === true ? ' on' : v === false ? ' off' : ' nodata');

/** Left edges of the input blocks: full rows on the grid; a single row centred; the last of several rows as near the
 * middle as the grid allows (never across CX, where the trunk runs). */
function inputXs(n: number): number[] {
  if (n <= PER_ROW) {
    const x0 = (WIDTH - n * IN_W - (n - 1) * IN_GAP) / 2;
    return Array.from({ length: n }, (_, k) => x0 + k * (IN_W + IN_GAP));
  }
  const last = n - Math.floor((n - 1) / PER_ROW) * PER_ROW, start = Math.floor((PER_ROW - last) / 2);
  return Array.from({ length: n }, (_, k) => {
    const col = k % PER_ROW;
    return GRID_X + (k >= n - last ? start + col : col) * (IN_W + IN_GAP);
  });
}

/** The two lines of the "Act only when" block: its input (with NOT) and its live state, or its parameters before live values. */
export function gateLines(gate: RuleInput, name: string, gt: RuleGateTrace | undefined, now: number): string[] {
  const state = !gt ? paramText(gate.source)
    // A Daylight gate shows the sensor's state (and pending change) after open / closed.
    : 'daylight' in gate.source && gt.value !== null ? `${t(gt.value ? 'rules.flow.open' : 'rules.flow.closed')}, ${daylightDetail(gt, now)}`
    : gt.value === true ? t('rules.flow.open')
    : gt.value === null ? `${t('rules.flow.closed')}, ${t('rules.val.unknown')}`
    : gt.until !== undefined && gt.until > now ? `${t('rules.flow.closed')}, ${t('rules.flow.opensIn').replace('{t}', remaining(gt.until, now))}`
    : `${t('rules.flow.closed')}${gt.detail ? `, ${gt.detail}` : ''}`;
  return [`${t('rules.flow.gate')}: ${gate.not ? 'NOT ' : ''}${name}`, state];
}

/**
 * Geometry of `n` input blocks of height `bh` in rows: their left edges, row tops, the bus y of each row and the links
 * (a stub from each block down to its row's bus, the buses joined at the trunk x CX); `bottom` is the lowest block edge.
 */
export function inputGrid(n: number, bh: number): { xs: number[]; inY(k: number): number; busY(r: number): number; bottom: number; links: string[] } {
  const rows = Math.ceil(n / PER_ROW), xs = inputXs(n);
  const rowY = (r: number): number => PAD + r * (bh + ROW_GAP);
  const inY = (k: number): number => rowY(Math.floor(k / PER_ROW));
  const busY = (r: number): number => rowY(r) + bh + (r === rows - 1 ? VGAP : ROW_GAP) / 2;
  const links: string[] = [];
  xs.forEach((x, k) => links.push(`M${x + IN_W / 2} ${inY(k) + bh} V${busY(Math.floor(k / PER_ROW))}`));
  for (let r = 0; r < rows; r++) {
    const cs = [CX, ...xs.slice(r * PER_ROW, (r + 1) * PER_ROW).map(x => x + IN_W / 2)];
    if (Math.max(...cs) > Math.min(...cs)) links.push(`M${Math.min(...cs)} ${busY(r)} H${Math.max(...cs)}`);
  }
  return { xs, inY, busY, bottom: n === 0 ? PAD - VGAP : rowY(rows - 1) + bh, links };
}

/**
 * The flowchart of a rule, top to bottom: the inputs in rows, ANY / ALL, the result (delays / verdict / countdown), the
 * "Act only when" gate when set, then the "When true" (left) and "When false" (right) action columns. The blocks are
 * the dialog's current rule; the live values (input details, gate, verdict, countdown) are overlaid when `trace` is
 * given. A click on a block calls `onFocus`.
 */
export function renderRuleTrace(o: RuleTraceOpts): TemplateResult {
  const { rule, trace } = o;
  // A saved trace only lines up with the inputs while their count is the same as in the edited copy.
  const live = trace && trace.inputs.length === rule.inputs.length ? trace.inputs : null;

  const values = rule.inputs.map((i, k) => {
    const v = live?.[k].value ?? null;
    return v === null || !i.not ? v : !v;
  });
  const gate = live ? gateValue(rule.combine, values) : undefined;
  const verdict = trace ? trace.verdict : undefined;
  const pending = trace?.pending;
  const left = pending ? Math.max(0, Math.ceil((pending.at - o.now) / 1000)) : 0;
  const unknown = trace?.unknownInputs ?? 0;

  const gt = rule.gate ? trace?.gate : undefined;
  const gateText = rule.gate ? gateLines(rule.gate, o.inputName(rule.gate), gt, o.now) : [];
  const delayText = t('rules.flow.delay').replace('{on}', secs(rule.onDelay)).replace('{off}', secs(rule.offDelay));
  const verdictLine = trace === undefined ? delayText
    : `${word(verdict ?? null)}${pending ? `, ${t('rules.flow.pending').replace('{to}', word(pending.to)).replace('{t}', countdown(left))}` : ''}`;

  // Geometry: the input rows, the chain of centred blocks, the two action columns.
  const n = rule.inputs.length, grid = inputGrid(n, BH);
  const { xs, inY } = grid;
  const yComb = n === 0 ? PAD : grid.bottom + VGAP;
  const yRes = yComb + BH + VGAP;
  const yGate = yRes + BH + VGAP;
  const yEnd = (rule.gate ? yGate : yRes) + BH;
  const ySplit = yEnd + VGAP / 2, yHead = yEnd + VGAP, yAct = yHead + HEAD_H;
  const longest = Math.max(1, rule.onTrue.length, rule.onFalse.length);
  const H = yAct + longest * (BH + ACT_GAP) - ACT_GAP + PAD;
  const sides = [
    { side: 'true' as const, x: XA, list: rule.onTrue, head: t('rules.whenTrue') },
    { side: 'false' as const, x: XB, list: rule.onFalse, head: t('rules.whenFalse') },
  ];

  // Links: a stub from each input down to its row's bus, the buses join the trunk at CX, the trunk runs down the
  // middle grid gap to ANY / ALL; then block to block; then a split into both columns. No two paths overlap.
  const links: string[] = [...grid.links];
  if (n > 0) links.push(`M${CX} ${grid.busY(0)} V${yComb}`);
  links.push(`M${CX} ${yComb + BH} V${yRes}`);
  if (rule.gate) links.push(`M${CX} ${yRes + BH} V${yGate}`);
  links.push(`M${CX} ${yEnd} V${ySplit} H${XA + SW / 2} V${yHead}`, `M${CX} ${ySplit} H${XB + SW / 2} V${yHead}`);

  const block = (b: { x: number; y: number; w: number; field: string; target: FocusTarget; cls: string; lines: string[] }): TemplateResult =>
    flowBlock({ ...b, h: BH, focused: o.focused === b.field, onClick: () => o.onFocus(b.target) });

  return html`
    <div class="flow">
      <svg class="fc" style=${`max-width:${WIDTH * FLOW_MAX_SCALE}px`} viewBox=${`0 0 ${WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('rules.flow.title')}>
        ${links.map(d => svg`<path class="fc-link" d=${d}></path>`)}
        ${rule.inputs.map((i, k) => {
          const tr = live?.[k];
          return block({
            x: xs[k], y: inY(k), w: IN_W, field: `input-${k}`, target: { input: k }, cls: tr ? tone(tr.value) : '',
            lines: [`${i.not ? 'NOT ' : ''}${o.inputName(i)}`, tr ? liveDetail(tr, o.now, i.source) : paramText(i.source, i.not === true)],
          });
        })}
        ${block({
          x: (WIDTH - COMB_W) / 2, y: yComb, w: COMB_W, field: 'combine', target: 'gate', cls: gate === undefined ? '' : tone(gate),
          lines: [rule.combine === 'all' ? 'ALL' : 'ANY', ...(gate === undefined ? [] : [word(gate)])],
        })}
        ${block({
          x: (WIDTH - MW) / 2, y: yRes, w: MW, field: 'delays', target: 'delays',
          cls: verdict === undefined ? '' : tone(verdict ?? null), lines: [t('rules.flow.result'), verdictLine],
        })}
        ${rule.gate ? block({
          x: (WIDTH - MW) / 2, y: yGate, w: MW, field: 'gate-input', target: 'gate-input', cls: gt ? tone(gt.value) : '',
          lines: gateText,
        }) : nothing}
        ${sides.map(s => svg`
          <text class="fc-head" text-anchor="middle" x=${s.x + SW / 2} y=${yHead + 14}>${s.head}</text>
          ${s.list.length === 0
            ? svg`<text class="fc-t2" text-anchor="middle" x=${s.x + SW / 2} y=${yAct + BH / 2 + 4}>${t('rules.noActions')}</text>`
            : s.list.map((a, k) => block({
              x: s.x, y: yAct + k * (BH + ACT_GAP), w: SW, field: `action-${s.side}-${k}`,
              target: { action: s.side, index: k }, cls: '', lines: [o.actionName(a.device), isAnnounce(a.do) ? `${actText(a.do)}: ${(a.do === 'play' ? a.media : a.text) ?? ''}` : actText(a.do)],
            }))}`)}
      </svg>
      ${unknown > 0 ? html`<p class="fc-warn">${unknown === 1 ? t('rules.unknown1') : t('rules.unknownN').replace('{n}', String(unknown))}</p>` : nothing}
      ${trace?.held ? html`<p class="fc-warn" data-note="held">${t('rules.flow.heldNote')}</p>` : nothing}
      ${trace?.last ? html`<p class="fc-last">${t('rules.flow.last')} ${lastText(trace.last)}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}

const actText = (d: RuleDo): string => t(`rules.act.${d}`);
