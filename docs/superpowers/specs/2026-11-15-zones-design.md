# Plan Studio: automation zones design

Date: 2026-11-15
Status: draft, awaiting owner approval
Builds on: the stage 1, 2a and 2b specs in this folder (`2026-11-14-ha-floorplan-editor-design.md`, `2026-11-15-equipment-placement-design.md`, `2026-11-15-entity-binding-design.md`).

## 1. Why

Plan Studio will replace the owner's AppDaemon automations step by step. The owner decided that **automation works per zone, not per room**. A zone is the unit of logic, like an AppDaemon LightNode: it owns devices, a mode and sensors. Today's virtual LightNodes, such as "door" and "middle", have a motion sensor but no light of their own; they become zones with a custom outline. In a private house, zones also exist outdoors, for example yard lighting.

This stage adds zones as a layer on the plan. Automation logic, modes and HA entities for zones come later, and they read this layer.

## 2. Decisions taken with the owner

- **Two outline kinds:**
  1. **by room**: the zone follows a room's detected outline;
  2. **custom**: a polygon the user draws.
- **Custom vertices** may be anchored to room elements (wall corners, points on wall faces) or free.
- **Anchored vertices follow** when walls are edited (option "a"; the owner did not object).
- **Location:** zones can be inside or outside the building.
- **Overlap:** zones may overlap. A device can belong to several zones.
- **Membership is automatic by geometry:** a device belongs to every zone whose outline contains it.
- **Per-device opt-out:** a device can be detached from a zone. Each device keeps a zone blacklist, `zoneBlacklist`. There is no manual add to a zone that does not contain the device.
- **Approach B** (owner's choice): rooms stay architecture, and zones are a separate automation layer. Approach A (turning rooms into zones) was rejected, because it would mix architecture with logic and make "a room without a zone" or "two zones in one room" impossible.
- **New wizard step "Zones"** between Binding and Automation: Plan → Equipment → Binding → Zones → Automation (Automation stays disabled).

## 3. Goals, non-goals, anti-goals

### Goals
1. Create zones from a room in one click, or draw custom polygons with snapping to nodes, wall faces and the grid.
2. See all zones on the plan as translucent overlapping areas with names. Select, rename and delete them, and edit custom vertices.
3. See which devices each zone contains, and toggle a device's participation (blacklist) from either the zone or the device.
4. Keep zones consistent while walls and rooms are edited: anchored vertices move, room-based outlines follow, and problems are flagged, never silently dropped.
5. Save, revisions, drafts and undo work for zones as for everything else.

### Non-goals
- Automation logic, zone modes (Auto/Manual/Sleep), presence, timers. These come in a later stage.
- HA entities for zones. This is a later stage, when the integration starts creating entities.
- Zones spanning several levels. A zone lives on one level; floors are stage 1b.
- Assigning a device to a zone it is not inside.

### Anti-goals
- A zone that silently loses its shape or its devices after a wall edit.
- Guessing zones automatically from names or HA areas.
- Mixing zone data into rooms. Rooms keep working exactly as today.

## 4. Data model

Units are millimetres and Y points down.

```
Level
  zones: [Zone]                     # existing ROOMS; stored key unchanged for compatibility
  automationZones?: [AutomationZone] # NEW; missing = []

AutomationZone
  id, name
  shape:
    { kind: "room", roomId }                  # outline = that room's outline
  | { kind: "polygon", vertices: [ZoneVertex] } # ≥ 3 vertices
  invalid: bool                      # derived, recomputed by the post-edit step (like Device.invalid); see the rules below

ZoneVertex
  { kind: "free", x, y, lost?: true }                      # lost = was anchored, the anchor disappeared
  | { kind: "node", nodeId, x, y }                         # wall corner / wall end; x,y = last resolved position (cache)
  | { kind: "wall", wallId, offset, side, x, y }           # point on a wall face: offset along the axis from node A, side = face

Device gains: zoneBlacklist?: [automationZoneId]   # missing = []
```

What exists today and this design relies on:
- **Ids are stable.** Nodes, walls and rooms keep their ids across edits. No current operation splits a wall: a T-junction hosts a node on the wall instead. A room (`Zone` in code) keeps its id, a `seed` point, a cached `outline` and a `broken` flag. Re-detection after an edit updates the outline from the seed. A room that loses its own contour keeps its last outline and becomes `broken`.
- **A room outline is one ring**, a hole of the wall union. Free-standing walls or columns inside a room are not cut out of it.
- **Pure ops return the same object when nothing changed.** This keeps undo and the dirty state clean.

Rules:
- **Resolving vertices.**
  - A `node` vertex takes the node's position.
  - A `wall` vertex takes the face point: the axis point at `offset`, moved along the face normal of `side` by the face offset. This is the same rule as wall-hosted devices.
  - When node A of the wall moves, `offset` is re-anchored by the same step that re-anchors openings and devices (`reanchorHosted`).
  - The post-edit step refreshes the cached `x,y`. When nothing moved, it returns the same zone objects.
- **Merged nodes.** When `mergeNodes` removes a node, `node` vertices on it re-point to the surviving node.
- **Lost anchors.** A node or wall can disappear: a deleted wall, an orphan node that was dropped. Its vertices become `{ kind: "free", x, y, lost: true }` at their last resolved position. The zone is `invalid` while any vertex is `lost`. Dragging that vertex clears `lost`: it re-snaps, or stays free with Alt. *(Author's call: a per-vertex marker keeps `invalid` derivable from data.)*
- **Shortened walls.** A wall can become shorter than a vertex's `offset`. The zone is then `invalid`, and the vertex is drawn at the clamped wall end. The data is not changed, so lengthening the wall again heals the zone. This is the same as wall-hosted devices. *(Author's call.)*
- **Room zones.**
  - A `room` zone uses the room's `outline`. It is `invalid` while the room is `broken`. The cached outline keeps it visible.
  - Deleting a room converts its room zones into custom zones. Their vertices are `lost` free vertices along the room's last outline, so the shape stays and the warning shows. *(Author's call.)*
- **Self-intersection.** The draw tool rejects a vertex that would make the polygon self-intersect. An edit or wall move that leads to self-intersection marks the zone `invalid` and keeps it.
- **Membership.** A device is in a zone if both hold:
  - its pose point is inside the zone outline (the boundary counts as inside; an invalid zone uses the outline it is drawn with);
  - the zone id is not in the device's `zoneBlacklist`.

  The outline is computed by a pure function and is never stored as authoritative.
- **Blacklist cleanup.** `zoneBlacklist` entries are dropped only when their zone is deleted. An entry for a zone that does not contain the device right now is kept. Moving a device out and back, or a temporary vertex edit, does not lose the opt-out. The UI lists only the containing zones. *(Author's call.)*
- **The climate sensor's `zoneIds`** (stage 2a manual room list) is **retired**. Zone membership replaces its meaning: the reading applies to the zones that contain the sensor. What goes:
  - `normalizeLevel` drops the field;
  - `dropUnknownZones` in `model/devices.ts` is removed;
  - the climate "Zones" fieldset in `panel/device-props.ts` is removed, together with its i18n keys.

  The Equipment "Zones" list (section 5) covers all device kinds. *(Author's call; the owner said this would be decided in this design.)*
- **Compatibility.** Plans without `automationZones` load unchanged. `schemaVersion` stays 1 and the Python backend is unchanged.
- **Room tool label.** The Plan step tool that creates rooms is labelled **"Room"** in the UI from now on, so it is not confused with automation zones. The stored key `zones` is unchanged. Renaming the code type `Zone` to `Room` is left to the builder.

## 5. Zones step (UI)

The step uses the same three columns as every step: zone list | properties | plan.

**Zone list:**
- Each row shows the name, the kind ("Room" or "Custom"), a member count and an invalid marker.
- A text filter.
- A click selects the zone and pans the plan to it.

**Tool rail:**
- **Select:** click a zone outline or fill to select it. Where zones overlap, repeated clicks cycle through them. Dragging a custom vertex moves it, and it re-snaps to a node, a wall face or the grid. **Alt**-drag detaches it as a free vertex. Shift keeps the angle constraint to the previous vertex.
- **Zone from room:** click inside a room to create a `room` zone named after the room. Clicking a room that already has a room-zone selects that zone instead.
- **Custom zone:**
  - A click adds a snapped vertex: node, then wall face, then grid, using the existing snap markers.
  - **Enter**, a double-click, or a click on the first vertex closes the polygon (≥ 3 vertices).
  - **Backspace** removes the last vertex, and **Esc** cancels.
  - A live preview of the polygon is shown, with an invalid indication when the next vertex would self-intersect.

**Properties panel:**
- With a zone selected:
  - name (focus-safe field);
  - kind, and for a room zone the room's name;
  - invalid reason, if any;
  - **Members:** each device inside the zone with a "participates" checkbox. Unchecking adds the zone to that device's `zoneBlacklist`.
  - **Delete zone** button. Delete and Backspace also work in this step, deleting the selected zone only.
- With nothing selected: a short hint and the zone count.

**Plan rendering in the Zones step:**
- Walls, openings and rooms are dimmed. Devices are shown, and a device's participation markers can be shown for the selected zone. Each zone is a translucent fill with a distinct hue from a fixed palette that works in both themes, plus an outline and a name label.
- The selected zone gets a stronger outline and vertex handles. An invalid zone is hatched and carries a warning colour.

**Other places:**
- **Equipment step:** the device properties show a "Zones" list: each zone containing the device, with the same "participates" checkbox. The blacklist UI lives on the device, as the owner put it ("a blacklist of zones in objects").
- **Other steps:** zones are not drawn.
- **Wizard header:** the "Zones" step cell reads "N zones" (all zones, invalid ones included), and is done when N > 0. This follows the count style of the other step cells.

## 6. Interaction with existing behaviour

- **One shared post-edit pass.** After any edit (walls, nodes, rooms, devices, zones), the post-edit step resolves anchored vertices, marks lost anchors and recomputes `invalid`. Deleting a zone also removes it from every device's `zoneBlacklist`.
- **Undo, redo, drafts, save and conflicts** are unchanged, because zones are part of the plan.
- **Wall trim.** The Ctrl+click trim is a separate small change, and the first operation that splits a wall. Its rule for vertices is:
  - a vertex on the cut piece becomes `lost`;
  - a vertex on a kept part re-homes to that part, with the new wall id and offset. Devices are re-anchored the same way.

## 7. Left to the builder

- The hue palette and label placement (pole of inaccessibility or centroid).
- Hit-testing tolerance, and the cycle order for overlapping zones.
- Whether to rename the code type `Zone` to `Room`. The stored key stays `zones`.
- Module split: for example `model/automation-zones.ts` (pure ops), `geometry/zones.ts` (resolve outline, contains, self-intersection), `editor/tools/zone-*.ts`, `panel/zones-*.ts`, `render/zones-svg.ts`.

## 8. Verification

- **Unit tests:**
  - vertex resolution (node and wall face, both sides);
  - lost-anchor fallback, and `lost` cleared by a drag;
  - a merged node re-points its vertices;
  - shortened-wall invalid, healed by lengthening;
  - room-zone outline, broken-room invalid, and a deleted room converted to a custom zone;
  - post-edit identity: same zone objects when nothing moved;
  - self-intersection detection;
  - membership (inside, boundary, outside, overlap, blacklist);
  - blacklist cleanup: dropped on zone delete, kept when the device leaves the zone;
  - climate `zoneIds` migration;
  - purity and no-op identity.
- **Tool tests:**
  - custom-zone drawing: snapping, close by Enter, first-vertex click and double-click, Backspace, Esc, self-intersection rejection;
  - zone from room;
  - selecting and cycling overlaps;
  - vertex drag with re-snap and Alt detach.
- **Panel tests:**
  - the Zones step layout;
  - members with the participation toggle reflected in the device;
  - the Equipment device "Zones" list;
  - Delete in the Zones step deletes only the zone;
  - save and reload;
  - undo.
- **Live check:** the owner draws the AppDaemon equivalents: kitchen, entrance, WC and main as room zones; "door" and "middle" as custom zones; an outdoor zone around the entrance. Then the owner checks memberships.
