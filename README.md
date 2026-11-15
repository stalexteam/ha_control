# Plan Studio

Home Assistant custom integration that adds a "Plan Studio" sidebar panel: a 2D floor-plan editor in three steps. Plan: draw walls, openings and rooms. Equipment: place lights, sensors, switches and other devices. Binding: link each device to Home Assistant entities. Plans are saved to Home Assistant storage, and wall switches and smart buttons report button and switch events. Automation zones are not built yet.

## Install

HACS: add `stalexteam/ha_control` as a custom repository (category Integration), install Plan Studio, restart Home Assistant.

Manual: copy `custom_components/plan_studio` into your Home Assistant `config/custom_components/` and restart.

Then go to Settings -> Devices & services -> Add integration -> Plan Studio.

## Usage

- Tools: Select, Box, Wall, Door, Window, Opening and Zone (a room); pick from the toolbar.
- Trim: Ctrl+click (Cmd+click on macOS) a wall with the Select tool to remove the piece around the click, between the nearest intersections on either side (T-junctions or crossing walls), or up to the wall's end on a side without one. A wall with no intersections is deleted. One Undo step brings it back.
- Wall type (bearing / partition / railing) is only a visual style; thickness is a separate field and never changes when you pick a type. Both live in the left properties panel.
- With a placement tool active and nothing selected, the left panel shows the parameters of the next object (door: width, hinge, swing; window: width, outside side; opening: width; room: name, default "Room N"). Values are remembered per tool for the session; a custom room name is used once, then the default returns to the smallest unused "Room N".
- Opening properties: the "Passes light" checkbox lets the light of wall and ceiling lights through the opening. It is on by default for a plain opening and off for doors, windows, gates and wickets. The "Passes PIR" checkbox does the same for motion zones: on by default for plain openings only.
- Layout: tool rail, properties panel, plan.
- Hold Shift while drawing to snap to 90 degrees.
- Type a length in millimetres and press Enter to set the exact segment length.
- Tab switches to angle input.
- Esc works in two stages. The first Esc cancels the action in progress (a typed length, a wall chain, the first corner of a box, an aim drag). The next Esc switches to Select (Plan step) or the device Select (Equipment step). In Select, Esc cancels a drag, then clears the selection.
- Ctrl+Z / Ctrl+Y: undo / redo.
- Grid toggle in the status bar turns the grid display and grid snapping (100 mm) on or off together.
- Save: the indicator shows the saved/unsaved state. If the plan changed elsewhere, a conflict dialog offers to overwrite or "Save as new".
- Plans: the selector in the toolbar (shown when there is more than one plan) opens any stored plan; the panel reopens the plan opened or saved last.
- New / delete plan: the "+" and bin buttons next to the plan name start a new unsaved plan (asks first if there are unsaved changes) or delete the open plan after confirmation (admin only; Escape cancels).
- Draft recovery: unsaved edits are kept locally in the browser and offered for restore on reopen. Esc postpones the decision; a banner keeps offering Restore / Discard.

### Equipment tab

- The steps Plan, Equipment and Binding sit in the title block under the top bar: click any step, or use Back / Next. Walls, openings and rooms are dimmed and locked in the Equipment step; devices are dimmed and locked in the Plan step.
- Tools: Select, Ceiling light, Wall light, Motion sensor, Illuminance sensor, Climate sensor, Wall switch, Smart button, Socket, Exhaust fan, Equipment. One click places one device.
- Wall switches and sockets snap to the nearest wall face (wall only). Wall lights, sensors and smart buttons go on a wall face near the cursor, otherwise at a free grid point (wall or free). Ceiling lights and equipment blocks are always free.
- Wall switch (a square) and smart button (a rounded square with a dot) are input containers: see "Wall switches and smart buttons" below. Their properties show a Type select that turns one into the other; it keeps the id, name and placement, resets the settings to the new type's defaults and drops bindings the new type does not have. A free smart button cannot become a wall switch until it is moved onto a wall. Plans with the former Switch device are migrated on load: a switch with a button-events binding becomes a smart button, any other becomes a wall switch.
- Climate sensor (wall or free): temperature and humidity; checks the rooms it applies to, none checked means the room it stands in.
- Exhaust fan (wall only): diameter 100, 125 or 150 mm; no cone and no aim.
- Select: click a device to select it, drag to move it (Shift locks the axis). A wall device slides along its wall, can be dragged onto another wall, or into open space if its kind allows. Delete removes it. A selected wall light or sensor shows a direction handle (a segment ending in a round knob): drag the knob to set the aim (wall device) or rotation (free device), Shift snaps to 15 degrees, Esc cancels.
- Left panel (between the tool rail and the plan): properties of the selected device (name, kind settings, rotation for free devices, side, offset and aim, -90 to 90 degrees off the wall normal, for wall lights and sensors). With a placement tool active and nothing selected, it edits the defaults of the next device.
- A newly placed device is selected, so the left panel shows its properties. Esc then switches to the device Select tool; pick the placement tool again to see the next-device defaults.
- Deleting a wall also deletes the devices on it; Ctrl+Z brings both back.
- "Cones & zones" in the status bar shows or hides light pools, wall-light cones and motion zones. Each is clipped to what its device sees: every wall type blocks it, for outdoor devices too. Light passes openings with "Passes light"; motion zones pass openings with "Passes PIR" (on by default for plain openings only). Motion zones are violet; light cones and pools are amber.

### Binding

Binding links every device on the plan to Home Assistant entities, one field per role.

- Layout: device list | properties | plan. The list filters Not bound / Bound / All and by text; its arrow button folds it to a narrow strip.
- Steps:
  1. Select a device on the plan or in the list, or press "Next unbound device".
  2. Fill or change each role in its search field (for example Control and Power for a socket, Temperature and Humidity for a climate sensor). The clear button empties a role; Ctrl+Z undoes.
- Filter rules: candidates are chosen only by domain, device class and unit, never by guessing from entity ids or names. The strict list needs the role's domain and a matching device class; an entity without a device class matches by unit, and a conflicting device class excludes it (a battery % sensor is never a humidity candidate). Hidden, disabled, config and diagnostic entities are left out. "Show all" keeps only the domain filter.
- Status:
  - Bound: the primary role is set (Control for lights, sockets, fans and equipment; Motion or Illuminance for sensors; State for a wall switch; On for a smart button, plus Off and Auto while they are enabled; Temperature or Humidity for a climate sensor).
  - Partly bound: some role is set, but not the primary one.
  - Missing (red): a bound entity is neither in the live states nor in the entity registry. A disabled or unavailable entity is only noted; the device still counts as bound. Nothing is ever removed automatically.
- One entity may be bound to several devices; the field then says "Also bound to". For smart button triggers it compares the entity and the action value, so two buttons of one physical switch are not reported.
- The entity, device and area registries load once, when the Binding step first opens. If that fails, a notice offers Retry; the fields keep working from the live states and nothing is flagged Missing.
- Delete does nothing in this step. Bindings are saved with the plan.

### Wall switches and smart buttons

Wall switches and smart buttons are input containers: virtual objects that report events. Each event is an intent (`toggle`, `set on`, `set off` or `auto`) plus a status (`ok` or `error`; the reason is "not configured" or "unavailable (ids)"). Nothing acts on intents yet; controllers will come later. No Home Assistant entities or events are created. They run inside Home Assistant for every saved plan, also while the panel is closed, and changes take effect when the plan is saved.

- Smart button, in the Binding step:
  - On / Off: the action sensor or event entity, Slot (0 to 9) and Event (`single`, `double`, `hold` or any other text). Slot 0 waits for the action value `event`, slot N for `N_event`. In toggle mode a press gives `toggle`.
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

1. Open Plan Studio. Draw a box 6000 x 4000 mm measured by inner face. Draw a balcony with a railing outside (wall chain using Shift and typed lengths). Add two partitions joined with T-nodes. Add doors in the partitions and windows in the load-bearing walls. Create three named zones. Save. Expected: walls join without gaps, zone areas are plausible, the indicator says "saved".
2. Restart Home Assistant core and reopen the panel. Expected: the plan is intact and looks the same; edit and save still work and the revision increases.
3. Open the panel in two tabs. Save in the second, then save in the first. Expected: a conflict dialog; "Save as new" creates a second plan and leaves the first untouched.
