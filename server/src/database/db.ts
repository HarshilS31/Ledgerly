import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
        console.log("Connected to MongoDB")
    }catch(err) {
        console.error(`Error: ${(err as Error).message}`)
    }
}