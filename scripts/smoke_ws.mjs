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
// Subscription events, queued per subscription id until a test step takes them.
const queues = new Map();
const queue = (id) => {
  if (!queues.has(id)) queues.set(id, { items: [], waiters: [] });
  return queues.get(id);
};
const nextEvent = (id, what, ms = 5000) => new Promise((res) => {
  const q = queue(id);
  if (q.items.length) return res(q.items.shift());
  const t = setTimeout(() => fail(`${what}: no event within ${ms} ms`), ms);
  q.waiters.push((e) => { clearTimeout(t); res(e); });
});
ws.onmessage = async (ev) => {
  const m = JSON.parse(ev.data);
  if (m.type === "auth_required") return ws.send(JSON.stringify({ type: "auth", access_token: token }));
  if (m.type === "auth_invalid") return fail("auth invalid");
  if (m.type === "auth_ok") return run().catch((e) => fail(String(e)));
  if (m.type === "result" && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.type === "event") {
    const q = queue(m.id); const w = q.waiters.shift();
    if (w) w(m.event); else q.items.push(m.event);
  }
};
ws.onerror = () => fail("websocket error");
const expectOk = (r, what) => { if (!r.success) fail(`${what}: ${JSON.stringify(r.error)}`); return r.result; };
const eq = (a, b, what) => { if (a !== b) fail(`${what}: expected ${b}, got ${a}`); };
// Key-order independent JSON form, for deep equality of event payloads.
const canon = (v) => Array.isArray(v) ? `[${v.map(canon).join(",")}]`
  : v && typeof v === "object"
    ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`
    : JSON.stringify(v);
const same = (a, b, what) => {
  if (canon(a) !== canon(b)) fail(`${what}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
};
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
  const button = {
    id: `${id}-b`, name: "B", placement: { mode: "free", x: 0, y: 0, rotation: 0 },
    props: { kind: "smart_button" }, invalid: false,
  };
  const withButton = { ...plan, levels: [{ ...level, devices: [button] }] };
  eq(expectOk(await call({ type: "plan_studio/plans/save", plan: withButton, expected_revision: 3 }),
    "save with button").revision, 4, "button revision");
  const sub = await call({ type: "plan_studio/containers/subscribe", plan_id: id });
  expectOk(sub, "containers subscribe");
  same(await nextEvent(sub.id, "first containers event"),
    { full: true, containers: { [`${id}-b`]: { output: "off", fault: "not_configured" } } },
    "first containers event");
  expectOk(await call({ type: "plan_studio/plans/delete", plan_id: id }), "delete");
  same(await nextEvent(sub.id, "containers event after delete"), { full: true, containers: {} },
    "containers event after delete");
  expectOk(await call({ type: "unsubscribe_events", subscription: sub.id }), "unsubscribe");
  const g = await call({ type: "plan_studio/plans/get", plan_id: id });
  if (g.success || g.error.code !== "not_found") fail("expected not_found, got " + JSON.stringify(g));
  console.log("SMOKE OK");
  process.exit(0);
}
