import { Request, Response, NextFunction } from "express";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";
import { getServicesByVendorId, updateServiceByVendorId } from "../../services/database/service";
import { getVendorByUserId } from "../../services/database/vendor";

export const updateServiceLocationHandler = async (
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

    const { location } = req.body;
    if (!location) {
        logger.warn("No location provided.");
        return next(new BadRequestError("Location is required."));
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
        if (!services || services.length === 0) {
            logger.warn("No service found for vendor.");
            return next(new BadRequestError("No service found for vendor."));
        }

        // Update location for all services of this vendor
        await updateServiceByVendorId(vendor.id, { location });

        res.status(HttpStatusCode.OK).json({
            status: "ok",
            message: "Service location updated successfully.",
        });
    } catch (error) {
        logger.error("Error updating service location:", error);
        next(new InternalServerError("Internal server error"));
    }
};