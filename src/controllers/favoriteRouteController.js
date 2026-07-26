const favoriteRouteService = require('../services/favoriteRouteService');

async function addFavorite(req, res) {
    try {
        const { routeId } = req.body;
        const result = await favoriteRouteService.addFavorite(
            req.user._id,
            routeId
        );
        res.status(result.created ? 201 : 200).json({
            success: true,
            message: result.created
                ? 'Đã thêm tuyến vào yêu thích'
                : 'Tuyến đã nằm trong yêu thích',
            data: {
                routeId,
                isFavorite: true,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function removeFavorite(req, res) {
    try {
        const { routeId } = req.body;
        await favoriteRouteService.removeFavorite(req.user._id, routeId);
        res.json({
            success: true,
            message: 'Đã bỏ yêu thích tuyến',
            data: {
                routeId,
                isFavorite: false,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function listFavorites(req, res) {
    try {
        const { page, limit, search, sort } = req.body;
        const result = await favoriteRouteService.listFavoriteRoutes({
            userId: req.user._id,
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search,
            sort: sort || 'newest',
        });
        res.json({ success: true, message: 'Lấy danh sách tuyến yêu thích thành công', data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    listFavorites,
};
