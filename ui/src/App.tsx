import { Route, Routes } from "react-router";
import "./App.css";
import ContributorsPage from "./components/ContributorsPage";
import CreateTaskPage from "./components/CreateTaskPage";
import DemoModeProvider from "./components/DemoModeProvider";
import Header from "./components/Header";
import TaskDetailPage from "./components/TaskDetailPage";
import TaskListPage from "./components/TaskListPage";

function App() {
  return (
    <DemoModeProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<CreateTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/contributors" element={<ContributorsPage />} />
        </Routes>
      </main>
    </DemoModeProvider>
  );
}

export default App;
