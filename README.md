# Plan Studio

Home Assistant custom integration that adds a "Plan Studio" sidebar panel. Stage 1 is a 2D floor-plan editor: draw walls, openings and zones, and save plans to Home Assistant storage.

## Install

HACS: add `stalexteam/ha_control` as a custom repository (category Integration), install Plan Studio, restart Home Assistant.

Manual: copy `custom_components/plan_studio` into your Home Assistant `config/custom_components/` and restart.

Then go to Settings -> Devices & services -> Add integration -> Plan Studio.

## Usage

- Tools: walls, doors, windows, zones, select/move; pick from the toolbar.
- Wall type (bearing / partition / railing) is only a visual style; thickness is a separate field and never changes when you pick a type. Both live in the left properties panel.
- With a placement tool active and nothing selected, the left panel shows the parameters of the next object (door: width, hinge, swing; window: width, outside side; opening: width; room: name, default "Room N"). Values are remembered per tool for the session; a custom room name is used once, then the default returns to the smallest unused "Room N".
- Layout: tool rail, properties panel, plan.
- Hold Shift while drawing to snap to 90 degrees.
- Type a length in millimetres and press Enter to set the exact segment length.
- Tab switches to angle input.
- Esc ends the current wall chain.
- Ctrl+Z / Ctrl+Y: undo / redo.
- Grid toggle in the status bar turns the grid display and grid snapping (100 mm) on or off together.
- Save: the indicator shows the saved/unsaved state. If the plan changed elsewhere, a conflict dialog offers to overwrite or "Save as new".
- Plans: the selector in the toolbar (shown when there is more than one plan) opens any stored plan; the panel reopens the plan opened or saved last.
- New / delete plan: the "+" and bin buttons next to the plan name start a new unsaved plan (asks first if there are unsaved changes) or delete the open plan after confirmation (admin only; Escape cancels).
- Draft recovery: unsaved edits are kept locally in the browser and offered for restore on reopen. Esc postpones the decision; a banner keeps offering Restore / Discard.

### Equipment tab

- The steps Plan, Equipment and Binding sit in the title block under the top bar: click any step, or use Back / Next. Walls, openings and rooms are dimmed and locked in the Equipment step; devices are dimmed and locked in the Plan step.
- Tools: Select, Ceiling light, Wall light, Motion sensor, Illuminance sensor, Climate sensor, Switch, Socket, Exhaust fan, Equipment. One click places one device.
- Switches and sockets snap to the nearest wall face. Wall lights and sensors go on a wall face near the cursor, otherwise at a free grid point. Ceiling lights and equipment blocks are always free.
- Climate sensor (wall or free): temperature and humidity; checks the rooms it applies to, none checked means the room it stands in.
- Exhaust fan (wall only): diameter 100, 125 or 150 mm; no cone and no aim.
- Select: click a device to select it, drag to move it (Shift locks the axis). A wall device slides along its wall, can be dragged onto another wall, or into open space if its kind allows. Delete removes it. A selected wall light or sensor shows a direction handle (a segment ending in a round knob): drag the knob to set the aim (wall device) or rotation (free device), Shift snaps to 15 degrees, Esc cancels.
- Left panel (between the tool rail and the plan): properties of the selected device (name, kind settings, rotation for free devices, side, offset and aim, -90 to 90 degrees off the wall normal, for wall lights and sensors). With a placement tool active and nothing selected, it edits the defaults of the next device.
- A newly placed device is selected, so the left panel shows its properties. Press Esc (or click empty space with the Select tool) to get back to the next-device defaults.
- Deleting a wall also deletes the devices on it; Ctrl+Z brings both back.
- "Cones & zones" in the status bar shows or hides light pools, wall-light cones and motion zones.

### Binding

Binding links every device on the plan to Home Assistant entities, one field per role.

- Layout: device list | properties | plan. The list filters Not bound / Bound / All and by text; its arrow button folds it to a narrow strip.
- Steps:
  1. Select a device on the plan or in the list, or press "Next unbound device".
  2. Optional: pick its "Home Assistant device" (search by name, model or area). Every empty role with exactly one matching entity on that device is filled in one undoable step. Roles with several matches stay empty, and the panel says how many matched. Filled roles are never overwritten.
  3. Fill or change each role in its search field (for example Control and Power for a socket, Temperature and Humidity for a climate sensor). The clear button empties a role; Ctrl+Z undoes.
- Filter rules: candidates are chosen only by domain, device class and unit, never by guessing from entity ids or names. The strict list needs the role's domain and a matching device class; an entity without a device class matches by unit, and a conflicting device class excludes it (a battery % sensor is never a humidity candidate). Hidden, disabled, config and diagnostic entities are left out. "Show all" keeps only the domain filter.
- Status:
  - Bound: the primary role is set (Control for lights, sockets, fans and equipment; Motion, Illuminance or Button events for sensors and switches; Temperature or Humidity for a climate sensor).
  - Partly bound: some role is set, but not the primary one.
  - Missing (red): a bound entity is neither in the live states nor in the entity registry. A disabled or unavailable entity is only noted; the device still counts as bound. Nothing is ever removed automatically.
- One entity may be bound to several devices; the field then says "Also bound to".
- The entity, device and area registries load once, when the Binding step first opens. If that fails, a notice offers Retry; the fields keep working from the live states and nothing is flagged Missing.
- Delete does nothing in this step. Bindings are saved with the plan.

## Development

```
npm install
npm test            # unit tests
npm run dev         # dev harness (sample HA states and registries for the Binding step)
npm run build       # bundle to custom_components/plan_studio/frontend/
```

Deploy to a live instance (builds, copies over ssh as root, restarts core). `PLAN_STUDIO_HOST` is required:

```
PLAN_STUDIO_HOST=<HA_HOST> bash scripts/deploy.sh
```

Websocket API smoke test (long-lived access token, never commit it):

```
HA_URL=http://<HA_HOST>:8123 HA_TOKEN=... node scripts/smoke_ws.mjs
```

Expected output: `SMOKE OK`.

## Acceptance checklist

Manual scenario on a live instance.

1. Open Plan Studio. Draw a box 6000 x 4000 mm measured by inner face. Draw a balcony with a railing outside (wall chain using Shift and typed lengths). Add two partitions joined with T-nodes. Add doors in the partitions and windows in the load-bearing walls. Create three named zones. Save. Expected: walls join without gaps, zone areas are plausible, the indicator says "saved".
2. Restart Home Assistant core and reopen the panel. Expected: the plan is intact and looks the same; edit and save still work and the revision increases.
3. Open the panel in two tabs. Save in the second, then save in the first. Expected: a conflict dialog; "Save as new" creates a second plan and leaves the first untouched.
