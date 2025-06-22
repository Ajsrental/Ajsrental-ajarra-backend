import { prismaClient } from "../../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "../../../../utils/logger";

export const createUser = async (data: Prisma.UserCreateInput) => {
    try {
        const user = await prismaClient.user.upsert({
            where: { email: data.email },
            update: {
                // You can specify which fields to update if user exists
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                password: data.password,
                role: data.role,
                updatedAt: new Date(),
            },
            create: data,
        });
        logger.info("User upserted successfully", { userId: user.id });
        return user;
    } catch (error) {
        logger.error("Error upserting user", { error });
        throw new Error('Failed to create or update user');
    }
};

export const findUser = async (where: Prisma.UserWhereUniqueInput) => {
    try {
        const user = await prismaClient.user.findUnique({ where });
        return user;
    } catch (error) {
        logger.error("Error finding user", { error });
        throw new Error("Failed to find user");
    }
};