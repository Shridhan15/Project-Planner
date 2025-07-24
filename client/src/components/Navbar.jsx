import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";

const Navbar = () => {
  const { token, setToken, navigate } = useContext(ProjectContext);
  console.log("Token in Navbar:", token);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
  };
  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-between gap-2 items-center p-2">
        <div>
          <Link to="/" className="flex items-center gap-2 ml-2">
            <img className="h-15 w-15" src={assets.logo} alt="" />
            <span>ProjectPartner</span>
          </Link>
        </div>

        <div className="group relative">
          <img className="w-8 mr-4" src={assets.profile_icon} alt="" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 ">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <Link to="/profile" className="cursor-pointer hover:text-black">
                My Profile
              </Link>

              {token && token !== "" ? (
                <p className="cursor-pointer hover:text-black" onClick={logout}>
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
    </nav>
  );
};

export default Navbar;
