import { describe, it, expect } from "vitest";
import {
  add, sub, scale, dot, cross, len, norm, perpLeft, dist, lerp,
  lineIntersect, projectT, pointInPolygon, polygonArea,
} from "../../src/geometry/vec";
import { t } from "../../src/i18n";

describe("vec basics", () => {
  it("add/sub/scale/dot/cross/len/dist/lerp", () => {
    expect(add({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({ x: 4, y: 6 });
    expect(sub({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({ x: -2, y: -2 });
    expect(scale({ x: 1, y: -2 }, 3)).toEqual({ x: 3, y: -6 });
    expect(dot({ x: 1, y: 2 }, { x: 3, y: 4 })).toBe(11);
    expect(cross({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(1);
    expect(len({ x: 3, y: 4 })).toBe(5);
    expect(dist({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(lerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5)).toEqual({ x: 5, y: 10 });
  });

  it("norm gives unit vector and handles zero", () => {
    const n = norm({ x: 3, y: 4 });
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
    expect(norm({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
  });

  it("perpLeft is (d.y, -d.x)", () => {
    expect(perpLeft({ x: 1, y: 0 })).toEqual({ x: 0, y: -1 });
  });
});

describe("lineIntersect", () => {
  it("intersects perpendicular lines", () => {
    const p = lineIntersect({ x: 0, y: 5 }, { x: 1, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 1 });
    expect(p).not.toBeNull();
    expect(p!.x).toBeCloseTo(3);
    expect(p!.y).toBeCloseTo(5);
  });

  it("returns null for parallel lines", () => {
    expect(lineIntersect({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 2, y: 0 })).toBeNull();
  });
});

describe("projectT", () => {
  it("projects without clamping", () => {
    expect(projectT({ x: 5, y: 3 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBeCloseTo(0.5);
    expect(projectT({ x: 20, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBeCloseTo(2);
    expect(projectT({ x: -10, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBeCloseTo(-1);
  });
});

describe("polygon", () => {
  const square = [
    { x: 0, y: 0 }, { x: 1000, y: 0 }, { x: 1000, y: 1000 }, { x: 0, y: 1000 },
  ];

  it("polygonArea is signed shoelace", () => {
    expect(Math.abs(polygonArea(square))).toBe(1e6);
    expect(polygonArea(square)).toBe(-polygonArea([...square].reverse()));
  });

  it("pointInPolygon inside/outside", () => {
    expect(pointInPolygon({ x: 500, y: 500 }, square)).toBe(true);
    expect(pointInPolygon({ x: 1500, y: 500 }, square)).toBe(false);
    expect(pointInPolygon({ x: -1, y: -1 }, square)).toBe(false);
  });
});

describe("i18n t()", () => {
  it("returns English", () => {
    expect(t("tool.wall")).toBe("Wall");
  });

  it("returns the key for unknown keys", () => {
    expect(t("no.such.key")).toBe("no.such.key");
  });

  it("seeds tool names", () => {
    const pairs: [string, string][] = [
      ["tool.select", "Select"], ["tool.box", "Box"], ["tool.wall", "Wall"],
      ["tool.door", "Door"], ["tool.window", "Window"], ["tool.opening", "Opening"], ["tool.zone", "Room"],
    ];
    for (const [k, en] of pairs) expect(t(k)).toBe(en);
  });
});
