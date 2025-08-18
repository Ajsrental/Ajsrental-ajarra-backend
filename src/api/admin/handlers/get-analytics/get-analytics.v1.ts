import { Request, Response, NextFunction } from "express";
import { getAnalyticsData } from "../../services/database/analytics";
import { HttpStatusCode, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";

export const getAnalyticsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAnalyticsData();
        res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
        logger.error("Failed to get analytics", { error });
        next(new InternalServerError("Internal server error"));
    }
};