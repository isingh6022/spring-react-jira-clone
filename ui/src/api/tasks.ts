import { post, request } from "./client";
import type { Contributor, Expertise } from "./contributors";

export type TaskState =
  | "ROUTING"
  | "NO_MATCH"
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "DONE"
  | "DECLINED"
  | "FAILED"
  | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

// ASSIGN, REROUTE and CANCEL are the operator's; the rest are demo-mode
// actions the operator performs on behalf of the assignee.
export type TaskAction =
  | "ASSIGN"
  | "REROUTE"
  | "CANCEL"
  | "ACCEPT"
  | "DECLINE"
  | "START"
  | "COMPLETE"
  | "FAIL";

export interface TaskEvent {
  id: number;
  at: string;
  actor: string;
  // The state the task moved to; null if unchanged.
  state: TaskState | null;
  message: string;
}

export interface Task {
  id: number;
  title: string;
  expertise: Expertise;
  priority: TaskPriority;
  state: TaskState;
  assignee: Contributor | null;
  // Demo flag: automatic routing never returns for this task.
  demoNeverRoutes: boolean;
  createdAt: string;
  routingStartedAt: string | null;
  // Computed by the server from the current state.
  allowedActions: TaskAction[];
  // Only included when fetching a single task.
  history: TaskEvent[] | null;
}

export interface CreateTaskRequest {
  title: string;
  expertise: Expertise;
  priority: TaskPriority;
  demoNeverRoutes: boolean;
}

// contributorId is needed for ASSIGN, reason for FAIL.
export interface TaskActionRequest {
  action: TaskAction;
  contributorId?: number;
  reason?: string;
}

export function fetchTasks(state?: TaskState, signal?: AbortSignal) {
  return request<Task[]>(state ? `/tasks?state=${state}` : "/tasks", { signal });
}

export function fetchTask(id: number, signal?: AbortSignal) {
  return request<Task>(`/tasks/${id}`, { signal });
}

export function createTask(body: CreateTaskRequest) {
  return post<Task>("/tasks", body);
}

export function runAction(id: number, body: TaskActionRequest) {
  return post<Task>(`/tasks/${id}/actions`, body);
}
