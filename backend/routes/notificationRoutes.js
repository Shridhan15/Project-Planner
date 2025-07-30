import express from 'express';
import authUser from '../middleware/authUser.js'; 
import { deleteNotification, getAllNotifications, markNotificationAsRead } from '../controller/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.get('/', authUser, getAllNotifications)
notificationRouter.put("/:id/mark-read", authUser, markNotificationAsRead)
notificationRouter.delete("/:id/delete", authUser, deleteNotification)



export default notificationRouter;