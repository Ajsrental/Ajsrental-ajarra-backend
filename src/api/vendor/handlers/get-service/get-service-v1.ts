import { Request, Response, NextFunction } from "express";
import { getServicesByVendorId } from "../../services/database/service";
import { getVendorByUserId } from "../../services/database/vendor";
import { HttpStatusCode, InternalServerError, BadRequestError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const getServicesHandler = async (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;
    const user = customReq.user;

    if (!user || !user.id) {
        logger.warn("User ID missing in request.");
        return next(new InternalServerError("User not found"));
    }

    try {
        // Get vendor by userId
        const vendor = await getVendorByUserId(user.id);
        if (!vendor) {
            logger.warn("Vendor profile not found for user.");
            return next(new BadRequestError("Vendor profile not found for user."));
        }

        // Get all services for this vendor
        const services = await getServicesByVendorId(vendor.id);

        res.status(HttpStatusCode.OK).json({ services });
    } catch (error) {
        logger.error("Error fetching services for user:", error);
        next(new InternalServerError("Internal server error"));
    }
};
