import { useCallback } from "react";
import { fetchTasks, type Task, type TaskState } from "../api/tasks";
import { useFetch } from "./useFetch";

const NO_TASKS: Task[] = [];

export function useTasks(state?: TaskState) {
  const load = useCallback(
    (signal: AbortSignal) => fetchTasks(state, signal),
    [state],
  );

  return useFetch(load, NO_TASKS);
}
