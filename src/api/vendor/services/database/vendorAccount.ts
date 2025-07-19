import { prismaClient } from "../../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "../../../../utils/logger";

/**
 * Creates a new VendorAccount record.
 * @param data - The VendorAccount data to create.
 * @returns The created VendorAccount object.
 */
export const createVendorAccount = async (
    data: Omit<Prisma.VendorAccountCreateInput, "vendor"> & { vendorId: string }
) => {
    try {
        const { vendorId, ...rest } = data;
        const vendorAccount = await prismaClient.vendorAccount.create({
            data: {
                ...rest,
                vendor: { connect: { id: vendorId } },
            },
        });
        logger.info("VendorAccount created successfully", { vendorAccountId: vendorAccount.id });
        return vendorAccount;
    } catch (error) {
        logger.error("Error creating VendorAccount", { error });
        throw new Error("Failed to create VendorAccount");
    }
};

/**
 * Updates a VendorAccount by vendorId with any provided fields.
 * @param vendorId - The vendor ID whose account to update.
 * @param data - The fields to update (partial VendorAccount fields).
 * @returns The result of the update operation.
 */
export const updateVendorAccount = async (
    vendorId: string,
    data: Partial<Omit<Prisma.VendorAccountUpdateInput, "vendor">>
) => {
    try {
        const result = await prismaClient.vendorAccount.updateMany({
            where: { vendorId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
        logger.info("VendorAccount(s) updated by vendorId", { vendorId, count: result.count });
        return result;
    } catch (error) {
        logger.error("Error updating VendorAccount by vendorId", { error });
        throw new Error("Failed to update VendorAccount");
    }
};

/**
 * Retrieves a VendorAccount by vendorId.
 * @param vendorId - The vendor ID whose account to fetch.
 * @returns The VendorAccount record or null.
 */
export const getVendorAccountByVendorId = async (vendorId: string) => {
    try {
        const vendorAccount = await prismaClient.vendorAccount.findUnique({
            where: { vendorId },
        });
        logger.info("Fetched VendorAccount by vendorId", { vendorId });
        return vendorAccount;
    } catch (error) {
        logger.error("Error fetching VendorAccount by vendorId", { error });
        throw new Error("Failed to fetch VendorAccount");
    }
};