import type { HassLike } from '../src/api';
import type { Plan } from '../src/model/types';

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

/**
 * HassLike backed by localStorage. Implements plan_studio/plans/{list,get,save,delete} with the
 * revision rules of the Python PlanRepo: a new plan needs expected_revision null and gets revision 1;
 * an existing plan needs expected_revision == current unless force; a missing plan with a non-null
 * expected_revision is a conflict even with force.
 */
export function createMockHass(opts: { darkMode?: boolean; storage?: Storage } = {}): HassLike {
  const storage = opts.storage ?? localStorage;
  return {
    themes: { darkMode: opts.darkMode ?? true },
    connection: {
      sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
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
