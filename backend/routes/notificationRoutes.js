import express from 'express';
import authUser from '../middleware/authUser.js'; 
import { getAllNotifications, markNotificationAsRead } from '../controller/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.get('/', authUser, getAllNotifications)
notificationRouter.put("/:id/mark-read", authUser, markNotificationAsRead)



export default notificationRouter;