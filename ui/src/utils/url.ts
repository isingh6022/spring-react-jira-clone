import type { TaskFilters, TaskPriority, TaskState } from "../api/tasks";
import { TASK_PRIORITIES, TASK_STATES } from "./labels";

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
