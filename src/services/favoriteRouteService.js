const FavoriteRoute = require('../models/FavoriteRoute');
const Route = require('../models/Route');

async function addFavorite(userId, routeId) {
    const route = await Route.findById(routeId).lean();
    if (!route) throw new Error('Tuyến không tồn tại');

    const existing = await FavoriteRoute.findOne({ userId, routeId }).lean();
    if (existing) {
        return { favorite: existing, created: false };
    }

    const favorite = await FavoriteRoute.create({ userId, routeId });
    return { favorite, created: true };
}

async function removeFavorite(userId, routeId) {
    const deleted = await FavoriteRoute.findOneAndDelete({ userId, routeId });
    if (!deleted) throw new Error('Tuyến chưa được yêu thích');
    return true;
}

async function getFavoritedRouteIdSet(userId, routeIds = []) {
    if (!userId || !routeIds.length) return new Set();

    const favorites = await FavoriteRoute.find({
        userId,
        routeId: { $in: routeIds },
    })
        .select('routeId')
        .lean();

    return new Set(favorites.map((item) => String(item.routeId)));
}

async function listFavoriteRoutes({
    userId,
    page = 1,
    limit = 10,
    search,
    sort = 'newest',
}) {
    const favorites = await FavoriteRoute.find({ userId })
        .select('routeId createdAt')
        .lean();

    if (!favorites.length) return [];

    const favoriteCreatedAtMap = new Map(
        favorites.map((item) => [String(item.routeId), item.createdAt])
    );
    const routeIds = favorites.map((item) => item.routeId);

    const query = { _id: { $in: routeIds } };
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

    const routes = await Route.find(query)
        .populate('userId', 'full_name email')
        .populate('staffId', 'full_name email')
        .lean();

    const direction = sort === 'oldest' ? 1 : -1;
    routes.sort((a, b) => {
        const aTime = new Date(
            favoriteCreatedAtMap.get(String(a._id)) || 0
        ).getTime();
        const bTime = new Date(
            favoriteCreatedAtMap.get(String(b._id)) || 0
        ).getTime();
        return (aTime - bTime) * direction;
    });

    const skip = (page - 1) * limit;
    return routes.slice(skip, skip + limit).map((route) => ({
        ...route,
        isFavorite: true,
    }));
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavoritedRouteIdSet,
    listFavoriteRoutes,
};
