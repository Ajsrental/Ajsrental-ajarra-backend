import { Request, Response, NextFunction } from "express";
import { createVendor } from "../../services/database/vendor";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { YearsInBusiness, BusinessCategory } from "@prisma/client";

export const createVendorHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            businessName,
            rcNumber,
            nin,
            yearsInBusiness,
            businessCategory,
            phoneNumber,
            businessAddress,
        } = req.body;

        // Validate required fields
        if (
            !businessName ||
            !rcNumber ||
            !nin ||
            !yearsInBusiness ||
            !businessCategory ||
            !phoneNumber ||
            !businessAddress
        ) {
            logger.warn("Missing required fields in vendor creation.");
            return next(new BadRequestError("Missing required fields."));
        }

        // Validate enums
        if (!Object.values(YearsInBusiness).includes(yearsInBusiness)) {
            logger.warn("Invalid yearsInBusiness value.");
            return next(new BadRequestError("Invalid yearsInBusiness value."));
        }
        if (!Object.values(BusinessCategory).includes(businessCategory)) {
            logger.warn("Invalid businessCategory value.");
            return next(new BadRequestError("Invalid businessCategory value."));
        }

        const vendor = await createVendor({
            businessName,
            rcNumber,
            nin,
            yearsInBusiness,
            businessCategory,
            phoneNumber,
            businessAddress,
        });

        res.status(HttpStatusCode.CREATED).json(vendor);
    } catch (error) {
        logger.error("Error during vendor creation:", error);
        next(new InternalServerError("Internal server error"));
    }
};