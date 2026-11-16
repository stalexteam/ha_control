// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { html, render } from 'lit';
import { rectRoomLevel } from '../fixtures';
import {
  activeRoleSpecs, bindingStatus, sanitizeBindings, setBinding, POWER, POWER_IN, POWER_OUT, ROLE_SPECS, VOLTAGE,
  type Presence,
} from '../../src/model/bindings';
import {
  addDevice, addUnplacedDevice, deviceRole, refreshDevices, setDeviceControllable, setDeviceInverter,
} from '../../src/model/devices';
import { deleteWall, mergeNodes, moveNode } from '../../src/model/ops';
import { trimWall } from '../../src/model/trim';
import { deviceAt, devicePose } from '../../src/geometry/devices';
import { deviceZones, zoneMembers } from '../../src/geometry/zones';
import { renderDevices } from '../../src/render/devices-svg';
import { paletteFor } from '../../src/render/theme';
import {
  DEVICE_PLACEMENTS, deviceDefaults, normalizeLevel, type Zone, type Device, type DeviceKind, type Level,
} from '../../src/model/types';

const room = (): Level => rectRoomLevel(3000, 4000, 400);
const present = (): Presence => 'present';
const roles = (d: Device) => activeRoleSpecs(d).map(s => s.role);

/** An equipment device (free, at 1000,1000) with the given flags and bindings. */
const eq = (flags: { inverter?: true; controllable?: true } = {}, bindings?: Device['bindings']): Device => ({
  id: 'e', name: 'E', invalid: false, placement: { mode: 'free', x: 1000, y: 1000, rotation: 0 },
  props: { ...deviceDefaults('equipment', 'free'), ...flags } as Device['props'], ...(bindings ? { bindings } : {}),
});
const ofKind = (kind: DeviceKind, bindings?: Device['bindings']): Device => ({
  id: kind, name: kind, invalid: false, placement: { mode: 'free', x: 0, y: 0, rotation: 0 },
  props: deviceDefaults(kind, 'free'), ...(bindings ? { bindings } : {}),
});
const levelWith = (...devices: Device[]): Level => ({ ...room(), devices });

describe('equipment roles', () => {
  it('the role specs: voltage, input and output power are strict sensor filters', () => {
    expect(VOLTAGE).toEqual({ role: 'voltage', domains: ['sensor'], deviceClasses: ['voltage'], units: ['V', 'kV', 'mV'], primary: false });
    expect(POWER_IN).toEqual({ ...POWER, role: 'power_in' });
    expect(POWER_OUT).toEqual({ ...POWER, role: 'power_out' });
    expect(ROLE_SPECS.equipment.map(s => s.role)).toEqual(['control', 'power', 'voltage', 'power_in', 'power_out']);
    expect(ROLE_SPECS.equipment.every(s => !s.primary)).toBe(true);
  });

  it('active roles without the inverter: control, power, voltage', () => {
    expect(roles(eq())).toEqual(['control', 'power', 'voltage']);
  });

  it('active roles with the inverter: control, voltage, power_in, power_out', () => {
    expect(roles(eq({ inverter: true }))).toEqual(['control', 'voltage', 'power_in', 'power_out']);
  });

  it('a socket keeps control as a required primary role', () => {
    const socket = ROLE_SPECS.socket.find(s => s.role === 'control')!;
    expect(socket.primary).toBe(true);
    expect(bindingStatus(ofKind('socket', { power: 'sensor.p' }), present)).toBe('partial');
    expect(bindingStatus(ofKind('socket'), present)).toBe('unbound');
  });
});

describe('equipment binding status', () => {
  it('nothing bound is bound (a dummy needs nothing)', () => {
    expect(bindingStatus(eq(), present)).toBe('bound');
  });
  it('any one role bound is bound', () => {
    expect(bindingStatus(eq({}, { voltage: 'sensor.v' }), present)).toBe('bound');
    expect(bindingStatus(eq({}, { control: 'switch.x' }), present)).toBe('bound');
  });
  it('a missing entity is missing', () => {
    expect(bindingStatus(eq({}, { control: 'switch.x', power: 'sensor.gone' }),
      e => (e === 'sensor.gone' ? 'missing' : 'present'))).toBe('missing');
  });
});

describe('deviceRole', () => {
  it('power only is a meter', () => expect(deviceRole(eq({}, { power: 'sensor.p' }))).toBe('meter'));
  it('voltage only is a meter', () => expect(deviceRole(eq({}, { voltage: 'sensor.v' }))).toBe('meter'));
  it('input power only is a meter', () => expect(deviceRole(eq({ inverter: true }, { power_in: 'sensor.i' }))).toBe('meter'));
  it('control only is a switch', () => expect(deviceRole(eq({}, { control: 'switch.x' }))).toBe('switch'));
  it('control and output power is a metered switch', () =>
    expect(deviceRole(eq({ inverter: true }, { control: 'switch.x', power_out: 'sensor.o' }))).toBe('metered-switch'));
  it('nothing bound is a dummy', () => expect(deviceRole(eq())).toBe('dummy'));
  it('other kinds have no device role', () => {
    expect(deviceRole(ofKind('ceiling_light', { control: 'light.x' }))).toBeNull();
    expect(deviceRole(ofKind('socket', { control: 'switch.x', power: 'sensor.p' }))).toBeNull();
  });
});

describe('setDeviceInverter', () => {
  it('on: sets the flag and moves power to power_out', () => {
    const l = levelWith(eq({}, { power: 'sensor.p', control: 'switch.x' }));
    const d = setDeviceInverter(l, 'e', true).devices[0];
    expect(d.props).toMatchObject({ kind: 'equipment', inverter: true });
    expect(d.bindings).toEqual({ power_out: 'sensor.p', control: 'switch.x' });
  });
  it('off: removes the flag, moves power_out to power and drops power_in', () => {
    const l = levelWith(eq({ inverter: true }, { power_in: 'sensor.i', power_out: 'sensor.o', voltage: 'sensor.v' }));
    const d = setDeviceInverter(l, 'e', false).devices[0];
    expect('inverter' in d.props).toBe(false);
    expect(d.bindings).toEqual({ power: 'sensor.o', voltage: 'sensor.v' });
  });
  it('round trip on a device with nothing bound keeps it without bindings', () => {
    const l = levelWith(eq());
    const on = setDeviceInverter(l, 'e', true);
    expect(on.devices[0].bindings).toBeUndefined();
    const off = setDeviceInverter(on, 'e', false);
    expect(off.devices[0].bindings).toBeUndefined();
    expect(off.devices[0].props).toEqual(deviceDefaults('equipment', 'free'));
  });
  it('off with only power_in drops the bindings field', () => {
    const d = setDeviceInverter(levelWith(eq({ inverter: true }, { power_in: 'sensor.i' })), 'e', false).devices[0];
    expect(d.bindings).toBeUndefined();
  });
  it('same level when nothing changes: same flag, another kind, unknown id', () => {
    const l = levelWith(eq({ inverter: true }), ofKind('socket'));
    expect(setDeviceInverter(l, 'e', true)).toBe(l);
    const plain = levelWith(eq());
    expect(setDeviceInverter(plain, 'e', false)).toBe(plain);
    expect(setDeviceInverter(l, 'socket', true)).toBe(l);
    expect(setDeviceInverter(l, 'nope', true)).toBe(l);
  });
});

describe('setDeviceControllable', () => {
  it('sets and removes the flag; same level when unchanged or not equipment', () => {
    const l = levelWith(eq({}, { control: 'switch.x' }), ofKind('socket'));
    const on = setDeviceControllable(l, 'e', true);
    expect(on.devices[0].props).toMatchObject({ controllable: true });
    expect(setDeviceControllable(on, 'e', true)).toBe(on);
    const off = setDeviceControllable(on, 'e', false);
    expect('controllable' in off.devices[0].props).toBe(false);
    expect(setDeviceControllable(off, 'e', false)).toBe(off);
    expect(setDeviceControllable(l, 'socket', true)).toBe(l);
  });
});

describe('sanitizing equipment bindings', () => {
  it('drops power_in and power_out without the inverter flag', () => {
    const d = sanitizeBindings(eq({}, { power: 'sensor.p', power_in: 'sensor.i', power_out: 'sensor.o', voltage: 'sensor.v' }));
    expect(d.bindings).toEqual({ power: 'sensor.p', voltage: 'sensor.v' });
  });
  it('keeps power_in and power_out with the inverter flag, and drops power', () => {
    const d = sanitizeBindings(eq({ inverter: true }, { power: 'sensor.p', power_in: 'sensor.i', power_out: 'sensor.o' }));
    expect(d.bindings).toEqual({ power_in: 'sensor.i', power_out: 'sensor.o' });
  });
  it('setBinding accepts voltage, and power_out only with the inverter', () => {
    expect(setBinding(levelWith(eq()), 'e', 'voltage', 'sensor.v').devices[0].bindings).toEqual({ voltage: 'sensor.v' });
    const plain = levelWith(eq());
    expect(setBinding(plain, 'e', 'power_out', 'sensor.o')).toBe(plain);
    expect(setBinding(levelWith(eq({ inverter: true })), 'e', 'power_out', 'sensor.o').devices[0].bindings)
      .toEqual({ power_out: 'sensor.o' });
  });
  it('normalizeLevel drops stored power_in / power_out of a device without the inverter flag', () => {
    const l = normalizeLevel(levelWith(eq({}, { power_out: 'sensor.o', control: 'switch.x' })));
    expect(l.devices[0].bindings).toEqual({ control: 'switch.x' });
  });
});

describe('addUnplacedDevice', () => {
  it('adds an equipment device not on the plan with the free defaults', () => {
    const l = room();
    const { level, id } = addUnplacedDevice(l, 'Device 1');
    expect(level).not.toBe(l);
    expect(level.devices).toHaveLength(1);
    expect(level.devices[0]).toEqual({
      id, name: 'Device 1', invalid: false, placement: { mode: 'none' }, props: deviceDefaults('equipment', 'free'),
    });
  });
  it("'none' is not a pickable placement", () => {
    for (const modes of Object.values(DEVICE_PLACEMENTS)) expect(modes).not.toContain('none');
    expect(DEVICE_PLACEMENTS.equipment).toEqual(['free', 'wall']);
  });
});

describe('an unplaced device is skipped everywhere', () => {
  const zone: Zone = {
    id: 'z', name: 'Z', invalid: false,
    shape: { kind: 'polygon', vertices: [
      { kind: 'free', x: -100000, y: -100000 }, { kind: 'free', x: 100000, y: -100000 },
      { kind: 'free', x: 100000, y: 100000 }, { kind: 'free', x: -100000, y: 100000 },
    ] },
  };
  /** The room, a placed socket on w0 (a control) and the unplaced device `u`. */
  function setup(): { level: Level; id: string } {
    const placed = addDevice(room(), deviceDefaults('socket', 'wall'),
      { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 }, 'S');
    const { level, id } = addUnplacedDevice(placed.level, 'U');
    return { level: { ...level, zones: [zone] }, id };
  }
  const unplaced = (l: Level, id: string) => l.devices.find(d => d.id === id);

  it('has no pose', () => {
    const { level, id } = setup();
    expect(devicePose(level, unplaced(level, id)!)).toBeNull();
  });

  it('is not drawn', () => {
    const { level, id } = setup();
    const host = document.createElement('div');
    render(html`<svg>${renderDevices(level, {
      palette: paletteFor(true), scale: 0.1, selection: { kind: 'device', id }, showCones: true, dim: false,
      bindingStatus: () => 'unbound',
    })}</svg>`, host);
    expect(host.querySelectorAll('g.device')).toHaveLength(1); // the socket only
    expect(host.querySelector(`[data-id="${id}"]`)).toBeNull();
    expect(host.querySelector('.selection-ring')).toBeNull();
  });

  it('is never hit, even with a huge tolerance', () => {
    const only = addUnplacedDevice(room(), 'U').level;
    expect(deviceAt(only, { x: 0, y: 0 }, 1e9)).toBeNull();
    expect(deviceAt(only, { x: 1500, y: 2000 }, 1e9)).toBeNull();
  });

  it('is in no zone', () => {
    const { level, id } = setup();
    expect(zoneMembers(level, 'z').map(m => m.device.id)).not.toContain(id);
    expect(zoneMembers(level, 'z')).toHaveLength(1); // the socket
    expect(deviceZones(level, unplaced(level, id)!)).toEqual([]);
  });

  it('is never flagged invalid', () => {
    const { level, id } = setup();
    const flagged = { ...level, devices: level.devices.map(d => (d.id === id ? { ...d, invalid: true } : d)) };
    expect(unplaced(refreshDevices(flagged), id)!.invalid).toBe(false);
    const fresh = refreshDevices(level);
    expect(unplaced(fresh, id)).toBe(unplaced(level, id)); // unchanged object
  });

  it('survives wall trims, wall deletes, node merges and node moves', () => {
    const { level, id } = setup();
    const keep = (l: Level) => {
      const d = unplaced(l, id);
      expect(d).toBeDefined();
      expect(d!.placement).toEqual({ mode: 'none' });
      expect(d!.invalid).toBe(false);
    };
    keep(trimWall(level, 'w0', { x: 1500, y: 0 }));
    keep(deleteWall(level, 'w0'));
    keep(mergeNodes(level, 'n1', 'n0'));
    keep(moveNode(level, 'n0', { x: -500, y: -500 }));
  });
});

describe('wall-mounted equipment pose', () => {
  // rectRoomLevel(3000, 4000, 400): w0 runs (0,0) -> (3000,0), centre baseline, so its right face is y = 200 and
  // faces +y (into the room); its left face is y = -200 and faces -y.
  const mount = (shape: 'rect' | 'circle', side: 'left' | 'right' = 'right') => {
    const props = { ...deviceDefaults('equipment', 'wall'), shape, width: 800, depth: 300, diameter: 600 } as Device['props'];
    const r = addDevice(room(), props, { mode: 'wall', wallId: 'w0', side, offset: 1500 }, 'E');
    expect(r.deviceId).not.toBeNull();
    return { level: r.level, d: r.level.devices[0] };
  };

  it('a rect 800x300 sits 150 mm off the face along the inward normal, dir along the wall', () => {
    const { level, d } = mount('rect');
    const pose = devicePose(level, d)!;
    expect(pose.pt.x).toBeCloseTo(1500, 9);
    expect(pose.pt.y).toBeCloseTo(350, 9);
    expect(Math.abs(pose.dir.x)).toBeCloseTo(1, 9);
    expect(pose.dir.y).toBeCloseTo(0, 9);
    expect(pose.normal!.x).toBeCloseTo(0, 9);
    expect(pose.normal!.y).toBeCloseTo(1, 9);
  });

  it('on the left face it goes the other way', () => {
    const { level, d } = mount('rect', 'left');
    const pose = devicePose(level, d)!;
    expect(pose.pt.y).toBeCloseTo(-350, 9);
    expect(Math.abs(pose.dir.x)).toBeCloseTo(1, 9);
  });

  it('a circle touches the face: its centre is a radius off', () => {
    const { level, d } = mount('circle');
    expect(devicePose(level, d)!.pt.y).toBeCloseTo(500, 9);
  });

  it('the rect lies flush against the face: hit across its width, not inside the wall', () => {
    const { level, d } = mount('rect');
    expect(deviceAt(level, { x: 1500 + 390, y: 210 }, 0)).toBe(d.id);
    expect(deviceAt(level, { x: 1500 - 390, y: 490 }, 0)).toBe(d.id);
    expect(deviceAt(level, { x: 1500, y: 190 }, 0)).toBeNull(); // inside the wall
    expect(deviceAt(level, { x: 1500, y: 510 }, 0)).toBeNull(); // beyond its depth
    expect(deviceAt(level, { x: 1500 + 410, y: 350 }, 0)).toBeNull(); // beyond its width
  });

  it('is drawn at the body centre, rotated along the wall', () => {
    const { level, d } = mount('rect');
    const host = document.createElement('div');
    render(html`<svg>${renderDevices(level, {
      palette: paletteFor(true), scale: 0.1, selection: { kind: 'device', id: d.id }, showCones: false, dim: false,
    })}</svg>`, host);
    const g = host.querySelector(`g.device[data-id="${d.id}"]`)!;
    expect(g.getAttribute('transform')).toBe('translate(1500 350)');
    const rot = /rotate\((-?[\d.]+)\)/.exec(g.querySelector('g[transform^="rotate"]')!.getAttribute('transform')!)![1];
    expect(Math.abs(Number(rot)) % 180).toBeCloseTo(0, 9);
  });

  it('is a member of the zone around its body centre', () => {
    const { level, d } = mount('rect');
    const inner: Zone = {
      id: 'z', name: 'Z', invalid: false,
      shape: { kind: 'polygon', vertices: [
        { kind: 'free', x: 1000, y: 300 }, { kind: 'free', x: 2000, y: 300 },
        { kind: 'free', x: 2000, y: 400 }, { kind: 'free', x: 1000, y: 400 },
      ] },
    };
    expect(zoneMembers({ ...level, zones: [inner] }, 'z').map(m => m.device.id)).toEqual([d.id]);
  });

  it('other wall devices keep the face point as their pose', () => {
    const r = addDevice(room(), deviceDefaults('socket', 'wall'), { mode: 'wall', wallId: 'w0', side: 'right', offset: 1500 }, 'S');
    const pose = devicePose(r.level, r.level.devices[0])!;
    expect(pose.pt).toEqual({ x: 1500, y: 200 });
    expect(pose.dir.y).toBeCloseTo(1, 9);
  });
});

describe('valve and leak sensor roles', () => {
  it('role specs are exact', () => {
    expect(ROLE_SPECS.leak_sensor).toEqual([{ role: 'leak', domains: ['binary_sensor'], deviceClasses: ['moisture'], primary: true }]);
    expect(ROLE_SPECS.valve).toEqual([{ role: 'state', domains: ['valve', 'switch'], primary: true }]);
  });
});
