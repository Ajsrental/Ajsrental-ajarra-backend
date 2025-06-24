import { prismaClient } from "../../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "../../../../utils/logger";

/**
 * Upserts a vendor in the database based on RC Number.
 * If a vendor with the same rcNumber exists, it updates the record.
 * Otherwise, it creates a new vendor.
 */
export const createVendor = async (data: Omit<Prisma.VendorCreateInput, "user"> & { userId: string }) => {
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
                status: data.status || "PENDING", // Default to PENDING if not provided
                user: { connect: { id: data.userId } }, // <-- use nested connect
                updatedAt: new Date(),
            },
            create: {
                businessName: data.businessName,
                rcNumber: data.rcNumber,
                nin: data.nin,
                yearsInBusiness: data.yearsInBusiness,
                businessCategory: data.businessCategory,
                phoneNumber: data.phoneNumber,
                businessAddress: data.businessAddress,
                status: data.status || "PENDING",
                user: { connect: { id: data.userId } }, // <-- use nested connect
            },
        });
        logger.info("Vendor upserted successfully", { vendorId: vendor.id });
        return vendor;
    } catch (error) {
        logger.error("Error upserting vendor", { error });
        throw new Error('Failed to create or update vendor');
    }
};

/**
 * Updates a vendor by userId with any provided fields.
 * @param userId - The user ID of the vendor owner.
 * @param data - The fields to update (partial Vendor fields).
 * @returns The updated vendor object.
 */
export const updateVendorByUserId = async (
    userId: string,
    data: Partial<Omit<Prisma.VendorUpdateInput, "user">>
) => {
    try {
        const vendor = await prismaClient.vendor.updateMany({
            where: { userId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
        logger.info("Vendor(s) updated by userId", { userId, count: vendor.count });
        return vendor;
    } catch (error) {
        logger.error("Error updating vendor by userId", { error });
        throw new Error("Failed to update vendor");
    }
};