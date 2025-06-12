import { prismaClient } from "../../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "../../../../utils/logger";

/**
 * Upserts a vendor in the database based on RC Number.
 * If a vendor with the same rcNumber exists, it updates the record.
 * Otherwise, it creates a new vendor.
 */
export const createVendor = async (data: Prisma.VendorCreateInput) => {
    try {
        const vendor = await prismaClient.vendor.upsert({
            where: { rcNumber: data.rcNumber },
            update: {
                businessName: data.businessName,
                nin: data.nin,
                yearsInBusiness: data.yearsInBusiness,
                businessCategory: data.businessCategory,
                phoneNumber: data.phoneNumber,
                businessAddress: data.businessAddress,
                updatedAt: new Date(),
            },
            create: data,
        });
        logger.info("Vendor upserted successfully", { vendorId: vendor.id });
        return vendor;
    } catch (error) {
        logger.error("Error upserting vendor", { error });
        throw new Error('Failed to create or update vendor');
    }
};