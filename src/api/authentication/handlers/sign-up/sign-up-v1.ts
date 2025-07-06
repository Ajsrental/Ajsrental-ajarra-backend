import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createUser, findUser } from "../../services/database/user";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { isValidEmail, isValidPhone } from "../../../../utils/validations";


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, middleName, lastName, email, password, role } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            logger.warn("Missing required fields in sign-up.");
            return next(new BadRequestError("Missing required fields."));
        }

        // Email format check
        if (!isValidEmail(email)) {
            logger.warn("Invalid email format.");
            return next(new BadRequestError("Invalid email format."));
        }

        // Check if email already exists
        const existingUser = await findUser({ email });
        if (existingUser) {
            logger.warn(`Attempt to sign up with existing email: ${email}`);
            return next(new BadRequestError("A user with this email already exists."));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await createUser({
            firstName,
            middleName,
            lastName,
            email,
            password: hashedPassword,
            role: role && UserRole[role.toUpperCase() as keyof typeof UserRole]
                ? role.toUpperCase() as UserRole
                : UserRole.CLIENT,
        });

        // Return user info (omit password)
        const { password: _, ...userWithoutPassword } = user;
        res.status(HttpStatusCode.CREATED).json({
            ...userWithoutPassword,
            message: "Sign up successful."
        });
    } catch (error) {
        logger.error("Error during user sign-up:", error);
        next(new InternalServerError("Internal server error"));
    }
};





