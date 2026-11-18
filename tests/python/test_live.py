"""Rules inside Home Assistant: LiveRuntime glue and the rules subscription (HA stubbed)."""

import asyncio
import datetime
import importlib
import importlib.util
import math
import sys
import time
import types
from pathlib import Path

import pytest

PKG = Path(__file__).resolve().parents[2] / "custom_components" / "plan_studio"
NAME = "ps_live_under_test"


def _module(name, **attrs):
    mod = types.ModuleType(name)
    mod.__dict__.update(attrs)
    return mod


ZONE = datetime.timezone(datetime.timedelta(hours=2), "TEST")  # stands for HA's configured zone


def _mark(f):
    f._hass_callback = True
    return f


class Context:
    n = 0

    def __init__(self):
        Context.n += 1
        self.id = f"ctx{Context.n}"
        self.parent_id = None


class FakeStates:
    def __init__(self):
        self.d = {}
        self.changed = {}

    def get(self, eid):
        v = self.d.get(eid)
        if v is None:
            return None
        at = self.changed.get(eid, 0.0)
        return types.SimpleNamespace(
            state=v, attributes={}, last_changed=datetime.datetime.fromtimestamp(at, datetime.timezone.utc)
        )


class FakeServices:
    def __init__(self):
        self.known = {("switch", "turn_off")}
        self.calls = []
        self.fail = None
        self.fail_first = False

    def has_service(self, domain, service):
        return (domain, service) in self.known

    async def async_call(self, domain, service, data, blocking=False, context=None):
        self.calls.append((domain, service, data, blocking, context))
        if self.fail or (self.fail_first and len(self.calls) == 1):
            raise RuntimeError(self.fail or "boom")


class CoreState:
    not_running = "NOT_RUNNING"
    starting = "STARTING"
    running = "RUNNING"


class FakeHass:
    def __init__(self):
        self.state = CoreState.running
        self.states = FakeStates()
        self.services = FakeServices()
        self.tasks = []
        self.task_args = []
        self.data = {"plan_studio": {}}

    def async_create_background_task(self, coro, name, eager_start=True):
        self.task_args.append((name, eager_start))
        task = asyncio.ensure_future(coro)
        self.tasks.append(task)
        return task


class FakePlans:
    def __init__(self, plans):
        self._plans = plans

    def plans(self):
        return self._plans


class FakeStore:
    contents: dict = {}  # storage key -> stored data (reset per test by the env fixture)
    saved: list = []  # (key, data) per async_delay_save
    flushed: list = []  # (key, data) per async_save

    def __init__(self, hass, version, key):
        self.key = key

    async def async_load(self):
        return FakeStore.contents.get(self.key)

    async def async_remove(self):
        pass

    async def async_save(self, data):
        FakeStore.contents[self.key] = data
        FakeStore.flushed.append((self.key, data))

    def async_delay_save(self, data_func, delay=0):
        FakeStore.saved.append((self.key, data_func()))


@pytest.fixture
def env(monkeypatch):
    tracked, later, cmds, started, reported, schemas = [], [], {}, [], [], {}
    FakeStore.contents, FakeStore.saved, FakeStore.flushed = {}, [], []

    def track(hass, ids, cb):
        entry = {"ids": list(ids), "cb": cb, "on": True}
        tracked.append(entry)
        return lambda: entry.__setitem__("on", False)

    def track_report(hass, ids, cb):
        entry = {"ids": list(ids), "cb": cb, "on": True}
        reported.append(entry)
        return lambda: entry.__setitem__("on", False)

    def call_later(hass, delay, action):
        assert getattr(action, "_hass_callback", False), "timer action must be a @callback"
        entry = {"delay": delay, "action": action, "on": True}
        later.append(entry)
        return lambda: entry.__setitem__("on", False)

    def at_started(hass, cb):
        assert getattr(cb, "_hass_callback", False), "the start action must be a @callback"
        entry = {"cb": cb, "on": True}
        started.append(entry)
        return lambda: entry.__setitem__("on", False)

    def command(schema):
        def deco(fn):
            t = next(v for k, v in schema.items() if str(k) == "type")
            cmds[t] = fn
            schemas[t] = schema
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
            "homeassistant.core",
            CALLBACK_TYPE=object, HomeAssistant=object, callback=_mark, Context=Context, CoreState=CoreState,
        ),
        "homeassistant.helpers": _module("homeassistant.helpers"),
        "homeassistant.helpers.event": _module(
            "homeassistant.helpers.event", async_track_state_change_event=track, async_track_state_report_event=track_report,
            async_call_later=call_later,
        ),
        "homeassistant.helpers.start": _module("homeassistant.helpers.start", async_at_started=at_started),
        "homeassistant.helpers.storage": _module("homeassistant.helpers.storage", Store=FakeStore),
        "homeassistant.util": _module("homeassistant.util"),
        "homeassistant.util.dt": _module(
            "homeassistant.util.dt",
            utcnow=lambda: datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc),
            utc_from_timestamp=lambda ts: datetime.datetime.fromtimestamp(ts, datetime.timezone.utc),
            as_local=lambda d: d.astimezone(ZONE),
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
    yield types.SimpleNamespace(
        live=live_mod, ws=ws_mod, tracked=tracked, later=later, cmds=cmds, started=started, reported=reported, schemas=schemas
    )
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
        assert [eager for _name, eager in hass.task_args] == [False]

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
        assert trace["last"]["error"] == "waiting for target"

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


def test_late_failure_of_an_older_firing_is_ignored(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        hass.services.fail_first = True
        hass.states.d["binary_sensor.leak"] = "on"
        live.engine.handle_state("binary_sensor.leak")  # firing 1, fails later
        hass.states.d["binary_sensor.leak"] = "off"
        live.engine.handle_state("binary_sensor.leak")
        hass.states.d["binary_sensor.leak"] = "on"
        live.engine.handle_state("binary_sensor.leak")  # firing 2, succeeds
        await asyncio.gather(*hass.tasks, return_exceptions=True)
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"

    asyncio.run(go())


def _boot_plan():
    p = _plan()
    p["levels"][0]["devices"].append(
        {"id": "sw2", "name": "sw2", "props": {"kind": "socket"}, "bindings": {"control": "switch.sock2"}}
    )
    p["rules"][0]["onTrue"].append({"device": "sw2", "do": "off"})
    p["rules"][0]["onFalse"] = [{"device": "sw", "do": "on"}]
    return p


async def _boot(env, hass, plan):
    """Start during bootstrap with a wet sensor: the rule fires at once, before HA has started."""
    hass.state = CoreState.not_running
    hass.states.d["switch.sock2"] = "on"
    live = await _start(env, hass, plan)
    hass.states.d["binary_sensor.leak"] = "on"
    live.engine.handle_state("binary_sensor.leak")
    return live


def _fire_started(env, hass):
    hass.state = CoreState.running
    for entry in [e for e in env.started if e["on"]]:
        entry["on"] = False
        entry["cb"](hass)


def test_calls_before_start_are_sent_once_after_start_in_order_with_own_contexts(env):
    async def go():
        hass = FakeHass()
        hass.services.known.clear()  # the switch platform is not set up yet
        live = await _boot(env, hass, _boot_plan())
        ignored = []
        orig = live.runtime.ignore_context
        live.runtime.ignore_context = lambda cid: (ignored.append(cid), orig(cid))[1]
        assert hass.tasks == [] and hass.services.calls == []
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"
        assert len([e for e in env.started if e["on"] and e["cb"].__name__ == "_started"]) == 1  # one for all deferred calls
        hass.services.known.add(("switch", "turn_off"))
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert [(c[0], c[1], c[2]) for c in hass.services.calls] == [
            ("switch", "turn_off", {"entity_id": "switch.sock"}),
            ("switch", "turn_off", {"entity_id": "switch.sock2"}),
        ]
        assert ignored == [c[4].id for c in hass.services.calls]
        _fire_started(env, hass)  # nothing is sent twice
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 2
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"

    asyncio.run(go())


def test_a_service_still_missing_after_start_is_reported(env):
    async def go():
        hass = FakeHass()
        hass.services.known.clear()
        live = await _boot(env, hass, _plan())
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks, return_exceptions=True)
        assert hass.services.calls == []
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "error" and trace["reason"] == "service failed"
        assert trace["last"]["error"] == "waiting for target"

    asyncio.run(go())


def test_a_stale_call_from_before_start_is_not_sent(env):
    async def go():
        hass = FakeHass()
        hass.services.known.add(("switch", "turn_on"))
        live = await _boot(env, hass, _boot_plan())
        hass.states.d["binary_sensor.leak"] = "off"
        live.engine.handle_state("binary_sensor.leak")  # a newer firing: switch.sock on
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert [(c[0], c[1], c[2]) for c in hass.services.calls] == [("switch", "turn_on", {"entity_id": "switch.sock"})]

    asyncio.run(go())


def test_a_rule_changed_or_removed_before_start_sends_nothing(env):
    async def go():
        hass = FakeHass()
        plans = FakePlans([_plan()])
        hass.state = CoreState.not_running
        hass.states.d.update({"binary_sensor.leak": "on", "switch.sock": "on"})
        live = env.live.LiveRuntime(hass, plans)
        await live.async_start()  # the wet sensor fires at rule start
        changed = _plan(on_delay=3)
        plans._plans = [changed]
        live.reload()  # the changed rule restarts; its start firing is deferred again
        plans._plans = []
        live.reload()
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert hass.services.calls == []

    asyncio.run(go())


def test_stop_before_start_drops_the_deferred_calls(env):
    async def go():
        hass = FakeHass()
        live = await _boot(env, hass, _plan())
        await live.async_stop()
        assert not [e for e in env.started if e["on"]]
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert hass.services.calls == []

    asyncio.run(go())


# --- waiting for target and re-send -------------------------------------------


def _event(env, hass, eid, state):
    """Set a state and deliver its state_changed event through the tracked callback."""
    if state is None:
        hass.states.d.pop(eid, None)
    else:
        hass.states.d[eid] = state
    assert eid in env.tracked[-1]["ids"] and env.tracked[-1]["on"]
    ev = types.SimpleNamespace(
        data={"entity_id": eid, "old_state": None, "new_state": hass.states.get(eid)}, context=Context()
    )
    env.tracked[-1]["cb"](ev)


def test_rule_targets_are_tracked_and_retracked_on_reload(env):
    async def go():
        hass = FakeHass()
        plans = FakePlans([_plan()])
        live = env.live.LiveRuntime(hass, plans)
        await live.async_start()
        assert "switch.sock" in env.tracked[-1]["ids"]
        moved = _plan()
        moved["levels"][0]["devices"][1]["bindings"]["control"] = "switch.other"
        plans._plans = [moved]
        live.reload()
        ids = env.tracked[-1]["ids"]
        assert "switch.other" in ids and "switch.sock" not in ids

    asyncio.run(go())


def test_a_boot_call_finding_its_target_missing_is_resent_when_it_appears(env):
    async def go():
        hass = FakeHass()
        live = await _boot(env, hass, _plan())
        hass.states.d.pop("switch.sock")  # Zigbee2MQTT is not up yet
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1  # still sent: HA may accept it
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "error" and trace["reason"] == "target unavailable"
        assert trace["last"]["error"] == "waiting for target"
        _event(env, hass, "switch.sock", "unavailable")
        _event(env, hass, "switch.sock", "on")
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 2
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "ok" and "error" not in trace["last"]
        _event(env, hass, "switch.sock", "off")
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 2

    asyncio.run(go())


def test_a_boot_call_whose_target_came_back_before_start_has_no_stale_error(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.not_running
        live = await _start(env, hass)
        hass.states.d["switch.sock"] = "unavailable"
        hass.states.d["binary_sensor.leak"] = "on"
        live.engine.handle_state("binary_sensor.leak")  # fires while the target is unavailable
        _event(env, hass, "switch.sock", "on")  # back before HA has started
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "ok" and "error" not in trace["last"]

    asyncio.run(go())


def test_a_late_failure_is_resent_when_the_target_reports(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        hass.services.fail_first = True
        _event(env, hass, "binary_sensor.leak", "on")
        await asyncio.gather(*hass.tasks, return_exceptions=True)
        assert live.engine.snapshot("p1")["r1"]["last"]["error"] == "waiting for target"
        _event(env, hass, "switch.sock", "on")
        await asyncio.gather(*hass.tasks, return_exceptions=True)
        assert len(hass.services.calls) == 2
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"

    asyncio.run(go())


def _held_plan():
    p = _plan()
    p["rules"][0]["inputs"] = [
        {"source": {"held": {"sources": [{"device": "leak"}], "state": "off", "seconds": 300}}}
    ]
    p["rules"][0]["onTrue"] = [{"device": "sw", "do": "off"}]
    return p


def _held_detail(live):
    return live.engine.snapshot("p1")["r1"]["inputs"][0]["detail"]


def test_local_time_uses_the_configured_zone_and_last_changed_is_read(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        assert live.engine._local(0).utcoffset() == datetime.timedelta(hours=2)
        assert live.engine._local(0).tzinfo is ZONE
        hass.states.changed["binary_sensor.leak"] = 1234.0
        assert live._changed_at("binary_sensor.leak") == 1234.0
        assert live._changed_at("sensor.none") is None

    asyncio.run(go())


def test_changed_at_is_long_ago_after_a_return_from_no_data(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        eid = "binary_sensor.leak"
        hass.states.changed[eid] = 1234.0

        def fire(old, new):
            hass.states.d[eid] = new
            env.tracked[-1]["cb"](types.SimpleNamespace(
                data={"entity_id": eid, "old_state": None if old is None else types.SimpleNamespace(
                    state=old, attributes={}, last_changed=None), "new_state": hass.states.get(eid)},
                context=Context(),
            ))

        assert live._changed_at(eid) == 1234.0  # no return seen
        fire("unavailable", "on")
        assert live._changed_at(eid) == -math.inf
        hass.states.changed[eid] = 2000.0
        fire("on", "off")  # a real change: its time counts again
        assert live._changed_at(eid) == 2000.0
        hass.states.changed[eid] = 3000.0
        fire("unknown", "off")
        assert live._changed_at(eid) == -math.inf

    asyncio.run(go())


def test_held_at_ha_start_counts_as_held_long_ago(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.starting
        hass.states.changed["binary_sensor.leak"] = datetime.datetime.now().timestamp()
        live = await _start(env, hass, _held_plan())
        assert _held_detail(live) == "off 5 / 5 min"

    asyncio.run(go())


def test_first_load_after_ha_runs_and_an_entry_reload_use_last_changed(env):
    async def go():
        hass = FakeHass()
        hass.states.changed["binary_sensor.leak"] = datetime.datetime.now().timestamp()
        live = await _start(env, hass, _held_plan())  # first load while running: not a start
        assert _held_detail(live) != "off 5 / 5 min"
        hass2 = FakeHass()
        hass2.state = CoreState.starting
        hass2.states.changed["binary_sensor.leak"] = datetime.datetime.now().timestamp()
        live2 = await _start(env, hass2, _held_plan())
        hass2.state = CoreState.running
        live2._plans = FakePlans([_held_plan(), {"id": "p2", "levels": [], "rules": []}])
        live2.reload()  # an entry reload after the start is not a start; the unchanged rule keeps its state
        assert _held_detail(live2) == "off 5 / 5 min"
        live2.engine.load_plans([])
        live2.reload()  # changed rules are read again from last_changed
        assert _held_detail(live2) != "off 5 / 5 min"

    asyncio.run(go())


def test_time_input_timer_is_scheduled_on_the_loop_as_a_callback(env):
    async def go():
        hass = FakeHass()
        p = _plan()
        p["rules"][0]["inputs"] = [{"source": {"time": {"from": "08:00", "to": "09:30"}}}]
        await _start(env, hass, p)
        timers = [t for t in env.later if t["on"]]
        assert len(timers) == 1 and getattr(timers[0]["action"], "_hass_callback", False)

    asyncio.run(go())


# --- boiler rule ----------------------------------------------------------------

W = {"unit_of_measurement": "W"}
BOILER_KEY = "plan_studio.boiler"


def _boiler_plan(button_kind="smart_button"):
    def dev(i, kind, bindings, props=None):
        return {"id": i, "name": i, "props": {"kind": kind, **(props or {})}, "bindings": bindings}

    button = (
        dev("btn", "wall_switch", {"state": "switch.relay"}, {"autoByDoubleToggle": True})
        if button_kind == "wall_switch"
        else dev("btn", "smart_button", {"on": "sensor.act"})
    )
    return {
        "id": "p1",
        "levels": [
            {
                "devices": [
                    dev("b", "equipment", {"control": "switch.relay", "power": "sensor.bp"}, {"controllable": True}),
                    button,
                ]
            }
        ],
        "power": {"blocks": [{"id": "g", "kind": "grid", "power": "sensor.grid"}], "wires": []},
        "rules": [
            {
                "id": "r1", "name": "Boiler", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
                "inputs": [], "onTrue": [], "onFalse": [],
                "boiler": {"device": "b", "button": "btn", "grid": {"block": "g", "limit": 3000, "nominal": 1400}},
            }
        ],
    }


async def _bstart(env, hass, plan, stored=None):
    if stored is not None:
        FakeStore.contents[BOILER_KEY] = stored
    hass.services.known |= {("switch", "turn_on"), ("switch", "turn_off")}
    hass.states.d.update({"switch.relay": "off", "sensor.grid": "500", "sensor.bp": "0", "sensor.act": ""})
    live = env.live.LiveRuntime(hass, FakePlans([plan]))
    await live.async_start()
    return live


def _boiler_event(env, hass, eid, state, ctx=None, old="x"):
    hass.states.d[eid] = state
    new = hass.states.get(eid)
    new.attributes = W if eid in ("sensor.grid", "sensor.bp") else {}
    prev = types.SimpleNamespace(state=old, attributes={}, last_changed=new.last_changed)
    ev = types.SimpleNamespace(
        data={"entity_id": eid, "old_state": prev, "new_state": new}, context=ctx or Context()
    )
    env.tracked[-1]["cb"](ev)


def _bsaves():
    return [s for s in FakeStore.saved if s[0] == BOILER_KEY]


def test_boiler_entities_are_tracked(env):
    async def go():
        hass = FakeHass()
        await _bstart(env, hass, _boiler_plan())
        assert {"sensor.grid", "sensor.bp", "switch.relay"} <= set(env.tracked[-1]["ids"])

    asyncio.run(go())


def test_boiler_modes_load_before_the_first_load_and_save_on_change(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan(), stored={"p1": {"r1": "auto"}})
        assert live.engine.modes() == {"p1": {"r1": "auto"}}
        assert _bsaves() == []  # same as stored: nothing to save
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # -> manual
        assert _bsaves()[-1] == (BOILER_KEY, {"p1": {"r1": "manual"}})

    asyncio.run(go())


def test_boiler_stop_does_not_wipe_the_store(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan(), stored={"p1": {"r1": "auto"}})
        n = len(_bsaves())
        await live.async_stop()
        assert len(_bsaves()) == n

    asyncio.run(go())


def test_boiler_prunes_a_deleted_rule_in_the_store(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan(), stored={"p1": {"r1": "auto", "gone": "auto"}})
        assert _bsaves()[-1] == (BOILER_KEY, {"p1": {"r1": "auto"}})
        assert live.engine.modes() == {"p1": {"r1": "auto"}}

    asyncio.run(go())


def test_boiler_restored_auto_runs_only_after_ha_started(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.not_running
        live = await _bstart(env, hass, _boiler_plan(), stored={"p1": {"r1": "auto"}})
        assert live.engine.snapshot("p1")["r1"]["boiler"]["phase"] is None
        assert hass.services.calls == []
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert live.engine.snapshot("p1")["r1"]["boiler"]["phase"] == "heating"
        assert [c[:3] for c in hass.services.calls] == [("switch", "turn_on", {"entity_id": "switch.relay"})]

    asyncio.run(go())


def test_boiler_no_start_wait_when_ha_already_runs(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan(), stored={"p1": {"r1": "auto"}})
        await asyncio.gather(*hass.tasks)
        assert live.engine.snapshot("p1")["r1"]["boiler"]["phase"] == "heating"

    asyncio.run(go())


def test_boiler_stop_cancels_the_start_wait(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.not_running
        live = await _bstart(env, hass, _boiler_plan())
        await live.async_stop()
        assert not [e for e in env.started if e["on"]]

    asyncio.run(go())


def test_boiler_button_intent_reaches_the_engine(env):
    async def go():
        hass = FakeHass()
        await _bstart(env, hass, _boiler_plan())
        _boiler_event(env, hass, "sensor.act", "single")
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_on"]  # toggle: relay off -> on, manual

    asyncio.run(go())


def test_boiler_status_events_are_not_intents(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan())
        seen = []
        live.engine.on_intent = lambda *a: seen.append(a)
        live._on_container("p1", "btn", {"status": "ok"})
        live._on_container("p1", "btn", {"action": "toggle"})
        assert len(seen) == 1

    asyncio.run(go())


def test_boiler_own_context_relay_change_is_not_a_take_over(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan(), stored={"p1": {"r1": "auto"}})
        await asyncio.gather(*hass.tasks)  # auto sent on
        ctx = hass.services.calls[-1][4]
        _boiler_event(env, hass, "switch.relay", "off", old="off")
        _boiler_event(env, hass, "switch.relay", "on", ctx=ctx, old="off")
        assert live.engine.snapshot("p1")["r1"]["boiler"]["mode"] == "auto"
        _boiler_event(env, hass, "switch.relay", "off", old="on")  # a human
        assert live.engine.snapshot("p1")["r1"]["boiler"]["mode"] == "manual"

    asyncio.run(go())


def test_boiler_wall_switch_over_the_relay_is_a_set_and_a_double_toggle_is_auto(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan("wall_switch"), stored={"p1": {"r1": "auto"}})
        await asyncio.gather(*hass.tasks)
        ctx = hass.services.calls[-1][4]
        _boiler_event(env, hass, "switch.relay", "on", ctx=ctx, old="off")
        mode = lambda: live.engine.snapshot("p1")["r1"]["boiler"]["mode"]  # noqa: E731
        _boiler_event(env, hass, "switch.relay", "off", old="on")  # physical press: intent set off, manual
        assert mode() == "manual"
        _boiler_event(env, hass, "switch.relay", "on", old="off")  # second press: intent auto first, then the state
        assert mode() == "auto"  # the state change is not a take-over of the auto it just started
        assert len(hass.services.calls) == 1

    asyncio.run(go())


def test_boiler_stop_flushes_the_current_modes(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan(), stored={"p1": {"r1": "auto"}})
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # manual, save still pending
        await live.async_stop()
        assert [f for f in FakeStore.flushed if f[0] == BOILER_KEY] == [(BOILER_KEY, {"p1": {"r1": "manual"}})]

    asyncio.run(go())


def test_boiler_a_raising_intent_does_not_escape(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan())

        def boom(*a):
            raise RuntimeError("bug")

        live.engine.on_intent = boom
        live._on_container("p1", "btn", {"action": "toggle"})  # must not raise

    asyncio.run(go())


def test_boiler_intent_reaches_the_engine_before_the_state_change(env):
    """Three presses of a wall switch over the relay: the third is a repeated auto. Only with the intent first is
    the state change behind it no take-over, so the mode is never reported manual a second time."""
    async def go():
        hass = FakeHass()
        await _bstart(env, hass, _boiler_plan("wall_switch"), stored={"p1": {"r1": "auto"}})
        await asyncio.gather(*hass.tasks)
        _boiler_event(env, hass, "switch.relay", "on", ctx=hass.services.calls[-1][4], old="off")
        _boiler_event(env, hass, "switch.relay", "off", old="on")  # set off -> manual
        _boiler_event(env, hass, "switch.relay", "on", old="off")  # double toggle -> auto
        _boiler_event(env, hass, "switch.relay", "off", old="on")  # within the window again -> auto (repeated)
        assert [s[1]["p1"]["r1"] for s in _bsaves()] == ["manual", "auto"]

    asyncio.run(go())


# --- timed switch rule ----------------------------------------------------------

TIMED_KEY = "plan_studio.timed"


def _timed_plan(button_kind="smart_button"):
    def dev(i, kind, bindings, props=None):
        return {"id": i, "name": i, "props": {"kind": kind, **(props or {})}, "bindings": bindings}

    button = (
        dev("btn", "wall_switch", {"state": "switch.relay"})
        if button_kind == "wall_switch"
        else dev("btn", "smart_button", {"on": "sensor.act"})
    )
    return {
        "id": "p1",
        "levels": [{"devices": [dev("v", "socket", {"control": "switch.relay"}), button]}],
        "rules": [
            {
                "id": "r1", "name": "Vent", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
                "inputs": [], "onTrue": [], "onFalse": [],
                "timed": {"button": "btn", "device": "v", "minutes": 15},
            }
        ],
    }


async def _tstart(env, hass, plan, stored=None, relay="off"):
    if stored is not None:
        FakeStore.contents[TIMED_KEY] = stored
    hass.services.known |= {("switch", "turn_on"), ("switch", "turn_off")}
    hass.states.d.update({"switch.relay": relay, "sensor.act": ""})
    live = env.live.LiveRuntime(hass, FakePlans([plan]))
    await live.async_start()
    return live


def _tsaves():
    return [s for s in FakeStore.saved if s[0] == TIMED_KEY]


def _tcalls(hass):
    return [c[1] for c in hass.services.calls]


def test_timed_runs_load_before_the_first_load_and_save_on_change(env):
    async def go():
        hass = FakeHass()
        until = time.time() + 600
        live = await _tstart(env, hass, _timed_plan(), stored={"p1": {"r1": until}}, relay="on")
        assert live.engine.runs() == {"p1": {"r1": until}}
        assert _tsaves() == []  # same as stored: nothing to save
        assert [e for e in env.later if e["on"]]  # re-armed at once: HA already runs
        live.engine.on_intent("p1", "btn", {"action": "set", "value": "off"})  # stop
        await asyncio.gather(*hass.tasks)
        assert _tsaves()[-1] == (TIMED_KEY, {}) and _tcalls(hass) == ["turn_off"]

    asyncio.run(go())


def test_timed_button_intent_starts_a_run_and_saves_it(env):
    async def go():
        hass = FakeHass()
        live = await _tstart(env, hass, _timed_plan())
        _boiler_event(env, hass, "sensor.act", "single")  # toggle = start
        await asyncio.gather(*hass.tasks)
        assert _tcalls(hass) == ["turn_on"]
        assert list(_tsaves()[-1][1]["p1"]) == ["r1"] and live.engine.snapshot("p1")["r1"]["verdict"] is True

    asyncio.run(go())


def test_timed_stop_flushes_the_runs_ignores_later_reports_and_keeps_the_device(env):
    async def go():
        hass = FakeHass()
        live = await _tstart(env, hass, _timed_plan())
        live.engine.on_intent("p1", "btn", {"action": "toggle"})
        await asyncio.gather(*hass.tasks)
        runs = live.engine.runs()
        n = len(_tsaves())
        await live.async_stop()
        await asyncio.gather(*hass.tasks)
        assert (TIMED_KEY, runs) in FakeStore.flushed and FakeStore.contents[TIMED_KEY] == runs
        assert len(_tsaves()) == n  # the stop's own load is not saved
        assert _tcalls(hass) == ["turn_on"]  # no final command at stop
        assert not [e for e in env.later if e["on"]]

    asyncio.run(go())


def test_timed_entry_reload_restores_the_run(env):
    async def go():
        hass = FakeHass()
        live = await _tstart(env, hass, _timed_plan())
        live.engine.on_intent("p1", "btn", {"action": "toggle"})
        await live.async_stop()
        live2 = env.live.LiveRuntime(hass, FakePlans([_timed_plan()]))
        await live2.async_start()
        assert live2.engine.runs() == FakeStore.contents[TIMED_KEY] and live2.engine.runs()

    asyncio.run(go())


def test_timed_restored_expired_run_ends_only_after_ha_started(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.not_running
        live = await _tstart(env, hass, _timed_plan(), stored={"p1": {"r1": 1.0}}, relay="on")
        assert live.engine.snapshot("p1")["r1"]["verdict"] is True and hass.services.calls == []
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert _tcalls(hass) == ["turn_off"] and live.engine.runs() == {}
        assert _tsaves()[-1] == (TIMED_KEY, {})

    asyncio.run(go())


def test_timed_restored_live_run_rearms_after_ha_started(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.not_running
        await _tstart(env, hass, _timed_plan(), stored={"p1": {"r1": time.time() + 300}}, relay="on")
        assert not [e for e in env.later if e["on"]]
        _fire_started(env, hass)
        timers = [e for e in env.later if e["on"]]
        assert len(timers) == 1 and 290 < timers[0]["delay"] <= 300 and hass.services.calls == []

    asyncio.run(go())


def test_timed_relay_as_the_button_switched_on_by_hand_runs_without_a_command(env):
    """Spec 8: the intent reaches the engine before the device change of the same event."""
    async def go():
        hass = FakeHass()
        live = await _tstart(env, hass, _timed_plan("wall_switch"))
        _boiler_event(env, hass, "switch.relay", "on", old="off")  # the person switches the light on
        await asyncio.gather(*hass.tasks)
        trace = live.engine.snapshot("p1")["r1"]
        assert hass.services.calls == [] and trace["timed"]["running"] is True
        _boiler_event(env, hass, "switch.relay", "off", old="on")  # switched off by hand: a stop, already off
        await asyncio.gather(*hass.tasks)
        trace = live.engine.snapshot("p1")["r1"]
        assert hass.services.calls == [] and trace["timed"]["running"] is False
        assert trace["last"]["reason"] == "button stop" and trace["last"]["sent"] is False

    asyncio.run(go())


def test_boiler_stop_sends_no_relay_command(env):
    async def go():
        hass = FakeHass()
        live = await _bstart(env, hass, _boiler_plan(), stored={"p1": {"r1": "auto"}})
        await asyncio.gather(*hass.tasks)  # auto sent on
        _boiler_event(env, hass, "switch.relay", "on", ctx=hass.services.calls[-1][4], old="off")
        n = len(hass.services.calls)
        await live.async_stop()
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == n

    asyncio.run(go())


# --- outside light rule ------------------------------------------------------------

OUTSIDE_KEY = "plan_studio.outside"


def _outside_plan():
    def dev(i, kind, bindings):
        return {"id": i, "name": i, "props": {"kind": kind}, "bindings": bindings}

    return {
        "id": "p1",
        "levels": [{"devices": [dev("ext", "wall_light", {"control": "switch.ext"}),
                                dev("ls", "illuminance_sensor", {"illuminance": "sensor.lux"})]}],
        "rules": [
            {
                "id": "r1", "name": "Outside", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
                "inputs": [], "onTrue": [], "onFalse": [],
                # no lux data (FakeStates has no unit): night by the flag
                "outside": {"light": "ext", "sensor": "ls", "noDataNight": True, "pause": 30},
            }
        ],
    }


async def _ostart(env, hass, stored=None, light="on"):
    if stored is not None:
        FakeStore.contents[OUTSIDE_KEY] = stored
    hass.services.known |= {("switch", "turn_on"), ("switch", "turn_off")}
    hass.states.d.update({"switch.ext": light, "sensor.lux": "unavailable"})
    live = env.live.LiveRuntime(hass, FakePlans([_outside_plan()]))
    await live.async_start()
    return live


def _osaves():
    return [s for s in FakeStore.saved if s[0] == OUTSIDE_KEY]


def test_outside_pause_loads_before_the_first_load_and_saves_on_change(env):
    async def go():
        hass = FakeHass()
        until = time.time() + 600
        live = await _ostart(env, hass, stored={"p1": {"r1": until}}, light="off")
        assert live.engine.pauses() == {"p1": {"r1": until}} and _osaves() == []
        assert live.engine.snapshot("p1")["r1"]["outside"]["pausedUntil"] == int(until * 1000)
        assert hass.services.calls == [] and [e for e in env.later if e["on"]]  # HA runs: the end is armed at once

    asyncio.run(go())


def test_outside_manual_switch_pauses_and_saves(env):
    async def go():
        hass = FakeHass()
        live = await _ostart(env, hass)
        await asyncio.gather(*hass.tasks)
        _boiler_event(env, hass, "switch.ext", "off", old="on")  # a person, foreign context
        await asyncio.gather(*hass.tasks)
        (key, saved), = _osaves()
        assert key == OUTSIDE_KEY and list(saved["p1"]) == ["r1"] and live.engine.pauses() == saved
        assert [c[1] for c in hass.services.calls] == ["turn_on"]  # the start's on only

    asyncio.run(go())


def test_outside_stop_flushes_the_pauses_and_ignores_later_reports(env):
    async def go():
        hass = FakeHass()
        live = await _ostart(env, hass)
        _boiler_event(env, hass, "switch.ext", "off", old="on")
        pauses = live.engine.pauses()
        n = len(_osaves())
        await live.async_stop()
        assert (OUTSIDE_KEY, pauses) in FakeStore.flushed and FakeStore.contents[OUTSIDE_KEY] == pauses
        assert len(_osaves()) == n and not [e for e in env.later if e["on"]]
        live2 = env.live.LiveRuntime(hass, FakePlans([_outside_plan()]))  # an entry reload restores it
        await live2.async_start()
        assert live2.engine.pauses() == pauses

    asyncio.run(go())


def test_outside_restored_pause_is_armed_only_after_ha_started(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.not_running
        live = await _ostart(env, hass, stored={"p1": {"r1": time.time() + 300}}, light="off")
        assert not [e for e in env.later if e["on"]] and hass.services.calls == []
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        timers = [e for e in env.later if e["on"]]
        assert len(timers) == 1 and 290 < timers[0]["delay"] <= 300 and hass.services.calls == []
        assert live.engine.pauses()

    asyncio.run(go())


def test_outside_restored_expired_pause_applies_the_want_after_ha_started(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.not_running
        live = await _ostart(env, hass, stored={"p1": {"r1": 1.0}}, light="off")
        assert hass.services.calls == [] and hass.tasks == []
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_on"] and live.engine.pauses() == {}
        assert _osaves()[-1] == (OUTSIDE_KEY, {})

    asyncio.run(go())


# --- light motion control rule ------------------------------------------------------

MOTION_KEY = "plan_studio.motion_light"


def _motion_plan():
    def dev(i, kind, bindings):
        return {"id": i, "name": i, "props": {"kind": kind}, "bindings": bindings}

    return {
        "id": "p1",
        "levels": [{"devices": [dev("lamp", "ceiling_light", {"control": "light.k"}),
                                dev("pir", "motion_sensor", {"motion": "binary_sensor.pir"}),
                                dev("btn", "smart_button", {"action": "sensor.act"})]}],
        "rules": [
            {
                "id": "r1", "name": "Kitchen", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 180,
                "inputs": [], "onTrue": [], "onFalse": [],
                "motionLight": {"light": "lamp", "sensors": ["pir"], "minOn": 0, "buttons": ["btn"], "autoAfter": 0},
            }
        ],
    }


async def _mstart(env, hass, stored=None, light="off", pir="off"):
    if stored is not None:
        FakeStore.contents[MOTION_KEY] = stored
    hass.services.known |= {("light", "turn_on"), ("light", "turn_off")}
    hass.states.d.update({"light.k": light, "binary_sensor.pir": pir})
    live = env.live.LiveRuntime(hass, FakePlans([_motion_plan()]))
    await live.async_start()
    return live


def _msaves():
    return [s for s in FakeStore.saved if s[0] == MOTION_KEY]


def test_motion_mode_loads_before_the_first_load_and_saves_on_change(env):
    async def go():
        hass = FakeHass()
        stored = {"p1": {"r1": {"mode": "manual", "since": time.time(), "by": "button"}}}
        live = await _mstart(env, hass, stored=stored, pir="on")
        assert live.engine.motion_modes() == stored and _msaves() == []
        assert live.engine.snapshot("p1")["r1"]["motionLight"]["mode"] == "manual" and hass.services.calls == []

    asyncio.run(go())


def test_motion_manual_switch_saves_the_mode(env):
    async def go():
        hass = FakeHass()
        live = await _mstart(env, hass)
        assert "binary_sensor.pir" in env.tracked[-1]["ids"] and "light.k" in env.tracked[-1]["ids"]
        _boiler_event(env, hass, "light.k", "on", old="off")  # a person, foreign context: never the mode
        await asyncio.gather(*hass.tasks)
        assert _msaves() == [] and live.engine.snapshot("p1")["r1"]["motionLight"]["mode"] == "auto"
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # the button: manual
        await asyncio.gather(*hass.tasks)
        (key, saved), = _msaves()
        assert key == MOTION_KEY and saved == live.engine.motion_modes() and saved["p1"]["r1"]["mode"] == "manual"
        assert [c[1] for c in hass.services.calls] == ["turn_off"]

    asyncio.run(go())


def test_motion_stop_flushes_the_modes_and_an_entry_reload_restores_them(env):
    async def go():
        hass = FakeHass()
        live = await _mstart(env, hass)
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # manual
        modes = live.engine.motion_modes()
        assert modes["p1"]["r1"]["mode"] == "manual"
        n = len(_msaves())
        await live.async_stop()
        assert (MOTION_KEY, modes) in FakeStore.flushed and FakeStore.contents[MOTION_KEY] == modes
        assert len(_msaves()) == n and not [e for e in env.later if e["on"]]
        live2 = env.live.LiveRuntime(hass, FakePlans([_motion_plan()]))
        await live2.async_start()
        assert live2.engine.motion_modes() == modes

    asyncio.run(go())


def test_motion_restored_auto_waits_for_ha_started(env):
    async def go():
        hass = FakeHass()
        hass.state = CoreState.not_running
        live = await _mstart(env, hass, pir="on")
        assert hass.services.calls == [] and hass.tasks == []
        _fire_started(env, hass)
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_on"]
        assert live.engine.snapshot("p1")["r1"]["verdict"] is True

    asyncio.run(go())


def test_info_answers_the_manifest_version(env):
    sent = []
    hass = FakeHass()
    hass.data["plan_studio"]["manifest_version"] = "9.8.7"
    conn = types.SimpleNamespace(send_result=lambda i, r=None: sent.append((i, r)))
    env.ws.ws_info(hass, conn, {"id": 3})
    assert sent == [(3, {"version": "9.8.7"})]
    assert "plan_studio/info" in env.cmds


def _ev(eid, new, old=None):
    return types.SimpleNamespace(data={"entity_id": eid, "old_state": old, "new_state": new}, context=Context())


def _st(state, at):
    d = datetime.datetime.fromtimestamp(at, datetime.timezone.utc)
    return types.SimpleNamespace(state=state, attributes={}, last_changed=d, last_updated=d, last_reported=d)


def test_readings_fed_by_state_change_and_state_report(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        eid = "binary_sensor.leak"
        assert env.reported[-1]["ids"] == env.tracked[-1]["ids"]
        env.tracked[-1]["cb"](_ev(eid, _st("on", 100)))
        env.reported[-1]["cb"](_ev(eid, _st("on", 105)))
        assert live.readings.stats(eid) == {"last": 105000, "period": None, "count": 2}
        env.reported[-1]["cb"](_ev(eid, _st("unavailable", 106)))
        assert live.readings.stats(eid)["count"] == 2

    asyncio.run(go())


def test_engine_reads_the_report_statistics(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        for at in (100, 105, 110, 115):
            live.readings.report("sensor.grid", "500", at)
        assert live.engine._reports("sensor.grid") == (115, 5)
        assert live.engine._reports("sensor.none") == (None, None)

    asyncio.run(go())


def test_state_report_does_not_reach_engine_or_power(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        seen = []
        live.engine.handle_state = lambda *a, **k: seen.append(a)
        live.power.handle_state = lambda *a, **k: seen.append(a)
        live.runtime.handle_state = lambda *a, **k: seen.append(a)
        env.reported[-1]["cb"](_ev("binary_sensor.leak", _st("off", 100)))
        assert seen == []
        env.tracked[-1]["cb"](_ev("binary_sensor.leak", _st("off", 101)))
        assert len(seen) == 3

    asyncio.run(go())


def test_saved_plan_power_schematic_entities_are_tracked_without_subscription(env):
    async def go():
        hass = FakeHass()
        plan = _plan()
        plan["power"] = {"blocks": [{"id": "g", "kind": "grid", "power": "sensor.grid_w", "voltage": "sensor.grid_v"},
                                    {"id": "d", "kind": "device", "deviceId": "pc"}]}
        plan["levels"][0]["devices"].append(
            {"id": "pc", "name": "pc", "props": {"kind": "socket"}, "bindings": {"power": "sensor.pc_w", "control": "switch.pc"}}
        )
        live = await _start(env, hass, plan)
        ids = env.tracked[-1]["ids"]
        for e in ("sensor.grid_w", "sensor.grid_v", "sensor.pc_w"):
            assert e in ids and e in env.reported[-1]["ids"]
        live.readings.report("sensor.stale", "1", 1.0)
        live.retrack()
        assert live.readings.last("sensor.stale") is None

    asyncio.run(go())


def test_a_tracked_entity_keeps_its_history_across_retrack(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        eid = "binary_sensor.leak"
        for at in (100, 105, 110):
            env.reported[-1]["cb"](_ev(eid, _st("off", at)))
        live.retrack()
        assert live.readings.stats(eid)["count"] == 3

    asyncio.run(go())


def test_a_failing_report_does_not_block_the_event(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        seen = []
        live.engine.handle_state = lambda *a, **k: seen.append("engine")
        live.power.handle_state = lambda *a, **k: seen.append("power")
        live.runtime.handle_state = lambda *a, **k: seen.append("runtime")
        junk = types.SimpleNamespace(state="on", attributes={}, last_changed=None, last_updated="x", last_reported="x")
        env.tracked[-1]["cb"](_ev("binary_sensor.leak", junk))  # "x".timestamp() raises
        assert seen == ["runtime", "power", "engine"]

    asyncio.run(go())


def test_retrack_and_stop_untrack_both_trackers(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        live.retrack()
        assert [e["on"] for e in env.tracked] == [False, True] and [e["on"] for e in env.reported] == [False, True]
        await live.async_stop()
        assert not env.tracked[-1]["on"] and not env.reported[-1]["on"]

    asyncio.run(go())


def test_readings_get_command(env):
    async def go():
        hass = FakeHass()
        live = await _start(env, hass)
        hass.data["plan_studio"]["live"] = live
        live.readings.report("sensor.a", "1", 10.0)
        sent = []
        conn = types.SimpleNamespace(send_result=lambda i, r=None: sent.append((i, r)), send_error=lambda *a: sent.append(a))
        env.cmds["plan_studio/readings/get"](hass, conn, {"id": 7, "entity_ids": ["sensor.a", "sensor.b"]})
        assert sent == [(7, {"readings": {
            "sensor.a": {"last": 10000, "period": None, "count": 1},
            "sensor.b": {"last": None, "period": None, "count": 0},
        }})]
        import voluptuous as vol
        schema = vol.Schema(env.schemas["plan_studio/readings/get"])
        schema({"type": "plan_studio/readings/get", "entity_ids": ["x"] * 200})
        with pytest.raises(vol.Invalid):
            schema({"type": "plan_studio/readings/get", "entity_ids": ["x"] * 201})

    asyncio.run(go())


# --- expected state of commanded entities ("our optimistic") ---------------------------


def _ws_plan():
    """A wet sensor switches a socket on; a wall switch container reads the same relay (its presses are intents)."""
    def dev(i, kind, bindings):
        return {"id": i, "name": i, "props": {"kind": kind}, "bindings": bindings}

    return {
        "id": "p1",
        "levels": [{"devices": [
            dev("leak", "leak_sensor", {"leak": "binary_sensor.leak"}),
            dev("sw", "socket", {"control": "switch.sock"}),
            dev("ws", "wall_switch", {"state": "switch.sock"}),
        ]}],
        "rules": [{
            "id": "r1", "name": "R", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
            "inputs": [{"source": {"device": "leak"}}], "onTrue": [{"device": "sw", "do": "on"}], "onFalse": [],
        }],
    }


async def _xstart(env, hass, plan, clock, **states):
    """Start with a manual monotonic clock for the expected states."""
    hass.services.known |= {("switch", "turn_on"), ("switch", "turn_off")}
    hass.states.d.update(states)
    live = env.live.LiveRuntime(hass, FakePlans([plan]))
    live._now = lambda: clock[0]
    await live.async_start()
    return live


def _tick(env, clock, to):
    """Move the clock and fire the timers that are armed (a fired timer is gone)."""
    clock[0] = to
    for t in [t for t in env.later if t["on"]]:
        t["on"] = False
        t["action"](datetime.datetime.now())


def _press(live, did="ws"):
    return live.runtime.snapshot("p1")[did].get("last")


WS_OFF = {"binary_sensor.leak": "off", "switch.sock": "off"}


def test_a_confirmation_7_s_late_with_a_foreign_context_is_ours_not_a_press(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_on"]
        clock[0] = 7.0
        _boiler_event(env, hass, "switch.sock", "on", old="off")  # outside HA's context window: a foreign context
        assert _press(live) is None
        _tick(env, clock, 10.0)
        _tick(env, clock, 60.0)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1  # confirmed: never sent again
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "ok" and "error" not in trace["last"]
        _boiler_event(env, hass, "switch.sock", "off", old="on")  # the record is used up: a person's flip is a press
        assert _press(live)["value"] == "off"

    asyncio.run(go())


def test_a_late_boiler_confirmation_is_no_wall_switch_press_and_no_take_over(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        FakeStore.contents[BOILER_KEY] = {"p1": {"r1": "auto"}}
        live = await _xstart(env, hass, _boiler_plan("wall_switch"), clock, **{
            "switch.relay": "off", "sensor.grid": "500", "sensor.bp": "0", "sensor.act": ""})
        await asyncio.gather(*hass.tasks)  # auto sent on
        assert [c[1] for c in hass.services.calls] == ["turn_on"]
        clock[0] = 7.0
        _boiler_event(env, hass, "switch.relay", "on", old="off")  # the slow relay confirms without the context
        assert _press(live, "btn") is None
        assert live.engine.snapshot("p1")["r1"]["boiler"]["mode"] == "auto"

    asyncio.run(go())


def test_a_lost_on_is_sent_once_more_at_10_s_and_not_confirmed_at_60_s(env, caplog):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")
        await asyncio.gather(*hass.tasks)
        _tick(env, clock, 9.0)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1
        _tick(env, clock, 10.0)
        await asyncio.gather(*hass.tasks)
        assert [c[:3] for c in hass.services.calls] == [("switch", "turn_on", {"entity_id": "switch.sock"})] * 2
        first, again = hass.services.calls[0][4], hass.services.calls[1][4]
        assert again is not first and live.runtime.is_own((again.id, None))  # Plan Studio's own context
        _tick(env, clock, 30.0)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 2  # once only
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"
        with caplog.at_level("WARNING"):
            _tick(env, clock, 60.0)
        assert "switch.sock did not confirm turn_on within 60 s" in caplog.text
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "error" and trace["reason"] == "not confirmed"
        assert trace["last"]["error"] == "not confirmed"
        assert not [t for t in env.later if t["on"]]  # nothing left to wake for
        _boiler_event(env, hass, "switch.sock", "on", old="off")  # the device reaches the state at last
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "ok" and "error" not in trace["last"]

    asyncio.run(go())


def test_a_person_flipping_to_another_state_is_a_press_and_drops_the_record(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **{**WS_OFF, "switch.sock": "on"})
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")  # an on while the relay reads on already
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_on"]
        clock[0] = 2.0
        _boiler_event(env, hass, "switch.sock", "off", old="on")  # a person
        assert _press(live)["value"] == "off"
        clock[0] = 3.0
        _boiler_event(env, hass, "switch.sock", "on", old="off")  # the record is gone: not swallowed as ours
        assert _press(live)["value"] == "on"
        _tick(env, clock, 10.0)
        _tick(env, clock, 60.0)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1  # no retry
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"

    asyncio.run(go())


def test_a_command_its_rule_no_longer_wants_is_not_sent_again(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")
        await asyncio.gather(*hass.tasks)
        clock[0] = 3.0
        _boiler_event(env, hass, "binary_sensor.leak", "off", old="on")  # a newer firing (no action): the on is stale
        _tick(env, clock, 10.0)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1

    asyncio.run(go())


def test_an_unavailable_entity_is_not_sent_again_at_10_s(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")
        await asyncio.gather(*hass.tasks)
        clock[0] = 5.0
        _boiler_event(env, hass, "switch.sock", "unavailable", old="off")
        _tick(env, clock, 10.0)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1
        _tick(env, clock, 60.0)
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "error" and trace["last"]["error"] == "not confirmed"

    asyncio.run(go())


def test_a_command_to_an_entity_already_there_is_never_retried_nor_an_error(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **{**WS_OFF, "switch.sock": "on"})
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")  # no state change will come
        await asyncio.gather(*hass.tasks)
        _tick(env, clock, 10.0)
        _tick(env, clock, 60.0)
        await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == 1
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"

    asyncio.run(go())


def test_a_burst_keeps_one_record_for_the_last_command(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        for do in ("turn_on", "turn_off", "turn_on"):
            live._call("switch", do, "switch.sock", on_error=lambda *a: None, by=("p1", "r1"))
        await asyncio.gather(*hass.tasks)
        asked = []
        live.engine.still_wants = lambda by, eid, state: asked.append((by, eid, state)) or True
        _tick(env, clock, 10.0)
        await asyncio.gather(*hass.tasks)
        assert asked == [(("p1", "r1"), "switch.sock", "on")]  # one record: the last command
        assert [c[1] for c in hass.services.calls] == ["turn_on", "turn_off", "turn_on", "turn_on"]  # the last, once

    asyncio.run(go())


BOILER_ON_LOST = {"switch.relay": "off", "sensor.grid": "500", "sensor.bp": "0", "sensor.act": ""}
BOILER_HEATING = {**BOILER_ON_LOST, "switch.relay": "on", "sensor.bp": "1500"}


async def _boiler_on_lost(env, hass, clock):
    """Auto sends the relay on; the device loses it (the relay stays off)."""
    FakeStore.contents[BOILER_KEY] = {"p1": {"r1": "auto"}}
    live = await _xstart(env, hass, _boiler_plan(), clock, **BOILER_ON_LOST)
    await asyncio.gather(*hass.tasks)
    assert [c[1] for c in hass.services.calls] == ["turn_on"]
    clock[0] = 3.0
    return live


def _calls_after_retry(env, hass, clock):
    async def go():
        _tick(env, clock, 10.0)
        await asyncio.gather(*hass.tasks)
        return [c[1] for c in hass.services.calls]

    return go()


def test_a_lost_boiler_on_is_not_sent_again_into_the_power_limit(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _boiler_on_lost(env, hass, clock)
        _boiler_event(env, hass, "sensor.grid", "2000", old="500")  # 2000 + 1400 > 3000: limit
        assert live.engine.snapshot("p1")["r1"]["boiler"]["phase"] == "limit"
        assert await _calls_after_retry(env, hass, clock) == ["turn_on"]

    asyncio.run(go())


def test_a_lost_boiler_on_is_not_sent_again_in_a_blackout(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _boiler_on_lost(env, hass, clock)
        _boiler_event(env, hass, "sensor.grid", "unavailable", old="500")
        assert live.engine.snapshot("p1")["r1"]["boiler"]["phase"] == "blackout"
        assert await _calls_after_retry(env, hass, clock) == ["turn_on"]

    asyncio.run(go())


def test_a_lost_boiler_on_is_not_sent_again_after_a_set_off_that_sent_nothing(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _boiler_on_lost(env, hass, clock)
        live.engine.on_intent("p1", "btn", {"action": "set", "value": "off"})  # relay reads off: manual, nothing sent
        assert live.engine.snapshot("p1")["r1"]["boiler"]["mode"] == "manual"
        assert await _calls_after_retry(env, hass, clock) == ["turn_on"]

    asyncio.run(go())


def test_a_lost_boiler_limit_off_is_sent_once_more(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        FakeStore.contents[BOILER_KEY] = {"p1": {"r1": "auto"}}
        states = {**BOILER_ON_LOST, "switch.relay": "on", "sensor.bp": "1500"}
        live = await _xstart(env, hass, _boiler_plan(), clock, **states)
        await asyncio.gather(*hass.tasks)
        assert hass.services.calls == []  # heating, the relay on already
        _boiler_event(env, hass, "sensor.grid", "3200", old="500")  # 3200 + 1400 - 1500 > 3000: the safety off
        await asyncio.gather(*hass.tasks)
        assert live.engine.snapshot("p1")["r1"]["boiler"]["phase"] == "limit"
        assert await _calls_after_retry(env, hass, clock) == ["turn_off", "turn_off"]

    asyncio.run(go())


async def _motion_toggle_on_lost(env, hass, clock):
    hass.services.known |= {("light", "turn_on"), ("light", "turn_off")}
    live = await _xstart(env, hass, _motion_plan(), clock, **{"light.k": "off", "binary_sensor.pir": "off"})
    live.engine.on_intent("p1", "btn", {"action": "toggle"})  # manual, a direct on the device loses
    await asyncio.gather(*hass.tasks)
    assert [c[1] for c in hass.services.calls] == ["turn_on"]
    clock[0] = 3.0
    return live


def test_a_lost_press_on_is_not_sent_again_after_a_set_off_that_sent_nothing(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _motion_toggle_on_lost(env, hass, clock)
        live.engine.on_intent("p1", "btn", {"action": "set", "value": "off"})  # the light reads off: nothing sent
        assert await _calls_after_retry(env, hass, clock) == ["turn_on"]

    asyncio.run(go())


def test_a_lost_press_on_is_not_sent_again_after_auto_without_motion(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _motion_toggle_on_lost(env, hass, clock)
        live.engine.on_intent("p1", "btn", {"action": "auto"})  # no motion, the light reads off: nothing sent
        assert live.engine.snapshot("p1")["r1"]["motionLight"]["mode"] == "auto"
        assert await _calls_after_retry(env, hass, clock) == ["turn_on"]

    asyncio.run(go())


def test_a_lost_slot_off_is_not_sent_again_after_a_set_on_that_sent_nothing(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        hass.services.known |= {("light", "turn_on"), ("light", "turn_off")}
        plan = _motion_plan()
        plan["rules"][0]["offDelay"] = 0
        live = await _xstart(env, hass, plan, clock, **{"light.k": "on", "binary_sensor.pir": "on"})  # found on, held
        _boiler_event(env, hass, "binary_sensor.pir", "off", old="on")  # the motion ends: the slot's off, lost
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_off"]
        clock[0] = 3.0
        live.engine.on_intent("p1", "btn", {"action": "set", "value": "on"})  # the light reads on: manual, nothing sent
        assert live.engine.snapshot("p1")["r1"]["motionLight"]["mode"] == "manual"
        assert await _calls_after_retry(env, hass, clock) == ["turn_off"]

    asyncio.run(go())


def _control_plan():
    def dev(i, kind, bindings):
        return {"id": i, "name": i, "props": {"kind": kind}, "bindings": bindings}

    return {
        "id": "p1",
        "levels": [{"devices": [dev("btn", "smart_button", {"action": "sensor.act"}),
                                dev("l1", "socket", {"control": "switch.l1"})]}],
        "rules": [{
            "id": "r1", "name": "LC", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
            "inputs": [], "onTrue": [], "onFalse": [],
            "control": {"sources": [{"button": "btn"}], "on": [{"device": "l1", "do": "on"}],
                        "off": [{"device": "l1", "do": "off"}], "toggle": []},
        }],
    }


async def _control_on_lost(env, hass, clock):
    live = await _xstart(env, hass, _control_plan(), clock, **{"switch.l1": "off", "sensor.act": ""})
    live.engine.on_intent("p1", "btn", {"action": "set", "value": "on"})
    await asyncio.gather(*hass.tasks)
    assert [c[1] for c in hass.services.calls] == ["turn_on"]
    clock[0] = 3.0
    return live


def test_a_lost_load_control_on_is_sent_again_after_a_repeated_press_and_its_latest_entry_shows_the_error(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _control_on_lost(env, hass, clock)
        live.engine.on_intent("p1", "btn", {"action": "set", "value": "on"})  # nothing happened: pressed again
        assert live.engine.snapshot("p1")["r1"]["last"]["sent"] is False  # the on is on its way: nothing sent
        assert await _calls_after_retry(env, hass, clock) == ["turn_on", "turn_on"]  # the rule's latest decision
        _tick(env, clock, 60.0)
        tr = live.engine.snapshot("p1")["r1"]
        assert tr["status"] == "error" and tr["reason"] == "not confirmed"
        assert tr["last"]["error"] == "not confirmed" and tr["last"]["sent"] is False  # the latest event's entry
        _boiler_event(env, hass, "switch.l1", "on", old="off")
        assert "error" not in live.engine.snapshot("p1")["r1"]["last"]

    asyncio.run(go())


def test_a_lost_load_control_on_is_not_sent_again_after_an_opposite_event(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _control_on_lost(env, hass, clock)
        live.engine.on_intent("p1", "btn", {"action": "set", "value": "off"})
        assert await _calls_after_retry(env, hass, clock) == ["turn_on", "turn_off"]

    asyncio.run(go())


def test_a_lost_boiler_release_off_is_sent_once_more(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        FakeStore.contents[BOILER_KEY] = {"p1": {"r1": "auto"}}
        live = await _xstart(env, hass, _boiler_plan(), clock, **BOILER_HEATING)
        await asyncio.gather(*hass.tasks)
        assert hass.services.calls == []  # auto heating, the relay on already
        gone = _boiler_plan()
        gone["rules"] = []
        live._plans._plans = [gone]
        live.reload()  # the rule is deleted in auto: its relay goes off (inverter protection)
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_off"]
        assert await _calls_after_retry(env, hass, clock) == ["turn_off", "turn_off"]

    asyncio.run(go())


def test_a_lost_boiler_release_off_is_not_sent_again_once_another_boiler_rule_in_auto_owns_the_relay(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        FakeStore.contents[BOILER_KEY] = {"p1": {"r1": "auto"}}
        live = await _xstart(env, hass, _boiler_plan(), clock, **BOILER_HEATING)
        await asyncio.gather(*hass.tasks)
        renamed = _boiler_plan()
        renamed["rules"][0]["id"] = "r2"
        live._plans._plans = [renamed]
        live.reload()  # r1 deleted in auto (its off is lost), r2 new in manual
        await asyncio.gather(*hass.tasks)
        live.engine.on_intent("p1", "btn", {"action": "auto"})  # r2 auto: the relay reads on, heating, nothing sent
        assert live.engine.snapshot("p1")["r2"]["boiler"]["mode"] == "auto"
        assert await _calls_after_retry(env, hass, clock) == ["turn_off"]

    asyncio.run(go())


def test_a_lost_slot_on_with_nothing_changed_is_sent_once_more(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        plan = _ws_plan()
        plan["rules"][0]["onFalse"] = [{"device": "sw", "do": "off"}]  # an on / off pair: the holder slots
        await _xstart(env, hass, plan, clock, **WS_OFF)
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_off", "turn_on"]  # the start's off, then the on (lost)
        assert await _calls_after_retry(env, hass, clock) == ["turn_off", "turn_on", "turn_on"]

    asyncio.run(go())


def test_a_no_data_blip_back_in_the_old_state_keeps_the_record(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")
        await asyncio.gather(*hass.tasks)
        clock[0] = 2.0
        _boiler_event(env, hass, "switch.sock", "unavailable", old="off")
        clock[0] = 3.0
        _boiler_event(env, hass, "switch.sock", "off", old="unavailable")  # back, the command not applied
        assert _press(live) is None
        assert await _calls_after_retry(env, hass, clock) == ["turn_on", "turn_on"]
        _tick(env, clock, 60.0)
        assert live.engine.snapshot("p1")["r1"]["last"]["error"] == "not confirmed"

    asyncio.run(go())


def test_a_safety_off_the_relay_ignores_is_repeated_and_not_confirmed_60_s_after_the_first(env):
    async def go():
        hass, clock = FakeHass(), [5000.0]
        FakeStore.contents[BOILER_KEY] = {"p1": {"r1": "auto"}}
        live = await _xstart(env, hass, _boiler_plan(), clock, **BOILER_HEATING)
        live.engine._now = lambda: clock[0]  # the rule's clock follows the test's too
        await asyncio.gather(*hass.tasks)
        assert hass.services.calls == []
        _boiler_event(env, hass, "sensor.grid", "3200", old="500")  # limit: the safety off, ignored by the relay
        await asyncio.gather(*hass.tasks)
        assert [c[1] for c in hass.services.calls] == ["turn_off"]
        trace = lambda: live.engine.snapshot("p1")["r1"]  # noqa: E731
        offs = 1
        for k in range(1, 6):  # +10 .. +50 s: the off again, no error yet
            _tick(env, clock, 5000.0 + 10 * k)
            await asyncio.gather(*hass.tasks)
            n = len(hass.services.calls)
            assert n > offs and set(c[1] for c in hass.services.calls) == {"turn_off"}
            offs = n
            assert trace()["status"] == "ok"
        _tick(env, clock, 5060.0)  # 60 s after the first off
        await asyncio.gather(*hass.tasks)
        assert trace()["status"] == "error" and trace()["reason"] == "not confirmed"
        assert trace()["last"]["error"] == "not confirmed" and trace()["last"]["reason"] == "power limit"
        assert trace()["last"]["at"] == 5060000  # the latest entry
        _tick(env, clock, 5070.0)  # repeated again: the error stays on the newest entry
        await asyncio.gather(*hass.tasks)
        assert trace()["last"]["at"] == 5070000 and trace()["last"]["error"] == "not confirmed"
        clock[0] = 5072.0
        _boiler_event(env, hass, "switch.relay", "off", old="on")  # it got through at last
        assert trace()["status"] == "ok" and "error" not in trace()["last"]
        assert live.engine.snapshot("p1")["r1"]["boiler"]["mode"] == "auto"
        n = len(hass.services.calls)
        for t in (5080.0, 5090.0, 5150.0):
            _tick(env, clock, t)
            await asyncio.gather(*hass.tasks)
        assert len(hass.services.calls) == n  # the repeats stopped

    asyncio.run(go())


def test_a_repeat_at_the_expiry_is_still_ours_when_confirmed_late_and_the_episode_shows_not_confirmed(env):
    """Round 5 J1 (the reviewer's probe): the boiler's +60 s repeat and the expiry come together."""
    async def go():
        hass, clock = FakeHass(), [5000.0]
        FakeStore.contents[BOILER_KEY] = {"p1": {"r1": "auto"}}
        live = await _xstart(env, hass, _boiler_plan("wall_switch"), clock, **BOILER_HEATING)
        live.engine._now = lambda: clock[0]
        await asyncio.gather(*hass.tasks)
        _boiler_event(env, hass, "sensor.grid", "3200", old="500")  # the safety off, ignored by the relay
        await asyncio.gather(*hass.tasks)
        for k in range(1, 7):
            _tick(env, clock, 5000.0 + 10 * k)
            await asyncio.gather(*hass.tasks)
        _tick(env, clock, 5060.0)  # whatever is still due at +60 s
        await asyncio.gather(*hass.tasks)
        assert "switch.relay" in live._expected._records  # the +60 s off has a record
        trace = live.engine.snapshot("p1")["r1"]
        assert trace["status"] == "error" and trace["last"]["error"] == "not confirmed"
        clock[0] = 5067.0
        _boiler_event(env, hass, "switch.relay", "off", old="on")  # confirmed 7 s late, without the context
        assert _press(live, "btn") is None
        assert live.engine.snapshot("p1")["r1"]["boiler"]["mode"] == "auto"
        assert live.engine.snapshot("p1")["r1"]["status"] == "ok"

    asyncio.run(go())


def test_the_expiry_warning_comes_once_per_episode(env, caplog):
    """Round 5 J2: identical repeats of a lost command warn at their first expiry only; another command or the
    entity reaching a state starts a new episode."""
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        live.engine.still_wants = lambda *a: False
        async def send(do, at, by=("p1", "x")):
            clock[0] = at
            live._call("switch", do, "switch.sock", on_error=lambda *a: None, by=by)
            await asyncio.gather(*hass.tasks)

        def warned():
            return [r for r in caplog.records if "did not confirm" in r.getMessage() and r.levelname == "WARNING"]

        def noted():
            return [r for r in caplog.records if "did not confirm" in r.getMessage() and r.levelname == "DEBUG"]

        with caplog.at_level("DEBUG"):
            await send("turn_on", 0.0)
            _tick(env, clock, 10.0)
            _tick(env, clock, 60.0)
            assert len(warned()) == 1
            await send("turn_on", 70.0)  # the same command again, still lost: the same episode
            _tick(env, clock, 80.0)
            _tick(env, clock, 130.0)
            assert len(warned()) == 1 and len(noted()) == 1
            await send("turn_on", 140.0, by=("p1", "y"))  # another command (another sender): a new episode
            _tick(env, clock, 150.0)
            _tick(env, clock, 200.0)
            assert len(warned()) == 2
            clock[0] = 205.0
            _boiler_event(env, hass, "switch.sock", "unavailable", old="off")
            _boiler_event(env, hass, "switch.sock", "off", old="unavailable")  # it reached a state: a new episode
            await send("turn_on", 210.0, by=("p1", "y"))  # the same command again
            _tick(env, clock, 220.0)
            _tick(env, clock, 270.0)
            assert len(warned()) == 3 and len(noted()) == 1

    asyncio.run(go())


def test_a_failing_still_wants_is_logged_and_the_other_records_go_on(env, caplog):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        live._call("switch", "turn_on", "switch.a", on_error=lambda *a: None, by=("p1", "r1"))
        live._call("switch", "turn_on", "switch.b", on_error=lambda *a: None, by=("p1", "r1"))
        hass.states.d.update({"switch.a": "off", "switch.b": "off"})
        await asyncio.gather(*hass.tasks)

        def boom(by, eid, state):
            if eid == "switch.a":
                raise RuntimeError("bug")
            return True

        live.engine.still_wants = boom
        with caplog.at_level("ERROR"):
            _tick(env, clock, 10.0)
        await asyncio.gather(*hass.tasks)
        assert [c[2]["entity_id"] for c in hass.services.calls] == ["switch.a", "switch.b", "switch.b"]
        assert "bug" in caplog.text
        assert [t for t in env.later if t["on"]]  # re-armed for the expiries

    asyncio.run(go())


def test_stop_leaves_no_expected_state_timer(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _xstart(env, hass, _ws_plan(), clock, **WS_OFF)
        _boiler_event(env, hass, "binary_sensor.leak", "on", old="off")
        await asyncio.gather(*hass.tasks)
        assert [t for t in env.later if t["on"]]
        await live.async_stop()
        assert not [t for t in env.later if t["on"]]

    asyncio.run(go())


# --- virtual switches (kept by the integration, never Home Assistant entities) -----------------------------------------

VIRTUAL_KEY = "plan_studio.virtual"


def _vplan(sleep=True):
    """A smart button toggles the virtual switch Sleep (Load control); a wet leak sensor switches a socket on only while
    Sleep is on (the gate)."""
    def dev(i, kind, bindings):
        return {"id": i, "name": i, "props": {"kind": kind}, "bindings": bindings}

    devices = [dev("btn", "smart_button", {"action": "sensor.act"}),
               dev("leak", "leak_sensor", {"leak": "binary_sensor.leak"}),
               dev("sw", "socket", {"control": "switch.sock"})]
    if sleep:
        devices.append(dev("sleep", "virtual_switch", {"control": "virtual.sleep"}))
    return {
        "id": "p1",
        "levels": [{"devices": devices}],
        "rules": [
            {"id": "lc", "name": "Sleep button", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
             "inputs": [], "onTrue": [], "onFalse": [],
             "control": {"sources": [{"button": "btn"}], "on": [], "off": [],
                         "toggle": [{"device": "sleep", "do": "toggle"}]}},
            {"id": "r1", "name": "R", "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
             "inputs": [{"source": {"device": "leak"}}], "gate": {"source": {"device": "sleep"}},
             "onTrue": [{"device": "sw", "do": "on"}], "onFalse": []},
        ],
    }


async def _vstart(env, hass, stored=None, clock=None, plan=None):
    if stored is not None:
        FakeStore.contents[VIRTUAL_KEY] = stored
    hass.services.known |= {("switch", "turn_on"), ("switch", "turn_off")}
    hass.states.d.update({"binary_sensor.leak": "on", "switch.sock": "off", "sensor.act": ""})
    live = env.live.LiveRuntime(hass, FakePlans([plan or _vplan()]))
    if clock is not None:
        live._now = lambda: clock[0]
    await live.async_start()
    return live


def _vsaves():
    return [s for s in FakeStore.saved if s[0] == VIRTUAL_KEY]


def _spy_engine(live):
    seen = []
    orig = live.engine.handle_state
    live.engine.handle_state = lambda eid, own=False: (seen.append((eid, own)), orig(eid, own=own))[1]
    return seen


def test_a_virtual_switch_is_answered_by_the_runtime_and_never_tracked_through_ha(env):
    async def go():
        hass = FakeHass()
        live = await _vstart(env, hass)
        assert live._lookup("virtual.sleep") == ("off", {})  # default off
        assert live._lookup("virtual.nope") is None
        assert "virtual.sleep" in live.engine.entity_ids()  # the gate reads it, the load control rule switches it
        for entry in (env.tracked[-1], env.reported[-1]):
            assert entry["ids"] and not [e for e in entry["ids"] if e.startswith("virtual.")]
        await asyncio.gather(*hass.tasks)
        assert hass.services.calls == []  # wet, but Sleep is off: the gate is closed

    asyncio.run(go())


def test_a_load_control_toggle_switches_the_virtual_switch_at_once_as_an_own_change_without_ha(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _vstart(env, hass, clock=clock)
        seen = _spy_engine(live)
        live.engine.on_intent("p1", "btn", {"action": "toggle"})
        assert hass.services.calls == [] and seen == []  # a task: the change cannot re-enter the firing
        await asyncio.gather(*hass.tasks)
        assert live._lookup("virtual.sleep") == ("on", {}) and live.virtual.state("virtual.sleep") == "on"
        assert ("virtual.sleep", True) in seen  # the engine got the change as Plan Studio's own
        assert "virtual.sleep" not in live._expected._records  # confirmed at once: no retry, no expiry
        assert live.readings.stats("virtual.sleep")["count"] == 1  # fed like a report
        assert _vsaves()[-1] == (VIRTUAL_KEY, {"p1": {"sleep": "on"}})
        lc = live.engine.snapshot("p1")["lc"]
        assert lc["status"] == "ok" and lc["last"]["action"] == "on" and "error" not in lc["last"]
        # the gate opened: the condition rule applies its verdict (the socket is a real HA entity)
        await asyncio.gather(*hass.tasks)
        assert [c[:3] for c in hass.services.calls] == [("switch", "turn_on", {"entity_id": "switch.sock"})]
        assert not [c for c in hass.services.calls if c[0] == "virtual"]
        _tick(env, clock, 10.0)
        _tick(env, clock, 60.0)
        await asyncio.gather(*hass.tasks)
        assert live.engine.snapshot("p1")["lc"]["status"] == "ok"  # never "not confirmed"
        live.reload()  # a plan save keeps the state of a virtual switch still in the plan
        assert live.virtual.state("virtual.sleep") == "on"
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # toggles back off
        await asyncio.gather(*hass.tasks)
        assert live.virtual.state("virtual.sleep") == "off" and _vsaves()[-1] == (VIRTUAL_KEY, {"p1": {"sleep": "off"}})
        assert ("virtual.sleep", True) in seen[1:]

    asyncio.run(go())


def test_a_gate_on_the_virtual_switch_opens_and_closes_a_holder_slot_of_a_light(env):
    async def go():
        hass = FakeHass()
        plan = _vplan()
        plan["levels"][0]["devices"].append(
            {"id": "lamp", "name": "lamp", "props": {"kind": "ceiling_light"}, "bindings": {"control": "light.k"}})
        plan["rules"][1].update({"onTrue": [{"device": "lamp", "do": "on"}], "onFalse": [{"device": "lamp", "do": "off"}]})
        hass.services.known |= {("light", "turn_on"), ("light", "turn_off")}
        hass.states.d["light.k"] = "off"
        live = await _vstart(env, hass, plan=plan)
        await asyncio.gather(*hass.tasks)
        assert hass.services.calls == [] and "holders" not in live.engine.snapshot("p1")["r1"]
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # Sleep on: the gate opens, the wet rule holds the lamp
        await asyncio.gather(*hass.tasks)
        await asyncio.gather(*hass.tasks)
        assert [c[:3] for c in hass.services.calls] == [("light", "turn_on", {"entity_id": "light.k"})]
        assert live.engine.snapshot("p1")["r1"]["holders"] == ["R"]
        _boiler_event(env, hass, "light.k", "on", old="off")
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # Sleep off: the gate closes, the hold is released
        await asyncio.gather(*hass.tasks)
        await asyncio.gather(*hass.tasks)
        assert live.virtual.state("virtual.sleep") == "off" and "holders" not in live.engine.snapshot("p1")["r1"]
        assert len(hass.services.calls) == 1  # a closed gate sends nothing

    asyncio.run(go())


def test_a_turn_on_to_a_virtual_switch_already_on_changes_nothing_and_leaves_no_record(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _vstart(env, hass, stored={"p1": {"sleep": "on"}}, clock=clock)
        await asyncio.gather(*hass.tasks)
        seen, n = _spy_engine(live), len(_vsaves())
        errors = []
        assert live._call("virtual", "turn_on", "virtual.sleep", errors.append) is False
        await asyncio.gather(*hass.tasks)
        assert seen == [] and errors == [] and len(_vsaves()) == n and "virtual.sleep" not in live._expected._records
        live._call("virtual", "toggle", "virtual.sleep", errors.append)  # a toggle service is resolved here
        await asyncio.gather(*hass.tasks)
        assert live.virtual.state("virtual.sleep") == "off" and ("virtual.sleep", True) in seen
        with pytest.raises(RuntimeError):
            live._call("virtual", "open_valve", "virtual.sleep", errors.append)
        assert not [c for c in hass.services.calls if c[0] == "virtual"]

    asyncio.run(go())


def test_a_virtual_command_to_a_device_removed_before_it_applies_leaves_no_record(env):
    async def go():
        hass = FakeHass()
        plans = FakePlans([_vplan()])
        live = env.live.LiveRuntime(hass, plans)
        await live.async_start()
        live._call("virtual", "turn_on", "virtual.sleep", lambda *_: None)
        assert "virtual.sleep" in live._expected._records
        plans._plans = [_vplan(sleep=False)]
        live.reload()  # saved without the device before the command's task ran
        await asyncio.gather(*hass.tasks)
        assert live._lookup("virtual.sleep") is None and "virtual.sleep" not in live._expected._records

    asyncio.run(go())


def test_a_virtual_command_before_ha_has_started_is_not_held_for_the_start(env):
    async def go():
        hass = FakeHass()
        live = await _vstart(env, hass)
        hass.state = CoreState.starting
        assert live._call("virtual", "turn_on", "virtual.sleep", lambda *_: None) is False
        await asyncio.gather(*hass.tasks)
        assert live.virtual.state("virtual.sleep") == "on"
        # the gate opened: the socket's call waits for the start; nothing of the virtual switch does
        assert [d[:3] for d in live._deferred] == [("switch", "turn_on", "switch.sock")]

    asyncio.run(go())


def test_the_virtual_state_is_restored_at_start_and_flushed_at_stop(env):
    async def go():
        hass = FakeHass()
        live = await _vstart(env, hass, stored={"p1": {"sleep": "on"}})
        assert live._lookup("virtual.sleep") == ("on", {})
        await asyncio.gather(*hass.tasks)
        # the gate reads the restored state: the condition rule's start verdict is sent
        assert [c[:3] for c in hass.services.calls] == [("switch", "turn_on", {"entity_id": "switch.sock"})]
        live.engine.on_intent("p1", "btn", {"action": "toggle"})
        await asyncio.gather(*hass.tasks)
        await live.async_stop()
        assert (VIRTUAL_KEY, {"p1": {"sleep": "off"}}) in FakeStore.flushed
        live2 = env.live.LiveRuntime(hass, FakePlans([_vplan()]))
        await live2.async_start()
        assert live2._lookup("virtual.sleep") == ("off", {})
        live2.engine.on_intent("p1", "btn", {"action": "toggle"})
        await asyncio.gather(*hass.tasks)
        assert live2.virtual.state("virtual.sleep") == "on"
        live3 = env.live.LiveRuntime(hass, FakePlans([_vplan()]))
        await live2.async_stop()
        await live3.async_start()
        assert live3._lookup("virtual.sleep") == ("on", {})

    asyncio.run(go())


def test_a_virtual_switch_removed_from_the_saved_plan_drops_its_state_at_reload(env):
    async def go():
        hass = FakeHass()
        plans = FakePlans([_vplan()])
        FakeStore.contents[VIRTUAL_KEY] = {"p1": {"sleep": "on", "gone": "on"}, "deleted": {"x": "on"}}
        live = env.live.LiveRuntime(hass, plans)
        await live.async_start()
        assert live.virtual.dump() == {"p1": {"sleep": "on"}} and _vsaves()[-1] == (VIRTUAL_KEY, {"p1": {"sleep": "on"}})
        plans._plans = [_vplan(sleep=False)]
        live.reload()
        assert live._lookup("virtual.sleep") is None and live.virtual.dump() == {}
        assert _vsaves()[-1] == (VIRTUAL_KEY, {})
        n = len(_vsaves())
        live.reload()  # nothing changed: nothing saved
        assert len(_vsaves()) == n

    asyncio.run(go())


def test_a_failure_inside_the_virtual_path_does_not_block_the_ha_state_path(env, caplog):
    async def go():
        hass = FakeHass()
        live = await _vstart(env, hass)
        orig = live.power.handle_state

        def boom(eid):
            if eid.startswith("virtual."):
                raise RuntimeError("bug")
            orig(eid)

        live.power.handle_state = boom
        errors = []
        with caplog.at_level("ERROR"):
            live._call("virtual", "turn_on", "virtual.sleep", errors.append)
            await asyncio.gather(*hass.tasks)
        assert live.virtual.state("virtual.sleep") == "on" and errors == [] and "bug" in caplog.text
        seen = _spy_engine(live)
        _boiler_event(env, hass, "binary_sensor.leak", "off", old="on")  # an HA state change still gets through
        assert seen == [("binary_sensor.leak", False)]

    asyncio.run(go())


def test_virtual_subscribe_sends_result_then_the_states_then_every_change(env):
    async def go():
        hass = FakeHass()
        plans = FakePlans([_vplan()])
        live = env.live.LiveRuntime(hass, plans)
        hass.states.d.update({"binary_sensor.leak": "off", "switch.sock": "off", "sensor.act": ""})
        await live.async_start()
        hass.data["plan_studio"]["live"] = live
        sent, subs = [], {}
        conn = types.SimpleNamespace(
            subscriptions=subs,
            send_result=lambda i, r=None: sent.append(("result", i)),
            send_message=lambda m: sent.append(("msg", m)),
            send_error=lambda i, code, text: sent.append(("error", code)),
        )
        env.ws.ws_virtual_subscribe(hass, conn, {"id": 5, "plan_id": "p1"})
        assert sent[0] == ("result", 5)
        assert sent[1] == ("msg", {"id": 5, "type": "event", "event": {"states": {"sleep": "off"}}})
        live.engine.on_intent("p1", "btn", {"action": "toggle"})
        await asyncio.gather(*hass.tasks)
        assert sent[-1] == ("msg", {"id": 5, "type": "event", "event": {"states": {"sleep": "on"}}})
        plans._plans = [_vplan(sleep=False)]
        live.reload()
        assert sent[-1] == ("msg", {"id": 5, "type": "event", "event": {"states": {}}})
        subs[5]()
        n = len(sent)
        plans._plans = [_vplan()]
        live.reload()
        assert len(sent) == n
        hass.data["plan_studio"].pop("live")
        env.ws.ws_virtual_subscribe(hass, conn, {"id": 6, "plan_id": "p1"})
        assert sent[-1] == ("error", "not_loaded")
        assert "plan_studio/virtual/subscribe" in env.cmds

    asyncio.run(go())


async def _drain(hass, rounds=20):
    """Run the tasks until none is pending; False when they still go on after `rounds` turns (a loop)."""
    for _ in range(rounds):
        pending = [t for t in hass.tasks if not t.done()]
        if not pending:
            return True
        await asyncio.gather(*pending)
    return not [t for t in hass.tasks if not t.done()]


def test_a_two_way_link_between_a_virtual_switch_and_a_light_ends(env):
    async def go():
        hass = FakeHass()
        plan = _vplan()
        plan["levels"][0]["devices"].append(
            {"id": "lamp", "name": "lamp", "props": {"kind": "ceiling_light"}, "bindings": {"control": "light.k"}})

        def control(rid, source, target):
            return {"id": rid, "name": rid, "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
                    "inputs": [], "onTrue": [], "onFalse": [],
                    "control": {"sources": [{"source": {"device": source}}], "on": [{"device": target, "do": "on"}],
                                "off": [{"device": target, "do": "off"}], "toggle": []}}

        plan["rules"] = [plan["rules"][0], control("a", "sleep", "lamp"), control("b", "lamp", "sleep")]
        hass.services.known |= {("light", "turn_on"), ("light", "turn_off")}
        hass.states.d["light.k"] = "off"
        live = await _vstart(env, hass, plan=plan)
        assert await _drain(hass)
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # Sleep on (load control): the lamp follows
        assert await _drain(hass)
        assert live.virtual.state("virtual.sleep") == "on"
        assert [c[:3] for c in hass.services.calls] == [("light", "turn_on", {"entity_id": "light.k"})]
        _boiler_event(env, hass, "light.k", "on", ctx=hass.services.calls[-1][4], old="off")  # the lamp confirms
        assert await _drain(hass)
        assert live.virtual.state("virtual.sleep") == "on" and len(hass.services.calls) == 1  # a real echo: b is quiet
        _boiler_event(env, hass, "light.k", "off", old="on")  # a person: Sleep follows, the lamp is not switched again
        assert await _drain(hass)
        assert live.virtual.state("virtual.sleep") == "off" and len(hass.services.calls) == 1
        assert live.engine.snapshot("p1")["a"]["last"]["sent"] is False  # the lamp already read off

    asyncio.run(go())


def test_a_due_record_of_a_virtual_switch_reads_its_state_from_the_runtime(env):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _vstart(env, hass, stored={"p1": {"sleep": "on"}}, clock=clock)
        await asyncio.gather(*hass.tasks)
        live._expected.sent("virtual.sleep", "on", 0.0, None)  # a record left behind while it reads on already
        live._arm()
        _tick(env, clock, 10.0)
        assert "virtual.sleep" not in live._expected._records  # confirmed silently: never "not confirmed"

    asyncio.run(go())


LOOP_LOG = "changes too fast: a rule loop; changes refused for 10 s"


def _loop_plan(rules):
    """_vplan's button rule (toggle Sleep) plus the given rules, and a second virtual switch v2."""
    p = _vplan()
    p["levels"][0]["devices"].append(
        {"id": "v2", "name": "v2", "props": {"kind": "virtual_switch"}, "bindings": {"control": "virtual.v2"}})
    p["rules"] = [p["rules"][0]] + rules
    return p


def _lc(rid, source, target, dos):
    """A load control rule: the source's on / off events switch the target to dos[0] / dos[1]."""
    return {"id": rid, "name": rid, "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
            "inputs": [], "onTrue": [], "onFalse": [],
            "control": {"sources": [{"source": {"device": source}}], "on": [{"device": target, "do": dos[0]}],
                        "off": [{"device": target, "do": dos[1]}], "toggle": []}}


def _cond(rid, source, target, dos):
    """A condition rule: true / false switch the target to dos[0] / dos[1]."""
    return {"id": rid, "name": rid, "zoneId": None, "combine": "any", "onDelay": 0, "offDelay": 0,
            "inputs": [{"source": {"device": source}}], "onTrue": [{"device": target, "do": dos[0]}],
            "onFalse": [{"device": target, "do": dos[1]}]}


def test_a_load_control_loop_over_two_virtual_switches_stops_and_the_switch_works_again_after_10_s(env, caplog):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _vstart(env, hass, clock=clock, plan=_loop_plan(
            [_lc("a", "sleep", "v2", ("on", "off")), _lc("b", "v2", "sleep", ("off", "on"))]))
        assert await _drain(hass)
        frames = []
        live.virtual.subscribe("p1", lambda f: frames.append(f["states"]))
        with caplog.at_level("ERROR"):
            live.engine.on_intent("p1", "btn", {"action": "toggle"})
            assert await _drain(hass)  # the loop stopped
        assert len(frames) == 10  # five changes of each switch; Sleep's sixth within 1 s is refused
        assert caplog.text.count(LOOP_LOG) == 1 and "virtual.sleep " + LOOP_LOG in caplog.text
        b = live.engine.snapshot("p1")["b"]
        assert b["status"] == "error" and b["reason"] == "virtual switch loop"
        assert b["last"]["error"] == "virtual switch loop"
        assert "virtual.sleep" not in live._expected._records  # nothing retries the refused change
        state = live.virtual.state("virtual.sleep")
        live.engine.on_intent("p1", "btn", {"action": "toggle"})  # still refused within the 10 s
        assert await _drain(hass)
        assert live.virtual.state("virtual.sleep") == state and len(frames) == 10
        assert live.engine.snapshot("p1")["lc"]["reason"] == "virtual switch loop"
        clock[0] = 10.0
        with caplog.at_level("ERROR"):
            live.engine.on_intent("p1", "btn", {"action": "toggle"})  # accepted again; still a loop: trips again
            assert await _drain(hass)
        assert frames[10]["sleep"] != state  # the first change after the 10 s was applied
        assert caplog.text.count(LOOP_LOG) == 2  # one log per episode

    asyncio.run(go())


def test_a_condition_rule_loop_over_two_virtual_switches_stops(env, caplog):
    async def go():
        hass, clock = FakeHass(), [0.0]
        with caplog.at_level("ERROR"):
            live = await _vstart(env, hass, clock=clock, plan=_loop_plan(
                [_cond("x", "sleep", "v2", ("on", "off")), _cond("y", "v2", "sleep", ("off", "on"))]))
            assert await _drain(hass)
        assert caplog.text.count(LOOP_LOG) == 1
        reasons = {rid: live.engine.snapshot("p1")[rid].get("reason") for rid in ("x", "y")}
        assert "virtual switch loop" in reasons.values()

    asyncio.run(go())


def test_normal_use_of_a_virtual_switch_never_trips_the_loop_breaker(env, caplog):
    async def go():
        hass, clock = FakeHass(), [0.0]
        live = await _vstart(env, hass, clock=clock)
        assert await _drain(hass)
        with caplog.at_level("ERROR"):
            live.engine.on_intent("p1", "btn", {"action": "toggle"})
            live.engine.on_intent("p1", "btn", {"action": "toggle"})  # a double press in one turn
            assert await _drain(hass)
            assert live.virtual.state("virtual.sleep") == "off"
            for _ in range(3):  # five changes within the same second: still normal use
                live.engine.on_intent("p1", "btn", {"action": "toggle"})
                assert await _drain(hass)
        assert live.virtual.state("virtual.sleep") == "on" and LOOP_LOG not in caplog.text
        assert live.engine.snapshot("p1")["lc"]["status"] == "ok"

    asyncio.run(go())
