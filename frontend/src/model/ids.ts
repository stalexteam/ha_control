import type { Id } from './types';

export function newId(): Id {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}
