import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";               
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated. Please log in." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = { 
            id: decoded.id
        };
        
        next();
   } catch (err) {
       if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
           return res.status(401).json({ message: "Invalid or expired token." });
       }
       console.error("Auth Middleware Error:", err);
       return res.status(500).json({ message: "Internal server error" });
   }
}