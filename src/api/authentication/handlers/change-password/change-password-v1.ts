import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prismaClient } from "../../../../utils/prisma";
import { HttpStatusCode, BadRequestError, InternalServerError, UnauthorizedError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";
//import { isValidPassword } from "../../../../utils/validations";

/**
 * Change password handler for authenticated users.
 * - Verifies current password
 * - Validates new password
 * - Updates user's password
 */

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const customReq = req as CustomRequest;
        const user = customReq.user;

        if (!user || !user.id) {
            logger.warn("User ID missing in request.");
            return next(new InternalServerError("User not found"));
        }
        
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            logger.warn("Missing password fields.");
            return next(new BadRequestError("All password fields are required."));
        }

        if (newPassword !== confirmPassword) {
            logger.warn("New password and confirmation do not match.");
            return next(new BadRequestError("New password and confirmation do not match."));
        }

        // if (!isValidPassword(newPassword)) {
        //     logger.warn("New password does not meet complexity requirements.");
        //     return next(
        //         new BadRequestError(
        //             "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
        //         )
        //     );
        // }

        const existingUser = await prismaClient.user.findUnique({ where: { id: user.id } });

        if (!existingUser) {
            logger.warn(`User not found with ID: ${user.id}`);
            return next(new UnauthorizedError("User not found."));
        }

        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);

        if (!isMatch) {
            logger.warn(`Incorrect current password for user: ${user.id}`);
            return next(new UnauthorizedError("Current password is incorrect."));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prismaClient.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                updatedAt: new Date(),
            },
        });

        logger.info(`Password successfully changed for user: ${user.id}`);

        return res.status(HttpStatusCode.OK).json({
            status: "success",
            message: "Password has been changed successfully.",
        });

    } catch (error) {
        logger.error("Error changing password:", error);
        next(new InternalServerError("Internal server error."));
    }
};
