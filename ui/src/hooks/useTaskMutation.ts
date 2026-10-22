import { useState } from "react";
import type { Task } from "../api/tasks";

export type RunTaskMutation = (mutate: () => Promise<Task>) => void;

// Runs one task write at a time; the server returns the updated task.
export function useTaskMutation(onSuccess: (task: Task) => void) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run: RunTaskMutation = (mutate) => {
    setPending(true);
    setError(null);
    mutate()
      .then(onSuccess)
      .catch((e: Error) => setError(e.message))
      .finally(() => setPending(false));
  };

  return { run, pending, error };
}
