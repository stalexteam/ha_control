"""Rules inside Home Assistant: LiveRuntime glue and the rules subscription (HA stubbed)."""

import asyncio
import datetime
import importlib
import importlib.util
import sys
import types
from pathlib import Path

import pytest

PKG = Path(__file__).resolve().parents[2] / "custom_components" / "plan_studio"
NAME = "ps_live_under_test"


def _module(name, **attrs):
    mod = types.ModuleType(name)
    mod.__dict__.update(attrs)
    return mod


class Context:
    n = 0

    def __init__(self):
        Context.n += 1
        self.id = f"ctx{Context.n}"
        self.parent_id = None


class FakeStates:
    def __init__(self):
        self.d = {}

    def get(self, eid):
        v = self.d.get(eid)
        return None if v is None else types.SimpleNamespace(state=v, attributes={})


class FakeServices:
    def __init__(self):
        self.known = {("switch", "turn_off")}
        self.calls = []
        self.fail = None

    def has_service(self, domain, service):
        return (domain, service) in self.known

    async def async_call(self, domain, service, data, blocking=False, context=None):
        self.calls.append((domain, service, data, blocking, context))
        if self.fail:
            raise RuntimeError(self.fail)


class FakeHass:
    def __init__(self):
        self.states = FakeStates()
        self.services = FakeServices()
        self.tasks = []
        self.data = {"plan_studio": {}}

    def async_create_task(self, coro):
        task = asyncio.ensure_future(coro)
        self.tasks.append(task)
        return task


class FakePlans:
    def __init__(self, plans):
        self._plans = plans

    def plans(self):
        return self._plans


class FakeStore:
    def __init__(self, *a, **kw):
        pass

    async def async_load(self):
        return None

    async def async_remove(self):
        pass

    def async_delay_save(self, *a):
        pass


@pytest.fixture
def env(monkeypatch):
    tracked, later, cmds = [], [], {}

    def track(hass, ids, cb):
        entry = {"ids": list(ids), "cb": cb, "on": True}
        tracked.append(entry)
        return lambda: entry.__setitem__("on", False)

    def call_later(hass, delay, action):
        entry = {"delay": delay, "action": action, "on": True}
        later.append(entry)
        return lambda: entry.__setitem__("on", False)

    def command(schema):
        def deco(fn):
            cmds[next(v for k, v in schema.items() if str(k) == "type")] = fn
            return fn

        return deco

    ws = _module(
        "homeassistant.components.websocket_api",
        websocket_command=command,
        require_admin=lambda fn: fn,
        async_response=lambda fn: fn,
        event_message=lambda i, ev: {"id": i, "type": "event", "event": ev},
        async_register_command=lambda hass, fn: None,
    )
    stubs = {
        "homeassistant": _module("homeassistant"),
        "homeassistant.components": _module("homeassistant.components", websocket_api=ws),
        "homeassistant.components.websocket_api": ws,
        "homeassistant.core": _module(
            "homeassistant.core", CALLBACK_TYPE=object, HomeAssistant=object, callback=lambda f: f, Context=Context
        ),
        "homeassistant.helpers": _module("homeassistant.helpers"),
        "homeassistant.helpers.event": _module(
            "homeassistant.helpers.event", async_track_state_change_event=track, async_call_later=call_later
        ),
        "homeassistant.helpers.storage": _module("homeassistant.helpers.storage", Store=FakeStore),
        "homeassistant.util": _module("homeassistant.util"),
        "homeassistant.util.dt": _module(
            "homeassistant.util.dt", utcnow=lambda: datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc)
        ),
        f"{NAME}.store": _module(f"{NAME}.store", PlanStore=object),
    }
    for k, v in stubs.items():
        monkeypatch.setitem(sys.modules, k, v)
    spec = importlib.util.spec_from_file_location(NAME, PKG / "__init__.py", submodule_search_locations=[str(PKG)])
    pkg = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, NAME, pkg)
    live_mod = importlib.import_module(f"{NAME}.live")
    ws_mod = importlib.import_module(f"{NAME}.websocket_api")
    yield types.SimpleNamespace(live=live_mod, ws=ws_mod, tracked=tracked, later=later, cmds=cmds)
    for name in [m for m in sys.modules if m.startswith(f"{NAME}.")]:
        sys.modules.pop(name, None)


def _plan(on_delay=0):
    def dev(i, kind, bindings):
        return {"id": i, "name": i, "props": {"kind": kind}, "bindings": bindings}

    return {
        "id": "p1",
        "levels": [
            {
                "devices": [
                    dev("leak", "leak_sensor", {"leak": "binary_sensor.leak"}),
                    dev("sw", "socket", {"control": "switch.sock"}),
                ]
            }
        ],
        "rules": [
            {
                "id": "r1", "name": "R", "zoneId": None, "combine": "all", "onDelay": on_delay, "offDelay": 0,
                "inputs": [{"source": {"device": "leak"}}], "onTrue": [{"device": "sw", "do": "off"}], "onFalse": [],
            }
        ],
    }


async def _start(env, hass, plan=None):
    hass.states.d["binary_sensor.leak"] = "off"
    hass.states.d["switch.sock"] = "on"
    live = env.live.LiveRuntime(hass, FakePlans([plan or _plan()]))
    await live.async_start()
    return live


def test_state_change_reaches_engine_and_call_uses_own_context(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        assert "binary_sensor.leak" in env.tracked[-1]["ids"]
        ignored = []
        orig = live.runtime.ignore_context
        live.runtime.ignore_context = lambda cid: (ignored.append(cid), orig(cid))[1]
        hass.states.d["binary_sensor.leak"] = "on"
        ev = types.SimpleNamespace(
            data={"entity_id": "binary_sensor.leak", "old_state": None, "new_state": hass.states.get("binary_sensor.leak")},
            context=Context(),
        )
        env.tracked[-1]["cb"](ev)
        assert hass.services.calls == []  # the call is a task: no reentrancy
        await asyncio.gather(*hass.tasks)
        ((domain, service, data, blocking, ctx),) = hass.services.calls
        assert (domain, service, data, blocking) == ("switch", "turn_off", {"entity_id": "switch.sock"}, True)
        assert ignored == [ctx.id]

    asyncio.run(go())


def test_failed_service_is_recorded(env):
    async def go():
        hass = FakeHass()
        hass.services.fail = "boom"
        live = await _start(env, hass)
        hass.states.d["binary_sensor.leak"] = "on"
        live.engine.handle_state("binary_sensor.leak")
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"
        await asyncio.gather(*hass.tasks, return_exceptions=True)
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "error" and trace["reason"] == "service failed"
        assert trace["last"]["error"] == "boom"

    asyncio.run(go())


def test_missing_service_fails_synchronously(env):
    async def go():
        hass = FakeHass()
        hass.services.known.clear()
        live = await _start(env, hass)
        hass.states.d["binary_sensor.leak"] = "on"
        live.engine.handle_state("binary_sensor.leak")
        assert hass.tasks == []
        assert live.engine.snapshot("p1")["r1"]["reason"] == "service failed"

    asyncio.run(go())


def test_delay_timer_wraps_zero_arg_callback_and_stop_cancels_timers(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass, _plan(on_delay=5))
        hass.states.d["binary_sensor.leak"] = "on"
        live.engine.handle_state("binary_sensor.leak")
        pending = [t for t in env.later if t["on"]]
        assert len(pending) == 1 and pending[0]["delay"] == 5
        pending[0]["on"] = False  # a fired timer is gone
        pending[0]["action"](datetime.datetime.now())  # async_call_later passes the time
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1

    asyncio.run(go())


def test_stop_cancels_pending_rule_timer(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass, _plan(on_delay=5))
        hass.states.d["binary_sensor.leak"] = "on"
        live.engine.handle_state("binary_sensor.leak")
        assert [t for t in env.later if t["on"]]
        await live.async_stop()
        assert not [t for t in env.later if t["on"]]

    asyncio.run(go())


def test_rules_subscribe_sends_result_then_full_then_changes(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        hass.data["plan_studio"]["live"] = live
        sent, subs = [], {}
        conn = types.SimpleNamespace(
            subscriptions=subs,
            send_result=lambda i, r=None: sent.append(("result", i)),
            send_message=lambda m: sent.append(("msg", m)),
            send_error=lambda i, code, text: sent.append(("error", code)),
        )
        env.ws.ws_rules_subscribe(hass, conn, {"id": 7, "plan_id": "p1"})
        assert sent[0] == ("result", 7)
        msg = sent[1][1]
        assert msg["id"] == 7 and msg["event"]["full"] is True and set(msg["event"]["rules"]) == {"r1"}
        hass.states.d["binary_sensor.leak"] = "on"
        live.engine.handle_state("binary_sensor.leak")
        assert sent[2][1]["event"]["full"] is False
        subs[7]()
        n = len(sent)
        hass.states.d["binary_sensor.leak"] = "off"
        live.engine.handle_state("binary_sensor.leak")
        assert len(sent) == n
        hass.data["plan_studio"].pop("live")
        env.ws.ws_rules_subscribe(hass, conn, {"id": 8, "plan_id": "p1"})
        assert sent[-1] == ("error", "not_loaded")
        assert "plan_studio/rules/subscribe" in env.cmds

    asyncio.run(go())
