import { useCallback } from "react";
import { fetchTask, type Task } from "../api/tasks";
import { useFetch } from "./useFetch";

export function useTask(id: number) {
  const load = useCallback(
    (signal: AbortSignal) => fetchTask(id, signal),
    [id],
  );

  return useFetch<Task | null>(load, null);
}
