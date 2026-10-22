import type { ContributorAction, Task } from "../api/tasks";
import { ACTION_LABELS } from "../utils/labels";

const CONTRIBUTOR_ACTIONS: ContributorAction[] = [
  "ACCEPT",
  "DECLINE",
  "START",
  "COMPLETE",
];

// Demo mode only: the operator acts on behalf of the assigned contributor.
function DemoActions({ task }: { task: Task }) {
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
        {allowed.map((a) => (
          <button key={a} type="button">
            {ACTION_LABELS[a]}
          </button>
        ))}
      </p>
      {canFail && (
        <p>
          <input name="reason" placeholder="Failure reason" required />{" "}
          <button type="button">{ACTION_LABELS.FAIL}</button>
        </p>
      )}
    </div>
  );
}

export default DemoActions;
