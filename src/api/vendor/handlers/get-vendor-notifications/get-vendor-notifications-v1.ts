import { Request, Response, NextFunction } from "express";
import { getVendorByUserId } from "../../services/database/vendor";
import { getNotificationsByVendorId } from "../../services/database/notifications";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const getVendorNotificationsHandler = async (
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

        // Get all notifications for this vendor
        const notifications = await getNotificationsByVendorId(vendor.id);

        res.status(HttpStatusCode.OK).json({ notifications });
    } catch (error) {
        logger.error("Error fetching vendor notifications:", error);
        next(new InternalServerError("Internal server error"));
    }
};