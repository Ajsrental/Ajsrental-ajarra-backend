import { Request, Response, NextFunction } from "express";
import { updateVendorByUserId } from "../../services/database/vendor";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { YearsInBusiness, BusinessCategory } from "@prisma/client";
import { CustomRequest } from "../../../../middlewares/checkJwt";

export const updateVendorHandler = async (req: Request, res: Response, next: NextFunction) => {
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
        } = req.body;

        // Prepare update data object with only provided fields
        const updateData: any = {};
        if (businessName !== undefined) updateData.businessName = businessName;
        if (rcNumber !== undefined) updateData.rcNumber = rcNumber;
        if (nin !== undefined) updateData.nin = nin;
        if (yearsInBusiness !== undefined) {
            if (!Object.values(YearsInBusiness).includes(yearsInBusiness)) {
                logger.warn("Invalid yearsInBusiness value.");
                return next(new BadRequestError("Invalid yearsInBusiness value."));
            }
            updateData.yearsInBusiness = yearsInBusiness;
        }
        if (businessCategory !== undefined) {
            if (!Object.values(BusinessCategory).includes(businessCategory)) {
                logger.warn("Invalid businessCategory value.");
                return next(new BadRequestError("Invalid businessCategory value."));
            }
            updateData.businessCategory = businessCategory;
        }
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (businessAddress !== undefined) updateData.businessAddress = businessAddress;

        if (Object.keys(updateData).length === 0) {
            logger.warn("No fields provided for update.");
            return next(new BadRequestError("No fields provided for update."));
        }

        const result = await updateVendorByUserId(user.id, updateData);

        if (result.count === 0) {
            logger.warn("No vendor found for this user.");
            return next(new BadRequestError("No vendor found for this user."));
        }

        res.status(HttpStatusCode.OK).json({ message: "Vendor updated successfully" });
    } catch (error) {
        logger.error("Error updating vendor:", error);
        next(new InternalServerError("Internal server error"));
    }
};