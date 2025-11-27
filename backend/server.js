import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv-flow';
import http from "http";
import { Server } from "socket.io";
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import messageRouter from './routes/messageRoutes.js';

dotenv.config();

const app = express();
 
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    "http://localhost:5173", 
    "http://localhost:5174", 
].filter(Boolean);
 
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log("Allowed CORS Origins:", uniqueOrigins);


app.use(
    cors({
        origin: uniqueOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  DB
connectDB();
 
const server = http.createServer(app);

//  SOCKET.IO 
const io = new Server(server, {
    cors: {
        origin: uniqueOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

const userSocketMap = new Map();

// SOCKET HANDLERS
io.on("connection", (socket) => {
    console.log(" Socket connected:", socket.id);

    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id);
        console.log(` Registered user: ${userId}`);
    });

    socket.on("disconnect", () => {
        for (const [userId, id] of userSocketMap.entries()) {
            if (id === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
        console.log(" Socket disconnected:", socket.id);
    });
});

// ROUTES
app.get("/", (req, res) => res.send("Hello from backend!"));
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/messages", messageRouter);

// RUN SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(` Server running  on port ${PORT}`);
});

export { io, userSocketMap };
