import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../../utils/jwt";
import { HttpStatusCode, BadRequestError, UnauthorizedError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { findUser } from "../../services/database/user";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            logger.warn("Email and password are required for login.");
            return next(new BadRequestError("Email and password are required."));
        }

        // Find user by email using the service
        const user = await findUser({ email });

        if (!user || !user.password) {
            logger.warn(`Invalid login attempt for email: ${email}`);
            return next(new UnauthorizedError("Invalid email or password."));
        }

        // Check if email is verified
        if (!user.emailVerified) {
            logger.warn(`Login attempt with unverified email: ${email}`);
            return next(new UnauthorizedError("Please verify your email before logging in."));
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Invalid password for email: ${email}`);
            return next(new UnauthorizedError("Invalid email or password."));
        }

        // Generate JWT token
        const token = generateToken({ id: user.id });

        logger.info(`User logged in: ${user.id}`);

        return res.status(HttpStatusCode.OK).json({
            status: "ok",
            data: { token },
        });
    } catch (error) {
        logger.error("Error in login:", error);
        next(new InternalServerError("Internal server error"));
    }
};