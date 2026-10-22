import type { Task } from "../api/tasks";
import { PRIORITY_LABELS } from "../utils/labels";
import { hrefWith } from "../utils/url";
import ElapsedTime from "./ElapsedTime";
import StateBadge from "./StateBadge";

function TaskRow({ task }: { task: Task }) {
  return (
    <tr data-state={task.state} data-priority={task.priority}>
      <td>{task.id}</td>
      <td>
        <a href={hrefWith({ task: String(task.id) })}>{task.title}</a>
        {task.demoNeverRoutes && <small> (demo: never routes)</small>}
      </td>
      <td>{PRIORITY_LABELS[task.priority]}</td>
      <td>{task.expertise.name}</td>
      <td>
        <StateBadge state={task.state} />
      </td>
      <td>{task.assignee?.name ?? "—"}</td>
      <td>
        <ElapsedTime since={task.createdAt} />
      </td>
      <td>
        {task.state === "ROUTING" && task.routingStartedAt ? (
          <ElapsedTime since={task.routingStartedAt} />
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}

export default TaskRow;
