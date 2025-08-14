import { prismaClient } from "../../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import { ServiceCategory, ServiceName } from "@prisma/client";
import { logger } from "../../../../utils/logger";

/**
 * Creates a vendor and associated vendor services.
 * @param data - Vendor data and an array of service names (strings).
 * @returns The created vendor with services.
 */
export const createVendorWithServices = async (
    data: Omit<Prisma.VendorCreateInput, "user" | "vendorServices"> & { userId: string, services: string[] }
) => {
    try {
        const { userId, services, serviceCategory, ...vendorData } = data;

        // Create the vendor
        const vendor = await prismaClient.vendor.create({
            data: {
                ...vendorData,
                serviceCategory,
                user: { connect: { id: userId } },
            },
        });

        // For each service name, create VendorService with the vendor's serviceCategory
        for (const serviceName of services) {
            // Validate name
            if (!Object.values(ServiceName).includes(serviceName as ServiceName)) {
                throw new Error(`Invalid service name: ${serviceName}`);
            }

            // Check if vendor already has 2 services in this category
            const count = await prismaClient.vendorService.count({
                where: {
                    vendorId: vendor.id,
                    category: serviceCategory,
                },
            });
            if (count >= 2) {
                throw new Error(`Cannot add more than 2 services for category ${serviceCategory}`);
            }
            await prismaClient.vendorService.create({
                data: {
                    vendorId: vendor.id,
                    name: serviceName as ServiceName,
                    category: serviceCategory,
                },
            });
        }

        logger.info("Vendor and services created successfully", { vendorId: vendor.id });
        return vendor;
    } catch (error) {
        logger.error("Error creating vendor with services", { error });
        throw new Error('Failed to create vendor and services');
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
    data: Partial<Omit<Prisma.VendorUpdateInput, "user">> & { services?: string[] }
) => {
    try {
        // Separate services from vendor fields
        const { services, ...vendorFields } = data;

        // Update the vendor table
        const vendorUpdate = await prismaClient.vendor.updateMany({
            where: { userId },
            data: {
                ...vendorFields,
                updatedAt: new Date(),
            },
        });

        // If services are provided, update the VendorService table
        if (services && services.length > 0) {
            // Get the vendor record
            const vendor = await prismaClient.vendor.findUnique({ where: { userId } });
            if (!vendor) throw new Error("Vendor not found for updating services");

            // Delete existing VendorService records for this vendor and category
            await prismaClient.vendorService.deleteMany({
                where: { vendorId: vendor.id, category: vendor.serviceCategory },
            });

            // Add new VendorService records (max 2 per category)
            let count = 0;
            for (const serviceName of services) {
                if (!Object.values(ServiceName).includes(serviceName as ServiceName)) {
                    throw new Error(`Invalid service name: ${serviceName}`);
                }
                if (count >= 2) break;
                await prismaClient.vendorService.create({
                    data: {
                        vendorId: vendor.id,
                        name: serviceName as ServiceName,
                        category: vendor.serviceCategory,
                    },
                });
                count++;
            }
        }

        logger.info("Vendor and services updated by userId", { userId, count: vendorUpdate.count });
        return vendorUpdate;
    } catch (error) {
        logger.error("Error updating vendor and services by userId", { error });
        throw new Error("Failed to update vendor and services");
    }
};

/**
 * Retrieves a vendor by userId.
 * @param userId - The ID of the user whose vendor profile to fetch.
 * @returns The vendor record or null.
 */
export const getVendorByUserId = async (userId: string) => {
    return prismaClient.vendor.findUnique({ where: { userId } });
};

/**
 * Retrieves a vendor by userId.
 * @param rcNumber - The RC Number of the vendor to fetch.
 * @returns The vendor record or null.
 */

export const getVendorByRcNumber = async (rcNumber: string) => {
    return prismaClient.vendor.findUnique({ where: { rcNumber } });
}

