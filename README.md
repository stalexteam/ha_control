# Plan Studio

Home Assistant custom integration that adds a "Plan Studio" sidebar panel: a 2D floor-plan editor in five steps. Plan: draw walls, openings and zones (the spaces of the home, inside or outdoors). Equipment: place lights, sensors, switches and other devices. Binding: link each device to Home Assistant entities. Power: draw the power-flow schematic from the grid to the devices and watch live values. Automation: condition rules that switch devices and close valves, run inside Home Assistant. Plans are saved to Home Assistant storage, and wall switches and smart buttons report button and switch events. Zones organise the automation rules; they create no Home Assistant entities.

## Install

HACS: add `stalexteam/ha_control` as a custom repository (category Integration), install Plan Studio, restart Home Assistant.

Manual: copy `custom_components/plan_studio` into your Home Assistant `config/custom_components/` and restart.

Then go to Settings -> Devices & services -> Add integration -> Plan Studio.

## Usage

- Tools: Select, Box, Wall, Door, Window, Opening and Zone in the tool rail. Each button shows an icon and a name; the active tool is highlighted, and the status bar names it with its keys.
- Shortcuts in the Plan step: V Select, B Box, W Wall, D Door, N Window, O Opening, Z Zone (shown on the buttons; ignored while typing in a field or with Ctrl, Alt or Shift held).
- Trim: Ctrl+click (Cmd+click on macOS) a wall with the Select tool to remove the piece around the click, between the nearest intersections on either side (T-junctions or crossing walls), or up to the wall's end on a side without one. A wall with no intersections is deleted. One Undo step brings it back.
- Wall type (bearing / partition / railing) is only a visual style; thickness is a separate field and never changes when you pick a type. Both live in the left properties panel.
- With a placement tool active and nothing selected, the left panel shows the parameters of the next object (door: width, hinge, swing; window: width, outside side; opening: width; zone: method, name, default "Zone N", and Automation). Values are remembered per tool for the session; a custom zone name is used once, then the default returns to the smallest unused "Zone N".
- Opening properties: the "Passes light" checkbox lets the light of wall and ceiling lights through the opening. It is on by default for a plain opening and off for doors, windows, gates and wickets. The "Passes PIR" checkbox does the same for motion zones: on by default for plain openings only.
- Layout: tool rail, properties panel, plan.
- Hold Shift while drawing to snap to 90 degrees.
- Type a length in millimetres and press Enter to set the exact segment length.
- Tab switches to angle input.
- Esc works in two stages. The first Esc cancels the action in progress (a typed length, a wall chain, the first corner of a box, an aim drag). The next Esc switches to Select (Plan step) or the device Select (Equipment step). With the Zone tool, the first Esc drops the polygon being drawn. In Select, Esc cancels a drag, then clears the selection.
- Ctrl+Z / Ctrl+Y: undo / redo.
- Grid toggle in the status bar turns the grid display and grid snapping (100 mm) on or off together.
- Save: the indicator shows the saved/unsaved state. If the plan changed elsewhere, a conflict dialog offers to overwrite or "Save as new".
- Plans: the selector in the toolbar (shown when there is more than one plan) opens any stored plan; the panel reopens the plan opened or saved last.
- New / delete plan: the "+" and bin buttons next to the plan name start a new unsaved plan (asks first if there are unsaved changes) or delete the open plan after confirmation (admin only; Escape cancels).
- Draft recovery: unsaved edits are kept locally in the browser and offered for restore on reopen. Esc postpones the decision; a banner keeps offering Restore / Discard.

### Equipment tab

- The steps Plan, Equipment, Binding and Power sit in the title block under the top bar: click any step, or use Back / Next. Walls, openings and zones are dimmed and locked in the Equipment step (zones as thin outlines only). The Plan step does not show devices at all; the Equipment step only places them (no live state there).
- Tools: Select, Ceiling light, Wall light, Motion sensor, Illuminance sensor, Climate sensor, Leak sensor, Wall switch, Smart button, Valve, Socket, Exhaust fan, Device. One click places one device. On a short screen the tool rail scrolls.
- Wall switches and sockets snap to the nearest wall face (wall only). Wall lights, sensors (the leak sensor too), smart buttons and valves go on a wall face near the cursor, otherwise at a free grid point (wall or free). Near a corner, a wall device goes on the wall whose face is nearer the cursor. Ceiling lights are always free. A Device is free unless "Wall mount" is checked (see below).
- Leak sensor (a circle with a drop): its Leak binding takes only a binary sensor with the moisture device class.
- Valve (a bow-tie): an input container with the wall switch rules, see below. It has no Type select.
- Wall switch (a square) and smart button (a rounded square with a dot) are input containers: see "Wall switches and smart buttons" below. Their properties show a Type select that turns one into the other; it keeps the id, name and placement, resets the settings to the new type's defaults and drops bindings the new type does not have. A free smart button cannot become a wall switch until it is moved onto a wall. Plans with the former Switch device are migrated on load: a switch with a button-events binding becomes a smart button, any other becomes a wall switch.
- Climate sensor (wall or free): temperature and humidity. Its reading applies to the zones that contain it (see "Zones").
- Changed in 0.6.0: the climate sensor room list (zoneIds) is removed; stored values are dropped on load and leave the plan on the next save.
- Every device's properties show a "Zones" list: each zone that contains the device, with a "Participates" checkbox (see "Zones"), or "Not in any zone.".
- Exhaust fan (wall only): diameter 100, 125 or 150 mm; no cone and no aim.
- Device (formerly Equipment): a generic device, drawn as a block with an icon and a label. Its role follows from what is bound in the Binding step: Power, Voltage and Switch are all optional (a measurement only: Meter; a switch only: Switch; both: Metered switch; nothing: Dummy).
  - "Wall mount": the block sits flush against a wall face, its width along the wall; it slides along walls when dragged. It stops flush against an adjoining wall in a corner or at a partition (T joint) instead of entering it; within the snap distance of that position it snaps to it. A straight wall split by a node does not stop it. Unchecking it leaves the block where it is, free. The Device tool's next-device settings have the same checkbox.
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
- Live state (Binding step only), read from Home Assistant as it changes:
  - Lights: filled while on, and their light cone or pool is drawn as a soft gradient from the light (no outlines; nothing while off), with a bubble saying how long they have been on. Exhaust fans: filled while on, with the same timer. Off: outline only.
  - Sockets and Devices: filled while on; a bubble with the power while they draw at least 1 W (a Device without a Switch shows only the power).
  - Motion sensors: while detecting, the symbol lights up and its zone is drawn (transparent), with a bubble saying for how long; while idle the zone is not drawn. Leak sensors: red while wet, with the same timer.
  - Wall switches are filled while on, valves while open (a valve bound to a switch: on = open).
  - Timer text: seconds (`42`), then `m:ss` (`3:12`), from an hour `h:mm:ss` (`1:05:12`). It counts from the entity's last change, so it is right as soon as the plan opens; after a Home Assistant restart it counts from the restart.
  - Events: a button press shows the raw action (`single`, `2_double`), a wall switch `on` / `off`, a valve `open` / `closed`, in a bubble for 10 s. Only events while the panel is open count.
  - Bubbles sit beside the symbol inside its zone: a wall device's perpendicular to the wall into the room, a free device's to the right or left; where that does not fit (in a corner), at 45 degrees into the zone, then the remaining sides. Several bubbles stack. The "Cones & zones" checkbox hides the light gradients and motion zones.
  - Bubbles pop in and fade out (no animation with reduced motion). A bound entity that is unknown or unavailable draws a dashed outline and no bubble.
- One entity may be bound to several devices; the field then says "Also bound to". For smart button triggers it compares the entity and the action value, so two buttons of one physical switch are not reported.
- The entity, device and area registries load once, when the Binding step first opens. If that fails, a notice offers Retry; the fields keep working from the live states and nothing is flagged Missing.
- Delete does nothing in this step. Bindings are saved with the plan.

### Wall switches, smart buttons and valves

Wall switches, smart buttons and valves are input containers: virtual objects that report events. Each event is an intent (`toggle`, `set on`, `set off` or `auto`) plus a status (`ok` or `error`; the reason is "not configured" or "unavailable (ids)"). Nothing acts on intents yet; controllers will come later. No Home Assistant entities or events are created. They run inside Home Assistant for every saved plan, also while the panel is closed, and changes take effect when the plan is saved.

- Smart button, in the Binding step:
  - On / Off: the action sensor or event entity, Button ("— (single button)" or 1 to 9) and Event (`single`, `double`, `hold` or any other text). The single button waits for the action value `event`, button N for `N_event`. In toggle mode a press gives `toggle`.
  - "Separate Off" splits the section into On and Off, each with its own trigger: On gives `set on`, Off gives `set off`. A repeated `set on` is meaningful (for example, to extend a timer).
  - "Auto" adds the Auto section, whose trigger gives `auto`. Both new sections start with the On entity.
  - Identical triggers in one smart button show a warning; the first of On, Off, Auto wins.
- Wall switch, in the Binding step:
  - State: the relay, light or binary sensor it follows. Any on/off change of that entity that Plan Studio did not cause gives `set on` or `set off`. This includes changes from the Home Assistant UI, automations and AppDaemon.
  - "Auto by double toggle": a change within "Window, s" (1 to 10 seconds, default 3) of the previous one gives `auto`, and so do later quick changes. The first change still gives `set`.
- Valve, in the Binding step: State takes a `valve` or `switch` entity. Open counts as on and closed as off (`set on` = open); opening and closing are not changes, and after an unavailable or unknown state the next open or closed is not a press. The binding line says "set open" / "set closed", and the plan badge shows an open or closed valve. "Auto by double toggle" works as for a wall switch.
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
- Plan badge, top-right of the symbol, in the Binding step:
  - A red alert while the status is `error`. An unbound or partly bound container shows it permanently.
  - The intent icon of earlier versions is gone: the Binding step shows the raw action in a 10 s bubble instead (see Live state).
  - A dashed outline when there is no live data. When the connection drops, the reconnect is retried every 5 s for up to 1 minute; reopen the panel if Home Assistant took longer.
- Upgrade note: reload any open Plan Studio tab after updating.

### Zones

A zone is a space of the home: a room, a part of a room, or an area outdoors. Zones replace the rooms and the separate Zones step of earlier versions; they are drawn in the Plan step.

- Zone tool: pick the method in its properties.
  - By walls: click inside closed walls. The zone follows the inner faces of the walls and is re-detected on every wall edit. Clicking where a by-walls zone already exists selects it. A click outside closed walls shows "Click inside closed walls, or use Polygon".
  - Polygon: each click adds a vertex, anywhere, outdoors too. Snapping, in order: node or wall corner (the nearer one), wall, other zones' vertices and edges, then grid, with a snap marker. A wall corner is a corner of the drawn wall outline, inside a room or outside; a vertex on an inner corner follows the wall, one on an outer corner or a wall end is free. Alt places a free vertex, Shift keeps 90 degrees. Close with Enter, a click on the first vertex or a second click on the last one. Backspace or Ctrl+Z removes the last vertex, Esc cancels. A vertex whose edge would cross the outline is refused.
  - The properties also hold the next zone's name ("Zone N") and the Automation checkbox.
- Zones may overlap (for example, "door" and "middle" inside "Main"). A device belongs to every zone that contains its position (for a wall device, its point on the wall face). Each zone shows its own area in m².
- Select tool: walls, openings and nodes are picked first, then zones. Where zones overlap, repeated clicks cycle through them, smallest first. The selected zone's outline is drawn on top. Drag a vertex of a selected polygon to move it; double-click an edge to add a vertex; select a vertex and press Delete to remove it (at least 3 stay).
- With nothing selected, or with the Zone tool active, the left panel lists the zones (filter, colour, method, area, invalid marker); a click selects the zone and pans to it.
- Zone properties: name, area, outline method, "Takes part in automation" (on by default), the devices inside with a "Participates" checkbox each, and "Delete zone". The Equipment step shows the same choice in each device's "Zones" list; an opt-out is kept when the device leaves the zone and removed only with the zone.
- Wall edits: anchored polygon vertices follow their walls and corners; a deleted wall or corner leaves its vertices "lost" where they were (drag them to place them again). A by-walls zone whose walls no longer close keeps its last outline and is flagged; "Keep outline as a polygon" turns it into a polygon zone with the same name and opt-outs.
- Invalid zones are marked in the list and in the Plan step cell ("1 invalid"), and their properties give the reason: "The walls no longer close this zone.", "A vertex lost its wall or corner: drag it to place it again.", "A vertex lies beyond the end of its wall.", "The outline crosses itself: move a vertex.".
- Upgrade to 0.8.0:
  - When Home Assistant starts, every stored plan is converted to plan schema 2 and saved: each room becomes a by-walls zone (keeping the name of its automation zone, if it had one), custom zones become polygon zones, and device opt-outs are kept.
  - Save or discard unsaved edits in any open Plan Studio tab before updating: browser drafts of the old format are discarded ("A draft from an older version was discarded."). A page that is older or newer than the integration says so and asks for a reload.
  - Rollback to 0.7.x needs the storage backup taken before the update: stop Home Assistant core, restore `/config/.storage/plan_studio*` together with the old integration files, then start. Version 0.7.x cannot read schema 2 plans.

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
  - Transfer switch: "2 inputs → 1 output" or "1 input → 2 outputs", with the position A, 0 (off) or B. The active path is drawn as a thicker part of the block's outline, from the selected input to the output, in the colour of the wire.
  - Remainder: the consumption no meter accounts for (dashed amber outline). One per bus. Loads on the same bus whose power is unknown (unavailable, or no Power bound) are counted into it; the block then says "incl. <name>" (or "incl. N without data", with the names in a tooltip). An unknown through device, bus or transfer switch still makes it "—".
  - "Enable output" in a device block's properties shows or hides its OUT port. New device blocks start without it (a load); an inverter always has it. Unchecking it removes the wire on that port.
- Wiring: drag from a free port to another port or onto a bus. A wire always runs from an output to an input, whichever end you start from. Each port takes one wire; branch through a bus. A wire that would close a loop, or join a battery or PV line to a different line, is refused with a message.
- Ports place themselves on the side facing the other end of their wire. Drag a wired port along the block edge to pin it there; "Auto ports" in the properties drops the pins.
- Editing: drag a block to move it, and its wires follow. Delete removes the selected block with its wires, or the selected wire. Ctrl+Z / Ctrl+Y undo and redo, in one history with the plan steps. The schematic is saved with the plan.
- Live values are computed by the integration and shown inside the blocks: power, voltage, state of charge, and the inverter's loss. Power is converted to W (from W, kW, MW, mW) and voltage to V (from V, kV, mV). A missing or unavailable entity, or an unsupported unit, shows "—": nothing is estimated.
- Wires show the flow: an arrow in the direction of the power, a glow while energized, a thin line while de-energized, and a grey dashed line when there is no data. When the live feed fails, the reason is shown at the top of the properties. A block with a problem (an entity without data, a device that is gone, meters that disagree) carries a red alert mark; its tooltip names the problem. A switch in the state `unknown` (for example after a Home Assistant restart, before anyone switched it) counts as on when its device draws power (more than 0 W); with no consumption it stays unknown.
- Transfer position: click A, 0 or B on the block or in its properties. The position is live state kept by the integration (default A); it is not part of the plan and needs no Save.
- The step is done when the grid source has a power entity and at least one wire exists.

### Automation

Condition rules, stored in the plan and run by the integration inside Home Assistant (also while the panel is closed). Changes take effect on Save.

- Layout: tool rail | rules | live plan (as in Binding). Click a zone to select it: the rules panel lists that zone's rules. Esc or a click outside every zone lists the rules without a zone, including rules whose zone was deleted ("zone removed"). A zone only says where a rule is listed; a rule may use devices and rules of any zone or level.
- A rule: inputs -> ANY or ALL (each input may be negated with NOT) -> a verdict, with an optional delay before it turns true (On delay) and before it turns false (Off delay), whole seconds 0 to 3600 -> actions "When true" and "When false".
  - Inputs: leak sensors (wet), motion sensors (motion), lights, sockets, exhaust fans and Devices (on), wall switches (on), valves (open), and the verdicts of other rules. A rule cannot use itself, directly or through other rules.
  - ANY is true when any input is true; inputs without data are ignored while any input has data. ALL is true only when every input is true; an input without data keeps it undecided. The rules list warns "N inputs without data".
  - Actions: turn a light, socket, exhaust fan or controllable Device on or off; open or close a valve (`valve.open_valve` / `close_valve`, or `switch.turn_on` / `turn_off` for a valve bound to a switch).
  - Actions run only when the verdict changes. When a rule starts (Home Assistant start, or a new or changed rule saved) and its verdict is true, its "When true" actions run once; a Save that does not change a rule, or only renames it or moves it to another zone, does not run them again. Actions before Home Assistant has fully started wait for the start.
  - An action's own state change is not reported as a press by wall switches and valves.
- Templates in the tool rail open the rule dialog pre-filled: "Condition" (empty) and "Leak -> valve" (the selected zone's leak sensors that take part in automation, ANY, close the zone's valve if it has exactly one).
- The rule dialog (modal): name, ANY / ALL, inputs, delays, actions, and in the footer the zone, Enabled, Cancel and OK. OK is available only when the rule is valid (a name, at least one input, devices and rules that exist, no cycle, actions the device supports) and adds or changes the rule as one undoable edit. The right side draws the rule as a flowchart; a click on a block jumps to its field. For a saved, unchanged rule the flowchart shows live values: each input's state, the verdict, a running delay and the last action with its time and any error. A new or edited rule shows "Live state appears after Save" or "Saved version: your changes apply after Save".
- Rules list: name, a verdict dot (true / false / no data), status (OK, disabled, waiting for data, or the error: device missing, target missing, target unavailable, service failed), the last action, and "Unsaved changes" for rules edited since the last Save. Edit opens the dialog; Delete asks first and names the rules that use this one.
- Replacing an AppDaemon automation: create and save the rule, check its live state, then disable the AppDaemon code for it.

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

1. Open Plan Studio. Draw a box 6000 x 4000 mm measured by inner face. Draw a balcony with a railing outside (wall chain using Shift and typed lengths). Add two partitions joined with T-nodes. Add doors in the partitions and windows in the load-bearing walls. Create three named zones by walls. Save. Expected: walls join without gaps, zone areas are plausible, the indicator says "saved".
2. Restart Home Assistant core and reopen the panel. Expected: the plan is intact and looks the same; edit and save still work and the revision increases.
3. Open the panel in two tabs. Save in the second, then save in the first. Expected: a conflict dialog; "Save as new" creates a second plan and leaves the first untouched.
4. Zones. On a plan with the spaces kitchen, entrance, WC and main, add a zone by walls for each. Draw the polygon zones "door" (at the entrance door) and "middle" (in the middle of the main room), renaming them in the properties, and one zone outdoors. Expected: every device is listed in each zone that contains it (member lists, list counts and the Equipment "Zones" list). Uncheck Participates for one device, move the device out of the zone and back: the opt-out stays. Delete a wall under a polygon vertex: the zone turns invalid with "A vertex lost its wall or corner: drag it to place it again."; Ctrl+Z restores the wall and the zone is valid again. Save and reopen: the zones, memberships and opt-outs are intact.
5. Power. Set the grid source's power entity. Place the inverter as a Device with "Inverter" checked, a battery on its battery port, a metered Device ("New device", Power and Switch) after it, and a transfer switch (2 inputs → 1 output) with A from the meter and B from a bus fed by the grid. Wire the transfer output to a bus with two plan devices and a remainder. Expected: values appear in the blocks, energized wires glow with arrows in the flow direction, and the remainder shows the consumption no meter accounts for. Click B on the transfer switch: the energized path moves to B at once, with no Save. Make one load's entity unavailable: its block shows "—" with an alert mark, and the remainder on its bus says "incl. <name>". Delete a wire and press Ctrl+Z: it comes back. Save and reopen: the schematic is intact.
