import { html, nothing, svg, type TemplateResult } from 'lit';
import { isAnnounce, isButtonSource, isEventSource, type ControlAction, type ControlSource, type Id, type Rule } from '../model/types';
import { keptOn, notConfirmed, type RuleLast, type RuleTrace } from '../live/rules-feed';
import { clock, lastFlowLine, lastText } from '../panel/rules-panel';
import { CX, IN_W, MW, ACT_GAP, HEAD_H, WIDTH, FLOW_MAX_SCALE, gateLines, inputGrid, liveDetail, tone } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, blockH, flowBlock } from './flow-block';
import { controlLists } from '../model/rules';
import { t } from '../i18n';

export interface ControlFlowOpts {
  /** The load control rule as edited in the dialog. */
  rule: Rule;
  /** Live values of the saved rule; undefined = blocks only. */
  trace: RuleTrace | undefined;
  now: number;
  /** A device's name (the missing text for a deleted device). */
  nameOf(id: Id): string;
  /** A source's name, and what it gives ("toggle" or "on / off"), before live values. */
  sourceLabel(s: ControlSource): string;
  /** An event source's two lines: the rule's name and the event ("entered auto"); its label is too long for one block line. */
  eventLines?(s: ControlSource): string[];
  gives(s: ControlSource): 'toggle' | 'on / off' | 'on';
  /** The block id last focused from the chart or the form, highlighted. */
  focused: string | null;
  onFocus(block: string): void;
  /** The note under the chart ("Live state appears after Save" ...), or null. */
  note?: string | null;
}

/** The form field a block id (`source:<k>`, `event`, `gate`, `on:<k>`, `off:<k>`, `toggle:<k>`, `<list>:empty`) points at. */
export function controlFlowFocus(block: string): string {
  if (block === 'event') return 'control-source-0';
  return `control-${block.endsWith(':empty') ? block.slice(0, -':empty'.length) : block.replace(':', '-')}`;
}

/** Three equal action columns (four with "When auto") hanging from one bus. */
const COL_GAP = 20;
const HEADS = { on: 'control.whenOn', off: 'control.whenOff', toggle: 'control.whenToggle', auto: 'control.auto' } as const;
type List = keyof typeof HEADS;

/** The last action written on a device block: "last: turned on 21:43", or in words when nothing was sent. */
const lastLine = (l: RuleLast): string =>
  l.error && !notConfirmed(l) ? t('control.flow.notSent').replace('{at}', clock(l.at))
    : keptOn(l) || l.sent !== false ? lastFlowLine(l) : lastText(l);

/**
 * The flowchart of a load control rule, top to bottom: the sources in rows (name, live value, what they give), the
 * Event block (the latest event, or why it was dropped), the "Act only when" gate when set, then the "When on" /
 * "When off" / "When toggle" columns of action blocks (device, what it does, its state, the last action). The blocks
 * are the dialog's current rule; live values are overlaid when `trace` is given. A click calls `onFocus` with the block id.
 */
export function renderControlFlow(o: ControlFlowOpts): TemplateResult {
  const { rule, trace } = o;
  const c = rule.control!;
  const n = c.sources.length;
  // A saved trace only lines up with the sources while their count is the same as in the edited copy.
  const live = trace && trace.inputs.length === n ? trace.inputs : null;
  const ct = trace?.control;
  const ev = ct?.event;

  const bh = blockH(live || c.sources.some(isEventSource) ? 3 : 2), eh = blockH(ev?.dropped ? 3 : 2);
  const grid = inputGrid(n, bh);
  const yEv = n === 0 ? PAD : grid.bottom + VGAP;
  const yGate = yEv + eh + VGAP;
  const yEnd = rule.gate ? yGate + blockH(2) : yEv + eh;
  const ySplit = yEnd + VGAP / 2, yHead = yEnd + VGAP, yAct = yHead + HEAD_H;
  const LISTS = controlLists(c);
  const CW = (WIDTH - 2 * PAD - (LISTS.length - 1) * COL_GAP) / LISTS.length;
  const colX = (k: number): number => PAD + k * (CW + COL_GAP);

  const links: string[] = [...grid.links];
  if (n > 0) links.push(`M${CX} ${grid.busY(0)} V${yEv}`);
  if (rule.gate) links.push(`M${CX} ${yEv + eh} V${yGate}`);
  links.push(`M${CX} ${yEnd} V${ySplit} H${colX(0) + CW / 2} V${yHead}`, `M${CX} ${ySplit} H${colX(LISTS.length - 1) + CW / 2} V${yHead}`);
  for (let k = 1; k < LISTS.length - 1; k++) links.push(`M${CX} ${ySplit} H${colX(k) + CW / 2} V${yHead}`);

  const block = (b: { x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; err?: string }): TemplateResult =>
    flowBlock({ ...b, focused: o.focused === b.field, onClick: () => o.onFocus(b.field) });

  const eventLines = [
    t('control.flow.event'),
    // An event of a purpose-built rule is worded by that rule's event ("... heating done"), any other by the action list it ran.
    ev ? t('control.flow.eventLine').replace('{source}', ev.source).replace('{what}', ev.origin ? t(`control.event.${ev.origin.what}`) : t(`control.do.${ev.what}`)).replace('{at}', clock(ev.at)) : t('control.flow.noEvent'),
    ...(ev?.dropped ? [t('control.flow.dropped')] : []),
  ];
  const stateOf = (id: Id): 'on' | 'off' | 'open' | 'closed' | null | undefined => ct?.devices.find(d => d.id === id)?.state;
  const last = trace?.last;
  // The last action is written in the column of the latest event on the block of the device it names, unless that event was dropped.
  const lastHere = (list: List, a: ControlAction): RuleLast | undefined =>
    last && ev && !ev.dropped && ev.what === list && last.target === o.nameOf(a.device) && (!isAnnounce(a.do) || last.action === a.do) ? last : undefined;
  const actionBlock = (list: List, a: ControlAction, k: number, x: number, y: number): { svg: TemplateResult; h: number } => {
    const st = stateOf(a.device), l = lastHere(list, a);
    // An announcement shows what it says (it has no state to show); a switch shows its state.
    const doLine = isAnnounce(a.do) ? `${t(`control.do.${a.do}`)}: ${(a.do === 'play' ? a.media : a.text) ?? ''}` : t(`control.do.${a.do}`);
    const now = ct && !isAnnounce(a.do) ? [t('control.flow.now').replace('{s}', st ?? t('control.flow.noData'))] : [];
    const lines = [o.nameOf(a.device), doLine, ...now, ...(l ? [lastLine(l)] : [])];
    const h = blockH(lines.length + (l?.error ? 1 : 0));
    return { svg: block({ x, y, w: CW, h, field: `${list}:${k}`, cls: ct ? tone(st == null ? null : st === 'on' || st === 'open') : '', lines, err: l?.error }), h };
  };
  const columns = LISTS.map((list, ci) => {
    const items = c[list] ?? [];
    const x = colX(ci);
    const head = svg`<text class="fc-head" text-anchor="middle" x=${x + CW / 2} y=${yHead + 14}>${t(HEADS[list])}</text>`;
    if (items.length === 0) {
      const h = blockH(1);
      return { bottom: yAct + h, body: svg`${head}${block({ x, y: yAct, w: CW, h, field: `${list}:empty`, cls: ' muted', lines: [t('control.flow.nothing')] })}` };
    }
    let y = yAct;
    const blocks = items.map((a, k) => { const b = actionBlock(list, a, k, x, y); y += b.h + ACT_GAP; return b.svg; });
    return { bottom: y - ACT_GAP, body: svg`${head}${blocks}` };
  });
  const H = Math.max(...columns.map(col => col.bottom)) + PAD;

  return html`
    <div class="flow">
      <svg class="fc" style=${`max-width:${WIDTH * FLOW_MAX_SCALE}px`} viewBox=${`0 0 ${WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('control.flow.title')}>
        ${links.map(d => svg`<path class="fc-link" d=${d}></path>`)}
        ${c.sources.map((s, k) => {
          const tr = live?.[k];
          const detail = tr && tr.detail !== '' && 'source' in s ? liveDetail(tr, o.now, s.source) : isEventSource(s) ? undefined : tr?.detail;
          const gives = t('control.gives').replace('{what}', tr?.gives ?? o.gives(s));
          return block({
            x: grid.xs[k], y: grid.inY(k), w: IN_W, h: bh, field: `source:${k}`, cls: tr && !isButtonSource(s) && !isEventSource(s) ? tone(tr.value) : '',
            lines: isEventSource(s) ? [...(o.eventLines?.(s) ?? [o.sourceLabel(s)]), gives]
              : [`${'not' in s && s.not ? 'NOT ' : ''}${tr?.label ?? o.sourceLabel(s)}`, ...(detail ? [detail] : []), gives],
          });
        })}
        ${block({
          x: (WIDTH - MW) / 2, y: yEv, w: MW, h: eh, field: 'event', cls: ev?.dropped ? ' nodata' : '', lines: eventLines,
        })}
        ${rule.gate ? block({
          x: (WIDTH - MW) / 2, y: yGate, w: MW, h: blockH(2), field: 'gate', cls: trace?.gate ? tone(trace.gate.value) : '',
          lines: gateLines(rule.gate, o.sourceLabel(rule.gate), trace?.gate, o.now),
        }) : nothing}
        ${columns.map(col => col.body)}
      </svg>
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
