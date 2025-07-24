import express from 'express';

const projectRouter = express.Router();
 
import { addProject } from '../controller/projectController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

projectRouter.post('/add', authUser, upload.single('image'), addProject);

export default projectRouter;