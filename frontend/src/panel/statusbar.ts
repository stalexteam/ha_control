import { html, type TemplateResult } from 'lit';
import { t } from '../i18n';

export interface StatusOpts {
  lang: string;
  grid: boolean;
  /** Snap kind under the cursor, if any. */
  snap: string | null;
  zoomPct: number;
  onGrid(on: boolean): void;
  /** Cones and zones of devices are drawn. */
  cones: boolean;
  onCones(on: boolean): void;
}

export function renderStatusBar(o: StatusOpts): TemplateResult {
  const lang = o.lang;
  return html`
    <div class="status">
      <span><span class="kbd">Shift</span> ${t('hint.shift', lang)}</span>
      <span><span class="kbd">${t('hint.digits', lang)}</span> ${t('hint.length', lang)}</span>
      <span><span class="kbd">Tab</span> ${t('hint.tab', lang)}</span>
      <span><span class="kbd">Esc</span> ${t('hint.esc', lang)}</span>
      <span class="sp"></span>
      ${o.snap ? html`<span class="snap-kind">${o.snap}</span>` : ''}
      <span>${o.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${o.grid} @change=${(e: Event) => o.onGrid((e.target as HTMLInputElement).checked)} />
        ${t('status.grid', lang)}
      </label>
      <label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${o.cones}
          @change=${(e: Event) => o.onCones((e.target as HTMLInputElement).checked)} />
        ${t('status.cones', lang)}
      </label>
    </div>`;
}
