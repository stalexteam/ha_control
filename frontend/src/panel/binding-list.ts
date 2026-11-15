import { html, type TemplateResult } from 'lit';
import type { Device, Id, Level } from '../model/types';
import { roleCount, type BindStatus } from '../model/bindings';
import type { Selection } from '../editor/tools/types';
import { cached } from '../render/shared';
import { t } from '../i18n';
import { fieldValue } from './field-value';

/** Which devices the list shows; partly bound and missing count as "Not bound". */
export type ListFilter = 'unbound' | 'bound' | 'all';
export const LIST_FILTERS: readonly ListFilter[] = ['unbound', 'bound', 'all'];

export interface BindingListOpts {
  level: Level;
  selection: Selection | null;
  status: (d: Device) => BindStatus;
  filter: ListFilter;
  /** Text filter on the device name and kind. */
  query: string;
  onFilter(f: ListFilter): void;
  onQuery(q: string): void;
  onPick(id: Id): void;
  /** The rail is folded to a narrow strip that holds only the expand toggle. */
  collapsed: boolean;
  onCollapse(collapsed: boolean): void;
}

const orderCache = new WeakMap<Level, Device[]>();

/** Devices in list order: by name, then id. */
export function listOrder(level: Level): Device[] {
  return cached(orderCache, level, l => [...l.devices].sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id)));
}

/** The next device after `currentId` in list order whose status is not bound, wrapping around; null when all are bound. */
export function nextUnbound(level: Level, currentId: Id | null, status: (d: Device) => BindStatus): Id | null {
  const list = listOrder(level);
  const at = currentId === null ? -1 : list.findIndex(d => d.id === currentId);
  for (let k = 1; k <= list.length; k++) {
    const d = list[(at + k) % list.length];
    if (status(d) !== 'bound') return d.id;
  }
  return null;
}

const kindLabel = (d: Device): string => t(`device.${d.props.kind}`);
const shown = (f: ListFilter, st: BindStatus): boolean => f === 'all' || (f === 'bound') === (st === 'bound');

function emptyText(o: BindingListOpts, total: number, q: string): string {
  if (total === 0) return t('binding.noDevices');
  if (q || o.filter === 'all') return t('binding.noMatch');
  return t(o.filter === 'unbound' ? 'binding.allBound' : 'binding.noneBound');
}

function railToggle(o: BindingListOpts): TemplateResult {
  const label = t(o.collapsed ? 'binding.expand' : 'binding.collapse');
  return html`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!o.collapsed)} aria-label=${label}
    title=${label} @click=${() => o.onCollapse(!o.collapsed)}>${o.collapsed ? '›' : '‹'}</button>`;
}

/**
 * The Binding step rail: a Not bound / Bound / All switch with counts, a text filter and one row per device.
 * Collapsed, it is a narrow strip with the expand toggle only.
 */
export function renderBindingList(o: BindingListOpts): TemplateResult {
  if (o.collapsed) return html`<div class="blist collapsed">${railToggle(o)}</div>`;
  const items = listOrder(o.level).map(d => ({ d, st: o.status(d) }));
  const counts: Record<ListFilter, number> = {
    unbound: items.filter(x => x.st !== 'bound').length, bound: items.filter(x => x.st === 'bound').length, all: items.length,
  };
  const q = o.query.trim().toLowerCase();
  const rows = items.filter(({ d, st }) => shown(o.filter, st)
    && (!q || d.name.toLowerCase().includes(q) || kindLabel(d).toLowerCase().includes(q)));
  const sel = o.selection?.kind === 'device' ? o.selection.id : null;
  return html`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${t('binding.show')}>
          ${LIST_FILTERS.map(f => html`<button role="radio" aria-checked=${String(f === o.filter)} data-filter=${f}
            @click=${() => o.onFilter(f)}>${t(`binding.filter.${f}`)} <span class="count">${counts[f]}</span></button>`)}
        </div>
        ${railToggle(o)}
      </div>
      <input class="list-search" type="search" placeholder=${t('binding.search')} aria-label=${t('binding.search')}
        .value=${fieldValue(o.query)} @input=${(e: Event) => o.onQuery((e.target as HTMLInputElement).value)} />
      <div class="rows">
        ${rows.length === 0 ? html`<p class="empty">${emptyText(o, items.length, q)}</p>` : rows.map(({ d, st }) => {
          const c = roleCount(d);
          return html`<button class="brow${d.id === sel ? ' sel' : ''}" data-id=${d.id} @click=${() => o.onPick(d.id)}>
            <span class="dot ${st}" role="img" aria-label=${t(`bindstatus.${st}`)} title=${t(`bindstatus.${st}`)}></span>
            <span class="nm"><span class="name">${d.name}</span><small class="kind">${kindLabel(d)}</small></span>
            <span class="cnt">${c.filled}/${c.total}</span>
          </button>`;
        })}
      </div>
    </div>`;
}
