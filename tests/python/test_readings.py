"""Reading statistics store (pure)."""

import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "ps_readings", Path(__file__).resolve().parents[2] / "custom_components" / "plan_studio" / "readings.py"
)
readings = importlib.util.module_from_spec(spec)
spec.loader.exec_module(readings)
Readings = readings.Readings
E = "sensor.a"


def feed(r, times, state="1", eid=E):
    for t in times:
        r.report(eid, state, t)


def test_five_reports_period_last_count():
    r = Readings()
    feed(r, [100, 105, 110, 115, 120])
    assert r.period(E) == 5.0
    assert r.last(E) == 120
    assert r.stats(E)["count"] == 5


def test_two_reports_no_period():
    r = Readings()
    feed(r, [100, 105])
    assert r.period(E) is None


def test_same_value_reports_count():
    r = Readings()
    for t in (0, 5, 10, 15):
        r.report(E, "0", t)
    assert r.period(E) == 5.0


def test_no_data_interval_is_not_counted():
    r = Readings()
    feed(r, [0, 5, 10, 15])
    r.report(E, "unavailable", 20)
    r.report(E, "1", 615)  # 600 s across the outage
    assert r.period(E) == 5.0  # earlier intervals still count, the 600 s one never does
    feed(r, [620, 625])
    assert r.period(E) == 5.0
    r2 = Readings()
    feed(r2, [0, 5])
    r2.report(E, None, 8)
    feed(r2, [608, 613])
    assert r2.period(E) is None  # two counted intervals only: 5 and 5
    r2.report(E, "unknown", 614)
    r2.report(E, "1", 700)
    assert r2.period(E) is None


def test_median_resists_one_long_interval():
    r = Readings()
    t = 0
    for gap in (0, 5, 5, 5, 60, 5):
        t += gap
        r.report(E, "1", t)
    assert r.period(E) == 5.0


def test_keeps_latest_32():
    r = Readings()
    feed(r, range(0, 100))
    assert r.stats(E)["count"] == 32
    assert r.last(E) == 99


def test_period_from_latest_16_intervals():
    r = Readings()
    t = 0
    for gap in [100] * 10 + [5] * 16:
        t += gap
        r.report(E, "1", t)
    assert r.period(E) == 5.0


def test_keep_drops_others():
    r = Readings()
    feed(r, [1, 2], eid="sensor.a")
    feed(r, [1, 2], eid="sensor.b")
    r.keep({"sensor.b"})
    assert r.last("sensor.a") is None and r.last("sensor.b") == 2


def test_stats_ms():
    r = Readings()
    feed(r, [100, 105.5, 111, 116.5])
    assert r.stats(E) == {"last": 116500, "period": 5500, "count": 4}
    assert r.stats("sensor.none") == {"last": None, "period": None, "count": 0}


def test_a_report_not_after_the_latest_is_skipped():
    r = Readings()
    feed(r, [100, 105, 105, 103, 110, 115])  # the same ms twice, a backward clock step: no 0 s or negative interval
    assert r.stats(E) == {"last": 115000, "period": 5000, "count": 4}
