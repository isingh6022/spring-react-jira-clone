import type { TaskEvent } from "../api/tasks";
import { ACTOR_LABELS, STATE_LABELS } from "../utils/labels";
import { formatDateTime } from "../utils/time";

function HistoryEvent({ event }: { event: TaskEvent }) {
  return (
    <li data-type={event.type}>
      <time dateTime={event.at}>{formatDateTime(event.at)}</time>{" "}
      <strong>{event.actorName ?? ACTOR_LABELS[event.actorType]}</strong>
      {event.actorName && <small> ({ACTOR_LABELS[event.actorType]})</small>}:{" "}
      {event.message}
      {event.toState && (
        <small>
          {" "}
          [{event.fromState ? `${STATE_LABELS[event.fromState]} → ` : ""}
          {STATE_LABELS[event.toState]}]
        </small>
      )}
    </li>
  );
}

export default HistoryEvent;
