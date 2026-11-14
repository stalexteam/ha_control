"""Websocket API for Plan Studio."""

from __future__ import annotations

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .repo import RevisionConflict, validate_revision


def _store(hass: HomeAssistant):
    return hass.data[DOMAIN]["store"]


@callback
def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_get)
    websocket_api.async_register_command(hass, ws_save)
    websocket_api.async_register_command(hass, ws_delete)


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


@websocket_api.websocket_command(
    {vol.Required("type"): "plan_studio/plans/delete", vol.Required("plan_id"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete(hass, connection, msg):
    await _store(hass).async_delete(msg["plan_id"])
    connection.send_result(msg["id"], {})
