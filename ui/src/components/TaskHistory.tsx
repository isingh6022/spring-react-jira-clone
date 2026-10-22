import type { TaskEvent } from "../api/tasks";
import { formatDateTime } from "../utils/time";
import StateBadge from "./StateBadge";

function TaskHistory({ events }: { events: TaskEvent[] }) {
  if (events.length === 0) {
    return <p>No history yet.</p>;
  }

  return (
    <ol>
      {events.map((e) => (
        <li key={e.id}>
          <time dateTime={e.at}>{formatDateTime(e.at)}</time>{" "}
          <strong>{e.actor}</strong>: {e.message}{" "}
          {e.state && <StateBadge state={e.state} />}
        </li>
      ))}
    </ol>
  );
}

export default TaskHistory;
