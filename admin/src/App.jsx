import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Queries from "./pages/Queries.jsx";
import { AdminContext } from "./context/AdminContext";

const App = () => {
  const { atoken } = useContext(AdminContext);
 
  if (!atoken) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <ToastContainer />
        <div className="w-full   bg-white shadow-md rounded-lg">
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <Navbar />

      <div className="flex flex-1">
        <div className="w-64 fixed top-[64px] left-0 h-[calc(100vh-64px)]">
          <Sidebar />
        </div> 
        <main className="flex-1 ml-64 p-6 overflow-y-auto  ">
          <Routes>
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
              path="/queries"
              element={
                <PrivateRoute>
                  <Queries />
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
