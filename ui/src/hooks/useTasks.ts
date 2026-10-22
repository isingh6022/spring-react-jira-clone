import { useMemo } from "react";
import { tasks } from "../api/mockData";
import type { Task, TaskFilters } from "../api/tasks";

// Mock implementation: filters the mock data. Will call GET /api/tasks later.
export function useTasks(filters: TaskFilters) {
  const data = useMemo<Task[]>(
    () =>
      tasks.filter(
        (t) =>
          (!filters.state || t.state === filters.state) &&
          (!filters.contributorId ||
            t.assignee?.id === filters.contributorId) &&
          (!filters.priority || t.priority === filters.priority) &&
          (!filters.expertiseId || t.expertise.id === filters.expertiseId),
      ),
    [filters],
  );

  return { data, loading: false, error: null as string | null };
}
