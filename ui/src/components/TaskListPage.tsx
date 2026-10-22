import { useSearchParams } from "react-router";
import type { TaskState } from "../api/tasks";
import { useTasks } from "../hooks/useTasks";
import { keysOf, STATE_LABELS } from "../utils/labels";
import ErrorMessage from "./ErrorMessage";
import TaskTable from "./TaskTable";

function TaskListPage() {
  // The state filter lives in the URL (?state=ROUTING) so it survives a refresh.
  const [params, setParams] = useSearchParams();
  const state = (params.get("state") as TaskState | null) ?? undefined;
  const { data, loading, error } = useTasks(state);

  return (
    <section>
      <h2>Tasks ({data.length})</h2>
      <p>
        <label>
          State{" "}
          <select
            value={state ?? ""}
            onChange={(e) =>
              setParams(e.target.value ? { state: e.target.value } : {})
            }
          >
            <option value="">All</option>
            {keysOf(STATE_LABELS).map((s) => (
              <option key={s} value={s}>
                {STATE_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </p>
      {loading && <p>Loading tasks…</p>}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <TaskTable tasks={data} />}
    </section>
  );
}

export default TaskListPage;
