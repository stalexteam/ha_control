# Plan Studio

Home Assistant custom integration that adds a "Plan Studio" sidebar panel: a 2D floor-plan editor in five steps. Plan: draw walls, openings and rooms. Equipment: place lights, sensors, switches and other devices. Binding: link each device to Home Assistant entities. Zones: mark automation zones, from rooms or drawn by hand, and see which devices each one contains. Power: draw the power-flow schematic from the grid to the devices and watch live values. Plans are saved to Home Assistant storage, and wall switches and smart buttons report button and switch events. Zones are a layer of the plan only: no automation uses them yet, and they create no Home Assistant entities.

## Install

HACS: add `stalexteam/ha_control` as a custom repository (category Integration), install Plan Studio, restart Home Assistant.

Manual: copy `custom_components/plan_studio` into your Home Assistant `config/custom_components/` and restart.

Then go to Settings -> Devices & services -> Add integration -> Plan Studio.

## Usage

- Tools: Select, Box, Wall, Door, Window, Opening and Room; pick from the toolbar.
- Trim: Ctrl+click (Cmd+click on macOS) a wall with the Select tool to remove the piece around the click, between the nearest intersections on either side (T-junctions or crossing walls), or up to the wall's end on a side without one. A wall with no intersections is deleted. One Undo step brings it back.
- Wall type (bearing / partition / railing) is only a visual style; thickness is a separate field and never changes when you pick a type. Both live in the left properties panel.
- With a placement tool active and nothing selected, the left panel shows the parameters of the next object (door: width, hinge, swing; window: width, outside side; opening: width; room: name, default "Room N"). Values are remembered per tool for the session; a custom room name is used once, then the default returns to the smallest unused "Room N".
- Opening properties: the "Passes light" checkbox lets the light of wall and ceiling lights through the opening. It is on by default for a plain opening and off for doors, windows, gates and wickets. The "Passes PIR" checkbox does the same for motion zones: on by default for plain openings only.
- Layout: tool rail, properties panel, plan.
- Hold Shift while drawing to snap to 90 degrees.
- Type a length in millimetres and press Enter to set the exact segment length.
- Tab switches to angle input.
- Esc works in two stages. The first Esc cancels the action in progress (a typed length, a wall chain, the first corner of a box, an aim drag). The next Esc switches to Select (Plan step) or the device Select (Equipment step). In the Zones step the first Esc drops the custom zone being drawn, and the next returns to the zone Select. In Select, Esc cancels a drag, then clears the selection.
- Ctrl+Z / Ctrl+Y: undo / redo.
- Grid toggle in the status bar turns the grid display and grid snapping (100 mm) on or off together.
- Save: the indicator shows the saved/unsaved state. If the plan changed elsewhere, a conflict dialog offers to overwrite or "Save as new".
- Plans: the selector in the toolbar (shown when there is more than one plan) opens any stored plan; the panel reopens the plan opened or saved last.
- New / delete plan: the "+" and bin buttons next to the plan name start a new unsaved plan (asks first if there are unsaved changes) or delete the open plan after confirmation (admin only; Escape cancels).
- Draft recovery: unsaved edits are kept locally in the browser and offered for restore on reopen. Esc postpones the decision; a banner keeps offering Restore / Discard.

### Equipment tab

- The steps Plan, Equipment, Binding and Zones sit in the title block under the top bar: click any step, or use Back / Next. Walls, openings and rooms are dimmed and locked in the Equipment step; devices are dimmed and locked in the Plan step.
- Tools: Select, Ceiling light, Wall light, Motion sensor, Illuminance sensor, Climate sensor, Wall switch, Smart button, Socket, Exhaust fan, Device. One click places one device.
- Wall switches and sockets snap to the nearest wall face (wall only). Wall lights, sensors and smart buttons go on a wall face near the cursor, otherwise at a free grid point (wall or free). Ceiling lights are always free. A Device is free unless "Wall mount" is checked (see below).
- Wall switch (a square) and smart button (a rounded square with a dot) are input containers: see "Wall switches and smart buttons" below. Their properties show a Type select that turns one into the other; it keeps the id, name and placement, resets the settings to the new type's defaults and drops bindings the new type does not have. A free smart button cannot become a wall switch until it is moved onto a wall. Plans with the former Switch device are migrated on load: a switch with a button-events binding becomes a smart button, any other becomes a wall switch.
- Climate sensor (wall or free): temperature and humidity. Its reading applies to the automation zones that contain it (see "Zones"); the room checkboxes are gone.
- Changed in 0.6.0: the climate sensor room list (zoneIds) is removed; stored values are dropped on load and leave the plan on the next save.
- Every device's properties show a "Zones" list: each automation zone that contains the device, with a "Participates" checkbox (see "Zones"), or "Not in any zone.".
- Exhaust fan (wall only): diameter 100, 125 or 150 mm; no cone and no aim.
- Device (formerly Equipment): a generic device, drawn as a block with an icon and a label. Its role follows from what is bound in the Binding step: Power, Voltage and Switch are all optional (a measurement only: Meter; a switch only: Switch; both: Metered switch; nothing: Dummy).
  - "Wall mount": the block sits flush against a wall face, its width along the wall; it slides along walls when dragged. Unchecking it leaves the block where it is, free. The Device tool's next-device settings have the same checkbox.
  - "Inverter": the device is an inverter; Power is replaced by Input power and Output power, and its schematic block gains PV and battery ports.
  - "Controllable" (shown when a switch is bound): Plan Studio may operate the switch. A new switch is read-only.
  - Devices not on the plan: with nothing selected, the left panel lists them under "Not on the plan", with a "New device" button. Such a device has a name and the fields above but no place, shape or icon; it is never drawn on the plan and is in no zone. Typical use: a meter, a breaker or an inverter that matters only in the Power schematic. Deleting it also removes its schematic block and wires (Ctrl+Z restores all).
- Select: click a device to select it, drag to move it (Shift locks the axis). A wall device slides along its wall, can be dragged onto another wall, or into open space if its kind allows. Delete removes it. A selected wall light or sensor shows a direction handle (a segment ending in a round knob): drag the knob to set the aim (wall device) or rotation (free device), Shift snaps to 15 degrees, Esc cancels.
- Left panel (between the tool rail and the plan): properties of the selected device (name, kind settings, rotation for free devices, side, offset and aim, -90 to 90 degrees off the wall normal, for wall lights and sensors). With a placement tool active and nothing selected, it edits the defaults of the next device.
- A newly placed device is selected, so the left panel shows its properties. Esc then switches to the device Select tool; pick the placement tool again to see the next-device defaults.
- Deleting a wall also deletes the devices on it; Ctrl+Z brings both back.
- "Cones & zones" in the status bar shows or hides light pools, wall-light cones and motion zones. Each is clipped to what its device sees: every wall type blocks it, for outdoor devices too. Light passes openings with "Passes light"; motion zones pass openings with "Passes PIR" (on by default for plain openings only). Motion zones are violet; light cones and pools are amber. "Cones & zones" means these device cones and motion zones, not the automation zones of the Zones step.

### Binding

Binding links every device on the plan to Home Assistant entities, one field per role.

- Layout: device list | properties | plan. The list filters Not bound / Bound / All and by text; its arrow button folds it to a narrow strip. Next in the step header goes on to Zones.
- Steps:
  1. Select a device on the plan or in the list, or press "Next unbound device" in the footer of the properties panel, next to the count of devices not bound.
  2. Fill or change each role in its search field (for example Control and Power for a socket, Temperature and Humidity for a climate sensor). The clear button empties a role; Ctrl+Z undoes.
- Filter rules: candidates are chosen only by domain, device class and unit, never by guessing from entity ids or names. The strict list needs the role's domain and a matching device class; an entity without a device class matches by unit, and a conflicting device class excludes it (a battery % sensor is never a humidity candidate). Hidden, disabled, config and diagnostic entities are left out. "Show all" keeps only the domain filter.
- Status:
  - Bound: the primary role is set (Control for lights, sockets and fans; Motion or Illuminance for sensors; State for a wall switch; On for a smart button, plus Off and Auto while they are enabled; Temperature or Humidity for a climate sensor).
  - Partly bound: some role is set, but not the primary one.
  - A Device has no required role: with nothing bound it shows "Dummy" and counts as done; its Switch row is called Switch. Devices not on the plan are listed in their own group, "Not on the plan".
  - Missing (red): a bound entity is neither in the live states nor in the entity registry. A disabled or unavailable entity is only noted; the device still counts as bound. Nothing is ever removed automatically.
- One entity may be bound to several devices; the field then says "Also bound to". For smart button triggers it compares the entity and the action value, so two buttons of one physical switch are not reported.
- The entity, device and area registries load once, when the Binding step first opens. If that fails, a notice offers Retry; the fields keep working from the live states and nothing is flagged Missing.
- Delete does nothing in this step. Bindings are saved with the plan.

### Wall switches and smart buttons

Wall switches and smart buttons are input containers: virtual objects that report events. Each event is an intent (`toggle`, `set on`, `set off` or `auto`) plus a status (`ok` or `error`; the reason is "not configured" or "unavailable (ids)"). Nothing acts on intents yet; controllers will come later. No Home Assistant entities or events are created. They run inside Home Assistant for every saved plan, also while the panel is closed, and changes take effect when the plan is saved.

- Smart button, in the Binding step:
  - On / Off: the action sensor or event entity, Button ("— (single button)" or 1 to 9) and Event (`single`, `double`, `hold` or any other text). The single button waits for the action value `event`, button N for `N_event`. In toggle mode a press gives `toggle`.
  - "Separate Off" splits the section into On and Off, each with its own trigger: On gives `set on`, Off gives `set off`. A repeated `set on` is meaningful (for example, to extend a timer).
  - "Auto" adds the Auto section, whose trigger gives `auto`. Both new sections start with the On entity.
  - Identical triggers in one smart button show a warning; the first of On, Off, Auto wins.
- Wall switch, in the Binding step:
  - State: the relay, light or binary sensor it follows. Any on/off change of that entity that Plan Studio did not cause gives `set on` or `set off`. This includes changes from the Home Assistant UI, automations and AppDaemon.
  - "Auto by double toggle": a change within "Window, s" (1 to 10 seconds, default 3) of the previous one gives `auto`, and so do later quick changes. The first change still gives `set`.
- Not a press: a change from a missing or unavailable state, the same state again, and anything while the status is `error`. A recovery from `error` gives no intent.
- Nothing is persisted. The last event and the status are lost on a Home Assistant restart or an integration reload. Version 0.5.0 deletes the old `plan_studio.runtime` store on start.
- Removed in 0.5.0: Default output, Final state, output colours and the fault dot. Version 0.4 plans load clean, and the dropped fields leave the stored plan on the next save.
- Binding line, under the entity fields:
  - "Last event: <event>, HH:MM:SS" (browser local time)
  - "No events yet"
  - "Status: error, not configured"
  - "Status: error, unavailable (ids)"
  - "Not saved yet" (the saved plan has no such container, or has it as the other type)
  - or the feed error.
- Plan badge, top-right of the symbol, in every step:
  - A red alert while the status is `error`. An unbound or partly bound container shows it permanently.
  - An intent icon (toggle, auto, power, power-off) for 3 s, only for events that arrive while the panel is open.
  - A dashed outline when there is no live data. When the connection drops, the reconnect is retried every 5 s for up to 1 minute; reopen the panel if Home Assistant took longer.
- Upgrade note: reload any open Plan Studio tab after updating.

### Zones

Automation zones are named areas for future automations: a room zone covers a room, a custom zone is a polygon you draw. For now they are a layer of the plan only: no automation uses them and no Home Assistant entities are created.

- Layout: tools and zone list | properties | plan.
  - The rail holds the tools Select, Zone from room and Custom zone, then the zone list with a text filter. Each row shows the name, the kind (Room or Custom), the number of participating devices and a marker when the zone is invalid. A click on a row selects the zone and pans the plan to it.
  - Zones are drawn only in this step: a translucent fill in its own colour, an outline and the name. Walls, openings and rooms are dimmed, and room labels are hidden (the room zone carries the name).
- Zone from room: click inside a room to add a zone named after the room. Clicking a room that already has a zone selects that zone.
- Custom zone: each click adds a vertex.
  - Snapping, in order: node, then wall, then grid, with a visible snap marker. A node vertex sits at the wall's axis corner. A wall vertex sits on the face of the side you point at, and the marker shows that face point.
  - Alt places a free vertex at the pointer. Shift keeps 90 degrees to the previous vertex.
  - With 3 vertices or more, close the zone with Enter, a click on the first vertex or a second click on the last vertex. It is named "Zone N" and selected.
  - Backspace or Delete removes the last vertex. Esc cancels the zone. A vertex whose edge would cross the outline is refused, and the preview turns red.
- Select: click a zone to select it. Where zones overlap, repeated clicks cycle through them, smallest first. Drag a vertex of the selected custom zone to move it: it re-snaps like a new vertex, Alt places it free, Shift keeps 90 degrees to the previous vertex. Vertices cannot be added or removed yet.
- Membership: a device belongs to every zone that contains its position (for a wall device, its point on the wall face). A device on the edge counts. Zones may overlap and may lie outdoors.
- Participates: the zone's properties list its devices, each with a "Participates" checkbox; the Equipment step shows the same choice in each device's "Zones" list. An opt-out is kept when the device leaves the zone, and it is removed only when the zone is deleted.
- Delete or Backspace (with no custom zone being drawn) and the "Delete zone" button delete only the selected zone, never a device or a wall. Ctrl+Z restores it.
- Wall edits:
  - Anchored vertices follow their walls and corners.
  - Deleting a wall or a corner makes its vertices lost, at their last position: drag a lost vertex to place it again.
  - A vertex beyond the end of a shortened wall makes the zone invalid; lengthening the wall heals it.
  - Deleting a room turns its room zone into a custom zone with all vertices lost.
  - Room zones follow their rooms when the rooms are re-detected.
- After editing the plan, check the Zones step. An invalid zone is hatched and marked in the list, and its properties give the reason:
  - "The room is broken: fix its walls."
  - "A vertex lost its wall or corner: drag it to place it again."
  - "A vertex lies beyond the end of its wall."
  - "The outline crosses itself: move a vertex." (also for an outline collapsed to no area)
- Tip: adjacent custom zones do not snap to each other yet. Place their shared vertices on the same wall points (a corner, a wall midpoint) so that their edges meet.

### Power

The Power step draws how electricity reaches the devices: a schematic of blocks joined by wires, with live values from Home Assistant. It has its own canvas; the floor plan is not shown. Pan and zoom work as on the plan.

- Layout: tool rail | properties | schematic.
- Blocks:
  - Grid source (AC-IN): always present and cannot be deleted. Power and voltage entities.
  - Device: any device, on the plan (pin mark) or not on the plan. With the Device tool active, the properties list the devices that can be placed (sockets, Devices, and devices with a power or control binding that are not in the schematic yet), with "New device" on top to create a device that is not on the plan: click one, then click the canvas. A Device block's properties edit the device itself (name, Power or Input/Output power, Voltage, Switch, Controllable, Inverter), the same fields as the Equipment and Binding steps; other kinds show their bindings read-only. The block shows only the bound values; a switch that is not controllable carries a lock mark. An inverter shows In, Out and its loss.
  - Changed in 0.7.2: the Meter block is gone. Opening a plan turns each meter block into a Device that is not on the plan, with the same entities, and the Inverter checkbox moves from the block to the device.
  - Bus: a bar, horizontal or vertical (Orientation in the properties), that any number of wires can join anywhere along its length. Drag its ends to resize it, or set Length and Thickness.
  - Battery: power (positive while charging) and state of charge. It connects to an inverter's battery port, directly or through a bus.
  - PV field: power. It connects to an inverter's PV port, directly or through a bus.
  - Transfer switch: "2 inputs → 1 output" or "1 input → 2 outputs", with the position A, 0 (off) or B.
  - Remainder: the consumption no meter accounts for (dashed amber outline). One per bus.
- Wiring: drag from a free port to another port or onto a bus. A wire always runs from an output to an input, whichever end you start from. Each port takes one wire; branch through a bus. A wire that would close a loop, or join a battery or PV line to a different line, is refused with a message.
- Ports place themselves on the side facing the other end of their wire. Drag a wired port along the block edge to pin it there; "Auto ports" in the properties drops the pins.
- Editing: drag a block to move it, and its wires follow. Delete removes the selected block with its wires, or the selected wire. Ctrl+Z / Ctrl+Y undo and redo, in one history with the plan steps. The schematic is saved with the plan.
- Live values are computed by the integration and shown inside the blocks: power, voltage, state of charge, and the inverter's loss. Power is converted to W (from W, kW, MW, mW) and voltage to V (from V, kV, mV). A missing or unavailable entity, or an unsupported unit, shows "—": nothing is estimated.
- Wires show the flow: an arrow in the direction of the power, a glow while energized, a thin line while de-energized, and a grey dashed line when there is no data. When the live feed fails, the reason is shown at the top of the properties.
- Transfer position: click A, 0 or B on the block or in its properties. The position is live state kept by the integration (default A); it is not part of the plan and needs no Save.
- The step is done when the grid source has a power entity and at least one wire exists.

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

Websocket API smoke test (long-lived admin access token, never commit it). It saves and deletes a throwaway plan, and sets and then removes the `binary_sensor.plan_studio_smoke` entity through the REST API:

```
HA_URL=http://<HA_HOST>:8123 HA_TOKEN=... node scripts/smoke_ws.mjs
```

Expected output: `SMOKE OK`.

## Acceptance checklist

Manual scenario on a live instance.

1. Open Plan Studio. Draw a box 6000 x 4000 mm measured by inner face. Draw a balcony with a railing outside (wall chain using Shift and typed lengths). Add two partitions joined with T-nodes. Add doors in the partitions and windows in the load-bearing walls. Create three named rooms. Save. Expected: walls join without gaps, room areas are plausible, the indicator says "saved".
2. Restart Home Assistant core and reopen the panel. Expected: the plan is intact and looks the same; edit and save still work and the revision increases.
3. Open the panel in two tabs. Save in the second, then save in the first. Expected: a conflict dialog; "Save as new" creates a second plan and leaves the first untouched.
4. Zones. On a plan with the rooms kitchen, entrance, WC and main, add a room zone for each with Zone from room. Draw the custom zones "door" (at the entrance door) and "middle" (in the middle of the main room), renaming them in the properties, and one zone outdoors. Expected: every device is listed in each zone that contains it (member lists, list counts and the Equipment "Zones" list). Uncheck Participates for one device, move the device out of the zone and back: the opt-out stays. Delete a wall under a custom zone vertex: the zone turns invalid with "A vertex lost its wall or corner: drag it to place it again."; Ctrl+Z restores the wall and the zone is valid again. Save and reopen: the zones, memberships and opt-outs are intact.
5. Power. Set the grid source's power entity. Place the inverter as a Device with "Inverter" checked, a battery on its battery port, a metered Device ("New device", Power and Switch) after it, and a transfer switch (2 inputs → 1 output) with A from the meter and B from a bus fed by the grid. Wire the transfer output to a bus with two plan devices and a remainder. Expected: values appear in the blocks, energized wires glow with arrows in the flow direction, and the remainder shows the consumption no meter accounts for. Click B on the transfer switch: the energized path moves to B at once, with no Save. Make one entity unavailable: every value that depends on it shows "—". Delete a wire and press Ctrl+Z: it comes back. Save and reopen: the schematic is intact.
