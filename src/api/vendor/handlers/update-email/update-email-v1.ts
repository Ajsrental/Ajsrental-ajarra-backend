import { Request, Response, NextFunction } from "express";
import { HttpStatusCode, BadRequestError, InternalServerError } from "../../../../exceptions";
import { logger } from "../../../../utils/logger";
import { CustomRequest } from "../../../../middlewares/checkJwt";
import { updateUser } from "../../../authentication/services/database/user";

export const updateEmailHandler = async (
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

    const { email } = req.body;
    if (!email) {
        logger.warn("No email provided.");
        return next(new BadRequestError("Email is required."));
    }

    try {
        const updatedUser = await updateUser(
            { id: user.id },
            { email }
        );

        res.status(HttpStatusCode.OK).json({
            status: "ok",
            message: "Email updated successfully.",
            user: {
                id: updatedUser.id,
                email: updatedUser.email
            }
        });
    } catch (error) {
        logger.error("Error updating email:", error);
        next(new InternalServerError("Internal server error"));
    }
};