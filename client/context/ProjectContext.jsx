import React, { createContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import MessageNotification from "../src/components/MessageNotification";

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
  const [requestStatusByProject, setRequestStatusByProject] = useState({});
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageNotifications, setMessageNotifications] = useState([]);

  const socket = useRef(null); // socket managed via ref

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

        // Connect socket only once
        if (!socket.current) {
          socket.current = io(backendUrl, {
            transports: ["websocket"],
            withCredentials: true,
          });
        }

        // Register user
        socket.current.emit("register", user._id);

        // 🔥 Prevent duplicate listeners
        socket.current.off("new_notification");

        // New listener
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
    const fetchSentRequests = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/user/join-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          const requests = response.data.requestsByProject;
          setRequestStatusByProject(requests);
        }
      } catch (error) {
        console.error("Error fetching sent requests:", error);
      }
    };
    if (userProfile?._id) {
      fetchSentRequests();
    }
  }, [userProfile]);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchNotifications();
    } else {
      setLoadingProfile(false);
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect(); // Cleanup on unmount
      }
    };
  }, [token]);

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    setFilteredProjects(projectsData);
  }, [projectsData]);

  // normalize means to standardize the format of data i.e., making all strings lowercase, trimming whitespace, and splitting by commas, so that we can easily match skills and technologies
  const normalizeArray = (arr) => {
    return arr
      .flatMap((item) => item.split(","))
      .map((str) => str.trim().toLowerCase())
      .filter(Boolean);
  };

  useEffect(() => {
    if (projectsData.length > 0 && userProfile) {
      const userSkills = normalizeArray(userProfile.skills || []);
      const userTechs = normalizeArray(userProfile.technologiesKnown || []);

      const recommended = projectsData
        .filter((project) => project.author._id !== userProfile._id)
        .filter((project) => project.status?.trim().toLowerCase() === "open")
        .filter((project) => {
          const projectSkills = normalizeArray(project.skillsRequired || []);
          const projectTechs = normalizeArray(project.techStack || []);
          return (
            projectSkills.some(
              (skill) => userSkills.includes(skill) || userTechs.includes(skill)
            ) ||
            projectTechs.some(
              (tech) => userSkills.includes(tech) || userTechs.includes(tech)
            )
          );
        });
      console.log("✅ Recommended Projects:", recommended);

      setRecommendedProjects(recommended);
    }
  }, [projectsData, userProfile]);

  useEffect(() => {
    if (!token || !userProfile?._id) return;

    const eventSource = new EventSource(
      `${backendUrl}/api/messages/sse?token=${token}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") return;

        if (data.to_user_id._id === userProfile._id) {
          pushMessageNotification(data.from_user_id, data.text);

          if (Notification.permission === "granted") {
            new Notification(`${data.from_user_id.name}`, { body: data.text });
          }
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [backendUrl, token, userProfile]);

  const pushMessageNotification = (sender, message) => {
    const id = Date.now();
    setMessageNotifications((prev) => [...prev, { id, sender, message }]);
  };

  const removeMessageNotification = (id) => {
    setMessageNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
    requestStatusByProject,
    setRequestStatusByProject,
    recommendedProjects,
    searchTerm,
    setSearchTerm,
    pushMessageNotification,
    messageNotifications,
    setMessageNotifications,
    removeMessageNotification,
  };

  return (
    <ProjectContext.Provider value={value}>
      {props.children}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {messageNotifications.map((n) => (
          <MessageNotification
            key={n.id}
            notification={n}
            onClose={removeMessageNotification}
          />
        ))}
      </div>
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
