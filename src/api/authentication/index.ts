import { Router } from "express";
import * as AuthController from "./handlers";
import { checkJwt } from "../../middlewares/checkJwt";

const router = Router({ mergeParams: true });

/**
 * @openapi
 * '/auth/sign-up':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad request
 */
router.post("/sign-up", AuthController.signUp);

/**
 * @openapi
 * '/auth/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *      200:
 *        description: Login successful
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.post("/login", AuthController.login);

export default router;