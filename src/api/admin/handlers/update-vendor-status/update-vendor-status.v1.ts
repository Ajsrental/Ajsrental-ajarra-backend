import { Request, Response, NextFunction } from "express";
import { updateVendorStatus } from "../../services/database/vendor";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";

/**
 * Handler to update a vendor's status to APPROVED or REJECTED.
 * Expects vendorId and status ("APPROVED" or "REJECTED") in the request body.
 */
export const updateVendorStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vendorId, status } = req.body;

        if (!vendorId || !status) {
            logger.warn("Missing vendorId or status in updateVendorStatusHandler.");
            return next(new BadRequestError("vendorId and status are required."));
        }

        if (status !== "APPROVED" && status !== "REJECTED") {
            logger.warn("Invalid status value in updateVendorStatusHandler.");
            return next(new BadRequestError("Status must be either 'APPROVED' or 'REJECTED'."));
        }

        const updatedVendor = await updateVendorStatus(vendorId, status);

        res.status(HttpStatusCode.OK).json({
            message: `Vendor status updated to ${status}`,
            vendor: updatedVendor,
        });
    } catch (error) {
        logger.error("Error updating vendor status:", error);
        next(new InternalServerError("Internal server error"));
    }
};
