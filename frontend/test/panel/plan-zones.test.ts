// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEY } from '../../dev/mock-hass';
import { addWallsZone } from '../../src/model/zones';
import { deviceDefaults, type Device, type Id, type Level, type Zone, type ZoneVertex } from '../../src/model/types';
import type { PlanStudioPanel } from '../../src/panel/plan-studio-panel';
import { rectRoomLevel } from '../fixtures';
import { $, click, device, key, mount, pointer, press, undo } from './helpers';

const free = (x: number, y: number): ZoneVertex => ({ kind: 'free', x, y });
const square = (id: Id, name: string, x0: number, y0: number, x1: number, y1: number, first: ZoneVertex = free(x0, y0)): Zone =>
  ({ id, name, shape: { kind: 'polygon', vertices: [first, free(x1, y0), free(x1, y1), free(x0, y1)] }, invalid: false });
const dev = (id: string, name: string, x: number, y: number, extra: Partial<Device> = {}): Device =>
  ({ id, name, invalid: false, placement: { mode: 'free', x, y, rotation: 0 }, props: deviceDefaults('ceiling_light', 'free'), ...extra });

/** A walls zone whose walls no longer close it: its seed lies outside every loop. */
const old: Zone = {
  id: 'old', name: 'Old', invalid: true,
  shape: { kind: 'walls', seed: { x: 9000, y: 9000 }, broken: true,
    outline: [{ x: 7000, y: 0 }, { x: 8000, y: 0 }, { x: 8000, y: 1000 }, { x: 7000, y: 1000 }] },
};

/**
 * A 6000 x 4000 room (200 mm walls) with three zones in level order: the walls zone "Kitchen", the polygon zone
 * "Door" (1000,1000)-(2000,2000) and the polygon zone "Lost" (4000,500)-(5000,1500) whose first vertex lost its
 * anchor. Devices: Lamp (1500,1500) in Kitchen and Door; Fan (5000,3000) in Kitchen only, opted out of it.
 */
function zonesPlan(extra: Zone[] = []): { level: Level; kitchen: Id } {
  const rz = addWallsZone(rectRoomLevel(6000, 4000, 200), { x: 3000, y: 2000 }, 'Kitchen');
  const kitchen = rz.zoneId!;
  const lost = { ...square('lost', 'Lost', 4000, 500, 5000, 1500, { kind: 'free', x: 4000, y: 500, lost: true }), invalid: true };
  const level: Level = {
    ...rz.level,
    zones: [...rz.level.zones, square('door', 'Door', 1000, 1000, 2000, 2000), lost, ...extra],
    devices: [dev('lamp', 'Lamp', 1500, 1500), dev('fan', 'Fan', 5000, 3000, { zoneBlacklist: [kitchen] })],
  };
  return { level, kitchen };
}

async function mountLevel(level: Level): Promise<PlanStudioPanel> {
  const plan = { id: 'P1', name: 'Home', schemaVersion: 2, revision: 1, levels: [level] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: { P1: plan } }));
  return mount();
}

async function mountZones(extra: Zone[] = []): Promise<{ el: PlanStudioPanel; kitchen: Id }> {
  const { level, kitchen } = zonesPlan(extra);
  return { el: await mountLevel(level), kitchen };
}

const zones = (el: PlanStudioPanel) => el.history!.current.level.zones;
const zone = (el: PlanStudioPanel, id: Id) => zones(el).find(z => z.id === id)!;
const verts = (el: PlanStudioPanel, id: Id): ZoneVertex[] => {
  const s = zone(el, id).shape;
  if (s.kind !== 'polygon') throw new Error('not a polygon');
  return s.vertices;
};
const rowIds = (el: PlanStudioPanel) => [...el.shadowRoot!.querySelectorAll('.zlist .zrow')].map(r => r.getAttribute('data-id'));
const text = (el: PlanStudioPanel, sel: string) => $(el, sel).textContent!.replace(/\s+/g, ' ').trim();
const az = (id: Id) => ({ kind: 'zone', id });

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

/** The pointer sequence of a real double-click: two clicks, then the dblclick event. */
function dblclick(el: PlanStudioPanel, x: number, y: number): void {
  click(el, x, y);
  click(el, x, y);
  $(el, 'svg.plan').dispatchEvent(new MouseEvent('dblclick', { clientX: x, clientY: y, bubbles: true, composed: true }));
}

async function zoneTool(el: PlanStudioPanel, method: 'walls' | 'polygon' = 'walls'): Promise<void> {
  await press(el, '.tools button[data-tool="zone"]');
  if (method === 'polygon') await press(el, '.props button[data-method="polygon"]');
}

describe('zones in the Plan step', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('the Plan rail ends with the Zone tool; there is no Zones step', async () => {
    const el = await mount();
    const tools = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tools button[data-tool]')].map(b => b.dataset.tool);
    expect(tools).toEqual(['select', 'box', 'wall', 'door', 'window', 'opening', 'zone']);
    expect(text(el, '.tools button[data-tool="zone"]')).toBe('Zone');
    expect(el.shadowRoot!.querySelector('.steps [data-mode="zones"]')).toBeNull();
  });

  it('the Zone tool shows the method switch (By walls by default), the name, Automation, a hint and the zone list', async () => {
    const { el, kitchen } = await mountZones();
    await zoneTool(el);
    expect($(el, '.props button[data-method="walls"]').classList.contains('on')).toBe(true);
    expect($(el, '.props button[data-method="polygon"]').classList.contains('on')).toBe(false);
    expect(text(el, '.props button[data-method="walls"]')).toBe('By walls');
    expect(text(el, '.props button[data-method="polygon"]')).toBe('Polygon');
    expect(el.shadowRoot!.querySelectorAll('.props button[data-method] svg')).toHaveLength(2);
    expect($<HTMLInputElement>(el, '.props input[data-field="next-zone-name"]').value).toBe('Zone 1');
    expect($<HTMLInputElement>(el, '.props input[data-field="next-zone-automation"]').checked).toBe(true);
    expect(text(el, '.props [data-note="zone-hint"]')).toContain('Click inside closed walls');
    expect(rowIds(el)).toEqual([kitchen, 'door', 'lost']);
    await press(el, '.props button[data-method="polygon"]');
    expect(el.toolId).toBe('zone');
    expect($(el, '.props button[data-method="polygon"]').classList.contains('on')).toBe(true);
    expect(text(el, '.props [data-note="zone-hint"]')).toContain('Click to add a vertex');
  });

  it('By walls: a click inside walls creates "Zone 1" and selects it; the same click again selects it without a commit', async () => {
    const el = await mountLevel(rectRoomLevel(6000, 4000, 200));
    await zoneTool(el);
    click(el, 3000, 2000);
    await el.updateComplete;
    expect(zones(el)).toHaveLength(1);
    const z = zones(el)[0];
    expect(z).toMatchObject({ name: 'Zone 1', shape: { kind: 'walls' } });
    expect('automation' in z).toBe(false);
    expect(el.selection).toEqual(az(z.id));
    const after = el.history!.current;
    el.selection = null;
    click(el, 1000, 1000);
    await el.updateComplete;
    expect(el.history!.current).toBe(after);
    expect(el.selection).toEqual(az(z.id));
  });

  it('the Zone tool shows the selected zone\'s properties between the next-zone settings and the list', async () => {
    const el = await mountLevel(rectRoomLevel(6000, 4000, 200));
    await zoneTool(el);
    expect(el.shadowRoot!.querySelector('.props .zprops')).toBeNull();
    click(el, 3000, 2000);
    await el.updateComplete;
    const z = zones(el)[0];
    expect($<HTMLInputElement>(el, '.props .zprops input[data-field="zone-name"]').value).toBe('Zone 1');
    expect(text(el, '.props .zprops [data-field="zone-area"]')).toBe('22.0 m²');
    const order = [...el.shadowRoot!.querySelectorAll('.props [data-field="next-zone-name"], .props .zprops, .props .zlist')]
      .map(n => n.getAttribute('data-field') ?? n.className);
    expect(order).toEqual(['next-zone-name', 'zprops', 'zlist']);
    await check(el, '.props .zprops input[data-field="zone-automation"]', false);
    expect(zone(el, z.id).automation).toBe(false);
    expect(el.toolId).toBe('zone');
    // The next zone's settings stay its own.
    expect($<HTMLInputElement>(el, '.props input[data-field="next-zone-automation"]').checked).toBe(true);
  });

  it('By walls: a click outside walls shows the notice and creates nothing', async () => {
    const el = await mountLevel(rectRoomLevel(6000, 4000, 200));
    await zoneTool(el);
    const before = el.history!.current;
    click(el, 9000, 9000);
    await el.updateComplete;
    expect(el.history!.current).toBe(before);
    expect(el.notice).toBe('Click inside closed walls, or use Polygon');
    expect(text(el, '.props')).toContain('Click inside closed walls, or use Polygon');
  });

  it('a typed name and Automation off go to the next zone; the name is single-use', async () => {
    const el = await mountLevel(rectRoomLevel(6000, 4000, 200));
    await zoneTool(el, 'polygon');
    await type(el, '.props input[data-field="next-zone-name"]', 'Yard', 'change');
    await check(el, '.props input[data-field="next-zone-automation"]', false);
    click(el, 1000, 1000);
    click(el, 2000, 1000);
    click(el, 2000, 2000);
    key(el, 'keydown', 'Enter');
    await el.updateComplete;
    expect(zones(el)).toHaveLength(1);
    expect(zones(el)[0]).toMatchObject({ name: 'Yard', automation: false, shape: { kind: 'polygon' } });
    await press(el, '.tools button[data-tool="zone"]');
    expect($<HTMLInputElement>(el, '.props input[data-field="next-zone-name"]').value).toBe('Zone 1');
    expect($<HTMLInputElement>(el, '.props input[data-field="next-zone-automation"]').checked).toBe(false);
  });

  it('Polygon: a vertex snaps to another zone\'s vertex', async () => {
    const { el } = await mountZones();
    await zoneTool(el, 'polygon');
    pointer(el, 'pointermove', 2060, 1050); // 78 mm from Door's corner (2000,1000); the grid would give (2100,1100)
    expect(el.activeTool.preview().snap).toMatchObject({ kind: 'zoneVertex', pt: { x: 2000, y: 1000 } });
    click(el, 2060, 1050);
    expect(el.activeTool.preview().zoneDraft?.points).toEqual([{ x: 2000, y: 1000 }]);
  });

  it('Polygon: Ctrl+Z during a draft removes the last vertex; with no draft it undoes the last edit', async () => {
    const { el } = await mountZones();
    await zoneTool(el, 'polygon');
    const before = el.history!.current;
    click(el, 3000, 2500);
    click(el, 3500, 2500);
    click(el, 3500, 3000);
    await undo(el);
    expect(el.activeTool.preview().zoneDraft?.points).toEqual([{ x: 3000, y: 2500 }, { x: 3500, y: 2500 }]);
    expect(el.history!.current).toBe(before);
    await undo(el);
    await undo(el);
    expect(el.activeTool.preview().zoneDraft).toBeUndefined();
    expect(el.toolId).toBe('zone');
    // No draft: Ctrl+Z is the plan's undo again.
    click(el, 3000, 2500); click(el, 3500, 2500); click(el, 3500, 3000);
    key(el, 'keydown', 'Enter');
    await el.updateComplete;
    expect(zones(el)).toHaveLength(4);
    await undo(el);
    expect(zones(el)).toHaveLength(3);
  });

  it('Select: a click picks the smallest zone, a repeated click the next; walls come first', async () => {
    const { el, kitchen } = await mountZones();
    click(el, 1500, 1500);
    expect(el.selection).toEqual(az('door'));
    click(el, 1510, 1500);
    expect(el.selection).toEqual(az(kitchen));
    click(el, 1500, 1505);
    expect(el.selection).toEqual(az('door'));
    click(el, 3000, 0); // on a wall inside Kitchen's edge tolerance
    expect(el.selection).toEqual({ kind: 'wall', id: 'w0' });
    click(el, 9000, 9000);
    expect(el.selection).toBeNull();
  });

  it('Select follows the panel selection: after Esc, undo or a list pick a press at a wall end picks the wall, not its node', async () => {
    const { el } = await mountZones();
    const n1 = () => el.history!.current.level.nodes.find(n => n.id === 'n1')!;
    const clearings: [string, () => Promise<void>][] = [
      ['Esc', async () => { key(el, 'keydown', 'Escape'); await el.updateComplete; }],
      ['undo', () => undo(el)],
      ['list pick', () => press(el, '.zrow[data-id="door"]')],
    ];
    for (const [name, clear] of clearings) {
      click(el, 3000, 0);
      expect(el.selection, name).toEqual({ kind: 'wall', id: 'w0' });
      await clear();
      expect(el.selection?.kind === 'wall', name).toBe(false);
      pointer(el, 'pointerdown', 5990, 5); // next to n1, the end of w0
      expect(el.selection, name).toEqual({ kind: 'wall', id: 'w0' });
      pointer(el, 'pointerup', 5990, 5);
      expect(n1(), name).toMatchObject({ x: 6000, y: 0 });
      key(el, 'keydown', 'Escape');
    }
  });

  it('Select: a double-click on an edge of the selected polygon inserts a vertex; Delete on a selected vertex removes it', async () => {
    const { el } = await mountZones();
    click(el, 1500, 1500);
    expect(el.selection).toEqual(az('door'));
    const start = el.history!.current;
    dblclick(el, 1500, 1000);
    await el.updateComplete;
    expect(verts(el, 'door')).toEqual([free(1000, 1000), free(1500, 1000), free(2000, 1000), free(2000, 2000), free(1000, 2000)]);
    expect(el.selection).toEqual(az('door'));
    expect(el.shadowRoot!.querySelectorAll('svg.plan .zone-vertex')).toHaveLength(5);
    // A click on the new vertex selects it; Delete removes it and keeps the zone.
    click(el, 1500, 1000);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('svg.plan .zone-vertex.on')).toHaveLength(1);
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(verts(el, 'door')).toEqual([free(1000, 1000), free(2000, 1000), free(2000, 2000), free(1000, 2000)]);
    expect(el.selection).toEqual(az('door'));
    await undo(el);
    await undo(el);
    expect(el.history!.current).toBe(start);
  });

  it('Select: a vertex drag of the selected polygon is one commit', async () => {
    const { el } = await mountZones();
    click(el, 1500, 1500);
    const before = el.history!.current;
    pointer(el, 'pointerdown', 2000, 1000);
    pointer(el, 'pointermove', 2500, 700);
    pointer(el, 'pointerup', 2500, 700);
    await el.updateComplete;
    expect(verts(el, 'door')[1]).toEqual(free(2500, 700));
    expect(el.selection).toEqual(az('door'));
    await undo(el);
    expect(el.history!.current.level).toBe(before.level);
  });

  it('Delete with a zone selected deletes the zone; undo restores it', async () => {
    const { el, kitchen } = await mountZones();
    const start = el.history!.current.level;
    click(el, 1500, 1500);
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(zones(el).map(z => z.id)).toEqual([kitchen, 'lost']);
    expect(el.selection).toBeNull();
    await undo(el);
    expect(el.history!.current.level).toBe(start);
  });

  it('the zone list shows with nothing selected: swatch, name, method icon, area and the invalid marker', async () => {
    const { el, kitchen } = await mountZones();
    expect(rowIds(el)).toEqual([kitchen, 'door', 'lost']);
    expect(text(el, '.zlist .zhead')).toContain('Zones (3)');
    expect(text(el, `.zrow[data-id="${kitchen}"] .name`)).toBe('Kitchen');
    expect($(el, `.zrow[data-id="${kitchen}"] .zkind`).getAttribute('data-kind')).toBe('walls');
    expect($(el, '.zrow[data-id="door"] .zkind').getAttribute('data-kind')).toBe('polygon');
    expect(text(el, '.zrow[data-id="door"] .zarea')).toBe('1.0');
    expect(text(el, `.zrow[data-id="${kitchen}"] .zarea`)).toBe('22.0');
    expect(el.shadowRoot!.querySelectorAll('.zrow .zinvalid')).toHaveLength(1);
    expect(el.shadowRoot!.querySelector('.zrow[data-id="lost"] .zinvalid')).not.toBeNull();
    await type(el, 'input[data-field="zone-filter"]', 'KIT', 'input');
    expect(rowIds(el)).toEqual([kitchen]);
    await type(el, 'input[data-field="zone-filter"]', '', 'input');
    // Another tool hides the list.
    await press(el, '.tools button[data-tool="wall"]');
    expect(el.shadowRoot!.querySelector('.zlist')).toBeNull();
  });

  it('a list click selects the zone and pans to it; the tool stays', async () => {
    const { el } = await mountZones();
    el.view = { x: 50000, y: 50000, scale: 0.1 };
    await press(el, '.zrow[data-id="door"]');
    expect(el.selection).toEqual(az('door'));
    // The canvas has no size in happy-dom: revealing the label point (1500,1500) puts it at the view origin.
    expect(el.view).toEqual({ x: 1500, y: 1500, scale: 0.1 });
    expect(el.toolId).toBe('select');
    // The Zone tool keeps its list, and a pick keeps the tool.
    await zoneTool(el);
    await press(el, '.zrow[data-id="lost"]');
    expect(el.selection).toEqual(az('lost'));
    expect(el.toolId).toBe('zone');
  });

  it('the properties: name, area, outline, Automation, the devices inside with Participates, Delete', async () => {
    const { el, kitchen } = await mountZones();
    await press(el, `.zrow[data-id="${kitchen}"]`);
    expect($<HTMLInputElement>(el, '.zprops input[data-field="zone-name"]').value).toBe('Kitchen');
    expect(text(el, '.zprops [data-field="zone-area"]')).toBe('22.0 m²');
    expect(text(el, '.zprops [data-field="zone-kind"]')).toBe('By walls');
    expect($<HTMLInputElement>(el, '.zprops input[data-field="zone-automation"]').checked).toBe(true);
    expect(text(el, '.zprops .zhead')).toContain('Devices inside (2)');
    expect(text(el, '.zprops .zhead')).toContain('Participates');
    const members = [...el.shadowRoot!.querySelectorAll<HTMLLabelElement>('.zprops label.member')];
    expect(members.map(m => m.dataset.device)).toEqual(['lamp', 'fan']);
    expect(members.map(m => m.querySelector<HTMLInputElement>('input')!.checked)).toEqual([true, false]);
    expect(el.shadowRoot!.querySelector('.zprops [data-action="keep-outline"]')).toBeNull();
    expect(text(el, '.zprops button[data-action="delete-zone"]')).toBe('Delete zone');
    await press(el, '.zprops button[data-action="delete-zone"]');
    expect(zones(el).map(z => z.id)).toEqual(['door', 'lost']);
    expect('zoneBlacklist' in device(el, 'fan')).toBe(false);

    await press(el, '.zrow[data-id="lost"]');
    expect(text(el, '.zprops [data-field="zone-kind"]')).toBe('Polygon');
    expect(text(el, '.zprops p.warn[data-note="zone-invalid"]')).toBe('A vertex lost its wall or corner: drag it to place it again.');
    expect(text(el, '.zprops')).toContain('No devices inside.');
  });

  it('renaming a zone; a blank name reverts', async () => {
    const { el } = await mountZones();
    await press(el, '.zrow[data-id="door"]');
    await type(el, '.zprops input[data-field="zone-name"]', '  Hall ', 'change');
    expect(zone(el, 'door').name).toBe('Hall');
    const before = el.history!.current.level;
    await type(el, '.zprops input[data-field="zone-name"]', '   ', 'change');
    expect(el.history!.current.level).toBe(before);
    expect($<HTMLInputElement>(el, '.zprops input[data-field="zone-name"]').value).toBe('Hall');
  });

  it('the Automation checkbox commits; one undo step each', async () => {
    const { el } = await mountZones();
    await press(el, '.zrow[data-id="door"]');
    const box = '.zprops input[data-field="zone-automation"]';
    await check(el, box, false);
    expect(zone(el, 'door').automation).toBe(false);
    expect($<HTMLInputElement>(el, box).checked).toBe(false);
    await check(el, box, true);
    expect('automation' in zone(el, 'door')).toBe(false);
    await undo(el);
    expect(zone(el, 'door').automation).toBe(false);
  });

  it('unchecking Participates blacklists the device; undo restores', async () => {
    const { el } = await mountZones();
    await press(el, '.zrow[data-id="door"]');
    const box = '.zprops label.member[data-device="lamp"] input[data-field="participates"]';
    await check(el, box, false);
    expect(device(el, 'lamp').zoneBlacklist).toEqual(['door']);
    await undo(el);
    expect('zoneBlacklist' in device(el, 'lamp')).toBe(false);
  });

  it('a broken walls zone shows its reason and Keep outline makes it a polygon of lost vertices, keeping its id', async () => {
    const { el } = await mountZones([old]);
    const before = el.history!.current.level;
    await press(el, '.zrow[data-id="old"]');
    expect(text(el, '.zprops p.warn[data-note="zone-invalid"]')).toBe('The walls no longer close this zone.');
    expect(text(el, '.zprops [data-action="keep-outline"]')).toBe('Keep outline as a polygon');
    await press(el, '.zprops [data-action="keep-outline"]');
    const z = zone(el, 'old');
    expect(z.name).toBe('Old');
    expect(verts(el, 'old')).toEqual(old.shape.kind === 'walls' ? old.shape.outline.map(p => ({ kind: 'free', ...p, lost: true })) : []);
    expect(el.selection).toEqual(az('old'));
    expect(text(el, '.zprops [data-field="zone-kind"]')).toBe('Polygon');
    expect(el.shadowRoot!.querySelector('.zprops [data-action="keep-outline"]')).toBeNull();
    await undo(el);
    expect(el.history!.current.level).toBe(before);
  });

  it('the Plan step cell counts walls and zones, and the invalid ones', async () => {
    const { el } = await mountZones();
    expect(text(el, '.steps [data-mode="plan"] .state')).toBe('4 walls, 3 zones, 1 invalid');
    expect($(el, '.steps [data-mode="plan"]').classList.contains('done')).toBe(true);
    click(el, 4500, 1000); // Lost
    key(el, 'keydown', 'Delete');
    await el.updateComplete;
    expect(text(el, '.steps [data-mode="plan"] .state')).toBe('4 walls, 2 zones');
  });

  it('the Plan step draws fills and labels with the area; Equipment and Binding outlines only; Power none', async () => {
    const { el } = await mountZones();
    const q = (sel: string) => [...el.shadowRoot!.querySelectorAll<SVGElement>(`svg.plan ${sel}`)];
    expect(q('g.zones path.zone')).toHaveLength(3);
    expect(q('g.zones path.zone').every(p => p.getAttribute('fill') !== 'none')).toBe(true);
    expect(q('.zone-label')).toHaveLength(3);
    expect(q('.zone-label')[1].textContent!.replace(/\s+/g, ' ').trim()).toBe('Door 1.0 m²');
    for (const m of ['equipment', 'binding']) {
      await press(el, `.steps [data-mode="${m}"]`);
      expect(q('g.zones path.zone'), m).toHaveLength(3);
      expect(q('g.zones path.zone').every(p => p.getAttribute('fill') === 'none'), m).toBe(true);
      expect(q('.zone-label'), m).toHaveLength(0);
    }
    await press(el, '.steps [data-mode="power"]');
    expect(q('g.zones')).toHaveLength(0);
  });

  it('a zone with fewer than 3 outline points shows "—" as its area and gets no label', async () => {
    const empty: Zone = { id: 'empty', name: 'Empty', shape: { kind: 'polygon', vertices: [] }, invalid: true };
    const two: Zone = { id: 'two', name: 'Two', shape: { kind: 'polygon', vertices: [free(100, 100), free(900, 100)] }, invalid: true };
    const { el } = await mountZones([empty, two]);
    expect(text(el, '.zrow[data-id="empty"] .zarea')).toBe('—');
    expect(text(el, '.zrow[data-id="two"] .zarea')).toBe('—');
    expect(text(el, '.zrow[data-id="door"] .zarea')).toBe('1.0');
    const labels = [...el.shadowRoot!.querySelectorAll('svg.plan .zone-label')].map(t => t.textContent!.replace(/\s+/g, ' ').trim());
    expect(labels).toHaveLength(3);
    expect(labels.some(l => l.startsWith('Empty') || l.startsWith('Two'))).toBe(false);
    await press(el, '.zrow[data-id="empty"]');
    expect(text(el, '.zprops [data-field="zone-area"]')).toBe('—');
  });

  it('the selected zone raises only its outline: the fills and labels keep level order, nested labels stay visible', async () => {
    const { el, kitchen } = await mountZones();
    const order = () => [...el.shadowRoot!.querySelectorAll('svg.plan g.zones path.zone')].map(p => p.getAttribute('data-id'));
    expect(order()).toEqual([kitchen, 'door', 'lost']);
    await press(el, `.zrow[data-id="${kitchen}"]`);
    expect(order()).toEqual([kitchen, 'door', 'lost']);
    const raised = el.shadowRoot!.querySelector('svg.plan .zone-overlay path.zone-outline')!;
    expect(raised.getAttribute('data-id')).toBe(kitchen);
    expect(raised.getAttribute('fill')).toBe('none');
    // The overlay is drawn after the zone layer.
    const all = [...el.shadowRoot!.querySelectorAll('svg.plan path.zone, svg.plan path.zone-outline')];
    expect(all[all.length - 1]).toBe(raised);
    expect(el.shadowRoot!.querySelectorAll('svg.plan .zone-label')).toHaveLength(3);
  });
});
