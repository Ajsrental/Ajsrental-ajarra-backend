import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prismaClient } from "../../../../utils/prisma";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { findUser } from "../../services/database/user";
import { generateToken } from "../../../../utils/jwt";

/**
 * Handler for resetting a user's password using a reset token.
 * - Verifies the token and expiry in the PasswordResetToken table
 * - Updates the user's password
 * - Marks the token as used
 * - Logs the user in by returning a JWT
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            logger.warn("Token and password are required for password reset.");
            return next(new BadRequestError("Token and password are required."));
        }

        const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");

        // Find the password reset token record
        const resetRecord = await prismaClient.passwordResetToken.findFirst({
            where: {
                tokenHash,
                expiresAt: { gt: new Date() },
                used: false,
            },
            include: { user: true }
        });

        if (!resetRecord || !resetRecord.user) {
            logger.warn("Invalid or expired password reset token.");
            return next(new BadRequestError("Token is invalid or has expired."));
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password
        await prismaClient.user.update({
            where: { id: resetRecord.userId },
            data: {
                password: hashedPassword,
                updatedAt: new Date(),
            },
        });

        // Mark the token as used
        await prismaClient.passwordResetToken.update({
            where: { id: resetRecord.id },
            data: { used: true },
        });


        logger.info(`Password reset successful for user: ${resetRecord.userId}`);

        return res.status(HttpStatusCode.OK).json({
            status: "success",
            message: "Password has been reset successfully.",
        });
    } catch (error) {
        logger.error("Error in reset password handler:", error);
        next(new InternalServerError("Internal server error"));
    }
};