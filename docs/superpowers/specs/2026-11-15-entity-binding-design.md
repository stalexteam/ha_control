# Plan Studio stage 2b (entity binding) design

Date: 2026-11-15
Status: approved 2026-11-15 (v3: wizard, HA-like styling, MDI equipment icons, left properties panel instead of modal)
Builds on: `2026-11-14-ha-floorplan-editor-design.md` (stage 1) and `2026-11-15-equipment-placement-design.md` (stage 2a).

## 1. Why

The owner wants Plan Studio to replace their AppDaemon automations step by step: "from what is necessary up to the top level of logic". The plan becomes the source of truth for configuration. The order agreed with the owner:

1. **2b, binding (this document):** each placed device is linked to the Home Assistant entities that represent it.
2. **2c:** live state on the plan, display only.
3. **Then the controllers, one at a time:** a zone light controller replacing AppDaemon LightNodes (modes, presence, sleep, day), then the vent, leak valve, boiler, external light, leg heater and scene buttons. Each AppDaemon mechanism is retired once its replacement works.

Binding is the foundation every later stage reads.

## 2. Goals, non-goals, anti-goals

### Goals
1. A third tab, "Binding", next to "Plan" and "Equipment".
2. Clicking a device on the plan shows its binding fields in the right panel, one per role (section 4).
3. Candidate entities are filtered only by what Home Assistant itself knows: domain, `device_class` and unit of measurement. A "show all" toggle per field widens the list to the whole domain set for that role. Every list has a text search.
4. HA device picker: choosing a Home Assistant device auto-fills a device's empty roles from that HA device's entities, matched by the same filters.
5. A left-side list of devices with their binding status: unbound, partially bound, bound. Clicking a row selects and centres the device.
6. Bindings are stored in the plan, so save, revisions, conflicts, drafts and undo work unchanged.
7. Warnings: a bound entity that no longer exists in Home Assistant is flagged, both on the device and in the list.

### Binding status (document author's call, owner did not object)
Each kind has a **primary role**:
- `control` for lights, sockets, the exhaust fan and equipment;
- `motion`, `illuminance` and `action` for their sensor or switch;
- for the climate sensor, either `temperature` or `humidity` is enough.

A device is **Bound** when its primary role is set. Secondary roles (`power`, `state`, the other climate role) are optional and do not affect status. **Partly bound** means some role is set but not the primary one. **Missing** means some bound entity is in neither `hass.states` nor the entity registry. A registry-only entity (disabled or unavailable) shows a softer "unavailable" note and is not Missing.

### Non-goals
- Live state rendering (2c). Plan Studio controlling anything (later stages).
- Creating Home Assistant entities or devices, or registering plan devices in the device registry.
- Any change to the Python backend or storage format version.
- Binding rooms or zones to anything. This comes with the zone light controller stage.

### Anti-goals
- **Guessing from entity names.** The owner was explicit: "do not use name masks to determine the entity type; my names are systematic, but another person's may be chaotic". The UI must never classify or suggest by `entity_id` or friendly-name patterns. Search by text is fine because the user drives it.
- **Using Home Assistant areas** to place or bind devices (stage 1 owner decision).
- A binding that silently disappears. A missing entity is flagged, never auto-removed.

## 3. Approach

Two ways were considered:

- **A. Frontend-only, bindings stored in the plan.** Chosen by the owner.
  - Each device gets `bindings: role → entity_id`.
  - Entity, device and class metadata come from the panel's `hass` object:
    - `hass.states` gives state attributes: `device_class`, `unit_of_measurement`, `friendly_name`.
    - `hass.entities` gives the entity registry: `device_id`, `hidden`, `entity_category`.
    - `hass.devices` gives the device registry: name and model.
  - The backend is unchanged. Later Python controllers read the same bindings from the plan store.
- **B. The integration registers plan devices in the HA device registry.** Rejected for now. It will be needed when controllers create entities; for binding alone it adds complexity and registry clutter.

## 4. Roles per device kind

Each role has a domain set and an optional class filter. All roles are optional.

| Device kind | Role | Domains | Strict filter (default list) |
|---|---|---|---|
| ceiling_light, wall_light | `control` | light, switch | none (all entities of the domains) |
| motion_sensor | `motion` | binary_sensor | device_class ∈ {occupancy, motion, presence} |
| illuminance_sensor | `illuminance` | sensor | device_class = illuminance, or unit = `lx` |
| climate_sensor | `temperature` | sensor | device_class = temperature, or unit ∈ {`°C`, `°F`} |
| climate_sensor | `humidity` | sensor | device_class = humidity, or unit = `%` with device_class humidity or none |
| switch | `action` | event, sensor | none |
| switch | `state` | switch, light, binary_sensor | none |
| socket | `control` | switch | none |
| socket | `power` | sensor | device_class = power, or unit ∈ {`W`, `kW`} |
| exhaust_fan | `control` | switch, fan | none |
| equipment | `control` | switch | none |
| equipment | `power` | sensor | device_class = power, or unit ∈ {`W`, `kW`} |

Rules:
- "Show all" for a field drops the strict filter but keeps the domains.
- Entities whose registry entry is hidden or has `entity_category` config or diagnostic are excluded unless "show all" is on. This is the document author's call.
- The candidate label is `friendly_name — entity_id`, plus the HA device name when known. The current state is shown greyed as a hint.
- One entity may be bound to several devices, for example one relay feeding two light fittings. An info badge says "also bound to …". It is not an error.

### HA device picker
- A select of Home Assistant devices that have at least one entity matching any of the device kind's roles under the strict filters. It is searchable by device name and model.
- Choosing a device fills each **empty** role with that device's single matching entity. A role with zero or several matches is left empty, and the panel says how many matched. Filled roles are never overwritten.
- It is one commit, undoable.

## 4a. Wizard shell and HA-like styling (owner feedback 2026-11-15)

### Wizard instead of tabs
The owner wants a wizard rather than a tab bar: "the interface should feel more like a wizard than a tab system".

The tabs become a step header styled as a drawing title block, the stamp in the corner of an architectural sheet. Its cells:
1. **Plan**, with a status such as "15 walls, 6 rooms".
2. **Equipment**, with a status such as "30 devices".
3. **Binding**, with a status such as "12 of 30 bound".
4. **Automation**, shown as "Comes later" and disabled.

Rules:
- Each cell shows its step number, name and live status. The current step is underlined in the primary colour, and finished steps carry a ✓.
- Back and Next buttons name their target ("Back: Equipment", "Next: Binding"). In the Binding step, Next is "Next unbound device".
- Navigation is free: any step cell can be clicked at any time. The order is a guide, not a lock.

### HA-like styling
The owner asked to "work on the general styles, making them more HA-like".

Panel chrome uses HA theme variables, so light, dark and custom themes apply:
- `--primary-color`, `--accent-color`;
- `--primary-background-color`, `--card-background-color`;
- `--primary-text-color`, `--secondary-text-color`, `--divider-color`;
- `--ha-card-border-radius`.

Chrome uses HA's own elements when the browser has them registered, with a self-contained fallback in the same style otherwise:
- `ha-dialog`, `ha-button`, `ha-icon-button`, `ha-textfield`, `ha-select`, `ha-entity-picker`;
- `ha-svg-icon` with MDI paths bundled.

Further rules:
- The top bar follows HA page headers. On narrow screens it shows HA's sidebar menu button.
- The drawing sheet (canvas) keeps the blueprint palettes A/C, chosen by `hass.themes.darkMode`. The drawing is content, not chrome.
- The owner wants devices in the Binding step drawn with the same renderer as Equipment, not as circles. Binding status is an overlay around the icon:
  - dashed ring: not bound;
  - amber ring: partly bound;
  - red ring: missing entity;
  - primary-colour ring: selected.

### Equipment icons from MDI (owner request 2026-11-15)
The owner called the old four-value `symbol` a meagre choice.

- An equipment block's symbol becomes any MDI icon, stored as `props.icon = "mdi:<name>"`.
- It is chosen in the Equipment step's properties with HA's `ha-icon-picker`, which searches all `mdi:` icons. The fallback is a text field that validates the `mdi:` prefix.
- It is drawn on the plan with HA's `ha-icon` inside an SVG `foreignObject`, centred in the block and sized in screen px. HA serves the icon set, so the bundle uses no CDN. When `ha-icon` is not registered (dev harness), a small bundled fallback glyph is drawn.
- Migration happens on load in `normalizeLevel`. A legacy `symbol` maps to:
  - `boiler` → `mdi:water-boiler`
  - `pc` → `mdi:desktop-tower`
  - `automation` → `mdi:server`
  - `other` → `mdi:cube-outline`

  The old field is then dropped. `schemaVersion` stays 1, because this is an additive change with a fallback.
- The other device kinds keep their schematic drawing symbols, so the plan still reads as a drawing (the document author's call).

## 5. Binding tab UI

- Tab switch "Plan | Equipment | Binding". Switching cancels the active tool and clears the selection, like the stage 2a switch.
- **Canvas:** walls, openings and rooms dimmed, as in Equipment. Devices are drawn normally and are not draggable in this tab. A click selects a device.
  - A binding status badge sits at each device: none when fully bound, a hollow amber ring when partially bound, a hollow red ring when unbound or when a bound entity is missing.
- **Left panel** replaces the tool rail in this tab and can be collapsed.
  - The device list is grouped by status: Missing, Unbound, Partial, Bound.
  - Each row shows the device name, its kind icon and the bound count over the role count.
  - Clicking a row selects the device and pans the view to it.
- **Layout: the same three columns as every step, with no modal.** The owner first asked for a modal, then replaced it: "for bindings too, instead of a popup, the same properties panel on the left". Left to right:
  1. The **device list**, in the place of the tool rail.
  2. The **properties panel** with the binding fields:
     - header: the device name and kind (read-only);
     - the HA device picker;
     - one field per role, each with the entity combobox, a "Show all" link, the missing or unavailable note, and the "also bound to …" info;
     - footer: an "N not bound" counter and a "Next unbound device" button.
  3. The **plan**.

  With nothing selected, the panel invites the user to pick a device or press "Next unbound device". Esc clears the selection.
- The left-panel order "tool rail | properties | plan" was applied to the Plan and Equipment steps in v0.2.7. The Binding step reuses it, so all steps look alike.
- **Entity combobox** (owner request: "like HA's entity picker").
  - Closed, it shows the domain or device-class icon, the friendly name, "HA area ▸ HA device", a clear ✕ and a ▾.
  - Open, it shows a search field and rows with icon, name, "area ▸ device", the domain label ("Sensor", "Binary sensor"…) and the current value.
  - It is a self-contained Lit combobox with that layout. HA's internal `ha-entity-picker` is not used: in custom panels its availability and API are not guaranteed, and keeping a single code path is simpler (simplicity review 2026-11-15).
  - The HA area appears only as a label for finding the entity. It never drives binding.
- **Device list** (owner request).
  - A three-position switch, "Not bound / Bound / All", with counts. Partly bound devices count as Not bound and carry an amber dot.
  - A text filter on device name and kind.
  - Rows show the name, the kind and filled roles over all roles, such as `1/2`.
- Keyboard: Delete does nothing in this tab, so devices cannot be deleted here. Esc clears the selection. Undo and redo work as everywhere.
- English only.

## 6. Data model

`Device.bindings?: Partial<Record<BindingRole, string>>`, where `BindingRole = 'control' | 'motion' | 'illuminance' | 'temperature' | 'humidity' | 'action' | 'state' | 'power'`.
- The field is absent when there are no bindings. Stored plans stay valid, and `schemaVersion` stays 1.
- A role not valid for the device's kind is dropped on save. It can only appear from hand-edited data.
- A pure op: `setBinding(level, deviceId, role, entityId | null): Level`. Unchanged input returns the same level, so there is no history entry.
- Device deletion removes its bindings implicitly.

## 6a. Builder-check answers (document author's calls)
- **Data source.** States come from `hass.states`. When the Binding step first opens, the entity, device and area registries are loaded once over websocket (`config/entity_registry/list`, `config/device_registry/list` and `config/area_registry/list`; the panel is admin-only). There is one path, with no `hass.entities` branching (simplicity review 2026-11-15). Memoise candidate lists on the registry objects' identity, not on state ticks.
- **Class versus unit.** A conflicting `device_class` excludes the entity. The unit fallback applies only when `device_class` is absent, so a battery `%` sensor is never a humidity candidate.
- **HA device picker.** It uses the strict filters and the hidden, disabled and diagnostic exclusion. A role with several matches stays empty and the dialog shows the count. That is acceptable for dimmers that expose both a light and a switch.
- **Scope.** The list and "also bound to" cover the active level, which is the only level today.
- **Invalid devices.** A device on a too-short wall still appears in the list and can be bound.
- **Sanitising.** `setBinding` rejects roles not valid for the kind. The Python store validates only top-level plan keys and ignores device fields, so it needs no backend change.

## 7. Left to the builder

- The exact search widget. It can be an input with a filtered list, or HA's `ha-entity-picker` if it can be used without breaking the bundle-only, no-CDN rule. The default is a self-contained Lit component.
- Badge artwork and colours from the palette.
- The module split follows the v0.2.7 refactor: new `binding-list.ts` and `binding-props.ts` (and a pure `binding-candidates.ts`), composed by `side-panel.ts`. `plan-studio-panel.ts` stays a thin composer (it is about 333 lines now; keep it ≤ 400).

## 8. Verification

- **Unit tests:**
  - candidate filtering per role, both strict and "show all";
  - the hidden and diagnostic exclusion;
  - the HA device picker auto-fill: single match fills the role, several matches leave it empty, filled roles are kept;
  - `setBinding` purity and no-op;
  - status classification: unbound, partial, bound, missing.
- **Panel tests:** the third tab, selecting a device shows its role fields, binding saves and survives a reload, the missing-entity warning appears, and undo works.
- **Live check:** deploy, then the owner binds the real kitchen dimmer, the kitchen motion sensor, a climate sensor and the boiler relay with its power sensor.
