"""Tests for the power schematic evaluator (no homeassistant needed)."""

import pytest

from power import POSITIONS, block_ports, device_bindings, entity_ids, evaluate

W = {"unit_of_measurement": "W"}


def reading(v):
    return v if isinstance(v, tuple) else (str(v), W)


def blk(bid, kind, **props):
    return {"id": bid, "kind": kind, "x": 0, "y": 0, **props}


def bus(bid):
    return blk(bid, "bus", w=200, h=8)


def dev(bid, inverter=False):
    b = blk(bid, "device", deviceId=bid)
    if inverter:
        b["inverter"] = True
    return b


def end(spec):
    """'block.PORT' is a block port; a bare id is a point on that bus."""
    if "." in spec:
        block, port = spec.split(".")
        return {"block": block, "port": port}
    return {"bus": spec, "at": 0.5}


def wire(wid, src, dst):
    return {"id": wid, "from": end(src), "to": end(dst)}


def live(power):
    return {"power": power, "state": "live"}


def dead(power=0.0):
    return {"power": power, "state": "dead"}


class Scheme:
    """A schematic, its device bindings and a dict-backed world."""

    def __init__(self, blocks, wires, devices, states):
        self.schema = {"blocks": blocks, "wires": wires}
        self.devices = devices
        self.states = {k: reading(v) for k, v in states.items()}

    def block(self, bid):
        return next(b for b in self.schema["blocks"] if b["id"] == bid)

    def run(self, **positions):
        return evaluate(self.schema, self.devices, self.states.get, positions)


OWNER_STATES = {"grid": 1000, "b1": 100, "b1_soc": 62, "pv": 50, "rcbo": 900, "pc": 250}


def owner_chain(**states):
    """The owner's sketch; a state value None removes that entity."""
    blocks = [
        blk("g", "grid", power="sensor.grid"),
        bus("main"),
        dev("inv", inverter=True),
        bus("batbus"),
        blk("b1", "battery", power="sensor.b1", soc="sensor.b1_soc"),
        blk("p1", "pv", power="sensor.pv"),
        blk("rcbo", "meter", power="sensor.rcbo"),
        blk("ts", "transfer", form="2in1out"),
        bus("apt"),
        dev("pc"),
        blk("rem", "remainder"),
    ]
    wires = [
        wire("g_main", "g.OUT", "main"),
        wire("main_inv", "main", "inv.IN"),
        wire("inv_bat", "inv.BAT", "batbus"),
        wire("bat_b1", "batbus", "b1.BAT"),
        wire("pv_inv", "p1.OUT", "inv.PV"),
        wire("inv_rcbo", "inv.OUT", "rcbo.IN"),
        wire("rcbo_ts", "rcbo.OUT", "ts.A"),
        wire("main_ts", "main", "ts.B"),
        wire("ts_apt", "ts.OUT", "apt"),
        wire("apt_pc", "apt", "pc.IN"),
        wire("apt_rem", "apt", "rem.IN"),
    ]
    merged = {**OWNER_STATES, **states}
    world = {f"sensor.{k}": v for k, v in merged.items() if v is not None}
    return Scheme(blocks, wires, {"inv": {}, "pc": {"power": "sensor.pc"}}, world)


def test_block_ports_per_kind():
    assert POSITIONS == ("A", "0", "B")
    assert block_ports({"kind": "transfer", "form": "1in2out"}) == {"IN": "in", "A": "out", "B": "out"}
    assert block_ports({"kind": "transfer", "form": "2in1out"}) == {"A": "in", "B": "in", "OUT": "out"}
    assert block_ports({"kind": "transfer", "form": "3in1out"}) == {}
    assert block_ports({"kind": "device"}) == {"IN": "in", "OUT": "out"}
    assert block_ports({"kind": "device", "inverter": True}) == {"IN": "in", "OUT": "out", "PV": "in", "BAT": "out"}
    assert block_ports({"kind": "grid"}) == {"OUT": "out"}
    assert block_ports({"kind": "meter"}) == {"IN": "in", "OUT": "out"}
    assert block_ports({"kind": "battery"}) == {"BAT": "in"}
    assert block_ports({"kind": "pv"}) == {"OUT": "out"}
    assert block_ports({"kind": "remainder"}) == {"IN": "in"}
    assert block_ports({"kind": "bus", "w": 10, "h": 2}) == {}
    assert block_ports({"kind": "toaster"}) == {}
    assert block_ports({"kind": ["grid"]}) == {}


def test_owner_chain_at_A():
    f = owner_chain().run()
    assert f["wires"] == {
        "g_main": live(1000.0),
        "main_inv": live(1000.0),
        "inv_bat": live(100.0),
        "bat_b1": live(100.0),
        "pv_inv": live(50.0),
        "inv_rcbo": live(900.0),
        "rcbo_ts": live(900.0),
        "main_ts": live(0.0),
        "ts_apt": live(900.0),
        "apt_pc": live(250.0),
        "apt_rem": live(650.0),
    }
    b = f["blocks"]
    assert b["rem"] == {"power": 650.0}
    assert b["inv"] == {"loss": 50.0}  # 1000 + 50 - 900 - 100
    assert b["b1"] == {"power": 100.0, "soc": 62.0}
    assert b["ts"] == {"position": "A"}
    assert b["g"] == {"power": 1000.0}
    assert b["rcbo"] == {"power": 900.0}
    assert b["p1"] == {"power": 50.0}
    assert b["pc"] == {"power": 250.0}
    assert "main" not in b and "apt" not in b and "batbus" not in b


def test_owner_chain_at_B():
    f = owner_chain().run(ts="B")
    w = f["wires"]
    assert w["inv_rcbo"] == live(900.0)
    assert w["rcbo_ts"] == live(0.0)  # the unselected side is a structural zero, before the meter
    assert f["blocks"]["rcbo"] == {"power": 900.0}
    assert f["blocks"]["ts"] == {"position": "B"}
    # two unknowns on main (inv IN, ts B) and two on apt (ts OUT, rem)
    assert f["blocks"]["rem"] == {"power": None}
    assert w["main_ts"] == live(None)
    assert w["ts_apt"] == live(None)


def test_position_0_kills_output():
    f = owner_chain().run(ts="0")
    w = f["wires"]
    assert w["ts_apt"] == dead()
    assert w["apt_pc"] == dead()
    assert w["apt_rem"] == dead()
    assert w["main_ts"] == live(0.0)
    assert f["blocks"]["pc"] == {"power": 250.0}  # its own reading
    assert f["blocks"]["ts"] == {"position": "0"}


def test_meter_switch_off_kills_downstream():
    c = owner_chain()
    c.block("rcbo")["switch"] = {"entity": "switch.rcbo", "controllable": False}
    c.states["switch.rcbo"] = ("off", {})
    f = c.run(ts="A")
    assert f["wires"]["inv_rcbo"] == live(900.0)
    assert f["wires"]["rcbo_ts"] == dead()
    assert f["wires"]["ts_apt"] == dead()
    assert f["blocks"]["rcbo"] == {"power": 900.0, "switch": "off"}


def test_switch_unknown_conducts():
    c = owner_chain()
    c.block("rcbo")["switch"] = {"entity": "switch.rcbo", "controllable": False}
    c.states["switch.rcbo"] = ("unavailable", {})
    f = c.run()
    assert all(w["state"] == "live" for w in f["wires"].values())
    assert f["wires"]["ts_apt"] == live(900.0)
    assert f["blocks"]["rcbo"]["switch"] == "unknown"


def test_kw_converted():
    f = owner_chain(grid=("1.2", {"unit_of_measurement": "kW"})).run()
    assert f["wires"]["g_main"] == live(1200.0)
    assert f["blocks"]["g"] == {"power": 1200.0}


@pytest.mark.parametrize("state", ["unavailable", "unknown", "abc", "nan", "inf", None])
def test_unavailable_reading_is_none(state):
    f = owner_chain(grid=state).run()
    assert f["wires"]["g_main"] == live(None)
    assert f["blocks"]["g"] == {"power": None}


def tap_scheme(tap, feed=1000):
    return Scheme(
        [blk("g", "grid", power="sensor.grid"), bus("m"), dev("load"), blk("rem", "remainder")],
        [wire("g_m", "g.OUT", "m"), wire("m_load", "m", "load.IN"), wire("m_rem", "m", "rem.IN")],
        {"load": {"power": "sensor.load"}},
        {"sensor.grid": feed, "sensor.load": tap},
    )


def test_remainder_tolerance():
    f = tap_scheme(1020).run()  # -20 within max(10, 30)
    assert f["blocks"]["rem"] == {"power": 0.0}
    assert f["wires"]["m_rem"] == live(0.0)
    f = tap_scheme(1100).run()  # -100 beyond 30
    assert f["blocks"]["rem"] == {"power": None, "hint": "disagree"}
    assert f["wires"]["m_rem"] == live(None)
    assert tap_scheme(109, feed=100).run()["blocks"]["rem"] == {"power": 0.0}  # the 10 W floor
    assert tap_scheme(111, feed=100).run()["blocks"]["rem"] == {"power": None, "hint": "disagree"}
    assert tap_scheme(250).run()["blocks"]["rem"] == {"power": 750.0}


def test_negative_grid_export():
    f = owner_chain(grid=-500).run()
    assert f["wires"]["g_main"] == live(-500.0)


@pytest.mark.parametrize(
    "storage, control, expected",
    [("battery", None, live(None)), ("pv", None, live(None)), (None, None, dead()), ("battery", "off", dead())],
)
def test_inverter_with_storage_is_a_source(storage, control, expected):
    blocks = [blk("g", "grid", power="sensor.grid"), dev("inv", inverter=True), dev("load")]
    wires = [wire("inv_load", "inv.OUT", "load.IN")]
    if storage == "battery":
        blocks.append(blk("b1", "battery", power="sensor.b1", soc="sensor.b1_soc"))
        wires.append(wire("inv_b1", "inv.BAT", "b1.BAT"))
    elif storage == "pv":
        blocks.append(blk("p1", "pv", power="sensor.pv"))
        wires.append(wire("p1_inv", "p1.OUT", "inv.PV"))
    devices = {"inv": {}, "load": {}}
    states = {"sensor.grid": 0}
    if control:
        devices["inv"] = {"control": "switch.inv"}
        states["switch.inv"] = (control, {})
    f = Scheme(blocks, wires, devices, states).run()
    assert f["wires"]["inv_load"] == expected


def test_two_inverters_on_one_supply():
    blocks = [blk("g", "grid", power="sensor.grid"), bus("main")]
    wires = [wire("g_main", "g.OUT", "main")]
    devices = {}
    for n in ("1", "2"):
        blocks += [blk(f"m{n}", "meter", power=f"sensor.m{n}"), dev(f"inv{n}", inverter=True), bus(f"x{n}")]
        blocks += [dev(f"load{n}"), blk(f"rem{n}", "remainder")]
        wires += [
            wire(f"main_m{n}", "main", f"m{n}.IN"),
            wire(f"m{n}_inv{n}", f"m{n}.OUT", f"inv{n}.IN"),
            wire(f"inv{n}_x{n}", f"inv{n}.OUT", f"x{n}"),
            wire(f"x{n}_load{n}", f"x{n}", f"load{n}.IN"),
            wire(f"x{n}_rem{n}", f"x{n}", f"rem{n}.IN"),
        ]
        devices[f"inv{n}"] = {"power": f"sensor.inv{n}"}
        devices[f"load{n}"] = {"power": f"sensor.load{n}"}
    states = {
        "sensor.grid": 1000,
        "sensor.m1": 600, "sensor.inv1": 580, "sensor.load1": 300,
        "sensor.m2": 400, "sensor.inv2": 390, "sensor.load2": 100,
    }
    f = Scheme(blocks, wires, devices, states).run()
    assert f["wires"]["inv1_x1"] == live(580.0)
    assert f["wires"]["inv2_x2"] == live(390.0)
    assert f["blocks"]["rem1"] == {"power": 280.0}
    assert f["blocks"]["rem2"] == {"power": 290.0}
    assert f["blocks"]["inv1"] == {"power": 580.0, "loss": 20.0}
    assert f["blocks"]["inv2"] == {"power": 390.0, "loss": 10.0}


def test_through_device_binding():
    s = Scheme(
        [blk("g", "grid"), dev("sock"), blk("rem", "remainder")],
        [wire("g_sock", "g.OUT", "sock.IN"), wire("sock_rem", "sock.OUT", "rem.IN")],
        {"sock": {"power": "sensor.sock"}},
        {"sensor.sock": 300},
    )
    f = s.run()
    assert f["wires"]["g_sock"] == live(300.0)
    assert f["wires"]["sock_rem"] == live(300.0)
    assert f["blocks"]["sock"] == {"power": 300.0}
    assert f["blocks"]["rem"] == {"power": 300.0}
    assert f["blocks"]["g"] == {}


def test_inverter_binding_fills_in_then_out():
    devices = {"inv": {"power": "sensor.inv"}, "load": {}}
    s = Scheme(
        [blk("g", "grid"), dev("inv", inverter=True), dev("load")],
        [wire("g_inv", "g.OUT", "inv.IN"), wire("inv_load", "inv.OUT", "load.IN")],
        devices,
        {"sensor.inv": 700},
    )
    f = s.run()
    assert f["wires"]["g_inv"] == live(700.0)
    assert f["wires"]["inv_load"] == live(None)
    assert f["blocks"]["inv"] == {"power": 700.0, "loss": None}

    s = Scheme(
        [blk("g", "grid", power="sensor.grid"), bus("main"), dev("inv", inverter=True), dev("load")],
        [wire("g_main", "g.OUT", "main"), wire("main_inv", "main", "inv.IN"), wire("inv_load", "inv.OUT", "load.IN")],
        devices,
        {"sensor.grid": 1000, "sensor.inv": 700},
    )
    f = s.run()
    assert f["wires"]["main_inv"] == live(1000.0)
    assert f["wires"]["inv_load"] == live(700.0)
    assert f["blocks"]["inv"] == {"power": 700.0, "loss": 300.0}


def test_seed_precedence_follows_kind_not_block_order():
    blocks = [dev("d"), blk("m", "meter", power="sensor.m"), blk("g", "grid", power="sensor.grid")]
    for order in (blocks, blocks[::-1]):
        s = Scheme(
            order,
            [wire("g_m", "g.OUT", "m.IN"), wire("m_d", "m.OUT", "d.IN")],
            {"d": {"power": "sensor.d"}},
            {"sensor.grid": 1000, "sensor.m": 990, "sensor.d": 970},
        )
        f = s.run()
        assert f["wires"]["g_m"] == live(1000.0)
        assert f["wires"]["m_d"] == live(990.0)


def test_missing_device():
    s = Scheme(
        [blk("g", "grid", power="sensor.grid"), blk("ghost", "device", deviceId="gone"), blk("rem", "remainder")],
        [wire("g_ghost", "g.OUT", "ghost.IN"), wire("ghost_rem", "ghost.OUT", "rem.IN")],
        {},
        {"sensor.grid": 1000},
    )
    f = s.run()
    assert f["blocks"]["ghost"] == {"missing": True}
    assert f["wires"]["g_ghost"] == live(1000.0)
    assert f["wires"]["ghost_rem"] == live(None)


def test_malformed_schema_is_ignored():
    blocks = [
        blk("g", "grid", power="sensor.grid"),
        bus("main"),
        blk("x", "toaster"),
        blk("k", ["grid"]),
        blk("m", "meter", power="sensor.m"),
        blk("r", "remainder"),
        blk("t", "transfer", form="3in1out"),
        "junk",
        {"kind": "grid"},
    ]
    wires = [
        wire("ok", "g.OUT", "main"),
        wire("to_missing", "main", "nope.IN"),
        {"id": "at_big", "from": {"block": "m", "port": "OUT"}, "to": {"bus": "main", "at": 1.5}},
        {"id": "at_bool", "from": {"block": "m", "port": "OUT"}, "to": {"bus": "main", "at": True}},
        wire("in_in", "r.IN", "m.IN"),
        wire("to_toaster", "main", "x.IN"),
        wire("to_k", "main", "k.IN"),
        wire("self", "main", "main"),
        wire("no_port", "main", "m.SIDE"),
        wire("to_transfer", "main", "t.A"),
        {"id": "no_ends"},
        {"id": "bad_ends", "from": "g.OUT", "to": None},
        {"id": 7, "from": end("g.OUT"), "to": end("main")},
        "junk",
    ]
    states = {"sensor.grid": ("1000", W), "sensor.m": ("5", "not a dict")}
    f = evaluate({"blocks": blocks, "wires": wires}, {"x": {}}, states.get, {"t": ["A"]})
    w = f["wires"]
    assert w["ok"] == live(1000.0)
    bad = ["to_missing", "at_big", "at_bool", "in_in", "to_toaster", "to_k", "self", "no_port", "to_transfer"]
    for wid in bad + ["no_ends", "bad_ends"]:
        assert w[wid] == {"power": None, "state": "dead"}, wid
    assert set(w) == {"ok", *bad, "no_ends", "bad_ends"}
    assert f["blocks"]["t"] == {"position": "A"}
    assert f["blocks"]["m"] == {"power": 5.0}

    f = evaluate({"blocks": None, "wires": [wire("ok", "g.OUT", "main")]}, {}, {}.get, {})
    assert f == {"wires": {"ok": {"power": None, "state": "dead"}}, "blocks": {}}
    assert evaluate(None, {}, {}.get, None) == {"wires": {}, "blocks": {}}


def test_entity_ids_and_device_bindings():
    c = owner_chain()
    c.block("rcbo")["switch"] = {"entity": "switch.rcbo", "controllable": True}
    devices = {**c.devices, "zz": {"power": "sensor.zz"}}  # not in the schematic
    assert entity_ids(c.schema, devices) == {
        "sensor.grid", "sensor.b1", "sensor.b1_soc", "sensor.pv", "sensor.rcbo", "sensor.pc", "switch.rcbo",
    }
    assert entity_ids({"blocks": None}, {}) == set()

    plan = {
        "levels": [
            {"devices": [
                {"id": "a", "bindings": {"power": "sensor.a", "control": "switch.a", "state": "light.a"}},
                {"id": "b"},
            ]},
            {"devices": [{"id": "c", "bindings": {"control": "switch.c", "power": ""}}, "junk", {"id": 5}]},
            "junk",
        ]
    }
    assert device_bindings(plan) == {
        "a": {"power": "sensor.a", "control": "switch.a"},
        "b": {},
        "c": {"control": "switch.c"},
    }
    assert device_bindings({"levels": None}) == {}
