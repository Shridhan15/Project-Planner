import express from 'express';
import authUser from '../middleware/authUser.js'; 
import { deleteNotification, getAllNotifications, markAllRead, markNotificationAsRead } from '../controller/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.get('/', authUser, getAllNotifications)
notificationRouter.put("/:id/mark-read", authUser, markNotificationAsRead)
notificationRouter.delete("/:id/delete", authUser, deleteNotification)
notificationRouter.put('/mark-all-read', authUser, markAllRead)



export default notificationRouter;