import {Router} from "express";
import { createUserController, loginController, logoutController, profileController } from "../controllers/user.controller.js";
import {body} from "express-validator";
import { authUser } from "../middlewares/auth.middleware.js";

const router=Router();

router.post("/register",
    body("email").isEmail().isLength({min:5,max:50}).withMessage("Email is required"),
    body("password").isLength({min:5}).withMessage("Password is required")
    ,createUserController);

router.post('/login',
    body("email").isEmail().isLength({min:5,max:50}).withMessage("Email is required"),
    body("password").isLength({min:5}).withMessage("Password is required"),
    loginController
)

router.get("/profile",authUser,profileController);

router.get('/logout',authUser,logoutController);

export default router;