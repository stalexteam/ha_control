// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderVentTrace, VENT_WIDTH, type VentTraceOpts } from '../../src/render/vent-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import type { Rule } from '../../src/model/types';
import type { RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 22, 0).getTime();
const rule: Rule = {
  id: 'v', name: 'Vent', zoneId: null, combine: 'any', inputs: [], onDelay: 0, offDelay: 600,
  vent: { sensor: 'wc', than: 'main', above: 9, below: 5 },
  onTrue: [{ device: 'fan', do: 'on' }], onFalse: [{ device: 'fan', do: 'off' }],
};
const names: Record<string, string> = { wc: 'Climate WC', main: 'Climate Main', fan: 'WC fan' };

const live: RuleTrace = {
  status: 'ok', verdict: true, unknownInputs: 0, pending: { to: false, at: NOW + 412_000 },
  inputs: [{
    label: 'Climate WC vs Climate Main', value: true, detail: '17.4 / 9.7 g/m³ (+79 %)',
    vent: { a: { t: 24, rh: 80, ah: 17.365683782352708, why: null }, b: { t: 22.04, rh: 49.96, ah: 9.681989763300054, why: null }, pct: 79 },
  }],
  last: { action: 'on', target: 'WC fan', at: new Date(2026, 10, 17, 21, 43).getTime(), reason: 'vent' },
};

function draw(over: Partial<VentTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderVentTrace({ rule, deviceName: id => names[id] ?? 'Choose...', note: null, now: NOW, onFocus, ...over }), host);
  return { host, onFocus };
}
/** The visible lines of a block (its <title> tooltip left out). */
const text = (host: HTMLElement, sel: string) => [...host.querySelector(sel)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' ');
const blk = (host: HTMLElement, f: string) => host.querySelector(`[data-block="${f}"]`)!;

describe('vent diagram', () => {
  it('has the compact width of the purpose-built family and never grows above 1:1', () => {
    const { host } = draw();
    expect(VENT_WIDTH).toBe(PURPOSE_WIDTH);
    const svg = host.querySelector('svg.vt') as SVGElement;
    expect(svg.style.maxWidth).toBe(`${PURPOSE_WIDTH}px`);
    expect(svg.getAttribute('viewBox')).toMatch(new RegExp(`^0 0 ${PURPOSE_WIDTH} `));
  });

  it('long names are kept whole up to the box width and clipped to the box; the tooltip has the full text', () => {
    const long = 'Bathroom climate sensor T1';
    const { host } = draw({ deviceName: id => (id === 'wc' ? long : id === 'main' ? 'A'.repeat(80) : names[id]) });
    expect(text(host, '[data-block="vent-sensor"]')).toContain(long);
    const b = blk(host, 'vent-than');
    const clipBox = b.querySelector('svg.fc-clip')!;
    expect(Number(clipBox.getAttribute('width'))).toBeLessThan(Number(b.querySelector('rect')!.getAttribute('width')));
    expect(clipBox.querySelectorAll('text').length).toBeGreaterThan(0);
    expect(b.querySelector('text')!.textContent!.endsWith('…')).toBe(true);
    expect(b.querySelector('title')!.textContent).toContain('A'.repeat(80));
  });

  it('long names clip the names of the comparison, never its percent', () => {
    const { host } = draw({ trace: live, deviceName: id => (id === 'wc' ? 'W'.repeat(60) : id === 'main' ? 'M'.repeat(60) : names[id]) });
    const first = blk(host, 'vent-above').querySelector('text')!.textContent!;
    expect(first).toMatch(/…: \+79 %$/);
  });

  it('a failed last action puts the error on its own line', () => {
    const tr: RuleTrace = { ...live, last: { ...live.last!, action: 'off', error: 'target unavailable' } };
    const { host } = draw({ trace: tr });
    const lines = [...blk(host, 'vent-fan').querySelectorAll('text')].map(x => x.textContent);
    expect(lines[2]).toMatch(/^last: turned off \d\d?:43$/);
    expect(lines[3]).toBe('target unavailable');
    expect(blk(host, 'vent-fan').querySelectorAll('text')[3].classList).toContain('fc-err');
  });

  it('a status other than ok is shown, with the reason of an error; ok shows none', () => {
    expect(draw({ trace: live }).host.querySelector('[data-note="status"]')).toBeNull();
    const { host } = draw({ trace: { ...live, status: 'error', reason: 'target unavailable' } });
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Error: target unavailable');
  });

  it('without a trace the blocks show the parameters, no live colours, and the note', () => {
    const { host } = draw({ note: 'Live state appears after Save' });
    expect(text(host, '[data-block="vent-sensor"]')).toBe('Climate WC Wet zone sensor');
    expect(text(host, '[data-block="vent-than"]')).toBe('Climate Main Compare with');
    expect(text(host, '[data-block="vent-above"]')).toBe('Climate WC vs Climate Main on > 9 %, off < 5 %');
    expect(text(host, '[data-block="vent-runon"]')).toBe('Result run-on 10 min');
    expect(text(host, '[data-block="vent-fan"]')).toBe('WC fan on / off');
    expect(host.querySelector('.fc-blk.on, .fc-blk.off, .fc-blk.nodata')).toBeNull();
    expect(host.querySelector('.fc-note')!.textContent).toBe('Live state appears after Save');
  });

  it('a live trace shows the sensor values rounded to one decimal, the percent, verdict, countdown and last action', () => {
    const { host } = draw({ trace: live });
    expect(text(host, '[data-block="vent-sensor"]')).toBe('Climate WC 24.0 °C 80.0 % 17.4 g/m³');
    expect(text(host, '[data-block="vent-than"]')).toBe('Climate Main 22.0 °C 50.0 % 9.7 g/m³');
    expect(text(host, '[data-block="vent-above"]')).toBe('Climate WC vs Climate Main: +79 % on > 9 %, off < 5 %');
    expect(text(host, '[data-block="vent-runon"]')).toBe('Result: true run-on 10 min (off in 6:52)');
    expect(text(host, '[data-block="vent-fan"]')).toMatch(/^WC fan on \/ off last: turned on \d\d?:43/);
    expect(blk(host, 'vent-above').classList).toContain('on');
    expect(blk(host, 'vent-runon').classList).toContain('on');
    expect(blk(host, 'vent-sensor').classList).not.toContain('nodata');
    expect(host.querySelector('.fc-note')).toBeNull();
  });

  it('a negative percent and a false verdict without pending', () => {
    const tr: RuleTrace = { ...live, verdict: false, pending: undefined, inputs: [{ ...live.inputs[0], value: false, vent: { ...live.inputs[0].vent!, pct: -6 } }] };
    const { host } = draw({ trace: tr });
    expect(text(host, '[data-block="vent-above"]')).toBe('Climate WC vs Climate Main: -6 % on > 9 %, off < 5 %');
    expect(text(host, '[data-block="vent-runon"]')).toBe('Result: false run-on 10 min');
    expect(blk(host, 'vent-runon').classList).not.toContain('on');
  });

  it('the run-on countdown follows now (the panel re-renders once a second)', () => {
    expect(text(draw({ trace: live, now: NOW + 1000 }).host, '[data-block="vent-runon"]')).toContain('(off in 6:51)');
    expect(text(draw({ trace: live, now: NOW + 400_000 }).host, '[data-block="vent-runon"]')).toContain('(off in 0:12)');
  });

  it('a sensor without data is drawn as unknown with its reason; the other keeps its values; no percent', () => {
    const tr: RuleTrace = {
      ...live, verdict: null, pending: undefined, status: 'waiting', unknownInputs: 1,
      inputs: [{ label: 'x', value: null, detail: 'unavailable', vent: { a: live.inputs[0].vent!.a, b: { t: 22, rh: null, ah: null, why: 'unavailable' }, pct: null } }],
    };
    const { host } = draw({ trace: tr });
    expect(blk(host, 'vent-than').classList).toContain('nodata');
    expect(text(host, '[data-block="vent-than"]')).toBe('Climate Main unavailable 22.0 °C');
    expect(blk(host, 'vent-sensor').classList).not.toContain('nodata');
    expect(text(host, '[data-block="vent-sensor"]')).toBe('Climate WC 24.0 °C 80.0 % 17.4 g/m³');
    expect(text(host, '[data-block="vent-above"]')).toBe('Climate WC vs Climate Main: no data on > 9 %, off < 5 %');
    expect(text(host, '[data-block="vent-above"]')).not.toMatch(/\d %,? on/);
    expect(blk(host, 'vent-above').classList).toContain('nodata');
    expect(blk(host, 'vent-runon').classList).toContain('nodata');
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Waiting for data');
  });

  it('a trace without the structured part (older server) shows the detail text', () => {
    const tr: RuleTrace = { ...live, inputs: [{ label: 'x', value: true, detail: '17.4 / 9.7 g/m³ (+79 %)' }] };
    const { host } = draw({ trace: tr });
    expect(text(host, '[data-block="vent-sensor"]')).toBe('Climate WC Wet zone sensor');
    expect(text(host, '[data-block="vent-above"]')).toMatch(/^Climate WC vs Climate Main: 17\.4/);
    expect(host.querySelector('[data-block="vent-above"] title')!.textContent).toContain('17.4 / 9.7 g/m³ (+79 %)');
  });

  it('a click on a block reports its form field; the focused block is highlighted', () => {
    const { host, onFocus } = draw({ focused: 'vent-runon' });
    for (const f of ['vent-sensor', 'vent-than', 'vent-above', 'vent-runon', 'vent-fan']) blk(host, f).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onFocus.mock.calls.map(c => c[0])).toEqual(['vent-sensor', 'vent-than', 'vent-above', 'vent-runon', 'vent-fan']);
    expect(blk(host, 'vent-runon').classList).toContain('hl');
    expect(host.querySelectorAll('.fc-blk.hl')).toHaveLength(1);
  });

  it('an off another automation kept from being sent says who keeps the fan on, not "turned off"', () => {
    const at = new Date(2026, 10, 17, 21, 52).getTime();
    const { host } = draw({ trace: { ...live, verdict: false, last: { action: 'off', target: 'WC fan', at, reason: 'kept on by Vent (10min)', sent: false } } });
    expect(text(host, '[data-block="vent-fan"]')).toMatch(/last: kept on by Vent \(10min\) .*21.52/);
    expect(text(host, '[data-block="vent-fan"]')).not.toContain('turned');
  });
});
