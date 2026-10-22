import { useDemoMode } from "../hooks/useDemoMode";
import { useExpertiseAreas } from "../hooks/useExpertiseAreas";
import { hrefWith } from "../utils/url";
import TaskForm from "./TaskForm";

function CreateTaskDialog() {
  const { data: expertiseAreas } = useExpertiseAreas();
  const demoMode = useDemoMode();

  return (
    <dialog open>
      <h2>New task</h2>
      <TaskForm expertiseAreas={expertiseAreas} demoMode={demoMode} />
      <a href={hrefWith({ new: null })}>Close</a>
    </dialog>
  );
}

export default CreateTaskDialog;
