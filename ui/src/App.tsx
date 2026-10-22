import "./App.css";
import ContributorsPanel from "./components/ContributorsPanel";
import CreateTaskDialog from "./components/CreateTaskDialog";
import Header from "./components/Header";
import MockData from "./components/MockData";
import TaskDetailPage from "./components/TaskDetailPage";
import TaskListPage from "./components/TaskListPage";
import { useUrlParams } from "./hooks/useUrlParams";

function App() {
  const params = useUrlParams();
  const taskId = Number(params.get("task"));

  return (
    <div>
      <Header />
      {params.get("new") === "1" && <CreateTaskDialog />}
      <main>
        <TaskListPage />
        {taskId > 0 && <TaskDetailPage id={taskId} />}
        <ContributorsPanel />
      </main>
      <footer>
        <MockData />
      </footer>
    </div>
  );
}

export default App;
