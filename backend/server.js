import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import adminRouter from './routes/adminRoutes.js';

dotenv.config();
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.use('/api/user', userRouter);

app.use('/api/project', projectRouter);

app.use('/api/admin',adminRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});