import express from 'express';

const projectRouter = express.Router();
 
import { addProject, closeProject, getProjects, sendJoinRequest } from '../controller/projectController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';


projectRouter.post('/add', authUser, upload.single('image'), addProject);

projectRouter.get('/getprojects', getProjects);

projectRouter.post('/send-request', authUser, sendJoinRequest); 
projectRouter.put('/close-project/:projectId',authUser,closeProject)

export default projectRouter;