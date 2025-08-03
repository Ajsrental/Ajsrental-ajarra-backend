import { Request, Response, NextFunction } from "express";
import { createVendorWithServices } from "../../services/database/vendor";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { YearsInBusiness, VendorStatus, ServiceCategory, ServiceName } from "@prisma/client";
import { CustomRequest } from "../../../../middlewares/checkJwt";
import { lookUpNIN } from "../../../../libs/dojah/dojah";
import { DOJAHNinResponse } from "../../../../types/dojah";

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
            serviceCategory,
            phoneNumber,
            businessAddress,
            status,
            services // Array of strings: ["DJ", "MC_HOST"]
        } = req.body;

        // Validate required fields
        if (
            !businessName ||
            !rcNumber ||
            !nin ||
            !yearsInBusiness ||
            !serviceCategory ||
            !phoneNumber ||
            !businessAddress ||
            !Array.isArray(services) ||
            services.length === 0
        ) {
            logger.warn("Missing required fields in vendor creation.");
            return next(new BadRequestError("Missing required fields."));
        }

        // Validate enums
        if (!Object.values(YearsInBusiness).includes(yearsInBusiness)) {
            logger.warn("Invalid yearsInBusiness value.");
            return next(new BadRequestError("Invalid yearsInBusiness value."));
        }
        if (!Object.values(ServiceCategory).includes(serviceCategory)) {
            logger.warn("Invalid serviceCategory value.");
            return next(new BadRequestError("Invalid serviceCategory value."));
        }
        if (status && !Object.values(VendorStatus).includes(status)) {
            logger.warn("Invalid status value.");
            return next(new BadRequestError("Invalid status value."));
        }
        for (const serviceName of services) {
            if (!Object.values(ServiceName).includes(serviceName)) {
                return next(new BadRequestError(`Invalid service name: ${serviceName}`));
            }
        }

        // Validate NIN
        let verificationResult: DOJAHNinResponse;
        try {
            if(nin) {
                verificationResult = await lookUpNIN(nin);
                if (!verificationResult || !verificationResult.entity) {
                    logger.warn("NIN verification failed or returned no data.");
                    return next(new BadRequestError("NIN verification failed."));
                }
            }
        } catch (error:any) {
            logger.error("Error during NIN verification:", error);
            return next(new InternalServerError("Internal server error"));
        }


        const vendor = await createVendorWithServices({
            businessName,
            rcNumber,
            nin,
            yearsInBusiness,
            serviceCategory,
            phoneNumber,
            businessAddress,
            status: status || VendorStatus.PENDING,
            userId: user.id,
            services: services, 
        });

        res.status(HttpStatusCode.CREATED).json(vendor);
    } catch (error) {
        logger.error("Error during vendor creation:", error);
        next(new InternalServerError("Internal server error"));
    }
};