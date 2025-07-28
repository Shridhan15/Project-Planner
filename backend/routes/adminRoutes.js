import express from 'express';
import { getAllProjects, getAllUsers, loginAdmin } from '../controller/adminController.js';
import authAdmin from '../middleware/authAdmin.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.get('/all-users', authAdmin, getAllUsers);
adminRouter.get('/getprojects', authAdmin, getAllProjects);

export default adminRouter;
