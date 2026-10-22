import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import type { Expertise } from "../api/contributors";
import { createTask, type TaskPriority } from "../api/tasks";
import { useDemoMode } from "../hooks/useDemoMode";
import { useTaskMutation } from "../hooks/useTaskMutation";
import { EXPERTISE_LABELS, keysOf, PRIORITY_LABELS } from "../utils/labels";
import ErrorMessage from "./ErrorMessage";

function CreateTaskPage() {
  const demoMode = useDemoMode();
  const navigate = useNavigate();
  const { run, pending, error } = useTaskMutation((task) =>
    navigate(`/tasks/${task.id}`),
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    run(() =>
      createTask({
        title: String(form.get("title")),
        expertise: form.get("expertise") as Expertise,
        priority: form.get("priority") as TaskPriority,
        demoNeverRoutes: form.get("demoNeverRoutes") === "on",
      }),
    );
  };

  return (
    <section>
      <h2>New task</h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit}>
        <p>
          <label>
            Title <input name="title" required maxLength={200} />
          </label>
        </p>
        <p>
          <label>
            Expertise{" "}
            <select name="expertise" required defaultValue="">
              <option value="" disabled>
                Choose…
              </option>
              {keysOf(EXPERTISE_LABELS).map((x) => (
                <option key={x} value={x}>
                  {EXPERTISE_LABELS[x]}
                </option>
              ))}
            </select>
          </label>
        </p>
        <p>
          <label>
            Priority{" "}
            <select name="priority" defaultValue="MEDIUM">
              {keysOf(PRIORITY_LABELS).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </label>
        </p>
        {demoMode && (
          <p>
            <label>
              <input type="checkbox" name="demoNeverRoutes" /> Demo: automatic
              routing never returns for this task
            </label>
          </p>
        )}
        <button type="submit" disabled={pending}>
          Create and route
        </button>
      </form>
      <Link to="/">Back to tasks</Link>
    </section>
  );
}

export default CreateTaskPage;
