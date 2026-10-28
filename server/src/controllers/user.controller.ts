import { UserModel } from "../models/user.model.js"
import { Request,Response } from "express";
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await UserModel.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            success:true,
            user
        });
    } catch (err) {
        console.error("Error fetching current user:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
