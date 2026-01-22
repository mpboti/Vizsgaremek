import jwt from 'jsonwebtoken';
import config from '../config/config';
import { Response } from 'express';

export default function verifyToken(req: any, res: Response, next:any) {
    const token = req.body?.token || req.query?.token || req.headers?.["x-access-token"];

    if(!token) {
        return res.status(403).json({ message: "No token provided." });
    }
    try {
        if( !config.jwtSecret ) {
            throw new Error("JWT secret is not defined in the configuration.");
        }
        const decoded = jwt.verify(token as string, config.jwtSecret);
        req.user = decoded;
        return next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
}