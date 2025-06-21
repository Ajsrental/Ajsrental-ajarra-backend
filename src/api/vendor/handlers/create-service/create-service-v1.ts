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
            minPrice,
            maxPrice,
            fixedPrice,
            startingPrice
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

        // Pricing model checks
        if (pricingModel === PricingModel.FixedPrice) {
            if (fixedPrice == null) {
                logger.warn("fixedPrice is required for FixedPrice pricing model.");
                return next(new BadRequestError("fixedPrice is required for FixedPrice pricing model."));
            }
        } else if (pricingModel === PricingModel.PriceRange) {
            if (minPrice == null || maxPrice == null) {
                logger.warn("minPrice and maxPrice are required for PriceRange pricing model.");
                return next(new BadRequestError("minPrice and maxPrice are required for PriceRange pricing model."));
            }
        } else if (pricingModel === PricingModel.StartingFrom) {
            if (fixedPrice == null) {
                logger.warn("fixedPrice is required for StartingFrom pricing model.");
                return next(new BadRequestError("fixedPrice is required for StartingFrom pricing model."));
            }
        } else if (pricingModel === PricingModel.CustomQuote) {
            if (minPrice != null || maxPrice != null || fixedPrice != null || startingPrice != null) {
                logger.warn("All pricing fields must be null for CustomQuote pricing model.");
                return next(new BadRequestError("All pricing fields must be null for CustomQuote pricing model."));
            }
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
            minPrice,
            maxPrice,
            fixedPrice,
            startingPrice,
            vendorId: vendor.id
        });

        res.status(HttpStatusCode.CREATED).json(service);
    } catch (error) {
        logger.error("Error during service creation:", error);
        next(new InternalServerError("Internal server error"));
    }
};