import { Request, Response, NextFunction } from "express";
import { createService, getVendorByUserId } from "../../services/database/service";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { Category, PricingModel } from "@prisma/client";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const createServiceHandler = async (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;
    const user = customReq.user;

    if (!user || !user.id) {
        logger.warn("User ID missing in request.");
        return next(new InternalServerError("User not found"));
    }

    try {
        const {
            name,
            description,
            images,
            serviceCategory,
            location,
            pricingModel,
            priceMin,
            priceMax,
            priceFixed
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !description ||
            !images ||
            !serviceCategory ||
            !location ||
            !pricingModel
        ) {
            logger.warn("Missing required fields in service creation.");
            return next(new BadRequestError("Missing required fields."));
        }

        // Validate enums
        if (!Object.values(Category).includes(serviceCategory)) {
            logger.warn("Invalid serviceCategory value.");
            return next(new BadRequestError("Invalid serviceCategory value."));
        }
        if (!Object.values(PricingModel).includes(pricingModel)) {
            logger.warn("Invalid pricingModel value.");
            return next(new BadRequestError("Invalid pricingModel value."));
        }

        // Get vendorId from userId
        const vendor = await getVendorByUserId(user.id);
        if (!vendor) {
            logger.warn("Vendor profile not found for user.");
            return next(new BadRequestError("Vendor profile not found for user."));
        }

        const service = await createService({
            name,
            description,
            images,
            serviceCategory,
            location,
            pricingModel,
            priceMin,
            priceMax,
            priceFixed,
            vendorId: vendor.id
        });

        res.status(HttpStatusCode.CREATED).json(service);
    } catch (error) {
        logger.error("Error during service creation:", error);
        next(new InternalServerError("Internal server error"));
    }
};