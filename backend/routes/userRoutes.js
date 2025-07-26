import express from 'express';
import upload from '../middleware/multer.js';

const userRouter = express.Router();
import { registerUser, loginUser, fetchUserProfile, updateProfile, getUserProjects } from '../controller/userController.js';
import { loginValidator, registerValidator } from '../middleware/validator.js';
import authUser from '../middleware/authUser.js';

userRouter.post('/register', registerValidator, registerUser);
userRouter.post('/login', loginValidator, loginUser);
userRouter.get('/profile', authUser, fetchUserProfile)
userRouter.put('/update-profile', authUser, upload.single('profileImage'), updateProfile);
userRouter.get('/user-projects', authUser, getUserProjects);




export default userRouter;