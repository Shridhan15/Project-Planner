import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import { toast } from "react-toastify";
import { useRef } from "react";

const NotificationBell = ({ token }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    backendUrl,
    hasUnread,
    setHasUnread,
    notifications,
    setNotifications,
  } = useContext(ProjectContext);

  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        console.log("Fetched notifications:", res.data);
      }

      const data = res.data.notifications || [];
      setNotifications(data);

      setHasUnread(data.some((n) => !n.isRead));
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const handleNotificationClick = async (notifId) => {
    try {
      await axios.put(
        backendUrl + "/api/notifications/" + notifId + "/mark-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
      setHasUnread(notifications.some((n) => n._id !== notifId && !n.isRead));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(error.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await axios.put(
        backendUrl + "/api/notifications/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        setHasUnread(false);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowDropdown((prev) => !prev);
  };
  const handleDeleteNotification = async (notifId) => {
    try {
      const response = await axios.delete(
        backendUrl + "/api/notifications/" + notifId + "/delete",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== notifId));
        toast.success("Notification deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="relative mr-4 " ref={dropdownRef}>
      <FaBell
        className="text-gray-700 w-6 h-6 cursor-pointer"
        onClick={handleBellClick}
      />
      {hasUnread && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600"></span>
      )}

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-100 shadow-md rounded-md z-50 p-2 max-h-60 overflow-y-auto">
          {notifications.length > 0 && hasUnread && (
            <a
              onClick={handleMarkAllRead}
              className="mb-2  text-sm   text-blue-400 rounded hover:text-blue-800 cursor-pointer underline"
            >
              Mark all as read
            </a>
          )}
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-2 text-sm border-b mb-2 rounded cursor-pointer flex justify-between items-center ${
                  notif.isRead ? "bg-white" : "bg-gray-200 text-green-400"
                }`}
              >
                <span
                  onClick={() => handleNotificationClick(notif._id)}
                  className="flex-1"
                >
                  {notif.message}
                </span>

                <FaTimes
                  className="text-red-500 ml-2 cursor-pointer"
                  onClick={() => handleDeleteNotification(notif._id)}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 p-2">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
