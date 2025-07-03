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
 * /auth/verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP for user sign-up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", AuthController.verifyOtp);

/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend OTP for user sign-up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: New OTP sent successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: No OTP request found
 */
router.post("/resend-otp", AuthController.resendOtp);

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

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request a password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post("/forgot-password", AuthController.forgotPassword);

/**
 * @openapi
 * /auth/reset-password/{token}:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset password using a reset token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password/:token", AuthController.resetPassword);


/** Google handlers **/
router.get('/google', AuthController.initiateGoogleLogin);
router.get('/google/callback', AuthController.handleGoogleCallback);
router.get('/google/success', AuthController.googleLoginSuccess);
router.get('/google/error', AuthController.googleLoginError);
router.get('/google/signout', AuthController.googleLogout);

// /** Facebook handlers **/
router.get('/facebook', AuthController.initiateFacebookLogin);
router.get('/facebook/callback', AuthController.handleFacebookCallback);
router.get('/facebook/success', AuthController.facebookLoginSuccess);
router.get('/facebook/error', AuthController.facebookLoginError);
router.get('/facebook/signout', AuthController.facebookLogout);
router.get('/facebook/privacy-policy', AuthController.privacyPolicyHandler)
router.get('/facebook/terms-of-use', AuthController.termsOfUseHandler);



export default router;