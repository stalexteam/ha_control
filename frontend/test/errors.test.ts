import { describe, it, expect } from 'vitest';
import { messageOf } from '../src/errors';

describe('messageOf', () => {
  it('maps WebSocket numeric codes', () => {
    expect(messageOf(3)).toBe('Connection lost');
    expect(messageOf(2)).toBe('Connection error 2');
  });
  it('reads Error, string and { code, message } objects', () => {
    expect(messageOf(new Error('boom'))).toBe('boom');
    expect(messageOf('plain')).toBe('plain');
    expect(messageOf({ code: 'unauthorized', message: 'Admin only' })).toBe('Admin only');
    expect(messageOf({ code: 'not_found' })).toBe('not_found');
  });
  it('gives generic text for objects without message or code', () => {
    expect(messageOf({})).toBe('Unknown error');
    expect(messageOf({ message: '' })).toBe('Unknown error');
  });
  it('falls back to String()', () => {
    expect(messageOf(null)).toBe('null');
  });
});
