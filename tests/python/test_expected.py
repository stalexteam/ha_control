"""Tests for the expected states of commanded entities (no homeassistant needed)."""

import pytest

from expected import BOUNCE, EXPIRE, RETRY, Expected, expect, passing, service

E = "switch.relay"


def test_constants():
    assert (RETRY, EXPIRE, BOUNCE) == (10, 60, 1)


def test_a_match_is_ours_and_uses_the_record_up():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    assert x.arrived(E, "on", 7.0) is True
    assert x.arrived(E, "on", 8.0) is False  # used up: a second change to the state is not ours
    assert x.next_at() is None and x.due(100.0) == []


def test_a_newer_command_replaces_the_record():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    x.sent(E, "off", 5.0, "r2")
    assert x.next_at() == 15.0  # a fresh 10 s
    assert x.due(10.0) == []
    assert x.due(15.0) == [(E, "off", "r2", "retry")]
    assert x.arrived(E, "on", 16.0) is False  # the older command is not ours any more


def test_an_identical_repeat_keeps_the_first_send_time_and_the_retried_mark():
    x = Expected()
    x.sent(E, "off", 0.0, "b")
    x.sent(E, "off", 5.0, "b")  # the same state from the same sender
    assert x.next_at() == 10.0
    assert x.due(10.0) == [(E, "off", "b", "retry")]
    x.sent(E, "off", 20.0, "b")
    assert x.due(30.0) == [] and x.next_at() == 60.0  # retried once only; the 60 s count from the first send
    x.sent(E, "off", 50.0, "b")
    assert x.due(60.0) == [(E, "off", "b", "expire")]
    x.sent(E, "off", 70.0, "b")  # after the expiry: a new record
    assert x.next_at() == 80.0


def test_an_identical_repeat_at_the_expiry_starts_a_fresh_record_and_the_old_one_still_expires():
    x = Expected()
    x.sent(E, "off", 0.0, "b")
    x.sent(E, "off", 60.0, "b")  # the repeat lands exactly at the expiry, before due() has run
    assert x.next_at() == 60.0  # the old record's expiry is still to report
    assert x.due(60.0) == [(E, "off", "b", "expire")]
    assert x.next_at() == 70.0  # the repeat is a fresh record
    assert x.arrived(E, "off", 67.0) is True  # its late confirmation is ours


@pytest.mark.parametrize("state,by", [("on", "b"), ("off", "c")])
def test_another_state_or_sender_restarts_the_record(state, by):
    x = Expected()
    x.sent(E, "off", 0.0, "b")
    x.due(10.0)
    x.sent(E, state, 15.0, by)
    assert x.next_at() == 25.0 and x.due(25.0) == [(E, state, by, "retry")]


def test_an_identical_repeat_after_no_data_is_a_fresh_send():
    x = Expected()
    x.sent(E, "on", 0.0, "r")
    x.arrived(E, "unavailable", 5.0)
    x.sent(E, "on", 50.0, "r")  # the waiting re-send when the device is back: a full 60 s again
    assert x.next_at() == 60.0
    assert x.due(60.0) == [(E, "on", "r", "retry")] and x.next_at() == 110.0


def test_another_known_state_drops_the_record_without_retry_or_error():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    assert x.arrived(E, "off", 3.0) is False
    assert x.next_at() is None
    assert x.due(10.0) == [] and x.due(60.0) == []
    assert x.arrived(E, "on", 61.0) is False


@pytest.mark.parametrize("state", [None, "unavailable", "unknown", "closing", "opening"])
def test_no_data_or_a_moving_valve_keeps_the_record(state):
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    assert x.arrived(E, state, 3.0) is False
    assert x.arrived(E, "on", 4.0) is True


def test_back_from_no_data_is_a_fresh_reading():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    x.arrived(E, "unavailable", 1.0)
    assert x.arrived(E, "off", 2.0, back=True) is False  # the old state: the command is not applied yet, kept
    assert x.due(10.0) == [(E, "on", "r1", "retry")]
    assert x.arrived(E, "on", 11.0, back=True) is True  # the expected state: ours
    x.sent(E, "on", 20.0, "r1")
    assert x.arrived(E, "off", 21.0, back=False) is False and x.next_at() is None  # a change between known states


def test_passing_states():
    assert [passing(s) for s in (None, "unavailable", "unknown", "opening", "closing", "on", "off", "closed")] == [
        True, True, True, True, True, False, False, False]


def test_retried_once_at_10_s_then_expires_at_60_s():
    x = Expected()
    x.sent(E, "on", 100.0, ("p", "r1"))
    assert x.next_at() == 110.0
    assert x.due(109.9) == []
    assert x.due(110.0) == [(E, "on", ("p", "r1"), "retry")]
    assert x.due(130.0) == []  # once only
    assert x.next_at() == 160.0
    assert x.due(160.0) == [(E, "on", ("p", "r1"), "expire")]
    assert x.next_at() is None and x.due(500.0) == []


def test_a_late_wake_expires_without_a_retry():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    assert x.due(75.0) == [(E, "on", "r1", "expire")]


def test_a_retried_record_still_confirms():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    x.due(10.0)
    assert x.arrived(E, "on", 30.0) is True
    assert x.due(60.0) == []


def test_a_confirmed_record_never_retries():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    x.arrived(E, "on", 1.0)
    assert x.due(10.0) == [] and x.due(60.0) == []


def test_a_change_after_the_expiry_is_not_ours():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    assert x.arrived(E, "on", 61.0) is False  # a command the device lost must not swallow a later real flip
    assert x.due(61.0) == [(E, "on", "r1", "expire")]


def test_records_are_per_entity():
    x = Expected()
    x.sent("light.a", "on", 0.0, "r1")
    x.sent("light.b", "off", 2.0, "r2")
    assert x.arrived("light.b", "off", 3.0) is True
    assert x.due(10.0) == [("light.a", "on", "r1", "retry")]


# --- the bounce filter: the device switching back right after it confirmed a command ---------------------------------


def _confirmed(state="on", by="r1", at=0.0):
    x = Expected()
    x.sent(E, state, at, by)
    assert x.arrived(E, state, at + 0.06, keep=True) is True
    return x


@pytest.mark.parametrize("state,other", [("on", "off"), ("off", "on")])
def test_another_known_state_within_2_s_of_the_confirmation_is_a_bounce(state, other):
    x = _confirmed(state)
    assert x.bounce(E, other, 0.07) == (state, "r1", False)
    assert x.bounce(E, state, 0.08) is None  # used up: told once per confirmation


@pytest.mark.parametrize("after,bounce", [(0.9, True), (1.0, False), (1.1, False)])
def test_the_window_is_1_s_after_the_confirmation(after, bounce):
    x = _confirmed()
    assert (x.bounce(E, "off", 0.06 + after) is not None) is bounce
    assert x.bounce(E, "off", 0.5) is None  # told once, or the window is gone with it


@pytest.mark.parametrize("gap", [None, "unavailable", "unknown"])
def test_no_data_between_the_confirmation_and_another_state_is_no_bounce(gap):
    x = _confirmed()
    assert x.bounce(E, gap, 0.5) is None
    assert x.bounce(E, "off", 0.8) is None  # back from no data: a fresh reading


def test_a_moving_valve_keeps_the_window():
    x = Expected()
    x.sent("valve.v", "closed", 0.0, "r1")
    x.arrived("valve.v", "closed", 0.5, keep=True)
    assert x.bounce("valve.v", "opening", 0.6) is None
    assert x.bounce("valve.v", "open", 0.9) == ("closed", "r1", False)


def test_only_a_real_change_opens_the_window():
    x = Expected()
    x.sent(E, "on", 0.0, "r1")
    assert x.arrived(E, "on", 10.0) is True  # confirmed silently (the entity read the state already): no window
    assert x.bounce(E, "off", 10.5) is None


@pytest.mark.parametrize("state,by", [("off", "r1"), ("on", "r2")])
def test_a_different_command_ends_the_window(state, by):
    x = _confirmed()
    x.sent(E, state, 0.5, by)
    assert x.bounce(E, "off", 0.6) is None


def test_an_identical_command_keeps_the_window():
    x = _confirmed()
    x.sent(E, "on", 0.5, "r1")  # the same command again (the device reads on already)
    assert x.bounce(E, "off", 0.6) == ("on", "r1", False)


def test_the_re_send_is_a_fresh_record_hiding_the_bounce_and_its_next_bounce_is_reported_again():
    x = _confirmed(at=100.0)
    x.bounce(E, "off", 100.07)
    assert x.hidden(E) is None
    x.sent(E, "on", 100.07, "r1", bounce=True)  # sent once more
    assert x.hidden(E) == "on"  # the rules keep reading the commanded state
    assert x.next_at() == 110.07  # a fresh RETRY / EXPIRE clock
    assert x.arrived(E, "on", 100.2, keep=True) is True
    assert x.hidden(E) is None
    assert x.bounce(E, "off", 100.3) == ("on", "r1", True)  # the episode bounced before


def test_any_change_ends_the_hiding_and_an_unconfirmed_re_send_still_retries():
    x = _confirmed()
    x.bounce(E, "off", 0.07)
    x.sent(E, "on", 0.07, "r1", bounce=True)
    assert x.due(10.07) == [(E, "on", "r1", "retry")] and x.hidden(E) == "on"  # retried: still hidden
    x.arrived(E, "unavailable", 11.0, keep=True)
    assert x.hidden(E) is None


def test_a_new_command_after_a_reported_second_bounce_starts_a_new_episode():
    x = _confirmed()
    x.bounce(E, "off", 0.07)
    x.sent(E, "on", 0.07, "r1", bounce=True)
    x.arrived(E, "on", 0.2, keep=True)
    assert x.bounce(E, "off", 0.3)[2] is True
    x.sent(E, "on", 30.0, "r1")  # the rule's next on (new motion)
    x.arrived(E, "on", 30.06, keep=True)
    assert x.bounce(E, "off", 30.07) == ("on", "r1", False)


@pytest.mark.parametrize("domain,svc,state", [
    ("light", "turn_on", "on"), ("switch", "turn_off", "off"), ("fan", "turn_on", "on"),
    ("input_boolean", "turn_off", "off"), ("valve", "close_valve", "closed"), ("valve", "open_valve", "open"),
])
def test_expect_and_service_map_both_ways(domain, svc, state):
    assert expect(domain, svc) == state
    assert service(domain, state) == svc


@pytest.mark.parametrize("domain,svc", [
    ("light", "toggle"), ("cover", "close_cover"), ("valve", "turn_off"), ("script", "turn_on"), ("switch", "close_valve"),
])
def test_other_services_are_not_recorded(domain, svc):
    assert expect(domain, svc) is None
