import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Define context properly (DO NOT use useContext here)
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [atoken, setAtoken] = useState(
    () => localStorage.getItem("adminToken") || ""
  );

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllProjects = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/getprojects`, {
        headers: {
          atoken,
        },
      });

      if (response.data.success) {
        setProjects(response.data.projects);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects");
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/getusers`, {
        headers: {
          atoken,
        },
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    }
  };

  const value = {
    backendUrl,
    projects,
    setProjects,
    getAllProjects,
    users,
    getAllUsers,
    setUsers,
    atoken,
    setAtoken,
    loading,
    setLoading,
    error,
    setError,
    navigate,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
