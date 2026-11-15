import type { Pt } from '../../model/types';
import type { Preview } from './types';

/**
 * Two typed number buffers shown in the tracker (wall: length + angle; box: width + depth).
 * Digits and space go to the active buffer, Backspace erases its last character, Tab switches buffers.
 */
export interface TypedInput {
  readonly first: string;
  readonly second: string;
  /** True when either buffer holds text. */
  typing(): boolean;
  /** Empties both buffers and makes the first one active. */
  clear(): void;
  /** Edits the buffers; Enter runs `enter`; Escape clears typed text, or runs `escape` when there is none. True when consumed. */
  key(key: string, enter: () => void, escape: () => void): boolean;
  tracker(at: Pt): NonNullable<Preview['tracker']>;
}

export function createTypedInput(): TypedInput {
  let first = '';
  let second = '';
  let field: 'first' | 'second' = 'first';
  const clear = () => { first = ''; second = ''; field = 'first'; };
  const typing = () => first !== '' || second !== '';
  return {
    get first() { return first; },
    get second() { return second; },
    typing,
    clear,
    key(key, enter, escape) {
      if (/^[0-9]$/.test(key) || key === ' ') {
        if (field === 'first') first += key; else second += key;
        return true;
      }
      if (key === 'Backspace') {
        if (field === 'first') first = first.slice(0, -1); else second = second.slice(0, -1);
        return true;
      }
      if (key === 'Tab') { field = field === 'first' ? 'second' : 'first'; return true; }
      if (key === 'Enter') { enter(); return true; }
      if (key === 'Escape') {
        if (typing()) clear(); else escape();
        return true;
      }
      return false;
    },
    tracker: at => ({ first, second, field, at }),
  };
}
