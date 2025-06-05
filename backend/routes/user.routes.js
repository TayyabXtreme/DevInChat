import {Router} from "express";
import { createUserController } from "../controllers/user.controller.js";
import {body} from "express-validator";

const router=Router();

router.post("/",
    body("email").isEmail().isLength({min:5,max:50}).withMessage("Email is required"),
    body("password").isLength({min:5}).withMessage("Password is required")
    ,createUserController);

export default router;