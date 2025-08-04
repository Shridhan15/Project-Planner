import React, { createContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export const ProjectContext = createContext();

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
  const [hasUnread, setHasUnread] = useState(false);

  const socket = useRef(null); // ✅ socket managed via ref

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

  const fetchUserProfile = async () => {
    if (!token) {
      setLoadingProfile(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const user = response.data.user;
        setUserProfile(user);

        // ✅ Connect socket only once
        if (!socket.current) {
          socket.current = io(backendUrl);
        }

        // ✅ Register user
        socket.current.emit("register", user._id);

        // ✅ Listen to new notifications
        socket.current.on("new_notification", (notification) => {
          console.log("📨 New Notification:", notification);
          setNotifications((prev) => [notification, ...prev]);
          setHasUnread(true);
          toast.info(notification.message);
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchNotifications();
    } else {
      setLoadingProfile(false);
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect(); // ✅ Cleanup on unmount
      }
    };
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
    notifications,
    setNotifications,
    setHasUnread,
    unreadCount,
    hasUnread,
  };

  return (
    <ProjectContext.Provider value={value}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
