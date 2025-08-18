import { Request, Response, NextFunction } from "express";
import { getAllBookings } from "../../services/database/booking";
import { HttpStatusCode, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";

export const getAllBookingsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookings = await getAllBookings();
        res.status(HttpStatusCode.OK).json({ bookings });
    } catch (error) {
        logger.error("Failed to fetch bookings", { error });
        next(new InternalServerError("Internal server error"));
    }
};