import { noChange } from 'lit';
import { Directive, directive, PartType, type PartInfo } from 'lit/directive.js';
import { setCommittedValue } from 'lit/directive-helpers.js';
import type { PropertyPart } from 'lit';

/**
 * `.value=${fieldValue(model)}` for editable fields: like `live()` it puts the DOM back on the model value on
 * every render (so a rejected edit reverts), but it never touches the field while it has focus. Home Assistant
 * pushes a new `hass` object every few seconds, which re-renders the panel; without this guard the text being
 * typed would be overwritten mid-edit.
 */
class FieldValueDirective extends Directive {
  constructor(info: PartInfo) {
    super(info);
    if (info.type !== PartType.PROPERTY) throw new Error('fieldValue() can only be used in a property binding');
  }

  render(value: unknown): unknown { return value; }

  update(part: PropertyPart, [value]: [unknown]): unknown {
    const el = part.element as HTMLElement & Record<string, unknown>;
    const root = el.getRootNode() as Document | ShadowRoot;
    if (root.activeElement === el) return noChange;
    if (el[part.name] === value) return noChange;
    // Clear the committed value so the binding is set even when the model did not change since the last render.
    setCommittedValue(part);
    return value;
  }
}

export const fieldValue = directive(FieldValueDirective);
