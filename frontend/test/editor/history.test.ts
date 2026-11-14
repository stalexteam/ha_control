import { describe, it, expect } from "vitest";
import { History } from "../../src/editor/history";

describe("History", () => {
  it("undoes and redoes through pushed states", () => {
    const h = new History<string>("s0");
    h.push("s1");
    h.push("s2");
    h.push("s3");
    expect(h.undo()).toBe("s2");
    expect(h.undo()).toBe("s1");
    expect(h.redo()).toBe("s2");
    expect(h.current).toBe("s2");
  });

  it("drops the redo tail on push", () => {
    const h = new History<string>("s0");
    h.push("s1");
    h.push("s2");
    h.push("s3");
    h.undo();
    h.undo();
    h.redo();
    h.push("s4");
    expect(h.current).toBe("s4");
    expect(h.canRedo).toBe(false);
    expect(h.redo()).toBeNull();
  });

  it("returns null when undo is impossible", () => {
    const h = new History<string>("s0");
    expect(h.canUndo).toBe(false);
    expect(h.undo()).toBeNull();
  });

  it("returns null when redo is impossible", () => {
    const h = new History<string>("s0");
    h.push("s1");
    expect(h.canRedo).toBe(false);
    expect(h.redo()).toBeNull();
  });

  it("bounds undo steps by cap, dropping the oldest", () => {
    const h = new History<string>("s0", 2);
    h.push("s1");
    h.push("s2");
    h.push("s3");
    expect(h.undo()).toBe("s2");
    expect(h.undo()).toBeNull();
    expect(h.canUndo).toBe(false);
  });
});
