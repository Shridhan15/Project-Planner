import React, { useContext, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";

const Dashboard = () => {
  const { projects, users, getAllProjects, getAllUsers } =
    useContext(AdminContext);
  useEffect(() => {
    getAllProjects();
    getAllUsers();
  }, []);
  return (
    <div className="bg-white rounded-lg shadow p-6 min-h-[calc(100vh-120px)]">
      <h2 className="font-bold text-3xl mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-gray-50 shadow-sm">
          <i className="fas fa-layer-group fa-3x mb-2 text-blue-500"></i>
          <h3 className="text-xl font-semibold mb-1">Total Projects</h3>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-gray-50 shadow-sm">
          <i className="fas fa-user-friends fa-3x mb-2 text-green-500"></i>
          <h3 className="text-xl font-semibold mb-1">Total Users</h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
