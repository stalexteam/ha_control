// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $, choose as chooseEntity, click, combo, device, mount, pick, press, registryHass } from './helpers';
import { createMockHass, STORAGE_KEY } from '../../dev/mock-hass';
import { SCENES } from '../../dev/scenes';
import type { HassLike } from '../../src/api';
import { deviceDefaults, type Device, type Plan, type Rule } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { rectRoomLevel } from '../fixtures';

const st = (state: string, attributes: Record<string, string> = {}) => ({ state, attributes });
const STATES: Record<string, unknown> = {
  'media_player.vlc': st('idle', { friendly_name: 'VLC' }),
  'media_player.hall': st('playing', { friendly_name: 'Hall player' }),
  'tts.piper': st('unknown', { friendly_name: 'Piper' }),
  'light.desk': st('off', { friendly_name: 'Desk lamp' }),
};
const REGISTRY: Record<string, unknown> = {
  'config/entity_registry/list': [{ entity_id: 'media_player.vlc' }, { entity_id: 'media_player.hall' }, { entity_id: 'tts.piper' }, { entity_id: 'light.desk' }],
  'config/device_registry/list': [], 'config/area_registry/list': [],
};
const withServices = (hass: HassLike, notify: string[] = ['mobile_app_phone', 'notify', 'persistent_notification']): HassLike =>
  ({ ...hass, services: { notify: Object.fromEntries(notify.map(n => [n, {}])), light: { turn_on: {} } } });

function seed(devices: Device[], rules?: Rule[]): void {
  const level = { ...rectRoomLevel(4000, 3000, 200), devices, switchesMigrated: true as const };
  const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level], ...(rules ? { rules } : {}) } as Plan;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
}
const spk = (over: Partial<Device> = {}): Device => ({
  id: 'sp', name: 'Speaker', invalid: false, placement: { mode: 'free', x: 1500, y: 1500, rotation: 0 }, props: deviceDefaults('speaker', 'free'), ...over,
});
const phn = (over: Partial<Device> = {}): Device => ({ id: 'ph', name: 'Phone', invalid: false, placement: { mode: 'none' }, props: { kind: 'phone' }, ...over });

describe('speaker and phone in the panel', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the Equipment rail has a Speaker tool that places a speaker with no bindings', async () => {
    seed([]);
    const el = await mount();
    await press(el, '.top button[data-mode="equipment"]');
    expect($(el, 'button[data-tool="speaker"]').textContent!.trim()).toBe('Speaker');
    expect(el.shadowRoot!.querySelector('button[data-tool="phone"]')).toBeNull();
    await press(el, 'button[data-tool="speaker"]');
    click(el, 2000, 1500);
    await el.updateComplete;
    const d = el.level!.devices[0];
    expect(d).toMatchObject({ name: 'Speaker 1', props: { kind: 'speaker' }, placement: { mode: 'free' } });
    expect(d.bindings).toBeUndefined();
  });

  it('"New speaker" and "New phone" add devices that are not on the plan', async () => {
    seed([]);
    const el = await mount();
    await press(el, '.top button[data-mode="equipment"]');
    await press(el, '[data-action="new-phone"]');
    expect(el.level!.devices[0]).toMatchObject({ name: 'Phone 1', placement: { mode: 'none' }, props: { kind: 'phone' } });
    expect($(el, '.props h4').textContent!.trim()).toBe('Phone');
    el.selection = null;
    await el.updateComplete;
    await press(el, '[data-action="new-speaker"]');
    expect(el.level!.devices[1]).toMatchObject({ name: 'Speaker 1', placement: { mode: 'none' }, props: { kind: 'speaker' } });
  });

  it('Binding: a speaker has a Player (media players) and a Voice (tts) field, and its status needs the player', async () => {
    seed([spk()]);
    const { hass } = registryHass(STATES, REGISTRY);
    const el = await mount(hass);
    el.setMode('binding');
    await el.updateComplete;
    await pick(el, 'sp');
    expect([...el.shadowRoot!.querySelectorAll('.props .role')].map(r => r.getAttribute('data-role'))).toEqual(['player', 'voice']);
    expect($(el, '.props [data-role="player"] .role-label').textContent).toBe('Player');
    expect($(el, '.props [data-role="voice"] .role-label').textContent).toBe('Voice');
    await vi.waitFor(() => expect(combo(el, 'player').items.map(i => i.entityId)).toEqual(['media_player.hall', 'media_player.vlc']));
    expect(combo(el, 'voice').items.map(i => i.entityId)).toEqual(['tts.piper']);
    await chooseEntity(el, 'player', 'media_player.vlc');
    expect(device(el, 'sp').bindings).toEqual({ player: 'media_player.vlc' });
    expect(el.bindStatus(device(el, 'sp'))).toBe('bound');
    await chooseEntity(el, 'voice', 'tts.piper');
    expect(device(el, 'sp').bindings).toEqual({ player: 'media_player.vlc', voice: 'tts.piper' });
  });

  it('Binding: a phone picks a notify service from the ones Home Assistant offers, never typed', async () => {
    seed([phn()]);
    const { hass } = registryHass(STATES, REGISTRY);
    const el = await mount(withServices(hass));
    el.setMode('binding');
    await el.updateComplete;
    await pick(el, 'ph');
    expect(el.shadowRoot!.querySelector('.props ps-entity-combo')).toBeNull();
    const sel = $<HTMLSelectElement>(el, '.props select[data-field="notify"]');
    expect([...sel.options].map(o => o.value)).toEqual(['', 'mobile_app_phone', 'notify', 'persistent_notification']);
    expect($(el, '.props [data-field="notify-label"]').textContent).toBe('Notify service');
    expect(el.bindStatus(device(el, 'ph'))).toBe('unbound');
    sel.value = 'mobile_app_phone';
    sel.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(device(el, 'ph').props).toEqual({ kind: 'phone', notify: 'mobile_app_phone' });
    expect(device(el, 'ph').bindings).toBeUndefined();
    expect(el.bindStatus(device(el, 'ph'))).toBe('bound');
    // clearing removes the prop
    sel.value = '';
    sel.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(device(el, 'ph').props).toEqual({ kind: 'phone' });
  });

  it('Binding: a stored service HA no longer offers stays visible and flagged; without any service a note says so', async () => {
    seed([phn({ props: { kind: 'phone', notify: 'gone_app' } })]);
    const { hass } = registryHass(STATES, REGISTRY);
    const el = await mount(withServices(hass, []));
    el.setMode('binding');
    await el.updateComplete;
    await pick(el, 'ph');
    expect([...$<HTMLSelectElement>(el, '.props select[data-field="notify"]').options].map(o => o.value)).toEqual(['', 'gone_app']);
    expect($(el, '.props [data-note="notify-missing"]').textContent).toContain('no longer');
  });
});

/** The announce scene: speaker with a voice, speaker without, a phone, a motion light rule and a boiler rule, "Auto sound". */
async function openScene(): Promise<PlanStudioPanel> {
  const plan: Plan = structuredClone(SCENES.announce.plans[0]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
  const el = await mount(createMockHass({ rulesFrame: SCENES.announce.rulesFrame }));
  el.setMode('automation');
  await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
  await el.updateComplete;
  return el;
}
const q = <T extends Element>(el: PlanStudioPanel, sel: string): T => $<T>(el, `.rule-backdrop ${sel}`);
const all = (el: PlanStudioPanel, sel: string) => [...el.shadowRoot!.querySelectorAll(`.rule-backdrop ${sel}`)];
const options = (el: PlanStudioPanel, sel: string) => [...q<HTMLSelectElement>(el, sel).options].map(o => o.value);
const control = (el: PlanStudioPanel) => el.ruleDraft!.rule.control!;
async function choose(el: PlanStudioPanel, sel: string, value: string): Promise<void> {
  const s = q<HTMLSelectElement>(el, sel);
  s.value = value;
  s.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
}
async function type(el: PlanStudioPanel, sel: string, value: string): Promise<void> {
  const f = q<HTMLInputElement>(el, sel);
  f.value = value;
  f.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await el.updateComplete;
}
async function editRule(el: PlanStudioPanel, id: string): Promise<void> {
  el.openRuleDialog(id === 'rule-announce' ? 'control' : 'condition', id);
  await el.updateComplete;
}
async function newControl(el: PlanStudioPanel): Promise<void> {
  el.selection = null;
  await el.updateComplete;
  await press(el, 'button[data-template="control"]');
}

describe('Load control dialog: events and announcements', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('the add-source select has an Events group: light motion rules (auto, manual) and boiler rules (auto, manual, done), worded', async () => {
    const el = await openScene();
    await newControl(el);
    const group = q(el, 'select[data-action="add-source"] optgroup[label="Events"]');
    const opts = [...group.querySelectorAll('option')].map(o => [o.value, o.textContent!.trim()]);
    expect(opts).toEqual([
      ['e:rule-boiler:auto', 'Cost effective boiler Utility: entered auto'],
      ['e:rule-boiler:manual', 'Cost effective boiler Utility: entered manual'],
      ['e:rule-boiler:done', 'Cost effective boiler Utility: heating done'],
      ['e:rule-boiler-nl:auto', 'Cost effective boiler, no limit: entered auto'],
      ['e:rule-boiler-nl:manual', 'Cost effective boiler, no limit: entered manual'],
      ['e:rule-boiler-nl:done', 'Cost effective boiler, no limit: heating done'],
      ['e:rule-ml-main:auto', 'Light motion control Main: entered auto'],
      ['e:rule-ml-main:manual', 'Light motion control Main: entered manual'],
    ]);
    // never the condition rules or Load control rules
    expect(opts.some(([v]) => v.includes('rule-announce') || v.includes('rule-vent'))).toBe(false);
  });

  it('picking an event adds {event: {rule, what}}; the row says what it gives (on), is not offered again and has no NOT', async () => {
    const el = await openScene();
    await newControl(el);
    await choose(el, 'select[data-action="add-source"]', 'e:rule-boiler:done');
    await choose(el, 'select[data-action="add-source"]', 'e:rule-ml-main:auto');
    expect(control(el).sources).toEqual([{ event: { rule: 'rule-boiler', what: 'done' } }, { event: { rule: 'rule-ml-main', what: 'auto' } }]);
    const row = q(el, '[data-field="control-source-0"]');
    expect(row.textContent).toContain('Cost effective boiler Utility: heating done');
    expect(row.querySelector('[data-part="gives"]')!.textContent).toBe('gives on');
    expect(row.querySelector('[data-part="not"]')).toBeNull();
    expect(options(el, 'select[data-action="add-source"]')).not.toContain('e:rule-boiler:done');
    await press(el, '[data-field="control-source-0"] button[data-action="remove-input"]');
    expect(control(el).sources).toEqual([{ event: { rule: 'rule-ml-main', what: 'auto' } }]);
  });

  it('a source of a rule that is gone shows as missing and blocks OK', async () => {
    const el = await openScene();
    await newControl(el);
    await choose(el, 'select[data-action="add-source"]', 'e:rule-boiler:done');
    await choose(el, 'select[data-action="add-action-on"]', 'd-light');
    expect(q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]').disabled).toBe(false);
    el.ruleDraft = { ...el.ruleDraft!, rule: { ...el.ruleDraft!.rule, control: { ...control(el), sources: [{ event: { rule: 'gone', what: 'done' } }] } } };
    await el.updateComplete;
    expect(q(el, '[data-field="control-source-0"]').classList.contains('bad')).toBe(true);
    expect(q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]').disabled).toBe(true);
  });

  it('the three announcements are offered in all three lists; a speaker without a voice offers play only', async () => {
    const el = await openScene();
    await newControl(el);
    for (const l of ['on', 'off', 'toggle']) {
      expect(options(el, `select[data-action="add-action-${l}"]`)).toEqual(expect.arrayContaining(['d-speaker', 'd-speaker2', 'd-phone']));
    }
    await choose(el, 'select[data-action="add-action-off"]', 'd-speaker');
    expect(control(el).off).toEqual([{ device: 'd-speaker', do: 'say', text: '' }]);
    expect(options(el, '[data-field="control-off-0"] [data-part="do"]')).toEqual(['say', 'play']);
    await choose(el, 'select[data-action="add-action-off"]', 'd-speaker2');
    expect(control(el).off[1]).toEqual({ device: 'd-speaker2', do: 'play', media: '' });
    expect(options(el, '[data-field="control-off-1"] [data-part="do"]')).toEqual(['play']);
    expect(q(el, '[data-field="control-off-1"]').textContent).toContain('Bind a voice to say text');
    await choose(el, 'select[data-action="add-action-off"]', 'd-phone');
    expect(control(el).off[2]).toEqual({ device: 'd-phone', do: 'notify', text: '' });
  });

  it('each announcement row has its fields: say Text, play Media, notify Text and Title (optional); empty ones block OK', async () => {
    const el = await openScene();
    await newControl(el);
    await choose(el, 'select[data-action="add-source"]', 'e:rule-boiler:done');
    await choose(el, 'select[data-action="add-action-on"]', 'd-speaker');
    await choose(el, 'select[data-action="add-action-on"]', 'd-phone');
    const ok = () => q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]').disabled;
    expect(ok()).toBe(true);
    expect(all(el, '.rproblems li').map(x => x.getAttribute('data-problem'))).toContain('announce');
    const row = (k: number) => `[data-field="control-on-${k}"]`;
    expect(q(el, `${row(0)} [data-part="text"]`).getAttribute('placeholder')).toBe('Text');
    expect(all(el, `${row(0)} [data-part="media"], ${row(0)} [data-part="title"]`)).toEqual([]);
    await type(el, `${row(0)} [data-part="text"]`, ' Go bathe ');
    await type(el, `${row(1)} [data-part="text"]`, 'Boiler is hot');
    expect(q(el, `${row(1)} [data-part="title"]`).getAttribute('placeholder')).toBe('Title (optional)');
    await type(el, `${row(1)} [data-part="title"]`, 'Boiler');
    expect(ok()).toBe(false);
    // switching say -> play replaces the text by media, and the old field is gone
    await choose(el, `${row(0)} [data-part="do"]`, 'play');
    expect(control(el).on[0]).toEqual({ device: 'd-speaker', do: 'play', media: '' });
    expect(q(el, `${row(0)} [data-part="media"]`).getAttribute('placeholder')).toBe('Media');
    expect(ok()).toBe(true);
    await type(el, `${row(0)} [data-part="media"]`, 'media-source://media_source/local/Auto.mp3');
    // clearing the title drops the key (the server refuses an empty one)
    await type(el, `${row(1)} [data-part="title"]`, '');
    expect(control(el).on).toEqual([
      { device: 'd-speaker', do: 'play', media: 'media-source://media_source/local/Auto.mp3' },
      { device: 'd-phone', do: 'notify', text: 'Boiler is hot' },
    ]);
    expect(ok()).toBe(false);
  });

  it('the same speaker may appear twice in one list only with different actions', async () => {
    const el = await openScene();
    await newControl(el);
    await choose(el, 'select[data-action="add-action-on"]', 'd-speaker');
    expect(options(el, 'select[data-action="add-action-on"]')).toContain('d-speaker');
    await choose(el, 'select[data-action="add-action-on"]', 'd-speaker');
    expect(control(el).on.map(a => a.do)).toEqual(['say', 'play']);
    expect(options(el, 'select[data-action="add-action-on"]')).not.toContain('d-speaker');
    expect(options(el, '[data-field="control-on-0"] [data-part="do"]')).toEqual(['say']);
  });

  it('the saved "Auto sound" rule opens with its sources and the three actions filled in', async () => {
    const el = await openScene();
    await editRule(el, 'rule-announce');
    expect(all(el, '.rproblems li')).toEqual([]);
    expect((q(el, '[data-field="control-on-0"] [data-part="text"]') as HTMLInputElement).value).toBe('Go bathe');
    expect((q(el, '[data-field="control-on-1"] [data-part="media"]') as HTMLInputElement).value).toBe('media-source://media_source/local/Auto.mp3');
    expect((q(el, '[data-field="control-on-2"] [data-part="title"]') as HTMLInputElement).value).toBe('Boiler');
  });

  it('the flowchart words the sources, the event and the announcements', async () => {
    const el = await openScene();
    await editRule(el, 'rule-announce');
    const text = q(el, 'svg.fc').textContent!;
    // a source block has the rule's name and the event on two lines (the joined label would clip)
    for (const part of ['Light motion control Main', 'entered auto', 'Cost effective boiler Utility', 'heating done']) expect(text).toContain(part);
    expect(text).toContain('Event');
    expect(text).toMatch(/Cost effective boiler Utility: heating done \d\d:\d\d/);
    expect(text).toContain('say');
    expect(text).toContain('Go bathe');
    expect(text).toContain('notify');
    expect(text).not.toContain('now no data');
  });

  it('deleting a rule that an event source reads names the Load control rule', async () => {
    const el = await openScene();
    el.selection = { kind: 'zone', id: 'r0' };
    await el.updateComplete;
    await press(el, '.rrow[data-id="rule-ml-main"] button[data-action="rule-delete"]');
    expect(el.shadowRoot!.textContent).toContain('Auto sound');
  });
});

describe('a phone without a notify service', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  async function openNoService(): Promise<PlanStudioPanel> {
    const plan: Plan = structuredClone(SCENES.announce.plans[0]);
    plan.levels[0].devices.find(d => d.id === 'd-phone')!.props = { kind: 'phone' };
    plan.rules = plan.rules!.map(r => (r.id === 'rule-announce' ? { ...r, control: { ...r.control!, on: [{ device: 'd-phone', do: 'notify', text: 'x' }] } } : r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { [plan.id]: plan } }));
    const el = await mount(createMockHass({ rulesFrame: SCENES.announce.rulesFrame }));
    el.setMode('automation');
    await vi.waitFor(() => expect(el.rulesFeed.ready).toBe(true));
    await el.updateComplete;
    return el;
  }

  it('is not offered in either dialog, and an existing notify action on it is flagged', async () => {
    const el = await openNoService();
    await editRule(el, 'rule-announce');
    expect(options(el, 'select[data-action="add-action-on"]')).not.toContain('d-phone');
    expect(all(el, '.rproblems li').map(x => x.getAttribute('data-problem'))).toContain('action');
    expect(q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]').disabled).toBe(true);
    await press(el, 'button[data-action="rule-cancel"]');
    el.selection = null;
    await el.updateComplete;
    await press(el, 'button[data-template="condition"]');
    expect(options(el, 'select[data-action="add-action-true"]')).not.toContain('d-phone');
    expect(options(el, 'select[data-action="add-action-true"]')).toContain('d-speaker');
  });
});

describe('Condition dialog: announcements', () => {
  beforeEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

  it('When true / When false offer say, play and notify with their fields', async () => {
    const el = await openScene();
    el.selection = null;
    await el.updateComplete;
    await press(el, 'button[data-template="condition"]');
    await choose(el, 'select[data-action="add-input"]', 'd:d-leak');
    await choose(el, 'select[data-action="add-action-true"]', 'd-phone');
    expect(el.ruleDraft!.rule.onTrue).toEqual([{ device: 'd-phone', do: 'notify', text: '' }]);
    await type(el, '[data-field="action-true-0"] [data-part="text"]', 'Leak!');
    await choose(el, 'select[data-action="add-action-false"]', 'd-speaker');
    expect(options(el, '[data-field="action-false-0"] [data-part="do"]')).toEqual(['say', 'play']);
    expect(q(el, '[data-field="action-false-0"] [data-part="do"]').textContent).toContain('Say');
    await type(el, '[data-field="action-false-0"] [data-part="text"]', 'Dry again');
    expect(el.ruleDraft!.rule.onTrue).toEqual([{ device: 'd-phone', do: 'notify', text: 'Leak!' }]);
    expect(el.ruleDraft!.rule.onFalse).toEqual([{ device: 'd-speaker', do: 'say', text: 'Dry again' }]);
    await type(el, '[data-field="name"]', 'Leak news');
    expect(q<HTMLButtonElement>(el, 'button[data-action="rule-ok"]').disabled).toBe(false);
  });
});
