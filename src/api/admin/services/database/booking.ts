import { prismaClient } from "../../../../utils/prisma";
import { logger } from "../../../../utils/logger";


/**
 * Fetch all bookings for admin view (includes vendor basic info and contract if any)
 */

export const getAllBookings = async () => {
    try {
        const bookings = await prismaClient.booking.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                vendor: {
                    select: {
                        id: true,
                        businessName: true,
                        serviceCategory: true,
                        status: true,
                    },
                },
                contract: true,
            },
        });
        return bookings;
    } catch (error) {
        logger.error("Error fetching all bookings", { error });
        throw error;
    }
};

