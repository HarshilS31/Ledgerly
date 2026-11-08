import {registerUser, loginUser,logoutUser, changePassword} from "../controllers/auth.controller.js"
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router()
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout",logoutUser)
router.put("/change-password",authenticate,changePassword)
export default router
