import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";

const Navbar = () => {
  const { navigate, atoken, setAtoken } = useContext(AdminContext);
  const handleLogout = async () => {
    localStorage.removeItem("atoken");
    setAtoken(null);
    navigate("/login");
  };
  return (
    <nav className="bg-white z-10 shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src={assets.logo}
          alt="Logo"
          className="h-13 rounded-full w-13 object-contain"
        />
        <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
      </div>
      <button onClick={handleLogout} className={`bg-red-500  text-white px-4 py-2 rounded-full cursor-pointer shadow hover:bg-red-600 transition-colors duration-200 ${atoken ? "" : "hidden"}`}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
