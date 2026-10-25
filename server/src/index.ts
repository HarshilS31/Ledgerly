import "dotenv/config";
import app from "./app.js"
import dns from "dns"
import { connectDB } from "./database/db.js"

dns.setServers(['8.8.8.8','8.8.4.4'])
await connectDB()
const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`App is listening on PORT :${PORT}`)
})
