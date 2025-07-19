import { Request, Response, NextFunction } from "express";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";
import { getVendorByUserId, getServicesByVendorId, updateServiceByVendorId } from "../../services/database/service";

export const updateServiceNameHandler = async (
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

    const { name } = req.body;
    if (!name) {
        logger.warn("No service name provided.");
        return next(new BadRequestError("Service name is required."));
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

        // Update name for all services of this vendor
        await updateServiceByVendorId(vendor.id, { name });

        res.status(HttpStatusCode.OK).json({
            status: "ok",
            message: "Service name updated successfully.",
        });
    } catch (error) {
        logger.error("Error updating service name:", error);
        next(new InternalServerError("Internal server error"));
    }
};