import { prismaClient } from "../../../../utils/prisma";
import { logger } from "../../../../utils/logger";

/**
 * Retrieves all notifications for a given vendorId.
 * This fetches notifications for all bookings associated with the vendor.
 * @param vendorId - The ID of the vendor whose notifications to fetch.
 * @returns An array of notification records.
 */
export const getNotificationsByVendorId = async (vendorId: string) => {
    try {
        // Find all booking IDs for this vendor
        const bookings = await prismaClient.booking.findMany({
            where: { vendorId },
            select: { id: true },
        });
        const bookingIds = bookings.map(b => b.id);

        // Fetch notifications linked to these bookings
        const notifications = await prismaClient.notification.findMany({
            where: {
                bookingId: { in: bookingIds.length > 0 ? bookingIds : [""] },
            },
            orderBy: { createdAt: "desc" },
        });

        logger.info("Fetched notifications for vendor", { vendorId, count: notifications.length });
        return notifications;
    } catch (error) {
        logger.error("Error fetching notifications for vendor", { vendorId, error });
        throw new Error("Failed to fetch notifications");
    }
};