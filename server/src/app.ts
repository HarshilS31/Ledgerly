import express from "express";
import authRouter from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js"
import userRouter from "./routes/user.routes.js"
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
const apiLimiter = rateLimit({
    windowMs: 20*60*1000,
    max: 100, 
    message: { message: "Too many requests from this IP, please try again after 15 minutes" }
})
app.use("/api", apiLimiter);
const aiLimiter = rateLimit({
    windowMs: 60*60*1000,
    max: 20,
    message: { message: "AI generation limit reached. Please try again later." }
})
app.use("/api/notes", aiLimiter);
app.use(express.urlencoded({extended:true}))
app.use("/ledgerly/auth",authRouter)
app.use("/ledgerly/note",noteRouter)
app.use("/ledgerly",userRouter)
export default app