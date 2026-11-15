# Plan Studio: equipment placement (stage 2a) design

Date: 2026-11-15
Status: draft, awaiting owner approval
Builds on: `2026-11-14-ha-floorplan-editor-design.md` (stage 1, the plan editor; accepted and live).

## 1. Why

The owner runs AppDaemon lighting automations on Home Assistant. They want to see light, relays and motion on the floor plan. Stage 1 delivered the plan editor. Stage 2 puts the physical equipment on that plan and then links it to Home Assistant. It is split into two steps:

- **Stage 2a (this document): placement.** A separate "Equipment" tab where the owner places physical devices on the finished plan and sets their physical properties. There is no Home Assistant binding yet.
- **Stage 2b (next, separate design): configuration.** A wizard in its own tab lists the placed devices and binds each one to Home Assistant entities, for example the boiler to its relay and the PC block to a relay with power metering. Live state rendering comes after that.

What goes on the plan is what physically exists in the home: a boiler, a PC, an automation cabinet, a floodlight above the entrance. What controls it (a relay, a smart plug, a wall switch outside the flat) is configuration and belongs to stage 2b. Relays are not drawn on the plan.

## 2. Goals, non-goals, anti-goals

### Goals

1. An "Equipment" tab next to the "Plan" tab in the same editor panel. In it the walls, openings and rooms are shown as a non-editable background.
2. Place these device kinds, each with its physical properties (section 4):
   - ceiling light
   - wall light (also used for a floodlight)
   - motion sensor
   - illuminance sensor
   - switch
   - socket
   - equipment block (boiler, PC, automation cabinet, other)
3. Two placements: **on a wall** (hosted, like an opening, and moving with the wall) or **at a free point** anywhere on the canvas, including outside the flat's walls.
4. Optional cones and zones: the light cone of a wall light, the light pool of a ceiling light, and the detection zone of a motion sensor. Each can be configured and shown on the plan. One toggle shows or hides all of them.
5. Saving, revisions, conflicts, drafts, undo and redo all work for devices exactly as they do for walls.

### Non-goals (stage 2a)

- Binding to Home Assistant entities, live state, and toggling devices from the plan. These are stage 2b and later.
- Mounting height and any other 3D property. The plan is 2D, and the owner said height is not needed.
- Relays as plan objects.
- Device catalogues, real product models, brands and power ratings.
- Editing walls from the Equipment tab.
- Floors and site levels. Devices live on the single floor level that exists today. The new optional `devices` field is added per level, so later stages with several levels need no migration.

### Anti-goals

- A device that drifts away from its wall when the wall is moved, or that stays behind after its wall is deleted (the same rule as for openings).
- Any change that breaks plans saved by stage 1.
- Cones and zones that clutter the plan with no way to hide them.

## 3. Approach

Three ways were considered:

- **A. Devices stored inside the plan.** Chosen; this was the document author's call, and the owner's discussion was about what to build, not how to store it. Each level gets a `devices` list. The Equipment tab is a second mode of the same editor. Storage, revisions, conflicts, drafts and history are reused unchanged. Stage 2b will add an entity reference to the same device records.
- **B. A separate device store that references plan element ids.** Rejected. It means two revisions, two saves and dangling references when walls are deleted, and undo in one tab would not see the other.
- **C. Creating devices in the Home Assistant device registry now.** Rejected. It mixes placement with configuration, which the owner deliberately put in the next step, and it would litter the registry with unbound devices.

## 4. Device model

Units are millimetres and degrees. Y points down. Angles are measured as on screen: 0° points to +X, and positive angles turn counter-clockwise on screen. This is the same convention as the wall tool's angle field.

```
Device
  id, name, kind
  placement:
    { mode: "wall", wallId, side: "left" | "right", offset }   # offset along the wall from node A to the device centre
  | { mode: "free", x, y, rotation }                            # rotation in degrees
  props: kind-specific, see below
  invalid: bool          # wall-hosted device whose offset no longer fits the wall
```

| kind | allowed placement | props |
|---|---|---|
| `ceiling_light` | free | `shape`: round / linear / spot; `size`: diameter for round and spot, length × width for linear; `poolRadius` (light pool on the floor, optional) |
| `wall_light` | wall (or free, for a floodlight on a post) | `coneAngle`, `coneRange` (cone drawn from the device into the room, perpendicular to the wall face, or along `rotation` when free) |
| `motion_sensor` | free (ceiling) or wall | `zoneAngle` (default 360 for free, 110 for wall), `zoneRange`, direction: `rotation` for free; for wall, perpendicular to the face |
| `illuminance_sensor` | free or wall | none |
| `switch` | wall | none |
| `socket` | wall | none |
| `equipment` | free (may also be placed against a wall as a free point) | `shape`: rect / circle; `size`: width × depth for rect, diameter for circle; `symbol`: boiler / pc / automation / other (an icon); `label` |

Defaults are the document author's call; the owner may change any of them:
- ceiling light: round, Ø 300, no light pool;
- wall light: cone 90°, range 2000;
- motion sensor: 360° when free, 110° on a wall, range 5000;
- equipment: rect 600 × 600, symbol "other".

Rules:
- A wall-hosted device behaves like an opening. It keeps its position in space when the wall's node A moves. It is marked `invalid` (shown red), never clipped or deleted, when the wall becomes too short. It is deleted together with its wall.
- `side` selects the wall face. A device on the outer face of an outer wall faces outside, which is how the entrance floodlight is placed.
- A device has no room link. Its room is derived from geometry when needed: the zone whose outline contains the point.
- Free devices may sit anywhere, including outside the flat. Equipment blocks may be placed beside the plan purely for readability, like an off-plan schematic.

Builder-check calls (made by the document author):
- Wall devices may overlap each other and openings. A switch next to a door frame is normal, so placement is never rejected for overlap.
- A wall device's cone or zone is clipped to the room on its `side` of the wall. A device on an outer face that faces outside is not clipped.
- When a device is re-hosted between wall and free, `zoneAngle` resets to the default for the new placement (110 on a wall, 360 free) only if it still holds the old default. A value the user set is kept.

Storage compatibility: `devices` is an optional per-level list that defaults to `[]` when missing. `schemaVersion` stays 1 because the change is additive. Plans saved by stage 1 load unchanged. The Python validation does not inspect level contents, so it needs no change. The design records this so the builder can check it.

## 5. Equipment tab (UI)

- Tab switch "Plan | Equipment" in the top bar. The tab state is per session and is not saved.
- **Equipment tab tool rail:**
  - Select
  - Ceiling light
  - Wall light
  - Motion sensor
  - Illuminance sensor
  - Switch
  - Socket
  - Equipment
- **Placing a device:**
  - Wall-only kinds (switch, socket) snap to the nearest wall face under the cursor, using the same "on wall" snap marker as stage 1. A click places the device.
  - Kinds that may go on a wall or at a free point (wall light, motion sensor, illuminance sensor) snap to a wall face when the cursor is within tolerance of one. Otherwise they go to a free point, which snaps to the grid.
  - Free-only kinds (ceiling light, equipment) are always placed at a free point.
- Select tool: click to select, drag to move.
  - A wall device slides along its wall. Dragging it onto another wall re-hosts it there; dragging it into open space makes it free, for kinds that allow it.
  - A free device moves anywhere.
  - Delete removes the selected device.
  - Shift locks movement to the axes, as in stage 1.
- Right panel: properties of the selected device, or the defaults for the tool about to place one. The fields are name, the kind-specific props, rotation for free devices, and side and offset for wall devices.
- Status bar: a "Cones & zones" toggle next to the grid toggle.
- Walls, openings and rooms are drawn dimmed and cannot be selected in this tab. In the Plan tab devices are drawn dimmed and cannot be selected.

### Rendering

Icons are sized in screen pixels, so they stay readable at any zoom:
- ceiling light: circle; line for linear, small dot for spot;
- wall light: half-circle on the wall face;
- motion sensor: circle with radiating arcs;
- illuminance sensor: small sun;
- switch: small square on the face;
- socket: small circle with two dots on the face;
- equipment: owner's words: "a block is just a rectangle or circle with a symbol and data". It is a schematic shape, not a real-size footprint:
  - a rect (width × depth, rotated) or a circle;
  - the symbol icon in the middle and the label;
  - a data area inside the block, reserved for values bound in stage 2b (for example power draw or on/off). In stage 2a this area shows nothing, or a placeholder when the block is selected.

Cones and zones are drawn when the toggle is on:
- light pool: dashed circle;
- wall-light cone: filled translucent sector;
- motion zone: translucent sector, or a circle when 360°.

They are clipped to the room outline the device is in, when the device is inside a room, so they do not leak through walls. A device outside every room is not clipped. Colours come from the existing dark and light palettes.

## 5a. Wall break symbol (owner request)

A free wall end is a node used by exactly one wall, with no T-junction host. It is drawn as a wall fragment with a break: a grey break line across the end cap, extending slightly past both faces, with a lightning-style zigzag in the middle. It is shown in both tabs.

## 6. Interaction with stage 1 edits

- Deleting a wall deletes its hosted devices. Moving a wall carries its hosted devices along. A node-A move re-anchors devices the same way it re-anchors openings.
- Undo and redo cover device edits; there is one History shared by both tabs.
- Drafts and conflicts are unchanged: devices are part of the plan.

## 7. Left to the builder

- Exact icon artwork and sizes, within section 5.
- Hit-test priority between devices and the tolerance.
- The shape of the device-ops module, as long as it is pure and mirrors `openings.ts`.
- Whether the device re-anchoring step shares code with the opening re-anchoring step.

## 8. Verification

- Unit tests:
  - device ops: add, move, re-host, delete with wall, invalid when the wall shortens, re-anchor on a node-A move;
  - cone and zone geometry, including clipping to the room;
  - loading a stage-1 plan without `devices`.
- Panel tests:
  - tab switch;
  - placing each kind;
  - the cone toggle;
  - save, then reload, and the devices are still there.
- Live check: deploy and smoke test on the test HA. The owner then places their real equipment: lights in each room, the motion sensors, the boiler and PC blocks beside the plan, and the entrance floodlight on the outer wall face.
