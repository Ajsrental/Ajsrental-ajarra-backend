import { Request, Response, NextFunction } from "express";
import { HttpStatusCode, BadRequestError, InternalServerError, UnauthorizedError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { UserRole } from "@prisma/client";
import { CustomRequest } from "../../../../middlewares/checkJwt";
import { updateUser } from "../../services/database/user";

export const setRole = async (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;
    const user = customReq.user;

    if (!user || !user.id) {
        logger.warn("User not authenticated for set-role.");
        return next(new UnauthorizedError("Authentication required."));
    }

    const { role } = req.body;

    if (!role) {
        logger.warn("Role is required to set role.");
        return next(new BadRequestError("Role is required."));
    }

    if (!Object.values(UserRole).includes(role.toUpperCase())) {
        logger.warn(`Invalid role: ${role}`);
        return next(new BadRequestError("Invalid role."));
    }

    try {
        const updatedUser = await updateUser(
            { id: user.id },
            { role: role.toUpperCase() as UserRole }
        );

        logger.info(`Role updated for user: ${user.id} to ${role}`);
        return res.status(HttpStatusCode.OK).json({
            status: "ok",
            message: `Role updated to ${role}`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        logger.error("Error setting user role:", error);
        next(new InternalServerError("Internal server error"));
    }
};