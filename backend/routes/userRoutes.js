import express from 'express';

const userRouter= express.Router();
import { registerUser, loginUser } from '../controller/userController.js';
import { loginValidator, registerValidator } from '../middleware/validator.js';

userRouter.post('/register', registerValidator, registerUser);
userRouter.post('/login', loginValidator, loginUser);

export default userRouter;