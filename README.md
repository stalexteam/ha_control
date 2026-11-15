# Plan Studio

Home Assistant custom integration that adds a "Plan Studio" sidebar panel. Stage 1 is a 2D floor-plan editor: draw walls, openings and zones, and save plans to Home Assistant storage.

## Install

HACS: add `stalexteam/ha_control` as a custom repository (category Integration), install Plan Studio, restart Home Assistant.

Manual: copy `custom_components/plan_studio` into your Home Assistant `config/custom_components/` and restart.

Then go to Settings -> Devices & services -> Add integration -> Plan Studio.

## Usage

- Tools: walls, doors, windows, zones, select/move; pick from the toolbar.
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

- Switch between "Plan" and "Equipment" in the top bar. Walls, openings and rooms are dimmed and locked in the Equipment tab; devices are dimmed and locked in the Plan tab.
- Tools: Select, Ceiling light, Wall light, Motion sensor, Illuminance sensor, Switch, Socket, Equipment. One click places one device.
- Switches and sockets snap to the nearest wall face. Wall lights and sensors go on a wall face near the cursor, otherwise at a free grid point. Ceiling lights and equipment blocks are always free.
- Select: click a device to select it, drag to move it (Shift locks the axis). A wall device slides along its wall, can be dragged onto another wall, or into open space if its kind allows. Delete removes it.
- Right panel: properties of the selected device (name, kind settings, rotation for free devices, side and offset for wall devices). With a placement tool active and nothing selected, it edits the defaults of the next device.
- Deleting a wall also deletes the devices on it; Ctrl+Z brings both back.
- "Cones & zones" in the status bar shows or hides light pools, wall-light cones and motion zones.

## Development

```
npm install
npm test            # unit tests
npm run dev         # dev harness
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
