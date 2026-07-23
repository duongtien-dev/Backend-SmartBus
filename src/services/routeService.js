const Route = require('../models/Route');
const Ticket = require('../models/Ticket');
const Review = require('../models/Review');
const favoriteRouteService = require('./favoriteRouteService');

async function createRoute(userId, data) {
    const { ...routeData } = data;
    if (userId) routeData.userId = userId;
    const route = await Route.create(routeData);
    return route;
}

async function updateRoute(routeId, userId, data) {
    const route = await Route.findOne({ _id: routeId, userId });
    if (!route) throw new Error('Tuyến không tồn tại hoặc không có quyền sửa');

    const { userId: _uid, ...allowed } = data;
    Object.assign(route, allowed);

    await route.save();
    return route;
}

async function deleteRoute(routeId, userId) {
    const route = await Route.findOne({ _id: routeId, userId });
    if (!route) throw new Error('Tuyến không tồn tại hoặc không có quyền xóa');
    await Route.findByIdAndDelete(routeId);
    return route;
}

async function attachFavoriteFlag(routes, viewerId) {
    if (!viewerId || !routes.length) {
        return routes.map((route) => ({
            ...route,
            isFavorite: false,
        }));
    }

    const favoritedIds = await favoriteRouteService.getFavoritedRouteIdSet(
        viewerId,
        routes.map((route) => route._id)
    );

    return routes.map((route) => ({
        ...route,
        isFavorite: favoritedIds.has(String(route._id)),
    }));
}

async function listUnreviewedTraveledRoutes({
    travelerUserId,
    page = 1,
    limit = 10,
    search,
    sort = 'newest',
}) {
    const traveledRouteIds = await Ticket.distinct('routeId', {
        user: travelerUserId,
        status: 'used',
    });

    if (!traveledRouteIds.length) return [];

    const reviewedRouteIds = await Review.distinct('route', {
        user: travelerUserId,
    });
    const reviewedSet = new Set(reviewedRouteIds.map(String));
    const unreviewedIds = traveledRouteIds.filter(
        (id) => !reviewedSet.has(String(id))
    );

    if (!unreviewedIds.length) return [];

    const query = { _id: { $in: unreviewedIds } };
    if (search && search.trim()) {
        const s = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(s, 'i');
        query.$or = [
            { name: re },
            { code: re },
            { description: re },
            { startName: re },
            { endName: re },
        ];
    }

    const sortOpt = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    const routes = await Route.find(query)
        .sort(sortOpt)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'full_name email')
        .populate('staffId', 'full_name email')
        .lean();

    return attachFavoriteFlag(routes, travelerUserId);
}

async function listRoutes({
    page = 1,
    limit = 10,
    search,
    sort = 'newest',
    userId,
    viewerId,
    unreviewedOnly = false,
    travelerUserId,
}) {
    if (unreviewedOnly) {
        if (!travelerUserId) {
            throw new Error('Cần đăng nhập để xem tuyến chưa đánh giá');
        }
        return listUnreviewedTraveledRoutes({
            travelerUserId,
            page,
            limit,
            search,
            sort,
        });
    }

    const query = {};
    if (userId) query.userId = userId;
    if (search && search.trim()) {
        const s = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(s, 'i');
        query.$or = [
            { name: re },
            { code: re },
            { description: re },
            { startName: re },
            { endName: re },
        ];
    }
    const sortOpt = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    const routes = await Route.find(query)
        .sort(sortOpt)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'full_name email')
        .populate('staffId', 'full_name email')
        .lean();

    return attachFavoriteFlag(routes, viewerId);
}

async function getRouteById(routeId, viewerId) {
    const route = await Route.findById(routeId)
        .populate('userId', 'full_name email')
        .populate('staffId', 'full_name email')
        .lean();
    if (!route) throw new Error('Tuyến không tồn tại');

    const [withFavorite] = await attachFavoriteFlag([route], viewerId);
    return withFavorite;
}

module.exports = {
    createRoute,
    updateRoute,
    deleteRoute,
    listRoutes,
    getRouteById,
};
