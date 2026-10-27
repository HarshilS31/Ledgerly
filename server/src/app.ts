import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js"
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use("/ledgerly/auth",authRouter)
app.use("/ledgerly/note",noteRouter)

export default app