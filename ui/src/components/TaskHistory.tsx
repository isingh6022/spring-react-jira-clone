import type { TaskEvent } from "../api/tasks";
import HistoryEvent from "./HistoryEvent";

function TaskHistory({ events }: { events: TaskEvent[] }) {
  if (events.length === 0) {
    return <p>No history yet.</p>;
  }

  return (
    <ol>
      {events.map((e) => (
        <HistoryEvent key={e.id} event={e} />
      ))}
    </ol>
  );
}

export default TaskHistory;
