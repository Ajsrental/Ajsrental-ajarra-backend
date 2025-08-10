import { prismaClient } from "../../../../utils/prisma";
import { logger } from "../../../../utils/logger";

/**
 * Retrieves contracts by the booking Id.
 * @param bookingId - The ID of the bookings whose .
 * @returns An array of a contracts records.
*/

export const getContractsByBookingId = async (BookingId: string) => {
    try {
        
        // Fetch bookings where vendorId matches the vendor's id
        const contract = await prismaClient.contract.findMany({
            where: { bookingId: BookingId },
        });

        logger.info("Fetched contract for booking with booking Id", { BookingId });
        return contract;
    } catch (error) {
        logger.error("Error fetching contract for booking", { BookingId, error });
        throw new Error("Failed to fetch contract");
    }
};

/**
 * Retrieves all contracts owned by a specific vendor.
 * @param vendorId - The ID of the vendor whose contracts should be retrieved.
 * @returns An array of contract records.
 */
export const getContractsByVendorId = async (vendorId: string) => {
    try {
        // Fetch contracts where vendorId matches
        const contracts = await prismaClient.contract.findMany({
            where: { vendorId: vendorId },
            orderBy: { createdAt: "desc" },
        });

        logger.info("Fetched contracts for vendor", { vendorId, count: contracts.length });
        return contracts;
    } catch (error) {
        logger.error("Error fetching contracts for vendor", { vendorId, error });
        throw new Error("Failed to fetch contracts for vendor");
    }
};