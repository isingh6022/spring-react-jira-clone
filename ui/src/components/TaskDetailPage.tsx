import { Link, useParams } from "react-router";
import { useDemoMode } from "../hooks/useDemoMode";
import { useTask } from "../hooks/useTask";
import { useTaskMutation } from "../hooks/useTaskMutation";
import { EXPERTISE_LABELS, PRIORITY_LABELS } from "../utils/labels";
import { formatDateTime } from "../utils/time";
import DemoActions from "./DemoActions";
import ElapsedTime from "./ElapsedTime";
import ErrorMessage from "./ErrorMessage";
import StateBadge from "./StateBadge";
import TaskActions from "./TaskActions";
import TaskHistory from "./TaskHistory";

function TaskDetailPage() {
  const id = Number(useParams().id);
  const { data: task, setData: setTask, loading, error } = useTask(id);
  const demoMode = useDemoMode();
  // Every action returns the updated task, which replaces the one shown.
  const { run, pending, error: actionError } = useTaskMutation(setTask);

  if (loading && !task) {
    return <p>Loading task…</p>;
  }
  if (error || !task) {
    return <ErrorMessage message={error ?? `Task ${id} not found.`} />;
  }

  return (
    <section>
      <h2>
        #{task.id} {task.title}
      </h2>
      <Link to="/">Back to tasks</Link>

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
        <dd>{EXPERTISE_LABELS[task.expertise]}</dd>
        <dt>Created</dt>
        <dd>{formatDateTime(task.createdAt)}</dd>
        {task.demoNeverRoutes && (
          <>
            <dt>Demo</dt>
            <dd>Automatic routing never returns for this task</dd>
          </>
        )}
      </dl>

      {actionError && <ErrorMessage message={actionError} />}

      <h3>Operator actions</h3>
      <TaskActions task={task} run={run} pending={pending} />

      {demoMode && (
        <>
          <h3>Demo: contributor actions</h3>
          <DemoActions task={task} run={run} pending={pending} />
        </>
      )}

      <h3>History</h3>
      <TaskHistory events={task.history ?? []} />
    </section>
  );
}

export default TaskDetailPage;
