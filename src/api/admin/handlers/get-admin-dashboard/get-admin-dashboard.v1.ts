import { Request, Response, NextFunction } from "express";
import { getAdminDashboardStats } from "../../services/database/analytics";
import { HttpStatusCode, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";

export const getAdminStatsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await getAdminDashboardStats();
        res.status(HttpStatusCode.OK).json({ stats });
    } catch (error) {
        logger.error("Failed to fetch admin dashboard stats", { error });
        next(new InternalServerError("Internal server error"));
    }
};