import express from "express";
import { getChatMessages, getUserRecentMessages, sendMessage, sseController } from "../controller/messageController.js";
import authUser from "../middleware/authUser.js";
  

const messageRouter = express.Router(); 

messageRouter.get("/sse/:userId", authUser, sseController); 
messageRouter.post("/send", authUser, sendMessage); 
messageRouter.post("/chat", authUser, getChatMessages); 
messageRouter.get("/recent", authUser, getUserRecentMessages);

export default messageRouter;
