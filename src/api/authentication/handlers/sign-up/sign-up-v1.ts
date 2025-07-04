import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createUser, findUser } from "../../services/database/user";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { isValidEmail, isValidPhone } from "../../../../utils/validations";
import { generateOTP, getOTPExpiry } from "../../../../utils/generate-otp";
import { sendWelcomeEmail } from "../../../../utils/emailService";
import { prismaClient } from "../../../../utils/prisma";


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, middleName, lastName, email, password, role } = req.body;
        const ipAddress = req.ip || "";

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

        // Check if user with this email already exists
        // const existingUser = await findUser({ email });
        // if (existingUser) {
        //     logger.warn("Email already exists.");
        //     return next(new BadRequestError("A user with this email already exists."));
        //  }

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

        // Generate OTP and expiry
        const otp = generateOTP().toString();
        const otpExpiry = getOTPExpiry(5); // 5 minutes expiry

        // Upsert SignupRequest model
        await prismaClient.signupRequest.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                otp,
                otpExpiry,
                status: "pending",
                verified: false,
            },
            create: {
                userId: user.id,
                ipAddress,
                email,
                password: hashedPassword,
                status: "pending",
                idType: "EMAIL",
                otp,
                otpExpiry,
                verified: false,
            },
        });
        
        // Prepare verification URL
        const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-otp?email=${encodeURIComponent(email)}`;

        // Send welcome email with OTP and verification link
        try {
            await sendWelcomeEmail(user, otp, verifyUrl);
        } catch (emailError) {
            logger.error("Error sending welcome email:", emailError);
            return next(new InternalServerError("Failed to send OTP email. Please try again later."));
        }

        // Return user info (omit password)
        const { password: _, ...userWithoutPassword } = user;
        res.status(HttpStatusCode.CREATED).json({
            ...userWithoutPassword,
            message: "OTP has been sent to your email. Please check your inbox and verify."
        });
    } catch (error) {
        logger.error("Error during user sign-up:", error);
        next(new InternalServerError("Internal server error"));
    }
};

/**
 * Handler to verify OTP for user sign-up.
 */
export const verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, otp: userOtp } = req.body;
        // Validate input
        if (!email || !userOtp) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                status: "error",
                message: "Email and OTP are required",
            });
        }

        // Find the corresponding signup request by email
        const signupRequest = await prismaClient.signupRequest.findUnique({
            where: { email },
        });

        const now = new Date();

        if (
            !signupRequest ||
            signupRequest.otp !== userOtp ||
            !signupRequest.otpExpiry ||
            now > signupRequest.otpExpiry
        ) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                status: "error",
                message: "Invalid or expired OTP.",
            });
        }

        // Mark signup request as verified
        await prismaClient.signupRequest.update({
            where: { email },
            data: {
                verified: true,
                status: "verified",
            },
        });

        // Update user to mark email as verified
        const newUser = await prismaClient.user.update({
            where: { id: signupRequest.userId },
            data: {
                email,
                password: signupRequest.password,
                emailVerified: true,
            },
        });


        return res.status(HttpStatusCode.OK).json({
            status: "ok",
            message: "OTP verified successfully. Your email is now confirmed."
        });
    } catch (error: any) {
        console.error("Error in OTP verification:", error);
        return res.status(HttpStatusCode.INTERNAL_SERVER).json({
            status: "error",
            message: "Internal server error during OTP verification",
        });
    }
};

/**
 * Handler to resend OTP.
 */

export const resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                status: "error",
                message: "Email is required",
            });
        }

        const signupRequest = await prismaClient.signupRequest.findUnique({
            where: { email },
        });

        if (!signupRequest) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                status: "error",
                message: "No OTP request found. Please restart the onboarding process.",
            });
        }

        // Check if the OTP is already verified
        if (signupRequest.verified) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                status: "error",
                message: "OTP has already been verified",
            });
        }

        // Generate a new OTP and update the signup request record
        const otp = generateOTP().toString();
        const otpExpiry = getOTPExpiry(5);

        await prismaClient.signupRequest.update({
            where: { email },
            data: {
                otp,
                otpExpiry,
                status: "pending",
                verified: false,
            },
        });

        // Prepare verification URL
        const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-otp?email=${encodeURIComponent(email)}`;

        // Send the OTP to the user's email using the welcome email template
        try {
            // You may want to fetch the user for personalization
            const user = await prismaClient.user.findUnique({ where: { id: signupRequest.userId } });
            await sendWelcomeEmail(user || { email }, otp, verifyUrl);
        } catch (emailError) {
            logger.error("Error sending OTP email:", emailError);
            return next(new InternalServerError("Failed to send OTP email. Please try again later."));
        }

        return res.status(HttpStatusCode.OK).json({
            status: "ok",
            message: "New OTP has been sent to your email. Please check your inbox and verify.",
        });

    } catch (error: any) {
        console.error("Error in resending Otp:", error);
        return res.status(HttpStatusCode.INTERNAL_SERVER).json({
            status: "error",
            message: "Internal server error",
        });
    }
  };