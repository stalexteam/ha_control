"""Plan Studio integration."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import websocket_api as ps_ws
from .const import DOMAIN, PANEL_JS, PANEL_URL_PATH, STATIC_URL
from .live import LiveRuntime
from .store import PlanStore

FRONTEND_DIR = Path(__file__).parent / "frontend"


def _asset_version() -> str:
    """Cache-busting token: manifest version plus a short hash of the bundle contents."""
    manifest = json.loads((Path(__file__).parent / "manifest.json").read_text(encoding="utf-8"))
    digest = hashlib.sha256((FRONTEND_DIR / PANEL_JS).read_bytes()).hexdigest()[:8]
    return f"{manifest['version']}-{digest}"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data = hass.data.setdefault(DOMAIN, {})
    if "version" not in data:
        data["version"] = await hass.async_add_executor_job(_asset_version)
    if "store" not in data:
        store = PlanStore(hass)
        await store.async_load()
        data["store"] = store
        ps_ws.async_register(hass)
    if "live" not in data:
        live = LiveRuntime(hass, data["store"])
        await live.async_start()
        data["live"] = live
    if not data.get("static_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), cache_headers=False)]
        )
        data["static_registered"] = True

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="plan-studio-panel",
        frontend_url_path=PANEL_URL_PATH,
        module_url=f"{STATIC_URL}/{PANEL_JS}?v={data['version']}",
        sidebar_title="Plan Studio",
        sidebar_icon="mdi:floor-plan",
        require_admin=True,
        config={},
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    live = hass.data.get(DOMAIN, {}).pop("live", None)
    if live is not None:
        await live.async_stop()
    return True
