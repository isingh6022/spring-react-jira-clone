import { Link } from "react-router";
import type { Task } from "../api/tasks";
import { EXPERTISE_LABELS, PRIORITY_LABELS } from "../utils/labels";
import ElapsedTime from "./ElapsedTime";
import StateBadge from "./StateBadge";

function TaskTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p>No tasks.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Priority</th>
          <th>Expertise</th>
          <th>State</th>
          <th>Assignee</th>
          <th>Created</th>
          <th>Routing for</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} data-priority={task.priority}>
            <td>{task.id}</td>
            <td>
              <Link to={`/tasks/${task.id}`}>{task.title}</Link>
              {task.demoNeverRoutes && <small> (demo: never routes)</small>}
            </td>
            <td>{PRIORITY_LABELS[task.priority]}</td>
            <td>{EXPERTISE_LABELS[task.expertise]}</td>
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
        ))}
      </tbody>
    </table>
  );
}

export default TaskTable;
