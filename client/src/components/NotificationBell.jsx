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
    navigate,
    requestStatusByProject,
    setRequestStatusByProject,
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
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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

  const handleAccept = async (requestId, projectId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/project/accept-request/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Join request accepted successfully");
        setNotifications((prev) =>
          prev.map((n) =>
            n.project._id === projectId ? { ...n, isRead: true } : n
          )
        );
        setHasUnread(false);
      } else {
        toast.error(response.data.message || "Failed to accept join request");
      }
    } catch (error) {
      console.error("Error accepting project:", error);
      toast.error(error.message);
    }
  };

  const handleReject = async (requestId, projectId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/project/reject-request/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Join request rejected.");
        setNotifications((prev) =>
          prev.map((n) =>
            n.project._id === projectId ? { ...n, isRead: true } : n
          )
        );
        setHasUnread(false);
      } else {
        toast.error(response.data.message || "Failed to reject join request");
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
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
        <div className="absolute right-0 mt-2 w-80 bg-slate-100 shadow-md rounded-md z-50 p-2 max-h-180 overflow-y-auto">
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
                className={`p-4 border rounded-md mb-4 shadow-sm ${
                  notif.isRead ? "bg-white" : "bg-gray-100 font-medium"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    onClick={() => handleNotificationClick(notif._id)}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {notif.message}{" "}
                    {notif.type === "joinRequest" && (
                      <button
                        onClick={() => navigate(`/author/${notif.sender._id}`)}
                        className="text-blue-600 font-medium cursor-pointer hover:underline"
                      >
                        See Profile
                      </button>
                    )}
                    {notif.type === "joinRequest" && (
                      <span className="text-gray-500">
                        . Check your email to contact.
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2 ml-4">
                    <FaTimes
                      className="text-red-500 text-lg cursor-pointer"
                      onClick={() => handleDeleteNotification(notif._id)}
                    />
                  </div>
                </div>

                {requestStatusByProject &&
                  requestStatusByProject[notif.project._id] && (
                    <p className="text-sm text-gray-500">
                      Request Status:{" "}
                      <span className="font-medium">
                        {requestStatusByProject[notif.project._id]}
                      </span>
                    </p>
                  )}

                {notif.type === "joinRequest" && (
                  <div className="flex justify-start gap-3 mt-2">
                    <button
                      onClick={() =>
                        handleAccept(notif.joinRequest, notif.project._id)
                      }
                      className=" cursor-pointer px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleReject(notif.joinRequest, notif.project._id)
                      }
                      className=" cursor-pointer px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
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
