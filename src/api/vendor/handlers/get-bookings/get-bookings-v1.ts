import { Request, Response, NextFunction } from "express";
import { getVendorByUserId } from "../../services/database/vendor";
import { getBookingsByVendorId } from "../../services/database/bookings";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const getBookingsHandler = async (
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
        // Get vendor by user ID
        const vendor = await getVendorByUserId(user.id);
        if (!vendor) {
            logger.warn("Vendor not found for user.");
            return next(new BadRequestError("Vendor not found for user."));
        }

        // Get all bookings for this vendor
        const bookings = await getBookingsByVendorId(vendor.id);

        res.status(HttpStatusCode.OK).json({ bookings });
    } catch (error) {
        logger.error("Error fetching bookings:", error);
        next(new InternalServerError("Internal server error"));
    }
};