const User = require('../models/User');
const Post = require('../models/Post');
const Route = require('../models/Route');
const RouteReport = require('../models/RouteReport');
const ShiftReport = require('../models/ShiftReport');
const Ticket = require('../models/Ticket');
const Stop = require('../models/Stop');
const ScanLog = require('../models/ScanLog');

const ROUTE_COLLECTION = Route.collection.name;
const DEFAULT_RANGE_DAYS = 30;
const DEFAULT_TOP_ROUTES = 5;

/**
 * @param {{ from?: Date; to?: Date; granularity?: 'day'|'week'|'month'; topRoutesLimit?: number }} opts
 */
async function getDashboardSummary(opts = {}) {
    const granularity = opts.granularity || 'day';
    const topRoutesLimit = Math.min(Math.max(Number(opts.topRoutesLimit) || DEFAULT_TOP_ROUTES, 1), 50);

    const now = new Date();
    let rangeFrom;
    let rangeTo;
    if (opts.from && opts.to) {
        rangeFrom = new Date(opts.from);
        rangeTo = new Date(opts.to);
    } else {
        rangeTo = now;
        rangeFrom = new Date(now);
        rangeFrom.setUTCDate(rangeFrom.getUTCDate() - DEFAULT_RANGE_DAYS);
        rangeFrom.setUTCHours(0, 0, 0, 0);
    }

    const rangeMatch = { $gte: rangeFrom, $lte: rangeTo };

    const toKeyedCounts = (rows, key = '_id') => {
        const out = {};
        for (const row of rows) {
            const k = row[key] == null ? 'unknown' : String(row[key]);
            out[k] = row.count;
        }
        return out;
    };

    const bucketField = (fieldPath) => {
        if (granularity === 'month') {
            return { $dateToString: { format: '%Y-%m', date: fieldPath, timezone: 'UTC' } };
        }
        if (granularity === 'week') {
            return {
                $concat: [
                    { $toString: { $year: fieldPath } },
                    '-W',
                    {
                        $toString: {
                            $week: fieldPath,
                        },
                    },
                ],
            };
        }
        return { $dateToString: { format: '%Y-%m-%d', date: fieldPath, timezone: 'UTC' } };
    };

    const seriesFromCreatedAt = async (Model, extraMatch = {}) => {
        const rows = await Model.aggregate([
            {
                $match: {
                    createdAt: rangeMatch,
                    ...extraMatch,
                },
            },
            {
                $group: {
                    _id: bucketField('$createdAt'),
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return rows.map((r) => ({ period: r._id, count: r.count }));
    };

    const shiftRevenueSeries = async () => {
        const rows = await ShiftReport.aggregate([
            {
                $match: {
                    createdAt: rangeMatch,
                },
            },
            {
                $group: {
                    _id: bucketField('$createdAt'),
                    revenue: { $sum: { $ifNull: ['$totalRevenue', 0] } },
                    reports: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return rows.map((r) => ({
            period: r._id,
            revenue: r.revenue,
            reports: r.reports,
        }));
    };

    const [
        totalUsers,
        usersActive,
        usersInactive,
        usersByRoleRows,
        totalPosts,
        postsInRange,
        totalRoutes,
        totalRouteReports,
        routeReportsInRange,
        routeReportsByStatusRows,
        routeReportsByTypeRows,
        totalShiftReports,
        shiftReportsInRange,
        shiftReportsByStatusRows,
        shiftRevenueAll,
        shiftScansAll,
        totalTickets,
        ticketsInRange,
        ticketsByStatusRows,
        totalStops,
        scanLogsInRange,
        scanLogsValidInRange,
        postsSeries,
        routeReportsSeries,
        shiftReportsSeries,
        ticketsSeries,
        topRoutesByReports,
        shiftRevenueByPeriod,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ active: true }),
        User.countDocuments({ active: false }),
        User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
        Post.countDocuments(),
        Post.countDocuments({ createdAt: rangeMatch }),
        Route.countDocuments(),
        RouteReport.countDocuments(),
        RouteReport.countDocuments({ createdAt: rangeMatch }),
        RouteReport.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        RouteReport.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
        ShiftReport.countDocuments(),
        ShiftReport.countDocuments({ createdAt: rangeMatch }),
        ShiftReport.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        ShiftReport.aggregate([{ $group: { _id: null, total: { $sum: { $ifNull: ['$totalRevenue', 0] } } } }]),
        ShiftReport.aggregate([
            {
                $group: {
                    _id: null,
                    totalScans: { $sum: { $ifNull: ['$totalScans', 0] } },
                    successfulScans: { $sum: { $ifNull: ['$successfulScans', 0] } },
                    failedScans: { $sum: { $ifNull: ['$failedScans', 0] } },
                },
            },
        ]),
        Ticket.countDocuments(),
        Ticket.countDocuments({ createdAt: rangeMatch }),
        Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Stop.countDocuments(),
        ScanLog.countDocuments({ createdAt: rangeMatch }),
        ScanLog.countDocuments({ createdAt: rangeMatch, isValid: true }),
        seriesFromCreatedAt(Post),
        seriesFromCreatedAt(RouteReport),
        seriesFromCreatedAt(ShiftReport),
        seriesFromCreatedAt(Ticket),
        RouteReport.aggregate([
            { $group: { _id: '$routeId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: topRoutesLimit },
            {
                $lookup: {
                    from: ROUTE_COLLECTION,
                    localField: '_id',
                    foreignField: '_id',
                    as: 'route',
                },
            },
            { $unwind: { path: '$route', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    routeId: '$_id',
                    reportCount: '$count',
                    code: '$route.code',
                    name: '$route.name',
                },
            },
        ]),
        shiftRevenueSeries(),
    ]);

    return {
        meta: {
            generatedAt: now.toISOString(),
            range: {
                from: rangeFrom.toISOString(),
                to: rangeTo.toISOString(),
                granularity,
            },
        },
        totals: {
            users: totalUsers,
            posts: totalPosts,
            routes: totalRoutes,
            routeReports: totalRouteReports,
            shiftReports: totalShiftReports,
            tickets: totalTickets,
            stops: totalStops,
        },
        periodCounts: {
            posts: postsInRange,
            routeReports: routeReportsInRange,
            shiftReports: shiftReportsInRange,
            tickets: ticketsInRange,
            scanLogs: scanLogsInRange,
            scanLogsSuccessful: scanLogsValidInRange,
        },
        users: {
            active: usersActive,
            inactive: usersInactive,
            byRole: toKeyedCounts(usersByRoleRows),
        },
        routeReports: {
            byStatus: toKeyedCounts(routeReportsByStatusRows),
            byType: toKeyedCounts(routeReportsByTypeRows),
        },
        shiftReports: {
            byStatus: toKeyedCounts(shiftReportsByStatusRows),
            revenueTotalAllTime: shiftRevenueAll[0]?.total ?? 0,
            scansAllTime: {
                total: shiftScansAll[0]?.totalScans ?? 0,
                successful: shiftScansAll[0]?.successfulScans ?? 0,
                failed: shiftScansAll[0]?.failedScans ?? 0,
            },
        },
        tickets: {
            byStatus: toKeyedCounts(ticketsByStatusRows),
        },
        timeSeries: {
            postsByPeriod: postsSeries,
            routeReportsByPeriod: routeReportsSeries,
            shiftReportsByPeriod: shiftReportsSeries,
            ticketsByPeriod: ticketsSeries,
            shiftRevenueByPeriod,
        },
        topRoutesByReportCount: topRoutesByReports,
    };
}

module.exports = {
    getDashboardSummary,
};
