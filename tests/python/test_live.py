"""Rules inside Home Assistant: LiveRuntime glue and the rules subscription (HA stubbed)."""

import asyncio
import datetime
import importlib
import importlib.util
import math
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
    tracked, later, cmds, started = [], [], {}, []

    def track(hass, ids, cb):
        entry = {"ids": list(ids), "cb": cb, "on": True}
        tracked.append(entry)
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
            "homeassistant.core",
            CALLBACK_TYPE=object, HomeAssistant=object, callback=_mark, Context=Context, CoreState=CoreState,
        ),
        "homeassistant.helpers": _module("homeassistant.helpers"),
        "homeassistant.helpers.event": _module(
            "homeassistant.helpers.event", async_track_state_change_event=track, async_call_later=call_later
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
        live=live_mod, ws=ws_mod, tracked=tracked, later=later, cmds=cmds, started=started
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
        assert len([e for e in env.started if e["on"]]) == 1  # one start listener for all deferred calls
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
