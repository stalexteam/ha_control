import { svg, type TemplateResult } from 'lit';

/**
 * Shared look of the rule diagrams (the condition flowchart and the wet zone ventilation diagram): one viewBox
 * width, so in the same dialog column both draw their text at the same scale, and one block style.
 */
export const FLOW_WIDTH = 1046;
/** The diagrams never grow beyond this scale (on-screen text at most 1.25 x its font size). */
export const FLOW_MAX_SCALE = 1.25;
/** Margin around the diagram and the vertical gap between linked blocks (the link elbows at its middle). */
export const FLOW_PAD = 10, FLOW_VGAP = 34;

export const clip = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
/** Characters that fit a box of width w: 13 px medium first line, 12 px other lines (the clip box catches wide glyphs). */
export const chars1 = (w: number): number => Math.floor((w - 20) / 6.6);
export const chars2 = (w: number): number => Math.floor((w - 20) / 6);
/** Height of a block of n text lines (first baseline 20, then every 18). */
export const blockH = (n: number): number => 14 + 18 * n;

/**
 * A block: `lines` (the first bold), then `err` in the error colour; the text is clipped to the box, the tooltip
 * (`tip`, else the lines) has it all.
 */
export interface FlowBlock {
  x: number; y: number; w: number; h: number; field: string; cls: string; lines: string[]; err?: string; tip?: string;
  focused: boolean; onClick(): void;
}

/** A clickable block with its `data-block` field; one line of text is centred vertically. */
export function flowBlock(b: FlowBlock): TemplateResult {
  const all = b.err ? [...b.lines, b.err] : b.lines;
  const y = (k: number): number => (all.length === 1 ? b.h / 2 + 5 : 20 + 18 * k);
  return svg`
    <g class="fc-blk${b.cls}${b.focused ? ' hl' : ''}" data-block=${b.field} transform=${`translate(${b.x} ${b.y})`}
      @click=${b.onClick}>
      <title>${b.tip ?? all.join('\n')}</title>
      <rect class="fc-box" width=${b.w} height=${b.h} rx="8"></rect>
      <svg class="fc-clip" width=${b.w - 8} height=${b.h}>
        ${all.map((l, k) => svg`<text class=${k === 0 ? 'fc-t1' : k === b.lines.length ? 'fc-err' : 'fc-t2'} x="10" y=${y(k)}>${
          clip(l, k === 0 ? chars1(b.w) : chars2(b.w))}</text>`)}
      </svg>
    </g>`;
}
