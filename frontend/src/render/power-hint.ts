import type { ReadingStats } from '../api';
import { formatDuration } from '../live/device-live';
import { t } from '../i18n';

/** One meter of a block in the hover hint: its label, the value as the block shows it, and the server's statistics (once answered). */
export interface HintMeter { label: string; value: string; stats?: ReadingStats }

/** A duration: whole seconds with a unit under a minute, then `m:ss`, from an hour `h:mm:ss`. */
function span(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return s < 60 ? `${s} s` : formatDuration(s * 1000);
}

/** A period: rounded to whole seconds; under a second it reads `<1 s`. */
const periodText = (ms: number): string => (ms < 1000 ? '<1 s' : span(Math.round(ms / 1000) * 1000));

/**
 * One text line per meter: `Power  1442 W · every ~5 s · last 3 s ago · next in ~2 s`. Without a period only the last
 * report is told; an overdue next reads `next expected 4 s ago`; a meter the server saw no report of reads `no reports
 * yet`; without an answer (no `stats`) only the label and the value. Ages count from `now` (never negative).
 */
export function hintLines(meters: HintMeter[], now: number): string[] {
  return meters.map(({ label, value, stats }) => {
    const head = `${label}  ${value}`;
    if (!stats) return head;
    if (stats.count <= 0 || stats.last === null) return `${head} · ${t('power.hint.none')}`;
    const parts = [head];
    if (stats.period !== null) parts.push(t('power.hint.every').replace('{period}', periodText(stats.period)));
    parts.push(t('power.hint.last').replace('{age}', span(now - stats.last)));
    if (stats.period !== null) {
      const left = stats.last + stats.period - now;
      parts.push(left >= 0
        ? t('power.hint.next').replace('{left}', span(Math.ceil(left / 1000) * 1000))
        : t('power.hint.overdue').replace('{over}', span(-left)));
    }
    return parts.join(' · ');
  });
}

interface Box { x: number; y: number; w: number; h: number }

/** Gap between the block and the hint, and the least distance to the canvas edge, in screen pixels. */
const GAP = 8;
const MARGIN = 4;
/** A rough size of the hint's text, for placing it before it is measured. */
const CHAR_W = 6.8;
const LINE_H = 17;
const PAD_X = 22;
const PAD_Y = 12;

/** The hint's estimated size in screen pixels. */
export function hintSize(lines: string[]): { w: number; h: number } {
  return { w: Math.ceil(Math.max(0, ...lines.map(l => l.length)) * CHAR_W + PAD_X), h: lines.length * LINE_H + PAD_Y };
}

/**
 * Where the hint goes, in screen pixels of the canvas: below the block, centred on it, above when there is no room
 * below, else to the right or to the left of it; shifted to stay inside the canvas. It does not cover the block
 * unless no side has room.
 */
export function placeHint(block: Box, size: { w: number; h: number }, canvas: { w: number; h: number }): { left: number; top: number } {
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, Math.max(lo, hi)));
  const cx = clamp(block.x + block.w / 2 - size.w / 2, MARGIN, canvas.w - size.w - MARGIN);
  const cy = clamp(block.y + block.h / 2 - size.h / 2, MARGIN, canvas.h - size.h - MARGIN);
  const below = block.y + block.h + GAP;
  if (below + size.h <= canvas.h - MARGIN) return { left: cx, top: below };
  const above = block.y - GAP - size.h;
  if (above >= MARGIN) return { left: cx, top: above };
  const right = block.x + block.w + GAP;
  if (right + size.w <= canvas.w - MARGIN) return { left: right, top: cy };
  const left = block.x - GAP - size.w;
  if (left >= MARGIN) return { left, top: cy };
  return { left: cx, top: clamp(below, MARGIN, canvas.h - size.h - MARGIN) };
}
