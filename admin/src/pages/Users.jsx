import React, { useContext, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { assets } from "../assets/assets";
import axios from "axios";

const Users = () => {
  const { backendUrl, users, getAllUsers, atoken, getAllProjects } =
    useContext(AdminContext);

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/user/delete/${userId}`,
        { headers: { atoken } }
      );
      const data = await res.data;
      if (data.success) {
        toast.success("User deleted successfully");
        getAllUsers();
        getAllProjects();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.log("Error deleting user: ", error);
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 min-h-[calc(100vh-120px)]">
      <h2 className="text-2xl font-bold mb-8">All Users</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3">S. No</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Joined On</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="border-t text-sm">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      src={user.profileImage || assets.profile_icon}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{user.name}</td>
                  <td className="px-4 py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                    >
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
