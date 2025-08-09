import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const Sidebar = () => {
  const { atoken } = useContext(AdminContext);

  return (
    atoken && (
      <div className="h-screen w-60 bg-white shadow-lg py-6 px-4 flex flex-col space-y-2 border-r border-gray-200">
        {[
          { to: "/", label: "Dashboard" },
          { to: "/projects", label: "Projects" },
          { to: "/users", label: "Users" },
          { to: "/queries", label: "Queries" },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-gray-700 transition-colors duration-200 ${
                isActive
                  ? "bg-violet-100 border-r-4 border-violet-500   text-violet-800 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    )
  );
};

export default Sidebar;
