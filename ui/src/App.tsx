import { Route, Routes } from "react-router";
import "./App.css";
import ContributorsPanel from "./components/ContributorsPanel";
import CreateTaskPage from "./components/CreateTaskPage";
import DemoModeProvider from "./components/DemoModeProvider";
import Header from "./components/Header";
import MockData from "./components/MockData";
import NotFoundPage from "./components/NotFoundPage";
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
          <Route path="/contributors" element={<ContributorsPanel />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer>
        <MockData />
      </footer>
    </DemoModeProvider>
  );
}

export default App;
