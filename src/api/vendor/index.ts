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
 *     summary: Create a vendor profile for the authenticated user
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
 *               yearsInBusiness: { type: string, enum: [LESS_THAN_ONE, ONE_TO_TWO, TWO_TO_FIVE, FIVE_TO_TEN, TEN_PLUS] }
 *               serviceCategory: { type: string }
 *               phoneNumber: { type: string }
 *               businessAddress: { type: string }
 *               status: { type: string }
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of service names (max 2 per category, e.g. ["DJ", "MC_HOST"])
 *     responses:
 *       201:
 *         description: Vendor created successfully
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
 *               yearsInBusiness: { type: string, enum: [LESS_THAN_ONE, ONE_TO_TWO, TWO_TO_FIVE, FIVE_TO_TEN, TEN_PLUS] }
 *               serviceCategory: { type: string }
 *               phoneNumber: { type: string }
 *               businessAddress: { type: string }
 *               status: { type: string }
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of service names (max 2 per category, e.g. ["DJ", "MC_HOST"])
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
 *             required:
 *               - name
 *               - description
 *               - images
 *               - location
 *               - pricingModel
 *               - availableHours
 *             properties:
 *               name:
 *                 type: string
 *                 description: Service name (must be a valid enum value)
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               pricingModel:
 *                 type: string
 *                 enum: [FixedPrice, PriceRange, StartingFrom, CustomQuote]
 *               availableHours:
 *                 type: string
 *                 description: Must be a valid AvailableHours enum value
 *               minPrice:
 *                 type: integer
 *                 nullable: true
 *               maxPrice:
 *                 type: integer
 *                 nullable: true
 *               fixedPrice:
 *                 type: integer
 *                 nullable: true
 *               startingPrice:
 *                 type: integer
 *                 nullable: true
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

/**
 * @openapi
 * /vendor/update-service-name:
 *   patch:
 *     tags:
 *       - Vendor
 *     summary: Update the name for all services of the authenticated user's vendor profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service name updated successfully
 *       400:
 *         description: Bad request
 */
router.patch("/update-service-name", VendorController.updateServiceNameHandler);

/**
 * @openapi
 * /vendor/create-payout-account:
 *   post:
 *     tags:
 *       - Vendor
 *     summary: Create payout account for the authenticated user's vendor profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName: { type: string }
 *               accountHolderName: { type: string }
 *               accountNumber: { type: string }
 *               accountType: { type: string, enum: [SAVINGS, CURRENT] }
 *               utilityBillUrl: { type: string }
 *               validIdUrl: { type: string }
 *               businessCertUrl: { type: string }
 *     responses:
 *       201:
 *         description: Payout account created successfully
 *       400:
 *         description: Bad request
 */
router.post("/create-payout-account", VendorController.createPayoutAccountHandler);

/**
 * @openapi
 * /vendor/get-payout-information:
 *   get:
 *     tags:
 *       - Vendor
 *     summary: Get payout account information for the authenticated user's vendor profile
 *     responses:
 *       200:
 *         description: Payout information returned successfully
 *       400:
 *         description: Bad request
 */
router.get("/get-payout-information", VendorController.getPayoutInformationHandler);

/**
 * @openapi
 * /vendor/update-payout-information:
 *   patch:
 *     tags:
 *       - Vendor
 *     summary: Update payout account information for the authenticated user's vendor profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName: { type: string }
 *               accountHolderName: { type: string }
 *               accountNumber: { type: string }
 *               accountType: { type: string, enum: [SAVINGS, CURRENT] }
 *     responses:
 *       200:
 *         description: Payout information updated successfully
 *       400:
 *         description: Bad request
 */
router.patch("/update-payout-information", VendorController.updatePayoutInformationHandler);

/**
 * @openapi
 * /vendor/get-bookings:
 *   get:
 *     tags:
 *       - Vendor
 *     summary: Get all bookings associated with the authenticated user's vendor profile
 *     responses:
 *       200:
 *         description: List of bookings returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       vendorId: { type: string }
 *                       service: { type: string }
 *                       clientName: { type: string, nullable: true }
 *                       bookingDate: { type: string, format: date-time }
 *                       notes: { type: string, nullable: true }
 *                       status: { type: string }
 *                       amount: { type: number, nullable: true }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *       400:
 *         description: Bad request
 */
router.get("/get-bookings", VendorController.getBookingsHandler);

/**
 * @openapi
 * /vendor/get-notifications:
 *   get:
 *     tags:
 *       - Vendor
 *     summary: Get all notifications associated with the authenticated user's vendor profile
 *     responses:
 *       200:
 *         description: List of notifications returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       userId: { type: string }
 *                       bookingId: { type: string, nullable: true }
 *                       type: { type: string }
 *                       message: { type: string }
 *                       read: { type: boolean }
 *                       createdAt: { type: string, format: date-time }
 *       400:
 *         description: Bad request
 */
router.get("/get-notifications", VendorController.getVendorNotificationsHandler);

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Get all contracts for the logged-in vendor
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved contracts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contracts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contract'
 *       400:
 *         description: Vendor not found
 *       500:
 *         description: Internal server error
 */

router.get("/get-contract-details", VendorController.getContractHandler)


export default router;  