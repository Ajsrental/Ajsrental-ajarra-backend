import { Request, Response, NextFunction } from "express";
import { createVendor } from "../../services/database/vendor";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { YearsInBusiness, BusinessCategory, VendorStatus } from "@prisma/client";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const createVendorHandler = async (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;
    const user = customReq.user;

    if (!user || !user.id) {
        logger.warn("User ID missing in request.");
        return next(new InternalServerError("User not found"));
    }
    try {
        const {
            businessName,
            rcNumber,
            nin,
            yearsInBusiness,
            businessCategory,
            phoneNumber,
            businessAddress,
            status
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
        if (status && !Object.values(VendorStatus).includes(status)) {
            logger.warn("Invalid status value.");
            return next(new BadRequestError("Invalid status value."));
        }

        const vendor = await createVendor({
            businessName,
            rcNumber,
            nin,
            yearsInBusiness,
            businessCategory,
            phoneNumber,
            businessAddress,
            status: status || VendorStatus.PENDING,
            userId: user.id
        });

        res.status(HttpStatusCode.CREATED).json(vendor);
    } catch (error) {
        logger.error("Error during vendor creation:", error);
        next(new InternalServerError("Internal server error"));
    }
};