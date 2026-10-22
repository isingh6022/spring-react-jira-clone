import { useState } from "react";
import { runAction, type Task } from "../api/tasks";
import { useContributors } from "../hooks/useContributors";
import type { RunTaskMutation } from "../hooks/useTaskMutation";
import { ACTION_LABELS, EXPERTISE_LABELS } from "../utils/labels";

function TaskActions({
  task,
  run,
  pending,
}: {
  task: Task;
  run: RunTaskMutation;
  pending: boolean;
}) {
  const { data: contributors } = useContributors();
  const [contributorId, setContributorId] = useState<number>();
  const can = (a: Task["allowedActions"][number]) =>
    task.allowedActions.includes(a);
  // Only contributors with the task's expertise can be assigned.
  const eligible = contributors.filter((c) => c.expertise === task.expertise);

  if (!can("ASSIGN") && !can("REROUTE") && !can("CANCEL")) {
    return <p>No operator actions in this state.</p>;
  }

  return (
    <div>
      {can("ASSIGN") && (
        <p>
          {eligible.length === 0 ? (
            `No contributor has ${EXPERTISE_LABELS[task.expertise]} expertise.`
          ) : (
            <>
              <select
                value={contributorId ?? ""}
                onChange={(e) =>
                  setContributorId(Number(e.target.value) || undefined)
                }
              >
                <option value="">Choose contributor…</option>
                {eligible.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>{" "}
              <button
                type="button"
                disabled={pending || !contributorId}
                onClick={() =>
                  run(() =>
                    runAction(task.id, { action: "ASSIGN", contributorId }),
                  )
                }
              >
                {ACTION_LABELS.ASSIGN}
              </button>
            </>
          )}
        </p>
      )}
      <p>
        {can("REROUTE") && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => runAction(task.id, { action: "REROUTE" }))}
          >
            {ACTION_LABELS.REROUTE}
          </button>
        )}
        {can("CANCEL") && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              window.confirm("Cancel this task? This cannot be undone.") &&
              run(() => runAction(task.id, { action: "CANCEL" }))
            }
          >
            {ACTION_LABELS.CANCEL}
          </button>
        )}
      </p>
    </div>
  );
}

export default TaskActions;
