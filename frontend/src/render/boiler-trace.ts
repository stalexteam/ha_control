import { html, nothing, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import type { BoilerTrace, RuleTrace } from '../live/rules-feed';
import { clock } from '../panel/rules-panel';
import { tone, word } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, PURPOSE_WIDTH, blockH, countdown, flowBlock } from './flow-block';
import { t } from '../i18n';

export interface BoilerTraceOpts {
  /** The boiler rule as edited in the dialog. */
  rule: Rule;
  /** A device's name ("Choose..." for an empty pick, the missing text for a deleted device). */
  deviceName(id: Id): string;
  /** A grid block's name, likewise. */
  gridName(id: Id): string;
  /** Live values of the saved rule; undefined = parameters only. */
  trace?: RuleTrace;
  /** The note under the diagram ("Live state appears after Save" ...), or null. */
  note: string | null;
  now: number;
  /** The `data-field` last focused from the diagram, highlighted. */
  focused?: string | null;
  /** A click on a block: its `data-block` (the form field it belongs to is `BOILER_FOCUS[block] ?? block`). */
  onFocus(field: string): void;
}

/** Blocks whose form field has another name: the relay and (without a power limit) the boiler power are the Boiler. */
export const BOILER_FOCUS: Record<string, string> = { 'boiler-relay': 'boiler-device', 'boiler-power': 'boiler-device' };

/** The compact width of the purpose-built automation diagrams. */
export const BOILER_WIDTH = PURPOSE_WIDTH;
const MW = BOILER_WIDTH - 2 * PAD, MX = PAD, CX = BOILER_WIDTH / 2;

const watts = (w: number | null): string => (w === null ? word(null) : `${Math.round(w)} W`);
const shown = (n: number): string => (Number.isFinite(n) ? String(+n.toFixed(4)) : '?');

/** The relay's phase words; waiting and the heating grace count down to `until`. */
function phaseText(b: BoilerTrace, now: number): string | null {
  const left = b.until !== undefined ? countdown(Math.max(0, Math.ceil((b.until - now) / 1000))) : null;
  switch (b.phase) {
    case 'heating': return left ? t('boiler.phase.heatingCheck').replace('{t}', left) : t('boiler.phase.heating');
    case 'waiting': return t('boiler.phase.waiting').replace('{t}', left ?? countdown(0));
    case 'blackout': case 'limit': case 'done': return t(`boiler.phase.${b.phase}`);
    default: return null;
  }
}

/** Heating is "on"; blackout, limit, waiting and done are "off"; in manual the relay itself. */
function relayTone(b: BoilerTrace): string {
  if (b.phase === 'heating') return tone(true);
  if (b.phase !== null) return tone(false);
  return tone(b.relay === null ? null : b.relay === 'on');
}

interface Blk { y: number; h: number; field: string; cls: string; lines: string[]; err?: string }

/**
 * The diagram of a boiler rule, top to bottom: with a power limit the grid and the headroom (grid + nominal - boiler
 * against the limit), then the mode with its button, the relay with its phase, the boiler's power. The blocks show
 * the dialog's parameters; the live values are overlaid when `trace` is given (a saved unchanged rule). A click on a
 * block calls `onFocus` with its form field.
 */
export function renderBoilerTrace(o: BoilerTraceOpts): TemplateResult {
  const r = o.rule;
  const cfg = r.boiler!;
  const g = cfg.grid;
  const tr = o.trace;
  const b = tr?.boiler;
  const boilerName = o.deviceName(cfg.device);
  const blocks: Blk[] = [];
  let y = PAD;
  const add = (field: string, cls: string, lines: string[], err?: string) => {
    const h = blockH(lines.length + (err ? 1 : 0));
    blocks.push({ y, h, field, cls, lines, err });
    y += h + VGAP;
  };

  if (g) {
    add('boiler-grid', b ? (b.grid === null ? tone(null) : '') : '', [o.gridName(g.block), b ? watts(b.grid) : t('boiler.flow.gridPower')]);
    const formula = t('boiler.flow.formula').replace('{nominal}', shown(g.nominal));
    const over = b && b.headroom !== null ? b.headroom > g.limit : null;
    add('boiler-limit', b ? tone(over === null ? null : !over) : '', [
      b ? `${t('boiler.flow.headroom')}: ${over === null ? word(null) : over ? t('boiler.flow.over') : t('boiler.flow.ok')}` : t('boiler.flow.headroom'),
      b && b.headroom !== null ? `${formula} = ${Math.round(b.headroom)} / ${shown(g.limit)} W` : `${formula} ≤ ${shown(g.limit)} W`,
    ]);
  }
  add('boiler-button', b ? tone(b.mode === 'auto') : '', [
    b ? `${t('boiler.flow.mode')}: ${t(`boiler.mode.${b.mode}`)}` : t('boiler.flow.mode'),
    t('boiler.flow.button').replace('{name}', o.deviceName(cfg.button)),
  ]);
  const phase = b ? phaseText(b, o.now) : null;
  const last = tr?.last;
  add('boiler-relay', b ? relayTone(b) : '', [
    b ? `${t('boiler.flow.relay')}: ${b.relay ?? word(null)}` : t('boiler.flow.relay'),
    boilerName,
    ...(phase ? [phase] : []),
    ...(last ? [t('vent.flow.last').replace('{did}', t(`rules.did.${last.action}`)).replace('{at}', clock(last.at))] : []),
  ], last?.error);
  const done = t('boiler.flow.done');
  add(g ? 'boiler-nominal' : 'boiler-power', b ? tone(b.boilerW === null ? null : b.boilerW > 1) : '', [
    b ? `${t('boiler.flow.power')}: ${watts(b.boilerW)}` : t('boiler.flow.power'),
    g ? `${t('boiler.flow.nominal').replace('{w}', shown(g.nominal))}, ${done}` : done,
  ]);

  const H = y - VGAP + PAD;
  const links = blocks.slice(1).map(k => `M${CX} ${k.y - VGAP} V${k.y}`).join(' ');
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${BOILER_WIDTH}px`} viewBox=${`0 0 ${BOILER_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('boiler.flow.title')}>
        <path class="fc-link" d=${links}></path>
        ${blocks.map(k => flowBlock({ x: MX, w: MW, ...k, focused: o.focused === k.field, onClick: () => o.onFocus(k.field) }))}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
