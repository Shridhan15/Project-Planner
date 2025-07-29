import express from 'express';
import { deleteProject, deleteUser, getAllProjects, getAllUsers, loginAdmin } from '../controller/adminController.js';
import authAdmin from '../middleware/authAdmin.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.get('/getusers', authAdmin, getAllUsers);
adminRouter.get('/getprojects', authAdmin, getAllProjects);
adminRouter.delete('/project/delete/:id', authAdmin, deleteProject);
adminRouter.delete('/user/delete/:id', authAdmin, deleteUser);


export default adminRouter;
