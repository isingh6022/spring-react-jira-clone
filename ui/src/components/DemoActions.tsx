import { useState } from "react";
import { runAction, type Task, type TaskAction } from "../api/tasks";
import type { RunTaskMutation } from "../hooks/useTaskMutation";
import { ACTION_LABELS } from "../utils/labels";

const CONTRIBUTOR_ACTIONS: TaskAction[] = [
  "ACCEPT",
  "DECLINE",
  "START",
  "COMPLETE",
];

// Demo mode only: the operator acts on behalf of the assigned contributor.
function DemoActions({
  task,
  run,
  pending,
}: {
  task: Task;
  run: RunTaskMutation;
  pending: boolean;
}) {
  const [reason, setReason] = useState("");
  const allowed = CONTRIBUTOR_ACTIONS.filter((a) =>
    task.allowedActions.includes(a),
  );
  const canFail = task.allowedActions.includes("FAIL");

  if (allowed.length === 0 && !canFail) {
    return <p>No contributor actions in this state.</p>;
  }

  return (
    <div>
      <p>As {task.assignee?.name ?? "the contributor"}:</p>
      <p>
        {allowed.map((action) => (
          <button
            key={action}
            type="button"
            disabled={pending}
            onClick={() => run(() => runAction(task.id, { action }))}
          >
            {ACTION_LABELS[action]}
          </button>
        ))}
      </p>
      {canFail && (
        <p>
          <input
            placeholder="Failure reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />{" "}
          <button
            type="button"
            disabled={pending || reason.trim() === ""}
            onClick={() =>
              run(() => runAction(task.id, { action: "FAIL", reason }))
            }
          >
            {ACTION_LABELS.FAIL}
          </button>
        </p>
      )}
    </div>
  );
}

export default DemoActions;
