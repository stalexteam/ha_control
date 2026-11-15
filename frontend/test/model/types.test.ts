import { describe, it, expect } from "vitest";
import { addDevice } from "../../src/model/devices";
import {
  DEVICE_PLACEMENTS, allowedOutputs, deviceDefaults, emptyPlan, normalizeLevel, type Device, type DeviceProps, type Level,
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
      kind: "wall_switch", autoByDoubleToggle: false, windowSec: 3, defaultOutput: "off",
    });
    expect(deviceDefaults("smart_button", "free")).toEqual({
      kind: "smart_button", separateOff: false, autoEnabled: false,
      on: { slot: 0, event: "single" }, off: { slot: 0, event: "hold" }, auto: { slot: 0, event: "double" },
      defaultOutput: "off",
    });
  });
  it("a wall switch goes on a wall only; a smart button on a wall or free", () => {
    expect(DEVICE_PLACEMENTS.wall_switch).toEqual(["wall"]);
    expect(DEVICE_PLACEMENTS.smart_button).toEqual(["wall", "free"]);
  });
  it("allowedOutputs offers auto only when auto is enabled; nothing for other kinds", () => {
    const ws = deviceDefaults("wall_switch", "wall");
    const sb = deviceDefaults("smart_button", "wall");
    expect(allowedOutputs(ws)).toEqual(["off", "on", "error"]);
    expect(allowedOutputs({ ...ws, autoByDoubleToggle: true } as DeviceProps)).toEqual(["off", "on", "auto", "error"]);
    expect(allowedOutputs(sb)).toEqual(["off", "on", "error"]);
    expect(allowedOutputs({ ...sb, autoEnabled: true } as DeviceProps)).toEqual(["off", "on", "auto", "error"]);
    expect(allowedOutputs(deviceDefaults("socket", "wall"))).toEqual([]);
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

  it("is a no-op (same object) for a level without switch devices", () => {
    let l = addDevice(room(), deviceDefaults("wall_switch", "wall"), { mode: "wall", wallId: "w0", side: "right", offset: 500 }, "W").level;
    l = addDevice(l, deviceDefaults("smart_button", "free"), { mode: "free", x: 100, y: 100, rotation: 0 }, "B").level;
    expect(normalizeLevel(l)).toBe(l);
  });
});
