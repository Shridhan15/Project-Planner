import express from 'express';

const projectRouter = express.Router();
 
import { acceptJoinRequest, addProject, closeProject, getProjects, rejectJoinRequest, sendJoinRequest } from '../controller/projectController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';


projectRouter.post('/add', authUser, upload.single('image'), addProject);

projectRouter.get('/getprojects', getProjects);

projectRouter.post('/send-request', authUser, sendJoinRequest); 
projectRouter.put('/close-project/:projectId',authUser,closeProject)
projectRouter.put('/accept-request/:project',authUser,acceptJoinRequest)
projectRouter.put('/reject-request/:project',authUser,rejectJoinRequest)

export default projectRouter;