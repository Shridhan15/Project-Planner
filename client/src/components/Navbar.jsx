import React, { useState, useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
import NotificationBell from "./NotificationBell";
import { MessageCircle } from "lucide-react";

const Navbar = () => {
  const {
    token,
    setToken,
    navigate,
    userProfile,
    setUserProfile,
    projectsData,
    setFilteredProjects,
    searchTerm,
    setSearchTerm,
    fetchUserProfile,
  } = useContext(ProjectContext);

  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // ⭐ NEW: Reference for menu container
  const menuRef = useRef(null);

  // ⭐ NEW: Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const logout = () => {
    setUserProfile(null);
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    if (!keyword.trim()) {
      setFilteredProjects(projectsData);
      return;
    }

    const filtered = projectsData.filter((project) => {
      const skillsMatch = project.skillsRequired?.some((skill) =>
        skill.toLowerCase().includes(keyword)
      );
      const techMatch = project.techStack?.some((tech) =>
        tech.toLowerCase().includes(keyword)
      );

      return skillsMatch || techMatch;
    });

    setFilteredProjects(filtered);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-sm bg-gradient-to-r from-slate-900/80 via-violet-900/80 to-black/70 border-b border-black/20">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={assets.logo}
              alt="logo"
            />
            <span className="font-bold text-xl text-white select-none">
              ProjectPartner
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        {location.pathname === "/" && (
          <div className="hidden md:block md:ml-6 w-full max-w-lg">
            <input
              type="text"
              placeholder="Search by skill or tech stack..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-full bg-slate-800 text-gray-100 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>
        )}

        {/* Notification + Profile */}
        <div className="flex items-center gap-4 ml-4">
          {token && <NotificationBell token={token} />}

          {token && (
            <div className="mr-2">
              <Link to="/messages" className="relative">
                <MessageCircle className="h-7 w-7 text-white hover:text-violet-300 cursor-pointer" />
              </Link>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="cursor-pointer rounded-full h-11 w-11 overflow-hidden border-2 border-transparent hover:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <img
                className="h-full w-full object-cover"
                src={userProfile?.profileImage || assets.profile_icon}
                alt="profile"
              />
            </button>

            {/* ⭐ MENU WITH REF */}
            <div
              ref={menuRef}
              className={`absolute right-0 mt-2 z-50 w-44 transform origin-top-right transition duration-150 ${
                menuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="bg-slate-800 text-gray-100 rounded-lg shadow-lg border border-slate-700 py-2 px-3">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-2 hover:text-violet-300"
                >
                  My Profile
                </Link>

                {token ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left py-2 px-2 hover:text-violet-300"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-2 hover:text-violet-300"
                  >
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
