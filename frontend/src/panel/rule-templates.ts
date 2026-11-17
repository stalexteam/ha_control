import { html, svg, type TemplateResult } from 'lit';
import { mdiCodeBraces, mdiRobotOutline, mdiTimerOutline, mdiTimerPlayOutline, mdiWaterAlert, mdiWaterBoiler, mdiWeatherNight, mdiFan, mdiHeatingCoil } from '@mdi/js';
import { t } from '../i18n';

export type RuleTemplate = 'condition' | 'leak' | 'timer' | 'outside' | 'vent' | 'boiler' | 'timed' | 'beurer';

const ICONS: Record<RuleTemplate, string> = {
  condition: mdiCodeBraces, leak: mdiWaterAlert, timer: mdiTimerOutline, outside: mdiWeatherNight, vent: mdiFan, boiler: mdiWaterBoiler,
  timed: mdiTimerPlayOutline, beurer: mdiHeatingCoil,
};

/** Condition templates: one rail button each. */
const CONDITION_TEMPLATES = ['condition', 'timer'] as const;
/** Purpose-built automations, each with its own dialog: listed in the rail's "Automations" menu, in this order. */
export const AUTOMATIONS: readonly RuleTemplate[] = ['vent', 'boiler', 'leak', 'timed', 'outside', 'beurer'];

const icon = (d: string): TemplateResult => html`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${svg`<path d=${d}></path>`}</svg>`;

/**
 * The Automation rail's template buttons: each condition template opens the rule dialog pre-filled by it; the last
 * button, "Automations", opens the menu of purpose-built automations (`onMenu` gets the button to anchor it to).
 */
export function ruleTemplateButtons(onPick: (tpl: RuleTemplate) => void, menuOpen: boolean, onMenu: (button: HTMLElement) => void): TemplateResult[] {
  return [
    ...CONDITION_TEMPLATES.map(tpl => html`
      <button class="tool" data-template=${tpl} title=${t(`rules.template.${tpl}`)} @click=${() => onPick(tpl)}>
        ${icon(ICONS[tpl])}<span class="tlabel">${t(`rules.template.${tpl}`)}</span></button>`),
    html`
      <button class="tool${menuOpen ? ' on' : ''}" data-action="automations" title=${t('rules.automations')} aria-haspopup="menu"
        aria-expanded=${menuOpen ? 'true' : 'false'} @click=${(e: Event) => onMenu(e.currentTarget as HTMLElement)}>
        ${icon(mdiRobotOutline)}<span class="tlabel">${t('rules.automations')}</span></button>`,
  ];
}

/** Moves the focus between the menu items with the arrow keys (wrapping), Home and End. */
function menuKey(e: KeyboardEvent): void {
  const menu = e.currentTarget as HTMLElement;
  const items = [...menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')];
  const at = items.indexOf((menu.getRootNode() as Document | ShadowRoot).activeElement as HTMLButtonElement);
  const next = e.key === 'ArrowDown' ? (at + 1) % items.length : e.key === 'ArrowUp' ? (at - 1 + items.length) % items.length
    : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : null;
  if (next === null) return;
  e.preventDefault();
  items[next]?.focus();
}

/**
 * The "Automations" popup beside its rail button (`at` = the button's right edge and top, viewport px): one item per
 * purpose-built automation. A click outside closes it; Escape is handled by the panel's key handler.
 */
export function renderAutomationsMenu(at: { x: number; y: number }, onPick: (tpl: RuleTemplate) => void, onClose: () => void): TemplateResult {
  return html`
    <div class="amenu-back" @pointerdown=${onClose}></div>
    <div class="amenu" role="menu" aria-label=${t('rules.automations')} style=${`left:${at.x}px;top:${at.y}px`} @keydown=${menuKey}>
      ${AUTOMATIONS.map(tpl => html`
        <button class="amenu-item" role="menuitem" data-automation=${tpl} @click=${() => onPick(tpl)}>
          ${icon(ICONS[tpl])}<span>${t(`rules.template.${tpl}`)}</span></button>`)}
    </div>`;
}
