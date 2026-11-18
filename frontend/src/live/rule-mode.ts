import type { Id, Rule } from '../model/types';
import type { LiveBubble } from './device-live';
import type { RuleTrace } from './rules-feed';
import { t } from '../i18n';

/**
 * The mode bubbles of one device: one per saved, enabled rule with a mode that controls the device and whose live
 * trace says auto, in rule order. `auto: on` = the rule holds the device (Light motion control: verdict true; boiler:
 * heating), else `auto: off`. A rule in manual, a Light motion control rule in auto without motion sensors (inert) and
 * a rule without a trace give none. No `key`; `id` = the rule: an unchanged bubble stays the same element across feed frames.
 */
export function ruleModeBubbles(rules: Rule[], traceOf: (ruleId: Id) => RuleTrace | undefined, deviceId: Id): LiveBubble[] {
  const out: LiveBubble[] = [];
  for (const r of rules) {
    if (r.enabled === false) continue;
    const tr = traceOf(r.id);
    if (!tr) continue;
    let on: boolean | null = null;
    if (r.motionLight?.light === deviceId) {
      if (tr.motionLight?.mode === 'auto' && r.motionLight.sensors.length > 0) on = tr.verdict === true;
    } else if (r.boiler?.device === deviceId) {
      if (tr.boiler?.mode === 'auto') on = tr.boiler.phase === 'heating';
    }
    if (on !== null) out.push({ text: t(on ? 'live.mode.autoOn' : 'live.mode.autoOff'), tone: 'mode', id: `mode:${r.id}` });
  }
  return out;
}
