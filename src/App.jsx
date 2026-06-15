import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./protected-route/ProtectedRoute.jsx";
import Teams from "./pages/Teams.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import TeamDetail from "./pages/TeamDetail.jsx";
import TaskDetail from "./pages/TaskDetail.jsx";
import Report from "./pages/Report.jsx";
import Settings from "./pages/Settings.jsx";
import { ToastContainer, Zoom } from "react-toastify";

function App() {

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Private Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />;
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:teamId" element={<TeamDetail />} />
              <Route path="/tasks/:taskId" element={<TaskDetail />} />
              <Route path="/report" element={<Report />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom}
        />
      </Router>
    </UserProvider>
  );
}

export default App;
