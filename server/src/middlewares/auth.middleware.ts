import { Request,Response,NextFunction } from "express"
import jwt,{ JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const authenticate = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({message:"Unauthenticated,Please log in"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload
        const authenticatedReq = req as AuthenticatedRequest;
        authenticatedReq.user = {
            id: decoded.id as string,
        };
        next()
   }catch(err) {
       return res.status(401).json({message:"Internal server error"})
   }
}