"""Websocket API for Plan Studio."""

from __future__ import annotations

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .power import POSITIONS
from .repo import RevisionConflict, validate_revision


def _store(hass: HomeAssistant):
    return hass.data[DOMAIN]["store"]


def _live(hass: HomeAssistant):
    """The running LiveRuntime, or None while the config entry is unloaded."""
    return hass.data[DOMAIN].get("live")


def _reload_live(hass: HomeAssistant) -> None:
    live = _live(hass)
    if live is not None:
        live.reload()


@callback
def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_info)
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_get)
    websocket_api.async_register_command(hass, ws_save)
    websocket_api.async_register_command(hass, ws_delete)
    websocket_api.async_register_command(hass, ws_containers_subscribe)
    websocket_api.async_register_command(hass, ws_rules_subscribe)
    websocket_api.async_register_command(hass, ws_virtual_subscribe)
    websocket_api.async_register_command(hass, ws_power_subscribe)
    websocket_api.async_register_command(hass, ws_power_set_position)
    websocket_api.async_register_command(hass, ws_readings_get)


@websocket_api.websocket_command({vol.Required("type"): "plan_studio/info"})
@callback
def ws_info(hass, connection, msg):
    """The integration version (manifest), so an open panel can tell it was updated under it."""
    connection.send_result(msg["id"], {"version": hass.data[DOMAIN]["manifest_version"]})


@websocket_api.websocket_command(
    {vol.Required("type"): "plan_studio/readings/get", vol.Required("entity_ids"): vol.All([str], vol.Length(max=200))}
)
@callback
def ws_readings_get(hass, connection, msg):
    """Report statistics (last, period in epoch / duration ms, count) of tracked entities; unknown ones have count 0."""
    live = _live(hass)
    if live is None:
        connection.send_error(msg["id"], "not_loaded", "Plan Studio is not loaded")
        return
    connection.send_result(msg["id"], {"readings": {e: live.readings.stats(e) for e in msg["entity_ids"]}})


@websocket_api.websocket_command({vol.Required("type"): "plan_studio/plans/list"})
@callback
def ws_list(hass, connection, msg):
    connection.send_result(msg["id"], {"plans": _store(hass).list()})


@websocket_api.websocket_command(
    {vol.Required("type"): "plan_studio/plans/get", vol.Required("plan_id"): str}
)
@callback
def ws_get(hass, connection, msg):
    plan = _store(hass).get(msg["plan_id"])
    if plan is None:
        connection.send_error(msg["id"], "not_found", "Plan not found")
        return
    connection.send_result(msg["id"], {"plan": plan})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "plan_studio/plans/save",
        vol.Required("plan"): dict,
        vol.Required("expected_revision"): validate_revision,
        vol.Optional("force", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save(hass, connection, msg):
    try:
        revision = await _store(hass).async_save(
            msg["plan"], msg["expected_revision"], msg["force"]
        )
    except RevisionConflict as err:
        connection.send_error(msg["id"], "revision_conflict", str(err))
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid_plan", str(err))
    else:
        connection.send_result(msg["id"], {"revision": revision})
        _reload_live(hass)


@websocket_api.websocket_command(
    {vol.Required("type"): "plan_studio/plans/delete", vol.Required("plan_id"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete(hass, connection, msg):
    deleted = await _store(hass).async_delete(msg["plan_id"])
    connection.send_result(msg["id"], {})
    if deleted:
        _reload_live(hass)


@websocket_api.websocket_command(
    {vol.Required("type"): "plan_studio/containers/subscribe", vol.Required("plan_id"): str}
)
@websocket_api.require_admin
@callback
def ws_containers_subscribe(hass, connection, msg):
    """Stream container state and events of one plan: a full snapshot first, then changes.

    Ends with HA's standard `unsubscribe_events` or when the connection closes.
    """
    live = _live(hass)
    if live is None:
        connection.send_error(msg["id"], "not_loaded", "Plan Studio is not loaded")
        return
    runtime = live.runtime
    plan_id = msg["plan_id"]

    @callback
    def forward(full: bool, containers: dict) -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"full": full, "containers": containers})
        )

    connection.subscriptions[msg["id"]] = runtime.subscribe(plan_id, forward)
    connection.send_result(msg["id"])
    forward(True, runtime.snapshot(plan_id))


@websocket_api.websocket_command(
    {vol.Required("type"): "plan_studio/rules/subscribe", vol.Required("plan_id"): str}
)
@websocket_api.require_admin
@callback
def ws_rules_subscribe(hass, connection, msg):
    """Stream the live trace of one plan's rules: a full snapshot first, then changed rules.

    Ends with HA's standard `unsubscribe_events` or when the connection closes.
    """
    live = _live(hass)
    if live is None:
        connection.send_error(msg["id"], "not_loaded", "Plan Studio is not loaded")
        return
    engine = live.engine
    plan_id = msg["plan_id"]

    @callback
    def forward(full: bool, rules: dict) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], {"full": full, "rules": rules}))

    connection.subscriptions[msg["id"]] = engine.subscribe(plan_id, forward)
    connection.send_result(msg["id"])
    forward(True, engine.snapshot(plan_id))


@websocket_api.websocket_command(
    {vol.Required("type"): "plan_studio/virtual/subscribe", vol.Required("plan_id"): str}
)
@websocket_api.require_admin
@callback
def ws_virtual_subscribe(hass, connection, msg):
    """Stream the states of one plan's virtual switches: every event is the whole map {"states": {device id: "on" |
    "off"}}, first at once, then on every change (a state, or a virtual switch added to / removed from the saved plan).

    Ends with HA's standard `unsubscribe_events` or when the connection closes.
    """
    live = _live(hass)
    if live is None:
        connection.send_error(msg["id"], "not_loaded", "Plan Studio is not loaded")
        return
    virtual = live.virtual
    plan_id = msg["plan_id"]

    @callback
    def forward(frame: dict) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], frame))

    connection.subscriptions[msg["id"]] = virtual.subscribe(plan_id, forward)
    connection.send_result(msg["id"])
    forward({"states": virtual.states(plan_id)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "plan_studio/power/subscribe",
        vol.Required("plan_id"): str,
        vol.Required("power"): dict,
        vol.Required("devices"): dict,
    }
)
@websocket_api.require_admin
@callback
def ws_power_subscribe(hass, connection, msg):
    """Stream live power frames of a schematic (the panel's draft); every event is a full frame.

    Ends with HA's standard `unsubscribe_events` or when the connection closes.
    """
    live = _live(hass)
    if live is None:
        connection.send_error(msg["id"], "not_loaded", "Plan Studio is not loaded")
        return

    @callback
    def forward(frame: dict) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], frame))

    connection.send_result(msg["id"])
    unsub = live.power.subscribe(msg["plan_id"], msg["power"], msg["devices"], forward)  # sends the first frame
    live.retrack()

    @callback
    def unsubscribe() -> None:
        unsub()
        live.retrack()

    connection.subscriptions[msg["id"]] = unsubscribe


@websocket_api.websocket_command(
    {
        vol.Required("type"): "plan_studio/power/set_position",
        vol.Required("plan_id"): str,
        vol.Required("block_id"): str,
        vol.Required("position"): vol.In(POSITIONS),
    }
)
@websocket_api.require_admin
@callback
def ws_power_set_position(hass, connection, msg):
    """Set a transfer block's position: live state, stored by the integration, no plan revision."""
    live = _live(hass)
    if live is None:
        connection.send_error(msg["id"], "not_loaded", "Plan Studio is not loaded")
        return
    live.power.set_position(msg["plan_id"], msg["block_id"], msg["position"])
    connection.send_result(msg["id"], {})
