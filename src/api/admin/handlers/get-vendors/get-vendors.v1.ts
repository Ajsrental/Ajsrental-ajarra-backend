import { Request, Response, NextFunction } from "express";
import { getAllVendors } from "../../services/database/vendor";
import { HttpStatusCode, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";

export const getAllVendorsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendors = await getAllVendors();
        res.status(HttpStatusCode.OK).json({ vendors });
    } catch (error) {
        logger.error("Error fetching all vendors:", error);
        next(new InternalServerError("Internal server error"));
    }
};