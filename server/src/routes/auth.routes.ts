import {registerUser, loginUser,logoutUser, changePassword, forgotPassword,resetPassword} from "../controllers/auth.controller.js"
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit"
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 5,
  message: { message: "Too many attempts. Try again later." },
})
const router = Router()
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout",logoutUser)
router.put("/change-password",authenticate,changePassword)
router.post("/forgot-password",resetLimiter,forgotPassword)
router.post("/reset-password",resetLimiter,resetPassword)

export default router
