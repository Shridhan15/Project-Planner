import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // 👈 Import the sidebar
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <Navbar />

      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <div className="w-64 fixed top-0 left-0 h-screen z-10">
          <Sidebar />
        </div>

        {/* Main content with margin to accommodate fixed sidebar */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Users />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
