import { useContributors } from "../hooks/useContributors";
import { useDemoMode } from "../hooks/useDemoMode";
import { useTask } from "../hooks/useTask";
import { hrefWith } from "../utils/url";
import DemoActions from "./DemoActions";
import ErrorMessage from "./ErrorMessage";
import TaskActions from "./TaskActions";
import TaskHistory from "./TaskHistory";
import TaskSummary from "./TaskSummary";

function TaskDetailPage({ id }: { id: number }) {
  const { data: task, loading, error } = useTask(id);
  const { data: contributors } = useContributors();
  const demoMode = useDemoMode();

  if (loading) {
    return <p>Loading task…</p>;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }
  if (!task) {
    return <ErrorMessage message={`Task ${id} not found.`} />;
  }

  return (
    <section>
      <h2>
        #{task.id} {task.title}
      </h2>
      <a href={hrefWith({ task: null })}>Close</a>

      <TaskSummary task={task} />

      <h3>Operator actions</h3>
      <TaskActions task={task} contributors={contributors} />

      {demoMode && (
        <>
          <h3>Demo: contributor actions</h3>
          <DemoActions task={task} />
        </>
      )}

      <h3>History</h3>
      <TaskHistory events={task.history} />
    </section>
  );
}

export default TaskDetailPage;
