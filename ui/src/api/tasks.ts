import type { Contributor, ExpertiseArea } from "./contributors";

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

export type OperatorAction = "EDIT" | "ASSIGN" | "REROUTE" | "CANCEL";

// Demo mode only: the operator acts on behalf of the assigned contributor.
export type ContributorAction =
  | "ACCEPT"
  | "DECLINE"
  | "START"
  | "COMPLETE"
  | "FAIL";

export type TaskAction = OperatorAction | ContributorAction;

export interface Task {
  id: number;
  title: string;
  description: string;
  expertise: ExpertiseArea;
  priority: TaskPriority;
  state: TaskState;
  assignee: Contributor | null;
  createdAt: string;
  updatedAt: string;
  routingStartedAt: string | null;
  // Sent back with every action; a stale version is rejected with 409.
  version: number;
  // Computed by the server from the current state.
  allowedActions: TaskAction[];

  // Demo flag: the autoroute won't route this task.
  demoNeverRoutes: boolean;
}

export type ActorType = "SYSTEM" | "OPERATOR" | "CONTRIBUTOR";

export interface TaskEvent {
  id: number;
  at: string;
  type: string;
  actorType: ActorType;
  actorName: string | null;
  fromState: TaskState | null;
  toState: TaskState | null;
  message: string;
}

export interface TaskDetail extends Task {
  history: TaskEvent[];
}

export interface TaskFilters {
  state?: TaskState[];
  contributorId?: number;
  priority?: TaskPriority;
  expertiseId?: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  expertiseId: number;
  priority: TaskPriority;
  demoNeverRoutes: boolean;
}

export interface UpdateTaskRequest {
  version: number;
  title: string;
  description: string;
  expertiseId: number;
  priority: TaskPriority;
}

export interface AssignTaskRequest {
  version: number;
  contributorId: number;
}

// Body for reroute, cancel, and the demo actions accept, decline, start and complete.
export interface TaskActionRequest {
  version: number;
  reason?: string;
}

// The operator reads in the fail reason in history before recovering.
export interface FailTaskRequest extends TaskActionRequest {
  reason: string;
}
