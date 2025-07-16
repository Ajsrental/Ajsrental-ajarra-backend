import { Request, Response, NextFunction } from "express";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";
import { updateUser } from "../../../authentication/services/database/user";

export const updatePhoneNumberHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const customReq = req as CustomRequest;
    const user = customReq.user;

    if (!user || !user.id) {
        logger.warn("User ID missing in request.");
        return next(new InternalServerError("User not found"));
    }

    const { phone } = req.body;
    if (!phone) {
        logger.warn("No phone number provided.");
        return next(new BadRequestError("Phone number is required."));
    }

    try {
        const updatedUser = await updateUser(
            { id: user.id },
            { phone }
        );

        res.status(HttpStatusCode.OK).json({
            status: "ok",
            message: "Phone number updated successfully.",
            user: {
                id: updatedUser.id,
                phone: updatedUser.phone
            }
        });
    } catch (error) {
        logger.error("Error updating phone number:", error);
        next(new InternalServerError("Internal server error"));
    }
};