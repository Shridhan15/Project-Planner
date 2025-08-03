import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const {
    token,
    setToken,
    navigate,
    userProfile,
    setUserProfile,
    projectsData,
    setFilteredProjects,
  } = useContext(ProjectContext);

  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const logout = () => {
    setUserProfile(null);
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    if (!keyword.trim()) {
      setFilteredProjects(projectsData);
      return;
    }

    const filtered = projectsData.filter((project) => {
      const skillsMatch = project.skillsRequired.some((skill) =>
        skill.toLowerCase().includes(keyword)
      );
      const techMatch = project.techStack.some((tech) =>
        tech.toLowerCase().includes(keyword)
      );
      return skillsMatch || techMatch;
    });

    setFilteredProjects(filtered);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-between items-center p-2">
        {/* Left: Logo */}
        <div>
          <Link to="/" className="flex items-center gap-2 ml-2">
            <img
              className="h-15 w-15 rounded-full"
              src={assets.logo}
              alt="logo"
            />
            <span className="font-bold text-2xl text-violet-500">
              ProjectPartner
            </span>
          </Link>
        </div>

        {/* Middle: Search input (only on homepage) */}
        {location.pathname === "/" && (
          <div className="hidden md:block md:ml-6 w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by skill or tech stack..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Right: Notification + Profile */}
        <div className="flex items-center gap-4 mr-4">
          {token && <NotificationBell token={token} />}

          <div className="group relative">
            <img
              className="rounded-full h-12 w-12 cursor-pointer"
              src={userProfile?.profileImage || assets.profile_icon}
              alt="profile"
            />
            <div className="group-hover:block hidden absolute right-0 pt-4 z-10">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                <Link to="/profile" className="cursor-pointer hover:text-black">
                  My Profile
                </Link>

                {token && token !== "" ? (
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={logout}
                  >
                    Logout
                  </p>
                ) : (
                  <Link to="/login" className="cursor-pointer hover:text-black">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
