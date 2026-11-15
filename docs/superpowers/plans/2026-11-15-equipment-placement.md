# Plan Studio stage 2a (equipment placement): implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An "Equipment" tab in the Plan Studio editor where physical devices are placed on the plan, either on a wall face or at a free point, with their physical properties and optional cones and zones. All of it is stored in the plan.

**Architecture:** Devices are a new per-level list in the existing plan model (approach A of the spec). Pure model ops in `model/devices.ts` mirror `model/openings.ts` and plug into the shared post-edit step in `model/ops.ts`, so devices move with walls and are deleted with them. Pure geometry in `geometry/devices.ts` computes the device pose and the cone and zone polygons, which are clipped to the room. Two DOM-free tools place and edit devices, and a separate SVG module draws them. The panel gains a Plan / Equipment tab switch that reuses History, saving and drafts unchanged.

**Tech Stack:** TypeScript 5, Lit 3, Vite, vitest (+happy-dom for panel and render tests), polygon-clipping (already bundled).

**Spec:** `docs/superpowers/specs/2026-11-15-equipment-placement-design.md` (builds on `docs/superpowers/specs/2026-11-14-ha-floorplan-editor-design.md`)

## Global Constraints

- Units mm and degrees; Y points down. An angle of 0° points to +X, and angles grow counter-clockwise on screen, so a direction at angle r is `(cos r, −sin r)`. This matches the wall tool's angle field.
- Device kinds: `ceiling_light`, `wall_light`, `motion_sensor`, `illuminance_sensor`, `switch`, `socket`, `equipment`.
- Allowed placements:
  - `ceiling_light`: free only;
  - `wall_light`: wall or free;
  - `motion_sensor`: free or wall;
  - `illuminance_sensor`: free or wall;
  - `switch`: wall only;
  - `socket`: wall only;
  - `equipment`: free only.
- Defaults:
  - ceiling_light: round, Ø 300, no pool;
  - wall_light: cone 90°, range 2000;
  - motion_sensor: zone 360° when free, 110° on a wall, range 5000;
  - equipment: rect 600 × 600, symbol `other`, empty label.
- No height or other 3D property anywhere.
- Relays are not plan objects, and there is no Home Assistant binding in this stage.
- `schemaVersion` stays 1. `devices` is added per level, and a missing field means `[]`, so stage-1 plans load unchanged.
- Wall-hosted devices behave like openings:
  - they keep their position in space when the wall's node A moves;
  - they are marked `invalid`, never clipped or deleted, when they no longer fit the wall;
  - they are deleted together with their wall.
- Wall devices may overlap each other and openings; placement is never rejected for overlap.
- A cone or zone is clipped to the room containing the device; for a wall device, the room on its `side`. A device in no room is not clipped.
- Re-hosting between wall and free resets `zoneAngle` to the new placement's default only if it still holds the old default.
- The repository is English-only: no Cyrillic anywhere. Commit messages are English with no `Co-Authored-By` or attribution trailer. Push to `origin main`.
- Never commit IPs, local paths or tokens. For deploys: `PLAN_STUDIO_HOST` env, HA credentials come from the environment.

## Review Focus

1. **Loading a stage-1 plan with no `devices` field.** It must open, render, accept new devices and save. Test in Task 1 (`normalizeLevel`) and Task 5 (panel loads such a plan).
2. **Deleting a wall that hosts devices.** The devices go too, and Undo restores the wall and its devices. Test in Task 1 (`deleteWall`), Task 5 (Undo).
3. **Dropping a wall-only device (switch or socket) into open space.** Nothing is placed or moved. A preview shows it as invalid and the device stays where it was. Test in Task 3.
4. **A device outside every room, such as the entrance floodlight.** Its cone renders unclipped and nothing throws. Test in Task 2.
5. **Extreme zoom.** Icons stay a fixed screen size: an icon's radius in mm = `ICON_PX / scale`. Test in Task 4 at scale 0.01 and 1.

---

## File structure

```
frontend/src/model/types.ts          + DeviceKind, DevicePlacement, DeviceProps, Device; Level.devices; DEVICE_PLACEMENTS; deviceDefaults(); normalizeLevel()
frontend/src/model/devices.ts        NEW pure device ops (add/move/props/delete/refresh/reanchor)
frontend/src/model/ops.ts            postEdit: reanchor + refresh devices; deleteWall / mergeNodes drop hosted devices
frontend/src/geometry/devices.ts     NEW devicePose, coneShape, clippedCone, deviceAt (hit)
frontend/src/editor/tools/types.ts   Selection += 'device'; Tool.id += 'device-select' | DeviceKind; ToolContext += deviceDefaults(kind); Preview += device
frontend/src/editor/tools/device-tool.ts         NEW place tool
frontend/src/editor/tools/device-select-tool.ts  NEW select/move/delete tool for devices
frontend/src/render/devices-svg.ts   NEW icons, equipment blocks, cones
frontend/src/render/plan-svg.ts      renderLevel: mode ('plan'|'equipment') dimming, showCones, devices layer
frontend/src/panel/tool-factory.ts   NEW createTool(id, ctx) for both modes (moved out of the panel)
frontend/src/panel/device-props.ts   NEW right-panel section for a device / next-device defaults
frontend/src/panel/toolbar.ts, statusbar.ts, plan-studio-panel.ts, i18n.ts   tab switch, mode tool rail, cones toggle
frontend/test/...                    tests per task
```

---

### Task 1: Device model and ops

**Files:**
- Modify: `frontend/src/model/types.ts`, `frontend/src/model/ops.ts`
- Create: `frontend/src/model/devices.ts`
- Test: `frontend/test/model/devices.test.ts`

**Interfaces:**
- Produces (`types.ts`):
  ```ts
  export type DeviceKind = 'ceiling_light' | 'wall_light' | 'motion_sensor' | 'illuminance_sensor' | 'switch' | 'socket' | 'equipment';
  export type DevicePlacement =
    | { mode: 'wall'; wallId: Id; side: Side; offset: number }   // offset: along axis from node A to device centre
    | { mode: 'free'; x: number; y: number; rotation: number };  // rotation in degrees
  export type DeviceProps =
    | { kind: 'ceiling_light'; shape: 'round' | 'linear' | 'spot'; diameter: number; length: number; width: number; poolRadius: number | null }
    | { kind: 'wall_light'; coneAngle: number; coneRange: number }
    | { kind: 'motion_sensor'; zoneAngle: number; zoneRange: number }
    | { kind: 'illuminance_sensor' } | { kind: 'switch' } | { kind: 'socket' }
    | { kind: 'equipment'; shape: 'rect' | 'circle'; width: number; depth: number; diameter: number;
        symbol: 'boiler' | 'pc' | 'automation' | 'other'; label: string };
  export interface Device { id: Id; name: string; placement: DevicePlacement; props: DeviceProps; invalid: boolean }
  // Level gains: devices: Device[]
  export const DEVICE_PLACEMENTS: Record<DeviceKind, ('wall' | 'free')[]>;   // per Global Constraints
  export function deviceDefaults(kind: DeviceKind, mode: 'wall' | 'free'): DeviceProps;  // values per Global Constraints; linear length 1200 width 100
  export function normalizeLevel(level: Level): Level;  // devices ??= [] (returns same object if already present)
  ```
  `emptyPlan` levels get `devices: []`.
- Produces (`devices.ts`):
  ```ts
  export function addDevice(level: Level, props: DeviceProps, placement: DevicePlacement, name: string): { level: Level; deviceId: Id | null };
  export function moveDevice(level: Level, id: Id, placement: DevicePlacement): Level;   // unchanged level when placement not allowed / wall offset outside [0,len]
  export function setDeviceProps(level: Level, id: Id, patch: Partial<DeviceProps>, name?: string): Level;  // patch never changes kind
  export function deleteDevice(level: Level, id: Id): Level;
  export function refreshDevices(level: Level): Level;          // invalid = wall device with offset outside [0, len]
  export function reanchorDevices(before: Level, out: Level): void;  // mutating, same rule as reanchorOpenings: keep world position when node A moves
  ```
- `ops.ts`: `postEdit` calls `reanchorDevices(before, out)` next to `reanchorOpenings`, then `refreshDevices` after `refreshOpenings`. `deleteWall` removes devices whose `placement.wallId` matches. `mergeNodes` removes devices of walls it deletes.
- zoneAngle rule in `moveDevice`: when the mode changes and `props.kind === 'motion_sensor'` and `zoneAngle` equals the old mode's default (360 free / 110 wall), set it to the new mode's default.

- [ ] **Step 1: Failing tests (`devices.test.ts`, using `rectRoomLevel(3000, 4000, 400)` from fixtures, adding `devices: []` where needed):**
  - `addDevice` of a switch on the top wall at offset 1500, `side 'right'` → 1 device, `invalid false`.
  - A switch with free placement → `deviceId null`, level unchanged. An equipment block with wall placement → null.
  - `addDevice` with a wall offset of 3500 on a 3000 wall → null.
  - `moveDevice` of a wall light from wall to free → mode free. `moveDevice` of a switch to free → unchanged.
  - A motion sensor moved free → wall with `zoneAngle` 360 → 110. With `zoneAngle` 200 → stays 200.
  - `deleteWall` of the hosting wall → its devices are removed, other devices are kept.
  - The host's node A moved 500 outward along the axis → the device offset grows by 500 and its world position is unchanged.
  - Shortening the wall below the offset → `invalid true`, device kept.
  - `normalizeLevel({...level without devices})` → `devices: []`; a level that has devices comes back as the same object.
  - Input never mutated (structuredClone before/after).
- [ ] **Step 2:** Run `npx vitest run frontend/test/model/devices.test.ts`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement types, `devices.ts` and the ops.ts hooks.
- [ ] **Step 4:** Run `npm test` and `npx tsc --noEmit -p .`. Expected: all PASS, tsc clean (existing tests that build Level literals may need `devices: []` added; do it).
- [ ] **Step 5:** Commit `feat: device model and ops hosted on walls`.

---

### Task 2: Device geometry (pose, cones, clipping, hit)

**Files:**
- Create: `frontend/src/geometry/devices.ts`
- Test: `frontend/test/geometry/devices.test.ts`

**Interfaces:**
- Consumes: Task 1 types; `wallFrame` (walls.ts); `roomHoles`, `outlineFromHoles` (rooms.ts); `perpLeft`, `pointInPolygon` (vec.ts); `polygon-clipping`.
- Produces:
  ```ts
  export interface DevicePose { pt: Pt; dir: Pt }   // dir: unit facing direction
  export function devicePose(level: Level, d: Device): DevicePose | null;  // null if host wall missing
  export function coneShape(level: Level, d: Device): Pt[] | null;   // unclipped polygon or null when the device has none
  export function clippedCone(level: Level, d: Device): Pt[][];       // [] when none
  export function deviceAt(level: Level, p: Pt, tolMm: number): Id | null;  // topmost device under p
  ```
Rules:
- **Wall pose:** `pt` = axis point at `offset`, moved by the face offset along the side's normal (`left` → `perpLeft(dir)` · leftOff; `right` → −`perpLeft(dir)` · rightOff). `dir` = that same normal.
- **Free pose:** `pt` = (x, y); `dir` = `(cos r, −sin r)`.
- **Cones:**
  - `wall_light`: sector, apex `pt`, centred on `dir`, half-angle `coneAngle/2`, radius `coneRange`.
  - `motion_sensor`: the same with `zoneAngle` / `zoneRange`; 360 gives a full circle.
  - `ceiling_light`: circle of `poolRadius`, or null when `poolRadius` is null.
  - Other kinds: null.
- **Arcs:** 32 segments per 90°; a circle is 128 points.
- **Clipping:** probe point = `pt + dir·1` for wall devices, `pt` for free ones. The room is the smallest of `roomHoles(level)` containing the probe. With no room, return the unclipped shape. Otherwise use `polygonClipping.intersection`.
- **Hit-test:** an icon device is hit within `tolMm` of `pt`. Equipment is hit inside its rect or circle (rotated), expanded by `tolMm`.

- [ ] **Step 1: Failing tests:**
  - A switch on the top wall (axis y=0, thickness 400, center) on side `right` (inside the box) → `pt.y` = 200, `dir` = (0, 1); on side `left` → `pt.y` = −200, `dir` = (0, −1).
  - Free rotation 90 → `dir` ≈ (0, −1).
  - The area of a wall_light 90°/2000 sector placed outside any room ≈ π·2000²/4 (±1%).
  - A motion sensor at 360°/5000 in the centre of a 3000×4000 box → clipped area ≤ inner room area (2600×3600) + 1, and > 0.
  - A device outside the box (free at (−3000, −3000)) → `clippedCone` equals the unclipped polygon. Review Focus 4.
  - `ceiling_light` with `poolRadius` null → `coneShape` null; `switch` → null.
  - `deviceAt` on an equipment rect 600×600 rotated 45° at (1000, 1000): (1000, 1400) hit, (1400, 1400) miss.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: device pose, cone geometry and room clipping`.

---

### Task 3: Device tools

**Files:**
- Modify: `frontend/src/editor/tools/types.ts`
- Create: `frontend/src/editor/tools/device-tool.ts`, `frontend/src/editor/tools/device-select-tool.ts`
- Modify: `frontend/test/editor/fake-context.ts` (add `deviceDefaults`)
- Test: `frontend/test/editor/device-tool.test.ts`, `frontend/test/editor/device-select-tool.test.ts`

**Interfaces:**
- `types.ts` changes:
  - `Selection.kind` gains `'device'`;
  - `Tool.id` gains `'device-select' | DeviceKind`;
  - `ToolContext` gains `deviceDefaults(kind: DeviceKind): DeviceProps`, the panel's "next device" props for the free mode;
  - `Preview` gains `device?: { placement: DevicePlacement; props: DeviceProps; invalid: boolean }`.
- Produces: `createDeviceTool(ctx: ToolContext, kind: DeviceKind): Tool` (id = kind); `createDeviceSelectTool(ctx: ToolContext): Tool` (id `'device-select'`).

Behaviour:
- **Place tool, `move`:** compute the candidate placement.
  - If the kind allows `wall` and `snap(...)` returns a wall endpoint (kind `wall` or `mid`), the placement is wall. `side` comes from the sign of the cursor's cross product against the wall axis: positive cross (A→B, A→cursor) gives `left`, otherwise `right`. `offset` = axis projection.
  - Else, if the kind allows `free`, the placement is free at the grid-snapped point with rotation 0.
  - Otherwise the preview is invalid.
- **Place tool, `down` when valid:** `addDevice` with `ctx.deviceDefaults(kind)`. When the placement is wall, apply the wall default `zoneAngle` 110 for a motion sensor. Name = the i18n default name + ` ${n}`. Commit and select the new device.
- **Select tool:**
  - `down` uses `deviceAt` to select (or clear the selection).
  - Drag: a wall device follows the same candidate logic as placement (slides along its wall, or re-hosts on another wall); a free-capable device leaves the wall into a free position. A free device moves with grid snap, and Shift locks movement to the axes from the grab.
  - One commit on `up`, and none if nothing moved.
  - `Delete`/`Backspace` deletes the selected device.
  - `cancel()` clears the selection through `ctx.select(null)`.

- [ ] **Step 1: Failing tests:**
  - Switch tool: hover inside the box near the top wall → preview placement wall, side `right`; click → 1 device, selected.
  - Switch tool: click in the middle of the room → 0 devices, preview `invalid`. Review Focus 3.
  - Ceiling-light tool: click at (1234, 567) with grid 100 → free at (1200, 600).
  - Motion-sensor tool on a wall → `zoneAngle` 110.
  - Select: drag a free equipment by (500, 0) → one commit, moved. Drag a switch into the room centre → unchanged, no commit. Review Focus 3.
  - Select: drag a wall light from the top wall onto the left wall → re-hosted. Delete → removed.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run `npm test` → PASS; `npx tsc --noEmit -p .` clean.
- [ ] **Step 5:** Commit `feat: device placement and select tools`.

---

### Task 4: Device rendering

**Files:**
- Create: `frontend/src/render/devices-svg.ts`
- Modify: `frontend/src/render/plan-svg.ts`, `frontend/src/render/theme.ts` (device, cone and dim colours for both palettes)
- Test: `frontend/test/render/devices-svg.test.ts`

**Interfaces:**
- Produces: `export const ICON_PX = 12;` and `renderDevices(level: Level, o: { palette: PlanPalette; scale: number; selection: Selection | null; showCones: boolean; dim: boolean; lang: string; preview?: Preview['device'] }): SVGTemplateResult`.
- `RenderOpts` (plan-svg.ts) gains `mode: 'plan' | 'equipment'` (default `'plan'`) and `showCones: boolean` (default `true`). In `equipment` mode, walls, openings and rooms are drawn with the palette's dim opacity and devices at full strength; in `plan` mode devices are drawn dimmed. Devices are drawn above the walls; cones are drawn below the devices and above the room fills.

Visual spec (classes are for tests):
- Each device group is `<g class="device device-<kind>">`. A selected device gets the class `selected`; an invalid one gets `invalid` and the invalid colour.
- **Icon radius in mm** = `ICON_PX / scale`. Icon shapes:
  - ceiling_light: circle. Linear: a rect of `length`×`width` at real size; spot: a small dot.
  - wall_light: half-disc on the face, opening towards `dir`.
  - motion_sensor: circle with 2 arcs towards `dir`.
  - illuminance_sensor: circle with 8 short rays.
  - switch: small square.
  - socket: circle with 2 dots.
- **Equipment:** a rect (`width`×`depth`, rotated by `rotation`) or a circle (`diameter`) at real size. In the middle sits a symbol glyph: `B` boiler, `PC`, `A` automation, `•` other. Under it is `label` (class `equipment-label`), then an empty `<g class="equipment-data">` reserved for stage 2b.
- **Cones** (class `cone`): a translucent fill of `clippedCone`, drawn only when `showCones`. A ceiling light's pool is a dashed outline (class `pool`).
- **Placement preview:** the device is drawn at 50% opacity (class `device-preview`), with the class `invalid` when invalid.

- [ ] **Step 1: Failing tests (happy-dom):**
  - The level has one device of each kind and renders exactly 7 `g.device` groups.
  - `showCones: false` gives no `.cone`; `true` gives `.cone` for the wall light and motion sensor and `.pool` for a ceiling light with a pool.
  - The equipment group contains its label text and `.equipment-data`.
  - At scale 1 the ceiling-light icon circle has `r` = 12; at scale 0.01 it has `r` = 1200. Review Focus 5.
  - `mode 'equipment'` gives the walls path a dim opacity attribute; `mode 'plan'` gives the device groups a dim opacity.
  - An invalid device has the class `invalid`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: render devices, equipment blocks and cones`.

---

### Task 5: Equipment tab in the panel; deploy

**Files:**
- Create: `frontend/src/panel/tool-factory.ts`, `frontend/src/panel/device-props.ts`
- Modify: `frontend/src/panel/plan-studio-panel.ts` (move tool construction to tool-factory; add mode and next-device state), `toolbar.ts`, `statusbar.ts`, `props-panel.ts`, `input.ts` if needed, `frontend/src/i18n.ts`, `README.md`, `custom_components/plan_studio/manifest.json` (version `0.2.0`), the bundle
- Test: `frontend/test/panel/equipment.test.ts`

**Interfaces:**
- `createTool(id: ToolId, ctx: ToolContext): Tool`. `ToolId` is now `Tool['id']`. `PLAN_TOOL_IDS = ['select','box','wall','door','window','opening','zone']`; `EQUIPMENT_TOOL_IDS = ['device-select','ceiling_light','wall_light','motion_sensor','illuminance_sensor','switch','socket','equipment']`.
- `renderDeviceProps(o: { device: Device | null; nextKind: DeviceKind | null; nextProps: DeviceProps | null; lang: string; onDevice(patch: Partial<DeviceProps>, name?: string): void; onPlacement(p: DevicePlacement): void; onNext(patch: Partial<DeviceProps>): void; onDelete(): void }): TemplateResult`.

Behaviour:
- **Tab switch:** "Plan | Equipment" in the top bar. Switching cancels the active tool, clears the selection, and activates the mode's first tool (`select` / `device-select`).
- **Tool rail:** shows the current mode's tool ids with i18n labels.
- **Right panel in Equipment mode:**
  - With a device selected: name, kind-specific props, rotation for free devices, side and offset for wall devices, Delete.
  - With a place tool active and nothing selected: "Next device" defaults (the panel state `nextProps[kind]`, initialised from `deviceDefaults(kind, 'free')`), which drive `ctx.deviceDefaults`.
  - Number fields: integer > 0 (angles 1..360), validated the same way as the existing mm fields.
- **Status bar:** a "Cones & zones" checkbox (default on), passed to `renderLevel`'s `showCones`.
- **Loading:** `adopt()` (and draft restore) maps every level through `normalizeLevel`.
- **i18n:** English keys only: tab names, tool names, device kind names, prop labels, symbols.
- **plan-studio-panel.ts** must end below 600 lines after moving tool construction out. If it does not, report it.

- [ ] **Step 1: Failing tests (happy-dom, mock hass):**
  - Load a plan whose level has no `devices` key (inject it into mock storage) → the panel renders, the Equipment tab places a ceiling light, saves, and the stored plan has 1 device. Review Focus 1.
  - The tab switch changes the tool rail (Equipment shows 8 tools) and clears the selection.
  - Delete a hosting wall in the Plan tab → its switch disappears. Ctrl+Z → the wall and switch are back. Review Focus 2.
  - Unchecking "Cones & zones" removes the `.cone` elements.
  - Changing next-device coneAngle to 60 → the next placed wall light has `coneAngle` 60.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** `npm test`, `npx tsc --noEmit -p .`, `python -m pytest tests/python -q`, `npm run build` → all green; commit the rebuilt bundle. Cyrillic scan over `git ls-files` → none.
- [ ] **Step 5:** README: add a short "Equipment tab" usage section. Commit `feat: equipment tab with device properties and cones toggle`, push.
- [ ] **Step 6: Deploy and check live.**
  1. Run `PLAN_STUDIO_HOST=<ha host> bash scripts/deploy.sh`.
  2. Wait about 15 s, then poll `$HA_URL/api/` until it returns 200.
  3. Check that the remote manifest reads 0.2.0.
  4. Check that the served bundle's sha256 equals the local one.
  5. Run `node scripts/smoke_ws.mjs` and expect `SMOKE OK`.
