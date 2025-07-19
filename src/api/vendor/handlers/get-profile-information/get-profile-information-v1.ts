import { Request, Response, NextFunction } from "express";
import { HttpStatusCode, InternalServerError, BadRequestError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";
import { getVendorByUserId, getServicesByVendorId } from "../../services/database/service";
import { findUser } from "../../../authentication/services/database/user";

export const getProfileInformationHandler = async (
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
        
        // Get user email and phone
        const dbUser = await findUser({ id: user.id });

        if (!dbUser) {
            logger.warn("User not found in database.");
            return next(new BadRequestError("User not found."));
        }

        // Get vendor by userId
        const vendor = await getVendorByUserId(user.id);

        if (!vendor) {
            logger.warn("Vendor profile not found for user.");
            return next(new BadRequestError("Vendor profile not found for user."));
        }

        // Get services for this vendor using the service function
        const services = await getServicesByVendorId(vendor.id);


        if (!services || services.length === 0) {
            logger.warn("No service found for vendor.");
            return next(new BadRequestError("No service found for vendor."));
        }

        // Use the first service for response
        const service = services[0];

        res.status(HttpStatusCode.OK).json({
            email: dbUser.email,
            phone: dbUser.phone,
            vendorId: vendor.id,
            serviceName: service.name,
            serviceLocation: service.location,
            serviceDescription: service.description
        });
    } catch (error) {
        logger.error("Error fetching profile information:", error);
        next(new InternalServerError("Internal server error"));
    }
};