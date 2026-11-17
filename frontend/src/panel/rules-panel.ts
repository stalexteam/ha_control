import { html, nothing, type TemplateResult } from 'lit';
import type { Id, Level, Rule } from '../model/types';
import type { Selection } from '../editor/tools/types';
import { keptOn, switchedElsewhere, type RuleLast, type RuleTrace } from '../live/rules-feed';
import { ruleEqual, rulesFor } from '../model/rules';
import { t } from '../i18n';

export interface RulesPanelOpts {
  level: Level;
  rules: Rule[];
  /** The saved copy of a rule; undefined for a rule not saved yet. */
  saved(ruleId: Id): Rule | undefined;
  selection: Selection | null;
  /** Live trace of a saved rule; undefined for a rule the server does not know. */
  trace(ruleId: Id): RuleTrace | undefined;
  /** The first live message has arrived. */
  live: boolean;
  /** Why there is no live state (null when there is). */
  feedError: string | null;
  onEdit(ruleId: Id): void;
  onDelete(ruleId: Id): void;
}

/** 21:43 from epoch ms, in the viewer's locale. */
export function clock(at: number): string {
  try { return new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch { return ''; }
}

/**
 * "closed Water valve 21:43", with the failure after it when the call failed. An entry the rule did not send (a timed
 * switch's `sent: false`) is never worded as a command: "Vent switched off elsewhere 21:46" / "Vent already on 21:50" /
 * "Vent kept on by WC vent 21:52".
 */
export function lastText(l: RuleLast): string {
  if (keptOn(l)) return t('rules.last.kept').replace('{target}', l.target).replace('{reason}', l.reason).replace('{at}', clock(l.at)).trim();
  if (l.sent === false) {
    return t(switchedElsewhere(l) ? 'rules.last.elsewhere' : 'rules.last.already')
      .replace('{target}', l.target).replace('{s}', l.action).replace('{at}', clock(l.at)).trim();
  }
  const base = `${t(`rules.did.${l.action}`)} ${l.target} ${clock(l.at)}`.trim();
  return l.error ? `${base}: ${l.error}` : base;
}

/** The last line of a purpose-built diagram's device block: "last: turned on 21:43" or "last: kept on by WC vent 21:52". */
export function lastFlowLine(l: RuleLast): string {
  if (keptOn(l)) return t('vent.flow.kept').replace('{reason}', l.reason).replace('{at}', clock(l.at));
  return t('vent.flow.last').replace('{did}', t(`rules.did.${l.action}`)).replace('{at}', clock(l.at));
}

/** The status words of a row: "OK", "Waiting for data", "Error: device missing", "Disabled", or why there is no trace. */
function statusText(r: Rule, tr: RuleTrace | undefined, o: RulesPanelOpts): string {
  if (!tr) return r.enabled === false ? t('rules.status.disabled') : o.live ? t('rules.unsaved') : t('rules.noTrace');
  return tr.status === 'error' && tr.reason ? `${t('rules.status.error')}: ${tr.reason}` : t(`rules.status.${tr.status}`);
}

function row(r: Rule, orphan: boolean, o: RulesPanelOpts): TemplateResult {
  const tr = o.trace(r.id);
  const verdict = tr?.verdict === true ? 'true' : tr?.verdict === false ? 'false' : 'unknown';
  const unknown = tr?.unknownInputs ?? 0;
  const saved = o.saved(r.id);
  const changed = !!saved && !ruleEqual(saved, r);
  return html`
    <div class="rrow" data-id=${r.id}>
      <span class="vdot" data-verdict=${verdict} role="img" aria-label=${t(`rules.verdict.${verdict}`)}
        title=${t(`rules.verdict.${verdict}`)}></span>
      <div class="rbody">
        <span class="rname">${r.name}${orphan ? html` <span class="orphan">(${t('rules.orphan')})</span>` : nothing}</span>
        <span class="rstatus ${tr?.status ?? ''}">${statusText(r, tr, o)}</span>
        ${changed ? html`<span class="runsaved">${t('rules.unsavedChanges')}</span>` : nothing}
        ${unknown > 0 ? html`<span class="rwarn">${unknown === 1 ? t('rules.unknown1') : t('rules.unknownN').replace('{n}', String(unknown))}</span>` : nothing}
        ${tr?.last ? html`<span class="rlast">${lastText(tr.last)}</span>` : nothing}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => o.onEdit(r.id)}>${t('rules.edit')}</button>
        <button class="btn" data-action="rule-delete" @click=${() => o.onDelete(r.id)}>${t('rules.delete')}</button>
      </div>
    </div>`;
}

/**
 * The Automation step's side panel: the rules of the selected zone, or without a zone selected the rules with no
 * zone or whose zone no longer exists (marked "zone removed"). Each row has Edit and Delete.
 */
export function renderRulesPanel(o: RulesPanelOpts): TemplateResult {
  const s = o.selection;
  const zone = s?.kind === 'zone' ? o.level.zones.find(z => z.id === s.id) ?? null : null;
  const list = rulesFor(o.rules, zone?.id ?? null, id => o.level.zones.some(z => z.id === id));
  return html`
    <div class="rules">
      <h4 class="rules-title">${zone ? zone.name : t('rules.noZone')}</h4>
      ${o.feedError ? html`<p class="muted">${o.feedError}</p>` : nothing}
      ${zone === null && list.length === 0 && o.rules.length === 0 ? html`<p class="muted">${t('rules.hint')}</p>` : nothing}
      ${list.length === 0 ? html`<p class="muted rempty">${t('rules.empty')}</p>`
        : list.map(r => row(r, zone === null && r.zoneId !== null, o))}
    </div>`;
}
