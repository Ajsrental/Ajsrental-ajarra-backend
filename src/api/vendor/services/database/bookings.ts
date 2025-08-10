import { prismaClient } from "../../../../utils/prisma";
import { logger } from "../../../../utils/logger";

/**
 * Retrieves all bookings for a given vendorId.
 * @param vendorId - The ID of the vendor whose bookings to fetch.
 * @returns An array of booking records.
 */
export const getBookingsByVendorId = async (vendorId: string) => {
    try {
        
        // Fetch bookings where vendorId matches the vendor's id
        const bookings = await prismaClient.booking.findMany({
            where: { vendorId: vendorId },
            orderBy: { createdAt: "desc" },
        });

        logger.info("Fetched bookings for vendor", { vendorId, count: bookings.length });
        return bookings;
    } catch (error) {
        logger.error("Error fetching bookings for vendor", { vendorId, error });
        throw new Error("Failed to fetch bookings");
    }
};