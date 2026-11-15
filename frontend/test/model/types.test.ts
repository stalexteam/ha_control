import { describe, it, expect } from "vitest";
import { addDevice } from "../../src/model/devices";
import {
  DEVICE_PLACEMENTS, deviceDefaults, emptyPlan, normalizeLevel, type Device, type DeviceProps, type Level,
} from "../../src/model/types";
import { rectRoomLevel } from "../fixtures";

describe("emptyPlan", () => {
  it("creates one empty floor level with schemaVersion 1", () => {
    const p = emptyPlan("Flat");
    expect(p.name).toBe("Flat");
    expect(p.schemaVersion).toBe(1);
    expect(p.revision).toBe(0);
    expect(p.levels).toHaveLength(1);
    const l = p.levels[0];
    expect(l.kind).toBe("floor");
    expect(l.order).toBe(0);
    expect(l.nodes).toEqual([]);
    expect(l.walls).toEqual([]);
    expect(l.openings).toEqual([]);
    expect(l.zones).toEqual([]);
  });
});

describe("container kinds", () => {
  it("defaults match the backend", () => {
    expect(deviceDefaults("wall_switch", "wall")).toEqual({
      kind: "wall_switch", autoByDoubleToggle: false, windowSec: 3,
    });
    expect(deviceDefaults("smart_button", "free")).toEqual({
      kind: "smart_button", separateOff: false, autoEnabled: false,
      on: { slot: 0, event: "single" }, off: { slot: 0, event: "hold" }, auto: { slot: 0, event: "double" },
    });
  });
  it("a wall switch goes on a wall only; a smart button on a wall or free", () => {
    expect(DEVICE_PLACEMENTS.wall_switch).toEqual(["wall"]);
    expect(DEVICE_PLACEMENTS.smart_button).toEqual(["wall", "free"]);
  });
});

describe("normalizeLevel: switch migration", () => {
  const room = (): Level => rectRoomLevel(3000, 4000, 400);
  /** A stored stage-3 `switch` device; its kind and the `action` role no longer exist in the types. */
  const legacy = (id: string, name: string, bindings?: Record<string, string>): Device => ({
    id, name, invalid: false, placement: { mode: "wall", wallId: "w0", side: "right", offset: 500 },
    props: { kind: "switch" } as unknown as DeviceProps,
    ...(bindings ? { bindings: bindings as Device["bindings"] } : {}),
  });

  it("migrates switch with an action binding to a smart button", () => {
    const old = legacy("s1", "Button WC", { action: "sensor.wc", state: "switch.x" });
    const d = normalizeLevel({ ...room(), devices: [old] }).devices[0];
    expect(d.id).toBe("s1");
    expect(d.name).toBe("Button WC");
    expect(d.placement).toEqual(old.placement);
    expect(d.props).toEqual(deviceDefaults("smart_button", "wall"));
    expect(d.bindings).toEqual({ on: "sensor.wc" });
  });

  it("migrates other switches to wall switches", () => {
    const l = normalizeLevel({ ...room(), devices: [legacy("e", "Entry", { state: "switch.e" }), legacy("k", "Kitchen")] });
    const [e, k] = l.devices;
    expect(e.props).toEqual(deviceDefaults("wall_switch", "wall"));
    expect(e.bindings).toEqual({ state: "switch.e" });
    expect(e.name).toBe("Entry");
    expect(k.props).toEqual(deviceDefaults("wall_switch", "wall"));
    expect("bindings" in k).toBe(false);
  });

  it("normalizeLevel drops defaultOutput; final is not an active role", () => {
    const placement = { mode: "wall", wallId: "w0", side: "right", offset: 500 } as const;
    const ws = { id: "w", name: "W", invalid: false, placement,
      props: { ...deviceDefaults("wall_switch", "wall"), defaultOutput: "on" } as unknown as DeviceProps };
    const sb = { id: "b", name: "B", invalid: false, placement,
      props: { ...deviceDefaults("smart_button", "wall"), autoEnabled: true, defaultOutput: "auto" } as unknown as DeviceProps,
      bindings: { on: "sensor.a", auto: "sensor.a", final: "light.x" } as Device["bindings"] };
    const l = normalizeLevel({ ...room(), devices: [ws, sb] });
    expect("defaultOutput" in l.devices[0].props).toBe(false);
    expect("defaultOutput" in l.devices[1].props).toBe(false);
    expect(l.devices[0].props).toEqual(deviceDefaults("wall_switch", "wall"));
    expect(l.devices[1].props).toEqual({ ...deviceDefaults("smart_button", "wall"), autoEnabled: true });
    expect(l.devices[1].bindings).toEqual({ on: "sensor.a", auto: "sensor.a" });
    // Nothing to drop: same object.
    const clean: Level = { ...room(), devices: [
      { ...ws, props: deviceDefaults("wall_switch", "wall") },
      { ...sb, props: { ...deviceDefaults("smart_button", "wall"), autoEnabled: true } as DeviceProps, bindings: { on: "sensor.a" } },
    ] };
    expect(normalizeLevel(clean)).toBe(clean);
  });

  it("is a no-op (same object) for a level without switch devices", () => {
    let l = addDevice(room(), deviceDefaults("wall_switch", "wall"), { mode: "wall", wallId: "w0", side: "right", offset: 500 }, "W").level;
    l = addDevice(l, deviceDefaults("smart_button", "free"), { mode: "free", x: 100, y: 100, rotation: 0 }, "B").level;
    expect(normalizeLevel(l)).toBe(l);
  });
});

describe("normalizeLevel: partial container props", () => {
  const room = (): Level => rectRoomLevel(3000, 4000, 400);
  const placement = { mode: "free", x: 100, y: 100, rotation: 0 } as const;
  const stored = (props: Record<string, unknown>, bindings?: Device["bindings"]): Device => ({
    id: "b", name: "B", invalid: false, placement, props: props as unknown as DeviceProps,
    ...(bindings ? { bindings } : {}),
  });

  it("fills a stored smart button without settings with the defaults", () => {
    const d = normalizeLevel({ ...room(), devices: [stored({ kind: "smart_button" }, { on: "sensor.b" })] }).devices[0];
    expect(d.props).toEqual(deviceDefaults("smart_button", "free"));
    expect(d.bindings).toEqual({ on: "sensor.b" });
  });

  it("keeps valid values and replaces missing or invalid ones, also inside the triggers", () => {
    const d = normalizeLevel({ ...room(), devices: [stored({
      kind: "smart_button", separateOff: "yes", autoEnabled: true,
      on: { slot: 3 }, off: { slot: 12, event: "" }, auto: "double",
    })] }).devices[0];
    expect(d.props).toEqual({
      ...deviceDefaults("smart_button", "free"), autoEnabled: true,
      on: { slot: 3, event: "single" }, off: { slot: 0, event: "hold" }, auto: { slot: 0, event: "double" },
    });
    const w = normalizeLevel({ ...room(), devices: [stored({ kind: "wall_switch", windowSec: 0, autoByDoubleToggle: 1 })] })
      .devices[0];
    expect(w.props).toEqual(deviceDefaults("wall_switch", "free"));
    const w2 = normalizeLevel({ ...room(), devices: [stored({ kind: "wall_switch", windowSec: 2.5 })] }).devices[0];
    expect(w2.props).toEqual(deviceDefaults("wall_switch", "free"));
  });

  it("keeps the same objects when the props are complete", () => {
    const full = { ...deviceDefaults("smart_button", "free"), on: { slot: 1, event: "single_left" } };
    const l: Level = { ...room(), devices: [stored(full)] };
    expect(normalizeLevel(l)).toBe(l);
  });
});

describe("normalizeLevel: climate zoneIds", () => {
  const climate = (props: Record<string, unknown>): Device => ({
    id: "c", name: "C", invalid: false, placement: { mode: "free", x: 100, y: 100, rotation: 0 },
    props: props as unknown as DeviceProps,
  });

  it("drops a stored zoneIds; the other devices keep their objects", () => {
    const other = climate({ kind: "climate_sensor" });
    const l: Level = { ...rectRoomLevel(3000, 4000, 400), devices: [climate({ kind: "climate_sensor", zoneIds: ["z0"] }), other] };
    const n = normalizeLevel(l);
    expect(n.devices[0].props).toEqual({ kind: "climate_sensor" });
    expect(n.devices[1]).toBe(other);
  });

  it("the default climate props have no zoneIds; a level without them is the same object", () => {
    expect(deviceDefaults("climate_sensor", "free")).toEqual({ kind: "climate_sensor" });
    const l: Level = { ...rectRoomLevel(3000, 4000, 400), devices: [climate({ kind: "climate_sensor" })] };
    expect(normalizeLevel(l)).toBe(l);
  });
});
