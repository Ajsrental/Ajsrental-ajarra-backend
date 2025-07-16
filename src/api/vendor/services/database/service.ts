import { prismaClient } from "../../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "../../../../utils/logger";

/**
 * Upserts a service in the database based on name and vendorId.
 * If a service with the same name and vendorId exists, it updates the record.
 * Otherwise, it creates a new service.
 * (Requires a unique constraint on [name, vendorId] in the Service model)
 */
export const createService = async (
    data: Omit<Prisma.ServiceCreateInput, "vendor"> & { vendorId: string }
) => {
    try {
        const service = await prismaClient.service.upsert({
            where: {
                name_vendorId: {
                    name: data.name,
                    vendorId: data.vendorId,
                },
            },
            update: {
                description: data.description,
                images: data.images,
                serviceCategory: data.serviceCategory,
                location: data.location,
                pricingModel: data.pricingModel,
                minPrice: data.minPrice,
                maxPrice: data.maxPrice,
                fixedPrice: data.fixedPrice,
                startingPrice: data.startingPrice,
                updatedAt: new Date(),
            },
            create: {
                name: data.name,
                description: data.description,
                images: data.images,
                serviceCategory: data.serviceCategory,
                location: data.location,
                pricingModel: data.pricingModel,
                minPrice: data.minPrice,
                maxPrice: data.maxPrice,
                fixedPrice: data.fixedPrice,
                startingPrice: data.startingPrice,
                vendor: { connect: { id: data.vendorId } },
            },
        });
        logger.info("Service upserted successfully", { serviceId: service.id });
        return service;
    } catch (error) {
        logger.error("Error upserting service", { error });
        throw new Error("Failed to upsert service");
    }
};

/**
 * Retrieves all services for a given vendorId.
 * @param vendorId - The ID of the vendor whose services to fetch.
 * @returns An array of service records.
 */
export const getServicesByVendorId = async (vendorId: string) => {
    try {
        const services = await prismaClient.service.findMany({
            where: { vendorId },
            orderBy: { createdAt: "desc" },
        });
        logger.info("Fetched services for vendor", { vendorId, count: services.length });
        return services;
    } catch (error) {
        logger.error("Error fetching services by vendorId", { error });
        throw new Error("Failed to fetch services");
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
 * Updates services by vendorId with any provided fields.
 * @param vendorId - The vendor ID whose services to update.
 * @param data - The fields to update (partial Service fields).
 * @returns The result of the update operation.
 */
export const updateServiceByVendorId = async (
    vendorId: string,
    data: Partial<Omit<Prisma.ServiceUpdateInput, "vendor">>
) => {
    try {
        const result = await prismaClient.service.updateMany({
            where: { vendorId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
        logger.info("Service(s) updated by vendorId", { vendorId, count: result.count });
        return result;
    } catch (error) {
        logger.error("Error updating services by vendorId", { error });
        throw new Error("Failed to update services");
    }
};