import { prismaClient } from "../../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "../../../../utils/logger";

/**
 * Upserts a service in the database.
 * If a service with the same ID exists, it updates the record.
 * Otherwise, it creates a new service.
 */
export const createService = async (
    data: Omit<Prisma.ServiceCreateInput, "vendor"> & { vendorId: string; id?: string }
) => {
    try {
        const service = await prismaClient.service.upsert({
            where: {
                id: data.id!, // id must be provided for update, otherwise upsert will fail
            },
            update: {
                description: data.description,
                images: data.images,
                serviceCategory: data.serviceCategory,
                location: data.location,
                pricingModel: data.pricingModel,
                priceMin: data.priceMin,
                priceMax: data.priceMax,
                priceFixed: data.priceFixed,
                updatedAt: new Date(),
            },
            create: {
                name: data.name,
                description: data.description,
                images: data.images,
                serviceCategory: data.serviceCategory,
                location: data.location,
                pricingModel: data.pricingModel,
                priceMin: data.priceMin,
                priceMax: data.priceMax,
                priceFixed: data.priceFixed,
                vendor: { connect: { id: data.vendorId } }, // <-- connect to vendor
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

export const getVendorByUserId = async (userId: string) => {
    return prismaClient.vendor.findUnique({ where: { userId } });
};