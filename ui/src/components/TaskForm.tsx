import type { ExpertiseArea } from "../api/contributors";
import type { Task } from "../api/tasks";
import { PRIORITY_LABELS, TASK_PRIORITIES } from "../utils/labels";

// Used for create (no task) and edit (task given). The demo flag is set only on create.
function TaskForm({
  task,
  expertiseAreas,
  demoMode,
}: {
  task?: Task;
  expertiseAreas: ExpertiseArea[];
  demoMode: boolean;
}) {
  return (
    <form>
      <p>
        <label>
          Title <input name="title" required defaultValue={task?.title} />
        </label>
      </p>
      <p>
        <label>
          Description{" "}
          <textarea name="description" defaultValue={task?.description} />
        </label>
      </p>
      <p>
        <label>
          Expertise{" "}
          <select
            name="expertiseId"
            required
            defaultValue={task?.expertise.id ?? ""}
          >
            <option value="" disabled>
              Choose…
            </option>
            {expertiseAreas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </p>
      <p>
        <label>
          Priority{" "}
          <select name="priority" defaultValue={task?.priority ?? "MEDIUM"}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
      </p>
      {demoMode && !task && (
        <p>
          <label>
            <input type="checkbox" name="demoNeverRoutes" /> Demo: automatic
            routing never returns for this task
          </label>
        </p>
      )}
      <button type="submit">{task ? "Save" : "Create and route"}</button>
    </form>
  );
}

export default TaskForm;
