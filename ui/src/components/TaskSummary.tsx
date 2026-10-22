import type { Task } from "../api/tasks";
import { PRIORITY_LABELS } from "../utils/labels";
import { formatDateTime } from "../utils/time";
import ElapsedTime from "./ElapsedTime";
import StateBadge from "./StateBadge";

function TaskSummary({ task }: { task: Task }) {
  return (
    <dl>
      <dt>State</dt>
      <dd>
        <StateBadge state={task.state} />
        {task.state === "ROUTING" && task.routingStartedAt && (
          <>
            {" "}
            for <ElapsedTime since={task.routingStartedAt} />
          </>
        )}
      </dd>

      <dt>Assignee</dt>
      <dd>{task.assignee?.name ?? "—"}</dd>

      <dt>Priority</dt>
      <dd>{PRIORITY_LABELS[task.priority]}</dd>

      <dt>Expertise</dt>
      <dd>{task.expertise.name}</dd>

      <dt>Description</dt>
      <dd>{task.description || "—"}</dd>

      <dt>Created</dt>
      <dd>
        {formatDateTime(task.createdAt)} (<ElapsedTime since={task.createdAt} />{" "}
        ago)
      </dd>

      <dt>Last updated</dt>
      <dd>{formatDateTime(task.updatedAt)}</dd>

      {task.demoNeverRoutes && (
        <>
          <dt>Demo</dt>
          <dd>Automatic routing never returns for this task</dd>
        </>
      )}
    </dl>
  );
}

export default TaskSummary;
