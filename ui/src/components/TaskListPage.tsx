import { useMemo } from "react";
import { useLocation } from "react-router";
import { useTasks } from "../hooks/useTasks";
import { parseTaskFilters } from "../utils/url";
import ErrorMessage from "./ErrorMessage";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";

function TaskListPage() {
  const { search } = useLocation();
  const filters = useMemo(
    () => parseTaskFilters(new URLSearchParams(search)),
    [search],
  );
  const { data, loading, error } = useTasks(filters);

  return (
    <section>
      <h2>Tasks ({data.length})</h2>
      <TaskFilters key={search} filters={filters} />
      {loading && <p>Loading tasks…</p>}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <TaskTable tasks={data} />}
    </section>
  );
}

export default TaskListPage;
