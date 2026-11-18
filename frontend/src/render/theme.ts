/** Colours for the plan drawing and the editor chrome. */
export interface PlanPalette {
  // Drawing
  background: string;
  grid: string;
  gridMajor: string;
  wall: string;
  railing: string;
  zoneLabel: string;
  window: string;
  door: string;
  selection: string;
  invalid: string;
  snap: string;
  dim: string;
  device: string;
  deviceFill: string;
  /** Light cones and pools (wall and ceiling lights). */
  cone: string;
  /** Motion sensor zones: violet, apart from the light colour. */
  motionCone: string;
  /** The mode bubble of a rule in auto (calm green, apart from device, motion and event). */
  modeBubble: string;
  breakLine: string;
  /** Opacity of the layer that is not being edited (walls in equipment mode, devices in plan mode). */
  dimOpacity: number;
  // Power schematic
  /** A live wire carrying power (the one accent of the schematic). */
  powerLive: string;
  /** A live wire carrying no power. */
  powerIdle: string;
  /** A de-energized wire. */
  powerDead: string;
  /** A wire whose power is unknown (dashed). */
  powerNoData: string;
  /** The dashed outline of a remainder block. */
  powerRemainder: string;
  blockFill: string;
  blockStroke: string;
  /** Block names: at least 7:1 against blockFill. */
  blockName: string;
  /** Block value lines: at least 4.5:1 against blockFill. */
  blockValue: string;
  /** Error text inside a block ("Device missing", a meters-disagree hint): at least 4.5:1 against blockFill. */
  blockInvalid: string;
  portFill: string;
  portIcon: string;
  // Chrome
  panel: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  input: string;
  inputBorder: string;
}

/** Dark: the "blueprint" (mockup A of look.html). */
const DARK: PlanPalette = {
  background: '#0b1220',
  grid: '#1c2840',
  gridMajor: '#26355a',
  wall: '#cbd5e1',
  railing: '#94a3b8',
  zoneLabel: '#94a3b8',
  window: '#38bdf8',
  door: '#94a3b8',
  selection: '#60a5fa',
  invalid: '#f43f5e',
  snap: '#facc15',
  dim: '#94a3b8',
  device: '#fbbf24',
  deviceFill: '#1e293b',
  cone: '#fbbf24',
  motionCone: '#a78bfa',
  modeBubble: '#34d399',
  breakLine: '#94a3b8',
  dimOpacity: 0.35,
  powerLive: '#38bdf8',
  powerIdle: '#2f6f93',
  powerDead: '#475569',
  powerNoData: '#64748b',
  powerRemainder: '#fbbf24',
  blockFill: '#121b2f',
  blockStroke: '#3b4a66',
  blockName: '#e2e8f0',
  blockValue: '#b4c0d3',
  blockInvalid: '#fb7185',
  portFill: '#0b1220',
  portIcon: '#cbd5e1',
  panel: '#0f172a',
  border: '#1e293b',
  text: '#e2e8f0',
  muted: '#64748b',
  accent: '#1d4ed8',
  accentText: '#ffffff',
  input: '#111a2e',
  inputBorder: '#334155',
};

/** Light: the "interior" look (mockup C of look.html). */
const LIGHT: PlanPalette = {
  background: '#f3efe8',
  grid: '#e6dfd4',
  gridMajor: '#d8cfc1',
  wall: '#2b2622',
  railing: '#7a7067',
  zoneLabel: '#7a7067',
  window: '#4a9fd0',
  door: '#7a7067',
  selection: '#2563eb',
  invalid: '#e5484d',
  snap: '#d97706',
  dim: '#6b6258',
  device: '#b45309',
  deviceFill: '#fffbeb',
  cone: '#d97706',
  motionCone: '#7c3aed',
  modeBubble: '#047857',
  breakLine: '#7c7368',
  dimOpacity: 0.4,
  powerLive: '#0284c7',
  powerIdle: '#7fb3d1',
  powerDead: '#b3a999',
  powerNoData: '#998f84',
  powerRemainder: '#b45309',
  blockFill: '#ffffff',
  blockStroke: '#c9bfb1',
  blockName: '#2b2622',
  blockValue: '#5c534b',
  blockInvalid: '#cd2b31',
  portFill: '#ffffff',
  portIcon: '#4a423b',
  panel: '#faf7f2',
  border: '#e0d8cc',
  text: '#2b2622',
  muted: '#8a8076',
  accent: '#2563eb',
  accentText: '#ffffff',
  input: '#ffffff',
  inputBorder: '#d6cfc4',
};

export function paletteFor(dark: boolean): PlanPalette {
  return dark ? DARK : LIGHT;
}
