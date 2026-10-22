import type { Task } from "../api/tasks";
import TaskRow from "./TaskRow";

function TaskTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p>No tasks match these filters.</p>;
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
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
      </tbody>
    </table>
  );
}

export default TaskTable;
