import { Request, Response, NextFunction } from "express";
import { createVendorAccount } from "../../services/database/vendorAccount";
import { getVendorByUserId } from "../../services/database/service";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { AccountType, VerificationStatus } from "@prisma/client";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const createPayoutAccountHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const customReq = req as CustomRequest;
    const user = customReq.user;

    if (!user || !user.id) {
        logger.warn("User ID missing in request.");
        return next(new InternalServerError("User not found"));
    }

    try {
        const {
            bankName,
            accountHolderName,
            accountNumber,
            accountType,
            utilityBillUrl,
            validIdUrl,
            businessCertUrl
        } = req.body;

        // Validate required fields
        if (
            !bankName ||
            !accountHolderName ||
            !accountNumber ||
            !accountType
        ) {
            logger.warn("Missing required fields in payout account creation.");
            return next(new BadRequestError("Missing required fields."));
        }

        // Validate enums
        if (!Object.values(AccountType).includes(accountType)) {
            logger.warn("Invalid accountType value.");
            return next(new BadRequestError("Invalid accountType value."));
        }
        // Setup function for handling User Account verification
        
        // Get vendorId using user.id
        const vendor = await getVendorByUserId(user.id);
        if (!vendor) {
            logger.warn("Vendor not found for user.");
            return next(new BadRequestError("Vendor not found for user."));
        }

        const vendorAccount = await createVendorAccount({
            vendorId: vendor.id,
            bankName,
            accountHolderName,
            accountNumber,
            accountType,
            utilityBillUrl,
            validIdUrl,
            businessCertUrl,
            verificationStatus: VerificationStatus.PENDING
        });

        res.status(HttpStatusCode.CREATED).json(vendorAccount);
    } catch (error) {
        logger.error("Error during payout account creation:", error);
        next(new InternalServerError("Internal server error"));
    }
};