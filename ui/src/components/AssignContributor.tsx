import type { ContributorDetail } from "../api/contributors";
import type { Task } from "../api/tasks";
import ContributorPicker from "./ContributorPicker";

// Only contributors with the task's expertise are offered.
function AssignContributor({
  task,
  contributors,
}: {
  task: Task;
  contributors: ContributorDetail[];
}) {
  const eligible = contributors.filter((c) =>
    c.expertise.some((a) => a.id === task.expertise.id),
  );

  if (eligible.length === 0) {
    return <p>No contributor has {task.expertise.name} expertise.</p>;
  }

  return (
    <span>
      <ContributorPicker
        name="contributorId"
        contributors={eligible}
        placeholder="Choose contributor…"
      />{" "}
      <button type="button">Assign</button>
    </span>
  );
}

export default AssignContributor;
