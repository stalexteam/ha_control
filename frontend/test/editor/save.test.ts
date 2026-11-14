import { describe, it, expect } from "vitest";
import { SaveController } from "../../src/editor/save";
import { emptyPlan } from "../../src/model/types";
import type { HassLike } from "../../src/api";

function fakeHass(handler: (msg: Record<string, unknown>) => Promise<unknown>) {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    language: "en",
    connection: {
      sendMessagePromise: (msg: Record<string, unknown>) => {
        sent.push(msg);
        return handler(msg);
      },
    },
  } as unknown as HassLike;
  return { hass, sent };
}

describe("SaveController", () => {
  it("saves, sends previous base and updates base revision", async () => {
    const { hass, sent } = fakeHass(async () => ({ revision: 5 }));
    let changes = 0;
    const c = new SaveController(hass, () => changes++);
    c.baseRevision = 4;
    c.markDirty();
    await c.save(emptyPlan("A"));
    expect(sent[0].expected_revision).toBe(4);
    expect(sent[0].force).toBe(false);
    expect(c.baseRevision).toBe(5);
    expect(c.dirty).toBe(false);
    expect(c.state).toBe("saved");
    expect(changes).toBeGreaterThanOrEqual(2);
  });

  it("maps revision_conflict to conflict state", async () => {
    const { hass } = fakeHass(() => Promise.reject({ code: "revision_conflict", message: "x" }));
    const c = new SaveController(hass, () => {});
    c.baseRevision = 1;
    c.markDirty();
    await c.save(emptyPlan("A"));
    expect(c.state).toBe("conflict");
    expect(c.dirty).toBe(true);
  });

  it("overwrite sends force after conflict", async () => {
    let first = true;
    const { hass, sent } = fakeHass(() => {
      if (first) {
        first = false;
        return Promise.reject({ code: "revision_conflict", message: "x" });
      }
      return Promise.resolve({ revision: 9 });
    });
    const c = new SaveController(hass, () => {});
    c.baseRevision = 1;
    const plan = emptyPlan("A");
    await c.save(plan);
    await c.overwrite(plan);
    expect(sent[1].force).toBe(true);
    expect(c.state).toBe("saved");
    expect(c.baseRevision).toBe(9);
  });

  it("saveAsNew uses new id, null expected revision and new name", async () => {
    const { hass, sent } = fakeHass(async () => ({ revision: 1 }));
    const c = new SaveController(hass, () => {});
    c.baseRevision = 7;
    const old = emptyPlan("Old");
    const np = await c.saveAsNew(old, "New");
    const sentPlan = sent[0].plan as { id: string; name: string };
    expect(sent[0].expected_revision).toBeNull();
    expect(sentPlan.id).not.toBe(old.id);
    expect(sentPlan.name).toBe("New");
    expect(np.id).toBe(sentPlan.id);
    expect(np.revision).toBe(1);
    expect(c.baseRevision).toBe(1);
    expect(c.state).toBe("saved");
  });

  it("generic error sets error state and keeps dirty", async () => {
    const { hass } = fakeHass(() => Promise.reject(new Error("Connection lost")));
    const c = new SaveController(hass, () => {});
    c.markDirty();
    await c.save(emptyPlan("A"));
    expect(c.state).toBe("error");
    expect(c.errorMessage).toContain("Connection lost");
    expect(c.dirty).toBe(true);
  });

  it("keeps dirty when markDirty is called during an in-flight save", async () => {
    let resolve!: (v: unknown) => void;
    const { hass } = fakeHass(() => new Promise((r) => (resolve = r)));
    const c = new SaveController(hass, () => {});
    c.markDirty();
    const p = c.save(emptyPlan("A"));
    c.markDirty();
    resolve({ revision: 2 });
    await p;
    expect(c.dirty).toBe(true);
    expect(c.baseRevision).toBe(2);
  });

  it("formats numeric and odd rejections", async () => {
    const cases: [unknown, string][] = [
      [3, "Connection lost"],
      [7, "Connection error 7"],
      ["boom", "boom"],
      [{ code: "invalid_plan" }, "invalid_plan"],
      [{ code: "x", message: "msg" }, "msg"],
    ];
    for (const [rej, expected] of cases) {
      const { hass } = fakeHass(() => Promise.reject(rej));
      const c = new SaveController(hass, () => {});
      await c.save(emptyPlan("A"));
      expect(c.state).toBe("error");
      expect(c.errorMessage).toContain(expected);
    }
  });

  it("does not send a second request while one is in flight", async () => {
    let resolve!: (v: unknown) => void;
    const { hass, sent } = fakeHass(() => new Promise((r) => (resolve = r)));
    const c = new SaveController(hass, () => {});
    const plan = emptyPlan("A");
    const p1 = c.save(plan);
    const p2 = c.save(plan);
    resolve({ revision: 1 });
    await Promise.all([p1, p2]);
    expect(sent.length).toBe(1);
  });

  it("saveAsNew returns null on failure and stores conflict message", async () => {
    const { hass } = fakeHass(() => Promise.reject({ code: "revision_conflict", message: "stale" }));
    const c = new SaveController(hass, () => {});
    expect(await c.saveAsNew(emptyPlan("A"), "B")).toBeNull();
    expect(c.state).toBe("conflict");
    expect(c.errorMessage).toBe("stale");
  });
});
