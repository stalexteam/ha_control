import { html, svg, type TemplateResult } from 'lit';
import { mdiCodeBraces, mdiWaterAlert } from '@mdi/js';
import { t } from '../i18n';

export type RuleTemplate = 'condition' | 'leak';

const ICONS: Record<RuleTemplate, string> = { condition: mdiCodeBraces, leak: mdiWaterAlert };

/** The Automation rail's template buttons: each opens the rule dialog pre-filled by its template. */
export function ruleTemplateButtons(onPick: (tpl: RuleTemplate) => void): TemplateResult[] {
  return (['condition', 'leak'] as const).map(tpl => html`
    <button class="tool" data-template=${tpl} title=${t(`rules.template.${tpl}`)} @click=${() => onPick(tpl)}>
      <svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${svg`<path d=${ICONS[tpl]}></path>`}</svg>
      <span class="tlabel">${t(`rules.template.${tpl}`)}</span></button>`);
}
