import { html, nothing, svg, type TemplateResult } from 'lit';
import type { Id, Rule } from '../model/types';
import { motionModeLast, type RuleLast, type RuleTrace } from '../live/rules-feed';
import { tone, word } from './rule-trace';
import { FLOW_PAD as PAD, FLOW_VGAP as VGAP, PURPOSE_WIDTH, blockH, countdown, flowBlock } from './flow-block';
import { lastLine } from './outside-trace';
import { clock } from '../panel/rules-panel';
import { t } from '../i18n';

export interface MotionLightTraceOpts {
  /** The light motion control rule as edited in the dialog. */
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
  /** A click on a block: its `data-block` (the form field it belongs to is `motionLightFocus(block)`). */
  onFocus(field: string): void;
}

/** Blocks whose form field has another name: Wants is set by the "Off after" field, Mode by the buttons. */
export const MOTION_LIGHT_FOCUS: Record<string, string> = { 'motionlight-wants': 'motionlight-off', 'motionlight-mode': 'motionlight-buttons' };

/** The form field of a diagram block: a sensor block the sensors' add select, the others as `MOTION_LIGHT_FOCUS` or themselves. */
export function motionLightFocus(block: string): string {
  return block.startsWith('motionlight-sensor:') ? 'motionlight-sensors' : MOTION_LIGHT_FOCUS[block] ?? block;
}

export const MOTION_LIGHT_WIDTH = PURPOSE_WIDTH;
const MW = MOTION_LIGHT_WIDTH - 2 * PAD, CX = MOTION_LIGHT_WIDTH / 2;
/** The sensors and the Daylight block: up to three per row, a bus under each row. */
const GAP = 12, PER_ROW = 3;

/** The mode changes of this kind are worded as what they are; every other entry goes through the shared wording. */
const MODE_LAST = { auto: 'lastAuto', autoAgain: 'lastAutoAgain', manualButton: 'lastManualButton', releasedOff: 'lastReleased', found: 'lastFound',
  autoOff: 'lastAutoOff', autoOffLight: 'lastAutoOffLight', autoOn: 'lastAutoOn',
  blocked: 'lastBlocked', unblockedOn: 'lastUnblockedOn', unblockedOff: 'lastUnblockedOff', unblockedLight: 'lastUnblockedLight', daylight: 'lastDaylight' };
const motionLast = (l: RuleLast): string => {
  const mode = motionModeLast(l);
  return mode ? t(`motionLight.flow.${MODE_LAST[mode]}`).replace('{at}', clock(l.at)).replace('{s}', l.action) : lastLine(l);
};

const left = (until: number, now: number): string => countdown(Math.max(0, Math.ceil((until - now) / 1000)));

interface Blk { x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; err?: string; tip?: string }
type Item = Omit<Blk, 'x' | 'y' | 'w' | 'h'>;

/**
 * The diagram of a light motion control rule, top to bottom: the motion sensors (and the Daylight block) in rows,
 * Wants (on / off with the rule in words), the Mode (auto / manual), the light. The blocks show the dialog's
 * parameters; the live values are overlaid when `trace` is given (a saved unchanged rule). A click on a block calls
 * `onFocus` with its `data-block`.
 */
export function renderMotionLightTrace(o: MotionLightTraceOpts): TemplateResult {
  const cfg = o.rule.motionLight!;
  const tr = o.trace;
  const ml = tr?.motionLight;
  const d = cfg.daylight;

  const items: Item[] = cfg.sensors.length === 0
    ? [{ field: 'motionlight-sensors', cls: ' muted', lines: [t('motionLight.flow.noSensors')] }]
    : cfg.sensors.map(id => {
      const s = ml?.sensors.find(x => x.id === id);
      return {
        field: `motionlight-sensor:${id}`, cls: ml ? tone(s?.state === undefined || s.state === null ? null : s.state === 'on') : '',
        lines: [o.deviceName(id), ml ? (s?.state === 'on' ? t('motionLight.flow.motion') : s?.state === 'off' ? t('motionLight.flow.clear') : t('motionLight.flow.noData')) : t('device.motion_sensor')],
      };
    });
  if (d) {
    // The pending change of the debounced state stays in the tooltip: a countdown here would not tick.
    const reading = ml?.daylight ? (/^(.*?) \(.+ in [\d:]+\)$/.exec(ml.daylight.detail)?.[1] ?? ml.daylight.detail) : '';
    items.push({
      field: 'motionlight-daylight', cls: ml ? tone(ml.dark) : '',
      lines: ml?.daylight
        ? [`${t('motionLight.flow.daylight')}: ${ml.daylight.state ?? t('motionLight.flow.noData')}`, o.deviceName(d.sensor), ...(reading ? [reading] : [])]
        : [t('motionLight.flow.daylight'), o.deviceName(d.sensor), t(d.is === 'night' ? 'motionLight.isNight' : 'motionLight.isDark')],
      tip: ml?.daylight ? [t('motionLight.flow.daylight'), o.deviceName(d.sensor), ml.daylight.detail].join('\n') : undefined,
    });
  }

  // The blocker is an input like the sensors: while blocked it says by whom, otherwise its state and what blocks.
  const bk = cfg.blocker;
  if (bk) {
    const name = o.deviceName(bk.device);
    const is = t(bk.is === 'on' ? 'motionLight.blockerIsOn' : 'motionLight.blockerIsOff');
    const blocked = ml?.blocked === true;
    const now = ml?.blocker ? ml.blocker.state ?? t('motionLight.flow.noData') : undefined;
    items.push({
      field: 'motionlight-blocker', cls: ml ? tone(!blocked) : '',
      lines: blocked ? [t('motionLight.flow.blocked').replace('{name}', name)]
        : [t('motionLight.blocker'), `${name} ${is}`, ...(now !== undefined ? [t('motionLight.flow.blockerNow').replace('{s}', now)] : [])],
    });
  }

  // The "no motion sensors" note is long: it gets a row of its own (the Daylight block below it).
  const perRow = cfg.sensors.length === 0 ? 1 : Math.min(PER_ROW, items.length);
  const bw = (MW - (perRow - 1) * GAP) / perRow;
  const rows = Math.ceil(items.length / perRow);
  const h = blockH(Math.max(...items.map(b => b.lines.length)));
  // One trunk runs down to Wants beside the blocks: through CX with one or two per row, in the first gap with three.
  const spine = perRow === 3 ? PAD + bw + GAP / 2 : CX;
  const blocks: Blk[] = items.map((b, i) => ({ ...b, x: PAD + (i % perRow) * (bw + GAP), y: PAD + Math.floor(i / perRow) * (h + VGAP), w: bw, h }));
  const links: string[] = [];
  for (let r = 0; r < rows; r++) {
    const row = blocks.slice(r * perRow, (r + 1) * perRow);
    const bus = row[0].y + h + VGAP / 2;
    for (const b of row) links.push(`M${b.x + bw / 2} ${b.y + h} V${bus}`);
    const xs = [spine, ...row.map(b => b.x + bw / 2)];
    if (Math.max(...xs) > Math.min(...xs)) links.push(`M${Math.min(...xs)} ${bus} H${Math.max(...xs)}`);
  }

  const wantsY = PAD + rows * (h + VGAP);
  let y = wantsY;
  links.push(`M${spine} ${PAD + h + VGAP / 2} V${wantsY}`);
  const add = (b: Item) => {
    const bh = blockH(b.lines.length + (b.err ? 1 : 0));
    blocks.push({ ...b, x: PAD, y, w: MW, h: bh });
    if (y > wantsY) links.push(`M${CX} ${y - VGAP} V${y}`);
    y += bh + VGAP;
  };

  const rule = t('motionLight.flow.rule').replace('{dark}', d ? t('motionLight.flow.ruleDark') : '').replace('{d}', countdown(o.rule.offDelay))
    + (cfg.minOn > 0 ? t('motionLight.flow.ruleMin').replace('{d}', countdown(cfg.minOn)) : '');
  const day = d ? t('motionLight.flow.ruleDay') : null;
  const manual = ml?.mode === 'manual';
  const quiet = manual || cfg.sensors.length === 0; // no verdict in manual, nor in an auto without motion sensors
  add({
    field: 'motionlight-wants', cls: ml && !quiet ? tone(tr!.verdict) : '',
    lines: [
      ml && !quiet ? `${t('motionLight.flow.wants')}: ${tr!.verdict === null ? word(null) : tr!.verdict ? 'on' : 'off'}` : t('motionLight.flow.wants'),
      rule,
      ...(day ? [day] : []),
      ...(ml?.offAt !== undefined && !quiet ? [t('motionLight.flow.offIn').replace('{t}', left(ml.offAt, o.now))] : []),
      ...(ml?.minUntil !== undefined && !quiet ? [t('motionLight.flow.minOn').replace('{t}', left(ml.minUntil, o.now))] : []),
      ...(ml?.waiting && !quiet ? [t('motionLight.flow.waiting')] : []),
    ],
  });

  add({
    field: 'motionlight-mode', cls: ml ? tone(!manual) : '',
    lines: ml
      ? [`${t('motionLight.flow.mode')}: ${t(manual ? 'motionLight.flow.manual' : cfg.buttons.length === 0 ? 'motionLight.flow.autoNoButton' : 'motionLight.flow.auto')}`,
        ...(manual ? [ml.autoAt !== undefined ? t('motionLight.flow.autoIn').replace('{t}', left(ml.autoAt, o.now)) : t('motionLight.flow.byButton')] : [])]
      : [t('motionLight.flow.mode'), t(cfg.buttons.length === 0 ? 'motionLight.flow.autoNoButton' : 'motionLight.flow.byButton')],
  });

  const last = tr?.last;
  const lightLines = [
    o.deviceName(cfg.light),
    ml ? t('timed.flow.state').replace('{s}', ml.light ?? word(null)) : t('outside.flow.onOff'),
    ...(last ? [motionLast(last)] : []),
  ];
  add({
    field: 'motionlight-light', cls: ml ? tone(ml.light === null ? null : ml.light === 'on') : '', lines: lightLines, err: last?.error,
    tip: last ? [...lightLines, ...(last.error ? [last.error] : []), last.reason].join('\n') : undefined,
  });

  const H = y - VGAP + PAD;
  const block = (b: Blk) => flowBlock({ ...b, focused: o.focused === b.field, onClick: () => o.onFocus(b.field) });
  const status = tr && tr.status !== 'ok' ? (tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`)) : null;

  return html`
    <div class="flow">
      <svg class="vt" style=${`max-width:${MOTION_LIGHT_WIDTH}px`} viewBox=${`0 0 ${MOTION_LIGHT_WIDTH} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${t('motionLight.flow.title')}>
        ${svg`<path class="fc-link" d=${links.join(' ')}></path>`}
        ${blocks.map(block)}
      </svg>
      ${status ? html`<p class="fc-warn" data-note="status">${status}</p>` : nothing}
      ${o.note ? html`<p class="fc-note">${o.note}</p>` : nothing}
    </div>`;
}
