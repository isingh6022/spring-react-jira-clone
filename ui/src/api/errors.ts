import type { TaskDetail } from "./tasks";

export interface ApiError {
  status: number;
  message: string;
}

// 409 response: the task changed since the client last saw it.
export interface ConflictError extends ApiError {
  status: 409;
  current: TaskDetail;
}
