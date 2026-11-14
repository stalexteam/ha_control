// Smoke test for plan_studio websocket API. Env: HA_URL, HA_TOKEN.
const base = (process.env.HA_URL || "").replace(/\/+$/, "");
const token = process.env.HA_TOKEN;
if (!base || !token) { console.error("HA_URL/HA_TOKEN required"); process.exit(1); }
const ws = new WebSocket(base.replace(/^http/, "ws") + "/api/websocket");
let nextId = 1;
const pending = new Map();
const fail = (m) => { console.error("SMOKE FAIL: " + m); process.exit(1); };
const call = (msg) => new Promise((res) => {
  const id = nextId++; pending.set(id, res); ws.send(JSON.stringify({ ...msg, id }));
});
ws.onmessage = async (ev) => {
  const m = JSON.parse(ev.data);
  if (m.type === "auth_required") return ws.send(JSON.stringify({ type: "auth", access_token: token }));
  if (m.type === "auth_invalid") return fail("auth invalid");
  if (m.type === "auth_ok") return run().catch((e) => fail(String(e)));
  if (m.type === "result" && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
ws.onerror = () => fail("websocket error");
const expectOk = (r, what) => { if (!r.success) fail(`${what}: ${JSON.stringify(r.error)}`); return r.result; };
const eq = (a, b, what) => { if (a !== b) fail(`${what}: expected ${b}, got ${a}`); };
async function run() {
  const id = `smoke-${Date.now()}`;
  const level = { id: `${id}-l1`, name: "Level 1", kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [] };
  const plan = { id, name: "Smoke", schemaVersion: 1, levels: [level] };
  const save = (expected_revision, force) =>
    call({ type: "plan_studio/plans/save", plan, expected_revision, ...(force ? { force: true } : {}) });
  eq(expectOk(await save(null), "save new").revision, 1, "new revision");
  eq(expectOk(await call({ type: "plan_studio/plans/get", plan_id: id }), "get").plan.revision, 1, "get revision");
  eq(expectOk(await save(1), "save 1").revision, 2, "second revision");
  const empty = await call({ type: "plan_studio/plans/save", plan: { ...plan, levels: [] }, expected_revision: 2 });
  if (empty.success || empty.error.code !== "invalid_plan") fail("expected invalid_plan for no levels, got " + JSON.stringify(empty));
  const c = await save(1);
  if (c.success || c.error.code !== "revision_conflict") fail("expected revision_conflict, got " + JSON.stringify(c));
  eq(expectOk(await save(1, true), "force").revision, 3, "forced revision");
  const l = expectOk(await call({ type: "plan_studio/plans/list" }), "list");
  if (!l.plans.some((p) => p.id === id)) fail("list missing id");
  expectOk(await call({ type: "plan_studio/plans/delete", plan_id: id }), "delete");
  const g = await call({ type: "plan_studio/plans/get", plan_id: id });
  if (g.success || g.error.code !== "not_found") fail("expected not_found, got " + JSON.stringify(g));
  console.log("SMOKE OK");
  process.exit(0);
}
