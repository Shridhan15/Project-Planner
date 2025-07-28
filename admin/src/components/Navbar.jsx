import React from "react";
import { assets } from "../assets/assets";
 

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src={assets.logo}
          alt="Logo"
          className="h-13 rounded-full w-13 object-contain"
        />
        <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
      </div>
    </nav>
  );
};

export default Navbar;
