"""Constants for Plan Studio."""

DOMAIN = "plan_studio"
PANEL_URL_PATH = "plan-studio"
STATIC_URL = "/plan_studio_static"
PANEL_JS = "plan-studio-panel.js"
STORAGE_KEY = "plan_studio.plans"
STORAGE_VERSION = 1
# The v0.4 runtime store; kept only so the start can remove it.
RUNTIME_STORAGE_KEY = "plan_studio.runtime"
# Transfer positions: {"positions": {plan_id: {block_id: "A" | "0" | "B"}}}, version 1.
POWER_STORAGE_KEY = "plan_studio.power"
# Boiler rule modes: {plan_id: {rule_id: "auto" | "manual"}}, version 1.
BOILER_STORAGE_KEY = "plan_studio.boiler"
# Running timed switches: {plan_id: {rule_id: until epoch seconds}}, version 1.
TIMED_STORAGE_KEY = "plan_studio.timed"
# Outside light manual pauses: {plan_id: {rule_id: pause end epoch seconds}}, version 1.
OUTSIDE_STORAGE_KEY = "plan_studio.outside"
