import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { FiMenu ,FiX} from "react-icons/fi";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <header className="mobile-header">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        <h3 className="app-title">Workasana</h3>
      </header>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
