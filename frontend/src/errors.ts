/** User-facing text of anything a WebSocket call or fetch can reject with. */
const ERR_CONNECTION_LOST = 3;

export function messageOf(err: unknown): string {
  if (typeof err === 'number') {
    return err === ERR_CONNECTION_LOST ? 'Connection lost' : `Connection error ${err}`;
  }
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null) {
    const e = err as { message?: unknown; code?: unknown };
    if (typeof e.message === 'string' && e.message) return e.message;
    if (e.code !== undefined) return String(e.code);
  }
  return String(err);
}
