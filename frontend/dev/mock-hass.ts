import type { HassLike } from '../src/api';
import type { ContainerState } from '../src/live/container-feed';
import type { Plan } from '../src/model/types';
import type { PowerFrame } from '../src/model/power';
import type { RuleTrace } from '../src/live/rules-feed';
import { DEMO_REGISTRY, DEMO_STATES } from './demo-ha';

/** localStorage key holding { plans: { [id]: Plan } } — same shape as the HA Store data. */
export const STORAGE_KEY = 'plan_studio/plans';

type Stored = { plans: Record<string, Plan> };

function read(storage: Storage): Stored {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Stored) : null;
    return data && typeof data.plans === 'object' ? data : { plans: {} };
  } catch {
    return { plans: {} };
  }
}

function write(storage: Storage, data: Stored): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const fail = (code: string, message: string) => Promise.reject({ code, message });

/** Every input container of a stored plan as error, not configured (the mock has no runtime). */
function notConfiguredStates(plan: Plan | undefined): Record<string, ContainerState> {
  const out: Record<string, ContainerState> = {};
  for (const d of plan?.levels.flatMap(l => l.devices ?? []) ?? []) { // stage-1 plans have no devices
    const p = d.props;
    if (p.kind === 'wall_switch' || p.kind === 'smart_button' || p.kind === 'valve') {
      out[d.id] = { kind: p.kind, status: 'error', reason: 'not_configured' };
    }
  }
  return out;
}

/**
 * HassLike backed by localStorage. Implements plan_studio/plans/{list,get,save,delete} with the
 * revision rules of the Python PlanRepo: a new plan needs expected_revision null and gets revision 1;
 * an existing plan needs expected_revision == current unless force; a missing plan with a non-null
 * expected_revision is a conflict even with force.
 * `plan_studio/containers/subscribe` answers once with a full snapshot: every container of the stored plan as error,
 * not configured. `plan_studio/rules/subscribe` answers once with a full snapshot of `rulesFrame` (none by default).
 * `plan_studio/power/subscribe` answers once with `powerFrame` (an empty frame by default), and
 * `plan_studio/power/set_position` resolves `{}`; `plan_studio/info` answers `serverVersion` (unknown command without it). Other subscriptions are unknown.
 * With `demo` it also has live states and answers the entity, device and area registry commands with a small
 * sample (dev harness); without it those commands are unknown, so tests bring their own HA data.
 */
export function createMockHass(
  opts: {
    darkMode?: boolean; storage?: Storage; demo?: boolean; powerFrame?: PowerFrame; rulesFrame?: Record<string, RuleTrace>;
    /** With `demo`: states replacing the sample's (a scene's live values). */
    states?: Record<string, unknown>;
    /** Answer of `plan_studio/info` (the reload notice shows when it differs from the bundle's version); absent: unknown command. */
    serverVersion?: string;
  } = {},
): HassLike {
  const storage = opts.storage ?? localStorage;
  return {
    themes: { darkMode: opts.darkMode ?? true },
    ...(opts.demo ? { states: { ...DEMO_STATES, ...opts.states } } : {}),
    connection: {
      sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
        if (opts.demo && String(msg.type) in DEMO_REGISTRY) return Promise.resolve(structuredClone(DEMO_REGISTRY[String(msg.type)]) as T);
        const data = read(storage);
        switch (msg.type) {
          case 'plan_studio/plans/list':
            return Promise.resolve({
              plans: Object.values(data.plans).map(p => ({ id: p.id, name: p.name, revision: p.revision })),
            } as T);
          case 'plan_studio/plans/get': {
            const p = data.plans[msg.plan_id as string];
            return p ? Promise.resolve({ plan: structuredClone(p) } as T) : fail('not_found', 'Plan not found');
          }
          case 'plan_studio/plans/save': {
            const plan = msg.plan as Plan;
            const expected = msg.expected_revision as number | null;
            if (!plan || typeof plan.id !== 'string' || !plan.id || !Array.isArray(plan.levels)) {
              return fail('invalid_plan', 'invalid plan');
            }
            const cur = data.plans[plan.id];
            let revision: number;
            if (!cur) {
              if (expected !== null) return fail('revision_conflict', `plan ${plan.id} does not exist`);
              revision = 1;
            } else {
              if (!msg.force && expected !== cur.revision) {
                return fail('revision_conflict', `expected revision ${expected}, current ${cur.revision}`);
              }
              revision = cur.revision + 1;
            }
            data.plans[plan.id] = { ...structuredClone(plan), revision };
            write(storage, data);
            return Promise.resolve({ revision } as T);
          }
          case 'plan_studio/power/set_position':
            return Promise.resolve({} as T);
          case 'plan_studio/info':
            return opts.serverVersion ? Promise.resolve({ version: opts.serverVersion } as T) : fail('unknown_command', 'Unknown command plan_studio/info');
          case 'plan_studio/plans/delete': {
            const id = msg.plan_id as string;
            const existed = id in data.plans;
            delete data.plans[id];
            write(storage, data);
            return Promise.resolve({ deleted: existed } as T);
          }
          default:
            return fail('unknown_command', `Unknown command ${String(msg.type)}`);
        }
      },
      subscribeMessage<T>(callback: (msg: T) => void, msg: Record<string, unknown>): Promise<() => Promise<void>> {
        let first: unknown;
        if (msg.type === 'plan_studio/containers/subscribe') {
          first = { full: true, containers: notConfiguredStates(read(storage).plans[msg.plan_id as string]) };
        } else if (msg.type === 'plan_studio/power/subscribe') {
          first = structuredClone(opts.powerFrame ?? { wires: {}, blocks: {} });
        } else if (msg.type === 'plan_studio/rules/subscribe') {
          first = { full: true, rules: structuredClone(opts.rulesFrame ?? {}) };
        } else {
          return fail('unknown_command', `Unknown command ${String(msg.type)}`);
        }
        let open = true;
        const subscribed = Promise.resolve(() => { open = false; return Promise.resolve(); });
        // Like HA: the result first, then the first event.
        void subscribed.then(() => { if (open) callback(first as T); });
        return subscribed;
      },
    },
  };
}

/** Dev helper: bump the stored revision of every plan, as if another tab saved it. */
export function simulateForeignSave(storage: Storage = localStorage): void {
  const data = read(storage);
  for (const p of Object.values(data.plans)) p.revision += 1;
  write(storage, data);
}

/** Dev helper: drop all stored plans, as if deleted elsewhere. */
export function clearPlans(storage: Storage = localStorage): void {
  write(storage, { plans: {} });
}
