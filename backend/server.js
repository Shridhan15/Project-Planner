import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// ✅ Explicit CORS for REST API
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const server = http.createServer(app);

// ✅ Socket.IO CORS
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id);
        console.log(`Registered socket for user ${userId}`);
    });

    socket.on("disconnect", () => {
        for (const [userId, id] of userSocketMap.entries()) {
            if (id === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
        console.log("Socket disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/messages', messageRouter);

export { io, userSocketMap };
