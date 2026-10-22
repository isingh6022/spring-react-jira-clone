import type { TaskFilters, TaskPriority, TaskState } from "../api/tasks";
import { TASK_PRIORITIES, TASK_STATES } from "./labels";

// Builds a link to the current page with some query params changed (null removes one).
export function hrefWith(updates: Record<string, string | null>): string {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  const query = params.toString();
  return query ? `?${query}` : window.location.pathname;
}

function parseNumber(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export function parseTaskFilters(params: URLSearchParams): TaskFilters {
  const state = params.get("state");
  const priority = params.get("priority");

  return {
    state: TASK_STATES.includes(state as TaskState)
      ? (state as TaskState)
      : undefined,
    priority: TASK_PRIORITIES.includes(priority as TaskPriority)
      ? (priority as TaskPriority)
      : undefined,
    contributorId: parseNumber(params.get("contributor")),
    expertiseId: parseNumber(params.get("expertise")),
  };
}
