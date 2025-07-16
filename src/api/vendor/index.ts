import { Router } from "express";
import * as VendorController from "./handlers";
import { checkJwt } from "../../middlewares/checkJwt";

/**
 * @openapi
 * tags:
 *   - name: Vendor
 *     description: Vendor management and services endpoints
 */

const router = Router({ mergeParams: true });

// All vendor routes are protected by JWT authentication
router.use(checkJwt);

/**
 * @openapi
 * /vendor/create:
 *   post:
 *     tags:
 *       - Vendor
 *     summary: Create or update a vendor profile for the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName: { type: string }
 *               rcNumber: { type: string }
 *               nin: { type: string }
 *               yearsInBusiness: { type: string }
 *               businessCategory: { type: string }
 *               phoneNumber: { type: string }
 *               businessAddress: { type: string }
 *     responses:
 *       201:
 *         description: Vendor created or updated successfully
 */
router.post("/create", VendorController.createVendorHandler);

/**
 * @openapi
 * /vendor/update:
 *   patch:
 *     tags:
 *       - Vendor
 *     summary: Update vendor profile for the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName: { type: string }
 *               rcNumber: { type: string }
 *               nin: { type: string }
 *               yearsInBusiness: { type: string }
 *               businessCategory: { type: string }
 *               phoneNumber: { type: string }
 *               businessAddress: { type: string }
 *     responses:
 *       200:
 *         description: Vendor updated successfully
 */
router.patch("/update", VendorController.updateVendorHandler);


/**
 * @openapi
 * /vendor/get-services:
 *   get:
 *     tags:
 *       - Vendor
 *     summary: Get all services associated with the authenticated user's vendor profile
 *     responses:
 *       200:
 *         description: List of services returned successfully
 */
router.get("/get-services", VendorController.getServicesHandler);

/**
 * @openapi
 * /vendor/create-service:
 *   post:
 *     tags:
 *       - Vendor
 *     summary: Create a new service for the authenticated user's vendor profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               images: { type: array, items: { type: string } }
 *               serviceCategory: { type: string }
 *               location: { type: string }
 *               pricingModel: { type: string }
 *               priceMin: { type: integer }
 *               priceMax: { type: integer }
 *               priceFixed: { type: integer }
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post("/create-service", VendorController.createServiceHandler);

/**
 * @openapi
 * /vendor/get-profile-information:
 *   get:
 *     tags:
 *       - Vendor
 *     summary: Get profile information for the authenticated user (email, phone, vendorId, serviceName, serviceLocation, serviceDescription)
 *     responses:
 *       200:
 *         description: Profile information returned successfully
 */

router.get("/get-profile-information", VendorController.getProfileInformationHandler);

/**
 * @openapi
 * /vendor/update-service-description:
 *   patch:
 *     tags:
 *       - Vendor
 *     summary: Update the description for all services of the authenticated user's vendor profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service description updated successfully
 *       400:
 *         description: Bad request
 */
router.patch("/update-service-description", VendorController.updateServiceDescriptionHandler);

/**
 * @openapi
 * /vendor/update-service-location:
 *   patch:
 *     tags:
 *       - Vendor
 *     summary: Update the location for all services of the authenticated user's vendor profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service location updated successfully
 *       400:
 *         description: Bad request
 */
router.patch("/update-service-location", VendorController.updateServiceLocationHandler);

/**
 * @openapi
 * /vendor/update-email:
 *   patch:
 *     tags:
 *       - Vendor
 *     summary: Update the email for the authenticated user
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
 *         description: Email updated successfully
 *       400:
 *         description: Bad request
 */
router.patch("/update-email", VendorController.updateEmailHandler);

/**
 * @openapi
 * /vendor/update-phone-number:
 *   patch:
 *     tags:
 *       - Vendor
 *     summary: Update the phone number for the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone number updated successfully
 *       400:
 *         description: Bad request
 */
router.patch("/update-phone-number", VendorController.updatePhoneNumberHandler);

export default router;  