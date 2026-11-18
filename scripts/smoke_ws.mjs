// Smoke test for plan_studio websocket API. Env: HA_URL, HA_TOKEN.
import { readFileSync } from "node:fs";
const base = (process.env.HA_URL || "").replace(/\/+$/, "");
const token = process.env.HA_TOKEN;
if (!base || !token) { console.error("HA_URL/HA_TOKEN required"); process.exit(1); }
// Throwaway entities, set and removed through the REST API: the smoke wall switch follows ENTITY,
// the smoke schematic's grid reads POWER.
const ENTITY = "binary_sensor.plan_studio_smoke";
const POWER = "sensor.plan_studio_smoke_power";
// The power part keeps a fixed plan id, so its stored transfer position does not pile up per run.
const POWER_PLAN = "plan_studio_smoke";
const ws = new WebSocket(base.replace(/^http/, "ws") + "/api/websocket");
let nextId = 1;
const pending = new Map();
// What to undo when the run fails half-way: the smoke plan and the smoke entities.
const created = { planId: null, entities: new Set() };
let aborting = false;
// Every check throws; run() rejects and abort() cleans up and exits 1.
const fail = (m) => { throw new Error(m); };
const withTimeout = (p, ms) => Promise.race([p, new Promise((res) => setTimeout(res, ms))]);
// Sets (state) or removes (null) a smoke entity. The token goes only into the header, never into output.
async function setEntity(entity, state, attributes) {
  const r = await fetch(`${base}/api/states/${entity}`, {
    method: state === null ? "DELETE" : "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Connection: "close" },
    ...(state === null ? {} : { body: JSON.stringify({ state, ...(attributes ? { attributes } : {}) }) }),
  });
  if (!r.ok) fail(`${state === null ? "remove" : "set"} ${entity}: HTTP ${r.status}`);
  if (state === null) created.entities.delete(entity); else created.entities.add(entity);
}
async function cleanup() {
  if (created.planId && ws.readyState === WebSocket.OPEN) {
    await withTimeout(call({ type: "plan_studio/plans/delete", plan_id: created.planId }), 3000);
  }
  for (const entity of [...created.entities]) await withTimeout(setEntity(entity, null).catch(() => undefined), 3000);
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
  const info = expectOk(await call({ type: "plan_studio/info" }), "info");
  if (typeof info.version !== "string" || !info.version) fail("info: no version");
  // Release guard: the served version is the local manifest's, and the local bundle was built from it.
  const local = (f) => readFileSync(new URL(`../custom_components/plan_studio/${f}`, import.meta.url), "utf-8");
  const manifestVersion = JSON.parse(local("manifest.json")).version;
  if (info.version !== manifestVersion) fail(`info version ${info.version} != manifest ${manifestVersion}`);
  if (!local("frontend/plan-studio-panel.js").includes(`"${manifestVersion}"`)) fail(`bundle was not built for ${manifestVersion}`);
  const id = `smoke-${Date.now()}`;
  const level = { id: `${id}-l1`, name: "Level 1", kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [] };
  const plan = { id, name: "Smoke", schemaVersion: 2, levels: [level] };
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
  await setEntity(ENTITY, "off");
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
  // Rules: the smoke plan has none, so the snapshot is a full frame with no rules.
  const rulesSub = await call({ type: "plan_studio/rules/subscribe", plan_id: id });
  expectOk(rulesSub, "rules subscribe");
  same(await nextEvent(rulesSub.id, "first rules event"), { full: true, rules: {} }, "first rules event");
  expectOk(await call({ type: "unsubscribe_events", subscription: rulesSub.id }), "rules unsubscribe");
  await setEntity(ENTITY, "on");
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
  await setEntity(ENTITY, null);
  const g = await call({ type: "plan_studio/plans/get", plan_id: id });
  if (g.success || g.error.code !== "not_found") fail("expected not_found, got " + JSON.stringify(g));

  // Power: a grid reading the smoke sensor wired to a remainder; every event is a full frame.
  const block = (bid, kind, props = {}) => ({ id: bid, kind, x: 0, y: 0, ...props });
  const wire = (wid, from, to) => ({ id: wid, from, to });
  const setPosition = (position) =>
    call({ type: "plan_studio/power/set_position", plan_id: POWER_PLAN, block_id: "ts", position });
  await setEntity(POWER, "123", { unit_of_measurement: "W" });
  expectOk(await setPosition("A"), "reset transfer position"); // a failed earlier run may have left B
  const gridSchema = {
    blocks: [block("g", "grid", { power: POWER }), block("r", "remainder")],
    wires: [wire("g_r", { block: "g", port: "OUT" }, { block: "r", port: "IN" })],
  };
  const gridSub = await call({ type: "plan_studio/power/subscribe", plan_id: POWER_PLAN, power: gridSchema, devices: {} });
  expectOk(gridSub, "power subscribe");
  same(await nextEvent(gridSub.id, "first power frame"), {
    wires: { g_r: { power: 123, state: "live" } },
    blocks: { g: { power: 123 }, r: { power: 123 } },
  }, "first power frame");
  // A transfer in a second schematic: its position is live state and comes back in the next frame.
  const transferSchema = {
    blocks: [block("g", "grid"), block("ts", "transfer", { form: "2in1out" }), block("r", "remainder")],
    wires: [
      wire("g_ts", { block: "g", port: "OUT" }, { block: "ts", port: "A" }),
      wire("ts_r", { block: "ts", port: "OUT" }, { block: "r", port: "IN" }),
    ],
  };
  const transferSub = await call({
    type: "plan_studio/power/subscribe", plan_id: POWER_PLAN, power: transferSchema, devices: {},
  });
  expectOk(transferSub, "power subscribe (transfer)");
  const atA = await nextEvent(transferSub.id, "first transfer frame");
  eq(atA?.blocks?.ts?.position, "A", "transfer position at start");
  eq(atA?.wires?.ts_r?.state, "live", "transfer output at A");
  expectOk(await setPosition("B"), "set position B");
  const atB = await nextEvent(transferSub.id, "transfer frame after B");
  eq(atB?.blocks?.ts?.position, "B", "transfer position after B");
  eq(atB?.wires?.ts_r?.state, "dead", "transfer output at B (side B unwired)");
  expectOk(await setPosition("A"), "set position back to A");
  eq((await nextEvent(transferSub.id, "transfer frame after A"))?.blocks?.ts?.position, "A", "transfer position back at A");
  // Devices: an inverter's output feeds a through device to a remainder; both read the smoke sensor. The through
  // device's reading wins on the shared wire; power_out is reported only for a device the server takes as an inverter.
  const deviceSchema = {
    blocks: [
      block("g", "grid"), block("inv", "device", { deviceId: "inv" }), block("d", "device", { deviceId: "d" }),
      block("r", "remainder"),
    ],
    wires: [
      wire("g_inv", { block: "g", port: "OUT" }, { block: "inv", port: "IN" }),
      wire("inv_d", { block: "inv", port: "OUT" }, { block: "d", port: "IN" }),
      wire("d_r", { block: "d", port: "OUT" }, { block: "r", port: "IN" }),
    ],
  };
  const devices = {
    inv: { power_out: POWER, inverter: true, controllable: false },
    d: { power: POWER, inverter: false, controllable: false },
  };
  const deviceSub = await call({
    type: "plan_studio/power/subscribe", plan_id: POWER_PLAN, power: deviceSchema, devices,
  });
  expectOk(deviceSub, "power subscribe (devices)");
  same(await nextEvent(deviceSub.id, "first device frame"), {
    wires: {
      g_inv: { power: null, state: "live" },
      inv_d: { power: 123, state: "live" },
      d_r: { power: 123, state: "live" },
    },
    blocks: { g: {}, inv: { power_out: 123, loss: null }, d: { power: 123 }, r: { power: 123 } },
  }, "first device frame");
  expectOk(await call({ type: "unsubscribe_events", subscription: gridSub.id }), "power unsubscribe");
  expectOk(await call({ type: "unsubscribe_events", subscription: transferSub.id }), "power unsubscribe (transfer)");
  expectOk(await call({ type: "unsubscribe_events", subscription: deviceSub.id }), "power unsubscribe (devices)");
  await setEntity(POWER, null);
  console.log("SMOKE OK");
  process.exitCode = 0; ws.close();
}
