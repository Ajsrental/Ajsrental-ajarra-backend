import { prismaClient } from "../../../../utils/prisma";
import { logger } from "../../../../utils/logger";

/**
 * Retrieves all vendors from the database.
 * @returns An array of vendor records.
 */
export const getAllVendors = async () => {
    try {
        const vendors = await prismaClient.vendor.findMany({
            orderBy: { createdAt: "desc" }
        });
        logger.info("Fetched all vendors", { count: vendors.length });
        return vendors;
    } catch (error) {
        logger.error("Error fetching all vendors", { error });
        throw new Error("Failed to fetch vendors");
    }
};

/**
 * Updates the status of a vendor to APPROVED or REJECTED.
 * @param vendorId - The ID of the vendor to update.
 * @param status - The new status ("APPROVED" or "REJECTED").
 * @returns The updated vendor record.
 */
export const updateVendorStatus = async (
    vendorId: string,
    status: "APPROVED" | "REJECTED"
) => {
    try {
        const updatedVendor = await prismaClient.vendor.update({
            where: { id: vendorId },
            data: { status },
        });
        logger.info("Vendor status updated", { vendorId, status });
        return updatedVendor;
    } catch (error) {
        logger.error("Error updating vendor status", { error });
        throw new Error("Failed to update vendor status");
    }
};