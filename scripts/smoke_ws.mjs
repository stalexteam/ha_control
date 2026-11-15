// Smoke test for plan_studio websocket API. Env: HA_URL, HA_TOKEN.
const base = (process.env.HA_URL || "").replace(/\/+$/, "");
const token = process.env.HA_TOKEN;
if (!base || !token) { console.error("HA_URL/HA_TOKEN required"); process.exit(1); }
// A throwaway entity the smoke wall switch follows; set and removed through the REST API.
const ENTITY = "binary_sensor.plan_studio_smoke";
const ws = new WebSocket(base.replace(/^http/, "ws") + "/api/websocket");
let nextId = 1;
const pending = new Map();
// What to undo when the run fails half-way: the smoke plan and the smoke entity.
const created = { planId: null, entity: false };
let aborting = false;
// Every check throws; run() rejects and abort() cleans up and exits 1.
const fail = (m) => { throw new Error(m); };
const withTimeout = (p, ms) => Promise.race([p, new Promise((res) => setTimeout(res, ms))]);
// Sets (state) or removes (null) the smoke entity. The token goes only into the header, never into output.
async function setEntity(state) {
  const r = await fetch(`${base}/api/states/${ENTITY}`, {
    method: state === null ? "DELETE" : "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Connection: "close" },
    ...(state === null ? {} : { body: JSON.stringify({ state }) }),
  });
  if (!r.ok) fail(`${state === null ? "remove" : "set"} ${ENTITY}: HTTP ${r.status}`);
  created.entity = state !== null;
}
async function cleanup() {
  if (created.planId && ws.readyState === WebSocket.OPEN) {
    await withTimeout(call({ type: "plan_studio/plans/delete", plan_id: created.planId }), 3000);
  }
  if (created.entity) await withTimeout(setEntity(null).catch(() => undefined), 3000);
}
async function abort(m) {
  if (aborting) return;
  aborting = true;
  console.error("SMOKE FAIL: " + m);
  await cleanup().catch(() => undefined);
  process.exitCode = 1; ws.close();
}
const call = (msg) => new Promise((res) => {
  const id = nextId++; pending.set(id, res); ws.send(JSON.stringify({ ...msg, id }));
});
// Subscription events, queued per subscription id until a test step takes them.
const queues = new Map();
const queue = (id) => {
  if (!queues.has(id)) queues.set(id, { items: [], waiters: [] });
  return queues.get(id);
};
const nextEvent = (id, what, ms = 5000) => new Promise((res, rej) => {
  const q = queue(id);
  if (q.items.length) return res(q.items.shift());
  const waiter = (e) => { clearTimeout(t); res(e); };
  const t = setTimeout(() => {
    q.waiters.splice(q.waiters.indexOf(waiter), 1);
    rej(new Error(`${what}: no event within ${ms} ms`));
  }, ms);
  q.waiters.push(waiter);
});
ws.onmessage = async (ev) => {
  const m = JSON.parse(ev.data);
  if (m.type === "auth_required") return ws.send(JSON.stringify({ type: "auth", access_token: token }));
  if (m.type === "auth_invalid") return abort("auth invalid");
  if (m.type === "auth_ok") return run().catch((e) => abort(e instanceof Error ? e.message : String(e)));
  if (m.type === "result" && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.type === "event") {
    const q = queue(m.id); const w = q.waiters.shift();
    if (w) w(m.event); else q.items.push(m.event);
  }
};
ws.onerror = () => abort("websocket error");
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
  created.planId = id;
  eq(expectOk(await call({ type: "plan_studio/plans/get", plan_id: id }), "get").plan.revision, 1, "get revision");
  eq(expectOk(await save(1), "save 1").revision, 2, "second revision");
  const empty = await call({ type: "plan_studio/plans/save", plan: { ...plan, levels: [] }, expected_revision: 2 });
  if (empty.success || empty.error.code !== "invalid_plan") fail("expected invalid_plan for no levels, got " + JSON.stringify(empty));
  const c = await save(1);
  if (c.success || c.error.code !== "revision_conflict") fail("expected revision_conflict, got " + JSON.stringify(c));
  eq(expectOk(await save(1, true), "force").revision, 3, "forced revision");
  const l = expectOk(await call({ type: "plan_studio/plans/list" }), "list");
  if (!l.plans.some((p) => p.id === id)) fail("list missing id");

  // Containers: a smart button (not configured) and a wall switch on a wall, following the smoke entity.
  const button = {
    id: `${id}-b`, name: "B", placement: { mode: "free", x: 0, y: 0, rotation: 0 }, invalid: false,
    props: {
      kind: "smart_button", separateOff: false, autoEnabled: false,
      on: { slot: 0, event: "single" }, off: { slot: 0, event: "hold" }, auto: { slot: 0, event: "double" },
    },
  };
  const wallSwitch = {
    id: `${id}-w`, name: "W", placement: { mode: "wall", wallId: `${id}-w0`, side: "right", offset: 500 }, invalid: false,
    props: { kind: "wall_switch", autoByDoubleToggle: false, windowSec: 3 },
    bindings: { state: ENTITY },
  };
  const room = {
    ...level,
    nodes: [{ id: `${id}-n1`, x: 0, y: 0 }, { id: `${id}-n2`, x: 3000, y: 0 }],
    walls: [{ id: `${id}-w0`, a: `${id}-n1`, b: `${id}-n2`, thickness: 100, type: "partition", baseline: "center" }],
    devices: [button, wallSwitch],
  };
  await setEntity("off");
  eq(expectOk(await call({ type: "plan_studio/plans/save", plan: { ...plan, levels: [room] }, expected_revision: 3 }),
    "save with containers").revision, 4, "containers revision");
  const sub = await call({ type: "plan_studio/containers/subscribe", plan_id: id });
  expectOk(sub, "containers subscribe");
  same(await nextEvent(sub.id, "first containers event"), {
    full: true,
    containers: {
      [`${id}-b`]: { kind: "smart_button", status: "error", reason: "not_configured" },
      [`${id}-w`]: { kind: "wall_switch", status: "ok" },
    },
  }, "first containers event");
  await setEntity("on");
  // The manual change is a "set on" intent; its time comes from the server, so only its type is checked.
  const turnedOn = await nextEvent(sub.id, "containers event after the entity turned on");
  const at = turnedOn?.containers?.[`${id}-w`]?.last?.at;
  if (typeof at !== "string" || at === "") fail(`intent time: expected a non-empty string, got ${JSON.stringify(at)}`);
  same(turnedOn,
    { full: false, containers: { [`${id}-w`]: { kind: "wall_switch", status: "ok", last: { action: "set", value: "on", at } } } },
    "containers event after the entity turned on");
  expectOk(await call({ type: "plan_studio/plans/delete", plan_id: id }), "delete");
  created.planId = null;
  same(await nextEvent(sub.id, "containers event after delete"), { full: true, containers: {} },
    "containers event after delete");
  expectOk(await call({ type: "unsubscribe_events", subscription: sub.id }), "unsubscribe");
  await setEntity(null);
  const g = await call({ type: "plan_studio/plans/get", plan_id: id });
  if (g.success || g.error.code !== "not_found") fail("expected not_found, got " + JSON.stringify(g));
  console.log("SMOKE OK");
  process.exitCode = 0; ws.close();
}
