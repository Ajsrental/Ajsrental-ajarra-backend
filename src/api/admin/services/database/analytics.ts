import { prismaClient } from "../../../../utils/prisma";
import { logger } from "../../../../utils/logger";

/**
 * Returns overview and charting data for analytics dashboard.
*/

export const getAnalyticsData = async () => {
    try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            revThisAgg,
            revPrevAgg,
            bookingsThisCount,
            bookingsPrevCount,
            totalUsers,
            newUsersThis,
            newUsersPrev,
        ] = await Promise.all([
            prismaClient.booking.aggregate({
                _sum: { amount: true },
                where: { amount: { not: null }, createdAt: { gte: startOfThisMonth } },
            }),
            prismaClient.booking.aggregate({
                _sum: { amount: true },
                where: { amount: { not: null }, createdAt: { gte: startOfPrevMonth, lt: startOfThisMonth } },
            }),
            prismaClient.booking.count({ where: { createdAt: { gte: startOfThisMonth } } }),
            prismaClient.booking.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfThisMonth } } }),
            prismaClient.user.count(),
            prismaClient.user.count({ where: { createdAt: { gte: startOfThisMonth } } }),
            prismaClient.user.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfThisMonth } } }),
        ]);

        const revenueThisMonth = revThisAgg._sum.amount ?? 0;
        const revenuePrevMonth = revPrevAgg._sum.amount ?? 0;
        const revenueChangePercent =
            revenuePrevMonth === 0 ? (revenueThisMonth === 0 ? 0 : 100) : ((revenueThisMonth - revenuePrevMonth) / Math.abs(revenuePrevMonth)) * 100;

        const bookingsChangePercent =
            bookingsPrevCount === 0 ? (bookingsThisCount === 0 ? 0 : 100) : ((bookingsThisCount - bookingsPrevCount) / Math.abs(bookingsPrevCount)) * 100;

        // activeUsers = total users in system; percent change computed from new users this month vs prev month
        const activeUsers = totalUsers;
        const activeUsersChangePercent =
            newUsersPrev === 0 ? (newUsersThis === 0 ? 0 : 100) : ((newUsersThis - newUsersPrev) / Math.abs(newUsersPrev)) * 100;

        // Top performing services: aggregate by "service" field in Booking
        // Get current month aggregates per service (limit top 5 by revenue)
        const topThisMonthRaw: Array<{ service: string; bookings: string; revenue: string }> =
            await prismaClient.$queryRaw`
              SELECT b."service" as service, COUNT(*)::text as bookings, COALESCE(SUM(b.amount),0)::text as revenue
              FROM "Booking" b
              WHERE b."createdAt" >= ${startOfThisMonth}
              GROUP BY b."service"
              ORDER BY SUM(b.amount) DESC
              LIMIT 5
            `;

        // Get previous month aggregates per service
        const topPrevMonthRaw: Array<{ service: string; bookings: string; revenue: string }> =
            await prismaClient.$queryRaw`
              SELECT b."service" as service, COUNT(*)::text as bookings, COALESCE(SUM(b.amount),0)::text as revenue
              FROM "Booking" b
              WHERE b."createdAt" >= ${startOfPrevMonth} AND b."createdAt" < ${startOfThisMonth}
              GROUP BY b."service"
            `;

        const prevMap = new Map<string, { bookings: number; revenue: number }>();
        for (const r of topPrevMonthRaw) {
            prevMap.set(r.service, { bookings: Number(r.bookings), revenue: Number(r.revenue) });
        }

        const topServices = topThisMonthRaw.map(r => {
            const serviceName = r.service;
            const bookingsCount = Number(r.bookings);
            const revenue = Number(r.revenue);
            const prev = prevMap.get(serviceName) ?? { bookings: 0, revenue: 0 };
            const revenueChangePercent = prev.revenue === 0 ? (revenue === 0 ? 0 : 100) : ((revenue - prev.revenue) / Math.abs(prev.revenue)) * 100;
            const bookingsChangePercent = prev.bookings === 0 ? (bookingsCount === 0 ? 0 : 100) : ((bookingsCount - prev.bookings) / Math.abs(prev.bookings)) * 100;
            return {
                service: serviceName,
                bookingsCount,
                revenue,
                revenueChangePercent,
                bookingsChangePercent,
            };
        });

        return {
            overview: {
                revenue: revenueThisMonth,
                revenueChangePercent,
                totalBookings: bookingsThisCount,
                bookingsChangePercent,
                activeUsers,
                activeUsersChangePercent,
            },
            topServices, // new section for UI
        };
    } catch (error) {
        logger.error("Error building analytics data", { error });
        throw error;
    }
};

/**
 * Admin dashboard stats:
 * - totalVendors: total vendor count
 * - totalVendorsChangePercent: percent change (new vendors this month vs prev month)
 * - activeUsers: total user count
 * - activeUsersChangePercent: percent change (new users this month vs prev month)
 * - totalBookings: total booking count
 * - bookingsChangePercent: percent change (bookings this month vs prev month)
 * - newUsersLastWeek: number of users created in the previous week
 * - newUsersLastWeekChangePercent: percent change vs the week before that
 */

export const getAdminDashboardStats = async () => {
    try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // week windows: previous week = [startOfToday -7d, startOfToday)
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const prevWeekStart = new Date(startOfToday);
        prevWeekStart.setDate(prevWeekStart.getDate() - 7);
        const weekBeforeStart = new Date(startOfToday);
        weekBeforeStart.setDate(weekBeforeStart.getDate() - 14);

        const [
            totalVendors,
            newVendorsThisMonth,
            newVendorsPrevMonth,
            activeUsers, // total users
            newUsersThisMonth,
            newUsersPrevMonth,
            totalBookings,
            bookingsThisMonth,
            bookingsPrevMonth,
            newUsersLastWeek,
            newUsersWeekBefore,
        ] = await Promise.all([
            prismaClient.vendor.count(),
            prismaClient.vendor.count({ where: { createdAt: { gte: startOfThisMonth } } }),
            prismaClient.vendor.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfThisMonth } } }),

            prismaClient.user.count(),
            prismaClient.user.count({ where: { createdAt: { gte: startOfThisMonth } } }),
            prismaClient.user.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfThisMonth } } }),

            prismaClient.booking.count(),
            prismaClient.booking.count({ where: { createdAt: { gte: startOfThisMonth } } }),
            prismaClient.booking.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfThisMonth } } }),

            prismaClient.user.count({ where: { createdAt: { gte: prevWeekStart, lt: startOfToday } } }),
            prismaClient.user.count({ where: { createdAt: { gte: weekBeforeStart, lt: prevWeekStart } } }),
        ]);

        const calcPercent = (current: number, previous: number) => {
            if (previous === 0) return current === 0 ? 0 : 100;
            return ((current - previous) / Math.abs(previous)) * 100;
        };

        const totalVendorsChangePercent = +calcPercent(newVendorsThisMonth, newVendorsPrevMonth).toFixed(2);
        const activeUsersChangePercent = +calcPercent(newUsersThisMonth, newUsersPrevMonth).toFixed(2);
        const bookingsChangePercent = +calcPercent(bookingsThisMonth, bookingsPrevMonth).toFixed(2);
        const newUsersLastWeekChangePercent = +calcPercent(newUsersLastWeek, newUsersWeekBefore).toFixed(2);

        // fetch pending vendors (return basic fields for admin UI)
        const pendingVendors = await prismaClient.vendor.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                businessName: true,
                rcNumber: true,
                serviceCategory: true,
                phoneNumber: true,
                businessAddress: true,
                userId: true,
                createdAt: true,
            },
        });

        return {
            totalVendors,
            totalVendorsChangePercent,
            activeUsers,
            activeUsersChangePercent,
            totalBookings,
            bookingsChangePercent,
            newUsersLastWeek,
            newUsersLastWeekChangePercent,
            pendingVendors
        };
    } catch (error) {
        logger.error("Error building admin dashboard stats", { error });
        throw error;
    }
};