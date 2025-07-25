import express from 'express';

const userRouter= express.Router();
import { registerUser, loginUser, fetchUserProfile, updateProfile } from '../controller/userController.js';
import { loginValidator, registerValidator } from '../middleware/validator.js';
import authUser from '../middleware/authUser.js';

userRouter.post('/register', registerValidator, registerUser);
userRouter.post('/login', loginValidator, loginUser);
userRouter.get('/profile',authUser,fetchUserProfile)
userRouter.put('/update-profile',authUser,updateProfile);

export default userRouter;