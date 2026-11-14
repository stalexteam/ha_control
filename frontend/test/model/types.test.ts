import { describe, it, expect } from "vitest";
import { emptyPlan, WALL_PRESETS, OPENING_DEFAULT_WIDTH } from "../../src/model/types";
import { newId } from "../../src/model/ids";
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

describe("presets", () => {
  it("has wall and opening presets", () => {
    expect(WALL_PRESETS).toEqual({ bearing: 400, partition: 100, railing: 100, fence: 50 });
    expect(OPENING_DEFAULT_WIDTH.window).toBe(1200);
    expect(OPENING_DEFAULT_WIDTH.gate).toBe(3000);
  });
});

describe("newId", () => {
  it("returns 12 hex chars and differs between calls", () => {
    const a = newId();
    expect(a).toMatch(/^[0-9a-f]{12}$/);
    expect(newId()).not.toBe(a);
  });
});

describe("rectRoomLevel fixture", () => {
  it("builds 4 nodes and 4 bearing center walls", () => {
    const l = rectRoomLevel(4000, 3000, 400);
    expect(l.nodes).toHaveLength(4);
    expect(l.walls).toHaveLength(4);
    expect(l.walls.every((w) => w.type === "bearing" && w.baseline === "center")).toBe(true);
    expect(l.walls.every((w) => w.thickness === 400)).toBe(true);
    const xs = l.nodes.map((n) => n.x);
    const ys = l.nodes.map((n) => n.y);
    expect(Math.min(...xs)).toBe(0);
    expect(Math.max(...xs)).toBe(4000);
    expect(Math.min(...ys)).toBe(0);
    expect(Math.max(...ys)).toBe(3000);
  });
});
