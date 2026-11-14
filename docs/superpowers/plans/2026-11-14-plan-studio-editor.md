# Plan Studio — Editor (Stage 1): Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** an HA integration `plan_studio` with a full-screen editor panel in which a 2D apartment plan is drawn and saved: walls with nodes and joins, openings/doors/windows in walls, rooms.

**Architecture:** a thin Python integration (config flow, panel registration, JS serving, `Store` + websocket API with revisions). All logic lives in the TypeScript frontend: a pure model and geometry (no DOM, covered by vitest), tools as state machines over the model (also no DOM), and on top — a Lit panel with SVG rendering. A Vite build into a single ES module inside `custom_components/plan_studio/frontend/`.

**Tech Stack:** Python (HA 2026.11 API), TypeScript 5, Lit 3, Vite 6, vitest, `polygon-clipping` (boolean union of polygons), pytest (only for pure Python modules, local Python 3.10 — HA is not installed locally), Node 24 (global `WebSocket` for a smoke test against a live HA).

**Spec:** `docs/superpowers/specs/2026-11-14-ha-floorplan-editor-design.md`

## Global Constraints

- Domain `plan_studio`; working name "Plan Studio".
- HA ≥ 2026.11.0 (`manifest.json` → `"homeassistant": "2026.11.0"` in `hacs.json`).
- Model units are millimeters; coordinates are flat, Y down. Integer mm on user input; internal computations are float.
- Wall presets: `bearing` 400, `partition` 100, `railing` 100, `fence` 50 (fence is not shown in the stage 1 UI).
- Shift = angle lock to global axes 0/90/180/270°.
- Snap grid 100 mm, can be disabled.
- Panel for admins only (`require_admin=True`); websocket: read — any authorized user, write/delete — admin.
- No external servers/CDNs at runtime; lit and polygon-clipping are bundled.
- Interface: English only (owner decision 2026-11-14); no language switching.
- HA areas are not used anywhere.
- The HA token does not go into the repository; the smoke script reads `HA_URL`/`HA_TOKEN` from the environment.
- Deploy to the test HA: SSH `root@<HA_HOST>` (key), `/config/custom_components/plan_studio`, `ha core restart`.
- The plan JSON is stored with camelCase keys (the schema owner is the frontend); `schemaVersion: 1`.

## Review Focus

1. **Length input with space and comma separators** — the user enters `3 450`, `3450`, `3,45`. Expectation: the first two → 3450 mm, `3,45` and other garbage → rejected without creating a wall (test `parseLength` in Task 7).
2. **Double click / zero wall** — a second click at the same point (or within tolerance) does not create a zero-length wall and does not break the chain (test in Task 4 `addWallSegment` and Task 9 wall tool).
3. **Chain closing onto the first node** — a wall brought to the chain's start node reuses that node (rather than creating a duplicate next to it), and a room inside is found (tests Task 4 and Task 6).
4. **Wall crossing without a node (X)** — two walls simply intersect; rendering without artifacts, room search works on all sides (Task 6 test "a cross divides a rectangle into 4 rooms").
5. **Connection loss/HA restart during editing** — saving fails with a connection error; the work stays in the editor, `dirty` is not reset, a message is shown (Task 11 test `saveController` with a rejected promise).

---

## File Structure

```
<project root>/
  .gitignore                       node_modules/, .superpowers/, __pycache__/, *.pyc, .venv/
  package.json  tsconfig.json  vite.config.ts  vitest.config.ts
  hacs.json  README.md
  scripts/deploy.sh                build + tar over ssh + ha core restart
  scripts/smoke_ws.mjs             websocket API smoke test against a live HA
  custom_components/plan_studio/
    __init__.py                    setup entry: static files, panel, ws, store
    manifest.json  const.py  config_flow.py  strings.json
    translations/en.json
    repo.py                        PlanRepo — pure revision logic (no HA imports)
    migrate.py                     migrate_plan — pure schema migrations
    store.py                       PlanStore — Store + PlanRepo
    websocket_api.py               commands plan_studio/plans/*
    frontend/plan-studio-panel.js  BUILT bundle (committed)
  tests/python/test_repo.py  tests/python/test_migrate.py
  frontend/
    src/model/types.ts             model types, presets, defaults
    src/model/ids.ts               newId()
    src/model/ops.ts               pure operations on Level (walls, nodes, box)
    src/model/openings.ts          opening operations and validation
    src/model/zones.ts             room operations + refreshZones
    src/geometry/vec.ts            vector arithmetic
    src/geometry/walls.ts          wall frames, joins, opening cutouts, union
    src/geometry/rooms.ts          room outline search, area
    src/geometry/snap.ts           snaps, ortho, parseLength
    src/editor/history.ts          undo/redo
    src/editor/tools/types.ts      Tool/ToolContext/ToolEvent/Preview interfaces
    src/editor/tools/wall-tool.ts  src/editor/tools/box-tool.ts
    src/editor/tools/opening-tool.ts  src/editor/tools/zone-tool.ts  src/editor/tools/select-tool.ts
    src/editor/save.ts             SaveController (revisions, conflict, errors)
    src/api.ts                     websocket wrappers
    src/i18n.ts                    English dictionary
    src/render/theme.ts            dark/light palettes
    src/render/plan-svg.ts         SVG templates of the level and preview
    src/panel/plan-studio-panel.ts root LitElement (registers <plan-studio-panel>)
    src/panel/toolbar.ts  src/panel/props-panel.ts  src/panel/tracker.ts  src/panel/statusbar.ts
    dev/index.html  dev/mock-hass.ts  test bench for npm run dev without HA (localStorage)
    test/**/*.test.ts
```

---

### Task 1: Repository and integration skeleton, deploy, empty panel in HA

**Files:**
- Create: `.gitignore`, `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `hacs.json`, `README.md`
- Create: `custom_components/plan_studio/{__init__.py,manifest.json,const.py,config_flow.py,strings.json,translations/en.json}`
- Create: `frontend/src/panel/plan-studio-panel.ts` (stub), `scripts/deploy.sh`

**Interfaces:**
- Produces: `const.py`: `DOMAIN = "plan_studio"`, `PANEL_URL_PATH = "plan-studio"`, `STATIC_URL = "/plan_studio_static"`, `PANEL_JS = "plan-studio-panel.js"`, `STORAGE_KEY = "plan_studio.plans"`, `STORAGE_VERSION = 1`. Custom element `<plan-studio-panel>` with properties `hass`, `narrow`, `panel`. `npm run build` → `custom_components/plan_studio/frontend/plan-studio-panel.js`. `scripts/deploy.sh` (env `PLAN_STUDIO_HOST`, required).

- [ ] **Step 1:** `git init` in the project root, `.gitignore` as in the file structure.
- [ ] **Step 2:** `package.json` — deps: `lit@^3`, `polygon-clipping@^0.15`; devDeps: `typescript@^5`, `vite@^6`, `vitest@^2`. Scripts: `build` (vite library mode, entry `frontend/src/panel/plan-studio-panel.ts`, format `es`, fixed fileName `plan-studio-panel.js`, outDir `custom_components/plan_studio/frontend`, `emptyOutDir: false`), `dev` (root `frontend/dev`), `test` (`vitest run`). `npm install`.
- [ ] **Step 3:** `manifest.json`: `domain`, `name: "Plan Studio"`, `version: "0.1.0"`, `config_flow: true`, `dependencies: ["http", "frontend", "panel_custom", "websocket_api"]`, `iot_class: "local_push"`, `codeowners: []`, `documentation`/`issue_tracker` — placeholders. `hacs.json`: `{"name": "Plan Studio", "homeassistant": "2026.11.0"}`.
- [ ] **Step 4:** `config_flow.py` — a `user` step without fields, `async_set_unique_id(DOMAIN)` + `_abort_if_unique_id_configured()` (one entry per instance). Strings in `strings.json`/translations.
- [ ] **Step 5:** `__init__.py` — `async_setup_entry`: `hass.http.async_register_static_paths([StaticPathConfig(STATIC_URL, <dir frontend>, cache_headers=False)])` (register once — a flag in `hass.data[DOMAIN]`), then `panel_custom.async_register_panel(hass, webcomponent_name="plan-studio-panel", frontend_url_path=PANEL_URL_PATH, module_url=f"{STATIC_URL}/{PANEL_JS}?v={version}", sidebar_title="Plan Studio", sidebar_icon="mdi:floor-plan", require_admin=True, config={})`. `async_unload_entry` → `frontend.async_remove_panel(hass, PANEL_URL_PATH)`.
- [ ] **Step 6:** panel stub: LitElement, renders "Plan Studio" and `hass.language`.
- [ ] **Step 7:** `scripts/deploy.sh`:
  ```bash
  set -euo pipefail
  HOST="${PLAN_STUDIO_HOST:?set PLAN_STUDIO_HOST}"
  npm run build
  tar -C custom_components --exclude='__pycache__' -cf - plan_studio | \
    ssh "root@$HOST" 'rm -rf /config/custom_components/plan_studio && tar -C /config/custom_components -xf - && ha core restart'
  ```
- [ ] **Step 8:** Run `bash scripts/deploy.sh`. Expected: the command finishes without errors; after the restart `ssh root@<HA_HOST> 'ls /config/custom_components/plan_studio'` shows the files.
- [ ] **Step 9:** Add the integration entry via REST (token from the developer's HA credentials file, not in the repo): `POST $HA_URL/api/config/config_entries/flow {"handler":"plan_studio"}`. Expected: response `"type": "create_entry"`. A repeated POST → `"type": "abort"`, `"reason": "already_configured"`.
- [ ] **Step 10:** Check that the panel is served: `GET $HA_URL/plan_studio_static/plan-studio-panel.js` → 200; in the HA log (`ssh ... 'ha core logs' | grep -i plan_studio`) there are no errors. Ask the owner to open the "Plan Studio" menu item — the stub is visible.
- [ ] **Step 11:** Commit: `feat: scaffold plan_studio integration with empty admin panel`.

---

### Task 2: Plan storage and websocket API

**Files:**
- Create: `custom_components/plan_studio/{repo.py,migrate.py,store.py,websocket_api.py}`, `tests/python/{test_repo.py,test_migrate.py}`, `scripts/smoke_ws.mjs`
- Modify: `custom_components/plan_studio/__init__.py` (create `PlanStore`, `async_load`, register ws commands)

**Interfaces:**
- Produces (Python): `class RevisionConflict(Exception)`; `class PlanRepo` with `__init__(self, data: dict | None)`, `list() -> list[dict]` (items `{"id","name","revision"}`), `get(plan_id: str) -> dict | None`, `save(plan: dict, expected_revision: int | None, force: bool = False) -> int`, `delete(plan_id: str) -> bool`, `to_dict() -> dict` (format `{"plans": {id: plan}}`). `migrate_plan(plan: dict) -> dict`, `CURRENT_SCHEMA = 1`. `PlanStore(hass)` with `async_load()`, the same methods, where `save`/`delete` are `async` and call `Store.async_save`.
- Produces (WS): `plan_studio/plans/list` → `{"plans": [...]}`; `plan_studio/plans/get {plan_id}` → `{"plan": {...}}` or error `not_found`; `plan_studio/plans/save {plan, expected_revision: int|null, force: bool=false}` → `{"revision": int}` or error `revision_conflict` / `invalid_plan`; `plan_studio/plans/delete {plan_id}` → `{}`. save/delete — `@websocket_api.require_admin`.

`PlanRepo.save` rules: the revision is stored in `plan["revision"]`. A new id + `expected_revision is None` → revision 1. An existing id: if `force` — revision = old + 1; otherwise `expected_revision` must equal the current one, else `RevisionConflict`. A new id with `expected_revision` not None → `RevisionConflict`. An existing id with `expected_revision is None` and without force → `RevisionConflict`. Validation (`invalid_plan`, `vol.Invalid`): `id` is a non-empty string, `name` is a string, `schemaVersion == 1`, `levels` is a list; plan JSON > 5 MB — reject.

- [ ] **Step 1: Failing tests** `tests/python/test_repo.py`:
  ```python
  def test_new_plan_gets_revision_1():
      r = PlanRepo(None); assert r.save(plan("p1"), None) == 1
      assert r.get("p1")["revision"] == 1
  def test_save_with_current_revision_increments():
      r = PlanRepo(None); r.save(plan("p1"), None)
      assert r.save(plan("p1"), 1) == 2
  def test_stale_revision_conflicts():
      r = PlanRepo(None); r.save(plan("p1"), None); r.save(plan("p1"), 1)
      with pytest.raises(RevisionConflict): r.save(plan("p1"), 1)
  def test_force_overwrites_stale():
      r = PlanRepo(None); r.save(plan("p1"), None); r.save(plan("p1"), 1)
      assert r.save(plan("p1"), 1, force=True) == 3
  def test_existing_id_without_expected_conflicts():
      r = PlanRepo(None); r.save(plan("p1"), None)
      with pytest.raises(RevisionConflict): r.save(plan("p1"), None)
  def test_list_and_delete():
      r = PlanRepo(None); r.save(plan("p1", name="Flat"), None)
      assert r.list() == [{"id": "p1", "name": "Flat", "revision": 1}]
      assert r.delete("p1") is True and r.get("p1") is None and r.delete("p1") is False
  def test_roundtrip_to_dict():
      r = PlanRepo(None); r.save(plan("p1"), None)
      assert PlanRepo(r.to_dict()).get("p1")["revision"] == 1
  ```
  `test_migrate.py`: `migrate_plan({"schemaVersion": 1, ...})` returns the plan unchanged; `schemaVersion` greater than `CURRENT_SCHEMA` → `ValueError`.
- [ ] **Step 2:** Run `python -m pytest tests/python -q`. Expected: FAIL (ImportError). The tests import `repo`/`migrate` via `sys.path` pointing at the integration folder (modules without HA imports).
- [ ] **Step 3:** Implement `repo.py`, `migrate.py` per the rules above; `PlanRepo` runs every loaded plan through `migrate_plan`.
- [ ] **Step 4:** Run `python -m pytest tests/python -q`. Expected: PASS.
- [ ] **Step 5:** `store.py` (`Store(hass, STORAGE_VERSION, STORAGE_KEY)`), `websocket_api.py` (`@websocket_api.websocket_command`, `@websocket_api.async_response`; `RevisionConflict` → `connection.send_error(msg["id"], "revision_conflict", ...)`), wire into `__init__.py`.
- [ ] **Step 6:** `scripts/smoke_ws.mjs` — Node, global `WebSocket`, `HA_URL`/`HA_TOKEN` from env, URL `ws(s)://…/api/websocket`. Scenario with id `smoke-<timestamp>`: save(new) → 1; get → revision 1; save(expected 1) → 2; save(expected 1) → error `revision_conflict`; save(expected 1, force) → 3; list contains the id; delete; get → `not_found`. Prints `SMOKE OK` or the first error and `exit 1`.
- [ ] **Step 7:** Run `bash scripts/deploy.sh`, then `node scripts/smoke_ws.mjs` with `HA_URL` / `HA_TOKEN` loaded from the developer's HA credentials file (not in the repo). Expected: `SMOKE OK`.
- [ ] **Step 8:** Commit: `feat: plan storage with revisions and websocket API`.

---

### Task 3: Model, vectors, i18n, frontend test infrastructure

**Files:**
- Create: `frontend/src/model/types.ts`, `frontend/src/model/ids.ts`, `frontend/src/geometry/vec.ts`, `frontend/src/i18n.ts`, `frontend/test/model/types.test.ts`, `frontend/test/geometry/vec.test.ts`, `frontend/test/fixtures.ts`

**Interfaces:**
- Produces (`types.ts`):
  ```ts
  export type Id = string;
  export interface Pt { x: number; y: number }
  export type WallType = 'bearing' | 'partition' | 'railing' | 'fence';
  export type Baseline = 'center' | 'left' | 'right';   // left = left face when looking from A to B
  export interface PlanNode { id: Id; x: number; y: number; host?: { wallId: Id; offset: number } }
  export interface Wall { id: Id; a: Id; b: Id; thickness: number; type: WallType; baseline: Baseline }
  export type OpeningKind = 'opening' | 'door' | 'window' | 'gate' | 'wicket';
  export type Side = 'left' | 'right';
  export interface Opening { id: Id; wallId: Id; kind: OpeningKind; offset: number; width: number;
    hinge?: 'start' | 'end'; swing?: Side; outside?: Side; invalid: boolean }
  export interface Zone { id: Id; name: string; seed: Pt; outline: Pt[]; broken: boolean }
  export interface Level { id: Id; name: string; kind: 'floor' | 'site'; order: number;
    nodes: PlanNode[]; walls: Wall[]; openings: Opening[]; zones: Zone[] }
  export interface Plan { id: Id; name: string; schemaVersion: 1; revision: number; levels: Level[] }
  export const WALL_PRESETS: Record<WallType, number> = { bearing: 400, partition: 100, railing: 100, fence: 50 };
  export const OPENING_DEFAULT_WIDTH: Record<OpeningKind, number> = { opening: 900, door: 900, window: 1200, gate: 3000, wicket: 1000 };
  export function emptyPlan(name: string): Plan   // one level of kind 'floor', order 0, revision 0
  ```
  `ids.ts`: `newId(): Id` (`crypto.randomUUID()` shortened to 12 hex). `vec.ts`: `add, sub, scale, dot, cross, len, norm, perpLeft (=(d.y, -d.x)), dist, lerp, lineIntersect(p1, d1, p2, d2): Pt | null` (null for parallel, |cross| < 1e-9), `projectT(p, a, b): number` (projection parameter, no clamp), `pointInPolygon(p, ring): boolean`, `polygonArea(ring): number` (signed, shoelace). `i18n.ts`: `t(key: string, _lang?: string): string`, English-only dictionary with keys for all UI labels (filled in as tasks progress).
  `test/fixtures.ts`: `rectRoomLevel(w, d, thickness)` — a level with 4 nodes and 4 `bearing` walls along the axis of the rectangle `(0,0)-(w,d)`, `baseline 'center'`.

- [ ] **Step 1: Failing tests:** `perpLeft({x:1,y:0})` equals `{x:0,y:-1}`; `lineIntersect` of two perpendicular lines gives a point; for parallel — `null`; `polygonArea` of a 1000×1000 square in absolute value = 1e6; `pointInPolygon` inside/outside; `emptyPlan('Flat')` has 1 level with empty arrays and `schemaVersion: 1`; `t('tool.wall','en-GB')` = `'Wall'`, an unknown key returns the key itself.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: plan model types, vector math, i18n`.

---

### Task 4: Wall and node operations

**Files:**
- Create: `frontend/src/model/ops.ts`, `frontend/test/model/ops.test.ts`

**Interfaces:**
- Consumes: Task 3 types; `refreshOpenings(level)` from Task 5 and `refreshZones(level)` from Task 6 — called in `finalize`. Until they exist `finalize` is the identity; Tasks 5/6 add the calls.
- Produces:
  ```ts
  export type Endpoint =                          // snap result (see Task 7 SnapResult)
    | { kind: 'node'; nodeId: Id }
    | { kind: 'wall'; wallId: Id; offset: number }  // a point on the wall axis → T-node
    | { kind: 'free'; pt: Pt };
  export interface WallProps { type: WallType; thickness: number; baseline: Baseline }
  export function nodePos(level: Level, nodeId: Id): Pt
  export function addWallSegment(level: Level, from: Endpoint, to: Endpoint, props: WallProps):
    { level: Level; wallId: Id | null; endNodeId: Id | null }
  export function addBox(level: Level, c1: Pt, c2: Pt, props: WallProps, measure: 'inner' | 'axis' | 'outer'): Level
  export function moveNode(level: Level, nodeId: Id, to: Pt): Level
  export function moveWall(level: Level, wallId: Id, delta: Pt): Level
  export function detachWallEnd(level: Level, wallId: Id, end: 'a' | 'b'): { level: Level; nodeId: Id }
  export function deleteWall(level: Level, wallId: Id): Level
  export function setWallProps(level: Level, wallId: Id, patch: Partial<WallProps>): Level
  export function finalize(level: Level): Level   // recompute T-nodes, openings, rooms
  ```
  All functions are pure: they do not mutate the input and return a new `Level`.

Rules: a T-node (`host`) lies on the axis of the host wall at `offset` from its node A; the position is recomputed in `finalize` on any movement of the host. `moveNode` for a T-node moves it along the host axis (offset = projection, clamped to [0, len]). `addWallSegment`: if `from` and `to` give points closer than 1 mm — nothing is created (`wallId: null`); `kind: 'node'` reuses the node; `kind: 'wall'` creates a T-node; if `kind: 'wall'` points at an offset ≤ 1 mm from a wall end — that wall's end node is used. `addBox` creates 4 nodes and 4 walls `baseline: 'center'`; the rectangle axis: `inner` — expand by `thickness/2`, `outer` — shrink by `thickness/2`. `deleteWall` deletes the wall's openings, nodes without walls, and removes `host` from nodes that hung on it. `moveWall` moves both nodes (neighboring walls follow them).

- [ ] **Step 1: Failing tests:**
  - `addBox(empty, {0,0}, {3000,4000}, bearing400, 'inner')` → 4 walls, nodes at `(-200,-200)`, `(3200,-200)`, `(3200,4200)`, `(-200,4200)`; each node in two walls.
  - the same with `'outer'` → nodes at `(200,200)…(2800,3800)`; with `'axis'` → exactly at the corners.
  - a chain of 3 segments `free→free`, `node→free`, `node→node(start)` → 3 walls, **3 nodes** (closing reuses the start node) — Review Focus 3.
  - `addWallSegment` with `from`/`to` at the same point and at 0.5 mm → `wallId === null`, level unchanged — Review Focus 2.
  - T-node: a partition from `{kind:'wall', wallId: top, offset: 1500}` downward; then `moveWall(top, {0, 500})` → the T-node moved by `y` +500, offset unchanged.
  - `moveNode` of a T-node to a point off the axis → the node is on the host axis, offset = projection, clamped to the length.
  - `moveNode` of a shared box corner → both walls meeting at it changed geometry.
  - `detachWallEnd` → the wall gets a new node at the same point, the neighbor keeps the old one; `moveNode` of the new one does not move the neighbor.
  - `deleteWall` of the host → the T-node loses `host` but remains (a partition is on it); nodes without walls are removed.
  - the input `level` is not mutated (`structuredClone` before and `toEqual` after).
- [ ] **Step 2:** Run `npx vitest run frontend/test/model/ops.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the same. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: wall and node operations with T-junctions`.

---

### Task 5: Wall geometry — frames, joins, cutouts, openings

**Files:**
- Create: `frontend/src/geometry/walls.ts`, `frontend/src/model/openings.ts`, `frontend/test/geometry/walls.test.ts`, `frontend/test/model/openings.test.ts`
- Modify: `frontend/src/model/ops.ts` (`finalize` calls `refreshOpenings`; `moveNode` recomputes the offset of openings of walls whose node A moves)

**Interfaces:**
- Consumes: Task 3, Task 4 (`nodePos`).
- Produces (`walls.ts`):
  ```ts
  export interface WallFrame { a: Pt; b: Pt; dir: Pt; len: number; leftOff: number; rightOff: number }
  // leftOff/rightOff — distance from the axis to the left/right face: center → t/2,t/2; left → 0,t; right → t,0
  export function wallFrame(level: Level, wall: Wall): WallFrame
  export function wallOutlines(level: Level): Map<Id, Pt[]>          // with joins, without cutouts
  export function wallPieces(level: Level): Map<Id, Pt[][]>          // with openings cut out
  export function wallsUnion(level: Level, cutOpenings: boolean): Pt[][][]  // MultiPolygon: [polygon][ring][pt]
  ```
- Produces (`openings.ts`):
  ```ts
  export function addOpening(level: Level, wallId: Id, kind: OpeningKind, centerOffset: number, width?: number):
    { level: Level; openingId: Id | null }
  export function moveOpening(level: Level, id: Id, offset: number): Level
  export function setOpeningProps(level: Level, id: Id, patch: Partial<Pick<Opening,'width'|'kind'|'hinge'|'swing'|'outside'>>): Level
  export function deleteOpening(level: Level, id: Id): Level
  export function refreshOpenings(level: Level): Level   // invalid = goes outside [0,len] or overlaps
  ```

Join algorithm (not unambiguously determined by the tests):
```
For each wall — 4 corners: A-left, A-right, B-left, B-right = ends ± normal·off (square end).
Regular node N with k ≥ 2 walls: for each wall the direction "away from N"; sort by atan2 angle.
  For each neighboring pair (Wi, Wi+1) in a cycle: intersect the face of Wi that faces Wi+1
  with the face of Wi+1 that faces Wi (lineIntersect). The point replaces the corresponding corners of both walls.
  If there is no intersection (collinear) or the point is farther than 3·max(thickness) from N — keep the square end.
T-node (host): the end of each wall at this node is trimmed by the host's face that faces the wall:
  intersect both faces of the wall with that host face line.
Final wall outline: [A-right, B-right, B-left, A-left] (+ the node point N at the "concave" place when k ≥ 3,
  so that there is no gap — insert nodePos between two corner points on the side where they diverge).
Cutouts: for each opening clip the outline with half-planes perpendicular to the axis, at t=offset and t=offset+width
  (Sutherland–Hodgman), leaving the pieces outside the opening intervals.
wallsUnion: polygonClipping.union(...all outlines/pieces).
```
Wall rendering — fill of `wallsUnion` as a single path (`fill-rule: evenodd`) + a stroke of the same color.

- [ ] **Step 1: Failing tests (`walls.test.ts`):**
  - `wallFrame` for `baseline 'left'`, thickness 200 → `leftOff 0`, `rightOff 200`.
  - L-corner of a 400 mm box along the axis: the outer corner of the outline at `(-200,-200)`, the inner at `(200,200)` for the corner at `(0,0)`.
  - T-node: a 100 mm partition coming from above into a 400 mm load-bearing wall with axis `y=3000` → the partition's lower corners at `y = 2800` (host face), not at `3000`.
  - Collinear walls through a shared node → square ends, union is a single rectangle without a gap (area = sum).
  - A 900 opening in a 3000 wall at offset 1000 → `wallPieces` gives 2 pieces with axis lengths 1000 and 1100.
  - `wallsUnion(rectRoomLevel(3000,4000,400), false)` → 1 polygon with 1 hole.
  - A cross without a node (two walls intersect) → union is 1 polygon, no exceptions — Review Focus 4.
- [ ] **Step 2: Failing tests (`openings.test.ts`):**
  - `addOpening(…, 'door', 1500)` in a 3000 wall → offset 1050, width 900.
  - adding an opening that overlaps an existing one → `openingId === null`.
  - adding one that goes past the wall end → `openingId === null`.
  - `moveOpening` into an overlap → level unchanged.
  - `moveNode` of the wall's node A to the left by 500 → the opening's offset grew by 500 (the opening did not move in space).
  - shortening a wall so that the opening does not fit → `invalid: true`, the opening is not deleted.
  - `deleteWall` → the wall's openings are deleted.
- [ ] **Step 3:** Run `npm test`. Expected: FAIL.
- [ ] **Step 4:** Implement.
- [ ] **Step 5:** Run `npm test`. Expected: PASS.
- [ ] **Step 6:** Commit: `feat: wall join geometry and hosted openings`.

---

### Task 6: Rooms

**Files:**
- Create: `frontend/src/geometry/rooms.ts`, `frontend/src/model/zones.ts`, `frontend/test/geometry/rooms.test.ts`
- Modify: `frontend/src/model/ops.ts` (`finalize` calls `refreshZones` last)

**Interfaces:**
- Consumes: `wallsUnion(level, false)` (Task 5), `pointInPolygon`, `polygonArea` (Task 3).
- Produces:
  ```ts
  export function findRoomOutline(level: Level, seed: Pt): Pt[] | null  // the smallest-area hole of the union containing seed
  export function roomAreaM2(outline: Pt[]): number                     // |area| / 1e6, rounded to 0.01
  export function addZone(level: Level, seed: Pt, name: string): { level: Level; zoneId: Id | null }
  export function renameZone(level: Level, id: Id, name: string): Level
  export function deleteZone(level: Level, id: Id): Level
  export function refreshZones(level: Level): Level
  ```
Rules: the union is built **without** opening cutouts (doors do not break the outline). `addZone` → `null` if there is no outline or this outline already has a room. `refreshZones`: for each zone in order — the outline from seed; no outline → `broken: true`, `outline` unchanged; the outline coincides with one already taken by an earlier zone → `broken: true`; otherwise `broken: false`, `outline` new.

- [ ] **Step 1: Failing tests:**
  - `rectRoomLevel(3000,4000,400)` + seed in the center → the outline is the inner face, `roomAreaM2` = `(3000-400)*(4000-400)/1e6` = 9.36.
  - + a partition in the middle → 2 different outlines; a zone on each half.
  - the closed chain from Task 4 (3 walls, a triangle) → outline found — Review Focus 3.
  - a cross without a node inside a rectangle → 4 different outlines — Review Focus 4.
  - a door in a partition does not merge two rooms.
  - deleting the partition after creating two zones → the second zone `broken: true`, the first is intact.
  - deleting a box wall → the zone `broken: true`, `outline` preserved.
  - seed outside the box → `addZone` gives `null`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: room detection with broken-zone tracking`.

---

### Task 7: Snaps, ortho, length input

**Files:**
- Create: `frontend/src/geometry/snap.ts`, `frontend/test/geometry/snap.test.ts`

**Interfaces:**
- Consumes: Task 3, `wallFrame` (Task 5), `Endpoint` (Task 4).
- Produces:
  ```ts
  export interface SnapOpts { tolMm: number; grid: number | null; from?: Pt; ortho: boolean; excludeNodeIds?: Id[] }
  export interface SnapResult { pt: Pt; kind: 'node' | 'mid' | 'wall' | 'grid' | 'none'; endpoint: Endpoint }
  export function snap(level: Level, p: Pt, opts: SnapOpts): SnapResult
  export function orthoConstrain(from: Pt, p: Pt): Pt      // onto the nearest of the axes 0/90/180/270 through from
  export function parseLength(s: string): number | null    // integer mm > 0
  export function pointAlong(from: Pt, towards: Pt, length: number): Pt
  ```
Candidate priority: node > wall midpoint > wall axis (projection) > wall faces (projection; endpoint — `wall` with offset along the axis) > grid > none. If `ortho && from`: first `orthoConstrain`, the node/mid/wall candidates are accepted only if their point is within `tolMm` of the constraining line, the result is projected onto the line. `mid` → `endpoint {kind:'wall', offset: len/2}`. `grid`/`none` → `{kind:'free'}`.

- [ ] **Step 1: Failing tests:**
  - a point 5 mm from a node at `tolMm: 20` → `kind 'node'`, `pt` exactly at the node.
  - a point near a wall midpoint → `kind 'mid'`, offset = len/2.
  - a point 10 mm from the axis within the wall body → `kind 'wall'`, the point on the axis.
  - far from everything, `grid: 100`, `(1234, 567)` → `(1200, 600)`, `kind 'grid'`; `grid: null` → `kind 'none'`, the point unchanged.
  - `orthoConstrain({0,0}, {1000, 120})` → `{1000, 0}`; `({0,0},{-30,-900})` → `{0,-900}`.
  - `ortho: true`, a node nearby that lies off the constraining line farther than `tolMm` → the node is not chosen.
  - `parseLength`: `'3450'`→3450, `'3 450'`→3450, `'3\u00a0450'`→3450, `'0'`→null, `'-5'`→null, `'3,45'`→null, `'abc'`→null, `''`→null — Review Focus 1.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: snapping, ortho lock and length parsing`.

---

### Task 8: History and tool contract

**Files:**
- Create: `frontend/src/editor/history.ts`, `frontend/src/editor/tools/types.ts`, `frontend/test/editor/history.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export class History<T> { constructor(initial: T, cap = 200); get current(): T;
    push(next: T): void; undo(): T | null; redo(): T | null; get canUndo(): boolean; get canRedo(): boolean }
  // tools/types.ts
  export interface ToolEvent { pt: Pt; shift: boolean; alt: boolean; ctrl: boolean }   // pt — mm, without snapping
  export interface ToolContext {
    level(): Level; commit(next: Level): void;            // pushes to History, sets dirty
    tolMm(): number; grid(): number | null;
    wallProps(): WallProps; boxMeasure(): 'inner' | 'axis' | 'outer';
    select(sel: Selection | null): void; lang(): string;
  }
  export type Selection = { kind: 'wall' | 'node' | 'opening' | 'zone'; id: Id };
  export interface Preview { walls?: { a: Pt; b: Pt; props: WallProps }[]; opening?: { wallId: Id; offset: number; width: number; kind: OpeningKind };
    snap?: SnapResult; tracker?: { length: string; angle: string; field: 'length' | 'angle'; at: Pt }; orthoFrom?: Pt }
  export interface Tool { readonly id: 'select' | 'box' | 'wall' | 'door' | 'window' | 'opening' | 'zone';
    down(e: ToolEvent): void; move(e: ToolEvent): void; up(e: ToolEvent): void;
    key(key: string, e: { shift: boolean; ctrl: boolean }): boolean;  // true = consumed
    preview(): Preview; cancel(): void }
  ```
- [ ] **Step 1: Failing tests:** `new History(s0)`; push s1, s2, s3; `undo()`→s2, `undo()`→s1; `redo()`→s2; push s4 → `canRedo === false`. With `cap = 2`: push s1, s2, s3 → the first `undo()` → s2, the second → `null`. `undo()` on a fresh history → `null`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat: undo history and tool contract`.

---

### Task 9: "Wall" and "Box" tools

**Files:**
- Create: `frontend/src/editor/tools/wall-tool.ts`, `frontend/src/editor/tools/box-tool.ts`, `frontend/test/editor/wall-tool.test.ts`, `frontend/test/editor/box-tool.test.ts`, `frontend/test/editor/fake-context.ts`

**Interfaces:**
- Consumes: Task 4 (`addWallSegment`, `addBox`), Task 7 (`snap`, `orthoConstrain`, `parseLength`, `pointAlong`), Task 8.
- Produces: `createWallTool(ctx: ToolContext): Tool` (id `'wall'`), `createBoxTool(ctx: ToolContext): Tool` (id `'box'`). `fake-context.ts`: `fakeContext(level?: Level): ToolContext & { commits: Level[] }` (tolMm 20, grid 100, wallProps partition 100 center, boxMeasure 'inner').

"Wall" behavior: the first `down` fixes the start (snap). `move` — a preview of the segment from the last point to snap(cursor) with `from` = the last point, `ortho = shift`. Digits (`'0'..'9'`, `' '`) and `Backspace` edit the buffer of the current tracker field; `Tab` switches length/angle; `Enter` or `down` commit the segment: if the length buffer is valid — the end = `pointAlong(last, cursor/ortho direction, length)`; if the angle is valid (degrees, 0 = +X, counterclockwise on screen) — the direction is taken from it. After committing, start = end (the `endNodeId` is reused), the buffers are cleared. `down` onto the chain's start node → the segment + the end of the chain. `Escape`: if the buffer is not empty — clear the buffer; otherwise finish the chain. A zero segment is not committed, the chain is not interrupted.

"Box" behavior: `down` — corner 1; `move` — a preview of 4 walls; `down` — corner 2 → `addBox(…, ctx.boxMeasure())`. After corner 1, input `W Tab D Enter` → corner 2 = corner 1 + (±W, ±D), signs by the cursor's quadrant relative to corner 1. Wall type — `ctx.wallProps()` (the toolbar sets bearing when "Box" is selected — Task 10).

- [ ] **Step 1: Failing tests (wall):**
  - click (0,0), click (3000,0), Esc → 1 wall of 3000, `commits.length === 1`.
  - click (0,0); move (2000, 130) with shift; click → the wall is horizontal, end `(2000,0)`.
  - click (0,0); move (1000, 10); input `'3','4','5','0'`, Enter → end `(3450,0)`.
  - input `'3',',','4'` — the comma is not accepted into the buffer (buffer `'34'`).
  - click (0,0) twice at the same point → 0 walls, the chain is active (the next click (1000,0) creates a wall from (0,0)) — Review Focus 2.
  - triangle (0,0)→(3000,0)→(0,3000)→click (5,5) (snap onto the start node) → 3 walls, 3 nodes, the chain is finished — Review Focus 3.
  - Esc with a non-empty buffer clears the buffer, the chain stays alive.
- [ ] **Step 2: Failing tests (box):** two clicks (0,0) and (3000,4000) with `'inner'`, partition 100 → nodes at ±50; input `5000 Tab 3000 Enter` with the cursor in the quadrant (-,+) → corner 2 = (-5000, 3000).
- [ ] **Step 3:** Run → FAIL. **Step 4:** Implement. **Step 5:** Run → PASS.
- [ ] **Step 6:** Commit: `feat: wall chain and box tools`.

---

### Task 10: Opening, zone and select tools

**Files:**
- Create: `frontend/src/editor/tools/opening-tool.ts`, `frontend/src/editor/tools/zone-tool.ts`, `frontend/src/editor/tools/select-tool.ts`, `frontend/src/editor/hit.ts`, tests `frontend/test/editor/{opening-tool,zone-tool,select-tool}.test.ts`

**Interfaces:**
- Consumes: Task 4, 5, 6, 7, 8.
- Produces: `createOpeningTool(ctx, kind: 'door' | 'window' | 'opening'): Tool` (id = kind); `createZoneTool(ctx): Tool`; `createSelectTool(ctx): Tool`; `hitTest(level: Level, p: Pt, tolMm: number, selection: Selection | null): Selection | null` — order: opening > node (only the ends of the selected wall) > wall (a point inside the `wallOutlines` outline or within tol of it) > zone (inside outline).

Behavior: opening — `move` over a wall: a preview centered at the cursor's projection onto the axis; `down` → `addOpening`; on failure (overlap/does not fit) → nothing, the preview is marked. Zone — `down` → `addZone(level, pt, t('zone.default', lang) + ' ' + N)` (N = number of zones + 1), then `select` the new zone. Select — `down` on an object → `select`; dragging a node → `moveNode` (snap with `excludeNodeIds` = this node, shift = ortho from the node's original position); dragging a wall (not by an end) → `moveWall` by the delta (shift = ortho); `alt` + dragging an end of the selected wall → `detachWallEnd` and then like dragging a node; dragging an opening → `moveOpening` (offset = projection − grab offset); each drag is **one** `commit` on `up` (not on every move). `Delete`/`Backspace` → delete the selected (wall/opening/zone).

- [ ] **Step 1: Failing tests:**
  - door: a click in the middle of a 3000 wall → an opening of kind door, offset 1050; a second click at the same place → there is still 1 opening.
  - zone: a click in the center of the box → the zone "Room 1", selected.
  - select: dragging a box corner by (+500,0) → one commit, both walls of the corner changed.
  - select: dragging the body of the top wall by (0,+300) with shift and jitter x=40 → the wall moved strictly along y.
  - select: alt+drag of an end → the neighboring wall is unchanged.
  - select: dragging an opening beyond the wall → the offset did not change (moveOpening rejected it).
  - Delete on a selected wall → the wall and its openings are deleted.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat: opening, zone and select tools`.

---

### Task 11: API, saving, conflicts

**Files:**
- Create: `frontend/src/api.ts`, `frontend/src/editor/save.ts`, `frontend/test/editor/save.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface HassLike { connection: { sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> }; language: string; themes?: { darkMode?: boolean } }
  export interface PlanSummary { id: Id; name: string; revision: number }
  export class RevisionConflictError extends Error {}
  export function listPlans(hass: HassLike): Promise<PlanSummary[]>
  export function getPlan(hass: HassLike, id: Id): Promise<Plan>
  export function savePlan(hass: HassLike, plan: Plan, expectedRevision: number | null, force?: boolean): Promise<number>
  // save.ts
  export type SaveState = 'idle' | 'saving' | 'saved' | 'conflict' | 'error';
  export class SaveController {
    constructor(hass: HassLike, onChange: () => void);
    state: SaveState; errorMessage: string | null; dirty: boolean; baseRevision: number | null;
    markDirty(): void;
    save(plan: Plan): Promise<void>;          // expected = baseRevision; conflict → state 'conflict'
    overwrite(plan: Plan): Promise<void>;     // force
    saveAsNew(plan: Plan, name: string): Promise<Plan>;  // new id, expected null; returns the new plan
  }
  ```
`savePlan` recognizes the HA error (`err.code === 'revision_conflict'`) and throws `RevisionConflictError`. An error of any other nature → `state 'error'`, `errorMessage` from the error, `dirty` is not reset. Success → `baseRevision` = the new revision, `dirty = false`, `state 'saved'`.

- [ ] **Step 1: Failing tests (a fake hass with a controllable `sendMessagePromise`):**
  - a successful save → `dirty false`, `baseRevision` from the response, the sent `expected_revision` = the previous base.
  - an error response `{code:'revision_conflict'}` → `state 'conflict'`, `dirty true`.
  - `overwrite` after a conflict → `force: true` was sent, `state 'saved'`.
  - `saveAsNew` → new id ≠ old, `expected_revision: null`, `name` is the new one.
  - the promise rejected with `new Error('Connection lost')` → `state 'error'`, `errorMessage` contains `Connection lost`, `dirty true` — Review Focus 5.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat: plan API client and save controller with conflict handling`.

---

### Task 12: Rendering and editor panel

**Files:**
- Create: `frontend/src/render/theme.ts`, `frontend/src/render/plan-svg.ts`, `frontend/src/panel/{toolbar.ts,props-panel.ts,tracker.ts,statusbar.ts}`, `frontend/dev/index.html`, `frontend/dev/mock-hass.ts`, `frontend/test/render/plan-svg.test.ts`
- Modify: `frontend/src/panel/plan-studio-panel.ts` (replace the stub), `frontend/src/i18n.ts` (all labels)

**Interfaces:**
- Consumes: everything above.
- Produces: `paletteFor(dark: boolean): PlanPalette` (dark — the "blueprint" from mockup A `look.html`: background `#0b1220`, walls `#cbd5e1`, grid `#1c2840`, selection `#60a5fa`, invalid `#f43f5e`; light — mockup C: background `#f3efe8`, walls `#2b2622`). `renderLevel(level: Level, o: { palette: PlanPalette; selection: Selection | null; preview: Preview; scale: number; lang: string }): SVGTemplateResult`.

Panel (layout — `editor-v2.html`):
- Top: wall type selection (Load-bearing 400 / Partition 100 / Railing 100) + a thickness field; Undo/Redo; the plan name; "Save" with a `SaveState` indicator; on `conflict` — a dialog "Overwrite" / "Save as new" / "Cancel".
- Left: Select, Box, Wall, Door, Window, Opening, Zone. Selecting "Box" switches the wall type to `bearing`.
- Right: properties of the selection — wall (type, thickness, baseline, length read-only), opening (kind, width, offset, hinge/swing for a door, outside side for a window), zone (name, area m², a warning if `broken`); in "Box" mode — an inner face / axis / outer face switch.
- Bottom: hints (`Shift 90°`, `digits — length`, `Tab — angle`, `Esc — finish`) and a 100 mm grid toggle.
- Canvas: SVG over the whole center; viewBox from pan/zoom; wheel — zoom around the cursor; middle button or space+drag — pan; screen → mm via `getScreenCTM().inverse()`; `tolMm = 10 / scale`. The keyboard is listened to on the panel (focus), `Ctrl+Z`/`Ctrl+Y`/`Ctrl+Shift+Z`, `Delete`; the rest go to the active tool.
- Temporary dimensions (spec 5.6): for a selected wall — a length dimension line; for a selected opening — distances to both wall ends and the width; labels in mm with a space as the thousands separator.
- Drawing: walls — `wallsUnion(level, true)` as a fill; windows — two thin lines in the opening in the window color; doors — a leaf + an arc by `hinge`/`swing`; zones — fill + name + area; `broken` zones — `pattern` hatching; `invalid` openings — the invalid color; preview and tracker on top.
- Loading: `listPlans`; empty → `emptyPlan(t('plan.default'))` (not saved, `baseRevision null`); otherwise `getPlan` of the first.
- `beforeunload` when `dirty` → a warning.
- Theme: `hass.themes.darkMode`.
- `dev/mock-hass.ts`: a `HassLike` with `plan_studio/plans/*` in `localStorage` (the same revision rules as `PlanRepo`). `dev/index.html` mounts `<plan-studio-panel>` with the mock.

- [ ] **Step 1: Failing test (`plan-svg.test.ts`; `npm i -D happy-dom`, `// @vitest-environment happy-dom`, render via `render()` from lit into `document.body`):** a box level with a door and a zone → in the SVG exactly one `path.walls`, one `.door` element, text with the zone name and `9.36`; a `broken` zone has `fill="url(#hatch)"`; an `invalid` opening has the class `invalid`; with `selection` = a 3000 wall there is a `.dim` with the text `3 000`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement the rendering. **Step 4:** Run → PASS.
- [ ] **Step 5:** Implement the panel and the test bench. Run `npm run dev`; on the bench go through the Task 13 scenario manually (without deploying). Expected: everything draws, saving to localStorage survives a page reload.
- [ ] **Step 6:** Run `npm test && npm run build`. Expected: tests PASS, the bundle is created, `ls -la custom_components/plan_studio/frontend/plan-studio-panel.js` — a single file.
- [ ] **Step 7:** Commit: `feat: editor panel UI with SVG rendering and dev harness`.

---

### Task 13: Acceptance on a live HA

**Files:**
- Modify: `README.md` (installation by copying/HACS, the deploy script, the smoke test), `manifest.json` (`version` → `0.1.0` if it was changed)

- [ ] **Step 1:** Run `bash scripts/deploy.sh`, then `node scripts/smoke_ws.mjs` (env from the developer's HA credentials file, not in the repo). Expected: `SMOKE OK`; in `ha core logs` there are no `plan_studio` errors.
- [ ] **Step 2:** The owner (or an agent via claude-in-chrome, if available) in HA → "Plan Studio" goes through the scenario: Box 6000×4000 by inner face → a balcony with a railing outside (a chain with Shift and length input) → two partitions with T-nodes → doors in the partitions, windows in the load-bearing walls → three named zones → Save. Expected: walls are joined without gaps, zone areas are plausible, the indicator says "saved".
- [ ] **Step 3:** `ssh root@<HA_HOST> 'ha core restart'`, reopen the panel. Expected: the plan is in place, the same look; editing + saving work (the revision grows).
- [ ] **Step 4:** Open the panel in two tabs, save in the second, then in the first. Expected: a conflict dialog; "Save as new" creates a second plan, the first is untouched.
- [ ] **Step 5:** Commit: `docs: install and dev workflow; stage 1 acceptance`.
