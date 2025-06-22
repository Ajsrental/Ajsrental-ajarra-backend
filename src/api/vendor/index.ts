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

export default router;  