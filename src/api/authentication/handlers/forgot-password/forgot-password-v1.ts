import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { createPasswordResetToken } from "../../../../utils/jwt";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { findUser } from "../../services/database/user";
import { prismaClient } from "../../../../utils/prisma";
import * as emailService from "../../../../utils/emailService";

/**
 * Handler for forgot password functionality.
 * - Finds user by email
 * - Generates a reset token and expiry
 * - Stores hashed token and expiry in PasswordResetToken table
 * - Sends reset email to user
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        if (!email) {
            logger.warn("No email provided for forgot password.");
            return next(new BadRequestError("Email is required."));
        }

        // Find user by email
        const user = await findUser({ email });
        if (!user) {
            logger.warn(`No user found with email: ${email}`);
            return next(new BadRequestError("There is no user with that email address."));
        }

        // Generate reset token and expiry
        const { resetToken, passwordResetExpires } = createPasswordResetToken();
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Store hashed token and expiry in PasswordResetToken table
        await prismaClient.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(passwordResetExpires),
            },
        });

        // Create password reset URL
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send password reset email
        await emailService.sendPasswordResetEmail(user, resetToken, resetURL);

        logger.info(`Password reset token sent to email: ${email}`);

        return res.status(HttpStatusCode.OK).json({
            status: "success",
            message: "Token sent to email",
            token: resetToken
        });
    } catch (error) {
        logger.error("Error in forgot password handler:", error);
        next(new InternalServerError("Internal server error"));
    }
};