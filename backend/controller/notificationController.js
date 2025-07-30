import Notification from "../models/Notification.js";

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const markNotificationAsRead = async (req, res) => {
    try {

        const notificationId = req.params.id;
        await Notification.findByIdAndUpdate({ _id: notificationId, recipient: req.user._id }, { isRead: true });
        res.json({ success: true, message: "Notification marked as read" });


    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ success: false, message: error.message });

    }
}
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.log("Error marking all notifications as read:(in controller)", err);
    res.status(500).json({ success: false, message: "Failed to mark all as read", error: err.message });
  }
};

export { getAllNotifications, markNotificationAsRead, markAllRead };
