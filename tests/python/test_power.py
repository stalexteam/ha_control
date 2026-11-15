"""Tests for the power schematic evaluator (no homeassistant needed)."""

import pytest

from power import POSITIONS, PowerHub, block_ports, device_bindings, entity_ids, evaluate

W = {"unit_of_measurement": "W"}


def reading(v):
    return v if isinstance(v, tuple) else (str(v), W)


def blk(bid, kind, **props):
    return {"id": bid, "kind": kind, "x": 0, "y": 0, **props}


def bus(bid):
    return blk(bid, "bus", w=200, h=8)


def dev(bid):
    return blk(bid, "device", deviceId=bid)


def inverter(**roles):
    """The payload entry of an inverter device with these bound roles."""
    return {"inverter": True, "controllable": False, **roles}


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
        dev("inv"),
        bus("batbus"),
        blk("b1", "battery", power="sensor.b1", soc="sensor.b1_soc"),
        blk("p1", "pv", power="sensor.pv"),
        dev("rcbo"),  # the former meter: a through device
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
    devices = {"inv": inverter(), "rcbo": {"power": "sensor.rcbo"}, "pc": {"power": "sensor.pc"}}
    return Scheme(blocks, wires, devices, world)


def test_block_ports_per_kind():
    assert POSITIONS == ("A", "0", "B")
    assert block_ports({"kind": "transfer", "form": "1in2out"}) == {"IN": "in", "A": "out", "B": "out"}
    assert block_ports({"kind": "transfer", "form": "2in1out"}) == {"A": "in", "B": "in", "OUT": "out"}
    assert block_ports({"kind": "transfer", "form": "3in1out"}) == {}
    assert block_ports({"kind": "device"}) == {"IN": "in", "OUT": "out"}
    # the inverter flag comes from the device, never from the block
    inv = {"kind": "device", "deviceId": "i"}
    assert block_ports(inv, {"i": inverter()}) == {"IN": "in", "OUT": "out", "PV": "in", "BAT": "out"}
    assert block_ports({**inv, "inverter": True}) == {"IN": "in", "OUT": "out"}
    assert block_ports({**inv, "inverter": True}, {"i": {"inverter": "yes"}}) == {"IN": "in", "OUT": "out"}
    assert block_ports(inv, {"other": inverter()}) == {"IN": "in", "OUT": "out"}
    assert block_ports({"kind": "grid"}) == {"OUT": "out"}
    assert block_ports({"kind": "meter"}) == {}  # retired: the panel migrates meters into devices
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


def test_through_switch_off_kills_downstream():
    c = owner_chain()
    c.devices["rcbo"]["control"] = "switch.rcbo"
    c.states["switch.rcbo"] = ("off", {})
    f = c.run(ts="A")
    assert f["wires"]["inv_rcbo"] == live(900.0)
    assert f["wires"]["rcbo_ts"] == dead()
    assert f["wires"]["ts_apt"] == dead()
    assert f["blocks"]["rcbo"] == {"power": 900.0, "switch": "off"}


def test_switch_unknown_conducts():
    c = owner_chain()
    c.devices["rcbo"]["control"] = "switch.rcbo"
    c.states["switch.rcbo"] = ("unavailable", {})
    f = c.run()
    assert all(w["state"] == "live" for w in f["wires"].values())
    assert f["wires"]["ts_apt"] == live(900.0)
    assert f["blocks"]["rcbo"]["switch"] == "unknown"


def test_kw_converted():
    f = owner_chain(grid=("1.2", {"unit_of_measurement": "kW"})).run()
    assert f["wires"]["g_main"] == live(1200.0)
    assert f["blocks"]["g"] == {"power": 1200.0}


@pytest.mark.parametrize(
    "unit, value, expected",
    [("W", "500", 500.0), ("kW", "0.5", 500.0), ("MW", "0.0005", 500.0), ("mW", "500000", 500.0), (None, "500", 500.0)],
)
def test_power_units_convert_to_w(unit, value, expected):
    f = owner_chain(grid=(value, {"unit_of_measurement": unit} if unit else {})).run()
    assert f["wires"]["g_main"] == live(expected)
    assert f["blocks"]["g"] == {"power": expected}


@pytest.mark.parametrize("unit", ["VA", "var", "kWh", "A", "V", "w", "KW"])
def test_unknown_power_unit_is_none(unit):
    f = owner_chain(grid=("500", {"unit_of_measurement": unit})).run()
    assert f["wires"]["g_main"] == live(None)
    assert f["blocks"]["g"] == {"power": None}


def test_device_power_unit_converts_or_is_none():
    c = owner_chain()
    c.states["sensor.pc"] = ("0.25", {"unit_of_measurement": "kW"})
    assert c.run()["blocks"]["pc"] == {"power": 250.0}
    c.states["sensor.pc"] = ("250", {"unit_of_measurement": "VA"})
    assert c.run()["blocks"]["pc"] == {"power": None}


@pytest.mark.parametrize(
    "unit, value, expected",
    [("V", "231", 231.0), ("kV", "0.231", 231.0), ("mV", "231000", 231.0), (None, "231", 231.0),
     ("A", "231", None), ("kW", "231", None), ("v", "231", None)],
)
def test_voltage_units_convert_to_v_or_are_none(unit, value, expected):
    c = owner_chain()
    c.block("g")["voltage"] = "sensor.grid_v"
    c.states["sensor.grid_v"] = (value, {"unit_of_measurement": unit} if unit else {})
    assert c.run()["blocks"]["g"] == {"power": 1000.0, "voltage": expected}


def test_soc_keeps_its_value():
    c = owner_chain()
    c.states["sensor.b1_soc"] = ("62", {"unit_of_measurement": "%"})
    assert c.run()["blocks"]["b1"] == {"power": 100.0, "soc": 62.0}


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
    blocks = [blk("g", "grid", power="sensor.grid"), dev("inv"), dev("load")]
    wires = [wire("inv_load", "inv.OUT", "load.IN")]
    if storage == "battery":
        blocks.append(blk("b1", "battery", power="sensor.b1", soc="sensor.b1_soc"))
        wires.append(wire("inv_b1", "inv.BAT", "b1.BAT"))
    elif storage == "pv":
        blocks.append(blk("p1", "pv", power="sensor.pv"))
        wires.append(wire("p1_inv", "p1.OUT", "inv.PV"))
    devices = {"inv": inverter(), "load": {}}
    states = {"sensor.grid": 0}
    if control:
        devices["inv"] = inverter(control="switch.inv")
        states["switch.inv"] = (control, {})
    f = Scheme(blocks, wires, devices, states).run()
    assert f["wires"]["inv_load"] == expected


def test_two_inverters_on_one_supply():
    blocks = [blk("g", "grid", power="sensor.grid"), bus("main")]
    wires = [wire("g_main", "g.OUT", "main")]
    devices = {}
    for n in ("1", "2"):
        blocks += [dev(f"m{n}"), dev(f"inv{n}"), bus(f"x{n}")]
        blocks += [dev(f"load{n}"), blk(f"rem{n}", "remainder")]
        wires += [
            wire(f"main_m{n}", "main", f"m{n}.IN"),
            wire(f"m{n}_inv{n}", f"m{n}.OUT", f"inv{n}.IN"),
            wire(f"inv{n}_x{n}", f"inv{n}.OUT", f"x{n}"),
            wire(f"x{n}_load{n}", f"x{n}", f"load{n}.IN"),
            wire(f"x{n}_rem{n}", f"x{n}", f"rem{n}.IN"),
        ]
        devices[f"m{n}"] = {"power": f"sensor.m{n}"}
        devices[f"inv{n}"] = inverter(power_out=f"sensor.inv{n}")
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
    assert f["blocks"]["inv1"] == {"power_out": 580.0, "loss": 20.0}
    assert f["blocks"]["inv2"] == {"power_out": 390.0, "loss": 10.0}


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


def test_inverter_reads_power_in_and_out_not_power():
    s = Scheme(
        [blk("g", "grid"), dev("inv"), dev("load")],
        [wire("g_inv", "g.OUT", "inv.IN"), wire("inv_load", "inv.OUT", "load.IN")],
        {"inv": inverter(power="sensor.inv"), "load": {}},
        {"sensor.inv": 700, "sensor.inv_in": ("0.7", {"unit_of_measurement": "kW"})},
    )
    f = s.run()  # an inverter's `power` is shown but fills no wire (the v0.7 fallback is gone)
    assert f["wires"]["g_inv"] == live(None)
    assert f["wires"]["inv_load"] == live(None)
    assert f["blocks"]["inv"] == {"power": 700.0, "loss": None}
    s.devices["inv"] = inverter(power_in="sensor.inv_in")
    f = s.run()
    assert f["wires"]["g_inv"] == live(700.0)
    assert f["wires"]["inv_load"] == live(None)
    assert f["blocks"]["inv"] == {"power_in": 700.0, "loss": None}
    assert f["blocks"]["load"] == {}


def test_seed_precedence_follows_kind_not_block_order():
    blocks = [dev("d"), dev("m"), blk("g", "grid", power="sensor.grid")]
    for order in (blocks, blocks[::-1]):
        s = Scheme(
            order,
            [wire("g_m", "g.OUT", "m.IN"), wire("m_d", "m.OUT", "d.IN")],
            {"d": {"power": "sensor.d"}, "m": {"power": "sensor.m"}},
            {"sensor.grid": 1000, "sensor.m": 990, "sensor.d": 970},
        )
        f = s.run()
        assert f["wires"]["g_m"] == live(1000.0)
        assert f["wires"]["m_d"] == live(990.0)


def test_migrated_meter_chain():
    s = Scheme(
        [blk("g", "grid"), dev("a"), dev("b")],
        [wire("g_a", "g.OUT", "a.IN"), wire("a_b", "a.OUT", "b.IN")],
        {"a": {"power": "sensor.a", "control": "switch.a", "inverter": False, "controllable": True},
         "b": {"inverter": False, "controllable": False}},
        {"sensor.a": 900, "switch.a": ("on", {})},
    )
    f = s.run()
    assert f["wires"]["g_a"] == live(900.0)
    assert f["wires"]["a_b"] == f["wires"]["g_a"]
    assert f["blocks"]["a"] == {"power": 900.0, "switch": "on"}
    assert f["blocks"]["b"] == {}


def test_dummy_passes_through():
    """Inverter -> dummy D -> bus -> metered switch R -> load; the bus also feeds a remainder."""
    s = Scheme(
        [blk("g", "grid"), dev("inv"), dev("d"), bus("x"), dev("r"), dev("load"), blk("rem", "remainder")],
        [
            wire("g_inv", "g.OUT", "inv.IN"),
            wire("inv_d", "inv.OUT", "d.IN"),
            wire("d_x", "d.OUT", "x"),
            wire("x_r", "x", "r.IN"),
            wire("r_load", "r.OUT", "load.IN"),
            wire("x_rem", "x", "rem.IN"),
        ],
        {"inv": inverter(power_out="sensor.inv_out"), "d": {}, "r": {"power": "sensor.r", "control": "switch.r"},
         "load": {}},
        {"sensor.inv_out": 500, "sensor.r": 480, "switch.r": ("on", {})},
    )
    f = s.run()
    w = f["wires"]
    assert w["inv_d"] == live(500.0) and w["d_x"] == live(500.0)  # D: in = out
    assert w["x_r"] == live(480.0) and w["r_load"] == live(480.0)  # R: in = out = its power
    assert f["blocks"]["rem"] == {"power": 20.0}
    assert f["blocks"]["d"] == {}


def test_inverter_in_out_and_loss():
    s = Scheme(
        [blk("g", "grid"), dev("inv"), blk("p1", "pv", power="sensor.pv"),
         blk("b1", "battery", power="sensor.b1"), dev("load")],
        [
            wire("g_inv", "g.OUT", "inv.IN"),
            wire("p1_inv", "p1.OUT", "inv.PV"),
            wire("inv_b1", "inv.BAT", "b1.BAT"),
            wire("inv_load", "inv.OUT", "load.IN"),
        ],
        {"inv": inverter(power_in="sensor.in", power_out="sensor.out"), "load": {}},
        {"sensor.in": 1000, "sensor.pv": 200, "sensor.out": 1100, "sensor.b1": 50},
    )
    f = s.run()
    assert f["wires"] == {
        "g_inv": live(1000.0), "p1_inv": live(200.0), "inv_b1": live(50.0), "inv_load": live(1100.0),
    }
    assert f["blocks"]["inv"] == {"power_in": 1000.0, "power_out": 1100.0, "loss": 50.0}  # 1000 + 200 - 1100 - 50


def test_off_switch_de_energizes():
    s = Scheme(
        [blk("g", "grid"), dev("a"), bus("x"), dev("load"), blk("rem", "remainder")],
        [
            wire("g_a", "g.OUT", "a.IN"),
            wire("a_x", "a.OUT", "x"),
            wire("x_load", "x", "load.IN"),
            wire("x_rem", "x", "rem.IN"),
        ],
        {"a": {"control": "switch.a"}, "load": {"power": "sensor.load"}},
        {"switch.a": ("off", {}), "sensor.load": 100},
    )
    f = s.run()
    w = f["wires"]
    assert w["a_x"] == dead() and w["x_load"] == dead() and w["x_rem"] == dead()
    assert w["g_a"] == live(0.0)  # in = out across the open switch
    assert f["blocks"]["a"] == {"switch": "off"}
    assert f["blocks"]["load"] == {"power": 100.0}  # its own reading
    assert f["blocks"]["rem"] == {"power": 0.0}


def test_seed_order_devices():
    """Grid, then through devices, then inverters, then loads; never by block order."""
    chain = [blk("g", "grid", power="sensor.g"), dev("inv"), dev("r"), dev("l")]
    for blocks in (chain, chain[::-1]):
        s = Scheme(
            blocks,
            [wire("g_inv", "g.OUT", "inv.IN"), wire("inv_r", "inv.OUT", "r.IN"), wire("r_l", "r.OUT", "l.IN")],
            {"inv": inverter(power_in="sensor.in", power_out="sensor.out"), "r": {"power": "sensor.r"},
             "l": {"power": "sensor.l"}},
            {"sensor.g": 1000, "sensor.in": 990, "sensor.out": 950, "sensor.r": 900, "sensor.l": 850},
        )
        w = s.run()["wires"]
        assert w["g_inv"] == live(1000.0)  # grid over inverter in
        assert w["inv_r"] == live(900.0)  # through device over inverter out
        assert w["r_l"] == live(900.0)  # through device over load
    short = [blk("g", "grid"), dev("inv"), dev("l")]
    for blocks in (short, short[::-1]):
        s = Scheme(
            blocks,
            [wire("g_inv", "g.OUT", "inv.IN"), wire("inv_l", "inv.OUT", "l.IN")],
            {"inv": inverter(power_out="sensor.out"), "l": {"power": "sensor.l"}},
            {"sensor.out": 950, "sensor.l": 850},
        )
        assert s.run()["wires"]["inv_l"] == live(950.0)  # inverter out over load


def test_device_voltage_shown():
    s = Scheme(
        [blk("g", "grid"), dev("d"), dev("inv")],
        [wire("g_d", "g.OUT", "d.IN")],
        {"d": {"voltage": "sensor.v", "power_in": "sensor.x"}, "inv": inverter(voltage="sensor.v2")},
        {"sensor.v": ("0.231", {"unit_of_measurement": "kV"}), "sensor.v2": ("230", {"unit_of_measurement": "V"}),
         "sensor.x": 5},
    )
    f = s.run()
    assert f["blocks"]["d"] == {"voltage": 231.0}  # power_in is read for an inverter only
    assert f["blocks"]["inv"] == {"voltage": 230.0, "loss": None}
    assert f["wires"]["g_d"] == live(None)  # voltage is not in the balance


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
        dev("m"),
        blk("old", "meter", power="sensor.m"),  # retired kind: not evaluated
        blk("j", "through", power="sensor.m"),  # a seed role is not a block kind
        blk("i", "inverter"),
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
        wire("to_pv", "main", "m.PV"),  # not an inverter: "yes" is not True
        wire("to_old", "main", "old.IN"),
        wire("to_j", "main", "j.IN"),
        wire("to_transfer", "main", "t.A"),
        {"id": "no_ends"},
        {"id": "bad_ends", "from": "g.OUT", "to": None},
        {"id": 7, "from": end("g.OUT"), "to": end("main")},
        "junk",
    ]
    states = {"sensor.grid": ("1000", W), "sensor.m": ("5", "not a dict")}
    devices = {"x": {}, "m": {"power": "sensor.m", "inverter": "yes", "control": 5}}
    f = evaluate({"blocks": blocks, "wires": wires}, devices, states.get, {"t": ["A"]})
    w = f["wires"]
    assert w["ok"] == live(1000.0)
    bad = ["to_missing", "at_big", "at_bool", "in_in", "to_toaster", "to_k", "self", "no_port", "to_pv", "to_old",
           "to_j", "to_transfer"]
    for wid in bad + ["no_ends", "bad_ends"]:
        assert w[wid] == {"power": None, "state": "dead"}, wid
    assert set(w) == {"ok", *bad, "no_ends", "bad_ends"}
    assert f["blocks"]["t"] == {"position": "A"}
    assert f["blocks"]["m"] == {"power": 5.0}
    assert not {"old", "j", "i"} & set(f["blocks"])
    assert evaluate({"blocks": blocks, "wires": wires}, {"m": "junk"}, states.get, {})["blocks"]["m"] == {"missing": True}

    f = evaluate({"blocks": None, "wires": [wire("ok", "g.OUT", "main")]}, {}, {}.get, {})
    assert f == {"wires": {"ok": {"power": None, "state": "dead"}}, "blocks": {}}
    assert evaluate(None, {}, {}.get, None) == {"wires": {}, "blocks": {}}


def test_entity_ids_and_device_bindings():
    c = owner_chain()
    c.block("g")["voltage"] = "sensor.grid_v"
    c.devices["rcbo"].update(control="switch.rcbo", voltage="sensor.rcbo_v", controllable=True)
    c.devices["inv"] = inverter(power_in="sensor.inv_in", power_out="sensor.inv_out", name="not a role")
    c.schema["blocks"].append(blk("old", "meter", power="sensor.old", switch={"entity": "switch.old"}))
    devices = {**c.devices, "zz": {"power": "sensor.zz"}}  # not in the schematic
    assert entity_ids(c.schema, devices) == {
        "sensor.grid", "sensor.grid_v", "sensor.b1", "sensor.b1_soc", "sensor.pv", "sensor.rcbo", "sensor.rcbo_v",
        "sensor.pc", "switch.rcbo", "sensor.inv_in", "sensor.inv_out",
    }
    assert entity_ids({"blocks": None}, {}) == set()

    plan = {
        "levels": [
            {"devices": [
                {"id": "a", "bindings": {"power": "sensor.a", "control": "switch.a", "state": "light.a"}},
                {"id": "b"},
            ]},
            {"devices": [
                {"id": "c", "bindings": {"control": "switch.c", "power": "", "power_out": "sensor.c_out"}},
                "junk",
                {"id": 5},
            ]},
            "junk",
        ]
    }
    assert device_bindings(plan) == {
        "a": {"power": "sensor.a", "control": "switch.a"},
        "b": {},
        "c": {"control": "switch.c", "power_out": "sensor.c_out"},
    }
    assert device_bindings({"levels": None}) == {}


def hub_scheme():
    """A grid with a reading through a transfer at A to a remainder."""
    return Scheme(
        [blk("g", "grid", power="sensor.grid"), blk("ts", "transfer", form="2in1out"), blk("rem", "remainder")],
        [wire("g_ts", "g.OUT", "ts.A"), wire("ts_rem", "ts.OUT", "rem.IN")],
        {},
        {"sensor.grid": 1000},
    )


def test_hub_subscribe_sends_frame_at_once():
    s = hub_scheme()
    hub = PowerHub(s.states.get)
    frames = []
    hub.subscribe("p1", s.schema, s.devices, frames.append)
    assert frames == [s.run()]
    assert frames[0]["wires"]["ts_rem"] == live(1000.0)
    assert hub.entity_ids() == {"sensor.grid"}
    # stored positions apply from the first frame
    frames = []
    PowerHub(s.states.get, {"p1": {"ts": "B"}}).subscribe("p1", s.schema, s.devices, frames.append)
    assert frames[0]["blocks"]["ts"] == {"position": "B"}


def test_hub_state_change_resends_only_on_change():
    s = hub_scheme()
    hub = PowerHub(s.states.get)
    frames = []
    hub.subscribe("p1", s.schema, s.devices, frames.append)
    hub.handle_state("sensor.other")  # not read by the schematic
    s.states["sensor.grid"] = reading(1200)
    hub.handle_state("sensor.grid")
    hub.handle_state("sensor.grid")  # same value: no new frame
    assert len(frames) == 2
    assert frames[1]["wires"]["g_ts"] == live(1200.0)


def test_hub_resends_on_a_device_role_change():
    s = Scheme(
        [blk("g", "grid"), dev("inv"), dev("load")],
        [wire("g_inv", "g.OUT", "inv.IN"), wire("inv_load", "inv.OUT", "load.IN")],
        {"inv": inverter(power_out="sensor.out", voltage="sensor.v"), "load": {}},
        {"sensor.out": 500, "sensor.v": ("230", {"unit_of_measurement": "V"})},
    )
    hub = PowerHub(s.states.get)
    frames = []
    hub.subscribe("p1", s.schema, s.devices, frames.append)
    assert hub.entity_ids() == {"sensor.out", "sensor.v"}
    s.states["sensor.out"] = reading(600)
    hub.handle_state("sensor.out")
    s.states["sensor.v"] = ("231", {"unit_of_measurement": "V"})
    hub.handle_state("sensor.v")
    assert [f["wires"]["inv_load"] for f in frames] == [live(500.0), live(600.0), live(600.0)]
    assert frames[-1]["blocks"]["inv"] == {"power_out": 600.0, "voltage": 231.0, "loss": None}


def test_hub_set_position_reevaluates_and_persists():
    s = hub_scheme()
    saves = []
    hub = PowerHub(s.states.get, on_positions=lambda: saves.append(1))
    frames, other = [], []
    hub.subscribe("p1", s.schema, s.devices, frames.append)
    hub.subscribe("p2", s.schema, s.devices, other.append)
    hub.set_position("p1", "ts", "B")
    assert frames[-1]["blocks"]["ts"] == {"position": "B"}
    assert frames[-1]["wires"]["ts_rem"] == dead()
    assert len(other) == 1  # another plan keeps its position
    assert len(saves) == 1
    positions = hub.positions()
    assert positions == {"p1": {"ts": "B"}}
    positions["p1"]["ts"] = "A"  # a copy
    assert hub.positions() == {"p1": {"ts": "B"}}


def test_hub_rejects_bad_position():
    s = hub_scheme()
    saves = []
    hub = PowerHub(s.states.get, on_positions=lambda: saves.append(1))
    with pytest.raises(ValueError):
        hub.set_position("p1", "ts", "C")
    assert saves == [] and hub.positions() == {}


def test_hub_unsubscribe_stops_frames():
    s = hub_scheme()
    hub = PowerHub(s.states.get)
    frames = []
    unsubscribe = hub.subscribe("p1", s.schema, s.devices, frames.append)
    unsubscribe()
    unsubscribe()  # twice is harmless
    s.states["sensor.grid"] = reading(1200)
    hub.handle_state("sensor.grid")
    hub.set_position("p1", "ts", "B")
    assert len(frames) == 1
    assert hub.entity_ids() == set()


def test_hub_drops_failing_subscriber(caplog):
    s = hub_scheme()
    hub = PowerHub(s.states.get)
    good, bad_calls = [], []

    def bad(frame):
        bad_calls.append(frame)
        if len(bad_calls) > 1:
            raise RuntimeError("boom")

    hub.subscribe("p1", s.schema, s.devices, bad)
    hub.subscribe("p1", s.schema, s.devices, good.append)
    s.states["sensor.grid"] = reading(1200)
    hub.handle_state("sensor.grid")  # bad raises and is dropped; good still gets its frame
    s.states["sensor.grid"] = reading(1300)
    hub.handle_state("sensor.grid")
    assert len(bad_calls) == 2
    assert len(good) == 3
    assert "dropping it" in caplog.text
