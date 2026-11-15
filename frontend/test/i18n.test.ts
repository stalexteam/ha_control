import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { I18N_KEYS, t } from '../src/i18n';
import { DEVICE_PLACEMENTS, WALL_PRESETS, OPENING_DEFAULT_WIDTH } from '../src/model/types';
import { LIGHT_SHAPES, EQUIPMENT_SHAPES } from '../src/panel/device-props';
import { LIST_FILTERS } from '../src/panel/binding-list';
import { ROLE_SPECS } from '../src/model/bindings';
import { EQUIPMENT_TOOL_IDS, PLAN_TOOL_IDS, POWER_TOOL_IDS, ZONES_TOOL_IDS } from '../src/panel/tool-factory';

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap(n => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? sources(p) : p.endsWith('.ts') && n !== 'i18n.ts' ? [p] : [];
  });
}

const keys = new Set(I18N_KEYS);
const namespaces = new Set(I18N_KEYS.map(k => k.split('.')[0]));
const files = sources(join(__dirname, '../src')).map(p => ({ p, text: readFileSync(p, 'utf8') }));

/** Every string literal passed directly to t(...), whatever its namespace. */
export function tCalls(text: string): string[] {
  return [...text.matchAll(/\bt\(\s*['"`]([^'"`$]+)['"`]/g)].map(m => m[1]);
}

/** Literal keys: 'ns.key' strings of a dictionary namespace; dynamic: `ns.${…}` template prefixes. */
function used(): { literal: Map<string, string>; prefix: Map<string, string> } {
  const literal = new Map<string, string>();
  const prefix = new Map<string, string>();
  for (const { p, text } of files) {
    for (const m of text.matchAll(/(['"])([A-Za-z][\w-]*(?:\.[\w-]+)+)\1/g)) {
      if (namespaces.has(m[2].split('.')[0])) literal.set(m[2], p);
    }
    for (const m of text.matchAll(/`([A-Za-z][\w.]*\.)\$\{/g)) {
      if (namespaces.has(m[1].split('.')[0])) prefix.set(m[1], p);
    }
  }
  return { literal, prefix };
}

describe('i18n', () => {
  it('finds the keys the code uses', () => {
    const { literal, prefix } = used();
    expect(literal.size).toBeGreaterThan(50);
    expect(prefix.size).toBeGreaterThan(5);
  });

  it('every literal key used in src is in the dictionary (t() returns the key on a typo)', () => {
    const missing = [...used().literal].filter(([k]) => !keys.has(k)).map(([k, p]) => `${k} (${p})`);
    expect(missing).toEqual([]);
  });

  it('every dynamic key prefix used in src has dictionary entries', () => {
    const missing = [...used().prefix].filter(([pre]) => !I18N_KEYS.some(k => k.startsWith(pre))).map(([pre, p]) => `${pre} (${p})`);
    expect(missing).toEqual([]);
  });

  it('every string literal passed to t() is in the dictionary (catches a typo in the namespace too)', () => {
    const missing = files.flatMap(({ p, text }) => tCalls(text).filter(k => !keys.has(k)).map(k => `${k} (${p})`));
    expect(missing).toEqual([]);
  });

  it('tCalls reports a typo key in a source string', () => {
    const bad = tCalls("x(t('prps.badAim'), t(`snap.${k}`), t('props.badAim'))").filter(k => !keys.has(k));
    expect(bad).toEqual(['prps.badAim']);
  });

  it('the output keys are the Binding output line texts only (the v0.4 output keys are gone)', () => {
    expect(I18N_KEYS.filter(k => k.startsWith('output.')).sort()).toEqual([
      'output.errorNotConfigured', 'output.errorUnavailable', 'output.last', 'output.noLive', 'output.none', 'output.notSaved',
    ]);
  });

  it('dynamic key prefixes have an entry for every member of their source-of-truth set', () => {
    const sets: Record<string, readonly string[]> = {
      device: Object.keys(DEVICE_PLACEMENTS),
      walltype: Object.keys(WALL_PRESETS),
      kind: Object.keys(OPENING_DEFAULT_WIDTH),
      shape: [...LIGHT_SHAPES, ...EQUIPMENT_SHAPES],
      side: ['left', 'right'],
      hinge: ['start', 'end'],
      baseline: ['center', 'left', 'right'],
      mode: ['plan', 'equipment', 'binding', 'zones', 'power', 'automation'],
      // The tools with a rail button (the Binding step's only tool has none).
      tool: [...PLAN_TOOL_IDS, ...EQUIPMENT_TOOL_IDS, ...ZONES_TOOL_IDS, ...POWER_TOOL_IDS],
      'power.err': ['missing', 'same-block', 'direction', 'port-taken', 'dc-mismatch', 'second-remainder', 'loop'],
      'power.help': ['select', 'place', 'device'],
      'zones.kind': ['room', 'polygon'],
      'zones.invalid': ['room', 'lost', 'wall', 'self'],
      'binding.filter': LIST_FILTERS,
      bindstatus: ['bound', 'partial', 'unbound', 'missing'],
      role: [...new Set(Object.values(ROLE_SPECS).flat().map(s => s.role))],
    };
    const missing = Object.entries(sets).flatMap(([pre, members]) => members.map(m => `${pre}.${m}`)).filter(k => !keys.has(k));
    expect(missing).toEqual([]);
  });

  it('the Zones step copy is exact', () => {
    const copy: Record<string, string> = {
      'mode.zones': 'Zones',
      'tool.zone': 'Room',
      'tool.zones-select': 'Select',
      'tool.zone-room': 'Zone from room',
      'tool.zone-draw': 'Custom zone',
      'steps.zone': '{n} zone',
      'steps.zones': '{n} zones',
      'zones.default': 'Zone',
      'zones.kind.room': 'Room',
      'zones.kind.polygon': 'Custom',
      'zones.room': 'Room',
      'zones.members': 'Members',
      'zones.participates': 'Participates',
      'zones.noMembers': 'No devices inside.',
      'zones.delete': 'Delete zone',
      'zones.filter': 'Filter zones',
      'zones.hint': 'Pick a zone on the plan or in the list, or add one with Zone from room or Custom zone.',
      'zones.invalid.room': 'The room is broken: fix its walls.',
      'zones.invalid.lost': 'A vertex lost its wall or corner: drag it to place it again.',
      'zones.invalid.wall': 'A vertex lies beyond the end of its wall.',
      'zones.invalid.self': 'The outline crosses itself: move a vertex.',
      'props.zoneList': 'Zones',
      'props.noZones': 'Not in any zone.',
    };
    expect(Object.fromEntries(Object.keys(copy).map(k => [k, t(k)]))).toEqual(copy);
  });
});
