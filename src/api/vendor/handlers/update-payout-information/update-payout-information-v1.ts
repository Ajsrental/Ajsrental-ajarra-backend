import { Request, Response, NextFunction } from "express";
import { getVendorByUserId } from "../../services/database/service";
import { updateVendorAccount } from "../../services/database/vendorAccount";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { AccountType } from "@prisma/client";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const updatePayoutInformationHandler = async (
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

    const { bankName, accountHolderName, accountNumber, accountType } = req.body;

    // Validate required fields
    if (!bankName || !accountHolderName || !accountNumber || !accountType) {
        logger.warn("Missing required fields for payout update.");
        return next(new BadRequestError("Missing required fields."));
    }

    // Validate accountType
    if (!Object.values(AccountType).includes(accountType)) {
        logger.warn("Invalid accountType value.");
        return next(new BadRequestError("Invalid accountType value."));
    }

    try {
        // Get vendorId using user.id
        const vendor = await getVendorByUserId(user.id);
        if (!vendor) {
            logger.warn("Vendor not found for user.");
            return next(new BadRequestError("Vendor not found for user."));
        }

        // Update payout information
        const updateResult = await updateVendorAccount(vendor.id, {
            bankName,
            accountHolderName,
            accountNumber,
            accountType,
        });

        res.status(HttpStatusCode.OK).json({
            status: "ok",
            message: "Payout information updated successfully.",
            updatedCount: updateResult.count,
        });
    } catch (error) {
        logger.error("Error updating payout information:", error);
        next(new InternalServerError("Internal server error"));
    }
};