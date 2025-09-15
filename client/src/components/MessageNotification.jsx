import { useEffect, useState } from "react";
import "./MessageNotification.css";

function MessageNotification({ notification, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger slide in
    const showT = setTimeout(() => setVisible(true), 10);

    // auto-dismiss after 5s
    const hideT = setTimeout(() => onClose(notification.id), 5000);

    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, [notification, onClose]);

  return (
    <div
      className={
        "fixed top-20 right-4 z-50 w-72 p-3 rounded-lg shadow-lg border-l-4 border-violet-500 bg-white " +
        (visible ? "notification-enter" : "notification-exit")
      }
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        {notification.sender?.profileImage ? (
          <img
            src={notification.sender.profileImage}
            alt={notification.sender.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-500 text-white font-bold">
            {notification.sender?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 truncate">
            {notification.sender?.name || "Unknown"}
          </div>
          <div className="text-sm text-gray-600 truncate">
            {notification.message}
          </div>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default MessageNotification;
