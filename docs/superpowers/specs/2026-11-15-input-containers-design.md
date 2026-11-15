# Plan Studio: input containers (wall switch and smart button) design

Date: 2026-11-15
Status: draft, awaiting owner approval
Builds on: the entity binding design (`2026-11-15-entity-binding-design.md`) and the equipment placement design (`2026-11-15-equipment-placement-design.md`).
Comes before: the automation zones design (`2026-11-15-zones-design.md`). Zones wait until this stage is done.

## 1. Why

Plan Studio will replace the owner's AppDaemon automations step by step. The lowest layer of those automations is the inputs: the wall switches and the scene buttons a person presses.

AppDaemon has two classes for these inputs:
- **`TWallSwitch`** follows a relay or dimmer state. Two manual toggles within 3 seconds return the light node to automatic mode.
- **`TActionSensor`** reads a Zigbee2MQTT action sensor. Values look like `single`, `double` and `hold` on a one-button device, or `1_single`, `2_hold` and so on, where the digit is the button (key).

A single physical switch can drive several functions. In the WC today:
- button 1: `single` toggles the light in manual mode, `double` returns it to auto, `hold` turns the vent on for 15 minutes;
- button 2: `hold` turns the vent off.

This stage turns the plan's `switch` devices into two kinds of **input containers**. A container is a virtual object inside Plan Studio with a live **output**: `on`, `off`, `auto` or `error`. Later controllers (light zones, vent and others) will read these outputs instead of raw HA entities.

## 2. Decisions taken with the owner

- **Two kinds** replace `switch`: **Wall switch** and **Smart button**.
- **Wall switch:** one entity (relay, dimmer or binary sensor). Output `on` or `off` follows its state.
  - A checkbox, "Auto by double toggle", adds the `auto` output: two manual toggles within a short window give `auto`. This keeps the hidden `TWallSwitch` rule; the owner had forgotten it.
- **Smart button:** a combined input with outputs `on`, `off` and, when allowed, `auto`.
  - Each output fires on its own **trigger**: an entity, a slot (button number) and an event.
  - By default `on` and `off` share one trigger, so the button is a toggle. They can be split into two triggers, which is needed for the manual vent control as it is done today.
- **Final state.** For a toggle in `auto`, an optional "Final state" entity (a dimmer or relay state) decides the result:
  - it is on → `off`;
  - it is off → `on`;
  - no final state is set → `off`.
  This is what AppDaemon does today.
- **Default output.** Each container has one. It applies while the container is not configured, and while any entity of its configuration is unavailable.
- **Containers work at once:**
  - adding a container in Equipment and saving is enough: it runs with its default output and its state shows on the plan;
  - binding entities makes it react to them.
- **Virtual, not exposed to HA.** Containers live inside Plan Studio only. No HA entities are created.
- **No timer in this stage.** Turning a device off after some time of running belongs to the actuators and comes later.

## 3. Goals, non-goals, anti-goals

### Goals
1. Place wall switches and smart buttons in the Equipment step, and configure them in the Binding step.
2. Containers run on the server for every saved plan: they follow their entities and keep their output, also across HA restarts.
3. The plan shows each container's live output in every step.
4. Existing `switch` devices migrate without losing their bindings.

### Non-goals
- Controllers that consume outputs (light zones, vent, boiler). These come in a later stage.
- Exposing outputs to HA, or setting them from HA.
- An auto-off timer.
- Parsing action formats other than `N_event`. Slot 0 with a custom event matches any raw value, for example `single_left`.

### Anti-goals
- Classifying entities or buttons by their names.
- A container that silently keeps a stale output when its input is gone. It falls back to the default output and says why.
- Containers that only work while the panel is open.

## 4. Approaches

**Kinds:**
- **(a) One `switch` kind with a State/Events radio in Binding.** This was the owner's first idea. The roles would depend on the radio, not on the kind, and both would look the same on the plan.
- **(b) Two kinds.** Chosen by the owner. It matches the two AppDaemon classes, keeps roles per kind, and gives each kind its own symbol.

**Where outputs are computed:**
- **(a) Server side, in the integration (Python), with one small state machine per kind.** Chosen: this is the only way that works without the panel, and future controllers will run there too.
- **(b) In the panel.** Rejected: it works only while the panel is open.
- **(c) A generic rule engine.** Rejected as too much for two kinds. It can come later if many kinds appear.

## 5. Data model (plan JSON)

```
DeviceKind: "switch" is replaced by "wall_switch" | "smart_button"
Output = "on" | "off" | "auto" | "error"

wall_switch props:
  { kind: "wall_switch",
    autoByDoubleToggle: bool,          # default false
    windowSec: int 1..10,              # default 3; used only with autoByDoubleToggle
    defaultOutput: Output }            # default "off"; "auto" allowed only with autoByDoubleToggle

smart_button props:
  { kind: "smart_button",
    separateOff: bool,                 # default false: the "on" trigger toggles on/off
    autoEnabled: bool,                 # default false
    on:   { slot: int 0..9, event: string },   # default { slot: 0, event: "single" }
    off:  { slot, event },                     # used only with separateOff
    auto: { slot, event },                     # used only with autoEnabled; default { slot: 0, event: "double" }
    defaultOutput: Output }                    # default "off"; "auto" allowed only with autoEnabled

Binding roles (entity ids stay in Device.bindings):
  wall_switch:  state (switch, light, binary_sensor) - primary
  smart_button: on    (event, plain sensor, diagnostic allowed; the current "action" filter) - primary
                off   (same filter) - only with separateOff
                auto  (same filter) - only with autoEnabled
                final (light, switch) - optional
```

Rules:
- **Trigger match.** For slot 0 the expected value is `event`. For slot N it is `N_event`.
  - A sensor matches when its new state equals the expected value.
  - An `event.*` entity matches when a new event's `event_type` equals it.
  - The event field offers `single`, `double` and `hold`, and accepts any other non-empty text.
- **Placements.** A wall switch goes on a wall only. A smart button goes on a wall or free, for example a button on a table.
- **Disabled parts are cleared.** When `separateOff` or `autoEnabled` is turned off, the matching binding is removed, as invalid roles already are. Undo restores it. The trigger settings stay in props, so turning the part on again restores the slot and the event.
- **Type select.** *(Author's call.)* The Equipment properties of a wall switch or smart button show a **Type** select. Changing the type keeps the id, name and placement, resets props to the new kind's defaults, and drops bindings the new kind does not have. A free-placed smart button cannot become a wall switch; the select says why. This is how the owner turns migrated wall switches into smart buttons.
- **Migration** in `normalizeLevel`:
  - a `switch` with an `action` binding becomes a `smart_button`. That entity moves to the `on` role, with trigger slot 0 and event `single`, toggle mode and default `off`;
  - every other `switch` becomes a `wall_switch`, keeping its `state` binding, with default `off`.

  On the live plan, "Button WC" becomes a smart button and the other four become wall switches. The owner then switches "SmartSwitch Kitchen" and "Button boiler" with the Type select, and sets the WC slot to 1.
- **Python side.** The backend reads the same plan JSON. `schemaVersion` stays 1. The Python migration does not need to know about `switch`: the runtime treats an unknown kind as not a container.

## 6. Runtime (server)

**Which containers run.** Every `wall_switch` and `smart_button` of every saved plan, keyed by (plan id, device id). *(Author's call: there is one plan today; an "active plan" choice can come later if copies get in the way.)* The runtime builds its containers:
- when HA starts;
- after each plan save or delete.

Unsaved drafts have no effect.

**Inputs.** The runtime listens to state changes of the entities bound to its containers.
- An entity is **unavailable** when its state is `unavailable` or it is missing from HA's states.
- `unknown` and an empty string are normal: Zigbee2MQTT action sensors sit there between presses.

**Fault and default.** A container is in fault, and its output is `defaultOutput`, in two cases:
- **Not configured.** The required bindings are not all set:
  - wall switch: `state`;
  - smart button: `on`, plus `off` with `separateOff`, plus `auto` with `autoEnabled`.
- **Unavailable.** Any bound entity, including `final`, is unavailable.

The fault reason (not configured, or unavailable with the entity ids) goes with the output. When the fault clears:
- a wall switch recomputes its output from its entity, keeping `auto` if it was `auto`;
- a smart button returns to the output it had before the fault.

**Wall switch machine:**
- Every on↔off change of the entity is a manual toggle. *(Later, changes caused by Plan Studio's own commands will be excluded via the HA context. No such commands exist yet.)*
- Without `autoByDoubleToggle`, the output is the entity state.
- With `autoByDoubleToggle`, every toggle is compared with the time of the previous toggle, and that time is always updated:
  - a toggle within `windowSec` of it gives `auto`, including a third or fourth quick toggle;
  - a toggle outside the window gives the new entity state.

  This is exactly what `TWallSwitch` and `handler_WS_StateChanged` do today.

**Smart button machine:**
- **Toggle mode** (`separateOff` false), on an `on` trigger:
  - `off` → `on`;
  - `on` → `off`;
  - `auto` → the opposite of the `final` entity state if `final` is bound, else `off`.
- **Split mode:**
  - the `on` trigger gives `on`;
  - the `off` trigger gives `off`.
- **Auto:** the `auto` trigger gives `auto`.
- **Duplicates.** If two triggers of one container are equal (same entity, slot and event), the first in the order on, off, auto wins. The Binding step warns about it.
- **What counts as a press.** *(Author's call.)* Only a real state change counts, or a new event of an `event.*` entity:
  - a change whose old state was `unavailable` or missing is not a press. This covers an HA restart or an entity coming back;
  - triggers that arrive while the container is in fault are ignored, so recovery returns to the pre-fault output;
  - re-publishing the same value fires no state change in HA, so it is not a press. Zigbee2MQTT action sensors reset to an empty value right after each action, which shows on the live instance, so repeated presses work.

**Persistence.** The last output of each container (the pre-fault one for a smart button) is kept in a separate `Store`, `plan_studio.runtime`. On start:
- a smart button restores it, or uses the default when there is nothing to restore;
- a wall switch restores `auto`, otherwise it takes its entity state.

On a plan save, a container keeps its output unless:
- its kind changed, or it is new: it starts from the default;
- its output is no longer allowed, for example `auto` after auto was disabled: it falls back to the default.

**Panel API.** `plan_studio/containers/subscribe` with `plan_id` sends the full map first, then each change:

```
{ deviceId: { output: Output, fault: null | "not_configured" | "unavailable", entities?: string[] } }
```

`plan_studio/containers/unsubscribe` ends it. Admin only, like the panel. The panel subscribes for the open plan.

## 7. UI

**Equipment step:**
- the "Switch" tool is replaced by "Wall switch" and "Smart button";
- each gets its own symbol: a wall switch stays a square, a smart button is a rounded square with a dot;
- the device properties show the Type select (section 5).

**Binding step, wall switch:**
- State entity combobox (the existing one);
- "Auto by double toggle" checkbox;
- "Window, s" field, shown only when the checkbox is on;
- "Default output" select.

**Binding step, smart button:**
- **On / Off** section (titled **On** when split): entity combobox, Slot (0–9) and Event (combobox with `single`, `double`, `hold` and free text);
- "Separate Off" checkbox, which shows the **Off** section. Its entity starts as the On entity;
- "Auto" checkbox, which shows the **Auto** section;
- **Final state** combobox (light, switch), shown only in toggle mode with auto enabled, because only then does it matter;
- "Default output" select.

**Binding step, both kinds:**
- **Output line:** the current output and, in fault, the reason. "Not saved yet" is shown for a container that is not in the saved plan.
- **HA device auto-fill** fills the `on` role of a smart button and the `state` role of a wall switch.
- **"Also bound to" warning.** For trigger roles it compares the whole trigger (entity, slot, event), not the entity alone: two buttons of one physical switch are normal.
- **Duplicate triggers** inside one container show a warning.

**Plan, every step:** a container symbol shows its output:
- `on`, `off` and `auto` each have a distinct colour;
- fault adds a warning mark;
- no data (not saved, or the runtime has not answered) is neutral.

## 8. Left to the builder

- Colours and marks for the outputs (both themes), and the smart button symbol.
- Python module split. Suggested:
  - `containers.py`: pure state machines, testable without HA;
  - `runtime.py`: HA wiring, `Store` and listeners;
  - websocket commands in `websocket_api.py`.
- How the runtime diffs plans on save (rebuild all, or per container), as long as the save rules in section 6 hold.
- The frontend module split for the new Binding sections.

## 9. Verification

**Python unit tests (no HA):**
- Wall switch:
  - output follows the state;
  - double toggle within the window gives `auto` and outside it does not;
  - `auto` stays until a single toggle.
- Smart button:
  - toggle from `on`, `off`, and `auto` with and without `final`;
  - split on/off;
  - auto trigger;
  - slot 0 and slot N matching;
  - `event.*` matching by `event_type`;
  - duplicates.
- Faults:
  - not configured;
  - unavailable entity (including `final`);
  - `unknown` and empty are not faults;
  - recovery for each kind.
- Persistence: restore and the save rules.

**Python integration tests (HA test harness, as far as `tests/python` allows):**
- runtime start and rebuild on save;
- the subscribe payloads.

**Frontend tests:**
- migration of `switch`;
- the Type select;
- the Binding sections show and hide, and clear disabled roles (undo restores);
- the trigger-aware "also bound" warning;
- the duplicate-trigger warning;
- auto-fill;
- plan symbols by output;
- the output line.

**Live check:** the owner configures:
- WC light: on/off = slot 1 `single`, auto = slot 1 `double`, final = the WC light;
- WC vent: on = slot 1 `hold`, off = slot 2 `hold`.

The owner presses the buttons and watches the outputs on the plan.
