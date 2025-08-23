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
 *     summary: Get all vendors (supports pagination, filtering and search)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (1-based). Default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of vendors per page. Default: 25
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Filter vendors by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Free text search across businessName, rcNumber or phoneNumber
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, businessName]
 *         description: Field to sort by. Default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction. Default: desc
 *     responses:
 *       200:
 *         description: List of vendors returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                 vendors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       businessName: { type: string }
 *                       rcNumber: { type: string }
 *                       nin: { type: string }
 *                       yearsInBusiness: { type: string }
 *                       serviceCategory: { type: string }
 *                       phoneNumber: { type: string }
 *                       businessAddress: { type: string }
 *                       status: { type: string, enum: [PENDING, APPROVED, REJECTED] }
 *                       userId: { type: string }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *       400:
 *         description: Bad request (invalid query parameters)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (requires admin role)
 *       500:
 *         description: Internal server error
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
 *     summary: Get analytics dashboard data (overview and top performing services)
 *     description: >
 *       Returns summary metrics (revenue, bookings, active users) with percent changes vs previous period,
 *       plus top-performing services for the current period. Optional query parameters let you adjust
 *       the aggregation window and how many top services to return.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of months to use for trends (not required for overview). Default handled server-side.
 *       - in: query
 *         name: topN
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of top services to return (default: 5)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional ISO date to override period start
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional ISO date to override period end
 *     responses:
 *       200:
 *         description: Analytics payload returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                   properties:
 *                     revenue:
 *                       type: number
 *                       description: Total revenue for the current period
 *                     revenueChangePercent:
 *                       type: number
 *                       description: Percent change vs previous period
 *                     totalBookings:
 *                       type: integer
 *                       description: Number of bookings in the current period
 *                     bookingsChangePercent:
 *                       type: number
 *                       description: Percent change in bookings vs previous period
 *                     activeUsers:
 *                       type: integer
 *                       description: Total users in the system
 *                     activeUsersChangePercent:
 *                       type: number
 *                       description: Percent change in new users vs previous period
 *                 topServices:
 *                   type: array
 *                   description: Top performing services for the current period
 *                   items:
 *                     type: object
 *                     properties:
 *                       service:
 *                         type: string
 *                         description: Service name (from Booking.service)
 *                       bookingsCount:
 *                         type: integer
 *                         description: Number of bookings for this service in the period
 *                       revenue:
 *                         type: number
 *                         description: Total revenue for this service in the period
 *                       revenueChangePercent:
 *                         type: number
 *                         description: Percent change in revenue vs previous period
 *                       bookingsChangePercent:
 *                         type: number
 *                         description: Percent change in bookings vs previous period
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - requires admin role
 *       500:
 *         description: Internal server error
 */
router.get("/analytics", Admincontroller.getAnalyticsHandler);

/**
 * @openapi
 * /admin/dashboard-stats:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin dashboard stats (totals, percentage changes and pending vendors)
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Returns total vendors, active users, total bookings, new users last week,
 *       percentage changes vs previous month/week and a list of pending vendors.
 *     responses:
 *       200:
 *         description: Admin dashboard statistics returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVendors:
 *                   type: integer
 *                   example: 1234
 *                 totalVendorsChangePercent:
 *                   type: number
 *                   example: 12.34
 *                 activeUsers:
 *                   type: integer
 *                   example: 33493
 *                 activeUsersChangePercent:
 *                   type: number
 *                   example: 8.12
 *                 totalBookings:
 *                   type: integer
 *                   example: 7786
 *                 bookingsChangePercent:
 *                   type: number
 *                   example: -4.5
 *                 newUsersLastWeek:
 *                   type: integer
 *                   example: 23
 *                 newUsersLastWeekChangePercent:
 *                   type: number
 *                   example: 9.1
 *                 pendingVendors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "ven_abc123"
 *                       businessName:
 *                         type: string
 *                         example: "Muna's Cocktail"
 *                       rcNumber:
 *                         type: string
 *                         example: "RC-123456"
 *                       serviceCategory:
 *                         type: string
 *                         example: "FOOD_AND_BEVERAGE"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+2348012345678"
 *                       businessAddress:
 *                         type: string
 *                         example: "Lagos, Nigeria"
 *                       userId:
 *                         type: string
 *                         example: "user_abc123"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-14T18:43:07.000Z"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - requires admin role
 *       500:
 *         description: Internal server error
 */
router.get("/dashboard-stats", Admincontroller.getAdminStatsHandler);

/**
 * GET /api/v1/admin/bookings
 * returns: all bookings for admin with vendor & contract info
*/

router.get("/bookings", Admincontroller.getAllBookingsHandler);

export default router;