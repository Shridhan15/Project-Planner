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
        // toast.success("Notification deleted successfully");
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
          prev.map((n) => {
            if (n.joinRequest && n.joinRequest._id === requestId) {
              return {
                ...n,
                isRead: true,
                joinRequest: { ...n.joinRequest, status: "Accepted" },
              };
            } else if (n.project._id === projectId) {
              return { ...n, isRead: true };
            } else {
              return n;
            }
          })
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

  console.log("Notifications:", notifications);

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
          prev.map((n) => {
            if (n.joinRequest && n.joinRequest._id === requestId) {
              return {
                ...n,
                isRead: true,
                joinRequest: { ...n.joinRequest, status: "Rejected" },
              };
            } else if (n.project._id === projectId) {
              return { ...n, isRead: true };
            } else {
              return n;
            }
          })
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
    <div className="relative mr-4" ref={dropdownRef}>
      {/* Bell Icon */}
      <FaBell
        className="text-gray-300 w-6 h-6 cursor-pointer hover:text-violet-300 transition"
        onClick={handleBellClick}
      />

      {/* Red Dot */}
      {hasUnread && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 shadow-red-500/50 shadow"></span>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto 
  bg-[#1d142a]/80 backdrop-blur-xl rounded-2xl shadow-xl 
  border border-violet-400/20 p-3 z-50 animate-fadeIn"
        >
          {/* Mark all as read */}
          {notifications.length > 0 && hasUnread && (
            <button
              onClick={handleMarkAllRead}
              className="text-blue-300 hover:text-blue-200 text-xs underline mb-2 cursor-pointer"
            >
              Mark all as read
            </button>
          )}

          {/* No Notifications */}
          {notifications.length === 0 && (
            <p className="text-sm text-gray-300 p-2 text-center">
              No notifications
            </p>
          )}

          {/* Notifications List */}
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`rounded-xl p-4 mb-3 border shadow transition-all
          ${
            notif.isRead
              ? "bg-white/5 border-white/10"
              : "bg-violet-500/10 border-violet-400/20 shadow-violet-500/10"
          }`}
            >
              {/* Header Row */}
              <div className="flex justify-between items-start mb-2">
                {/* Message */}
                <span
                  onClick={() => handleNotificationClick(notif._id)}
                  className="text-sm text-gray-200 flex-1 cursor-pointer leading-snug"
                >
                  {notif.message}{" "}
                  {notif.type === "joinRequest" && (
                    <button
                      onClick={() => navigate(`/author/${notif.sender._id}`)}
                      className="text-violet-300 cursor-pointer hover:text-violet-200 ml-1 underline"
                    >
                      See Profile
                    </button>
                  )}
                  {notif.type === "joinRequest" && (
                    <span className="text-gray-400 text-xs ml-1">
                      • Check your email to contact
                    </span>
                  )}
                </span>

                {/* Delete */}
                <FaTimes
                  className="text-red-400 text-lg cursor-pointer hover:text-red-300 transition"
                  onClick={() => handleDeleteNotification(notif._id)}
                />
              </div>

              {/* Request Status (Global) */}
              {requestStatusByProject &&
                requestStatusByProject[notif.project._id] && (
                  <p className="text-xs text-gray-400">
                    Status:{" "}
                    <span className="font-medium text-gray-200">
                      {requestStatusByProject[notif.project._id]}
                    </span>
                  </p>
                )}

              {/* Join Request Action Buttons */}
              {notif.type === "joinRequest" && notif.joinRequest?.status && (
                <div className="mt-3">
                  {/* ACCEPTED */}
                  {notif.joinRequest.status === "Accepted" && (
                    <span className="text-sm text-green-300 bg-green-500/20 px-3 py-1 rounded-lg border border-green-400/30">
                      Request Accepted
                    </span>
                  )}

                  {/* REJECTED */}
                  {notif.joinRequest.status === "Rejected" && (
                    <span className="text-sm text-red-300 bg-red-500/20 px-3 py-1 rounded-lg border border-red-400/30">
                      Request Rejected
                    </span>
                  )}

                  {/* PENDING (Sent) */}
                  {notif.joinRequest.status === "Sent" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleAccept(notif.joinRequest._id, notif.project._id)
                        }
                        className="cursor-pointer px-4 py-1 text-sm bg-green-500/30 
                    text-green-200 border border-green-400/30 rounded-lg 
                    hover:bg-green-500/40 transition active:scale-95"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleReject(notif.joinRequest._id, notif.project._id)
                        }
                        className="cursor-pointer px-4 py-1 text-sm bg-red-500/30 
                    text-red-200 border border-red-400/30 rounded-lg 
                    hover:bg-red-500/40 transition active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
