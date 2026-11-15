// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEY } from '../../dev/mock-hass';
import { addRoomZone } from '../../src/model/automation-zones';
import { addZone } from '../../src/model/zones';
import { deviceDefaults, levelZones, type AutomationZone, type Device, type Id, type Level, type ZoneVertex } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { rectRoomLevel } from '../fixtures';
import { $, click, device, key, mount, pointer, press, undo } from './helpers';

const free = (x: number, y: number): ZoneVertex => ({ kind: 'free', x, y });
const square = (id: Id, name: string, x0: number, y0: number, x1: number, y1: number, first: ZoneVertex = free(x0, y0)): AutomationZone =>
  ({ id, name, shape: { kind: 'polygon', vertices: [first, free(x1, y0), free(x1, y1), free(x0, y1)] }, invalid: false });
const dev = (id: string, name: string, x: number, y: number, extra: Partial<Device> = {}): Device =>
  ({ id, name, invalid: false, placement: { mode: 'free', x, y, rotation: 0 }, props: deviceDefaults('ceiling_light', 'free'), ...extra });

/**
 * A 6000 x 4000 room "Kitchen" (200 mm walls) with three zones in level order: the room zone "Kitchen", the custom
 * zone "Door" (1000,1000)-(2000,2000) and the custom zone "Lost" (4000,500)-(5000,1500) whose first vertex lost its
 * anchor. Devices: Lamp (1500,1500) in Kitchen and Door; Fan (5000,3000) in Kitchen only, opted out of it.
 */
function zonesPlan(): { level: Level; kitchen: Id } {
  const room = addZone(rectRoomLevel(6000, 4000, 200), { x: 3000, y: 2000 }, 'Kitchen');
  const rz = addRoomZone(room.level, room.zoneId!, 'Kitchen');
  const kitchen = rz.zoneId!;
  const lost = { ...square('lost', 'Lost', 4000, 500, 5000, 1500, { kind: 'free', x: 4000, y: 500, lost: true }), invalid: true };
  const level: Level = {
    ...rz.level,
    automationZones: [...levelZones(rz.level), square('door', 'Door', 1000, 1000, 2000, 2000), lost],
    devices: [dev('lamp', 'Lamp', 1500, 1500), dev('fan', 'Fan', 5000, 3000, { zoneBlacklist: [kitchen] })],
  };
  return { level, kitchen };
}

async function mountZones(): Promise<{ el: PlanStudioPanel; kitchen: Id }> {
  const { level, kitchen } = zonesPlan();
  const plan = { id: 'P1', name: 'Home', schemaVersion: 1, revision: 1, levels: [level] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
  const el = await mount();
  await press(el, '.steps [data-mode="zones"]');
  return { el, kitchen };
}

const zones = (el: PlanStudioPanel) => levelZones(el.history!.current.level);
const rowIds = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.zlist .zrow')].map(r => r.getAttribute('data-id'));
const text = (el: PlanStudioPanel, sel: string) => $(el, sel).textContent!.replace(/\s+/g, ' ').trim();
const az = (id: Id) => ({ kind: 'automationZone', id });

async function type(el: PlanStudioPanel, sel: string, value: string, ev: 'input' | 'change'): Promise<void> {
  const input = $<HTMLInputElement>(el, sel);
  input.value = value;
  input.dispatchEvent(new Event(ev, { bubbles: true, composed: true }));
  await el.updateComplete;
}

async function check(el: PlanStudioPanel, sel: string, on: boolean): Promise<void> {
  const box = $<HTMLInputElement>(el, sel);
  box.checked = on;
  box.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await el.updateComplete;
}

describe('the Zones step', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('the fourth step is Zones; its cell reads "0 zones" and then "1 zone" after adding one', async () => {
    const el = await mount();
    expect(text(el, '.steps [data-mode="zones"] .n')).toBe('4');
    expect(text(el, '.steps [data-mode="zones"] .name')).toBe('Zones');
    expect(text(el, '.steps [data-mode="zones"] .state')).toBe('0 zones');
    expect($(el, '.steps [data-mode="zones"]').classList.contains('done')).toBe(false);
    await press(el, '.steps [data-mode="zones"]');
    expect(el.mode).toBe('zones');
    await press(el, '.zlist button[data-tool="zone-draw"]');
    click(el, 1000, 1000);
    click(el, 3000, 1000);
    click(el, 3000, 3000);
    key(el, 'keydown', 'Enter');
    await el.updateComplete;
    expect(zones(el)).toHaveLength(1);
    expect(el.selection).toEqual(az(zones(el)[0].id));
    expect(text(el, '.steps [data-mode="zones"] .state')).toBe('1 zone');
    expect($(el, '.steps [data-mode="zones"]').classList.contains('done')).toBe(true);
  });

  it('the rail shows the three tools and the zone list; the filter narrows rows; a row click selects and pans', async () => {
    const { el, kitchen } = await mountZones();
    const tools = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.zlist button[data-tool]')];
    expect(tools.map(b => b.dataset.tool)).toEqual(['zones-select', 'zone-room', 'zone-draw']);
    expect(tools.map(b => b.textContent!.trim())).toEqual(['Select', 'Zone from room', 'Custom zone']);
    expect($(el, '.zlist .tool.on').getAttribute('data-tool')).toBe('zones-select');
    await press(el, '.zlist button[data-tool="zone-room"]');
    expect(el.toolId).toBe('zone-room');
    await press(el, '.zlist button[data-tool="zones-select"]');

    expect(rowIds(el)).toEqual([kitchen, 'door', 'lost']);
    expect(text(el, `.zrow[data-id="${kitchen}"] .name`)).toBe('Kitchen');
    expect(text(el, `.zrow[data-id="${kitchen}"] .kind`)).toBe('Room');
    expect(text(el, '.zrow[data-id="door"] .kind')).toBe('Custom');
    // Participating members: the Fan opted out of Kitchen.
    expect(text(el, `.zrow[data-id="${kitchen}"] .zcount`)).toBe('1');
    expect(text(el, '.zrow[data-id="door"] .zcount')).toBe('1');
    expect(text(el, '.zrow[data-id="lost"] .zcount')).toBe('0');
    expect(el.shadowRoot!.querySelectorAll('.zrow .zinvalid')).toHaveLength(1);
    expect(el.shadowRoot!.querySelector('.zrow[data-id="lost"] .zinvalid')).not.toBeNull();

    expect($<HTMLInputElement>(el, 'input[data-field="zone-filter"]').placeholder).toBe('Filter zones');
    await type(el, 'input[data-field="zone-filter"]', 'KIT', 'input');
    expect(rowIds(el)).toEqual([kitchen]);
    await type(el, 'input[data-field="zone-filter"]', 'custom', 'input'); // the kind label matches too
    expect(rowIds(el)).toEqual(['door', 'lost']);
    await type(el, 'input[data-field="zone-filter"]', '', 'input');
    expect(rowIds(el)).toHaveLength(3);

    const far = { x: 50000, y: 50000, scale: 0.1 };
    el.view = far;
    await press(el, '.zrow[data-id="door"]');
    expect(el.selection).toEqual(az('door'));
    expect($(el, '.zrow[data-id="door"]').classList.contains('sel')).toBe(true);
    // The canvas has no size in happy-dom: revealing the label point (1500,1500) puts it at the view origin.
    expect(el.view).toEqual({ x: 1500, y: 1500, scale: 0.1 });
    expect(el.toolId).toBe('zones-select');
  });

  it('a zone picked in the list drags its vertex with the first press', async () => {
    const { el } = await mountZones();
    await press(el, '.zrow[data-id="door"]');
    const before = el.history!.current.level;
    pointer(el, 'pointerdown', 2000, 1000);
    pointer(el, 'pointermove', 2500, 700);
    pointer(el, 'pointerup', 2500, 700);
    await el.updateComplete;
    expect(el.history!.current.level).not.toBe(before);
    const door = zones(el).find(z => z.id === 'door')!;
    expect(door.shape.kind === 'polygon' && door.shape.vertices[1]).toEqual(free(2500, 700));
    expect(el.selection).toEqual(az('door'));
  });

  it('an aborted vertex drag keeps the zone selected', async () => {
    const { el } = await mountZones();
    click(el, 1500, 1500); // the smallest zone under the point: Door
    await el.updateComplete;
    expect(el.selection).toEqual(az('door'));
    const before = el.history!.current.level;
    pointer(el, 'pointerdown', 2000, 1000);
    pointer(el, 'pointermove', 2500, 700);
    expect(el.activeTool.preview().level).toBeDefined();
    pointer(el, 'pointercancel', 2500, 700);
    pointer(el, 'pointerup', 2500, 700);
    await el.updateComplete;
    expect(el.activeTool.preview().level).toBeUndefined();
    expect(el.history!.current.level).toBe(before);
    expect(el.selection).toEqual(az('door'));
  });

  it('a list pick keeps the active tool and its draft; switching tools or steps clears the selection', async () => {
    const { el } = await mountZones();
    await press(el, '.zlist button[data-tool="zone-draw"]');
    click(el, 3000, 3000);
    await press(el, '.zrow[data-id="door"]');
    expect(el.selection).toEqual(az('door'));
    expect(el.toolId).toBe('zone-draw');
    expect(el.activeTool.preview().zoneDraft?.points).toEqual([{ x: 3000, y: 3000 }]);
    await press(el, '.zlist button[data-tool="zones-select"]');
    expect(el.selection).toBeNull();
    await press(el, '.zrow[data-id="door"]');
    await press(el, '.steps [data-mode="plan"]');
    expect(el.selection).toBeNull();
  });

  it('the properties show the hint and count, then the kind, room, invalid reason and members', async () => {
    const { el, kitchen } = await mountZones();
    expect(text(el, '.zprops')).toContain('Pick a zone on the plan or in the list, or add one with Zone from room or Custom zone.');
    expect(text(el, '.zprops')).toContain('3 zones');

    await press(el, `.zrow[data-id="${kitchen}"]`);
    expect($<HTMLInputElement>(el, '.zprops input[data-field="zone-name"]').value).toBe('Kitchen');
    expect(text(el, '.zprops [data-field="zone-kind"]')).toBe('Room');
    expect(text(el, '.zprops [data-field="zone-room"]')).toBe('Kitchen');
    expect(el.shadowRoot!.querySelector('.zprops p.warn[data-note="zone-invalid"]')).toBeNull();
    expect(text(el, '.zprops')).toContain('Members');
    expect(text(el, '.zprops')).toContain('Participates');
    const members = [...el.shadowRoot!.querySelectorAll<HTMLLabelElement>('.zprops label.member')];
    expect(members.map(m => m.dataset.device)).toEqual(['lamp', 'fan']);
    expect(members.map(m => m.querySelector<HTMLInputElement>('input[data-field="participates"]')!.checked)).toEqual([true, false]);
    expect(text(el, '.zprops label.member[data-device="lamp"]')).toContain('Lamp');
    expect(text(el, '.zprops button[data-action="delete-zone"]')).toBe('Delete zone');

    await press(el, '.zrow[data-id="door"]');
    expect(text(el, '.zprops [data-field="zone-kind"]')).toBe('Custom');
    expect(el.shadowRoot!.querySelector('.zprops [data-field="zone-room"]')).toBeNull();

    await press(el, '.zrow[data-id="lost"]');
    expect(text(el, '.zprops p.warn[data-note="zone-invalid"]')).toBe('A vertex lost its wall or corner: drag it to place it again.');
    expect(el.shadowRoot!.querySelectorAll('.zprops label.member')).toHaveLength(0);
    expect(text(el, '.zprops')).toContain('No devices inside.');
  });

  it('renaming a zone in the properties; a blank name reverts', async () => {
    const { el } = await mountZones();
    await press(el, '.zrow[data-id="door"]');
    await type(el, '.zprops input[data-field="zone-name"]', '  Hall ', 'change');
    expect(zones(el).find(z => z.id === 'door')!.name).toBe('Hall');
    expect(text(el, '.zrow[data-id="door"] .name')).toBe('Hall');
    const before = el.history!.current.level;
    await type(el, '.zprops input[data-field="zone-name"]', '   ', 'change');
    expect(el.history!.current.level).toBe(before);
    expect($<HTMLInputElement>(el, '.zprops input[data-field="zone-name"]').value).toBe('Hall');
    await type(el, '.zprops input[data-field="zone-name"]', 'Hall', 'change'); // unchanged: no commit
    expect(el.history!.current.level).toBe(before);
  });

  it('unchecking Participates blacklists the device; rechecking clears it; undo restores', async () => {
    const { el } = await mountZones();
    await press(el, '.zrow[data-id="door"]');
    const box = '.zprops label.member[data-device="lamp"] input[data-field="participates"]';
    expect($<HTMLInputElement>(el, box).checked).toBe(true);
    await check(el, box, false);
    expect(device(el, 'lamp').zoneBlacklist).toEqual(['door']);
    expect($<HTMLInputElement>(el, box).checked).toBe(false);
    expect(text(el, '.zrow[data-id="door"] .zcount')).toBe('0');
    await check(el, box, true);
    expect('zoneBlacklist' in device(el, 'lamp')).toBe(false);
    expect(text(el, '.zrow[data-id="door"] .zcount')).toBe('1');
    await undo(el);
    expect(device(el, 'lamp').zoneBlacklist).toEqual(['door']);
    await undo(el);
    expect('zoneBlacklist' in device(el, 'lamp')).toBe(false);
  });

  it('Delete removes only the zone; undo restores it', async () => {
    const { el, kitchen } = await mountZones();
    const start = el.history!.current.level;
    await press(el, '.zrow[data-id="door"]');
    expect(el.selection).toEqual(az('door'));
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(zones(el).map(z => z.id)).toEqual([kitchen, 'lost']);
    expect(el.history!.current.level.walls).toBe(start.walls);
    expect(el.history!.current.level.zones).toBe(start.zones);
    expect(el.history!.current.level.devices.map(d => d.id)).toEqual(['lamp', 'fan']);
    expect(el.selection).toBeNull();
    await undo(el);
    expect(zones(el).map(z => z.id)).toEqual([kitchen, 'door', 'lost']);
    expect(el.history!.current.level).toBe(start);
    // The selection never points at a missing zone.
    expect(el.selection === null || zones(el).some(z => z.id === el.selection!.id)).toBe(true);

    // Backspace and the Delete zone button do the same.
    await press(el, '.zrow[data-id="door"]');
    key(el, 'keydown', 'Backspace');
    await el.updateComplete;
    expect(zones(el).map(z => z.id)).toEqual([kitchen, 'lost']);
    await undo(el);
    await press(el, `.zrow[data-id="${kitchen}"]`);
    await press(el, '.zprops button[data-action="delete-zone"]');
    expect(zones(el).map(z => z.id)).toEqual(['door', 'lost']);
    // The deleted zone leaves the Fan's blacklist.
    expect('zoneBlacklist' in device(el, 'fan')).toBe(false);
    await undo(el);
    expect(el.history!.current.level).toBe(start);

    // A device or wall selection is never deleted in this step.
    el.selection = { kind: 'device', id: 'lamp' };
    expect(el.deleteSelection()).toBe(false);
    el.selection = { kind: 'wall', id: 'w0' };
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.history!.current.level).toBe(start);
  });

  it('Delete and Backspace during a draft remove vertices only; a held key never deletes the selected zone', async () => {
    const { el } = await mountZones();
    await press(el, '.zlist button[data-tool="zone-draw"]');
    click(el, 3000, 3000);
    click(el, 3500, 3000);
    await press(el, '.zrow[data-id="door"]');
    const before = el.history!.current.level;
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(el.activeTool.preview().zoneDraft?.points).toEqual([{ x: 3000, y: 3000 }]);
    expect(el.toolId).toBe('zone-draw');
    expect(el.selection).toEqual(az('door'));
    // Holding Backspace: the auto-repeat empties the draft and stops there.
    key(el, 'keydown', 'Backspace', { repeat: true });
    key(el, 'keydown', 'Backspace', { repeat: true });
    key(el, 'keydown', 'Delete', { repeat: true });
    await el.updateComplete;
    expect(el.activeTool.preview().zoneDraft).toBeUndefined();
    expect(el.history!.current.level).toBe(before);
    expect(el.selection).toEqual(az('door'));
    // A fresh press with no draft deletes the selected zone.
    key(el, 'keydown', 'Backspace');
    await el.updateComplete;
    expect(zones(el).map(z => z.id)).not.toContain('door');
  });

  it('room labels are hidden in the Zones step, where the room zones carry the name', async () => {
    const { el } = await mountZones();
    expect(el.shadowRoot!.querySelectorAll('svg.plan .zone-label')).toHaveLength(0);
    await press(el, '.steps [data-mode="plan"]');
    expect(el.shadowRoot!.querySelectorAll('svg.plan .zone-label')).toHaveLength(1);
  });

  it('zones are drawn only in the Zones step', async () => {
    const { el } = await mountZones();
    expect(el.shadowRoot!.querySelectorAll('svg.plan .azones .azone')).toHaveLength(3);
    for (const m of ['plan', 'equipment', 'binding']) {
      await press(el, `.steps [data-mode="${m}"]`);
      expect(el.shadowRoot!.querySelector('svg.plan .azones'), m).toBeNull();
    }
  });

  it('the Plan step room tool is labelled Room', async () => {
    const el = await mount();
    expect(text(el, '.tools button[data-tool="zone"]')).toBe('Room');
  });
});
