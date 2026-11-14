# Floor Plan for Home Assistant — Editor (Stage 1)

Date: 2026-11-14
Status: draft for approval

Working name: **Plan Studio**, integration domain `plan_studio`. The name is a suggestion and may be changed.

## 1. Why

The owner of two Home Assistant instances (on both, AppDaemon mainly controls lighting) wants to **see on a floor plan, in a good-looking way,** the state of lighting, controllable sockets/relays, and motion sensor triggers. A regular dashboard with a list of entities does not provide this: a spatial picture is needed — where the light is on, where there is motion.

The property is an apartment **or** a private house with a plot of land (the plot may have outbuildings: a garage, etc. — with their own lights and sensors).

The work is split into stages:

- **Stage 1 (this document, implemented now):** a "planner" editor — drawing the building. The reference is a heavily cut-down ArchiCAD: first walls, then openings/doors/windows placed on the walls. **Stage completion criterion: an apartment plan can be successfully drawn and saved in the editor.** Owner: "for now we work on the planner, everything else comes after at least an apartment plan has been drawn successfully".
- **Stage 1b (after stage 1, described here only so that the data model allows for it):** multiple floors, a "Site" level (fence, gates, wicket gate, outbuildings), a Lovelace card for viewing the plan on a dashboard.
- **Stage 2 (not in this document, but the data model must allow for it):** place actuators (dimmers, relays, including the boiler relay, sockets) and sensors (motion, illuminance, and others) on the plan, and display their state live.

## 2. Goals, non-goals, anti-goals

### Stage 1 goals

1. A full-screen plan editor inside HA (an item in the sidebar).
2. Drawing by exact dimensions in mm, with snaps and angle locking (Shift = 90°).
3. Walls with thickness and type; openings/doors/windows inserted into a wall.
4. One level (floor) in the UI; the data model stores a list of levels (see section 6).
5. Rooms (outlines) determined by closed walls.
6. Reliable storage of the plan in HA itself (included in HA backups).
7. Installed via HACS identically on both instances.

Deferred to stage 1b (the model must allow for it, the implementation does not): multiple floors, a "Site" level with the "Fence" wall type and gates/wicket gates, the viewing card (section 7, 5.8).

### Non-goals (deliberately not done in stage 1)

- 3D/isometric. Top view only, 2D. (The owner explicitly rejected isometric.)
- A background image (a technical-passport plan, etc.) for tracing. Owner: "no underlay needed".
- Binding to HA areas. The owner explicitly declined: devices will be placed at a specific point of a room or on a wall, HA areas are not involved.
- Paths, lawn, platforms as colored areas on the plot.
- Furniture, stairs, columns, roofs, heights (window sill, wall height) — not needed for 2D.
- A manual dimension-line tool (dimensions are shown temporarily when selecting/drawing — see 5.6).
- Editing from a phone/tablet with a finger. The editor is designed for mouse and keyboard; the viewing card must work on a tablet.
- Debugging AppDaemon logic (why a light turned on, etc.).
- Synchronizing the plan between the two instances. Each instance has its own property and its own plan.

### Anti-goals (a failure even if it "works")

- An editor in which you cannot draw precisely: without keyboard length input, without snaps, without Shift-90°. The owner is guided by ArchiCAD — "by eye" is unacceptable.
- Openings living separately from walls (not moving together with the wall, remaining hanging after the wall is deleted).
- Loss of the drawn plan (silent overwrite, unsaved changes without a warning, format breakage on update).
- Dependence of the plan on HA areas.

## 3. Constraints and context

- Home Assistant 2026.11.x (verified on the first instance: 2026.11.1). The minimum supported version is chosen by the developer, but not lower than the current one.
- The test instance is HA OS, the installation type of the second is unknown — the solution must not depend on Supervisor/add-ons.
- Distribution — HACS, category Integration (one repository).
- No external servers, external databases, external CDNs at runtime: everything is served by HA itself.
- A live test instance is available (the token is kept outside this project; do not copy it into the repository). It is HA OS (qemux86-64), HA language is `en`. Delivery during development: SSH `root@<HA_HOST>` (Terminal & SSH add-on, key login) → copy to `/config/custom_components/plan_studio` → `ha core restart`. There is no GitHub repository yet — it is not needed until the HACS publication stage.
- UI language: English only, via a string dictionary. *(Owner decision, 2026-11-14.)*

## 4. Chosen approach and alternatives

Three paths were considered:

- **A. Lovelace card only (HACS → Dashboard).** The plan is stored in the card config. Rejected: the editor ends up in a narrow card configuration dialog; a plan of hundreds of walls turns into a huge YAML; YAML dashboards are not saved from the UI.
- **B. Integration + own panel + card (HACS → Integration).** **Chosen by the owner.** A Python integration registers a sidebar item with a full-screen editor, stores plans in `.storage` via `homeassistant.helpers.storage.Store`, serves websocket commands, and itself serves and registers the Lovelace card JS.
- **C. A separate web application (add-on/container) in an iframe.** Rejected: add-ons exist only on HAOS/Supervised, separate authorization, fits themes and dashboards worse; hosting on AppDaemon would tie the editor to AppDaemon without a logical reason.

### Solution composition (B)

- `custom_components/plan_studio/` — Python:
  - a config flow without parameters (add the integration from the UI with one button; one entry per instance);
  - panel registration (`panel_custom`, sidebar icon, **admins only**);
  - serving frontend static files (`async_register_static_paths`); in stage 1b, also registering the card JS on all dashboards (`add_extra_js_url` or equivalent), so that the user does not have to add the resource manually;
  - plan storage (`Store`, with a schema version field and migrations);
  - websocket API: `plan_studio/plans/list`, `plan_studio/plans/get`, `plan_studio/plans/save`, `plan_studio/plans/delete`. Reading — any authorized user; write/delete — admin only.
- Frontend — TypeScript + Lit (HA's own stack), built into JS bundles located inside `custom_components/plan_studio/frontend/` (built files are committed so that HACS installs without a build).
  - **editor panel** (a web component for `panel_custom`);
  - **card** `custom:plan-studio-card` (viewing) — stage 1b;
  - the geometry and SVG rendering module is separated from the editor UI so that the 1b card reuses it.
- Rendering — SVG.

## 5. Editor: what is decided

### 5.1 User workflow (in the owner's words)

1. Draws a "box" — a rectangle of external load-bearing walls.
2. Draws a balcony/veranda with thin walls.
3. Creates rooms with partitions inside.
4. Places openings, doors, windows.

### 5.2 Screen

Mockup: `.superpowers/brainstorm/1550-1794671440/content/editor-v2.html`.

- Left — tools: Select, Box, Wall, Door, Window, Opening, Zone (room). (Stage 1b: on the "Site" level also Gate, Wicket gate.)
- Top — wall type selection, undo/redo, "Save". (Stage 1b: level tabs "Site", "1st floor", "2nd floor", "+" and a "View" button.)
- Right — properties of the selected element / the element being drawn.
- Bottom — a hint line for keys and current snaps.
- Canvas — grid, panning (wheel / middle button / space+drag), zoom with the wheel.

### 5.3 Walls

- A wall = a straight segment from point A to point B on a specific level, with a **thickness**, a **type** and a **baseline** (axis / left face / right face — as in ArchiCAD).
- Wall types are presets with a default thickness; the thickness of any wall can be changed:
  - Load-bearing — 400 mm
  - Partition — 100 mm
  - Railing (balcony/veranda) — 100 mm
  - Fence (plot) — 50 mm — stage 1b
  The type also sets the look: load-bearing — thicker and denser, railing — lighter, fence — its own thin style. *(Thickness values are my suggestion, the owner did not edit them.)*
- Drawing — as a chain: click — a point, click — the next point, Esc — finish the chain.
- Keyboard input while drawing: digits = length in mm; Tab = switch to angle. An input box (tracker) next to the cursor.
- **Shift — angle lock to 90°** (along global axes: 0/90/180/270°). An explicit owner requirement.
- Snaps: wall ends, wall midpoints, wall faces and axes (so that a partition meets a load-bearing wall's face in a "T"), 100 mm grid. Grid snapping can be disabled.
- Joins: walls meeting at an end (L-junction), abutting the body of another wall (T-junction) and crossing (X-junction) are displayed cleanly — without overlaps and gaps. A partition abutting a load-bearing wall ends at its face.
- Editing: selection, dragging ends, moving a whole wall, deletion, changing properties in the right panel. When a wall is moved/changed, its openings move together with it.

### 5.4 Box

- A separate tool: two corners with the mouse **or** keyboard input of "width × depth".
- The result is 4 walls of the chosen type (default "Load-bearing"), already joined at the corners. After that they are ordinary walls.
- The entered size is measured to the **inner face** by default (an apartment is measured with a tape measure from the inside); a switch — inner face / axis / outer face. *(My suggestion.)*

### 5.5 Openings, doors, windows (and gates/wicket gates)

- Exist only inside a wall (hosted). Deleting a wall deletes its openings.
- Parameters: host wall, offset along the wall from its start, width, kind (opening / door / window / gate / wicket gate).
- Door: hinge side and swing side (switchable), drawn with a swing arc. Window — with a conventional symbol in the wall. Opening — just a gap in the wall.
- Placed by clicking on a wall; moved along the wall by dragging; offset and width are edited as numbers.
- An opening cannot extend beyond the wall and cannot overlap another opening of the same wall.

### 5.6 Dimensions

- While drawing — length and angle in the tracker.
- When a wall/opening is selected, temporary dimension lines are shown (wall length, distance from the opening to the wall ends, opening width).
- Permanent dimension lines — not in stage 1.

### 5.7 Rooms (zones)

- "Zone" tool: a click inside a closed wall outline creates a room with this outline (along the inner faces of walls; openings do not break the outline). The name is set in properties.
- The outline is recomputed when walls change. If after editing walls the outline is no longer closed, the room is marked "broken" and this is visible in the editor (it is not silently deleted).
- A room displays its name and area (m²).
- Purpose of rooms: a label, and in stage 2 — the area that a lit light "floods" (light does not leak through walls).
- Rooms are not bound to HA areas.

### 5.8 Levels (stage 1b; in stage 1 — one floor)

- The plan contains an ordered list of levels. A level kind is `floor` (a floor) or `site` (a plot).
- Apartment: one or several floors, without a plot.
- House: floors + at most one `site` level.
- The "Site" level is drawn with the same tools: an outer outline (with "Fence" type walls), gates/wicket gates, outbuildings (garage, bathhouse) — with boxes/walls/partitions, with their own rooms.
- On the "Site" level the main house is shown as the outline of the 1st floor (for orientation only, not editable there).
- In viewing mode levels are switched by tabs; one level is shown at a time.

### 5.9 Saving

- An explicit "Save" button + a warning about unsaved changes when leaving the page.
- Undo/redo (Ctrl+Z / Ctrl+Y or Ctrl+Shift+Z) within the editor session.
- On saving, the revision is checked: if the plan in storage has changed since it was loaded (opened in two tabs), the save is rejected with a clear message rather than silently overwriting. The way out for the user: "Overwrite" (with confirmation; the save command with the `force` flag) or "Save as a new plan". Unsaved work in the editor is not lost in this case. *(Decision of the document author.)*

## 6. Data model (required properties)

Units — integer millimeters. Coordinate system — flat, Y down (as in SVG). Every element has a stable `id`.

```
Plan
  id, name, schema_version, revision
  levels: [Level]

Level
  id, name, kind: "floor" | "site", order
  nodes: [Node]
  walls: [Wall]
  openings: [Opening]
  zones: [Zone]

Node
  id, x, y
  host?: { wall_id, offset }   # a node lying on the body of another wall (T-junction)

Wall
  id, a: node_id, b: node_id
  thickness, type: "bearing" | "partition" | "railing" | "fence"
  baseline: "center" | "left" | "right"

Opening
  id, wall_id, kind: "opening" | "door" | "window" | "gate" | "wicket"
  offset (along the wall from node A to the start of the opening), width
  door/gate: hinge side, swing side
  window: outside side (which face of the wall is the outer one)
  invalid: bool   # the opening no longer fits in the wall

Zone
  id, name, seed: {x, y}       # a point inside
  outline: [{x, y}]            # last computed outline (cache)
  broken: bool
```

**Wall connectivity (decision of the document author).** Walls are connected through explicit shared nodes (`Node`), not through a coincidence of coordinates. Dragging a node moves all walls meeting at it. T-junction: a partition ends at a node with `host` = the load-bearing wall + offset; the load-bearing wall is **not split** into two. When the load-bearing wall moves, the T-junction moves together with it at its offset. Detaching a wall from a node is an explicit action (for example, Alt+drag of an end).

**Openings when a wall changes (decision of the document author).** An opening keeps its position in space along the wall: if node A moves, the offset is recomputed so that the opening does not "jump". If the wall is shortened and the opening no longer fits — it is not deleted or silently clipped, but marked `invalid` and highlighted in red; the user moves or deletes it themselves. If a wall is split into two — the opening goes to the part inside which it lies; if it lands on the split point — `invalid`.

**Rooms (decision of the document author).** A room stores `seed`, a name and the last computed outline. After walls are edited the outline is recomputed from `seed`. If the outline is not closed, or `seed` ended up in the same outline as another room — `broken = true`, the room is drawn along the last outline with hatching and a warning, and is not deleted. In stage 2 a device is assigned to a room by geometry (a point inside the outline), without an explicit link.

Model requirements dictated by stage 2:

- An object can be **bound to a wall** (host wall + offset along the wall + wall face), like an opening — this is how wall lights, switches, a floodlight on a garage wall will be placed.
- An object can be a **free point** on a level — ceiling lights, motion sensors.
- The room outline is available as geometry for light "flooding".
- Adding a new list of objects to `Level` in stage 2 must not require a breaking migration.

Storage: one `Store` per instance, containing a list of plans (in the stage 1 UI it is acceptable to work with a single plan, but the storage format is a list). The schema is versioned; when an old version is loaded, a migration is performed.

## 7. Viewing card (stage 1b)

- `custom:plan-studio-card`, config: `plan_id` (may be omitted if there is one plan), starting level (optional).
- Read-only, level tabs, "fit to card" scaling.
- Colors are taken from the HA theme: in the dark theme — the "dark blueprint" style (mockup A in `look.html`), in the light theme — "light interior" (mockup C). Isometric (B) is rejected.
- In stage 1 it shows only the building (walls, openings, rooms with labels). Devices — stage 2.
- Updates if the plan was re-saved in the editor (subscription or re-reading — at the developer's discretion).

## 8. What is left to the developer

- Repository structure, bundler (Vite/Rollup), test framework.
- The wall-joining algorithm (computing wall polygons with trimming at nodes; a boolean union via a library like Clipper is possible) and the algorithm for finding a closed room outline.
- Exact styles, icons, fonts within the decisions of section 7.
- Hotkeys other than those named (Shift, Esc, Tab, digits, Ctrl+Z).
- The way the card updates when the plan changes.
- Websocket command names and JSON structure in detail, provided the properties from section 6 are preserved.

## 9. Verification

- Geometry unit tests: L/T/X joins, shared nodes and T-junctions when dragging, openings on a wall, moving node A with openings, shortening a wall (opening → `invalid`), room outline search, a "broken" room.
- Storage tests: save/load, revision conflict, schema version migration.
- Manual verification on a live HA instance (the stage 1 completion criterion): installation via HACS/copying, the menu item, draw an apartment (box → balcony → partitions → doors/windows → rooms), save, restart HA, the plan is in place and opens for further editing.
