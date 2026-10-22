import { useMemo } from "react";
import { tasks } from "../api/mockData";
import type { TaskDetail } from "../api/tasks";

// Mock implementation. Will call GET /api/tasks/:id later.
export function useTask(id: number) {
  const data = useMemo<TaskDetail | null>(
    () => tasks.find((t) => t.id === id) ?? null,
    [id],
  );

  return { data, loading: false, error: null as string | null };
}
