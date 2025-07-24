import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_USER_PASSWORD } from "./config";
import { Types } from "mongoose";

// Extend Request type to include userid as ObjectId 
declare global {
    namespace Express {
        interface Request {
            userid?: Types.ObjectId;
        }
    }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(403).json({ message: "You are not logged in" });
    }
    try {
        const decoded = jwt.verify(header, JWT_USER_PASSWORD) as { id: string };
        req.userid = new Types.ObjectId(decoded.id);
        next();
    } catch (e) {
        res.status(403).json({ message: "You are not logged in" });
    }
};