import React, { useContext, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";

const Dashboard = () => {
  const { projects, users, getAllProjects ,getAllUsers} = useContext(AdminContext);
  useEffect(() => {
    getAllProjects();
    getAllUsers()
  }, []);
  return (
    <div className="">
      <h2 className="font-bold text-3xl">Dashboard</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <i className="fas fa-layer-group fa-3x"></i>
          <h3 className="text-xl font-semibold">Total Projects </h3>
          <p className="text-2xl">{projects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <i className="fas fa-user-friends fa-3x"></i>
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-2xl">{users.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
