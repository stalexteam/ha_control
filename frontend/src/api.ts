import type { Id, Plan } from './model/types';

/** Events of HA's websocket connection: `ready` after every (re)connect, `disconnected` when the socket closes. */
export type ConnectionEvent = 'ready' | 'disconnected';

export interface HassLike {
  connection: {
    sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T>;
    /**
     * HA's subscription call: resolves to the unsubscribe function (it sends `unsubscribe_events`). With
     * `resubscribe: false` the library does not subscribe again by itself after a reconnect.
     */
    subscribeMessage?<T>(callback: (msg: T) => void, msg: Record<string, unknown>,
      options?: { resubscribe?: boolean }): Promise<() => Promise<void>>;
    addEventListener?(type: ConnectionEvent, cb: () => void): void;
    removeEventListener?(type: ConnectionEvent, cb: () => void): void;
  };
  themes?: { darkMode?: boolean };
  states?: Record<string, unknown>;
}

export interface PlanSummary { id: Id; name: string; revision: number }

export class RevisionConflictError extends Error {
  constructor(message = 'Revision conflict') {
    super(message);
    this.name = 'RevisionConflictError';
  }
}

export async function listPlans(hass: HassLike): Promise<PlanSummary[]> {
  const res = await hass.connection.sendMessagePromise<{ plans: PlanSummary[] }>({
    type: 'plan_studio/plans/list',
  });
  return res.plans;
}

/** The server's Plan Studio version (manifest); an old server answers `unknown_command`. */
export async function fetchInfo(hass: Pick<HassLike, 'connection'>): Promise<{ version: string }> {
  return hass.connection.sendMessagePromise<{ version: string }>({ type: 'plan_studio/info' });
}

export async function getPlan(hass: HassLike, id: Id): Promise<Plan> {
  const res = await hass.connection.sendMessagePromise<{ plan: Plan }>({
    type: 'plan_studio/plans/get',
    plan_id: id,
  });
  return res.plan;
}

/** Saves a plan; returns the new revision. Throws RevisionConflictError on conflict. */
export async function savePlan(
  hass: Pick<HassLike, 'connection'>,
  plan: Plan,
  expectedRevision: number | null,
  force = false,
): Promise<number> {
  try {
    const res = await hass.connection.sendMessagePromise<{ revision: number }>({
      type: 'plan_studio/plans/save',
      plan,
      expected_revision: expectedRevision,
      force,
    });
    return res.revision;
  } catch (err) {
    if (typeof err === 'object' && err !== null && (err as { code?: unknown }).code === 'revision_conflict') {
      throw new RevisionConflictError((err as { message?: string }).message);
    }
    throw err;
  }
}

/** Deletes a stored plan (admin only on the server). */
export async function deletePlan(hass: HassLike, id: Id): Promise<void> {
  await hass.connection.sendMessagePromise<Record<string, never>>({
    type: 'plan_studio/plans/delete',
    plan_id: id,
  });
}
