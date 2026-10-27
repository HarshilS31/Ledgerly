import "./src/config/env.js"
import app from "./src/app.js"
import dns from "dns"
import { connectDB } from "./src/database/db.js"


dns.setServers(['8.8.8.8','8.8.4.4'])
const PORT = Number(process.env.PORT) || 8080
try{
    await connectDB()
    app.listen(PORT,()=>{
        console.log(`App is working on port:${PORT}`)
    
})
}catch(error) {
    console.error(error)
}
