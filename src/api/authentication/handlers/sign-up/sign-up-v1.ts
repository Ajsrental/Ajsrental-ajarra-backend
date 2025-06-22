import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createUser } from "../../services/database/user";
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

        // (Optional) Add phone validation if you include phone numbers later
        // if (phone && !isValidPhone(phone)) {
        //     logger.warn("Invalid phone number format.");
        //     return next(new BadRequestError("Invalid phone number format."));
        // }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upsert user
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
        res.status(HttpStatusCode.CREATED).json(userWithoutPassword);
    } catch (error) {
        logger.error("Error during user sign-up:", error);
        next(new InternalServerError("Internal server error"));
    }
};
