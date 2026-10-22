import { useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import { useUrlParams } from "../hooks/useUrlParams";
import { parseTaskFilters } from "../utils/url";
import ErrorMessage from "./ErrorMessage";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";

function TaskListPage() {
  const params = useUrlParams();
  const filters = useMemo(() => parseTaskFilters(params), [params]);
  const { data, loading, error } = useTasks(filters);

  return (
    <section>
      <h2>Tasks ({data.length})</h2>
      <TaskFilters filters={filters} />
      {loading && <p>Loading tasks…</p>}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <TaskTable tasks={data} />}
    </section>
  );
}

export default TaskListPage;
