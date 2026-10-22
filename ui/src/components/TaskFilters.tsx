import { Link } from "react-router";
import type { TaskFilters as Filters } from "../api/tasks";
import { useContributors } from "../hooks/useContributors";
import { useExpertiseAreas } from "../hooks/useExpertiseAreas";
import {
  PRIORITY_LABELS,
  STATE_LABELS,
  TASK_PRIORITIES,
  TASK_STATES,
} from "../utils/labels";
import ContributorPicker from "./ContributorPicker";

// A plain GET form: submitting it writes the filters into the URL.
function TaskFilters({ filters }: { filters: Filters }) {
  const { data: contributors } = useContributors();
  const { data: expertiseAreas } = useExpertiseAreas();

  return (
    <form method="get">
      <label>
        State{" "}
        <select name="state" defaultValue={filters.state ?? ""}>
          <option value="">All</option>
          {TASK_STATES.map((s) => (
            <option key={s} value={s}>
              {STATE_LABELS[s]}
            </option>
          ))}
        </select>
      </label>{" "}

      <label>
        Contributor{" "}
        <ContributorPicker
          name="contributor"
          contributors={contributors}
          defaultValue={filters.contributorId}
          placeholder="All"
        />
      </label>{" "}

      <label>
        Priority{" "}
        <select name="priority" defaultValue={filters.priority ?? ""}>
          <option value="">All</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </label>{" "}

      <label>
        Expertise{" "}
        <select name="expertise" defaultValue={filters.expertiseId ?? ""}>
          <option value="">All</option>
          {expertiseAreas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </label>{" "}

      <button type="submit">Apply</button>{" "}
      <Link to="/">Clear</Link>
    </form>
  );
}

export default TaskFilters;
