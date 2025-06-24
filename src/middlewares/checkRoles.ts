import { Request, Response, NextFunction } from "express";
import type { User } from "@prisma/client";

/**
 * Middleware to check if the authenticated user has the 'ADMIN' role.
 * Assumes req.user is set by authentication middleware.
 */
export const checkIsAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as User | undefined;
    if (!user) {
        return res.status(401).json({ message: "User is not an Admin" });
    }
    if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
};