import { html, nothing, type TemplateResult } from 'lit';
import type { Device, Level } from '../model/types';
import { countNotBound, type BindStatus } from '../model/bindings';
import { stepDone, type PowerSchema } from '../model/power';
import { t } from '../i18n';
import { fieldValue } from './field-value';
import type { EditorMode } from './tool-factory';

/** Wizard steps in order. */
const MODES: readonly EditorMode[] = ['plan', 'equipment', 'binding', 'power', 'automation'];

export interface StepsOpts {
  mode: EditorMode;
  level: Level;
  status: (d: Device) => BindStatus;
  /** The power schematic (a default one while the plan has none). */
  power: PowerSchema;
  /** How many rules the plan has (Automation step cell). */
  rules: number;
  /** The title cell holds the plan name (editable) above "Plan Studio". */
  planName: string;
  onRename(name: string): void;
  onMode(m: EditorMode): void;
}

/** "{n} thing" or "{n} things" from the singular and plural keys. */
export const countText = (n: number, one: string, other: string): string => t(n === 1 ? one : other).replace('{n}', String(n));

/** Live status line of a step and whether the step is finished. */
export function stepState(mode: EditorMode, level: Level, status: (d: Device) => BindStatus, power: PowerSchema, rules = 0):
{ text: string; done: boolean } {
  const { walls, zones, devices } = level;
  switch (mode) {
    case 'plan': {
      const invalid = zones.filter(z => z.invalid).length;
      const bad = invalid ? `, ${t('steps.invalid').replace('{n}', String(invalid))}` : '';
      return { text: `${countText(walls.length, 'steps.wall', 'steps.walls')}, ${countText(zones.length, 'steps.zone', 'steps.zones')}${bad}`,
        done: walls.length > 0 && zones.length > 0 };
    }
    case 'equipment':
      return { text: countText(devices.length, 'steps.device', 'steps.devices'), done: devices.length > 0 };
    case 'binding': {
      const bound = devices.length - countNotBound(devices.map(status));
      return { text: t('steps.bound').replace('{b}', String(bound)).replace('{n}', String(devices.length)),
        done: devices.length > 0 && bound === devices.length };
    }
    case 'power':
      return { text: countText(power.blocks.length, 'steps.block', 'steps.blocks'), done: stepDone(power) };
    case 'automation':
      return { text: countText(rules, 'steps.rule', 'steps.rules'), done: rules > 0 };
  }
}

const target = (key: string, m: EditorMode): string => t(key).replace('{step}', t(`mode.${m}`));

/**
 * Wizard header styled as a drawing title block: the title cell, one cell per step (number, name, live status;
 * any available step can be clicked) and Back / Next buttons that name their target. The last step has no Next.
 */
export function renderSteps(o: StepsOpts): TemplateResult {
  const i = MODES.indexOf(o.mode);
  const back = MODES[i - 1];
  const next = MODES[i + 1];
  return html`
    <nav class="steps" aria-label=${t('steps.label')}>
      <div class="title">
        <input class="plan-name" .value=${fieldValue(o.planName)} aria-label=${t('plan.name')} title=${t('plan.name')}
          @change=${(e: Event) => o.onRename((e.target as HTMLInputElement).value)} />
        <span class="app">${t('steps.app')}</span>
      </div>
      ${MODES.map((m, n) => {
        const s = stepState(m, o.level, o.status, o.power, o.rules);
        const current = m === o.mode;
        return html`<button class="step${current ? ' current' : ''}${s.done ? ' done' : ''}" data-mode=${m}
          aria-current=${current ? 'step' : nothing} @click=${() => o.onMode(m)}>
          <span class="n">${n + 1}</span><span class="name">${t(`mode.${m}`)}</span><span class="state">${s.text}</span>
        </button>`;
      })}
      <div class="nav">
        ${back ? html`<button class="btn" data-nav="back" @click=${() => o.onMode(back)}>${target('steps.back', back)}</button>` : nothing}
        ${next ? html`<button class="btn primary" data-nav="next" @click=${() => o.onMode(next)}>${target('steps.next', next)}</button>`
          : nothing}
      </div>
    </nav>`;
}
