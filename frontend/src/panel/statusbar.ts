import { html, nothing, type TemplateResult } from 'lit';
import { t } from '../i18n';
import type { ZoneMethod } from '../editor/tools/types';
import type { ToolId } from './tool-factory';
import { toolIcon } from './tool-icons';

export interface StatusOpts {
  grid: boolean;
  /** Snap kind under the cursor, if any. */
  snap: string | null;
  zoomPct: number;
  onGrid(on: boolean): void;
  /** Cones and zones of devices are drawn. */
  cones: boolean;
  onCones(on: boolean): void;
  /** The active tool: named in the chip, with its key hints next to it. */
  tool: ToolId;
  /** The Zone tool's method, shown in the chip ("Zone · Polygon"). */
  zoneMethod: ZoneMethod;
  /** Power step: the grid is the schematic's (not in mm) and there are no cones to toggle. */
  power?: boolean;
}

type Hint = [key: string, text: string];

/** The key hints of a tool, in the order the status bar shows them. */
export function toolHints(tool: ToolId, zoneMethod: ZoneMethod): Hint[] {
  switch (tool) {
    case 'wall':
      return [['Shift', t('hint.shift')], [t('hint.digits'), t('hint.length')], ['Tab', t('hint.tab')], ['Esc', t('hint.esc')]];
    case 'box':
      return [[t('hint.digits'), t('hint.size')], ['Tab', t('hint.tabSize')], ['Esc', t('hint.esc')]];
    case 'zone':
      return zoneMethod === 'polygon'
        ? [['Enter', t('hint.close')], ['Backspace', t('hint.removeVertex')], ['Shift', t('hint.shift')],
          ['Alt', t('hint.freeVertex')], ['Esc', t('hint.cancel')]]
        : [['Esc', t('hint.esc')]];
    case 'select': case 'device-select': case 'power-select':
      return [['Del', t('hint.delete')], ['Esc', t('hint.deselect')]];
    case 'binding-select':
      return [['Esc', t('hint.deselect')]];
    default: // the placement tools: Esc goes back to the step's Select tool
      return [['Esc', t('hint.esc')]];
  }
}

/** The tool chip: the active tool's icon and name; the Zone tool adds its method ("Zone · Polygon"). */
function toolChip(tool: ToolId, zoneMethod: ZoneMethod): TemplateResult {
  const name = tool === 'zone' ? `${t('tool.zone')} · ${t(`zones.kind.${zoneMethod}`)}` : t(`tool.${tool}`);
  return html`<span class="tool-chip">${toolIcon(tool)}${name}</span>`;
}

export function renderStatusBar(o: StatusOpts): TemplateResult {
  return html`
    <div class="status">
      ${toolChip(o.tool, o.zoneMethod)}
      ${toolHints(o.tool, o.zoneMethod).map(([k, text]) => html`<span><span class="kbd">${k}</span> ${text}</span>`)}
      <span class="sp"></span>
      ${o.snap ? html`<span class="snap-kind">${o.snap}</span>` : ''}
      <span>${o.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${o.grid} @change=${(e: Event) => o.onGrid((e.target as HTMLInputElement).checked)} />
        ${t(o.power ? 'status.gridSchematic' : 'status.grid')}
      </label>
      ${o.power ? nothing : html`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${o.cones}
          @change=${(e: Event) => o.onCones((e.target as HTMLInputElement).checked)} />
        ${t('status.cones')}
      </label>`}
    </div>`;
}
