import type { Expertise } from "../api/contributors";
import type { TaskAction, TaskPriority, TaskState } from "../api/tasks";

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

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const EXPERTISE_LABELS: Record<Expertise, string> = {
  FINANCE: "Finance",
  HEALTHCARE: "Healthcare",
  DATA_ANALYSIS: "Data analysis",
  OPERATIONS: "Operations",
  LEGAL: "Legal",
};

export const ACTION_LABELS: Record<TaskAction, string> = {
  ASSIGN: "Assign",
  REROUTE: "Route again",
  CANCEL: "Cancel task",
  ACCEPT: "Accept",
  DECLINE: "Decline",
  START: "Start work",
  COMPLETE: "Complete",
  FAIL: "Fail",
};

// Typed key lists for building <select> options.
export const keysOf = <K extends string>(labels: Record<K, string>) =>
  Object.keys(labels) as K[];
