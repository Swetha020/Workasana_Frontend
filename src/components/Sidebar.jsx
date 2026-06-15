import { NavLink, useNavigate } from "react-router-dom";

import { MdSpaceDashboard } from "react-icons/md";
// import { PiSquaresFourBold } from "react-icons/pi";
import { RiTeamLine } from "react-icons/ri";
import { HiDocumentReport } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";

import { useState, useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    navigate("/login");
  };

  return (
    <>
      <aside>
        <h1 className="nav-brand">Workasana</h1>{" "}
      
        {user && (
          <div className="user-greeting">
            <p>Hi, {user.name} 👋</p>
          </div>
        )}
        <ul className="sidebar-links">
          <li>
            <NavLink to="/home" className="link-item">
              <MdSpaceDashboard />
              <span>Dashboard</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/" className="link-item">
              <PiSquaresFourBold />
              <span>Projects</span>
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/teams" className="link-item">
              <RiTeamLine />
              <span>Teams</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/report" className="link-item">
              <HiDocumentReport />
              <span>Reports</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className="link-item">
              <IoSettings />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
        <div className="logout-section">
          <p onClick={handleLogout}>
            <span>
              <IoLogOut />
            </span>{" "}
            Logout
          </p>
        </div>
      </aside>
    </>
  );
}
