import express from 'express';
import { deleteProject, deleteQuery, deleteUser, fetchQueries, getAllProjects, getAllUsers, loginAdmin, queryResponse } from '../controller/adminController.js';
import authAdmin from '../middleware/authAdmin.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.get('/getusers', authAdmin, getAllUsers);
adminRouter.get('/getprojects', authAdmin, getAllProjects);
adminRouter.delete('/project/delete/:id', authAdmin, deleteProject);
adminRouter.delete('/user/delete/:id', authAdmin, deleteUser);
adminRouter.get('/queries', authAdmin, fetchQueries);
adminRouter.post('/queries/response/:id', authAdmin, queryResponse);
adminRouter.delete('/queries/delete/:id', authAdmin, deleteQuery);


export default adminRouter;
