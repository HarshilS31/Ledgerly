import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { UserModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import "../config/env.js"
import crypto from "crypto"
import { sendResetEmail } from "../utils/mailer.js"
import { error } from "console"
import { cookieOptions } from "../utils/cookie.js"
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
        message: "This username or email already exists."
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
    res.cookie("token",token,cookieOptions)
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
        res.cookie("token",token,cookieOptions);
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
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await UserModel.findOne({ email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex"); 
      await UserModel.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetTokenHash: sha256(token),                        
            passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),  
          },
        }
      );
      const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
      const info = await sendResetEmail(user.email, link).catch((e) => console.error("Reset email failed:", e))
    }
    return res.json({ message: "If that email is registered, we've sent a reset link." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export const resetPassword = async (req:Request,res:Response) => {
  try{
    const {token,newPassword} = req.body
    if(!token || typeof token!=="string") {
      return res.status(400).json({message:"This reset link is invalid or has expired."})
    }
    if(typeof newPassword!="string" || newPassword.length<8) {
      return res.status(400).json({message:"Password must be at least 8 characters."})
    }
    const user = await UserModel.findOne({
      passwordResetTokenHash:sha256(token),
      passwordResetExpires:{$gt: new Date()}
    })
    if(!user) {
      return res.status(400).json({message:"This reset link is invalid or has expired."})
    }
    const hashed = await bcrypt.hash(newPassword,10);
    await UserModel.updateOne({_id:user._id},{
      $set:{password:hashed},
      $unset: { passwordResetTokenHash: "", passwordResetExpires: "" }
    })
     return res.json({ message: "Password updated. You can now sign in." });
  }catch(err:any) {
    console.log(err?.message)
    return res.status(500).json({message:"Failed to reset Password",err})
  }
}