import type { ContributorDetail } from "../api/contributors";
import type { OperatorAction, Task } from "../api/tasks";
import { ACTION_LABELS } from "../utils/labels";
import AssignContributor from "./AssignContributor";

const BUTTON_ACTIONS: OperatorAction[] = ["EDIT", "REROUTE", "CANCEL"];

function TaskActions({
  task,
  contributors,
}: {
  task: Task;
  contributors: ContributorDetail[];
}) {
  const allowed = BUTTON_ACTIONS.filter((a) => task.allowedActions.includes(a));
  const canAssign = task.allowedActions.includes("ASSIGN");

  if (allowed.length === 0 && !canAssign) {
    return <p>No operator actions in this state.</p>;
  }

  return (
    <div>
      {canAssign && (
        <p>
          <AssignContributor task={task} contributors={contributors} />
        </p>
      )}
      <p>
        {allowed.map((a) => (
          <button key={a} type="button">
            {ACTION_LABELS[a]}
          </button>
        ))}
      </p>
    </div>
  );
}

export default TaskActions;
