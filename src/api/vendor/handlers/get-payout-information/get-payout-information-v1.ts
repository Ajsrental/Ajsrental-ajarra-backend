import { Request, Response, NextFunction } from "express";
import { getVendorByUserId } from "../../services/database/vendor";
import { getVendorAccountByVendorId } from "../../services/database/vendorAccount";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const getPayoutInformationHandler = async (
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
        // Get vendorId using user.id
        const vendor = await getVendorByUserId(user.id);
        if (!vendor) {
            logger.warn("Vendor not found for user.");
            return next(new BadRequestError("Vendor not found for user."));
        }

        // Get payout information using vendorId
        const vendorAccount = await getVendorAccountByVendorId(vendor.id);
        if (!vendorAccount) {
            logger.warn("Payout information not found for vendor.");
            return next(new BadRequestError("Payout information not found for vendor."));
        }

        res.status(HttpStatusCode.OK).json(vendorAccount);
    } catch (error) {
        logger.error("Error fetching payout information:", error);
        next(new InternalServerError("Internal server error"));
    }
};