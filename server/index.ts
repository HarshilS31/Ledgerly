import "./src/config/env.js"
import app from "./src/app.js"
import dns from "dns"
import { connectDB } from "./src/database/db.js"
import { sendResetEmail } from "./src/utils/mailer.js"

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
// const testEmail = async () => {
//     try {
//         await sendResetEmail("harshils3107@gmail.com","http://localhost:5173/reset-password?token=test")
//         console.log("E-mail sent ")
//     }catch(err:any) {
//         console.log("E-mail failed",err.message)
//     }
// }
// testEmail()