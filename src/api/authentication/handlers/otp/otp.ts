import { Request, Response, NextFunction } from "express";
import { sendOTP, verifyOTP } from "../../../../libs/termii";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { findUser } from "../../services/database/user";
import { generateOTP, getOTPExpiry } from "../../../../utils/generate-otp";
import { sendWelcomeEmail } from "../../../../utils/emailService";
import { prismaClient } from "../../../../utils/prisma";
import { isValidEmail } from "../../../../utils/validations";
import { formatPhoneToInternational } from "../../../../utils/phoneService";
import { updateUser } from "../../services/database/user";

/**
* Handler to send OTP to a phone number.
*/

export const sendOTPHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone, country }: {
        email?: string;
        phone?: string;
        country?: string;
    } = req.body;

    // Access the user attached by the middleware
    const signupUser = (req as any).signupUser;

    if (!signupUser) {
        logger.warn("No signup user found in request.");
        return next(new BadRequestError("User not authenticated for OTP operation."));
    }

    // Example usage: use signupUser.id and signupUser.email
    logger.info(`Sending OTP for user: ${signupUser.id}, email: ${signupUser.email}`);

    // Require at least email or phone to be present
    if ((!email || email.trim() === "") && (!phone || phone.trim() === "")) {
        logger.warn("Neither email nor phone provided in sendOTPHandler.");
        return next(new BadRequestError("Either email or phone number is required."));
    }

    if (phone && country) {
        try {
            const formattedPhoneNumber = formatPhoneToInternational(
                phone,
                country,
            );

            if (!formattedPhoneNumber) {
                throw new BadRequestError("Invalid phone number or country code");
            }


            logger.info(`Sending OTP to phone: ${formattedPhoneNumber}, country: ${country}`);

            const response = await sendOTP(formattedPhoneNumber, country);

            if (response.status === "error") {
                const errorMessage = (response as any).message || "Failed to send OTP";
                logger.warn(`Failed to send OTP: ${errorMessage}`);
                return next(new BadRequestError(errorMessage));
            }

            // Add phone number to the user
            try 
            { await updateUser(
                { id: signupUser.id },
                { phone: formattedPhoneNumber }
            ); } 
                catch (error:any) 
            {

                logger.error("Error updating user phone number:", error);
                return next(new InternalServerError("Failed to update user phone number"));
            }

            // Find existing user by email
            const existingUser = await findUser({ email: signupUser.email });
            if (!existingUser) {
                logger.warn("No user found for sign-up OTP.");
                return next(new BadRequestError("No user found with this email."));
            }

            let userId = "";
            let password = "";

            if (existingUser) {
                userId = existingUser.id;
                password = existingUser.password;
            }

            
            await prismaClient.verificationRequest.upsert({
                where: { phone:formattedPhoneNumber },
                update: {
                    status: "pending",
                    verified: false,
                    ipAddress: req.ip || "",
                    idType: "PHONE",
                    userId,
                    password,
                    pinId: (response as any).tokenId, // <-- Store tokenId here
                },
                create: {
                    userId,
                    ipAddress: req.ip || "",
                    phone: formattedPhoneNumber,
                    password,
                    status: "pending",
                    idType: "PHONE",
                    verified: false,
                    pinId: (response as any).tokenId, // <-- Store pinId here
                },
            });

            logger.info(`OTP sent and verification request saved for phone: ${phone}`);
            return res.status(200).json({
                status: "ok",
                data: response,
            });
        } catch (error) {
            logger.error("An error occurred sending OTP", error);
            return next(new InternalServerError("Internal server error while sending OTP"));
        }
    }

    // If email is present send otp to user's email
    if (email) {

        logger.info("Processing email-based OTP (sign-up) operation");

        // Validate required fields for sign-up
        if (!isValidEmail(email)) {
            logger.warn("Invalid email format in sign-up OTP.");
            return next(new BadRequestError("Invalid email format."));
        }

        // Check if user with this email already exists
        const existingUser = await findUser({ email });
        if (!existingUser) {
            logger.warn("No user found for sign-up OTP.");
            return next(new BadRequestError("No user found with this email."));
        }

        // Generate OTP and expiry
        const otp = generateOTP().toString();
        const otpExpiry = getOTPExpiry(5); // 5 minutes expiry

        // Upsert VerificationRequest model
        await prismaClient.verificationRequest.upsert({
            where: { email },
            update: {
                password: existingUser.password,
                otp,
                otpExpiry,
                status: "pending",
                verified: false,
                userId: existingUser.id,
                ipAddress: req.ip || "",
            },
            create: {
                userId: existingUser.id,
                ipAddress: req.ip || "",
                email,
                password: existingUser.password,
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
            await sendWelcomeEmail(existingUser, otp, verifyUrl);
        } catch (emailError) {
            logger.error("Error sending welcome email:", emailError);
            return next(new InternalServerError("Failed to send OTP email. Please try again later."));
        }

        return res.status(201).json({
            status: "ok",
            message: "OTP has been sent to your email. Please check your inbox and verify."
        });
    }

}

/**
 * Handler to verify OTP for a phone number.
 */
export const verifyOtpHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, phone, otp } = req.body;

    // Require either email or phone
    if ((!email || email.trim() === "") && (!phone || phone.trim() === "")) {
        logger.warn("Neither email nor phone provided in verifyOtpHandler.");
        return next(new BadRequestError("Either email or phone number is required."));
    }

    // EMAIL OTP VERIFICATION LOGIC
    if (email) {
        try {
            if (!otp) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    status: "error",
                    message: "Email and OTP are required",
                });
            }

            // Find the corresponding verification request by email
            const verificationRequest = await prismaClient.verificationRequest.findUnique({
                where: { email },
            });

            const now = new Date();

            if (
                !verificationRequest ||
                verificationRequest.otp !== otp ||
                !verificationRequest.otpExpiry ||
                now > verificationRequest.otpExpiry
            ) {
                return res.status(HttpStatusCode.NOT_FOUND).json({
                    status: "error",
                    message: "Invalid or expired OTP.",
                });
            }

            // Mark signup request as verified
            await prismaClient.verificationRequest.update({
                where: { email },
                data: {
                    verified: true,
                    status: "verified",
                },
            });

            // Update user to mark email as verified
            if (!verificationRequest) {
                logger.warn("Verification request not found for email during user update.");
                return res.status(HttpStatusCode.NOT_FOUND).json({
                    status: "error",
                    message: "Verification request not found.",
                });
            }
            
            await prismaClient.user.update({
                where: { id: verificationRequest.userId },
                data: {
                    email,
                    password: verificationRequest.password,
                    emailVerified: true,
                },
            });

            return res.status(HttpStatusCode.OK).json({
                status: "ok",
                message: "OTP verified successfully. Your email is now confirmed."
            });
        } catch (error) {
            logger.error("Error in email OTP verification:", error);
            return next(new InternalServerError("Internal server error during OTP verification"));
        }
    }

    // PHONE OTP VERIFICATION LOGIC
    if (phone) {

        if (!otp) {
            logger.warn("OTP or token missing in phone OTP verification.");
            return next(new BadRequestError("OTP and token are required for phone verification."));
        }

        const country = "nga";

        const formattedPhoneNumber = formatPhoneToInternational(
            phone,
            country,
        );

        if (!formattedPhoneNumber) {
            throw new BadRequestError("Invalid phone number or country code");
        }


        try {

    
            logger.info(`Verifying OTP for phone: ${formattedPhoneNumber}`);

            // Find the corresponding verification request by phone
            const verificationRequest = await prismaClient.verificationRequest.findUnique({
                where: { phone: formattedPhoneNumber },
            });

            if (!verificationRequest || !verificationRequest.pinId) {
                logger.warn("Verification request or pinId not found for phone during OTP verification.");
                return res.status(HttpStatusCode.NOT_FOUND).json({
                    status: "error",
                    message: "Verification request not found.",
                });
            }

            const now = new Date();

            const response = await verifyOTP(verificationRequest.pinId, otp);
            
            if (response.status !== "verified") {
                logger.warn(`OTP verification failed: ${response.message}`);
                return next(new BadRequestError(response.message || "OTP verification failed"));
            }

            // Mark signup request as verified
            await prismaClient.verificationRequest.update({
                where: { id: verificationRequest.id },
                data: {
                    verified: true,
                    status: "verified",
                },
            });

            await prismaClient.user.update({
                where: { id: verificationRequest.userId },
                data: {
                    email,
                    password: verificationRequest.password,
                    phoneVerified: true,
                },
            });
               
            logger.info(`OTP verified successfully for phone: ${formattedPhoneNumber}`);
            return res.status(HttpStatusCode.OK).json({
                status: "ok",
                message: "OTP verified successfully. Your phone is now confirmed.",
                data: response,
            });
        } catch (error) {
            logger.error("Error in phone OTP verification:", error);
            return next(new InternalServerError("Internal server error during OTP verification"));
        }
    }
};

/**
 * Handler to resend OTP to a phone number.
 */
export const resendOTPHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone, country }: { email?: string; phone?: string; country?: string } = req.body;

    // Require at least email or phone to be present
    if ((!email || email.trim() === "") && (!phone || phone.trim() === "")) {
        logger.warn("Neither email nor phone provided in resendOTPHandler.");
        return next(new BadRequestError("Either email or phone number is required."));
    }

    // EMAIL OTP RESEND LOGIC
    if (email) {
        try {
            logger.info("Resending OTP for email-based verification");

            // Find the corresponding verification request by email
            const verificationRequest = await prismaClient.verificationRequest.findUnique({
                where: { email },
            });

            if (!verificationRequest) {
                logger.warn("No OTP request found for email.");
                return res.status(HttpStatusCode.NOT_FOUND).json({
                    status: "error",
                    message: "No OTP request found. Please restart the onboarding process.",
                });
            }

            // Check if the OTP is already verified
            if (verificationRequest.verified) {
                logger.warn("OTP has already been verified for email.");
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    status: "error",
                    message: "OTP has already been verified",
                });
            }

            // Generate a new OTP and update the verification request record
            const otp = generateOTP().toString();
            const otpExpiry = getOTPExpiry(5);

            await prismaClient.verificationRequest.update({
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
                // Fetch the user for personalization
                const user = await prismaClient.user.findUnique({ where: { id: verificationRequest.userId } });
                await sendWelcomeEmail(user || { email }, otp, verifyUrl);
            } catch (emailError) {
                logger.error("Error sending OTP email:", emailError);
                return next(new InternalServerError("Failed to send OTP email. Please try again later."));
            }

            logger.info(`OTP resent and verification request updated for email: ${email}`);
            return res.status(HttpStatusCode.OK).json({
                status: "ok",
                message: "New OTP has been sent to your email. Please check your inbox and verify.",
            });

        } catch (error: any) {
            logger.error("Error in resending OTP for email:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    // PHONE OTP RESEND LOGIC
    if (phone && country) {

        const formattedPhoneNumber = formatPhoneToInternational(
            phone,
            country,
        );

        if (!formattedPhoneNumber) {
            throw new BadRequestError("Invalid phone number or country code");
        }

        try {
            
            logger.info(`Resending OTP to phone: ${formattedPhoneNumber}, country: ${country}`);
            const response = await sendOTP(formattedPhoneNumber, country);

            if (response.status === "error") {
                const errorMessage = (response as any).message || "Failed to resend OTP";
                logger.warn(`Failed to resend OTP: ${errorMessage}`);
                return next(new BadRequestError(errorMessage));
            }


            // Find the corresponding verification request by phone
            const verificationRequest = await prismaClient.verificationRequest.findUnique({
                where: { phone: formattedPhoneNumber }, // Use formatted phone number
            });

            if (!verificationRequest) {
                logger.warn("No OTP request found for email.");
                return res.status(HttpStatusCode.NOT_FOUND).json({
                    status: "error",
                    message: "No OTP request found. Please restart the onboarding process.",
                });
            }

            // Check if the OTP is already verified
            if (verificationRequest.verified) {
                logger.warn("OTP has already been verified for email.");
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    status: "error",
                    message: "OTP has already been verified",
                });
            }

            // Update the verification request 
            await prismaClient.verificationRequest.update({
                where: { phone: formattedPhoneNumber },
                data: {
                    status: "pending",
                    verified: false,
                    pinId: (response as any).tokenId, // <-- Store pinId here
                },
            });


            logger.info(`OTP resent and verification request updated for phone: ${formattedPhoneNumber}`);
            return res.status(200).json({
                status: "ok",
                message: "OTP resent successfully to your phone.",
                data: response,
            });
        } catch (error) {
            logger.error("An error occurred resending OTP to phone", error);
            return next(new InternalServerError("Internal server error while resending OTP"));
        }
    }
};