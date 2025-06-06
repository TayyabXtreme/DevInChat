import {Router} from "express";
import {body} from "express-validator";
import {authUser} from "../middlewares/auth.middleware.js";
import { addUserToProjectController, createProjectController, getAllProjectsController, getProjectByIdController } from "../controllers/project.controller.js";

const router=Router();
router.post('/create',
    body('name').isString().withMessage('Name is required'),
    authUser,
    createProjectController);

router.get('/all',authUser,getAllProjectsController)

router.put('/add-user',authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
    .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    addUserToProjectController
)

router.get('/get-project/:projectId',
    authUser,
    getProjectByIdController
)

export default router