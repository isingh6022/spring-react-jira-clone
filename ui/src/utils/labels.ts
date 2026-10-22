import type {
  ActorType,
  TaskAction,
  TaskPriority,
  TaskState,
} from "../api/tasks";

export const TASK_STATES: TaskState[] = [
  "ROUTING",
  "NO_MATCH",
  "ASSIGNED",
  "ACCEPTED",
  "IN_PROGRESS",
  "DONE",
  "DECLINED",
  "FAILED",
  "CANCELLED",
];

export const STATE_LABELS: Record<TaskState, string> = {
  ROUTING: "Routing",
  NO_MATCH: "No match",
  ASSIGNED: "Assigned",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  DECLINED: "Declined",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export const TASK_PRIORITIES: TaskPriority[] = ["HIGH", "MEDIUM", "LOW"];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const ACTION_LABELS: Record<TaskAction, string> = {
  EDIT: "Edit",
  ASSIGN: "Assign",
  REROUTE: "Route again",
  CANCEL: "Cancel task",
  ACCEPT: "Accept",
  DECLINE: "Decline",
  START: "Start work",
  COMPLETE: "Complete",
  FAIL: "Fail",
};

export const ACTOR_LABELS: Record<ActorType, string> = {
  SYSTEM: "System",
  OPERATOR: "Operator",
  CONTRIBUTOR: "Contributor",
};
