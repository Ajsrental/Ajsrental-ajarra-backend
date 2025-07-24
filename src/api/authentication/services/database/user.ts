import { prismaClient } from "../../../../utils/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "../../../../utils/logger";

export const createUser = async (data: Prisma.UserCreateInput) => {
    try {
        const user = await prismaClient.user.create({
            data
        });
        logger.info("User created successfully", { userId: user.id });
        return user;
    } catch (error) {
        logger.error("Error creating user", { error });
        throw new Error('Failed to create user');
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

export const updateUser = async (
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
) => {
    try {
        const updatedUser = await prismaClient.user.update({
            where,
            data,
        });
        logger.info("User updated successfully", { userId: updatedUser.id });
        return updatedUser;
    } catch (error) {
        logger.error("Error updating user", { error });
        throw new Error('Failed to update user');
    }
};