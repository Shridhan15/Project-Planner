import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

// ✅ Define context properly (DO NOT use useContext here)
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [atoken, setAtoken] = useState(
    () => localStorage.getItem("atoken") || ""
  );
  const [queries, setQueries] = useState([]);

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
  const fetchQueries = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/admin/queries", {
        headers: { atoken },
      });

      if (response.data.success) {
        // Sort: isResponded = false comes first
        const sorted = response.data.queries.sort((a, b) => {
          return a.isResponded === b.isResponded ? 0 : a.isResponded ? 1 : -1;
        });

        setQueries(sorted);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      setError("Failed to fetch queries");
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
    fetchQueries,
    queries,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
