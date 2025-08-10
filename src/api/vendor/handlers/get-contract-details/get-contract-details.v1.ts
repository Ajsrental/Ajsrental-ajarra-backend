import { Request, Response, NextFunction } from "express";
import { getVendorByUserId } from "../../services/database/vendor";
import {  getContractsByBookingId } from "../../services/database/contract";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";

/**
 * Handler: Get contract(s) by bookingId for a vendor
*/

export const getContractHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const customReq = req as CustomRequest;
    const user = customReq.user;
    const bookingId = req.params.bookingId;

    if (!user || !user.id) {
        logger.warn("User ID missing in request.");
        return next(new InternalServerError("User not found"));
    }

    if (!bookingId) {
        logger.warn("Booking ID missing in request params.");
        return next(new BadRequestError("Booking ID is required."));
    }

    try {
        // Get vendor by user ID
        const vendor = await getVendorByUserId(user.id);
        if (!vendor) {
            logger.warn(`Vendor not found for user ${user.id}`);
            return next(new BadRequestError("Vendor not found for user."));
        }

        // Fetch contracts related to this booking
        const contracts = await getContractsByBookingId(bookingId);

        res.status(HttpStatusCode.OK).json({ contracts });
    } catch (error) {
        logger.error(`Error fetching contracts for booking ${bookingId}:`, error);
        next(new InternalServerError("Internal server error"));
    }
};