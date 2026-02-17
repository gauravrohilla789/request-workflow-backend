import {Request, Response, NextFunction} from 'express';

import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message: 'Unauthorized: No token provided'});
    }

    try {
        const decoded = jwt.verify(
            token as string,
            process.env.JWT_SECRET as string
        ) as any;

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        }

        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized: Invalid token'});
    }
}