import type { TaskState } from "../api/tasks";
import { STATE_LABELS } from "../utils/labels";

function StateBadge({ state }: { state: TaskState }) {
  return <span data-state={state}>{STATE_LABELS[state]}</span>;
}

export default StateBadge;
