# Plan Studio stage 2b (entity binding): implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A wizard-style editor (title-block steps Plan → Equipment → Binding → Automation) with HA-like chrome, where every placed device is bound to Home Assistant entities through role fields. The plan also gains MDI icons for equipment blocks.

**Architecture:**
- Bindings live in the plan (`Device.bindings`). Pure model ops sit in `model/bindings.ts`.
- HA metadata goes through one adapter, `binding/ha-meta.ts`. States come from `hass.states`; the entity, device and area registries are loaded once over websocket when the Binding step opens. There is one path, with no `hass.entities` branching.
- Candidate filtering is pure (`binding/candidates.ts`) and works only by domain, `device_class` and unit, never by names.
- The panel gains a third step, `binding`, with the same left-to-right layout: device list | properties | plan.
- The entity field is a self-contained Lit combobox laid out like HA's entity picker. There is one path: HA's internal `ha-entity-picker` is not used because its availability and API in custom panels are not guaranteed (simplicity review 2026-11-15).

**Tech Stack:** TypeScript 5, Lit 3, Vite, vitest + happy-dom.

**Spec:** `docs/superpowers/specs/2026-11-15-entity-binding-design.md` (builds on the stage 1 and 2a specs in the same folder)

## Global Constraints

- **No name guessing:** never classify or suggest entities by `entity_id` or friendly-name patterns. Text search driven by the user is allowed.
- **No HA areas for placement or binding.** An area appears only as a label ("Area ▸ Device").
- **Strict filter:** an entity matches a role if its domain is in the role's domains AND (the role has no class filter OR its `device_class` is in the role's classes OR (`device_class` is absent AND its unit is in the role's units)). A conflicting `device_class` excludes the entity.
- **Strict lists exclude** registry entries that are hidden, disabled or carry `entity_category` (config or diagnostic). "Show all" keeps the domain filter only and includes those entries.
- **Primary role:**
  - `control` for lights, sockets, the exhaust fan and equipment;
  - `motion`, `illuminance` and `action` for their sensor or switch;
  - for `climate_sensor`, either `temperature` or `humidity`.
- **Status:**
  - Bound: the primary role is set.
  - Partly bound: some role is set but not the primary.
  - Not bound: nothing is set.
  - Missing: a bound entity is in neither states nor the registry, and the registry is loaded. A registry-only, disabled or `unavailable` entity is "unavailable", not missing.
- **Storage:** `Device.bindings?: Partial<Record<BindingRole, string>>`. The field is absent when empty, `schemaVersion` stays 1, and the Python backend is unchanged.
- **Equipment icon:** `props.icon = "mdi:<name>"`. The legacy `symbol` migrates on load: boiler → `mdi:water-boiler`, pc → `mdi:desktop-tower`, automation → `mdi:server`, other → `mdi:cube-outline`. Other kinds keep their drawing symbols.
- **Layout** in every step: rail (tools or device list) | properties | plan. There is no modal.
- **Chrome** uses HA theme variables with fallbacks:
  - `--primary-color` (#03a9f4)
  - `--primary-background-color`
  - `--card-background-color`
  - `--primary-text-color`
  - `--secondary-text-color`
  - `--divider-color`
  - `--ha-card-border-radius` (12px)

  The plan canvas keeps the blueprint palettes A/C.
- **Code limits:** `frontend/src/panel/plan-studio-panel.ts` stays ≤ 400 lines; new logic goes into focused modules. The repository is English only with no Cyrillic. Commit messages are English with no `Co-Authored-By` or attribution trailer.
- **Version** 0.3.0 at the end. Deploy with `PLAN_STUDIO_HOST`; HA credentials come from the environment and are never committed.

## Review Focus

1. **Entity with a conflicting `device_class`:** a battery `%` sensor must never be a humidity candidate. Test in Task 2.
2. **Registries not loaded yet, or the registry fetch fails:** binding fields still work from `hass.states`, nothing is flagged Missing, and a notice explains the failure. Tests in Task 2 and Task 6.
3. **A bound entity deleted from HA:** Missing, kept, never auto-removed. A disabled or unavailable entity is "unavailable", not Missing. Tests in Task 1 and Task 2.
4. **Registry not loaded yet** (first render): no device is flagged Missing. Test in Task 2 (`presence` returns `'unknown'`).
5. **A large HA instance** (3000 entities): the combobox renders at most 100 rows and filters by search; candidate lists are memoised. Test in Task 5.

---

## File structure

```
frontend/src/model/types.ts            + BindingRole, Device.bindings, equipment props.icon (symbol removed), normalizeLevel migrations
frontend/src/model/bindings.ts         NEW ROLE_SPECS, setBinding, bindingStatus, roleCount, alsoBoundTo, sanitizeBindings
frontend/src/binding/ha-meta.ts        NEW HA metadata adapter (hass.* or websocket fallback), presence()
frontend/src/binding/candidates.ts     NEW candidates(), haDevicesFor(), autoFill(), entityLabel()
frontend/src/binding/entity-combo.ts   NEW <ps-entity-combo> (self-contained, HA-entity-picker layout)
frontend/src/panel/steps.ts            NEW title-block wizard header (renderSteps), step status, Back/Next targets
frontend/src/panel/binding-list.ts     NEW device list rail: Not bound / Bound / All + search
frontend/src/panel/binding-props.ts    NEW binding properties panel
frontend/src/editor/tools/binding-select-tool.ts  NEW selection-only tool for the binding step
frontend/src/panel/{tool-factory,side-panel,toolbar,styles,plan-studio-panel,device-props}.ts, render/{plan-svg,devices-svg}.ts, i18n.ts   integration
```

## Code changes since this plan was written (simplification pass, main @ 9e8fce0)

Use these current APIs; they replace anything older in the task texts:
- **No `lang` anywhere.** `t(key)` takes one argument. Remove `lang` from every Opts or signature in this plan (`renderSteps`, `renderBindingList`, `renderBindingProps`), and do not add `lang` fields.
- **Deleting goes through one path:** `deleteSelection` in `plan-studio-panel.ts` handles Delete and Backspace; tools no longer delete. Task 3 must gate it by mode: in `binding` mode Delete and Backspace do nothing. Add a panel-level test for both keys.
- **Form fields live in `frontend/src/panel/fields.ts`:** `row`, `select`, `numField`, and focus-safety through `fieldValue`. Number parsing is `parseWhole(s, {min, max, signed})` in `frontend/src/geometry/parse.ts`. Use these for every new field and do not write new parsers.
- **Dialogs are a single `Dialog | null` union** with one `renderDialog`. Binding needs no dialogs.
- **User-visible error text** comes from `messageOf(err)` in `frontend/src/errors.ts`. Use it for the registry-load notice.
- **Helpers to reuse:**
  - `ToolContext.scale()`; there is no `ctx.lang()`. Express pixel thresholds as `PX / ctx.scale()`.
  - Kind capability sets live in `model/types.ts`, for example `AIM_KINDS` and `AIM_MAX`. Add `ROLE_SPECS` alongside them, or in `model/bindings.ts`.
  - `nextFreeName` in `model/ids.ts`.
  - `emptyLevel()` in `model/types.ts`.
  - `render/shared.ts`: `ringD` and `cached` (a WeakMap keyed by level).
- **No host adapters.** `input-host.ts` is gone and the panel implements `InputHost` directly. Side-panel and session hosts are the panel class, or a `Pick` of it. New step and binding code should read panel fields through such a `Pick`; do not add new host interfaces.
- **Task 4:** `EQUIPMENT_SYMBOLS` is now exported from `panel/device-props.ts` and used by the i18n key test, which checks every member of `symbol.*`. When `symbol` becomes `icon`, remove `EQUIPMENT_SYMBOLS` and the `symbol.*` keys, and update `frontend/test/i18n.test.ts` to match.
- **The i18n key-existence test** (`frontend/test/i18n.test.ts`) fails on any unknown `t('…')` literal. Every new UI string must be added to `i18n.ts` in the same commit.
- **Keep `plan-studio-panel.ts` small.** It must stay ≤ 400 lines; it is about 300 now.

---

### Task 1: Binding model

**Files:**
- Modify: `frontend/src/model/types.ts`
- Create: `frontend/src/model/bindings.ts`
- Test: `frontend/test/model/bindings.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // types.ts
  export type BindingRole = 'control' | 'motion' | 'illuminance' | 'temperature' | 'humidity' | 'action' | 'state' | 'power';
  // Device gains: bindings?: Partial<Record<BindingRole, string>>
  // bindings.ts
  export interface RoleSpec { role: BindingRole; domains: string[]; deviceClasses?: string[]; units?: string[]; primary: boolean }
  export const ROLE_SPECS: Record<DeviceKind, RoleSpec[]>;       // per spec section 4 table
  export const PRIMARY_MODE: Partial<Record<DeviceKind, 'any'>>;  // climate_sensor: 'any' (else all primaries required)
  export type Presence = 'present' | 'unavailable' | 'missing' | 'unknown';
  export type BindStatus = 'bound' | 'partial' | 'unbound' | 'missing';
  export function setBinding(level: Level, deviceId: Id, role: BindingRole, entityId: string | null): Level;
  export function bindingStatus(d: Device, presence: (eid: string) => Presence): BindStatus;
  export function roleCount(d: Device): { filled: number; total: number };
  export function alsoBoundTo(level: Level, entityId: string, exceptDeviceId: Id): Device[];
  export function sanitizeBindings(d: Device): Device;   // drops roles invalid for the kind and empty strings; removes the field when empty
  ```
- `ROLE_SPECS` values:
  - ceiling_light and wall_light: `control` [light, switch], primary.
  - motion_sensor: `motion` [binary_sensor], classes [occupancy, motion, presence], primary.
  - illuminance_sensor: `illuminance` [sensor], classes [illuminance], units [lx], primary.
  - climate_sensor:
    - `temperature` [sensor], classes [temperature], units [°C, °F], primary;
    - `humidity` [sensor], classes [humidity], units [%], primary.
  - switch:
    - `action` [event, sensor], primary;
    - `state` [switch, light, binary_sensor].
  - socket:
    - `control` [switch], primary;
    - `power` [sensor], classes [power], units [W, kW].
  - exhaust_fan: `control` [switch, fan], primary.
  - equipment:
    - `control` [switch], primary;
    - `power` as for socket.
- Status rules:
  - `missing` wins when any bound entity has presence `missing`.
  - Bound: every primary is set, or for `PRIMARY_MODE 'any'` at least one primary.
  - Partial: some role is set but the primary rule fails.
  - Unbound: nothing is set.
  - `unknown` and `unavailable` count as set.
- `normalizeLevel` also applies `sanitizeBindings` to every device.

- [ ] **Step 1: Failing tests:**
  - `setBinding(socket, 'control', 'switch.x')` stores the binding; the same value again returns the same level object. `null` removes the role, and the field disappears when empty.
  - `setBinding` with role `motion` on a socket returns the same level.
  - Status:
    - socket with control only → bound;
    - socket with power only → partial;
    - nothing → unbound;
    - climate with humidity only → bound;
    - motion whose entity presence is `missing` → missing;
    - presence `unavailable` or `unknown` → still bound.
  - `roleCount(socket with control)` → {1, 2}.
  - `alsoBoundTo` finds the other device bound to the same entity.
  - `normalizeLevel` drops `bindings: { motion: 'x' }` from a socket. Review Focus 3: nothing is ever auto-removed for presence reasons, because the status does not mutate.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** `npm test`, `npx tsc --noEmit -p .` → PASS.
- [ ] **Step 5:** Commit `feat: device binding model`.

---

### Task 2: HA metadata adapter and candidate engine

**Files:**
- Create: `frontend/src/binding/ha-meta.ts`, `frontend/src/binding/candidates.ts`
- Modify: `frontend/src/api.ts` (extend `HassLike` with optional `states`)
- Test: `frontend/test/binding/ha-meta.test.ts`, `frontend/test/binding/candidates.test.ts`, `frontend/test/binding/fixtures.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface EntityMeta { entityId: string; domain: string; name: string; state: string; deviceClass: string | null; unit: string | null;
    deviceId: string | null; areaId: string | null; hidden: boolean; disabled: boolean; category: string | null; icon: string | null }
  export interface DeviceMeta { id: string; name: string; model: string | null; areaId: string | null }
  export interface HaMeta { entities: Map<string, EntityMeta>; devices: Map<string, DeviceMeta>; areas: Map<string, string>; registryLoaded: boolean }
  export function metaFromStates(states: Record<string, unknown> | undefined): HaMeta;   // from hass.states; registryLoaded = false
  export async function loadRegistries(hass: HassLike): Promise<Pick<HaMeta, 'entities' | 'devices' | 'areas'>>;  // one websocket load
  export function mergeMeta(states: HaMeta, regs: Pick<HaMeta, 'entities' | 'devices' | 'areas'>): HaMeta;   // registryLoaded = true
  export function presence(meta: HaMeta, eid: string): Presence;   // unknown if !registryLoaded and no state
  // candidates.ts
  export function candidates(meta: HaMeta, spec: RoleSpec, showAll: boolean): EntityMeta[];  // sorted by name, then entityId; memoised per (meta, spec, showAll)
  export function haDevicesFor(meta: HaMeta, kind: DeviceKind): DeviceMeta[];                 // devices with ≥1 strict candidate for any role of the kind
  export function autoFill(level: Level, deviceId: Id, haDeviceId: string, meta: HaMeta): { level: Level; filled: BindingRole[]; ambiguous: BindingRole[] };
  export function entityLabel(meta: HaMeta, eid: string): { name: string; context: string };  // context "Area ▸ Device" (area from entity, else device)
  ```
- `loadRegistries` calls the admin websocket commands `get_states`, `config/entity_registry/list`, `config/device_registry/list` and `config/area_registry/list`. The panel is admin-only, so these are allowed. Registry entries map to: `hidden_by` → hidden, `disabled_by` → disabled, `entity_category` → category, `icon ?? original_icon` → icon.
- Presence:
  - `present`: a state exists and is not `unavailable`.
  - `unavailable`: the state is `unavailable`, or the entity is in the registry (disabled or without a state).
  - `missing`: neither, and `registryLoaded` is true.
  - `unknown`: otherwise.

- [ ] **Step 1: Failing tests** (fixture meta: a humidity sensor (dc humidity, %), a battery sensor (dc battery, %), a classless `%` sensor, a power sensor (dc power, W), a classless `W` sensor, a diagnostic power sensor, a hidden light, occupancy and door binary sensors, an event, and a HA device owning a temperature and a humidity sensor):
  - humidity strict candidates = {humidity, classless %}; the battery sensor is excluded (Review Focus 1);
  - power strict excludes the diagnostic sensor, and showAll includes it;
  - control for a light excludes the hidden light, and showAll includes it;
  - motion includes occupancy and excludes door;
  - `autoFill` on a climate sensor with that HA device fills both roles. A HA device with two power sensors leaves `power` in `ambiguous`. A filled role is never overwritten;
  - `haDevicesFor('climate_sensor')` contains the device;
  - `entityLabel` gives "Main ▸ Sensor WC" style context, and the entity id when there is no device or area;
  - `presence`:
    - an existing state → present;
    - state `unavailable` → unavailable;
    - registry-only → unavailable;
    - unknown id with the registry loaded → missing;
    - unknown id without the registry → unknown (Review Focus 4);
  - `metaFromStates` → `registryLoaded false`, and states-only candidates still work. `mergeMeta` with registries → true (Review Focus 2);
  - `loadRegistries` with a fake `sendMessagePromise` maps the fields as specified.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run `npm test` and tsc → PASS.
- [ ] **Step 5:** Commit `feat: HA metadata adapter and binding candidate engine`.

---

### Task 3: Wizard shell, HA-like chrome, binding step skeleton

**Files:**
- Create: `frontend/src/panel/steps.ts`, `frontend/src/panel/binding-list.ts`, `frontend/src/editor/tools/binding-select-tool.ts`
- Modify:
  - `frontend/src/panel/tool-factory.ts`: `EditorMode` += `'binding'`, `BINDING_TOOL_IDS = ['binding-select']`;
  - `frontend/src/editor/tools/types.ts`: Tool id += `'binding-select'`;
  - `frontend/src/panel/toolbar.ts`: replace the tab switch with the steps;
  - `frontend/src/panel/styles.ts`: HA variables;
  - `frontend/src/panel/plan-studio-panel.ts`, `side-panel.ts`;
  - `frontend/src/render/plan-svg.ts` and `devices-svg.ts`: binding overlay;
  - `frontend/src/i18n.ts`.
- Test: `frontend/test/panel/steps.test.ts`, `frontend/test/panel/binding-list.test.ts`, `frontend/test/editor/binding-select-tool.test.ts`, `frontend/test/render/binding-overlay.test.ts`

**Interfaces:**
- `renderSteps(o: { mode: EditorMode; level: Level; status: (d: Device) => BindStatus; onMode(m: EditorMode): void; onNextUnbound(): void }): TemplateResult`.
  - Cells:
    - title (plan name and "Plan Studio");
    - 1 Plan: "N walls, M rooms", done when walls > 0 and zones > 0;
    - 2 Equipment: "N devices", done when devices > 0;
    - 3 Binding: "B of N bound", done when N > 0 and all are bound;
    - 4 Automation: "Comes later", disabled.
  - Each cell is a button that sets the mode; the current one is underlined in `--primary-color`.
  - Back and Next are labelled with their target: "Back: Plan", "Next: Equipment", "Next: Binding". In Binding, Back is "Back: Equipment" and Next is "Next unbound device".
- `nextUnbound(level: Level, currentId: Id | null, status): Id | null`: the next device in list order whose status is not `bound`, wrapping around. It lives in `binding-list.ts`.
- `renderBindingList(o: { level; selection; status; filter: 'unbound' | 'bound' | 'all'; query: string; onFilter; onQuery; onPick(id) }): TemplateResult`:
  - A segmented "Not bound / Bound / All" control with counts. Partial and missing count as "Not bound".
  - A search input over name and kind.
  - Rows show a status dot (dashed = unbound, amber = partial, red = missing, filled = bound), the name, the kind, and "filled/total".
  - Empty states: "Every device is bound." / "No bound devices yet." / "No devices match this filter."
- `createBindingSelectTool(ctx): Tool` (id `binding-select`): `down` → `deviceAt` → `ctx.select({kind:'device', id})`, or null. No drag, no delete. Esc → select null.
- `RenderOpts.mode` += `'binding'`, which dims walls, openings and rooms as in equipment. `RenderOpts.bindingStatus?: (d: Device) => BindStatus` draws a ring per device: `.bind-unbound` dashed `--secondary-text-color`, `.bind-partial` #f59e0b, `.bind-missing` #f43f5e. Radius = ICON_PX·1.7/scale.
- Chrome (styles.ts):
  - The top bar, rail, properties panel, buttons and inputs use the HA variables listed under Global Constraints with fallbacks.
  - The steps are styled as a title block: cells separated by `--divider-color` rules, tabular numerals, sentence case, no all-caps.
- The left rail in binding mode = `renderBindingList`. The properties panel shows a placeholder text until Task 6.
- Delete in binding mode does nothing.

- [ ] **Step 1: Failing tests:**
  - `steps.test.ts`: statuses read "15 walls, 6 rooms" style. Clicking the "Binding" cell switches mode. In binding, Next calls onNextUnbound. Automation is disabled.
  - `binding-list.test.ts`: the filter counts are correct, search narrows the rows, the empty state texts are right, and `nextUnbound` wraps around.
  - `binding-select-tool.test.ts`: a click selects a device, a click on empty space clears, there are no commits, and Delete returns false.
  - `binding-overlay.test.ts`: in binding mode each device gets its status ring class, and no ring appears in the other modes.
  - Panel: the mode buttons cycle plan → equipment → binding, and in binding the layout order is list | props | canvas.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** `npm test`, tsc → PASS; panel ≤ 400 lines.
- [ ] **Step 5:** Commit `feat: wizard steps, HA-like chrome and binding step skeleton`.

---

### Task 4: Equipment icons from MDI

**Files:**
- Modify: `frontend/src/model/types.ts`, `frontend/src/panel/device-props.ts`, `frontend/src/render/devices-svg.ts`, `frontend/src/i18n.ts`
- Test: `frontend/test/model/equipment-icon.test.ts`, `frontend/test/render/equipment-icon.test.ts`, panel test in `frontend/test/panel/equipment.test.ts`

**Interfaces:**
- The equipment `DeviceProps` changes `symbol` to `icon: string`, default `'mdi:cube-outline'`. `normalizeLevel` migrates a legacy `symbol` using the Global Constraints map and drops `symbol`.
- Props field: `ha-icon-picker` when `customElements.get('ha-icon-picker')`, listening for `value-changed`. Otherwise a text input that requires `^mdi:[a-z0-9-]+$` and shows the props.badIcon notice when the value doesn't match. The field is focus-safe and does nothing when unchanged.
- Render: inside the block, a `<foreignObject>` centred, sized `24/scale` mm square, containing `<ha-icon icon=…>` when `customElements.get('ha-icon')`. Otherwise a bundled fallback glyph: a `cube-outline` path. Class `equipment-icon`.

- [ ] **Step 1: Failing tests:** each of the four legacy symbols migrates to its MDI icon; `symbol` is removed; an already-migrated level returns the same object; a fresh equipment default is `mdi:cube-outline`; `mdi:water-boiler` is stored; `water-boiler` without the prefix shows a notice and is not stored; render emits `.equipment-icon` (the fallback path in happy-dom).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** `npm test`, tsc → PASS.
- [ ] **Step 5:** Commit `feat: MDI icons for equipment blocks`.

---

### Task 5: Entity combobox (single self-contained implementation)

**Files:**
- Create: `frontend/src/binding/entity-combo.ts`
- Test: `frontend/test/binding/entity-combo.test.ts`

**Interfaces:**
- `<ps-entity-combo>` (LitElement), properties:
  - `meta: HaMeta`
  - `items: EntityMeta[]`: already filtered candidates
  - `value: string | null`
  - `label: string`
- It fires `value-changed` with `{ value: string | null }`.
- **Closed:**
  - a domain or device-class icon (bundled MDI paths for power, temperature, humidity, motion, illuminance, light, switch, event, fan, generic);
  - the name, plus `entityLabel().context` underneath;
  - a ✕ that clears;
  - a ▾ that opens.

  Open:
  - a search field (focused), then rows with icon, name, context, the domain label ("Sensor", "Binary sensor", "Light", "Switch", "Fan", "Event") and the current state with unit;
  - at most 100 rows rendered;
  - the search matches name, entity id and context;
  - the keyboard works: arrows move, Enter picks, Esc closes;
  - a click outside closes.

  A value not in `items` (for example missing) still shows its id in the closed box.

- [ ] **Step 1: Failing tests** (happy-dom):
  - the closed box shows name and context;
  - opening shows a search field and rows;
  - typing "wc" filters;
  - a click on a row fires `value-changed` with its id;
  - ✕ fires `null`;
  - Esc closes;
  - with 3000 items, at most 100 `.opt` rows render (Review Focus 5);
  - a missing value shows its id.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run `npm test` and tsc → PASS.
- [ ] **Step 5:** Commit `feat: entity combobox with native HA picker support`.

---

### Task 6: Binding properties panel, wiring, release

**Files:**
- Create: `frontend/src/panel/binding-props.ts`
- Modify: `frontend/src/panel/side-panel.ts`, `plan-studio-panel.ts`, `frontend/src/i18n.ts`, `README.md`, `custom_components/plan_studio/manifest.json` (0.3.0), the bundle
- Test: `frontend/test/panel/binding.test.ts`

**Interfaces:**
- `renderBindingProps(o: { level; device: Device | null; meta: HaMeta; status; showAll: Record<string, boolean>; onShowAll(key); commit(next: Level); onNextUnbound(); notice; setNotice }): TemplateResult`.
- With no device: the text "Pick a device on the plan or in the list, or press Next unbound device", plus the button.
- With a device:
  - a header with name and kind;
  - "Home Assistant device", a select of `haDevicesFor(meta, kind)`. Choosing one runs `autoFill`, commits once, and sets a notice "Filled: …; several matches for: …" when anything is ambiguous;
  - per role, the label ("Control", "Motion", "Illuminance", "Temperature", "Humidity", "Button events", "State", "Power") with a "Show all" toggle and a `<ps-entity-combo>` fed by `candidates(meta, spec, showAll)`. Its `value-changed` → `setBinding` → commit;
  - under each field:
    - for a missing entity: "This entity is not in Home Assistant any more. Pick another one or clear the field.";
    - for an unavailable one: "Unavailable in Home Assistant";
    - "Also bound to: A, B" when it applies;
  - a footer: "N not bound" and "Next unbound device".
- **Panel:** builds `meta` with `metaFromStates(hass.states)`. On first entry to the binding step it calls `loadRegistries` once (failure → the notice "Couldn't load the Home Assistant registries: <error>" with a Retry button), merges the result, and requests an update. Meta is memoised on the identity of `hass.states` and the loaded registries. The status function passed to the renderer and the list is `d => bindingStatus(d, eid => presence(meta, eid))`.
- **README:** a short "Binding" section with the steps, the filter rules (no name guessing) and what "bound" means.

- [ ] **Step 1: Failing tests** (happy-dom, mock hass with `states`; mock `sendMessagePromise` answers the registry commands):
  - opening the binding step triggers exactly one registry fetch; a rejected fetch shows the notice with Retry and flags nothing as Missing (Review Focus 2);
  - selecting a socket shows Control and Power fields;
  - picking an entity stores `bindings.control` and the status turns bound;
  - the plan saves and reloads with the binding;
  - Undo removes it;
  - a binding to an id absent from states and registry shows the missing note and a red dot in the list;
  - the HA device picker fills the climate roles;
  - "Next unbound device" moves the selection;
  - Delete in binding mode does not delete the device.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** `npm test`, `npx tsc --noEmit -p .`, `python -m pytest tests/python -q`, `npm run build` → green. The bundle is committed, there is no Cyrillic, and the panel is ≤ 400 lines.
- [ ] **Step 5:** Commit `feat: binding step with role fields and HA device auto-fill; 0.3.0`, push.
- [ ] **Step 6: Deploy and check live:**
  1. Run `PLAN_STUDIO_HOST=<ha host> bash scripts/deploy.sh`.
  2. Poll `$HA_URL/api/` until it returns 200.
  3. Check that the remote manifest reads 0.3.0.
  4. Check that the served bundle's sha256 equals the local one.
  5. Run `node scripts/smoke_ws.mjs` and expect `SMOKE OK`.
