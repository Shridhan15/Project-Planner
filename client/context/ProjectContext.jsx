import React from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const ProjectContext = createContext();
import dummyProjects from "../src/assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const ProjectContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [projectsData, setProjectsData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const getAllProjects = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/project/getprojects");
      if (response.data.success) {
        const sortedProjects = response.data.projects.sort((a, b) => {
          const statusA = a.status?.trim().toLowerCase();
          const statusB = b.status?.trim().toLowerCase();

          if (statusA === statusB) return 0;
          if (statusA === "open") return -1;
          if (statusB === "open") return 1;
          return 0;
        });

        setProjectsData(sortedProjects);
      } else {
        console.error("Failed to fetch projects:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchUserProfile = async () => {
    if (!token) {
      console.error("No token found, cannot fetch user profile.");
      setLoadingProfile(false); // Even if token is missing, stop loading
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserProfile(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again later.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications);
      const unread = res.data.notifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchNotifications();
    } else {
      setLoadingProfile(false);
    }
  }, [token]);
  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    setFilteredProjects(projectsData);
  }, [projectsData]);

  const value = {
    backendUrl,
    token,
    setToken,
    navigate,
    projectsData,
    setProjectsData,
    getAllProjects,
    isAuthenticated,
    setIsAuthenticated,
    setFilteredProjects,
    filteredProjects,
    userProfile,
    setUserProfile,
    loadingProfile,
    fetchUserProfile,
    fetchNotifications,
  };

  return (
    <ProjectContext.Provider value={value}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
