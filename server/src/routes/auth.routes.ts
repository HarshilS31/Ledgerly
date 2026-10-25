import {registerUser, loginUser,logoutUser} from "../controllers/auth.controller.js"
import { Router } from "express";

const router = Router()
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout",logoutUser)

export default router
