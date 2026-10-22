import { Link } from "react-router";
import { useDemoMode } from "../hooks/useDemoMode";
import { useExpertiseAreas } from "../hooks/useExpertiseAreas";
import TaskForm from "./TaskForm";

function CreateTaskPage() {
  const { data: expertiseAreas } = useExpertiseAreas();
  const demoMode = useDemoMode();

  return (
    <section>
      <h2>New task</h2>
      <TaskForm expertiseAreas={expertiseAreas} demoMode={demoMode} />
      <Link to="/">Back to tasks</Link>
    </section>
  );
}

export default CreateTaskPage;
