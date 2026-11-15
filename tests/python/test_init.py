"""Entry setup: a failing container runtime must not keep the panel from loading (no Home Assistant needed)."""

import asyncio
import importlib.util
import logging
import sys
import types
from pathlib import Path

import pytest

PKG = Path(__file__).resolve().parents[2] / "custom_components" / "plan_studio"
NAME = "ps_init_under_test"


class FakeHass:
    def __init__(self) -> None:
        # A preset version skips reading the bundle from disk.
        self.data = {"plan_studio": {"version": "test"}}
        self.http = types.SimpleNamespace(async_register_static_paths=self._static)
        self.static = []

    async def _static(self, paths) -> None:
        self.static.extend(paths)


def _module(name: str, **attrs) -> types.ModuleType:
    mod = types.ModuleType(name)
    for k, v in attrs.items():
        setattr(mod, k, v)
    return mod


@pytest.fixture
def setup_module(monkeypatch):
    """Import __init__.py as a package with Home Assistant and the HA-bound submodules stubbed."""
    panels = []

    async def register_panel(hass, **kwargs) -> None:
        panels.append(kwargs)

    class PlanStore:
        def __init__(self, hass) -> None:
            pass

        async def async_load(self) -> None:
            pass

    class LiveRuntime:
        def __init__(self, hass, store) -> None:
            pass

        async def async_start(self) -> None:
            raise RuntimeError("runtime start failed")

    frontend = _module("homeassistant.components.frontend", async_remove_panel=lambda hass, path: None)
    panel_custom = _module("homeassistant.components.panel_custom", async_register_panel=register_panel)
    stubs = {
        "homeassistant": _module("homeassistant"),
        "homeassistant.components": _module("homeassistant.components", frontend=frontend, panel_custom=panel_custom),
        "homeassistant.components.frontend": frontend,
        "homeassistant.components.panel_custom": panel_custom,
        "homeassistant.components.http": _module(
            "homeassistant.components.http", StaticPathConfig=lambda *a, **kw: (a, kw)
        ),
        "homeassistant.config_entries": _module("homeassistant.config_entries", ConfigEntry=object),
        "homeassistant.core": _module("homeassistant.core", HomeAssistant=object),
        f"{NAME}.websocket_api": _module(f"{NAME}.websocket_api", async_register=lambda hass: None),
        f"{NAME}.live": _module(f"{NAME}.live", LiveRuntime=LiveRuntime),
        f"{NAME}.store": _module(f"{NAME}.store", PlanStore=PlanStore),
    }
    for name, mod in stubs.items():
        monkeypatch.setitem(sys.modules, name, mod)
    spec = importlib.util.spec_from_file_location(
        NAME, PKG / "__init__.py", submodule_search_locations=[str(PKG)]
    )
    module = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, NAME, module)
    spec.loader.exec_module(module)
    yield module, panels
    for name in [m for m in sys.modules if m.startswith(f"{NAME}.")]:
        sys.modules.pop(name, None)


def test_runtime_failure_still_registers_the_panel(setup_module, caplog):
    module, panels = setup_module
    hass = FakeHass()
    with caplog.at_level(logging.ERROR):
        assert asyncio.run(module.async_setup_entry(hass, None)) is True
    assert [p["frontend_url_path"] for p in panels] == ["plan-studio"]
    assert "live" not in hass.data["plan_studio"]
    assert "store" in hass.data["plan_studio"]
    assert any(r.exc_info and "runtime start failed" in str(r.exc_info[1]) for r in caplog.records)
    # Unloading without a runtime is fine too.
    assert asyncio.run(module.async_unload_entry(hass, None)) is True
