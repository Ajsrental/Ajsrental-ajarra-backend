import { Router } from "express";
import * as Admincontroller from "./handlers";
import { checkJwt } from "../../middlewares/checkJwt";
import { checkIsAdmin } from "../../middlewares/checkRoles";

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin endpoints for managing vendors
 */

const router = Router({ mergeParams: true });

// Protect all admin routes
router.use(checkJwt, checkIsAdmin);

/**
 * @openapi
 * /admin/vendors:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all vendors
 *     responses:
 *       200:
 *         description: List of all vendors returned successfully
 */
router.get("/vendors", Admincontroller.getAllVendorsHandler);

/**
 * @openapi
 * /admin/vendor/status:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a vendor's status to APPROVED or REJECTED
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vendorId: { type: string }
 *               status: { type: string, enum: ["APPROVED", "REJECTED"] }
 *     responses:
 *       200:
 *         description: Vendor status updated successfully
 */
router.patch("/vendor/status", Admincontroller.updateVendorStatusHandler);

/**
 * @openapi
 * /admin/analytics:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get analytics dashboard data (overview, trends, top services)
 *     responses:
 *       200:
 *         description: Analytics payload returned successfully
 */
router.get("/analytics", Admincontroller.getAnalyticsHandler);

/**
 * @openapi
 * /admin/dashboard-stats:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin dashboard stats (totals + percentage changes)
 *     responses:
 *       200:
 *         description: Admin dashboard stats returned successfully
 */
router.get("/dashboard-stats", Admincontroller.getAdminStatsHandler);

/**
 * GET /api/v1/admin/bookings
 * returns: all bookings for admin with vendor & contract info
 */
router.get("/bookings", Admincontroller.getAllBookingsHandler);

export default router;