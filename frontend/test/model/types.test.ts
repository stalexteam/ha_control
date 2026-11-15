import { describe, it, expect } from "vitest";
import { emptyPlan } from "../../src/model/types";

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
