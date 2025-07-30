import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";

const NotificationBell = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const { backendUrl } = useContext(ProjectContext);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if(res.data.success){
        console.log("Fetched notifications:", res.data);

      }

      // Extract notifications array properly
      const data = res.data.notifications || [];
      setNotifications(data);

      // Check for unread notifications
      setHasUnread(data.some((n) => !n.read));
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  useEffect(()=>{
    fetchNotifications()
  },[token]);

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    console.log(notifications)

    if (hasUnread) {
      try {
        await axios.put(backendUrl + "/api/notifications/mark-read",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setHasUnread(false);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Error marking notifications as read:", err);
      }
    }
  };

  return (
    <div className="relative mr-4">
      <FaBell
        className="text-gray-700 w-6 h-6 cursor-pointer"
        onClick={handleBellClick}
      />
      {hasUnread && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600"></span>
      )}

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-md z-50 p-2 max-h-60 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-2 text-sm rounded ${
                  notif.read ? "bg-white" : "bg-gray-100"
                }`}
              >
                {notif.message}
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
