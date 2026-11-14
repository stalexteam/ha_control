/** Colours for the plan drawing and the editor chrome. */
export interface PlanPalette {
  dark: boolean;
  // Drawing
  background: string;
  grid: string;
  gridMajor: string;
  wall: string;
  railing: string;
  zone: string;
  zoneLabel: string;
  hatch: string;
  window: string;
  door: string;
  selection: string;
  invalid: string;
  snap: string;
  dim: string;
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
  dark: true,
  background: '#0b1220',
  grid: '#1c2840',
  gridMajor: '#26355a',
  wall: '#cbd5e1',
  railing: '#94a3b8',
  zone: '#111a2e',
  zoneLabel: '#94a3b8',
  hatch: '#f43f5e',
  window: '#38bdf8',
  door: '#94a3b8',
  selection: '#60a5fa',
  invalid: '#f43f5e',
  snap: '#facc15',
  dim: '#94a3b8',
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
  dark: false,
  background: '#f3efe8',
  grid: '#e6dfd4',
  gridMajor: '#d8cfc1',
  wall: '#2b2622',
  railing: '#7a7067',
  zone: '#ffffff',
  zoneLabel: '#7a7067',
  hatch: '#e5484d',
  window: '#4a9fd0',
  door: '#7a7067',
  selection: '#2563eb',
  invalid: '#e5484d',
  snap: '#d97706',
  dim: '#6b6258',
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
