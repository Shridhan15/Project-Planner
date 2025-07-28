import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-60 bg-white shadow-lg p-5 flex flex-col space-y-4 border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Admin Panel</h2>

      <NavLink
        to="/projects"
        className={({ isActive }) =>
          `px-4 py-2 rounded-l-lg text-gray-700 hover:bg-gray-100 ${
            isActive
              ? "border-r-4 border-violet-600 font-semibold bg-violet-50"
              : ""
          }`
        }
      >
        Projects
      </NavLink>

      <NavLink
        to="/users"
        className={({ isActive }) =>
          `px-4 py-2 rounded-l-lg text-gray-700 hover:bg-gray-100 ${
            isActive
              ? "border-r-4 border-violet-600 font-semibold bg-violet-50"
              : ""
          }`
        }
      >
        Users
      </NavLink>
    </div>
  );
};

export default Sidebar;
