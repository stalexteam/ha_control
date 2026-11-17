// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { renderBoilerTrace, BOILER_WIDTH, type BoilerTraceOpts } from '../../src/render/boiler-trace';
import { PURPOSE_WIDTH } from '../../src/render/flow-block';
import type { Rule } from '../../src/model/types';
import type { BoilerTrace, RuleTrace } from '../../src/live/rules-feed';

const NOW = new Date(2026, 10, 17, 22, 0).getTime();
const fixed = { combine: 'any' as const, inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
const limited: Rule = {
  id: 'b', name: 'Boiler', zoneId: null, ...fixed,
  boiler: { device: 'boiler', button: 'btn', grid: { block: 'grid', limit: 3000, nominal: 1400 } },
};
const plain: Rule = { ...limited, boiler: { device: 'boiler', button: 'btn' } };
const names: Record<string, string> = { boiler: 'Boiler', btn: 'Button Boiler' };

const live = (b: Partial<BoilerTrace>, over: Partial<RuleTrace> = {}): RuleTrace => ({
  status: 'ok', verdict: true, inputs: [], unknownInputs: 0,
  boiler: { mode: 'auto', phase: 'heating', grid: 546, boilerW: 0, headroom: 1946, relay: 'on', ...b },
  ...over,
});

function draw(over: Partial<BoilerTraceOpts> = {}): { host: HTMLElement; onFocus: ReturnType<typeof vi.fn> } {
  const onFocus = vi.fn();
  const host = document.createElement('div');
  render(renderBoilerTrace({
    rule: limited, deviceName: id => names[id] ?? 'Choose...', gridName: id => (id === 'grid' ? 'AC-IN' : 'Choose...'),
    note: null, now: NOW, onFocus, ...over,
  }), host);
  return { host, onFocus };
}
/** The visible lines of a block (its <title> tooltip left out). */
const text = (host: HTMLElement, f: string) =>
  [...host.querySelector(`[data-block="${f}"]`)!.querySelectorAll('text')].map(x => x.textContent!.trim()).join(' | ');
const cls = (host: HTMLElement, f: string) => host.querySelector(`[data-block="${f}"]`)!.classList;
const order = (host: HTMLElement) => [...host.querySelectorAll('[data-block]')].map(b => b.getAttribute('data-block'));
const top = (host: HTMLElement, f: string) => Number(/translate\([\d.]+ ([\d.]+)\)/.exec(host.querySelector(`[data-block="${f}"]`)!.getAttribute('transform')!)![1]);

describe('boiler diagram', () => {
  it('has the compact width of the purpose-built family and never grows above 1:1', () => {
    const { host } = draw();
    expect(BOILER_WIDTH).toBe(PURPOSE_WIDTH);
    const svg = host.querySelector('svg.vt') as SVGElement;
    expect(svg.style.maxWidth).toBe(`${PURPOSE_WIDTH}px`);
    expect(svg.getAttribute('viewBox')).toMatch(new RegExp(`^0 0 ${PURPOSE_WIDTH} `));
  });

  it('with the power limit: Grid, Headroom, Mode, Relay, Boiler power from top to bottom', () => {
    const { host } = draw();
    expect(order(host)).toEqual(['boiler-grid', 'boiler-limit', 'boiler-button', 'boiler-relay', 'boiler-nominal']);
    const ys = order(host).map(f => top(host, f!));
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    expect(text(host, 'boiler-grid')).toBe('AC-IN | grid power');
    expect(text(host, 'boiler-limit')).toBe('Headroom | grid + 1400 - boiler ≤ 3000 W');
    expect(text(host, 'boiler-button')).toBe('Mode | button: Button Boiler');
    expect(text(host, 'boiler-relay')).toBe('Relay | Boiler');
    expect(text(host, 'boiler-nominal')).toBe('Boiler power | nominal 1400 W, done at ≤ 1 W');
    expect(host.querySelector('.fc-blk.on, .fc-blk.off, .fc-blk.nodata')).toBeNull();
  });

  it('without the power limit: no Grid or Headroom block; Relay and Boiler power stay distinct blocks', () => {
    const { host } = draw({ rule: plain });
    expect(order(host)).toEqual(['boiler-button', 'boiler-relay', 'boiler-power']);
    expect(text(host, 'boiler-button')).toBe('Mode | button: Button Boiler');
    expect(text(host, 'boiler-power')).toBe('Boiler power | done at ≤ 1 W');
  });

  it('live heating: grid watts, headroom ok, auto, relay on with the power check countdown, boiler watts', () => {
    const { host } = draw({ trace: live({ until: NOW + 45_000 }, { last: { action: 'on', target: 'Boiler', at: new Date(2026, 10, 17, 21, 44).getTime(), reason: 'auto' } }) });
    expect(text(host, 'boiler-grid')).toBe('AC-IN | 546 W');
    expect(text(host, 'boiler-limit')).toBe('Headroom: ok | grid + 1400 - boiler = 1946 / 3000 W');
    expect(cls(host, 'boiler-limit')).toContain('on');
    expect(text(host, 'boiler-button')).toBe('Mode: auto | button: Button Boiler');
    expect(cls(host, 'boiler-button')).toContain('on');
    expect(text(host, 'boiler-relay')).toMatch(/^Relay: on \| Boiler \| heating, power check in 0:45 \| last: turned on .+$/);
    expect(cls(host, 'boiler-relay')).toContain('on');
    expect(text(host, 'boiler-nominal')).toBe('Boiler power: 0 W | nominal 1400 W, done at ≤ 1 W');
    expect(cls(host, 'boiler-nominal')).toContain('off');
  });

  it('heating with power: the boiler block is on; no countdown without until', () => {
    const { host } = draw({ trace: live({ boilerW: 1380.4, headroom: 566 }) });
    expect(text(host, 'boiler-nominal')).toMatch(/^Boiler power: 1380 W/);
    expect(cls(host, 'boiler-nominal')).toContain('on');
    expect(text(host, 'boiler-relay')).toBe('Relay: on | Boiler | heating');
  });

  it('over the limit: headroom over in the off tone, relay off with "power limit"', () => {
    const { host } = draw({ trace: live({ phase: 'limit', grid: 2546, headroom: 3946, relay: 'off' }) });
    expect(text(host, 'boiler-limit')).toBe('Headroom: over the limit | grid + 1400 - boiler = 3946 / 3000 W');
    expect(cls(host, 'boiler-limit')).toContain('off');
    expect(text(host, 'boiler-relay')).toBe('Relay: off | Boiler | power limit');
    expect(cls(host, 'boiler-relay')).toContain('off');
  });

  it('the limit itself is still ok', () => {
    const { host } = draw({ trace: live({ headroom: 3000 }) });
    expect(text(host, 'boiler-limit')).toMatch(/^Headroom: ok/);
  });

  it('blackout: grid no data (dashed), headroom no data, relay off with "blackout"', () => {
    const { host } = draw({ trace: live({ phase: 'blackout', grid: null, headroom: null, relay: 'off' }) });
    expect(text(host, 'boiler-grid')).toBe('AC-IN | no data');
    expect(cls(host, 'boiler-grid')).toContain('nodata');
    expect(text(host, 'boiler-limit')).toBe('Headroom: no data | grid + 1400 - boiler ≤ 3000 W');
    expect(cls(host, 'boiler-limit')).toContain('nodata');
    expect(text(host, 'boiler-relay')).toBe('Relay: off | Boiler | blackout');
    expect(cls(host, 'boiler-relay')).toContain('off');
  });

  it('waiting counts down m:ss; done; manual follows the relay; an unknown relay and power have no data', () => {
    expect(text(draw({ trace: live({ phase: 'waiting', relay: 'off', until: NOW + 12_400 }) }).host, 'boiler-relay')).toBe('Relay: off | Boiler | waiting 0:13');
    expect(text(draw({ trace: live({ phase: 'waiting', relay: 'off', until: NOW - 5000 }) }).host, 'boiler-relay')).toBe('Relay: off | Boiler | waiting 0:00');
    expect(text(draw({ trace: live({ mode: 'manual', phase: 'done', relay: 'off' }) }).host, 'boiler-relay')).toBe('Relay: off | Boiler | heating done');
    const manual = draw({ trace: live({ mode: 'manual', phase: null, relay: 'on' }) }).host;
    expect(text(manual, 'boiler-button')).toBe('Mode: manual | button: Button Boiler');
    expect(cls(manual, 'boiler-button')).toContain('off');
    expect(text(manual, 'boiler-relay')).toBe('Relay: on | Boiler');
    expect(cls(manual, 'boiler-relay')).toContain('on');
    const none = draw({ trace: live({ mode: 'manual', phase: null, relay: null, boilerW: null }) }).host;
    expect(text(none, 'boiler-relay')).toBe('Relay: no data | Boiler');
    expect(cls(none, 'boiler-relay')).toContain('nodata');
    expect(text(none, 'boiler-nominal')).toMatch(/^Boiler power: no data/);
    expect(cls(none, 'boiler-nominal')).toContain('nodata');
  });

  it('a failed last call adds the error line; an error status shows under the diagram', () => {
    const { host } = draw({
      trace: live({ relay: 'off' }, {
        status: 'error', reason: 'target unavailable',
        last: { action: 'on', target: 'Boiler', at: NOW, reason: 'auto', error: 'waiting for target' },
      }),
    });
    expect(host.querySelector('[data-block="boiler-relay"] .fc-err')!.textContent).toBe('waiting for target');
    expect(host.querySelector('[data-note="status"]')!.textContent).toBe('Error: target unavailable');
  });

  it('a click on a block calls onFocus with its field; the focused block is highlighted', () => {
    const { host, onFocus } = draw({ focused: 'boiler-limit' });
    for (const f of ['boiler-grid', 'boiler-limit', 'boiler-button', 'boiler-relay', 'boiler-nominal']) {
      host.querySelector(`[data-block="${f}"]`)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onFocus).toHaveBeenLastCalledWith(f);
    }
    expect(cls(host, 'boiler-limit')).toContain('hl');
    expect(cls(host, 'boiler-grid')).not.toContain('hl');
  });

  it('empty picks show the pick text; the note shows under the diagram', () => {
    const { host } = draw({ rule: { ...limited, boiler: { device: '', button: '', grid: { block: '', limit: 3000, nominal: 1400 } } }, note: 'Live state appears after Save' });
    expect(text(host, 'boiler-grid')).toBe('Choose... | grid power');
    expect(text(host, 'boiler-button')).toBe('Mode | button: Choose...');
    expect(host.querySelector('.fc-note')!.textContent).toBe('Live state appears after Save');
  });
});
