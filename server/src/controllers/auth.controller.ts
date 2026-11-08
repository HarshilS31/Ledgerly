import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { UserModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import "../config/env.js"

export const registerUser = async (req: Request,res: Response): Promise<Response> => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format."
        });
      }
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }]
    })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists."
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,

    })
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d"
      }
    )
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000 
    })
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",error:error
    })
  }
}
export const loginUser = async (req: Request, res: Response) => {
    try {
        const {email, password } = req.body;
        if(!email || !password) {
          return res.status(400).json({message:"Incomplete credentials"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              return res.status(400).json({
                success: false,
                message: "Invalid email format."
          });
        }
        const existingUser = await UserModel.findOne({
            $or: [{ email }]
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not registered" });
        }
        const validPass = await bcrypt.compare(password, existingUser.password);
        if (!validPass) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = jwt.sign(
            { id: existingUser._id},
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );
        res.cookie("token",token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24*60*60*7*1000
        });
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error", error });
    }
}
export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });
    return res.status(200).json({ message: "Logout successful" });
}
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { currentPassword, newPassword } = req.body;
        if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
            return res.status(400).json({ message: "Both passwords are required." });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters." });
        }
        const user = await UserModel.findById(userId).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) return res.status(400).json({ message: "Current password is incorrect." });

        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({ message: "New password must be different from the current one." });
        }

        user.password = await bcrypt.hash(newPassword,10);
        await user.save();

        return res.status(200).json({ message: "Password updated." });
    } catch (err) {
        console.error("Error changing password:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}