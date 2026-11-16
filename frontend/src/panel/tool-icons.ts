import { html, svg, type TemplateResult } from 'lit';
import {
  mdiBatteryHigh, mdiBrightness5, mdiCeilingLight, mdiChartPie, mdiCubeOutline, mdiCursorDefaultOutline, mdiDoor,
  mdiDoorOpen, mdiFan, mdiGestureTapButton, mdiLightSwitch, mdiMotionSensor, mdiPowerSocketEu, mdiRayStartEnd,
  mdiSolarPowerVariant, mdiSourceBranch, mdiTextureBox, mdiThermometerWater, mdiValve, mdiVectorSquare, mdiWall,
  mdiWallSconceRound, mdiWaterAlert, mdiWindowClosedVariant,
} from '@mdi/js';
import type { ToolId } from './tool-factory';

/** The MDI path of every tool, shown on its rail button and in the status-bar tool chip. */
export const TOOL_ICONS: Record<ToolId, string> = {
  select: mdiCursorDefaultOutline,
  box: mdiVectorSquare,
  wall: mdiWall,
  door: mdiDoor,
  window: mdiWindowClosedVariant,
  opening: mdiDoorOpen,
  zone: mdiTextureBox,
  'device-select': mdiCursorDefaultOutline,
  ceiling_light: mdiCeilingLight,
  wall_light: mdiWallSconceRound,
  motion_sensor: mdiMotionSensor,
  illuminance_sensor: mdiBrightness5,
  climate_sensor: mdiThermometerWater,
  wall_switch: mdiLightSwitch,
  smart_button: mdiGestureTapButton,
  valve: mdiValve,
  leak_sensor: mdiWaterAlert,
  socket: mdiPowerSocketEu,
  exhaust_fan: mdiFan,
  equipment: mdiCubeOutline,
  'binding-select': mdiCursorDefaultOutline,
  'power-select': mdiCursorDefaultOutline,
  'power-device': mdiCubeOutline,
  'power-bus': mdiRayStartEnd,
  'power-battery': mdiBatteryHigh,
  'power-pv': mdiSolarPowerVariant,
  'power-transfer': mdiSourceBranch,
  'power-remainder': mdiChartPie,
};

/** A tool's icon as inline SVG (`ticon`, sized by CSS). */
export const toolIcon = (id: ToolId): TemplateResult => html`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${
  svg`<path d=${TOOL_ICONS[id]}></path>`}</svg>`;
