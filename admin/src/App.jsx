import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";  
const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <Navbar />

      <div className="flex flex-1">
        <div className="w-64 fixed top-0 left-0 h-screen z-10">
          <Sidebar />
        </div>

        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Wrap protected routes inside PrivateRoute */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
